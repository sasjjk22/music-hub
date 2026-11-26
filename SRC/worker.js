import { PLAYER_HTML } from "./player_html.js";
import { ADMIN_HTML } from "./admin_html.js";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const NE_HEADERS = { "User-Agent": UA, Referer: "https://music.163.com/", Cookie: "os=pc; appver=2.9.7" };

const PRESET_ARTISTS = [
  { name: "周杰伦", cat: "华语男", tag: "华语流行" }, { name: "张学友", cat: "经典怀旧", tag: "经典歌神" },
  { name: "陈奕迅", cat: "华语男", tag: "华语流行" }, { name: "林俊杰", cat: "华语男", tag: "华语流行" },
  { name: "陶喆", cat: "华语男", tag: "R&B" }, { name: "王力宏", cat: "华语男", tag: "华语流行" },
  { name: "薛之谦", cat: "华语男", tag: "流行情歌" }, { name: "许嵩", cat: "华语男", tag: "原创" },
  { name: "毛不易", cat: "华语男", tag: "民谣流行" }, { name: "邓紫棋", cat: "华语女", tag: "华语流行" },
  { name: "王菲", cat: "经典怀旧", tag: "经典天后" }, { name: "孙燕姿", cat: "华语女", tag: "华语经典" },
  { name: "梁静茹", cat: "华语女", tag: "情歌" }, { name: "田馥甄", cat: "华语女", tag: "文艺流行" },
  { name: "蔡依林", cat: "华语女", tag: "唱跳流行" }, { name: "莫文蔚", cat: "经典怀旧", tag: "经典情歌" },
  { name: "邓丽君", cat: "经典怀旧", tag: "时代金曲" }, { name: "张国荣", cat: "经典怀旧", tag: "粤语传奇" },
  { name: "李宗盛", cat: "经典怀旧", tag: "华语宗师" }, { name: "刘德华", cat: "经典怀旧", tag: "四大天王" },
  { name: "伍佰", cat: "经典怀旧", tag: "摇滚经典" }, { name: "Beyond", cat: "经典怀旧", tag: "粤语摇滚" },
  { name: "五月天", cat: "乐队组合", tag: "摇滚乐团" }, { name: "告五人", cat: "乐队组合", tag: "独立乐团" },
  { name: "YOASOBI", cat: "日韩", tag: "日语流行" }, { name: "米津玄师", cat: "日韩", tag: "日语创作" },
  { name: "Aimer", cat: "ACG", tag: "动漫歌姬" }, { name: "泽野弘之", cat: "ACG", tag: "燃系OST" },
  { name: "塞壬唱片-MSR", cat: "ACG", tag: "明日方舟" }, { name: "Taylor Swift", cat: "欧美", tag: "欧美流行" },
  { name: "Coldplay", cat: "欧美", tag: "英伦摇滚" },
];
const JUNK_WORDS = ["dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok", "消音版"];

function fetchTimeout(url, opts = {}, ms = 3500) { return fetch(url, { ...opts, signal: AbortSignal.timeout(ms) }); }
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Access-Token, X-Admin-Token", ...extraHeaders },
  });
}
function html(body, status = 200, extraHeaders = {}) {
  return new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", ...extraHeaders } });
}
async function withEdgeCache(ctx, keyPath, ttlSec, fn) {
  const cache = caches.default;
  const cacheKey = new Request("https://cache.internal/v3" + keyPath);
  const hit = await cache.match(cacheKey);
  if (hit) return hit;
  const resp = await fn(ttlSec);
  if (resp.status === 200 && !resp.headers.has("X-Skip-Cache")) ctx.waitUntil(cache.put(cacheKey, resp.clone()));
  return resp;
}
function getTokenFromReq(request) {
  const url = new URL(request.url);
  return url.searchParams.get("token") || request.headers.get("X-Access-Token") || (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
}
function checkToken(request, env) { return !env.ACCESS_TOKEN || getTokenFromReq(request) === String(env.ACCESS_TOKEN).trim(); }
async function digestHex(algo, text) {
  const digest = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function getAdminSessionToken(env) { return digestHex("SHA-256", "mh_admin_v1:" + String(env.ADMIN_PASSWORD || "").trim()); }
async function checkAdmin(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const expected = await getAdminSessionToken(env), url = new URL(request.url);
  return (request.headers.get("X-Admin-Token") || url.searchParams.get("atoken") || "") === expected;
}
function normalizeName(s) { return (s || "").toLowerCase().replace(/[\(（\[【].*?[\)）\]】]/g, "").replace(/\s+/g, " ").trim(); }
function makeNormKey(title, artist) { return `${normalizeName(title)}|${normalizeName((artist || "").split(/[/,、&]/)[0])}`; }
function isJunkTitle(title, query = "") { const t = (title || "").toLowerCase(), q = (query || "").toLowerCase(); return JUNK_WORDS.some((w) => t.includes(w) && !q.includes(w)); }
function cleanLrcText(raw) {
  if (!raw) return "";
  return raw.split(/\r?\n/).filter((l) => !["作词 :", "作曲 :", "编曲 :", "制作人 :", "QQ音乐", "网易云"].some((k) => l.includes(k))).join("\n").trim();
}
function isBasicAudioUrl(u) {
  return Boolean(u && typeof u === "string" && u.startsWith("http") && !u.includes("panspace.kuwo.cn") && !u.includes("/404"));
}

async function verifyNot30sTrial(url, durationSec) {
  if (!isBasicAudioUrl(url)) return null;
  try {
    const res = await fetchTimeout(url, { method: "HEAD", headers: { "User-Agent": UA }, redirect: "follow" }, 1500);
    if (res.url && res.url.includes("/404")) return null;
    if (res.status === 404 || res.status === 410) return null;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("text/html") || ct.includes("application/json")) return null;
    const len = Number(res.headers.get("content-length") || 0);
    if (durationSec >= 90) {
      if (!len || len < Math.max(1300 * 1024, durationSec * 8 * 1024)) return null;
    }
    return res.url || url;
  } catch {
    return null;
  }
}

function mapNeteaseSong(s) {
  const artists = (s.ar || s.artists || []).map((a) => a.name).filter(Boolean).join(" / ") || "未知歌手";
  const alb = s.al || s.album || {};
  return {
    id: 0, norm_key: makeNormKey(s.name, artists), title: s.name, artist: artists,
    album: alb.name || "", cover: alb.picUrl || "", duration: Math.round((s.dt || s.duration || 0) / 1000),
    category: "网易精选", ext_source: "netease", ext_id: String(s.id),
  };
}

async function liveSearchSongs(query, limit = 40, page = 1) {
  const out = [], seen = new Set(), offset = Math.max(0, (page - 1) * limit);
  for (const ep of [
    `https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=1&limit=${limit}&offset=${offset}`,
    `https://music.163.com/api/search/get?s=${encodeURIComponent(query)}&type=1&limit=${limit}&offset=${offset}`,
  ]) {
    try {
      const r = await fetchTimeout(ep, { headers: NE_HEADERS }, 4000);
      if (!r.ok) continue;
      const songs = (await r.json())?.result?.songs || [];
      for (const s of songs) {
        if (!s.name || isJunkTitle(s.name, query)) continue;
        const item = mapNeteaseSong(s);
        if (seen.has(item.norm_key)) continue;
        seen.add(item.norm_key);
        out.push(item);
      }
      if (out.length) break;
    } catch {}
  }
  return out;
}

// 用官方歌手 ID 精确拉取正版 Top 50 热门单曲与正版录音室专辑（彻底踢掉野鸡翻唱专辑）
async function fetchOfficialArtistData(name) {
  try {
    const sr = await fetchTimeout(
      `https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(name)}&type=100&limit=5&offset=0`,
      { headers: NE_HEADERS }, 4000
    );
    const list = (await sr.json())?.result?.artists || [];
    if (!list.length) return { songs: [], albums: [] };
    const nl = name.toLowerCase();
    const target = list.find((a) => (a.name || "").toLowerCase() === nl) || list[0];
    const aid = target.id;

    const [hotR, albR] = await Promise.all([
      fetchTimeout(`https://music.163.com/api/artist/${aid}`, { headers: NE_HEADERS }, 4500),
      fetchTimeout(`https://music.163.com/api/artist/albums/${aid}?limit=30&offset=0`, { headers: NE_HEADERS }, 4500),
    ]);
    const hotData = await hotR.json().catch(() => ({}));
    const albData = await albR.json().catch(() => ({}));

    const songs = (hotData.hotSongs || []).filter((s) => s.name && !isJunkTitle(s.name, name)).map(mapNeteaseSong);
    const albums = (albData.hotAlbums || []).map((a) => ({
      id: String(a.id), title: a.name, artist: a.artist?.name || target.name || name,
      cover: a.picUrl || "", size: a.size || 0,
      publishTime: a.publishTime ? new Date(a.publishTime).toISOString().slice(0, 10) : "",
    }));
    return { songs, albums };
  } catch {
    return { songs: [], albums: [] };
  }
}

async function liveSearchAlbums(query, limit = 24, page = 1) {
  const offset = Math.max(0, (page - 1) * limit);
  try {
    const r = await fetchTimeout(`https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=10&limit=${limit + 12}&offset=${offset}`, { headers: NE_HEADERS }, 4500);
    const albs = (await r.json())?.result?.albums || [];
    // 过滤掉只有 1~2 首歌的个人播客/野鸡单曲专辑，只留正经专辑
    const clean = albs.filter((a) => (a.size || 0) >= 4);
    const picked = clean.length ? clean : albs;
    return picked.slice(0, limit).map((a) => ({
      id: String(a.id), title: a.name, artist: a.artist?.name || query, cover: a.picUrl || "",
      size: a.size || 0, publishTime: a.publishTime ? new Date(a.publishTime).toISOString().slice(0, 10) : "",
    }));
  } catch { return []; }
}

async function searchKuwoRid(kw) {
  const sr = await fetchTimeout(
    `https://search.kuwo.cn/r.s?all=${encodeURIComponent(kw)}&ft=music&itemset=web_2013&client=kt&pn=0&rn=5&rformat=json&encoding=utf8`,
    { headers: { "User-Agent": UA } }, 2200
  );
  const txt = await sr.text();
  const matches = [...txt.matchAll(/MUSIC_(\d+)/g)].map((m) => m[1]);
  return matches[0] || "";
}

async function raceKuwoAll(song, ids, trace) {
  const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
  const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
  const rid = ids.kuwo || (await searchKuwoRid(kw).catch(() => ""));
  if (!rid) { trace.push("kw:no_rid"); throw new Error("no_rid"); }

  const kuwoUrls = [
    `https://mobi.kuwo.cn/mobi.s?f=web&user=0&source=kwplayer_ar_8.5.5.0_apk_keluze.apk&type=convert_url_with_sign&rid=${rid}&br=320kmp3`,
    `https://mobi.kuwo.cn/mobi.s?f=web&type=convert_url_with_sign&source=kwplayer_ar_4.4.2.7_B_nuoweida_vh.apk&rid=${rid}&format=mp3&br=320kmp3`,
    `https://wapi.kuwo.cn/api/v1/www/music/playUrl?mid=${rid}&type=music`,
    `http://antiserver.kuwo.cn/anti.s?type=convert_url3&rid=${rid}&format=mp3`,
  ];

  try {
    return await Promise.any(kuwoUrls.map(async (ep) => {
      const r = await fetchTimeout(ep, { headers: { "User-Agent": UA, Referer: "https://www.kuwo.cn/" } }, 2600);
      const txt = await r.text();
      let u = "", ekey = "", dur = 0;
      try { const j = JSON.parse(txt); u = j?.data?.url || j?.url || ""; ekey = j?.data?.ekey || ""; dur = Number(j?.data?.duration || 0); }
      catch { const m = txt.match(/url=(http[^\s\r\n]+)/); if (m) u = m[1]; }
      if (ekey || !isBasicAudioUrl(u)) throw new Error("kw_invalid");
      if (dur > 0 && song.duration >= 90 && dur <= 65) throw new Error("kw_trial");
      const real = await verifyNot30sTrial(u, song.duration);
      if (!real) throw new Error("kw_trial_size");
      return { url: real, source: "kuwo", kuwoId: rid };
    }));
  } catch { trace.push("kw:fail"); throw new Error("kw_fail"); }
}

async function raceGDStudio(song, ids, trace) {
  const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
  const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
  const base = "https://music-api.gdstudio.xyz/api.php?use_xbridge3=true";
  const hdrs = { "User-Agent": UA, Accept: "application/json", Referer: "https://music.gdstudio.xyz/", Origin: "https://music.gdstudio.xyz" };

  const tasks = ["kuwo", "joox"].map(async (plat) => {
    const sr = await fetchTimeout(`${base}&types=search&source=${plat}&name=${encodeURIComponent(kw)}&count=3&pages=1`, { headers: hdrs }, 2400);
    if (!sr.ok) throw new Error(`gd_s_${sr.status}`);
    const arr = await sr.json();
    const pid = Array.isArray(arr) && arr[0]?.id;
    if (!pid) throw new Error("gd_no_id");
    const ur = await fetchTimeout(`${base}&types=url&source=${plat}&id=${encodeURIComponent(pid)}&br=320`, { headers: hdrs }, 2400);
    if (!ur.ok) throw new Error(`gd_u_${ur.status}`);
    const d = await ur.json();
    if (!isBasicAudioUrl(d?.url)) throw new Error("gd_no_url");
    return { url: d.url, source: `gd:${plat}` };
  });

  if (ids.netease) {
    tasks.push((async () => {
      const ur = await fetchTimeout(`${base}&types=url&source=netease&id=${ids.netease}&br=320`, { headers: hdrs }, 2400);
      if (!ur.ok) throw new Error(`gd_ne_${ur.status}`);
      const d = await ur.json();
      const real = await verifyNot30sTrial(d?.url, song.duration);
      if (!real) throw new Error("gd_ne_30s");
      return { url: real, source: "gd:netease" };
    })());
  }

  try { return await Promise.any(tasks); }
  catch { trace.push("gd:fail"); throw new Error("gd_fail"); }
}

async function raceVKeys(song, ids, trace) {
  const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
  const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
  const tasks = [3, 2].map(async (q) => {
    const r = await fetchTimeout(`https://api.vkeys.cn/v2/music/tencent?word=${encodeURIComponent(kw)}&n=1&quality=${q}`, { headers: { "User-Agent": UA } }, 2800);
    const d = await r.json();
    const u = d?.data?.url;
    if (!isBasicAudioUrl(u)) throw new Error("vk_qq_empty");
    return { url: u, source: `vkeys:qq` };
  });
  if (ids.netease) {
    tasks.push((async () => {
      const r = await fetchTimeout(`https://api.vkeys.cn/v2/music/netease?id=${ids.netease}&quality=3`, { headers: { "User-Agent": UA } }, 2800);
      const d = await r.json();
      const real = await verifyNot30sTrial(d?.data?.url, song.duration);
      if (!real) throw new Error("vk_ne_30s");
      return { url: real, source: "vkeys:ne" };
    })());
  }
  try { return await Promise.any(tasks); }
  catch { trace.push("vkeys:fail"); throw new Error("vkeys"); }
}

async function raceMeting(baseUrl, tag, neteaseId, durationSec, trace) {
  if (!neteaseId) throw new Error("no_id");
  const r = await fetchTimeout(`${baseUrl}?server=netease&type=song&id=${neteaseId}`, { headers: { "User-Agent": UA } }, 2200);
  if (!r.ok) { trace.push(`${tag}:${r.status}`); throw new Error(r.status); }
  const arr = await r.json();
  const u = Array.isArray(arr) ? arr[0]?.url : arr?.url;
  const real = await verifyNot30sTrial(u, durationSec);
  if (!real) { trace.push(`${tag}:30s`); throw new Error("trial"); }
  return { url: real, source: tag };
}

async function resolvePlayUrl(song, quality, env, prefer = "", skip = "") {
  const ids = JSON.parse(song.source_ids_json || "{}"), trace = [];

  if (ids.r2 && env.R2 && env.R2_PUBLIC_URL) return { url: `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${ids.r2}`, source: "r2", trace };
  if (ids.msr) {
    try {
      const u = (await (await fetchTimeout(`https://monster-siren.hypergryph.com/api/song/${ids.msr}`, {}, 3000)).json())?.data?.sourceUrl;
      if (u) return { url: u, source: "msr", trace };
    } catch { trace.push("msr:err"); }
  }

  const raceList = [];
  if (prefer === "kuwo") raceList.push(raceKuwoAll(song, ids, trace));
  else {
    raceList.push(raceKuwoAll(song, ids, trace), raceGDStudio(song, ids, trace), raceVKeys(song, ids, trace));
    if (skip !== "meting") {
      raceList.push(
        raceMeting("https://api.injahow.cn/meting/", "meting_injahow", ids.netease, song.duration, trace),
        raceMeting("https://meting-dd.2333332.xyz/api", "meting_dd", ids.netease, song.duration, trace)
      );
    }
  }

  try { const winner = await Promise.any(raceList); return { ...winner, trace }; }
  catch { return { error: "可用完整源均未命中", trace }; }
}

async function fetchLiveLyric(extSource, extId, title, artist) {
  if (extSource === "netease" && extId) {
    try {
      const d = await (await fetchTimeout(`https://music.163.com/api/song/lyric?id=${extId}&lv=-1&kv=-1&tv=-1`, { headers: NE_HEADERS }, 3500)).json();
      const lrc = cleanLrcText(d?.lrc?.lyric || ""), trans = cleanLrcText(d?.tlyric?.lyric || "");
      if (lrc) return { lrc, trans };
    } catch {}
  }
  if (extSource === "msr" && extId) {
    try {
      const lrcUrl = (await (await fetchTimeout(`https://monster-siren.hypergryph.com/api/song/${extId}`, {}, 3500)).json())?.data?.lyricUrl;
      if (lrcUrl) { const txt = cleanLrcText(await (await fetchTimeout(lrcUrl, {}, 3500)).text()); if (txt) return { lrc: txt, trans: "" }; }
    } catch {}
  }
  try {
    const r = await fetchTimeout(`https://lrclib.net/api/get?track_name=${encodeURIComponent(normalizeName(title))}&artist_name=${encodeURIComponent((artist || "").split(/[/,、&]/)[0].trim())}`, {}, 3500);
    if (r.ok) { const d = await r.json(); const txt = d?.syncedLyrics || d?.plainLyrics || ""; if (txt) return { lrc: txt, trans: "" }; }
  } catch {}
  return { lrc: "", trans: "" };
}

function isSafeExternalUrl(raw) {
  try { const u = new URL(raw), h = u.hostname.toLowerCase(); return (u.protocol === "https:" || u.protocol === "http:") && !(h === "localhost" || h.startsWith("127.") || h.startsWith("10.") || h.startsWith("192.168.") || h.startsWith("169.254.") || h.endsWith(".internal")); }
  catch { return false; }
}

export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method === "OPTIONS") return json({ ok: true });
      const url = new URL(request.url), path = url.pathname;
      if (path === "/" || path === "/player") return html(PLAYER_HTML, 200, { "Cache-Control": "public, max-age=300" });
      if (path === "/admin") return html(ADMIN_HTML, 200, { "Cache-Control": "public, max-age=300" });
      if (path === "/health") return json({ name: "Music Hub API", status: "ok", time: Date.now() });

      if (path === "/api/admin/login" && request.method === "POST") {
        if (!env.ADMIN_PASSWORD) return json({ error: "未检测到 ADMIN_PASSWORD Secret" }, 401);
        const body = await request.json().catch(() => ({}));
        if (String(body.password || "").trim() !== String(env.ADMIN_PASSWORD).trim()) return json({ error: "后台密码不正确" }, 401);
        return json({ ok: true, token: await getAdminSessionToken(env) });
      }

      if (path.startsWith("/api/admin/")) {
        if (!(await checkAdmin(request, env))) return json({ error: env.ADMIN_PASSWORD ? "会话过期，请重新登录" : "未配置 ADMIN_PASSWORD Secret" }, 401);

        if (path === "/api/admin/stats" && request.method === "GET") {
          const [sCount, bCount, cCount, lCount, cats, srcs, charts, junk] = await Promise.all([
            env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=0").first(),
            env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=1").first(),
            env.DB.prepare("SELECT COUNT(*) AS c FROM charts").first(),
            env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=0 AND length(lyric_lrc) > 10").first(),
            env.DB.prepare("SELECT category, COUNT(*) AS c FROM songs WHERE is_blocked=0 GROUP BY category ORDER BY c DESC").all(),
            env.DB.prepare("SELECT * FROM sources ORDER BY priority ASC").all(),
            env.DB.prepare("SELECT id,title,category,sort_order FROM charts ORDER BY sort_order ASC").all(),
            env.DB.prepare("SELECT value FROM settings WHERE key='junk_words'").first(),
          ]);
          return json({ stats: { songs: sCount?.c || 0, blocked: bCount?.c || 0, charts: cCount?.c || 0, lyrics: lCount?.c || 0 }, categories: cats.results || [], sources: srcs.results || [], charts: charts.results || [], junkWords: junk?.value || JUNK_WORDS.join(","), accessToken: env.ACCESS_TOKEN || "" });
        }
        if (path === "/api/admin/songs" && request.method === "GET") {
          const q = (url.searchParams.get("q") || "").trim(), cat = (url.searchParams.get("cat") || "").trim(), filter = url.searchParams.get("filter") || "all", sort = url.searchParams.get("sort") || "score", page = Math.max(1, Number(url.searchParams.get("page") || 1)), limit = 25, offset = (page - 1) * limit;
          const conds = [], params = [];
          if (q) { conds.push("(title LIKE ? OR artist LIKE ? OR album LIKE ?)"); params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
          if (cat) { conds.push("category = ?"); params.push(cat); }
          if (filter === "active") conds.push("is_blocked = 0"); else if (filter === "blocked") conds.push("is_blocked = 1"); else if (filter === "no_lrc") conds.push("is_blocked = 0 AND length(lyric_lrc) <= 10"); else if (filter === "has_lrc") conds.push("is_blocked = 0 AND length(lyric_lrc) > 10");
          const where = conds.length ? "WHERE " + conds.join(" AND ") : "", orderBy = sort === "newest" ? "ORDER BY id DESC" : "ORDER BY score DESC, id DESC";
          const totalRow = await env.DB.prepare(`SELECT COUNT(*) AS c FROM songs ${where}`).bind(...params).first();
          const { results } = await env.DB.prepare(`SELECT id,title,artist,album,cover,duration,category,score,is_blocked,source_ids_json,length(lyric_lrc) AS lrc_len FROM songs ${where} ${orderBy} LIMIT ? OFFSET ?`).bind(...params, limit, offset).all();
          return json({ total: totalRow?.c || 0, page, limit, songs: results || [] });
        }
        if (path === "/api/admin/song" && request.method === "GET") {
          const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(Number(url.searchParams.get("id") || 0)).first();
          return song ? json({ song }) : json({ error: "not found" }, 404);
        }
        if (path === "/api/admin/song/update" && request.method === "POST") {
          const b = await request.json(), id = Number(b.id), now = Math.floor(Date.now() / 1000);
          if (b.onlyLyric) await env.DB.prepare("UPDATE songs SET lyric_lrc=?, lyric_trans=?, updated_at=? WHERE id=?").bind(String(b.lyric_lrc || ""), String(b.lyric_trans || ""), now, id).run();
          else await env.DB.prepare("UPDATE songs SET title=?, artist=?, album=?, cover=?, category=?, score=?, source_ids_json=?, updated_at=? WHERE id=?").bind(String(b.title || "").trim(), String(b.artist || "").trim(), String(b.album || "").trim(), String(b.cover || "").trim(), String(b.category || "华语").trim(), Number(b.score || 300), String(b.source_ids_json || "{}"), now, id).run();
          return json({ ok: true });
        }
        if (path === "/api/admin/song/delete" && request.method === "POST") { await env.DB.prepare("DELETE FROM songs WHERE id = ?").bind(Number((await request.json()).id)).run(); return json({ ok: true }); }
        if (path === "/api/admin/song/block" && request.method === "POST") { const b = await request.json(); await env.DB.prepare("UPDATE songs SET is_blocked = ? WHERE id = ?").bind(b.blocked ? 1 : 0, Number(b.id)).run(); return json({ ok: true }); }
        if (path === "/api/admin/song/reset-bili" && request.method === "POST") {
          const id = Number((await request.json()).id), song = await env.DB.prepare("SELECT source_ids_json FROM songs WHERE id = ?").bind(id).first();
          if (song) { const ids = JSON.parse(song.source_ids_json || "{}"); delete ids.bili; await env.DB.prepare("UPDATE songs SET source_ids_json = ? WHERE id = ?").bind(JSON.stringify(ids), id).run(); }
          return json({ ok: true });
        }
        if (path === "/api/admin/play" && request.method === "GET") {
          const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(Number(url.searchParams.get("id") || 0)).first();
          if (!song) return json({ error: "not found" }, 404);
          const resolved = await resolvePlayUrl(song, "high", env, url.searchParams.get("prefer") || "");
          if (resolved.error) return json(resolved, 502);
          const needProxy = Boolean(resolved.needProxy || resolved.url.startsWith("http://"));
          return json({ ...resolved, needProxy, proxyUrl: `${url.origin}/api/stream?u=${encodeURIComponent(resolved.url)}&src=${encodeURIComponent(resolved.source || "")}&atoken=${encodeURIComponent(url.searchParams.get("atoken") || "")}` });
        }
        if (path === "/api/admin/lyric/fetch" && request.method === "POST") {
          const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(Number((await request.json()).id)).first();
          if (!song) return json({ error: "not found" }, 404);
          const ids = JSON.parse(song.source_ids_json || "{}");
          return json(await fetchLiveLyric(ids.netease ? "netease" : ids.msr ? "msr" : "", ids.netease || ids.msr || "", song.title, song.artist));
        }
        if (path === "/api/admin/lyrics/backfill" && request.method === "POST") {
          const afterId = Number((await request.json().catch(() => ({}))).afterId || 0);
          const { results: batch } = await env.DB.prepare("SELECT id,title,artist,source_ids_json FROM songs WHERE is_blocked=0 AND length(lyric_lrc) <= 10 AND id > ? ORDER BY id ASC LIMIT 10").bind(afterId).all();
          if (!batch || !batch.length) return json({ done: true, processed: 0, updated: 0, lastId: afterId, logs: [] });
          let updated = 0, lastId = afterId; const logs = [], now = Math.floor(Date.now() / 1000);
          for (const s of batch) {
            lastId = s.id; const ids = JSON.parse(s.source_ids_json || "{}");
            const live = await fetchLiveLyric(ids.netease ? "netease" : ids.msr ? "msr" : "", ids.netease || ids.msr || "", s.title, s.artist);
            if (live.lrc && live.lrc.length > 10) { await env.DB.prepare("UPDATE songs SET lyric_lrc=?, lyric_trans=?, updated_at=? WHERE id=?").bind(live.lrc, live.trans, now, s.id).run(); updated++; logs.push(`✓ #${s.id} ${s.title}`); }
            else logs.push(`- #${s.id} ${s.title} (未匹配)`);
          }
          return json({ done: batch.length < 10, processed: batch.length, updated, lastId, logs });
        }
        if (path === "/api/admin/import-playlist" && request.method === "POST") {
          const body = await request.json(), m = String(body.url || "").match(/(?:id=|playlist\/)(\d+)/) || String(body.url || "").trim().match(/^(\d{5,15})$/);
          if (!m) return json({ error: "无法识别网易云歌单 ID" }, 400);
          const pid = m[1], songCat = String(body.songCategory || "经典").trim(), chartCat = String(body.chartCategory || "经典金曲").trim();
          let pl = null;
          for (const ep of [`https://music.163.com/api/v6/playlist/detail?id=${pid}&n=100`, `https://music.163.com/api/playlist/detail?id=${pid}`]) {
            try { const d = await (await fetchTimeout(ep, { headers: NE_HEADERS }, 7000)).json(); pl = d?.playlist || d?.result; if (pl?.tracks?.length) break; } catch {}
          }
          if (!pl?.tracks?.length) return json({ error: "歌单抓取为空" }, 400);
          const now = Math.floor(Date.now() / 1000), tracks = pl.tracks.slice(0, 100), normKeys = [], stmts = [];
          for (let i = 0; i < tracks.length; i++) {
            const t = tracks[i], title = (t.name || "").trim(); if (!title) continue;
            const artists = (t.ar || t.artists || []).map((a) => a.name).filter(Boolean).join(" / ") || "未知歌手";
            const nk = makeNormKey(title, artists), alb = t.al || t.album || {}, score = Math.max(100, 900 - i * 4);
            normKeys.push(nk);
            stmts.push(env.DB.prepare(`INSERT INTO songs (norm_key,title,artist,album,cover,duration,category,tags,score,source_ids_json,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(norm_key) DO UPDATE SET score=MAX(songs.score,excluded.score),updated_at=excluded.updated_at`).bind(nk, title, artists, alb.name || "", alb.picUrl || "", Math.round((t.dt || t.duration || 0) / 1000), songCat, "", score, JSON.stringify({ netease: String(t.id) }), now));
          }
          for (let i = 0; i < stmts.length; i += 40) await env.DB.batch(stmts.slice(i, i + 40));
          const songIds = [];
          for (let i = 0; i < normKeys.length; i += 60) {
            const chunk = normKeys.slice(i, i + 60), ph = chunk.map(() => "?").join(",");
            const { results } = await env.DB.prepare(`SELECT id,norm_key FROM songs WHERE norm_key IN (${ph})`).bind(...chunk).all();
            const map = new Map((results || []).map((r) => [r.norm_key, r.id]));
            for (const nk of chunk) if (map.has(nk)) songIds.push(map.get(nk));
          }
          const chartTitle = String(body.chartTitle || pl.name || "导入歌单").trim();
          await env.DB.prepare(`INSERT INTO charts (id,title,category,cover,description,song_ids_json,sort_order,updated_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,category=excluded.category,cover=excluded.cover,song_ids_json=excluded.song_ids_json,updated_at=excluded.updated_at`).bind(`ne_${pid}`, chartTitle, chartCat, pl.coverImgUrl || "", (pl.description || "").slice(0, 120), JSON.stringify(songIds), 45, now).run();
          return json({ ok: true, title: chartTitle, importedCount: songIds.length });
        }
        if (path === "/api/admin/chart/update" && request.method === "POST") { const b = await request.json(); await env.DB.prepare("UPDATE charts SET title=?, category=?, sort_order=? WHERE id=?").bind(String(b.title || "").trim(), String(b.category || "").trim(), Number(b.sort_order || 50), String(b.id)).run(); return json({ ok: true }); }
        if (path === "/api/admin/chart/delete" && request.method === "POST") { await env.DB.prepare("DELETE FROM charts WHERE id = ?").bind(String((await request.json()).id)).run(); return json({ ok: true }); }
        if (path === "/api/admin/settings" && request.method === "POST") { await env.DB.prepare("INSERT INTO settings (key, value) VALUES ('junk_words', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(String((await request.json()).junkWords || "")).run(); return json({ ok: true }); }
        if (path === "/api/admin/source" && request.method === "POST") {
          const b = await request.json();
          await env.DB.prepare(`INSERT INTO sources (id, name, type, endpoint, priority, enabled, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,type=excluded.type,endpoint=excluded.endpoint,priority=excluded.priority,enabled=excluded.enabled,updated_at=excluded.updated_at`).bind(String(b.id).trim(), String(b.name).trim(), b.type || "agg", String(b.endpoint || "").trim(), Number(b.priority || 50), b.enabled ? 1 : 0, Math.floor(Date.now() / 1000)).run();
          return json({ ok: true });
        }
        if (path === "/api/admin/source/delete" && request.method === "POST") { await env.DB.prepare("DELETE FROM sources WHERE id = ?").bind(String((await request.json()).id)).run(); return json({ ok: true }); }
        if (path === "/api/admin/source/test" && request.method === "POST") {
          const src = await env.DB.prepare("SELECT * FROM sources WHERE id = ?").bind((await request.json()).id).first();
          if (!src) return json({ error: "not found" }, 404);
          const t0 = Date.now(); let testUrl = src.endpoint;
          if (src.type === "agg") testUrl = `${src.endpoint}?use_xbridge3=true&types=search&source=kuwo&name=晴天&count=1&pages=1`;
          if (src.type === "native") testUrl = `${src.endpoint}/albums`;
          if (src.type === "vkeys") testUrl = `https://api.vkeys.cn/v2/music/tencent?word=晴天&n=1&quality=3`;
          try { const r = await fetchTimeout(testUrl, { headers: { "User-Agent": UA, Referer: "https://music.gdstudio.xyz/" } }, 4500); return json({ ok: r.ok, status: r.status, ms: Date.now() - t0 }); }
          catch (e) { return json({ ok: false, error: e.message, ms: Date.now() - t0 }); }
        }
        return json({ error: "Unknown admin route" }, 404);
      }

      if (path === "/api/stream") {
        if (!(checkToken(request, env) || (await checkAdmin(request, env)))) return json({ error: "Unauthorized" }, 401);
        const target = url.searchParams.get("u") || "", src = url.searchParams.get("src") || "";
        if (!isSafeExternalUrl(target)) return json({ error: "invalid stream url" }, 400);
        const fwdHeaders = new Headers({ "User-Agent": UA });
        if (src.includes("kuwo") || target.includes("kuwo")) fwdHeaders.set("Referer", "https://www.kuwo.cn/");
        const range = request.headers.get("Range"); if (range) fwdHeaders.set("Range", range);
        const upstream = await fetch(target, { headers: fwdHeaders, redirect: "follow" });
        const outHeaders = new Headers();
        for (const h of ["content-type", "content-length", "content-range", "accept-ranges"]) { const v = upstream.headers.get(h); if (v) outHeaders.set(h, v); }
        outHeaders.set("Access-Control-Allow-Origin", "*");
        if (!outHeaders.has("accept-ranges")) outHeaders.set("Accept-Ranges", "bytes");
        return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
      }

      if (!checkToken(request, env)) return json({ error: "Unauthorized" }, 401);

      if (path === "/api/diag") {
        const song = { title: "一路上有你", artist: "张学友", duration: 297, source_ids_json: '{"netease":"190449"}' };
        const tests = [
          ["kuwo_all", raceKuwoAll(song, { netease: "190449" }, [])],
          ["gdstudio_xbridge", raceGDStudio(song, { netease: "190449" }, [])],
          ["vkeys", raceVKeys(song, { netease: "190449" }, [])],
          ["meting_injahow", raceMeting("https://api.injahow.cn/meting/", "injahow", "190449", 297, [])],
        ];
        const report = await Promise.all(tests.map(async ([name, p]) => {
          const t0 = Date.now();
          try { const r = await p; return { name, ok: true, ms: Date.now() - t0, source: r.source, url: r.url.slice(0, 70) }; }
          catch (e) { return { name, ok: false, ms: Date.now() - t0, error: e.message }; }
        }));
        return json({ report });
      }

      if (path === "/api/home") {
        return withEdgeCache(ctx, "/home", 600, async (ttl) => {
          const { results } = await env.DB.prepare("SELECT id, title, category, cover, description FROM charts ORDER BY sort_order ASC").all();
          return json({ charts: results || [], artists: PRESET_ARTISTS }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/chart") {
        const id = url.searchParams.get("id"); if (!id) return json({ error: "missing id" }, 400);
        return withEdgeCache(ctx, `/chart/${encodeURIComponent(id)}`, 600, async (ttl) => {
          const chart = await env.DB.prepare("SELECT * FROM charts WHERE id = ?").bind(id).first();
          if (!chart) return json({ error: "chart not found" }, 404);
          const ids = JSON.parse(chart.song_ids_json || "[]").slice(0, 160); if (!ids.length) return json({ chart, songs: [] });
          const map = new Map();
          for (let i = 0; i < ids.length; i += 80) {
            const chunk = ids.slice(i, i + 80), placeholders = chunk.map(() => "?").join(",");
            const { results } = await env.DB.prepare(`SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked=0 AND id IN (${placeholders})`).bind(...chunk).all();
            for (const s of results || []) map.set(s.id, s);
          }
          return json({ chart: { id: chart.id, title: chart.title, cover: chart.cover, description: chart.description }, songs: ids.map((sid) => map.get(sid)).filter(Boolean) }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/artist") {
        const name = (url.searchParams.get("name") || "").trim(), page = Math.max(1, Number(url.searchParams.get("page") || 1));
        if (!name) return json({ songs: [], albums: [] });
        return withEdgeCache(ctx, `/artist/${encodeURIComponent(name)}/${page}`, 900, async (ttl) => {
          let localRows = [];
          if (page === 1) localRows = (await env.DB.prepare("SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked = 0 AND artist LIKE ? ORDER BY score DESC LIMIT 50").bind(`%${name}%`).all()).results || [];
          const seen = new Set(localRows.map((r) => r.norm_key));

          if (page === 1) {
            const official = await fetchOfficialArtistData(name);
            const mergedSongs = [...localRows];
            for (const s of official.songs) { if (!seen.has(s.norm_key)) { seen.add(s.norm_key); mergedSongs.push(s); } }
            // 若官方 Top50 为空，退回搜索
            if (mergedSongs.length < 10) {
              for (const s of await liveSearchSongs(name, 40, 1)) if (!seen.has(s.norm_key)) { seen.add(s.norm_key); mergedSongs.push(s); }
            }
            const hdrs = mergedSongs.length ? { "Cache-Control": `public, max-age=${ttl}` } : { "X-Skip-Cache": "1" };
            return json({ artist: name, page, hasMore: true, songs: mergedSongs, albums: official.albums }, 200, hdrs);
          }

          const live = await liveSearchSongs(name, 40, page);
          const nameLower = name.toLowerCase();
          const filtered = live.filter((s) => !seen.has(s.norm_key) && (s.artist.toLowerCase().includes(nameLower) || nameLower.includes(s.artist.toLowerCase())));
          return json({ artist: name, page, hasMore: live.length >= 25, songs: filtered, albums: [] }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/albums") {
        const q = (url.searchParams.get("q") || "华语经典").trim(), page = Math.max(1, Number(url.searchParams.get("page") || 1));
        return withEdgeCache(ctx, `/albums/${encodeURIComponent(q)}/${page}`, 900, async (ttl) => {
          const albums = await liveSearchAlbums(q, 24, page);
          return json({ albums, hasMore: albums.length >= 20 }, 200, albums.length ? { "Cache-Control": `public, max-age=${ttl}` } : { "X-Skip-Cache": "1" });
        });
      }
      if (path === "/api/album") {
        const id = (url.searchParams.get("id") || "").trim(); if (!id) return json({ error: "missing id" }, 400);
        return withEdgeCache(ctx, `/album/${encodeURIComponent(id)}`, 1800, async (ttl) => {
          let alb = {}, rawSongs = [];
          for (const ep of [`https://music.163.com/api/v1/album/${id}`, `https://music.163.com/api/album/${id}`]) {
            try {
              const d = await (await fetchTimeout(ep, { headers: NE_HEADERS }, 5000)).json();
              if (d?.album) alb = d.album;
              if (Array.isArray(d?.songs) && d.songs.length) { rawSongs = d.songs; break; }
            } catch {}
          }
          const songs = rawSongs.map((s) => {
            const artists = (s.ar || s.artists || []).map((a) => a.name).filter(Boolean).join(" / ") || alb.artist?.name || "未知歌手";
            return { id: 0, norm_key: makeNormKey(s.name, artists), title: s.name, artist: artists, album: alb.name || "", cover: alb.picUrl || s.al?.picUrl || "", duration: Math.round((s.dt || s.duration || 0) / 1000), category: "专辑", ext_source: "netease", ext_id: String(s.id) };
          });
          return json({ album: { id, title: alb.name || "", cover: alb.picUrl || "", artist: alb.artist?.name || "", description: (alb.description || "").slice(0, 120) }, songs }, 200, songs.length ? { "Cache-Control": `public, max-age=${ttl}` } : { "X-Skip-Cache": "1" });
        });
      }
      if (path === "/api/search") {
        const q = (url.searchParams.get("q") || "").trim(), page = Math.max(1, Number(url.searchParams.get("page") || 1));
        if (!q) return json({ songs: [] });
        return withEdgeCache(ctx, `/search/${encodeURIComponent(q)}/${page}`, 300, async (ttl) => {
          let localRows = [];
          if (page === 1) {
            if (q.length >= 3) localRows = (await env.DB.prepare(`SELECT s.id,s.norm_key,s.title,s.artist,s.album,s.cover,s.duration,s.category,s.source_ids_json FROM songs_fts f JOIN songs s ON s.id = f.rowid WHERE songs_fts MATCH ? AND s.is_blocked = 0 ORDER BY s.score DESC LIMIT 30`).bind(`"${q.replace(/"/g, "")}"`).all()).results || [];
            if (!localRows.length) localRows = (await env.DB.prepare("SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked = 0 AND (title LIKE ? OR artist LIKE ?) ORDER BY score DESC LIMIT 25").bind(`%${q}%`, `%${q}%`).all()).results || [];
          }
          const merged = [...localRows], seen = new Set(merged.map((r) => r.norm_key));
          const live = await liveSearchSongs(q, 40, page);
          for (const item of live) if (!seen.has(item.norm_key)) { seen.add(item.norm_key); merged.push(item); }
          return json({ page, hasMore: live.length >= 30, songs: merged }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/song") {
        const id = Number(url.searchParams.get("id") || 0);
        if (id > 0) {
          const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(id).first();
          if (song) {
            if (!song.lyric_lrc) {
              const ids = JSON.parse(song.source_ids_json || "{}");
              const live = await fetchLiveLyric(ids.netease ? "netease" : ids.msr ? "msr" : "", ids.netease || ids.msr || "", song.title, song.artist);
              if (live.lrc) { song.lyric_lrc = live.lrc; song.lyric_trans = live.trans; ctx.waitUntil(env.DB.prepare("UPDATE songs SET lyric_lrc = ?, lyric_trans = ? WHERE id = ?").bind(live.lrc, live.trans, id).run()); }
            }
            return json({ song });
          }
        }
        const live = await fetchLiveLyric(url.searchParams.get("ext_source") || "", url.searchParams.get("ext_id") || "", url.searchParams.get("title") || "", url.searchParams.get("artist") || "");
        return json({ song: { id: 0, lyric_lrc: live.lrc, lyric_trans: live.trans } });
      }
      if (path === "/api/play") {
        let id = Number(url.searchParams.get("id") || 0);
        const quality = url.searchParams.get("q") || "high", prefer = url.searchParams.get("prefer") || "", skip = url.searchParams.get("skip") || "", force = url.searchParams.get("force") === "1";
        let song = id > 0 ? await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(id).first() : null;
        if (!song && id === 0) {
          const title = (url.searchParams.get("title") || "").trim(), artist = (url.searchParams.get("artist") || "").trim();
          if (!title) return json({ error: "invalid song" }, 400);
          const nk = makeNormKey(title, artist);
          song = await env.DB.prepare("SELECT * FROM songs WHERE norm_key = ?").bind(nk).first();
          if (!song) {
            const es = url.searchParams.get("ext_source") || "", eid = url.searchParams.get("ext_id") || "";
            await env.DB.prepare("INSERT INTO songs (norm_key,title,artist,album,cover,duration,category,tags,score,source_ids_json,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(norm_key) DO NOTHING").bind(nk, title, artist || "未知歌手", url.searchParams.get("album") || "", url.searchParams.get("cover") || "", Number(url.searchParams.get("duration") || 0), "点播收藏", "", 300, JSON.stringify(es && eid ? { [es]: eid } : {}), Math.floor(Date.now() / 1000)).run();
            song = await env.DB.prepare("SELECT * FROM songs WHERE norm_key = ?").bind(nk).first();
          }
          if (song) id = song.id;
        }
        if (!song) return json({ error: "not found" }, 404);
        const cache = caches.default, cacheKey = new Request(`https://cache.internal/play/${id}/${quality}/${prefer || "auto"}/${skip || "none"}`);
        if (!force) { const cached = await cache.match(cacheKey); if (cached) return cached; }

        const resolved = await resolvePlayUrl(song, quality, env, prefer, skip);
        if (resolved.error) return json(resolved, 502);

        const needProxy = Boolean(resolved.needProxy || resolved.url.startsWith("http://"));
        const token = getTokenFromReq(request);
        const proxyUrl = `${url.origin}/api/stream?u=${encodeURIComponent(resolved.url)}&src=${encodeURIComponent(resolved.source || "")}&token=${encodeURIComponent(token || "")}`;

        if (resolved.kuwoId) {
          const ids = JSON.parse(song.source_ids_json || "{}");
          if (!ids.kuwo) { ids.kuwo = resolved.kuwoId; ctx.waitUntil(env.DB.prepare("UPDATE songs SET source_ids_json = ? WHERE id = ?").bind(JSON.stringify(ids), id).run()); }
        }

        const resp = json({ ...resolved, needProxy, songId: id, proxyUrl }, 200, { "Cache-Control": "public, max-age=900" });
        ctx.waitUntil(cache.put(cacheKey, resp.clone()));
        return resp;
      }

      if (path === "/api/mf-plugin.js") {
        const base = `${url.protocol}//${url.host}`;
        const pluginCode = `"use strict";
const axios = require("axios");
const BASE = "${base}";
const TOKEN = "${env.ACCESS_TOKEN || ""}";
const H = TOKEN ? { "X-Access-Token": TOKEN } : {};
const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";

function cleanTitle(t) {
  return String(t || "").split("(")[0].split("（")[0].split("[")[0].split("【")[0].trim();
}
function mapSong(s) {
  return { id: String(s.id || 0), title: s.title, artist: s.artist, album: s.album, artwork: s.cover, duration: s.duration, category: s.category || "", ext_source: s.ext_source || "", ext_id: s.ext_id || "" };
}
function raceFirst(tasks) {
  return new Promise(function(resolve, reject) {
    var left = tasks.length, done = false;
    if (!left) return reject("empty");
    tasks.forEach(function(p) {
      p.then(function(v) { if (!done) { done = true; resolve(v); } })
       .catch(function() { left--; if (left === 0 && !done) reject("all_failed"); });
    });
  });
}

module.exports = {
  platform: "MusicHub·自建云端",
  author: "MusicHub",
  version: "1.5.0",
  cacheControl: "no-cache",
  supportedSearchType: ["music", "album"],

  async search(query, page, type) {
    if (type === "album") {
      if (page > 1) return { isEnd: true, data: [] };
      const { data } = await axios.get(BASE + "/api/albums", { params: { q: query }, headers: H, timeout: 10000 });
      return { isEnd: true, data: (data.albums || []).map(function(a) { return { id: String(a.id), title: a.title, artist: a.artist, artwork: a.cover, date: a.publishTime }; }) };
    }
    if (type !== "music") return { isEnd: true, data: [] };
    const { data } = await axios.get(BASE + "/api/search", { params: { q: query, page: page }, headers: H, timeout: 10000 });
    return { isEnd: !data.hasMore, data: (data.songs || []).map(mapSong) };
  },

  async getAlbumInfo(albumItem) {
    const { data } = await axios.get(BASE + "/api/album", { params: { id: albumItem.id }, headers: H, timeout: 10000 });
    return { isEnd: true, albumItem: albumItem, musicList: (data.songs || []).map(mapSong) };
  },

  async getMediaSource(item, quality) {
    var br = quality === "super" ? "999" : quality === "low" ? "128" : quality === "standard" ? "192" : "320";
    var dur = Number(item.duration || 0);
    var cleanArtist = String(item.artist || "").split(new RegExp("[,、&/]"))[0].trim();
    var kw = (cleanTitle(item.title) + " " + cleanArtist).trim();
    var hdrs = { "User-Agent": UA };

    function isFullSize(sizeKb) {
      if (!sizeKb || dur < 90) return true;
      return Number(sizeKb) >= Math.max(1300, dur * 8);
    }

    function tryGD(plat) {
      var pidP = (plat === "netease" && item.ext_source === "netease" && item.ext_id)
        ? Promise.resolve(item.ext_id)
        : axios.get("https://music-api.gdstudio.xyz/api.php", {
            params: { use_xbridge3: "true", types: "search", source: plat, name: kw, count: 3, pages: 1 },
            headers: hdrs, timeout: 4500
          }).then(function(r) { return (Array.isArray(r.data) && r.data[0] && r.data[0].id) ? String(r.data[0].id) : ""; });

      return pidP.then(function(pid) {
        if (!pid) return Promise.reject("no_id");
        return axios.get("https://music-api.gdstudio.xyz/api.php", {
          params: { use_xbridge3: "true", types: "url", source: plat, id: pid, br: br },
          headers: hdrs, timeout: 4500
        });
      }).then(function(r) {
        var d = r.data;
        if (!d || !d.url || d.url.indexOf("panspace") >= 0 || !isFullSize(d.size)) return Promise.reject("trial");
        if (plat === "netease" && dur >= 90) {
          return axios.head(d.url, { headers: hdrs, timeout: 2500 }).then(function(hr) {
            var cl = Number((hr.headers && hr.headers["content-length"]) || 0);
            if (cl > 0 && cl < Math.max(1300 * 1024, dur * 8 * 1024)) return Promise.reject("30s");
            return { url: d.url };
          }).catch(function(err) {
            if (err === "30s") return Promise.reject("30s");
            return { url: d.url };
          });
        }
        return { url: d.url };
      });
    }

    try {
      if (String(item.artist || "").indexOf("塞壬") < 0) {
        return await raceFirst([tryGD("kuwo"), tryGD("joox"), tryGD("netease")]);
      }
    } catch (e) {}

    const { data } = await axios.get(BASE + "/api/play", {
      params: { id: item.id || 0, q: quality || "high", ext_source: item.ext_source, ext_id: item.ext_id, title: item.title, artist: item.artist, album: item.album, cover: item.artwork, duration: item.duration },
      headers: H, timeout: 12000
    });
    return { url: data.url, headers: data.headers };
  },

  async getLyric(item) {
    const { data } = await axios.get(BASE + "/api/song", {
      params: { id: item.id || 0, ext_source: item.ext_source, ext_id: item.ext_id, title: item.title, artist: item.artist },
      headers: H, timeout: 8000
    });
    return { rawLrc: (data.song && data.song.lyric_lrc) || "", translation: (data.song && data.song.lyric_trans) || undefined };
  },

  async getTopLists() {
    const { data } = await axios.get(BASE + "/api/home", { headers: H, timeout: 8000 });
    var g = {};
    for (var i = 0; i < (data.charts || []).length; i++) {
      var c = data.charts[i];
      if (!g[c.category]) g[c.category] = [];
      g[c.category].push({ id: c.id, title: c.title, coverImg: c.cover, description: c.description });
    }
    var out = Object.keys(g).map(function(title) { return { title: title, data: g[title] }; });
    if (data.artists && data.artists.length) {
      out.push({ title: "热门歌手代表作", data: data.artists.map(function(a) { return { id: "artist_" + a.name, title: a.name, description: a.tag }; }) });
    }
    return out;
  },

  async getTopListDetail(tl) {
    if (String(tl.id).indexOf("artist_") === 0) {
      const { data } = await axios.get(BASE + "/api/artist", { params: { name: String(tl.id).slice(7), page: 1 }, headers: H, timeout: 10000 });
      return { isEnd: !data.hasMore, topListItem: tl, musicList: (data.songs || []).map(mapSong) };
    }
    const { data } = await axios.get(BASE + "/api/chart", { params: { id: tl.id }, headers: H, timeout: 10000 });
    return { isEnd: true, topListItem: tl, musicList: (data.songs || []).map(mapSong) };
  }
};`;
        return new Response(pluginCode, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
      }
      if (path === "/musicfree.json") {
        const qs = env.ACCESS_TOKEN ? `?token=${encodeURIComponent(env.ACCESS_TOKEN)}` : "";
        return json({ plugins: [{ name: "MusicHub·自建云端", url: `${url.protocol}//${url.host}/api/mf-plugin.js${qs}`, version: "1.5.0" }] });
      }
      return json({ error: "Not Found" }, 404);
    } catch (err) {
      return json({ error: err?.message || String(err) }, 500);
    }
  },
};
