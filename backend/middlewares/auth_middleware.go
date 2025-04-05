package middlewares

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWT驗證中間件
func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未提供授權標頭"})
			c.Abort()
			return
		}

		// 檢查標頭格式
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "授權標頭格式無效"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims := &Claims{}

		// 解析 JWT token
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			// 驗證簽名算法
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("無效的簽名方法: %v", token.Header["alg"])
			}
			return []byte(getJWTKey()), nil
		})

		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "無效的 token 簽名"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "無效或過期的 token"})
			}
			c.Abort()
			return
		}

		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "無效的 token"})
			c.Abort()
			return
		}

		// 將使用者ID和角色添加到上下文中
		c.Set("userID", claims.UserID)
		c.Set("role", claims.Role)
		c.Next()
	}
}

// 管理員權限檢查中間件
func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未認證的使用者"})
			c.Abort()
			return
		}

		if role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "需要管理員權限"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// 編輯者或管理員權限檢查中間件
func EditorOrAdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未認證的使用者"})
			c.Abort()
			return
		}

		if role != "admin" && role != "editor" {
			c.JSON(http.StatusForbidden, gin.H{"error": "需要編輯者或管理員權限"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// JWT Claims 結構，與auth_controller中的定義相同
type Claims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// 從環境變數或配置文件獲取 JWT 金鑰
func getJWTKey() string {
	// 在實際應用中應從安全的地方獲取 JWT 密鑰
	// 這裡簡單示例，實際應用中要更安全地處理
	return "your-secret-jwt-key"
}
