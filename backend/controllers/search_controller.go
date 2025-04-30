package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SearchController struct {
	DB *gorm.DB
}

func NewSearchController(db *gorm.DB) *SearchController {
	return &SearchController{DB: db}
}

// SearchRequest 定義搜索請求參數
type SearchRequest struct {
	Query    string `form:"q" binding:"required"`
	Category string `form:"category"`
	Tag      string `form:"tag"`
	Language string `form:"lang"`
	Page     int    `form:"page,default=1"`
	PageSize int    `form:"pageSize,default=10"`
}

// SearchResults 定義搜索結果
type SearchResults struct {
	Articles    []map[string]interface{} `json:"articles"`
	Total       int64                    `json:"total"`
	Page        int                      `json:"page"`
	PageSize    int                      `json:"pageSize"`
	TotalPages  int                      `json:"totalPages"`
	Query       string                   `json:"query"`
	Category    string                   `json:"category,omitempty"`
	Tag         string                   `json:"tag,omitempty"`
	Language    string                   `json:"language,omitempty"`
	Suggestions []string                 `json:"suggestions,omitempty"`
}

// Search 處理搜索請求
func (sc *SearchController) Search(c *gin.Context) {
	var req SearchRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid search parameters"})
		return
	}

	// 驗證並設置默認值
	if req.Page < 1 {
		req.Page = 1
	}
	if req.PageSize < 1 || req.PageSize > 50 {
		req.PageSize = 10
	}

	// 構建基本查詢
	query := sc.DB.Table("articles").
		Select("articles.id, articles.title, articles.slug, articles.summary, articles.content, articles.feature_image, articles.published_at, articles.views, categories.name as category_name, users.name as author_name").
		Joins("LEFT JOIN categories ON articles.category_id = categories.id").
		Joins("LEFT JOIN users ON articles.author_id = users.id").
		Where("articles.published = ?", true)

	// 添加全文搜索條件
	searchTerms := strings.Split(req.Query, " ")
	for _, term := range searchTerms {
		if len(term) > 2 {
			query = query.Where("articles.title LIKE ? OR articles.content LIKE ? OR articles.summary LIKE ?",
				"%"+term+"%", "%"+term+"%", "%"+term+"%")
		}
	}

	// 添加過濾條件
	if req.Category != "" {
		query = query.Where("categories.slug = ?", req.Category)
	}

	if req.Tag != "" {
		query = query.Joins("JOIN article_tags ON articles.id = article_tags.article_id").
			Joins("JOIN tags ON article_tags.tag_id = tags.id").
			Where("tags.slug = ?", req.Tag)
	}

	if req.Language != "" {
		query = query.Where("articles.language = ?", req.Language)
	}

	// 獲取總數
	var total int64
	query.Count(&total)

	// 分頁
	offset := (req.Page - 1) * req.PageSize
	var articles []map[string]interface{}

	query = query.Order("articles.published_at DESC").
		Offset(offset).
		Limit(req.PageSize)

	if err := query.Find(&articles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search articles"})
		return
	}

	// 計算總頁數
	totalPages := int(total) / req.PageSize
	if int(total)%req.PageSize > 0 {
		totalPages++
	}

	// 生成搜索建議（如果結果少於3個）
	var suggestions []string
	if len(articles) < 3 && len(req.Query) > 3 {
		var relatedTerms []string
		suggestQuery := sc.DB.Table("articles").
			Select("DISTINCT articles.title").
			Where("articles.published = ? AND articles.title LIKE ?", true, "%"+req.Query[:3]+"%").
			Limit(5)

		suggestQuery.Pluck("articles.title", &relatedTerms)
		for _, term := range relatedTerms {
			suggestions = append(suggestions, term)
		}
	}

	// 返回結果
	results := SearchResults{
		Articles:    articles,
		Total:       total,
		Page:        req.Page,
		PageSize:    req.PageSize,
		TotalPages:  totalPages,
		Query:       req.Query,
		Category:    req.Category,
		Tag:         req.Tag,
		Language:    req.Language,
		Suggestions: suggestions,
	}

	c.JSON(http.StatusOK, results)
}
