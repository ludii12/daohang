const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  });
}

function getSettings(env) {
  return {
    token: env.GITHUB_TOKEN || "",
    owner: env.GITHUB_OWNER || "",
    repo: env.GITHUB_REPO || "",
    branch: env.GITHUB_BRANCH || "main",
    path: env.GITHUB_PATH || "custom-sites.json",
    password: env.EDIT_PASSWORD || "12345678",
  };
}

function githubHeaders(token) {
  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "cloudflare-pages-nav-editor",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function githubContentUrl(settings) {
  const encodedPath = settings.path.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}/contents/${encodedPath}`;
}

function requireSettings(settings) {
  const missing = [];
  if (!settings.token) missing.push("GITHUB_TOKEN");
  if (!settings.owner) missing.push("GITHUB_OWNER");
  if (!settings.repo) missing.push("GITHUB_REPO");
  if (!missing.length) return null;
  return `Cloudflare 环境变量缺少：${missing.join("、")}`;
}

function textToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToText(base64) {
  const binary = atob(String(base64 || "").replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function normalizeUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function normalizeSites(sites) {
  if (!Array.isArray(sites)) throw new Error("sites 必须是数组");

  return sites.map((site, index) => {
    const name = String(site && site.name ? site.name : "").trim();
    const url = normalizeUrl(site && site.url);
    const category = String(site && site.category ? site.category : "").trim();
    const icon = String(site && site.icon ? site.icon : "").trim();
    const id = String(site && site.id ? site.id : `site-${Date.now().toString(36)}-${index}`).trim();

    if (!name || !url || !category) {
      throw new Error("每个网站都必须包含 name、url、category");
    }

    try {
      new URL(url);
    } catch (error) {
      throw new Error(`网址格式不正确：${name}`);
    }

    return { id, name, url, category, icon };
  });
}

async function fetchGithubFile(settings) {
  const url = `${githubContentUrl(settings)}?ref=${encodeURIComponent(settings.branch)}`;
  const res = await fetch(url, { headers: githubHeaders(settings.token) });
  if (res.status === 404) return null;
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub 读取失败：${res.status} ${detail}`);
  }
  return res.json();
}

async function readSites(settings) {
  const file = await fetchGithubFile(settings);
  if (!file || !file.content) return [];

  const parsed = JSON.parse(base64ToText(file.content));
  return normalizeSites(parsed);
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}

export async function onRequestGet({ env }) {
  const settings = getSettings(env);
  const missing = requireSettings(settings);
  if (missing) return json({ ok: false, message: missing, sites: [] }, 500);

  try {
    const sites = await readSites(settings);
    return json({ ok: true, sites });
  } catch (error) {
    return json({ ok: false, message: error.message || "读取失败", sites: [] }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  const settings = getSettings(env);
  const missing = requireSettings(settings);
  if (missing) return json({ ok: false, message: missing }, 500);

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return json({ ok: false, message: "请求内容必须是 JSON" }, 400);
  }

  if (!payload || payload.password !== settings.password) {
    return json({ ok: false, message: "编辑密码错误" }, 401);
  }

  let sites;
  try {
    sites = normalizeSites(payload.sites);
  } catch (error) {
    return json({ ok: false, message: error.message || "网站数据不正确" }, 400);
  }

  try {
    const currentFile = await fetchGithubFile(settings);
    const body = {
      message: payload.action || "更新自定义导航网站",
      content: textToBase64(`${JSON.stringify(sites, null, 2)}\n`),
      branch: settings.branch,
    };
    if (currentFile && currentFile.sha) body.sha = currentFile.sha;

    const res = await fetch(githubContentUrl(settings), {
      method: "PUT",
      headers: githubHeaders(settings.token),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`GitHub 写入失败：${res.status} ${detail}`);
    }

    return json({ ok: true, sites });
  } catch (error) {
    return json({ ok: false, message: error.message || "同步失败" }, 500);
  }
}
