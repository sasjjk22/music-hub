import { PLAYER_HTML } from "./player_html.js";
import { ADMIN_HTML } from "./admin_html.js";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const NE_HEADERS = { "User-Agent": UA, Referer: "https://music.163.com/", Cookie: "os=pc; appver=2.9.7" };

const PRESET_ARTISTS = [
  { name: "周杰伦", cat: "华语男", tag: "华语流行" },
  { name: "陈奕迅", cat: "华语男", tag: "华语流行" },
  { name: "林俊杰", cat: "华语男", tag: "华语流行" },
  { name: "陶喆", cat: "华语男", tag: "R&B教父" },
  { name: "王力宏", cat: "华语男", tag: "华语流行" },
  { name: "薛之谦", cat: "华语男", tag: "流行情歌" },
  { name: "许嵩", cat: "华语男", tag: "原创才子" },
  { name: "毛不易", cat: "华语男", tag: "民谣流行" },
  { name: "李荣浩", cat: "华语男", tag: "都市流行" },
  { name: "周深", cat: "华语男", tag: "天籁美声" },
  { name: "张杰", cat: "华语男", tag: "华语流行" },
  { name: "林宥嘉", cat: "华语男", tag: "迷幻情歌" },
  { name: "方大同", cat: "华语男", tag: "灵魂R&B" },
  { name: "汪苏泷", cat: "华语男", tag: "流行创作" },
  { name: "胡彦斌", cat: "华语男", tag: "全能唱作" },
  { name: "张敬轩", cat: "华语男", tag: "粤语流行" },
  { name: "邓紫棋", cat: "华语女", tag: "华语流行" },
  { name: "孙燕姿", cat: "华语女", tag: "华语天后" },
  { name: "梁静茹", cat: "华语女", tag: "情歌天后" },
  { name: "田馥甄", cat: "华语女", tag: "文艺流行" },
  { name: "蔡依林", cat: "华语女", tag: "唱跳天后" },
  { name: "张靓颖", cat: "华语女", tag: "海豚音" },
  { name: "张韶涵", cat: "华语女", tag: "励志流行" },
  { name: "郁可唯", cat: "华语女", tag: "OST女王" },
  { name: "单依纯", cat: "华语女", tag: "新生代" },
  { name: "袁娅维", cat: "华语女", tag: "Neo-Soul" },
  { name: "徐佳莹", cat: "华语女", tag: "创作女声" },
  { name: "杨千嬅", cat: "华语女", tag: "粤语情歌" },
  { name: "容祖儿", cat: "华语女", tag: "港乐天后" },
  { name: "张学友", cat: "经典怀旧", tag: "经典歌神" },
  { name: "王菲", cat: "经典怀旧", tag: "经典天后" },
  { name: "邓丽君", cat: "经典怀旧", tag: "时代金曲" },
  { name: "张国荣", cat: "经典怀旧", tag: "粤语传奇" },
  { name: "李宗盛", cat: "经典怀旧", tag: "华语宗师" },
  { name: "刘德华", cat: "经典怀旧", tag: "四大天王" },
  { name: "莫文蔚", cat: "经典怀旧", tag: "经典情歌" },
  { name: "伍佰", cat: "经典怀旧", tag: "摇滚经典" },
  { name: "Beyond", cat: "经典怀旧", tag: "粤语摇滚" },
  { name: "谭咏麟", cat: "经典怀旧", tag: "粤语殿堂" },
  { name: "林忆莲", cat: "经典怀旧", tag: "都会情歌" },
  { name: "罗大佑", cat: "经典怀旧", tag: "音乐教父" },
  { name: "周华健", cat: "经典怀旧", tag: "国民歌王" },
  { name: "任贤齐", cat: "经典怀旧", tag: "90年代" },
  { name: "张信哲", cat: "经典怀旧", tag: "情歌王子" },
  { name: "五月天", cat: "乐队组合", tag: "摇滚乐团" },
  { name: "告五人", cat: "乐队组合", tag: "独立乐团" },
  { name: "草东没有派对", cat: "乐队组合", tag: "独立摇滚" },
  { name: "万能青年旅店", cat: "乐队组合", tag: "摇滚神专" },
  { name: "新裤子", cat: "乐队组合", tag: "复古迪斯科" },
  { name: "朴树", cat: "乐队组合", tag: "民谣摇滚" },
  { name: "许巍", cat: "乐队组合", tag: "人文摇滚" },
  { name: "赵雷", cat: "乐队组合", tag: "城市民谣" },
  { name: "陈粒", cat: "乐队组合", tag: "独立民谣" },
  { name: "S.H.E", cat: "乐队组合", tag: "国民女团" },
  { name: "YOASOBI", cat: "日韩", tag: "日语流行" },
  { name: "米津玄师", cat: "日韩", tag: "日语创作" },
  { name: "久石让", cat: "日韩", tag: "电影配乐" },
  { name: "宇多田光", cat: "日韩", tag: "日本天后" },
  { name: "RADWIMPS", cat: "日韩", tag: "日系摇滚" },
  { name: "藤井风", cat: "日韩", tag: "R&B流行" },
  { name: "IU", cat: "日韩", tag: "韩国女solo" },
  { name: "BLACKPINK", cat: "日韩", tag: "K-Pop" },
  { name: "Aimer", cat: "ACG", tag: "动漫歌姬" },
  { name: "泽野弘之", cat: "ACG", tag: "燃系OST" },
  { name: "LiSA", cat: "ACG", tag: "动画主题曲" },
  { name: "塞壬唱片-MSR", cat: "ACG", tag: "明日方舟" },
  { name: "HOYO-MiX", cat: "ACG", tag: "米哈游原声" },
  { name: "Vanguard Sound", cat: "ACG", tag: "游戏电音" },
  { name: "Taylor Swift", cat: "欧美", tag: "欧美流行" },
  { name: "Coldplay", cat: "欧美", tag: "英伦摇滚" },
  { name: "Ed Sheeran", cat: "欧美", tag: "流行民谣" },
  { name: "Adele", cat: "欧美", tag: "灵魂女声" },
  { name: "Linkin Park", cat: "欧美", tag: "新金属" },
  { name: "Alan Walker", cat: "欧美", tag: "电音精选" },
  { name: "The Weeknd", cat: "欧美", tag: "Synth-Pop" },
  { name: "Bruno Mars", cat: "欧美", tag: "Funk流行" },
];

const RADIO_STATIONS = [
  { id: "personal", title: "私人漫游 FM", desc: "根据你的红心喜欢与歌单实时推荐相似歌曲", icon: "✨", grad: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
  { id: "quiet", title: "深夜安静 · 纯音乐", desc: "钢琴、轻音乐、助眠氛围声景，伴你安静入眠", icon: "🌙", grad: "linear-gradient(135deg,#1e293b,#475569)" },
  { id: "lofi", title: "专注学习 · Lo-Fi", desc: "低保真节拍与轻爵士，看书、写代码最佳背景音", icon: "☕", grad: "linear-gradient(135deg,#0f766e,#10b981)" },
  { id: "rain", title: "雨夜治愈 · 慢情歌", desc: "民谣与温柔叙事人声，适合一个人的傍晚", icon: "🌧️", grad: "linear-gradient(135deg,#4f46e5,#7c3aed)" },
  { id: "classic", title: "时光随身听 · 怀旧", desc: "80/90年代华语与粤语时代金曲无限漫游", icon: "📻", grad: "linear-gradient(135deg,#b45309,#f59e0b)" },
  { id: "cantonese", title: "港乐深夜档 · 粤语", desc: "陈奕迅、张学友、张国荣、Beyond 粤语经典", icon: "🌃", grad: "linear-gradient(135deg,#be185d,#f43f5e)" },
  { id: "acg", title: "二次元 · 游戏原声", desc: "ACG 主题曲与塞壬唱片官方无损库随心听", icon: "🎧", grad: "linear-gradient(135deg,#2563eb,#06b6d4)" },
  { id: "drive", title: "公路驾驶 · 燃曲电音", desc: "摇滚、节奏电音，提神醒脑不停歇", icon: "🚗", grad: "linear-gradient(135deg,#dc2626,#f97316)" },
];

const DEFAULT_JUNK_WORDS = ["dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok", "消音版"];
const SHEET_TAGS = [
  { id: "华语", title: "华语" }, { id: "流行", title: "流行" }, { id: "怀旧", title: "怀旧" },
  { id: "粤语", title: "粤语" }, { id: "欧美", title: "欧美" }, { id: "日语", title: "日语" },
  { id: "ACG", title: "ACG" }, { id: "民谣", title: "民谣" }, { id: "摇滚", title: "摇滚" },
  { id: "说唱", title: "说唱" }, { id: "轻音乐", title: "轻音乐" }, { id: "影视原声", title: "影视原声" },
];

let runtimeCfgCache = { ts: 0, junkWords: DEFAULT_JUNK_WORDS, sources: [] };

async function getRuntimeCfg(env) {
  const now = Date.now();
  if (now - runtimeCfgCache.ts < 30000 && runtimeCfgCache.sources.length) return runtimeCfgCache;
  try {
    const [junkRow, srcRes] = await Promise.all([
      env.DB.prepare("SELECT value FROM settings WHERE key='junk_words'").first(),
      env.DB.prepare("SELECT * FROM sources WHERE enabled=1 ORDER BY priority ASC").all(),
    ]);
    const jw = (junkRow?.value || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    runtimeCfgCache = { ts: now, junkWords: jw.length ? jw : DEFAULT_JUNK_WORDS, sources: srcRes.results || [] };
  } catch {
    runtimeCfgCache = { ts: now, junkWords: DEFAULT_JUNK_WORDS, sources: [] };
  }
  return runtimeCfgCache;
}
function invalidateCfgCache() { runtimeCfgCache.ts = 0; }

function fetchTimeout(url, opts = {}, ms = 4000) { return fetch(url, { ...opts, signal: AbortSignal.timeout(ms) }); }
function httpsCover(u) {
  if (!u || typeof u !== "string") return "";
  if (u.startsWith("http://") && u.includes("music.126.net")) return "https://" + u.slice(7);
  return u;
}
function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Access-Token, X-Admin-Token",
      ...extraHeaders,
    },
  });
}
function html(body, status = 200, extraHeaders = {}) {
  return new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", ...extraHeaders } });
}
async function withEdgeCache(ctx, keyPath, ttlSec, fn) {
  const cache = caches.default;
  const cacheKey = new Request("https://cache.internal/v6" + keyPath);
  const hit = await cache.match(cacheKey);
  if (hit) return hit;
  const resp = await fn(ttlSec);
  if (resp.status === 200 && !resp.headers.has("X-Skip-Cache")) ctx.waitUntil(cache.put(cacheKey, resp.clone()));
  return resp;
}
async function purgeHomeCache(ctx) {
  ctx.waitUntil(caches.default.delete(new Request("https://cache.internal/v6/home")));
}

function getTokenFromReq(request, pathToken = "") {
  if (pathToken) return pathToken;
  const url = new URL(request.url);
  return url.searchParams.get("token") || request.headers.get("X-Access-Token") || (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
}
function checkToken(request, env, pathToken = "") { return !env.ACCESS_TOKEN || getTokenFromReq(request, pathToken) === String(env.ACCESS_TOKEN).trim(); }
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
function isJunkTitle(title, query = "", junkList = DEFAULT_JUNK_WORDS) {
  const t = (title || "").toLowerCase(), q = (query || "").toLowerCase();
  return junkList.some((w) => t.includes(w) && !q.includes(w));
}
function cleanLrcText(raw) {
  if (!raw) return "";
  return raw.split(/\r?\n/).filter((l) => !["作词 :", "作曲 :", "编曲 :", "制作人 :", "QQ音乐", "网易云"].some((k) => l.includes(k))).join("\n").trim();
}
function isBasicAudioUrl(u) {
  return Boolean(u && typeof u === "string" && u.startsWith("http") && !u.includes("panspace.kuwo.cn") && !u.includes("/404"));
}

async function verifyNot30sTrial(url, durationSec, extraHdrs = {}) {
  if (!isBasicAudioUrl(url)) return null;
  try {
    const res = await fetchTimeout(url, {
      method: "GET",
      headers: { "User-Agent": UA, Range: "bytes=0-0", ...extraHdrs },
      redirect: "follow",
    }, 2000);
    try { await res.body?.cancel(); } catch {}
    if (res.url && res.url.includes("/404")) return null;
    if (res.status !== 200 && res.status !== 206) return null;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("text/html") || ct.includes("application/json") || ct.includes("xml")) return null;

    let totalLen = 0;
    const cr = res.headers.get("content-range") || "";
    const m = cr.match(/\/(\d+)/);
    if (m) totalLen = Number(m[1]);
    else if (res.status === 200) totalLen = Number(res.headers.get("content-length") || 0);

    if (totalLen > 0 && durationSec >= 90) {
      if (totalLen < Math.max(1300 * 1024, durationSec * 8 * 1024)) return null;
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
    album: alb.name || "", cover: httpsCover(alb.picUrl || ""), duration: Math.round((s.dt || s.duration || 0) / 1000),
    category: "网易精选", ext_source: "netease", ext_id: String(s.id),
  };
}

async function liveSearchSongs(query, limit = 40, page = 1, junkList = DEFAULT_JUNK_WORDS) {
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
        if (!s.name || isJunkTitle(s.name, query, junkList)) continue;
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

async function liveSearchArtists(query, limit = 20, page = 1) {
  const offset = Math.max(0, (page - 1) * limit);
  try {
    const r = await fetchTimeout(
      `https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=100&limit=${limit}&offset=${offset}`,
      { headers: NE_HEADERS }, 4500
    );
    const list = (await r.json())?.result?.artists || [];
    return list.map((a) => ({
      id: String(a.id), name: a.name, avatar: httpsCover(a.picUrl || a.img1v1Url || ""),
      worksNum: a.musicSize || 0, albumNum: a.albumSize || 0,
    }));
  } catch { return []; }
}

async function liveSearchSheets(query, limit = 24, page = 1) {
  const offset = Math.max(0, (page - 1) * limit);
  try {
    const r = await fetchTimeout(
      `https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=1000&limit=${limit}&offset=${offset}`,
      { headers: NE_HEADERS }, 4500
    );
    const list = (await r.json())?.result?.playlists || [];
    return list.map((p) => ({
      id: `ne_${p.id}`, rawId: String(p.id), title: p.name, artist: p.creator?.nickname || "网易云歌单",
      cover: httpsCover(p.coverImgUrl || ""), playCount: p.playCount || 0, worksNum: p.trackCount || 0,
      description: (p.description || "").slice(0, 120),
    }));
  } catch { return []; }
}

async function fetchRecommendSheets(cat = "全部", limit = 24, page = 1) {
  const offset = Math.max(0, (page - 1) * limit);
  try {
    const r = await fetchTimeout(
      `https://music.163.com/api/playlist/list?cat=${encodeURIComponent(cat || "全部")}&order=hot&limit=${limit}&offset=${offset}`,
      { headers: NE_HEADERS }, 4500
    );
    const list = (await r.json())?.playlists || [];
    if (list.length) {
      return list.map((p) => ({
        id: `ne_${p.id}`, rawId: String(p.id), title: p.name, artist: p.creator?.nickname || "精选歌单",
        cover: httpsCover(p.coverImgUrl || ""), playCount: p.playCount || 0, worksNum: p.trackCount || 0,
        description: (p.description || "").slice(0, 120),
      }));
    }
  } catch {}
  return liveSearchSheets(cat && cat !== "全部" ? cat : "华语精选", limit, page);
}

async function fetchNeteasePlaylistDetail(pid, limit = 150) {
  for (const ep of [
    `https://music.163.com/api/v6/playlist/detail?id=${pid}&n=${limit}`,
    `https://music.163.com/api/playlist/detail?id=${pid}`,
  ]) {
    try {
      const d = await (await fetchTimeout(ep, { headers: NE_HEADERS }, 6000)).json();
      const pl = d?.playlist || d?.result;
      if (!pl) continue;
      let rawTracks = Array.isArray(pl.tracks) ? pl.tracks.slice() : [];
      const allIds = Array.isArray(pl.trackIds) ? pl.trackIds.map((x) => x.id).filter(Boolean) : [];

      // 若网易云只返回了部分 tracks，利用 trackIds 批量调 v3/song/detail 补全其余曲目
      if (allIds.length > rawTracks.length && rawTracks.length < limit) {
        const haveIds = new Set(rawTracks.map((t) => String(t.id)));
        const missingIds = allIds.slice(0, limit).filter((tid) => !haveIds.has(String(tid)));
        if (missingIds.length) {
          const batches = [];
          for (let i = 0; i < missingIds.length; i += 80) {
            const chunk = missingIds.slice(i, i + 80);
            const cParam = encodeURIComponent(JSON.stringify(chunk.map((tid) => ({ id: tid }))));
            batches.push(
              fetchTimeout(`https://music.163.com/api/v3/song/detail?c=${cParam}`, { headers: NE_HEADERS }, 5500)
                .then((r) => r.json())
                .then((sd) => sd?.songs || [])
                .catch(() => [])
            );
          }
          const extraLists = await Promise.all(batches);
          for (const lst of extraLists) rawTracks = rawTracks.concat(lst);
        }
      }

      if (rawTracks.length) {
        return {
          id: `ne_${pid}`, title: pl.name || "网易云歌单", artist: pl.creator?.nickname || "网易云音乐",
          cover: httpsCover(pl.coverImgUrl || ""), description: (pl.description || "").slice(0, 160),
          songs: rawTracks.slice(0, limit).map(mapNeteaseSong),
        };
      }
    } catch {}
  }
  return null;
}

async function fetchQQPlaylistDetail(tid) {
  try {
    const r = await fetchTimeout(
      `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&new_format=1&disstid=${encodeURIComponent(tid)}&format=json`,
      { headers: { "User-Agent": UA, Referer: "https://y.qq.com/" } }, 5500
    );
    const data = await r.json();
    const cd = data?.cdlist?.[0];
    if (!cd?.songlist?.length) return null;
    return {
      id: `qq_${tid}`, title: cd.dissname || "QQ音乐歌单", artist: cd.nickname || "QQ音乐",
      cover: cd.logo || "", description: (cd.desc || "").replace(/<[^>]+>/g, "").slice(0, 160),
      songs: cd.songlist.slice(0, 150).map((s) => {
        const artists = (s.singer || []).map((a) => a.name).filter(Boolean).join(" / ") || "未知歌手";
        const albumMid = s.album?.mid || "";
        return {
          id: 0, norm_key: makeNormKey(s.title || s.name, artists), title: s.title || s.name || "",
          artist: artists, album: s.album?.name || "",
          cover: albumMid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albumMid}.jpg` : "",
          duration: Number(s.interval || 0), category: "导入歌单", ext_source: "qq", ext_id: String(s.mid || s.id || ""),
        };
      }),
    };
  } catch { return null; }
}

async function importExternalPlaylist(urlLike, env) {
  let raw = String(urlLike || "").trim();
  if (!raw) return null;

  const mhMatch = raw.match(/(?:share=|\/share\/)([a-zA-Z0-9_-]{4,24})/);
  if (mhMatch) {
    const row = await env.DB.prepare("SELECT * FROM shares WHERE id = ?").bind(mhMatch[1]).first();
    if (row) return { title: row.title, description: row.description || "Music Hub 分享歌单", cover: "", songs: JSON.parse(row.songs_json || "[]") };
  }

  if (/^https?:\/\/(163cn\.tv|c6\.y\.qq\.com|t\.cn)/i.test(raw)) {
    try {
      const rr = await fetchTimeout(raw, { method: "GET", headers: { "User-Agent": UA }, redirect: "follow" }, 4500);
      try { await rr.body?.cancel(); } catch {}
      if (rr.url) raw = rr.url;
    } catch {}
  }

  if (raw.includes("y.qq.com") || raw.includes("qq.com")) {
    const qm = raw.match(/playlist\/(\d+)/) || raw.match(/[?&]id=(\d+)/) || raw.match(/disstid=(\d+)/);
    if (qm) return await fetchQQPlaylistDetail(qm[1]);
  }

  const nm = raw.match(/(?:playlist\/|[?&]id=)(\d{5,15})/) || raw.match(/^(\d{5,15})$/);
  if (nm) return await fetchNeteasePlaylistDetail(nm[1]);
  return null;
}

// ---------- 电台与相似推荐引擎 ----------
async function fetchNeteaseSimiSongs(songId) {
  if (!songId || !/^\d+$/.test(String(songId))) return [];
  try {
    const r = await fetchTimeout(
      `https://music.163.com/api/v1/discovery/simiSong?songid=${songId}&limit=16`,
      { headers: NE_HEADERS }, 3500
    );
    const data = await r.json();
    return (data?.songs || []).filter((s) => s?.name).map(mapNeteaseSong);
  } catch { return []; }
}

async function fetchNeteaseSimiSheets(songId) {
  if (!songId || !/^\d+$/.test(String(songId))) return [];
  try {
    const r = await fetchTimeout(
      `https://music.163.com/api/discovery/simiPlaylist?songid=${songId}&limit=8`,
      { headers: NE_HEADERS }, 3500
    );
    const data = await r.json();
    return (data?.playlists || []).map((p) => ({
      id: `ne_${p.id}`, rawId: String(p.id), title: p.name, artist: p.creator?.nickname || "相似推荐歌单",
      cover: httpsCover(p.coverImgUrl || ""), playCount: p.playCount || 0, worksNum: p.trackCount || 0,
      description: (p.description || "").slice(0, 120),
    }));
  } catch { return []; }
}

async function getSceneRadioPool(mode, env, ctx, junkList) {
  const cache = caches.default;
  const cacheKey = new Request(`https://cache.internal/v6/radio_pool/${mode}`);
  const hit = await cache.match(cacheKey);
  if (hit) {
    const data = await hit.json().catch(() => null);
    if (data && data.length) return data;
  }

  let pool = [];
  const seen = new Set();
  const pushItem = (s) => {
    if (!s || !s.title || isJunkTitle(s.title, "", junkList)) return;
    if (s.duration && s.duration > 720) return;
    const nk = s.norm_key || makeNormKey(s.title, s.artist);
    if (!nk || seen.has(nk)) return;
    seen.add(nk);
    pool.push({ ...s, norm_key: nk, cover: httpsCover(s.cover || "") });
  };

  if (mode === "classic" || mode === "acg") {
    const catSql = mode === "classic" ? "('经典','华语')" : "('ACG')";
    const { results } = await env.DB.prepare(
      `SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked=0 AND category IN ${catSql} ORDER BY score DESC LIMIT 100`
    ).all();
    (results || []).forEach(pushItem);
  }

  const sceneCfg = {
    quiet: { sheetKw: "深夜 安静 纯音乐 钢琴 助眠", songKw: "久石让 坂本龙一 钢琴 纯音乐 轻音乐" },
    lofi: { sheetKw: "Lo-Fi 学习 专注 纯音乐 轻爵士", songKw: "Lo-Fi Chill Beats 轻音乐 爵士" },
    rain: { sheetKw: "雨夜 民谣 慢情歌 治愈", songKw: "赵雷 陈粒 毛不易 民谣 慢情歌" },
    classic: { sheetKw: "90年代 怀旧 金曲 老歌", songKw: "张学友 王菲 周杰伦 Beyond 经典" },
    cantonese: { sheetKw: "粤语 经典 港乐 深夜", songKw: "粤语 陈奕迅 张国荣 张学友 Beyond" },
    acg: { sheetKw: "ACG 动漫 游戏 原声", songKw: "Aimer 泽野弘之 YOASOBI 塞壬唱片" },
    drive: { sheetKw: "车载 电音 摇滚 燃曲", songKw: "Alan Walker Linkin Park Coldplay 电音" },
  }[mode] || { sheetKw: "华语 精选", songKw: "华语 流行" };

  const [sheets, live] = await Promise.all([
    liveSearchSheets(sceneCfg.sheetKw, 4, 1),
    liveSearchSongs(sceneCfg.songKw, 35, 1, junkList),
  ]);
  if (sheets.length) {
    const pickedSheets = shuffleArr(sheets).slice(0, 2);
    const details = await Promise.all(pickedSheets.map((sh) => fetchNeteasePlaylistDetail(sh.rawId, 45)));
    details.forEach((d) => { if (d?.songs) d.songs.forEach(pushItem); });
  }
  live.forEach(pushItem);

  if (pool.length) {
    ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(pool), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=900" } })));
  }
  return pool;
}

async function handleRadioRequest(payload, env, ctx) {
  const cfg = await getRuntimeCfg(env);
  const mode = String(payload.mode || "personal").trim();
  const exclude = new Set(Array.isArray(payload.exclude) ? payload.exclude : []);
  const needSheets = Boolean(payload.needSheets);

  if (mode !== "personal") {
    const pool = await getSceneRadioPool(mode, env, ctx, cfg.junkWords);
    const filtered = shuffleArr(pool.filter((s) => !exclude.has(s.norm_key))).slice(0, 20);
    return { mode, station: RADIO_STATIONS.find((x) => x.id === mode) || RADIO_STATIONS[1], songs: filtered, sheets: [] };
  }

  const seedArtists = shuffleArr(Array.isArray(payload.artists) ? payload.artists.slice(0, 10) : []).slice(0, 2);
  const seedIds = shuffleArr(Array.isArray(payload.ids) ? payload.ids.slice(0, 12) : []).slice(0, 2);
  const seedCats = Array.isArray(payload.cats) && payload.cats.length ? payload.cats.slice(0, 3) : ["华语", "经典"];

  const tasks = [];
  for (const sid of seedIds) tasks.push(fetchNeteaseSimiSongs(sid));
  for (const ar of seedArtists) tasks.push(liveSearchSongs(ar, 18, 1, cfg.junkWords));

  const ph = seedCats.map(() => "?").join(",");
  tasks.push(
    env.DB.prepare(
      `SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked=0 AND category IN (${ph}) ORDER BY score DESC LIMIT 70`
    ).bind(...seedCats).all().then((r) => r.results || []).catch(() => [])
  );

  let sheetPromise = Promise.resolve([]);
  if (needSheets) {
    sheetPromise = (async () => {
      const shTasks = [];
      if (seedIds[0]) shTasks.push(fetchNeteaseSimiSheets(seedIds[0]));
      if (seedArtists[0]) shTasks.push(liveSearchSheets(seedArtists[0] + " 精选", 8, 1));
      else shTasks.push(fetchRecommendSheets(seedCats[0] || "华语", 8, 1));
      const res = await Promise.all(shTasks);
      const out = [], seenSh = new Set();
      for (const list of res) {
        for (const item of list || []) {
          if (seenSh.has(item.id)) continue;
          seenSh.add(item.id);
          out.push(item);
        }
      }
      return out.slice(0, 10);
    })();
  }

  const [songLists, sheets] = await Promise.all([Promise.all(tasks), sheetPromise]);
  const pool = [], seen = new Set();
  for (const list of songLists) {
    for (const s of list || []) {
      if (!s || !s.title || isJunkTitle(s.title, "", cfg.junkWords)) continue;
      const nk = s.norm_key || makeNormKey(s.title, s.artist);
      if (!nk || seen.has(nk) || exclude.has(nk)) continue;
      seen.add(nk);
      pool.push({ ...s, norm_key: nk, cover: httpsCover(s.cover || "") });
    }
  }

  return { mode: "personal", station: RADIO_STATIONS[0], songs: shuffleArr(pool).slice(0, 20), sheets };
}

async function fetchOfficialArtistData(name, artistId = "", junkList = DEFAULT_JUNK_WORDS) {
  try {
    let aid = artistId, artistName = name;
    if (!aid) {
      const sr = await fetchTimeout(
        `https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(name)}&type=100&limit=5&offset=0`,
        { headers: NE_HEADERS }, 4000
      );
      const list = (await sr.json())?.result?.artists || [];
      if (!list.length) return { songs: [], albums: [] };
      const nl = name.toLowerCase();
      const target = list.find((a) => (a.name || "").toLowerCase() === nl) || list[0];
      aid = target.id; artistName = target.name || name;
    }

    const [hotR, albR] = await Promise.all([
      fetchTimeout(`https://music.163.com/api/artist/${aid}`, { headers: NE_HEADERS }, 4500),
      fetchTimeout(`https://music.163.com/api/artist/albums/${aid}?limit=30&offset=0`, { headers: NE_HEADERS }, 4500),
    ]);
    const hotData = await hotR.json().catch(() => ({}));
    const albData = await albR.json().catch(() => ({}));

    const songs = (hotData.hotSongs || [])
      .filter((s) => s.name && !isJunkTitle(s.name, artistName, junkList))
      .map(mapNeteaseSong);
    const albums = (albData.hotAlbums || []).map((a) => ({
      id: String(a.id), title: a.name, artist: a.artist?.name || artistName,
      cover: httpsCover(a.picUrl || ""), size: a.size || 0,
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
    const clean = albs.filter((a) => (a.size || 0) >= 4);
    const picked = clean.length ? clean : albs;
    return picked.slice(0, limit).map((a) => ({
      id: String(a.id), title: a.name, artist: a.artist?.name || query, cover: httpsCover(a.picUrl || ""),
      size: a.size || 0, publishTime: a.publishTime ? new Date(a.publishTime).toISOString().slice(0, 10) : "",
    }));
  } catch { return []; }
}

async function searchKuwoRid(kw, title, junkList) {
  const sr = await fetchTimeout(
    `https://search.kuwo.cn/r.s?all=${encodeURIComponent(kw)}&ft=music&itemset=web_2013&client=kt&pn=0&rn=6&rformat=json&encoding=utf8`,
    { headers: { "User-Agent": UA } }, 2400
  );
  const txt = await sr.text();
  const matches = [...txt.matchAll(/MUSIC_(\d+)/g)].map((m) => m[1]);
  const names = [...txt.matchAll(/NAME:'([^']*)'/g)].map((m) => m[1]);
  for (let i = 0; i < matches.length; i++) {
    if (!names[i] || !isJunkTitle(names[i], title, junkList)) return matches[i];
  }
  return matches[0] || "";
}

async function raceKuwoAll(song, ids, trace, junkList = DEFAULT_JUNK_WORDS) {
  const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
  const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
  const rid = ids.kuwo || (await searchKuwoRid(kw, song.title, junkList).catch(() => ""));
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
      const real = await verifyNot30sTrial(u, song.duration, { Referer: "https://www.kuwo.cn/" });
      if (!real) throw new Error("kw_trial_size");
      return { url: real, source: "kuwo", kuwoId: rid, headers: { Referer: "https://www.kuwo.cn/", "User-Agent": UA } };
    }));
  } catch { trace.push("kw:fail"); throw new Error("kw_fail"); }
}

async function raceGDStudio(song, ids, trace, endpoint = "https://music-api.gdstudio.xyz/api.php", junkList = DEFAULT_JUNK_WORDS) {
  const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
  const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
  const base = `${endpoint.replace(/\?.*$/, "")}?use_xbridge3=true`;
  const hdrs = { "User-Agent": UA, Accept: "application/json", Referer: "https://music.gdstudio.xyz/", Origin: "https://music.gdstudio.xyz" };

  const tasks = ["kuwo", "joox"].map(async (plat) => {
    const sr = await fetchTimeout(`${base}&types=search&source=${plat}&name=${encodeURIComponent(kw)}&count=5&pages=1`, { headers: hdrs }, 2600);
    if (!sr.ok) throw new Error(`gd_s_${sr.status}`);
    const arr = await sr.json();
    if (!Array.isArray(arr) || !arr.length) throw new Error("gd_no_id");
    const picked = arr.find((x) => !isJunkTitle(x.name, song.title, junkList)) || arr[0];
    const pid = picked?.id;
    if (!pid) throw new Error("gd_no_id");
    const ur = await fetchTimeout(`${base}&types=url&source=${plat}&id=${encodeURIComponent(pid)}&br=320`, { headers: hdrs }, 2600);
    if (!ur.ok) throw new Error(`gd_u_${ur.status}`);
    const d = await ur.json();
    if (!isBasicAudioUrl(d?.url)) throw new Error("gd_no_url");
    if (d.size && song.duration >= 90 && Number(d.size) < 1300) throw new Error("gd_trial_size");
    const real = await verifyNot30sTrial(d.url, song.duration);
    if (!real) throw new Error("gd_trial");
    return { url: real, source: `gd:${plat}` };
  });

  if (ids.netease) {
    tasks.push((async () => {
      const ur = await fetchTimeout(`${base}&types=url&source=netease&id=${ids.netease}&br=320`, { headers: hdrs }, 2600);
      if (!ur.ok) throw new Error(`gd_ne_${ur.status}`);
      const d = await ur.json();
      if (d?.size && song.duration >= 90 && Number(d.size) < 1300) throw new Error("gd_ne_size");
      const real = await verifyNot30sTrial(d?.url, song.duration);
      if (!real) throw new Error("gd_ne_30s");
      return { url: real, source: "gd:netease" };
    })());
  }

  try { return await Promise.any(tasks); }
  catch { trace.push("gd:fail"); throw new Error("gd_fail"); }
}

async function raceVKeys(song, ids, trace, endpoint = "https://api.vkeys.cn/v2/music") {
  const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
  const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
  const base = endpoint.replace(/\/$/, "");
  const tasks = [3, 2].map(async (q) => {
    const r = await fetchTimeout(`${base}/tencent?word=${encodeURIComponent(kw)}&n=1&quality=${q}`, { headers: { "User-Agent": UA } }, 2800);
    const d = await r.json();
    const real = await verifyNot30sTrial(d?.data?.url, song.duration);
    if (!real) throw new Error("vk_qq_empty");
    return { url: real, source: "vkeys:qq" };
  });
  if (ids.netease) {
    tasks.push((async () => {
      const r = await fetchTimeout(`${base}/netease?id=${ids.netease}&quality=3`, { headers: { "User-Agent": UA } }, 2800);
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
  const r = await fetchTimeout(`${baseUrl}?server=netease&type=song&id=${neteaseId}`, { headers: { "User-Agent": UA } }, 2400);
  if (!r.ok) { trace.push(`${tag}:${r.status}`); throw new Error(r.status); }
  const arr = await r.json();
  const u = Array.isArray(arr) ? arr[0]?.url : arr?.url;
  const real = await verifyNot30sTrial(u, durationSec);
  if (!real) { trace.push(`${tag}:30s`); throw new Error("trial"); }
  return { url: real, source: tag };
}

async function resolvePlayUrl(song, quality, env, prefer = "", skip = "") {
  const ids = JSON.parse(song.source_ids_json || "{}"), trace = [];
  const cfg = await getRuntimeCfg(env);
  const srcMap = new Map(cfg.sources.map((s) => [s.id, s]));
  const hasAnyCfg = cfg.sources.length > 0;

  if (ids.r2 && env.R2 && env.R2_PUBLIC_URL) return { url: `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${ids.r2}`, source: "r2", trace };
  if (ids.msr && (!hasAnyCfg || srcMap.has("msr"))) {
    const msrBase = (srcMap.get("msr")?.endpoint || "https://monster-siren.hypergryph.com/api").replace(/\/$/, "");
    try {
      const u = (await (await fetchTimeout(`${msrBase}/song/${ids.msr}`, {}, 3000)).json())?.data?.sourceUrl;
      if (u) return { url: u, source: "msr", trace };
    } catch { trace.push("msr:err"); }
  }

  const raceList = [];
  if (prefer === "kuwo") {
    raceList.push(raceKuwoAll(song, ids, trace, cfg.junkWords));
  } else {
    raceList.push(raceKuwoAll(song, ids, trace, cfg.junkWords));
    if (!hasAnyCfg || srcMap.has("gdstudio")) {
      raceList.push(raceGDStudio(song, ids, trace, srcMap.get("gdstudio")?.endpoint || "https://music-api.gdstudio.xyz/api.php", cfg.junkWords));
    }
    if (!hasAnyCfg || srcMap.has("vkeys")) {
      raceList.push(raceVKeys(song, ids, trace, srcMap.get("vkeys")?.endpoint || "https://api.vkeys.cn/v2/music"));
    }
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
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (
      h === "localhost" || h === "0.0.0.0" || h === "::1" || h.endsWith(".local") || h.endsWith(".internal") ||
      h.startsWith("127.") || h.startsWith("10.") || h.startsWith("192.168.") || h.startsWith("169.254.") ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
      h.startsWith("fe80:") || h.startsWith("fc") || h.startsWith("fd")
    ) return false;
    return true;
  } catch { return false; }
}

function extFromContentType(ct) {
  const c = String(ct || "").toLowerCase();
  if (c.includes("flac")) return ".flac";
  if (c.includes("mp4") || c.includes("aac") || c.includes("m4a")) return ".m4a";
  if (c.includes("wav")) return ".wav";
  if (c.includes("ogg") || c.includes("opus")) return ".ogg";
  return ".mp3";
}

export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method === "OPTIONS") return json({ ok: true });
      const url = new URL(request.url);
      let path = url.pathname, pathToken = "";
      const shareRoute = path.match(/^\/s\/([^/]+)\/(musicfree\.json|music-hub\.js|lx-source\.js)$/);
      if (shareRoute) {
        pathToken = decodeURIComponent(shareRoute[1]);
        path = "/" + shareRoute[2];
      }

      if (path === "/" || path === "/player") return html(PLAYER_HTML, 200, { "Cache-Control": "public, max-age=180" });
      if (path === "/admin") return html(ADMIN_HTML, 200, { "Cache-Control": "public, max-age=180" });
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
          return json({ stats: { songs: sCount?.c || 0, blocked: bCount?.c || 0, charts: cCount?.c || 0, lyrics: lCount?.c || 0 }, categories: cats.results || [], sources: srcs.results || [], charts: charts.results || [], junkWords: junk?.value || DEFAULT_JUNK_WORDS.join(","), accessToken: env.ACCESS_TOKEN || "" });
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
          const detail = await fetchNeteasePlaylistDetail(pid, 100);
          if (!detail?.songs?.length) return json({ error: "歌单抓取为空" }, 400);
          const now = Math.floor(Date.now() / 1000), tracks = detail.songs, normKeys = [], stmts = [];
          for (let i = 0; i < tracks.length; i++) {
            const t = tracks[i], score = Math.max(100, 900 - i * 4);
            normKeys.push(t.norm_key);
            stmts.push(env.DB.prepare(`INSERT INTO songs (norm_key,title,artist,album,cover,duration,category,tags,score,source_ids_json,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(norm_key) DO UPDATE SET score=MAX(songs.score,excluded.score),updated_at=excluded.updated_at`).bind(t.norm_key, t.title, t.artist, t.album, t.cover, t.duration, songCat, "", score, JSON.stringify({ netease: String(t.ext_id) }), now));
          }
          for (let i = 0; i < stmts.length; i += 40) await env.DB.batch(stmts.slice(i, i + 40));
          const songIds = [];
          for (let i = 0; i < normKeys.length; i += 60) {
            const chunk = normKeys.slice(i, i + 60), ph = chunk.map(() => "?").join(",");
            const { results } = await env.DB.prepare(`SELECT id,norm_key FROM songs WHERE norm_key IN (${ph})`).bind(...chunk).all();
            const map = new Map((results || []).map((r) => [r.norm_key, r.id]));
            for (const nk of chunk) if (map.has(nk)) songIds.push(map.get(nk));
          }
          const chartTitle = String(body.chartTitle || detail.title || "导入歌单").trim();
          await env.DB.prepare(`INSERT INTO charts (id,title,category,cover,description,song_ids_json,sort_order,updated_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,category=excluded.category,cover=excluded.cover,song_ids_json=excluded.song_ids_json,updated_at=excluded.updated_at`).bind(`ne_${pid}`, chartTitle, chartCat, detail.cover, detail.description.slice(0, 120), JSON.stringify(songIds), 45, now).run();
          await purgeHomeCache(ctx);
          ctx.waitUntil(caches.default.delete(new Request(`https://cache.internal/v6/chart/${encodeURIComponent(`ne_${pid}`)}`)));
          return json({ ok: true, title: chartTitle, importedCount: songIds.length });
        }
        if (path === "/api/admin/chart/update" && request.method === "POST") {
          const b = await request.json();
          await env.DB.prepare("UPDATE charts SET title=?, category=?, sort_order=? WHERE id=?").bind(String(b.title || "").trim(), String(b.category || "").trim(), Number(b.sort_order || 50), String(b.id)).run();
          await purgeHomeCache(ctx);
          return json({ ok: true });
        }
        if (path === "/api/admin/chart/delete" && request.method === "POST") {
          await env.DB.prepare("DELETE FROM charts WHERE id = ?").bind(String((await request.json()).id)).run();
          await purgeHomeCache(ctx);
          return json({ ok: true });
        }
        if (path === "/api/admin/settings" && request.method === "POST") {
          await env.DB.prepare("INSERT INTO settings (key, value) VALUES ('junk_words', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(String((await request.json()).junkWords || "")).run();
          invalidateCfgCache();
          return json({ ok: true });
        }
        if (path === "/api/admin/source" && request.method === "POST") {
          const b = await request.json();
          await env.DB.prepare(`INSERT INTO sources (id, name, type, endpoint, priority, enabled, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,type=excluded.type,endpoint=excluded.endpoint,priority=excluded.priority,enabled=excluded.enabled,updated_at=excluded.updated_at`).bind(String(b.id).trim(), String(b.name).trim(), b.type || "agg", String(b.endpoint || "").trim(), Number(b.priority || 50), b.enabled ? 1 : 0, Math.floor(Date.now() / 1000)).run();
          invalidateCfgCache();
          return json({ ok: true });
        }
        if (path === "/api/admin/source/delete" && request.method === "POST") {
          await env.DB.prepare("DELETE FROM sources WHERE id = ?").bind(String((await request.json()).id)).run();
          invalidateCfgCache();
          return json({ ok: true });
        }
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
        if (!(checkToken(request, env, pathToken) || (await checkAdmin(request, env)))) return json({ error: "Unauthorized" }, 401);
        let target = url.searchParams.get("u") || "", src = url.searchParams.get("src") || "";
        const isDl = url.searchParams.get("dl") === "1";
        let fn = (url.searchParams.get("fn") || "music").replace(/[/\\?%*:|"<>]/g, "_").slice(0, 120);
        if (!isSafeExternalUrl(target)) return json({ error: "invalid stream url" }, 400);
        const fwdHeaders = new Headers({ "User-Agent": UA });
        if (src.includes("kuwo") || target.includes("kuwo")) fwdHeaders.set("Referer", "https://www.kuwo.cn/");
        const range = request.headers.get("Range"); if (range && !isDl) fwdHeaders.set("Range", range);

        let upstream = await fetch(target, { headers: fwdHeaders, redirect: "manual" });
        for (let hop = 0; hop < 3 && upstream.status >= 300 && upstream.status < 400; hop++) {
          const loc = upstream.headers.get("Location");
          if (!loc) break;
          const nextUrl = new URL(loc, target).toString();
          if (!isSafeExternalUrl(nextUrl)) return json({ error: "unsafe redirect" }, 403);
          target = nextUrl;
          upstream = await fetch(target, { headers: fwdHeaders, redirect: "manual" });
        }

        const ct = (upstream.headers.get("content-type") || "").toLowerCase();
        if (ct.includes("text/html") || ct.includes("xhtml") || ct.includes("svg")) {
          return json({ error: "blocked non-audio response" }, 403);
        }
        const outHeaders = new Headers();
        for (const h of ["content-type", "content-length", "content-range", "accept-ranges"]) { const v = upstream.headers.get(h); if (v) outHeaders.set(h, v); }
        outHeaders.set("Access-Control-Allow-Origin", "*");
        outHeaders.set("Access-Control-Expose-Headers", "Content-Type, Content-Length, Content-Disposition");
        outHeaders.set("X-Content-Type-Options", "nosniff");
        if (!outHeaders.has("accept-ranges")) outHeaders.set("Accept-Ranges", "bytes");
        if (isDl) {
          if (!/\.(mp3|flac|m4a|wav|ogg|aac)$/i.test(fn)) fn += extFromContentType(ct);
          outHeaders.set("Content-Disposition", "attachment; filename*=UTF-8''" + encodeURIComponent(fn));
        }
        return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
      }

      if (!checkToken(request, env, pathToken)) return json({ error: "Unauthorized" }, 401);

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
          const charts = (results || []).map((c) => ({ ...c, cover: httpsCover(c.cover) }));
          return json({ charts, artists: PRESET_ARTISTS, sheetTags: SHEET_TAGS, radioStations: RADIO_STATIONS }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/radio") {
        const payload = request.method === "POST"
          ? await request.json().catch(() => ({}))
          : {
              mode: url.searchParams.get("mode") || "quiet",
              artists: (url.searchParams.get("artists") || "").split(",").filter(Boolean),
              ids: (url.searchParams.get("ids") || "").split(",").filter(Boolean),
              cats: (url.searchParams.get("cats") || "").split(",").filter(Boolean),
              exclude: (url.searchParams.get("exclude") || "").split(",").filter(Boolean),
              needSheets: url.searchParams.get("needSheets") === "1",
            };
        return json(await handleRadioRequest(payload, env, ctx));
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
            for (const s of results || []) map.set(s.id, { ...s, cover: httpsCover(s.cover) });
          }
          return json({ chart: { id: chart.id, title: chart.title, cover: httpsCover(chart.cover), description: chart.description }, songs: ids.map((sid) => map.get(sid)).filter(Boolean) }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/artists") {
        const q = (url.searchParams.get("q") || "").trim(), page = Math.max(1, Number(url.searchParams.get("page") || 1));
        if (!q) return json({ artists: PRESET_ARTISTS.map((a, idx) => ({ id: "preset_" + idx, name: a.name, tag: a.tag, cat: a.cat })), hasMore: false });
        return withEdgeCache(ctx, `/artists/${encodeURIComponent(q)}/${page}`, 900, async (ttl) => {
          const artists = await liveSearchArtists(q, 20, page);
          return json({ artists, hasMore: artists.length >= 20 }, 200, artists.length ? { "Cache-Control": `public, max-age=${ttl}` } : { "X-Skip-Cache": "1" });
        });
      }
      if (path === "/api/artist") {
        const name = (url.searchParams.get("name") || "").trim(), aid = (url.searchParams.get("id") || "").trim(), page = Math.max(1, Number(url.searchParams.get("page") || 1));
        if (!name && !aid) return json({ songs: [], albums: [] });
        return withEdgeCache(ctx, `/artist/${encodeURIComponent(aid || name)}/${page}`, 900, async (ttl) => {
          const cfg = await getRuntimeCfg(env);
          let localRows = [];
          if (page === 1 && name) {
            localRows = ((await env.DB.prepare("SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked = 0 AND artist LIKE ? ORDER BY score DESC LIMIT 50").bind(`%${name}%`).all()).results || [])
              .map((r) => ({ ...r, cover: httpsCover(r.cover) }));
          }
          const seen = new Set(localRows.map((r) => r.norm_key));

          if (page === 1) {
            const official = await fetchOfficialArtistData(name, /^\d+$/.test(aid) ? aid : "", cfg.junkWords);
            const mergedSongs = [...localRows];
            for (const s of official.songs) { if (!seen.has(s.norm_key)) { seen.add(s.norm_key); mergedSongs.push(s); } }
            if (mergedSongs.length < 10 && name) {
              for (const s of await liveSearchSongs(name, 40, 1, cfg.junkWords)) if (!seen.has(s.norm_key)) { seen.add(s.norm_key); mergedSongs.push(s); }
            }
            const hdrs = mergedSongs.length ? { "Cache-Control": `public, max-age=${ttl}` } : { "X-Skip-Cache": "1" };
            return json({ artist: name, page, hasMore: true, songs: mergedSongs, albums: official.albums }, 200, hdrs);
          }

          const live = await liveSearchSongs(name, 40, page, cfg.junkWords);
          const nameLower = name.toLowerCase();
          const filtered = live.filter((s) => !seen.has(s.norm_key) && (s.artist.toLowerCase().includes(nameLower) || nameLower.includes(s.artist.toLowerCase())));
          return json({ artist: name, page, hasMore: live.length >= 25, songs: filtered, albums: [] }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/sheets") {
        const q = (url.searchParams.get("q") || "").trim(), cat = (url.searchParams.get("cat") || "").trim(), page = Math.max(1, Number(url.searchParams.get("page") || 1));
        return withEdgeCache(ctx, `/sheets/${encodeURIComponent(q)}/${encodeURIComponent(cat)}/${page}`, 600, async (ttl) => {
          const sheets = q ? await liveSearchSheets(q, 24, page) : await fetchRecommendSheets(cat || "全部", 24, page);
          return json({ sheets, hasMore: sheets.length >= 20 }, 200, sheets.length ? { "Cache-Control": `public, max-age=${ttl}` } : { "X-Skip-Cache": "1" });
        });
      }
      if (path === "/api/sheet") {
        const rawId = (url.searchParams.get("id") || "").trim();
        if (!rawId) return json({ error: "missing id" }, 400);
        const nid = rawId.replace(/^ne_/, "");
        return withEdgeCache(ctx, `/sheet/${encodeURIComponent(nid)}`, 900, async (ttl) => {
          const detail = await fetchNeteasePlaylistDetail(nid, 150);
          if (!detail) return json({ error: "sheet not found" }, 404);
          return json({ sheet: { id: detail.id, title: detail.title, artist: detail.artist, cover: detail.cover, description: detail.description }, songs: detail.songs }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/import-sheet") {
        let inputUrl = url.searchParams.get("url") || "";
        if (request.method === "POST") {
          const body = await request.json().catch(() => ({}));
          inputUrl = body.url || inputUrl;
        }
        const imported = await importExternalPlaylist(inputUrl, env);
        if (!imported || !imported.songs?.length) return json({ error: "未能识别该歌单链接，支持网易云、QQ音乐公开歌单或 Music Hub 分享链接" }, 400);
        return json(imported);
      }
      if (path === "/api/share" && request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        const title = String(body.title || "我的歌单").trim().slice(0, 60);
        const songs = Array.isArray(body.songs) ? body.songs.slice(0, 300) : [];
        if (!songs.length) return json({ error: "空歌单无法分享" }, 400);
        const slim = songs.map((s) => ({
          id: Number(s.id || 0), norm_key: s.norm_key || makeNormKey(s.title, s.artist),
          title: String(s.title || ""), artist: String(s.artist || ""), album: String(s.album || ""),
          cover: httpsCover(s.cover || ""), duration: Number(s.duration || 0),
          ext_source: s.ext_source || "", ext_id: s.ext_id || "",
        }));
        const sid = (await digestHex("SHA-256", title + ":" + JSON.stringify(slim) + ":" + Date.now())).slice(0, 10);
        await env.DB.prepare("INSERT INTO shares (id, title, description, songs_json, created_at) VALUES (?, ?, ?, ?, ?)")
          .bind(sid, title, String(body.description || "Music Hub 用户分享歌单").slice(0, 120), JSON.stringify(slim), Math.floor(Date.now() / 1000))
          .run();
        const qs = env.ACCESS_TOKEN ? `&token=${encodeURIComponent(env.ACCESS_TOKEN)}` : "";
        return json({ ok: true, id: sid, shareUrl: `${url.origin}/player?share=${sid}${qs}` });
      }
      if (path === "/api/share" && request.method === "GET") {
        const sid = (url.searchParams.get("id") || "").trim();
        if (!sid) return json({ error: "missing id" }, 400);
        const row = await env.DB.prepare("SELECT * FROM shares WHERE id = ?").bind(sid).first();
        if (!row) return json({ error: "分享歌单不存在" }, 404);
        return json({ id: row.id, title: row.title, description: row.description, songs: JSON.parse(row.songs_json || "[]") });
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
            return { id: 0, norm_key: makeNormKey(s.name, artists), title: s.name, artist: artists, album: alb.name || "", cover: httpsCover(alb.picUrl || s.al?.picUrl || ""), duration: Math.round((s.dt || s.duration || 0) / 1000), category: "专辑", ext_source: "netease", ext_id: String(s.id) };
          });
          return json({ album: { id, title: alb.name || "", cover: httpsCover(alb.picUrl || ""), artist: alb.artist?.name || "", description: (alb.description || "").slice(0, 120) }, songs }, 200, songs.length ? { "Cache-Control": `public, max-age=${ttl}` } : { "X-Skip-Cache": "1" });
        });
      }
      if (path === "/api/search") {
        const q = (url.searchParams.get("q") || "").trim(), page = Math.max(1, Number(url.searchParams.get("page") || 1));
        if (!q) return json({ songs: [] });
        return withEdgeCache(ctx, `/search/${encodeURIComponent(q)}/${page}`, 300, async (ttl) => {
          const cfg = await getRuntimeCfg(env);
          let localRows = [];
          if (page === 1) {
            const tokens = q.split(/\s+/).map((t) => t.replace(/"/g, "").trim()).filter(Boolean);
            if (tokens.length && tokens.every((t) => t.length >= 3)) {
              const ftsQuery = tokens.map((t) => `"${t}"`).join(" ");
              localRows = ((await env.DB.prepare(`SELECT s.id,s.norm_key,s.title,s.artist,s.album,s.cover,s.duration,s.category,s.source_ids_json FROM songs_fts f JOIN songs s ON s.id = f.rowid WHERE songs_fts MATCH ? AND s.is_blocked = 0 ORDER BY s.score DESC LIMIT 30`).bind(ftsQuery).all()).results || [])
                .map((r) => ({ ...r, cover: httpsCover(r.cover) }));
            }
            if (!localRows.length && tokens.length) {
              const likeConds = tokens.map(() => "(title LIKE ? OR artist LIKE ? OR album LIKE ?)").join(" AND ");
              const likeParams = tokens.flatMap((t) => [`%${t}%`, `%${t}%`, `%${t}%`]);
              localRows = ((await env.DB.prepare(`SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked = 0 AND ${likeConds} ORDER BY score DESC LIMIT 25`).bind(...likeParams).all()).results || [])
                .map((r) => ({ ...r, cover: httpsCover(r.cover) }));
            }
          }
          const merged = [...localRows], seen = new Set(merged.map((r) => r.norm_key));
          const live = await liveSearchSongs(q, 40, page, cfg.junkWords);
          for (const item of live) if (!seen.has(item.norm_key)) { seen.add(item.norm_key); merged.push(item); }
          return json({ page, hasMore: live.length >= 30, songs: merged }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/song") {
        const rawId = url.searchParams.get("id") || "";
        const id = /^\d+$/.test(rawId) ? Number(rawId) : 0;
        if (id > 0) {
          const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(id).first();
          if (song) {
            if (!song.lyric_lrc) {
              const ids = JSON.parse(song.source_ids_json || "{}");
              const live = await fetchLiveLyric(ids.netease ? "netease" : ids.msr ? "msr" : "", ids.netease || ids.msr || "", song.title, song.artist);
              if (live.lrc) { song.lyric_lrc = live.lrc; song.lyric_trans = live.trans; ctx.waitUntil(env.DB.prepare("UPDATE songs SET lyric_lrc = ?, lyric_trans = ? WHERE id = ?").bind(live.lrc, live.trans, id).run()); }
            }
            return json({ song: { ...song, cover: httpsCover(song.cover) } });
          }
        }
        const live = await fetchLiveLyric(url.searchParams.get("ext_source") || "", url.searchParams.get("ext_id") || "", url.searchParams.get("title") || "", url.searchParams.get("artist") || "");
        return json({ song: { id: 0, lyric_lrc: live.lrc, lyric_trans: live.trans } });
      }
      if (path === "/api/play") {
        const rawId = url.searchParams.get("id") || "";
        let id = /^\d+$/.test(rawId) ? Number(rawId) : 0;
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

        const cache = caches.default, cacheKey = new Request(`https://cache.internal/v6/play/${id}/${quality}/${prefer || "auto"}/${skip || "none"}`);
        let resolved = null;
        if (!force) {
          const cached = await cache.match(cacheKey);
          if (cached) resolved = await cached.json().catch(() => null);
        }
        if (!resolved) {
          resolved = await resolvePlayUrl(song, quality, env, prefer, skip);
          if (resolved.error) return json(resolved, 502);
          if (resolved.kuwoId) {
            const ids = JSON.parse(song.source_ids_json || "{}");
            if (!ids.kuwo) { ids.kuwo = resolved.kuwoId; ctx.waitUntil(env.DB.prepare("UPDATE songs SET source_ids_json = ? WHERE id = ?").bind(JSON.stringify(ids), id).run()); }
          }
          ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(resolved), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=900" } })));
        }

        const needProxy = Boolean(resolved.needProxy || resolved.url.startsWith("http://"));
        const token = getTokenFromReq(request, pathToken);
        const proxyUrl = `${url.origin}/api/stream?u=${encodeURIComponent(resolved.url)}&src=${encodeURIComponent(resolved.source || "")}&token=${encodeURIComponent(token || "")}`;
        return json({ ...resolved, needProxy, songId: id, proxyUrl }, 200, { "Cache-Control": "private, no-store" });
      }

      if (path === "/api/mf-plugin.js" || path === "/music-hub.js") {
        const base = `${url.protocol}//${url.host}`;
        const pluginCode = `"use strict";
const axios = require("axios");
const BASE = ${JSON.stringify(base)};
const TOKEN = ${JSON.stringify(env.ACCESS_TOKEN || "")};
const H = TOKEN ? { "X-Access-Token": TOKEN } : {};
const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";
const JUNK = ["dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok", "消音版"];

function cleanTitle(t) {
  return String(t || "").split("(")[0].split("（")[0].split("[")[0].split("【")[0].trim();
}
function isJunk(name, origTitle) {
  var n = String(name || "").toLowerCase();
  var o = String(origTitle || "").toLowerCase();
  return JUNK.some(function(w) { return n.indexOf(w) >= 0 && o.indexOf(w) < 0; });
}
function mapSong(s) {
  var uid = (s.id && Number(s.id) > 0)
    ? String(s.id)
    : (s.ext_source && s.ext_id ? (s.ext_source + "_" + s.ext_id) : (s.norm_key || (s.title + "_" + s.artist)));
  return {
    id: uid, title: s.title, artist: s.artist, album: s.album,
    artwork: s.cover, duration: s.duration, category: s.category || "",
    ext_source: s.ext_source || "", ext_id: s.ext_id || ""
  };
}
function mapSheet(p) {
  return {
    id: String(p.id), title: p.title, artist: p.artist || "MusicHub",
    artwork: p.cover, playCount: p.playCount || 0, worksNum: p.worksNum || 0,
    description: p.description || ""
  };
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
  version: "2.1.0",
  cacheControl: "no-cache",
  supportedSearchType: ["music", "album", "artist", "sheet"],
  hints: {
    importMusicSheet: [
      "支持导入网易云音乐、QQ音乐公开歌单链接",
      "支持导入 Music Hub 网页播放器生成的歌单分享链接"
    ],
    importMusicItem: [
      "支持导入网易云单曲链接（如 https://music.163.com/#/song?id=190449）"
    ]
  },

  async search(query, page, type) {
    if (type === "album") {
      const { data } = await axios.get(BASE + "/api/albums", { params: { q: query, page: page }, headers: H, timeout: 10000 });
      return { isEnd: !data.hasMore, data: (data.albums || []).map(function(a) { return { id: String(a.id), title: a.title, artist: a.artist, artwork: a.cover, date: a.publishTime }; }) };
    }
    if (type === "artist") {
      const { data } = await axios.get(BASE + "/api/artists", { params: { q: query, page: page }, headers: H, timeout: 10000 });
      return { isEnd: !data.hasMore, data: (data.artists || []).map(function(a) { return { id: String(a.id), name: a.name, avatar: a.avatar, worksNum: a.worksNum || 0, description: a.tag || "" }; }) };
    }
    if (type === "sheet") {
      const { data } = await axios.get(BASE + "/api/sheets", { params: { q: query, page: page }, headers: H, timeout: 10000 });
      return { isEnd: !data.hasMore, data: (data.sheets || []).map(mapSheet) };
    }
    if (type !== "music") return { isEnd: true, data: [] };
    const { data } = await axios.get(BASE + "/api/search", { params: { q: query, page: page }, headers: H, timeout: 10000 });
    return { isEnd: !data.hasMore, data: (data.songs || []).map(mapSong) };
  },

  async getArtistWorks(artistItem, page, type) {
    const { data } = await axios.get(BASE + "/api/artist", { params: { name: artistItem.name, id: artistItem.id || "", page: page }, headers: H, timeout: 10000 });
    if (type === "album") {
      return { isEnd: true, data: (data.albums || []).map(function(a) { return { id: String(a.id), title: a.title, artist: a.artist || artistItem.name, artwork: a.cover, date: a.publishTime }; }) };
    }
    return { isEnd: !data.hasMore, data: (data.songs || []).map(mapSong) };
  },

  async getAlbumInfo(albumItem, page) {
    if (page && page > 1) return { isEnd: true, albumItem: albumItem, musicList: [] };
    const { data } = await axios.get(BASE + "/api/album", { params: { id: albumItem.id }, headers: H, timeout: 10000 });
    return { isEnd: true, albumItem: albumItem, musicList: (data.songs || []).map(mapSong) };
  },

  async getRecommendSheetTags() {
    const { data } = await axios.get(BASE + "/api/home", { headers: H, timeout: 8000 });
    var tags = data.sheetTags || [{ id: "华语", title: "华语" }, { id: "怀旧", title: "怀旧" }, { id: "流行", title: "流行" }, { id: "ACG", title: "ACG" }];
    return { pinned: tags.slice(0, 6), data: [{ title: "全网精选歌单", data: tags }] };
  },

  async getRecommendSheetsByTag(tag, page) {
    var cat = (tag && (tag.id || tag.title)) ? (tag.id || tag.title) : "华语";
    const { data } = await axios.get(BASE + "/api/sheets", { params: { cat: cat, page: page }, headers: H, timeout: 10000 });
    return { isEnd: !data.hasMore, data: (data.sheets || []).map(mapSheet) };
  },

  async getMusicSheetInfo(sheetItem, page) {
    var sid = String(sheetItem.id || "");
    if (sid.indexOf("ne_") === 0 || new RegExp("^\\\\d+$").test(sid)) {
      const { data } = await axios.get(BASE + "/api/sheet", { params: { id: sid }, headers: H, timeout: 10000 });
      var list = (data.songs || []).map(mapSong), p = page || 1, ps = 50;
      return { isEnd: p * ps >= list.length, sheetItem: sheetItem, musicList: list.slice((p - 1) * ps, p * ps) };
    }
    const { data } = await axios.get(BASE + "/api/chart", { params: { id: sid }, headers: H, timeout: 10000 });
    var clist = (data.songs || []).map(mapSong), cp = page || 1, cps = 50;
    return { isEnd: cp * cps >= clist.length, sheetItem: sheetItem, musicList: clist.slice((cp - 1) * cps, cp * cps) };
  },

  async importMusicSheet(urlLike) {
    const { data } = await axios.get(BASE + "/api/import-sheet", { params: { url: urlLike }, headers: H, timeout: 15000 });
    return (data.songs || []).map(mapSong);
  },

  async importMusicItem(urlLike) {
    var m = String(urlLike || "").match(new RegExp("(?:song\\\\?id=|song/)(\\\\d+)"));
    if (!m) return null;
    const { data } = await axios.get(BASE + "/api/search", { params: { q: m[1], page: 1 }, headers: H, timeout: 8000 });
    var hit = (data.songs || [])[0];
    return hit ? mapSong(hit) : null;
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
            params: { use_xbridge3: "true", types: "search", source: plat, name: kw, count: 5, pages: 1 },
            headers: hdrs, timeout: 4500
          }).then(function(r) {
            if (!Array.isArray(r.data) || !r.data.length) return "";
            var picked = r.data.find(function(x) { return !isJunk(x.name, item.title); }) || r.data[0];
            return picked && picked.id ? String(picked.id) : "";
          });

      return pidP.then(function(pid) {
        if (!pid) return Promise.reject("no_id");
        return axios.get("https://music-api.gdstudio.xyz/api.php", {
          params: { use_xbridge3: "true", types: "url", source: plat, id: pid, br: br },
          headers: hdrs, timeout: 4500
        });
      }).then(function(r) {
        var d = r.data;
        if (!d || !d.url || d.url.indexOf("panspace") >= 0 || !isFullSize(d.size)) return Promise.reject("trial");
        if (dur >= 90) {
          return axios.get(d.url, { headers: Object.assign({ Range: "bytes=0-0" }, hdrs), timeout: 2500 }).then(function(hr) {
            var cr = (hr.headers && hr.headers["content-range"]) || "";
            var m = cr.match(new RegExp("/(\\\\d+)"));
            var cl = m ? Number(m[1]) : Number((hr.headers && hr.headers["content-length"]) || 0);
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
    if (data.needProxy && data.proxyUrl) return { url: data.proxyUrl };
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

      if (path === "/api/lx-source.js" || path === "/lx-source.js") {
        const base = `${url.protocol}//${url.host}`;
        const lxCode = `/*!
 * @name MusicHub·自建云端
 * @description 基于 Music Hub Worker 的洛雪音乐自定义源（多源并发 + 防30秒试听）
 * @version 2.1.0
 * @author MusicHub
 */
const { EVENT_NAMES, request, on, send } = globalThis.lx;
const BASE = ${JSON.stringify(base)};
const TOKEN = ${JSON.stringify(env.ACCESS_TOKEN || "")};

function toSec(iv) {
  if (!iv) return 0;
  if (typeof iv === "number") return Math.round(iv > 10000 ? iv / 1000 : iv);
  var p = String(iv).split(":").map(Number);
  if (p.length === 2) return p[0] * 60 + p[1];
  if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
  return 0;
}

on(EVENT_NAMES.request, ({ source, action, info }) => {
  if (action !== "musicUrl") return Promise.reject(new Error("unsupported action"));
  var mi = info.musicInfo || {};
  var q = (info.type === "flac" || info.type === "flac24bit") ? "super" : (info.type === "128k" ? "low" : "high");
  var extSrc = source === "wy" ? "netease" : (source === "kw" ? "kuwo" : (source === "tx" ? "qq" : ""));
  var extId = String(mi.songmid || mi.id || "");
  var dur = toSec(mi.interval);
  var qs = "?id=0&q=" + encodeURIComponent(q)
    + "&ext_source=" + encodeURIComponent(extSrc)
    + "&ext_id=" + encodeURIComponent(extId)
    + "&title=" + encodeURIComponent(mi.name || "")
    + "&artist=" + encodeURIComponent(mi.singer || "")
    + "&album=" + encodeURIComponent(mi.albumName || "")
    + "&duration=" + dur
    + (TOKEN ? "&token=" + encodeURIComponent(TOKEN) : "");

  return new Promise((resolve, reject) => {
    request(BASE + "/api/play" + qs, { method: "GET", timeout: 15000 }, (err, resp) => {
      if (err) return reject(err);
      var data = resp && resp.body;
      if (typeof data === "string") { try { data = JSON.parse(data); } catch (e) {} }
      if (!data || data.error || !data.url) return reject(new Error((data && data.error) || "解析失败"));
      resolve(data.needProxy && data.proxyUrl ? data.proxyUrl : data.url);
    });
  });
});

send(EVENT_NAMES.inited, {
  openDevTools: false,
  sources: {
    wy: { name: "网易云", type: "music", actions: ["musicUrl"], qualitys: ["128k", "320k", "flac"] },
    tx: { name: "QQ音乐", type: "music", actions: ["musicUrl"], qualitys: ["128k", "320k"] },
    kw: { name: "酷我", type: "music", actions: ["musicUrl"], qualitys: ["128k", "320k"] }
  }
});`;
        return new Response(lxCode, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
      }

      if (path === "/musicfree.json") {
        const tkSeg = encodeURIComponent(env.ACCESS_TOKEN || "public");
        return json({
          plugins: [
            { name: "MusicHub·自建云端", url: `${url.protocol}//${url.host}/s/${tkSeg}/music-hub.js`, version: "2.1.0" },
          ],
        });
      }
      return json({ error: "Not Found" }, 404);
    } catch (err) {
      return json({ error: err?.message || String(err) }, 500);
    }
  },
};
