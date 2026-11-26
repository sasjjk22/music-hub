export const PLAYER_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="referrer" content="no-referrer" />
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<title>Music Hub</title>
<style>
  :root{--bg:#090c14;--side:#0f1420;--card:rgba(255,255,255,.04);--card-h:rgba(255,255,255,.08);--line:rgba(255,255,255,.07);--text:#f8fafc;--muted:#94a3b8;--acc:#38bdf8;--pink:#f43f5e;}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:6px;height:6px;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:3px;}
  .layout{display:flex;min-height:100vh;padding-bottom:96px;}
  .sidebar{width:220px;flex-shrink:0;background:var(--side);border-right:1px solid var(--line);padding:20px 14px;display:flex;flex-direction:column;gap:6px;position:sticky;top:0;height:100vh;}
  .logo{font-size:20px;font-weight:800;padding:6px 12px 18px;display:flex;align-items:center;gap:8px;cursor:pointer;}
  .logo-dot{width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#818cf8);box-shadow:0 0 12px #38bdf8;}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:14px;font-weight:500;color:var(--muted);cursor:pointer;transition:.15s;}
  .nav-item:hover{background:var(--card);color:var(--text);}
  .nav-item.active{background:linear-gradient(90deg,rgba(56,189,248,.18),rgba(129,140,248,.1));color:#fff;font-weight:600;}
  .nav-sep{height:1px;background:var(--line);margin:10px 6px;}
  .side-foot{margin-top:auto;font-size:12px;color:var(--muted);padding:10px 12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;}
  .main-wrap{flex:1;min-width:0;display:flex;flex-direction:column;}
  .topbar{position:sticky;top:0;z-index:20;background:rgba(9,12,20,.78);backdrop-filter:blur(24px);padding:12px 24px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:12px;}
  .m-brand{display:none;font-weight:800;font-size:16px;color:#fff;}
  .search-box{flex:1;max-width:460px;position:relative;display:flex;align-items:center;}
  .search-box input{width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);color:#fff;padding:9px 14px 9px 36px;border-radius:999px;font-size:13px;outline:none;}
  .search-ico{position:absolute;left:13px;color:var(--muted);font-size:13px;pointer-events:none;}
  .top-actions{margin-left:auto;display:flex;gap:8px;align-items:center;}
  .m-nav{display:none;gap:6px;padding:8px 16px;overflow-x:auto;background:rgba(9,12,20,.9);border-bottom:1px solid var(--line);}
  .btn{background:var(--acc);color:#06121f;border:none;padding:8px 16px;border-radius:999px;font-weight:600;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;}
  .btn.ghost{background:rgba(255,255,255,.08);color:var(--text);} .btn.sm{padding:6px 12px;font-size:12px;}
  .pill{padding:6px 14px;border-radius:999px;font-size:12px;background:rgba(255,255,255,.06);color:var(--muted);border:none;cursor:pointer;white-space:nowrap;}
  .pill.active{background:#fff;color:#090c14;font-weight:600;}
  .content{padding:20px 24px;max-width:1200px;width:100%;margin:0 auto;}
  .sec-head{display:flex;justify-content:space-between;align-items:center;margin:8px 0 14px;gap:10px;flex-wrap:wrap;}
  .sec-title{font-size:19px;font-weight:700;}
  .pills{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
  .artists-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:14px;margin-bottom:28px;}
  .ar-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 10px;text-align:center;cursor:pointer;transition:.2s;}
  .ar-card:hover{background:var(--card-h);transform:translateY(-3px);}
  .ar-ava{width:64px;height:64px;border-radius:50%;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;}
  .ar-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ar-tag{font-size:11px;color:var(--muted);margin-top:2px;}
  .charts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:16px;}
  .ch-card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;cursor:pointer;transition:.2s;position:relative;}
  .ch-card:hover{background:var(--card-h);transform:translateY(-3px);}
  .ch-img-wrap{position:relative;aspect-ratio:1/1;background:#161e2e;overflow:hidden;}
  .ch-img-wrap img{width:100%;height:100%;object-fit:cover;display:block;}
  .ch-play-fab{position:absolute;right:10px;bottom:10px;width:36px;height:36px;border-radius:50%;background:var(--acc);color:#06121f;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;opacity:0;transition:.2s;}
  .ch-card:hover .ch-play-fab{opacity:1;}
  .ch-info{padding:10px 12px;} .ch-t{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;} .ch-c{font-size:12px;color:var(--muted);margin-top:2px;}
  .hero{position:relative;border-radius:20px;overflow:hidden;padding:24px;margin-bottom:20px;background:rgba(255,255,255,.04);border:1px solid var(--line);display:flex;gap:22px;align-items:flex-end;flex-wrap:wrap;}
  .hero-bg{position:absolute;inset:-40px;background-size:cover;background-position:center;filter:blur(50px) brightness(.42);opacity:.7;z-index:0;}
  .hero-cover{position:relative;z-index:1;width:140px;height:140px;border-radius:16px;object-fit:cover;background:#1e293b;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:46px;font-weight:800;color:#fff;}
  .hero-meta{position:relative;z-index:1;flex:1;min-width:220px;}
  .hero-sub{font-size:12px;color:var(--acc);font-weight:600;margin-bottom:4px;}
  .hero-title{font-size:26px;font-weight:800;margin-bottom:6px;} .hero-desc{font-size:13px;color:#cbd5e1;margin-bottom:14px;}
  .hero-btns{display:flex;gap:10px;flex-wrap:wrap;}
  .song-list{display:flex;flex-direction:column;gap:4px;}
  .s-row{display:grid;grid-template-columns:36px 46px 1.6fr 1fr 64px 72px;align-items:center;gap:12px;padding:8px 12px;border-radius:12px;cursor:pointer;}
  .s-row:hover{background:var(--card-h);} .s-row.active{background:rgba(56,189,248,.12);}
  .s-num{text-align:center;font-size:13px;color:var(--muted);} .s-row.active .s-num{color:var(--acc);font-weight:700;}
  .eq{display:inline-flex;align-items:flex-end;gap:2px;height:14px;} .eq i{width:3px;background:var(--acc);border-radius:2px;animation:eq .8s ease-in-out infinite alternate;} .eq i:nth-child(2){animation-delay:.2s;} .eq i:nth-child(3){animation-delay:.4s;} @keyframes eq{0%{height:4px}100%{height:14px}}
  .s-cov{width:44px;height:44px;border-radius:8px;object-fit:cover;background:#1e293b;}
  .s-main{min-width:0;} .s-title{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;} .s-row.active .s-title{color:var(--acc);}
  .s-artist{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
  .s-album{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .s-dur{font-size:12px;color:var(--muted);text-align:right;}
  .s-ops{display:flex;justify-content:flex-end;gap:6px;}
  .ico-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:15px;padding:4px 6px;border-radius:6px;} .ico-btn:hover{color:#fff;background:rgba(255,255,255,.1);} .ico-btn.loved{color:var(--pink);}
  .dock{position:fixed;left:0;right:0;bottom:0;z-index:40;background:rgba(13,18,30,.92);backdrop-filter:blur(26px);border-top:1px solid var(--line);padding:10px 20px calc(10px + env(safe-area-inset-bottom));display:grid;grid-template-columns:1.2fr 1.6fr 1fr;align-items:center;gap:16px;}
  .dock-left{display:flex;align-items:center;gap:12px;min-width:0;}
  .dock-cov{width:48px;height:48px;border-radius:10px;object-fit:cover;background:#1e293b;cursor:pointer;flex-shrink:0;}
  .dock-meta{min-width:0;cursor:pointer;} .dock-t{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;} .dock-a{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
  .dock-mid{display:flex;flex-direction:column;align-items:center;gap:5px;}
  .ctrl-btns{display:flex;align-items:center;gap:14px;}
  .play-fab{width:36px;height:36px;border-radius:50%;background:#fff;color:#090c14;border:none;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;}
  .prog-row{width:100%;max-width:460px;display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted);} .prog-row input[type=range]{flex:1;height:4px;accent-color:var(--acc);cursor:pointer;}
  .dock-right{display:flex;align-items:center;justify-content:flex-end;gap:10px;}
  .vol-range{width:76px;height:4px;accent-color:#cbd5e1;}
  .src-badge{font-size:11px;padding:3px 8px;border-radius:6px;background:rgba(56,189,248,.14);color:var(--acc);cursor:pointer;white-space:nowrap;}
  .drawer{position:fixed;top:0;right:-360px;bottom:84px;width:340px;max-width:90vw;z-index:45;background:rgba(15,20,32,.97);border-left:1px solid var(--line);transition:right .25s ease;display:flex;flex-direction:column;padding:16px;} .drawer.open{right:0;} .drawer-list{flex:1;overflow-y:auto;margin-top:10px;display:flex;flex-direction:column;gap:4px;}
  .lyric-stage{position:fixed;inset:0;z-index:60;background:#070a12;display:none;flex-direction:column;overflow:hidden;} .lyric-stage.open{display:flex;}
  .stage-bg{position:absolute;inset:-60px;background-size:cover;background-position:center;filter:blur(70px) brightness(.36) saturate(1.4);transform:scale(1.1);z-index:0;}
  .stage-top{position:relative;z-index:2;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;}
  .stage-body{position:relative;z-index:2;flex:1;display:grid;grid-template-columns:1fr 1.2fr;align-items:center;gap:40px;max-width:1120px;width:100%;margin:0 auto;padding:10px 32px 30px;min-height:0;}
  .stage-left{display:flex;flex-direction:column;align-items:center;text-align:center;}
  .stage-art{width:min(320px,65vw);aspect-ratio:1/1;border-radius:20px;object-fit:cover;box-shadow:0 24px 60px rgba(0,0,0,.65);margin-bottom:20px;background:#1e293b;}
  .stage-lrc{height:64vh;overflow-y:auto;padding:24vh 10px;scroll-behavior:smooth;-webkit-mask-image:linear-gradient(transparent,black 18%,black 82%,transparent);}
  .lrc-row{padding:10px 12px;font-size:18px;font-weight:600;color:rgba(255,255,255,.42);cursor:pointer;border-radius:10px;} .lrc-row.cur{color:#fff;font-size:23px;font-weight:700;} .lrc-row small{display:block;font-size:14px;font-weight:400;margin-top:3px;opacity:.78;}
  .auth-wrap{max-width:380px;margin:16vh auto;background:var(--side);border:1px solid var(--line);padding:28px;border-radius:20px;text-align:center;}
  .auth-wrap input{width:100%;background:rgba(255,255,255,.06);border:1px solid var(--line);color:#fff;padding:11px 14px;border-radius:12px;margin:14px 0;outline:none;}
  @media(max-width:860px){
    .sidebar{display:none;} .m-brand{display:block;} .m-nav{display:flex;} .topbar{padding:10px 14px;} .content{padding:14px;}
    .s-row{grid-template-columns:28px 42px 1fr 48px 36px;gap:8px;padding:8px;} .s-album,.vol-range,.dock-right .btn-hide-m{display:none;}
    .dock{grid-template-columns:1fr auto;padding:8px 12px calc(8px + env(safe-area-inset-bottom));} .dock-mid{display:none;} .dock-mobile-ctrl{display:flex !important;align-items:center;gap:8px;}
    .stage-body{grid-template-columns:1fr;gap:14px;padding:0 18px 20px;} .stage-art{width:150px;margin-bottom:10px;} .stage-lrc{height:44vh;padding:14vh 4px;text-align:center;}
  }
  .dock-mobile-ctrl{display:none;}
</style>
</head>
<body>
<div class="layout">
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
      <div class="search-box"><span class="search-ico">&#128269;</span>
        <input id="qInput" placeholder="搜全网歌曲 / 歌手（如 张学友、晴天）" onkeydown="if(event.key==='Enter')doSearch()" />
      </div>
      <button class="btn sm" onclick="doSearch()">搜索</button>
      <div class="top-actions"><button class="btn ghost sm btn-hide-m" onclick="toggleQueue()">队列</button></div>
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
    <button class="ico-btn" id="dFavBtn" onclick="toggleCurFav()">&#9825;</button>
  </div>
  <div class="dock-mid">
    <div class="ctrl-btns">
      <button class="ico-btn" id="modeBtn" onclick="toggleMode()">顺序</button>
      <button class="ico-btn" onclick="prevSong()">&#9198;</button>
      <button class="play-fab" id="playFab" onclick="togglePlay()">&#9654;</button>
      <button class="ico-btn" onclick="nextSong()">&#9197;</button>
      <button class="ico-btn" onclick="toggleLyricModal(true)">词</button>
    </div>
    <div class="prog-row"><span id="curT">0:00</span><input type="range" id="seek" min="0" max="100" value="0" oninput="seekPct(this.value)" /><span id="durT">0:00</span></div>
  </div>
  <div class="dock-right">
    <span class="src-badge" id="srcBadge" onclick="switchBili()">源: 自动</span>
    <input class="vol-range" type="range" min="0" max="1" step="0.02" value="0.9" oninput="audio.volume=this.value" />
    <button class="ico-btn btn-hide-m" onclick="toggleQueue()">&#9776;</button>
    <div class="dock-mobile-ctrl"><button class="play-fab" id="playFabM" onclick="togglePlay()">&#9654;</button><button class="ico-btn" onclick="nextSong()">&#9197;</button></div>
  </div>
</div>

<aside class="drawer" id="qDrawer">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <b style="font-size:15px;">播放队列 (<span id="qCount">0</span>)</b>
    <button class="btn ghost sm" onclick="toggleQueue()">关闭</button>
  </div>
  <div class="drawer-list" id="qList"></div>
</aside>

<div class="lyric-stage" id="lrcStage">
  <div class="stage-bg" id="stageBg"></div>
  <div class="stage-top">
    <button class="btn ghost sm" onclick="toggleLyricModal(false)">&#8595; 收起</button>
    <div style="display:flex;gap:8px;"><button class="btn ghost sm" onclick="switchBili()">切B站源</button><button class="btn ghost sm" onclick="openTimer()">定时关闭</button></div>
  </div>
  <div class="stage-body">
    <div class="stage-left">
      <img id="sArt" class="stage-art" referrerpolicy="no-referrer" src="" />
      <div id="sTitle" style="font-size:22px;font-weight:800;margin-bottom:4px;"></div>
      <div id="sArtist" style="font-size:14px;color:#cbd5e1;margin-bottom:16px;"></div>
      <div class="prog-row" style="max-width:320px;margin-bottom:14px;"><span id="curTS">0:00</span><input type="range" id="seekS" min="0" max="100" value="0" oninput="seekPct(this.value)" /><span id="durTS">0:00</span></div>
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
var chartsCache = [], artistsCache = [], artistCat = "全部", chartCat = "全部", viewSongs = [], playQueue = [], curIdx = -1, curSong = null, curSource = "", playMode = "loop", lrcRows = [], timerId = null;
var audio = document.getElementById("audio"); audio.volume = 0.9;
var favs = JSON.parse(localStorage.getItem("mh_favs") || "[]");
var recents = JSON.parse(localStorage.getItem("mh_recents") || "[]");
var GRADS = ["linear-gradient(135deg,#0284c7,#6366f1)","linear-gradient(135deg,#db2777,#f43f5e)","linear-gradient(135deg,#059669,#10b981)","linear-gradient(135deg,#d97706,#f59e0b)","linear-gradient(135deg,#7c3aed,#a855f7)"];

function api(path) {
  var sep = path.indexOf("?") >= 0 ? "&" : "?";
  return fetch(path + sep + "token=" + encodeURIComponent(TOKEN)).then(function(r) {
    if (r.status === 401) { showAuth(); throw new Error("401"); }
    return r.json();
  });
}
function showAuth() {
  document.getElementById("app").innerHTML = '<div class="auth-wrap"><h3>输入访问密钥</h3><p style="font-size:12px;color:var(--muted);margin-top:6px;">对应 ACCESS_TOKEN</p><input id="tkIn" type="password" placeholder="输入 ACCESS_TOKEN" onkeydown="if(event.key===\\'Enter\\')saveToken()" /><button class="btn" style="width:100%;justify-content:center;" onclick="saveToken()">进入 Music Hub</button></div>';
}
function saveToken() { TOKEN = document.getElementById("tkIn").value.trim(); localStorage.setItem("mh_token", TOKEN); nav("discover"); }
function setNavActive(id) {
  ["discover", "artists", "fav", "recent"].forEach(function(k) {
    var a = document.getElementById("nav-" + k), b = document.getElementById("mnav-" + k);
    if (a) a.classList.toggle("active", k === id); if (b) b.classList.toggle("active", k === id);
  });
}
function nav(tab) {
  setNavActive(tab);
  if (tab === "fav") { renderHeroList("我喜欢的音乐", "本地红心收藏", "", favs, "收藏夹"); return; }
  if (tab === "recent") { renderHeroList("最近播放", "保留最近 80 首", "", recents, "播放记录"); return; }
  if (chartsCache.length) { if (tab === "artists") renderArtistsPage(); else renderDiscover(); return; }
  document.getElementById("app").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">正在载入音乐库...</div>';
  api("/api/home").then(function(d) {
    chartsCache = d.charts || []; artistsCache = d.artists || [];
    document.getElementById("sideCount").textContent = chartsCache.length + " 榜单";
    if (tab === "artists") renderArtistsPage(); else renderDiscover();
  }).catch(function(){});
}
function renderDiscover() {
  var html = '<div class="sec-head"><div class="sec-title">热门歌手</div><button class="btn ghost sm" onclick="nav(\\'artists\\')">全部歌手 &rarr;</button></div><div class="artists-grid">';
  for (var a = 0; a < Math.min(10, artistsCache.length); a++) {
    var ar = artistsCache[a];
    html += '<div class="ar-card" onclick="openArtistIdx(' + a + ')"><div class="ar-ava" style="background:' + GRADS[a % GRADS.length] + '">' + esc(ar.name.slice(0, 1)) + '</div><div class="ar-name">' + esc(ar.name) + '</div><div class="ar-tag">' + esc(ar.tag) + '</div></div>';
  }
  html += '</div>';
  var cCats = ["全部"];
  for (var j = 0; j < chartsCache.length; j++) { var cat = chartsCache[j].category || "其他"; if (cCats.indexOf(cat) < 0) cCats.push(cat); }
  html += '<div class="sec-head"><div class="sec-title">精选与经典榜单</div></div><div class="pills">';
  for (var k = 0; k < cCats.length; k++) html += '<button class="pill' + (chartCat === cCats[k] ? " active" : "") + '" onclick="setChartCat(\\'' + cCats[k] + '\\')">' + esc(cCats[k]) + '</button>';
  html += '</div><div class="charts-grid">';
  for (var i = 0; i < chartsCache.length; i++) {
    var c = chartsCache[i];
    if (chartCat !== "全部" && c.category !== chartCat) continue;
    html += '<div class="ch-card" onclick="openChartIdx(' + i + ')"><div class="ch-img-wrap"><img loading="lazy" referrerpolicy="no-referrer" src="' + (c.cover || "") + '" /><div class="ch-play-fab">&#9654;</div></div><div class="ch-info"><div class="ch-t">' + esc(c.title) + '</div><div class="ch-c">' + esc(c.category) + '</div></div></div>';
  }
  html += '</div>';
  document.getElementById("app").innerHTML = html;
}
function setChartCat(cat) { chartCat = cat; renderDiscover(); }
function renderArtistsPage() {
  var cats = ["全部", "经典怀旧", "华语男", "华语女", "乐队组合", "日韩", "欧美", "ACG"];
  var html = '<div class="sec-head"><div class="sec-title">歌手广场</div></div><div class="pills">';
  for (var k = 0; k < cats.length; k++) html += '<button class="pill' + (artistCat === cats[k] ? " active" : "") + '" onclick="setArtistCat(\\'' + cats[k] + '\\')">' + cats[k] + '</button>';
  html += '</div><div class="artists-grid">';
  for (var i = 0; i < artistsCache.length; i++) {
    var ar = artistsCache[i]; if (artistCat !== "全部" && ar.cat !== artistCat) continue;
    html += '<div class="ar-card" onclick="openArtistIdx(' + i + ')"><div class="ar-ava" style="background:' + GRADS[i % GRADS.length] + '">' + esc(ar.name.slice(0, 1)) + '</div><div class="ar-name">' + esc(ar.name) + '</div><div class="ar-tag">' + esc(ar.tag) + '</div></div>';
  }
  html += '</div>';
  document.getElementById("app").innerHTML = html;
}
function setArtistCat(cat) { artistCat = cat; renderArtistsPage(); }
function openArtistIdx(i) {
  var ar = artistsCache[i]; if (!ar) return;
  document.getElementById("app").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">检索 ' + esc(ar.name) + '...</div>';
  api("/api/artist?name=" + encodeURIComponent(ar.name)).then(function(d) {
    var songs = d.songs || [];
    renderHeroList(ar.name, ar.tag + " · 共 " + songs.length + " 首", (songs[0] && songs[0].cover) || "", songs, "热门歌手");
  });
}
function openChartIdx(i) {
  var c = chartsCache[i]; if (!c) return;
  document.getElementById("app").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">加载榜单中...</div>';
  api("/api/chart?id=" + encodeURIComponent(c.id)).then(function(d) {
    var ch = d.chart || c, songs = d.songs || [];
    renderHeroList(ch.title, ch.description || ("精选 " + songs.length + " 首"), ch.cover || "", songs, c.category || "榜单");
  });
}
function doSearch() {
  var q = document.getElementById("qInput").value.trim(); if (!q) return nav("discover");
  document.getElementById("app").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">全网搜索中...</div>';
  api("/api/search?q=" + encodeURIComponent(q)).then(function(d) {
    var songs = d.songs || [];
    renderHeroList("搜索：" + q, "本地 + 全网实时匹配 " + songs.length + " 首", (songs[0] && songs[0].cover) || "", songs, "搜索结果");
  });
}
function renderHeroList(title, desc, cover, songs, subLabel) {
  viewSongs = songs || [];
  var bgStyle = cover ? ('background-image:url("' + cover + '")') : "background:linear-gradient(135deg,#0c4a6e,#312e81)";
  var covHtml = cover ? '<img class="hero-cover" referrerpolicy="no-referrer" src="' + cover + '" />' : '<div class="hero-cover" style="background:linear-gradient(135deg,#0284c7,#7c3aed);">' + esc(title.slice(0, 1)) + '</div>';
  var html = '<div class="hero"><div class="hero-bg" style="' + bgStyle + '"></div>' + covHtml +
    '<div class="hero-meta"><div class="hero-sub">' + esc(subLabel) + '</div><div class="hero-title">' + esc(title) + '</div><div class="hero-desc">' + esc(desc) + '</div><div class="hero-btns">' +
    (viewSongs.length ? '<button class="btn" onclick="playAll(false)">&#9654; 播放全部</button><button class="btn ghost" onclick="playAll(true)">随机播放</button>' : '') +
    '<button class="btn ghost" onclick="nav(\\'discover\\')">返回发现</button></div></div></div><div class="song-list">';
  if (!viewSongs.length) html += '<div style="padding:40px;text-align:center;color:var(--muted);">暂无歌曲</div>';
  for (var i = 0; i < viewSongs.length; i++) {
    var s = viewSongs[i], isCur = curSong && curSong.norm_key === s.norm_key, loved = isFav(s);
    html += '<div class="s-row' + (isCur ? " active" : "") + '" onclick="playViewIdx(' + i + ')">' +
      '<div class="s-num">' + (isCur ? '<span class="eq"><i></i><i></i><i></i></span>' : (i + 1 < 10 ? "0" + (i + 1) : i + 1)) + '</div>' +
      '<img class="s-cov" loading="lazy" referrerpolicy="no-referrer" src="' + (s.cover || "") + '" />' +
      '<div class="s-main"><div class="s-title">' + esc(s.title) + '</div><div class="s-artist">' + esc(s.artist) + '</div></div>' +
      '<div class="s-album">' + esc(s.album || s.category || "") + '</div><div class="s-dur">' + (s.duration ? fmt(s.duration) : "--:--") + '</div>' +
      '<div class="s-ops" onclick="event.stopPropagation()"><button class="ico-btn' + (loved ? " loved" : "") + '" onclick="toggleViewFav(' + i + ',this)">' + (loved ? "&#9829;" : "&#9825;") + '</button><button class="ico-btn" onclick="addNext(' + i + ')">+</button></div></div>';
  }
  document.getElementById("app").innerHTML = html + '</div>';
}
function playAll(shuffle) { if (!viewSongs.length) return; playQueue = viewSongs.slice(); if (shuffle) { playMode = "shuffle"; syncModeUI(); playQueueIdx(Math.floor(Math.random() * playQueue.length)); } else playQueueIdx(0); }
function playViewIdx(i) { playQueue = viewSongs.slice(); playQueueIdx(i); }
function addNext(i) { var s = viewSongs[i]; if (!s) return; if (!playQueue.length) { playQueue = [s]; playQueueIdx(0); return; } playQueue.splice(curIdx + 1, 0, s); renderQueue(); }

function playQueueIdx(idx, prefer) {
  if (idx < 0 || idx >= playQueue.length) return;
  curIdx = idx; var s = playQueue[idx]; curSong = s; curSource = prefer || "";
  document.getElementById("dock").style.display = "grid";
  document.getElementById("dCov").src = s.cover || "";
  document.getElementById("dTitle").textContent = s.title;
  document.getElementById("dArtist").textContent = s.artist + " · 解析中...";
  document.getElementById("sArt").src = s.cover || "";
  document.getElementById("sTitle").textContent = s.title;
  document.getElementById("sArtist").textContent = s.artist;
  document.getElementById("stageBg").style.backgroundImage = s.cover ? ('url("' + s.cover + '")') : "";
  updateFavBtns(); renderQueue();
  recents = [s].concat(recents.filter(function(r) { return r.norm_key !== s.norm_key; })).slice(0, 80);
  localStorage.setItem("mh_recents", JSON.stringify(recents));

  var qUrl = "/api/play?id=" + (s.id || 0) + "&q=high&ext_source=" + encodeURIComponent(s.ext_source || "") + "&ext_id=" + encodeURIComponent(s.ext_id || "") + "&title=" + encodeURIComponent(s.title || "") + "&artist=" + encodeURIComponent(s.artist || "") + "&album=" + encodeURIComponent(s.album || "") + "&cover=" + encodeURIComponent(s.cover || "") + "&duration=" + (s.duration || 0) + (prefer ? "&prefer=" + prefer + "&force=1" : "");
  api(qUrl).then(function(res) {
    if (res.error) {
      document.getElementById("dArtist").textContent = (res.trace ? res.trace.join(" | ") : res.error);
      document.getElementById("srcBadge").textContent = "解析失败";
      return;
    }
    if (res.songId) s.id = res.songId;
    curSource = res.source || "";
    audio.src = res.needProxy ? res.proxyUrl : res.url;
    audio.play().catch(function(){});
    document.getElementById("dArtist").textContent = s.artist;
    document.getElementById("srcBadge").textContent = "源: " + (res.source || "auto");
    setPlayingUI(true); updateMediaSession(s);
  });

  api("/api/song?id=" + (s.id || 0) + "&ext_source=" + encodeURIComponent(s.ext_source || "") + "&ext_id=" + encodeURIComponent(s.ext_id || "") + "&title=" + encodeURIComponent(s.title || "") + "&artist=" + encodeURIComponent(s.artist || "")).then(function(d) {
    parseLrc((d.song && d.song.lyric_lrc) || "", (d.song && d.song.lyric_trans) || "");
  });
}

audio.addEventListener("error", function() {
  if (curIdx >= 0 && curSource !== "bili" && curSource !== "bili_proxy") {
    document.getElementById("dArtist").textContent = (curSong ? curSong.artist : "") + " · 直链失败，切代理/B站...";
    playQueueIdx(curIdx, "bili");
  }
});
function updateMediaSession(s) {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({ title: s.title, artist: s.artist, album: s.album || "Music Hub", artwork: s.cover ? [{ src: s.cover, sizes: "512x512", type: "image/jpeg" }] : [] });
    navigator.mediaSession.setActionHandler("play", togglePlay); navigator.mediaSession.setActionHandler("pause", togglePlay);
    navigator.mediaSession.setActionHandler("previoustrack", prevSong); navigator.mediaSession.setActionHandler("nexttrack", nextSong);
  } catch {}
}
function setPlayingUI(p) {
  var ico = p ? "&#10074;&#10074;" : "&#9654;";
  document.getElementById("playFab").innerHTML = ico; document.getElementById("playFabM").innerHTML = ico; document.getElementById("playFabS").innerHTML = ico;
}
function switchBili() { if (curIdx >= 0) playQueueIdx(curIdx, "bili"); }
function togglePlay() { if (!audio.src) return; if (audio.paused) { audio.play(); setPlayingUI(true); } else { audio.pause(); setPlayingUI(false); } }
function toggleMode() { playMode = playMode === "loop" ? "one" : playMode === "one" ? "shuffle" : "loop"; syncModeUI(); }
function syncModeUI() { var l = playMode === "one" ? "单曲" : playMode === "shuffle" ? "随机" : "顺序"; document.getElementById("modeBtn").textContent = l; document.getElementById("modeBtnS").textContent = l; }
function prevSong() { if (playQueue.length) playQueueIdx(curIdx > 0 ? curIdx - 1 : playQueue.length - 1); }
function nextSong() { if (!playQueue.length) return; if (playMode === "one") { audio.currentTime = 0; audio.play(); return; } if (playMode === "shuffle" && playQueue.length > 1) { playQueueIdx(Math.floor(Math.random() * playQueue.length)); return; } playQueueIdx((curIdx + 1) % playQueue.length); }
function seekPct(v) { if (audio.duration) audio.currentTime = (v / 100) * audio.duration; }
audio.addEventListener("ended", nextSong);
audio.addEventListener("timeupdate", function() {
  var c = audio.currentTime || 0, d = audio.duration || 0, cs = fmt(c), ds = fmt(d);
  document.getElementById("curT").textContent = cs; document.getElementById("durT").textContent = ds; document.getElementById("curTS").textContent = cs; document.getElementById("durTS").textContent = ds;
  if (d > 0) { var pct = (c / d) * 100; document.getElementById("seek").value = pct; document.getElementById("seekS").value = pct; }
  highlightLrc(c);
});
function isFav(s) { return s && favs.some(function(f) { return f.norm_key === s.norm_key; }); }
function saveFavSong(s) { if (isFav(s)) favs = favs.filter(function(f) { return f.norm_key !== s.norm_key; }); else favs.unshift(s); localStorage.setItem("mh_favs", JSON.stringify(favs)); updateFavBtns(); }
function toggleViewFav(i, btn) { var s = viewSongs[i]; if (!s) return; saveFavSong(s); var l = isFav(s); btn.classList.toggle("loved", l); btn.innerHTML = l ? "&#9829;" : "&#9825;"; }
function toggleCurFav() { if (curSong) saveFavSong(curSong); }
function updateFavBtns() { var l = isFav(curSong); ["dFavBtn", "sFavBtn"].forEach(function(id) { var el = document.getElementById(id); if (el) { el.classList.toggle("loved", l); el.innerHTML = l ? "&#9829;" : "&#9825;"; } }); }
function toggleQueue() { document.getElementById("qDrawer").classList.toggle("open"); renderQueue(); }
function renderQueue() {
  document.getElementById("qCount").textContent = playQueue.length;
  var h = "";
  for (var i = 0; i < playQueue.length; i++) {
    var s = playQueue[i];
    h += '<div class="s-row' + (i === curIdx ? " active" : "") + '" style="grid-template-columns:24px 1fr;padding:7px 8px;" onclick="playQueueIdx(' + i + ')"><div class="s-num">' + (i === curIdx ? "&#9654;" : (i + 1)) + '</div><div class="s-main"><div class="s-title">' + esc(s.title) + '</div><div class="s-artist">' + esc(s.artist) + '</div></div></div>';
  }
  document.getElementById("qList").innerHTML = h || '<div style="padding:20px;text-align:center;color:var(--muted);font-size:13px;">队列为空</div>';
}
function parseLrc(raw, transRaw) {
  lrcRows = []; var transMap = {};
  (transRaw || "").split(/\\r?\\n/).forEach(function(line) { var m = line.match(/\\[(\\d+):(\\d+(?:\\.\\d+)?)\\](.*)/); if (m) transMap[Math.round((Number(m[1]) * 60 + Number(m[2])) * 10)] = m[3].trim(); });
  (raw || "").split(/\\r?\\n/).forEach(function(line) { var m = line.match(/\\[(\\d+):(\\d+(?:\\.\\d+)?)\\](.*)/); if (m) { var t = Number(m[1]) * 60 + Number(m[2]), txt = m[3].trim(); if (txt) lrcRows.push({ t: t, txt: txt, tr: transMap[Math.round(t * 10)] || "" }); } });
  var box = document.getElementById("lrcBox");
  if (!lrcRows.length) { box.innerHTML = '<div class="lrc-row">暂无同步歌词</div>'; return; }
  box.innerHTML = lrcRows.map(function(r, i) { return '<div class="lrc-row" id="lr' + i + '" onclick="seekLrc(' + i + ')">' + esc(r.txt) + (r.tr ? '<small>' + esc(r.tr) + '</small>' : '') + '</div>'; }).join("");
}
function seekLrc(i) { if (lrcRows[i] && audio.duration) { audio.currentTime = lrcRows[i].t; if (audio.paused) togglePlay(); } }
function highlightLrc(sec) {
  if (!lrcRows.length) return; var active = -1;
  for (var i = 0; i < lrcRows.length; i++) { if (sec >= lrcRows[i].t) active = i; else break; }
  var lines = document.querySelectorAll(".lrc-row");
  for (var j = 0; j < lines.length; j++) { if (j === active) { if (!lines[j].classList.contains("cur")) { lines[j].classList.add("cur"); lines[j].scrollIntoView({ behavior: "smooth", block: "center" }); } } else lines[j].classList.remove("cur"); }
}
function toggleLyricModal(open) { document.getElementById("lrcStage").classList.toggle("open", open); }
function openTimer() { var m = prompt("多少分钟后停止播放？（0取消）", "30"); if (m === null) return; clearTimeout(timerId); var mins = Number(m); if (mins > 0) { timerId = setTimeout(function() { audio.pause(); setPlayingUI(false); }, mins * 60000); alert("已设置 " + mins + " 分钟后停止"); } }
function fmt(s) { var m = Math.floor(s / 60), r = Math.floor(s % 60); return m + ":" + (r < 10 ? "0" : "") + r; }
function esc(s) { return String(s || "").replace(/[&<>"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
nav("discover");
</script>
</body>
</html>`;
