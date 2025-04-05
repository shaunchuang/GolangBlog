package controllers

import (
	"GolangBlog/config"
	"GolangBlog/models"
	"GolangBlog/services"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// 初始化上傳服務
var uploadService *services.UploadService

func init() {
	// 讀取環境變數或使用默認值
	strategy := os.Getenv("UPLOAD_STRATEGY")
	if strategy == "" {
		strategy = services.LocalStorage
	}

	maxSize, _ := strconv.ParseInt(os.Getenv("UPLOAD_MAX_SIZE"), 10, 64)
	if maxSize == 0 {
		maxSize = 10 * 1024 * 1024 // 預設 10MB
	}

	config := services.UploadConfig{
		Strategy:      strategy,
		LocalBasePath: os.Getenv("UPLOAD_LOCAL_PATH"),
		S3BucketName:  os.Getenv("UPLOAD_S3_BUCKET"),
		S3Region:      os.Getenv("UPLOAD_S3_REGION"),
		S3Endpoint:    os.Getenv("UPLOAD_S3_ENDPOINT"),
		MaxFileSize:   maxSize,
	}

	// 如果未設置本地路徑，使用默認值
	if config.LocalBasePath == "" {
		dir, _ := os.Getwd()
		config.LocalBasePath = filepath.Join(dir, "uploads")
	}

	// 創建上傳服務
	var err error
	uploadService, err = services.NewUploadService(config)
	if err != nil {
		// 理想情況下應該中斷應用啟動，但這裡只記錄錯誤
		// 實際使用時可以使用 log.Fatal(err)
		panic("初始化上傳服務失敗: " + err.Error())
	}
}

// 上傳圖片
func UploadImage(c *gin.Context) {
	// 獲取用戶ID
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未認證的用戶"})
		return
	}

	// 獲取用途參數
	usage := c.DefaultPostForm("usage", "article")

	// 獲取標題和替代文字
	title := c.PostForm("title")
	alt := c.PostForm("alt")

	// 獲取上傳的檔案
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "獲取上傳檔案失敗"})
		return
	}

	// 使用上傳服務處理檔案
	image, err := uploadService.UploadFile(file, userID.(uint), usage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "上傳圖片失敗: " + err.Error()})
		return
	}

	// 設置標題和替代文字
	image.Title = title
	image.Alt = alt

	// 儲存圖片資訊到資料庫
	if err := config.DB.Create(image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "儲存圖片資訊失敗"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "圖片上傳成功",
		"image":   image,
	})
}

// 獲取圖片列表
func GetImages(c *gin.Context) {
	var images []models.Image

	// 查詢參數處理
	query := config.DB.Model(&models.Image{})

	// 用途篩選
	usage := c.Query("usage")
	if usage != "" {
		query = query.Where("usage = ?", usage)
	}

	// 用戶篩選
	userID := c.Query("user_id")
	if userID != "" {
		query = query.Where("user_id = ?", userID)
	}

	// 排序
	orderBy := c.DefaultQuery("order_by", "created_at")
	orderDir := c.DefaultQuery("order_dir", "desc")
	query = query.Order(orderBy + " " + orderDir)

	// 預載用戶資訊
	query = query.Preload("User")

	// 分頁
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	offset := (page - 1) * pageSize

	var total int64
	query.Count(&total)

	query.Limit(pageSize).Offset(offset).Find(&images)

	c.JSON(http.StatusOK, gin.H{
		"images": images,
		"pagination": gin.H{
			"total":      total,
			"page":       page,
			"page_size":  pageSize,
			"total_page": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// 獲取單個圖片
func GetImage(c *gin.Context) {
	id := c.Param("id")
	var image models.Image

	if err := config.DB.Preload("User").First(&image, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "圖片不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"image": image})
}

// 更新圖片資訊
func UpdateImage(c *gin.Context) {
	id := c.Param("id")
	var image models.Image

	// 確認圖片存在
	if err := config.DB.First(&image, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "圖片不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 檢查權限：只有圖片上傳者或管理員可以更新
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")
	if image.UserID != userID.(uint) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "無權更新此圖片"})
		return
	}

	// 獲取更新資訊
	type UpdateRequest struct {
		Title string `json:"title"`
		Alt   string `json:"alt"`
		Usage string `json:"usage"`
	}

	var req UpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 更新圖片資訊
	updates := map[string]interface{}{
		"title": req.Title,
		"alt":   req.Alt,
	}

	// 如果提供了用途，也進行更新
	if req.Usage != "" {
		updates["usage"] = req.Usage
	}

	if err := config.DB.Model(&image).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新圖片資訊失敗"})
		return
	}

	// 重新獲取更新後的圖片資訊
	if err := config.DB.Preload("User").First(&image, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "獲取更新後的圖片資訊失敗"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "圖片資訊更新成功",
		"image":   image,
	})
}

// 刪除圖片
func DeleteImage(c *gin.Context) {
	id := c.Param("id")
	var image models.Image

	// 確認圖片存在
	if err := config.DB.First(&image, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "圖片不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 檢查權限：只有圖片上傳者或管理員可以刪除
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")
	if image.UserID != userID.(uint) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "無權刪除此圖片"})
		return
	}

	// 刪除圖片記錄
	if err := config.DB.Delete(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除圖片記錄失敗"})
		return
	}

	// 注意：這裡實際上並未從儲存系統中刪除文件
	// 對於完整的實現，應該額外添加刪除實際檔案的邏輯

	c.JSON(http.StatusOK, gin.H{
		"message": "圖片刪除成功",
	})
}
