import { PLAYER_HTML } from "./player_html.js";
import { ADMIN_HTML } from "./admin_html.js";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const NE_HEADERS = { "User-Agent": UA, Referer: "https://music.163.com/", Cookie: "os=pc; appver=2.9.7" };

const PRESET_ARTISTS = [
  { name: "周杰伦", cat: "华语男", tag: "华语流行" }, { name: "陈奕迅", cat: "华语男", tag: "华语流行" },
  { name: "林俊杰", cat: "华语男", tag: "华语流行" }, { name: "陶喆", cat: "华语男", tag: "R&B教父" },
  { name: "王力宏", cat: "华语男", tag: "华语流行" }, { name: "薛之谦", cat: "华语男", tag: "流行情歌" },
  { name: "许嵩", cat: "华语男", tag: "原创才子" }, { name: "毛不易", cat: "华语男", tag: "民谣流行" },
  { name: "李荣浩", cat: "华语男", tag: "都市流行" }, { name: "周深", cat: "华语男", tag: "天籁美声" },
  { name: "张杰", cat: "华语男", tag: "华语流行" }, { name: "林宥嘉", cat: "华语男", tag: "迷幻情歌" },
  { name: "方大同", cat: "华语男", tag: "灵魂R&B" }, { name: "汪苏泷", cat: "华语男", tag: "流行创作" },
  { name: "胡彦斌", cat: "华语男", tag: "全能唱作" }, { name: "张敬轩", cat: "华语男", tag: "粤语流行" },
  { name: "邓紫棋", cat: "华语女", tag: "华语流行" }, { name: "孙燕姿", cat: "华语女", tag: "华语天后" },
  { name: "梁静茹", cat: "华语女", tag: "情歌天后" }, { name: "田馥甄", cat: "华语女", tag: "文艺流行" },
  { name: "蔡依林", cat: "华语女", tag: "唱跳天后" }, { name: "张靓颖", cat: "华语女", tag: "海豚音" },
  { name: "张韶涵", cat: "华语女", tag: "励志流行" }, { name: "郁可唯", cat: "华语女", tag: "OST女王" },
  { name: "单依纯", cat: "华语女", tag: "新生代" }, { name: "袁娅维", cat: "华语女", tag: "Neo-Soul" },
  { name: "徐佳莹", cat: "华语女", tag: "创作女声" }, { name: "杨千嬅", cat: "华语女", tag: "粤语情歌" },
  { name: "容祖儿", cat: "华语女", tag: "港乐天后" }, { name: "张学友", cat: "经典怀旧", tag: "经典歌神" },
  { name: "王菲", cat: "经典怀旧", tag: "经典天后" }, { name: "邓丽君", cat: "经典怀旧", tag: "时代金曲" },
  { name: "张国荣", cat: "经典怀旧", tag: "粤语传奇" }, { name: "李宗盛", cat: "经典怀旧", tag: "华语宗师" },
  { name: "刘德华", cat: "经典怀旧", tag: "四大天王" }, { name: "莫文蔚", cat: "经典怀旧", tag: "经典情歌" },
  { name: "伍佰", cat: "经典怀旧", tag: "摇滚经典" }, { name: "Beyond", cat: "经典怀旧", tag: "粤语摇滚" },
  { name: "谭咏麟", cat: "经典怀旧", tag: "粤语殿堂" }, { name: "林忆莲", cat: "经典怀旧", tag: "都会情歌" },
  { name: "罗大佑", cat: "经典怀旧", tag: "音乐教父" }, { name: "周华健", cat: "经典怀旧", tag: "国民歌王" },
  { name: "任贤齐", cat: "经典怀旧", tag: "90年代" }, { name: "张信哲", cat: "经典怀旧", tag: "情歌王子" },
  { name: "五月天", cat: "乐队组合", tag: "摇滚乐团" }, { name: "告五人", cat: "乐队组合", tag: "独立乐团" },
  { name: "草东没有派对", cat: "乐队组合", tag: "独立摇滚" }, { name: "万能青年旅店", cat: "乐队组合", tag: "摇滚神专" },
  { name: "新裤子", cat: "乐队组合", tag: "复古迪斯科" }, { name: "朴树", cat: "乐队组合", tag: "民谣摇滚" },
  { name: "许巍", cat: "乐队组合", tag: "人文摇滚" }, { name: "赵雷", cat: "乐队组合", tag: "城市民谣" },
  { name: "陈粒", cat: "乐队组合", tag: "独立民谣" }, { name: "S.H.E", cat: "乐队组合", tag: "国民女团" },
  { name: "YOASOBI", cat: "日韩", tag: "日语流行" }, { name: "米津玄师", cat: "日韩", tag: "日语创作" },
  { name: "久石让", cat: "日韩", tag: "电影配乐" }, { name: "宇多田光", cat: "日韩", tag: "日本天后" },
  { name: "RADWIMPS", cat: "日韩", tag: "日系摇滚" }, { name: "藤井风", cat: "日韩", tag: "R&B流行" },
  { name: "IU", cat: "日韩", tag: "韩国女solo" }, { name: "BLACKPINK", cat: "日韩", tag: "K-Pop" },
  { name: "Aimer", cat: "ACG", tag: "动漫歌姬" }, { name: "泽野弘之", cat: "ACG", tag: "燃系OST" },
  { name: "LiSA", cat: "ACG", tag: "动画主题曲" }, { name: "塞壬唱片-MSR", cat: "ACG", tag: "明日方舟" },
  { name: "HOYO-MiX", cat: "ACG", tag: "米哈游原声" }, { name: "Vanguard Sound", cat: "ACG", tag: "游戏电音" },
  { name: "Taylor Swift", cat: "欧美", tag: "欧美流行" }, { name: "Coldplay", cat: "欧美", tag: "英伦摇滚" },
  { name: "Ed Sheeran", cat: "欧美", tag: "流行民谣" }, { name: "Adele", cat: "欧美", tag: "灵魂女声" },
  { name: "Linkin Park", cat: "欧美", tag: "新金属" }, { name: "Alan Walker", cat: "欧美", tag: "电音精选" },
  { name: "The Weeknd", cat: "欧美", tag: "Synth-Pop" }, { name: "Bruno Mars", cat: "欧美", tag: "Funk流行" },
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

const DEFAULT_JUNK_WORDS = ["dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok", "消音版", "片段", "高潮版", "0.8x", "1.2x", "翻唱", "cover", "吉他版", "钢琴版", "弹唱", "纯音乐", "instrumental", "钢琴曲", "演奏版", "背景音乐", "轻音乐", "伴奏版"];
const SOFT_PENALTY_WORDS = ["live", "现场", "演唱会", "翻唱", "cover", "吉他版", "钢琴版", "纯享", "加速", "降调"];
const SHEET_TAGS = [
  { id: "华语", title: "华语" }, { id: "流行", title: "流行" }, { id: "怀旧", title: "怀旧" },
  { id: "粤语", title: "粤语" }, { id: "欧美", title: "欧美" }, { id: "日语", title: "日语" },
  { id: "ACG", title: "ACG" }, { id: "民谣", title: "民谣" }, { id: "摇滚", title: "摇滚" },
  { id: "说唱", title: "说唱" }, { id: "轻音乐", title: "轻音乐" }, { id: "影视原声", title: "影视原声" },
];
const BILI_MIXIN_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33,
  9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26,
  17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34,
  44, 52,
];

let runtimeCfgCache = { ts: 0, junkWords: DEFAULT_JUNK_WORDS, sources: [], subMode: "fusion" };
let biliAuthCache = { buvid3: "", buvid4: "", imgKey: "", subKey: "", ts: 0 };

async function getRuntimeCfg(env) {
  const now = Date.now();
  if (now - runtimeCfgCache.ts < 30000 && runtimeCfgCache.sources.length) return runtimeCfgCache;
  try {
    const [setRes, srcRes] = await Promise.all([
      env.DB.prepare("SELECT key, value FROM settings WHERE key IN ('junk_words','sub_mode')").all(),
      env.DB.prepare("SELECT * FROM sources ORDER BY priority ASC").all(),
    ]);
    const kv = Object.fromEntries((setRes.results || []).map((r) => [r.key, r.value]));
    const jw = (kv.junk_words || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    runtimeCfgCache = {
      ts: now,
      junkWords: jw.length ? jw : DEFAULT_JUNK_WORDS,
      sources: srcRes.results || [],
      subMode: kv.sub_mode || "fusion",
    };
  } catch {
    runtimeCfgCache = { ts: now, junkWords: DEFAULT_JUNK_WORDS, sources: [], subMode: "fusion" };
  }
  return runtimeCfgCache;
}
function invalidateCfgCache() { runtimeCfgCache.ts = 0; }

function fetchTimeout(url, opts = {}, ms = 4000) { return fetch(url, { ...opts, signal: AbortSignal.timeout(ms) }); }
function raceWithDeadline(promise, ms) {
  return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("deadline")), ms))]);
}
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
  const cache = caches.default, cacheKey = new Request("https://cache.internal/v11" + keyPath);
  const hit = await cache.match(cacheKey);
  if (hit) return hit;
  const resp = await fn(ttlSec);
  if (resp.status === 200 && !resp.headers.has("X-Skip-Cache")) ctx.waitUntil(cache.put(cacheKey, resp.clone()));
  return resp;
}
async function purgeHomeCache(ctx) {
  ctx.waitUntil(caches.default.delete(new Request("https://cache.internal/v10/home")));
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
// Normalize raw NetEase Cloud Music song objects into Music Hub's shared song shape.
// This helper is used by search, artist pages, playlist imports and radio fallbacks.
function mapNeteaseSong(song) {
  if (!song || typeof song !== "object") return null;
  const title = String(song.name || song.title || "").trim();
  if (!title) return null;
  const rawArtists = song.ar || song.artists || song.artist || [];
  const artist = Array.isArray(rawArtists)
    ? rawArtists.map((a) => typeof a === "string" ? a : a?.name || "").filter(Boolean).join(" / ")
    : String(rawArtists || "");
  const albumObj = song.al || song.album || {};
  const album = String(albumObj?.name || song.albumName || "");
  const cover = httpsCover(albumObj?.picUrl || albumObj?.blurPicUrl || song.picUrl || song.cover || "");
  const rawDuration = Number(song.dt ?? song.duration ?? song.duration_ms ?? 0);
  const duration = rawDuration > 10000 ? Math.round(rawDuration / 1000) : Math.round(rawDuration);
  const songId = String(song.id || song.songId || "");
  return {
    id: 0,
    norm_key: makeNormKey(title, artist || "未知歌手"),
    title,
    artist: artist || "未知歌手",
    album,
    cover,
    duration,
    category: "全网搜索",
    source_ids_json: songId ? JSON.stringify({ netease: songId }) : "{}",
    ext_source: songId ? "netease" : "",
    ext_id: songId,
  };
}
function isJunkTitle(title, query = "", junkList = DEFAULT_JUNK_WORDS) {
  const t = (title || "").toLowerCase(), q = (query || "").toLowerCase();
  return junkList.some((w) => t.includes(w) && !q.includes(w));
}

// 全歌手 Token 原版打分器：合唱曲命中任一主唱即加分 + 72% 时长底线

function cleanLrcText(raw) {
  if (!raw) return "";
  return raw.split(/\r?\n/).filter((l) => !["作词 :", "作曲 :", "编曲 :", "制作人 :", "QQ音乐", "网易云"].some((k) => l.includes(k))).join("\n").trim();
}
function isBasicAudioUrl(u) {
  return Boolean(u && typeof u === "string" && u.startsWith("http") && !u.includes("panspace.kuwo.cn") && !u.includes("/404"));
}

function decodeHtml(s) {
  return String(s || "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');
}

function parseCnInterval(str) {
  const s = String(str || "");
  if (!s) return 0;
  const m = s.match(/(?:(\d+)\s*分)?\s*(\d+)\s*秒/);
  if (m) return Number(m[1] || 0) * 60 + Number(m[2] || 0);
  const p = s.split(":").map(Number);
  return p.length === 2 ? p[0] * 60 + p[1] : 0;
}

async function verifyNot30sTrial(url, durationSec, extraHeaders = {}, minBitrateKbps = 44, strict = false) {
  if (!isBasicAudioUrl(url)) return null;
  try {
    const res = await fetchTimeout(url, { method: "GET", headers: { Range: "bytes=0-0", "User-Agent": UA, ...extraHeaders }, redirect: "follow" }, 1800);
    if (res.body) res.body.cancel().catch(() => {});
    if (res.url && (res.url.includes("/404") || res.url.includes("panspace.kuwo.cn"))) return null;
    if (res.status === 404 || res.status === 410) return null;
    if (res.status === 200 || res.status === 206) {
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (ct.includes("text/html") || ct.includes("application/json")) return null;
      const cr = res.headers.get("content-range") || "";
      const m = cr.match(/\/(\d+)$/);
      const totalLen = m ? Number(m[1]) : (res.status === 200 ? Number(res.headers.get("content-length") || 0) : 0);
      if (totalLen > 0) {
        const minBytes = durationSec >= 90
          ? Math.max(320 * 1024, Math.round(durationSec * (minBitrateKbps / 8) * 1024))
          : (durationSec === 0 ? 320 * 1024 : 0);
        if (minBytes > 0 && totalLen < minBytes) return null;
      }
      return res.url || url;
    }
    return strict ? null : url;
  } catch {
    return strict ? null : url;
  }
}

function hasBadVariantMeta(title, artist = "", album = "") {
  const meta = decodeHtml([title, Array.isArray(artist) ? artist.join(" ") : artist, album].join(" ")).toLowerCase();
  return /(纯音乐|纯钢琴|instrumental|钢琴曲|钢琴演奏|演奏版|器乐版|背景音乐|轻音乐|伴奏版|卡拉.?ok|翻唱|cover|吉他版|弹唱|翻奏|dj版)/i.test(meta);
}
function isStrictSong(song) {
  const artist = decodeHtml(song?.artist || "").toLowerCase();
  const title = decodeHtml(song?.title || "").toLowerCase();
  return VERY_HARD_TRACKS.some((t) => title.includes(t.toLowerCase())) || HARD_ARTISTS.some((a) => artist.includes(a));
}
function artistIdentityMatches(candidateArtist, expectedArtist) {
  const c = normalizeName(decodeHtml(Array.isArray(candidateArtist) ? candidateArtist.join(" ") : candidateArtist));
  const e = normalizeName(decodeHtml(String(expectedArtist || "").split(/[\/,、&]/)[0]));
  if (!e) return true;
  if (!c) return false;
  if (c.includes(e) || e.includes(c)) return true;
  const groups = [
    ["周杰伦", "jay chou", "周董"],
    ["林俊杰", "jj lin", "jj"],
    ["陈奕迅", "eason chan"],
    ["邓紫棋", "g.e.m.", "gem"],
    ["薛之谦", "joker xue"],
    ["陶喆", "david tao"],
    ["王力宏", "wang leehom", "leehom wang"],
  ];
  return groups.some((g) => g.some((a) => e.includes(normalizeName(a))) && g.some((a) => c.includes(normalizeName(a))));
}
function scoreCandidate(cTitle, cArtist, oTitle, oArtist, cDur, oDur, junkWords = DEFAULT_JUNK_WORDS, strictArtist = false, cAlbum = "") {
  const raw = decodeHtml(cTitle).toLowerCase(), ro = decodeHtml(oTitle).toLowerCase();
  if (!raw || hasBadVariantMeta(cTitle, cArtist, cAlbum)) return -999;
  if (junkWords.some((w) => raw.includes(w) && !ro.includes(w))) return -999;
  const d = Number(cDur || 0), od = Number(oDur || 0);
  if (od >= 90 && d > 0 && (d <= 65 || d < od * 0.72)) return -999;
  if (strictArtist && oArtist && !artistIdentityMatches(cArtist, oArtist)) return -999;
  let sc = 0;
  const t = normalizeName(raw), ot = normalizeName(ro);
  sc += (t === ot) ? 55 : ((t.includes(ot) || ot.includes(t)) ? 20 : -45);
  const oaList = decodeHtml(oArtist).split(/[\/,、&]/).map(normalizeName).filter((x) => x && x !== "未知歌手");
  const ca = normalizeName(decodeHtml(Array.isArray(cArtist) ? cArtist.join(" ") : cArtist));
  if (oaList.length && ca) sc += oaList.some((a) => ca.includes(a) || a.includes(ca)) ? 65 : -120;
  const softPenalty = ["live", "现场", "演唱会", "翻唱", "cover", "吉他版", "钢琴版", "纯享", "加速", "降调"];
  for (const w of softPenalty) if (raw.includes(w) && !ro.includes(w)) sc -= 45;
  if (od > 30 && d > 0) {
    const diff = Math.abs(d - od);
    sc += (diff <= 5) ? 45 : (diff <= 15 ? 20 : (diff > 35 ? -40 : 0));
  }
  return sc;
}

async function liveSearchSongs(query, limit = 40, page = 1, junkList = DEFAULT_JUNK_WORDS, offsetOverride = null) {
  const out = [], seen = new Set();
  const parsedOffset = Number(offsetOverride);
  const offset = offsetOverride !== null && Number.isFinite(parsedOffset)
    ? Math.max(0, parsedOffset)
    : Math.max(0, (page - 1) * limit);
  const endpoints = [
    `https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=1&limit=${limit}&offset=${offset}`,
    `https://music.163.com/api/search/get?s=${encodeURIComponent(query)}&type=1&limit=${limit}&offset=${offset}`,
  ];
  const responses = await Promise.allSettled(endpoints.map(async (ep) => {
    const r = await fetchTimeout(ep, { headers: NE_HEADERS }, 3500);
    if (!r.ok) throw new Error(`netease_http_${r.status}`);
    const ct = (r.headers.get("content-type") || "").toLowerCase();
    if (ct && !ct.includes("json")) throw new Error("netease_non_json");
    const data = await r.json();
    return data?.result?.songs || [];
  }));
  for (const result of responses) {
    if (result.status !== "fulfilled") continue;
    for (const song of result.value) {
      if (!song?.name || isJunkTitle(song.name, query, junkList)) continue;
      const item = mapNeteaseSong(song);
      if (seen.has(item.norm_key)) continue;
      seen.add(item.norm_key);
      out.push(item);
    }
  }
  return out;
}

async function liveSearchGdSongs(query, limit = 30, page = 1, junkList = DEFAULT_JUNK_WORDS) {
  const out = [], seen = new Set();
  const base = "https://music-api.gdstudio.xyz/api.php?use_xbridge3=true";
  // GD Studio's source parameter accepts one provider per request. Run the stable
  // NetEase and JOOX routes independently so a comma-separated source value cannot
  // invalidate the whole fallback.
  const providers = ["netease", "joox"];
  const batches = await Promise.allSettled(providers.map(async (source) => {
    const url = `${base}&types=search&source=${source}&name=${encodeURIComponent(query)}&count=${Math.min(30, limit)}&pages=${Math.max(1, page)}`;
    const r = await fetchTimeout(url, { headers: { "User-Agent": UA, Accept: "application/json", Referer: "https://music.gdstudio.xyz/" } }, 4200);
    if (!r.ok) throw new Error(`gd_search_${source}_${r.status}`);
    const ct = (r.headers.get("content-type") || "").toLowerCase();
    if (ct && !ct.includes("json")) throw new Error(`gd_search_${source}_non_json`);
    const data = await r.json();
    if (!Array.isArray(data)) throw new Error(`gd_search_${source}_bad_payload`);
    return data;
  }));
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    if (batch.status !== "fulfilled") continue;
    for (const item of batch.value) {
      const title = String(item?.name || "").trim();
      const artist = Array.isArray(item?.artist) ? item.artist.join(" / ") : String(item?.artist || "");
      const album = String(item?.album || "");
      if (!title || hasBadVariantMeta(title, artist, album) || isJunkTitle(title, query, junkList)) continue;
      if (scoreCandidate(title, artist, query, "", Number(item.duration || 0), 0, junkList, false, album) < 0) continue;
      const source = String(item.source || providers[i]);
      const id = String(item.id || "");
      if (!id) continue;
      const norm_key = makeNormKey(title, artist);
      if (seen.has(norm_key)) continue;
      seen.add(norm_key);
      out.push({ id: 0, norm_key, title, artist: artist || "未知歌手", album, cover: item.pic_id ? `${base}&types=pic&source=${encodeURIComponent(source)}&id=${encodeURIComponent(item.pic_id)}&size=500` : "", duration: Number(item.duration || 0), category: "全网搜索", source_ids_json: "{}", ext_source: source, ext_id: id });
    }
  }
  return out;
}

async function liveSearchArtists(query, limit = 20, page = 1) {
  const offset = Math.max(0, (page - 1) * limit);
  try {
    const r = await fetchTimeout(`https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=100&limit=${limit}&offset=${offset}`, { headers: NE_HEADERS }, 4500);
    return ((await r.json())?.result?.artists || []).map((a) => ({ id: String(a.id), name: a.name, avatar: httpsCover(a.picUrl || a.img1v1Url || ""), worksNum: a.musicSize || 0, albumNum: a.albumSize || 0 }));
  } catch { return []; }
}

async function liveSearchSheets(query, limit = 24, page = 1) {
  const offset = Math.max(0, (page - 1) * limit);
  try {
    const r = await fetchTimeout(`https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=1000&limit=${limit}&offset=${offset}`, { headers: NE_HEADERS }, 4500);
    return ((await r.json())?.result?.playlists || []).map((p) => ({ id: `ne_${p.id}`, rawId: String(p.id), title: p.name, artist: p.creator?.nickname || "网易云歌单", cover: httpsCover(p.coverImgUrl || ""), playCount: p.playCount || 0, worksNum: p.trackCount || 0, description: (p.description || "").slice(0, 120) }));
  } catch { return []; }
}

async function fetchRecommendSheets(cat = "全部", limit = 24, page = 1) {
  const offset = Math.max(0, (page - 1) * limit);
  try {
    const r = await fetchTimeout(`https://music.163.com/api/playlist/list?cat=${encodeURIComponent(cat || "全部")}&order=hot&limit=${limit}&offset=${offset}`, { headers: NE_HEADERS }, 4500);
    const list = (await r.json())?.playlists || [];
    if (list.length) return list.map((p) => ({ id: `ne_${p.id}`, rawId: String(p.id), title: p.name, artist: p.creator?.nickname || "精选歌单", cover: httpsCover(p.coverImgUrl || ""), playCount: p.playCount || 0, worksNum: p.trackCount || 0, description: (p.description || "").slice(0, 120) }));
  } catch {}
  return liveSearchSheets(cat && cat !== "全部" ? cat : "华语精选", limit, page);
}

async function fetchNeteasePlaylistDetail(pid, limit = 1000) {
  for (const ep of [
    `https://music.163.com/api/v6/playlist/detail?id=${pid}&n=${Math.min(limit, 500)}`,
    `https://music.163.com/api/playlist/detail?id=${pid}`,
  ]) {
    try {
      const d = await (await fetchTimeout(ep, { headers: NE_HEADERS }, 7000)).json();
      const pl = d?.playlist || d?.result;
      if (!pl) continue;
      let rawTracks = Array.isArray(pl.tracks) ? pl.tracks.slice() : [];
      const allIds = Array.isArray(pl.trackIds) ? pl.trackIds.map((x) => x.id).filter(Boolean) : [];
      if (allIds.length > rawTracks.length && rawTracks.length < limit) {
        const haveIds = new Set(rawTracks.map((t) => String(t.id)));
        const missingIds = allIds.slice(0, limit).filter((tid) => !haveIds.has(String(tid)));
        if (missingIds.length) {
          const batches = [];
          for (let i = 0; i < missingIds.length; i += 200) {
            const chunk = missingIds.slice(i, i + 200);
            batches.push(
              fetchTimeout("https://music.163.com/api/v3/song/detail", {
                method: "POST",
                headers: { ...NE_HEADERS, "Content-Type": "application/x-www-form-urlencoded" },
                body: "c=" + encodeURIComponent(JSON.stringify(chunk.map((tid) => ({ id: tid })))),
              }, 7000).then((r) => r.json()).then((sd) => sd?.songs || []).catch(() => [])
            );
          }
          for (const lst of await Promise.all(batches)) for (const s of lst) if (!haveIds.has(String(s.id))) { haveIds.add(String(s.id)); rawTracks.push(s); }
        }
      }
      if (rawTracks.length) return { id: `ne_${pid}`, title: pl.name || "网易云歌单", artist: pl.creator?.nickname || "网易云音乐", cover: httpsCover(pl.coverImgUrl || ""), description: (pl.description || "").slice(0, 160), songs: rawTracks.slice(0, limit).map(mapNeteaseSong) };
    } catch {}
  }
  return null;
}

async function fetchQQPlaylistDetail(tid, limit = 1000) {
  try {
    const r = await fetchTimeout(`https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&new_format=1&disstid=${encodeURIComponent(tid)}&format=json`, { headers: { "User-Agent": UA, Referer: "https://y.qq.com/" } }, 6500);
    const cd = (await r.json())?.cdlist?.[0];
    if (!cd?.songlist?.length) return null;
    return {
      id: `qq_${tid}`, title: cd.dissname || "QQ音乐歌单", artist: cd.nickname || "QQ音乐", cover: cd.logo || "", description: (cd.desc || "").replace(/<[^>]+>/g, "").slice(0, 160),
      songs: cd.songlist.slice(0, limit).map((s) => {
        const artists = (s.singer || []).map((a) => a.name).filter(Boolean).join(" / ") || "未知歌手", albumMid = s.album?.mid || "";
        return { id: 0, norm_key: makeNormKey(s.title || s.name, artists), title: s.title || s.name || "", artist: artists, album: s.album?.name || "", cover: albumMid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albumMid}.jpg` : "", duration: Number(s.interval || 0), category: "导入歌单", ext_source: "qq", ext_id: String(s.mid || s.id || "") };
      }),
    };
  } catch { return null; }
}

async function fetchQishuiPlaylistDetail(pid, limit = 1000) {
  const songs = [], seen = new Set();
  let title = "汽水音乐歌单", cover = "", description = "", cursor = "0";
  const hdrs = { "User-Agent": UA, Referer: "https://music.douyin.com/" };
  for (let page = 0; page < 15 && songs.length < limit; page++) {
    try {
      const r = await fetchTimeout(`https://api.qishui.com/luna/pc/playlist/detail?playlist_id=${encodeURIComponent(pid)}&cursor=${encodeURIComponent(cursor)}&cnt=60&aid=386088&device_platform=web&channel=pc_web`, { headers: hdrs }, 5500);
      if (!r.ok) break;
      const d = await r.json();
      if (page === 0) { title = d?.playlist?.title || d?.playlist?.name || title; cover = d?.playlist?.url_cover?.urls?.[0] || d?.playlist?.cover?.urls?.[0] || ""; description = (d?.playlist?.desc || "").slice(0, 160); }
      const resList = d?.media_resources || []; if (!resList.length) break;
      for (const item of resList) {
        const t = item?.entity?.track || item?.track || item, name = (t?.name || t?.title || "").trim(); if (!name) continue;
        const artists = (t?.artists || []).map((a) => a?.name).filter(Boolean).join(" / ") || t?.artist?.name || "未知歌手", nk = makeNormKey(name, artists);
        if (seen.has(nk)) continue; seen.add(nk);
        const rawDur = Number(t?.duration || 0);
        songs.push({ id: 0, norm_key: nk, title: name, artist: artists, album: t?.album?.name || "", cover: t?.album?.url_cover?.urls?.[0] || t?.cover?.urls?.[0] || cover, duration: rawDur > 10000 ? Math.round(rawDur / 1000) : Math.round(rawDur), category: "导入歌单", ext_source: "qishui", ext_id: String(t?.id || item?.id || nk) });
        if (songs.length >= limit) break;
      }
      if (!d?.has_more || !d?.next_cursor || String(d.next_cursor) === cursor) break;
      cursor = String(d.next_cursor);
    } catch { break; }
  }
  if (!songs.length) {
    try {
      const htmlText = await (await fetchTimeout(`https://music.douyin.com/qishui/share/playlist?playlist_id=${encodeURIComponent(pid)}`, { headers: { "User-Agent": UA } }, 6000)).text();
      const m = htmlText.match(/_ROUTER_DATA\s*=\s*(\{[\s\S]*?\});\s*<\/script>/) || htmlText.match(/_ROUTER_DATA\s*=\s*(\{[\s\S]*?\});/);
      if (m) {
        const ld = JSON.parse(m[1])?.loaderData || {}, pg = ld.playlist_page || ld[Object.keys(ld).find((k) => k.includes("playlist")) || ""] || {};
        title = pg?.playlist?.title || pg?.playlistInfo?.title || title; cover = pg?.playlist?.cover || pg?.playlistInfo?.cover || cover;
        for (const item of pg?.trackList || pg?.tracks || pg?.media_resources || []) {
          const t = item?.entity?.track || item?.track || item, name = (t?.name || t?.title || "").trim(); if (!name) continue;
          const artists = (t?.artists || []).map((a) => a?.name).filter(Boolean).join(" / ") || t?.artist || "未知歌手", nk = makeNormKey(name, artists);
          if (seen.has(nk)) continue; seen.add(nk);
          const rawDur = Number(t?.duration || 0);
          songs.push({ id: 0, norm_key: nk, title: name, artist: artists, album: t?.album?.name || t?.album || "", cover: t?.album?.url_cover?.urls?.[0] || t?.cover || cover, duration: rawDur > 10000 ? Math.round(rawDur / 1000) : Math.round(rawDur), category: "导入歌单", ext_source: "qishui", ext_id: String(t?.id || nk) });
        }
      }
    } catch {}
  }
  return songs.length ? { id: `qs_${pid}`, title, artist: "汽水音乐", cover, description, songs } : null;
}

async function fetchKuwoPlaylistDetail(pid, limit = 1000) {
  try {
    const data = await (await fetchTimeout(`http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=${encodeURIComponent(pid)}&pn=0&rn=${limit}&encode=utf8&keyset=pl2012&identity=kuwo&pcmp4=1`, { headers: { "User-Agent": UA, Referer: "https://www.kuwo.cn/" } }, 6500)).json();
    const list = data?.musiclist || []; if (!list.length) return null;
    return {
      id: `kw_${pid}`, title: data.title || "酷我歌单", artist: data.uname || "酷我音乐", cover: data.pic || "", description: (data.info || "").slice(0, 160),
      songs: list.slice(0, limit).map((m) => {
        const artist = String(m.artist || "未知歌手").replace(/&/g, " / ");
        return { id: 0, norm_key: makeNormKey(m.name, artist), title: m.name || "", artist, album: m.album || "", cover: data.pic || "", duration: Number(m.duration || 0), category: "导入歌单", ext_source: "kuwo", ext_id: String(m.id || "").replace(/^MUSIC_/, "") };
      }),
    };
  } catch { return null; }
}

async function fetchKugouPlaylistDetail(sid, limit = 1000) {
  try {
    const [infoRes, p1Res] = await Promise.all([
      fetchTimeout(`http://mobilecdn.kugou.com/api/v3/special/info?specialid=${encodeURIComponent(sid)}`, { headers: { "User-Agent": UA } }, 5000).then((r) => r.json()).catch(() => ({})),
      fetchTimeout(`http://mobilecdn.kugou.com/api/v3/special/song?specialid=${encodeURIComponent(sid)}&page=1&pagesize=300&format=json`, { headers: { "User-Agent": UA } }, 6500).then((r) => r.json()),
    ]);
    const info = infoRes?.data || {}; let items = p1Res?.data?.info || [];
    const total = Math.min(Number(p1Res?.data?.total || items.length), limit), pageCalls = [];
    for (let p = 2; p <= Math.ceil(total / 300) && p <= 4; p++) {
      pageCalls.push(fetchTimeout(`http://mobilecdn.kugou.com/api/v3/special/song?specialid=${encodeURIComponent(sid)}&page=${p}&pagesize=300&format=json`, { headers: { "User-Agent": UA } }, 6500).then((r) => r.json()).then((d) => d?.data?.info || []).catch(() => []));
    }
    if (pageCalls.length) for (const extra of await Promise.all(pageCalls)) items = items.concat(extra);
    if (!items.length) return null;
    const cover = (info.imgurl || "").replace("{size}", "400");
    return {
      id: `kg_${sid}`, title: info.specialname || "酷狗歌单", artist: info.nickname || "酷狗音乐", cover, description: (info.intro || "").slice(0, 160),
      songs: items.slice(0, limit).map((s) => {
        let title = s.songname || "", artist = s.singername || "";
        if (!title && s.filename) { const idx = s.filename.indexOf(" - "); if (idx > 0) { artist = s.filename.slice(0, idx).trim(); title = s.filename.slice(idx + 3).trim(); } else title = s.filename; }
        return { id: 0, norm_key: makeNormKey(title, artist), title: title || "未知歌曲", artist: artist || "未知歌手", album: s.remark || "", cover, duration: Number(s.duration || 0), category: "导入歌单", ext_source: "kugou", ext_id: String(s.hash || s.audio_id || makeNormKey(title, artist)) };
      }),
    };
  } catch { return null; }
}

async function importExternalPlaylist(urlLike, env) {
  let raw = String(urlLike || "").trim(); if (!raw) return null;
  const urlInText = raw.match(/https?:\/\/[^\s]+/i); if (urlInText) raw = urlInText[0];
  const mhMatch = raw.match(/(?:share=|\/share\/)([a-zA-Z0-9_-]{4,24})/);
  if (mhMatch) {
    const row = await env.DB.prepare("SELECT * FROM shares WHERE id = ?").bind(mhMatch[1]).first();
    if (row) return { title: row.title, description: row.description || "Music Hub 分享歌单", cover: "", songs: JSON.parse(row.songs_json || "[]") };
  }
  if (/^https?:\/\/(163cn\.tv|c6\.y\.qq\.com|t\.cn|qishui\.douyin\.com|v\.douyin\.com)/i.test(raw)) {
    if (!isSafeExternalUrl(raw)) return null;
    try { const rr = await fetchTimeout(raw, { method: "GET", headers: { "User-Agent": UA }, redirect: "follow" }, 5000); try { await rr.body?.cancel(); } catch {} if (rr.url && isSafeExternalUrl(rr.url)) raw = rr.url; } catch {}
  }
  if (raw.includes("qishui") || raw.includes("douyin.com")) { const qsm = raw.match(/playlist_id=(\d+)/) || raw.match(/playlist\/(\d+)/); if (qsm) return await fetchQishuiPlaylistDetail(qsm[1], 1000); }
  if (raw.includes("kugou.com")) { const kgm = raw.match(/special\/single\/(\d+)/) || raw.match(/songlist\/(\d+)/) || raw.match(/specialid=(\d+)/); if (kgm) return await fetchKugouPlaylistDetail(kgm[1], 1000); }
  if (raw.includes("kuwo.cn")) { const kwm = raw.match(/playlist_detail\/(\d+)/) || raw.match(/[?&]pid=(\d+)/); if (kwm) return await fetchKuwoPlaylistDetail(kwm[1], 1000); }
  if (raw.includes("y.qq.com") || raw.includes("qq.com")) { const qm = raw.match(/playlist\/(\d+)/) || raw.match(/[?&]id=(\d+)/) || raw.match(/disstid=(\d+)/); if (qm) return await fetchQQPlaylistDetail(qm[1], 1000); }
  const nm = raw.match(/(?:playlist\/|[?&]id=)(\d{5,15})/) || raw.match(/^(\d{5,15})$/);
  if (nm) return await fetchNeteasePlaylistDetail(nm[1], 1000);
  return null;
}

async function fetchNeteaseSimiSongs(songId) {
  if (!songId || !/^\d+$/.test(String(songId))) return [];
  try { return ((await (await fetchTimeout(`https://music.163.com/api/v1/discovery/simiSong?songid=${songId}&limit=16`, { headers: NE_HEADERS }, 3500)).json())?.songs || []).filter((s) => s?.name).map(mapNeteaseSong); } catch { return []; }
}
async function fetchNeteaseSimiSheets(songId) {
  if (!songId || !/^\d+$/.test(String(songId))) return [];
  try { return ((await (await fetchTimeout(`https://music.163.com/api/discovery/simiPlaylist?songid=${songId}&limit=8`, { headers: NE_HEADERS }, 3500)).json())?.playlists || []).map((p) => ({ id: `ne_${p.id}`, rawId: String(p.id), title: p.name, artist: p.creator?.nickname || "相似推荐歌单", cover: httpsCover(p.coverImgUrl || ""), playCount: p.playCount || 0, worksNum: p.trackCount || 0, description: (p.description || "").slice(0, 120) })); } catch { return []; }
}
async function getSceneRadioPool(mode, env, ctx, junkList) {
  const cache = caches.default, cacheKey = new Request(`https://cache.internal/v10/radio_pool/${mode}`);
  const hit = await cache.match(cacheKey);
  if (hit) { const data = await hit.json().catch(() => null); if (data && data.length) return data; }
  let pool = []; const seen = new Set();
  const pushItem = (s) => {
    if (!s || !s.title || isJunkTitle(s.title, "", junkList)) return;
    if (s.duration && s.duration > 720) return;
    const nk = s.norm_key || makeNormKey(s.title, s.artist); if (!nk || seen.has(nk)) return;
    seen.add(nk); pool.push({ ...s, norm_key: nk, cover: httpsCover(s.cover || "") });
  };
  if (mode === "classic" || mode === "acg") {
    const catSql = mode === "classic" ? "('经典','华语')" : "('ACG')";
    ((await env.DB.prepare(`SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked=0 AND category IN ${catSql} ORDER BY score DESC LIMIT 100`).all()).results || []).forEach(pushItem);
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
  const [sheets, live] = await Promise.all([liveSearchSheets(sceneCfg.sheetKw, 4, 1), liveSearchSongs(sceneCfg.songKw, 35, 1, junkList)]);
  if (sheets.length) (await Promise.all(shuffleArr(sheets).slice(0, 2).map((sh) => fetchNeteasePlaylistDetail(sh.rawId, 45)))).forEach((d) => { if (d?.songs) d.songs.forEach(pushItem); });
  live.forEach(pushItem);
  if (pool.length) ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(pool), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=900" } })));
  return pool;
}
async function handleRadioRequest(payload, env, ctx) {
  const cfg = await getRuntimeCfg(env), mode = String(payload.mode || "personal").trim(), exclude = new Set(Array.isArray(payload.exclude) ? payload.exclude : []), needSheets = Boolean(payload.needSheets);
  if (mode !== "personal") {
    const pool = await getSceneRadioPool(mode, env, ctx, cfg.junkWords);
    return { mode, station: RADIO_STATIONS.find((x) => x.id === mode) || RADIO_STATIONS[1], songs: shuffleArr(pool.filter((s) => !exclude.has(s.norm_key))).slice(0, 20), sheets: [] };
  }
  const seedArtists = shuffleArr(Array.isArray(payload.artists) ? payload.artists.slice(0, 10) : []).slice(0, 2), seedIds = shuffleArr(Array.isArray(payload.ids) ? payload.ids.slice(0, 12) : []).slice(0, 2), seedCats = Array.isArray(payload.cats) && payload.cats.length ? payload.cats.slice(0, 3) : ["华语", "经典"];
  const tasks = [];
  for (const sid of seedIds) tasks.push(fetchNeteaseSimiSongs(sid));
  for (const ar of seedArtists) tasks.push(liveSearchSongs(ar, 18, 1, cfg.junkWords));
  const ph = seedCats.map(() => "?").join(",");
  tasks.push(env.DB.prepare(`SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked=0 AND category IN (${ph}) ORDER BY score DESC LIMIT 70`).bind(...seedCats).all().then((r) => r.results || []).catch(() => []));
  let sheetPromise = Promise.resolve([]);
  if (needSheets) {
    sheetPromise = (async () => {
      const shTasks = [];
      if (seedIds[0]) shTasks.push(fetchNeteaseSimiSheets(seedIds[0]));
      if (seedArtists[0]) shTasks.push(liveSearchSheets(seedArtists[0] + " 精选", 8, 1)); else shTasks.push(fetchRecommendSheets(seedCats[0] || "华语", 8, 1));
      const out = [], seenSh = new Set();
      for (const list of await Promise.all(shTasks)) for (const item of list || []) if (!seenSh.has(item.id)) { seenSh.add(item.id); out.push(item); }
      return out.slice(0, 10);
    })();
  }
  const [songLists, sheets] = await Promise.all([Promise.all(tasks), sheetPromise]), pool = [], seen = new Set();
  for (const list of songLists) for (const s of list || []) {
    if (!s || !s.title || isJunkTitle(s.title, "", cfg.junkWords)) continue;
    const nk = s.norm_key || makeNormKey(s.title, s.artist); if (!nk || seen.has(nk) || exclude.has(nk)) continue;
    seen.add(nk); pool.push({ ...s, norm_key: nk, cover: httpsCover(s.cover || "") });
  }
  return { mode: "personal", station: RADIO_STATIONS[0], songs: shuffleArr(pool).slice(0, 20), sheets };
}

async function resolveNeteaseArtistId(name) {
  const query = String(name || "").trim();
  if (!query) return { id: "", name: query };
  const endpoints = [
    `https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=100&limit=10&offset=0`,
    `https://music.163.com/api/search/get?s=${encodeURIComponent(query)}&type=100&limit=10&offset=0`,
  ];
  const results = await Promise.allSettled(endpoints.map(async (endpoint) => {
    const response = await fetchTimeout(endpoint, { headers: NE_HEADERS }, 4500);
    if (!response.ok) throw new Error(`netease_artist_search_${response.status}`);
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (contentType && !contentType.includes("json")) throw new Error("netease_artist_search_non_json");
    const data = await response.json();
    return data?.result?.artists || data?.artists || [];
  }));
  const candidates = [];
  for (const result of results) if (result.status === "fulfilled") candidates.push(...result.value);
  if (!candidates.length) return { id: "", name: query };
  const wanted = normalizeName(query);
  const exact = candidates.find((item) => normalizeName(item?.name || "") === wanted);
  const selected = exact || candidates.find((item) => normalizeName(item?.name || "").includes(wanted) || wanted.includes(normalizeName(item?.name || ""))) || candidates[0];
  return { id: /^\d+$/.test(String(selected?.id || "")) ? String(selected.id) : "", name: selected?.name || query };
}

async function fetchNeteaseArtistSongsPage(artistId, offset = 0, limit = 50, artistName = "") {
  const id = String(artistId || "");
  if (!/^\d+$/.test(id)) return { songs: [], hasMore: false, nextOffset: offset, rawCount: 0, ok: false };
  const urls = [
    `https://music.163.com/api/v1/artist/songs?id=${id}&private_cloud=true&work_type=1&order=hot&limit=${limit}&offset=${offset}`,
    `https://music.163.com/api/artist/songs?id=${id}&order=hot&limit=${limit}&offset=${offset}`,
  ];
  for (const endpoint of urls) {
    try {
      const response = await fetchTimeout(endpoint, { headers: NE_HEADERS }, 6000);
      if (!response.ok) continue;
      const contentType = (response.headers.get("content-type") || "").toLowerCase();
      if (contentType && !contentType.includes("json")) continue;
      const data = await response.json();
      const rawSongs = data?.songs || data?.hotSongs || data?.result?.songs || [];
      if (!Array.isArray(rawSongs)) continue;
      const songs = rawSongs.map(mapNeteaseSong).filter(Boolean).filter((song) =>
        !hasBadVariantMeta(song.title, song.artist, song.album) && (!artistName || artistIdentityMatches(song.artist, artistName))
      );
      const moreFlag = data?.more ?? data?.hasMore ?? data?.result?.more;
      return {
        songs,
        hasMore: typeof moreFlag === "boolean" ? moreFlag : rawSongs.length >= limit,
        nextOffset: offset + rawSongs.length,
        rawCount: rawSongs.length,
        ok: true,
      };
    } catch (_) {}
  }
  return { songs: [], hasMore: false, nextOffset: offset, rawCount: 0, ok: false };
}

async function fetchOfficialArtistData(name, artistId = "", junkList = DEFAULT_JUNK_WORDS) {
  let aid = String(artistId || ""), artistName = String(name || "");
  try {
    if (!aid && artistName) {
      const resolved = await resolveNeteaseArtistId(artistName);
      aid = resolved.id;
      artistName = resolved.name || artistName;
    }
    if (!/^\d+$/.test(aid)) return { songs: [], albums: [], artistId: "", artistName, more: false };
    const [hotResult, albumResult] = await Promise.allSettled([
      fetchTimeout(`https://music.163.com/api/artist/${aid}`, { headers: NE_HEADERS }, 5000).then(async (r) => {
        if (!r.ok) throw new Error(`netease_artist_${r.status}`);
        return r.json();
      }),
      fetchTimeout(`https://music.163.com/api/artist/albums/${aid}?limit=30&offset=0`, { headers: NE_HEADERS }, 5000).then(async (r) => {
        if (!r.ok) throw new Error(`netease_artist_albums_${r.status}`);
        return r.json();
      }),
    ]);
    const hotData = hotResult.status === "fulfilled" ? hotResult.value : {};
    const albumData = albumResult.status === "fulfilled" ? albumResult.value : {};
    const songs = (hotData.hotSongs || []).filter((song) => song?.name && !isJunkTitle(song.name, artistName, junkList)).map(mapNeteaseSong).filter(Boolean);
    const albums = (albumData.hotAlbums || []).map((album) => ({
      id: String(album.id), title: album.name, artist: album.artist?.name || artistName,
      cover: httpsCover(album.picUrl || ""), size: album.size || 0,
      publishTime: album.publishTime ? new Date(album.publishTime).toISOString().slice(0, 10) : "",
    }));
    return { songs, albums, artistId: aid, artistName, more: songs.length >= 50 };
  } catch {
    return { songs: [], albums: [], artistId: /^\d+$/.test(aid) ? aid : "", artistName, more: false };
  }
}
async function liveSearchAlbums(query, limit = 24, page = 1) {
  const offset = Math.max(0, (page - 1) * limit);
  try {
    const r = await fetchTimeout(`https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=10&limit=${limit + 12}&offset=${offset}`, { headers: NE_HEADERS }, 4500);
    const albs = (await r.json())?.result?.albums || [], clean = albs.filter((a) => (a.size || 0) >= 4), picked = clean.length ? clean : albs;
    return picked.slice(0, limit).map((a) => ({ id: String(a.id), title: a.name, artist: a.artist?.name || query, cover: httpsCover(a.picUrl || ""), size: a.size || 0, publishTime: a.publishTime ? new Date(a.publishTime).toISOString().slice(0, 10) : "" }));
  } catch { return []; }
}

// 修复酷我正则：兼容 'NAME':'...' 与 NAME:'...' 以及 "NAME":"..."
const HARD_ARTISTS = ["周杰伦", "jay chou", "林俊杰", "陈奕迅", "taylor swift", "五月天", "邓紫棋", "薛之谦", "陶喆", "王力宏"];
const VERY_HARD_TRACKS = ["七里香", "一路向北", "晴天", "稻香", "夜曲", "以父之名", "青花瓷", "可惜没如果", "江南", "修炼爱情", "十年", "富士山下", "K歌之王"];
const NORMAL_ARTISTS = ["张学友", "王菲", "beyond", "孙燕姿", "梁静茹", "张国荣", "李宗盛", "刘德华", "莫文蔚", "蔡依林", "田馥甄", "许嵩"];

function getSongDifficulty(song, ids, forceTier = 0) {
  if (forceTier >= 1 && forceTier <= 5) return forceTier;
  const artist = decodeHtml(song.artist || "").toLowerCase();
  const title = decodeHtml(song.title || "").toLowerCase();
  // Artist/title difficulty must take precedence over cached IDs: a stale Kuwo ID
  // must never downgrade a known exclusive track to Lv1.
  if (VERY_HARD_TRACKS.some((t) => title.includes(t.toLowerCase()))) return 5;
  if (HARD_ARTISTS.some((a) => artist.includes(a))) return 4;
  if (title.includes("live") || title.includes("现场") || title.includes("ost") || title.includes("原声") || title.includes("remix")) return 4;
  if (NORMAL_ARTISTS.some((a) => artist.includes(a))) return 3;
  if (ids.r2 || ids.msr || ids.kuwo || ids.bili) return 1;
  return 2;
}

const TIER_CFG = {
  1: { reqMs: 2200, totalMs: 3000, maxRids: 1, vkN: [1] },
  2: { reqMs: 2800, totalMs: 4200, maxRids: 2, vkN: [1] },
  3: { reqMs: 4000, totalMs: 6000, maxRids: 2, vkN: [1, 2] },
  4: { reqMs: 6000, totalMs: 8800, maxRids: 3, vkN: [1, 2] },
  5: { reqMs: 7200, totalMs: 10800, maxRids: 3, vkN: [1, 2, 3] },
};

async function searchKuwoRids(kw, song, junkWords = DEFAULT_JUNK_WORDS, reqMs = 3500, maxRids = 2) {
  const sr = await fetchTimeout(
    `http://search.kuwo.cn/r.s?all=${encodeURIComponent(kw)}&ft=music&itemset=web_2013&client=kt&pn=0&rn=8&rformat=json&encoding=utf8`,
    { headers: { "User-Agent": UA } }, reqMs
  );
  const txt = await sr.text();
  const list = [];
  for (const blk of txt.split(/\}\s*,\s*\{/)) {
    const rid = (blk.match(/MUSIC_(\d+)/) || [])[1];
    if (!rid) continue;
    const nm = decodeHtml((blk.match(/['"]?NAME['"]?\s*:\s*['"]([^'"]*)['"]/) || [])[1] || "");
    const ar = decodeHtml((blk.match(/['"]?ARTIST['"]?\s*:\s*['"]([^'"]*)['"]/) || [])[1] || "");
    const dur = Number((blk.match(/['"]?DURATION['"]?\s*:\s*['"]?(\d+)['"]?/) || [])[1] || 0);
    const album = decodeHtml((blk.match(/['"]?ALBUM['"]?\s*:\s*['"]([^'"]*)['"]/) || [])[1] || "");
    const strict = isStrictSong(song);
    const sc = scoreCandidate(nm, ar, song.title, song.artist, dur, song.duration, junkWords, strict, album);
    if (sc >= (strict ? 80 : 10)) list.push({ rid, sc });
  }
  list.sort((a, b) => b.sc - a.sc);
  return list.slice(0, maxRids).map((x) => x.rid);
}

async function fetchKuwoByRid(rid, song, reqMs = 3500, tryWapi = false) {
  const eps = [
    `https://mobi.kuwo.cn/mobi.s?f=web&user=0&source=kwplayer_ar_8.5.5.0_apk_keluze.apk&type=convert_url_with_sign&rid=${rid}&br=320kmp3`,
    `https://mobi.kuwo.cn/mobi.s?f=web&type=convert_url_with_sign&source=kwplayer_ar_4.4.2.7_B_nuoweida_vh.apk&rid=${rid}&format=mp3&br=192kmp3`,
  ];
  if (tryWapi) {
    eps.push(
      `https://wapi.kuwo.cn/api/v1/www/music/playUrl?mid=${rid}&type=music`,
      `http://antiserver.kuwo.cn/anti.s?type=convert_url3&rid=${rid}&format=mp3`
    );
  }
  return Promise.any(eps.map(async (ep) => {
    const r = await fetchTimeout(ep, { headers: { "User-Agent": UA, Referer: "https://www.kuwo.cn/" } }, reqMs);
    const txt = await r.text();
    let u = "", ekey = "", dur = 0;
    try { const j = JSON.parse(txt); u = j?.data?.url || j?.url || ""; ekey = j?.data?.ekey || ""; dur = Number(j?.data?.duration || 0); }
    catch { const m = txt.match(/url=(http[^\s\r\n]+)/); if (m) u = m[1]; }
    if (ekey || !isBasicAudioUrl(u)) throw new Error("kw_ekey");
    if (dur > 0 && song.duration >= 90 && dur <= 65) throw new Error("kw_trial");
    const real = dur > 0 ? u : await verifyNot30sTrial(u, song.duration, { Referer: "https://www.kuwo.cn/" }, 44, false);
    if (!real) throw new Error("kw_invalid");
    return { url: real, source: "kuwo", kuwoId: rid };
  }));
}

async function raceKuwoAll(song, ids, trace, junkWords = DEFAULT_JUNK_WORDS, tier = 3) {
  const cfg = TIER_CFG[tier] || TIER_CFG[3];
  const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
  const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
  const rids = ids.kuwo && !isStrictSong(song) ? [ids.kuwo] : (await searchKuwoRids(kw, song, junkWords, cfg.reqMs, cfg.maxRids).catch(() => []));
  if (!rids.length) { trace.push("kw:no_rid"); throw new Error("no_rid"); }
  for (const rid of rids) {
    try { return await fetchKuwoByRid(rid, song, cfg.reqMs, tier >= 3); } catch {}
  }
  trace.push("kw:fail");
  throw new Error("kw_fail");
}

async function raceGDStudio(song, ids, trace, gdBase = "https://music-api.gdstudio.xyz/api.php", junkWords = DEFAULT_JUNK_WORDS, reqMs = 4200) {
  const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
  const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
  const sep = gdBase.includes("?") ? "&" : "?";
  const base = gdBase.includes("use_xbridge3") ? gdBase : `${gdBase}${sep}use_xbridge3=true`;
  const hdrs = { "User-Agent": UA, Accept: "application/json", Referer: "https://music.gdstudio.xyz/", Origin: "https://music.gdstudio.xyz" };

  const strict = isStrictSong(song);
  const providers = strict ? ["netease", "joox", "kuwo"] : ["kuwo", "joox", "kugou"];
  const tasks = providers.map(async (plat) => {
    const sr = await fetchTimeout(`${base}&types=search&source=${plat}&name=${encodeURIComponent(kw)}&count=6&pages=1`, { headers: hdrs }, reqMs);
    if (!sr.ok) throw new Error(`gd_s_${sr.status}`);
    const ct = (sr.headers.get("content-type") || "").toLowerCase();
    if (ct && !ct.includes("json")) throw new Error("gd_search_non_json");
    const arr = await sr.json();
    if (!Array.isArray(arr) || !arr.length) throw new Error("gd_no_id");
    let best = null, bsc = -100;
    for (const item of arr) {
      const sc = scoreCandidate(item.name, item.artist, song.title, song.artist, Number(item.duration || 0), song.duration, junkWords, strict, item.album || "");
      if (sc > bsc) { bsc = sc; best = item; }
    }
    if (!best || bsc < (strict ? 80 : 20)) throw new Error("gd_mismatch");
    const ur = await fetchTimeout(`${base}&types=url&source=${plat}&id=${encodeURIComponent(best.id)}&br=320`, { headers: hdrs }, reqMs);
    if (!ur.ok) throw new Error(`gd_u_${ur.status}`);
    const uct = (ur.headers.get("content-type") || "").toLowerCase();
    if (uct && !uct.includes("json")) throw new Error("gd_url_non_json");
    const d = await ur.json();
    if (d?.size && song.duration >= 90 && Number(d.size) < Math.max(320, song.duration * 2.8)) throw new Error("gd_suspicious_size");
    const real = await verifyNot30sTrial(d?.url, song.duration, {}, 44, false);
    if (!real) throw new Error("gd_no_url");
    return { url: real, source: `gd:${plat}` };
  });

  if (ids.netease && !strict) {
    tasks.push((async () => {
      const ur = await fetchTimeout(`${base}&types=url&source=netease&id=${ids.netease}&br=320`, { headers: hdrs }, reqMs);
      if (!ur.ok) throw new Error(`gd_ne_${ur.status}`);
      const d = await ur.json();
      if (d?.size && song.duration >= 90 && Number(d.size) < Math.max(320, song.duration * 2.8)) throw new Error("gd_ne_suspicious_size");
      const real = await verifyNot30sTrial(d?.url, song.duration, {}, 64, true);
      if (!real) throw new Error("gd_ne_30s");
      return { url: real, source: "gd:netease" };
    })());
  }
  try { return await Promise.any(tasks); } catch { trace.push("gd:fail"); throw new Error("gd_fail"); }
}

// 用 http:// 避开酷狗搜索在 CF 上的 526 SSL 错误
async function raceBakaKugou(song, trace, junkWords = DEFAULT_JUNK_WORDS, reqMs = 3800) {
  const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
  const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
  try {
    const sr = await fetchTimeout(`http://msearchcdn.kugou.com/api/v3/search/song?keyword=${encodeURIComponent(kw)}&page=1&pagesize=6`, { headers: { "User-Agent": UA } }, reqMs);
    if (!sr.ok) { trace.push(`kg:http${sr.status}`); throw new Error("kg_http"); }
    const list = (await sr.json())?.data?.info || [];
    const strict = isStrictSong(song);
    let best = null, bsc = -100;
    for (const it of list) {
      const sc = scoreCandidate(it.songname, it.singername, song.title, song.artist, it.duration, song.duration, junkWords, strict, it.album_name || it.album || "");
      if (sc > bsc) { bsc = sc; best = it; }
    }
    const hash = best?.hash || best?.sqhash || best?.["320hash"];
    if (!hash || bsc < (strict ? 80 : 20)) { trace.push("kg:mismatch"); throw new Error("kg_mismatch"); }
    const u = `https://api.baka.plus/meting/?server=kugou&type=url&id=${hash}&br=320`;
    const real = await verifyNot30sTrial(u, song.duration, {}, 44, true);
    if (!real) { trace.push("kg:30s"); throw new Error("kg_30s"); }
    return { url: real, source: "baka:kugou" };
  } catch (e) {
    if (!trace.some((t) => t.startsWith("kg:"))) trace.push("kg:fail");
    throw e;
  }
}

// VKeys + 落月CF（全档位并发，耗时从 3.6s 降到 1s！）
async function raceVKeys(song, ids, trace, vkeysBase = "https://api.vkeys.cn/v2/music", junkWords = DEFAULT_JUNK_WORDS, tier = 3) {
  const cfg = TIER_CFG[tier] || TIER_CFG[3];
  const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
  const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
  const endpoints = [vkeysBase.replace(/\/$/, ""), "https://luoyue-api-cf.vincentzyu233.cn/v2/music"];
  const qs = tier >= 4 ? [3, 2, 1, 4] : [3, 2];

  const strict = isStrictSong(song);
  const qqTasks = [];
  for (let idx = 0; idx < endpoints.length; idx++) {
    const base = endpoints[idx], tag = idx === 0 ? "vkeys:qq" : "luoyue:qq";
    for (const n of cfg.vkN) {
      for (const q of qs) {
        qqTasks.push((async () => {
          const r = await fetchTimeout(`${base}/tencent?word=${encodeURIComponent(kw)}&n=${n}&quality=${q}`, { headers: { "User-Agent": UA } }, cfg.reqMs);
          if (!r.ok) throw new Error("vk_http");
          const d = (await r.json())?.data;
          if (!d || !isBasicAudioUrl(d.url) || d.ekey) throw new Error("vk_empty");
          const vkDur = parseCnInterval(d.interval);
          if (song.duration >= 90 && vkDur > 0 && (vkDur <= 65 || vkDur < song.duration * 0.72)) throw new Error("vk_30s");
          const candidateTitle = strict ? String(d.song || "") : (d.song || song.title);
          const candidateArtist = strict ? String(d.singer || "") : (d.singer || song.artist);
          if (scoreCandidate(candidateTitle, candidateArtist, song.title, song.artist, vkDur, song.duration, junkWords, strict) < (strict ? 80 : 15)) throw new Error("vk_mismatch");
          return { url: d.url, source: tag };
        })());
      }
    }
  }

  const tasks = [...qqTasks];
  if (ids.netease && !isStrictSong(song)) {
    for (const base of endpoints) {
      for (const q of [4, 3, 2]) {
        tasks.push((async () => {
          const r = await fetchTimeout(`${base}/netease?id=${ids.netease}&quality=${q}`, { headers: { "User-Agent": UA } }, cfg.reqMs);
          if (!r.ok) throw new Error("vk_ne_http");
          const d = (await r.json())?.data;
          const vkDur = parseCnInterval(d?.interval);
          if (song.duration >= 90 && vkDur > 0 && (vkDur <= 65 || vkDur < song.duration * 0.72)) throw new Error("vk_ne_30s");
          const real = await verifyNot30sTrial(d?.url, song.duration, {}, 64, true);
          if (!real) throw new Error("vk_ne_invalid");
          return { url: real, source: "vkeys:ne" };
        })());
      }
    }
  }
  try { return await Promise.any(tasks); } catch { trace.push("vkeys:fail"); throw new Error("vkeys"); }
}

async function raceMeting(baseUrl, tag, neteaseId, durationSec, trace, reqMs = 2600) {
  if (!neteaseId) throw new Error("no_id");
  const r = await fetchTimeout(`${baseUrl}?server=netease&type=song&id=${neteaseId}`, { headers: { "User-Agent": UA } }, reqMs);
  if (!r.ok) { trace.push(`${tag}:${r.status}`); throw new Error(r.status); }
  const arr = await r.json();
  const u = Array.isArray(arr) ? arr[0]?.url : arr?.url;
  const real = await verifyNot30sTrial(u, durationSec, {}, 64, true);
  if (!real) { trace.push(`${tag}:30s`); throw new Error("trial"); }
  return { url: real, source: tag };
}

async function fallbackBilibiliAudio(song, ids, trace, biliBase = "https://api.bilibili.com", junkWords = DEFAULT_JUNK_WORDS, reqMs = 4500) {
  if (isStrictSong(song)) { trace.push("bili:strict_song_skip"); return null; }
  try {
    const base = biliBase.replace(/\/$/, "");
    const spiR = await fetchTimeout(`${base}/x/frontend/finger/spi`, { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" } }, 2800);
    const spi = spiR.ok ? ((await spiR.json().catch(() => ({})))?.data || {}) : {};
    const cookie = `buvid3=${spi.b_3 || crypto.randomUUID()}; buvid4=${spi.b_4 || ""}`;

    let bvid = ids.bili || "";
    if (!bvid) {
      const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
      const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
      const sRes = await fetchTimeout(`${base}/x/web-interface/search/all/v2?keyword=${encodeURIComponent(kw)}`, {
        headers: { "User-Agent": UA, Referer: "https://search.bilibili.com/", Cookie: cookie },
      }, reqMs);
      if (!sRes.ok || !(sRes.headers.get("content-type") || "").includes("json")) {
        trace.push(`bili:http${sRes.status}`); return null;
      }
      const sJson = await sRes.json();
      if (sJson.code !== 0) { trace.push(`bili_s:${sJson.code}`); return null; }
      const vGroup = (sJson?.data?.result || []).find((g) => g.result_type === "video");
      const list = vGroup?.data || [];
      if (!list.length) { trace.push("bili:no_res"); return null; }

      const noise = ["翻唱", "教学", "吉他", "钢琴", "伴奏", "鬼畜", "reaction", "指弹", "弹唱", "二创", "清唱"];
      let best = null, bsc = -999;
      for (const it of list.slice(0, 10)) {
        const rawT = decodeHtml(String(it.title || "").replace(/<[^>]+>/g, ""));
        const p = String(it.duration || "").split(":").map(Number);
        const d = p.length === 2 ? p[0] * 60 + p[1] : (p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : 0);
        if (d < 30 || d > 600) continue;
        let sc = scoreCandidate(rawT, rawT + " " + (it.author || ""), song.title, song.artist, d, song.duration, junkWords);
        if (noise.some((nw) => rawT.toLowerCase().includes(nw) && !song.title.toLowerCase().includes(nw))) continue;
        if (rawT.toLowerCase().includes("mv") || rawT.toLowerCase().includes("官方") || rawT.toLowerCase().includes("原版")) sc += 25;
        if (sc > bsc) { bsc = sc; best = it; }
      }
      if (!best || bsc < 10) { trace.push("bili:mismatch"); return null; }
      bvid = best.bvid;
    }

    const vRes = await fetchTimeout(`${base}/x/web-interface/view?bvid=${bvid}`, { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" } }, reqMs);
    if (!vRes.ok) { trace.push(`bili_v:${vRes.status}`); return null; }
    const vCt = (vRes.headers.get("content-type") || "").toLowerCase();
    if (!vCt.includes("json")) { trace.push("bili:non_json_view"); return null; }
    const cid = (await vRes.json().catch(() => ({})))?.data?.cid;
    if (!cid) { trace.push("bili:no_cid"); return null; }

    for (const fnval of [4048, 1]) {
      const uRes = await fetchTimeout(`${base}/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=64&fnval=${fnval}&otype=json`, { headers: { "User-Agent": UA, Referer: `https://www.bilibili.com/video/${bvid}`, Cookie: cookie } }, reqMs);
      if (!uRes.ok || !(uRes.headers.get("content-type") || "").toLowerCase().includes("json")) continue;
      const uData = (await uRes.json().catch(() => ({})))?.data;
      const audios = uData?.dash?.audio || [];
      if (audios.length) {
        audios.sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0));
        const su = audios[0].baseUrl || audios[0].base_url || audios[0].backupUrl?.[0];
        if (su) return { url: su, needProxy: true, source: "bili", biliId: bvid };
      }
      if (uData?.durl?.[0]?.url) return { url: uData.durl[0].url, needProxy: true, source: "bili", biliId: bvid };
    }
    trace.push("bili:no_stream");
  } catch (e) { trace.push(`bili:${e.name}`); }
  return null;
}

async function resolvePlayUrl(song, quality, env, prefer = "", skip = "", forceTier = 0) {
  const ids = JSON.parse(song.source_ids_json || "{}"), trace = [];
  const cfg = await getRuntimeCfg(env), srcMap = new Map(cfg.sources.map((s) => [s.id, s]));
  const isEnabled = (id) => { const s = srcMap.get(id); return !s || Number(s.enabled) === 1; };

  const strictIdentity = isStrictSong(song);
  if (!strictIdentity && ids.r2 && env.R2 && env.R2_PUBLIC_URL) return { url: `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${ids.r2}`, source: "r2", tier: 1, trace };
  if (!strictIdentity && ids.msr && isEnabled("msr")) {
    const msrBase = (srcMap.get("msr")?.endpoint || "https://monster-siren.hypergryph.com/api").replace(/\/$/, "");
    try { const u = (await (await fetchTimeout(`${msrBase}/song/${ids.msr}`, {}, 3000)).json())?.data?.sourceUrl; if (u) return { url: u, source: "msr", tier: 1, trace }; } catch { trace.push("msr:err"); }
  }

  const skipSet = new Set(String(skip || "").split(",").map((x) => x.trim()).filter(Boolean));
  if (skipSet.has("kuwo") && ids.kuwo) { delete ids.kuwo; song = { ...song, source_ids_json: JSON.stringify(ids) }; }

  const tier = getSongDifficulty(song, ids, forceTier);
  const tCfg = TIER_CFG[tier] || TIER_CFG[3];
  trace.push(`T${tier}`);

  const biliP = (tier >= 3 && isEnabled("bili") && !strictIdentity)
    ? fallbackBilibiliAudio(song, ids, trace, srcMap.get("bili")?.endpoint || "https://api.bilibili.com", cfg.junkWords, tCfg.reqMs)
    : Promise.resolve(null);

  const raceList = [];
  if (prefer === "kuwo") {
    raceList.push(raceKuwoAll(song, ids, trace, cfg.junkWords, tier));
  } else {
    if (!skipSet.has("kuwo")) raceList.push(raceKuwoAll(song, ids, trace, cfg.junkWords, tier));
    if (!skipSet.has("gd") && !skipSet.has("gdstudio") && isEnabled("gdstudio")) raceList.push(raceGDStudio(song, ids, trace, srcMap.get("gdstudio")?.endpoint || "https://music-api.gdstudio.xyz/api.php", cfg.junkWords, tCfg.reqMs));
    if (!skipSet.has("vkeys") && isEnabled("vkeys")) raceList.push(raceVKeys(song, ids, trace, srcMap.get("vkeys")?.endpoint || "https://api.vkeys.cn/v2/music", cfg.junkWords, tier));
    if (!skipSet.has("kugou")) raceList.push(raceBakaKugou(song, trace, cfg.junkWords, tCfg.reqMs));
    // 只有 Lv1~Lv2 普通歌曲才带 Meting；Lv3~Lv5 困难歌直接跳过避免 30s 干扰
    if (tier <= 2 && !skipSet.has("meting") && ids.netease) raceList.push(raceMeting("https://api.injahow.cn/meting/", "meting_injahow", ids.netease, song.duration, trace, 2400));
  }

  try {
    const winner = await raceWithDeadline(Promise.any(raceList), tCfg.totalMs);
    return { ...winner, tier, trace };
  } catch (e) {
    if (e?.message === "deadline") trace.push(`deadline_${tCfg.totalMs}ms`);
    const biliHit = await biliP;
    if (biliHit) return { ...biliHit, tier, trace };
    if (tier < 3 && isEnabled("bili") && !strictIdentity) {
      const b2 = await fallbackBilibiliAudio(song, ids, trace, srcMap.get("bili")?.endpoint || "https://api.bilibili.com", cfg.junkWords, 5000);
      if (b2) return { ...b2, tier, trace };
    }
    return { error: "可用完整源均未命中", tier, trace };
  }
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
      /^172\.(1[6-9]|2\d|3[01])\./.test(h) || h.startsWith("fe80:") || h.startsWith("fc") || h.startsWith("fd")
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
      const shareRoute = path.match(/^\/s\/([^/]+)\/(musicfree\.json|music-hub\.js|lx-source\.js|bili\.js|kuwo\.js|msr\.js)$/);
      if (shareRoute) { pathToken = decodeURIComponent(shareRoute[1]); path = "/" + shareRoute[2]; }

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
          const [sCount, bCount, cCount, lCount, cats, srcs, charts, settingsRes] = await Promise.all([
            env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=0").first(),
            env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=1").first(),
            env.DB.prepare("SELECT COUNT(*) AS c FROM charts").first(),
            env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=0 AND length(lyric_lrc) > 10").first(),
            env.DB.prepare("SELECT category, COUNT(*) AS c FROM songs WHERE is_blocked=0 GROUP BY category ORDER BY c DESC").all(),
            env.DB.prepare("SELECT * FROM sources ORDER BY priority ASC").all(),
            env.DB.prepare("SELECT id,title,category,sort_order FROM charts ORDER BY sort_order ASC").all(),
            env.DB.prepare("SELECT key, value FROM settings WHERE key IN ('junk_words','sub_mode','sync_enabled','sync_lrc_limit','sync_chart_max','last_sync_at','last_sync_summary')").all(),
          ]);
          const kv = Object.fromEntries((settingsRes.results || []).map((r) => [r.key, r.value]));
          return json({
            stats: { songs: sCount?.c || 0, blocked: bCount?.c || 0, charts: cCount?.c || 0, lyrics: lCount?.c || 0 },
            categories: cats.results || [],
            sources: srcs.results || [],
            charts: charts.results || [],
            junkWords: kv.junk_words || DEFAULT_JUNK_WORDS.join(","),
            subMode: kv.sub_mode || "fusion",
            syncConfig: { enabled: kv.sync_enabled !== "0", lrcLimit: Number(kv.sync_lrc_limit ?? 450), chartMax: Number(kv.sync_chart_max ?? 120), lastSyncAt: Number(kv.last_sync_at || 0), lastSyncSummary: kv.last_sync_summary || "暂无同步记录" },
            accessToken: env.ACCESS_TOKEN || "",
          });
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
          const detail = await fetchNeteasePlaylistDetail(pid, 300);
          if (!detail?.songs?.length) return json({ error: "歌单抓取为空" }, 400);
          const now = Math.floor(Date.now() / 1000), tracks = detail.songs, normKeys = [], stmts = [];
          for (let i = 0; i < tracks.length; i++) {
            const t = tracks[i], score = Math.max(100, 900 - i * 4); normKeys.push(t.norm_key);
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
          ctx.waitUntil(caches.default.delete(new Request("https://cache.internal/v10/chart/" + encodeURIComponent("ne_" + pid))));
          return json({ ok: true, title: chartTitle, importedCount: songIds.length });
        }
        if (path === "/api/admin/chart/update" && request.method === "POST") { const b = await request.json(); await env.DB.prepare("UPDATE charts SET title=?, category=?, sort_order=? WHERE id=?").bind(String(b.title || "").trim(), String(b.category || "").trim(), Number(b.sort_order || 50), String(b.id)).run(); await purgeHomeCache(ctx); return json({ ok: true }); }
        if (path === "/api/admin/chart/delete" && request.method === "POST") { await env.DB.prepare("DELETE FROM charts WHERE id = ?").bind(String((await request.json()).id)).run(); await purgeHomeCache(ctx); return json({ ok: true }); }
        if (path === "/api/admin/settings" && request.method === "POST") {
          const b = await request.json().catch(() => ({})), pairs = [];
          if (b.junkWords !== undefined) pairs.push(["junk_words", String(b.junkWords || "")]);
          if (b.subMode !== undefined) pairs.push(["sub_mode", ["pure", "fusion", "turbo"].includes(b.subMode) ? b.subMode : "fusion"]);
          if (b.syncEnabled !== undefined) pairs.push(["sync_enabled", b.syncEnabled ? "1" : "0"]);
          if (b.syncLrcLimit !== undefined) pairs.push(["sync_lrc_limit", String(Math.max(0, Number(b.syncLrcLimit) || 0))]);
          if (b.syncChartMax !== undefined) pairs.push(["sync_chart_max", String(Math.max(10, Number(b.syncChartMax) || 120))]);
          if (pairs.length) {
            await env.DB.batch(pairs.map(([k, v]) => env.DB.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(k, v)));
            invalidateCfgCache();
          }
          return json({ ok: true });
        }
        if (path === "/api/admin/source" && request.method === "POST") {
          const b = await request.json();
          await env.DB.prepare(`INSERT INTO sources (id, name, type, endpoint, priority, enabled, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,type=excluded.type,endpoint=excluded.endpoint,priority=excluded.priority,enabled=excluded.enabled,updated_at=excluded.updated_at`).bind(String(b.id).trim(), String(b.name).trim(), b.type || "agg", String(b.endpoint || "").trim(), Number(b.priority || 50), b.enabled ? 1 : 0, Math.floor(Date.now() / 1000)).run();
          invalidateCfgCache(); return json({ ok: true });
        }
        if (path === "/api/admin/source/delete" && request.method === "POST") { await env.DB.prepare("DELETE FROM sources WHERE id = ?").bind(String((await request.json()).id)).run(); invalidateCfgCache(); return json({ ok: true }); }
        if (path === "/api/admin/source/test" && request.method === "POST") {
          const src = await env.DB.prepare("SELECT * FROM sources WHERE id = ?").bind((await request.json()).id).first();
          if (!src) return json({ error: "not found" }, 404);
          const t0 = Date.now(); let testUrl = src.endpoint; const hdrs = { "User-Agent": UA, Accept: "application/json" };
          if (src.type === "agg") { testUrl = `${src.endpoint}?use_xbridge3=true&types=search&source=kuwo&name=${encodeURIComponent("晴天")}&count=5&pages=1`; hdrs.Referer = "https://music.gdstudio.xyz/"; hdrs.Origin = "https://music.gdstudio.xyz"; }
          else if (src.type === "native") testUrl = `${src.endpoint}/albums`;
          else if (src.type === "vkeys") testUrl = `https://api.vkeys.cn/v2/music/tencent?word=${encodeURIComponent("晴天")}&n=1&quality=3`;
          else if (src.type === "bili") { testUrl = `${src.endpoint.replace(/\/$/, "")}/x/frontend/finger/spi`; hdrs.Referer = "https://www.bilibili.com/"; }
          try { const r = await fetchTimeout(testUrl, { headers: hdrs }, 4500); return json({ ok: r.ok, status: r.status, ms: Date.now() - t0 }); }
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
        else if (src.includes("bili") || target.includes("bilivideo") || target.includes("biliapi") || target.includes("akamaized.net")) fwdHeaders.set("Referer", "https://www.bilibili.com/");
        const range = request.headers.get("Range"); if (range && !isDl) fwdHeaders.set("Range", range);

        let upstream = await fetch(target, { headers: fwdHeaders, redirect: "manual" });
        for (let hop = 0; hop < 3 && upstream.status >= 300 && upstream.status < 400; hop++) {
          const loc = upstream.headers.get("Location"); if (!loc) break;
          const nextUrl = new URL(loc, target).toString();
          if (!isSafeExternalUrl(nextUrl)) return json({ error: "unsafe redirect" }, 403);
          target = nextUrl; upstream = await fetch(target, { headers: fwdHeaders, redirect: "manual" });
        }
        const ct = (upstream.headers.get("content-type") || "").toLowerCase();
        if (ct.includes("text/html") || ct.includes("xhtml") || ct.includes("svg")) return json({ error: "blocked non-audio response" }, 403);
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
        const song = { title: "吻别", artist: "张学友", duration: 306, source_ids_json: '{"netease":"190449"}' };
        const tests = [
          ["kuwo_all", raceKuwoAll(song, {}, [])],
          ["gdstudio_xbridge", raceGDStudio(song, { netease: "190449" }, [])],
          ["baka_kugou", raceBakaKugou(song, [])],
          ["vkeys_luoyue", raceVKeys(song, { netease: "190449" }, [])],
          ["meting_injahow", raceMeting("https://api.injahow.cn/meting/", "injahow", "190449", 306, [])],
          ["bili_all_v2", (async () => { const t = []; const r = await fallbackBilibiliAudio({ title: "稻香", artist: "周杰伦", duration: 223 }, {}, t); if (!r) throw new Error(t.join(",") || "empty"); return r; })()],
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
          return json({ charts: (results || []).map((c) => ({ ...c, cover: httpsCover(c.cover) })), artists: PRESET_ARTISTS, sheetTags: SHEET_TAGS, radioStations: RADIO_STATIONS }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/radio") {
        const payload = request.method === "POST" ? await request.json().catch(() => ({})) : { mode: url.searchParams.get("mode") || "quiet", artists: (url.searchParams.get("artists") || "").split(",").filter(Boolean), ids: (url.searchParams.get("ids") || "").split(",").filter(Boolean), cats: (url.searchParams.get("cats") || "").split(",").filter(Boolean), exclude: (url.searchParams.get("exclude") || "").split(",").filter(Boolean), needSheets: url.searchParams.get("needSheets") === "1" };
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
        const name = (url.searchParams.get("name") || "").trim();
        const requestedId = (url.searchParams.get("id") || "").trim();
        const page = Math.max(1, Number(url.searchParams.get("page") || 1));
        const offsetValue = url.searchParams.get("offset");
        const requestedOffset = offsetValue === null ? (page - 1) * 50 : Math.max(0, Number(offsetValue) || 0);
        if (!name && !requestedId) return json({ songs: [], albums: [], hasMore: false });
        return withEdgeCache(ctx, `/v14/artist/${encodeURIComponent(requestedId || name)}/${page}/${requestedOffset}`, 600, async (ttl) => {
          const cfg = await getRuntimeCfg(env);
          if (page === 1) {
            let localRows = [];
            if (name) localRows = ((await env.DB.prepare("SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked = 0 AND artist LIKE ? ORDER BY score DESC LIMIT 50").bind(`%${name}%`).all()).results || []).map((row) => ({ ...row, cover: httpsCover(row.cover) }));
            const seen = new Set(localRows.map((row) => row.norm_key));
            const official = await fetchOfficialArtistData(name, /^\d+$/.test(requestedId) ? requestedId : "", cfg.junkWords);
            const mergedSongs = [...localRows];
            for (const song of official.songs) if (!seen.has(song.norm_key)) { seen.add(song.norm_key); mergedSongs.push(song); }
            let searchFallbackCount = 0;
            if ((!official.artistId || mergedSongs.length < 30) && name) {
              const live = await liveSearchSongs(name, 50, 1, cfg.junkWords, 0).catch(() => []);
              searchFallbackCount = live.length;
              for (const song of live) if (!seen.has(song.norm_key) && artistIdentityMatches(song.artist, name)) { seen.add(song.norm_key); mergedSongs.push(song); }
            }
            let albums = official.albums;
            if (name && albums.length < 5) {
              const liveAlbums = await liveSearchAlbums(name, 20, 1).catch(() => []);
              const albumSeen = new Set(albums.map((album) => String(album.id)));
              for (const album of liveAlbums) if (!albumSeen.has(String(album.id))) { albumSeen.add(String(album.id)); albums.push(album); }
            }
            // When an official artist ID is known, page two starts at the end of
            // the official hot-song batch. If it is unavailable, the local count
            // is used as a safe search-offset fallback (rather than skipping 50).
            const nextOffset = official.artistId ? official.songs.length : (searchFallbackCount || localRows.length);
            const hasMore = Boolean(official.artistId) || searchFallbackCount >= 50 || mergedSongs.length >= 50;
            const okCache = albums.length > 0 && mergedSongs.length >= 15;
            return json({ artist: name || official.artistName, artistId: official.artistId || requestedId, page, nextOffset, hasMore, songs: mergedSongs, albums }, 200,
              okCache ? { "Cache-Control": `public, max-age=${ttl}` } : { "X-Skip-Cache": "1", "Cache-Control": "no-store" });
          }

          let artistId = /^\d+$/.test(requestedId) ? requestedId : "";
          if (!artistId && name) artistId = (await resolveNeteaseArtistId(name)).id;
          let pageData = artistId ? await fetchNeteaseArtistSongsPage(artistId, requestedOffset, 50, name) : { songs: [], hasMore: false, nextOffset: requestedOffset, rawCount: 0, ok: false };
          if (!pageData.ok || !pageData.songs.length) {
            const live = await liveSearchSongs(name, 50, page, cfg.junkWords, requestedOffset).catch(() => []);
            const filtered = live.filter((song) => artistIdentityMatches(song.artist, name));
            pageData = { songs: filtered, hasMore: live.length >= 50, nextOffset: requestedOffset + live.length, rawCount: live.length, ok: true };
          }
          const songs = pageData.songs || [];
          const hasMore = Boolean(pageData.hasMore && songs.length);
          return json({ artist: name, artistId, page, nextOffset: pageData.nextOffset, hasMore, songs, albums: [] }, 200,
            songs.length ? { "Cache-Control": `public, max-age=${ttl}` } : { "X-Skip-Cache": "1", "Cache-Control": "no-store" });
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
        const rawId = (url.searchParams.get("id") || "").trim(); if (!rawId) return json({ error: "missing id" }, 400);
        const nid = rawId.replace(/^ne_/, "");
        return withEdgeCache(ctx, `/sheet/${encodeURIComponent(nid)}`, 900, async (ttl) => {
          const detail = await fetchNeteasePlaylistDetail(nid, 300); if (!detail) return json({ error: "sheet not found" }, 404);
          return json({ sheet: { id: detail.id, title: detail.title, artist: detail.artist, cover: detail.cover, description: detail.description }, songs: detail.songs }, 200, { "Cache-Control": `public, max-age=${ttl}` });
        });
      }
      if (path === "/api/import-sheet") {
        let inputUrl = url.searchParams.get("url") || "";
        if (request.method === "POST") { const body = await request.json().catch(() => ({})); inputUrl = body.url || inputUrl; }
        const imported = await importExternalPlaylist(inputUrl, env);
        if (!imported || !imported.songs?.length) return json({ error: "未能识别该歌单，支持网易云、QQ音乐、汽水音乐、酷狗、酷我公开歌单或 Music Hub 分享链接" }, 400);
        return json(imported);
      }
      if (path === "/api/share" && request.method === "POST") {
        const body = await request.json().catch(() => ({})), title = String(body.title || "我的歌单").trim().slice(0, 60), songs = Array.isArray(body.songs) ? body.songs.slice(0, 1000) : [];
        if (!songs.length) return json({ error: "空歌单无法分享" }, 400);
        const slim = songs.map((s) => ({ id: Number(s.id || 0), norm_key: s.norm_key || makeNormKey(s.title, s.artist), title: String(s.title || ""), artist: String(s.artist || ""), album: String(s.album || ""), cover: httpsCover(s.cover || ""), duration: Number(s.duration || 0), ext_source: s.ext_source || "", ext_id: s.ext_id || "" }));
        const sid = (await digestHex("SHA-256", title + ":" + JSON.stringify(slim) + ":" + Date.now())).slice(0, 10);
        await env.DB.prepare("INSERT INTO shares (id, title, description, songs_json, created_at) VALUES (?, ?, ?, ?, ?)").bind(sid, title, String(body.description || "Music Hub 用户分享歌单").slice(0, 120), JSON.stringify(slim), Math.floor(Date.now() / 1000)).run();
        const qs = env.ACCESS_TOKEN ? `&token=${encodeURIComponent(env.ACCESS_TOKEN)}` : "";
        return json({ ok: true, id: sid, shareUrl: `${url.origin}/player?share=${sid}${qs}` });
      }
      if (path === "/api/share" && request.method === "GET") {
        const sid = (url.searchParams.get("id") || "").trim(); if (!sid) return json({ error: "missing id" }, 400);
        const row = await env.DB.prepare("SELECT * FROM shares WHERE id = ?").bind(sid).first();
        return row ? json({ id: row.id, title: row.title, description: row.description, songs: JSON.parse(row.songs_json || "[]") }) : json({ error: "分享歌单不存在" }, 404);
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
            try { const d = await (await fetchTimeout(ep, { headers: NE_HEADERS }, 5000)).json(); if (d?.album) alb = d.album; if (Array.isArray(d?.songs) && d.songs.length) { rawSongs = d.songs; break; } } catch {}
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
        return withEdgeCache(ctx, `/v13/search/${encodeURIComponent(q)}/${page}`, 300, async (ttl) => {
          const cfg = await getRuntimeCfg(env); let localRows = [];
          if (page === 1) {
            const tokens = q.split(/\s+/).map((t) => t.replace(/"/g, "").trim()).filter(Boolean);
            if (tokens.length && tokens.every((t) => t.length >= 3)) localRows = ((await env.DB.prepare(`SELECT s.id,s.norm_key,s.title,s.artist,s.album,s.cover,s.duration,s.category,s.source_ids_json FROM songs_fts f JOIN songs s ON s.id = f.rowid WHERE songs_fts MATCH ? AND s.is_blocked = 0 ORDER BY s.score DESC LIMIT 30`).bind(tokens.map((t) => `"${t}"`).join(" ")).all()).results || []).map((r) => ({ ...r, cover: httpsCover(r.cover) }));
            if (!localRows.length && tokens.length) {
              const likeConds = tokens.map(() => "(title LIKE ? OR artist LIKE ? OR album LIKE ?)").join(" AND ");
              localRows = ((await env.DB.prepare(`SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked = 0 AND ${likeConds} ORDER BY score DESC LIMIT 25`).bind(...tokens.flatMap((t) => [`%${t}%`, `%${t}%`, `%${t}%`])).all()).results || []).map((r) => ({ ...r, cover: httpsCover(r.cover) }));
            }
          }
          const merged = [...localRows], seen = new Set(merged.map((r) => r.norm_key));
          const needGdFallback = merged.length < 8;
          const [live, gdLive] = await Promise.all([
            liveSearchSongs(q, 40, page, cfg.junkWords),
            needGdFallback ? liveSearchGdSongs(q, 30, page, cfg.junkWords) : Promise.resolve([]),
          ]);
          for (const item of live) if (!seen.has(item.norm_key)) { seen.add(item.norm_key); merged.push(item); }
          // GD Studio source is queried provider-by-provider; one failed provider cannot erase another's hits.
          for (const item of gdLive) if (!seen.has(item.norm_key)) { seen.add(item.norm_key); merged.push(item); }
          const headers = merged.length ? { "Cache-Control": `public, max-age=${ttl}` } : { "X-Skip-Cache": "1", "Cache-Control": "no-store" };
          return json({ page, hasMore: live.length >= 30 || merged.length >= 30, songs: merged }, 200, headers);
        });
      }
      if (path === "/api/song") {
        const rawId = url.searchParams.get("id") || "", id = /^\d+$/.test(rawId) ? Number(rawId) : 0;
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
        const rawId = url.searchParams.get("id") || ""; let id = /^\d+$/.test(rawId) ? Number(rawId) : 0;
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

        const cache = caches.default, cacheKey = new Request(`https://cache.internal/v11/play/${id}/${quality}/${prefer || "auto"}/${skip || "none"}`);
        let resolved = null;
        if (!force) { const cached = await cache.match(cacheKey); if (cached) resolved = await cached.json().catch(() => null); }
        if (force && skip.includes("kuwo")) {
          const oldIds = JSON.parse(song.source_ids_json || "{}");
          if (oldIds.kuwo) { delete oldIds.kuwo; ctx.waitUntil(env.DB.prepare("UPDATE songs SET source_ids_json = ? WHERE id = ?").bind(JSON.stringify(oldIds), id).run()); }
        }
        if (!resolved) {
          resolved = await resolvePlayUrl(song, quality, env, prefer, skip);
          if (resolved.error) return json(resolved, 502);
          if (resolved.kuwoId || resolved.biliId) {
            const ids = JSON.parse(song.source_ids_json || "{}"); let changed = false;
            if (resolved.kuwoId && !ids.kuwo) { ids.kuwo = resolved.kuwoId; changed = true; }
            if (resolved.biliId && !ids.bili) { ids.bili = resolved.biliId; changed = true; }
            if (changed) ctx.waitUntil(env.DB.prepare("UPDATE songs SET source_ids_json = ? WHERE id = ?").bind(JSON.stringify(ids), id).run());
          }
          ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(resolved), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=900" } })));
        }

        const needProxy = Boolean(resolved.needProxy || resolved.url.startsWith("http://"));
        const token = getTokenFromReq(request, pathToken);
        const proxyUrl = `${url.origin}/api/stream?u=${encodeURIComponent(resolved.url)}&src=${encodeURIComponent(resolved.source || "")}&token=${encodeURIComponent(token || "")}`;
        return json({ ...resolved, needProxy, songId: id, proxyUrl }, 200, { "Cache-Control": "private, no-store" });
      }

      const origin = `${url.protocol}//${url.host}`;
      const tkSeg = encodeURIComponent(env.ACCESS_TOKEN || "public");

      if (path === "/api/mf-plugin.js" || path === "/music-hub.js") {
        const pluginCode = `"use strict";
const axios = require("axios");
const BASE = ${JSON.stringify(origin)};
const TOKEN = ${JSON.stringify(env.ACCESS_TOKEN || "")};
const SRC_URL = ${JSON.stringify(origin + "/s/" + tkSeg + "/music-hub.js")};
const H = TOKEN ? { "X-Access-Token": TOKEN } : {};
const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";
const JUNK = ["dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok", "消音版", "片段", "高潮版", "0.8x", "1.2x", "翻唱", "cover", "吉他版", "钢琴版", "弹唱"];
const SOFT = ["live", "现场", "演唱会", "翻唱", "cover", "吉他版", "钢琴版", "纯享", "加速", "降调"];

function normStr(s) {
  return String(s || "").toLowerCase().split("(")[0].split("（")[0].split("[")[0].split("【")[0].replace(new RegExp("\\\\s+", "g"), " ").trim();
}
function scoreMatch(cName, cArtist, oTitle, oArtist, cDur, oDur) {
  var raw = String(cName || "").toLowerCase(), ro = String(oTitle || "").toLowerCase();
  if (!raw) return -999;
  for (var i = 0; i < JUNK.length; i++) if (raw.indexOf(JUNK[i]) >= 0 && ro.indexOf(JUNK[i]) < 0) return -999;
  var d = Number(cDur || 0), od = Number(oDur || 0);
  if (od >= 90 && d > 0 && (d <= 65 || d < od * 0.72)) return -999;
  var sc = 0, t = normStr(cName), ot = normStr(oTitle);
  sc += (t === ot) ? 55 : ((t.indexOf(ot) >= 0 || ot.indexOf(t) >= 0) ? 20 : -45);
  var oaList = String(oArtist || "").split(new RegExp("[,、&/]")).map(normStr).filter(function(x) { return x && x !== "未知歌手"; });
  var ca = normStr(Array.isArray(cArtist) ? cArtist.join(" ") : cArtist);
  if (oaList.length && ca) sc += oaList.some(function(a) { return ca.indexOf(a) >= 0 || a.indexOf(ca) >= 0; }) ? 65 : -120;
  for (var j = 0; j < SOFT.length; j++) if (raw.indexOf(SOFT[j]) >= 0 && ro.indexOf(SOFT[j]) < 0) sc -= 45;
  if (od > 30 && d > 0) { var diff = Math.abs(d - od); sc += (diff <= 5) ? 45 : (diff <= 15 ? 20 : (diff > 35 ? -40 : 0)); }
  return sc;
}
function mapSong(s) {
  var uid = (s.id && Number(s.id) > 0) ? String(s.id) : (s.ext_source && s.ext_id ? (s.ext_source + "_" + s.ext_id) : (s.norm_key || (s.title + "_" + s.artist)));
  return { id: uid, title: s.title, artist: s.artist, album: s.album, artwork: s.cover, duration: s.duration, category: s.category || "", ext_source: s.ext_source || "", ext_id: s.ext_id || "" };
}
function mapSheet(p) {
  return { id: String(p.id), title: p.title, artist: p.artist || "MusicHub", artwork: p.cover, playCount: p.playCount || 0, worksNum: p.worksNum || 0, description: p.description || "" };
}
function raceFirst(tasks) {
  return new Promise(function(resolve, reject) {
    var left = tasks.length, done = false; if (!left) return reject("empty");
    tasks.forEach(function(p) { p.then(function(v) { if (!done) { done = true; resolve(v); } }).catch(function() { left--; if (left === 0 && !done) reject("all_failed"); }); });
  });
}

module.exports = {
  platform: "MusicHub·自建云端",
  author: "MusicHub",
  version: "3.2.0",
  srcUrl: SRC_URL,
  cacheControl: "no-cache",
  supportedSearchType: ["music", "album", "artist", "sheet"],
  hints: {
    importMusicSheet: ["支持导入网易云、QQ音乐、汽水音乐、酷狗、酷我公开歌单（最高 1000 首）", "支持导入 Music Hub 网页分享链接"],
    importMusicItem: ["支持导入网易云单曲链接"]
  },

  async search(query, page, type) {
    if (type === "album") { const { data } = await axios.get(BASE + "/api/albums", { params: { q: query, page: page }, headers: H, timeout: 10000 }); return { isEnd: !data.hasMore, data: (data.albums || []).map(function(a) { return { id: String(a.id), title: a.title, artist: a.artist, artwork: a.cover, date: a.publishTime }; }) }; }
    if (type === "artist") { const { data } = await axios.get(BASE + "/api/artists", { params: { q: query, page: page }, headers: H, timeout: 10000 }); return { isEnd: !data.hasMore, data: (data.artists || []).map(function(a) { return { id: String(a.id), name: a.name, avatar: a.avatar, worksNum: a.worksNum || 0, description: a.tag || "" }; }) }; }
    if (type === "sheet") { const { data } = await axios.get(BASE + "/api/sheets", { params: { q: query, page: page }, headers: H, timeout: 10000 }); return { isEnd: !data.hasMore, data: (data.sheets || []).map(mapSheet) }; }
    if (type !== "music") return { isEnd: true, data: [] };
    const { data } = await axios.get(BASE + "/api/search", { params: { q: query, page: page }, headers: H, timeout: 10000 });
    return { isEnd: !data.hasMore, data: (data.songs || []).map(mapSong) };
  },
  async getArtistWorks(artistItem, page, type) {
    const { data } = await axios.get(BASE + "/api/artist", { params: { name: artistItem.name, id: artistItem.id || "", page: page }, headers: H, timeout: 10000 });
    if (type === "album") return { isEnd: true, data: (data.albums || []).map(function(a) { return { id: String(a.id), title: a.title, artist: a.artist || artistItem.name, artwork: a.cover, date: a.publishTime }; }) };
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
    const { data } = await axios.get(BASE + "/api/import-sheet", { params: { url: urlLike }, headers: H, timeout: 25000 });
    return (data.songs || []).map(mapSong);
  },
  async importMusicItem(urlLike) {
    var m = String(urlLike || "").match(new RegExp("(?:song\\\\?id=|song/)(\\\\d+)")); if (!m) return null;
    const { data } = await axios.get(BASE + "/api/search", { params: { q: m[1], page: 1 }, headers: H, timeout: 8000 });
    var hit = (data.songs || [])[0]; return hit ? mapSong(hit) : null;
  },

 async getMediaSource(item, quality) {
    var br = quality === "super" ? "999" : quality === "low" ? "128" : quality === "standard" ? "192" : "320";
    var dur = Number(item.duration || 0), cleanArtist = String(item.artist || "").split(new RegExp("[,、&/]"))[0].trim();
    var kw = (normStr(item.title) + " " + cleanArtist).trim(), hdrs = { "User-Agent": UA };
    var isHardTrack = /[周杰伦林俊杰陈奕迅邓紫棋薛之谦陶喆王力宏]/.test(item.artist || "") || /七里香|一路向北|夜曲|以父之名|可惜没如果|富士山下/.test(item.title || "");
    var localTimeout = isHardTrack ? 6800 : 2600;

    function decHtml(s) {
      return String(s || "").replace(new RegExp("&amp;", "g"), "&").replace(new RegExp("&nbsp;", "g"), " ").replace(new RegExp("&#39;|&apos;", "g"), "'");
    }
    function parseIv(str) {
      var m = String(str || "").match(new RegExp("(?:(\\\\d+)\\\\s*分)?\\\\s*(\\\\d+)\\\\s*秒"));
      return m ? (Number(m[1] || 0) * 60 + Number(m[2] || 0)) : 0;
    }
    function verifyBytesIfUnknown(url, sizeKb, extraH, minKbps) {
      var kbps = minKbps || 48;
      if (sizeKb) {
        if (dur >= 90 && Number(sizeKb) < Math.max(320, dur * (kbps / 8))) return Promise.reject("trial_size");
        return Promise.resolve(url);
      }
      return axios.get(url, { headers: Object.assign({ Range: "bytes=0-0" }, hdrs, extraH || {}), timeout: localTimeout }).then(function(hr) {
        var cr = (hr.headers && hr.headers["content-range"]) || "", m = cr.match(new RegExp("/(\\\\d+)"));
        var cl = m ? Number(m[1]) : Number((hr.headers && hr.headers["content-length"]) || 0);
        if (cl > 0 && ((dur >= 90 && cl < Math.max(320 * 1024, dur * (kbps / 8) * 1024)) || (dur === 0 && cl < 320 * 1024))) return Promise.reject("trial_range");
        return url;
      }).catch(function(e) { return (e === "trial_range") ? Promise.reject(e) : url; });
    }

    function tryKuwoLocal() {
      return axios.get("https://search.kuwo.cn/r.s", {
        params: { all: kw, ft: "music", itemset: "web_2013", client: "kt", pn: 0, rn: 8, rformat: "json", encoding: "utf8" },
        headers: hdrs, timeout: localTimeout
      }).then(function(r) {
        var blocks = String(r.data || "").split(new RegExp("\\\\}\\\\s*,\\\\s*\\\\{")), rids = [];
        for (var i = 0; i < blocks.length; i++) {
          var rid = (blocks[i].match(new RegExp("MUSIC_(\\\\d+)")) || [])[1]; if (!rid) continue;
          var nm = decHtml((blocks[i].match(new RegExp("['\\"]?NAME['\\"]?\\\\s*:\\\\s*['\\"]([^'\\"]*)['\\"]")) || [])[1] || "");
          var ar = decHtml((blocks[i].match(new RegExp("['\\"]?ARTIST['\\"]?\\\\s*:\\\\s*['\\"]([^'\\"]*)['\\"]")) || [])[1] || "");
          var d = Number((blocks[i].match(new RegExp("['\\"]?DURATION['\\"]?\\\\s*:\\\\s*['\\"]?(\\\\d+)['\\"]?")) || [])[1] || 0);
          var sc = scoreMatch(nm, ar, item.title, item.artist, d, dur);
          if (sc > -40) rids.push({ rid: rid, sc: sc });
        }
        rids.sort(function(a, b) { return b.sc - a.sc; });
        if (!rids.length) return Promise.reject("kw_no_match");
        function tryRid(idx) {
          if (idx >= Math.min(2, rids.length)) return Promise.reject("kw_all_ekey");
          var curRid = rids[idx].rid;
          return axios.get("https://mobi.kuwo.cn/mobi.s", { params: { f: "web", user: 0, source: "kwplayer_ar_8.5.5.0_apk_keluze.apk", type: "convert_url_with_sign", rid: curRid, br: br + "kmp3" }, headers: Object.assign({ Referer: "https://www.kuwo.cn/" }, hdrs), timeout: localTimeout })
            .then(function(r2) {
              var txt = String(r2.data || ""), m = txt.match(new RegExp("url=(http[^\\\\s\\\\r\\\\n]+)"));
              var u = m ? m[1] : (r2.data && r2.data.data && r2.data.data.url) || "";
              if (!u || txt.indexOf("ekey=") >= 0 || u.indexOf("panspace") >= 0) return tryRid(idx + 1);
              return verifyBytesIfUnknown(u, 0, { Referer: "https://www.kuwo.cn/" }, 80).catch(function() { return tryRid(idx + 1); });
            }).catch(function() { return tryRid(idx + 1); });
        }
        return tryRid(0).then(function(u) { return { url: u, headers: { Referer: "https://www.kuwo.cn/", "User-Agent": UA } }; });
      });
    }

    function tryVKeysLocal() {
      var qqP = axios.get("https://api.vkeys.cn/v2/music/tencent", { params: { word: kw }, headers: hdrs, timeout: localTimeout }).then(function(r) {
        var arr = r.data && r.data.data, pickN = 1;
        if (Array.isArray(arr) && arr.length) {
          var bsc = -100;
          for (var i = 0; i < Math.min(8, arr.length); i++) {
            var sc = scoreMatch(arr[i].song || arr[i].name, arr[i].singer || arr[i].artist, item.title, item.artist, parseIv(arr[i].interval), dur);
            if (sc > bsc) { bsc = sc; pickN = i + 1; }
          }
          if (bsc < 20) return Promise.reject("vk_qq_mismatch");
        }
        return axios.get("https://api.vkeys.cn/v2/music/tencent", { params: { word: kw, n: pickN, quality: 3 }, headers: hdrs, timeout: localTimeout });
      }).then(function(r) {
        var d = r.data && r.data.data; if (!d || !d.url || d.ekey) return Promise.reject("vk_qq_empty");
        var iv = parseIv(d.interval);
        if (dur >= 90 && iv > 0 && (iv <= 65 || iv < dur * 0.72)) return Promise.reject("vk_qq_30s");
        if (scoreMatch(d.song || item.title, d.singer || item.artist, item.title, item.artist, iv, dur) < 20) return Promise.reject("vk_qq_cover");
        return { url: d.url };
      });
      var ts = [qqP];
      if (item.ext_source === "netease" && item.ext_id) {
        ts.push(axios.get("https://api.vkeys.cn/v2/music/netease", { params: { id: item.ext_id, quality: 3 }, headers: hdrs, timeout: localTimeout }).then(function(r) {
          var d = r.data && r.data.data; if (!d || !d.url) return Promise.reject("vk_ne_empty");
          return verifyBytesIfUnknown(d.url, 0, {}, 80).then(function(vu) { return { url: vu }; });
        }));
      }
      return raceFirst(ts);
    }

    function tryGDLocal(plat) {
      var pidP = (plat === "netease" && item.ext_source === "netease" && item.ext_id)
        ? Promise.resolve(item.ext_id)
        : axios.get("https://music-api.gdstudio.xyz/api.php", { params: { use_xbridge3: "true", types: "search", source: plat, name: kw, count: 6, pages: 1 }, headers: hdrs, timeout: localTimeout }).then(function(r) {
            if (!Array.isArray(r.data) || !r.data.length) return "";
            var best = null, bsc = -100;
            for (var i = 0; i < r.data.length; i++) { var sc = scoreMatch(r.data[i].name, r.data[i].artist, item.title, item.artist, 0, dur); if (sc > bsc) { bsc = sc; best = r.data[i]; } }
            return (best && bsc >= 20 && best.id) ? String(best.id) : "";
          });
      return pidP.then(function(pid) {
        if (!pid) return Promise.reject("no_id");
        return axios.get("https://music-api.gdstudio.xyz/api.php", { params: { use_xbridge3: "true", types: "url", source: plat, id: pid, br: br }, headers: hdrs, timeout: localTimeout });
      }).then(function(r) {
        var d = r.data; if (!d || !d.url || d.url.indexOf("panspace") >= 0) return Promise.reject("gd_empty");
        return verifyBytesIfUnknown(d.url, d.size, {}, 64).then(function(u) { return { url: u }; });
      });
    }

    function tryCloudFallback(delayMs) {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          axios.get(BASE + "/api/play", {
            params: { id: item.id || 0, q: quality || "high", ext_source: item.ext_source, ext_id: item.ext_id, title: item.title, artist: item.artist, album: item.album, cover: item.artwork, duration: item.duration },
            headers: H, timeout: 14000
          }).then(function(r) {
            var data = r.data; if (!data || data.error || !data.url) return reject("cloud_fail");
            resolve(data.needProxy && data.proxyUrl ? { url: data.proxyUrl } : { url: data.url, headers: data.headers });
          }).catch(reject);
        }, delayMs);
      });
    }

    if (String(item.artist || "").indexOf("塞壬") >= 0) return await tryCloudFallback(0);
    var cloudDelay = isHardTrack ? 3200 : 1800;
    return await raceFirst([tryKuwoLocal(), tryGDLocal("kuwo"), tryGDLocal("joox"), tryVKeysLocal(), tryGDLocal("netease"), tryCloudFallback(cloudDelay)]);
  },

  async getLyric(item) {
    const { data } = await axios.get(BASE + "/api/song", { params: { id: item.id || 0, ext_source: item.ext_source, ext_id: item.ext_id, title: item.title, artist: item.artist }, headers: H, timeout: 8000 });
    return { rawLrc: (data.song && data.song.lyric_lrc) || "", translation: (data.song && data.song.lyric_trans) || undefined };
  },
  async getTopLists() {
    const { data } = await axios.get(BASE + "/api/home", { headers: H, timeout: 8000 });
    var g = {}; for (var i = 0; i < (data.charts || []).length; i++) { var c = data.charts[i]; if (!g[c.category]) g[c.category] = []; g[c.category].push({ id: c.id, title: c.title, coverImg: c.cover, description: c.description }); }
    var out = Object.keys(g).map(function(title) { return { title: title, data: g[title] }; });
    if (data.artists && data.artists.length) out.push({ title: "热门歌手代表作", data: data.artists.map(function(a) { return { id: "artist_" + a.name, title: a.name, description: a.tag }; }) });
    return out;
  },
  async getTopListDetail(tl) {
    if (String(tl.id).indexOf("artist_") === 0) { const { data } = await axios.get(BASE + "/api/artist", { params: { name: String(tl.id).slice(7), page: 1 }, headers: H, timeout: 10000 }); return { isEnd: !data.hasMore, topListItem: tl, musicList: (data.songs || []).map(mapSong) }; }
    const { data } = await axios.get(BASE + "/api/chart", { params: { id: tl.id }, headers: H, timeout: 10000 });
    return { isEnd: true, topListItem: tl, musicList: (data.songs || []).map(mapSong) };
  }
};`;
        return new Response(pluginCode, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
      }

      if (path === "/kuwo.js") {
        const kuwoCode = `"use strict";
const axios = require("axios");
const SRC_URL = ${JSON.stringify(origin + "/s/" + tkSeg + "/kuwo.js")};
const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";
const JUNK = ["dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok", "消音版"];
module.exports = {
  platform: "MusicHub·酷我直连",
  author: "MusicHub",
  version: "1.1.0",
  srcUrl: SRC_URL,
  cacheControl: "no-cache",
  supportedSearchType: ["music"],
  async search(query, page, type) {
    if (type !== "music") return { isEnd: true, data: [] };
    const { data } = await axios.get("https://search.kuwo.cn/r.s", {
      params: { all: query, ft: "music", itemset: "web_2013", client: "kt", pn: page - 1, rn: 20, rformat: "json", encoding: "utf8" },
      headers: { "User-Agent": UA }, timeout: 8000
    });
    var blocks = String(data || "").split(new RegExp("\\\\}\\\\s*,\\\\s*\\\\{")), out = [];
    for (var i = 0; i < blocks.length; i++) {
      var rid = (blocks[i].match(new RegExp("MUSIC_(\\\\d+)")) || [])[1];
      var name = (blocks[i].match(new RegExp("['\\"]?NAME['\\"]?\\\\s*:\\\\s*['\\"]([^'\\"]*)['\\"]")) || [])[1] || "";
      if (!rid || !name) continue;
      var low = name.toLowerCase(), ql = String(query || "").toLowerCase();
      if (JUNK.some(function(w) { return low.indexOf(w) >= 0 && ql.indexOf(w) < 0; })) continue;
      var artist = ((blocks[i].match(new RegExp("['\\"]?ARTIST['\\"]?\\\\s*:\\\\s*['\\"]([^'\\"]*)['\\"]")) || [])[1] || "未知歌手").replace(new RegExp("&", "g"), " / ");
      var album = (blocks[i].match(new RegExp("['\\"]?ALBUM['\\"]?\\\\s*:\\\\s*['\\"]([^'\\"]*)['\\"]")) || [])[1] || "";
      var dur = Number((blocks[i].match(new RegExp("['\\"]?DURATION['\\"]?\\\\s*:\\\\s*['\\"]?(\\\\d+)['\\"]?")) || [])[1] || 0);
      out.push({ id: rid, title: name, artist: artist, album: album, duration: dur, artwork: "https://artistpicserver.kuwo.cn/pic.web?corp=kuwo&type=rid_pic&pictype=url&size=300&rid=" + rid });
    }
    return { isEnd: out.length < 15, data: out };
  },
  async getMediaSource(item, quality) {
    var brList = quality === "low" ? ["128kmp3"] : (quality === "standard" ? ["192kmp3", "128kmp3"] : ["320kmp3", "192kmp3", "128kmp3"]);
    for (var i = 0; i < brList.length; i++) {
      try {
        const { data } = await axios.get("https://mobi.kuwo.cn/mobi.s", { params: { f: "web", user: 0, source: "kwplayer_ar_8.5.5.0_apk_keluze.apk", type: "convert_url_with_sign", rid: item.id, br: brList[i] }, headers: { "User-Agent": UA, Referer: "https://www.kuwo.cn/" }, timeout: 5500 });
        var txt = String(data || ""), m = txt.match(new RegExp("url=(http[^\\\\s\\\\r\\\\n]+)"));
        var u = m ? m[1] : (data && data.data && data.data.url) || "";
        if (u && txt.indexOf("ekey=") < 0) return { url: u, headers: { Referer: "https://www.kuwo.cn/", "User-Agent": UA } };
      } catch (_) {}
    }
    try {
      const { data } = await axios.get("https://wapi.kuwo.cn/api/v1/www/music/playUrl", { params: { mid: item.id, type: "music" }, headers: { "User-Agent": UA, Referer: "https://www.kuwo.cn/" }, timeout: 5500 });
      if (data && data.data && data.data.url) return { url: data.data.url, headers: { Referer: "https://www.kuwo.cn/", "User-Agent": UA } };
    } catch (_) {}
    throw new Error("酷我VIP限制或无直链");
  },
  async getLyric(item) {
    try {
      const { data } = await axios.get("https://m.kuwo.cn/newh5/singles/songinfoandlrc", { params: { musicId: item.id }, headers: { "User-Agent": UA }, timeout: 5000 });
      var list = data && data.data && data.data.lrclist;
      if (Array.isArray(list) && list.length) {
        var lrc = list.map(function(row) {
          var t = Number(row.time || 0), m = String(Math.floor(t / 60)).padStart(2, "0"), s = (t % 60).toFixed(2).padStart(5, "0");
          return "[" + m + ":" + s + "]" + (row.lineLyric || "");
        }).join("\\n");
        return { rawLrc: lrc };
      }
    } catch (_) {}
    try {
      const { data } = await axios.get("https://lrclib.net/api/get", { params: { track_name: item.title, artist_name: String(item.artist || "").split("/")[0].trim() }, timeout: 4500 });
      if (data && (data.syncedLyrics || data.plainLyrics)) return { rawLrc: data.syncedLyrics || data.plainLyrics };
    } catch (_) {}
    return { rawLrc: "" };
  }
};`;
        return new Response(kuwoCode, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
      }

      if (path === "/bili.js") {
        const biliCode = `"use strict";
const axios = require("axios");
const CryptoJS = require("crypto-js");
const SRC_URL = ${JSON.stringify(origin + "/s/" + tkSeg + "/bili.js")};
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const TAB = [46,47,18,2,53,8,23,32,15,50,10,31,58,3,45,35,27,43,5,49,33,9,42,19,29,28,14,39,12,38,41,13,37,48,7,16,24,55,40,61,26,17,0,1,60,51,30,4,22,25,54,21,56,59,6,63,57,62,11,36,20,34,44,52];
const NOISE = ["翻唱", "教学", "吉他", "钢琴", "伴奏", "鬼畜", "dj版", "reaction", "指弹", "弹唱", "二创"];
let authCache = { b3: "", b4: "", img: "", sub: "", ts: 0 };
function cleanTitle(s) {
  return String(s || "").replace(new RegExp("<[^>]+>", "g"), "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function toSec(d) {
  var p = String(d || "").split(":").map(Number);
  return p.length === 2 ? p[0] * 60 + p[1] : (p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : 0);
}
async function getAuth() {
  var now = Date.now();
  if (authCache.b3 && authCache.img && now - authCache.ts < 1800000) return authCache;
  const r1 = await axios.get("https://api.bilibili.com/x/frontend/finger/spi", { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" }, timeout: 6000 });
  var s = r1.data?.data || {}, ck = "buvid3=" + (s.b_3 || "") + "; buvid4=" + (s.b_4 || "");
  const r2 = await axios.get("https://api.bilibili.com/x/web-interface/nav", { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/", Cookie: ck }, timeout: 6000 });
  var w = r2.data?.data?.wbi_img || {};
  authCache = { b3: s.b_3 || "", b4: s.b_4 || "", img: (w.img_url || "").split("/").pop().split(".")[0], sub: (w.sub_url || "").split("/").pop().split(".")[0], ts: now };
  return authCache;
}
function wbiQs(params, img, sub) {
  var orig = img + sub, key = TAB.map(function(i) { return orig[i] || ""; }).join("").slice(0, 32);
  var all = Object.assign({}, params, { wts: Math.floor(Date.now() / 1000) });
  var q = Object.keys(all).sort().map(function(k) { return encodeURIComponent(k) + "=" + encodeURIComponent(String(all[k]).replace(/[!'()*]/g, "")); }).join("&");
  return q + "&w_rid=" + CryptoJS.MD5(q + key).toString();
}
module.exports = {
  platform: "MusicHub·B站直连",
  author: "MusicHub",
  version: "1.2.0",
  srcUrl: SRC_URL,
  cacheControl: "no-cache",
  supportedSearchType: ["music"],
  async search(query, page, type) {
    if (type !== "music") return { isEnd: true, data: [] };
    const auth = await getAuth(), ql = String(query || "").toLowerCase();
    const qs = wbiQs({ search_type: "video", keyword: query, page: page, page_size: 20 }, auth.img, auth.sub);
    const { data } = await axios.get("https://api.bilibili.com/x/web-interface/wbi/search/type?" + qs, {
      headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/", Cookie: "buvid3=" + auth.b3 + "; buvid4=" + auth.b4 }, timeout: 8000
    });
    var raw = data?.data?.result || [];
    var list = raw.filter(function(it) {
      var d = toSec(it.duration), t = cleanTitle(it.title).toLowerCase();
      if (d < 30 || d > 900) return false;
      return !NOISE.some(function(w) { return t.indexOf(w) >= 0 && ql.indexOf(w) < 0; });
    });
    if (!list.length) list = raw.filter(function(it) { var d = toSec(it.duration); return d >= 30 && d <= 900; });
    return {
      isEnd: raw.length < 20,
      data: list.map(function(it) { return { id: it.bvid, bvid: it.bvid, title: cleanTitle(it.title), artist: it.author || "UP主", artwork: it.pic?.startsWith("//") ? "https:" + it.pic : it.pic, duration: toSec(it.duration) }; })
    };
  },
  async getMediaSource(item, quality) {
    const auth = await getAuth(), bvid = item.bvid || item.id, ck = "buvid3=" + auth.b3 + "; buvid4=" + auth.b4;
    const pr = await axios.get("https://api.bilibili.com/x/player/pagelist?bvid=" + bvid, { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" }, timeout: 6000 });
    var cid = pr.data?.data?.[0]?.cid; if (!cid) throw new Error("获取 CID 失败");
    const { data } = await axios.get("https://api.bilibili.com/x/player/playurl?bvid=" + bvid + "&cid=" + cid + "&qn=80&fnval=4048&otype=json", {
      headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/video/" + bvid, Cookie: ck }, timeout: 8000
    });
    var audios = data?.data?.dash?.audio || [];
    if (audios.length) {
      audios.sort(function(a, b) { return (b.bandwidth || 0) - (a.bandwidth || 0); });
      var idx = quality === "low" ? audios.length - 1 : (quality === "standard" ? Math.min(1, audios.length - 1) : 0);
      var p = audios[idx] || audios[0];
      return { url: p.baseUrl || p.base_url || p.backupUrl?.[0], headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA }, userAgent: UA };
    }
    const mp4 = await axios.get("https://api.bilibili.com/x/player/playurl?bvid=" + bvid + "&cid=" + cid + "&qn=64&fnval=1&otype=json", {
      headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/video/" + bvid, Cookie: ck }, timeout: 8000
    });
    var durl = mp4.data?.data?.durl?.[0]?.url;
    if (durl) return { url: durl, headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA }, userAgent: UA };
    throw new Error("未获取到B站音频流");
  },
  async getLyric(item) {
    try {
      const { data } = await axios.get("https://lrclib.net/api/search", { params: { q: cleanTitle(item.title).split(" ")[0] }, timeout: 4500 });
      if (Array.isArray(data) && data[0]) return { rawLrc: data[0].syncedLyrics || data[0].plainLyrics || "" };
    } catch (_) {}
    return { rawLrc: "" };
  }
};`;
        return new Response(biliCode, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
      }

      if (path === "/msr.js") {
        const msrCode = `"use strict";
const axios = require("axios");
const SRC_URL = ${JSON.stringify(origin + "/s/" + tkSeg + "/msr.js")};
const API = "https://monster-siren.hypergryph.com/api";
let cache = null, cacheTs = 0;
async function getAll() {
  if (cache && cache.length && Date.now() - cacheTs < 1800000) return cache;
  const { data } = await axios.get(API + "/songs", { timeout: 8000 });
  if (data?.data?.list?.length) { cache = data.data.list; cacheTs = Date.now(); }
  return cache || [];
}
module.exports = {
  platform: "MusicHub·塞壬直连",
  author: "MusicHub",
  version: "1.1.0",
  srcUrl: SRC_URL,
  cacheControl: "no-cache",
  supportedSearchType: ["music", "album"],
  async search(query, page, type) {
    var q = String(query || "").toLowerCase();
    if (type === "album") {
      const { data } = await axios.get(API + "/albums", { timeout: 8000 });
      var albs = (data?.data || []).filter(function(a) { return !q || a.name.toLowerCase().includes(q); }).slice((page - 1) * 20, page * 20);
      return { isEnd: albs.length < 20, data: albs.map(function(a) { return { id: a.cid, title: a.name, artist: (a.artistes || []).join(" / ") || "塞壬唱片-MSR", artwork: a.coverUrl }; }) };
    }
    var all = await getAll(), matched = all.filter(function(s) { return !q || s.name.toLowerCase().includes(q) || (s.artists || []).join(",").toLowerCase().includes(q); });
    return { isEnd: page * 20 >= matched.length, data: matched.slice((page - 1) * 20, page * 20).map(function(s) { return { id: s.cid, title: s.name, artist: (s.artists || []).join(" / ") || "塞壬唱片-MSR" }; }) };
  },
  async getAlbumInfo(alb) {
    const { data } = await axios.get(API + "/album/" + alb.id + "/detail", { timeout: 8000 });
    var d = data?.data || {}, fb = (d.artistes || []).join(" / ") || "塞壬唱片-MSR";
    return { isEnd: true, albumItem: Object.assign({}, alb, { artwork: d.coverUrl }), musicList: (d.songs || []).map(function(s) { return { id: s.cid, title: s.name, artist: (s.artistes && s.artistes.length) ? s.artistes.join(" / ") : fb, album: d.name, artwork: d.coverUrl }; }) };
  },
  async getMediaSource(item) {
    const { data } = await axios.get(API + "/song/" + item.id, { timeout: 8000 });
    if (!data?.data?.sourceUrl) throw new Error("无官方音频直链");
    return { url: data.data.sourceUrl };
  },
  async getLyric(item) {
    try {
      const { data } = await axios.get(API + "/song/" + item.id, { timeout: 6000 });
      if (data?.data?.lyricUrl) return { rawLrc: String((await axios.get(data.data.lyricUrl, { timeout: 6000 })).data || "") };
    } catch (_) {}
    return { rawLrc: "" };
  },
  async getTopLists() {
    const { data } = await axios.get(API + "/albums", { timeout: 8000 });
    return [{ title: "塞壬唱片官方专辑库", data: (data?.data || []).slice(0, 30).map(function(a) { return { id: a.cid, title: a.name, coverImg: a.coverUrl, description: (a.artistes || []).join(" / ") }; }) }];
  },
  async getTopListDetail(tl) {
    const res = await this.getAlbumInfo(tl);
    return { isEnd: true, topListItem: Object.assign({}, tl, { coverImg: res.albumItem.artwork }), musicList: res.musicList };
  }
};`;
        return new Response(msrCode, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
      }

      if (path === "/api/lx-source.js" || path === "/lx-source.js") {
        const lxCode = `/*!
 * @name MusicHub·自建云端
 * @description 基于 Music Hub Worker 的洛雪音乐自定义源（多源并发 + 歌曲宝 + 防试听 + B站WBI兜底）
 * @version 3.1.0
 * @author MusicHub
 */
const { EVENT_NAMES, request, on, send } = globalThis.lx;
const BASE = ${JSON.stringify(origin)};
const TOKEN = ${JSON.stringify(env.ACCESS_TOKEN || "")};
function toSec(iv) {
  if (!iv) return 0;
  if (typeof iv === "number") return Math.round(iv > 10000 ? iv / 1000 : iv);
  var p = String(iv).split(":").map(Number);
  return p.length === 2 ? p[0] * 60 + p[1] : (p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : 0);
}
on(EVENT_NAMES.request, ({ source, action, info }) => {
  if (action !== "musicUrl") return Promise.reject(new Error("unsupported action"));
  var mi = info.musicInfo || {}, q = (info.type === "flac" || info.type === "flac24bit") ? "super" : (info.type === "128k" ? "low" : "high");
  var extSrc = source === "wy" ? "netease" : (source === "kw" ? "kuwo" : (source === "tx" ? "qq" : ""));
  var qs = "?id=0&q=" + encodeURIComponent(q) + "&ext_source=" + encodeURIComponent(extSrc) + "&ext_id=" + encodeURIComponent(String(mi.songmid || mi.id || "")) + "&title=" + encodeURIComponent(mi.name || "") + "&artist=" + encodeURIComponent(mi.singer || "") + "&album=" + encodeURIComponent(mi.albumName || "") + "&duration=" + toSec(mi.interval) + (TOKEN ? "&token=" + encodeURIComponent(TOKEN) : "");
  return new Promise((resolve, reject) => {
    request(BASE + "/api/play" + qs, { method: "GET", timeout: 14000 }, (err, resp) => {
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
        const cfg = await getRuntimeCfg(env);
        const plugins = [
          { name: "MusicHub·自建云端", url: `${origin}/s/${tkSeg}/music-hub.js`, version: "3.2.0" },
          { name: "MusicHub·酷我直连", url: `${origin}/s/${tkSeg}/kuwo.js`, version: "1.1.0" },
          { name: "MusicHub·B站直连", url: `${origin}/s/${tkSeg}/bili.js`, version: "1.3.0" },
          { name: "MusicHub·塞壬直连", url: `${origin}/s/${tkSeg}/msr.js`, version: "1.1.0" },
        ];
        if (cfg.subMode === "fusion" || cfg.subMode === "turbo") {
          plugins.push(
            { name: "种子音乐(融合)", url: "https://gitee.com/kevinr/tvbox/raw/master/musicfree/plugins/zz.js", version: "0.0.1" },
            { name: "爱听(融合)", url: "https://gitee.com/kevinr/tvbox/raw/master/musicfree/plugins/at.js", version: "0.0.1" },
            { name: "5sing(融合)", url: "https://gitee.com/kevinr/tvbox/raw/master/musicfree/plugins/5sing.js", version: "0.0.1" }
          );
        }
        if (cfg.subMode === "turbo") {
          plugins.push(
            { name: "元力-网易(融合)", url: "http://music.haitangw.net/cqapi/wy.js", version: "0.2.7" },
            { name: "元力-QQ(融合)", url: "http://music.haitangw.net/cqapi/qq.js", version: "0.2.7" },
            { name: "元力-酷我(融合)", url: "http://music.haitangw.net/cqapi/kw.js", version: "0.2.7" }
          );
        }
        return json({ plugins });
      }
      return json({ error: "Not Found" }, 404);
    } catch (err) {
      return json({ error: err?.message || String(err) }, 500);
    }
  },
};
