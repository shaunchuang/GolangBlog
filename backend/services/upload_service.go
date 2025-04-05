package services

import (
	"GolangBlog/models"
	"context"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

// 上傳策略
const (
	LocalStorage = "local" // 本地存儲
	S3Storage    = "s3"    // AWS S3 存儲
)

// 上傳配置
type UploadConfig struct {
	Strategy      string // 上傳策略: "local" 或 "s3"
	LocalBasePath string // 本地存儲基礎路徑
	S3BucketName  string // S3 存儲桶名稱
	S3Region      string // S3 區域
	S3Endpoint    string // S3 終端節點（可選，用於非 AWS S3 服務）
	MaxFileSize   int64  // 檔案大小上限（字節）
}

// 文件上傳服務
type UploadService struct {
	config   UploadConfig
	s3Client *s3.Client
}

// 新建上傳服務
func NewUploadService(config UploadConfig) (*UploadService, error) {
	service := &UploadService{
		config: config,
	}

	// 初始化 S3 客戶端
	if config.Strategy == S3Storage {
		var err error
		if service.s3Client, err = initS3Client(config.S3Region, config.S3Endpoint); err != nil {
			return nil, err
		}
	}

	// 確保本地存儲目錄存在
	if config.Strategy == LocalStorage && config.LocalBasePath != "" {
		if err := os.MkdirAll(config.LocalBasePath, 0755); err != nil {
			return nil, fmt.Errorf("創建上傳目錄失敗: %w", err)
		}
	}

	return service, nil
}

// 初始化 S3 客戶端
func initS3Client(region, endpoint string) (*s3.Client, error) {
	ctx := context.Background()
	var opts []func(*config.LoadOptions) error

	// 設置 AWS 區域
	opts = append(opts, config.WithRegion(region))

	// 如果有自定義終端節點（比如 MinIO）
	if endpoint != "" {
		customResolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
			return aws.Endpoint{
				URL: endpoint,
				// 以下參數對於 MinIO 等相容 S3 的服務可能需要設為 true
				HostnameImmutable: true,
				PartitionID:       "aws",
				SigningRegion:     region,
			}, nil
		})
		opts = append(opts, config.WithEndpointResolverWithOptions(customResolver))
	}

	// 載入 AWS 配置
	cfg, err := config.LoadDefaultConfig(ctx, opts...)
	if err != nil {
		return nil, fmt.Errorf("載入 AWS 配置失敗: %w", err)
	}

	// 創建 S3 客戶端
	return s3.NewFromConfig(cfg), nil
}

// 處理檔案上傳
func (s *UploadService) UploadFile(file *multipart.FileHeader, userID uint, usage string) (*models.Image, error) {
	// 檢查檔案大小
	if s.config.MaxFileSize > 0 && file.Size > s.config.MaxFileSize {
		return nil, fmt.Errorf("檔案大小超過限制: %d bytes", s.config.MaxFileSize)
	}

	// 獲取檔案擴展名
	originalFilename := file.Filename
	ext := strings.ToLower(filepath.Ext(originalFilename))

	// 驗證檔案擴展名
	if !isValidImageExt(ext) {
		return nil, errors.New("不支援的圖片格式")
	}

	// 生成唯一檔案名
	fileName := generateUniqueFileName(ext)

	// 開啟上傳的檔案
	src, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("開啟上傳檔案失敗: %w", err)
	}
	defer src.Close()

	// 根據策略選擇上傳方式
	var filePath string
	var fileURL string

	if s.config.Strategy == LocalStorage {
		filePath, err = s.uploadToLocalStorage(src, fileName)
		if err != nil {
			return nil, err
		}
		fileURL = filePath // 對於本地存儲，URL 即為檔案路徑
	} else if s.config.Strategy == S3Storage {
		fileURL, err = s.uploadToS3(src, fileName, file.Header.Get("Content-Type"))
		if err != nil {
			return nil, err
		}
		filePath = fileURL
	} else {
		return nil, errors.New("不支援的上傳策略")
	}

	// 創建圖片記錄
	image := &models.Image{
		UserID:      userID,
		FileName:    fileName,
		FilePath:    filePath,
		FileSize:    file.Size,
		ContentType: file.Header.Get("Content-Type"),
		Usage:       usage,
		// 注意：寬度和高度需要額外處理，這裡暫不實現
		// 可以使用 github.com/nfnt/resize 等庫來處理圖片尺寸
	}

	return image, nil
}

// 上傳到本地存儲
func (s *UploadService) uploadToLocalStorage(src multipart.File, fileName string) (string, error) {
	// 根據時間生成子目錄，避免單一目錄檔案過多
	now := time.Now()
	subDir := fmt.Sprintf("%d/%02d/%02d", now.Year(), now.Month(), now.Day())
	uploadPath := filepath.Join(s.config.LocalBasePath, subDir)

	// 確保上傳目錄存在
	if err := os.MkdirAll(uploadPath, 0755); err != nil {
		return "", fmt.Errorf("創建上傳目錄失敗: %w", err)
	}

	// 完整檔案路徑
	fullPath := filepath.Join(uploadPath, fileName)

	// 創建目標檔案
	dst, err := os.Create(fullPath)
	if err != nil {
		return "", fmt.Errorf("創建目標檔案失敗: %w", err)
	}
	defer dst.Close()

	// 複製檔案內容
	if _, err = io.Copy(dst, src); err != nil {
		return "", fmt.Errorf("儲存檔案失敗: %w", err)
	}

	// 返回相對路徑
	return filepath.Join(subDir, fileName), nil
}

// 上傳到 S3
func (s *UploadService) uploadToS3(src multipart.File, fileName string, contentType string) (string, error) {
	// 根據時間生成 S3 路徑前綴
	now := time.Now()
	keyPrefix := fmt.Sprintf("uploads/%d/%02d/%02d/", now.Year(), now.Month(), now.Day())
	key := keyPrefix + fileName

	// 使用 S3 上傳管理器
	uploader := manager.NewUploader(s.s3Client)

	// 設置 S3 上傳參數
	uploadInput := &s3.PutObjectInput{
		Bucket:      aws.String(s.config.S3BucketName),
		Key:         aws.String(key),
		Body:        src,
		ContentType: aws.String(contentType),
	}

	// 執行上傳
	_, err := uploader.Upload(context.Background(), uploadInput)
	if err != nil {
		return "", fmt.Errorf("上傳到 S3 失敗: %w", err)
	}

	// 構建檔案 URL
	var fileURL string
	if s.config.S3Endpoint != "" {
		// 自定義 S3 端點的 URL 構建
		fileURL = fmt.Sprintf("%s/%s/%s",
			strings.TrimRight(s.config.S3Endpoint, "/"),
			s.config.S3BucketName,
			key)
	} else {
		// AWS S3 標準 URL 構建
		fileURL = fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s",
			s.config.S3BucketName,
			s.config.S3Region,
			key)
	}

	return fileURL, nil
}

// 檢查是否為有效的圖片擴展名
func isValidImageExt(ext string) bool {
	validExtensions := []string{".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
	for _, validExt := range validExtensions {
		if ext == validExt {
			return true
		}
	}
	return false
}

// 生成唯一檔案名
func generateUniqueFileName(ext string) string {
	// 使用 UUID 確保檔案名唯一
	return fmt.Sprintf("%s%s", uuid.New().String(), ext)
}
