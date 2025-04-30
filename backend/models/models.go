package models

import (
	"time"

	"gorm.io/gorm"
)

// 基礎模型
type BaseModel struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// 使用者模型
type User struct {
	BaseModel
	Username  string `gorm:"size:50;not null;uniqueIndex" json:"username"`
	Email     string `gorm:"size:100;not null;uniqueIndex" json:"email"`
	Password  string `gorm:"size:100;not null" json:"-"`
	FirstName string `gorm:"size:50" json:"first_name"`
	LastName  string `gorm:"size:50" json:"last_name"`
	Avatar    string `gorm:"size:255" json:"avatar"`
	Role      string `gorm:"size:20;default:'user'" json:"role"` // admin, editor, user
	Status    string `gorm:"size:20;default:'active'" json:"status"`
}

// 文章模型 - 語言無關的基礎資訊
type Article struct {
	BaseModel
	UserID        uint                 `json:"user_id"`
	User          User                 `gorm:"foreignKey:UserID" json:"user"`
	Status        string               `gorm:"size:20;default:'draft'" json:"status"` // draft, published, archived
	PublishedAt   *time.Time           `json:"published_at"`
	FeaturedImage string               `gorm:"size:255" json:"featured_image"`
	ViewCount     int                  `gorm:"default:0" json:"view_count"`
	IsFeatured    bool                 `gorm:"default:false" json:"is_featured"` // 新增精選文章標記
	Translations  []ArticleTranslation `gorm:"foreignKey:ArticleID" json:"translations"`
	Tags          []Tag                `gorm:"many2many:article_tags;" json:"tags"`
}

// 文章翻譯模型 - 語言相關內容
type ArticleTranslation struct {
	BaseModel
	ArticleID       uint   `gorm:"index:idx_article_lang,unique" json:"article_id"`
	LanguageCode    string `gorm:"size:10;index:idx_article_lang,unique" json:"language_code"`
	Title           string `gorm:"size:200;not null" json:"title"`
	Slug            string `gorm:"size:255;index" json:"slug"`
	Excerpt         string `gorm:"size:500" json:"excerpt"`
	Content         string `gorm:"type:text" json:"content"`
	MetaTitle       string `gorm:"size:200" json:"meta_title"`
	MetaDescription string `gorm:"size:500" json:"meta_description"`
	MetaKeywords    string `gorm:"size:255" json:"meta_keywords"`
}

// 標籤模型
type Tag struct {
	BaseModel
	Translations []TagTranslation `gorm:"foreignKey:TagID" json:"translations"`
	Articles     []Article        `gorm:"many2many:article_tags;" json:"-"`
}

// 標籤翻譯模型
type TagTranslation struct {
	BaseModel
	TagID        uint   `gorm:"index:idx_tag_lang,unique" json:"tag_id"`
	LanguageCode string `gorm:"size:10;index:idx_tag_lang,unique" json:"language_code"`
	Name         string `gorm:"size:50;not null" json:"name"`
	Slug         string `gorm:"size:100;index" json:"slug"`
}

// 分類模型
type Category struct {
	BaseModel
	ParentID     *uint                 `json:"parent_id"`
	Parent       *Category             `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
	Translations []CategoryTranslation `gorm:"foreignKey:CategoryID" json:"translations"`
	Articles     []Article             `gorm:"many2many:article_categories;" json:"-"`
}

// 分類翻譯模型
type CategoryTranslation struct {
	BaseModel
	CategoryID   uint   `gorm:"index:idx_category_lang,unique" json:"category_id"`
	LanguageCode string `gorm:"size:10;index:idx_category_lang,unique" json:"language_code"`
	Name         string `gorm:"size:100;not null" json:"name"`
	Slug         string `gorm:"size:150;index" json:"slug"`
	Description  string `gorm:"size:500" json:"description"`
}

// 圖片模型
type Image struct {
	BaseModel
	UserID      uint   `json:"user_id"`
	User        User   `gorm:"foreignKey:UserID" json:"user"`
	FileName    string `gorm:"size:255;not null" json:"file_name"`
	FilePath    string `gorm:"size:500;not null" json:"file_path"`
	FileSize    int64  `json:"file_size"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
	ContentType string `gorm:"size:100" json:"content_type"`
	Alt         string `gorm:"size:255" json:"alt"`
	Title       string `gorm:"size:255" json:"title"`
	Usage       string `gorm:"size:50" json:"usage"` // article, avatar, etc.
}

// 文章與分類關聯表
type ArticleCategory struct {
	ArticleID  uint `gorm:"primaryKey"`
	CategoryID uint `gorm:"primaryKey"`
}

// 文章與標籤關聯表
type ArticleTag struct {
	ArticleID uint `gorm:"primaryKey"`
	TagID     uint `gorm:"primaryKey"`
}

// 系統設定模型
type Setting struct {
	BaseModel
	Key            string `gorm:"size:100;uniqueIndex" json:"key"`
	Value          string `gorm:"type:text" json:"value"`
	Type           string `gorm:"size:50" json:"type"`  // text, number, boolean, json, etc.
	Group          string `gorm:"size:50" json:"group"` // general, seo, social, etc.
	IsTranslatable bool   `gorm:"default:false" json:"is_translatable"`
}

// 系統設定翻譯模型
type SettingTranslation struct {
	BaseModel
	SettingID    uint   `gorm:"index:idx_setting_lang,unique" json:"setting_id"`
	LanguageCode string `gorm:"size:10;index:idx_setting_lang,unique" json:"language_code"`
	Value        string `gorm:"type:text" json:"value"`
}

// 語言模型
type Language struct {
	BaseModel
	Code       string `gorm:"size:10;uniqueIndex" json:"code"`
	Name       string `gorm:"size:50;not null" json:"name"`
	NativeName string `gorm:"size:50;not null" json:"native_name"`
	IsActive   bool   `gorm:"default:true" json:"is_active"`
	IsDefault  bool   `gorm:"default:false" json:"is_default"`
	Direction  string `gorm:"size:3;default:'ltr'" json:"direction"` // ltr, rtl
	SortOrder  int    `gorm:"default:0" json:"sort_order"`
}

// 初始化資料庫表格
func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&User{},
		&Article{},
		&ArticleTranslation{},
		&Tag{},
		&TagTranslation{},
		&Category{},
		&CategoryTranslation{},
		&Image{},
		&Setting{},
		&SettingTranslation{},
		&Language{},
	)
}
