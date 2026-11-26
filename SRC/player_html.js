export const PLAYER_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="referrer" content="no-referrer" />
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<title>Music Hub · 单页极速版</title>
<style>
  :root{--bg:#070a11;--panel:rgba(255,255,255,.04);--hover:rgba(255,255,255,.08);--line:rgba(255,255,255,.08);--text:#f8fafc;--muted:#94a3b8;--acc:#38bdf8;--ok:#34d399;--warn:#fbbf24;--pink:#f43f5e;}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  html,body{height:100%;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;overflow:hidden;}
  ::-webkit-scrollbar{width:5px;height:5px;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:3px;}
  .app-shell{display:flex;flex-direction:column;height:100vh;}
  .topbar{height:58px;flex-shrink:0;background:rgba(10,14,24,.9);backdrop-filter:blur(20px);border-bottom:1px solid var(--line);padding:0 18px;display:flex;align-items:center;gap:12px;z-index:20;}
  .brand{font-size:17px;font-weight:800;display:flex;align-items:center;gap:8px;cursor:pointer;white-space:nowrap;}
  .dot{width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#818cf8);box-shadow:0 0 10px #38bdf8;}
  .nav-pills{display:flex;gap:4px;overflow-x:auto;}
  .npill{padding:6px 12px;border-radius:999px;font-size:13px;font-weight:500;color:var(--muted);background:none;border:none;cursor:pointer;white-space:nowrap;}
  .npill:hover{color:#fff;background:var(--panel);} .npill.active{background:rgba(56,189,248,.16);color:var(--acc);font-weight:600;}
  .search-wrap{flex:1;max-width:340px;margin-left:auto;display:flex;gap:6px;}
  .search-wrap input{width:100%;background:rgba(255,255,255,.07);border:1px solid var(--line);color:#fff;padding:7px 14px;border-radius:999px;font-size:13px;outline:none;}
  .btn{background:var(--acc);color:#06121f;border:none;padding:7px 14px;border-radius:999px;font-weight:600;font-size:12px;cursor:pointer;white-space:nowrap;}
  .btn.ghost{background:rgba(255,255,255,.08);color:var(--text);}
  .workspace{flex:1;min-height:0;display:grid;grid-template-columns:1.28fr .95fr;overflow:hidden;}
  .left-pane{overflow-y:auto;padding:16px 20px 28px;border-right:1px solid var(--line);}
  .right-stage{position:relative;overflow:hidden;display:flex;flex-direction:column;padding:20px 24px;background:#090d18;}
  .stage-blur{position:absolute;inset:-50px;background-size:cover;background-position:center;filter:blur(65px) brightness(.32) saturate(1.4);transform:scale(1.1);z-index:0;}
  .stage-inner{position:relative;z-index:1;display:flex;flex-direction:column;height:100%;min-height:0;}
  .sec-head{display:flex;justify-content:space-between;align-items:center;margin:4px 0 12px;gap:8px;flex-wrap:wrap;}
  .sec-title{font-size:17px;font-weight:700;}
  .pills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
  .pill{padding:5px 12px;border-radius:999px;font-size:12px;background:var(--panel);color:var(--muted);border:1px solid var(--line);cursor:pointer;white-space:nowrap;}
  .pill.active{background:#fff;color:#070a11;border-color:#fff;font-weight:600;}
  .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin-bottom:20px;}
  .card{background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:hidden;cursor:pointer;transition:.15s;}
  .card:hover{background:var(--hover);transform:translateY(-2px);}
  .card img{width:100%;aspect-ratio:1/1;object-fit:cover;background:#161e2e;display:block;}
  .card-body{padding:8px 10px;} .card-t{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;} .card-s{font-size:11px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ar-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:10px;margin-bottom:20px;}
  .ar-card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:10px 6px;text-align:center;cursor:pointer;}
  .ar-card:hover{background:var(--hover);}
  .ar-ava{width:46px;height:46px;border-radius:50%;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;}
  .list-head{display:flex;align-items:center;gap:14px;padding:14px;border-radius:16px;background:var(--panel);border:1px solid var(--line);margin-bottom:12px;flex-wrap:wrap;}
  .list-cov{width:74px;height:74px;border-radius:12px;object-fit:cover;background:#161e2e;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;}
  .s-row{display:grid;grid-template-columns:28px 40px 1fr 48px 56px;align-items:center;gap:10px;padding:7px 10px;border-radius:10px;cursor:pointer;}
  .s-row:hover{background:var(--hover);} .s-row.active{background:rgba(56,189,248,.14);}
  .s-num{font-size:12px;color:var(--muted);text-align:center;} .s-row.active .s-num{color:var(--acc);font-weight:700;}
  .s-cov{width:38px;height:38px;border-radius:7px;object-fit:cover;background:#161e2e;}
  .s-main{min-width:0;} .s-t{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;} .s-row.active .s-t{color:var(--acc);}
  .s-a{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
  .s-d{font-size:11px;color:var(--muted);text-align:right;}
  .ico-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px;padding:4px 5px;border-radius:6px;} .ico-btn:hover{color:#fff;} .ico-btn.loved{color:var(--pink);}
  .stage-top-card{display:flex;align-items:center;gap:14px;margin-bottom:12px;flex-shrink:0;}
  .stage-cov{width:104px;height:104px;border-radius:16px;object-fit:cover;background:#161e2e;box-shadow:0 14px 34px rgba(0,0,0,.55);flex-shrink:0;}
  .stage-meta{min-width:0;flex:1;} .stage-title{font-size:19px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .stage-artist{font-size:13px;color:#cbd5e1;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .src-bar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;padding:8px 10px;background:rgba(0,0,0,.25);border:1px solid var(--line);border-radius:12px;flex-shrink:0;align-items:center;}
  .src-item{font-size:11px;padding:4px 9px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--muted);cursor:pointer;}
  .src-item.ok{color:var(--ok);border-color:rgba(52,211,153,.35);} .src-item.cur{background:var(--acc);color:#070a11;border-color:var(--acc);font-weight:700;} .src-item.warn{color:var(--warn);border-color:rgba(251,191,36,.3);}
  .lrc-scroll{flex:1;min-height:0;overflow-y:auto;padding:16vh 4px;scroll-behavior:smooth;-webkit-mask-image:linear-gradient(transparent,black 15%,black 85%,transparent);}
  .lrc-row{padding:8px 10px;font-size:15px;font-weight:600;color:rgba(255,255,255,.42);cursor:pointer;border-radius:8px;transition:.2s;line-height:1.45;}
  .lrc-row:hover{color:rgba(255,255,255,.8);} .lrc-row.cur{color:#fff;font-size:19px;font-weight:700;} .lrc-row small{display:block;font-size:12px;font-weight:400;margin-top:2px;opacity:.75;}
  .dock{height:76px;flex-shrink:0;background:rgba(10,14,24,.94);backdrop-filter:blur(24px);border-top:1px solid var(--line);padding:0 20px;display:grid;grid-template-columns:1fr 1.6fr 1fr;align-items:center;gap:14px;z-index:30;}
  .dock-l{display:flex;align-items:center;gap:10px;min-width:0;cursor:pointer;}
  .dock-m{display:flex;flex-direction:column;align-items:center;gap:4px;} .ctrls{display:flex;align-items:center;gap:14px;}
  .play-fab{width:34px;height:34px;border-radius:50%;background:#fff;color:#070a11;border:none;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;}
  .prog{width:100%;max-width:460px;display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted);} .prog input{flex:1;height:4px;accent-color:var(--acc);cursor:pointer;}
  .dock-r{display:flex;align-items:center;justify-content:flex-end;gap:10px;} .vol{width:76px;height:4px;accent-color:#cbd5e1;}
  .auth-wrap{max-width:360px;margin:12vh auto;background:var(--panel);border:1px solid var(--line);padding:24px;border-radius:16px;text-align:center;}
  .auth-wrap input{width:100%;background:rgba(255,255,255,.06);border:1px solid var(--line);color:#fff;padding:10px;border-radius:10px;margin:12px 0;outline:none;}
  .m-only{display:none;}
  @media(max-width:860px){
    .workspace{grid-template-columns:1fr;} .left-pane.hide-m{display:none;} .right-stage{display:none;} .right-stage.show-m{display:flex;height:100%;}
    .m-only{display:inline-block;} .dock{grid-template-columns:1fr auto;padding:0 12px;height:68px;} .dock-m,.vol,.dock-r .hide-m{display:none;}
    .topbar{height:auto;flex-wrap:wrap;padding:8px 12px;gap:8px;} .nav-pills{order:3;width:100%;padding-top:2px;} .search-wrap{max-width:none;flex:1;}
  }
</style>
</head>
<body>
<div class="app-shell">
  <header class="topbar">
    <div class="brand" onclick="nav('discover')"><span class="dot"></span>Music Hub</div>
    <div class="nav-pills">
      <button class="npill active" id="n-discover" onclick="nav('discover')">发现</button>
      <button class="npill" id="n-albums" onclick="nav('albums')">专辑</button>
      <button class="npill" id="n-artists" onclick="nav('artists')">歌手</button>
      <button class="npill" id="n-queue" onclick="nav('queue')">队列</button>
      <button class="npill" id="n-fav" onclick="nav('fav')">喜欢</button>
      <button class="npill m-only" onclick="toggleMobileStage(true)">歌词/源</button>
    </div>
    <div class="search-wrap">
      <input id="qInput" placeholder="搜歌名 / 歌手 / 专辑..." onkeydown="if(event.key==='Enter')doSearch(1)" />
      <button class="btn" onclick="doSearch(1)">搜索</button>
    </div>
    <button class="btn ghost hide-m" onclick="openTimer()">定时</button>
    <button class="btn ghost" onclick="location.href='/admin'">后台</button>
  </header>

  <div class="workspace">
    <section class="left-pane" id="leftPane"></section>
    <aside class="right-stage" id="rightStage">
      <div class="stage-blur" id="stageBlur"></div>
      <div class="stage-inner">
        <div class="stage-top-card">
          <img id="sCov" class="stage-cov" referrerpolicy="no-referrer" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23161e2e' width='100' height='100'/%3E%3C/svg%3E" />
          <div class="stage-meta">
            <div class="stage-title" id="sTitle">Music Hub 极速单页</div>
            <div class="stage-artist" id="sArtist">点击左侧歌曲，本地网络直连多源秒播</div>
            <div style="display:flex;gap:6px;margin-top:8px;">
              <button class="src-item" onclick="toggleCurFav()" id="sFavBtn">&#9825; 收藏</button>
              <button class="src-item m-only" onclick="toggleMobileStage(false)">返回列表</button>
            </div>
          </div>
        </div>
        <div class="src-bar" id="srcBar"><span style="font-size:11px;color:var(--muted);">可用音源将在此处实时显示，可随时点击切换</span></div>
        <div class="lrc-scroll" id="lrcBox"><div class="lrc-row">点击歌曲后，歌词将在此处同步滚动</div></div>
      </div>
    </aside>
  </div>

  <footer class="dock">
    <div class="dock-l" onclick="toggleMobileStage(true)">
      <div class="s-main"><div class="s-t" id="dTitle">未播放</div><div class="s-a" id="dArtist">点击选歌</div></div>
    </div>
    <div class="dock-m">
      <div class="ctrls">
        <button class="ico-btn" id="modeBtn" onclick="toggleMode()">顺序</button>
        <button class="ico-btn" onclick="prevSong()">&#9198;</button>
        <button class="play-fab" id="playFab" onclick="togglePlay()">&#9654;</button>
        <button class="ico-btn" onclick="nextSong()">&#9197;</button>
      </div>
      <div class="prog"><span id="curT">0:00</span><input type="range" id="seek" min="0" max="100" value="0" oninput="seekPct(this.value)" /><span id="durT">0:00</span></div>
    </div>
    <div class="dock-r">
      <input class="vol" type="range" min="0" max="1" step="0.02" value="0.9" oninput="audio.volume=this.value" />
      <button class="play-fab m-only" id="playFabM" onclick="togglePlay()">&#9654;</button>
      <button class="ico-btn m-only" onclick="nextSong()">&#9197;</button>
    </div>
  </footer>
</div>
<audio id="audio" preload="auto"></audio>

<script>
var TOKEN = new URLSearchParams(location.search).get("token") || localStorage.getItem("mh_token") || "";
if (new URLSearchParams(location.search).get("token")) localStorage.setItem("mh_token", TOKEN);

var chartsCache = [], artistsCache = [], albumsCache = [], artistCat = "全部", chartCat = "全部", albumQuery = "华语经典";
var viewSongs = [], playQueue = [], curIdx = -1, curSong = null, playMode = "loop", lrcRows = [], timerId = null;
var candidates = [], curCandIdx = -1, playSeq = 0, autoWaitMeta = false;
var pageState = { type: "", query: "", page: 1, hasMore: false, artistAlbums: [], artistTab: "songs", artistName: "", artistTag: "" };
var audio = document.getElementById("audio"); audio.volume = 0.9;
var favs = JSON.parse(localStorage.getItem("mh_favs") || "[]");
var GRADS = ["linear-gradient(135deg,#0284c7,#6366f1)","linear-gradient(135deg,#db2777,#f43f5e)","linear-gradient(135deg,#059669,#10b981)","linear-gradient(135deg,#d97706,#f59e0b)","linear-gradient(135deg,#7c3aed,#a855f7)"];

function api(path) {
  var sep = path.indexOf("?") >= 0 ? "&" : "?";
  return fetch(path + sep + "token=" + encodeURIComponent(TOKEN)).then(function(r) {
    if (r.status === 401) { showAuth(); throw new Error("401"); }
    return r.json();
  });
}
function showAuth() {
  document.getElementById("leftPane").innerHTML = '<div class="auth-wrap"><h3>输入访问密钥</h3><input id="tkIn" type="password" placeholder="ACCESS_TOKEN" onkeydown="if(event.key===\\'Enter\\')saveToken()" /><button class="btn" style="width:100%;" onclick="saveToken()">进入</button></div>';
}
function saveToken() { TOKEN = document.getElementById("tkIn").value.trim(); localStorage.setItem("mh_token", TOKEN); nav("discover"); }
function toggleMobileStage(show) { document.getElementById("leftPane").classList.toggle("hide-m", show); document.getElementById("rightStage").classList.toggle("show-m", show); }
function setNav(id) { toggleMobileStage(false); ["discover", "albums", "artists", "queue", "fav"].forEach(function(k) { var el = document.getElementById("n-" + k); if (el) el.classList.toggle("active", k === id); }); }

function nav(tab) {
  setNav(tab);
  if (tab === "queue") { renderSongList("当前播放队列", "共 " + playQueue.length + " 首", "", playQueue, false); return; }
  if (tab === "fav") { renderSongList("我喜欢的音乐", "本地红心收藏 · " + favs.length + " 首", "", favs, false); return; }
  if (tab === "albums") { loadAlbumsPage(albumQuery); return; }
  if (chartsCache.length) { if (tab === "artists") renderArtists(); else renderDiscover(); return; }
  document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">正在加载...</div>';
  api("/api/home").then(function(d) { chartsCache = d.charts || []; artistsCache = d.artists || []; if (tab === "artists") renderArtists(); else renderDiscover(); }).catch(function(){});
}

function renderDiscover() {
  var h = '<div class="sec-head"><div class="sec-title">热门歌手</div><button class="btn ghost" onclick="nav(\\'artists\\')">全部歌手</button></div><div class="ar-grid">';
  for (var a = 0; a < Math.min(12, artistsCache.length); a++) {
    var ar = artistsCache[a];
    h += '<div class="ar-card" onclick="openArtistIdx(' + a + ')"><div class="ar-ava" style="background:' + GRADS[a % GRADS.length] + '">' + esc(ar.name.slice(0, 1)) + '</div><div class="card-t">' + esc(ar.name) + '</div><div class="card-s">' + esc(ar.tag) + '</div></div>';
  }
  h += '</div>';
  var cCats = ["全部"];
  for (var j = 0; j < chartsCache.length; j++) { var cat = chartsCache[j].category || "其他"; if (cCats.indexOf(cat) < 0) cCats.push(cat); }
  h += '<div class="sec-head"><div class="sec-title">榜单与经典分类</div></div><div class="pills">';
  for (var k = 0; k < cCats.length; k++) h += '<button class="pill' + (chartCat === cCats[k] ? " active" : "") + '" onclick="chartCat=\\'' + cCats[k] + '\\';renderDiscover()">' + esc(cCats[k]) + '</button>';
  h += '</div><div class="cards-grid">';
  for (var i = 0; i < chartsCache.length; i++) {
    var c = chartsCache[i]; if (chartCat !== "全部" && c.category !== chartCat) continue;
    h += '<div class="card" onclick="openChartIdx(' + i + ')"><img loading="lazy" referrerpolicy="no-referrer" src="' + (c.cover || "") + '" /><div class="card-body"><div class="card-t">' + esc(c.title) + '</div><div class="card-s">' + esc(c.category) + '</div></div></div>';
  }
  document.getElementById("leftPane").innerHTML = h + '</div>';
}

function renderArtists() {
  var cats = ["全部", "经典怀旧", "华语男", "华语女", "乐队组合", "日韩", "欧美", "ACG"];
  var h = '<div class="sec-head"><div class="sec-title">歌手广场</div></div><div class="pills">';
  for (var k = 0; k < cats.length; k++) h += '<button class="pill' + (artistCat === cats[k] ? " active" : "") + '" onclick="artistCat=\\'' + cats[k] + '\\';renderArtists()">' + cats[k] + '</button>';
  h += '</div><div class="ar-grid">';
  for (var i = 0; i < artistsCache.length; i++) {
    var ar = artistsCache[i]; if (artistCat !== "全部" && ar.cat !== artistCat) continue;
    h += '<div class="ar-card" onclick="openArtistIdx(' + i + ')"><div class="ar-ava" style="background:' + GRADS[i % GRADS.length] + '">' + esc(ar.name.slice(0, 1)) + '</div><div class="card-t">' + esc(ar.name) + '</div><div class="card-s">' + esc(ar.tag) + '</div></div>';
  }
  document.getElementById("leftPane").innerHTML = h + '</div>';
}

function loadAlbumsPage(q) {
  albumQuery = q; var aCats = ["华语经典", "粤语经典", "周杰伦", "张学友", "陈奕迅", "日本动漫", "欧美流行"];
  document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">加载专辑墙...</div>';
  api("/api/albums?q=" + encodeURIComponent(q)).then(function(d) {
    albumsCache = d.albums || [];
    var h = '<div class="sec-head"><div class="sec-title">精选专辑</div></div><div class="pills">';
    for (var k = 0; k < aCats.length; k++) h += '<button class="pill' + (albumQuery === aCats[k] ? " active" : "") + '" onclick="loadAlbumsPage(\\'' + aCats[k] + '\\')">' + aCats[k] + '</button>';
    h += '</div><div class="cards-grid">';
    for (var i = 0; i < albumsCache.length; i++) {
      var al = albumsCache[i];
      h += '<div class="card" onclick="openAlbumObj(' + i + ',0)"><img loading="lazy" referrerpolicy="no-referrer" src="' + (al.cover || "") + '" /><div class="card-body"><div class="card-t">' + esc(al.title) + '</div><div class="card-s">' + esc(al.artist) + (al.publishTime ? " · " + al.publishTime.slice(0,4) : "") + '</div></div></div>';
    }
    document.getElementById("leftPane").innerHTML = h + '</div>';
  });
}

function openArtistIdx(i) {
  var ar = artistsCache[i]; if (!ar) return;
  pageState = { type: "artist", query: ar.name, page: 1, hasMore: false, artistAlbums: [], artistTab: "songs", artistName: ar.name, artistTag: ar.tag };
  document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">检索 ' + esc(ar.name) + ' 单曲与专辑...</div>';
  api("/api/artist?name=" + encodeURIComponent(ar.name) + "&page=1").then(function(d) {
    pageState.hasMore = Boolean(d.hasMore); pageState.artistAlbums = d.albums || []; viewSongs = d.songs || []; renderArtistDetail();
  });
}

function renderArtistDetail() {
  var cov = (viewSongs[0] && viewSongs[0].cover) || (pageState.artistAlbums[0] && pageState.artistAlbums[0].cover) || "";
  var h = '<div class="list-head">' + (cov ? '<img class="list-cov" referrerpolicy="no-referrer" src="' + cov + '" />' : '<div class="list-cov">' + esc(pageState.artistName.slice(0, 1)) + '</div>') +
    '<div style="flex:1;min-width:160px;"><div style="font-size:20px;font-weight:800;">' + esc(pageState.artistName) + '</div>' +
    '<div style="font-size:12px;color:var(--muted);margin:4px 0 10px;">' + esc(pageState.artistTag) + ' · 单曲 ' + viewSongs.length + ' · 专辑 ' + pageState.artistAlbums.length + '</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn" onclick="playAll()">&#9654; 播放全部</button>' +
    '<button class="pill' + (pageState.artistTab === "songs" ? " active" : "") + '" onclick="pageState.artistTab=\\'songs\\';renderArtistDetail()">热门单曲</button>' +
    '<button class="pill' + (pageState.artistTab === "albums" ? " active" : "") + '" onclick="pageState.artistTab=\\'albums\\';renderArtistDetail()">专辑 (' + pageState.artistAlbums.length + ')</button>' +
    '<button class="btn ghost" onclick="nav(\\'discover\\')">返回</button></div></div></div>';
  if (pageState.artistTab === "albums") {
    h += '<div class="cards-grid">';
    for (var i = 0; i < pageState.artistAlbums.length; i++) {
      var al = pageState.artistAlbums[i];
      h += '<div class="card" onclick="openAlbumObj(' + i + ',1)"><img loading="lazy" referrerpolicy="no-referrer" src="' + (al.cover || "") + '" /><div class="card-body"><div class="card-t">' + esc(al.title) + '</div><div class="card-s">' + (al.publishTime || "") + ' · ' + (al.size || 0) + '首</div></div></div>';
    }
    document.getElementById("leftPane").innerHTML = h + '</div>'; return;
  }
  document.getElementById("leftPane").innerHTML = h + buildSongsRowsHtml(viewSongs, pageState.hasMore);
}

function openAlbumObj(i, fromArtist) {
  var al = fromArtist ? pageState.artistAlbums[i] : albumsCache[i]; if (!al) return;
  document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">加载专辑《' + esc(al.title) + '》...</div>';
  api("/api/album?id=" + encodeURIComponent(al.id)).then(function(d) {
    var info = d.album || al; pageState = { type: "album", query: al.id, page: 1, hasMore: false };
    renderSongList(info.title, (info.artist || al.artist) + " · 专辑曲目 " + (d.songs || []).length + " 首", info.cover || al.cover, d.songs || [], false);
  });
}
function openChartIdx(i) {
  var c = chartsCache[i]; if (!c) return;
  pageState = { type: "chart", query: c.id, page: 1, hasMore: false };
  document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">加载榜单...</div>';
  api("/api/chart?id=" + encodeURIComponent(c.id)).then(function(d) {
    var ch = d.chart || c; renderSongList(ch.title, ch.description || "精选榜单", ch.cover || "", d.songs || [], false);
  });
}
function doSearch(page) {
  var q = document.getElementById("qInput").value.trim(); if (!q) return nav("discover");
  setNav("discover");
  if (page === 1) { pageState = { type: "search", query: q, page: 1, hasMore: false }; viewSongs = []; document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">全网搜索中...</div>'; }
  api("/api/search?q=" + encodeURIComponent(q) + "&page=" + page).then(function(d) {
    pageState.page = page; pageState.hasMore = Boolean(d.hasMore);
    var list = d.songs || []; viewSongs = page === 1 ? list : viewSongs.concat(list);
    renderSongList("搜索：" + q, "已加载 " + viewSongs.length + " 首", (viewSongs[0] && viewSongs[0].cover) || "", viewSongs, pageState.hasMore);
  });
}
function loadMore() {
  var nextP = (pageState.page || 1) + 1;
  if (pageState.type === "search") { doSearch(nextP); return; }
  if (pageState.type === "artist") {
    api("/api/artist?name=" + encodeURIComponent(pageState.query) + "&page=" + nextP).then(function(d) {
      pageState.page = nextP; pageState.hasMore = Boolean(d.hasMore);
      var seen = {}; viewSongs.forEach(function(s) { seen[s.norm_key] = 1; });
      (d.songs || []).forEach(function(s) { if (!seen[s.norm_key]) { seen[s.norm_key] = 1; viewSongs.push(s); } });
      renderArtistDetail();
    });
  }
}
function renderSongList(title, sub, cover, songs, hasMore) {
  viewSongs = songs || [];
  var h = '<div class="list-head">' + (cover ? '<img class="list-cov" referrerpolicy="no-referrer" src="' + cover + '" />' : '<div class="list-cov">' + esc(title.slice(0, 1)) + '</div>') +
    '<div style="flex:1;min-width:160px;"><div style="font-size:19px;font-weight:800;">' + esc(title) + '</div><div style="font-size:12px;color:var(--muted);margin:4px 0 10px;">' + esc(sub) + '</div><div style="display:flex;gap:8px;"><button class="btn" onclick="playAll()">&#9654; 播放全部</button><button class="btn ghost" onclick="nav(\\'discover\\')">返回发现</button></div></div></div>';
  document.getElementById("leftPane").innerHTML = h + buildSongsRowsHtml(viewSongs, hasMore);
}
function buildSongsRowsHtml(songs, hasMore) {
  if (!songs.length) return '<div style="padding:36px;text-align:center;color:var(--muted);">暂无歌曲</div>';
  var h = "";
  for (var i = 0; i < songs.length; i++) {
    var s = songs[i], isCur = curSong && curSong.norm_key === s.norm_key, loved = isFav(s);
    h += '<div class="s-row' + (isCur ? " active" : "") + '" onclick="playViewIdx(' + i + ')"><div class="s-num">' + (isCur ? "&#9654;" : (i + 1)) + '</div><img class="s-cov" loading="lazy" referrerpolicy="no-referrer" src="' + (s.cover || "") + '" /><div class="s-main"><div class="s-t">' + esc(s.title) + '</div><div class="s-a">' + esc(s.artist) + (s.album ? " · " + esc(s.album) : "") + '</div></div><div class="s-d">' + (s.duration ? fmt(s.duration) : "--:--") + '</div><div style="text-align:right;" onclick="event.stopPropagation()"><button class="ico-btn' + (loved ? " loved" : "") + '" onclick="toggleViewFav(' + i + ',this)">' + (loved ? "&#9829;" : "&#9825;") + '</button><button class="ico-btn" onclick="addNext(' + i + ')">+</button></div></div>';
  }
  if (hasMore) h += '<div style="text-align:center;padding:16px;"><button class="btn ghost" onclick="loadMore()">加载更多歌曲 &darr;</button></div>';
  return h;
}
function playAll() { if (viewSongs.length) { playQueue = viewSongs.slice(); playQueueIdx(0); } }
function playViewIdx(i) { playQueue = viewSongs.slice(); playQueueIdx(i); }
function addNext(i) { var s = viewSongs[i]; if (!s) return; if (!playQueue.length) { playQueue = [s]; playQueueIdx(0); return; } playQueue.splice(curIdx + 1, 0, s); }

function renderSrcBar() {
  var bar = document.getElementById("srcBar");
  if (!candidates.length) { bar.innerHTML = '<span style="font-size:11px;color:var(--muted);">正在并发探测全网可用音源...</span>'; return; }
  bar.innerHTML = candidates.map(function(c, i) {
    var cls = i === curCandIdx ? "src-item cur" : (c.isTrial ? "src-item warn" : "src-item ok");
    return '<button class="' + cls + '" onclick="pickCandidate(' + i + ',true)">' + esc(c.label) + '</button>';
  }).join("");
}
function addCandidate(seq, cand) {
  if (seq !== playSeq || !cand || !cand.url) return;
  for (var i = 0; i < candidates.length; i++) { if (candidates[i].url === cand.url) return; }
  candidates.push(cand);
  var idx = candidates.length - 1, curCand = candidates[curCandIdx];
  if (curCandIdx < 0 || (curCand && curCand.isTrial && !cand.isTrial)) pickCandidate(idx, false);
  else renderSrcBar();
}
function pickCandidate(i, manual) {
  var c = candidates[i]; if (!c) return;
  curCandIdx = i; renderSrcBar();
  autoWaitMeta = !manual;
  audio.src = c.url;
  if (manual) {
    audio.play().catch(function(){}); setPlayIcon(true);
    document.getElementById("dArtist").textContent = (curSong ? curSong.artist : "") + " · " + c.label;
  } else {
    document.getElementById("dArtist").textContent = (curSong ? curSong.artist : "") + " · 校验完整版: " + c.label;
  }
}

function fetchDirectGD(s, plat, label, seq) {
  var cleanArtist = (s.artist || "").split(/[/,、&]/)[0].trim();
  var kw = (s.title + " " + cleanArtist).replace(/[()\\[\\]（）【】]/g, " ").trim();
  var base = "https://music-api.gdstudio.xyz/api.php?use_xbridge3=true&types=";
  var p = (plat === "netease" && s.ext_source === "netease" && s.ext_id)
    ? Promise.resolve(s.ext_id)
    : fetch(base + "search&source=" + plat + "&name=" + encodeURIComponent(kw) + "&count=3&pages=1")
        .then(function(r) { return r.json(); })
        .then(function(arr) { return (Array.isArray(arr) && arr[0] && arr[0].id) ? String(arr[0].id) : ""; });

  p.then(function(pid) {
    if (!pid || seq !== playSeq) return;
    return fetch(base + "url&source=" + plat + "&id=" + encodeURIComponent(pid) + "&br=320")
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d || !d.url || seq !== playSeq) return;
        if (d.size && s.duration >= 90 && Number(d.size) < 1300) return;
        addCandidate(seq, { label: label + (d.br ? "(" + d.br + "k)" : ""), url: d.url, isTrial: false });
      });
  }).catch(function(){});
}

function playQueueIdx(idx) {
  if (idx < 0 || idx >= playQueue.length) return;
  curIdx = idx; var s = playQueue[idx]; curSong = s;
  playSeq++; var seq = playSeq; candidates = []; curCandIdx = -1; autoWaitMeta = false;
  audio.pause(); audio.removeAttribute("src"); audio.load(); setPlayIcon(false);

  document.getElementById("dTitle").textContent = s.title;
  document.getElementById("dArtist").textContent = s.artist + " · 多源并发连接中...";
  document.getElementById("sTitle").textContent = s.title;
  document.getElementById("sArtist").textContent = s.artist;
  if (s.cover) { document.getElementById("sCov").src = s.cover; document.getElementById("stageBlur").style.backgroundImage = 'url("' + s.cover + '")'; }
  updateFavBtn(); renderSrcBar();

  fetchDirectGD(s, "kuwo", "酷我(直连)", seq);
  fetchDirectGD(s, "joox", "JOOX(直连)", seq);
  fetchDirectGD(s, "netease", "网易(直连)", seq);

  var qUrl = "/api/play?id=" + (s.id || 0) + "&q=high&ext_source=" + encodeURIComponent(s.ext_source || "") + "&ext_id=" + encodeURIComponent(s.ext_id || "") + "&title=" + encodeURIComponent(s.title || "") + "&artist=" + encodeURIComponent(s.artist || "") + "&album=" + encodeURIComponent(s.album || "") + "&cover=" + encodeURIComponent(s.cover || "") + "&duration=" + (s.duration || 0);
  api(qUrl).then(function(res) {
    if (seq !== playSeq) return;
    if (res.songId) s.id = res.songId;
    if (!res.error && res.url) addCandidate(seq, { label: "云端(" + (res.source || "ok") + ")", url: res.needProxy ? res.proxyUrl : res.url, isTrial: false });
    else if (!candidates.length) {
      document.getElementById("srcBar").innerHTML = '<span style="font-size:11px;color:var(--warn);">暂未匹配到完整源 (' + esc((res.trace || []).join(" | ")) + ')</span>';
      document.getElementById("dArtist").textContent = s.artist + " · 暂无可用完整源";
    }
  }).catch(function(){});

  api("/api/song?id=" + (s.id || 0) + "&ext_source=" + encodeURIComponent(s.ext_source || "") + "&ext_id=" + encodeURIComponent(s.ext_id || "") + "&title=" + encodeURIComponent(s.title || "") + "&artist=" + encodeURIComponent(s.artist || "")).then(function(d) {
    if (seq === playSeq) parseLrc((d.song && d.song.lyric_lrc) || "", (d.song && d.song.lyric_trans) || "");
  });
  updateMediaSession(s);
}

audio.addEventListener("loadedmetadata", function() {
  var c = candidates[curCandIdx];
  if (autoWaitMeta && curSong && curSong.duration >= 90 && audio.duration > 0 && audio.duration <= 45 && c) {
    c.isTrial = true;
    if (c.label.indexOf("[试听]") < 0) c.label += "[试听]";
    renderSrcBar();
    for (var i = 0; i < candidates.length; i++) { if (!candidates[i].isTrial) { pickCandidate(i, false); return; } }
    return;
  }
  if (autoWaitMeta && c) {
    autoWaitMeta = false;
    audio.play().catch(function(){}); setPlayIcon(true);
    document.getElementById("dArtist").textContent = (curSong ? curSong.artist : "") + " · " + c.label;
  }
});
audio.addEventListener("error", function() {
  if (curCandIdx >= 0 && curCandIdx + 1 < candidates.length) pickCandidate(curCandIdx + 1, false);
});

function setPlayIcon(p) { var i = p ? "&#10074;&#10074;" : "&#9654;"; document.getElementById("playFab").innerHTML = i; document.getElementById("playFabM").innerHTML = i; }
function togglePlay() { if (!audio.src) return; if (audio.paused) { audio.play(); setPlayIcon(true); } else { audio.pause(); setPlayIcon(false); } }
function toggleMode() { playMode = playMode === "loop" ? "one" : playMode === "one" ? "shuffle" : "loop"; document.getElementById("modeBtn").textContent = playMode === "one" ? "单曲" : playMode === "shuffle" ? "随机" : "顺序"; }
function prevSong() { if (playQueue.length) playQueueIdx(curIdx > 0 ? curIdx - 1 : playQueue.length - 1); }
function nextSong() { if (!playQueue.length) return; if (playMode === "one") { audio.currentTime = 0; audio.play(); return; } if (playMode === "shuffle" && playQueue.length > 1) { playQueueIdx(Math.floor(Math.random() * playQueue.length)); return; } playQueueIdx((curIdx + 1) % playQueue.length); }
function seekPct(v) { if (audio.duration) audio.currentTime = (v / 100) * audio.duration; }
audio.addEventListener("ended", nextSong);
audio.addEventListener("timeupdate", function() {
  var c = audio.currentTime || 0, d = audio.duration || 0;
  document.getElementById("curT").textContent = fmt(c); document.getElementById("durT").textContent = fmt(d);
  if (d > 0) document.getElementById("seek").value = (c / d) * 100;
  highlightLrc(c);
});
function updateMediaSession(s) {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({ title: s.title, artist: s.artist, album: s.album || "Music Hub", artwork: s.cover ? [{ src: s.cover, sizes: "512x512", type: "image/jpeg" }] : [] });
    navigator.mediaSession.setActionHandler("play", togglePlay); navigator.mediaSession.setActionHandler("pause", togglePlay);
    navigator.mediaSession.setActionHandler("previoustrack", prevSong); navigator.mediaSession.setActionHandler("nexttrack", nextSong);
  } catch {}
}
function isFav(s) { return s && favs.some(function(f) { return f.norm_key === s.norm_key; }); }
function saveFav(s) { if (isFav(s)) favs = favs.filter(function(f) { return f.norm_key !== s.norm_key; }); else favs.unshift(s); localStorage.setItem("mh_favs", JSON.stringify(favs)); updateFavBtn(); }
function toggleViewFav(i, btn) { var s = viewSongs[i]; if (!s) return; saveFav(s); var l = isFav(s); btn.classList.toggle("loved", l); btn.innerHTML = l ? "&#9829;" : "&#9825;"; }
function toggleCurFav() { if (curSong) saveFav(curSong); }
function updateFavBtn() { var l = isFav(curSong), el = document.getElementById("sFavBtn"); if (el) el.innerHTML = l ? "&#9829; 已收藏" : "&#9825; 收藏"; }
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
function openTimer() { var m = prompt("多少分钟后停止播放？（0取消）", "30"); if (m === null) return; clearTimeout(timerId); var mins = Number(m); if (mins > 0) { timerId = setTimeout(function() { audio.pause(); setPlayIcon(false); }, mins * 60000); alert("已设置 " + mins + " 分钟后停止"); } }
function fmt(s) { var m = Math.floor(s / 60), r = Math.floor(s % 60); return m + ":" + (r < 10 ? "0" : "") + r; }
function esc(s) { return String(s || "").replace(/[&<>"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
nav("discover");
</script>
</body>
</html>`;
