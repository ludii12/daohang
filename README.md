# 🧭 个人导航站

一个 iOS 桌面风格的图标瀑布流导航网站，纯静态（HTML + CSS + JS），可一键部署到 **GitHub Pages** 或 **Cloudflare Pages**。

## ✨ 特性

- 📱 **响应式设计** — 手机 / 平板 / 桌面自动适配
- 🎨 **iOS 桌面风格** — 卡片瀑布流 + 毛玻璃质感
- 🔍 **多搜索引擎** — Google / Bing / 百度 / DuckDuckGo 一键切换
- 🌗 **明暗主题** — 跟随系统或手动切换，自动记忆
- 🧩 **数据驱动** — 改 `config.js` 即可增删网站，无需动代码
- 🔤 **智能图标** — 自动抓取网站 favicon，失败时显示彩色首字母
- ⚡ **零依赖** — 不引入任何框架/库，加载极快

## 📁 文件结构

```
gml/
├── index.html    # 页面结构
├── style.css     # 样式（含响应式 + 暗黑模式）
├── config.js     # ⭐ 网站数据配置（增删改在这里）
├── render.js     # 渲染逻辑（一般不用动）
└── README.md
```

## 🛠️ 自定义内容

打开 `config.js`，按已有格式增删即可：

```js
{ name: "网站名", url: "https://example.com", icon: "" }
```

- `icon` 留空 → 自动用 Google favicon 服务抓取
- `icon` 填图片地址 → 用你指定的图标

## 🚀 部署到 GitHub Pages

1. 在 GitHub 新建一个仓库（例如 `nav`）
2. 把本目录所有文件推上去：
   ```bash
   git init
   git add .
   git commit -m "init navigation site"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/nav.git
   git push -u origin main
   ```
3. 仓库 **Settings → Pages → Source** 选择 `main` 分支 `/root`
4. 等待 1~2 分钟，访问 `https://<你的用户名>.github.io/nav/`

## ☁️ 部署到 Cloudflare Pages

1. 先把代码推到 GitHub（同上）
2. 登录 Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**
3. 选中刚推送的仓库，构建配置如下：
   - **构建命令**：留空（纯静态无需构建）
   - **构建输出目录**：`/`（或 `.`）
4. 点 **Save and Deploy**，几十秒后拿到 `https://<项目名>.pages.dev` 域名
5. （可选）在自定义域名里绑定你自己的域名，CF 自动给 HTTPS

## 💡 本地预览

任选一种在本地起服务：

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

浏览器打开 `http://localhost:8000` 即可。

> ⚠️ 直接双击 `index.html` 用 `file://` 打开也能看效果，但部分浏览器会限制 file 协议下的资源加载，推荐用上面的方式。

## 📝 License

MIT
