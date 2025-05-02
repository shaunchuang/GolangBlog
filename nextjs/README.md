# SJ Sphere News 新聞網站前端

這是 SJ Sphere 多語言新聞網站的 Next.js 前端專案，使用 Next.js 15+、TypeScript、Tailwind CSS 和國際化 (i18n) 功能實現。

## 專案特色

- 使用 Next.js 15+ 與 App Router 實現高性能 SSR/SSG 混合渲染
- 支援 11 種語言的國際化設計：英文、泰文、越南文、印尼語、韓文、日文和多種中文變體
- 響應式設計，適配從手機到桌面的各種裝置
- 使用 Tailwind CSS 實現現代化 UI 設計
- 針對 SEO 優化的元數據和結構化數據
- 整合 FontAwesome 圖標庫實現豐富視覺效果

## 本地開發

### 環境需求

- Node.js 18+ (推薦 20+)
- npm 或 yarn 或 pnpm

### 安裝依賴

```bash
npm install
# 或
yarn
# 或
pnpm install
```

### 啟動開發伺服器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

應用將在 [http://localhost:3000](http://localhost:3000) 運行，並自動重定向到帶有語言前綴的 /zh-TW/home。

## 項目結構

- `src/app/` - Next.js 應用路由和頁面
  - `[locale]/` - 國際化路由
    - `home/` - 首頁
    - `news/` - 新聞詳情頁
    - `category/` - 分類頁面
  - `components/` - 共用組件
- `src/lib/` - 工具函數和API配置
- `messages/` - 多語言翻譯檔案
- `public/` - 靜態資源

## 部署

專案使用 Hetzner Cloud 和 k3s 進行容器化部署，同時整合 Prometheus 和 Grafana 進行監控和日誌管理。

## 域名和CDN

網站通過 Cloudflare 進行域名管理和CDN加速，主域名為 [news.sj-sphere.com](https://news.sj-sphere.com)。
