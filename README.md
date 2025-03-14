cat <<EOF > README.md
# My Express App

## 📌 项目简介
这是一个简单的 Express.js 项目示例，支持快速搭建 Web 服务器。

## 🚀 安装步骤

1. **安装依赖**
   \`\`\`bash
   npm install
   \`\`\`

2. **启动服务**
   \`\`\`bash
   node index.js
   \`\`\`
   然后访问 [http://localhost:3000](http://localhost:3000)


 3. **初始化创建表名称**
   \`\`\`bash
  可以参照  db文件夹中initDB文件 去初始化表如果有表就不创建 否则就创建
   \`\`\`

## 📁 项目结构
\`\`\`
/my-express-app
│
├── node_modules
│
├── index.js         # 主程序入口
│
├── package.json     # 项目依赖
│
└── README.md        # 说明文档
\`\`\`

## 🔥 功能展示
- 基础路由
- 返回 Hello, Express!

## 🛠️ 技术栈
- Node.js
- Express

## 📌 作者
by 你的名字
EOF
