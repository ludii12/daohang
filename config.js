/**
 * ============================================================
 *  导航站配置文件 —— 改这里就能更新整个网站
 * ============================================================
 *
 *  添加新网站只需复制一个对象，字段说明：
 *    name : 显示名称（建议 ≤ 6 字）
 *    url  : 跳转链接
 *    icon : (可选) 图标图片地址。留空则自动显示首字母
 *
 *  快速获取图标：访问 https://www.google.com/s2/favicons?domain=xxx.com
 * ============================================================
 */

var SITE_CONFIG = {
  /* ---------- 搜索引擎（顶部切换按钮，可选保留） ---------- */
  // 引擎会动态注入，这里只保留结构

  /* ---------- 分类与网站 ---------- */
  categories: [
    {
      title: "个人的网站",
      sites: [
        { name: "奶娃",   url: "nw.bifang.shop",   icon: "https://www.picgo.net/image/coqui-color.16xzWu" },
        { name: "视频的下载",     url: "sp.bifang.shop",    icon: "https://www.picgo.net/image/xiaziasp.16xbgl" },
        { name: "随机刷视频",     url: "sjl.bifang.shop",     icon: "https://www.picgo.net/image/spp.16x25j" },
        { name: "日记",    url: "rj.bifang.shop",  icon: "https://www.picgo.net/image/rj.16xyZY" },
        { name: "计算器",   url: "jsq.bifang.shop",      icon: "https://www.picgo.net/image/jsq.16xXey" },
        { name: "白噪音",  url: "bzy.bifang.shop",  icon: "https://www.picgo.net/image/bzy.16xNWC" },
      ],
    },
    {
      title: "AI",
      sites: [
        { name: "Gemini", url: "https://gemini.google.com/app",            icon: "https://www.picgo.net/image/gemini-color.163F7J" },
        { name: "GPT",    url: "https://chatgpt.com",        icon: "https://www.picgo.net/image/openai.16mzWJ" },
        { name: "Claude",  url: "https://claude.ai",  icon: "https://www.picgo.net/image/claude-color.163hRm" },
        { name: "deepseek",    url: "https://www.douyin.com",       icon: "https://www.picgo.net/image/deepseek.16pm2J" },
        { name: "GLM",    url: "https://www.z.ai",       icon: "https://www.picgo.net/image/zai.16xSvb" },
        { name: "Mini Max",       url: "https://www.minimax.io/",                icon: "https://www.picgo.net/image/minimax-color.16xLGK" },
        { name: "Kimi",       url: "https://www.kimi.com/",                icon: "https://www.picgo.net/image/kimi-color.16pp3A" },
        { name: "千问",       url: "https://chat.qwen.ai",                icon: "https://www.picgo.net/image/qwen-color.16p3gd" },
      ],
    },
    {
      title: "工具",
      sites: [
        { name: "翻译",     url: "https://fanyi.baidu.com",     icon: "https://www.picgo.net/image/baidu-color.16ptHr" },
        { name: "在线工具", url: "https://toolknit.com",        icon: "https://toolknit.com/assets/img/favicon.svg" },
        { name: "图床", url: "https://www.picgo.net/",        icon: "https://origin.picgo.net/content/images/system/logo_1768644236618_5bcaf4.svg" },
        { name: "Github", url: "https://github.com/",        icon: "https://www.picgo.net/image/github.16xsf4" },
        { name: "Cloudflare", url: "https://dash.cloudflare.com/",        icon: "https://www.picgo.net/image/cloudflare-color.16xreq" },
        { name: "TRAE", url: "https://www.trae.cn/",        icon: "https://www.picgo.net/image/trae-color.16xdvh" },
        { name: "WorkBuddy", url: "https://www.codebuddy.cn/work/",        icon: "https://www.picgo.net/image/hunyuan-color.16x8Gp" },
        { name: "Zcode", url: "https://zcode.z.ai/cn/",        icon: "https://www.picgo.net/image/zhipu-color.16xtAG" },
        { name: "codex", url: "https://openai.com/codex/",        icon: "https://www.picgo.net/image/codex-color.16xQb6" },
        { name: "hermes", url: "https://hermes-studio.ai/",        icon: "https://www.picgo.net/image/hermesagent.16x1pw" },
      ],
    },
  ],

  /* ---------- 搜索引擎配置（顶部切换） ---------- */
  searchEngines: [
    { name: "Google", url: "https://www.google.com/search?q=",  param: "q" },
    { name: "Bing",   url: "https://www.bing.com/search?q=",    param: "q" },
    { name: "百度",   url: "https://www.baidu.com/s?wd=",       param: "wd" },
  ],
};
