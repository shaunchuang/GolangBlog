package controllers

import (
	"GolangBlog/config"
	"GolangBlog/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// 語言請求結構
type LanguageRequest struct {
	Code       string `json:"code" binding:"required"`
	Name       string `json:"name" binding:"required"`
	NativeName string `json:"native_name" binding:"required"`
	IsActive   bool   `json:"is_active"`
	IsDefault  bool   `json:"is_default"`
	Direction  string `json:"direction"`
	SortOrder  int    `json:"sort_order"`
}

// 獲取所有語言
func GetLanguages(c *gin.Context) {
	var languages []models.Language

	// 查詢參數處理
	query := config.DB.Model(&models.Language{})

	// 是否只獲取啟用的語言
	onlyActive := c.Query("active")
	if onlyActive == "true" {
		query = query.Where("is_active = ?", true)
	}

	// 排序
	orderBy := c.DefaultQuery("order_by", "sort_order")
	orderDir := c.DefaultQuery("order_dir", "asc")
	query = query.Order(orderBy + " " + orderDir)

	// 執行查詢
	if err := query.Find(&languages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"languages": languages})
}

// 獲取單個語言
func GetLanguage(c *gin.Context) {
	id := c.Param("id")
	var language models.Language

	if err := config.DB.First(&language, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "語言不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"language": language})
}

// 根據語言代碼獲取語言
func GetLanguageByCode(c *gin.Context) {
	code := c.Param("code")
	var language models.Language

	if err := config.DB.Where("code = ?", code).First(&language).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "語言不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"language": language})
}

// 創建語言
func CreateLanguage(c *gin.Context) {
	var req LanguageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 檢查語言代碼是否已存在
	var existingLanguage models.Language
	if result := config.DB.Where("code = ?", req.Code).First(&existingLanguage); result.RowsAffected > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "語言代碼已存在"})
		return
	}

	// 開始事務
	tx := config.DB.Begin()

	// 如果設置為預設語言，則將其他語言的預設標誌設置為 false
	if req.IsDefault {
		if err := tx.Model(&models.Language{}).Where("is_default = ?", true).Update("is_default", false).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "更新其他語言的預設標誌失敗"})
			return
		}
	}

	// 創建新語言
	language := models.Language{
		Code:       req.Code,
		Name:       req.Name,
		NativeName: req.NativeName,
		IsActive:   req.IsActive,
		IsDefault:  req.IsDefault,
		Direction:  req.Direction,
		SortOrder:  req.SortOrder,
	}

	// 如果未提供方向，則設置為預設值 "ltr"
	if language.Direction == "" {
		language.Direction = "ltr"
	}

	if err := tx.Create(&language).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "創建語言失敗"})
		return
	}

	// 提交事務
	tx.Commit()

	c.JSON(http.StatusCreated, gin.H{
		"message":  "語言創建成功",
		"language": language,
	})
}

// 更新語言
func UpdateLanguage(c *gin.Context) {
	id := c.Param("id")
	var language models.Language

	// 確認語言存在
	if err := config.DB.First(&language, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "語言不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	var req LanguageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 檢查更新的語言代碼是否與其他語言衝突
	if req.Code != language.Code {
		var existingLanguage models.Language
		if result := config.DB.Where("code = ? AND id != ?", req.Code, id).First(&existingLanguage); result.RowsAffected > 0 {
			c.JSON(http.StatusConflict, gin.H{"error": "語言代碼已被其他語言使用"})
			return
		}
	}

	// 開始事務
	tx := config.DB.Begin()

	// 如果設置為預設語言，則將其他語言的預設標誌設置為 false
	if req.IsDefault && !language.IsDefault {
		if err := tx.Model(&models.Language{}).Where("id != ?", id).Update("is_default", false).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "更新其他語言的預設標誌失敗"})
			return
		}
	}

	// 更新語言
	language.Code = req.Code
	language.Name = req.Name
	language.NativeName = req.NativeName
	language.IsActive = req.IsActive
	language.IsDefault = req.IsDefault
	language.Direction = req.Direction
	language.SortOrder = req.SortOrder

	// 如果未提供方向，則設置為預設值 "ltr"
	if language.Direction == "" {
		language.Direction = "ltr"
	}

	if err := tx.Save(&language).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新語言失敗"})
		return
	}

	// 提交事務
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message":  "語言更新成功",
		"language": language,
	})
}

// 刪除語言
func DeleteLanguage(c *gin.Context) {
	id := c.Param("id")
	var language models.Language

	// 確認語言存在
	if err := config.DB.First(&language, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "語言不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 檢查是否為預設語言
	if language.IsDefault {
		c.JSON(http.StatusBadRequest, gin.H{"error": "預設語言不能刪除，請先設置其他語言為預設語言"})
		return
	}

	// 檢查語言是否被使用
	// 1. 檢查文章翻譯
	var articleTransCount int64
	if err := config.DB.Model(&models.ArticleTranslation{}).Where("language_code = ?", language.Code).Count(&articleTransCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 2. 檢查標籤翻譯
	var tagTransCount int64
	if err := config.DB.Model(&models.TagTranslation{}).Where("language_code = ?", language.Code).Count(&tagTransCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 3. 檢查分類翻譯
	var categoryTransCount int64
	if err := config.DB.Model(&models.CategoryTranslation{}).Where("language_code = ?", language.Code).Count(&categoryTransCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 如果語言已被使用，則不允許刪除
	if articleTransCount > 0 || tagTransCount > 0 || categoryTransCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "該語言已被使用，不能刪除，相關統計如下",
			"usage": gin.H{
				"articles":   articleTransCount,
				"tags":       tagTransCount,
				"categories": categoryTransCount,
			},
		})
		return
	}

	// 刪除語言
	if err := config.DB.Delete(&language).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "刪除語言失敗"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "語言刪除成功",
	})
}

// 設置語言為預設語言
func SetDefaultLanguage(c *gin.Context) {
	id := c.Param("id")
	var language models.Language

	// 確認語言存在
	if err := config.DB.First(&language, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "語言不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 確認語言是否啟用
	if !language.IsActive {
		c.JSON(http.StatusBadRequest, gin.H{"error": "非啟用狀態的語言不能設為預設語言"})
		return
	}

	// 如果該語言已經是預設語言，則無需操作
	if language.IsDefault {
		c.JSON(http.StatusOK, gin.H{
			"message":  "該語言已經是預設語言",
			"language": language,
		})
		return
	}

	// 開始事務
	tx := config.DB.Begin()

	// 將其他語言的預設標誌設置為 false
	if err := tx.Model(&models.Language{}).Update("is_default", false).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新其他語言的預設標誌失敗"})
		return
	}

	// 設置當前語言為預設語言
	language.IsDefault = true
	if err := tx.Save(&language).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "設置預設語言失敗"})
		return
	}

	// 提交事務
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message":  "預設語言設置成功",
		"language": language,
	})
}

// 更新語言排序
func UpdateLanguageOrder(c *gin.Context) {
	type LanguageOrderRequest struct {
		Orders []struct {
			ID        uint `json:"id" binding:"required"`
			SortOrder int  `json:"sort_order" binding:"required"`
		} `json:"orders" binding:"required"`
	}

	var req LanguageOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 開始事務
	tx := config.DB.Begin()

	// 更新每個語言的排序
	for _, order := range req.Orders {
		if err := tx.Model(&models.Language{}).Where("id = ?", order.ID).Update("sort_order", order.SortOrder).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "更新語言排序失敗"})
			return
		}
	}

	// 提交事務
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message": "語言排序更新成功",
	})
}

// 批量切換語言啟用狀態
func ToggleLanguageStatus(c *gin.Context) {
	id := c.Param("id")
	var language models.Language

	// 確認語言存在
	if err := config.DB.First(&language, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "語言不存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 如果是預設語言並且嘗試禁用，則不允許
	if language.IsDefault && language.IsActive {
		c.JSON(http.StatusBadRequest, gin.H{"error": "預設語言不能被禁用，請先設置其他語言為預設語言"})
		return
	}

	// 切換狀態
	language.IsActive = !language.IsActive
	if err := config.DB.Save(&language).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新語言狀態失敗"})
		return
	}

	statusText := "啟用"
	if !language.IsActive {
		statusText = "禁用"
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  fmt.Sprintf("語言已%s", statusText),
		"language": language,
	})
}
