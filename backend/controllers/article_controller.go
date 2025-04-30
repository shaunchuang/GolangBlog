package controllers

import (
	"GolangBlog/config"
	"GolangBlog/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gosimple/slug"
	"gorm.io/gorm"
)

// 文章請求結構
type ArticleRequest struct {
	Status        string                      `json:"status"`
	FeaturedImage string                      `json:"featured_image"`
	Translations  []ArticleTranslationRequest `json:"translations"`
	TagIDs        []uint                      `json:"tag_ids"`
	CategoryIDs   []uint                      `json:"category_ids"`
}

// 文章翻譯請求結構
type ArticleTranslationRequest struct {
	LanguageCode    string `json:"language_code" binding:"required"`
	Title           string `json:"title" binding:"required"`
	Slug            string `json:"slug"`
	Excerpt         string `json:"excerpt"`
	Content         string `json:"content" binding:"required"`
	MetaTitle       string `json:"meta_title"`
	MetaDescription string `json:"meta_description"`
	MetaKeywords    string `json:"meta_keywords"`
}

// 獲取文章列表
func GetArticles(c *gin.Context) {
	var articles []models.Article

	// 查詢參數處理
	query := config.DB.Model(&models.Article{})

	// 狀態篩選
	status := c.Query("status")
	if status != "" {
		query = query.Where("status = ?", status)
	}

	// 語言篩選
	langCode := c.Query("lang")
	if langCode != "" {
		query = query.Joins("JOIN article_translations ON articles.id = article_translations.article_id").
			Where("article_translations.language_code = ?", langCode)
	}

	// 標籤篩選
	tagID := c.Query("tag_id")
	if tagID != "" {
		query = query.Joins("JOIN article_tags ON articles.id = article_tags.article_id").
			Where("article_tags.tag_id = ?", tagID)
	}

	// 分類篩選
	categoryID := c.Query("category_id")
	if categoryID != "" {
		query = query.Joins("JOIN article_categories ON articles.id = article_categories.article_id").
			Where("article_categories.category_id = ?", categoryID)
	}

	// 預載相關數據
	query = query.Preload("Translations", func(db *gorm.DB) *gorm.DB {
		// 如果指定了語言，只載入該語言的翻譯
		if langCode != "" {
			return db.Where("language_code = ?", langCode)
		}
		return db
	}).Preload("Tags").Preload("User")

	// 排序
	orderBy := c.DefaultQuery("order_by", "created_at")
	orderDir := c.DefaultQuery("order_dir", "desc")
	query = query.Order(orderBy + " " + orderDir)

	// 分頁
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	offset := (page - 1) * pageSize

	var total int64
	query.Count(&total)

	query.Limit(pageSize).Offset(offset).Find(&articles)

	c.JSON(http.StatusOK, gin.H{
		"articles": articles,
		"pagination": gin.H{
			"total":      total,
			"page":       page,
			"page_size":  pageSize,
			"total_page": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// 獲取單篇文章
func GetArticle(c *gin.Context) {
	id := c.Param("id")
	var article models.Article

	// 預載所有相關數據
	if err := config.DB.Preload("Translations").
		Preload("Tags.Translations").
		Preload("User").
		First(&article, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"article": article})
}

// 創建新文章
func CreateArticle(c *gin.Context) {
	var req ArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 取得當前使用者ID
	userID, _ := c.Get("userID")

	article := models.Article{
		UserID:        userID.(uint),
		Status:        req.Status,
		FeaturedImage: req.FeaturedImage,
	}

	// 如果狀態為已發布，設置發布時間
	if req.Status == "published" {
		now := time.Now()
		article.PublishedAt = &now
	}

	// 啟動事務
	tx := config.DB.Begin()

	// 創建文章
	if err := tx.Create(&article).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "創建文章失敗"})
		return
	}

	// 處理翻譯
	for _, trans := range req.Translations {
		// 如果沒有提供 slug，則自動生成
		if trans.Slug == "" {
			trans.Slug = slug.Make(trans.Title)
		}

		translation := models.ArticleTranslation{
			ArticleID:       article.ID,
			LanguageCode:    trans.LanguageCode,
			Title:           trans.Title,
			Slug:            trans.Slug,
			Excerpt:         trans.Excerpt,
			Content:         trans.Content,
			MetaTitle:       trans.MetaTitle,
			MetaDescription: trans.MetaDescription,
			MetaKeywords:    trans.MetaKeywords,
		}

		if err := tx.Create(&translation).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "創建文章翻譯失敗"})
			return
		}
	}

	// 處理標籤關聯
	if len(req.TagIDs) > 0 {
		for _, tagID := range req.TagIDs {
			if err := tx.Exec("INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)", article.ID, tagID).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "關聯標籤失敗"})
				return
			}
		}
	}

	// 處理分類關聯
	if len(req.CategoryIDs) > 0 {
		for _, catID := range req.CategoryIDs {
			if err := tx.Exec("INSERT INTO article_categories (article_id, category_id) VALUES (?, ?)", article.ID, catID).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "關聯分類失敗"})
				return
			}
		}
	}

	// 提交事務
	tx.Commit()

	// 獲取完整的文章數據回傳
	var fullArticle models.Article
	config.DB.Preload("Translations").Preload("Tags").Preload("User").First(&fullArticle, article.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "文章創建成功",
		"article": fullArticle,
	})
}

// 更新文章
func UpdateArticle(c *gin.Context) {
	id := c.Param("id")
	var article models.Article

	// 確認文章存在
	if err := config.DB.First(&article, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	var req ArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 啟動事務
	tx := config.DB.Begin()

	// 更新文章基本資訊
	prevStatus := article.Status
	article.Status = req.Status
	article.FeaturedImage = req.FeaturedImage

	// 如果狀態從非發布改為發布，設置發布時間
	if prevStatus != "published" && req.Status == "published" {
		now := time.Now()
		article.PublishedAt = &now
	}

	if err := tx.Save(&article).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新文章失敗"})
		return
	}

	// 處理翻譯
	for _, trans := range req.Translations {
		// 如果沒有提供 slug，則自動生成
		if trans.Slug == "" {
			trans.Slug = slug.Make(trans.Title)
		}

		var translation models.ArticleTranslation
		// 檢查該語言的翻譯是否已存在
		result := tx.Where("article_id = ? AND language_code = ?", article.ID, trans.LanguageCode).First(&translation)

		if result.Error != nil {
			// 不存在，創建新翻譯
			if result.Error == gorm.ErrRecordNotFound {
				translation = models.ArticleTranslation{
					ArticleID:       article.ID,
					LanguageCode:    trans.LanguageCode,
					Title:           trans.Title,
					Slug:            trans.Slug,
					Excerpt:         trans.Excerpt,
					Content:         trans.Content,
					MetaTitle:       trans.MetaTitle,
					MetaDescription: trans.MetaDescription,
					MetaKeywords:    trans.MetaKeywords,
				}

				if err := tx.Create(&translation).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "創建文章翻譯失敗"})
					return
				}
			} else {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
				return
			}
		} else {
			// 更新已存在的翻譯
			translation.Title = trans.Title
			translation.Slug = trans.Slug
			translation.Excerpt = trans.Excerpt
			translation.Content = trans.Content
			translation.MetaTitle = trans.MetaTitle
			translation.MetaDescription = trans.MetaDescription
			translation.MetaKeywords = trans.MetaKeywords

			if err := tx.Save(&translation).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "更新文章翻譯失敗"})
				return
			}
		}
	}

	// 處理標籤關聯
	if err := tx.Exec("DELETE FROM article_tags WHERE article_id = ?", article.ID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除舊標籤關聯失敗"})
		return
	}

	if len(req.TagIDs) > 0 {
		for _, tagID := range req.TagIDs {
			if err := tx.Exec("INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)", article.ID, tagID).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "關聯標籤失敗"})
				return
			}
		}
	}

	// 處理分類關聯
	if err := tx.Exec("DELETE FROM article_categories WHERE article_id = ?", article.ID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除舊分類關聯失敗"})
		return
	}

	if len(req.CategoryIDs) > 0 {
		for _, catID := range req.CategoryIDs {
			if err := tx.Exec("INSERT INTO article_categories (article_id, category_id) VALUES (?, ?)", article.ID, catID).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "關聯分類失敗"})
				return
			}
		}
	}

	// 提交事務
	tx.Commit()

	// 獲取完整的文章數據回傳
	var fullArticle models.Article
	config.DB.Preload("Translations").Preload("Tags").Preload("User").First(&fullArticle, article.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "文章更新成功",
		"article": fullArticle,
	})
}

// 刪除文章
func DeleteArticle(c *gin.Context) {
	id := c.Param("id")
	var article models.Article

	// 確認文章存在
	if err := config.DB.First(&article, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 啟動事務
	tx := config.DB.Begin()

	// 刪除所有相關數據
	// 刪除標籤關聯
	if err := tx.Exec("DELETE FROM article_tags WHERE article_id = ?", id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除標籤關聯失敗"})
		return
	}

	// 刪除分類關聯
	if err := tx.Exec("DELETE FROM article_categories WHERE article_id = ?", id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除分類關聯失敗"})
		return
	}

	// 刪除翻譯
	if err := tx.Where("article_id = ?", id).Delete(&models.ArticleTranslation{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除文章翻譯失敗"})
		return
	}

	// 刪除文章本身
	if err := tx.Delete(&article).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除文章失敗"})
		return
	}

	// 提交事務
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message": "文章刪除成功",
	})
}

// 根據 Slug 獲取文章 (前台使用)
func GetArticleBySlug(c *gin.Context) {
	slug := c.Param("slug")
	langCode := c.DefaultQuery("lang", "zh-TW") // 預設語言

	var articleTranslation models.ArticleTranslation
	if err := config.DB.Where("slug = ? AND language_code = ?", slug, langCode).First(&articleTranslation).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	var article models.Article
	if err := config.DB.Preload("Translations", func(db *gorm.DB) *gorm.DB {
		return db.Where("language_code = ?", langCode)
	}).Preload("Tags.Translations", func(db *gorm.DB) *gorm.DB {
		return db.Where("language_code = ?", langCode)
	}).Preload("User").First(&article, articleTranslation.ArticleID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 檢查文章是否已發布
	if article.Status != "published" {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在或未發布"})
		return
	}

	// 增加瀏覽次數
	article.ViewCount++
	config.DB.Save(&article)

	c.JSON(http.StatusOK, gin.H{"article": article})
}

// 生成 Slug 的 API
func GenerateSlug(c *gin.Context) {
	type SlugRequest struct {
		Title string `json:"title" binding:"required"`
	}

	var req SlugRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	generatedSlug := slug.Make(req.Title)

	c.JSON(http.StatusOK, gin.H{
		"slug": generatedSlug,
	})
}

// 獲取精選文章
func GetFeaturedArticles(c *gin.Context) {
	var articles []models.Article
	limit := 5 // 默認返回5篇精選文章

	// 從查詢參數獲取需要的數量
	limitParam := c.Query("limit")
	if limitParam != "" {
		parsedLimit, err := strconv.Atoi(limitParam)
		if err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	// 獲取語言參數
	langCode := c.DefaultQuery("lang", "zh-TW")

	// 查詢條件：status = 'published' 且 is_featured = true
	query := config.DB.Model(&models.Article{}).
		Where("status = ? AND is_featured = ?", "published", true)

	// 關聯翻譯表並按指定語言篩選
	query = query.Preload("Translations", func(db *gorm.DB) *gorm.DB {
		return db.Where("language_code = ?", langCode)
	}).Preload("Tags.Translations", func(db *gorm.DB) *gorm.DB {
		return db.Where("language_code = ?", langCode)
	}).Preload("User")

	// 按發布時間降序排列
	query = query.Order("published_at DESC")

	// 限制返回數量
	query = query.Limit(limit)

	// 執行查詢
	if err := query.Find(&articles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"articles": articles,
	})
}

// 獲取最新文章
func GetLatestArticles(c *gin.Context) {
	var articles []models.Article
	limit := 3 // 默認返回3篇最新文章

	// 從查詢參數獲取需要的數量
	limitParam := c.Query("limit")
	if limitParam != "" {
		parsedLimit, err := strconv.Atoi(limitParam)
		if err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	// 獲取語言參數
	langCode := c.DefaultQuery("lang", "zh-TW")

	// 查詢條件：status = 'published'
	query := config.DB.Model(&models.Article{}).
		Where("status = ?", "published")

	// 關聯翻譯表並按指定語言篩選
	query = query.Preload("Translations", func(db *gorm.DB) *gorm.DB {
		return db.Where("language_code = ?", langCode)
	}).Preload("Tags.Translations", func(db *gorm.DB) *gorm.DB {
		return db.Where("language_code = ?", langCode)
	}).Preload("User")

	// 按發布時間降序排列
	query = query.Order("published_at DESC")

	// 限制返回數量
	query = query.Limit(limit)

	// 執行查詢
	if err := query.Find(&articles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"articles": articles,
	})
}

// 根據分類獲取文章
func GetArticlesByCategory(c *gin.Context) {
	var articles []models.Article
	category := c.Param("category")
	limit := 2 // 默認返回2篇分類文章

	// 從查詢參數獲取需要的數量
	limitParam := c.Query("limit")
	if limitParam != "" {
		parsedLimit, err := strconv.Atoi(limitParam)
		if err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	// 獲取語言參數
	langCode := c.DefaultQuery("lang", "zh-TW")

	// 查詢條件：使用 category_translations 表並篩選 slug 和語言
	query := config.DB.Model(&models.Article{}).
		Joins("JOIN article_categories ON articles.id = article_categories.article_id").
		Joins("JOIN category_translations ON article_categories.category_id = category_translations.category_id AND category_translations.language_code = ?", langCode).
		Where("category_translations.slug = ? AND articles.status = ?", category, "published")

	// 關聯翻譯表並按指定語言篩選
	query = query.Preload("Translations", func(db *gorm.DB) *gorm.DB {
		return db.Where("language_code = ?", langCode)
	}).Preload("Tags.Translations", func(db *gorm.DB) *gorm.DB {
		return db.Where("language_code = ?", langCode)
	}).Preload("User")

	// 按發布時間降序排列
	query = query.Order("articles.published_at DESC")

	// 限制返回數量
	query = query.Limit(limit)

	// 執行查詢
	if err := query.Find(&articles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"articles": articles,
	})
}
