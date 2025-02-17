# 1. Node.js を使ってビルド
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# 2. 軽量な Nginx イメージを使って公開
FROM nginx:alpine

# React のビルドファイルを Nginx の公開フォルダにコピー
COPY --from=build /app/build /usr/share/nginx/html

# Nginx を起動
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
