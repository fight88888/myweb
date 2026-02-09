# myweb - C++ 学习博客

这是一个静态博客网站，用于学习 C++、操作系统和计算机网络相关知识。

## 功能特点

- 📚 三栏布局：文章导航 + 内容展示 + 目录导航
- 🔍 全文搜索功能
- 📱 响应式设计，支持移动端
- 📝 Markdown 文档渲染
- 🎨 美观的界面设计

## 本地运行

由于使用了 fetch API 加载 Markdown 文件，需要通过 HTTP 服务器运行。

### 方法 1: 使用 Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### 方法 2: 使用 Node.js

```bash
# 安装 http-server
npm install -g http-server

# 运行
http-server -p 8000
```

### 方法 3: 使用 VS Code

1. 安装 "Live Server" 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

然后访问：**http://localhost:8000**

## GitHub Pages 部署

### 1. 创建 GitHub 仓库

在 GitHub 上创建一个名为 `myweb` 的仓库

### 2. 初始化并推送

```bash
cd myweb
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/myweb.git
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 进入仓库的 **Settings**
2. 点击左侧的 **Pages**
3. 在 **Source** 下选择 **Deploy from a branch**
4. 选择 **main** 分支，文件夹选择 **/(root)**
5. 点击 **Save**

等待几分钟，你的网站将在以下地址可用：
```
https://你的用户名.github.io/myweb/
```

## 项目结构

```
myweb/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript 脚本
├── README.md          # 项目说明
└── docs/               # 文档目录
    ├── cpp/            # C++ 文档
    ├── os/             # 操作系统文档
    └── network/        # 计算机网络文档
```

## 添加新文章

1. 在 `docs` 目录下对应的分类文件夹中创建新的 `.md` 文件
2. 在 `script.js` 中的 `articles` 对象中添加文章信息：

```javascript
cpp: [
    { title: '文章标题', file: 'cpp/your-file.md' },
    // ... 其他文章
]
```

## 常见问题

### 文章无法加载

1. 确保使用 HTTP 服务器运行，而不是直接打开 HTML 文件
2. 检查浏览器控制台是否有错误（按 F12 打开开发者工具）
3. 确认 Markdown 文件路径正确

### 搜索功能不工作

1. 确保 `script.js` 已正确加载
2. 检查浏览器控制台是否有 JavaScript 错误

### GitHub Pages 404 错误

1. 确认文件已推送到 `main` 分支：`git push origin main`
2. 检查 GitHub Pages 设置：Settings → Pages → Branch: main, Folder: /(root)
3. 等待 1-3 分钟让 GitHub Pages 完成部署
4. 确认文件名大小写正确（GitHub Pages 区分大小写）

## 技术栈

- HTML5
- CSS3
- Vanilla JavaScript
- Marked.js (Markdown 解析)

## 许可证

MIT License
