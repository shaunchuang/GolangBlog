# 第一階段：Build Vite 專案
FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 第二階段：Serve 靜態檔案
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 創建 robots.txt 和 sitemap.xml 如果不存在
RUN mkdir -p /usr/share/nginx/html \
    && if [ ! -f /usr/share/nginx/html/robots.txt ]; then \
       echo "User-agent: *\nAllow: /\nSitemap: https://blog.sj-sphere.com/sitemap.xml" > /usr/share/nginx/html/robots.txt; \
    fi \
    && if [ ! -f /usr/share/nginx/html/sitemap.xml ]; then \
       echo '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>' > /usr/share/nginx/html/sitemap.xml; \
    fi

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
