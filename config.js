/**
 * ============================================================
 *  导航站配置文件 —— 改这里就能更新整个网站
 * ============================================================
 *
 *  添加新网站只需复制一个对象，字段说明：
 *    name : 显示名称（建议 ≤ 6 字）
 *    url  : 跳转链接（必须带 https://）
 *    icon : 图标路径。推荐用本地路径，如 "icons/gemini.svg"
 *           - 留空 "" 则自动抓取网站 favicon
 *           - 全部失败则显示彩色首字母
 *
 *  📁 本地图标：把图片放进 icons/ 目录，然后引用：
 *           icon: "icons/你的图标.svg"
 *           支持格式：svg（推荐） / png / jpg / ico
 * ============================================================
 */

var SITE_CONFIG = {
  /* ---------- 分类与网站 ---------- */
  categories: [
    {
      title: "个人的网站",
      sites: [
        { name: "奶娃",       url: "https://nw.bifang.shop",   icon: "icons/naiwa.png" },
        { name: "视频下载",   url: "https://sp.bifang.shop",   icon: "icons/xiaziasp.png" },
        { name: "随机刷视频", url: "https://sjl.bifang.shop",  icon: "icons/ssp.png" },
        { name: "日记",       url: "https://rj.bifang.shop",   icon: "icons/rj.png" },
        { name: "计算器",     url: "https://jsq.bifang.shop",  icon: "icons/jsq.png" },
        { name: "白噪音",     url: "https://bzy.bifang.shop",  icon: "icons/bzy.png" },
      ],
    },
    {
      title: "AI",
      sites: [
        { name: "Gemini",   url: "https://gemini.google.com/app", icon: "icons/gemini-color.png" },
        { name: "GPT",      url: "https://chatgpt.com",           icon: "icons/openai.png" },
        { name: "Claude",   url: "https://claude.ai",             icon: "icons/claude-color.png" },
        { name: "DeepSeek", url: "https://chat.deepseek.com",     icon: "icons/deepseek-color.png" },
        { name: "GLM",      url: "https://chat.z.ai",             icon: "icons/zai.png" },
        { name: "MiniMax",  url: "https://www.minimax.io/",       icon: "icons/minimax-color.png" },
        { name: "Kimi",     url: "https://www.kimi.com/",         icon: "icons/kimi.png" },
        { name: "通义千问", url: "https://chat.qwen.ai",          icon: "icons/qwen-color.png" },
      ],
    },
    {
      title: "工具",
      sites: [
        { name: "翻译",       url: "https://fanyi.baidu.com",       icon: "icons/baidu-color.png" },
        { name: "工具箱",       url: "https://toolknit.com/",        icon: "icons/tk.png" },
        { name: "GitHub",     url: "https://github.com/",           icon: "icons/github.png" },
        { name: "Cloudflare", url: "https://dash.cloudflare.com/",  icon: "icons/cloudflare-color.png" },
        { name: "Trae",       url: "https://www.trae.cn/",          icon: "icons/trae-color.png" },
        { name: "WorkBuddy",  url: "https://www.codebuddy.cn/work/", icon: "icons/codebuddy-color.png" },
        { name: "ZCode",      url: "https://zcode.z.ai/cn/",        icon: "icons/zhipu-color.png" },
        { name: "Codex",      url: "https://openai.com/codex/",     icon: "icons/codex.png" },
        { name: "Hermes",     url: "https://hermes-studio.ai/",     icon: "icons/hermesagent.png" },
        { name: "息流",     url: "https://flowus.cn/",     icon: "icons/flowus.png" },
      ],
    },
  ],

  /* ---------- 搜索引擎配置（顶部切换） ---------- */
  searchEngines: [
    { name: "Google", url: "https://www.google.com/search?q=", param: "q" },
    { name: "Bing",   url: "https://www.bing.com/search?q=",   param: "q" },
    { name: "百度",   url: "https://www.baidu.com/s?wd=",      param: "wd" },
  ],
};
