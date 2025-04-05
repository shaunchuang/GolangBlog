package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// 資料庫連接配置
type DBConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// 初始化資料庫連接
func InitDB() *gorm.DB {
	dbConfig := DBConfig{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnvAsInt("DB_PORT", 5432),
		User:     getEnv("DB_USER", "postgres"),
		Password: getEnv("DB_PASSWORD", "postgres"),
		DBName:   getEnv("DB_NAME", "golangblog"),
		SSLMode:  getEnv("DB_SSLMODE", "disable"),
	}

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		dbConfig.Host, dbConfig.Port, dbConfig.User, dbConfig.Password, dbConfig.DBName, dbConfig.SSLMode)

	// 設定 GORM logger 選項
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second, // 慢查詢閾值
			LogLevel:                  logger.Info, // 日誌級別
			IgnoreRecordNotFoundError: true,        // 忽略 ErrRecordNotFound 錯誤
			Colorful:                  true,        // 啟用彩色列印
		},
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})

	if err != nil {
		log.Fatalf("連接資料庫失敗: %v", err)
	}

	log.Println("成功連接到 PostgreSQL 資料庫")

	// 設定連接池
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("取得 sql.DB 物件失敗: %v", err)
	}

	// 最大空閒連接數
	sqlDB.SetMaxIdleConns(10)
	// 最大開啟連接數
	sqlDB.SetMaxOpenConns(100)
	// 連接最大生命週期
	sqlDB.SetConnMaxLifetime(time.Hour)

	DB = db
	return db
}

// 從環境變數獲取字串，如果不存在則使用預設值
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// 從環境變數獲取整數，如果不存在或轉換失敗則使用預設值
func getEnvAsInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}
