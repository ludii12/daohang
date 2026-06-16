/**
 * 渲染逻辑 v2
 *  - 多源图标 fallback：自定义 → favicon.im → 站点直链 → 首字母
 *  - 实时时钟与问候语
 *  - 卡片错落入场动画
 *  - 搜索引擎切换、主题切换
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

  function getDomain(url) {
    try { return new URL(url).hostname; } catch (e) { return ""; }
  }

  function getFirstChar(name) {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  }

  // 基于字符串 hash 生成渐变色
  function hashColor(str) {
    var hue = 0;
    for (var i = 0; i < str.length; i++) {
      hue = (hue * 31 + str.charCodeAt(i)) % 360;
    }
    return "linear-gradient(135deg, hsl(" + hue + ", 65%, 55%), hsl(" + ((hue + 40) % 360) + ", 70%, 45%))";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // 为站点生成图标候选源数组（依次尝试）
  // 优先级：用户自定义 > favicon.im > 站点直链 > DuckDuckGo
  function buildIconSources(site) {
    var domain = getDomain(site.url);
    var sources = [];
    // 1. 用户自定义（最高优先级，本地或远程均可）
    if (site.icon) sources.push(site.icon);
    if (domain) {
      // 2. favicon.im（国内可访问，支持高清）
      sources.push("https://favicon.im/" + domain + "?larger=true");
      // 3. 站点根目录 favicon（常见路径）
      sources.push("https://" + domain + "/favicon.ico");
      // 4. DuckDuckGo 图标服务
      sources.push("https://icons.duckduckgo.com/ip3/" + domain + ".ico");
    }
    return sources;
  }

  // 预加载一张图片，成功（onload）则回调 true，失败/超时则 false
  function tryLoadImage(src, cb) {
    var img = new Image();
    var done = false;
    function finish(ok) { if (!done) { done = true; cb(ok); } }
    img.onload = function () {
      // 过滤掉 1x1 透明占位图（部分服务对无效域名返回极小图）
      finish(img.naturalWidth > 1);
    };
    img.onerror = function () { finish(false); };
    img.src = src;
    // 超时兜底（4 秒）
    setTimeout(function () { finish(false); }, 4000);
  }

  /* ---------- 渲染图标卡片 ---------- */
  function renderApps() {
    var totalSites = 0;
    var catFrag = document.createDocumentFragment();

    config.categories.forEach(function (cat, catIdx) {
      var section = document.createElement("section");
      section.className = "category";
      section.style.animationDelay = (catIdx * 0.08) + "s";

      var title = document.createElement("h2");
      title.className = "category-title";
      title.textContent = cat.title;
      section.appendChild(title);

      var gridWrap = document.createElement("div");
      gridWrap.className = "category-grid";

      cat.sites.forEach(function (site, siteIdx) {
        totalSites++;
        var sources = buildIconSources(site);
        var delay = (catIdx * 0.08 + siteIdx * 0.03).toFixed(3);

        var a = document.createElement("a");
        a.className = "app-item";
        a.href = site.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.title = site.name;
        a.style.animationDelay = delay + "s";

        var iconBox = document.createElement("div");
        iconBox.className = "app-icon";
        iconBox.style.background = hashColor(site.name);

        var letter = document.createElement("span");
        letter.className = "app-letter";
        letter.textContent = getFirstChar(site.name);
        iconBox.appendChild(letter);

        var img = document.createElement("img");
        img.alt = site.name;
        img.loading = "lazy";
        img.referrerPolicy = "no-referrer";
        img.style.opacity = "0";
        img.style.transition = "opacity .3s";

        // 依次尝试候选源，成功则显示
        var srcIdx = 0;
        function tryNext() {
          if (srcIdx >= sources.length) {
            img.remove(); // 全部失败，保留字母层
            return;
          }
          var src = sources[srcIdx++];
          tryLoadImage(src, function (ok) {
            if (ok) {
              img.src = src;
              img.onload = function () {
                img.style.opacity = "1";
                letter.style.display = "none";
                // 有真实图片：去掉背景框、边框、阴影、高光
                iconBox.style.background = "none";
                iconBox.style.border = "none";
                iconBox.style.boxShadow = "none";
                iconBox.classList.add("has-image");
              };
              img.onerror = tryNext;
            } else {
              tryNext();
            }
          });
        }
        tryNext();

        iconBox.appendChild(img);

        var name = document.createElement("span");
        name.className = "app-name";
        name.textContent = site.name;

        a.appendChild(iconBox);
        a.appendChild(name);
        gridWrap.appendChild(a);
      });

      section.appendChild(gridWrap);
      catFrag.appendChild(section);
    });

    grid.innerHTML = "";
    grid.appendChild(catFrag);
    document.getElementById("siteCount").textContent = "📊 " + totalSites + " 个站点";
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

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = searchInput.value.trim();
    if (!q) return;

    if (/^https?:\/\//i.test(q)) {
      window.open(q, "_blank", "noopener");
      return;
    }
    if (/^[\w-]+(\.[\w-]+)+/.test(q)) {
      window.open("https://" + q, "_blank", "noopener");
      return;
    }
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

  /* ---------- 实时时钟 + 问候语 ---------- */
  var clockEl = document.getElementById("clock");
  var clockDateEl = document.getElementById("clockDate");
  var greetingEl = document.getElementById("greeting");
  var footerClockEl = document.getElementById("footerClock");

  var weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function updateClock() {
    var now = new Date();
    var hh = pad(now.getHours());
    var mm = pad(now.getMinutes());
    var timeStr = hh + ":" + mm;

    clockEl.textContent = timeStr;
    footerClockEl.textContent = "⏱ " + timeStr;
    clockDateEl.textContent =
      now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日 · " + weekDays[now.getDay()];

    var h = now.getHours();
    var greet = "夜深了";
    if      (h >= 5  && h < 9)  greet = "早上好";
    else if (h >= 9  && h < 12) greet = "上午好";
    else if (h >= 12 && h < 14) greet = "中午好";
    else if (h >= 14 && h < 18) greet = "下午好";
    else if (h >= 18 && h < 23) greet = "晚上好";
    greetingEl.textContent = greet + " 👋";
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* ---------- 启动 ---------- */
  renderApps();
  renderEngines();

  if (window.matchMedia("(min-width: 768px)").matches) {
    searchInput.focus();
  }
})();
