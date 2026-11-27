
# 🎵 Music Hub

基于 **Cloudflare Workers + D1 + GitHub Actions** 构建的极速全网聚合音乐服务。提供独立 **Web/PWA 双主题播放器**、**后台控制中心**，以及完全兼容 **MusicFree** 的云端订阅源。

## ✨ 核心特性

- **多源并发竞速与防试听校验**：服务端并发探测酷我、GDStudio、VKeys、Meting、塞壬唱片官方源；自动校验字节体积，智能拦截 30 秒试听片段与垃圾翻唱/伴奏版本。
- **Web / PWA 单页播放器**：
  - 🌙 / ☀️ 深浅双主题一键切换。
  - 自建歌单管理，支持导入网易云 / QQ音乐 / 纯文本清单，并支持生成云端分享链接与跨软件导出。
  - 75+ 热门与经典歌手广场，支持全网任意歌手实时检索与正版专辑墙浏览。
  - 实时可用音源切换、双语同步歌词、睡眠定时、桌面快捷键与手机 PWA 适配。
- **MusicFree 订阅源支持**：
  - 下发 `/musicfree.json`，完整支持**单曲 / 专辑 / 歌手 / 歌单搜索**、**推荐歌单**、**榜单**以及**外部歌单与分享链接导入**。
- **后台控制中心 (`/admin`)**：曲库检索与编辑、一键批量补全歌词、歌单导入、动态音源池热插拔与测活、订阅链接与二维码生成。

## 📂 目录结构

```text
music-hub/
├── SRC/
│   ├── worker.js        # Cloudflare Worker 主网关与 MusicFree 动态插件端点
│   ├── player_html.js   # Web / PWA 播放器前端
│   └── admin_html.js    # 管理后台前端
├── plugins/             # 可选纯静态 MusicFree 插件脚本（由 plugins.json 索引）
├── schema.sql           # D1 数据库表结构与 FTS5 全文索引
├── sync.py              # GitHub Actions 定时同步榜单与歌词脚本
├── wrangler.toml        # Cloudflare Worker 部署配置
└── .github/workflows/   # 自动部署与每日同步工作流
```

## 🚀 快速部署

### 1. 创建 Cloudflare D1 数据库
在 Cloudflare 控制台或使用 Wrangler 创建名为 `music-db` 的 D1 数据库，并将获得的 `database_id` 填入 `wrangler.toml`。

### 2. 配置 GitHub Repository Secrets
在仓库 `Settings -> Secrets and variables -> Actions` 中添加：
- `CF_API_TOKEN`：具备 Workers 与 D1 编辑权限的 Cloudflare API Token
- `CF_ACCOUNT_ID`：Cloudflare 账户 ID
- `CF_D1_DATABASE_ID`：D1 数据库 ID
- `ACCESS_TOKEN`：（可选）播放器与订阅源访问密钥
- `ADMIN_PASSWORD`：`/admin` 管理后台登录密码

### 3. 触发部署与初始数据同步
1. 推送代码到 `main` 分支（或手动触发 Actions 中的 `Deploy Music Hub Worker`），会自动初始化 `schema.sql` 并发布 Worker。
2. 手动运行一次 Actions 中的 `Sync Music Hub Charts & Lyrics`，拉取初始榜单与歌词到 D1。

## 📱 使用方式

- **网页/手机听歌**：访问 `https://你的域名/player?token=你的ACCESS_TOKEN`
- **管理后台**：访问 `https://你的域名/admin`
- **MusicFree 订阅源**：在 MusicFree 的「插件管理 -> 从网络安装」填入：
  `https://你的域名/musicfree.json?token=你的ACCESS_TOKEN`

## ⚠️ 免责声明
本项目仅用于个人技术学习与架构研究，所有音频与元数据均来源于公开第三方接口或官方直连，请遵守当地法律法规与版权协议。
