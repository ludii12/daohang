# 📁 icons 目录

把你的图标图片放到这个目录里，然后在 `config.js` 里用相对路径引用：

```js
{ name: "奶娃", url: "https://nw.bifang.shop", icon: "icons/naiwa.svg" }
```

## ✅ 支持的格式
- `.svg` —— **最推荐**，矢量清晰，体积小，支持透明背景
- `.png` —— 建议用 128×128 或更大，支持透明
- `.jpg` —— 可用，但通常会有背景
- `.ico` —— 可用，老格式

## 📐 推荐尺寸
- **正方形**：1:1，例如 128×128
- SVG 的话任意尺寸都清晰（矢量）

## 💡 命名建议
用英文或拼音命名，避免中文和空格：
- ✅ `gemini.svg`、`baidu.png`、`github.svg`
- ❌ `谷歌.svg`、`my logo.png`

## 🚀 为什么用本地图标更好？
1. **不依赖图床** —— 图床挂了/迁移了图标也不会丢
2. **加载更快** —— 和网站同域，无跨域、无 DNS 额外查询
3. **可以离线** —— 部署到 GitHub/CF 后图标跟着一起走
4. **可控** —— 你想换图标直接替换文件即可

## 📥 图标哪里找？
- [iconify.design](https://iconify.design/) —— 几十万图标，可下载 SVG
- [simpleicons.org](https://simpleicons.org/) —— 主流品牌 logo（黑/白 SVG）
- 各官网通常右键 logo → "图片另存为"即可
