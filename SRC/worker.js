const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const NE_HEADERS = {
  "User-Agent": UA,
  Referer: "https://music.163.com/",
  Cookie: "os=pc; appver=2.9.7",
};

const PRESET_ARTISTS = [
  { name: "周杰伦", cat: "华语男", tag: "华语流行" },
  { name: "张学友", cat: "经典怀旧", tag: "经典歌神" },
  { name: "陈奕迅", cat: "华语男", tag: "华语流行" },
  { name: "林俊杰", cat: "华语男", tag: "华语流行" },
  { name: "陶喆", cat: "华语男", tag: "R&B" },
  { name: "王力宏", cat: "华语男", tag: "华语流行" },
  { name: "薛之谦", cat: "华语男", tag: "流行情歌" },
  { name: "许嵩", cat: "华语男", tag: "原创" },
  { name: "毛不易", cat: "华语男", tag: "民谣流行" },
  { name: "邓紫棋", cat: "华语女", tag: "华语流行" },
  { name: "王菲", cat: "经典怀旧", tag: "经典天后" },
  { name: "孙燕姿", cat: "华语女", tag: "华语经典" },
  { name: "梁静茹", cat: "华语女", tag: "情歌" },
  { name: "田馥甄", cat: "华语女", tag: "文艺流行" },
  { name: "蔡依林", cat: "华语女", tag: "唱跳流行" },
  { name: "莫文蔚", cat: "经典怀旧", tag: "经典情歌" },
  { name: "邓丽君", cat: "经典怀旧", tag: "时代金曲" },
  { name: "张国荣", cat: "经典怀旧", tag: "粤语传奇" },
  { name: "李宗盛", cat: "经典怀旧", tag: "华语宗师" },
  { name: "刘德华", cat: "经典怀旧", tag: "四大天王" },
  { name: "伍佰", cat: "经典怀旧", tag: "摇滚经典" },
  { name: "Beyond", cat: "经典怀旧", tag: "粤语摇滚" },
  { name: "五月天", cat: "乐队组合", tag: "摇滚乐团" },
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

function fetchTimeout(url, opts = {}, ms = 6000) {
  return fetch(url, { ...opts, signal: AbortSignal.timeout(ms) });
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
  return getTokenFromReq(request) === String(env.ACCESS_TOKEN).trim();
}

async function digestHex(algo, text) {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algo, buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function getAdminSessionToken(env) {
  return digestHex("SHA-256", "mh_admin_v1:" + String(env.ADMIN_PASSWORD || "").trim());
}

async function checkAdmin(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const expected = await getAdminSessionToken(env);
  const url = new URL(request.url);
  const token = request.headers.get("X-Admin-Token") || url.searchParams.get("atoken") || "";
  return token === expected;
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

function cleanLrcText(raw) {
  if (!raw) return "";
  return raw
    .split(/\r?\n/)
    .filter((line) => !["作词 :", "作曲 :", "编曲 :", "制作人 :", "QQ音乐", "网易云"].some((k) => line.includes(k)))
    .join("\n")
    .trim();
}

async function liveSearchSongs(query, limit = 30) {
  const out = [];
  const seen = new Set();

  for (const endpoint of [
    `https://music.163.com/api/cloudsearch/pc?s=${encodeURIComponent(query)}&type=1&limit=${limit}&offset=0`,
    `https://music.163.com/api/search/get?s=${encodeURIComponent(query)}&type=1&limit=${limit}&offset=0`,
  ]) {
    try {
      const r = await fetchTimeout(endpoint, { headers: NE_HEADERS }, 5500);
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

  if (out.length < 5) {
    try {
      const r = await fetchTimeout(
        `https://music-api.gdstudio.xyz/api.php?types=search&source=netease,kuwo&name=${encodeURIComponent(query)}&count=20&pages=1`,
        { headers: { "User-Agent": UA } },
        5500
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

async function verifyAudioUrl(url, sizeKb, durationSec) {
  if (!url || !url.startsWith("http") || url.includes("panspace.kuwo.cn")) return false;
  if (sizeKb && durationSec >= 90 && Number(sizeKb) < 550) return false;
  try {
    const res = await fetchTimeout(url, { headers: { Range: "bytes=0-1023", "User-Agent": UA } }, 4500);
    if (res.body) res.body.cancel().catch(() => {});
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

const MIXIN_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33,
  9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26,
  17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34,
  44, 52,
];

async function resolveBilibili(title, artist, durationSec, fixedBvid) {
  try {
    const [spiR, navR] = await Promise.all([
      fetchTimeout("https://api.bilibili.com/x/frontend/finger/spi", {
        headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" },
      }, 5000),
      fetchTimeout("https://api.bilibili.com/x/web-interface/nav", {
        headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" },
      }, 5000),
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
      const w_rid = await digestHex("MD5", q + mixinKey);
      const sRes = await fetchTimeout(
        `https://api.bilibili.com/x/web-interface/wbi/search/type?${q}&w_rid=${w_rid}`,
        { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/", Cookie: cookie } },
        6000
      );
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

    const pRes = await fetchTimeout(
      `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`,
      { headers: { "User-Agent": UA, Referer: "https://www.bilibili.com/" } },
      5000
    );
    const cid = (await pRes.json())?.data?.[0]?.cid;
    if (!cid) return null;

    const uRes = await fetchTimeout(
      `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=80&fnval=4048&otype=json`,
      { headers: { "User-Agent": UA, Referer: `https://www.bilibili.com/video/${bvid}`, Cookie: cookie } },
      6000
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
      const r = await fetchTimeout(u, { headers: { "User-Agent": UA } }, 5000);
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
      const r = await fetchTimeout(`https://monster-siren.hypergryph.com/api/song/${ids.msr}`, {}, 5000);
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
        const sRes = await fetchTimeout(
          `${src.endpoint}?types=search&source=${plat}&name=${encodeURIComponent(kw)}&count=3&pages=1`,
          { headers: { "User-Agent": UA } },
          4500
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
      const probe = await fetchTimeout(outer, { method: "HEAD", redirect: "follow", headers: { "User-Agent": UA } }, 4500);
      if (probe.ok && !probe.url.includes("404") && (await verifyAudioUrl(probe.url, 0, song.duration))) {
        return { url: probe.url, source: "netease_direct" };
      }
    } catch {}
  }

  const bili = await resolveBilibili(song.title, song.artist, song.duration, ids.bili);
  if (bili) return bili;

  return null;
}

async function fetchLiveLyric(extSource, extId, title, artist) {
  if (extSource === "netease" && extId) {
    try {
      const r = await fetchTimeout(`https://music.163.com/api/song/lyric?id=${extId}&lv=-1&kv=-1&tv=-1`, { headers: NE_HEADERS }, 5000);
      const d = await r.json();
      const lrc = cleanLrcText(d?.lrc?.lyric || "");
      const trans = cleanLrcText(d?.tlyric?.lyric || "");
      if (lrc) return { lrc, trans };
    } catch {}
  }
  if (extSource === "msr" && extId) {
    try {
      const r = await fetchTimeout(`https://monster-siren.hypergryph.com/api/song/${extId}`, {}, 5000);
      const lrcUrl = (await r.json())?.data?.lyricUrl;
      if (lrcUrl) {
        const lr = await fetchTimeout(lrcUrl, {}, 5000);
        const txt = cleanLrcText(await lr.text());
        if (txt) return { lrc: txt, trans: "" };
      }
    } catch {}
  }
  try {
    const cleanArtist = (artist || "").split(/[/,、&]/)[0].trim();
    const r = await fetchTimeout(
      `https://lrclib.net/api/get?track_name=${encodeURIComponent(normalizeName(title))}&artist_name=${encodeURIComponent(cleanArtist)}`,
      {},
      5000
    );
    if (r.ok) {
      const d = await r.json();
      const txt = d?.syncedLyrics || d?.plainLyrics || "";
      if (txt) return { lrc: txt, trans: "" };
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

      if (path === "/api/admin/login" && request.method === "POST") {
        if (!env.ADMIN_PASSWORD) {
          return json({
            error: "Cloudflare 后台尚未检测到 ADMIN_PASSWORD！请确认你在 Settings -> Variables and Secrets 中选的是【Secret】类型并点击了 Deploy。"
          }, 401);
        }
        const body = await request.json().catch(() => ({}));
        if (String(body.password || "").trim() !== String(env.ADMIN_PASSWORD).trim()) {
          return json({ error: "后台密码不正确，请核对 ADMIN_PASSWORD" }, 401);
        }
        return json({ ok: true, token: await getAdminSessionToken(env) });
      }

      if (path.startsWith("/api/admin/")) {
        if (!(await checkAdmin(request, env))) {
          return json({ error: env.ADMIN_PASSWORD ? "会话已过期，请重新登录" : "未配置 ADMIN_PASSWORD Secret" }, 401);
        }

        if (path === "/api/admin/stats" && request.method === "GET") {
          const [sCount, bCount, cCount, lCount, cats, srcs, charts, junk] = await Promise.all([
            env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=0").first(),
            env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=1").first(),
            env.DB.prepare("SELECT COUNT(*) AS c FROM charts").first(),
            env.DB.prepare("SELECT COUNT(*) AS c FROM songs WHERE is_blocked=0 AND length(lyric_lrc) > 10").first(),
            env.DB.prepare("SELECT category, COUNT(*) AS c FROM songs WHERE is_blocked=0 GROUP BY category ORDER BY c DESC").all(),
            env.DB.prepare("SELECT * FROM sources ORDER BY priority ASC").all(),
            env.DB.prepare("SELECT id,title,category,sort_order,length(song_ids_json) AS jlen FROM charts ORDER BY sort_order ASC").all(),
            env.DB.prepare("SELECT value FROM settings WHERE key='junk_words'").first(),
          ]);
          return json({
            stats: {
              songs: sCount?.c || 0,
              blocked: bCount?.c || 0,
              charts: cCount?.c || 0,
              lyrics: lCount?.c || 0,
            },
            categories: cats.results || [],
            sources: srcs.results || [],
            charts: charts.results || [],
            junkWords: junk?.value || JUNK_WORDS.join(","),
          });
        }

        if (path === "/api/admin/songs" && request.method === "GET") {
          const q = (url.searchParams.get("q") || "").trim();
          const cat = (url.searchParams.get("cat") || "").trim();
          const filter = url.searchParams.get("filter") || "all";
          const sort = url.searchParams.get("sort") || "score";
          const page = Math.max(1, Number(url.searchParams.get("page") || 1));
          const limit = 25;
          const offset = (page - 1) * limit;

          const conds = [];
          const params = [];
          if (q) {
            conds.push("(title LIKE ? OR artist LIKE ? OR album LIKE ?)");
            params.push(`%${q}%`, `%${q}%`, `%${q}%`);
          }
          if (cat) {
            conds.push("category = ?");
            params.push(cat);
          }
          if (filter === "active") conds.push("is_blocked = 0");
          else if (filter === "blocked") conds.push("is_blocked = 1");
          else if (filter === "no_lrc") conds.push("is_blocked = 0 AND length(lyric_lrc) <= 10");
          else if (filter === "has_lrc") conds.push("is_blocked = 0 AND length(lyric_lrc) > 10");

          const where = conds.length ? "WHERE " + conds.join(" AND ") : "";
          const orderBy = sort === "newest" ? "ORDER BY id DESC" : "ORDER BY score DESC, id DESC";

          const totalRow = await env.DB.prepare(`SELECT COUNT(*) AS c FROM songs ${where}`).bind(...params).first();
          const { results } = await env.DB.prepare(
            `SELECT id,title,artist,album,cover,duration,category,score,is_blocked,source_ids_json,length(lyric_lrc) AS lrc_len
             FROM songs ${where} ${orderBy} LIMIT ? OFFSET ?`
          )
            .bind(...params, limit, offset)
            .all();

          return json({ total: totalRow?.c || 0, page, limit, songs: results || [] });
        }

        if (path === "/api/admin/song" && request.method === "GET") {
          const id = Number(url.searchParams.get("id") || 0);
          const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(id).first();
          if (!song) return json({ error: "not found" }, 404);
          return json({ song });
        }

        if (path === "/api/admin/song/update" && request.method === "POST") {
          const b = await request.json();
          const id = Number(b.id);
          if (!id) return json({ error: "invalid id" }, 400);
          const now = Math.floor(Date.now() / 1000);
          if (b.onlyLyric) {
            await env.DB.prepare("UPDATE songs SET lyric_lrc=?, lyric_trans=?, updated_at=? WHERE id=?")
              .bind(String(b.lyric_lrc || ""), String(b.lyric_trans || ""), now, id)
              .run();
          } else {
            await env.DB.prepare(
              `UPDATE songs SET title=?, artist=?, album=?, cover=?, category=?, score=?, source_ids_json=?, updated_at=? WHERE id=?`
            )
              .bind(
                String(b.title || "").trim(),
                String(b.artist || "").trim(),
                String(b.album || "").trim(),
                String(b.cover || "").trim(),
                String(b.category || "华语").trim(),
                Number(b.score || 300),
                String(b.source_ids_json || "{}"),
                now,
                id
              )
              .run();
          }
          return json({ ok: true });
        }

        if (path === "/api/admin/song/delete" && request.method === "POST") {
          const { id } = await request.json();
          await env.DB.prepare("DELETE FROM songs WHERE id = ?").bind(Number(id)).run();
          return json({ ok: true });
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
            await env.DB.prepare("UPDATE songs SET source_ids_json = ? WHERE id = ?").bind(JSON.stringify(ids), Number(id)).run();
          }
          return json({ ok: true });
        }

        if (path === "/api/admin/play" && request.method === "GET") {
          const id = Number(url.searchParams.get("id") || 0);
          const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(id).first();
          if (!song) return json({ error: "not found" }, 404);
          const resolved = await resolvePlayUrl(song, "high", env, url.searchParams.get("prefer") || "");
          if (!resolved) return json({ error: "暂无可用播放源" }, 502);
          const atoken = url.searchParams.get("atoken") || "";
          const proxyUrl = `${url.origin}/api/stream?u=${encodeURIComponent(resolved.url)}&src=${encodeURIComponent(resolved.source || "")}&atoken=${encodeURIComponent(atoken)}`;
          return json({ ...resolved, proxyUrl });
        }

        if (path === "/api/admin/lyric/fetch" && request.method === "POST") {
          const { id } = await request.json();
          const song = await env.DB.prepare("SELECT * FROM songs WHERE id = ?").bind(Number(id)).first();
          if (!song) return json({ error: "not found" }, 404);
          const ids = JSON.parse(song.source_ids_json || "{}");
          const extSrc = ids.netease ? "netease" : ids.msr ? "msr" : "";
          const extId = ids.netease || ids.msr || "";
          const live = await fetchLiveLyric(extSrc, extId, song.title, song.artist);
          return json({ lrc: live.lrc, trans: live.trans });
        }

        if (path === "/api/admin/lyrics/backfill" && request.method === "POST") {
          const body = await request.json().catch(() => ({}));
          const afterId = Number(body.afterId || 0);
          const { results: batch } = await env.DB.prepare(
            `SELECT id,title,artist,source_ids_json FROM songs
             WHERE is_blocked=0 AND length(lyric_lrc) <= 10 AND id > ?
             ORDER BY id ASC LIMIT 10`
          )
            .bind(afterId)
            .all();

          if (!batch || !batch.length) {
            return json({ done: true, processed: 0, updated: 0, lastId: afterId, logs: [] });
          }

          let updated = 0;
          let lastId = afterId;
          const logs = [];
          const now = Math.floor(Date.now() / 1000);

          for (const s of batch) {
            lastId = s.id;
            const ids = JSON.parse(s.source_ids_json || "{}");
            const extSrc = ids.netease ? "netease" : ids.msr ? "msr" : "";
            const extId = ids.netease || ids.msr || "";
            const live = await fetchLiveLyric(extSrc, extId, s.title, s.artist);
            if (live.lrc && live.lrc.length > 10) {
              await env.DB.prepare("UPDATE songs SET lyric_lrc=?, lyric_trans=?, updated_at=? WHERE id=?")
                .bind(live.lrc, live.trans, now, s.id)
                .run();
              updated++;
              logs.push(`✓ #${s.id} ${s.title}`);
            } else {
              logs.push(`- #${s.id} ${s.title} (未匹配到歌词)`);
            }
          }

          return json({ done: batch.length < 10, processed: batch.length, updated, lastId, logs });
        }

        if (path === "/api/admin/import-playlist" && request.method === "POST") {
          const body = await request.json();
          const m = String(body.url || "").match(/(?:id=|playlist\/)(\d+)/) || String(body.url || "").trim().match(/^(\d{5,15})$/);
          if (!m) return json({ error: "无法识别网易云歌单 ID 或链接" }, 400);
          const pid = m[1];
          const songCat = String(body.songCategory || "经典").trim();
          const chartCat = String(body.chartCategory || "经典金曲").trim();

          let pl = null;
          for (const ep of [
            `https://music.163.com/api/v6/playlist/detail?id=${pid}&n=100`,
            `https://music.163.com/api/playlist/detail?id=${pid}`,
          ]) {
            try {
              const r = await fetchTimeout(ep, { headers: NE_HEADERS }, 8000);
              const d = await r.json();
              pl = d?.playlist || d?.result;
              if (pl?.tracks?.length) break;
            } catch {}
          }
          if (!pl?.tracks?.length) return json({ error: "歌单抓取为空（可能为私密歌单或被限流）" }, 400);

          const now = Math.floor(Date.now() / 1000);
          const tracks = pl.tracks.slice(0, 100);
          const normKeys = [];
          const stmts = [];

          for (let i = 0; i < tracks.length; i++) {
            const t = tracks[i];
            const title = (t.name || "").trim();
            if (!title) continue;
            const artists = (t.ar || t.artists || []).map((a) => a.name).filter(Boolean).join(" / ") || "未知歌手";
            const nk = makeNormKey(title, artists);
            const alb = t.al || t.album || {};
            const score = Math.max(100, 900 - i * 4);
            normKeys.push(nk);
            stmts.push(
              env.DB.prepare(
                `INSERT INTO songs (norm_key,title,artist,album,cover,duration,category,tags,score,source_ids_json,updated_at)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?)
                 ON CONFLICT(norm_key) DO UPDATE SET
                   score = MAX(songs.score, excluded.score),
                   updated_at = excluded.updated_at`
              ).bind(
                nk, title, artists, alb.name || "", alb.picUrl || "",
                Math.round((t.dt || t.duration || 0) / 1000),
                songCat, "", score, JSON.stringify({ netease: String(t.id) }), now
              )
            );
          }

          for (let i = 0; i < stmts.length; i += 40) {
            await env.DB.batch(stmts.slice(i, i + 40));
          }

          const songIds = [];
          for (let i = 0; i < normKeys.length; i += 60) {
            const chunk = normKeys.slice(i, i + 60);
            const ph = chunk.map(() => "?").join(",");
            const { results } = await env.DB.prepare(`SELECT id,norm_key FROM songs WHERE norm_key IN (${ph})`).bind(...chunk).all();
            const map = new Map((results || []).map((r) => [r.norm_key, r.id]));
            for (const nk of chunk) if (map.has(nk)) songIds.push(map.get(nk));
          }

          const chartTitle = String(body.chartTitle || pl.name || "导入歌单").trim();
          await env.DB.prepare(
            `INSERT INTO charts (id,title,category,cover,description,song_ids_json,sort_order,updated_at)
             VALUES (?,?,?,?,?,?,?,?)
             ON CONFLICT(id) DO UPDATE SET title=excluded.title,category=excluded.category,cover=excluded.cover,song_ids_json=excluded.song_ids_json,updated_at=excluded.updated_at`
          )
            .bind(
              `ne_${pid}`, chartTitle, chartCat, pl.coverImgUrl || "",
              (pl.description || "").slice(0, 120), JSON.stringify(songIds), 45, now
            )
            .run();

          return json({ ok: true, title: chartTitle, importedCount: songIds.length });
        }

        if (path === "/api/admin/chart/update" && request.method === "POST") {
          const b = await request.json();
          await env.DB.prepare("UPDATE charts SET title=?, category=?, sort_order=? WHERE id=?")
            .bind(String(b.title || "").trim(), String(b.category || "").trim(), Number(b.sort_order || 50), String(b.id))
            .run();
          return json({ ok: true });
        }
        if (path === "/api/admin/chart/delete" && request.method === "POST") {
          const { id } = await request.json();
          await env.DB.prepare("DELETE FROM charts WHERE id = ?").bind(String(id)).run();
          return json({ ok: true });
        }
        if (path === "/api/admin/settings" && request.method === "POST") {
          const { junkWords } = await request.json();
          await env.DB.prepare(
            "INSERT INTO settings (key, value) VALUES ('junk_words', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value"
          ).bind(String(junkWords || "")).run();
          return json({ ok: true });
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
        if (path === "/api/admin/source/delete" && request.method === "POST") {
          const { id } = await request.json();
          await env.DB.prepare("DELETE FROM sources WHERE id = ?").bind(String(id)).run();
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
            const r = await fetchTimeout(testUrl, { headers: { "User-Agent": UA } }, 6000);
            return json({ ok: r.ok, status: r.status, ms: Date.now() - t0 });
          } catch (e) {
            return json({ ok: false, error: e.message, ms: Date.now() - t0 });
          }
        }
        return json({ error: "Unknown admin route" }, 404);
      }

      if (path === "/api/stream") {
        const ok = checkToken(request, env) || (await checkAdmin(request, env));
        if (!ok) return json({ error: "Unauthorized" }, 401);
        const target = url.searchParams.get("u") || "";
        const src = url.searchParams.get("src") || "";
        if (!isSafeExternalUrl(target)) return json({ error: "invalid stream url" }, 400);

        const fwdHeaders = new Headers({ "User-Agent": UA });
        if (src === "bili" || target.includes("bilivideo")) {
          fwdHeaders.set("Referer", "https://www.bilibili.com/");
        }
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
              const extSrc = ids.netease ? "netease" : ids.msr ? "msr" : "";
              const extId = ids.netease || ids.msr || "";
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
        const proxyUrl = `${url.origin}/api/stream?u=${encodeURIComponent(resolved.url)}&src=${encodeURIComponent(resolved.source || "")}&token=${encodeURIComponent(token || "")}`;

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
  version: "1.3.0",
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
          plugins: [{ name: "MusicHub·自建云端", url: `${base}/api/mf-plugin.js${qs}`, version: "1.3.0" }],
        });
      }

      return json({ error: "Not Found" }, 404);
    } catch (err) {
      return json({ error: err?.message || String(err) }, 500);
    }
  },
};

// ================= 现代流光 PWA 网页播放器 (/player) =================
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
  :root{
    --bg:#090c14;--side:#0f1420;--card:rgba(255,255,255,.04);--card-h:rgba(255,255,255,.08);
    --line:rgba(255,255,255,.07);--text:#f8fafc;--muted:#94a3b8;--acc:#38bdf8;--pink:#f43f5e;
  }
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:6px;height:6px;}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:3px;}

  .layout{display:flex;min-height:100vh;padding-bottom:96px;}
  .sidebar{width:220px;flex-shrink:0;background:var(--side);border-right:1px solid var(--line);padding:20px 14px;display:flex;flex-direction:column;gap:6px;position:sticky;top:0;height:100vh;}
  .logo{font-size:20px;font-weight:800;letter-spacing:-.3px;padding:6px 12px 18px;display:flex;align-items:center;gap:8px;cursor:pointer;}
  .logo-dot{width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#818cf8);box-shadow:0 0 12px #38bdf8;}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:14px;font-weight:500;color:var(--muted);cursor:pointer;transition:.15s;}
  .nav-item:hover{background:var(--card);color:var(--text);}
  .nav-item.active{background:linear-gradient(90deg,rgba(56,189,248,.18),rgba(129,140,248,.1));color:#fff;font-weight:600;}
  .nav-sep{height:1px;background:var(--line);margin:10px 6px;}
  .side-foot{margin-top:auto;font-size:12px;color:var(--muted);padding:10px 12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;}

  .main-wrap{flex:1;min-width:0;display:flex;flex-direction:column;}
  .topbar{position:sticky;top:0;z-index:20;background:rgba(9,12,20,.78);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);padding:12px 24px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:12px;}
  .m-brand{display:none;font-weight:800;font-size:16px;color:#fff;}
  .search-box{flex:1;max-width:460px;position:relative;display:flex;align-items:center;}
  .search-box input{width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);color:#fff;padding:9px 14px 9px 36px;border-radius:999px;font-size:13px;outline:none;transition:.2s;}
  .search-box input:focus{border-color:var(--acc);background:rgba(255,255,255,.1);}
  .search-ico{position:absolute;left:13px;color:var(--muted);font-size:13px;pointer-events:none;}
  .top-actions{margin-left:auto;display:flex;gap:8px;align-items:center;}

  .m-nav{display:none;gap:6px;padding:8px 16px;overflow-x:auto;background:rgba(9,12,20,.9);border-bottom:1px solid var(--line);}
  .btn{background:var(--acc);color:#06121f;border:none;padding:8px 16px;border-radius:999px;font-weight:600;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:.15s;white-space:nowrap;}
  .btn:hover{filter:brightness(1.08);}
  .btn:active{transform:scale(.96);}
  .btn.ghost{background:rgba(255,255,255,.08);color:var(--text);}
  .btn.sm{padding:6px 12px;font-size:12px;}
  .pill{padding:6px 14px;border-radius:999px;font-size:12px;background:rgba(255,255,255,.06);color:var(--muted);border:none;cursor:pointer;white-space:nowrap;transition:.15s;}
  .pill.active{background:#fff;color:#090c14;font-weight:600;}

  .content{padding:20px 24px;max-width:1200px;width:100%;margin:0 auto;}
  .sec-head{display:flex;justify-content:space-between;align-items:center;margin:8px 0 14px;gap:10px;flex-wrap:wrap;}
  .sec-title{font-size:19px;font-weight:700;letter-spacing:-.2px;}
  .pills{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}

  .artists-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:14px;margin-bottom:28px;}
  .ar-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 10px;text-align:center;cursor:pointer;transition:.2s;}
  .ar-card:hover{background:var(--card-h);transform:translateY(-3px);}
  .ar-ava{width:64px;height:64px;border-radius:50%;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;box-shadow:0 8px 20px rgba(0,0,0,.35);}
  .ar-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ar-tag{font-size:11px;color:var(--muted);margin-top:2px;}

  .charts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:16px;}
  .ch-card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;cursor:pointer;transition:.2s;position:relative;}
  .ch-card:hover{background:var(--card-h);transform:translateY(-3px);}
  .ch-img-wrap{position:relative;aspect-ratio:1/1;background:#161e2e;overflow:hidden;}
  .ch-img-wrap img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s;}
  .ch-card:hover .ch-img-wrap img{transform:scale(1.05);}
  .ch-play-fab{position:absolute;right:10px;bottom:10px;width:36px;height:36px;border-radius:50%;background:var(--acc);color:#06121f;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;opacity:0;transform:translateY(6px);transition:.2s;box-shadow:0 4px 14px rgba(0,0,0,.4);}
  .ch-card:hover .ch-play-fab{opacity:1;transform:translateY(0);}
  .ch-info{padding:10px 12px;}
  .ch-t{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ch-c{font-size:12px;color:var(--muted);margin-top:2px;}

  .hero{position:relative;border-radius:20px;overflow:hidden;padding:24px;margin-bottom:20px;background:rgba(255,255,255,.04);border:1px solid var(--line);display:flex;gap:22px;align-items:flex-end;flex-wrap:wrap;}
  .hero-bg{position:absolute;inset:-40px;background-size:cover;background-position:center;filter:blur(50px) brightness(.42);opacity:.7;z-index:0;}
  .hero-cover{position:relative;z-index:1;width:140px;height:140px;border-radius:16px;object-fit:cover;background:#1e293b;box-shadow:0 14px 36px rgba(0,0,0,.5);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:46px;font-weight:800;color:#fff;}
  .hero-meta{position:relative;z-index:1;flex:1;min-width:220px;}
  .hero-sub{font-size:12px;color:var(--acc);font-weight:600;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px;}
  .hero-title{font-size:26px;font-weight:800;margin-bottom:6px;line-height:1.2;}
  .hero-desc{font-size:13px;color:#cbd5e1;margin-bottom:14px;max-width:600px;}
  .hero-btns{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}

  .song-list{display:flex;flex-direction:column;gap:4px;}
  .s-row{display:grid;grid-template-columns:36px 46px 1.6fr 1fr 64px 72px;align-items:center;gap:12px;padding:8px 12px;border-radius:12px;cursor:pointer;transition:.12s;}
  .s-row:hover{background:var(--card-h);}
  .s-row.active{background:rgba(56,189,248,.12);}
  .s-num{text-align:center;font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums;}
  .s-row.active .s-num{color:var(--acc);font-weight:700;}
  .eq{display:inline-flex;align-items:flex-end;gap:2px;height:14px;}
  .eq i{width:3px;background:var(--acc);border-radius:2px;animation:eq .8s ease-in-out infinite alternate;}
  .eq i:nth-child(2){animation-delay:.2s;}
  .eq i:nth-child(3){animation-delay:.4s;}
  @keyframes eq{0%{height:4px}100%{height:14px}}
  .s-cov{width:44px;height:44px;border-radius:8px;object-fit:cover;background:#1e293b;}
  .s-main{min-width:0;}
  .s-title{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .s-row.active .s-title{color:var(--acc);}
  .s-artist{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
  .s-album{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .s-dur{font-size:12px;color:var(--muted);text-align:right;font-variant-numeric:tabular-nums;}
  .s-ops{display:flex;justify-content:flex-end;gap:6px;}
  .ico-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:15px;padding:4px 6px;border-radius:6px;transition:.15s;}
  .ico-btn:hover{color:#fff;background:rgba(255,255,255,.1);}
  .ico-btn.loved{color:var(--pink);}

  .dock{position:fixed;left:0;right:0;bottom:0;z-index:40;background:rgba(13,18,30,.92);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border-top:1px solid var(--line);padding:10px 20px calc(10px + env(safe-area-inset-bottom));display:grid;grid-template-columns:1.2fr 1.6fr 1fr;align-items:center;gap:16px;}
  .dock-left{display:flex;align-items:center;gap:12px;min-width:0;}
  .dock-cov{width:48px;height:48px;border-radius:10px;object-fit:cover;background:#1e293b;cursor:pointer;flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,.4);}
  .dock-meta{min-width:0;cursor:pointer;}
  .dock-t{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .dock-a{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
  .dock-mid{display:flex;flex-direction:column;align-items:center;gap:5px;}
  .ctrl-btns{display:flex;align-items:center;gap:14px;}
  .play-fab{width:36px;height:36px;border-radius:50%;background:#fff;color:#090c14;border:none;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.15s;}
  .play-fab:hover{transform:scale(1.06);}
  .prog-row{width:100%;max-width:460px;display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;}
  .prog-row input[type=range]{flex:1;height:4px;accent-color:var(--acc);cursor:pointer;}
  .dock-right{display:flex;align-items:center;justify-content:flex-end;gap:10px;}
  .vol-range{width:76px;height:4px;accent-color:#cbd5e1;cursor:pointer;}
  .src-badge{font-size:11px;padding:3px 8px;border-radius:6px;background:rgba(56,189,248,.14);color:var(--acc);cursor:pointer;white-space:nowrap;}

  .drawer{position:fixed;top:0;right:-360px;bottom:84px;width:340px;max-width:90vw;z-index:45;background:rgba(15,20,32,.97);backdrop-filter:blur(24px);border-left:1px solid var(--line);transition:right .25s ease;display:flex;flex-direction:column;padding:16px;}
  .drawer.open{right:0;}
  .drawer-list{flex:1;overflow-y:auto;margin-top:10px;display:flex;flex-direction:column;gap:4px;}

  .lyric-stage{position:fixed;inset:0;z-index:60;background:#070a12;display:none;flex-direction:column;overflow:hidden;}
  .lyric-stage.open{display:flex;}
  .stage-bg{position:absolute;inset:-60px;background-size:cover;background-position:center;filter:blur(70px) brightness(.36) saturate(1.4);transform:scale(1.1);z-index:0;transition:background-image .6s ease;}
  .stage-top{position:relative;z-index:2;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;}
  .stage-body{position:relative;z-index:2;flex:1;display:grid;grid-template-columns:1fr 1.2fr;align-items:center;gap:40px;max-width:1120px;width:100%;margin:0 auto;padding:10px 32px 30px;min-height:0;}
  .stage-left{display:flex;flex-direction:column;align-items:center;text-align:center;}
  .stage-art{width:min(320px,65vw);aspect-ratio:1/1;border-radius:20px;object-fit:cover;box-shadow:0 24px 60px rgba(0,0,0,.65);margin-bottom:20px;background:#1e293b;transition:transform .4s;}
  .stage-art.playing{transform:scale(1.03);}
  .stage-lrc{height:64vh;overflow-y:auto;padding:24vh 10px;scroll-behavior:smooth;mask-image:linear-gradient(transparent,black 18%,black 82%,transparent);-webkit-mask-image:linear-gradient(transparent,black 18%,black 82%,transparent);}
  .lrc-row{padding:10px 12px;font-size:18px;font-weight:600;color:rgba(255,255,255,.42);cursor:pointer;border-radius:10px;transition:all .22s;line-height:1.45;}
  .lrc-row:hover{color:rgba(255,255,255,.78);background:rgba(255,255,255,.04);}
  .lrc-row.cur{color:#fff;font-size:23px;font-weight:700;transform:scale(1.02);}
  .lrc-row small{display:block;font-size:14px;font-weight:400;margin-top:3px;opacity:.78;}

  .auth-wrap{max-width:380px;margin:16vh auto;background:var(--side);border:1px solid var(--line);padding:28px;border-radius:20px;text-align:center;}
  .auth-wrap input{width:100%;background:rgba(255,255,255,.06);border:1px solid var(--line);color:#fff;padding:11px 14px;border-radius:12px;margin:14px 0;outline:none;}

  @media(max-width:860px){
    .sidebar{display:none;}
    .m-brand{display:block;}
    .m-nav{display:flex;}
    .topbar{padding:10px 14px;}
    .content{padding:14px;}
    .s-row{grid-template-columns:28px 42px 1fr 48px 36px;gap:8px;padding:8px;}
    .s-album,.vol-range,.dock-right .btn-hide-m{display:none;}
    .dock{grid-template-columns:1fr auto;padding:8px 12px calc(8px + env(safe-area-inset-bottom));}
    .dock-mid{display:none;}
    .dock-mobile-ctrl{display:flex !important;align-items:center;gap:8px;}
    .stage-body{grid-template-columns:1fr;gap:14px;padding:0 18px 20px;}
    .stage-art{width:150px;margin-bottom:10px;}
    .stage-lrc{height:44vh;padding:14vh 4px;text-align:center;}
    .lrc-row{font-size:16px;}.lrc-row.cur{font-size:20px;}
  }
  .dock-mobile-ctrl{display:none;}
</style>
</head>
<body>

<div class="layout" id="layoutRoot">
  <aside class="sidebar">
    <div class="logo" onclick="nav('discover')"><span class="logo-dot"></span>Music Hub</div>
    <div class="nav-item active" id="nav-discover" onclick="nav('discover')">发现音乐</div>
    <div class="nav-item" id="nav-artists" onclick="nav('artists')">歌手广场</div>
    <div class="nav-item" id="nav-fav" onclick="nav('fav')">我喜欢的</div>
    <div class="nav-item" id="nav-recent" onclick="nav('recent')">最近播放</div>
    <div class="nav-sep"></div>
    <div class="nav-item" onclick="toggleQueue()">当前队列</div>
    <div class="nav-item" onclick="openTimer()">定时关闭</div>
    <div class="nav-item" onclick="location.href='/admin'">后台管理</div>
    <div class="side-foot"><span>Cloudflare D1</span><span id="sideCount">就绪</span></div>
  </aside>

  <div class="main-wrap">
    <header class="topbar">
      <div class="m-brand" onclick="nav('discover')">Music Hub</div>
      <div class="search-box">
        <span class="search-ico">&#128269;</span>
        <input id="qInput" placeholder="搜全网歌曲 / 歌手（如 张学友、晴天）" onkeydown="if(event.key==='Enter')doSearch()" />
      </div>
      <button class="btn sm" onclick="doSearch()">搜索</button>
      <div class="top-actions">
        <button class="btn ghost sm btn-hide-m" onclick="toggleQueue()">队列</button>
      </div>
    </header>

    <div class="m-nav">
      <button class="pill active" id="mnav-discover" onclick="nav('discover')">发现</button>
      <button class="pill" id="mnav-artists" onclick="nav('artists')">歌手</button>
      <button class="pill" id="mnav-fav" onclick="nav('fav')">我喜欢</button>
      <button class="pill" id="mnav-recent" onclick="nav('recent')">最近</button>
      <button class="pill" onclick="openTimer()">定时</button>
      <button class="pill" onclick="location.href='/admin'">后台</button>
    </div>

    <main class="content" id="app"></main>
  </div>
</div>

<div class="dock" id="dock" style="display:none;">
  <div class="dock-left">
    <img id="dCov" class="dock-cov" referrerpolicy="no-referrer" src="" onclick="toggleLyricModal(true)" />
    <div class="dock-meta" onclick="toggleLyricModal(true)">
      <div class="dock-t" id="dTitle">未播放</div>
      <div class="dock-a" id="dArtist">-</div>
    </div>
    <button class="ico-btn" id="dFavBtn" onclick="toggleCurFav()" title="收藏">&#9825;</button>
  </div>

  <div class="dock-mid">
    <div class="ctrl-btns">
      <button class="ico-btn" id="modeBtn" onclick="toggleMode()" title="切换循环模式">顺序</button>
      <button class="ico-btn" onclick="prevSong()">&#9198;</button>
      <button class="play-fab" id="playFab" onclick="togglePlay()">&#9654;</button>
      <button class="ico-btn" onclick="nextSong()">&#9197;</button>
      <button class="ico-btn" onclick="toggleLyricModal(true)" title="展开歌词">词</button>
    </div>
    <div class="prog-row">
      <span id="curT">0:00</span>
      <input type="range" id="seek" min="0" max="100" value="0" oninput="seekPct(this.value)" />
      <span id="durT">0:00</span>
    </div>
  </div>

  <div class="dock-right">
    <span class="src-badge" id="srcBadge" onclick="switchBili()" title="点击强制切B站源">源: 自动</span>
    <input class="vol-range" type="range" min="0" max="1" step="0.02" value="0.9" oninput="audio.volume=this.value" title="音量" />
    <button class="ico-btn btn-hide-m" onclick="toggleQueue()" title="播放队列">&#9776;</button>
    <div class="dock-mobile-ctrl">
      <button class="play-fab" id="playFabM" onclick="togglePlay()">&#9654;</button>
      <button class="ico-btn" onclick="nextSong()">&#9197;</button>
    </div>
  </div>
</div>

<aside class="drawer" id="qDrawer">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <b style="font-size:15px;">当前播放队列 (<span id="qCount">0</span>)</b>
    <button class="btn ghost sm" onclick="toggleQueue()">关闭</button>
  </div>
  <div class="drawer-list" id="qList"></div>
</aside>

<div class="lyric-stage" id="lrcStage">
  <div class="stage-bg" id="stageBg"></div>
  <div class="stage-top">
    <button class="btn ghost sm" onclick="toggleLyricModal(false)">&#8595; 收起</button>
    <div style="display:flex;gap:8px;align-items:center;">
      <button class="btn ghost sm" onclick="switchBili()">切B站源</button>
      <button class="btn ghost sm" onclick="openTimer()">定时关闭</button>
    </div>
  </div>
  <div class="stage-body">
    <div class="stage-left">
      <img id="sArt" class="stage-art" referrerpolicy="no-referrer" src="" />
      <div id="sTitle" style="font-size:22px;font-weight:800;margin-bottom:4px;"></div>
      <div id="sArtist" style="font-size:14px;color:#cbd5e1;margin-bottom:16px;"></div>
      <div class="prog-row" style="max-width:320px;margin-bottom:14px;">
        <span id="curTS">0:00</span>
        <input type="range" id="seekS" min="0" max="100" value="0" oninput="seekPct(this.value)" />
        <span id="durTS">0:00</span>
      </div>
      <div class="ctrl-btns">
        <button class="ico-btn" onclick="toggleMode()" id="modeBtnS" style="color:#fff;">顺序</button>
        <button class="ico-btn" onclick="prevSong()" style="color:#fff;font-size:20px;">&#9198;</button>
        <button class="play-fab" id="playFabS" onclick="togglePlay()" style="width:48px;height:48px;font-size:18px;">&#9654;</button>
        <button class="ico-btn" onclick="nextSong()" style="color:#fff;font-size:20px;">&#9197;</button>
        <button class="ico-btn" id="sFavBtn" onclick="toggleCurFav()" style="font-size:18px;">&#9825;</button>
      </div>
    </div>
    <div class="stage-lrc" id="lrcBox"></div>
  </div>
</div>

<audio id="audio" preload="auto"></audio>

<script>
var TOKEN = new URLSearchParams(location.search).get("token") || localStorage.getItem("mh_token") || "";
if (new URLSearchParams(location.search).get("token")) localStorage.setItem("mh_token", TOKEN);

var chartsCache = [];
var artistsCache = [];
var artistCat = "全部";
var chartCat = "全部";
var viewSongs = [];
var playQueue = [];
var curIdx = -1;
var curSong = null;
var curSource = "";
var playMode = "loop";
var lrcRows = [];
var timerId = null;
var audio = document.getElementById("audio");
audio.volume = 0.9;

var favs = JSON.parse(localStorage.getItem("mh_favs") || "[]");
var recents = JSON.parse(localStorage.getItem("mh_recents") || "[]");

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
    '<div class="auth-wrap"><h3>输入访问密钥</h3>' +
    '<p style="font-size:12px;color:var(--muted);margin-top:6px;">对应 Cloudflare 中的 ACCESS_TOKEN</p>' +
    '<input id="tkIn" type="password" placeholder="输入 ACCESS_TOKEN" onkeydown="if(event.key===\\'Enter\\')saveToken()" />' +
    '<button class="btn" style="width:100%;justify-content:center;" onclick="saveToken()">进入 Music Hub</button></div>';
}

function saveToken() {
  TOKEN = document.getElementById("tkIn").value.trim();
  localStorage.setItem("mh_token", TOKEN);
  nav("discover");
}

function setNavActive(id) {
  ["discover", "artists", "fav", "recent"].forEach(function(k) {
    var a = document.getElementById("nav-" + k);
    var b = document.getElementById("mnav-" + k);
    if (a) a.classList.toggle("active", k === id);
    if (b) b.classList.toggle("active", k === id);
  });
}

function nav(tab) {
  setNavActive(tab);
  if (tab === "fav") { renderHeroList("我喜欢的音乐", "本地红心收藏 · 随时一键连播", "", favs, "收藏夹"); return; }
  if (tab === "recent") { renderHeroList("最近播放", "保留最近听过的 80 首歌曲", "", recents, "播放记录"); return; }
  if (chartsCache.length) {
    if (tab === "artists") renderArtistsPage(); else renderDiscover();
    return;
  }
  document.getElementById("app").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">正在载入音乐宇宙...</div>';
  api("/api/home").then(function(d) {
    chartsCache = d.charts || [];
    artistsCache = d.artists || [];
    document.getElementById("sideCount").textContent = chartsCache.length + " 榜单";
    if (tab === "artists") renderArtistsPage(); else renderDiscover();
  }).catch(function(e) {
    if (e.message !== "401") document.getElementById("app").innerHTML = '<div style="padding:40px;text-align:center;color:#f87171;">加载失败：' + esc(e.message) + '</div>';
  });
}

function renderDiscover() {
  var html = '<div class="sec-head"><div class="sec-title">热门歌手</div>' +
    '<button class="btn ghost sm" onclick="nav(\\'artists\\')">全部歌手 &rarr;</button></div><div class="artists-grid">';
  for (var a = 0; a < Math.min(10, artistsCache.length); a++) {
    var ar = artistsCache[a];
    html += '<div class="ar-card" onclick="openArtistIdx(' + a + ')">' +
      '<div class="ar-ava" style="background:' + GRADS[a % GRADS.length] + '">' + esc(ar.name.slice(0, 1)) + '</div>' +
      '<div class="ar-name">' + esc(ar.name) + '</div><div class="ar-tag">' + esc(ar.tag) + '</div></div>';
  }
  html += '</div>';

  var cCats = ["全部"];
  for (var j = 0; j < chartsCache.length; j++) {
    var cat = chartsCache[j].category || "其他";
    if (cCats.indexOf(cat) < 0) cCats.push(cat);
  }
  html += '<div class="sec-head"><div class="sec-title">全网精选与经典榜单</div><span style="font-size:12px;color:var(--muted);">每日自动同步 · 永久留存</span></div>';
  html += '<div class="pills">';
  for (var k = 0; k < cCats.length; k++) {
    html += '<button class="pill' + (chartCat === cCats[k] ? " active" : "") + '" onclick="setChartCat(\\'' + cCats[k] + '\\')">' + esc(cCats[k]) + '</button>';
  }
  html += '</div><div class="charts-grid">';

  for (var i = 0; i < chartsCache.length; i++) {
    var c = chartsCache[i];
    if (chartCat !== "全部" && c.category !== chartCat) continue;
    html += '<div class="ch-card" onclick="openChartIdx(' + i + ')">' +
      '<div class="ch-img-wrap"><img loading="lazy" referrerpolicy="no-referrer" src="' + (c.cover || "") + '" />' +
      '<div class="ch-play-fab">&#9654;</div></div>' +
      '<div class="ch-info"><div class="ch-t">' + esc(c.title) + '</div><div class="ch-c">' + esc(c.category) + '</div></div></div>';
  }
  html += '</div>';
  document.getElementById("app").innerHTML = html;
}

function setChartCat(cat) { chartCat = cat; renderDiscover(); }

function renderArtistsPage() {
  var cats = ["全部", "经典怀旧", "华语男", "华语女", "乐队组合", "日韩", "欧美", "ACG"];
  var html = '<div class="sec-head"><div class="sec-title">歌手广场</div></div><div class="pills">';
  for (var k = 0; k < cats.length; k++) {
    html += '<button class="pill' + (artistCat === cats[k] ? " active" : "") + '" onclick="setArtistCat(\\'' + cats[k] + '\\')">' + cats[k] + '</button>';
  }
  html += '</div><div class="artists-grid">';
  for (var i = 0; i < artistsCache.length; i++) {
    var ar = artistsCache[i];
    if (artistCat !== "全部" && ar.cat !== artistCat) continue;
    html += '<div class="ar-card" onclick="openArtistIdx(' + i + ')">' +
      '<div class="ar-ava" style="background:' + GRADS[i % GRADS.length] + '">' + esc(ar.name.slice(0, 1)) + '</div>' +
      '<div class="ar-name">' + esc(ar.name) + '</div><div class="ar-tag">' + esc(ar.tag) + '</div></div>';
  }
  html += '</div>';
  document.getElementById("app").innerHTML = html;
}

function setArtistCat(cat) { artistCat = cat; renderArtistsPage(); }

function openArtistIdx(i) {
  var ar = artistsCache[i]; if (!ar) return;
  document.getElementById("app").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">正在检索 ' + esc(ar.name) + ' 代表作...</div>';
  api("/api/artist?name=" + encodeURIComponent(ar.name)).then(function(d) {
    var songs = d.songs || [];
    renderHeroList(ar.name, ar.tag + " · 共 " + songs.length + " 首精选作品", (songs[0] && songs[0].cover) || "", songs, "热门歌手");
  });
}

function openChartIdx(i) {
  var c = chartsCache[i]; if (!c) return;
  document.getElementById("app").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">加载榜单中...</div>';
  api("/api/chart?id=" + encodeURIComponent(c.id)).then(function(d) {
    var ch = d.chart || c;
    var songs = d.songs || [];
    renderHeroList(ch.title, ch.description || ("精选 " + songs.length + " 首单曲"), ch.cover || "", songs, c.category || "榜单");
  });
}

function doSearch() {
  var q = document.getElementById("qInput").value.trim();
  if (!q) return nav("discover");
  document.getElementById("app").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">全网搜索中...</div>';
  api("/api/search?q=" + encodeURIComponent(q)).then(function(d) {
    var songs = d.songs || [];
    renderHeroList("搜索：" + q, "本地曲库 + 全网实时匹配共 " + songs.length + " 首", (songs[0] && songs[0].cover) || "", songs, "搜索结果");
  });
}

function renderHeroList(title, desc, cover, songs, subLabel) {
  viewSongs = songs || [];
  var bgStyle = cover ? ('background-image:url("' + cover + '")') : "background:linear-gradient(135deg,#0c4a6e,#312e81)";
  var covHtml = cover
    ? '<img class="hero-cover" referrerpolicy="no-referrer" src="' + cover + '" />'
    : '<div class="hero-cover" style="background:linear-gradient(135deg,#0284c7,#7c3aed);">' + esc(title.slice(0, 1)) + '</div>';

  var html = '<div class="hero"><div class="hero-bg" style="' + bgStyle + '"></div>' + covHtml +
    '<div class="hero-meta"><div class="hero-sub">' + esc(subLabel) + '</div>' +
    '<div class="hero-title">' + esc(title) + '</div>' +
    '<div class="hero-desc">' + esc(desc) + '</div>' +
    '<div class="hero-btns">' +
    (viewSongs.length ? '<button class="btn" onclick="playAll(false)">&#9654; 播放全部</button><button class="btn ghost" onclick="playAll(true)">随机播放</button>' : '') +
    '<button class="btn ghost" onclick="nav(\\'discover\\')">返回发现</button></div></div></div>';

  html += '<div class="song-list" id="songRows">';
  if (!viewSongs.length) html += '<div style="padding:40px;text-align:center;color:var(--muted);">暂无歌曲</div>';
  for (var i = 0; i < viewSongs.length; i++) {
    var s = viewSongs[i];
    var isCur = curSong && curSong.norm_key === s.norm_key;
    var loved = isFav(s);
    html += '<div class="s-row' + (isCur ? " active" : "") + '" onclick="playViewIdx(' + i + ')">' +
      '<div class="s-num">' + (isCur ? '<span class="eq"><i></i><i></i><i></i></span>' : (i + 1 < 10 ? "0" + (i + 1) : i + 1)) + '</div>' +
      '<img class="s-cov" loading="lazy" referrerpolicy="no-referrer" src="' + (s.cover || "") + '" />' +
      '<div class="s-main"><div class="s-title">' + esc(s.title) + '</div><div class="s-artist">' + esc(s.artist) + '</div></div>' +
      '<div class="s-album">' + esc(s.album || s.category || "") + '</div>' +
      '<div class="s-dur">' + (s.duration ? fmt(s.duration) : "--:--") + '</div>' +
      '<div class="s-ops" onclick="event.stopPropagation()">' +
      '<button class="ico-btn' + (loved ? " loved" : "") + '" onclick="toggleViewFav(' + i + ',this)">' + (loved ? "&#9829;" : "&#9825;") + '</button>' +
      '<button class="ico-btn" onclick="addNext(' + i + ')" title="下一首播放">+</button>' +
      '</div></div>';
  }
  html += '</div>';
  document.getElementById("app").innerHTML = html;
}

function playAll(shuffle) {
  if (!viewSongs.length) return;
  playQueue = viewSongs.slice();
  if (shuffle) { playMode = "shuffle"; syncModeUI(); playQueueIdx(Math.floor(Math.random() * playQueue.length)); }
  else playQueueIdx(0);
}
function playViewIdx(i) { playQueue = viewSongs.slice(); playQueueIdx(i); }
function addNext(i) {
  var s = viewSongs[i]; if (!s) return;
  if (!playQueue.length) { playQueue = [s]; playQueueIdx(0); return; }
  playQueue.splice(curIdx + 1, 0, s); renderQueue();
}

function playQueueIdx(idx, prefer) {
  if (idx < 0 || idx >= playQueue.length) return;
  curIdx = idx;
  var s = playQueue[idx];
  curSong = s;
  curSource = prefer || "";

  document.getElementById("dock").style.display = "grid";
  document.getElementById("dCov").src = s.cover || "";
  document.getElementById("dTitle").textContent = s.title;
  document.getElementById("dArtist").textContent = s.artist + " · 解析中...";
  document.getElementById("sArt").src = s.cover || "";
  document.getElementById("sTitle").textContent = s.title;
  document.getElementById("sArtist").textContent = s.artist;
  document.getElementById("stageBg").style.backgroundImage = s.cover ? ('url("' + s.cover + '")') : "";
  updateFavBtns();
  renderQueue();

  recents = [s].concat(recents.filter(function(r) { return r.norm_key !== s.norm_key; })).slice(0, 80);
  localStorage.setItem("mh_recents", JSON.stringify(recents));

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
    if (res.error) { document.getElementById("dArtist").textContent = s.artist + " · 暂无可用源"; return; }
    if (res.songId) s.id = res.songId;
    curSource = res.source || "";
    audio.src = res.needProxy ? res.proxyUrl : res.url;
    audio.play().catch(function(){});
    document.getElementById("dArtist").textContent = s.artist;
    document.getElementById("srcBadge").textContent = "源: " + (res.source || "auto");
    setPlayingUI(true);
    updateMediaSession(s);
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

audio.addEventListener("error", function() {
  if (curIdx >= 0 && curSource !== "bili") {
    document.getElementById("dArtist").textContent = (curSong ? curSong.artist : "") + " · 自动切B站重连...";
    playQueueIdx(curIdx, "bili");
  }
});

function updateMediaSession(s) {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: s.title, artist: s.artist, album: s.album || "Music Hub",
      artwork: s.cover ? [{ src: s.cover, sizes: "512x512", type: "image/jpeg" }] : [],
    });
    navigator.mediaSession.setActionHandler("play", togglePlay);
    navigator.mediaSession.setActionHandler("pause", togglePlay);
    navigator.mediaSession.setActionHandler("previoustrack", prevSong);
    navigator.mediaSession.setActionHandler("nexttrack", nextSong);
  } catch {}
}

function setPlayingUI(playing) {
  var ico = playing ? "&#10074;&#10074;" : "&#9654;";
  document.getElementById("playFab").innerHTML = ico;
  document.getElementById("playFabM").innerHTML = ico;
  document.getElementById("playFabS").innerHTML = ico;
  document.getElementById("sArt").classList.toggle("playing", playing);
}
function switchBili() { if (curIdx >= 0) playQueueIdx(curIdx, "bili"); }
function togglePlay() {
  if (!audio.src) return;
  if (audio.paused) { audio.play(); setPlayingUI(true); }
  else { audio.pause(); setPlayingUI(false); }
}
function toggleMode() { playMode = playMode === "loop" ? "one" : playMode === "one" ? "shuffle" : "loop"; syncModeUI(); }
function syncModeUI() {
  var label = playMode === "one" ? "单曲" : playMode === "shuffle" ? "随机" : "顺序";
  document.getElementById("modeBtn").textContent = label;
  document.getElementById("modeBtnS").textContent = label;
}
function prevSong() { if (playQueue.length) playQueueIdx(curIdx > 0 ? curIdx - 1 : playQueue.length - 1); }
function nextSong() {
  if (!playQueue.length) return;
  if (playMode === "one") { audio.currentTime = 0; audio.play(); return; }
  if (playMode === "shuffle" && playQueue.length > 1) { playQueueIdx(Math.floor(Math.random() * playQueue.length)); return; }
  playQueueIdx((curIdx + 1) % playQueue.length);
}
function seekPct(v) { if (audio.duration) audio.currentTime = (v / 100) * audio.duration; }
audio.addEventListener("ended", nextSong);
audio.addEventListener("timeupdate", function() {
  var c = audio.currentTime || 0, d = audio.duration || 0;
  var cs = fmt(c), ds = fmt(d);
  document.getElementById("curT").textContent = cs; document.getElementById("durT").textContent = ds;
  document.getElementById("curTS").textContent = cs; document.getElementById("durTS").textContent = ds;
  if (d > 0) { var pct = (c / d) * 100; document.getElementById("seek").value = pct; document.getElementById("seekS").value = pct; }
  highlightLrc(c);
});

function isFav(s) { return s && favs.some(function(f) { return f.norm_key === s.norm_key; }); }
function saveFavSong(s) {
  if (isFav(s)) favs = favs.filter(function(f) { return f.norm_key !== s.norm_key; }); else favs.unshift(s);
  localStorage.setItem("mh_favs", JSON.stringify(favs)); updateFavBtns();
}
function toggleViewFav(i, btn) {
  var s = viewSongs[i]; if (!s) return; saveFavSong(s);
  var loved = isFav(s); btn.classList.toggle("loved", loved); btn.innerHTML = loved ? "&#9829;" : "&#9825;";
}
function toggleCurFav() { if (curSong) saveFavSong(curSong); }
function updateFavBtns() {
  var loved = isFav(curSong);
  ["dFavBtn", "sFavBtn"].forEach(function(id) {
    var el = document.getElementById(id); if (!el) return;
    el.classList.toggle("loved", loved); el.innerHTML = loved ? "&#9829;" : "&#9825;";
  });
}

function toggleQueue() { document.getElementById("qDrawer").classList.toggle("open"); renderQueue(); }
function renderQueue() {
  document.getElementById("qCount").textContent = playQueue.length;
  var h = "";
  for (var i = 0; i < playQueue.length; i++) {
    var s = playQueue[i];
    h += '<div class="s-row' + (i === curIdx ? " active" : "") + '" style="grid-template-columns:24px 1fr;padding:7px 8px;" onclick="playQueueIdx(' + i + ')">' +
      '<div class="s-num">' + (i === curIdx ? "&#9654;" : (i + 1)) + '</div>' +
      '<div class="s-main"><div class="s-title">' + esc(s.title) + '</div><div class="s-artist">' + esc(s.artist) + '</div></div></div>';
  }
  document.getElementById("qList").innerHTML = h || '<div style="padding:20px;text-align:center;color:var(--muted);font-size:13px;">队列为空</div>';
}

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
      var t = Number(m[1]) * 60 + Number(m[2]); var txt = m[3].trim();
      if (txt) lrcRows.push({ t: t, txt: txt, tr: transMap[Math.round(t * 10)] || "" });
    }
  });
  var box = document.getElementById("lrcBox");
  if (!lrcRows.length) { box.innerHTML = '<div class="lrc-row">暂无同步歌词，尽情聆听</div>'; return; }
  box.innerHTML = lrcRows.map(function(r, i) {
    return '<div class="lrc-row" id="lr' + i + '" onclick="seekLrc(' + i + ')">' + esc(r.txt) + (r.tr ? '<small>' + esc(r.tr) + '</small>' : '') + '</div>';
  }).join("");
}
function seekLrc(i) { if (lrcRows[i] && audio.duration) { audio.currentTime = lrcRows[i].t; if (audio.paused) togglePlay(); } }
function highlightLrc(sec) {
  if (!lrcRows.length) return;
  var active = -1;
  for (var i = 0; i < lrcRows.length; i++) { if (sec >= lrcRows[i].t) active = i; else break; }
  var lines = document.querySelectorAll(".lrc-row");
  for (var j = 0; j < lines.length; j++) {
    if (j === active) {
      if (!lines[j].classList.contains("cur")) { lines[j].classList.add("cur"); lines[j].scrollIntoView({ behavior: "smooth", block: "center" }); }
    } else lines[j].classList.remove("cur");
  }
}

function toggleLyricModal(open) { document.getElementById("lrcStage").classList.toggle("open", open); }
function openTimer() {
  var m = prompt("多少分钟后自动停止播放？（输入 0 取消定时）", "30");
  if (m === null) return; clearTimeout(timerId);
  var mins = Number(m);
  if (mins > 0) { timerId = setTimeout(function() { audio.pause(); setPlayingUI(false); }, mins * 60000); alert("已设置 " + mins + " 分钟后停止播放"); }
}

document.addEventListener("keydown", function(e) {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") { e.preventDefault(); togglePlay(); }
  else if (e.code === "ArrowRight" && audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  else if (e.code === "ArrowLeft" && audio.duration) audio.currentTime = Math.max(0, audio.currentTime - 5);
});
function fmt(s) { var m = Math.floor(s / 60), r = Math.floor(s % 60); return m + ":" + (r < 10 ? "0" : "") + r; }
function esc(s) { return String(s || "").replace(/[&<>"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

nav("discover");
</script>
</body>
</html>`;

// ================= 全面升级管理后台 UI (/admin) =================
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Music Hub 管理后台</title>
<style>
  :root{--bg:#090c14;--card:#0f1420;--line:rgba(255,255,255,.08);--acc:#38bdf8;--muted:#94a3b8;}
  *{box-sizing:border-box;}
  body{background:var(--bg);color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:1100px;margin:0 auto;padding:18px;padding-bottom:80px;}
  .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;}
  .tabs{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
  .tab{padding:8px 16px;border-radius:10px;background:rgba(255,255,255,.05);color:var(--muted);border:1px solid var(--line);cursor:pointer;font-size:13px;font-weight:600;}
  .tab.active{background:var(--acc);color:#06121f;border-color:var(--acc);}
  .card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;margin-bottom:16px;}
  h2,h3{margin:0 0 12px;font-size:17px;}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;}
  .stat{background:rgba(255,255,255,.04);padding:14px;border-radius:12px;text-align:center;}
  .stat b{font-size:24px;color:var(--acc);display:block;}
  .stat span{font-size:12px;color:var(--muted);}
  input,select,textarea{background:#090c14;border:1px solid #334155;color:#fff;padding:8px 10px;border-radius:8px;font-size:13px;outline:none;}
  textarea{width:100%;font-family:monospace;line-height:1.5;}
  button{background:var(--acc);color:#06121f;border:none;padding:8px 14px;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;}
  button.sm{padding:5px 9px;font-size:12px;}
  button.red{background:#ef4444;color:#fff;}
  button.green{background:#10b981;color:#052e16;}
  button.ghost{background:#334155;color:#fff;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  td,th{padding:9px 8px;border-bottom:1px solid rgba(255,255,255,.06);text-align:left;vertical-align:middle;}
  .row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center;}
  .err{color:#f87171;font-size:13px;margin-top:8px;}
  .badge{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;background:rgba(255,255,255,.08);color:#cbd5e1;margin:2px;}
  .badge.ok{background:rgba(16,185,129,.18);color:#34d399;}
  .badge.miss{background:rgba(245,158,11,.18);color:#fbbf24;}
  .badge.blk{background:rgba(239,68,68,.2);color:#f87171;}
  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:50;display:none;align-items:center;justify-content:center;padding:16px;}
  .modal-bg.open{display:flex;}
  .modal{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;width:100%;max-width:640px;max-height:90vh;overflow-y:auto;}
  .pbar{height:8px;background:#1e293b;border-radius:99px;overflow:hidden;margin:10px 0;}
  .pbar > div{height:100%;background:linear-gradient(90deg,#38bdf8,#10b981);transition:width .3s;}
  .aud-bar{position:fixed;left:0;right:0;bottom:0;background:#0f172a;border-top:1px solid var(--line);padding:10px 20px;display:none;align-items:center;gap:12px;z-index:40;}
</style>
</head>
<body>
<div class="top">
  <h2>Music Hub 控制中心</h2>
  <div style="display:flex;gap:8px;">
    <button class="ghost" onclick="logout()" id="logoutBtn" style="display:none;">退出</button>
    <button class="ghost" onclick="location.href='/player'">前往播放器</button>
  </div>
</div>

<div class="tabs" id="tabBar" style="display:none;">
  <button class="tab active" id="t-overview" onclick="switchTab('overview')">概览与音源池</button>
  <button class="tab" id="t-songs" onclick="switchTab('songs')">曲库管理</button>
  <button class="tab" id="t-lyrics" onclick="switchTab('lyrics')">歌词库管理</button>
  <button class="tab" id="t-charts" onclick="switchTab('charts')">榜单管理</button>
</div>

<div id="main"></div>

<div class="modal-bg" id="modalBg">
  <div class="modal" id="modalBody"></div>
</div>

<div class="aud-bar" id="audBar">
  <b id="audTitle" style="font-size:13px;min-width:160px;">试听</b>
  <audio id="admAudio" controls style="flex:1;height:36px;"></audio>
  <button class="ghost sm" onclick="document.getElementById('audBar').style.display='none';document.getElementById('admAudio').pause();">关闭</button>
</div>

<script>
var ATOKEN = sessionStorage.getItem("mh_admin_tk") || "";
var curTab = "overview";
var dashData = null;
var songRows = [];
var songPage = 1;
var lrcRows = [];
var lrcPage = 1;
var backfillRunning = false;

function esc(s) { return String(s || "").replace(/[&<>"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

function req(path, opts) {
  opts = opts || {};
  opts.headers = Object.assign({ "Content-Type": "application/json", "X-Admin-Token": ATOKEN }, opts.headers || {});
  return fetch(path, opts).then(function(r) {
    return r.json().then(function(data) {
      if (r.status === 401) {
        sessionStorage.removeItem("mh_admin_tk");
        ATOKEN = "";
        renderLogin(data.error || "请登录");
        throw new Error("401");
      }
      if (!r.ok) throw new Error(data.error || ("HTTP " + r.status));
      return data;
    });
  });
}

function renderLogin(msg) {
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("tabBar").style.display = "none";
  document.getElementById("main").innerHTML =
    '<div class="card" style="max-width:420px;margin:40px auto;"><h3>输入后台管理密码</h3>' +
    '<div class="row"><input id="pw" type="password" placeholder="ADMIN_PASSWORD" style="flex:1;" onkeydown="if(event.key===\\'Enter\\')doLogin()" />' +
    '<button onclick="doLogin()">登录</button></div>' +
    '<div class="err" id="loginErr">' + esc(msg || "") + '</div></div>';
}

function doLogin() {
  var pw = (document.getElementById("pw").value || "").trim();
  if (!pw) { document.getElementById("loginErr").textContent = "请输入密码"; return; }
  document.getElementById("loginErr").textContent = "正在验证...";
  fetch("/api/admin/login", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw })
  }).then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
  .then(function(res) {
    if (!res.ok) { document.getElementById("loginErr").textContent = res.d.error || "登录失败"; return; }
    ATOKEN = res.d.token; sessionStorage.setItem("mh_admin_tk", ATOKEN); loadAll();
  }).catch(function(e) { document.getElementById("loginErr").textContent = "请求异常：" + e.message; });
}

function logout() { sessionStorage.removeItem("mh_admin_tk"); ATOKEN = ""; renderLogin(""); }

function switchTab(t) {
  curTab = t;
  ["overview", "songs", "lyrics", "charts"].forEach(function(k) {
    var el = document.getElementById("t-" + k);
    if (el) el.classList.toggle("active", k === t);
  });
  if (t === "overview") renderOverview();
  else if (t === "songs") renderSongsTab();
  else if (t === "lyrics") renderLyricsTab();
  else if (t === "charts") renderChartsTab();
}

function loadAll() {
  if (!ATOKEN) { renderLogin(""); return; }
  req("/api/admin/stats").then(function(d) {
    dashData = d;
    document.getElementById("logoutBtn").style.display = "inline-block";
    document.getElementById("tabBar").style.display = "flex";
    switchTab(curTab);
  }).catch(function(){});
}

function renderOverview() {
  var st = dashData.stats || {};
  var pct = st.songs ? Math.round((st.lyrics / st.songs) * 100) : 0;
  var h = '<div class="card"><div class="grid">' +
    '<div class="stat"><b>' + (st.songs||0) + '</b><span>可用歌曲</span></div>' +
    '<div class="stat"><b>' + (st.charts||0) + '</b><span>精选榜单</span></div>' +
    '<div class="stat"><b>' + (st.lyrics||0) + ' (' + pct + '%)</b><span>歌词覆盖率</span></div>' +
    '<div class="stat"><b>' + (st.blocked||0) + '</b><span>已屏蔽</span></div>' +
    '</div><div style="margin-top:14px;">' +
    (dashData.categories || []).map(function(c) { return '<span class="badge">' + esc(c.category) + ': ' + c.c + '首</span>'; }).join("") +
    '</div></div>';

  var srcs = dashData.sources || [];
  h += '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
    '<h3>音源解析池</h3><button class="sm" onclick="testAllSrc()">一键全员测活</button></div>' +
    '<table><tr><th>ID</th><th>名称 / 地址</th><th>类型</th><th>优先级</th><th>状态</th><th>测活结果</th><th>操作</th></tr>';
  for (var i = 0; i < srcs.length; i++) {
    var s = srcs[i];
    h += '<tr><td>' + esc(s.id) + '</td><td>' + esc(s.name) + '<br><small style="color:var(--muted);">' + esc(s.endpoint) + '</small></td>' +
      '<td>' + esc(s.type) + '</td><td>' + s.priority + '</td><td>' + (s.enabled ? '<span class="badge ok">启用</span>' : '<span class="badge">停用</span>') + '</td>' +
      '<td id="st-' + esc(s.id) + '"><small style="color:var(--muted);">未测</small></td>' +
      '<td><button class="sm" onclick="testSrc(' + i + ')">测活</button> ' +
      '<button class="sm ghost" onclick="editSrcForm(' + i + ')">改</button> ' +
      '<button class="sm ghost" onclick="toggleSrc(' + i + ')">' + (s.enabled ? "停" : "启") + '</button> ' +
      '<button class="sm red" onclick="delSrc(' + i + ')">删</button></td></tr>';
  }
  h += '</table><div class="row" style="margin-top:12px;">' +
    '<input id="sid" placeholder="ID 如 myapi" style="width:95px;" />' +
    '<input id="sname" placeholder="名称" style="width:120px;" />' +
    '<select id="stype"><option value="agg">agg 聚合</option><option value="native">native</option><option value="bili">bili</option></select>' +
    '<input id="send" placeholder="Endpoint URL" style="flex:1;" />' +
    '<input id="spri" type="number" value="20" style="width:65px;" />' +
    '<button onclick="addSrc()">保存音源</button></div></div>';

  h += '<div class="card"><h3>垃圾翻唱 / 伴奏自动过滤词配置</h3>' +
    '<div class="row"><input id="junkIn" value="' + esc(dashData.junkWords || "") + '" style="flex:1;" />' +
    '<button onclick="saveJunk()">保存过滤词</button></div></div>';

  document.getElementById("main").innerHTML = h;
}

function testSrc(i) {
  var s = dashData.sources[i]; if (!s) return;
  var cell = document.getElementById("st-" + s.id);
  if (cell) cell.innerHTML = '<small>测活中...</small>';
  return req("/api/admin/source/test", { method: "POST", body: JSON.stringify({ id: s.id }) }).then(function(r) {
    if (cell) cell.innerHTML = r.ok ? ('<span class="badge ok">' + r.status + ' · ' + r.ms + 'ms</span>') : ('<span class="badge blk">失败 ' + (r.status || r.error) + '</span>');
  });
}
function testAllSrc() { for (var i = 0; i < dashData.sources.length; i++) testSrc(i); }
function editSrcForm(i) {
  var s = dashData.sources[i];
  document.getElementById("sid").value = s.id;
  document.getElementById("sname").value = s.name;
  document.getElementById("stype").value = s.type;
  document.getElementById("send").value = s.endpoint;
  document.getElementById("spri").value = s.priority;
}
function toggleSrc(i) {
  var s = dashData.sources[i];
  req("/api/admin/source", { method: "POST", body: JSON.stringify({ id:s.id, name:s.name, type:s.type, endpoint:s.endpoint, priority:s.priority, enabled:s.enabled?0:1 }) }).then(loadAll);
}
function delSrc(i) {
  var s = dashData.sources[i]; if (!confirm("删除音源 " + s.name + "？")) return;
  req("/api/admin/source/delete", { method: "POST", body: JSON.stringify({ id: s.id }) }).then(loadAll);
}
function addSrc() {
  req("/api/admin/source", {
    method: "POST", body: JSON.stringify({
      id: document.getElementById("sid").value, name: document.getElementById("sname").value,
      type: document.getElementById("stype").value, endpoint: document.getElementById("send").value,
      priority: Number(document.getElementById("spri").value), enabled: 1
    })
  }).then(loadAll);
}
function saveJunk() {
  req("/api/admin/settings", { method: "POST", body: JSON.stringify({ junkWords: document.getElementById("junkIn").value }) }).then(function(){ alert("过滤词已保存"); });
}

function renderSongsTab() {
  var cats = (dashData.categories || []).map(function(c) { return '<option value="' + esc(c.category) + '">' + esc(c.category) + ' (' + c.c + ')</option>'; }).join("");
  var h = '<div class="card"><h3>一键导入网易云公开歌单到曲库 & 主页</h3>' +
    '<div class="row">' +
    '<input id="impUrl" placeholder="粘贴网易云歌单链接或数字 ID（如 2945028696）" style="flex:2;min-width:220px;" />' +
    '<input id="impTitle" placeholder="自定义榜单名（留空用原名）" style="flex:1;" />' +
    '<select id="impCCat"><option value="经典金曲">经典金曲</option><option value="华语怀旧">华语怀旧</option><option value="核心榜单">核心榜单</option><option value="ACG / 二次元">ACG / 二次元</option><option value="日韩欧美">日韩欧美</option></select>' +
    '<select id="impSCat"><option value="经典">歌曲分类: 经典</option><option value="华语">华语</option><option value="ACG">ACG</option><option value="日韩">日韩</option><option value="欧美">欧美</option></select>' +
    '<button class="green" onclick="importPlaylist()">立即导入</button></div></div>';

  h += '<div class="card"><h3>全库检索与精修</h3><div class="row">' +
    '<input id="sq" placeholder="搜歌名 / 歌手 / 专辑..." style="flex:1;min-width:180px;" onkeydown="if(event.key===\\'Enter\\'){songPage=1;loadSongs();}" />' +
    '<select id="scat" onchange="songPage=1;loadSongs()"><option value="">全部分类</option>' + cats + '</select>' +
    '<select id="sflt" onchange="songPage=1;loadSongs()"><option value="all">全部状态</option><option value="active">仅正常</option><option value="no_lrc">缺歌词</option><option value="blocked">已屏蔽</option></select>' +
    '<select id="ssrt" onchange="songPage=1;loadSongs()"><option value="score">热度优先</option><option value="newest">最新入库</option></select>' +
    '<button onclick="songPage=1;loadSongs()">筛选</button></div>' +
    '<div id="songsTbl">加载中...</div></div>';

  document.getElementById("main").innerHTML = h;
  loadSongs();
}

function importPlaylist() {
  var u = document.getElementById("impUrl").value.trim();
  if (!u) return alert("请输入歌单链接或 ID");
  req("/api/admin/import-playlist", {
    method: "POST", body: JSON.stringify({
      url: u, chartTitle: document.getElementById("impTitle").value.trim(),
      chartCategory: document.getElementById("impCCat").value,
      songCategory: document.getElementById("impSCat").value
    })
  }).then(function(r) {
    alert("导入成功！《" + r.title + "》共入库 " + r.importedCount + " 首歌");
    loadAll();
  }).catch(function(e) { alert("导入失败：" + e.message); });
}

function loadSongs() {
  var q = (document.getElementById("sq")?.value || "");
  var cat = (document.getElementById("scat")?.value || "");
  var flt = (document.getElementById("sflt")?.value || "all");
  var srt = (document.getElementById("ssrt")?.value || "score");
  req("/api/admin/songs?q=" + encodeURIComponent(q) + "&cat=" + encodeURIComponent(cat) + "&filter=" + flt + "&sort=" + srt + "&page=" + songPage)
  .then(function(d) {
    songRows = d.songs || [];
    var h = '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">共 ' + d.total + ' 首，当前第 ' + d.page + ' 页</div>' +
      '<table><tr><th>ID</th><th>歌名 / 歌手</th><th>分类 / 歌词</th><th>已存源ID</th><th>操作</th></tr>';
    for (var i = 0; i < songRows.length; i++) {
      var s = songRows[i];
      h += '<tr><td>#' + s.id + '</td><td><b>' + esc(s.title) + '</b><br><small style="color:var(--muted);">' + esc(s.artist) + (s.album ? " · " + esc(s.album) : "") + '</small></td>' +
        '<td><span class="badge">' + esc(s.category) + '</span>' + (s.lrc_len > 10 ? '<span class="badge ok">有词</span>' : '<span class="badge miss">缺词</span>') + (s.is_blocked ? '<span class="badge blk">屏蔽</span>' : '') + '</td>' +
        '<td><small style="color:var(--muted);word-break:break-all;">' + esc(s.source_ids_json) + '</small></td>' +
        '<td style="white-space:nowrap;">' +
        '<button class="sm" onclick="admPlay(' + i + ')">试听</button> ' +
        '<button class="sm ghost" onclick="openEditSong(' + i + ')">改</button> ' +
        '<button class="sm ghost" onclick="openEditLyric(' + s.id + ')">词</button> ' +
        (s.is_blocked ? '<button class="sm green" onclick="setBlock(' + s.id + ',0)">解</button> ' : '<button class="sm red" onclick="setBlock(' + s.id + ',1)">封</button> ') +
        '<button class="sm ghost" onclick="resetBili(' + s.id + ')">清BV</button> ' +
        '<button class="sm red" onclick="delSong(' + s.id + ')">删</button></td></tr>';
    }
    h += '</table><div class="row" style="margin-top:12px;justify-content:space-between;">' +
      '<button class="ghost sm" ' + (songPage <= 1 ? "disabled" : "") + ' onclick="songPage--;loadSongs()">上一页</button>' +
      '<button class="ghost sm" ' + (songPage * d.limit >= d.total ? "disabled" : "") + ' onclick="songPage++;loadSongs()">下一页</button></div>';
    document.getElementById("songsTbl").innerHTML = h;
  });
}

function admPlay(i) {
  var s = songRows[i]; if (!s) return;
  document.getElementById("audBar").style.display = "flex";
  document.getElementById("audTitle").textContent = "解析中: " + s.title;
  req("/api/admin/play?id=" + s.id + "&atoken=" + encodeURIComponent(ATOKEN)).then(function(r) {
    document.getElementById("audTitle").textContent = s.title + " [" + r.source + "]";
    var a = document.getElementById("admAudio");
    a.src = r.needProxy ? r.proxyUrl : r.url;
    a.play().catch(function(){});
  }).catch(function(e) { document.getElementById("audTitle").textContent = "失败: " + e.message; });
}

function openEditSong(i) {
  var s = songRows[i]; if (!s) return;
  document.getElementById("modalBody").innerHTML =
    '<h3>编辑歌曲 #' + s.id + '</h3>' +
    '<div class="row"><label style="width:70px;">歌名</label><input id="e_title" value="' + esc(s.title) + '" style="flex:1;" /></div>' +
    '<div class="row"><label style="width:70px;">歌手</label><input id="e_artist" value="' + esc(s.artist) + '" style="flex:1;" /></div>' +
    '<div class="row"><label style="width:70px;">专辑</label><input id="e_album" value="' + esc(s.album) + '" style="flex:1;" /></div>' +
    '<div class="row"><label style="width:70px;">封面</label><input id="e_cover" value="' + esc(s.cover) + '" style="flex:1;" /></div>' +
    '<div class="row"><label style="width:70px;">分类</label><input id="e_cat" value="' + esc(s.category) + '" style="flex:1;" />' +
    '<label>热度</label><input id="e_score" type="number" value="' + s.score + '" style="width:80px;" /></div>' +
    '<div class="row"><label style="width:70px;">源 ID JSON</label><input id="e_ids" value="' + esc(s.source_ids_json) + '" style="flex:1;font-family:monospace;" /></div>' +
    '<div class="row" style="justify-content:flex-end;margin-top:12px;">' +
    '<button class="ghost" onclick="closeModal()">取消</button><button onclick="saveSong(' + s.id + ')">保存修改</button></div>';
  document.getElementById("modalBg").classList.add("open");
}

function saveSong(id) {
  req("/api/admin/song/update", {
    method: "POST", body: JSON.stringify({
      id: id, title: document.getElementById("e_title").value, artist: document.getElementById("e_artist").value,
      album: document.getElementById("e_album").value, cover: document.getElementById("e_cover").value,
      category: document.getElementById("e_cat").value, score: Number(document.getElementById("e_score").value),
      source_ids_json: document.getElementById("e_ids").value
    })
  }).then(function() { closeModal(); loadSongs(); }).catch(function(e){ alert(e.message); });
}

function setBlock(id, blocked) { req("/api/admin/song/block", { method: "POST", body: JSON.stringify({ id: id, blocked: blocked }) }).then(loadSongs); }
function delSong(id) { if (confirm("确认彻底删除 #" + id + "？")) req("/api/admin/song/delete", { method: "POST", body: JSON.stringify({ id: id }) }).then(loadSongs); }
function resetBili(id) { req("/api/admin/song/reset-bili", { method: "POST", body: JSON.stringify({ id: id }) }).then(function(){ alert("已清除 BVID"); loadSongs(); }); }

function renderLyricsTab() {
  var st = dashData.stats || {};
  var miss = Math.max(0, (st.songs || 0) - (st.lyrics || 0));
  var pct = st.songs ? Math.round((st.lyrics / st.songs) * 100) : 0;

  var h = '<div class="card"><h3>全库歌词补全引擎（网易云双语 + LRCLIB 自动补全）</h3>' +
    '<p style="font-size:13px;color:var(--muted);margin-bottom:10px;">当前已存歌词 <b>' + (st.lyrics||0) + '</b> 首，缺失 <b>' + miss + '</b> 首（覆盖率 ' + pct + '%）。每批处理 10 首并自动写入 D1 永久复用。</p>' +
    '<div class="pbar"><div id="bfBar" style="width:' + pct + '%"></div></div>' +
    '<div class="row"><button class="green" id="bfBtn" onclick="toggleBackfill()">⚡ 一键批量补全缺失歌词</button>' +
    '<span id="bfStat" style="font-size:12px;color:var(--muted);">就绪</span></div>' +
    '<div id="bfLog" style="font-size:12px;color:var(--muted);max-height:110px;overflow-y:auto;font-family:monospace;"></div></div>';

  h += '<div class="card"><h3>歌词检索与在线编辑器</h3><div class="row">' +
    '<input id="lq" placeholder="搜歌名或歌手..." style="flex:1;" onkeydown="if(event.key===\\'Enter\\'){lrcPage=1;loadLyricsList();}" />' +
    '<select id="lflt" onchange="lrcPage=1;loadLyricsList()"><option value="no_lrc">只看缺歌词</option><option value="has_lrc">只看已有歌词</option><option value="active">全部正常歌曲</option></select>' +
    '<button onclick="lrcPage=1;loadLyricsList()">查询</button></div><div id="lrcTbl">加载中...</div></div>';

  document.getElementById("main").innerHTML = h;
  loadLyricsList();
}

function toggleBackfill() {
  if (backfillRunning) { backfillRunning = false; document.getElementById("bfBtn").textContent = "继续补全"; return; }
  backfillRunning = true;
  document.getElementById("bfBtn").textContent = "暂停补全";
  runBackfillLoop(0, 0, 0);
}

function runBackfillLoop(afterId, totalProc, totalUpd) {
  if (!backfillRunning) return;
  document.getElementById("bfStat").textContent = "正在扫描 ID > " + afterId + "（已处理 " + totalProc + "，成功补全 " + totalUpd + "）...";
  req("/api/admin/lyrics/backfill", { method: "POST", body: JSON.stringify({ afterId: afterId }) }).then(function(r) {
    totalProc += r.processed;
    totalUpd += r.updated;
    var logBox = document.getElementById("bfLog");
    if (logBox && r.logs && r.logs.length) {
      logBox.innerHTML = r.logs.map(esc).join("<br>") + "<br>" + logBox.innerHTML;
    }
    if (r.done || !r.processed) {
      backfillRunning = false;
      document.getElementById("bfBtn").textContent = "⚡ 一键批量补全缺失歌词";
      document.getElementById("bfStat").textContent = "全部扫描完成！共处理 " + totalProc + " 首，成功补全 " + totalUpd + " 首";
      loadLyricsList();
      return;
    }
    if (backfillRunning) runBackfillLoop(r.lastId, totalProc, totalUpd);
  }).catch(function(e) {
    backfillRunning = false;
    document.getElementById("bfBtn").textContent = "重试补全";
    document.getElementById("bfStat").textContent = "中断：" + e.message;
  });
}

function loadLyricsList() {
  var q = (document.getElementById("lq")?.value || "");
  var flt = (document.getElementById("lflt")?.value || "no_lrc");
  req("/api/admin/songs?q=" + encodeURIComponent(q) + "&filter=" + flt + "&page=" + lrcPage).then(function(d) {
    lrcRows = d.songs || [];
    var h = '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">匹配 ' + d.total + ' 首</div><table><tr><th>ID</th><th>歌曲</th><th>歌词状态</th><th>操作</th></tr>';
    for (var i = 0; i < lrcRows.length; i++) {
      var s = lrcRows[i];
      h += '<tr><td>#' + s.id + '</td><td><b>' + esc(s.title) + '</b> - <small style="color:var(--muted);">' + esc(s.artist) + '</small></td>' +
        '<td>' + (s.lrc_len > 10 ? '<span class="badge ok">' + s.lrc_len + ' 字符</span>' : '<span class="badge miss">缺失</span>') + '</td>' +
        '<td><button class="sm" onclick="openEditLyric(' + s.id + ')">编辑 / 抓取歌词</button></td></tr>';
    }
    h += '</table><div class="row" style="margin-top:12px;justify-content:space-between;">' +
      '<button class="ghost sm" ' + (lrcPage <= 1 ? "disabled" : "") + ' onclick="lrcPage--;loadLyricsList()">上一页</button>' +
      '<button class="ghost sm" ' + (lrcPage * d.limit >= d.total ? "disabled" : "") + ' onclick="lrcPage++;loadLyricsList()">下一页</button></div>';
    document.getElementById("lrcTbl").innerHTML = h;
  });
}

function openEditLyric(id) {
  req("/api/admin/song?id=" + id).then(function(d) {
    var s = d.song;
    document.getElementById("modalBody").innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
      '<h3>歌词编辑：' + esc(s.title) + '</h3>' +
      '<button class="sm green" onclick="fetchOneLyric(' + s.id + ')">在线重抓预览</button></div>' +
      '<label style="font-size:12px;color:var(--muted);">主歌词（LRC）</label>' +
      '<textarea id="e_lrc" rows="10">' + esc(s.lyric_lrc || "") + '</textarea>' +
      '<label style="font-size:12px;color:var(--muted);display:block;margin-top:8px;">双语翻译歌词（可选）</label>' +
      '<textarea id="e_trans" rows="5">' + esc(s.lyric_trans || "") + '</textarea>' +
      '<div class="row" style="justify-content:flex-end;margin-top:12px;">' +
      '<button class="ghost" onclick="closeModal()">取消</button><button onclick="saveLyric(' + s.id + ')">保存歌词</button></div>';
    document.getElementById("modalBg").classList.add("open");
  });
}

function fetchOneLyric(id) {
  req("/api/admin/lyric/fetch", { method: "POST", body: JSON.stringify({ id: id }) }).then(function(r) {
    if (!r.lrc) return alert("在线未匹配到该歌歌词");
    document.getElementById("e_lrc").value = r.lrc;
    document.getElementById("e_trans").value = r.trans || "";
  });
}

function saveLyric(id) {
  req("/api/admin/song/update", {
    method: "POST", body: JSON.stringify({
      id: id, onlyLyric: true,
      lyric_lrc: document.getElementById("e_lrc").value,
      lyric_trans: document.getElementById("e_trans").value
    })
  }).then(function() { closeModal(); if (curTab === "lyrics") loadLyricsList(); else loadSongs(); });
}

function renderChartsTab() {
  var list = dashData.charts || [];
  var h = '<div class="card"><h3>首页榜单排序与分类管理</h3><table><tr><th>ID</th><th>标题</th><th>分类</th><th>排序(小在前)</th><th>操作</th></tr>';
  for (var i = 0; i < list.length; i++) {
    var c = list[i];
    h += '<tr><td><small>' + esc(c.id) + '</small></td>' +
      '<td><input id="ct-' + i + '" value="' + esc(c.title) + '" style="width:160px;" /></td>' +
      '<td><input id="cc-' + i + '" value="' + esc(c.category) + '" style="width:120px;" /></td>' +
      '<td><input id="cs-' + i + '" type="number" value="' + c.sort_order + '" style="width:70px;" /></td>' +
      '<td><button class="sm" onclick="saveChart(' + i + ')">保存</button> <button class="sm red" onclick="delChart(' + i + ')">删</button></td></tr>';
  }
  h += '</table></div>';
  document.getElementById("main").innerHTML = h;
}
function saveChart(i) {
  var c = dashData.charts[i];
  req("/api/admin/chart/update", {
    method: "POST", body: JSON.stringify({
      id: c.id, title: document.getElementById("ct-" + i).value,
      category: document.getElementById("cc-" + i).value, sort_order: Number(document.getElementById("cs-" + i).value)
    })
  }).then(function(){ alert("已更新"); loadAll(); });
}
function delChart(i) {
  var c = dashData.charts[i]; if (!confirm("删除榜单 " + c.title + "？")) return;
  req("/api/admin/chart/delete", { method: "POST", body: JSON.stringify({ id: c.id }) }).then(loadAll);
}

function closeModal() { document.getElementById("modalBg").classList.remove("open"); }
loadAll();
</script>
</body>
</html>`;
