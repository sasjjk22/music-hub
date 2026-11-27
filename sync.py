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

# 榜单配置: (playlist_id, 标题, 首页分类, 歌曲分类, 排序权重, 抓取数量)
NETEASE_CHARTS = [
    ("3778678", "热歌榜", "核心榜单", "华语", 10, 120),
    ("19723756", "飙升榜", "核心榜单", "华语", 15, 100),
    ("3779629", "新歌榜", "核心榜单", "华语", 20, 100),
    ("2884035", "原创榜", "核心榜单", "华语", 25, 80),
    ("4395559", "华语金曲榜", "经典金曲", "经典", 30, 100),
    ("2945028696", "时光点唱机 · 90年代经典", "经典金曲", "经典", 32, 80),
    ("21845217", "KTV 经典嗨榜", "经典金曲", "经典", 34, 80),
    ("10169002", "香港电台龙虎榜 · 粤语", "经典金曲", "经典", 36, 60),
    ("2920647537", "华语慢情歌精选", "华语怀旧", "华语", 42, 60),
    ("2900343697", "一周影视原声热歌", "华语怀旧", "华语", 45, 60),
    ("71385702", "ACG 音乐榜", "ACG / 二次元", "ACG", 60, 100),
    ("60131", "日本 Oricon 榜", "日韩欧美", "日韩", 70, 60),
    ("3733003", "韩国 Melon 周榜", "日韩欧美", "日韩", 75, 50),
    ("60198", "美国 Billboard 榜", "日韩欧美", "欧美", 80, 60),
    ("991319590", "中文说唱榜", "垂类精选", "华语", 85, 60),
    ("10520166", "电音榜", "垂类精选", "电音", 90, 60),
    ("71384707", "古典音乐榜", "垂类精选", "纯音乐", 100, 60),
]

# 必收常青经典代表作检索词（确保老歌神曲永远在首页“经典必听榜”和搜索里随时点播）
CLASSIC_QUERIES = [
    "周杰伦 晴天 七里香 稻香",
    "张学友 吻别 一路上有你 祝福",
    "陈奕迅 十年 富士山下 浮夸",
    "Beyond 海阔天空 光辉岁月 真的爱你",
    "王菲 红豆 传奇 匆匆那年",
    "林俊杰 江南 修炼爱情 曹操",
    "孙燕姿 遇见 我怀念的 天黑黑",
    "邓丽君 月亮代表我的心 甜蜜蜜",
    "张国荣 风继续吹 沉默是金",
    "李宗盛 凡人歌 山丘 鬼迷心窍",
    "朴树 平凡之路 生如夏花 那些花儿",
    "许巍 曾经的你 蓝莲花 故乡",
    "伍佰 挪威的森林 突然的自我",
    "莫文蔚 阴天 盛夏的果实 慢慢喜欢你",
    "陶喆 爱很简单 就是爱你 流沙",
    "五月天 突然好想你 倔强 温柔",
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
        time.sleep(1.0)
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
                time.sleep(0.8)

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
            if nk not in keys:
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


def crawl_classic_evergreens(songs_map, charts_list):
    print("Fetching Evergreen Classic Songs...")
    classic_keys = []
    first_cover = ""
    for q in CLASSIC_QUERIES:
        time.sleep(0.6)
        try:
            qs = urllib.parse.urlencode({"s": q, "type": 1, "limit": 6, "offset": 0})
            data = http_json(f"https://music.163.com/api/cloudsearch/pc?{qs}", headers=NE_HEADERS, timeout=12)
            songs = (data.get("result") or {}).get("songs") or []
            for idx, t in enumerate(songs):
                title = (t.get("name") or "").strip()
                if not title or is_junk(title):
                    continue
                artists = " / ".join(a.get("name", "") for a in (t.get("ar") or []) if a.get("name")) or "未知歌手"
                nk = make_norm_key(title, artists)
                alb = t.get("al") or {}
                cov = alb.get("picUrl", "")
                if cov and not first_cover:
                    first_cover = cov
                nid = str(t["id"])
                if nk not in songs_map:
                    songs_map[nk] = {
                        "norm_key": nk,
                        "title": title,
                        "artist": artists,
                        "album": alb.get("name", ""),
                        "cover": cov,
                        "duration": round((t.get("dt") or 0) / 1000),
                        "category": "经典",
                        "score": 880 - idx * 10,
                        "source_ids": {"netease": nid},
                    }
                else:
                    songs_map[nk]["source_ids"]["netease"] = nid
                if nk not in classic_keys:
                    classic_keys.append(nk)
        except Exception as e:
            print(f"  [Warn] classic {q} failed: {e}")

    if classic_keys:
        charts_list.append(
            {
                "id": "classic_evergreen",
                "title": "华语经典 · 传世金曲 100",
                "category": "经典金曲",
                "cover": first_cover,
                "description": "周杰伦、张学友、Beyond、王菲、陈奕迅、邓丽君等华语时代必听金曲",
                "norm_keys": classic_keys[:100],
                "sort_order": 28,
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


def main():
    existing = load_existing_state()
    print(f"Existing songs in D1: {len(existing)}")

    songs_map = {}
    charts_list = []
    crawl_netease_charts(songs_map, charts_list)
    crawl_classic_evergreens(songs_map, charts_list)
    crawl_msr_official(songs_map, charts_list)

    now = int(time.time())
    to_insert = []
    to_update = []
    lrc_fetched = 0

    for nk, item in songs_map.items():
        old = existing.get(nk)
        if not old:
            lrc, trans = "", ""
            if lrc_fetched < 450:
                if "netease" in item["source_ids"]:
                    lrc, trans = fetch_netease_lyric(item["source_ids"]["netease"])
                if not lrc:
                    lrc = fetch_lrclib(item["title"], item["artist"])
                lrc_fetched += 1
            to_insert.append({**item, "lyric_lrc": lrc, "lyric_trans": trans})
        else:
            merged_ids = {**old["source_ids"], **item["source_ids"]}
            ids_changed = merged_ids != old["source_ids"]
            score_changed = abs(item["score"] - old["score"]) >= 50
            need_lrc = (not old["has_lrc"]) and lrc_fetched < 450
            if ids_changed or score_changed or need_lrc:
                lrc, trans = "", ""
                if need_lrc:
                    if "netease" in merged_ids:
                        lrc, trans = fetch_netease_lyric(merged_ids["netease"])
                    if not lrc:
                        lrc = fetch_lrclib(item["title"], item["artist"])
                    lrc_fetched += 1
                to_update.append(
                    {
                        "id": old["id"],
                        "source_ids_json": json.dumps(merged_ids, ensure_ascii=False),
                        "score": item["score"],
                        "lyric_lrc": lrc,
                        "lyric_trans": trans,
                    }
                )

    print(f"Delta -> Insert: {len(to_insert)}, Update: {len(to_update)}, Lyrics fetched: {lrc_fetched}")

    for i in range(0, len(to_insert), 5):
        batch = to_insert[i : i + 5]
        placeholders = ",".join(["(?,?,?,?,?,?,?,?,?,?,?,?,?)"] * len(batch))
        params = []
        for s in batch:
            params.extend(
                [
                    s["norm_key"], s["title"], s["artist"], s["album"], s["cover"],
                    s["duration"], s["category"], "", s["score"],
                    s["lyric_lrc"], s["lyric_trans"],
                    json.dumps(s["source_ids"], ensure_ascii=False), now,
                ]
            )
        d1_query(
            f"""INSERT INTO songs
            (norm_key,title,artist,album,cover,duration,category,tags,score,lyric_lrc,lyric_trans,source_ids_json,updated_at)
            VALUES {placeholders}
            ON CONFLICT(norm_key) DO NOTHING""",
            params,
        )

    for u in to_update:
        if u["lyric_lrc"]:
            d1_query(
                "UPDATE songs SET source_ids_json=?, score=?, lyric_lrc=?, lyric_trans=?, updated_at=? WHERE id=?",
                [u["source_ids_json"], u["score"], u["lyric_lrc"], u["lyric_trans"], now, u["id"]],
            )
        else:
            d1_query(
                "UPDATE songs SET source_ids_json=?, score=?, updated_at=? WHERE id=?",
                [u["source_ids_json"], u["score"], now, u["id"]],
            )

    if to_insert:
        id_rows = d1_query("SELECT id, norm_key FROM songs")
        nk_to_id = {r["norm_key"]: r["id"] for r in id_rows}
    else:
        nk_to_id = {nk: info["id"] for nk, info in existing.items()}

    for ch in charts_list:
        song_ids = [nk_to_id[nk] for nk in ch["norm_keys"] if nk in nk_to_id]
        if not song_ids:
            continue
        d1_query(
            """INSERT INTO charts (id,title,category,cover,description,song_ids_json,sort_order,updated_at)
            VALUES (?,?,?,?,?,?,?,?)
            ON CONFLICT(id) DO UPDATE SET
              title=excluded.title, category=excluded.category, cover=excluded.cover,
              description=excluded.description, song_ids_json=excluded.song_ids_json,
              sort_order=excluded.sort_order, updated_at=excluded.updated_at""",
            [ch["id"], ch["title"], ch["category"], ch["cover"], ch["description"], json.dumps(song_ids), ch["sort_order"], now],
        )

    print("Sync completed successfully.")


if __name__ == "__main__":
    main()
