package main

import (
	"github.com/gin-contrib/i18n"
	"github.com/gin-gonic/gin"
	"golang.org/x/text/language"
)

func main() {
	r := gin.Default()

	r.Use(i18n.Localize(i18n.WithBundle(&i18n.BundleCfg{
		RootPath: "./locales",
		AcceptLanguage: []language.Tag{
			language.English, language.Chinese,
		},
	})))

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": c.MustGet("i18n_message").(string),
		})
	})

	r.Run()
}
