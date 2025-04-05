package routes

import (
	"GolangBlog/controllers"
	"GolangBlog/middlewares"

	"github.com/gin-gonic/gin"
)

// 設置API路由
func SetupRoutes(router *gin.Engine) {
	// API 版本 v1
	api := router.Group("/api/v1")

	// 公開API路由
	public := api.Group("/")
	{
		// 認證相關
		auth := public.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		// 公開文章API
		articles := public.Group("/articles")
		{
			articles.GET("", controllers.GetArticles)
			articles.GET("/:id", controllers.GetArticle)
			articles.GET("/slug/:slug", controllers.GetArticleBySlug)
		}

		// 公開標籤API
		tags := public.Group("/tags")
		{
			tags.GET("", controllers.GetTags)
			tags.GET("/:id", controllers.GetTag)
		}

		// 公開分類API
		categories := public.Group("/categories")
		{
			categories.GET("", controllers.GetCategories)
			categories.GET("/:id", controllers.GetCategory)
		}

		// 公開語言API
		languages := public.Group("/languages")
		{
			languages.GET("", controllers.GetLanguages)
			languages.GET("/:id", controllers.GetLanguage)
			languages.GET("/code/:code", controllers.GetLanguageByCode)
		}

		// 公開圖片API
		images := public.Group("/images")
		{
			images.GET("", controllers.GetImages)
			images.GET("/:id", controllers.GetImage)
		}

		// 設置靜態檔案服務 (如果使用本地儲存)
		router.Static("/uploads", "./uploads")
	}

	// 需要認證的API路由
	authenticated := api.Group("/")
	authenticated.Use(middlewares.JWTAuth())
	{
		// 獲取當前使用者資訊
		authenticated.GET("/user", controllers.GetCurrentUser)

		// 通用工具
		utils := authenticated.Group("/utils")
		{
			utils.POST("/generate-slug", controllers.GenerateSlug)
		}

		// 需要登入的圖片操作
		images := authenticated.Group("/images")
		{
			images.POST("", controllers.UploadImage)
			images.PUT("/:id", controllers.UpdateImage)
			images.DELETE("/:id", controllers.DeleteImage)
		}
	}

	// 編輯者或管理員可訪問的路由
	editor := api.Group("/")
	editor.Use(middlewares.JWTAuth(), middlewares.EditorOrAdminOnly())
	{
		// 文章管理
		editorArticles := editor.Group("/admin/articles")
		{
			editorArticles.POST("", controllers.CreateArticle)
			editorArticles.PUT("/:id", controllers.UpdateArticle)
			editorArticles.DELETE("/:id", controllers.DeleteArticle)
		}

		// 標籤管理
		editorTags := editor.Group("/admin/tags")
		{
			editorTags.POST("", controllers.CreateTag)
			editorTags.PUT("/:id", controllers.UpdateTag)
			editorTags.DELETE("/:id", controllers.DeleteTag)
		}

		// 分類管理
		editorCategories := editor.Group("/admin/categories")
		{
			editorCategories.POST("", controllers.CreateCategory)
			editorCategories.PUT("/:id", controllers.UpdateCategory)
			editorCategories.DELETE("/:id", controllers.DeleteCategory)
		}
	}

	// 管理員專屬路由
	admin := api.Group("/admin")
	admin.Use(middlewares.JWTAuth(), middlewares.AdminOnly())
	{
		// 語言管理
		adminLanguages := admin.Group("/languages")
		{
			adminLanguages.POST("", controllers.CreateLanguage)
			adminLanguages.PUT("/:id", controllers.UpdateLanguage)
			adminLanguages.DELETE("/:id", controllers.DeleteLanguage)
			adminLanguages.PUT("/:id/default", controllers.SetDefaultLanguage)
			adminLanguages.PUT("/:id/toggle", controllers.ToggleLanguageStatus)
			adminLanguages.PUT("/order", controllers.UpdateLanguageOrder)
		}

		// 將來可以添加其他管理員專屬功能，如用戶管理、系統設置等
	}
}
