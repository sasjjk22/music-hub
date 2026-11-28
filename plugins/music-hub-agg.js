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

const JUNK_WORDS = [
  "dj版",
  "dj舞曲",
  "伴奏",
  "喊麦",
  "铃声",
  "广场舞",
  "纯音乐版",
  "卡拉ok",
  "消音版",
  "翻唱",
  "cover",
  "吉他版",
  "钢琴版",
  "弹唱",
  "纯音乐",
  "instrumental",
  "钢琴曲",
  "演奏版",
  "背景音乐",
  "轻音乐",
  "伴奏版",
];

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

function isJunkTitle(title, query) {
  const t = (title || "").toLowerCase();
  const q = (query || "").toLowerCase();
  return JUNK_WORDS.some((w) => t.includes(w) && !q.includes(w));
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

function normalizeName(s) {
  const raw = String(s || "").toLowerCase().trim();
  const stripped = raw.replace(/[\(（\[【].*?[\)）\]】]/g, "").replace(/\s+/g, " ").trim();
  return stripped || raw.replace(/[\(\)\[\]（）【】]/g, "").replace(/\s+/g, " ").trim();
}

function makeDedupKey(title, artist) {
  const raw = String(title || "").toLowerCase().trim();
  const variants = [];
  const segs = raw.match(/[\(（\[【]([^\)）\]】]+)[\)）\]】]/g);
  if (segs) {
    for (const seg of segs) {
      if (/(live|现场|演唱会|remix|dj|伴奏|纯音乐|钢琴|吉他|弹唱|翻唱|cover|加速|降调|night version)/i.test(seg)) {
        variants.push(seg.replace(/[\(\)\[\]（）【】]/g, "").trim());
      }
    }
  }
  const tKey = `${normalizeName(raw)}${variants.length ? " " + variants.join(" ") : ""}`.trim();
  const firstArtist = String(artist || "").split(/[/,、]|\s+&\s+/)[0];
  return `${tKey}|${normalizeName(firstArtist)}`;
}

async function isValidAudioUrl(url, sizeKb, durationSec, br = "320", headers = {}) {
  if (!url || typeof url !== "string" || !url.startsWith("http")) return false;
  if (url.includes("panspace.kuwo.cn") || url.includes("/404")) return false;

  const minKb = durationSec >= 90 ? Math.max(320, Math.round(durationSec * 4.5)) : 0;
  if (sizeKb && minKb > 0 && Number(sizeKb) < minKb) {
    return false;
  }

  try {
    const res = await axios.get(url, {
      headers: { Range: "bytes=0-511", "User-Agent": UA, ...headers },
      timeout: 5500,
      responseType: "arraybuffer",
      validateStatus: () => true,
    });
    if (res.status !== 200 && res.status !== 206) return false;
    const ct = String(res.headers["content-type"] || "").toLowerCase();
    if (ct.includes("text/html") || ct.includes("application/json")) return false;

    const cr = String(res.headers["content-range"] || "");
    const m = cr.match(/\/(\d+)/);
    const total = m ? Number(m[1]) : Number(res.headers["content-length"] || 0);
    if (total > 0 && minKb > 0 && total < minKb * 1024) {
      return false;
    }
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
  const text = new TextDecoder().decode(decoded);
  return JSON.parse(text);
}
function miguRateOptions(item) {
  const raw = item?.formatRaw || item?.raw || {};
  const all = [raw.rateFormats, raw.newRateFormats, raw.audioFormats].filter(Array.isArray).flat();
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
  return Array.isArray(a) ? a.flat(Infinity).map(miguCandidate).filter((x) => x?.contentId) : [];
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
  if (biliCache.buvid3 && biliCache.imgKey && now - biliCache.ts < 1800 * 1000) {
    return biliCache;
  }
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

async function fallbackBilibiliAudio(title, artist, targetDuration) {
  try {
    const auth = await getBiliAuth();
    if (!auth) return null;
    const cookie = `buvid3=${auth.buvid3}; buvid4=${auth.buvid4}`;
    const cleanArtist = (artist || "").split(/[/,、]|\s+&\s+/)[0].trim();
    const keyword = `${normalizeName(title)} ${cleanArtist}`.trim();
    const qs = signWbi(
      { search_type: "video", keyword, page: 1, page_size: 8 },
      auth.imgKey,
      auth.subKey
    );
    const searchRes = await axios.get(
      `https://api.bilibili.com/x/web-interface/wbi/search/type?${qs}`,
      {
        headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/", Cookie: cookie },
        timeout: 7000,
      }
    );
    const list = searchRes.data?.data?.result || [];
    if (!list.length) return null;

    let picked = list[0];
    if (targetDuration > 0) {
      const best = list.find((item) => {
        const d = parseBiliDuration(item.duration);
        return d > 30 && Math.abs(d - targetDuration) <= 15;
      });
      if (best) picked = best;
    }

    const bvid = picked.bvid;
    const pageRes = await axios.get(
      `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`,
      { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" }, timeout: 6000 }
    );
    const cid = pageRes.data?.data?.[0]?.cid;
    if (!cid) return null;

    const playRes = await axios.get(
      `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=80&fnval=4048&otype=json`,
      { headers: { "User-Agent": UA, Referer: `https://www.bilibili.com/video/${bvid}`, Cookie: cookie }, timeout: 7000 }
    );
    const audios = playRes.data?.data?.dash?.audio || [];
    if (audios.length) {
      audios.sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0));
      for (const stream of audios) {
        const u = stream.baseUrl || stream.base_url || (stream.backupUrl && stream.backupUrl[0]);
        if (u) {
          return { url: u, headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA }, userAgent: UA };
        }
      }
    }

    const mp4Res = await axios.get(
      `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=64&fnval=1&otype=json`,
      { headers: { "User-Agent": UA, Referer: `https://www.bilibili.com/video/${bvid}`, Cookie: cookie }, timeout: 7000 }
    );
    const durl = mp4Res.data?.data?.durl?.[0]?.url;
    if (durl) {
      return { url: durl, headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA }, userAgent: UA };
    }
  } catch (_) {}
  return null;
}

async function searchMusic(query, page) {
  const results = [], seen = new Set();
  const providers = ["netease", "joox"];
  const batches = await Promise.allSettled(providers.map(async (source) => {
    const { data } = await axios.get(AGG_API, {
      params: { types: "search", source, name: query, count: 20, pages: page },
      headers: { "User-Agent": UA },
      timeout: 6500,
    });
    if (!Array.isArray(data)) return { source, data: [] };
    return { source, data };
  }));

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    if (batch.status !== "fulfilled") continue;
    const source = batch.value.source;
    for (const item of batch.value.data) {
      const title = String(item.name || "").trim();
      const artist = Array.isArray(item.artist) ? item.artist.join(" / ") : item.artist || "未知歌手";
      const album = String(item.album || "");
      const meta = `${title} ${artist} ${album}`.toLowerCase();
      if (!title || JUNK_WORDS.some((w) => meta.includes(w) && !String(query || "").toLowerCase().includes(w))) continue;
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
        artwork: item.pic_id ? `${AGG_API}?types=pic&source=${src}&id=${item.pic_id}&size=500` : undefined,
        _source: src,
        _rawId: String(item.id),
        _lyricId: String(item.lyric_id || item.id),
      });
    }
  }

  if (results.length < 8) try {
    const params = new URLSearchParams({ ua: "Android_migu", version: "5.0.1", text: query, pageNo: String(Math.max(1, page)), pageSize: "15", isCopyright: "1", isCorrect: "1", sort: "0", searchSwitch: JSON.stringify({ song: 1, album: 0, singer: 0, tagSong: 0, mvSong: 0, songlist: 0, bestShow: 1 }) });
    const endpoints = [
      `${MIGU_BASE}/MIGUM3.0/v1.0/content/search_all.do?${params}`,
      `${MIGU_BASE}/MIGUM2.0/v1.0/content/search_all.do?${params}`,
      `https://c.musicapp.migu.cn/v1.0/content/search_all.do?${params}`,
    ];
    let items = [];
    for (const endpoint of endpoints) {
      try { items = miguItems(await miguJson(endpoint)); if (items.length) break; } catch (_) {}
    }
    for (const item of items) {
      const meta = `${item.title} ${item.artist} ${item.album}`.toLowerCase();
      if (!item.contentId || !item.title || JUNK_WORDS.some((w) => meta.includes(w) && !String(query || "").toLowerCase().includes(w))) continue;
      const key = makeDedupKey(item.title, item.artist || "未知歌手");
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({
        id: `migu_${item.contentId}`, title: item.title, artist: item.artist || "未知歌手", album: item.album || "",
        duration: item.duration || undefined, artwork: item.cover || undefined,
        _source: "migu", _rawId: item.contentId, _copyrightId: item.copyrightId, _lyricId: item.contentId,
      });
    }
  } catch (_) {}
  return { isEnd: results.length < 15, data: results };
}

async function resolveFromAgg(source, rawId, brList, durationSec) {
  for (const br of brList) {
    try {
      const { data } = await axios.get(AGG_API, {
        params: { types: "url", source, id: rawId, br },
        headers: { "User-Agent": UA },
        timeout: 7000,
      });
      if (data && data.url && (await isValidAudioUrl(data.url, data.size, durationSec, br))) {
        return { url: data.url };
      }
    } catch (_) {}
  }
  return null;
}

async function tryMiguDirect(musicItem) {
  try {
    const title = String(musicItem.title || "").trim();
    const artist = String(musicItem.artist || "").split(/[/,、]|\s+&\s+/)[0].trim();
    if (!title || !artist) return null;
    const curatedId = Object.entries(MIGU_CURATED).find(([k]) => {
      const [t, a] = k.split("|");
      return miguNorm(t) === miguNorm(title) && miguNorm(a) === miguNorm(artist);
    })?.[1] || ((musicItem._source === "migu" && /^\d+$/.test(String(musicItem._rawId || ""))) ? String(musicItem._rawId) : "");
    let candidates = [];
    if (curatedId) {
      for (const endpoint of [
        `${MIGU_BASE}/MIGUM2.0/v1.0/content/queryById.do?resourceType=2&contentId=${encodeURIComponent(curatedId)}`,
        `${MIGU_BASE}/MIGUM2.0/v2.0/content/querySongBySongId.do?contentId=${encodeURIComponent(curatedId)}`,
      ]) {
        try {
          const raw = await miguJson(endpoint);
          const root = raw?.data || raw;
          const item = root?.resource?.[0] || raw?.resource?.[0] || root?.resource || root?.songInfo || root?.song;
          const candidate = miguCandidate(item);
          if (candidate) { candidates.push(candidate); break; }
        } catch (_) {}
      }
    }
    if (!candidates.length || !candidates.some((x) => x.artist && x.title)) {
      const params = new URLSearchParams({ ua: "Android_migu", version: "5.0.1", text: `${artist} ${title}`, pageNo: "1", pageSize: "12", isCopyright: "1", isCorrect: "1", sort: "0", searchSwitch: JSON.stringify({ song: 1, album: 0, singer: 0, tagSong: 0, mvSong: 0, songlist: 0, bestShow: 1 }) });
      const searchUrls = [
        `${MIGU_BASE}/MIGUM3.0/v1.0/content/search_all.do?${params}`,
        `${MIGU_BASE}/MIGUM2.0/v1.0/content/search_all.do?${params}`,
        `https://c.musicapp.migu.cn/v1.0/content/search_all.do?${params}`,
      ];
      for (const endpoint of searchUrls) {
        try {
          const found = miguItems(await miguJson(endpoint));
          if (found.length) { candidates.push(...found); break; }
        } catch (_) {}
      }
    }
    const bad = /(纯音乐|纯钢琴|instrumental|钢琴曲|伴奏|翻唱|cover|吉他版|弹唱|演奏版|dj版)/i;
    const hit = candidates.find((x) => {
      if (bad.test(`${x.title} ${x.album}`)) return false;
      if (miguNorm(x.title) !== miguNorm(title)) return false;
      const a = miguNorm(x.artist), wanted = miguNorm(artist);
      if (!a || !(a.includes(wanted) || wanted.includes(a) || (wanted.includes("周杰伦") && /(周杰伦|jaychou|周董)/i.test(x.artist)))) return false;
      const expected = Number(musicItem.duration || 0), actual = Number(x.duration || 0);
      if (expected >= 90 && actual > 0 && (actual <= 65 || actual < expected * 0.72)) return false;
      return true;
    });
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
        if (typeof url === "string" && /^https?:\/\//i.test(url)) return { url, headers: { Referer: "https://h5.nf.migu.cn/", Origin: "https://h5.nf.migu.cn/", "User-Agent": UA } };
      } catch (_) {}
    }
    for (const format of miguRateOptions(detail).slice(0, 2)) {
      const params = new URLSearchParams({ scene: "", netType: "01", resourceType: format.resourceType, copyrightId: String(detail.copyrightId), contentId: String(detail.contentId), toneFlag: format.toneFlag });
      try {
        const raw = await miguJson(`${MIGU_BASE}/MIGUM3.0/strategy/pc/listen/v1.0?${params}`), data = raw?.data || raw;
        const url = data?.url || data?.listenUrl || data?.playUrl || data?.audioUrl || data?.songUrl;
        if (typeof url === "string" && /^https?:\/\//i.test(url)) return { url, headers: { Referer: "https://h5.nf.migu.cn/", Origin: "https://h5.nf.migu.cn/", "User-Agent": UA } };
      } catch (_) {}
    }
  } catch (_) {}
  return null;
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
  version: "1.0.6",
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

    const strictJay = /(周杰伦|jay\s*chou|周董)/i.test(String(musicItem.artist || ""));
    if (strictJay) {
      const miguHit = await tryMiguDirect(parsedSource === "migu" ? { ...musicItem, _source: "migu", _rawId: parsedId } : musicItem);
      if (miguHit) return miguHit;
    }

    if (parsedSource === "migu") {
      if (!strictJay) {
        const miguHit = await tryMiguDirect({ ...musicItem, _source: "migu", _rawId: parsedId });
        if (miguHit) return miguHit;
      }
    } else {
      const direct = await resolveFromAgg(parsedSource, parsedId, brList, dur);
      if (direct) return direct;
    }

    const cleanArtist = (musicItem.artist || "").split(/[/,、]|\s+&\s+/)[0].trim();
    const keyword = `${normalizeName(musicItem.title)} ${cleanArtist}`.trim();
    const fallbackSources = ["netease", "kuwo", "joox"].filter((s) => s !== parsedSource);

    for (const src of fallbackSources) {
      try {
        const { data } = await axios.get(AGG_API, {
          params: { types: "search", source: src, name: keyword, count: 5, pages: 1 },
          headers: { "User-Agent": UA },
          timeout: 6000,
        });
        if (!Array.isArray(data) || !data.length) continue;
        const candidate = data.find((x) => {
          const a = Array.isArray(x.artist) ? x.artist.join(" ") : String(x.artist || "");
          const meta = `${x.name || ""} ${a} ${x.album || ""}`.toLowerCase();
          const wanted = normalizeName(musicItem.artist || "");
          const actual = normalizeName(a);
          return !JUNK_WORDS.some((w) => meta.includes(w)) && !isJunkTitle(x.name, musicItem.title) &&
            (!wanted || !actual || actual.includes(wanted) || wanted.includes(actual));
        });
        if (!candidate) continue;
        const hit = await resolveFromAgg(src, String(candidate.id), brList, dur);
        if (hit) return hit;
      } catch (_) {}
    }

    const miguHit = await tryMiguDirect(musicItem);
    if (miguHit) return miguHit;

    const biliHit = await fallbackBilibiliAudio(musicItem.title, musicItem.artist, dur);
    if (biliHit) return biliHit;

    throw new Error("全网多源解析均失败或仅剩试听片段");
  },

  async getLyric(musicItem) {
    const idStr = String(musicItem.id || "");
    const rawId = idStr.includes("_") ? idStr.split("_").slice(1).join("_") : idStr;
    const src = musicItem._source || (idStr.includes("_") ? idStr.split("_")[0] : "netease");

    if (src === "netease") {
      try {
        const { data } = await axios.get("https://music.163.com/api/song/lyric", {
          params: { id: rawId, lv: -1, kv: -1, tv: -1 },
          headers: { "User-Agent": UA, Referer: "https://music.163.com/" },
          timeout: 6000,
        });
        if (data?.lrc?.lyric) {
          return { rawLrc: data.lrc.lyric, translation: data.tlyric?.lyric || undefined };
        }
      } catch (_) {}
    }

    try {
      const { data } = await axios.get(AGG_API, {
        params: { types: "lyric", source: src, id: musicItem._lyricId || rawId },
        headers: { "User-Agent": UA },
        timeout: 6000,
      });
      if (data?.lyric) {
        return { rawLrc: data.lyric, translation: data.tlyric || undefined };
      }
    } catch (_) {}

    try {
      const cleanArtist = (musicItem.artist || "").split(/[/,、]|\s+&\s+/)[0].trim();
      const { data } = await axios.get("https://lrclib.net/api/get", {
        params: { track_name: normalizeName(musicItem.title), artist_name: cleanArtist },
        timeout: 6000,
      });
      if (data?.syncedLyrics || data?.plainLyrics) {
        return { rawLrc: data.syncedLyrics || data.plainLyrics };
      }
    } catch (_) {}

    try {
      const cleanArtist = (musicItem.artist || "").split(/[/,、]|\s+&\s+/)[0].trim();
      const { data } = await axios.get("https://lrclib.net/api/search", {
        params: { q: `${normalizeName(musicItem.title)} ${cleanArtist}`.trim() },
        timeout: 5000,
      });
      if (Array.isArray(data) && data[0]) {
        return { rawLrc: data[0].syncedLyrics || data[0].plainLyrics || "" };
      }
    } catch (_) {}

    return { rawLrc: "" };
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
