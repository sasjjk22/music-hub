const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Access-Token",
      ...extraHeaders,
    },
  });
}

function checkToken(request, env) {
  if (!env.ACCESS_TOKEN) return true; // 未设置密钥时默认放行，建议部署后设置 Worker Secret
  const url = new URL(request.url);
  const t =
    url.searchParams.get("token") ||
    request.headers.get("X-Access-Token") ||
    (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  return t === env.ACCESS_TOKEN;
}

// 音频流防假链 / 防 30 秒试听探测
async function verifyAudioUrl(url, sizeKb, durationSec) {
  if (!url || !url.startsWith("http") || url.includes("panspace.kuwo.cn")) return false;
  if (sizeKb && durationSec >= 90 && Number(sizeKb) < 550) return false;
  try {
    const res = await fetch(url, {
      headers: { Range: "bytes=0-511", "User-Agent": UA },
    });
    if (res.status !== 200 && res.status !== 206) return false;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("text/html") || ct.includes("application/json")) return false;
    return true;
  } catch {
    return false;
  }
}

// MD5 辅助（供 B 站 WBI 签名使用，Workers 原生支持 crypto.subtle.digest('MD5')）
async function md5Hex(text) {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("MD5", buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const MIXIN_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33,
  9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26,
  17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34,
  44, 52,
];

async function resolveBilibili(title, artist, durationSec, fixedBvid) {
  try {
    const [spiR, navR] = await Promise.all([
      fetch("https://api.bilibili.com/x/frontend/finger/spi", {
        headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" },
      }),
      fetch("https://api.bilibili.com/x/web-interface/nav", {
        headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" },
      }),
    ]);
    const spi = (await spiR.json())?.data || {};
    const wbi = (await navR.json())?.data?.wbi_img || {};
    const cookie = `buvid3=${spi.b_3 || ""}; buvid4=${spi.b_4 || ""}`;

    let bvid = fixedBvid;
    if (!bvid) {
      const imgKey = (wbi.img_url || "").split("/").pop().split(".")[0];
      const subKey = (wbi.sub_url || "").split("/").pop().split(".")[0];
      const orig = imgKey + subKey;
      const mixinKey = MIXIN_TAB.map((i) => orig[i] || "").join("").slice(0, 32);
      const cleanArtist = (artist || "").split(/[/,、&]/)[0].trim();
      const params = {
        search_type: "video",
        keyword: `${title} ${cleanArtist}`.trim(),
        page: "1",
        page_size: "6",
        wts: String(Math.floor(Date.now() / 1000)),
      };
      const q = Object.keys(params)
        .sort()
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k].replace(/[!'()*]/g, ""))}`)
        .join("&");
      const w_rid = await md5Hex(q + mixinKey);
      const sRes = await fetch(`https://api.bilibili.com/x/web-interface/wbi/search/type?${q}&w_rid=${w_rid}`, {
        headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/", Cookie: cookie },
      });
      const list = (await sRes.json())?.data?.result || [];
      if (!list.length) return null;
      bvid = list[0].bvid;
      if (durationSec > 0) {
        const match = list.find((item) => {
          const p = String(item.duration || "").split(":").map(Number);
          const d = p.length === 2 ? p[0] * 60 + p[1] : 0;
          return d > 30 && Math.abs(d - durationSec) <= 15;
        });
        if (match) bvid = match.bvid;
      }
    }

    const pRes = await fetch(`https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`, {
      headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" },
    });
    const cid = (await pRes.json())?.data?.[0]?.cid;
    if (!cid) return null;

    const uRes = await fetch(
      `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=80&fnval=4048&otype=json`,
      { headers: { "User-Agent": UA, Referer: `https://www.bilibili.com/video/${bvid}`, Cookie: cookie } }
    );
    const audios = (await uRes.json())?.data?.dash?.audio || [];
    if (!audios.length) return null;
    audios.sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0));
    const url = audios[0].baseUrl || audios[0].base_url || audios[0].backupUrl?.[0];
    if (!url) return null;
    return {
      url,
      source: "bili",
      bvid,
      headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA },
    };
  } catch {
    return null;
  }
}

async function resolvePlayUrl(song, quality, env) {
  const ids = JSON.parse(song.source_ids_json || "{}");
  const brMap = { super: ["999", "320", "192"], high: ["320", "192", "128"], standard: ["192", "128"], low: ["128"] };
  const brs = brMap[quality] || brMap.high;

  // 1. R2 私有绝版曲库最高优
  if (ids.r2 && env.R2) {
    const base = env.R2_PUBLIC_URL || "";
    if (base) return { url: `${base.replace(/\/$/, "")}/${ids.r2}`, source: "r2" };
  }

  // 2. 塞壬唱片官方直连
  if (ids.msr) {
    try {
      const r = await fetch(`https://monster-siren.hypergryph.com/api/song/${ids.msr}`);
      const d = (await r.json())?.data;
      if (d?.sourceUrl) return { url: d.sourceUrl, source: "msr" };
    } catch {}
  }

  // 3. 从 D1 sources 表读取启用的聚合解析池
  const { results: sources } = await env.DB.prepare(
    "SELECT id, type, endpoint FROM sources WHERE enabled = 1 AND type = 'agg' ORDER BY priority ASC"
  ).all();

  for (const src of sources || []) {
    for (const [plat, pid] of Object.entries(ids)) {
      if (plat === "r2" || plat === "msr" || plat === "bili") continue;
      for (const br of brs) {
        try {
          const u = `${src.endpoint}?types=url&source=${plat}&id=${encodeURIComponent(pid)}&br=${br}`;
          const r = await fetch(u, { headers: { "User-Agent": UA } });
          const d = await r.json();
          if (d?.url && (await verifyAudioUrl(d.url, d.size, song.duration))) {
            return { url: d.url, source: `${src.id}:${plat}`, br };
          }
        } catch {}
      }
    }
  }

  // 4. B站 WBI 音频流兜底
  const bili = await resolveBilibili(song.title, song.artist, song.duration, ids.bili);
  if (bili) return bili;

  return null;
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") return json({ ok: true });

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/" || path === "/health") {
      return json({ name: "Music Hub API", status: "ok", time: Date.now() });
    }

    if (!checkToken(request, env)) {
      return json({ error: "Unauthorized" }, 401);
    }

    // 1. 首页榜单分类（仅读 charts 表元信息，不扫歌曲表）
    if (path === "/api/home") {
      const { results } = await env.DB.prepare(
        "SELECT id, title, category, cover, description FROM charts ORDER BY sort_order ASC"
      ).all();
      return json({ charts: results || [] });
    }

    // 2. 榜单详情（1 行 charts + 主键批量 IN 读取歌曲）
    if (path === "/api/chart") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "missing id" }, 400);
      const chart = await env.DB.prepare("SELECT * FROM charts WHERE id = ?").bind(id).first();
      if (!chart) return json({ error: "chart not found" }, 404);
      const ids = JSON.parse(chart.song_ids_json || "[]").slice(0, 120);
      if (!ids.length) return json({ chart, songs: [] });

      const placeholders = ids.map(() => "?").join(",");
      const { results } = await env.DB.prepare(
        `SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked=0 AND id IN (${placeholders})`
      )
        .bind(...ids)
        .all();
      const map = new Map((results || []).map((s) => [s.id, s]));
      const ordered = ids.map((sid) => map.get(sid)).filter(Boolean);
      return json({
        chart: { id: chart.id, title: chart.title, cover: chart.cover, description: chart.description },
        songs: ordered,
      });
    }

    // 3. 混合搜索（3字及以上走 FTS5 trigram；1~2字走轻量前缀/LIKE）
    if (path === "/api/search") {
      const q = (url.searchParams.get("q") || "").trim();
      if (!q) return json({ songs: [] });
      let rows = [];
      if (q.length >= 3) {
        const safeQ = `"${q.replace(/"/g, "")}"`;
        const res = await env.DB.prepare(
          `SELECT s.id,s.norm_key,s.title,s.artist,s.album,s.cover,s.duration,s.category,s.source_ids_json
           FROM songs_fts f JOIN songs s ON s.id = f.rowid
           WHERE songs_fts MATCH ? AND s.is_blocked = 0
           ORDER BY s.score DESC LIMIT 40`
        )
          .bind(safeQ)
          .all();
        rows = res.results || [];
      } else {
        const likeQ = `%${q}%`;
        const res = await env.DB.prepare(
          `SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json
           FROM songs WHERE is_blocked = 0 AND (title LIKE ? OR artist LIKE ?)
           ORDER BY score DESC LIMIT 30`
        )
          .bind(likeQ, likeQ)
          .all();
        rows = res.results || [];
      }
      return json({ songs: rows });
    }

    // 4. 歌曲详情与永久歌词
    if (path === "/api/song") {
      const id = Number(url.searchParams.get("id"));
      if (!id) return json({ error: "invalid id" }, 400);
      const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(id).first();
      if (!song) return json({ error: "not found" }, 404);
      return json({ song });
    }

    // 5. 实时解析播放直链（15 分钟边缘缓存）
    if (path === "/api/play") {
      const id = Number(url.searchParams.get("id"));
      const quality = url.searchParams.get("q") || "high";
      if (!id) return json({ error: "invalid id" }, 400);

      const cache = caches.default;
      const cacheKey = new Request(`https://cache.internal/play/${id}/${quality}`);
      const cached = await cache.match(cacheKey);
      if (cached) return cached;

      const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(id).first();
      if (!song) return json({ error: "not found" }, 404);

      const resolved = await resolvePlayUrl(song, quality, env);
      if (!resolved) return json({ error: "no playable source" }, 502);

      // 若是首次通过 B 站兜底解析成功，异步把 bvid 记回 source_ids_json 下次免搜索
      if (resolved.bvid) {
        const ids = JSON.parse(song.source_ids_json || "{}");
        if (!ids.bili) {
          ids.bili = resolved.bvid;
          ctx.waitUntil(
            env.DB.prepare("UPDATE songs SET source_ids_json = ? WHERE id = ?")
              .bind(JSON.stringify(ids), id)
              .run()
          );
        }
      }

      const resp = json(resolved, 200, { "Cache-Control": "public, max-age=900" });
      ctx.waitUntil(cache.put(cacheKey, resp.clone()));
      return resp;
    }

    // 6. 动态生成直连你自家 D1+Worker 的 MusicFree 插件
    if (path === "/api/mf-plugin.js") {
      const base = `${url.protocol}//${url.host}`;
      const tokenParam = env.ACCESS_TOKEN ? `&token=${encodeURIComponent(env.ACCESS_TOKEN)}` : "";
      const js = `"use strict";
const axios = require("axios");
const BASE = "${base}";
const TOKEN = "${env.ACCESS_TOKEN || ""}";
const H = TOKEN ? { "X-Access-Token": TOKEN } : {};
module.exports = {
  platform: "MusicHub·自建云端",
  author: "MusicHub",
  version: "1.0.0",
  cacheControl: "no-cache",
  supportedSearchType: ["music"],
  async search(query, page, type) {
    if (type !== "music" || page > 1) return { isEnd: true, data: [] };
    const { data } = await axios.get(BASE + "/api/search", { params: { q: query }, headers: H, timeout: 8000 });
    return {
      isEnd: true,
      data: (data.songs || []).map((s) => ({
        id: String(s.id), title: s.title, artist: s.artist, album: s.album, artwork: s.cover, duration: s.duration
      }))
    };
  },
  async getMediaSource(item, quality) {
    const { data } = await axios.get(BASE + "/api/play", { params: { id: item.id, q: quality || "high" }, headers: H, timeout: 12000 });
    return { url: data.url, headers: data.headers };
  },
  async getLyric(item) {
    const { data } = await axios.get(BASE + "/api/song", { params: { id: item.id }, headers: H, timeout: 6000 });
    return { rawLrc: data.song?.lyric_lrc || "", translation: data.song?.lyric_trans || undefined };
  },
  async getTopLists() {
    const { data } = await axios.get(BASE + "/api/home", { headers: H, timeout: 8000 });
    const groups = {};
    for (const c of data.charts || []) {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push({ id: c.id, title: c.title, coverImg: c.cover, description: c.description });
    }
    return Object.entries(groups).map(([title, data]) => ({ title, data }));
  },
  async getTopListDetail(topListItem) {
    const { data } = await axios.get(BASE + "/api/chart", { params: { id: topListItem.id }, headers: H, timeout: 8000 });
    return {
      isEnd: true,
      topListItem,
      musicList: (data.songs || []).map((s) => ({
        id: String(s.id), title: s.title, artist: s.artist, album: s.album, artwork: s.cover, duration: s.duration
      }))
    };
  }
};`;
      return new Response(js, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
    }

    if (path === "/musicfree.json") {
      const base = `${url.protocol}//${url.host}`;
      const qs = env.ACCESS_TOKEN ? `?token=${encodeURIComponent(env.ACCESS_TOKEN)}` : "";
      return json({
        plugins: [{ name: "MusicHub·自建云端", url: `${base}/api/mf-plugin.js${qs}`, version: "1.0.0" }],
      });
    }

    return json({ error: "Not Found" }, 404);
  },
};
