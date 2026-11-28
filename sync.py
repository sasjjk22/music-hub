import json
import os
import re
import time
import urllib.error
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
DEFAULT_JUNK_WORDS = ("dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok", "消音版", "片段", "高潮版", "0.8x", "1.2x")
LRC_MISS_TTL_SEC = 14 * 86400

TRAD_SIMP_LIST = (
    "啞哑", "謙谦", "傑杰", "倫伦", "陳陈", "張张", "劉刘", "楊杨", "趙赵", "黃黄", "吳吴", "鄭郑", "孫孙", "馬马", "羅罗",
    "葉叶", "蘇苏", "蔣蒋", "韓韩", "馮冯", "鄧邓", "蕭萧", "謝谢", "許许", "盧卢", "韋韦", "莊庄", "嚴严", "鍾钟", "麥麦",
    "歐欧", "陽阳", "溫温", "藍蓝", "齊齐", "學学", "榮荣", "麗丽", "龍龙", "遙遥", "輝辉", "闊阔", "問问", "戀恋", "蘭兰",
    "煉炼", "單单", "愛爱", "說说", "聽听", "後后", "來来", "這这", "為为", "們们", "無无", "樂乐", "夢梦", "風风", "飛飞",
    "開开", "關关", "門门", "長长", "時时", "見见", "還还", "過过", "對对", "錯错", "點点", "線线", "書书", "寫写", "語语",
    "話话", "詞词", "調调", "聲声", "響响", "誰谁", "麼么", "裡里", "邊边", "頭头", "臉脸", "淚泪", "傷伤", "獨独", "員员",
    "國国", "華华", "東东", "萬万", "億亿", "雙双", "與与", "給给", "讓让", "願愿", "會会", "該该", "經经", "總总", "結结",
    "終终", "離离", "別别", "記记", "憶忆", "懷怀", "變变", "動动", "靜静", "歡欢", "難难", "實实", "虛虚", "輕轻", "遠远",
    "舊旧", "歲岁", "晝昼", "顏颜", "紅红", "綠绿", "銀银", "鐵铁", "銅铜", "鋼钢", "網网", "雲云", "電电",
)
TRAD_SIMP_MAP = str.maketrans({p[0]: p[1] for p in TRAD_SIMP_LIST})

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

CLASSIC_QUERIES = [
    "周杰伦 晴天", "周杰伦 七里香", "周杰伦 稻香",
    "张学友 吻别", "张学友 一路上有你", "陈奕迅 十年", "陈奕迅 富士山下",
    "Beyond 海阔天空", "Beyond 光辉岁月", "王菲 红豆", "王菲 匆匆那年",
    "林俊杰 江南", "林俊杰 修炼爱情", "孙燕姿 遇见", "孙燕姿 我怀念的",
    "邓丽君 月亮代表我的心", "张国荣 风继续吹", "李宗盛 山丘",
    "朴树 平凡之路", "许巍 蓝莲花", "伍佰 挪威的森林",
    "莫文蔚 盛夏的果实", "陶喆 爱很简单", "五月天 突然好想你",
]


def http_json(url, method="GET", headers=None, data=None, form=None, timeout=18, retries=3):
    hdrs = {"User-Agent": UA}
    if headers:
        hdrs.update(headers)
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        hdrs.setdefault("Content-Type", "application/json")
    elif form is not None:
        body = urllib.parse.urlencode(form).encode("utf-8")
        hdrs.setdefault("Content-Type", "application/x-www-form-urlencoded")

    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, data=body, headers=hdrs, method=method)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code in (429, 500, 502, 503, 504) and attempt + 1 < retries:
                time.sleep(1.2 * (2 ** attempt))
                continue
            raise
        except Exception as e:
            last_err = e
            if attempt + 1 < retries:
                time.sleep(1.0 * (2 ** attempt))
                continue
            raise
    raise last_err


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
        retries=3,
    )
    if not res.get("success"):
        raise RuntimeError(f"D1 query error: {res}")
    return res["result"][0].get("results", [])


def set_setting(key, value):
    d1_query(
        "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        [str(key), str(value)],
    )


def load_sync_settings():
    rows = d1_query("SELECT key, value FROM settings")
    kv = {r["key"]: r["value"] for r in rows}

    def to_int(k, default):
        try:
            return max(0, int(str(kv.get(k, default)).strip()))
        except Exception:
            return default

    if "junk_words" in kv:
        junk_words = tuple(w.strip().lower() for w in kv["junk_words"].split(",") if w.strip())
    else:
        junk_words = DEFAULT_JUNK_WORDS

    try:
        lrc_miss = json.loads(kv.get("sync_lrc_miss") or "{}")
        if not isinstance(lrc_miss, dict):
            lrc_miss = {}
    except Exception:
        lrc_miss = {}

    return {
        "enabled": str(kv.get("sync_enabled", "1")).strip() != "0",
        "lrc_limit": to_int("sync_lrc_limit", 450),
        "chart_max": to_int("sync_chart_max", 120),
        "junk_words": junk_words,
        "lrc_miss": lrc_miss,
    }


def to_simplified(s):
    return str(s or "").translate(TRAD_SIMP_MAP)


def https_cover(u):
    s = str(u or "")
    if s.startswith("http://") and "music.126.net" in s:
        return "https://" + s[7:]
    return s


def norm_text(s):
    raw = to_simplified(s).lower().strip()
    stripped = re.sub(r"[\(（\[【].*?[\)）\]】]", "", raw)
    stripped = re.sub(r"\s+", " ", stripped).strip()
    return stripped or re.sub(r"\s+", " ", re.sub(r"[\(\)\[\]（）【】]", "", raw)).strip()


def norm_title_for_key(s):
    raw = to_simplified(s).lower().strip()
    variants = []
    for seg in re.findall(r"[\(（\[【]([^\)）\]】]+)[\)）\]】]", raw):
        if re.search(r"(live|现场|演唱会|remix|dj|伴奏|纯音乐|钢琴|吉他|弹唱|翻唱|cover|加速|降调|清唱|night version)", seg, re.I):
            variants.append(seg.strip())
    base = norm_text(raw)
    return re.sub(r"\s+", " ", (base + (" " + " ".join(variants) if variants else ""))).strip()


def make_norm_key(title, artist):
    first_artist = re.split(r"[/,、]|\s+&\s+", artist or "")[0]
    return f"{norm_title_for_key(title)}|{norm_text(first_artist)}"


def is_junk(title, junk_words):
    if not junk_words:
        return False
    t = to_simplified(title).lower()
    return any(w in t for w in junk_words)


def clean_lrc(raw):
    if not raw:
        return ""
    text = str(raw).lstrip("\ufeff")
    text = re.sub(r"\[(\d{1,3}:\d{2}):(\d{1,3})\]", r"[\1.\2]", text)
    bad_meta = ("作词 :", "作曲 :", "编曲 :", "制作人 :", "作词:", "作曲:", "作词：", "作曲：", "QQ音乐", "网易云")
    lines = [line for line in text.splitlines() if not any(k in line for k in bad_meta)]
    return "\n".join(lines).strip()


def fetch_netease_lyric(song_id):
    try:
        url = f"https://music.163.com/api/song/lyric?id={song_id}&lv=-1&kv=-1&tv=-1"
        data = http_json(url, headers=NE_HEADERS, timeout=8, retries=2)
        lrc = clean_lrc((data.get("lrc") or {}).get("lyric", ""))
        trans = clean_lrc((data.get("tlyric") or {}).get("lyric", ""))
        return lrc, trans
    except Exception:
        return "", ""


def fetch_lrclib(title, artist):
    try:
        clean_artist = re.split(r"[/,、]|\s+&\s+", artist or "")[0].strip()
        qs = urllib.parse.urlencode({"track_name": norm_text(title), "artist_name": clean_artist})
        data = http_json(f"https://lrclib.net/api/get?{qs}", timeout=8, retries=1)
        return clean_lrc(data.get("syncedLyrics") or data.get("plainLyrics") or "")
    except Exception:
        return ""


def load_existing_state():
    state = {}
    last_id = 0
    while True:
        rows = d1_query(
            "SELECT id, norm_key, cover, duration, source_ids_json, score, length(lyric_lrc) AS lrc_len "
            "FROM songs WHERE id > ? ORDER BY id ASC LIMIT 2000",
            [last_id],
        )
        if not rows:
            break
        for r in rows:
            last_id = r["id"]
            state[r["norm_key"]] = {
                "id": r["id"],
                "cover": r.get("cover") or "",
                "duration": r.get("duration") or 0,
                "source_ids": json.loads(r.get("source_ids_json") or "{}"),
                "score": r.get("score") or 0,
                "has_lrc": (r.get("lrc_len") or 0) > 10,
            }
        if len(rows) < 2000:
            break
    return state


def hydrate_netease_tracks(pl, limit):
    tracks = list(pl.get("tracks") or [])
    track_ids = [x.get("id") for x in (pl.get("trackIds") or []) if x.get("id")]
    if len(track_ids) > len(tracks) and len(tracks) < limit:
        have = {str(t.get("id")) for t in tracks if t.get("id")}
        missing = [tid for tid in track_ids[:limit] if str(tid) not in have]
        for i in range(0, len(missing), 200):
            chunk = missing[i : i + 200]
            try:
                sd = http_json(
                    "https://music.163.com/api/v3/song/detail",
                    method="POST",
                    headers=NE_HEADERS,
                    form={"c": json.dumps([{"id": tid} for tid in chunk])},
                    timeout=12,
                    retries=2,
                )
                for s in sd.get("songs") or []:
                    if str(s.get("id")) not in have:
                        have.add(str(s.get("id")))
                        tracks.append(s)
            except Exception as e:
                print(f"  [Warn] hydrate song/detail failed: {e}")
    return tracks


def crawl_netease_charts(songs_map, charts_list, chart_max, junk_words):
    for cid, c_title, c_cat, song_cat, sort_order, default_limit in NETEASE_CHARTS:
        limit = min(default_limit, chart_max) if chart_max > 0 else default_limit
        print(f"Fetching Netease chart: {c_title} ({cid}, limit={limit})...")
        time.sleep(0.8)
        pl = {}
        for ep in (
            f"https://music.163.com/api/v6/playlist/detail?id={cid}&n={limit}",
            f"https://music.163.com/api/playlist/detail?id={cid}",
        ):
            try:
                data = http_json(ep, headers=NE_HEADERS, timeout=15, retries=2)
                cand = data.get("playlist") or data.get("result") or {}
                if cand.get("tracks") or cand.get("trackIds"):
                    pl = cand
                    break
            except Exception as e:
                print(f"  [Warn] {ep} failed: {e}")
                time.sleep(0.6)

        tracks = hydrate_netease_tracks(pl, limit) if pl else []
        print(f"  -> got {len(tracks)} tracks")
        if len(tracks) < 10:
            print(f"  [Skip] chart {c_title} returned too few tracks ({len(tracks)}), preserving existing chart")
            continue

        keys = []
        for idx, t in enumerate(tracks[:limit]):
            title = (t.get("name") or "").strip()
            if not title or is_junk(title, junk_words):
                continue
            artists = " / ".join(a.get("name", "") for a in (t.get("ar") or t.get("artists") or []) if a.get("name")) or "未知歌手"
            nk = make_norm_key(title, artists)
            if not nk or nk == "|":
                continue
            score = max(10, 1000 - idx * 5)
            nid = str(t["id"])
            alb = t.get("al") or t.get("album") or {}
            cov = https_cover(alb.get("picUrl") or "")
            dur = round((t.get("dt") or t.get("duration") or 0) / 1000)
            if nk not in songs_map:
                songs_map[nk] = {
                    "norm_key": nk,
                    "title": title,
                    "artist": artists,
                    "album": alb.get("name", ""),
                    "cover": cov,
                    "duration": dur,
                    "category": song_cat,
                    "score": score,
                    "source_ids": {"netease": nid},
                }
            else:
                songs_map[nk]["source_ids"]["netease"] = nid
                songs_map[nk]["score"] = max(songs_map[nk]["score"], score)
                if not songs_map[nk]["cover"] and cov:
                    songs_map[nk]["cover"] = cov
                if songs_map[nk]["duration"] == 0 and dur > 0:
                    songs_map[nk]["duration"] = dur
            if nk not in keys:
                keys.append(nk)

        charts_list.append(
            {
                "id": f"ne_{cid}",
                "title": c_title,
                "category": c_cat,
                "cover": https_cover(pl.get("coverImgUrl", "")),
                "description": (pl.get("description") or "")[:120],
                "norm_keys": keys,
                "sort_order": sort_order,
            }
        )


def crawl_classic_evergreens(songs_map, charts_list, junk_words):
    print("Fetching Evergreen Classic Songs...")
    classic_keys = []
    first_cover = ""
    for idx_q, q in enumerate(CLASSIC_QUERIES):
        time.sleep(0.5)
        try:
            qs = urllib.parse.urlencode({"s": q, "type": 1, "limit": 4, "offset": 0})
            data = http_json(f"https://music.163.com/api/cloudsearch/pc?{qs}", headers=NE_HEADERS, timeout=12, retries=2)
            songs = (data.get("result") or {}).get("songs") or []
            for idx, t in enumerate(songs[:2]):
                title = (t.get("name") or "").strip()
                if not title or is_junk(title, junk_words):
                    continue
                artists = " / ".join(a.get("name", "") for a in (t.get("ar") or []) if a.get("name")) or "未知歌手"
                nk = make_norm_key(title, artists)
                alb = t.get("al") or {}
                cov = https_cover(alb.get("picUrl", ""))
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
                        "score": 880 - idx * 20 - idx_q,
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
        albums = http_json("https://monster-siren.hypergryph.com/api/albums", headers=hdrs, timeout=20, retries=2).get("data") or []
        songs = (http_json("https://monster-siren.hypergryph.com/api/songs", headers=hdrs, timeout=20, retries=2).get("data") or {}).get("list") or []
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


def batch_update_meta(rows, now):
    for i in range(0, len(rows), 5):
        batch = rows[i : i + 5]
        ids = [u["id"] for u in batch]
        ph = ",".join(["?"] * len(ids))
        case_sids = " ".join(["WHEN ? THEN ?"] * len(batch))
        case_score = " ".join(["WHEN ? THEN ?"] * len(batch))
        case_cov = " ".join(["WHEN ? THEN ?"] * len(batch))
        case_dur = " ".join(["WHEN ? THEN ?"] * len(batch))
        params = []
        for u in batch:
            params.extend([u["id"], u["source_ids_json"]])
        for u in batch:
            params.extend([u["id"], u["score"]])
        for u in batch:
            params.extend([u["id"], u["cover"]])
        for u in batch:
            params.extend([u["id"], u["duration"]])
        params.append(now)
        params.extend(ids)
        d1_query(
            f"UPDATE songs SET "
            f"source_ids_json = CASE id {case_sids} ELSE source_ids_json END, "
            f"score = CASE id {case_score} ELSE score END, "
            f"cover = CASE id {case_cov} ELSE cover END, "
            f"duration = CASE id {case_dur} ELSE duration END, "
            f"updated_at = ? WHERE id IN ({ph})",
            params,
        )


def main():
    cfg = load_sync_settings()
    if not cfg["enabled"]:
        print("Sync is paused via admin settings (sync_enabled=0). Exiting.")
        set_setting("last_sync_at", int(time.time()))
        set_setting("last_sync_summary", "已在后台暂停自动同步")
        return

    lrc_limit = cfg["lrc_limit"]
    chart_max = cfg["chart_max"]
    junk_words = cfg["junk_words"]
    now = int(time.time())
    lrc_miss = {k: int(v) for k, v in cfg["lrc_miss"].items() if now - int(v) < LRC_MISS_TTL_SEC}
    print(f"Sync config -> enabled=1, lrc_limit={lrc_limit}, chart_max={chart_max}, lrc_miss_cache={len(lrc_miss)}")

    existing = load_existing_state()
    print(f"Existing songs in D1: {len(existing)}")

    songs_map = {}
    charts_list = []
    crawl_netease_charts(songs_map, charts_list, chart_max, junk_words)
    crawl_classic_evergreens(songs_map, charts_list, junk_words)
    crawl_msr_official(songs_map, charts_list)

    to_insert = []
    to_update_meta = []
    to_update_lrc = []
    lrc_attempts = 0
    lrc_success = 0

    for nk, item in songs_map.items():
        old = existing.get(nk)
        if not old:
            lrc, trans = "", ""
            if lrc_attempts < lrc_limit:
                if "netease" in item["source_ids"]:
                    lrc, trans = fetch_netease_lyric(item["source_ids"]["netease"])
                if not lrc:
                    lrc = fetch_lrclib(item["title"], item["artist"])
                lrc_attempts += 1
                if lrc:
                    lrc_success += 1
            to_insert.append({**item, "lyric_lrc": lrc, "lyric_trans": trans})
        else:
            merged_ids = {**old["source_ids"], **item["source_ids"]}
            ids_changed = merged_ids != old["source_ids"]
            score_changed = abs(item["score"] - old["score"]) >= 100
            cover_repair = (not old["cover"]) and bool(item["cover"])
            dur_repair = (old["duration"] == 0) and (item["duration"] > 0)
            miss_active = str(old["id"]) in lrc_miss
            need_lrc = (not old["has_lrc"]) and (not miss_active) and (lrc_attempts < lrc_limit)

            lrc, trans = "", ""
            if need_lrc:
                if "netease" in merged_ids:
                    lrc, trans = fetch_netease_lyric(merged_ids["netease"])
                if not lrc:
                    lrc = fetch_lrclib(item["title"], item["artist"])
                lrc_attempts += 1
                if lrc:
                    lrc_success += 1
                    to_update_lrc.append({"id": old["id"], "lyric_lrc": lrc, "lyric_trans": trans})
                else:
                    lrc_miss[str(old["id"])] = now

            if ids_changed or score_changed or cover_repair or dur_repair:
                to_update_meta.append(
                    {
                        "id": old["id"],
                        "source_ids_json": json.dumps(merged_ids, ensure_ascii=False),
                        "score": max(old["score"], item["score"]) if not score_changed else item["score"],
                        "cover": item["cover"] if cover_repair else old["cover"],
                        "duration": item["duration"] if dur_repair else old["duration"],
                    }
                )

    print(f"Delta -> Insert: {len(to_insert)}, UpdateMeta: {len(to_update_meta)}, UpdateLrc: {len(to_update_lrc)}, LrcTries: {lrc_attempts}")

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

    if to_update_meta:
        batch_update_meta(to_update_meta, now)

    for u in to_update_lrc:
        d1_query(
            "UPDATE songs SET lyric_lrc=?, lyric_trans=?, updated_at=? WHERE id=?",
            [u["lyric_lrc"], u["lyric_trans"], now, u["id"]],
        )

    nk_to_id = {nk: info["id"] for nk, info in existing.items()}
    if to_insert:
        new_nks = [s["norm_key"] for s in to_insert]
        for i in range(0, len(new_nks), 60):
            chunk = new_nks[i : i + 60]
            ph = ",".join(["?"] * len(chunk))
            for r in d1_query(f"SELECT id, norm_key FROM songs WHERE norm_key IN ({ph})", chunk):
                nk_to_id[r["norm_key"]] = r["id"]

    synced_charts = 0
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
        synced_charts += 1

    if len(lrc_miss) > 3000:
        trimmed = sorted(lrc_miss.items(), key=lambda x: x[1], reverse=True)[:3000]
        lrc_miss = dict(trimmed)
    set_setting("sync_lrc_miss", json.dumps(lrc_miss))

    summary = f"榜单 {synced_charts} 个 · 新增 {len(to_insert)} 首 · 更新 {len(to_update_meta)} 首 · 补歌词 {lrc_success}/{lrc_attempts} 首"
    set_setting("last_sync_at", now)
    set_setting("last_sync_summary", summary)
    print("Sync completed:", summary)


if __name__ == "__main__":
    main()
