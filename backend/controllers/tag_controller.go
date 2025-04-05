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

// 標籤請求結構
type TagRequest struct {
	Translations []TagTranslationRequest `json:"translations" binding:"required,min=1"`
}

// 標籤翻譯請求結構
type TagTranslationRequest struct {
	LanguageCode string `json:"language_code" binding:"required"`
	Name         string `json:"name" binding:"required"`
	Slug         string `json:"slug"`
}

// 獲取標籤列表
func GetTags(c *gin.Context) {
	var tags []models.Tag

	// 查詢參數處理
	query := config.DB.Model(&models.Tag{})

	// 語言篩選
	langCode := c.Query("lang")

	// 預載翻譯
	if langCode != "" {
		query = query.Preload("Translations", func(db *gorm.DB) *gorm.DB {
			return db.Where("language_code = ?", langCode)
		})
	} else {
		query = query.Preload("Translations")
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

	query.Limit(pageSize).Offset(offset).Find(&tags)

	c.JSON(http.StatusOK, gin.H{
		"tags": tags,
		"pagination": gin.H{
			"total":      total,
			"page":       page,
			"page_size":  pageSize,
			"total_page": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// 獲取單個標籤
func GetTag(c *gin.Context) {
	id := c.Param("id")
	var tag models.Tag

	if err := config.DB.Preload("Translations").First(&tag, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "標籤不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"tag": tag})
}

// 創建標籤
func CreateTag(c *gin.Context) {
	var req TagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 啟動事務
	tx := config.DB.Begin()

	// 創建標籤
	tag := models.Tag{}
	if err := tx.Create(&tag).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "創建標籤失敗"})
		return
	}

	// 處理翻譯
	for _, trans := range req.Translations {
		// 如果沒有提供 slug，則自動生成
		if trans.Slug == "" {
			trans.Slug = slug.Make(trans.Name)
		}

		translation := models.TagTranslation{
			TagID:        tag.ID,
			LanguageCode: trans.LanguageCode,
			Name:         trans.Name,
			Slug:         trans.Slug,
		}

		if err := tx.Create(&translation).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "創建標籤翻譯失敗"})
			return
		}
	}

	// 提交事務
	tx.Commit()

	// 獲取完整的標籤數據回傳
	var fullTag models.Tag
	config.DB.Preload("Translations").First(&fullTag, tag.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "標籤創建成功",
		"tag":     fullTag,
	})
}

// 更新標籤
func UpdateTag(c *gin.Context) {
	id := c.Param("id")
	var tag models.Tag

	// 確認標籤存在
	if err := config.DB.First(&tag, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "標籤不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	var req TagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 啟動事務
	tx := config.DB.Begin()

	// 處理翻譯
	for _, trans := range req.Translations {
		// 如果沒有提供 slug，則自動生成
		if trans.Slug == "" {
			trans.Slug = slug.Make(trans.Name)
		}

		var translation models.TagTranslation
		// 檢查該語言的翻譯是否已存在
		result := tx.Where("tag_id = ? AND language_code = ?", tag.ID, trans.LanguageCode).First(&translation)

		if result.Error != nil {
			// 不存在，創建新翻譯
			if result.Error == gorm.ErrRecordNotFound {
				translation = models.TagTranslation{
					TagID:        tag.ID,
					LanguageCode: trans.LanguageCode,
					Name:         trans.Name,
					Slug:         trans.Slug,
				}

				if err := tx.Create(&translation).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "創建標籤翻譯失敗"})
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

			if err := tx.Save(&translation).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "更新標籤翻譯失敗"})
				return
			}
		}
	}

	// 提交事務
	tx.Commit()

	// 獲取完整的標籤數據回傳
	var fullTag models.Tag
	config.DB.Preload("Translations").First(&fullTag, tag.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "標籤更新成功",
		"tag":     fullTag,
	})
}

// 刪除標籤
func DeleteTag(c *gin.Context) {
	id := c.Param("id")
	var tag models.Tag

	// 確認標籤存在
	if err := config.DB.First(&tag, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "標籤不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 檢查標籤是否被使用
	var count int64
	if err := config.DB.Model(&models.ArticleTag{}).Where("tag_id = ?", id).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "該標籤已被使用，不能刪除"})
		return
	}

	// 啟動事務
	tx := config.DB.Begin()

	// 刪除翻譯
	if err := tx.Where("tag_id = ?", id).Delete(&models.TagTranslation{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除標籤翻譯失敗"})
		return
	}

	// 刪除標籤本身
	if err := tx.Delete(&tag).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除標籤失敗"})
		return
	}

	// 提交事務
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message": "標籤刪除成功",
	})
}
