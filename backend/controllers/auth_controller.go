package controllers

import (
	"GolangBlog/config"
	"GolangBlog/models"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// 註冊請求結構
type RegisterRequest struct {
	Username  string `json:"username" binding:"required,min=3,max=50"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

// 登入請求結構
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// JWT Claims 結構
type Claims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// 註冊新使用者
func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 檢查使用者是否已存在
	var existingUser models.User
	if result := config.DB.Where("email = ?", req.Email).Or("username = ?", req.Username).First(&existingUser); result.RowsAffected > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "使用者已存在"})
		return
	}

	// 密碼雜湊處理
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "密碼處理失敗"})
		return
	}

	// 建立新使用者
	user := models.User{
		Username:  req.Username,
		Email:     req.Email,
		Password:  string(hashedPassword),
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Role:      "user", // 預設角色
		Status:    "active",
	}

	if result := config.DB.Create(&user); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "建立使用者失敗"})
		return
	}

	// 不回傳密碼
	user.Password = ""

	c.JSON(http.StatusCreated, gin.H{
		"message": "使用者註冊成功",
		"user":    user,
	})
}

// 使用者登入
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 查詢使用者
	var user models.User
	if result := config.DB.Where("email = ?", req.Email).First(&user); result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "使用者不存在或密碼錯誤"})
		return
	}

	// 驗證密碼
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "使用者不存在或密碼錯誤"})
		return
	}

	// 檢查使用者狀態
	if user.Status != "active" {
		c.JSON(http.StatusForbidden, gin.H{"error": "使用者帳號已被停用"})
		return
	}

	// 生成 JWT Token
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: user.ID,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "golangblog",
			Subject:   req.Email,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtKey := []byte(getJWTKey())
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "無法生成身份驗證令牌"})
		return
	}

	// 不回傳密碼
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"message": "登入成功",
		"token":   tokenString,
		"user":    user,
	})
}

// 獲取當前使用者資訊
func GetCurrentUser(c *gin.Context) {
	// 從 middleware 中獲取使用者 ID
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "使用者未認證"})
		return
	}

	var user models.User
	if result := config.DB.First(&user, userID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "使用者不存在"})
		return
	}

	// 不回傳密碼
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// 從環境變數或配置文件獲取 JWT 金鑰
func getJWTKey() string {
	// 優先從環境變數獲取 JWT 密鑰
	jwtKey := os.Getenv("JWT_SECRET_KEY")
	if jwtKey == "" {
		// 若環境變數未設置，則使用默認密鑰（僅用於開發環境）
		jwtKey = "your-secret-jwt-key"
		log.Println("警告: 使用默認 JWT 密鑰，這不適合生產環境。請設置 JWT_SECRET_KEY 環境變數。")
	}
	return jwtKey
}
