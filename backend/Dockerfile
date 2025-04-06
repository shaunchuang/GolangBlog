# 第一階段：Build Golang 程式
FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o app

# 第二階段：極小運行環境
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/app .
COPY .env .
EXPOSE 8080
CMD ["./app"]
