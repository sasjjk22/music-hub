"use strict";
const axios = require("axios");
const CryptoJS = require("crypto-js");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const AGG_API = "https://music-api.gdstudio.xyz/api.php";
const MIGU_BASE = "https://app.c.nf.migu.cn";
const MIGU_RESPONSE_KEY = "Jk8qzuePiJ1qE3mDYhLQ3T73DtDoAhLP";
const MIGU_CURATED = {
  "一路向北|周杰伦": "60054701958",
  "兰亭序|周杰伦": "60054702006",
};

const TRAD_SIMP_LIST = [
  "啞哑","謙谦","傑杰","倫伦","陳陈","張张","劉刘","楊杨","趙赵","黃黄","吳吴","鄭郑","孫孙","馬马","羅罗",
  "葉叶","蘇苏","蔣蒋","韓韩","馮冯","鄧邓","蕭萧","謝谢","許许","盧卢","韋韦","莊庄","嚴严","鍾钟","麥麦",
  "歐欧","陽阳","溫温","藍蓝","齊齐","學学","榮荣","麗丽","龍龙","遙遥","輝辉","闊阔","問问","戀恋","蘭兰",
  "煉炼","單单","愛爱","說说","聽听","後后","來来","這这","為为","們们","無无","樂乐","夢梦","風风","飛飞",
  "開开","關关","門门","長长","時时","見见","還还","過过","對对","錯错","點点","線线","書书","寫写","語语",
  "話话","詞词","調调","聲声","響响","誰谁","麼么","裡里","邊边","頭头","臉脸","淚泪","傷伤","獨独","員员",
  "國国","華华","東东","萬万","億亿","雙双","與与","給给","讓让","願愿","會会","該该","經经","總总","結结",
  "終终","離离","別别","記记","憶忆","懷怀","變变","動动","靜静","歡欢","難难","實实","虛虚","輕轻","遠远",
  "舊旧","歲岁","晝昼","顏颜","紅红","綠绿","銀银","鐵铁","銅铜","鋼钢","網网","雲云","電电",
];
const TRAD_SIMP_MAP = new Map(TRAD_SIMP_LIST.map((p) => [p[0], p[1]]));

const JUNK_WORDS = [
  "dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok",
  "消音版", "片段", "高潮版", "0.8x", "1.2x",
];
const SOFT_PENALTY = ["live", "现场", "演唱会", "翻唱", "cover", "吉他版", "钢琴版", "纯享", "加速", "降调"];
const HARD_ARTISTS = ["周杰伦", "jay chou", "林俊杰", "陈奕迅", "taylor swift", "五月天", "邓紫棋", "薛之谦", "陶喆", "王力宏"];
const VERY_HARD_TRACKS = ["七里香", "一路向北", "晴天", "稻香", "夜曲", "以父之名", "青花瓷", "可惜没如果", "江南", "修炼爱情", "十年", "富士山下", "k歌之王"];

const NETEASE_TOPLISTS = [
  {
    title: "核心热门",
    data: [
      { id: "3778678", title: "热歌榜", description: "网易云热歌榜 Top200" },
      { id: "19723756", title: "飙升榜", description: "每日热度上升最快单曲" },
      { id: "3779629", title: "新歌榜", description: "近期新发行热门单曲" },
      { id: "2884035", title: "原创榜", description: "独立音乐人原创作品" },
      { id: "4395559", title: "华语金曲榜", description: "经典与热门华语歌曲" },
    ],
  },
  {
    title: "垂类精选",
    data: [
      { id: "71385702", title: "ACG 音乐榜", description: "动漫 / 游戏 / 二次元音乐" },
      { id: "10520166", title: "电音榜", description: "电子舞曲 / EDM 精选" },
      { id: "991319590", title: "中文说唱榜", description: "中文 Hip-Hop / Rap" },
      { id: "71384707", title: "古典音乐榜", description: "古典乐与纯音乐精选" },
      { id: "60131", title: "日本 Oricon 榜", description: "日语流行每周榜单" },
      { id: "60198", title: "美国 Billboard 榜", description: "欧美流行每周榜单" },
    ],
  },
];

function toSimplified(s) {
  let out = "";
  for (const ch of String(s || "")) out += TRAD_SIMP_MAP.get(ch) || ch;
  return out;
}

function decodeHtml(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"');
}

function normalizeName(s) {
  const raw = toSimplified(String(s || "")).toLowerCase().trim();
  const stripped = raw.replace(/[\(（\[【].*?[\)）\]】]/g, "").replace(/\s+/g, " ").trim();
  return stripped || raw.replace(/[\(\)\[\]（）【】]/g, "").replace(/\s+/g, " ").trim();
}

function splitFirstArtist(artist) {
  return String(artist || "").split(/[/,、]|\s+&\s+/)[0].trim();
}

function makeDedupKey(title, artist) {
  const raw = toSimplified(String(title || "")).toLowerCase().trim();
  const variants = [];
  const segs = raw.match(/[\(（\[【]([^\)）\]】]+)[\)）\]】]/g);
  if (segs) {
    for (const seg of segs) {
      if (/(live|现场|演唱会|remix|dj|伴奏|纯音乐|钢琴|吉他|弹唱|翻唱|cover|加速|降调|清唱|night version)/i.test(seg)) {
        variants.push(seg.replace(/[\(\)\[\]（）【】]/g, "").trim());
      }
    }
  }
  const tKey = `${normalizeName(raw)}${variants.length ? " " + variants.join(" ") : ""}`.replace(/\s+/g, " ").trim();
  return `${tKey}|${normalizeName(splitFirstArtist(artist))}`;
}

function isJunkTitle(title, query) {
  const t = toSimplified(title || "").toLowerCase();
  const q = toSimplified(query || "").toLowerCase();
  return JUNK_WORDS.some((w) => t.includes(w) && !q.includes(w));
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
  const e = normalizeName(decodeHtml(splitFirstArtist(expectedArtist)));
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
    ["张国荣", "leslie cheung"],
    ["张学友", "jacky cheung"],
    ["王菲", "faye wong"],
  ];
  return groups.some((g) => g.some((a) => e.includes(normalizeName(a))) && g.some((a) => c.includes(normalizeName(a))));
}

function scoreCandidate(cTitle, cArtist, oTitle, oArtist, cDur, oDur, strictArtist = false, cAlbum = "") {
  const raw = toSimplified(decodeHtml(cTitle)).toLowerCase();
  const ro = toSimplified(decodeHtml(oTitle)).toLowerCase();
  if (!raw || hasBadVariantMeta(cTitle, cArtist, cAlbum)) return -999;
  if (JUNK_WORDS.some((w) => raw.includes(w) && !ro.includes(w))) return -999;
  const d = Number(cDur || 0), od = Number(oDur || 0);
  if (od >= 90 && d > 0 && (d <= 65 || d < od * 0.72)) return -999;
  if (strictArtist && oArtist && !artistIdentityMatches(cArtist, oArtist)) return -999;
  let sc = 0;
  const t = normalizeName(raw), ot = normalizeName(ro);
  sc += t === ot ? 55 : (t.includes(ot) || ot.includes(t) ? 20 : -45);
  const oaList = decodeHtml(oArtist).split(/[/,、]|\s+&\s+/).map(normalizeName).filter((x) => x && x !== "未知歌手");
  const ca = normalizeName(decodeHtml(Array.isArray(cArtist) ? cArtist.join(" ") : cArtist));
  if (oaList.length && ca) sc += oaList.some((a) => ca.includes(a) || a.includes(ca)) ? 65 : -120;
  for (const w of SOFT_PENALTY) if (raw.includes(w) && !ro.includes(w)) sc -= 45;
  if (od > 30 && d > 0) {
    const diff = Math.abs(d - od);
    sc += diff <= 5 ? 45 : (diff <= 15 ? 20 : (diff > 35 ? -40 : 0));
  }
  return sc;
}

function parseCnInterval(str) {
  const s = String(str || "");
  if (!s) return 0;
  const m = s.match(/(?:(\d+)\s*分)?\s*(\d+)\s*秒/);
  if (m) return Number(m[1] || 0) * 60 + Number(m[2] || 0);
  const p = s.split(":").map(Number);
  return p.length === 2 ? p[0] * 60 + p[1] : 0;
}

function raceFirst(tasks) {
  return new Promise((resolve, reject) => {
    let left = tasks.length, done = false;
    if (!left) return reject(new Error("empty_tasks"));
    tasks.forEach((p) => {
      Promise.resolve(p)
        .then((v) => { if (!done && v && v.url) { done = true; resolve(v); } else { left--; if (left === 0 && !done) reject(new Error("all_failed")); } })
        .catch(() => { left--; if (left === 0 && !done) reject(new Error("all_failed")); });
    });
  });
}

function qualityToBrList(quality) {
  switch (quality) {
    case "super":
      return ["999", "740", "320", "192"];
    case "high":
      return ["320", "192", "128"];
    case "low":
      return ["128", "192"];
    case "standard":
    default:
      return ["192", "320", "128"];
  }
}

async function isValidAudioUrl(url, sizeKb, durationSec, headers = {}) {
  if (!url || typeof url !== "string" || !url.startsWith("http")) return false;
  if (url.includes("panspace.kuwo.cn") || url.includes("/404")) return false;

  const minBytes = durationSec >= 90
    ? Math.max(320 * 1024, Math.round(durationSec * (44 / 8) * 1024))
    : (durationSec === 0 ? 320 * 1024 : 0);
  if (sizeKb && minBytes > 0 && Number(sizeKb) * 1024 < minBytes) return false;

  try {
    const res = await axios.get(url, {
      headers: { Range: "bytes=0-0", "User-Agent": UA, ...headers },
      timeout: 4500,
      responseType: "arraybuffer",
      validateStatus: () => true,
    });
    if (res.status !== 200 && res.status !== 206) return false;
    const ct = String(res.headers["content-type"] || "").toLowerCase();
    if (ct.includes("text/html") || ct.includes("application/json")) return false;
    const cr = String(res.headers["content-range"] || "");
    const m = cr.match(/\/(\d+)$/);
    const total = m ? Number(m[1]) : (res.status === 200 ? Number(res.headers["content-length"] || 0) : 0);
    if (total > 0 && minBytes > 0 && total < minBytes) return false;
    return true;
  } catch (_) {
    return false;
  }
}

function miguNorm(s) { return normalizeName(String(s || "")).replace(/[\s·•_-]/g, ""); }
function miguArtist(item) {
  const x = item?.singers || item?.singerList || item?.artists || item?.singer || item?.artist || "";
  return Array.isArray(x) ? x.map((v) => typeof v === "string" ? v : v?.name || "").filter(Boolean).join(" / ") : (typeof x === "object" ? x.name || "" : String(x || ""));
}
function miguSeconds(value) {
  if (typeof value === "number" || /^\d+(\.\d+)?$/.test(String(value || ""))) {
    const n = Number(value || 0); return n > 10000 ? Math.round(n / 1000) : Math.round(n);
  }
  const p = String(value || "").split(":").map(Number);
  if (p.length === 3 && p.every(Number.isFinite)) return p[0] * 3600 + p[1] * 60 + p[2];
  if (p.length === 2 && p.every(Number.isFinite)) return p[0] * 60 + p[1];
  return 0;
}
function miguCandidate(item) {
  if (!item) return null;
  return {
    title: String(item.name || item.songName || item.title || ""),
    artist: miguArtist(item),
    album: typeof item.album === "object" ? (item.album.name || "") : String(item.album || item.albumName || ""),
    contentId: String(item.contentId || item.songId || item.id || ""),
    copyrightId: String(item.copyrightId || item.cpId || ""),
    duration: miguSeconds(item.duration || item.interval || item.songTime || 0),
    cover: String(item.imgItems?.[0]?.img || item.albumPic || item.picUrl || item.cover || ""),
    raw: item,
  };
}
async function miguJson(url) {
  const { data } = await axios.get(url, { headers: { "User-Agent": UA, Accept: "application/json, text/plain, */*", Referer: "https://music.migu.cn/", ua: "Android_migu", version: "5.0.1" }, timeout: 6500 });
  if (!data || typeof data !== "object") throw new Error("Migu invalid response");
  return data;
}
async function miguSignedJson(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": UA, Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=UTF-8", Origin: "https://h5.nf.migu.cn",
      Referer: "https://h5.nf.migu.cn/", birth: "h5page", signature: "1",
      ua: "Android_migu", version: "5.0.1",
    },
    timeout: 5500, responseType: "arraybuffer",
  });
  const bytes = new Uint8Array(response.data || []);
  if (!bytes.length) throw new Error("Migu empty listen response");
  const hasMagic = bytes.length >= 4 && bytes[0] === 0xab && bytes[1] === 0xcd && bytes[2] === 0x01;
  const signed = String(response.headers?.signature || "") === "1" || hasMagic;
  let decoded = bytes;
  if (signed) {
    if (bytes.length < 5) throw new Error("Migu invalid signed response");
    const seed = bytes[3], key = MIGU_RESPONSE_KEY;
    decoded = new Uint8Array(bytes.length - 4);
    for (let i = 0; i < decoded.length; i++) decoded[i] = (bytes[i + 4] + seed - key.charCodeAt(i % key.length)) & 0xff;
  }
  return JSON.parse(new TextDecoder().decode(decoded));
}
function miguRateOptions(item) {
  const raw = item?.formatRaw || item?.raw || {};
  const all = [raw.rateFormats, raw.newRateFormats, raw.audioFormats].filter(Array.isArray).reduce((acc, a) => acc.concat(a), []);
  const rank = { HQ: 3, PQ: 2, LQ: 1 }, byKey = new Map();
  for (const f of all) {
    const toneFlag = String(f?.formatType || f?.toneFlag || "").toUpperCase();
    const resourceType = String(f?.resourceType || "");
    if (!rank[toneFlag] || !resourceType) continue;
    byKey.set(`${toneFlag}:${resourceType}`, { toneFlag, resourceType });
  }
  const found = [...byKey.values()].sort((a, b) => rank[b.toneFlag] - rank[a.toneFlag]);
  return found.length ? found.slice(0, 3) : [{ toneFlag: "HQ", resourceType: "2" }, { toneFlag: "PQ", resourceType: "2" }];
}
function miguItems(raw) {
  const root = raw?.data || raw;
  const a = root?.songResultData?.result || raw?.songResultData?.result || root?.songResultData?.resultList || [];
  if (!Array.isArray(a)) return [];
  const flat = [];
  const walk = (arr) => { for (const x of arr) if (Array.isArray(x)) walk(x); else if (x) flat.push(x); };
  walk(a);
  return flat.map(miguCandidate).filter((x) => x?.contentId);
}

const MIXIN_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33,
  9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26,
  17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34,
  44, 52,
];
let biliCache = { buvid3: "", buvid4: "", imgKey: "", subKey: "", ts: 0 };

async function getBiliAuth() {
  const now = Date.now();
  if (biliCache.buvid3 && biliCache.imgKey && now - biliCache.ts < 1800 * 1000) return biliCache;
  const spiRes = await axios.get("https://api.bilibili.com/x/frontend/finger/spi", {
    headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" },
    timeout: 6000,
  });
  const spi = spiRes.data?.data || {};
  const cookie = `buvid3=${spi.b_3 || ""}; buvid4=${spi.b_4 || ""}`;
  const navRes = await axios.get("https://api.bilibili.com/x/web-interface/nav", {
    headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/", Cookie: cookie },
    timeout: 6000,
  });
  const wbi = navRes.data?.data?.wbi_img || {};
  const imgKey = (wbi.img_url || "").split("/").pop().split(".")[0];
  const subKey = (wbi.sub_url || "").split("/").pop().split(".")[0];
  if (!imgKey || !subKey) return null;
  biliCache = { buvid3: spi.b_3 || "", buvid4: spi.b_4 || "", imgKey, subKey, ts: now };
  return biliCache;
}

function signWbi(params, imgKey, subKey) {
  const orig = imgKey + subKey;
  const mixinKey = MIXIN_TAB.map((i) => orig[i] || "").join("").slice(0, 32);
  const wts = Math.floor(Date.now() / 1000);
  const all = { ...params, wts };
  const query = Object.keys(all)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(all[k]).replace(/[!'()*]/g, ""))}`)
    .join("&");
  const w_rid = CryptoJS.MD5(query + mixinKey).toString();
  return `${query}&w_rid=${w_rid}`;
}

function parseBiliDuration(str) {
  if (!str) return 0;
  const parts = String(str).split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

async function fallbackBilibiliAudio(musicItem) {
  try {
    const auth = await getBiliAuth();
    if (!auth) return null;
    const cookie = `buvid3=${auth.buvid3}; buvid4=${auth.buvid4}`;
    const cleanArtist = splitFirstArtist(musicItem.artist || "");
    const keyword = `${normalizeName(musicItem.title)} ${cleanArtist}`.trim();
    const qs = signWbi({ search_type: "video", keyword, page: 1, page_size: 10 }, auth.imgKey, auth.subKey);
    const searchRes = await axios.get(`https://api.bilibili.com/x/web-interface/wbi/search/type?${qs}`, {
      headers: { "User-Agent": UA, Referer: "https://search.bilibili.com/", Cookie: cookie },
      timeout: 7000,
    });
    const rawRes = searchRes.data?.data?.result || [];
    const vGroup = Array.isArray(rawRes) ? rawRes.find((g) => g.result_type === "video") : null;
    const list = vGroup ? (vGroup.data || []) : (Array.isArray(rawRes) ? rawRes : []);
    if (!list.length) return null;

    const strict = isStrictSong(musicItem);
    const dur = Number(musicItem.duration || 0);
    const noise = ["翻唱", "教学", "吉他", "钢琴", "伴奏", "鬼畜", "reaction", "指弹", "弹唱", "二创", "清唱"];
    let best = null, bsc = -999;
    for (const it of list.slice(0, 10)) {
      const rawT = decodeHtml(String(it.title || "").replace(/<[^>]+>/g, ""));
      const d = parseBiliDuration(it.duration);
      if (d < 30 || d > 600) continue;
      if (noise.some((nw) => rawT.toLowerCase().includes(nw) && !String(musicItem.title || "").toLowerCase().includes(nw))) continue;
      let sc = scoreCandidate(rawT, rawT + " " + (it.author || ""), musicItem.title, musicItem.artist, d, dur, false);
      if (rawT.toLowerCase().includes("mv") || rawT.toLowerCase().includes("官方") || rawT.toLowerCase().includes("原版")) sc += 25;
      if (sc > bsc) { bsc = sc; best = it; }
    }
    if (!best || bsc < (strict ? 55 : 10)) return null;

    const bvid = best.bvid;
    const pageRes = await axios.get(`https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`, {
      headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" },
      timeout: 6000,
    });
    const cid = pageRes.data?.data?.[0]?.cid;
    if (!cid) return null;

    for (const fnval of [4048, 1]) {
      const playRes = await axios.get(
        `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=80&fnval=${fnval}&otype=json`,
        { headers: { "User-Agent": UA, Referer: `https://www.bilibili.com/video/${bvid}`, Cookie: cookie }, timeout: 7000 }
      );
      const uData = playRes.data?.data;
      const audios = uData?.dash?.audio || [];
      if (audios.length) {
        audios.sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0));
        const u = audios[0].baseUrl || audios[0].base_url || audios[0].backupUrl?.[0];
        if (u) return { url: u, headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA }, userAgent: UA };
      }
      if (uData?.durl?.[0]?.url) {
        return { url: uData.durl[0].url, headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA }, userAgent: UA };
      }
    }
  } catch (_) {}
  return null;
}

async function searchMusic(query, page) {
  const results = [], seen = new Set();
  const providers = ["netease", "joox"];
  const batches = await Promise.allSettled(providers.map(async (source) => {
    const { data } = await axios.get(AGG_API, {
      params: { use_xbridge3: "true", types: "search", source, name: query, count: 20, pages: page },
      headers: { "User-Agent": UA, Referer: "https://music.gdstudio.xyz/" },
      timeout: 6500,
    });
    if (!Array.isArray(data)) return { source, data: [] };
    return { source, data };
  }));

  for (const batch of batches) {
    if (batch.status !== "fulfilled") continue;
    const source = batch.value.source;
    for (const item of batch.value.data) {
      const title = String(item.name || "").trim();
      const artist = Array.isArray(item.artist) ? item.artist.join(" / ") : item.artist || "未知歌手";
      const album = String(item.album || "");
      if (!title || hasBadVariantMeta(title, artist, album) || isJunkTitle(title, query)) continue;
      const key = makeDedupKey(title, artist);
      if (seen.has(key)) continue;
      seen.add(key);
      const src = item.source || source;
      results.push({
        id: `${src}_${item.id}`,
        title,
        artist,
        album,
        duration: item.duration ? Math.round(Number(item.duration)) : undefined,
        artwork: item.pic_id ? `${AGG_API}?use_xbridge3=true&types=pic&source=${src}&id=${item.pic_id}&size=500` : undefined,
        _source: src,
        _rawId: String(item.id),
        _lyricId: String(item.lyric_id || item.id),
      });
    }
  }

  if (results.length < 8) {
    try {
      const params = new URLSearchParams({
        ua: "Android_migu", version: "5.0.1", text: query, pageNo: String(Math.max(1, page)),
        pageSize: "15", isCopyright: "1", isCorrect: "1", sort: "0",
        searchSwitch: JSON.stringify({ song: 1, album: 0, singer: 0, tagSong: 0, mvSong: 0, songlist: 0, bestShow: 1 }),
      });
      for (const endpoint of [
        `${MIGU_BASE}/MIGUM3.0/v1.0/content/search_all.do?${params}`,
        `${MIGU_BASE}/MIGUM2.0/v1.0/content/search_all.do?${params}`,
        `https://c.musicapp.migu.cn/v1.0/content/search_all.do?${params}`,
      ]) {
        try {
          const items = miguItems(await miguJson(endpoint));
          if (items.length) {
            for (const item of items) {
              if (!item.contentId || !item.title || hasBadVariantMeta(item.title, item.artist, item.album) || isJunkTitle(item.title, query)) continue;
              const key = makeDedupKey(item.title, item.artist || "未知歌手");
              if (seen.has(key)) continue;
              seen.add(key);
              results.push({
                id: `migu_${item.contentId}`, title: item.title, artist: item.artist || "未知歌手", album: item.album || "",
                duration: item.duration || undefined, artwork: item.cover || undefined,
                _source: "migu", _rawId: item.contentId, _copyrightId: item.copyrightId, _lyricId: item.contentId,
              });
            }
            break;
          }
        } catch (_) {}
      }
    } catch (_) {}
  }
  return { isEnd: results.length < 15, data: results };
}

async function resolveFromAgg(source, rawId, brList, durationSec) {
  for (const br of brList) {
    try {
      const { data } = await axios.get(AGG_API, {
        params: { use_xbridge3: "true", types: "url", source, id: rawId, br },
        headers: { "User-Agent": UA, Referer: "https://music.gdstudio.xyz/" },
        timeout: 6500,
      });
      if (data && data.url && (await isValidAudioUrl(data.url, data.size, durationSec))) {
        return { url: data.url };
      }
    } catch (_) {}
  }
  return null;
}

async function tryKuwoDirect(musicItem, quality) {
  const cleanArtist = splitFirstArtist(musicItem.artist || "");
  const kw = `${normalizeName(musicItem.title)} ${cleanArtist}`.trim();
  const dur = Number(musicItem.duration || 0);
  const strict = isStrictSong(musicItem);
  const br = quality === "low" ? "128kmp3" : (quality === "standard" ? "192kmp3" : "320kmp3");

  const { data } = await axios.get("https://search.kuwo.cn/r.s", {
    params: { all: kw, ft: "music", itemset: "web_2013", client: "kt", pn: 0, rn: 8, rformat: "json", encoding: "utf8" },
    headers: { "User-Agent": UA },
    timeout: 5500,
  });
  const list = [];
  for (const blk of String(data || "").split(/\}\s*,\s*\{/)) {
    const rid = (blk.match(/MUSIC_(\d+)/) || [])[1];
    if (!rid) continue;
    const nm = decodeHtml((blk.match(/['"]?NAME['"]?\s*:\s*['"]([^'"]*)['"]/) || [])[1] || "");
    const ar = decodeHtml((blk.match(/['"]?ARTIST['"]?\s*:\s*['"]([^'"]*)['"]/) || [])[1] || "");
    const al = decodeHtml((blk.match(/['"]?ALBUM['"]?\s*:\s*['"]([^'"]*)['"]/) || [])[1] || "");
    const d = Number((blk.match(/['"]?DURATION['"]?\s*:\s*['"]?(\d+)['"]?/) || [])[1] || 0);
    const sc = scoreCandidate(nm, ar, musicItem.title, musicItem.artist, d, dur, strict, al);
    if (sc >= (strict ? 80 : 15)) list.push({ rid, sc });
  }
  list.sort((a, b) => b.sc - a.sc);
  for (const item of list.slice(0, strict ? 3 : 2)) {
    try {
      const r2 = await axios.get("https://mobi.kuwo.cn/mobi.s", {
        params: { f: "web", user: 0, source: "kwplayer_ar_8.5.5.0_apk_keluze.apk", type: "convert_url_with_sign", rid: item.rid, br },
        headers: { "User-Agent": UA, Referer: "https://www.kuwo.cn/" },
        timeout: 5000,
      });
      const txt = String(r2.data || ""), m = txt.match(/url=(http[^\s\r\n]+)/);
      const u = m ? m[1] : (r2.data?.data?.url || "");
      if (u && !txt.includes("ekey=") && (await isValidAudioUrl(u, 0, dur, { Referer: "https://www.kuwo.cn/" }))) {
        return { url: u, headers: { Referer: "https://www.kuwo.cn/", "User-Agent": UA } };
      }
    } catch (_) {}
  }
  throw new Error("kw_fail");
}

async function tryVKeysDirect(musicItem) {
  const cleanArtist = splitFirstArtist(musicItem.artist || "");
  const kw = `${normalizeName(musicItem.title)} ${cleanArtist}`.trim();
  const dur = Number(musicItem.duration || 0);
  const strict = isStrictSong(musicItem);
  const bases = ["https://api.vkeys.cn/v2/music", "https://luoyue-api-cf.vincentzyu233.cn/v2/music"];

  return raceFirst(bases.map(async (base) => {
    const r = await axios.get(`${base}/tencent`, { params: { word: kw, n: 1, quality: 3 }, headers: { "User-Agent": UA }, timeout: 5500 });
    const d = r.data?.data;
    if (!d || !d.url || d.ekey || d.url.includes("panspace.kuwo.cn") || d.url.includes("/404")) throw new Error("vk_empty");
    const vkDur = parseCnInterval(d.interval);
    if (dur >= 90 && vkDur > 0 && (vkDur <= 65 || vkDur < dur * 0.72)) throw new Error("vk_30s");
    const sc = scoreCandidate(strict ? String(d.song || "") : (d.song || musicItem.title), strict ? String(d.singer || "") : (d.singer || musicItem.artist), musicItem.title, musicItem.artist, vkDur, dur, strict, d.album || "");
    if (sc < (strict ? 80 : 15)) throw new Error("vk_mismatch");
    return { url: d.url };
  }));
}

async function tryGDPlatform(musicItem, plat, brList) {
  const cleanArtist = splitFirstArtist(musicItem.artist || "");
  const kw = `${normalizeName(musicItem.title)} ${cleanArtist}`.trim();
  const dur = Number(musicItem.duration || 0);
  const strict = isStrictSong(musicItem);
  const { data } = await axios.get(AGG_API, {
    params: { use_xbridge3: "true", types: "search", source: plat, name: kw, count: 6, pages: 1 },
    headers: { "User-Agent": UA, Referer: "https://music.gdstudio.xyz/" },
    timeout: 6000,
  });
  if (!Array.isArray(data) || !data.length) throw new Error("gd_empty");
  let best = null, bsc = -100;
  for (const item of data) {
    const sc = scoreCandidate(item.name, item.artist, musicItem.title, musicItem.artist, Number(item.duration || 0), dur, strict, item.album || "");
    if (sc > bsc) { bsc = sc; best = item; }
  }
  if (!best || bsc < (strict ? 80 : 20)) throw new Error("gd_mismatch");
  const hit = await resolveFromAgg(plat, String(best.id), brList, dur);
  if (!hit) throw new Error("gd_url_fail");
  return hit;
}

async function tryMiguDirect(musicItem) {
  try {
    const title = String(musicItem.title || "").trim();
    const artist = splitFirstArtist(musicItem.artist || "");
    if (!title || !artist) return null;
    const curatedId = Object.entries(MIGU_CURATED).find(([k]) => {
      const [t, a] = k.split("|");
      return miguNorm(t) === miguNorm(title) && miguNorm(a) === miguNorm(artist);
    })?.[1] || ((musicItem._source === "migu" && /^\d+$/.test(String(musicItem._rawId || ""))) ? String(musicItem._rawId) : "");
    const candidates = [];
    if (curatedId) {
      for (const endpoint of [
        `${MIGU_BASE}/MIGUM2.0/v1.0/content/queryById.do?resourceType=2&contentId=${encodeURIComponent(curatedId)}`,
        `${MIGU_BASE}/MIGUM2.0/v2.0/content/querySongBySongId.do?contentId=${encodeURIComponent(curatedId)}`,
      ]) {
        try {
          const raw = await miguJson(endpoint), root = raw?.data || raw;
          const item = root?.resource?.[0] || raw?.resource?.[0] || root?.resource || root?.songInfo || root?.song;
          const candidate = miguCandidate(item);
          if (candidate) { candidates.push(candidate); break; }
        } catch (_) {}
      }
    }
    if (!candidates.length || !candidates.some((x) => x.artist && x.title)) {
      const params = new URLSearchParams({
        ua: "Android_migu", version: "5.0.1", text: `${artist} ${title}`, pageNo: "1", pageSize: "12",
        isCopyright: "1", isCorrect: "1", sort: "0",
        searchSwitch: JSON.stringify({ song: 1, album: 0, singer: 0, tagSong: 0, mvSong: 0, songlist: 0, bestShow: 1 }),
      });
      for (const endpoint of [
        `${MIGU_BASE}/MIGUM3.0/v1.0/content/search_all.do?${params}`,
        `${MIGU_BASE}/MIGUM2.0/v1.0/content/search_all.do?${params}`,
        `https://c.musicapp.migu.cn/v1.0/content/search_all.do?${params}`,
      ]) {
        try {
          const found = miguItems(await miguJson(endpoint));
          if (found.length) { candidates.push(...found); break; }
        } catch (_) {}
      }
    }
    const strict = isStrictSong(musicItem);
    const dur = Number(musicItem.duration || 0);
    const hit = candidates
      .map((c) => ({ item: c, sc: scoreCandidate(c.title, c.artist, musicItem.title, musicItem.artist, c.duration, dur, strict, c.album) }))
      .filter((x) => x.sc >= (strict ? 80 : 45))
      .sort((a, b) => b.sc - a.sc)[0]?.item;
    if (!hit?.contentId) return null;

    let detail = hit;
    if (!detail.copyrightId) {
      for (const endpoint of [
        `${MIGU_BASE}/MIGUM2.0/v1.0/content/queryById.do?resourceType=2&contentId=${encodeURIComponent(hit.contentId)}`,
        `${MIGU_BASE}/MIGUM2.0/v2.0/content/querySongBySongId.do?contentId=${encodeURIComponent(hit.contentId)}`,
      ]) {
        try {
          const raw = await miguJson(endpoint), root = raw?.data || raw;
          const x = miguCandidate(root?.resource?.[0] || raw?.resource?.[0] || root?.resource || root?.songInfo || root?.song);
          if (x?.copyrightId) { detail = { ...hit, ...x, formatRaw: hit.raw, raw: x.raw || hit.raw, contentId: x.contentId || hit.contentId }; break; }
        } catch (_) {}
      }
    }
    if (!detail.copyrightId) return null;
    for (const format of miguRateOptions(detail)) {
      const params = new URLSearchParams({
        contentId: String(detail.contentId), copyrightId: String(detail.copyrightId),
        resourceType: format.resourceType, netType: "01", toneFlag: format.toneFlag,
        scene: "", lowerQualityContentId: String(detail.contentId),
      });
      try {
        const raw = await miguSignedJson(`https://c.musicapp.migu.cn/strategy/listen-url/h5/v2.4?${params}`);
        const data = raw?.data || raw?.result || raw;
        const url = data?.url || data?.listenUrl || data?.playUrl || data?.audioUrl || data?.songUrl || data?.urlInfo?.url;
        if (typeof url === "string" && /^https?:\/\//i.test(url) && (await isValidAudioUrl(url, 0, dur, { Referer: "https://h5.nf.migu.cn/" }))) {
          return { url, headers: { Referer: "https://h5.nf.migu.cn/", Origin: "https://h5.nf.migu.cn/", "User-Agent": UA } };
        }
      } catch (_) {}
    }
    for (const format of miguRateOptions(detail).slice(0, 2)) {
      const params = new URLSearchParams({ scene: "", netType: "01", resourceType: format.resourceType, copyrightId: String(detail.copyrightId), contentId: String(detail.contentId), toneFlag: format.toneFlag });
      try {
        const raw = await miguJson(`${MIGU_BASE}/MIGUM3.0/strategy/pc/listen/v1.0?${params}`), data = raw?.data || raw;
        const url = data?.url || data?.listenUrl || data?.playUrl || data?.audioUrl || data?.songUrl;
        if (typeof url === "string" && /^https?:\/\//i.test(url) && (await isValidAudioUrl(url, 0, dur, { Referer: "https://music.migu.cn/" }))) {
          return { url, headers: { Referer: "https://h5.nf.migu.cn/", Origin: "https://h5.nf.migu.cn/", "User-Agent": UA } };
        }
      } catch (_) {}
    }
  } catch (_) {}
  return null;
}

function cleanLrcText(raw) {
  if (!raw) return "";
  return String(raw)
    .replace(/^\uFEFF/, "")
    .replace(/\[(\d{1,3}:\d{2}):(\d{1,3})\]/g, "[$1.$2]")
    .split(/\r?\n/)
    .filter((l) => !["作词 :", "作曲 :", "编曲 :", "制作人 :", "作词:", "作曲:", "作词：", "作曲：", "QQ音乐", "网易云"].some((k) => l.includes(k)))
    .join("\n")
    .trim();
}

function isSyncedLrc(raw) {
  return /^\s*\[\d{1,3}:\d{2}(?:[.:]\d{1,3})?\]/m.test(String(raw || ""));
}

async function fetchNeteasePlaylistHydrated(pid, limit = 150) {
  const { data } = await axios.get("https://music.163.com/api/v6/playlist/detail", {
    params: { id: pid, n: Math.min(limit, 500) },
    headers: { "User-Agent": UA, Referer: "https://music.163.com/", Cookie: "os=pc; appver=2.9.7" },
    timeout: 8000,
  });
  const pl = data?.playlist || {};
  let rawTracks = Array.isArray(pl.tracks) ? pl.tracks.slice() : [];
  const allIds = Array.isArray(pl.trackIds) ? pl.trackIds.map((x) => x.id).filter(Boolean) : [];
  if (allIds.length > rawTracks.length && rawTracks.length < limit) {
    const have = new Set(rawTracks.map((t) => String(t.id)));
    const missing = allIds.slice(0, limit).filter((tid) => !have.has(String(tid)));
    for (let i = 0; i < missing.length; i += 200) {
      const chunk = missing.slice(i, i + 200);
      try {
        const body = "c=" + encodeURIComponent(JSON.stringify(chunk.map((tid) => ({ id: tid }))));
        const sd = await axios.post("https://music.163.com/api/v3/song/detail", body, {
          headers: { "User-Agent": UA, Referer: "https://music.163.com/", "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 8000,
        });
        for (const s of sd.data?.songs || []) {
          if (!have.has(String(s.id))) {
            have.add(String(s.id));
            rawTracks.push(s);
          }
        }
      } catch (_) {}
    }
  }
  return {
    pl,
    tracks: rawTracks.slice(0, limit).map((t) => ({
      id: `netease_${t.id}`,
      title: t.name,
      artist: (t.ar || t.artists || []).map((a) => a.name).join(" / "),
      album: (t.al || t.album)?.name || "",
      artwork: (t.al || t.album)?.picUrl,
      duration: Math.round((t.dt || t.duration || 0) / 1000),
      _source: "netease",
      _rawId: String(t.id),
      _lyricId: String(t.id),
    })),
  };
}

module.exports = {
  platform: "MusicHub·全网聚合",
  author: "MusicHub",
  version: "1.0.7",
  cacheControl: "no-cache",
  supportedSearchType: ["music"],

  async search(query, page, type) {
    if (type !== "music") return { isEnd: true, data: [] };
    return await searchMusic(query, page);
  },

  async getMediaSource(musicItem, quality) {
    const brList = qualityToBrList(quality);
    const idStr = String(musicItem.id || "");
    const [parsedSource, parsedId] = idStr.includes("_")
      ? [idStr.split("_")[0], idStr.split("_").slice(1).join("_")]
      : [musicItem._source || "netease", musicItem._rawId || idStr];
    const dur = Number(musicItem.duration || 0);
    const strict = isStrictSong(musicItem);

    const racers = [
      tryKuwoDirect(musicItem, quality),
      tryVKeysDirect(musicItem),
      tryGDPlatform(musicItem, "joox", brList),
      tryMiguDirect(parsedSource === "migu" ? { ...musicItem, _source: "migu", _rawId: parsedId } : musicItem),
    ];

    if (parsedSource === "netease" || parsedSource === "joox" || parsedSource === "kuwo") {
      if (!strict) {
        racers.push(resolveFromAgg(parsedSource, parsedId, brList, dur));
      } else {
        racers.push(tryGDPlatform(musicItem, "netease", brList));
      }
    }

    try {
      return await raceFirst(racers);
    } catch (_) {}

    const biliHit = await fallbackBilibiliAudio(musicItem);
    if (biliHit) return biliHit;

    throw new Error("全网多源解析均失败或仅剩试听片段");
  },

  async getLyric(musicItem) {
    const idStr = String(musicItem.id || "");
    const rawId = idStr.includes("_") ? idStr.split("_").slice(1).join("_") : idStr;
    const src = musicItem._source || (idStr.includes("_") ? idStr.split("_")[0] : "netease");
    const cleanTitle = String(musicItem.title || "").trim();
    const cleanArtist = splitFirstArtist(musicItem.artist || "");
    const kw = `${normalizeName(cleanTitle)} ${cleanArtist}`.trim();
    const dur = Number(musicItem.duration || 0);
    const candidates = [];

    const pushLrc = (lrc, trans = "") => {
      const cLrc = cleanLrcText(lrc), cTrans = cleanLrcText(trans);
      if (!cLrc || cLrc.length <= 10) return;
      candidates.push({ rawLrc: cLrc, translation: cTrans || undefined, rank: isSyncedLrc(cLrc) ? (cTrans ? 4 : 3) : (cTrans ? 2 : 1) });
    };

    const tasks = [];
    if (src === "netease" && /^\d+$/.test(rawId)) {
      tasks.push(axios.get("https://music.163.com/api/song/lyric", {
        params: { id: rawId, lv: -1, kv: -1, tv: -1 },
        headers: { "User-Agent": UA, Referer: "https://music.163.com/" },
        timeout: 4500,
      }).then((r) => { if (r.data?.lrc?.lyric) pushLrc(r.data.lrc.lyric, r.data.tlyric?.lyric || ""); }).catch(() => {}));
    }

    if (["netease", "joox", "kugou"].includes(src)) {
      tasks.push(axios.get(AGG_API, {
        params: { use_xbridge3: "true", types: "lyric", source: src, id: musicItem._lyricId || rawId },
        headers: { "User-Agent": UA, Referer: "https://music.gdstudio.xyz/" },
        timeout: 4500,
      }).then((r) => { if (r.data?.lyric) pushLrc(r.data.lyric, r.data.tlyric || ""); }).catch(() => {}));
    }

    tasks.push((async () => {
      const sr = await axios.get("https://api.vkeys.cn/v2/music/tencent", { params: { word: kw || cleanTitle, n: 1 }, headers: { "User-Agent": UA }, timeout: 4000 });
      const d = sr.data?.data, mid = d?.mid || d?.id;
      if (!mid || scoreCandidate(d.song || cleanTitle, d.singer || musicItem.artist, cleanTitle, musicItem.artist, parseCnInterval(d.interval), dur, false) < 15) return;
      const lr = await axios.get("https://api.vkeys.cn/v2/music/tencent/lyric", { params: { mid }, headers: { "User-Agent": UA }, timeout: 4000 });
      if (lr.data?.data?.lrc) pushLrc(lr.data.data.lrc, lr.data.data.trans || "");
    })().catch(() => {}));

    tasks.push((async () => {
      const sr = await axios.get("https://search.kuwo.cn/r.s", {
        params: { all: kw || cleanTitle, ft: "music", itemset: "web_2013", client: "kt", pn: 0, rn: 5, rformat: "json", encoding: "utf8" },
        headers: { "User-Agent": UA }, timeout: 4000,
      });
      let rid = "";
      for (const blk of String(sr.data || "").split(/\}\s*,\s*\{/)) {
        const m = blk.match(/MUSIC_(\d+)/);
        if (m) { rid = m[1]; break; }
      }
      if (!rid) return;
      const lr = await axios.get("https://m.kuwo.cn/newh5/singles/songinfoandlrc", { params: { musicId: rid }, headers: { "User-Agent": UA }, timeout: 4000 });
      const list = lr.data?.data?.lrclist;
      if (Array.isArray(list) && list.length) {
        pushLrc(list.map((row) => `[${String(Math.floor(Number(row.time || 0) / 60)).padStart(2, "0")}:${(Number(row.time || 0) % 60).toFixed(2).padStart(5, "0")}]${row.lineLyric || ""}`).join("\n"));
      }
    })().catch(() => {}));

    tasks.push((async () => {
      const r = await axios.get("https://lrclib.net/api/get", { params: { track_name: normalizeName(cleanTitle), artist_name: cleanArtist }, timeout: 4500 });
      if (r.data?.syncedLyrics || r.data?.plainLyrics) { pushLrc(r.data.syncedLyrics || r.data.plainLyrics); return; }
      const sr = await axios.get("https://lrclib.net/api/search", { params: { q: kw || cleanTitle }, timeout: 4500 });
      if (Array.isArray(sr.data) && sr.data[0]) pushLrc(sr.data[0].syncedLyrics || sr.data[0].plainLyrics || "");
    })().catch(() => {}));

    await Promise.allSettled(tasks);
    if (!candidates.length) return { rawLrc: "" };
    candidates.sort((a, b) => b.rank - a.rank);
    return { rawLrc: candidates[0].rawLrc, translation: candidates[0].translation };
  },

  async getTopLists() {
    return NETEASE_TOPLISTS;
  },

  async getTopListDetail(topListItem) {
    const { pl, tracks } = await fetchNeteasePlaylistHydrated(topListItem.id, 100);
    return {
      isEnd: true,
      topListItem: { ...topListItem, coverImg: pl.coverImgUrl, description: pl.description || topListItem.description },
      musicList: tracks,
    };
  },

  async importMusicSheet(urlLike) {
    const match = String(urlLike).match(/(?:id=|playlist\/)(\d+)/) || String(urlLike).match(/^(\d{6,12})$/);
    if (!match) return [];
    const { tracks } = await fetchNeteasePlaylistHydrated(match[1], 200);
    return tracks;
  },
};
