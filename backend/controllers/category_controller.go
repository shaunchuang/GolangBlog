package controllers

import (
	"GolangBlog/config"
	"GolangBlog/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gosimple/slug"
	"gorm.io/gorm"
)

// 分類請求結構
type CategoryRequest struct {
	ParentID     *uint                        `json:"parent_id"`
	Translations []CategoryTranslationRequest `json:"translations" binding:"required,min=1"`
}

// 分類翻譯請求結構
type CategoryTranslationRequest struct {
	LanguageCode string `json:"language_code" binding:"required"`
	Name         string `json:"name" binding:"required"`
	Slug         string `json:"slug"`
	Description  string `json:"description"`
}

// 獲取分類列表
func GetCategories(c *gin.Context) {
	var categories []models.Category

	// 查詢參數處理
	query := config.DB.Model(&models.Category{})

	// 是否只獲取頂級分類
	onlyParents := c.Query("only_parents")
	if onlyParents == "true" {
		query = query.Where("parent_id IS NULL")
	}

	// 根據父分類ID篩選
	parentID := c.Query("parent_id")
	if parentID != "" {
		query = query.Where("parent_id = ?", parentID)
	}

	// 語言篩選
	langCode := c.Query("lang")

	// 預載相關數據
	if langCode != "" {
		query = query.Preload("Translations", func(db *gorm.DB) *gorm.DB {
			return db.Where("language_code = ?", langCode)
		})
	} else {
		query = query.Preload("Translations")
	}

	// 是否包含父分類信息
	includeParent := c.Query("include_parent")
	if includeParent == "true" {
		query = query.Preload("Parent")
	}

	// 排序
	orderBy := c.DefaultQuery("order_by", "created_at")
	orderDir := c.DefaultQuery("order_dir", "desc")
	query = query.Order(orderBy + " " + orderDir)

	// 分頁
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	offset := (page - 1) * pageSize

	var total int64
	query.Count(&total)

	query.Limit(pageSize).Offset(offset).Find(&categories)

	c.JSON(http.StatusOK, gin.H{
		"categories": categories,
		"pagination": gin.H{
			"total":      total,
			"page":       page,
			"page_size":  pageSize,
			"total_page": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// 獲取單個分類
func GetCategory(c *gin.Context) {
	id := c.Param("id")
	var category models.Category

	// 預載相關數據
	query := config.DB.Preload("Translations")

	// 是否包含父分類信息
	includeParent := c.Query("include_parent")
	if includeParent == "true" {
		query = query.Preload("Parent.Translations")
	}

	if err := query.First(&category, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "分類不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"category": category})
}

// 創建分類
func CreateCategory(c *gin.Context) {
	var req CategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 如果指定了父分類，確認其存在
	if req.ParentID != nil {
		var parentCategory models.Category
		if err := config.DB.First(&parentCategory, *req.ParentID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusBadRequest, gin.H{"error": "父分類不存在"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}
	}

	// 啟動事務
	tx := config.DB.Begin()

	// 創建分類
	category := models.Category{
		ParentID: req.ParentID,
	}

	if err := tx.Create(&category).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "創建分類失敗"})
		return
	}

	// 處理翻譯
	for _, trans := range req.Translations {
		// 如果沒有提供 slug，則自動生成
		if trans.Slug == "" {
			trans.Slug = slug.Make(trans.Name)
		}

		translation := models.CategoryTranslation{
			CategoryID:   category.ID,
			LanguageCode: trans.LanguageCode,
			Name:         trans.Name,
			Slug:         trans.Slug,
			Description:  trans.Description,
		}

		if err := tx.Create(&translation).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "創建分類翻譯失敗"})
			return
		}
	}

	// 提交事務
	tx.Commit()

	// 獲取完整的分類數據回傳
	var fullCategory models.Category
	config.DB.Preload("Translations").Preload("Parent.Translations").First(&fullCategory, category.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message":  "分類創建成功",
		"category": fullCategory,
	})
}

// 更新分類
func UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	var category models.Category

	// 確認分類存在
	if err := config.DB.First(&category, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "分類不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	var req CategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 如果指定了父分類，確認其存在且不是自己或其子分類
	if req.ParentID != nil {
		// 不能將分類的父分類設為自己
		if *req.ParentID == category.ID {
			c.JSON(http.StatusBadRequest, gin.H{"error": "不能將分類的父分類設為自己"})
			return
		}

		// 確認父分類存在
		var parentCategory models.Category
		if err := config.DB.First(&parentCategory, *req.ParentID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusBadRequest, gin.H{"error": "父分類不存在"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}

		// 不能將分類的父分類設為其子分類
		var count int64
		if err := config.DB.Model(&models.Category{}).Where("id = ? AND parent_id = ?", *req.ParentID, category.ID).Count(&count).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "不能將分類的父分類設為其子分類"})
			return
		}
	}

	// 啟動事務
	tx := config.DB.Begin()

	// 更新分類基本信息
	category.ParentID = req.ParentID
	if err := tx.Save(&category).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新分類失敗"})
		return
	}

	// 處理翻譯
	for _, trans := range req.Translations {
		// 如果沒有提供 slug，則自動生成
		if trans.Slug == "" {
			trans.Slug = slug.Make(trans.Name)
		}

		var translation models.CategoryTranslation
		// 檢查該語言的翻譯是否已存在
		result := tx.Where("category_id = ? AND language_code = ?", category.ID, trans.LanguageCode).First(&translation)

		if result.Error != nil {
			// 不存在，創建新翻譯
			if result.Error == gorm.ErrRecordNotFound {
				translation = models.CategoryTranslation{
					CategoryID:   category.ID,
					LanguageCode: trans.LanguageCode,
					Name:         trans.Name,
					Slug:         trans.Slug,
					Description:  trans.Description,
				}

				if err := tx.Create(&translation).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "創建分類翻譯失敗"})
					return
				}
			} else {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
				return
			}
		} else {
			// 更新已存在的翻譯
			translation.Name = trans.Name
			translation.Slug = trans.Slug
			translation.Description = trans.Description

			if err := tx.Save(&translation).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "更新分類翻譯失敗"})
				return
			}
		}
	}

	// 提交事務
	tx.Commit()

	// 獲取完整的分類數據回傳
	var fullCategory models.Category
	config.DB.Preload("Translations").Preload("Parent.Translations").First(&fullCategory, category.ID)

	c.JSON(http.StatusOK, gin.H{
		"message":  "分類更新成功",
		"category": fullCategory,
	})
}

// 刪除分類
func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	var category models.Category

	// 確認分類存在
	if err := config.DB.First(&category, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "分類不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 檢查是否有子分類
	var childrenCount int64
	if err := config.DB.Model(&models.Category{}).Where("parent_id = ?", id).Count(&childrenCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if childrenCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "該分類下有子分類，請先刪除子分類"})
		return
	}

	// 檢查分類是否被使用
	var articleCount int64
	if err := config.DB.Model(&models.ArticleCategory{}).Where("category_id = ?", id).Count(&articleCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if articleCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "該分類已被文章使用，不能刪除"})
		return
	}

	// 啟動事務
	tx := config.DB.Begin()

	// 刪除翻譯
	if err := tx.Where("category_id = ?", id).Delete(&models.CategoryTranslation{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除分類翻譯失敗"})
		return
	}

	// 刪除分類本身
	if err := tx.Delete(&category).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除分類失敗"})
		return
	}

	// 提交事務
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message": "分類刪除成功",
	})
}
