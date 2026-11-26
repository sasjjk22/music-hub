import json
import os
import re
import time
import urllib.parse
import urllib.request

CF_ACCOUNT_ID = os.environ["CF_ACCOUNT_ID"]
CF_API_TOKEN = os.environ["CF_API_TOKEN"]
CF_D1_ID = os.environ["CF_D1_DATABASE_ID"]

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
NE_HEADERS = {
    "Referer": "https://music.163.com/",
    "Cookie": "os=pc; appver=2.9.7",
}
JUNK_WORDS = ("dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok", "消音版")

NETEASE_CHARTS = [
    ("3778678", "热歌榜", "核心榜单", "华语", 10, 120),
    ("19723756", "飙升榜", "核心榜单", "华语", 20, 100),
    ("3779629", "新歌榜", "核心榜单", "华语", 30, 100),
    ("2884035", "原创榜", "核心榜单", "华语", 40, 80),
    ("4395559", "华语金曲榜", "华语怀旧", "华语", 50, 100),
    ("71385702", "ACG 音乐榜", "ACG / 二次元", "ACG", 60, 100),
    ("60131", "日本 Oricon 榜", "日韩欧美", "日韩", 70, 60),
    ("60198", "美国 Billboard 榜", "日韩欧美", "欧美", 80, 60),
    ("10520166", "电音榜", "垂类精选", "电音", 90, 60),
    ("71384707", "古典音乐榜", "垂类精选", "纯音乐", 100, 60),
]


def http_json(url, method="GET", headers=None, data=None, timeout=18):
    hdrs = {"User-Agent": UA}
    if headers:
        hdrs.update(headers)
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        hdrs.setdefault("Content-Type", "application/json")
    req = urllib.request.Request(url, data=body, headers=hdrs, method=method)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def d1_query(sql, params=None):
    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/d1/database/{CF_D1_ID}/query"
    payload = {"sql": sql}
    if params:
        payload["params"] = params
    res = http_json(
        url,
        method="POST",
        headers={"Authorization": f"Bearer {CF_API_TOKEN}"},
        data=payload,
        timeout=30,
    )
    if not res.get("success"):
        raise RuntimeError(f"D1 query error: {res}")
    return res["result"][0].get("results", [])


def norm_text(s):
    s = (s or "").lower().strip()
    s = re.sub(r"[\(（\[【].*?[\)）\]】]", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def make_norm_key(title, artist):
    first_artist = re.split(r"[/,、&]", artist or "")[0]
    return f"{norm_text(title)}|{norm_text(first_artist)}"


def is_junk(title):
    t = (title or "").lower()
    return any(w in t for w in JUNK_WORDS)


def clean_lrc(raw):
    if not raw:
        return ""
    lines = []
    for line in raw.splitlines():
        if any(k in line for k in ("作词 :", "作曲 :", "编曲 :", "制作人 :", "QQ音乐", "网易云")):
            continue
        lines.append(line)
    return "\n".join(lines).strip()


def fetch_netease_lyric(song_id):
    try:
        url = f"https://music.163.com/api/song/lyric?id={song_id}&lv=-1&kv=-1&tv=-1"
        data = http_json(url, headers=NE_HEADERS, timeout=8)
        lrc = clean_lrc((data.get("lrc") or {}).get("lyric", ""))
        trans = clean_lrc((data.get("tlyric") or {}).get("lyric", ""))
        return lrc, trans
    except Exception:
        return "", ""


def fetch_lrclib(title, artist):
    try:
        clean_artist = re.split(r"[/,、&]", artist or "")[0].strip()
        qs = urllib.parse.urlencode({"track_name": norm_text(title), "artist_name": clean_artist})
        data = http_json(f"https://lrclib.net/api/get?{qs}", timeout=8)
        return data.get("syncedLyrics") or data.get("plainLyrics") or ""
    except Exception:
        return ""


def load_existing_state():
    rows = d1_query(
        "SELECT id, norm_key, source_ids_json, score, length(lyric_lrc) AS lrc_len FROM songs"
    )
    state = {}
    for r in rows:
        state[r["norm_key"]] = {
            "id": r["id"],
            "source_ids": json.loads(r.get("source_ids_json") or "{}"),
            "score": r.get("score") or 0,
            "has_lrc": (r.get("lrc_len") or 0) > 10,
        }
    return state


def crawl_netease_charts(songs_map, charts_list):
    for cid, c_title, c_cat, song_cat, sort_order, limit in NETEASE_CHARTS:
        print(f"Fetching Netease chart: {c_title} ({cid})...")
        time.sleep(1.2)
        pl = {}
        for ep in (
            f"https://music.163.com/api/v6/playlist/detail?id={cid}&n={limit}",
            f"https://music.163.com/api/playlist/detail?id={cid}",
        ):
            try:
                data = http_json(ep, headers=NE_HEADERS, timeout=15)
                pl = data.get("playlist") or data.get("result") or {}
                if pl.get("tracks"):
                    break
            except Exception as e:
                print(f"  [Warn] {ep} failed: {e}")
                time.sleep(1.0)

        tracks = pl.get("tracks") or []
        print(f"  -> got {len(tracks)} tracks")
        if not tracks:
            continue

        keys = []
        for idx, t in enumerate(tracks[:limit]):
            title = (t.get("name") or "").strip()
            if not title or is_junk(title):
                continue
            artists = " / ".join(a.get("name", "") for a in (t.get("ar") or t.get("artists") or []) if a.get("name")) or "未知歌手"
            nk = make_norm_key(title, artists)
            if not nk or nk == "|":
                continue
            score = max(10, 1000 - idx * 5)
            nid = str(t["id"])
            if nk not in songs_map:
                songs_map[nk] = {
                    "norm_key": nk,
                    "title": title,
                    "artist": artists,
                    "album": (t.get("al") or t.get("album") or {}).get("name", ""),
                    "cover": (t.get("al") or t.get("album") or {}).get("picUrl", ""),
                    "duration": round((t.get("dt") or t.get("duration") or 0) / 1000),
                    "category": song_cat,
                    "score": score,
                    "source_ids": {"netease": nid},
                }
            else:
                songs_map[nk]["source_ids"]["netease"] = nid
                songs_map[nk]["score"] = max(songs_map[nk]["score"], score)
            keys.append(nk)

        charts_list.append(
            {
                "id": f"ne_{cid}",
                "title": c_title,
                "category": c_cat,
                "cover": pl.get("coverImgUrl", ""),
                "description": (pl.get("description") or "")[:120],
                "norm_keys": keys,
                "sort_order": sort_order,
            }
        )


def crawl_msr_official(songs_map, charts_list):
    print("Fetching Monster Siren (塞壬唱片) official library...")
    try:
        hdrs = {"Accept": "application/json", "Referer": "https://monster-siren.hypergryph.com/"}
        albums = http_json("https://monster-siren.hypergryph.com/api/albums", headers=hdrs, timeout=20).get("data") or []
        songs = (http_json("https://monster-siren.hypergryph.com/api/songs", headers=hdrs, timeout=20).get("data") or {}).get("list") or []
        album_map = {a["cid"]: a for a in albums}
        top_keys = []
        for idx, s in enumerate(songs):
            title = (s.get("name") or "").strip()
            artists = " / ".join(s.get("artists") or []) or "塞壬唱片-MSR"
            nk = make_norm_key(title, artists)
            alb = album_map.get(s.get("albumCid") or "", {})
            if nk not in songs_map:
                songs_map[nk] = {
                    "norm_key": nk,
                    "title": title,
                    "artist": artists,
                    "album": alb.get("name", "塞壬唱片"),
                    "cover": alb.get("coverUrl", ""),
                    "duration": 0,
                    "category": "ACG",
                    "score": 450,
                    "source_ids": {"msr": s["cid"]},
                }
            else:
                songs_map[nk]["source_ids"]["msr"] = s["cid"]
            if idx < 80:
                top_keys.append(nk)
        print(f"  -> MSR loaded {len(songs)} songs")
        if top_keys:
            charts_list.append(
                {
                    "id": "msr_all",
                    "title": "塞壬唱片 · 官方无损精选",
                    "category": "ACG / 二次元",
                    "cover": albums[0].get("coverUrl", "") if albums else "",
                    "description": "鹰角塞壬唱片官方免鉴权 WAV/MP3 无损直链曲库",
                    "norm_keys": top_keys,
                    "sort_order": 65,
                }
            )
    except Exception as e:
        print(f"  [Warn] MSR failed: {e}")


def crawl_bili_music_rank(songs_map, charts_list):
    print("Fetching Bilibili Music Ranking (rid=3)...")
    try:
        data = http_json(
            "https://api.bilibili.com/x/web-interface/ranking/v2?rid=3&type=all",
            headers={"Referer": "https://www.bilibili.com/"},
            timeout=15,
        )
        vlist = (data.get("data") or {}).get("list") or []
        keys = []
        for idx, v in enumerate(vlist[:50]):
            title = (v.get("title") or "").strip()
            if not title or is_junk(title):
                continue
            author = ((v.get("owner") or {}).get("name") or "UP主").strip()
            nk = make_norm_key(title, author)
            bvid = v.get("bvid")
            if not bvid:
                continue
            if nk not in songs_map:
                songs_map[nk] = {
                    "norm_key": nk,
                    "title": title,
                    "artist": author,
                    "album": "B站音乐热门",
                    "cover": v.get("pic", ""),
                    "duration": int(v.get("duration") or 0),
                    "category": "ACG",
                    "score": max(50, 700 - idx * 8),
                    "source_ids": {"bili": bvid},
                }
            else:
                songs_map[nk]["source_ids"]["bili"] = bvid
            keys.append(nk)
        print(f"  -> Bili loaded {len(keys)} items")
        if keys:
            charts_list.append(
                {
                    "id": "bili_music",
                    "title": "B站音乐区热门榜",
                    "category": "ACG / 二次元",
                    "cover": vlist[0].get("pic", "") if vlist else "",
                    "description": "Bilibili 音乐区全站热门投稿（翻唱 / 原创 / Live）",
                    "norm_keys": keys,
                    "sort_order": 68,
                }
            )
    except Exception as e:
        print(f"  [Warn] Bili rank failed: {e}")


def main():
    existing = load_existing_stat
