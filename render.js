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
  var siteSuggestions = document.getElementById("siteSuggestions");
  var editEntry = document.getElementById("editEntry");
  var editorModal = document.getElementById("editorModal");
  var editorClose = document.getElementById("editorClose");
  var editorAuth = document.getElementById("editorAuth");
  var editorPassword = document.getElementById("editorPassword");
  var editorAuthMessage = document.getElementById("editorAuthMessage");
  var editorWorkspace = document.getElementById("editorWorkspace");
  var siteEditorForm = document.getElementById("siteEditorForm");
  var editorSaveMessage = document.getElementById("editorSaveMessage");
  var categoryOptions = document.getElementById("categoryOptions");
  var newSiteName = document.getElementById("newSiteName");
  var newSiteUrl = document.getElementById("newSiteUrl");
  var newSiteCategory = document.getElementById("newSiteCategory");
  var newSiteIcon = document.getElementById("newSiteIcon");
  var newSiteAliases = document.getElementById("newSiteAliases");
  var customSiteList = document.getElementById("customSiteList");
  var syncMessage = document.getElementById("syncMessage");

  var CUSTOM_SITES_KEY = "nav-custom-sites-v1";
  var SITES_API = "/api/sites";
  var EDIT_PASSWORD = "12345678";
  var baseCategories = JSON.parse(JSON.stringify(config.categories || []));
  var customSites = [];
  var siteIndex = [];
  var currentEngine = config.searchEngines[0];
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

  function normalizeUrl(url) {
    var value = String(url || "").trim();
    if (!value) return "";
    if (!/^https?:\/\//i.test(value)) return "https://" + value;
    return value;
  }

  function normalizeAliases(value) {
    if (Array.isArray(value)) {
      return value
        .map(function (item) { return String(item || "").trim(); })
        .filter(Boolean);
    }

    return String(value || "")
      .split(/[,，、\n]/)
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function getFirstChar(name) {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  }

  function getStoredCustomSites() {
    try {
      var raw = localStorage.getItem(CUSTOM_SITES_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function setCustomSites(sites) {
    customSites = normalizeCustomSites(sites);
    localStorage.setItem(CUSTOM_SITES_KEY, JSON.stringify(customSites));
  }

  function normalizeCustomSites(sites) {
    if (!Array.isArray(sites)) return [];
    return sites
      .filter(function (site) {
        return site && site.name && site.url && site.category;
      })
      .map(function (site, index) {
        return {
          id: site.id || ("site-" + Date.now().toString(36) + "-" + index),
          name: String(site.name).trim(),
          url: normalizeUrl(site.url),
          category: String(site.category).trim(),
          icon: site.icon ? String(site.icon).trim() : "",
          aliases: normalizeAliases(site.aliases || site.keywords),
        };
      });
  }

  function applyCustomSites() {
    config.categories = JSON.parse(JSON.stringify(baseCategories));
    customSites.forEach(function (site) {
      var category = config.categories.find(function (cat) { return cat.title === site.category; });
      if (!category) {
        category = { title: site.category, sites: [] };
        config.categories.push(category);
      }
      category.sites.push({
        name: site.name,
        url: site.url,
        icon: site.icon || "",
        aliases: normalizeAliases(site.aliases),
        customId: site.id,
      });
    });
  }

  function renderCategoryOptions() {
    if (!categoryOptions) return;
    categoryOptions.innerHTML = "";
    config.categories.forEach(function (cat) {
      var option = document.createElement("option");
      option.value = cat.title;
      categoryOptions.appendChild(option);
    });
  }

  function buildSiteIndex() {
    siteIndex = [];
    config.categories.forEach(function (cat) {
      cat.sites.forEach(function (site) {
        siteIndex.push({
          category: cat.title,
          name: site.name,
          url: site.url,
          icon: site.icon,
          domain: getDomain(site.url),
          aliases: normalizeAliases(site.aliases),
          searchText: (site.name + " " + cat.title + " " + getDomain(site.url) + " " + normalizeAliases(site.aliases).join(" ")).toLowerCase(),
        });
      });
    });
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
        if (group._closeTimer) {
          clearTimeout(group._closeTimer);
          group._closeTimer = null;
        }
        group.classList.remove("open");
        var button = group.querySelector(".menu-trigger");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function openMenu(group, button) {
    if (group._closeTimer) {
      clearTimeout(group._closeTimer);
      group._closeTimer = null;
    }
    closeOtherMenus(group);
    group.classList.add("open");
    button.setAttribute("aria-expanded", "true");
  }

  function scheduleCloseMenu(group, button) {
    if (group._closeTimer) clearTimeout(group._closeTimer);
    group._closeTimer = setTimeout(function () {
      group.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      group._closeTimer = null;
    }, 1500);
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
        if (nextOpen) openMenu(group, button);
        else scheduleCloseMenu(group, button);
      });

      group.addEventListener("mouseenter", function () { openMenu(group, button); });
      group.addEventListener("mouseleave", function () { scheduleCloseMenu(group, button); });
      panel.addEventListener("mouseenter", function () { openMenu(group, button); });
      panel.addEventListener("mouseleave", function () { scheduleCloseMenu(group, button); });

      group.appendChild(button);
      group.appendChild(panel);
      frag.appendChild(group);
    });

    siteMenu.innerHTML = "";
    siteMenu.appendChild(frag);
  }

  function renderCustomSiteList() {
    if (!customSiteList) return;
    customSiteList.innerHTML = "";

    if (!customSites.length) {
      var empty = document.createElement("div");
      empty.className = "custom-empty";
      empty.textContent = "还没有自定义网站";
      customSiteList.appendChild(empty);
      return;
    }

    customSites.forEach(function (site) {
      var row = document.createElement("div");
      row.className = "custom-site-row";

      var name = document.createElement("span");
      name.className = "custom-site-name";
      name.textContent = site.name + " · " + site.category;

      var button = document.createElement("button");
      button.type = "button";
      button.textContent = "删除";
      button.addEventListener("click", function () {
        var next = customSites.filter(function (item) { return item.id !== site.id; });
        setCustomSites(next);
        refreshSites();
        syncSitesToApi("删除网站：" + site.name);
      });

      row.appendChild(name);
      row.appendChild(button);
      customSiteList.appendChild(row);
    });
  }

  function refreshSites() {
    applyCustomSites();
    buildSiteIndex();
    renderSiteMenu();
    renderCategoryOptions();
    renderCustomSiteList();
    renderSuggestions();
  }

  function getSiteMatches(query) {
    var q = query.trim().toLowerCase();
    if (!q) return [];
    return siteIndex
      .filter(function (site) { return site.searchText.indexOf(q) >= 0; })
      .sort(function (a, b) {
        var an = a.name.toLowerCase();
        var bn = b.name.toLowerCase();
        var aStarts = an.indexOf(q) === 0 ? 0 : 1;
        var bStarts = bn.indexOf(q) === 0 ? 0 : 1;
        return aStarts - bStarts || an.length - bn.length;
      })
      .slice(0, 5);
  }

  function renderSuggestions() {
    if (!siteSuggestions) return;
    var matches = getSiteMatches(searchInput.value);
    siteSuggestions.innerHTML = "";
    siteSuggestions.classList.toggle("visible", matches.length > 0);

    matches.forEach(function (site) {
      var item = document.createElement("button");
      item.className = "suggestion-item";
      item.type = "button";
      item.title = site.url;

      var icon = document.createElement("span");
      icon.className = "suggestion-icon";
      icon.style.background = hashColor(site.name);

      var letter = document.createElement("span");
      letter.className = "site-letter";
      letter.textContent = getFirstChar(site.name);
      icon.appendChild(letter);
      hydrateIcon(icon, site);

      var text = document.createElement("span");
      text.className = "suggestion-text";
      text.textContent = site.name;

      var meta = document.createElement("span");
      meta.className = "suggestion-meta";
      meta.textContent = site.category;

      item.appendChild(icon);
      item.appendChild(text);
      item.appendChild(meta);
      item.addEventListener("click", function () {
        window.open(site.url, "_blank", "noopener");
      });
      siteSuggestions.appendChild(item);
    });
  }

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

  function setSyncMessage(message) {
    if (syncMessage) syncMessage.textContent = message || "";
  }

  function readSitesFromApi() {
    return fetch(SITES_API, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("云端网站读取失败：" + res.status);
        return res.json();
      })
      .then(function (data) {
        var sites = Array.isArray(data) ? data : data.sites;
        return normalizeCustomSites(sites);
      });
  }

  function syncSitesToApi(actionText) {
    var password = editorPassword ? editorPassword.value : "";
    setSyncMessage("正在同步到 GitHub...");

    return fetch(SITES_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: password,
        action: actionText || "更新自定义导航网站",
        sites: normalizeCustomSites(customSites),
      }),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error(data.message || ("云端同步失败：" + res.status));
          return data;
        });
      })
      .then(function (data) {
        if (Array.isArray(data.sites)) setCustomSites(normalizeCustomSites(data.sites));
        refreshSites();
        setSyncMessage("已同步到 GitHub");
        return true;
      })
      .catch(function (err) {
        setSyncMessage("已保存到本机，云端同步失败：" + (err.message || "接口不可用"));
        return false;
      });
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".menu-group")) closeOtherMenus(null);
  });

  function openEditor() {
    if (!editorModal) return;
    editorModal.classList.add("open");
    editorModal.setAttribute("aria-hidden", "false");
    if (editorWorkspace && !editorWorkspace.hidden) newSiteName.focus();
    else if (editorPassword) editorPassword.focus();
  }

  function closeEditor() {
    if (!editorModal) return;
    editorModal.classList.remove("open");
    editorModal.setAttribute("aria-hidden", "true");
    if (editorAuthMessage) editorAuthMessage.textContent = "";
    if (editorSaveMessage) editorSaveMessage.textContent = "";
    setSyncMessage("添加或删除后会自动同步到 GitHub。");
  }

  if (editEntry) editEntry.addEventListener("click", openEditor);
  if (editorClose) editorClose.addEventListener("click", closeEditor);
  if (editorModal) {
    editorModal.addEventListener("click", function (e) {
      if (e.target === editorModal) closeEditor();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && editorModal && editorModal.classList.contains("open")) closeEditor();
  });

  if (editorAuth) {
    editorAuth.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!editorPassword || editorPassword.value !== EDIT_PASSWORD) {
        if (editorAuthMessage) editorAuthMessage.textContent = "密码错误";
        return;
      }
      editorAuth.hidden = true;
      editorWorkspace.hidden = false;
      if (editorAuthMessage) editorAuthMessage.textContent = "";
      renderCategoryOptions();
      renderCustomSiteList();
      newSiteName.focus();
    });
  }

  if (siteEditorForm) {
    siteEditorForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var site = {
        id: "site-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8),
        name: newSiteName.value.trim(),
        url: normalizeUrl(newSiteUrl.value),
        category: newSiteCategory.value.trim(),
        icon: newSiteIcon.value.trim(),
        aliases: normalizeAliases(newSiteAliases ? newSiteAliases.value : ""),
      };

      if (!site.name || !site.url || !site.category) {
        editorSaveMessage.textContent = "请填写名称、地址和分类";
        return;
      }

      try {
        new URL(site.url);
      } catch (err) {
        editorSaveMessage.textContent = "网址格式不正确";
        return;
      }

      customSites.push(site);
      setCustomSites(customSites);
      refreshSites();
      siteEditorForm.reset();
      editorSaveMessage.textContent = "已添加";
      syncSitesToApi("添加网站：" + site.name);
      newSiteName.focus();
    });
  }

  searchInput.addEventListener("input", renderSuggestions);
  searchInput.addEventListener("focus", renderSuggestions);

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-wrap") && siteSuggestions) siteSuggestions.classList.remove("visible");
  });

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = searchInput.value.trim();
    if (!q) return;

    var firstMatch = getSiteMatches(q)[0];
    if (firstMatch) {
      window.open(firstMatch.url, "_blank", "noopener");
      return;
    }

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
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
  }

  var savedTheme = localStorage.getItem("nav-theme");
  if (savedTheme) applyTheme(savedTheme);
  else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) applyTheme("dark");

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
    var timeStr = pad(now.getHours()) + ":" + pad(now.getMinutes());
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

  function loadRemoteCustomSites() {
    return readSitesFromApi()
      .then(function (sites) {
        setCustomSites(sites);
        setSyncMessage("已连接云端同步");
      })
      .catch(function () {
        return fetch("custom-sites.json?ts=" + Date.now())
          .then(function (res) {
            if (!res.ok) throw new Error("no remote custom sites");
            return res.json();
          })
          .then(function (sites) {
            setCustomSites(sites);
            setSyncMessage("已读取静态网站列表");
          })
          .catch(function () {
            setCustomSites(getStoredCustomSites());
            setSyncMessage("云端接口未连接，当前使用本机保存");
          });
      });
  }

  initBackground();
  initWeather();
  customSites = getStoredCustomSites();
  updateClock();
  setInterval(updateClock, 1000);
  renderEngines();
  loadRemoteCustomSites().then(refreshSites);

  if (window.matchMedia("(min-width: 768px)").matches) {
    searchInput.focus();
  }
})();
