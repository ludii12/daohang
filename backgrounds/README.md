# 📁 backgrounds 目录

把你的背景图片放到这个目录里，然后在 `render.js` 里用相对路径引用：
大概在39行

```js
{"backgrounds/bg-circles-soft.png"}
```

## ✅ 支持的格式
- `.png` —— 建议用 1920×1080 或更大，支持透明

## 📐 推荐尺寸
- **长方形**：16:9，例如 1920×1080

## 💡 命名建议
用英文或拼音命名，避免中文和空格：
- ✅ `gemini.svg`、`baidu.png`、`github.svg`
- ❌ `谷歌.svg`、`my logo.png`

## 🚀 为什么用本地图标更好？
1. **不依赖图床** —— 图床挂了/迁移了图标也不会丢
2. **加载更快** —— 和网站同域，无跨域、无 DNS 额外查询
3. **可以离线** —— 部署到 GitHub/CF 后图标跟着一起走
4. **可控** —— 你想换背景直接替换文件即可

## 📥 图标哪里找？
- [blankimage.net](https://blankimage.net/zh/plain-image) —— 免费生成纯色背景（黑/白 SVG）
