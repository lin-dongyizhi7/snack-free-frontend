# 使用 Node.js 20 作为基础镜像
FROM node:20

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目的所有文件到工作目录
COPY . .

# 构建项目
RUN npm run build

# 暴露端口（如果你的应用需要监听端口）
EXPOSE 8080

# 启动命令（这里只是示例，具体根据你的项目启动方式调整）
CMD ["npm", "run", "serve"]