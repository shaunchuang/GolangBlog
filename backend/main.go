package main

import (
	"GolangBlog/config"
	"GolangBlog/models"
	"GolangBlog/routes"
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 載入環境變數
	if err := godotenv.Load(); err != nil {
		log.Println("警告: .env 文件不存在，將使用環境變數")
	}

	// 設定 Gin 模式
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 初始化資料庫連接
	db := config.InitDB()

	// 遷移資料庫結構
	if err := models.AutoMigrate(db); err != nil {
		log.Fatalf("資料庫遷移失敗: %v", err)
	}

	// 創建 Gin 路由器
	r := gin.Default()

	// 設定 CORS 中間件
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"}, // 允許前端的來源
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false, // 修改為 false，因為我們使用 JWT 而不是 cookies
	}))

	// 健康檢查路由
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "GolangBlog API 服務運行正常",
		})
	})

	// 設定 API 路由
	routes.SetupRoutes(r)

	// 取得伺服器埠號
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // 預設埠號
	}

	// 啟動伺服器
	serverAddr := fmt.Sprintf(":%s", port)
	log.Printf("伺服器啟動於 http://localhost%s", serverAddr)
	if err := r.Run(serverAddr); err != nil {
		log.Fatalf("啟動伺服器失敗: %v", err)
	}
}
