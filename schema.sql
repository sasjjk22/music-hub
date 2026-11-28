-- 1. 动态解析音源池（支持后台热插拔）
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,          -- 'agg' | 'vkeys' | 'native' | 'bili' | 'migu' | 'kuwo' | 'kugou' | 'meting'
  endpoint TEXT DEFAULT '',
  priority INTEGER DEFAULT 10,
  enabled INTEGER DEFAULT 1,
  fail_count INTEGER DEFAULT 0,
  updated_at INTEGER DEFAULT 0
);

-- 2. 歌曲永久元数据表（绝不存会过期的直链）
CREATE TABLE IF NOT EXISTS songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  norm_key TEXT NOT NULL UNIQUE,   -- 标准化歌名|标准化歌手（含关键版本标记）
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  duration INTEGER DEFAULT 0,
  category TEXT DEFAULT '华语',
  tags TEXT DEFAULT '',
  score INTEGER DEFAULT 0,
  lyric_lrc TEXT DEFAULT '',
  lyric_trans TEXT DEFAULT '',
  source_ids_json TEXT DEFAULT '{}',
  updated_at INTEGER DEFAULT 0,
  is_blocked INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_songs_cat_score ON songs(category, score DESC);
CREATE INDEX IF NOT EXISTS idx_songs_score ON songs(score DESC);

-- 3. FTS5 全文索引
CREATE VIRTUAL TABLE IF NOT EXISTS songs_fts USING fts5(
  title,
  artist,
  album,
  content='songs',
  content_rowid='id',
  tokenize='trigram'
);

CREATE TRIGGER IF NOT EXISTS songs_ai AFTER INSERT ON songs BEGIN
  INSERT INTO songs_fts(rowid, title, artist, album)
  VALUES (new.id, new.title, new.artist, new.album);
END;

CREATE TRIGGER IF NOT EXISTS songs_ad AFTER DELETE ON songs BEGIN
  INSERT INTO songs_fts(songs_fts, rowid, title, artist, album)
  VALUES ('delete', old.id, old.title, old.artist, old.album);
END;

CREATE TRIGGER IF NOT EXISTS songs_au AFTER UPDATE OF title, artist, album ON songs BEGIN
  INSERT INTO songs_fts(songs_fts, rowid, title, artist, album)
  VALUES ('delete', old.id, old.title, old.artist, old.album);
  INSERT INTO songs_fts(rowid, title, artist, album)
  VALUES (new.id, new.title, new.artist, new.album);
END;

-- 4. 榜单与精选歌单表
CREATE TABLE IF NOT EXISTS charts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT '热门榜单',
  cover TEXT DEFAULT '',
  description TEXT DEFAULT '',
  song_ids_json TEXT DEFAULT '[]',
  sort_order INTEGER DEFAULT 100,
  updated_at INTEGER DEFAULT 0
);

-- 5. 系统策略配置表
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 6. 用户自建歌单云端分享表（支持播放器打开 & MusicFree 导入）
CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  songs_json TEXT NOT NULL,
  created_at INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO sources (id, name, type, endpoint, priority, enabled) VALUES
  ('msr', '塞壬唱片官方直连', 'native', 'https://monster-siren.hypergryph.com/api', 5, 1),
  ('kuwo', '酷我官方/移动端直连', 'kuwo', 'https://mobi.kuwo.cn', 8, 1),
  ('gdstudio', 'GDStudio 聚合解析', 'agg', 'https://music-api.gdstudio.xyz/api.php', 10, 1),
  ('vkeys', 'VKeys / 落月 QQ解析', 'vkeys', 'https://api.vkeys.cn/v2/music', 12, 1),
  ('migu', '咪咕音乐官方解析', 'migu', 'https://app.c.nf.migu.cn', 15, 1),
  ('kugou', '酷狗 / Baka Meting', 'kugou', 'https://api.baka.plus/meting/', 20, 1),
  ('meting', 'Injahow Meting (Lv1-2)', 'meting', 'https://api.injahow.cn/meting/', 30, 1),
  ('bili', 'B站 WBI 音频流兜底', 'bili', 'https://api.bilibili.com', 90, 1);

INSERT OR IGNORE INTO settings (key, value) VALUES
  ('junk_words', 'dj版,dj舞曲,伴奏,喊麦,铃声,广场舞,卡拉ok,消音版,片段,高潮版,0.8x,1.2x'),
  ('player_debug', '0');
