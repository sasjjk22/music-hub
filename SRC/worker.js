const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const NE_HEADERS = {
  "User-Agent": UA,
  Referer: "https://music.163.com/",
  Cookie: "os=pc; appver=2.9.7",
};

// 主页预设热门歌手（点击即融合本地 D1 + 全网实时拉取代表作）
const PRESET_ARTISTS = [
  { name: "周杰伦", cat: "华语男", tag: "华语流行" },
  { name: "张学友", cat: "华语男", tag: "经典歌神" },
  { name: "陈奕迅", cat: "华语男", tag: "华语流行" },
  { name: "林俊杰", cat: "华语男", tag: "华语流行" },
  { name: "陶喆", cat: "华语男", tag: "R&B" },
  { name: "王力宏", cat: "华语男", tag: "华语流行" },
  { name: "薛之谦", cat: "华语男", tag: "流行情歌" },
  { name: "许嵩", cat: "华语男", tag: "原创" },
  { name: "毛不易", cat: "华语男", tag: "民谣流行" },
  { name: "邓紫棋", cat: "华语女", tag: "华语流行" },
  { name: "王菲", cat: "华语女", tag: "经典天后" },
  { name: "孙燕姿", cat: "华语女", tag: "华语经典" },
  { name: "梁静茹", cat: "华语女", tag: "情歌" },
  { name: "田馥甄", cat: "华语女", tag: "文艺流行" },
  { name: "蔡依林", cat: "华语女", tag: "唱跳流行" },
  { name: "五月天", cat: "乐队组合", tag: "摇滚乐团" },
  { name: "Beyond", cat: "乐队组合", tag: "粤语经典" },
  { name: "告五人", cat: "乐队组合", tag: "独立乐团" },
  { name: "YOASOBI", cat: "日韩", tag: "日语流行" },
  { name: "米津玄师", cat: "日韩", tag: "日语创作" },
  { name: "Aimer", cat: "ACG", tag: "动漫歌姬" },
  { name: "泽野弘之", cat: "ACG", tag: "燃系OST" },
  { name: "塞壬唱片-MSR", cat: "ACG", tag: "明日方舟" },
  { name: "Taylor Swift", cat: "欧美", tag: "欧美流行" },
  { name: "Coldplay", cat: "欧美", tag: "英伦摇滚" },
];

const JUNK_WORDS = ["dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok", "消音版"];

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Access-Token, X-Admin-Password",
      ...extraHeaders,
    },
  });
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function getTokenFromReq(request) {
  const url = new URL(request.url);
  return (
    url.searchParams.get("token") ||
    request.headers.get("X-Access-Token") ||
    (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "")
  );
}

function checkToken(request, env) {
  if (!env.ACCESS_TOKEN) return true;
  return getTokenFromReq(request) === env.ACCESS_TOKEN;
}

function checkAdmin(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  return (request.headers.get("X-Admin-Password") || "") === env.ADMIN_PASSWORD;
}

function normalizeName(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[\(（\[【].*?[\)）\]】]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeNormKey(title, artist) {
  const first = (artist || "").split(/[/,、&]/)[0];
  return `${normalizeName(title)}|${normalizeName(first)}`;
}

function isJunkTitle(title, query = "") {
  const t = (title || "").toLowerCase();
  const q = (query || "").toLowerCase();
  return JUNK_WORDS.some((w) => t.includes(w) && !q.includes(w));
}

// ---------- 全网实时搜索（供长尾搜歌 + 歌手详情页使用） ----------
async function liveSearchSongs(query, limit = 30) {
  const out = [];
  const seen = new Set();

  // 1. 网易云官方搜索（先试 cloudsearch 拿高清封面，失败则退回 api/search/get）
  for (const endpoint of [
    `https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=1&limit=${limit}&offset=0`,
    `https://music.163.com/api/search/get?s=${encodeURIComponent(query)}&type=1&limit=${limit}&offset=0`,
  ]) {
    try {
      const r = await fetch(endpoint, { headers: NE_HEADERS });
      if (!r.ok) continue;
      const data = await r.json();
      const songs = data?.result?.songs || [];
      if (!songs.length) continue;
      for (const s of songs) {
        if (!s.name || isJunkTitle(s.name, query)) continue;
        const artists = (s.ar || s.artists || []).map((a) => a.name).filter(Boolean).join(" / ") || "未知歌手";
        const nk = makeNormKey(s.name, artists);
        if (seen.has(nk)) continue;
        seen.add(nk);
        const alb = s.al || s.album || {};
        out.push({
          id: 0,
          norm_key: nk,
          title: s.name,
          artist: artists,
          album: alb.name || "",
          cover: alb.picUrl || "",
          duration: Math.round((s.dt || s.duration || 0) / 1000),
          category: "全网搜索",
          ext_source: "netease",
          ext_id: String(s.id),
        });
      }
      if (out.length) break;
    } catch {}
  }

  // 2. 若网易云未命中或被风控，自动补全 gdstudio 聚合搜索（网易 + 酷我）
  if (out.length < 5) {
    try {
      const r = await fetch(
        `https://music-api.gdstudio.xyz/api.php?types=search&source=netease,kuwo&name=${encodeURIComponent(query)}&count=20&pages=1`,
        { headers: { "User-Agent": UA } }
      );
      if (r.ok) {
        const arr = await r.json();
        if (Array.isArray(arr)) {
          for (const item of arr) {
            if (!item.name || isJunkTitle(item.name, query)) continue;
            const artists = Array.isArray(item.artist) ? item.artist.join(" / ") : item.artist || "未知歌手";
            const nk = makeNormKey(item.name, artists);
            if (seen.has(nk)) continue;
            seen.add(nk);
            const src = item.source || "netease";
            out.push({
              id: 0,
              norm_key: nk,
              title: item.name,
              artist: artists,
              album: item.album || "",
              cover: item.pic_id
                ? `https://music-api.gdstudio.xyz/api.php?types=pic&source=${src}&id=${item.pic_id}&size=500`
                : "",
              duration: 0,
              category: src === "kuwo" ? "酷我" : "全网搜索",
              ext_source: src,
              ext_id: String(item.id),
            });
          }
        }
      }
    } catch {}
  }

  return out;
}

// ---------- 音频防假链 / 30秒试听防火墙 ----------
async function verifyAudioUrl(url, sizeKb, durationSec) {
  if (!url || !url.startsWith("http") || url.includes("panspace.kuwo.cn")) return false;
  if (sizeKb && durationSec >= 90 && Number(sizeKb) < 550) return false;
  try {
    const res = await fetch(url, {
      headers: { Range: "bytes=0-1023", "User-Agent": UA },
    });
    if (res.status !== 200 && res.status !== 206) return false;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("text/html") || ct.includes("application/json")) return false;
    const cr = res.headers.get("content-range") || "";
    const m = cr.match(/\/(\d+)$/);
    if (m && durationSec >= 90) {
      const totalBytes = Number(m[1]);
      if (totalBytes > 0 && totalBytes < 550 * 1024) return false;
    }
    return true;
  } catch {
    return false;
  }
}

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
        keyword: `${normalizeName(title)} ${cleanArtist}`.trim(),
        page: "1",
        page_size: "8",
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
          const d = p.length === 2 ? p[0] * 60 + p[1] : p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : 0;
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
    const streamUrl = audios[0].baseUrl || audios[0].base_url || audios[0].backupUrl?.[0];
    if (!streamUrl) return null;
    return {
      url: streamUrl,
      needProxy: true,
      source: "bili",
      bvid,
      headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA },
    };
  } catch {
    return null;
  }
}

async function tryAggEndpoint(endpoint, srcId, plat, pid, brs, durationSec) {
  for (const br of brs) {
    try {
      const u = `${endpoint}?types=url&source=${plat}&id=${encodeURIComponent(pid)}&br=${br}`;
      const r = await fetch(u, { headers: { "User-Agent": UA } });
      if (!r.ok) continue;
      const d = await r.json();
      if (d?.url && (await verifyAudioUrl(d.url, d.size, durationSec))) {
        return { url: d.url, source: `${srcId}:${plat}`, br };
      }
    } catch {}
  }
  return null;
}

async function resolvePlayUrl(song, quality, env, prefer = "") {
  const ids = JSON.parse(song.source_ids_json || "{}");
  const brMap = {
    super: ["999", "320", "192"],
    high: ["320", "192", "128"],
    standard: ["192", "128"],
    low: ["128"],
  };
  const brs = brMap[quality] || brMap.high;

  if (prefer === "bili") {
    const bili = await resolveBilibili(song.title, song.artist, song.duration, ids.bili);
    if (bili) return bili;
  }

  if (ids.r2 && env.R2) {
    const base = env.R2_PUBLIC_URL || "";
    if (base) return { url: `${base.replace(/\/$/, "")}/${ids.r2}`, source: "r2" };
  }

  if (ids.msr) {
    try {
      const r = await fetch(`https://monster-siren.hypergryph.com/api/song/${ids.msr}`);
      const d = (await r.json())?.data;
      if (d?.sourceUrl) return { url: d.sourceUrl, source: "msr" };
    } catch {}
  }

  const { results: sources } = await env.DB.prepare(
    "SELECT id, type, endpoint FROM sources WHERE enabled = 1 AND type = 'agg' ORDER BY priority ASC"
  ).all();

  for (const src of sources || []) {
    for (const [plat, pid] of Object.entries(ids)) {
      if (["r2", "msr", "bili"].includes(plat)) continue;
      const hit = await tryAggEndpoint(src.endpoint, src.id, plat, pid, brs, song.duration);
      if (hit) return hit;
    }
    const cleanArtist = (song.artist || "").split(/[/,、&]/)[0].trim();
    const kw = `${normalizeName(song.title)} ${cleanArtist}`.trim();
    for (const plat of ["kuwo", "netease", "joox"]) {
      if (ids[plat]) continue;
      try {
        const sRes = await fetch(
          `${src.endpoint}?types=search&source=${plat}&name=${encodeURIComponent(kw)}&count=3&pages=1`,
          { headers: { "User-Agent": UA } }
        );
        if (!sRes.ok) continue;
        const arr = await sRes.json();
        if (Array.isArray(arr) && arr[0]?.id) {
          const hit = await tryAggEndpoint(src.endpoint, src.id, plat, String(arr[0].id), brs, song.duration);
          if (hit) return hit;
        }
      } catch {}
    }
  }

  if (ids.netease) {
    const outer = `https://music.163.com/song/media/outer/url?id=${ids.netease}.mp3`;
    try {
      const probe = await fetch(outer, { method: "HEAD", redirect: "follow", headers: { "User-Agent": UA } });
      if (probe.ok && !probe.url.includes("404") && (await verifyAudioUrl(probe.url, 0, song.duration))) {
        return { url: probe.url, source: "netease_direct" };
      }
    } catch {}
  }

  const bili = await resolveBilibili(song.title, song.artist, song.duration, ids.bili);
  if (bili) return bili;

  return null;
}

// 实时获取单曲歌词（并清洗广告行）
async function fetchLiveLyric(extSource, extId, title, artist) {
  if (extSource === "netease" && extId) {
    try {
      const r = await fetch(`https://music.163.com/api/song/lyric?id=${extId}&lv=-1&kv=-1&tv=-1`, { headers: NE_HEADERS });
      const d = await r.json();
      const lrc = d?.lrc?.lyric || "";
      const trans = d?.tlyric?.lyric || "";
      if (lrc) return { lrc, trans };
    } catch {}
  }
  try {
    const cleanArtist = (artist || "").split(/[/,、&]/)[0].trim();
    const r = await fetch(
      `https://lrclib.net/api/get?track_name=${encodeURIComponent(normalizeName(title))}&artist_name=${encodeURIComponent(cleanArtist)}`
    );
    if (r.ok) {
      const d = await r.json();
      return { lrc: d?.syncedLyrics || d?.plainLyrics || "", trans: "" };
    }
  } catch {}
  return { lrc: "", trans: "" };
}

function isSafeExternalUrl(raw) {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname.toLowerCase();
    if (
      h === "localhost" ||
      h.startsWith("127.") ||
      h.startsWith("10.") ||
      h.startsWith("192.168.") ||
      h.startsWith("169.254.") ||
      h.endsWith(".internal")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method === "OPTIONS") return json({ ok: true });

      const url = new URL(request.url);
      const path = url.pathname;

      if (path === "/" || path === "/player") return html(PLAYER_HTML);
      if (path === "/admin") return html(ADMIN_HTML);
      if (path === "/health") return json({ name: "Music Hub API", status: "ok", time: Date.now() });

      // -------- 管理后台 API --------
      if (path.startsWith("/api/admin/")) {
        if (!checkAdmin(request, env)) {
          return json({ error: env.ADMIN_PASSWORD ? "后台密码错误" : "请先配置 ADMIN_PASSWORD Secret" }, 401);
        }
        if (path === "/api/admin/stats" && request.method === "GET") {
          const sCount = await env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=0").first();
          const bCount = await env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=1").first();
          const cCount = await env.DB.prepare("SELECT COUNT(*) AS c FROM charts").first();
          const lCount = await env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE length(lyric_lrc) > 10").first();
          const { results: sources } = await env.DB.prepare("SELECT * FROM sources ORDER BY priority ASC").all();
          const { results: blocked } = await env.DB.prepare(
            "SELECT id,title,artist,category FROM songs WHERE is_blocked=1 ORDER BY updated_at DESC LIMIT 30"
          ).all();
          return json({
            stats: {
              songs: sCount?.c || 0,
              blocked: bCount?.c || 0,
              charts: cCount?.c || 0,
              lyrics: lCount?.c || 0,
            },
            sources: sources || [],
            blocked: blocked || [],
          });
        }
        if (path === "/api/admin/source" && request.method === "POST") {
          const body = await request.json();
          const now = Math.floor(Date.now() / 1000);
          await env.DB.prepare(
            `INSERT INTO sources (id, name, type, endpoint, priority, enabled, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               name=excluded.name, type=excluded.type, endpoint=excluded.endpoint,
               priority=excluded.priority, enabled=excluded.enabled, updated_at=excluded.updated_at`
          )
            .bind(
              String(body.id).trim(),
              String(body.name).trim(),
              body.type || "agg",
              String(body.endpoint || "").trim(),
              Number(body.priority || 50),
              body.enabled ? 1 : 0,
              now
            )
            .run();
          return json({ ok: true });
        }
        if (path === "/api/admin/source/test" && request.method === "POST") {
          const { id } = await request.json();
          const src = await env.DB.prepare("SELECT * FROM sources WHERE id = ?").bind(id).first();
          if (!src) return json({ error: "source not found" }, 404);
          const t0 = Date.now();
          let testUrl = src.endpoint;
          if (src.type === "agg") testUrl = `${src.endpoint}?types=search&source=netease&name=晴天&count=1&pages=1`;
          if (src.type === "native") testUrl = `${src.endpoint}/albums`;
          if (src.type === "bili") testUrl = `https://api.bilibili.com/x/frontend/finger/spi`;
          try {
            const r = await fetch(testUrl, { headers: { "User-Agent": UA } });
            return json({ ok: r.ok, status: r.status, ms: Date.now() - t0 });
          } catch (e) {
            return json({ ok: false, error: e.message, ms: Date.now() - t0 });
          }
        }
        if (path === "/api/admin/song/block" && request.method === "POST") {
          const { id, blocked } = await request.json();
          await env.DB.prepare("UPDATE songs SET is_blocked = ? WHERE id = ?").bind(blocked ? 1 : 0, Number(id)).run();
          return json({ ok: true });
        }
        if (path === "/api/admin/song/reset-bili" && request.method === "POST") {
          const { id } = await request.json();
          const song = await env.DB.prepare("SELECT source_ids_json FROM songs WHERE id = ?").bind(Number(id)).first();
          if (song) {
            const ids = JSON.parse(song.source_ids_json || "{}");
            delete ids.bili;
            await env.DB.prepare("UPDATE songs SET source_ids_json = ? WHERE id = ?")
              .bind(JSON.stringify(ids), Number(id))
              .run();
          }
          return json({ ok: true });
        }
        return json({ error: "Unknown admin route" }, 404);
      }

      // -------- 播放与订阅 API --------
      if (!checkToken(request, env)) {
        return json({ error: "Unauthorized" }, 401);
      }

      if (path === "/api/home") {
        const { results } = await env.DB.prepare(
          "SELECT id, title, category, cover, description FROM charts ORDER BY sort_order ASC"
        ).all();
        return json({ charts: results || [], artists: PRESET_ARTISTS });
      }

      if (path === "/api/chart") {
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "missing id" }, 400);
        const chart = await env.DB.prepare("SELECT * FROM charts WHERE id = ?").bind(id).first();
        if (!chart) return json({ error: "chart not found" }, 404);
        const ids = JSON.parse(chart.song_ids_json || "[]").slice(0, 160);
        if (!ids.length) return json({ chart, songs: [] });

        const map = new Map();
        for (let i = 0; i < ids.length; i += 80) {
          const chunk = ids.slice(i, i + 80);
          const placeholders = chunk.map(() => "?").join(",");
          const { results } = await env.DB.prepare(
            `SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json FROM songs WHERE is_blocked=0 AND id IN (${placeholders})`
          )
            .bind(...chunk)
            .all();
          for (const s of results || []) map.set(s.id, s);
        }
        const ordered = ids.map((sid) => map.get(sid)).filter(Boolean);
        return json({
          chart: { id: chart.id, title: chart.title, cover: chart.cover, description: chart.description },
          songs: ordered,
        });
      }

      // 歌手专区：合并本地 D1 该歌手曲目 + 实时全网拉取代表作
      if (path === "/api/artist") {
        const name = (url.searchParams.get("name") || "").trim();
        if (!name) return json({ songs: [] });

        const likeQ = `%${name}%`;
        const { results: localRows } = await env.DB.prepare(
          `SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json
           FROM songs WHERE is_blocked = 0 AND artist LIKE ?
           ORDER BY score DESC LIMIT 40`
        )
          .bind(likeQ)
          .all();

        const seen = new Set((localRows || []).map((r) => r.norm_key));
        const live = await liveSearchSongs(name, 35);
        const nameLower = name.toLowerCase();
        const filteredLive = live.filter((s) => {
          if (seen.has(s.norm_key)) return false;
          return s.artist.toLowerCase().includes(nameLower) || nameLower.includes(s.artist.toLowerCase());
        });

        return json({ artist: name, songs: [...(localRows || []), ...filteredLive].slice(0, 60) });
      }

      // 混合搜索：D1 精准检索 + 实时全网补充搜索
      if (path === "/api/search") {
        const q = (url.searchParams.get("q") || "").trim();
        if (!q) return json({ songs: [] });

        let localRows = [];
        if (q.length >= 3) {
          const safeQ = `"${q.replace(/"/g, "")}"`;
          const res = await env.DB.prepare(
            `SELECT s.id,s.norm_key,s.title,s.artist,s.album,s.cover,s.duration,s.category,s.source_ids_json
             FROM songs_fts f JOIN songs s ON s.id = f.rowid
             WHERE songs_fts MATCH ? AND s.is_blocked = 0
             ORDER BY s.score DESC LIMIT 30`
          )
            .bind(safeQ)
            .all();
          localRows = res.results || [];
        }
        if (!localRows.length) {
          const likeQ = `%${q}%`;
          const res = await env.DB.prepare(
            `SELECT id,norm_key,title,artist,album,cover,duration,category,source_ids_json
             FROM songs WHERE is_blocked = 0 AND (title LIKE ? OR artist LIKE ?)
             ORDER BY score DESC LIMIT 25`
          )
            .bind(likeQ, likeQ)
            .all();
          localRows = res.results || [];
        }

        // 若本地 D1 结果不足 15 首，自动实时搜索全网（网易云 + 酷我）补全
        let merged = [...localRows];
        if (merged.length < 15) {
          const seen = new Set(merged.map((r) => r.norm_key));
          const live = await liveSearchSongs(q, 30);
          for (const item of live) {
            if (!seen.has(item.norm_key)) {
              seen.add(item.norm_key);
              merged.push(item);
            }
          }
        }
        return json({ songs: merged.slice(0, 50) });
      }

      if (path === "/api/song") {
        const id = Number(url.searchParams.get("id") || 0);
        if (id > 0) {
          const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(id).first();
          if (song) {
            if (!song.lyric_lrc) {
              const ids = JSON.parse(song.source_ids_json || "{}");
              const extSrc = ids.netease ? "netease" : "";
              const extId = ids.netease || "";
              const live = await fetchLiveLyric(extSrc, extId, song.title, song.artist);
              if (live.lrc) {
                song.lyric_lrc = live.lrc;
                song.lyric_trans = live.trans;
                ctx.waitUntil(
                  env.DB.prepare("UPDATE songs SET lyric_lrc = ?, lyric_trans = ? WHERE id = ?")
                    .bind(live.lrc, live.trans, id)
                    .run()
                );
              }
            }
            return json({ song });
          }
        }
        // 未入库歌曲实时取歌词
        const extSource = url.searchParams.get("ext_source") || "";
        const extId = url.searchParams.get("ext_id") || "";
        const title = url.searchParams.get("title") || "";
        const artist = url.searchParams.get("artist") || "";
        const live = await fetchLiveLyric(extSource, extId, title, artist);
        return json({ song: { id: 0, title, artist, lyric_lrc: live.lrc, lyric_trans: live.trans } });
      }

      if (path === "/api/play") {
        let id = Number(url.searchParams.get("id") || 0);
        const quality = url.searchParams.get("q") || "high";
        const prefer = url.searchParams.get("prefer") || "";
        const force = url.searchParams.get("force") === "1";

        let song = null;
        if (id > 0) {
          song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(id).first();
        } else {
          // 实时搜索到的新歌：点播时自动按 norm_key 懒入库到 D1，越听曲库越全！
          const title = (url.searchParams.get("title") || "").trim();
          const artist = (url.searchParams.get("artist") || "").trim();
          const album = (url.searchParams.get("album") || "").trim();
          const cover = (url.searchParams.get("cover") || "").trim();
          const duration = Number(url.searchParams.get("duration") || 0);
          const extSource = url.searchParams.get("ext_source") || "";
          const extId = url.searchParams.get("ext_id") || "";
          if (!title) return json({ error: "invalid song" }, 400);

          const nk = makeNormKey(title, artist);
          song = await env.DB.prepare("SELECT * FROM songs WHERE norm_key = ?").bind(nk).first();
          if (!song) {
            const idsObj = extSource && extId ? { [extSource]: extId } : {};
            const now = Math.floor(Date.now() / 1000);
            await env.DB.prepare(
              `INSERT INTO songs (norm_key,title,artist,album,cover,duration,category,tags,score,source_ids_json,updated_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?)
               ON CONFLICT(norm_key) DO NOTHING`
            )
              .bind(nk, title, artist || "未知歌手", album, cover, duration, "点播收藏", "", 300, JSON.stringify(idsObj), now)
              .run();
            song = await env.DB.prepare("SELECT * FROM songs WHERE norm_key = ?").bind(nk).first();
          }
          if (song) id = song.id;
        }

        if (!song) return json({ error: "not found" }, 404);

        const cache = caches.default;
        const cacheKey = new Request(`https://cache.internal/play/${id}/${quality}/${prefer || "auto"}`);
        if (!force) {
          const cached = await cache.match(cacheKey);
          if (cached) return cached;
        }

        const resolved = await resolvePlayUrl(song, quality, env, prefer);
        if (!resolved) return json({ error: "暂无可播放的完整音源" }, 502);

        const token = getTokenFromReq(request);
        const proxyUrl = `${url.origin}/api/stream?u=${encodeURIComponent(resolved.url)}&token=${encodeURIComponent(token || "")}`;

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

        const payload = { ...resolved, songId: id, proxyUrl };
        const resp = json(payload, 200, { "Cache-Control": "public, max-age=900" });
        ctx.waitUntil(cache.put(cacheKey, resp.clone()));
        return resp;
      }

      if (path === "/api/stream") {
        const target = url.searchParams.get("u") || "";
        if (!isSafeExternalUrl(target)) return json({ error: "invalid stream url" }, 400);

        const fwdHeaders = new Headers({
          "User-Agent": UA,
          Referer: target.includes("bilivideo") ? "https://www.bilibili.com/" : "",
        });
        const range = request.headers.get("Range");
        if (range) fwdHeaders.set("Range", range);

        const upstream = await fetch(target, { headers: fwdHeaders });
        const outHeaders = new Headers();
        for (const h of ["content-type", "content-length", "content-range", "accept-ranges"]) {
          const val = upstream.headers.get(h);
          if (val) outHeaders.set(h, val);
        }
        outHeaders.set("Access-Control-Allow-Origin", "*");
        if (!outHeaders.has("accept-ranges")) outHeaders.set("Accept-Ranges", "bytes");
        return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
      }

      if (path === "/api/mf-plugin.js") {
        const base = `${url.protocol}//${url.host}`;
        const js = `"use strict";
const axios = require("axios");
const BASE = "${base}";
const TOKEN = "${env.ACCESS_TOKEN || ""}";
const H = TOKEN ? { "X-Access-Token": TOKEN } : {};
module.exports = {
  platform: "MusicHub·自建云端",
  author: "MusicHub",
  version: "1.2.0",
  cacheControl: "no-cache",
  supportedSearchType: ["music"],
  async search(query, page, type) {
    if (type !== "music" || page > 1) return { isEnd: true, data: [] };
    const { data } = await axios.get(BASE + "/api/search", { params: { q: query }, headers: H, timeout: 10000 });
    return {
      isEnd: true,
      data: (data.songs || []).map((s) => ({
        id: String(s.id || 0), title: s.title, artist: s.artist, album: s.album, artwork: s.cover, duration: s.duration,
        ext_source: s.ext_source || "", ext_id: s.ext_id || ""
      }))
    };
  },
  async getMediaSource(item, quality) {
    const { data } = await axios.get(BASE + "/api/play", {
      params: { id: item.id || 0, q: quality || "high", ext_source: item.ext_source, ext_id: item.ext_id, title: item.title, artist: item.artist, album: item.album, cover: item.artwork, duration: item.duration },
      headers: H, timeout: 14000
    });
    return { url: data.url, headers: data.headers };
  },
  async getLyric(item) {
    const { data } = await axios.get(BASE + "/api/song", {
      params: { id: item.id || 0, ext_source: item.ext_source, ext_id: item.ext_id, title: item.title, artist: item.artist },
      headers: H, timeout: 8000
    });
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
    const { data } = await axios.get(BASE + "/api/chart", { params: { id: topListItem.id }, headers: H, timeout: 10000 });
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
          plugins: [{ name: "MusicHub·自建云端", url: `${base}/api/mf-plugin.js${qs}`, version: "1.2.0" }],
        });
      }

      return json({ error: "Not Found" }, 404);
    } catch (err) {
      return json({ error: err?.message || String(err) }, 500);
    }
  },
};

// ================= PWA 网页播放器 UI (/player) =================
const PLAYER_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="referrer" content="no-referrer" />
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<title>Music Hub</title>
<style>
  :root{--bg:#0b0f19;--card:#151c2c;--text:#f1f5f9;--muted:#94a3b8;--acc:#38bdf8;--acc2:#818cf8;}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding-bottom:130px;}
  header{position:sticky;top:0;z-index:20;background:rgba(11,15,25,.86);backdrop-filter:blur(16px);padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;gap:10px;align-items:center;}
  .brand{font-weight:700;font-size:17px;background:linear-gradient(90deg,var(--acc),var(--acc2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;white-space:nowrap;}
  .search{flex:1;display:flex;gap:6px;}
  input{width:100%;background:var(--card);border:1px solid rgba(255,255,255,.1);color:var(--text);padding:8px 12px;border-radius:10px;font-size:14px;outline:none;}
  button{background:var(--acc);color:#06121f;border:none;padding:8px 14px;border-radius:10px;font-weight:600;cursor:pointer;font-size:13px;white-space:nowrap;}
  button.ghost{background:rgba(255,255,255,.08);color:var(--text);}
  button.pill{padding:5px 12px;border-radius:20px;font-size:12px;background:rgba(255,255,255,.07);color:var(--muted);}
  button.pill.active{background:var(--acc);color:#06121f;}
  main{max-width:980px;margin:0 auto;padding:16px;}
  .section-title{font-size:15px;font-weight:700;margin:16px 0 10px;color:#cbd5e1;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;}
  .pills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
  .artists{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:10px;margin-bottom:22px;}
  .artist-card{background:var(--card);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:12px 8px;text-align:center;cursor:pointer;transition:transform .15s;}
  .artist-card:active{transform:scale(.96);}
  .avatar{width:54px;height:54px;border-radius:50%;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:19px;color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.3);}
  .artist-card .an{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .artist-card .at{font-size:11px;color:var(--muted);margin-top:2px;}
  .charts{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;}
  .chart-card{background:var(--card);border-radius:14px;overflow:hidden;cursor:pointer;border:1px solid rgba(255,255,255,.05);transition:transform .15s;}
  .chart-card:active{transform:scale(.97);}
  .chart-card img{width:100%;aspect-ratio:1/1;object-fit:cover;background:#1e293b;display:block;}
  .chart-card .info{padding:8px 10px;}
  .chart-card .t{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .chart-card .c{font-size:11px;color:var(--muted);margin-top:2px;}
  .songs{display:flex;flex-direction:column;gap:8px;}
  .song-row{display:flex;align-items:center;gap:12px;background:var(--card);padding:8px 12px;border-radius:12px;cursor:pointer;border:1px solid rgba(255,255,255,.04);}
  .song-row.active{border-color:var(--acc);background:rgba(56,189,248,.1);}
  .song-row img{width:44px;height:44px;border-radius:8px;object-fit:cover;background:#1e293b;flex-shrink:0;}
  .song-row .meta{flex:1;min-width:0;}
  .song-row .st{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .song-row .sa{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
  .badge{font-size:11px;padding:2px 6px;border-radius:6px;background:rgba(255,255,255,.08);color:var(--muted);}
  .player-bar{position:fixed;left:0;right:0;bottom:0;z-index:30;background:rgba(15,23,42,.94);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.08);padding:10px 16px calc(10px + env(safe-area-inset-bottom));}
  .p-top{max-width:980px;margin:0 auto;display:flex;align-items:center;gap:12px;}
  .p-cover{width:46px;height:46px;border-radius:50%;object-fit:cover;background:#1e293b;flex-shrink:0;}
  .p-cover.spin{animation:spin 16s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .p-info{flex:1;min-width:0;cursor:pointer;}
  .p-controls{display:flex;gap:8px;align-items:center;}
  .progress-wrap{max-width:980px;margin:6px auto 0;display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted);}
  .progress-wrap input[type=range]{flex:1;padding:0;height:4px;accent-color:var(--acc);}
  .lyric-modal{position:fixed;inset:0;z-index:40;background:rgba(11,15,25,.97);display:none;flex-direction:column;padding:20px 16px calc(20px + env(safe-area-inset-bottom));}
  .lyric-modal.open{display:flex;}
  .lrc-box{flex:1;overflow-y:auto;text-align:center;padding:30vh 10px;scroll-behavior:smooth;}
  .lrc-line{padding:8px 0;font-size:15px;color:var(--muted);transition:all .2s;line-height:1.5;}
  .lrc-line.cur{color:#fff;font-size:18px;font-weight:700;transform:scale(1.03);}
  .lrc-line small{display:block;font-size:12px;color:#64748b;}
  .auth-box{max-width:380px;margin:15vh auto;background:var(--card);padding:24px;border-radius:16px;text-align:center;}
</style>
</head>
<body>
<header>
  <div class="brand" onclick="goHome()" style="cursor:pointer;">Music Hub</div>
  <div class="search">
    <input id="qInput" placeholder="搜全网歌名 / 歌手（如 张学友）..." onkeydown="if(event.key==='Enter')doSearch()" />
    <button onclick="doSearch()">搜索</button>
  </div>
  <button class="ghost" onclick="openTimer()">定时</button>
  <button class="ghost" onclick="location.href='/admin'">后台</button>
</header>

<main id="app"></main>

<div class="player-bar" id="pBar" style="display:none;">
  <div class="p-top">
    <img id="pCover" class="p-cover" referrerpolicy="no-referrer" src="" onclick="toggleLyricModal(true)" />
    <div class="p-info" onclick="toggleLyricModal(true)">
      <div class="st" id="pTitle">未播放</div>
      <div class="sa" id="pArtist">点击选歌开始播放</div>
    </div>
    <div class="p-controls">
      <button class="ghost" onclick="prevSong()">上一首</button>
      <button id="playBtn" onclick="togglePlay()">播放</button>
      <button class="ghost" onclick="nextSong()">下一首</button>
    </div>
  </div>
  <div class="progress-wrap">
    <span id="curT">0:00</span>
    <input type="range" id="seek" min="0" max="100" value="0" oninput="seekTo(this.value)" />
    <span id="durT">0:00</span>
    <button class="ghost" style="padding:3px 8px;font-size:11px;" onclick="switchBili()">换B站源</button>
  </div>
</div>

<div class="lyric-modal" id="lrcModal">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <div>
      <div id="mTitle" style="font-weight:700;font-size:16px;"></div>
      <div id="mArtist" style="font-size:12px;color:var(--muted);"></div>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="ghost" onclick="switchBili()">换B站源</button>
      <button class="ghost" onclick="toggleLyricModal(false)">收起</button>
    </div>
  </div>
  <div class="lrc-box" id="lrcBox"></div>
</div>

<audio id="audio" preload="auto"></audio>

<script>
var TOKEN = new URLSearchParams(location.search).get("token") || localStorage.getItem("mh_token") || "";
if (new URLSearchParams(location.search).get("token")) localStorage.setItem("mh_token", TOKEN);

var chartsCache = [];
var artistsCache = [];
var artistCat = "全部";
var queue = [];
var curIdx = -1;
var lrcRows = [];
var timerId = null;
var audio = document.getElementById("audio");
var GRADS = [
  "linear-gradient(135deg,#0284c7,#6366f1)",
  "linear-gradient(135deg,#db2777,#f43f5e)",
  "linear-gradient(135deg,#059669,#10b981)",
  "linear-gradient(135deg,#d97706,#f59e0b)",
  "linear-gradient(135deg,#7c3aed,#a855f7)"
];

function api(path) {
  var sep = path.indexOf("?") >= 0 ? "&" : "?";
  return fetch(path + sep + "token=" + encodeURIComponent(TOKEN)).then(function(r) {
    if (r.status === 401) { showAuth(); throw new Error("401"); }
    return r.json();
  });
}

function showAuth() {
  document.getElementById("app").innerHTML =
    '<div class="auth-box"><h3 style="margin-bottom:10px;">输入访问密钥</h3>' +
    '<p style="font-size:12px;color:var(--muted);margin-bottom:14px;">对应 Cloudflare 中的 ACCESS_TOKEN</p>' +
    '<input id="tkIn" type="password" placeholder="输入 ACCESS_TOKEN" style="margin-bottom:12px;" />' +
    '<button style="width:100%;" onclick="saveToken()">进入 Music Hub</button></div>';
}

function saveToken() {
  TOKEN = document.getElementById("tkIn").value.trim();
  localStorage.setItem("mh_token", TOKEN);
  goHome();
}

function goHome() {
  document.getElementById("app").innerHTML = '<div style="padding:30px;text-align:center;color:var(--muted);">加载主页中...</div>';
  api("/api/home").then(function(d) {
    chartsCache = d.charts || [];
    artistsCache = d.artists || [];
    renderHome();
  }).catch(function(){});
}

function setArtistCat(cat) {
  artistCat = cat;
  renderHome();
}

function renderHome() {
  var cats = ["全部", "华语男", "华语女", "乐队组合", "日韩", "欧美", "ACG"];
  var html = '<div class="section-title"><span>热门歌手</span><span class="badge">点击听代表作</span></div><div class="pills">';
  for (var k = 0; k < cats.length; k++) {
    html += '<button class="pill' + (artistCat === cats[k] ? " active" : "") + '" onclick="setArtistCat(\\'' + cats[k] + '\\')">' + cats[k] + '</button>';
  }
  html += '</div><div class="artists">';
  var idx = 0;
  for (var a = 0; a < artistsCache.length; a++) {
    var ar = artistsCache[a];
    if (artistCat !== "全部" && ar.cat !== artistCat) continue;
    var g = GRADS[idx % GRADS.length];
    idx++;
    html += '<div class="artist-card" onclick="openArtist(\\'' + escAttr(ar.name) + '\\')">' +
      '<div class="avatar" style="background:' + g + '">' + esc(ar.name.slice(0, 1)) + '</div>' +
      '<div class="an">' + esc(ar.name) + '</div><div class="at">' + esc(ar.tag) + '</div></div>';
  }
  html += '</div>';

  html += '<div class="section-title"><span>全网精选榜单</span><span class="badge">' + chartsCache.length + ' 个榜单</span></div><div class="charts">';
  for (var i = 0; i < chartsCache.length; i++) {
    var c = chartsCache[i];
    html += '<div class="chart-card" onclick="openChart(\\'' + c.id + '\\')">' +
      '<img loading="lazy" referrerpolicy="no-referrer" src="' + (c.cover || "") + '" />' +
      '<div class="info"><div class="t">' + esc(c.title) + '</div><div class="c">' + esc(c.category) + '</div></div></div>';
  }
  html += '</div>';
  document.getElementById("app").innerHTML = html;
}

function openArtist(name) {
  document.getElementById("app").innerHTML = '<div style="padding:30px;text-align:center;color:var(--muted);">正在检索 ' + esc(name) + ' 代表作...</div>';
  api("/api/artist?name=" + encodeURIComponent(name)).then(function(d) {
    renderSongs("歌手 · " + name, d.songs || [], true);
  });
}

function openChart(id) {
  document.getElementById("app").innerHTML = '<div style="padding:30px;text-align:center;color:var(--muted);">加载曲目中...</div>';
  api("/api/chart?id=" + encodeURIComponent(id)).then(function(d) {
    renderSongs((d.chart && d.chart.title) || "榜单", d.songs || [], true);
  });
}

function doSearch() {
  var q = document.getElementById("qInput").value.trim();
  if (!q) return goHome();
  document.getElementById("app").innerHTML = '<div style="padding:30px;text-align:center;color:var(--muted);">全网搜索中...</div>';
  api("/api/search?q=" + encodeURIComponent(q)).then(function(d) {
    renderSongs("搜索: " + q, d.songs || [], true);
  });
}

function renderSongs(heading, songs, showBack) {
  queue = songs;
  var html = '<div class="section-title"><span>' + esc(heading) + ' (' + songs.length + ')</span>' +
    (showBack ? '<button class="ghost" onclick="goHome()">返回主页</button>' : '') + '</div><div class="songs">';
  if (!songs.length) html += '<div style="padding:30px;text-align:center;color:var(--muted);">暂无歌曲</div>';
  for (var i = 0; i < songs.length; i++) {
    var s = songs[i];
    var act = (curIdx >= 0 && queue[curIdx] && queue[curIdx].norm_key === s.norm_key) ? " active" : "";
    html += '<div class="song-row' + act + '" onclick="playIndex(' + i + ')">' +
      '<img loading="lazy" referrerpolicy="no-referrer" src="' + (s.cover || "") + '" />' +
      '<div class="meta"><div class="st">' + esc(s.title) + '</div>' +
      '<div class="sa">' + esc(s.artist) + (s.album ? " · " + esc(s.album) : "") + '</div></div>' +
      '<span class="badge">' + esc(s.category || "") + '</span></div>';
  }
  html += '</div>';
  document.getElementById("app").innerHTML = html;
}

function playIndex(idx, prefer) {
  if (idx < 0 || idx >= queue.length) return;
  curIdx = idx;
  var s = queue[idx];
  document.getElementById("pBar").style.display = "block";
  document.getElementById("pCover").src = s.cover || "";
  document.getElementById("pTitle").textContent = s.title + " (解析中...)";
  document.getElementById("pArtist").textContent = s.artist;
  document.getElementById("mTitle").textContent = s.title;
  document.getElementById("mArtist").textContent = s.artist;

  var qUrl = "/api/play?id=" + (s.id || 0) + "&q=high" +
    "&ext_source=" + encodeURIComponent(s.ext_source || "") +
    "&ext_id=" + encodeURIComponent(s.ext_id || "") +
    "&title=" + encodeURIComponent(s.title || "") +
    "&artist=" + encodeURIComponent(s.artist || "") +
    "&album=" + encodeURIComponent(s.album || "") +
    "&cover=" + encodeURIComponent(s.cover || "") +
    "&duration=" + (s.duration || 0) +
    (prefer ? "&prefer=" + prefer + "&force=1" : "");

  api(qUrl).then(function(res) {
    if (res.error) {
      document.getElementById("pTitle").textContent = s.title + " (无可用源)";
      return;
    }
    if (res.songId) s.id = res.songId;
    var playUrl = res.needProxy ? res.proxyUrl : res.url;
    audio.src = playUrl;
    audio.play().catch(function(){});
    document.getElementById("pTitle").textContent = s.title + " [" + (res.source || "") + "]";
    document.getElementById("playBtn").textContent = "暂停";
    document.getElementById("pCover").classList.add("spin");
  });

  var lrcUrl = "/api/song?id=" + (s.id || 0) +
    "&ext_source=" + encodeURIComponent(s.ext_source || "") +
    "&ext_id=" + encodeURIComponent(s.ext_id || "") +
    "&title=" + encodeURIComponent(s.title || "") +
    "&artist=" + encodeURIComponent(s.artist || "");
  api(lrcUrl).then(function(d) {
    parseLrc((d.song && d.song.lyric_lrc) || "", (d.song && d.song.lyric_trans) || "");
  });
}

function switchBili() { if (curIdx >= 0) playIndex(curIdx, "bili"); }
function togglePlay() {
  if (audio.paused) { audio.play(); document.getElementById("playBtn").textContent = "暂停"; document.getElementById("pCover").classList.add("spin"); }
  else { audio.pause(); document.getElementById("playBtn").textContent = "播放"; document.getElementById("pCover").classList.remove("spin"); }
}
function prevSong() { playIndex(curIdx > 0 ? curIdx - 1 : queue.length - 1); }
function nextSong() { playIndex((curIdx + 1) % queue.length); }
function seekTo(v) { if (audio.duration) audio.currentTime = (v / 100) * audio.duration; }
audio.addEventListener("ended", nextSong);
audio.addEventListener("timeupdate", function() {
  var c = audio.currentTime || 0, d = audio.duration || 0;
  document.getElementById("curT").textContent = fmt(c);
  document.getElementById("durT").textContent = fmt(d);
  if (d > 0) document.getElementById("seek").value = (c / d) * 100;
  highlightLrc(c);
});

function parseLrc(raw, transRaw) {
  lrcRows = [];
  var transMap = {};
  (transRaw || "").split(/\\r?\\n/).forEach(function(line) {
    var m = line.match(/\\[(\\d+):(\\d+(?:\\.\\d+)?)\\](.*)/);
    if (m) transMap[Math.round((Number(m[1]) * 60 + Number(m[2])) * 10)] = m[3].trim();
  });
  (raw || "").split(/\\r?\\n/).forEach(function(line) {
    var m = line.match(/\\[(\\d+):(\\d+(?:\\.\\d+)?)\\](.*)/);
    if (m) {
      var t = Number(m[1]) * 60 + Number(m[2]);
      var txt = m[3].trim();
      if (txt) lrcRows.push({ t: t, txt: txt, tr: transMap[Math.round(t * 10)] || "" });
    }
  });
  var box = document.getElementById("lrcBox");
  if (!lrcRows.length) {
    box.innerHTML = '<div class="lrc-line">暂无滚动歌词</div>';
    return;
  }
  box.innerHTML = lrcRows.map(function(r, i) {
    return '<div class="lrc-line" id="lr' + i + '">' + esc(r.txt) + (r.tr ? '<small>' + esc(r.tr) + '</small>' : '') + '</div>';
  }).join("");
}

function highlightLrc(sec) {
  if (!lrcRows.length) return;
  var active = -1;
  for (var i = 0; i < lrcRows.length; i++) {
    if (sec >= lrcRows[i].t) active = i; else break;
  }
  var lines = document.querySelectorAll(".lrc-line");
  for (var j = 0; j < lines.length; j++) {
    if (j === active) {
      if (!lines[j].classList.contains("cur")) {
        lines[j].classList.add("cur");
        lines[j].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else lines[j].classList.remove("cur");
  }
}

function toggleLyricModal(open) {
  document.getElementById("lrcModal").classList.toggle("open", open);
}
function openTimer() {
  var m = prompt("多少分钟后自动停止播放？（输入 0 取消定时）", "30");
  if (m === null) return;
  clearTimeout(timerId);
  var mins = Number(m);
  if (mins > 0) {
    timerId = setTimeout(function() { audio.pause(); document.getElementById("playBtn").textContent = "播放"; }, mins * 60000);
    alert("已设置 " + mins + " 分钟后停止播放");
  }
}
function fmt(s) { var m = Math.floor(s / 60), r = Math.floor(s % 60); return m + ":" + (r < 10 ? "0" : "") + r; }
function esc(s) { return String(s || "").replace(/[&<>"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function escAttr(s) { return String(s || "").replace(/'/g, "\\\\'"); }

goHome();
</script>
</body>
</html>`;

// ================= 管理后台 UI (/admin) =================
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Music Hub 管理后台</title>
<style>
  body{background:#0b0f19;color:#f1f5f9;font-family:-apple-system,sans-serif;max-width:960px;margin:0 auto;padding:20px;}
  .card{background:#151c2c;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;margin-bottom:16px;}
  h2,h3{margin:0 0 12px;}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;}
  .stat{background:#0f172a;padding:12px;border-radius:10px;text-align:center;}
  .stat b{font-size:22px;color:#38bdf8;display:block;}
  input,select{background:#0f172a;border:1px solid #334155;color:#fff;padding:7px 10px;border-radius:8px;font-size:13px;}
  button{background:#38bdf8;color:#06121f;border:none;padding:7px 12px;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;}
  button.red{background:#ef4444;color:#fff;}
  button.ghost{background:#334155;color:#fff;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  td,th{padding:8px;border-bottom:1px solid rgba(255,255,255,.06);text-align:left;}
  .row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}
</style>
</head>
<body>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
  <h2>Music Hub 管理后台</h2>
  <button class="ghost" onclick="location.href='/player'">返回播放器</button>
</div>
<div id="main"></div>
<script>
var PWD = sessionStorage.getItem("mh_admin") || "";
function req(path, opts) {
  opts = opts || {};
  opts.headers = Object.assign({ "Content-Type": "application/json", "X-Admin-Password": PWD }, opts.headers || {});
  return fetch(path, opts).then(function(r) {
    if (r.status === 401) { renderLogin(); throw new Error("401"); }
    return r.json();
  });
}
function renderLogin() {
  document.getElementById("main").innerHTML =
    '<div class="card" style="max-width:360px;margin:40px auto;"><h3>输入后台管理密码</h3>' +
    '<div class="row"><input id="pw" type="password" placeholder="ADMIN_PASSWORD" style="flex:1;" />' +
    '<button onclick="doLogin()">登录</button></div></div>';
}
function doLogin() {
  PWD = document.getElementById("pw").value;
  sessionStorage.setItem("mh_admin", PWD);
  loadStats();
}
function loadStats() {
  req("/api/admin/stats").then(function(d) {
    var st = d.stats || {};
    var h = '<div class="card"><div class="grid">' +
      '<div class="stat"><b>' + (st.songs||0) + '</b>可用歌曲</div>' +
      '<div class="stat"><b>' + (st.charts||0) + '</b>精选榜单</div>' +
      '<div class="stat"><b>' + (st.lyrics||0) + '</b>已存歌词</div>' +
      '<div class="stat"><b>' + (st.blocked||0) + '</b>已屏蔽</div>' +
      '</div></div>';

    h += '<div class="card"><h3>音源解析池（可热插拔与测活）</h3><table><tr><th>ID</th><th>名称</th><th>类型</th><th>优先级</th><th>状态</th><th>操作</th></tr>';
    (d.sources || []).forEach(function(s) {
      h += '<tr><td>' + s.id + '</td><td>' + s.name + '<br><small style="color:#94a3b8;">' + s.endpoint + '</small></td>' +
        '<td>' + s.type + '</td><td>' + s.priority + '</td><td>' + (s.enabled ? "启用" : "停用") + '</td>' +
        '<td><button onclick="testSrc(\\'' + s.id + '\\')">测活</button> ' +
        '<button class="ghost" onclick="toggleSrc(\\'' + s.id + '\\',\\'' + s.name + '\\',\\'' + s.type + '\\',\\'' + s.endpoint + '\\',' + s.priority + ',' + (s.enabled?0:1) + ')">' + (s.enabled?"停用":"启用") + '</button></td></tr>';
    });
    h += '</table><div class="row" style="margin-top:12px;">' +
      '<input id="sid" placeholder="ID 如 myapi" style="width:90px;" />' +
      '<input id="sname" placeholder="名称" style="width:120px;" />' +
      '<select id="stype"><option value="agg">agg 聚合</option><option value="native">native</option></select>' +
      '<input id="send" placeholder="Endpoint URL" style="flex:1;" />' +
      '<input id="spri" type="number" value="20" style="width:65px;" />' +
      '<button onclick="addSrc()">新增/更新音源</button></div></div>';

    h += '<div class="card"><h3>屏蔽歌曲 / 清除错误 B 站缓存</h3>' +
      '<div class="row"><input id="bid" type="number" placeholder="输入歌曲 ID" />' +
      '<button class="red" onclick="setBlock(1)">屏蔽该歌</button>' +
      '<button class="ghost" onclick="setBlock(0)">取消屏蔽</button>' +
      '<button class="ghost" onclick="resetBili()">重置B站BVID</button></div>' +
      '<div style="font-size:12px;color:#94a3b8;">已屏蔽列表：' + (d.blocked || []).map(function(b){return "#" + b.id + " " + b.title + "(" + b.artist + ")";}).join("、") + '</div></div>';

    document.getElementById("main").innerHTML = h;
  }).catch(function(){});
}
function testSrc(id) {
  req("/api/admin/source/test", { method: "POST", body: JSON.stringify({ id: id }) }).then(function(r) {
    alert(r.ok ? ("测活正常！HTTP " + r.status + "，耗时 " + r.ms + "ms") : ("测活异常：" + (r.error || r.status)));
  });
}
function toggleSrc(id, name, type, endpoint, priority, enabled) {
  req("/api/admin/source", { method: "POST", body: JSON.stringify({ id:id, name:name, type:type, endpoint:endpoint, priority:priority, enabled:enabled }) }).then(loadStats);
}
function addSrc() {
  req("/api/admin/source", {
    method: "POST",
    body: JSON.stringify({
      id: document.getElementById("sid").value,
      name: document.getElementById("sname").value,
      type: document.getElementById("stype").value,
      endpoint: document.getElementById("send").value,
      priority: Number(document.getElementById("spri").value),
      enabled: 1
    })
  }).then(loadStats);
}
function setBlock(blocked) {
  var id = document.getElementById("bid").value;
  if (!id) return;
  req("/api/admin/song/block", { method: "POST", body: JSON.stringify({ id: id, blocked: blocked }) }).then(loadStats);
}
function resetBili() {
  var id = document.getElementById("bid").value;
  if (!id) return;
  req("/api/admin/song/reset-bili", { method: "POST", body: JSON.stringify({ id: id }) }).then(function(){ alert("已清除该曲 B 站缓存，下次播放重新匹配"); });
}
loadStats();
</script>
</body>
</html>`;
