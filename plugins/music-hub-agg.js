"use strict";
const axios = require("axios");
const CryptoJS = require("crypto-js");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const AGG_API = "https://music-api.gdstudio.xyz/api.php";

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
  return (s || "")
    .toLowerCase()
    .replace(/[\(（\[【].*?[\)）\]】]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function isValidAudioUrl(url, sizeKb, durationSec, br = "320", headers = {}) {
  if (!url || typeof url !== "string" || !url.startsWith("http")) return false;
  if (url.includes("panspace.kuwo.cn") || url.includes("/404")) return false;

  const minKb = Number(br) >= 320 ? 1300 : 550;
  if (sizeKb && durationSec >= 90 && Number(sizeKb) < minKb) {
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
    if (total > 0 && durationSec >= 90 && total < minKb * 1024) {
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
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
  const [spiRes, navRes] = await Promise.all([
    axios.get("https://api.bilibili.com/x/frontend/finger/spi", {
      headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" },
      timeout: 6000,
    }),
    axios.get("https://api.bilibili.com/x/web-interface/nav", {
      headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" },
      timeout: 6000,
    }),
  ]);
  const spi = spiRes.data?.data || {};
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
    const cleanArtist = (artist || "").split(/[\/,、&]/)[0].trim();
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
    if (!audios.length) return null;

    audios.sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0));
    for (const stream of audios) {
      const u = stream.baseUrl || stream.base_url || (stream.backupUrl && stream.backupUrl[0]);
      if (u) {
        return { url: u, headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA }, userAgent: UA };
      }
    }
  } catch (_) {}
  return null;
}

async function searchMusic(query, page) {
  const results = [], seen = new Set();
  // GD Studio expects exactly one source per request; comma-joined providers
  // are not a supported multi-source value.
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
      const key = `${normalizeName(title)}|${normalizeName(artist.split(/[\/,、&]/)[0])}`;
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

module.exports = {
  platform: "MusicHub·全网聚合",
  author: "MusicHub",
  version: "1.0.3",
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

    const direct = await resolveFromAgg(parsedSource, parsedId, brList, dur);
    if (direct) return direct;

    const cleanArtist = (musicItem.artist || "").split(/[\/,、&]/)[0].trim();
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
      const cleanArtist = (musicItem.artist || "").split(/[\/,、&]/)[0].trim();
      const { data } = await axios.get("https://lrclib.net/api/get", {
        params: { track_name: normalizeName(musicItem.title), artist_name: cleanArtist },
        timeout: 6000,
      });
      if (data?.syncedLyrics || data?.plainLyrics) {
        return { rawLrc: data.syncedLyrics || data.plainLyrics };
      }
    } catch (_) {}

    return { rawLrc: "" };
  },

  async getTopLists() {
    return NETEASE_TOPLISTS;
  },

  async getTopListDetail(topListItem) {
    const { data } = await axios.get("https://music.163.com/api/v6/playlist/detail", {
      params: { id: topListItem.id, n: 100 },
      headers: { "User-Agent": UA, Referer: "https://music.163.com/" },
      timeout: 8000,
    });
    const pl = data?.playlist || {};
    const tracks = (pl.tracks || []).map((t) => ({
      id: `netease_${t.id}`,
      title: t.name,
      artist: (t.ar || t.artists || []).map((a) => a.name).join(" / "),
      album: (t.al || t.album)?.name || "",
      artwork: (t.al || t.album)?.picUrl,
      duration: Math.round((t.dt || t.duration || 0) / 1000),
      _source: "netease",
      _rawId: String(t.id),
      _lyricId: String(t.id),
    }));
    return {
      isEnd: true,
      topListItem: { ...topListItem, coverImg: pl.coverImgUrl, description: pl.description || topListItem.description },
      musicList: tracks,
    };
  },

  async importMusicSheet(urlLike) {
    const match = String(urlLike).match(/(?:id=|playlist\/)(\d+)/) || String(urlLike).match(/^(\d{6,12})$/);
    if (!match) return [];
    const { data } = await axios.get("https://music.163.com/api/v6/playlist/detail", {
      params: { id: match[1], n: 200 },
      headers: { "User-Agent": UA, Referer: "https://music.163.com/" },
      timeout: 8000,
    });
    return (data?.playlist?.tracks || []).map((t) => ({
      id: `netease_${t.id}`,
      title: t.name,
      artist: (t.ar || t.artists || []).map((a) => a.name).join(" / "),
      album: (t.al || t.album)?.name || "",
      artwork: (t.al || t.album)?.picUrl,
      duration: Math.round((t.dt || t.duration || 0) / 1000),
      _source: "netease",
      _rawId: String(t.id),
      _lyricId: String(t.id),
    }));
  },
};
