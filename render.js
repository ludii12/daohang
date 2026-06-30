(function () {
  "use strict";

  var config = window.SITE_CONFIG || (typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : null);
  if (!config) {
    console.error("[nav] SITE_CONFIG 未加载，请检查 config.js 是否正确引入");
    return;
  }

  var siteMenu = document.getElementById("siteMenu");
  var engineSwitch = document.getElementById("engineSwitch");
  var searchForm = document.getElementById("searchForm");
  var searchInput = document.getElementById("searchInput");
  var backgroundImages = [
    "backgrounds/bg-triangle.png",
    "backgrounds/bg-circles-bright.png",
    "backgrounds/bg-gradient-purple.png",
    "backgrounds/bg-gradient-warm.png",
    "backgrounds/bg-circles-soft.png",
  ];

  function initBackground() {
    var randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    document.documentElement.style.setProperty("--bg-image", "url('" + randomImage + "')");

    window.addEventListener("pointermove", function (e) {
      document.documentElement.style.setProperty("--cursor-x", e.clientX + "px");
      document.documentElement.style.setProperty("--cursor-y", e.clientY + "px");
    }, { passive: true });
  }

  function weatherLabel(code) {
    if (code === 0) return "晴";
    if ([1, 2, 3].indexOf(code) >= 0) return "多云";
    if ([45, 48].indexOf(code) >= 0) return "有雾";
    if ([51, 53, 55, 56, 57].indexOf(code) >= 0) return "毛毛雨";
    if ([61, 63, 65, 66, 67, 80, 81, 82].indexOf(code) >= 0) return "下雨";
    if ([71, 73, 75, 77, 85, 86].indexOf(code) >= 0) return "下雪";
    if ([95, 96, 99].indexOf(code) >= 0) return "雷雨";
    return "天气";
  }

  function updateWeatherView(place, temp, label) {
    var placeEl = document.getElementById("weatherPlace");
    var tempEl = document.getElementById("weatherTemp");
    var textEl = document.getElementById("weatherText");
    if (!placeEl || !tempEl || !textEl) return;
    placeEl.textContent = place || "当前位置";
    tempEl.textContent = (typeof temp === "number" ? Math.round(temp) : "--") + "°";
    textEl.textContent = label || "天气";
  }

  function fetchWeatherByLocation(location) {
    var url =
      "https://api.open-meteo.com/v1/forecast?latitude=" + encodeURIComponent(location.latitude) +
      "&longitude=" + encodeURIComponent(location.longitude) +
      "&current=temperature_2m,weather_code&timezone=auto";

    return fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var current = data.current || {};
        updateWeatherView(location.place, current.temperature_2m, weatherLabel(current.weather_code));
      });
  }

  function initWeather() {
    updateWeatherView("定位中", null, "天气加载中");

    fetch("https://ipwho.is/")
      .then(function (res) { return res.json(); })
      .then(function (geo) {
        if (!geo || geo.success === false || typeof geo.latitude !== "number" || typeof geo.longitude !== "number") {
          throw new Error("IP 定位失败");
        }
        return fetchWeatherByLocation({
          latitude: geo.latitude,
          longitude: geo.longitude,
          place: geo.city || geo.region || geo.country || "当前位置",
        });
      })
      .catch(function () {
        return fetchWeatherByLocation({
          latitude: 31.2304,
          longitude: 121.4737,
          place: "上海",
        }).catch(function () {
          updateWeatherView("当前位置", null, "天气不可用");
        });
      });
  }

  function getDomain(url) {
    try { return new URL(url).hostname; } catch (e) { return ""; }
  }

  function getFirstChar(name) {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  }

  function hashColor(str) {
    var hue = 0;
    for (var i = 0; i < str.length; i++) {
      hue = (hue * 31 + str.charCodeAt(i)) % 360;
    }
    return "linear-gradient(135deg, hsl(" + hue + ", 65%, 55%), hsl(" + ((hue + 40) % 360) + ", 70%, 45%))";
  }

  function buildIconSources(site) {
    var domain = getDomain(site.url);
    var sources = [];
    if (site.icon) sources.push(site.icon);
    if (domain) {
      sources.push("https://favicon.im/" + domain + "?larger=true");
      sources.push("https://" + domain + "/favicon.ico");
      sources.push("https://icons.duckduckgo.com/ip3/" + domain + ".ico");
    }
    return sources;
  }

  function tryLoadImage(src, cb) {
    var img = new Image();
    var done = false;
    function finish(ok) { if (!done) { done = true; cb(ok); } }
    img.onload = function () { finish(img.naturalWidth > 1); };
    img.onerror = function () { finish(false); };
    img.src = src;
    setTimeout(function () { finish(false); }, 4000);
  }

  function hydrateIcon(iconBox, site) {
    var sources = buildIconSources(site);
    var letter = iconBox.querySelector(".site-letter");
    var img = document.createElement("img");
    img.alt = site.name;
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";

    var srcIdx = 0;
    function tryNext() {
      if (srcIdx >= sources.length) return;
      var src = sources[srcIdx++];
      tryLoadImage(src, function (ok) {
        if (!ok) {
          tryNext();
          return;
        }
        img.src = src;
        img.onload = function () {
          iconBox.classList.add("has-image");
          letter.style.display = "none";
        };
        img.onerror = tryNext;
        iconBox.appendChild(img);
      });
    }
    tryNext();
  }

  function closeOtherMenus(current) {
    document.querySelectorAll(".menu-group.open").forEach(function (group) {
      if (group !== current) {
        group.classList.remove("open");
        var button = group.querySelector(".menu-trigger");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function renderSiteMenu() {
    var frag = document.createDocumentFragment();

    config.categories.forEach(function (cat, catIdx) {
      var group = document.createElement("div");
      group.className = "menu-group";
      group.style.animationDelay = (catIdx * 0.06) + "s";

      var button = document.createElement("button");
      button.className = "menu-trigger";
      button.type = "button";
      button.setAttribute("aria-expanded", "false");
      button.textContent = cat.title;

      var panel = document.createElement("div");
      panel.className = "submenu";

      cat.sites.forEach(function (site) {
        var item = document.createElement("a");
        item.className = "submenu-item";
        item.href = site.url;
        item.target = "_blank";
        item.rel = "noopener";
        item.title = site.name;

        var icon = document.createElement("span");
        icon.className = "site-icon";
        icon.style.background = hashColor(site.name);

        var letter = document.createElement("span");
        letter.className = "site-letter";
        letter.textContent = getFirstChar(site.name);
        icon.appendChild(letter);
        hydrateIcon(icon, site);

        var text = document.createElement("span");
        text.className = "site-name";
        text.textContent = site.name;

        item.appendChild(icon);
        item.appendChild(text);
        panel.appendChild(item);
      });

      button.addEventListener("click", function () {
        var nextOpen = !group.classList.contains("open");
        closeOtherMenus(group);
        group.classList.toggle("open", nextOpen);
        button.setAttribute("aria-expanded", String(nextOpen));
      });

      group.addEventListener("mouseenter", function () {
        closeOtherMenus(group);
      });

      group.appendChild(button);
      group.appendChild(panel);
      frag.appendChild(group);
    });

    siteMenu.innerHTML = "";
    siteMenu.appendChild(frag);
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".menu-group")) closeOtherMenus(null);
  });

  var currentEngine = config.searchEngines[0];

  function renderEngines() {
    engineSwitch.innerHTML = "";
    config.searchEngines.forEach(function (eng, idx) {
      var btn = document.createElement("button");
      btn.className = "engine-btn" + (idx === 0 ? " active" : "");
      btn.type = "button";
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
    window.open(currentEngine.url + encodeURIComponent(q), "_blank", "noopener");
  });

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

  var clockEl = document.getElementById("clock");
  var clockDateEl = document.getElementById("clockDate");
  var greetingEl = document.getElementById("greeting");
  var weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function updateClock() {
    var now = new Date();
    var hh = pad(now.getHours());
    var mm = pad(now.getMinutes());
    var timeStr = hh + ":" + mm;

    clockEl.textContent = timeStr;
    clockDateEl.textContent =
      now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日 · " + weekDays[now.getDay()];

    var h = now.getHours();
    var greet = "夜深了";
    if      (h >= 5  && h < 9)  greet = "早上好";
    else if (h >= 9  && h < 12) greet = "上午好";
    else if (h >= 12 && h < 14) greet = "中午好";
    else if (h >= 14 && h < 18) greet = "下午好";
    else if (h >= 18 && h < 23) greet = "晚上好";
    greetingEl.textContent = greet;
  }

  initBackground();
  initWeather();
  updateClock();
  setInterval(updateClock, 1000);
  renderSiteMenu();
  renderEngines();

  if (window.matchMedia("(min-width: 768px)").matches) {
    searchInput.focus();
  }
})();
