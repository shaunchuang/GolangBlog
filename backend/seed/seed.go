package main // 由 package seeds 改為 package main，使其成為可執行命令

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/bxcodec/faker/v3"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"GolangBlog/models"
)

func main() {
	// 1. 載入 .env 檔案
	if err := godotenv.Load(); err != nil {
		log.Println("警告: .env 文件不存在，將使用環境變數")
	}

	// 2. 從環境變數取得資料庫設定
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnvAsInt("DB_PORT", 30432)
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "golangblog")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")

	// 3. 建立 DSN
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, dbSSLMode)

	// 4. 設定 GORM logger
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	// 5. 連線資料庫
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		panic(fmt.Sprintf("連線資料庫失敗: %v", err))
	}

	log.Printf("成功連線到 PostgreSQL 資料庫 (%s:%d/%s)\n", dbHost, dbPort, dbName)

	// 6. 自動遷移
	err = models.AutoMigrate(db)
	if err != nil {
		panic(fmt.Sprintf("資料庫遷移失敗: %v", err))
	}

	// 7. 產生模擬資料
	fmt.Println("開始產生模擬資料...")

	fmt.Println("→ 新增語言...")
	seedLanguages(db)

	fmt.Println("→ 新增使用者...")
	seedUsers(db, 10)

	fmt.Println("→ 新增分類...")
	seedCategories(db)

	fmt.Println("→ 新增標籤...")
	seedTags(db)

	fmt.Println("→ 新增文章...")
	seedArticles(db, 20)

	fmt.Println("→ 新增系統設定...")
	seedSettings(db)

	// 示範使用 ptrTime 函數
	now := time.Now()
	futureTime := now.Add(24 * time.Hour)
	pTime := ptrTime(futureTime)
	fmt.Printf("資料產生時間: %v, 到期時間指針: %v\n", now.Format("2006-01-02 15:04:05"), pTime.Format("2006-01-02 15:04:05"))

	fmt.Println("資料產生完成！")
}

// 從環境變數獲取字串，如果不存在則使用預設值
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// 從環境變數獲取整數，如果不存在或轉換失敗則使用預設值
func getEnvAsInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func seedLanguages(db *gorm.DB) {
	langs := []models.Language{
		{Code: "en", Name: "English", NativeName: "English", IsActive: true, IsDefault: true, Direction: "ltr", SortOrder: 1},
		{Code: "zh-TW", Name: "Chinese (Taiwan)", NativeName: "中文（台灣）", IsActive: true, Direction: "ltr", SortOrder: 2},
	}
	db.Create(&langs)
}

func seedUsers(db *gorm.DB, count int) {
	rand.Seed(time.Now().UnixNano())
	users := make([]models.User, 0, count)
	for i := 0; i < count; i++ {
		users = append(users, models.User{
			Username:  faker.Username(),
			Email:     faker.Email(),
			Password:  "password123", // TODO: hash in real code
			FirstName: faker.FirstName(),
			LastName:  faker.LastName(),
			Avatar:    faker.URL(),
			Role:      "user",
			Status:    "active",
		})
	}
	db.Create(&users)
}

func seedCategories(db *gorm.DB) {
	// 移除未使用的變數
	categories := map[string]string{
		"politics":      "政治",
		"business":      "財經",
		"technology":    "科技",
		"lifestyle":     "生活",
		"opinion":       "觀點",
		"international": "國際",
		"sports":        "體育",
		"entertainment": "娛樂",
	}

	for engName, zhName := range categories {
		cat := models.Category{}
		db.Create(&cat)

		translations := []models.CategoryTranslation{
			{
				CategoryID:   cat.ID,
				LanguageCode: "en",
				Name:         engName,
				Slug:         engName,
				Description:  fmt.Sprintf("Articles about %s", engName),
			},
			{
				CategoryID:   cat.ID,
				LanguageCode: "zh-TW",
				Name:         zhName,
				Slug:         engName,
				Description:  fmt.Sprintf("%s相關文章", zhName),
			},
		}
		db.Create(&translations)
	}
}

func seedTags(db *gorm.DB) {
	// 移除未使用的變數
	tags := map[string]string{
		"election":               "選舉",
		"climate change":         "氣候變化",
		"pandemic":               "疫情",
		"economy":                "經濟",
		"education":              "教育",
		"tech innovation":        "科技創新",
		"semiconductor":          "半導體",
		"ai":                     "人工智能",
		"ev":                     "電動車",
		"renewable energy":       "可再生能源",
		"digital transformation": "數位轉型",
		"healthcare":             "醫療健康",
	}

	for engName, zhName := range tags {
		tag := models.Tag{}
		db.Create(&tag)
		for _, lang := range []string{"en", "zh-TW"} {
			t := models.TagTranslation{
				TagID:        tag.ID,
				LanguageCode: lang,
				Name:         engName,
				Slug:         engName,
			}
			if lang == "zh-TW" {
				t.Name = zhName
			}
			db.Create(&t)
		}
	}
}

func seedArticles(db *gorm.DB, count int) {
	langs := []string{"en", "zh-TW"}
	var users []models.User
	db.Find(&users)

	var categories []models.Category
	db.Find(&categories)

	var tags []models.Tag
	db.Find(&tags)

	// 預設新聞標題樣板
	enNewsTitles := []string{
		"Breaking: %s Announces Major Policy Change",
		"Global Economic Forum Addresses %s Crisis",
		"New Research Shows Surprising Findings on %s",
		"Tech Giant Unveils Revolutionary %s Technology",
		"Scientists Discover Breakthrough in %s Research",
		"International Summit on %s Opens in Geneva",
		"Market Analysis: %s Sector Shows Strong Growth",
		"Opinion: Why %s Matters More Than Ever",
		"%s Industry Leaders Meet to Discuss Future Trends",
		"Special Report: The Hidden Impact of %s on Daily Life",
	}

	zhNewsTitles := []string{
		"突發：%s政策重大改變",
		"全球經濟論壇討論%s危機",
		"最新研究顯示%s驚人發現",
		"科技巨頭推出革命性%s技術",
		"科學家在%s研究領域取得重大突破",
		"國際%s峰會在日內瓦開幕",
		"市場分析：%s行業顯示強勁增長",
		"觀點：為何%s比以往更加重要",
		"%s行業領袖會面討論未來趨勢",
		"專題報導：%s如何影響日常生活",
	}

	// 新聞關鍵詞
	newsTopics := []string{
		"Climate Change", "Artificial Intelligence", "Renewable Energy",
		"Healthcare Reform", "Digital Transformation", "Global Trade",
		"Cybersecurity", "Space Exploration", "Educational Technology",
		"Quantum Computing", "Economic Recovery", "Public Health",
	}

	// 中文新聞關鍵詞
	zhNewsTopics := []string{
		"氣候變遷", "人工智能", "再生能源",
		"醫療改革", "數位轉型", "全球貿易",
		"網路安全", "太空探索", "教育科技",
		"量子計算", "經濟復甦", "公共衛生",
	}

	rand.Seed(time.Now().UnixNano())
	for i := 0; i < count; i++ {
		// 隨機選擇作者
		author := users[rand.Intn(len(users))]
		// 隨機決定發布時間
		publishTime := time.Now().Add(-time.Duration(rand.Intn(72)) * time.Hour)

		// 決定是否為精選文章
		isFeatured := rand.Intn(10) < 3 // 30% 機率為精選文章

		// 選擇特寫圖片
		featuredImageNum := rand.Intn(7) + 1 // 1-7 的隨機數
		featuredImage := fmt.Sprintf("/images/news/featured-%d.jpg", featuredImageNum)

		art := models.Article{
			UserID:        author.ID,
			Status:        "published",
			PublishedAt:   &publishTime,
			FeaturedImage: featuredImage,
			ViewCount:     rand.Intn(1000) + 50, // 50-1049 的隨機瀏覽量
			IsFeatured:    isFeatured,
		}
		db.Create(&art)

		// 隨機選擇主題
		topicIndex := rand.Intn(len(newsTopics))

		// 翻譯
		for _, lang := range langs {
			var title string
			var slug string
			var content string

			if lang == "en" {
				// 英文內容
				titleTemplate := enNewsTitles[rand.Intn(len(enNewsTitles))]
				topic := newsTopics[topicIndex]
				title = fmt.Sprintf(titleTemplate, topic)
				slug = slugify(title)
				content = generateNewsContent("en", topic, 5) // 5 段落
			} else {
				// 中文內容
				titleTemplate := zhNewsTitles[rand.Intn(len(zhNewsTitles))]
				topic := zhNewsTopics[topicIndex]
				title = fmt.Sprintf(titleTemplate, topic)
				slug = slugify(title)
				content = generateNewsContent("zh-TW", topic, 5) // 5 段落
			}

			excerpt := content[:min(150, len(content))] + "..."

			trans := models.ArticleTranslation{
				ArticleID:       art.ID,
				LanguageCode:    lang,
				Title:           title,
				Slug:            slug,
				Excerpt:         excerpt,
				Content:         content,
				MetaTitle:       title,
				MetaDescription: excerpt,
				MetaKeywords:    getMetaKeywords(lang, topicIndex),
			}
			db.Create(&trans)
		}

		// 關聯分類 & 標籤
		catCount := rand.Intn(2) + 1 // 1-2 個分類
		catIndices := rand.Perm(len(categories))
		for k := 0; k < catCount && k < len(catIndices); k++ {
			db.Exec("INSERT INTO article_categories (article_id, category_id) VALUES (?, ?)", art.ID, categories[catIndices[k]].ID)
		}

		tagCount := rand.Intn(3) + 1 // 1-3 個標籤
		tagIndices := rand.Perm(len(tags))
		for k := 0; k < tagCount && k < len(tagIndices); k++ {
			db.Exec("INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)", art.ID, tags[tagIndices[k]].ID)
		}
	}
}

// 內容生成
func generateNewsContent(lang string, topic string, paragraphs int) string {
	var content string

	// 段落模板
	enParagraphs := []string{
		"Recent developments in %s have sparked significant interest among experts worldwide. Analysts suggest that these changes could have far-reaching implications for various sectors.",
		"According to industry leaders, the evolution of %s represents a pivotal moment in our understanding of the field. Many researchers are now focused on exploring new applications.",
		"Studies conducted by leading institutions reveal that %s innovation continues to accelerate at an unprecedented rate. This growth trajectory has surprised even the most optimistic forecasts.",
		"Experts emphasize that the challenges associated with %s require collaborative approaches across disciplines. International cooperation remains crucial for addressing these complex issues.",
		"Public awareness regarding %s has increased dramatically in recent years. Citizens are becoming more engaged with policies and practices that directly impact their communities.",
		"Investment in %s research has reached record levels, with both public and private sectors recognizing its strategic importance. Funding allocation reflects growing priorities in this domain.",
		"The intersection of technology and %s presents unique opportunities and challenges. Balancing innovation with ethical considerations remains a central concern for stakeholders.",
		"Historical analysis shows that %s has undergone several transformative phases. Current developments appear to signal another significant shift in how we approach these matters.",
	}

	zhParagraphs := []string{
		"最近在%s領域的發展引起了全球專家的廣泛關注。分析師表示，這些變化可能對各個行業產生深遠影響。",
		"據業內領導者表示，%s的發展演變代表了我們對該領域理解的關鍵時刻。許多研究人員現在專注於探索新的應用方向。",
		"頂尖機構進行的研究顯示，%s創新繼續以前所未有的速度加速發展。這種增長軌跡甚至令最樂觀的預測感到驚訝。",
		"專家強調，與%s相關的挑戰需要跨學科的協作方法。國際合作在解決這些複雜問題上仍然至關重要。",
		"近年來公眾對%s的認識顯著增強。公民越來越積極參與直接影響其社區的政策和實踐。",
		"%s研究投資已達到歷史新高，公共和私營部門都認識到其戰略重要性。資金分配反映了這一領域日益增長的優先事項。",
		"科技與%s的交匯點提供了獨特的機遇和挑戰。平衡創新與倫理考量仍是利益相關者的核心關注點。",
		"歷史分析表明，%s已經歷了幾個變革階段。目前的發展似乎預示著我們處理這些問題方式的另一次重大轉變。",
	}

	// 根據語言選擇段落模板
	var paraTemplates []string
	if lang == "en" {
		paraTemplates = enParagraphs
	} else {
		paraTemplates = zhParagraphs
	}

	// 生成段落
	for i := 0; i < paragraphs; i++ {
		if i > 0 {
			content += "\n\n"
		}
		paraTemplate := paraTemplates[rand.Intn(len(paraTemplates))]
		para := fmt.Sprintf(paraTemplate, topic)
		content += para
	}

	return content
}

// 生成元標籤關鍵字
func getMetaKeywords(lang string, topicIndex int) string {
	enKeywords := []string{
		"climate change, global warming, environment, sustainability",
		"artificial intelligence, machine learning, deep learning, AI ethics",
		"renewable energy, solar power, wind energy, sustainability",
		"healthcare reform, medical innovation, patient care",
		"digital transformation, technology adoption, business innovation",
		"global trade, international commerce, economy, trade agreements",
		"cybersecurity, data protection, online safety, cyber threats",
		"space exploration, astronomy, Mars mission, satellites",
		"edtech, online learning, education innovation, remote education",
		"quantum computing, quantum technology, qubits, quantum supremacy",
		"economic recovery, financial growth, market rebound",
		"public health, disease prevention, healthcare system, wellness",
	}

	zhKeywords := []string{
		"氣候變遷, 全球暖化, 環境, 永續發展",
		"人工智能, 機器學習, 深度學習, AI倫理",
		"再生能源, 太陽能, 風能, 永續性",
		"醫療改革, 醫學創新, 患者護理",
		"數位轉型, 科技應用, 商業創新",
		"全球貿易, 國際商務, 經濟, 貿易協議",
		"網路安全, 資料保護, 線上安全, 網絡威脅",
		"太空探索, 天文學, 火星任務, 衛星",
		"教育科技, 線上學習, 教育創新, 遠程教育",
		"量子計算, 量子技術, 量子位元, 量子優勢",
		"經濟復甦, 財務增長, 市場反彈",
		"公共衛生, 疾病預防, 醫療系統, 健康",
	}

	if lang == "en" {
		return enKeywords[topicIndex%len(enKeywords)]
	} else {
		return zhKeywords[topicIndex%len(zhKeywords)]
	}
}

// 將標題轉換為 URL slug
func slugify(title string) string {
	// 簡單實現，實際應用中可能需要更複雜的處理
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	slug = strings.ReplaceAll(slug, ":", "")
	slug = strings.ReplaceAll(slug, ".", "")
	slug = strings.ReplaceAll(slug, ",", "")
	slug = strings.ReplaceAll(slug, "?", "")
	slug = strings.ReplaceAll(slug, "!", "")
	return slug
}

// 取兩個數的最小值
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func seedSettings(db *gorm.DB) {
	sets := []models.Setting{
		{Key: "site_name", Value: "GolangBlog", Type: "text", Group: "general"},
		{Key: "items_per_page", Value: "10", Type: "number", Group: "general"},
	}
	db.Create(&sets)
}

func ptrTime(t time.Time) *time.Time { return &t }
