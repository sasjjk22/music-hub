export const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Music Hub 管理后台</title>
<script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
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
  .sub-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;}
  .sub-card{background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;gap:14px;align-items:center;}
  .qr-box{width:112px;height:112px;background:#fff;border-radius:10px;padding:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .qr-box svg,.qr-box img{width:100% !important;height:100% !important;display:block;}
  .stat{background:rgba(255,255,255,.04);padding:14px;border-radius:12px;text-align:center;}
  .stat b{font-size:24px;color:var(--acc);display:block;} .stat span{font-size:12px;color:var(--muted);}
  input,select,textarea{background:#090c14;border:1px solid #334155;color:#fff;padding:8px 10px;border-radius:8px;font-size:13px;outline:none;}
  textarea{width:100%;font-family:monospace;line-height:1.5;}
  button{background:var(--acc);color:#06121f;border:none;padding:8px 14px;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;}
  button.sm{padding:5px 9px;font-size:12px;}
  button.red{background:#ef4444;color:#fff;} button.green{background:#10b981;color:#052e16;} button.ghost{background:#334155;color:#fff;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  td,th{padding:9px 8px;border-bottom:1px solid rgba(255,255,255,.06);text-align:left;vertical-align:middle;}
  .row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center;}
  .err{color:#f87171;font-size:13px;margin-top:8px;}
  .badge{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;background:rgba(255,255,255,.08);color:#cbd5e1;margin:2px;}
  .badge.ok{background:rgba(16,185,129,.18);color:#34d399;} .badge.miss{background:rgba(245,158,11,.18);color:#fbbf24;} .badge.blk{background:rgba(239,68,68,.2);color:#f87171;}
  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:50;display:none;align-items:center;justify-content:center;padding:16px;}
  .modal-bg.open{display:flex;}
  .modal{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;width:100%;max-width:640px;max-height:90vh;overflow-y:auto;}
  .pbar{height:8px;background:#1e293b;border-radius:99px;overflow:hidden;margin:10px 0;} .pbar > div{height:100%;background:linear-gradient(90deg,#38bdf8,#10b981);transition:width .3s;}
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
  <button class="tab" id="t-subs" onclick="switchTab('subs')">订阅与二维码</button>
  <button class="tab" id="t-songs" onclick="switchTab('songs')">曲库管理</button>
  <button class="tab" id="t-lyrics" onclick="switchTab('lyrics')">歌词库管理</button>
  <button class="tab" id="t-charts" onclick="switchTab('charts')">榜单管理</button>
</div>
<div id="main"></div>
<div class="modal-bg" id="modalBg"><div class="modal" id="modalBody"></div></div>
<div class="aud-bar" id="audBar">
  <b id="audTitle" style="font-size:13px;min-width:160px;">试听</b>
  <audio id="admAudio" controls style="flex:1;height:36px;"></audio>
  <button class="ghost sm" onclick="document.getElementById('audBar').style.display='none';document.getElementById('admAudio').pause();">关闭</button>
</div>

<script>
var ATOKEN = sessionStorage.getItem("mh_admin_tk") || "";
var curTab = "overview", dashData = null, songRows = [], songPage = 1, lrcRows = [], lrcPage = 1, backfillRunning = false;
function esc(s) { return String(s || "").replace(/[&<>"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

function req(path, opts) {
  opts = opts || {};
  opts.headers = Object.assign({ "Content-Type": "application/json", "X-Admin-Token": ATOKEN }, opts.headers || {});
  return fetch(path, opts).then(function(r) {
    return r.json().then(function(data) {
      if (r.status === 401) { sessionStorage.removeItem("mh_admin_tk"); ATOKEN = ""; renderLogin(data.error || "请登录"); throw new Error("401"); }
      if (!r.ok) throw new Error((data.trace ? data.trace.join(" | ") : data.error) || ("HTTP " + r.status));
      return data;
    });
  });
}

function renderLogin(msg) {
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("tabBar").style.display = "none";
  document.getElementById("main").innerHTML = '<div class="card" style="max-width:420px;margin:40px auto;"><h3>输入后台管理密码</h3><div class="row"><input id="pw" type="password" placeholder="ADMIN_PASSWORD" style="flex:1;" onkeydown="if(event.key===\\'Enter\\')doLogin()" /><button onclick="doLogin()">登录</button></div><div class="err" id="loginErr">' + esc(msg || "") + '</div></div>';
}
function doLogin() {
  var pw = (document.getElementById("pw").value || "").trim();
  if (!pw) { document.getElementById("loginErr").textContent = "请输入密码"; return; }
  document.getElementById("loginErr").textContent = "正在验证...";
  fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) })
  .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
  .then(function(res) {
    if (!res.ok) { document.getElementById("loginErr").textContent = res.d.error || "登录失败"; return; }
    ATOKEN = res.d.token; sessionStorage.setItem("mh_admin_tk", ATOKEN); loadAll();
  }).catch(function(e) { document.getElementById("loginErr").textContent = "请求异常：" + e.message; });
}
function logout() { sessionStorage.removeItem("mh_admin_tk"); ATOKEN = ""; renderLogin(""); }
function switchTab(t) {
  curTab = t;
  ["overview", "subs", "songs", "lyrics", "charts"].forEach(function(k) { var el = document.getElementById("t-" + k); if (el) el.classList.toggle("active", k === t); });
  if (t === "overview") renderOverview();
  else if (t === "subs") renderSubsTab();
  else if (t === "songs") renderSongsTab();
  else if (t === "lyrics") renderLyricsTab();
  else if (t === "charts") renderChartsTab();
}
function loadAll() {
  if (!ATOKEN) { renderLogin(""); return; }
  req("/api/admin/stats").then(function(d) {
    dashData = d; document.getElementById("logoutBtn").style.display = "inline-block"; document.getElementById("tabBar").style.display = "flex"; switchTab(curTab);
  }).catch(function(){});
}

// -------- 订阅源与二维码 Tab --------
function makeQrHtml(text) {
  try {
    if (typeof qrcode === "function") {
      var q = qrcode(0, "M");
      q.addData(text);
      q.make();
      return q.createSvgTag(4, 0);
    }
  } catch {}
  return '<img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' + encodeURIComponent(text) + '" />';
}

function copyText(id, btn) {
  var el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.value).then(function() {
    var old = btn.textContent; btn.textContent = "已复制 ✓";
    setTimeout(function() { btn.textContent = old; }, 1500);
  }).catch(function() { el.select(); document.execCommand("copy"); });
}

function renderSubsTab() {
  var base = location.origin;
  var tk = dashData.accessToken || "";
  var qs = tk ? ("?token=" + encodeURIComponent(tk)) : "";
  var items = [
    { id: "sub_player", title: "📱 PWA 手机 / 网页播放器", desc: "手机扫码直接听歌，Safari 可添加到桌面当独立 App", url: base + "/player" + qs },
    { id: "sub_mfjson", title: "🧩 MusicFree 网络订阅源 (JSON)", desc: "MusicFree -> 插件管理 -> 从网络安装（推荐）", url: base + "/musicfree.json" + qs },
    { id: "sub_mfjs", title: "📄 MusicFree 单插件 JS 直链", desc: "适合直接导入单个插件脚本", url: base + "/api/mf-plugin.js" + qs },
    { id: "sub_diag", title: "🩺 全源并发体检接口", desc: "实时查看服务器到各大音源的连通率与耗时", url: base + "/api/diag" + qs },
  ];

  var h = '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">' +
    '<div><h3>客户端订阅地址 & 二维码</h3><p style="font-size:12px;color:var(--muted);">当前访问密钥 (ACCESS_TOKEN)：' + (tk ? '<span class="badge ok">已自动拼接</span>' : '<span class="badge miss">未配置（免密模式）</span>') + '</p></div>' +
    '</div><div class="sub-grid">';

  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    h += '<div class="sub-card"><div class="qr-box">' + makeQrHtml(it.url) + '</div>' +
      '<div style="flex:1;min-width:0;">' +
      '<div style="font-weight:700;font-size:14px;margin-bottom:3px;">' + it.title + '</div>' +
      '<div style="font-size:11px;color:var(--muted);margin-bottom:8px;">' + it.desc + '</div>' +
      '<input id="' + it.id + '" value="' + esc(it.url) + '" readonly style="width:100%;font-size:12px;margin-bottom:8px;" onclick="this.select()" />' +
      '<div style="display:flex;gap:6px;"><button class="sm" onclick="copyText(\\'' + it.id + '\\',this)">复制链接</button>' +
      '<button class="sm ghost" onclick="window.open(\\'' + esc(it.url) + '\\',\\'_blank\\')">打开测试</button></div></div></div>';
  }
  h += '</div></div>';
  document.getElementById("main").innerHTML = h;
}

function renderOverview() {
  var st = dashData.stats || {}, pct = st.songs ? Math.round((st.lyrics / st.songs) * 100) : 0;
  var h = '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><h3>曲库概览</h3><button class="sm green" onclick="switchTab(\\'subs\\')">查看订阅源 & 二维码</button></div>' +
    '<div class="grid"><div class="stat"><b>' + (st.songs||0) + '</b><span>可用歌曲</span></div><div class="stat"><b>' + (st.charts||0) + '</b><span>精选榜单</span></div><div class="stat"><b>' + (st.lyrics||0) + ' (' + pct + '%)</b><span>歌词覆盖率</span></div><div class="stat"><b>' + (st.blocked||0) + '</b><span>已屏蔽</span></div></div><div style="margin-top:14px;">' + (dashData.categories || []).map(function(c) { return '<span class="badge">' + esc(c.category) + ': ' + c.c + '首</span>'; }).join("") + '</div></div>';

  var srcs = dashData.sources || [];
  h += '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><h3>云端音源解析池</h3><button class="sm" onclick="testAllSrc()">一键全员测活</button></div><table><tr><th>ID</th><th>名称 / 地址</th><th>类型</th><th>优先级</th><th>状态</th><th>测活结果</th><th>操作</th></tr>';
  for (var i = 0; i < srcs.length; i++) {
    var s = srcs[i];
    h += '<tr><td>' + esc(s.id) + '</td><td>' + esc(s.name) + '<br><small style="color:var(--muted);">' + esc(s.endpoint) + '</small></td><td>' + esc(s.type) + '</td><td>' + s.priority + '</td><td>' + (s.enabled ? '<span class="badge ok">启用</span>' : '<span class="badge">停用</span>') + '</td><td id="st-' + esc(s.id) + '"><small style="color:var(--muted);">未测</small></td><td><button class="sm" onclick="testSrc(' + i + ')">测活</button> <button class="sm ghost" onclick="editSrcForm(' + i + ')">改</button> <button class="sm ghost" onclick="toggleSrc(' + i + ')">' + (s.enabled ? "停" : "启") + '</button> <button class="sm red" onclick="delSrc(' + i + ')">删</button></td></tr>';
  }
  h += '</table><div class="row" style="margin-top:12px;"><input id="sid" placeholder="ID 如 myapi" style="width:95px;" /><input id="sname" placeholder="名称" style="width:120px;" /><select id="stype"><option value="agg">agg</option><option value="vkeys">vkeys</option><option value="native">native</option><option value="bili">bili</option></select><input id="send" placeholder="Endpoint URL" style="flex:1;" /><input id="spri" type="number" value="20" style="width:65px;" /><button onclick="addSrc()">保存音源</button></div></div>';
  h += '<div class="card"><h3>垃圾翻唱 / 伴奏自动过滤词配置</h3><div class="row"><input id="junkIn" value="' + esc(dashData.junkWords || "") + '" style="flex:1;" /><button onclick="saveJunk()">保存过滤词</button></div></div>';
  document.getElementById("main").innerHTML = h;
}
function testSrc(i) {
  var s = dashData.sources[i]; if (!s) return;
  var cell = document.getElementById("st-" + s.id); if (cell) cell.innerHTML = '<small>测活中...</small>';
  return req("/api/admin/source/test", { method: "POST", body: JSON.stringify({ id: s.id }) }).then(function(r) {
    if (cell) cell.innerHTML = r.ok ? ('<span class="badge ok">' + r.status + ' · ' + r.ms + 'ms</span>') : ('<span class="badge blk">失败 ' + (r.status || r.error) + '</span>');
  });
}
function testAllSrc() { for (var i = 0; i < dashData.sources.length; i++) testSrc(i); }
function editSrcForm(i) { var s = dashData.sources[i]; document.getElementById("sid").value = s.id; document.getElementById("sname").value = s.name; document.getElementById("stype").value = s.type; document.getElementById("send").value = s.endpoint; document.getElementById("spri").value = s.priority; }
function toggleSrc(i) { var s = dashData.sources[i]; req("/api/admin/source", { method: "POST", body: JSON.stringify({ id:s.id, name:s.name, type:s.type, endpoint:s.endpoint, priority:s.priority, enabled:s.enabled?0:1 }) }).then(loadAll); }
function delSrc(i) { var s = dashData.sources[i]; if (confirm("删除音源 " + s.name + "？")) req("/api/admin/source/delete", { method: "POST", body: JSON.stringify({ id: s.id }) }).then(loadAll); }
function addSrc() { req("/api/admin/source", { method: "POST", body: JSON.stringify({ id: document.getElementById("sid").value, name: document.getElementById("sname").value, type: document.getElementById("stype").value, endpoint: document.getElementById("send").value, priority: Number(document.getElementById("spri").value), enabled: 1 }) }).then(loadAll); }
function saveJunk() { req("/api/admin/settings", { method: "POST", body: JSON.stringify({ junkWords: document.getElementById("junkIn").value }) }).then(function(){ alert("已保存"); }); }

function renderSongsTab() {
  var cats = (dashData.categories || []).map(function(c) { return '<option value="' + esc(c.category) + '">' + esc(c.category) + ' (' + c.c + ')</option>'; }).join("");
  var h = '<div class="card"><h3>一键导入网易云公开歌单到曲库 & 主页</h3><div class="row"><input id="impUrl" placeholder="粘贴网易云歌单链接或数字 ID（如 2945028696）" style="flex:2;min-width:220px;" /><input id="impTitle" placeholder="自定义榜单名（留空用原名）" style="flex:1;" /><select id="impCCat"><option value="经典金曲">经典金曲</option><option value="华语怀旧">华语怀旧</option><option value="核心榜单">核心榜单</option><option value="ACG / 二次元">ACG / 二次元</option><option value="日韩欧美">日韩欧美</option></select><select id="impSCat"><option value="经典">歌曲分类: 经典</option><option value="华语">华语</option><option value="ACG">ACG</option><option value="日韩">日韩</option><option value="欧美">欧美</option></select><button class="green" onclick="importPlaylist()">立即导入</button></div></div>';
  h += '<div class="card"><h3>全库检索与精修</h3><div class="row"><input id="sq" placeholder="搜歌名 / 歌手 / 专辑..." style="flex:1;min-width:180px;" onkeydown="if(event.key===\\'Enter\\'){songPage=1;loadSongs();}" /><select id="scat" onchange="songPage=1;loadSongs()"><option value="">全部分类</option>' + cats + '</select><select id="sflt" onchange="songPage=1;loadSongs()"><option value="all">全部状态</option><option value="active">仅正常</option><option value="no_lrc">缺歌词</option><option value="blocked">已屏蔽</option></select><select id="ssrt" onchange="songPage=1;loadSongs()"><option value="score">热度优先</option><option value="newest">最新入库</option></select><button onclick="songPage=1;loadSongs()">筛选</button></div><div id="songsTbl">加载中...</div></div>';
  document.getElementById("main").innerHTML = h; loadSongs();
}
function importPlaylist() {
  var u = document.getElementById("impUrl").value.trim(); if (!u) return alert("请输入歌单链接或 ID");
  req("/api/admin/import-playlist", { method: "POST", body: JSON.stringify({ url: u, chartTitle: document.getElementById("impTitle").value.trim(), chartCategory: document.getElementById("impCCat").value, songCategory: document.getElementById("impSCat").value }) })
  .then(function(r) { alert("导入成功！《" + r.title + "》共入库 " + r.importedCount + " 首"); loadAll(); }).catch(function(e) { alert("导入失败：" + e.message); });
}
function loadSongs() {
  req("/api/admin/songs?q=" + encodeURIComponent(document.getElementById("sq")?.value || "") + "&cat=" + encodeURIComponent(document.getElementById("scat")?.value || "") + "&filter=" + (document.getElementById("sflt")?.value || "all") + "&sort=" + (document.getElementById("ssrt")?.value || "score") + "&page=" + songPage)
  .then(function(d) {
    songRows = d.songs || [];
    var h = '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">共 ' + d.total + ' 首，第 ' + d.page + ' 页</div><table><tr><th>ID</th><th>歌名 / 歌手</th><th>分类 / 歌词</th><th>已存源ID</th><th>操作</th></tr>';
    for (var i = 0; i < songRows.length; i++) {
      var s = songRows[i];
      h += '<tr><td>#' + s.id + '</td><td><b>' + esc(s.title) + '</b><br><small style="color:var(--muted);">' + esc(s.artist) + (s.album ? " · " + esc(s.album) : "") + '</small></td><td><span class="badge">' + esc(s.category) + '</span>' + (s.lrc_len > 10 ? '<span class="badge ok">有词</span>' : '<span class="badge miss">缺词</span>') + (s.is_blocked ? '<span class="badge blk">屏蔽</span>' : '') + '</td><td><small style="color:var(--muted);word-break:break-all;">' + esc(s.source_ids_json) + '</small></td><td style="white-space:nowrap;"><button class="sm" onclick="admPlay(' + i + ')">试听</button> <button class="sm ghost" onclick="openEditSong(' + i + ')">改</button> <button class="sm ghost" onclick="openEditLyric(' + s.id + ')">词</button> ' + (s.is_blocked ? '<button class="sm green" onclick="setBlock(' + s.id + ',0)">解</button> ' : '<button class="sm red" onclick="setBlock(' + s.id + ',1)">封</button> ') + '<button class="sm ghost" onclick="resetBili(' + s.id + ')">清BV</button> <button class="sm red" onclick="delSong(' + s.id + ')">删</button></td></tr>';
    }
    h += '</table><div class="row" style="margin-top:12px;justify-content:space-between;"><button class="ghost sm" ' + (songPage <= 1 ? "disabled" : "") + ' onclick="songPage--;loadSongs()">上一页</button><button class="ghost sm" ' + (songPage * d.limit >= d.total ? "disabled" : "") + ' onclick="songPage++;loadSongs()">下一页</button></div>';
    document.getElementById("songsTbl").innerHTML = h;
  });
}
function admPlay(i) {
  var s = songRows[i]; if (!s) return;
  document.getElementById("audBar").style.display = "flex"; document.getElementById("audTitle").textContent = "解析中: " + s.title;
  req("/api/admin/play?id=" + s.id + "&atoken=" + encodeURIComponent(ATOKEN)).then(function(r) {
    document.getElementById("audTitle").textContent = s.title + " [" + r.source + "]";
    var a = document.getElementById("admAudio"); a.src = r.needProxy ? r.proxyUrl : r.url; a.play().catch(function(){});
  }).catch(function(e) { document.getElementById("audTitle").textContent = "失败: " + e.message; });
}
function openEditSong(i) {
  var s = songRows[i]; if (!s) return;
  document.getElementById("modalBody").innerHTML = '<h3>编辑歌曲 #' + s.id + '</h3><div class="row"><label style="width:70px;">歌名</label><input id="e_title" value="' + esc(s.title) + '" style="flex:1;" /></div><div class="row"><label style="width:70px;">歌手</label><input id="e_artist" value="' + esc(s.artist) + '" style="flex:1;" /></div><div class="row"><label style="width:70px;">专辑</label><input id="e_album" value="' + esc(s.album) + '" style="flex:1;" /></div><div class="row"><label style="width:70px;">封面</label><input id="e_cover" value="' + esc(s.cover) + '" style="flex:1;" /></div><div class="row"><label style="width:70px;">分类</label><input id="e_cat" value="' + esc(s.category) + '" style="flex:1;" /><label>热度</label><input id="e_score" type="number" value="' + s.score + '" style="width:80px;" /></div><div class="row"><label style="width:70px;">源 ID JSON</label><input id="e_ids" value="' + esc(s.source_ids_json) + '" style="flex:1;font-family:monospace;" /></div><div class="row" style="justify-content:flex-end;margin-top:12px;"><button class="ghost" onclick="closeModal()">取消</button><button onclick="saveSong(' + s.id + ')">保存</button></div>';
  document.getElementById("modalBg").classList.add("open");
}
function saveSong(id) {
  req("/api/admin/song/update", { method: "POST", body: JSON.stringify({ id: id, title: document.getElementById("e_title").value, artist: document.getElementById("e_artist").value, album: document.getElementById("e_album").value, cover: document.getElementById("e_cover").value, category: document.getElementById("e_cat").value, score: Number(document.getElementById("e_score").value), source_ids_json: document.getElementById("e_ids").value }) }).then(function() { closeModal(); loadSongs(); }).catch(function(e){ alert(e.message); });
}
function setBlock(id, blocked) { req("/api/admin/song/block", { method: "POST", body: JSON.stringify({ id: id, blocked: blocked }) }).then(loadSongs); }
function delSong(id) { if (confirm("确认删除 #" + id + "？")) req("/api/admin/song/delete", { method: "POST", body: JSON.stringify({ id: id }) }).then(loadSongs); }
function resetBili(id) { req("/api/admin/song/reset-bili", { method: "POST", body: JSON.stringify({ id: id }) }).then(function(){ alert("已清 BVID"); loadSongs(); }); }

function renderLyricsTab() {
  var st = dashData.stats || {}, miss = Math.max(0, (st.songs || 0) - (st.lyrics || 0)), pct = st.songs ? Math.round((st.lyrics / st.songs) * 100) : 0;
  var h = '<div class="card"><h3>全库歌词补全引擎（网易云双语 + LRCLIB）</h3><p style="font-size:13px;color:var(--muted);margin-bottom:10px;">已存歌词 <b>' + (st.lyrics||0) + '</b> 首，缺失 <b>' + miss + '</b> 首（' + pct + '%）。每批处理 10 首写入 D1 永久复用。</p><div class="pbar"><div id="bfBar" style="width:' + pct + '%"></div></div><div class="row"><button class="green" id="bfBtn" onclick="toggleBackfill()">⚡ 一键批量补全缺失歌词</button><span id="bfStat" style="font-size:12px;color:var(--muted);">就绪</span></div><div id="bfLog" style="font-size:12px;color:var(--muted);max-height:110px;overflow-y:auto;font-family:monospace;"></div></div>';
  h += '<div class="card"><h3>歌词检索与在线编辑</h3><div class="row"><input id="lq" placeholder="搜歌名或歌手..." style="flex:1;" onkeydown="if(event.key===\\'Enter\\'){lrcPage=1;loadLyricsList();}" /><select id="lflt" onchange="lrcPage=1;loadLyricsList()"><option value="no_lrc">只看缺歌词</option><option value="has_lrc">只看已有歌词</option><option value="active">全部正常歌曲</option></select><button onclick="lrcPage=1;loadLyricsList()">查询</button></div><div id="lrcTbl">加载中...</div></div>';
  document.getElementById("main").innerHTML = h; loadLyricsList();
}
function toggleBackfill() { if (backfillRunning) { backfillRunning = false; document.getElementById("bfBtn").textContent = "继续补全"; return; } backfillRunning = true; document.getElementById("bfBtn").textContent = "暂停补全"; runBackfillLoop(0, 0, 0); }
function runBackfillLoop(afterId, totalProc, totalUpd) {
  if (!backfillRunning) return;
  document.getElementById("bfStat").textContent = "扫描 ID > " + afterId + "（已处理 " + totalProc + "，补全 " + totalUpd + "）...";
  req("/api/admin/lyrics/backfill", { method: "POST", body: JSON.stringify({ afterId: afterId }) }).then(function(r) {
    totalProc += r.processed; totalUpd += r.updated;
    var logBox = document.getElementById("bfLog"); if (logBox && r.logs && r.logs.length) logBox.innerHTML = r.logs.map(esc).join("<br>") + "<br>" + logBox.innerHTML;
    if (r.done || !r.processed) { backfillRunning = false; document.getElementById("bfBtn").textContent = "⚡ 一键批量补全缺失歌词"; document.getElementById("bfStat").textContent = "完成！处理 " + totalProc + " 首，补全 " + totalUpd + " 首"; loadLyricsList(); return; }
    if (backfillRunning) runBackfillLoop(r.lastId, totalProc, totalUpd);
  }).catch(function(e) { backfillRunning = false; document.getElementById("bfBtn").textContent = "重试补全"; document.getElementById("bfStat").textContent = "中断：" + e.message; });
}
function loadLyricsList() {
  req("/api/admin/songs?q=" + encodeURIComponent(document.getElementById("lq")?.value || "") + "&filter=" + (document.getElementById("lflt")?.value || "no_lrc") + "&page=" + lrcPage).then(function(d) {
    lrcRows = d.songs || [];
    var h = '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">匹配 ' + d.total + ' 首</div><table><tr><th>ID</th><th>歌曲</th><th>歌词状态</th><th>操作</th></tr>';
    for (var i = 0; i < lrcRows.length; i++) {
      var s = lrcRows[i];
      h += '<tr><td>#' + s.id + '</td><td><b>' + esc(s.title) + '</b> - <small style="color:var(--muted);">' + esc(s.artist) + '</small></td><td>' + (s.lrc_len > 10 ? '<span class="badge ok">' + s.lrc_len + ' 字符</span>' : '<span class="badge miss">缺失</span>') + '</td><td><button class="sm" onclick="openEditLyric(' + s.id + ')">编辑 / 抓取歌词</button></td></tr>';
    }
    h += '</table><div class="row" style="margin-top:12px;justify-content:space-between;"><button class="ghost sm" ' + (lrcPage <= 1 ? "disabled" : "") + ' onclick="lrcPage--;loadLyricsList()">上一页</button><button class="ghost sm" ' + (lrcPage * d.limit >= d.total ? "disabled" : "") + ' onclick="lrcPage++;loadLyricsList()">下一页</button></div>';
    document.getElementById("lrcTbl").innerHTML = h;
  });
}
function openEditLyric(id) {
  req("/api/admin/song?id=" + id).then(function(d) {
    var s = d.song;
    document.getElementById("modalBody").innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><h3>歌词编辑：' + esc(s.title) + '</h3><button class="sm green" onclick="fetchOneLyric(' + s.id + ')">在线重抓预览</button></div><label style="font-size:12px;color:var(--muted);">主歌词（LRC）</label><textarea id="e_lrc" rows="10">' + esc(s.lyric_lrc || "") + '</textarea><label style="font-size:12px;color:var(--muted);display:block;margin-top:8px;">翻译歌词</label><textarea id="e_trans" rows="5">' + esc(s.lyric_trans || "") + '</textarea><div class="row" style="justify-content:flex-end;margin-top:12px;"><button class="ghost" onclick="closeModal()">取消</button><button onclick="saveLyric(' + s.id + ')">保存</button></div>';
    document.getElementById("modalBg").classList.add("open");
  });
}
function fetchOneLyric(id) { req("/api/admin/lyric/fetch", { method: "POST", body: JSON.stringify({ id: id }) }).then(function(r) { if (!r.lrc) return alert("在线未匹配到歌词"); document.getElementById("e_lrc").value = r.lrc; document.getElementById("e_trans").value = r.trans || ""; }); }
function saveLyric(id) { req("/api/admin/song/update", { method: "POST", body: JSON.stringify({ id: id, onlyLyric: true, lyric_lrc: document.getElementById("e_lrc").value, lyric_trans: document.getElementById("e_trans").value }) }).then(function() { closeModal(); if (curTab === "lyrics") loadLyricsList(); else loadSongs(); }); }

function renderChartsTab() {
  var list = dashData.charts || [], h = '<div class="card"><h3>首页榜单排序与分类管理</h3><table><tr><th>ID</th><th>标题</th><th>分类</th><th>排序(小在前)</th><th>操作</th></tr>';
  for (var i = 0; i < list.length; i++) {
    var c = list[i];
    h += '<tr><td><small>' + esc(c.id) + '</small></td><td><input id="ct-' + i + '" value="' + esc(c.title) + '" style="width:160px;" /></td><td><input id="cc-' + i + '" value="' + esc(c.category) + '" style="width:120px;" /></td><td><input id="cs-' + i + '" type="number" value="' + c.sort_order + '" style="width:70px;" /></td><td><button class="sm" onclick="saveChart(' + i + ')">保存</button> <button class="sm red" onclick="delChart(' + i + ')">删</button></td></tr>';
  }
  document.getElementById("main").innerHTML = h + '</table></div>';
}
function saveChart(i) { var c = dashData.charts[i]; req("/api/admin/chart/update", { method: "POST", body: JSON.stringify({ id: c.id, title: document.getElementById("ct-" + i).value, category: document.getElementById("cc-" + i).value, sort_order: Number(document.getElementById("cs-" + i).value) }) }).then(function(){ alert("已更新"); loadAll(); }); }
function delChart(i) { var c = dashData.charts[i]; if (confirm("删除榜单 " + c.title + "？")) req("/api/admin/chart/delete", { method: "POST", body: JSON.stringify({ id: c.id }) }).then(loadAll); }
function closeModal() { document.getElementById("modalBg").classList.remove("open"); }
loadAll();
</script>
</body>
</html>`;
