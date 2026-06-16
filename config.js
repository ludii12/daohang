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
      title: "常用",
      sites: [
        { name: "Google",   url: "https://www.google.com",   icon: "https://www.google.com/favicon.ico" },
        { name: "百度",     url: "https://www.baidu.com",    icon: "https://www.baidu.com/favicon.ico" },
        { name: "Bing",     url: "https://www.bing.com",     icon: "https://www.bing.com/favicon.ico" },
        { name: "Gmail",    url: "https://mail.google.com",  icon: "https://mail.google.com/favicon.ico" },
        { name: "QQ邮箱",   url: "https://mail.qq.com",      icon: "https://mail.qq.com/favicon.ico" },
        { name: "YouTube",  url: "https://www.youtube.com",  icon: "https://www.youtube.com/favicon.ico" },
        { name: "B站",      url: "https://www.bilibili.com", icon: "https://www.bilibili.com/favicon.ico" },
        { name: "微博",     url: "https://weibo.com",        icon: "https://weibo.com/favicon.ico" },
      ],
    },
    {
      title: "社交通讯",
      sites: [
        { name: "微信网页", url: "https://wx.qq.com",            icon: "https://wx.qq.com/favicon.ico" },
        { name: "知乎",    url: "https://www.zhihu.com",        icon: "https://www.zhihu.com/favicon.ico" },
        { name: "小红书",  url: "https://www.xiaohongshu.com",  icon: "https://www.xiaohongshu.com/favicon.ico" },
        { name: "抖音",    url: "https://www.douyin.com",       icon: "https://www.douyin.com/favicon.ico" },
        { name: "豆瓣",    url: "https://www.douban.com",       icon: "https://www.douban.com/favicon.ico" },
        { name: "X",       url: "https://x.com",                icon: "https://x.com/favicon.ico" },
      ],
    },
    {
      title: "工具",
      sites: [
        { name: "翻译",     url: "https://fanyi.baidu.com",     icon: "https://fanyi.baidu.com/favicon.ico" },
        { name: "天气",     url: "https://weather.com",         icon: "" },
        { name: "地图",     url: "https://map.baidu.com",       icon: "https://map.baidu.com/favicon.ico" },
        { name: "网盘",     url: "https://pan.baidu.com",       icon: "https://pan.baidu.com/favicon.ico" },
        { name: "快递查询", url: "https://www.kuaidi100.com",   icon: "https://www.kuaidi100.com/favicon.ico" },
        { name: "在线工具", url: "https://tool.lu",             icon: "https://tool.lu/favicon.ico" },
      ],
    },
    {
      title: "购物",
      sites: [
        { name: "淘宝",    url: "https://www.taobao.com",     icon: "https://www.taobao.com/favicon.ico" },
        { name: "京东",    url: "https://www.jd.com",         icon: "https://www.jd.com/favicon.ico" },
        { name: "拼多多",  url: "https://www.pinduoduo.com",  icon: "https://www.pinduoduo.com/favicon.ico" },
        { name: "天猫",    url: "https://www.tmall.com",      icon: "https://www.tmall.com/favicon.ico" },
        { name: "苏宁",    url: "https://www.suning.com",     icon: "https://www.suning.com/favicon.ico" },
      ],
    },
    {
      title: "资讯阅读",
      sites: [
        { name: "今日头条", url: "https://www.toutiao.com",    icon: "https://www.toutiao.com/favicon.ico" },
        { name: "网易新闻", url: "https://news.163.com",       icon: "https://news.163.com/favicon.ico" },
        { name: "腾讯新闻", url: "https://news.qq.com",        icon: "https://news.qq.com/favicon.ico" },
        { name: "微信读书", url: "https://weread.qq.com",      icon: "https://weread.qq.com/favicon.ico" },
      ],
    },
  ],

  /* ---------- 搜索引擎配置（顶部切换） ---------- */
  searchEngines: [
    { name: "Google", url: "https://www.google.com/search?q=",  param: "q" },
    { name: "Bing",   url: "https://www.bing.com/search?q=",    param: "q" },
    { name: "百度",   url: "https://www.baidu.com/s?wd=",       param: "wd" },
    { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=",    param: "q" },
  ],
};
