"use strict";
const axios = require("axios");
const CryptoJS = require("crypto-js");
const he = require("he");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const MIXIN_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33,
  9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26,
  17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34,
  44, 52,
];

let cache = { buvid3: "", buvid4: "", imgKey: "", subKey: "", ts: 0 };

async function ensureAuth() {
  const now = Date.now();
  if (cache.buvid3 && cache.imgKey && now - cache.ts < 1800 * 1000) return cache;
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
  cache = {
    buvid3: spi.b_3 || "",
    buvid4: spi.b_4 || "",
    imgKey: (wbi.img_url || "").split("/").pop().split(".")[0],
    subKey: (wbi.sub_url || "").split("/").pop().split(".")[0],
    ts: now,
  };
  return cache;
}

function wbiQuery(params, imgKey, subKey) {
  const orig = imgKey + subKey;
  const mixinKey = MIXIN_TAB.map((i) => orig[i] || "").join("").slice(0, 32);
  const all = { ...params, wts: Math.floor(Date.now() / 1000) };
  const q = Object.keys(all)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(all[k]).replace(/[!'()*]/g, ""))}`)
    .join("&");
  const w_rid = CryptoJS.MD5(q + mixinKey).toString();
  return `${q}&w_rid=${w_rid}`;
}

function stripTags(str) {
  return he.decode(String(str || "").replace(/<[^>]+>/g, ""));
}

function toSeconds(dur) {
  const arr = String(dur || "").split(":").map(Number);
  if (arr.length === 2) return arr[0] * 60 + arr[1];
  if (arr.length === 3) return arr[0] * 3600 + arr[1] * 60 + arr[2];
  return 0;
}

module.exports = {
  platform: "MusicHub·B站音频",
  author: "MusicHub",
  version: "1.0.0",
  cacheControl: "no-cache",
  supportedSearchType: ["music"],

  async search(query, page, type) {
    if (type !== "music") return { isEnd: true, data: [] };
    const auth = await ensureAuth();
    const qs = wbiQuery(
      { search_type: "video", keyword: query, page, page_size: 20 },
      auth.imgKey,
      auth.subKey
    );
    const { data } = await axios.get(
      `https://api.bilibili.com/x/web-interface/wbi/search/type?${qs}`,
      {
        headers: {
          "User-Agent": UA,
          Referer: "https://www.bilibili.com/",
          Cookie: `buvid3=${auth.buvid3}; buvid4=${auth.buvid4}`,
        },
        timeout: 8000,
      }
    );
    const rawList = data?.data?.result || [];
    const list = rawList.filter((item) => {
      const title = stripTags(item.title).toLowerCase();
      return !["翻唱", "cover", "吉他", "钢琴", "弹唱", "教学", "伴奏", "二创"].some((w) => title.includes(w));
    });
    return {
      isEnd: rawList.length < 20,
      data: list.map((item) => ({
        id: item.bvid,
        bvid: item.bvid,
        aid: item.aid,
        title: stripTags(item.title),
        artist: item.author || "UP主",
        artwork: item.pic?.startsWith("//") ? `https:${item.pic}` : item.pic,
        duration: toSeconds(item.duration),
      })),
    };
  },

  async getMediaSource(musicItem, quality) {
    const auth = await ensureAuth();
    const bvid = musicItem.bvid || musicItem.id;
    const cookie = `buvid3=${auth.buvid3}; buvid4=${auth.buvid4}`;

    let cid = musicItem.cid;
    if (!cid) {
      const pRes = await axios.get(
        `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`,
        { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" }, timeout: 6000 }
      );
      cid = pRes.data?.data?.[0]?.cid;
    }
    if (!cid) throw new Error("获取B站 CID 失败");

    const { data } = await axios.get(
      `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=80&fnval=4048&otype=json`,
      {
        headers: {
          "User-Agent": UA,
          Referer: `https://www.bilibili.com/video/${bvid}`,
          Cookie: cookie,
        },
        timeout: 8000,
      }
    );
    const audios = data?.data?.dash?.audio || [];
    if (!audios.length) throw new Error("未获取到B站音频流");

    // 按带宽排序并根据音质自适应（修复 4 档变 3 档造成的越界空链）
    audios.sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0));
    const idx =
      quality === "low"
        ? audios.length - 1
        : quality === "standard"
        ? Math.min(1, audios.length - 1)
        : 0;
    const picked = audios[idx] || audios[0];
    const url = picked.baseUrl || picked.base_url || picked.backupUrl?.[0];

    return {
      url,
      headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA },
      userAgent: UA,
    };
  },

  async getLyric(musicItem) {
    try {
      const { data } = await axios.get("https://lrclib.net/api/search", {
        params: { q: musicItem.title },
        timeout: 5000,
      });
      if (Array.isArray(data) && data[0]) {
        return { rawLrc: data[0].syncedLyrics || data[0].plainLyrics || "" };
      }
    } catch (_) {}
    return { rawLrc: "" };
  },
};
