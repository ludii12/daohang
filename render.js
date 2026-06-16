/**
 * 渲染逻辑：图标卡片、搜索引擎切换、主题切换
 */
(function () {
  "use strict";

  var config = window.SITE_CONFIG || (typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : null);
  if (!config) {
    console.error("[nav] SITE_CONFIG 未加载，请检查 config.js 是否正确引入");
    return;
  }
  var grid = document.getElementById("appsGrid");
  var engineSwitch = document.getElementById("engineSwitch");
  var searchForm = document.getElementById("searchForm");
  var searchInput = document.getElementById("searchInput");

  /* ---------- 工具函数 ---------- */

  // 从 URL 提取域名
  function getDomain(url) {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return "";
    }
  }

  // 取首字符（中文取第一个字，英文取首字母大写）
  function getFirstChar(name) {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  }

  // 生成柔和的渐变背景色（基于字符串 hash）
  function hashColor(str) {
    var hue = 0;
    for (var i = 0; i < str.length; i++) {
      hue = (hue * 31 + str.charCodeAt(i)) % 360;
    }
    return "linear-gradient(135deg, hsl(" + hue + ", 65%, 55%), hsl(" + ((hue + 40) % 360) + ", 70%, 45%))";
  }

  /* ---------- 渲染图标卡片 ---------- */
  function renderApps() {
    var html = "";
    config.categories.forEach(function (cat) {
      html += '<section class="category">';
      html += '<h2 class="category-title">' + escapeHtml(cat.title) + "</h2>";
      cat.sites.forEach(function (site) {
        var domain = getDomain(site.url);
        // 图标地址：优先用自定义，否则用 Google favicon 服务
        var iconSrc = site.icon
          ? site.icon
          : "https://www.google.com/s2/favicons?domain=" + domain + "&sz=128";

        html += '<a class="app-item" href="' + site.url + '" target="_blank" rel="noopener" title="' + escapeHtml(site.name) + '">';
        html += '<div class="app-icon" style="background:' + hashColor(site.name) + '">';
        // 首字母层（图片加载失败时显示）
        html += '<span class="app-letter">' + getFirstChar(site.name) + "</span>";
        // 图标图片（加载成功则覆盖字母层）
        html += '<img src="' + iconSrc + '" alt="' + escapeHtml(site.name) + '" loading="lazy" referrerpolicy="no-referrer" ' +
                'onerror="this.remove()" onload="this.style.opacity=1" style="opacity:0;transition:opacity .2s" />';
        html += "</div>";
        html += '<span class="app-name">' + escapeHtml(site.name) + "</span>";
        html += "</a>";
      });
      html += "</section>";
    });
    grid.innerHTML = html;
  }

  // HTML 转义
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- 搜索引擎切换 ---------- */
  var currentEngine = config.searchEngines[0];

  function renderEngines() {
    engineSwitch.innerHTML = "";
    config.searchEngines.forEach(function (eng, idx) {
      var btn = document.createElement("button");
      btn.className = "engine-btn" + (idx === 0 ? " active" : "");
      btn.textContent = eng.name;
      btn.addEventListener("click", function () {
        currentEngine = eng;
        document.querySelectorAll(".engine-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        searchInput.focus();
      });
      engineSwitch.appendChild(btn);
    });
  }

  // 搜索表单提交：切换引擎时动态改 action 和参数名
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = searchInput.value.trim();
    if (!q) return;

    // 如果输入的是网址，直接跳转
    if (/^https?:\/\//i.test(q)) {
      window.open(q, "_blank", "noopener");
      return;
    }
    if (/^[\w-]+(\.[\w-]+)+/.test(q)) {
      window.open("https://" + q, "_blank", "noopener");
      return;
    }

    // 否则用当前引擎搜索
    var searchUrl = currentEngine.url + encodeURIComponent(q);
    window.open(searchUrl, "_blank", "noopener");
  });

  /* ---------- 主题切换 ---------- */
  var themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  // 初始化主题：优先本地存储，其次系统偏好
  var savedTheme = localStorage.getItem("nav-theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }

  themeToggle.addEventListener("click", function () {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    var next = isDark ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("nav-theme", next);
  });

  /* ---------- 启动 ---------- */
  renderApps();
  renderEngines();

  // 自动聚焦搜索框（桌面端）
  if (window.matchMedia("(min-width: 768px)").matches) {
    searchInput.focus();
  }
})();
