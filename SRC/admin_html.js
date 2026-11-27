export const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Music Hub 控制中心</title>
<script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
<script>
(function(){try{var t=localStorage.getItem("mh_theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();
</script>
<style>
  :root, html[data-theme="dark"]{
    --bg:#090c14;
    --card:#0f1420;
    --card-sub:rgba(255,255,255,.035);
    --stat:rgba(255,255,255,.045);
    --line:rgba(255,255,255,.085);
    --hover:rgba(255,255,255,.04);
    --text:#f1f5f9;
    --muted:#94a3b8;
    --acc:#38bdf8;
    --acc-text:#06121f;
    --input-bg:#090c14;
    --input-line:#334155;
    --ghost-bg:#1e293b;
    --ghost-text:#e2e8f0;
    --aud-bg:#0f172a;
    --badge-bg:rgba(255,255,255,.08);
    --badge-text:#cbd5e1;
  }
  html[data-theme="light"]{
    --bg:#f3f6fb;
    --card:#ffffff;
    --card-sub:#f8fafc;
    --stat:#f1f5f9;
    --line:rgba(15,23,42,.09);
    --hover:rgba(15,23,42,.03);
    --text:#0f172a;
    --muted:#64748b;
    --acc:#0284c7;
    --acc-text:#ffffff;
    --input-bg:#f8fafc;
    --input-line:#cbd5e1;
    --ghost-bg:#e2e8f0;
    --ghost-text:#1e293b;
    --aud-bg:#ffffff;
    --badge-bg:rgba(15,23,42,.06);
    --badge-text:#334155;
  }

  *{box-sizing:border-box;}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif;max-width:1120px;margin:0 auto;padding:18px;padding-bottom:84px;transition:background .2s,color .2s;}
  .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;}
  .brand-h{display:flex;align-items:center;gap:10px;margin:0;font-size:20px;font-weight:800;}
  .dot{width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#818cf8);box-shadow:0 0 10px rgba(56,189,248,.55);}
  .tabs{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
  .tab{padding:8px 16px;border-radius:10px;background:var(--card);color:var(--muted);border:1px solid var(--line);cursor:pointer;font-size:13px;font-weight:600;transition:.15s;}
  .tab:hover{color:var(--text);}
  .tab.active{background:var(--acc);color:var(--acc-text);border-color:var(--acc);}

  .card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;margin-bottom:16px;box-shadow:0 6px 24px rgba(0,0,0,.06);}
  h2,h3{margin:0 0 12px;font-size:16.5px;}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;}
  .sub-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;}
  .sub-card{background:var(--card-sub);border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;gap:14px;align-items:center;}
  .qr-box{width:110px;height:110px;background:#fff;border-radius:10px;padding:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#475569;font-size:11px;text-align:center;border:1px solid rgba(15,23,42,.08);}
  .qr-box svg{width:100% !important;height:100% !important;display:block;}
  .stat{background:var(--stat);padding:14px;border-radius:12px;text-align:center;border:1px solid var(--line);}
  .stat b{font-size:24px;color:var(--acc);display:block;} .stat span{font-size:12px;color:var(--muted);}

  input,select,textarea{background:var(--input-bg);border:1px solid var(--input-line);color:var(--text);padding:8px 10px;border-radius:8px;font-size:13px;outline:none;transition:border-color .15s;}
  input:focus,select:focus,textarea:focus{border-color:var(--acc);}
  textarea{width:100%;font-family:monospace;line-height:1.5;}

  button{background:var(--acc);color:var(--acc-text);border:none;padding:8px 14px;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;transition:opacity .15s;}
  button:hover{opacity:.9;}
  button:disabled{opacity:.45;cursor:not-allowed;}
  button.sm{padding:5px 10px;font-size:12px;}
  button.red{background:#ef4444;color:#fff;}
  button.green{background:#10b981;color:#fff;}
  button.ghost{background:var(--ghost-bg);color:var(--ghost-text);border:1px solid var(--line);}

  .tbl-wrap{width:100%;overflow-x:auto;}
  table{width:100%;border-collapse:collapse;font-size:13px;min-width:600px;}
  td,th{padding:10px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:middle;}
  th{font-size:12px;color:var(--muted);font-weight:600;}
  tbody tr:hover{background:var(--hover);}
  .row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center;}
  .err{color:#ef4444;font-size:13px;margin-top:8px;}

  .badge{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;background:var(--badge-bg);color:var(--badge-text);margin:2px;}
  .badge.ok{background:rgba(16,185,129,.16);color:#10b981;font-weight:600;}
  .badge.miss{background:rgba(245,158,11,.16);color:#d97706;font-weight:600;}
  .badge.blk{background:rgba(239,68,68,.16);color:#ef4444;font-weight:600;}

  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.62);backdrop-filter:blur(4px);z-index:50;display:none;align-items:center;justify-content:center;padding:16px;}
  .modal-bg.open{display:flex;}
  .modal{background:var(--card);color:var(--text);border:1px solid var(--line);border-radius:16px;padding:20px;width:100%;max-width:640px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 50px rgba(0,0,0,.3);}
  .pbar{height:8px;background:var(--stat);border-radius:99px;overflow:hidden;margin:10px 0;}
  .pbar > div{height:100%;background:linear-gradient(90deg,#38bdf8,#10b981);transition:width .3s;}
  .aud-bar{position:fixed;left:0;right:0;bottom:0;background:var(--aud-bg);border-top:1px solid var(--line);padding:10px 20px;display:none;align-items:center;gap:12px;z-index:40;box-shadow:0 -8px 24px rgba(0,0,0,.15);}
  .toast{position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-10px);background:var(--card);color:var(--text);border:1px solid var(--line);padding:9px 16px;border-radius:999px;font-size:12.5px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.22);z-index:90;opacity:0;pointer-events:none;transition:.2s;}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
  .cfg-lbl{font-size:12px;color:var(--muted);margin-right:4px;}
  .tip-box{margin-top:14px;padding:10px 12px;border-radius:10px;background:var(--stat);border:1px solid var(--line);font-size:12px;color:var(--muted);line-height:1.55;}
</style>
</head>
<body>
<div class="top">
  <h2 class="brand-h"><span class="dot"></span>Music Hub 控制中心</h2>
  <div style="display:flex;gap:8px;align-items:center;">
    <button class="ghost sm" id="themeBtn" onclick="toggleTheme()" title="切换深浅主题">☀️</button>
    <button class="ghost sm" onclick="logout()" id="logoutBtn" style="display:none;">退出</button>
    <button class="ghost sm" onclick="location.href='/player'">前往播放器</button>
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
<div class="modal-bg" id="modalBg" onclick="if(event.target===this)closeModal()"><div class="modal" id="modalBody"></div></div>
<div class="toast" id="toast"></div>
<div class="aud-bar" id="audBar">
  <b id="audTitle" style="font-size:13px;min-width:160px;">试听</b>
  <audio id="admAudio" controls style="flex:1;height:36px;"></audio>
  <button class="ghost sm" onclick="document.getElementById('audBar').style.display='none';document.getElementById('admAudio').pause();">关闭</button>
</div>

<script>
var ATOKEN = sessionStorage.getItem("mh_admin_tk") || "";
var curTab = "overview", dashData = null, songRows = [], songPage = 1, lrcRows = [], lrcPage = 1, backfillRunning = false, toastTimer = null;
function esc(s) { return String(s || "").replace(/[&<>"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function toast(msg) {
  var el = document.getElementById("toast"); el.textContent = msg; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(function() { el.classList.remove("show"); }, 2500);
}
function syncThemeBtn() {
  var cur = document.documentElement.getAttribute("data-theme") || "dark";
  var btn = document.getElementById("themeBtn"); if (btn) btn.textContent = cur === "dark" ? "☀️" : "🌙";
}
function toggleTheme() {
  var cur = document.documentElement.getAttribute("data-theme") || "dark";
  var next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("mh_theme", next); syncThemeBtn();
  toast(next === "light" ? "已切换为浅色主题" : "已切换为深色主题");
}
syncThemeBtn();

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
  document.getElementById("main").innerHTML = '<div class="card" style="max-width:420px;margin:40px auto;"><h3>输入后台管理密码</h3><div class="row"><input id="pw" type="password" placeholder="ADMIN_PASSWORD" style="flex:1;" /><button onclick="doLogin()">登录</button></div><div class="err" id="loginErr">' + esc(msg || "") + '</div></div>';
  var pw = document.getElementById("pw"); if (pw) pw.addEventListener("keydown", function(e) { if (e.key === "Enter") doLogin(); });
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

// -------- 订阅源、模式切换、二维码与本地文件下载 --------
function makeQrHtml(text) {
  try {
    if (typeof qrcode === "function") {
      var q = qrcode(0, "M"); q.addData(text); q.make();
      return q.createSvgTag(4, 0);
    }
  } catch {}
  return '<span>二维码库未加载，请复制右侧链接</span>';
}
function copyText(id, btn) {
  var el = document.getElementById(id); if (!el) return;
  navigator.clipboard.writeText(el.value).then(function() {
    var old = btn.textContent; btn.textContent = "已复制 ✓"; toast("链接已复制到剪贴板");
    setTimeout(function() { btn.textContent = old; }, 1500);
  }).catch(function() { el.select(); document.execCommand("copy"); toast("已复制"); });
}
function saveTextAsFile(text, mime, filename) {
  var blob = new Blob([text], { type: (mime || "text/plain") + ";charset=utf-8" });
  var objUrl = URL.createObjectURL(blob);
  var a = document.createElement("a"); a.href = objUrl; a.download = filename; a.style.display = "none";
  document.body.appendChild(a); a.click();
  setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(objUrl); }, 1000);
}
function downloadSubFile(i) {
  var item = window._subItems && window._subItems[i];
  if (!item || !item.fileName) return;
  toast("正在拉取并下载：" + item.fileName);
  fetch(item.url).then(function(r) {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.text();
  }).then(function(txt) {
    saveTextAsFile(txt, item.mime, item.fileName);
    toast("已下载本地文件：" + item.fileName);
  }).catch(function(e) { toast("下载失败：" + e.message); });
}
function downloadAllSubs() {
  var items = window._subItems || [], delay = 0;
  for (var i = 0; i < items.length; i++) {
    if (!items[i].fileName) continue;
    (function(idx, d) { setTimeout(function() { downloadSubFile(idx); }, d); })(i, delay);
    delay += 380;
  }
}
function saveSubMode() {
  var m = document.getElementById("subModeSel").value;
  req("/api/admin/settings", { method: "POST", body: JSON.stringify({ subMode: m }) }).then(function() {
    dashData.subMode = m;
    toast("订阅组合模式已切换为「" + m + "」，在客户端重新更新订阅即可生效");
  });
}

function renderSubsTab() {
  var base = location.origin, tk = dashData.accessToken || "", qs = tk ? ("?token=" + encodeURIComponent(tk)) : "", tkSeg = encodeURIComponent(tk || "public");
  var mode = dashData.subMode || "fusion";
  var items = [
    { id: "sub_player", title: "📱 PWA 手机 / 网页播放器", desc: "支持电台漫游、记忆目录下载、自建歌单与深浅双主题", url: base + "/player" + qs },
    { id: "sub_mfjson", title: "🧩 MusicFree / 音悦 通用订阅源 (.json)", desc: "按上方模式动态下发「自建4插件」或「强力融合插件组」，推荐导入此地址", url: base + "/s/" + tkSeg + "/musicfree.json", fileName: "musicfree.json", mime: "application/json" },
    { id: "sub_mfjs", title: "☁️ MusicHub·自建云端 主插件 (.js)", desc: "含推荐歌单、1000首跨平台导入、本地三路并发+原版打分器", url: base + "/s/" + tkSeg + "/music-hub.js", fileName: "music-hub.js", mime: "application/javascript" },
    { id: "sub_kwjs", title: "⚡ MusicHub·酷我直连 插件 (.js)", desc: "手机本地直连酷我接口，不经过 Worker 延迟更低", url: base + "/s/" + tkSeg + "/kuwo.js", fileName: "kuwo.js", mime: "application/javascript" },
    { id: "sub_bljs", title: "📺 MusicHub·B站直连 插件 (.js)", desc: "手机本地 WBI 直连 B站音频，彻底绕开 Cloudflare 机房风控", url: base + "/s/" + tkSeg + "/bili.js", fileName: "bili.js", mime: "application/javascript" },
    { id: "sub_msrjs", title: "🎧 MusicHub·塞壬直连 插件 (.js)", desc: "塞壬唱片官方无损曲库直连", url: base + "/s/" + tkSeg + "/msr.js", fileName: "msr.js", mime: "application/javascript" },
    { id: "sub_lxjs", title: "❄️ 洛雪音乐 (LX Music) 自定义源 (.js)", desc: "下载后可直接导入洛雪桌面版/安卓版「设置 -> 自定义源」", url: base + "/s/" + tkSeg + "/lx-source.js", fileName: "lx-source.js", mime: "application/javascript" },
    { id: "sub_diag", title: "🩺 全源并发体检接口", desc: "实时查看服务端到各大音源的真实播放解析连通率与耗时", url: base + "/api/diag" + qs },
  ];
  window._subItems = items;

  var h = '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">' +
    '<div><h3 style="margin-bottom:4px;">订阅源融合模式配置（作用于 musicfree.json）</h3><p style="font-size:12px;color:var(--muted);margin:0;">所有自建插件均支持国内手机本地并发直连，减少绕道海外节点的卡顿。</p></div>' +
    '<div class="row" style="margin:0;"><select id="subModeSel">' +
    '<option value="pure"' + (mode === "pure" ? " selected" : "") + '>纯净自建版（4个全自建插件，绝对稳）</option>' +
    '<option value="fusion"' + (mode === "fusion" ? " selected" : "") + '>强力融合版（自建4插件 + 歌曲宝/种子/爱听/5sing，推荐）</option>' +
    '<option value="turbo"' + (mode === "turbo" ? " selected" : "") + '>全量涡轮版（强力融合 + 元力网易/QQ/酷我）</option>' +
    '</select><button onclick="saveSubMode()">保存模式</button></div></div></div>';

  h += '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">' +
    '<div><h3 style="margin-bottom:4px;">多端订阅地址、二维码 & 本地文件下载</h3><p style="font-size:12px;color:var(--muted);margin:0;">当前访问密钥 (ACCESS_TOKEN)：' + (tk ? '<span class="badge ok">已自动嵌入路径与本地脚本</span>' : '<span class="badge miss">未配置（免密模式）</span>') + '</p></div>' +
    '<button class="sm green" onclick="downloadAllSubs()">⬇ 一键下载全部源文件</button>' +
    '</div><div class="sub-grid">';

  for (var i = 0; i < items.length; i++) {
    var it = items[i], dlBtn = it.fileName ? '<button class="sm green" onclick="downloadSubFile(' + i + ')">⬇ 下载本地文件</button>' : '';
    h += '<div class="sub-card"><div class="qr-box">' + makeQrHtml(it.url) + '</div><div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:14px;margin-bottom:3px;">' + it.title + '</div><div style="font-size:11.5px;color:var(--muted);margin-bottom:8px;line-height:1.4;">' + it.desc + '</div><input id="' + it.id + '" value="' + esc(it.url) + '" readonly style="width:100%;font-size:12px;margin-bottom:8px;" onclick="this.select()" /><div style="display:flex;gap:6px;flex-wrap:wrap;"><button class="sm" onclick="copyText(\\'' + it.id + '\\',this)">复制链接</button>' + dlBtn + '<button class="sm ghost" onclick="window.open(window._subItems[' + i + '].url,\\'_blank\\')">打开测试</button></div></div></div>';
  }
  h += '</div><div class="tip-box">💡 <b>导入建议：</b>在 MusicFree / 音悦推荐直接用「从网络安装」填入上面的 <code>musicfree.json</code> 地址；若需要离线发给朋友，可下载 <code>.js</code> 文件通过「从本地安装」导入。</div></div>';
  document.getElementById("main").innerHTML = h;
}

function renderOverview() {
  var st = dashData.stats || {}, pct = st.songs ? Math.round((st.lyrics / st.songs) * 100) : 0;
  var sc = dashData.syncConfig || { enabled: true, lrcLimit: 450, chartMax: 120, lastSyncAt: 0, lastSyncSummary: "暂无同步记录" };
  var lastTimeStr = sc.lastSyncAt ? new Date(sc.lastSyncAt * 1000).toLocaleString("zh-CN") : "尚未运行";

  var h = '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><h3>曲库概览</h3><button class="sm green" onclick="switchTab(\\'subs\\')">查看订阅源 / 切换融合模式</button></div>' +
    '<div class="grid"><div class="stat"><b>' + (st.songs||0) + '</b><span>可用歌曲</span></div><div class="stat"><b>' + (st.charts||0) + '</b><span>精选榜单</span></div><div class="stat"><b>' + (st.lyrics||0) + ' (' + pct + '%)</b><span>歌词覆盖率</span></div><div class="stat"><b>' + (st.blocked||0) + '</b><span>已屏蔽</span></div></div><div style="margin-top:14px;">' + (dashData.categories || []).map(function(c) { return '<span class="badge">' + esc(c.category) + ': ' + c.c + '首</span>'; }).join("") + '</div></div>';

  var srcs = dashData.sources || [];
  h += '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><h3>云端音源解析池</h3><button class="sm" onclick="testAllSrc()">一键全员测活</button></div><div class="tbl-wrap"><table><thead><tr><th>ID</th><th>名称 / 地址</th><th>类型</th><th>优先级</th><th>状态</th><th>测活结果</th><th>操作</th></tr></thead><tbody>';
  for (var i = 0; i < srcs.length; i++) {
    var s = srcs[i];
    h += '<tr><td>' + esc(s.id) + '</td><td><b>' + esc(s.name) + '</b><br><small style="color:var(--muted);">' + esc(s.endpoint) + '</small></td><td>' + esc(s.type) + '</td><td>' + s.priority + '</td><td>' + (s.enabled ? '<span class="badge ok">启用</span>' : '<span class="badge">停用</span>') + '</td><td id="st-' + esc(s.id) + '"><small style="color:var(--muted);">未测</small></td><td style="white-space:nowrap;"><button class="sm" onclick="testSrc(' + i + ')">测活</button> <button class="sm ghost" onclick="editSrcForm(' + i + ')">改</button> <button class="sm ghost" onclick="toggleSrc(' + i + ')">' + (s.enabled ? "停" : "启") + '</button> <button class="sm red" onclick="delSrc(' + i + ')">删</button></td></tr>';
  }
  h += '</tbody></table></div><div class="row" style="margin-top:12px;"><input id="sid" placeholder="ID 如 myapi" style="width:95px;" /><input id="sname" placeholder="名称" style="width:120px;" /><select id="stype"><option value="agg">agg</option><option value="vkeys">vkeys</option><option value="native">native</option><option value="bili">bili</option></select><input id="send" placeholder="Endpoint URL" style="flex:1;min-width:180px;" /><input id="spri" type="number" value="20" style="width:65px;" /><button onclick="addSrc()">保存音源</button></div></div>';

  h += '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;"><h3>每日自动同步策略（sync.py）</h3><span class="badge">' + esc(lastTimeStr) + ' · ' + esc(sc.lastSyncSummary) + '</span></div>' +
    '<div class="row"><span class="cfg-lbl">自动同步:</span><select id="syncEn"><option value="1"' + (sc.enabled ? ' selected' : '') + '>启用每日同步</option><option value="0"' + (!sc.enabled ? ' selected' : '') + '>暂停同步</option></select><span class="cfg-lbl">每次抓词上限:</span><input id="syncLrcIn" type="number" min="0" max="2000" value="' + esc(sc.lrcLimit) + '" style="width:95px;" /><span class="cfg-lbl">单榜最多曲目:</span><input id="syncChartIn" type="number" min="10" max="500" value="' + esc(sc.chartMax) + '" style="width:95px;" /><button onclick="saveSyncCfg()">保存同步参数</button></div>' +
    '<div style="font-size:12px;color:var(--muted);">提示：调整后会写入 D1，下次定时任务或手动触发 GitHub Actions 时自动生效（已内置 45 天空提交保活）。</div></div>';

  h += '<div class="card"><h3>垃圾翻唱 / 伴奏自动过滤词配置（同时作用于播放器与 sync.py）</h3><div class="row"><input id="junkIn" value="' + esc(dashData.junkWords || "") + '" style="flex:1;" /><button onclick="saveJunk()">保存过滤词</button></div></div>';
  document.getElementById("main").innerHTML = h;
}
function testSrc(i) {
  var s = dashData.sources[i]; if (!s) return;
  var cell = document.getElementById("st-" + s.id); if (cell) cell.innerHTML = '<small>测活中...</small>';
  return req("/api/admin/source/test", { method: "POST", body: JSON.stringify({ id: s.id }) }).then(function(r) {
    if (cell) cell.innerHTML = r.ok ? ('<span class="badge ok">' + r.status + ' · ' + r.ms + 'ms</span>') : ('<span class="badge blk">失败 ' + esc(r.status || r.error) + '</span>');
  });
}
function testAllSrc() { for (var i = 0; i < dashData.sources.length; i++) testSrc(i); }
function editSrcForm(i) { var s = dashData.sources[i]; document.getElementById("sid").value = s.id; document.getElementById("sname").value = s.name; document.getElementById("stype").value = s.type; document.getElementById("send").value = s.endpoint; document.getElementById("spri").value = s.priority; toast("已填入上方编辑框"); }
function toggleSrc(i) { var s = dashData.sources[i]; req("/api/admin/source", { method: "POST", body: JSON.stringify({ id:s.id, name:s.name, type:s.type, endpoint:s.endpoint, priority:s.priority, enabled:s.enabled?0:1 }) }).then(function(){ toast("状态已切换"); loadAll(); }); }
function delSrc(i) { var s = dashData.sources[i]; if (confirm("删除音源 " + s.name + "？")) req("/api/admin/source/delete", { method: "POST", body: JSON.stringify({ id: s.id }) }).then(loadAll); }
function addSrc() { req("/api/admin/source", { method: "POST", body: JSON.stringify({ id: document.getElementById("sid").value, name: document.getElementById("sname").value, type: document.getElementById("stype").value, endpoint: document.getElementById("send").value, priority: Number(document.getElementById("spri").value), enabled: 1 }) }).then(function(){ toast("音源已保存"); loadAll(); }); }
function saveSyncCfg() {
  var en = document.getElementById("syncEn").value === "1", lrc = Math.max(0, Number(document.getElementById("syncLrcIn").value || 0)), cmax = Math.max(10, Number(document.getElementById("syncChartIn").value || 120));
  req("/api/admin/settings", { method: "POST", body: JSON.stringify({ syncEnabled: en, syncLrcLimit: lrc, syncChartMax: cmax }) }).then(function() {
    dashData.syncConfig = Object.assign(dashData.syncConfig || {}, { enabled: en, lrcLimit: lrc, chartMax: cmax });
    toast("同步参数已保存，下次 sync.py 运行生效");
  });
}
function saveJunk() { req("/api/admin/settings", { method: "POST", body: JSON.stringify({ junkWords: document.getElementById("junkIn").value }) }).then(function(){ toast("过滤词已保存"); }); }

function renderSongsTab() {
  var cats = (dashData.categories || []).map(function(c) { return '<option value="' + esc(c.category) + '">' + esc(c.category) + ' (' + c.c + ')</option>'; }).join("");
  var h = '<div class="card"><h3>一键导入网易云公开歌单到曲库 & 主页</h3><div class="row"><input id="impUrl" placeholder="粘贴网易云歌单链接或数字 ID（如 2945028696）" style="flex:2;min-width:220px;" /><input id="impTitle" placeholder="自定义榜单名（留空用原名）" style="flex:1;" /><select id="impCCat"><option value="经典金曲">经典金曲</option><option value="华语怀旧">华语怀旧</option><option value="核心榜单">核心榜单</option><option value="ACG / 二次元">ACG / 二次元</option><option value="日韩欧美">日韩欧美</option></select><select id="impSCat"><option value="经典">歌曲分类: 经典</option><option value="华语">华语</option><option value="ACG">ACG</option><option value="日韩">日韩</option><option value="欧美">欧美</option></select><button class="green" onclick="importPlaylist()">立即导入</button></div></div>';
  h += '<div class="card"><h3>全库检索与精修</h3><div class="row"><input id="sq" placeholder="搜歌名 / 歌手 / 专辑..." style="flex:1;min-width:180px;" /><select id="scat" onchange="songPage=1;loadSongs()"><option value="">全部分类</option>' + cats + '</select><select id="sflt" onchange="songPage=1;loadSongs()"><option value="all">全部状态</option><option value="active">仅正常</option><option value="no_lrc">缺歌词</option><option value="blocked">已屏蔽</option></select><select id="ssrt" onchange="songPage=1;loadSongs()"><option value="score">热度优先</option><option value="newest">最新入库</option></select><button onclick="songPage=1;loadSongs()">筛选</button></div><div id="songsTbl">加载中...</div></div>';
  document.getElementById("main").innerHTML = h;
  var sq = document.getElementById("sq"); if (sq) sq.addEventListener("keydown", function(e) { if (e.key === "Enter") { songPage = 1; loadSongs(); } });
  loadSongs();
}
function importPlaylist() {
  var u = document.getElementById("impUrl").value.trim(); if (!u) return toast("请输入歌单链接或 ID");
  toast("正在导入歌单...");
  req("/api/admin/import-playlist", { method: "POST", body: JSON.stringify({ url: u, chartTitle: document.getElementById("impTitle").value.trim(), chartCategory: document.getElementById("impCCat").value, songCategory: document.getElementById("impSCat").value }) })
  .then(function(r) { toast("导入成功！《" + r.title + "》共 " + r.importedCount + " 首"); loadAll(); }).catch(function(e) { alert("导入失败：" + e.message); });
}
function loadSongs() {
  req("/api/admin/songs?q=" + encodeURIComponent(document.getElementById("sq")?.value || "") + "&cat=" + encodeURIComponent(document.getElementById("scat")?.value || "") + "&filter=" + (document.getElementById("sflt")?.value || "all") + "&sort=" + (document.getElementById("ssrt")?.value || "score") + "&page=" + songPage)
  .then(function(d) {
    songRows = d.songs || [];
    var h = '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">共 ' + d.total + ' 首，第 ' + d.page + ' 页</div><div class="tbl-wrap"><table><thead><tr><th>ID</th><th>歌名 / 歌手</th><th>分类 / 歌词</th><th>已存源ID</th><th>操作</th></tr></thead><tbody>';
    for (var i = 0; i < songRows.length; i++) {
      var s = songRows[i];
      h += '<tr><td>#' + s.id + '</td><td><b>' + esc(s.title) + '</b><br><small style="color:var(--muted);">' + esc(s.artist) + (s.album ? " · " + esc(s.album) : "") + '</small></td><td><span class="badge">' + esc(s.category) + '</span>' + (s.lrc_len > 10 ? '<span class="badge ok">有词</span>' : '<span class="badge miss">缺词</span>') + (s.is_blocked ? '<span class="badge blk">屏蔽</span>' : '') + '</td><td><small style="color:var(--muted);word-break:break-all;">' + esc(s.source_ids_json) + '</small></td><td style="white-space:nowrap;"><button class="sm" onclick="admPlay(' + i + ')">试听</button> <button class="sm ghost" onclick="openEditSong(' + i + ')">改</button> <button class="sm ghost" onclick="openEditLyric(' + s.id + ')">词</button> ' + (s.is_blocked ? '<button class="sm green" onclick="setBlock(' + s.id + ',0)">解</button> ' : '<button class="sm red" onclick="setBlock(' + s.id + ',1)">封</button> ') + '<button class="sm ghost" onclick="resetBili(' + s.id + ')">清BV</button> <button class="sm red" onclick="delSong(' + s.id + ')">删</button></td></tr>';
    }
    h += '</tbody></table></div><div class="row" style="margin-top:12px;justify-content:space-between;"><button class="ghost sm" ' + (songPage <= 1 ? "disabled" : "") + ' onclick="songPage--;loadSongs()">上一页</button><button class="ghost sm" ' + (songPage * d.limit >= d.total ? "disabled" : "") + ' onclick="songPage++;loadSongs()">下一页</button></div>';
    document.getElementById("songsTbl").innerHTML = h;
  });
}
function admPlay(i) {
  var s = songRows[i]; if (!s) return;
  document.getElementById("audBar").style.display = "flex"; document.getElementById("audTitle").textContent = "解析中: " + s.title;
  req("/api/admin/play?id=" + s.id).then(function(r) {
    document.getElementById("audTitle").textContent = s.title + " [" + r.source + "]";
    var a = document.getElementById("admAudio");
    var playUrl = r.needProxy ? (r.proxyUrl + (r.proxyUrl.slice(-7) === "atoken=" ? encodeURIComponent(ATOKEN) : "")) : r.url;
    a.src = playUrl; a.play().catch(function(){});
  }).catch(function(e) { document.getElementById("audTitle").textContent = "失败: " + e.message; });
}
function openEditSong(i) {
  var s = songRows[i]; if (!s) return;
  document.getElementById("modalBody").innerHTML = '<h3>编辑歌曲 #' + s.id + '</h3><div class="row"><label style="width:70px;">歌名</label><input id="e_title" value="' + esc(s.title) + '" style="flex:1;" /></div><div class="row"><label style="width:70px;">歌手</label><input id="e_artist" value="' + esc(s.artist) + '" style="flex:1;" /></div><div class="row"><label style="width:70px;">专辑</label><input id="e_album" value="' + esc(s.album) + '" style="flex:1;" /></div><div class="row"><label style="width:70px;">封面</label><input id="e_cover" value="' + esc(s.cover) + '" style="flex:1;" /></div><div class="row"><label style="width:70px;">分类</label><input id="e_cat" value="' + esc(s.category) + '" style="flex:1;" /><label>热度</label><input id="e_score" type="number" value="' + s.score + '" style="width:80px;" /></div><div class="row"><label style="width:70px;">源 ID JSON</label><input id="e_ids" value="' + esc(s.source_ids_json) + '" style="flex:1;font-family:monospace;" /></div><div class="row" style="justify-content:flex-end;margin-top:12px;"><button class="ghost" onclick="closeModal()">取消</button><button onclick="saveSong(' + s.id + ')">保存</button></div>';
  document.getElementById("modalBg").classList.add("open");
}
function saveSong(id) {
  req("/api/admin/song/update", { method: "POST", body: JSON.stringify({ id: id, title: document.getElementById("e_title").value, artist: document.getElementById("e_artist").value, album: document.getElementById("e_album").value, cover: document.getElementById("e_cover").value, category: document.getElementById("e_cat").value, score: Number(document.getElementById("e_score").value), source_ids_json: document.getElementById("e_ids").value }) }).then(function() { closeModal(); toast("歌曲已更新"); loadSongs(); }).catch(function(e){ alert(e.message); });
}
function setBlock(id, blocked) { req("/api/admin/song/block", { method: "POST", body: JSON.stringify({ id: id, blocked: blocked }) }).then(function(){ toast(blocked ? "已屏蔽" : "已解封"); loadSongs(); }); }
function delSong(id) { if (confirm("确认删除 #" + id + "？")) req("/api/admin/song/delete", { method: "POST", body: JSON.stringify({ id: id }) }).then(function(){ toast("已删除"); loadSongs(); }); }
function resetBili(id) { req("/api/admin/song/reset-bili", { method: "POST", body: JSON.stringify({ id: id }) }).then(function(){ toast("已清除 BVID"); loadSongs(); }); }

function renderLyricsTab() {
  var st = dashData.stats || {}, miss = Math.max(0, (st.songs || 0) - (st.lyrics || 0)), pct = st.songs ? Math.round((st.lyrics / st.songs) * 100) : 0;
  var h = '<div class="card"><h3>全库歌词补全引擎（网易云双语 + LRCLIB）</h3><p style="font-size:13px;color:var(--muted);margin-bottom:10px;">已存歌词 <b>' + (st.lyrics||0) + '</b> 首，缺失 <b>' + miss + '</b> 首（' + pct + '%）。每批处理 10 首写入 D1 永久复用。</p><div class="pbar"><div id="bfBar" style="width:' + pct + '%"></div></div><div class="row"><button class="green" id="bfBtn" onclick="toggleBackfill()">⚡ 一键批量补全缺失歌词</button><span id="bfStat" style="font-size:12px;color:var(--muted);">就绪</span></div><div id="bfLog" style="font-size:12px;color:var(--muted);max-height:110px;overflow-y:auto;font-family:monospace;"></div></div>';
  h += '<div class="card"><h3>歌词检索与在线编辑</h3><div class="row"><input id="lq" placeholder="搜歌名或歌手..." style="flex:1;" /><select id="lflt" onchange="lrcPage=1;loadLyricsList()"><option value="no_lrc">只看缺歌词</option><option value="has_lrc">只看已有歌词</option><option value="active">全部正常歌曲</option></select><button onclick="lrcPage=1;loadLyricsList()">查询</button></div><div id="lrcTbl">加载中...</div></div>';
  document.getElementById("main").innerHTML = h;
  var lq = document.getElementById("lq"); if (lq) lq.addEventListener("keydown", function(e) { if (e.key === "Enter") { lrcPage = 1; loadLyricsList(); } });
  loadLyricsList();
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
    var h = '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">匹配 ' + d.total + ' 首</div><div class="tbl-wrap"><table><thead><tr><th>ID</th><th>歌曲</th><th>歌词状态</th><th>操作</th></tr></thead><tbody>';
    for (var i = 0; i < lrcRows.length; i++) {
      var s = lrcRows[i];
      h += '<tr><td>#' + s.id + '</td><td><b>' + esc(s.title) + '</b> - <small style="color:var(--muted);">' + esc(s.artist) + '</small></td><td>' + (s.lrc_len > 10 ? '<span class="badge ok">' + s.lrc_len + ' 字符</span>' : '<span class="badge miss">缺失</span>') + '</td><td><button class="sm" onclick="openEditLyric(' + s.id + ')">编辑 / 抓取歌词</button></td></tr>';
    }
    h += '</tbody></table></div><div class="row" style="margin-top:12px;justify-content:space-between;"><button class="ghost sm" ' + (lrcPage <= 1 ? "disabled" : "") + ' onclick="lrcPage--;loadLyricsList()">上一页</button><button class="ghost sm" ' + (lrcPage * d.limit >= d.total ? "disabled" : "") + ' onclick="lrcPage++;loadLyricsList()">下一页</button></div>';
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
function fetchOneLyric(id) { req("/api/admin/lyric/fetch", { method: "POST", body: JSON.stringify({ id: id }) }).then(function(r) { if (!r.lrc) return toast("在线未匹配到歌词"); document.getElementById("e_lrc").value = r.lrc; document.getElementById("e_trans").value = r.trans || ""; toast("已拉取在线歌词"); }); }
function saveLyric(id) { req("/api/admin/song/update", { method: "POST", body: JSON.stringify({ id: id, onlyLyric: true, lyric_lrc: document.getElementById("e_lrc").value, lyric_trans: document.getElementById("e_trans").value }) }).then(function() { closeModal(); toast("歌词已保存"); if (curTab === "lyrics") loadLyricsList(); else loadSongs(); }); }

function renderChartsTab() {
  var list = dashData.charts || [], h = '<div class="card"><h3>首页榜单排序与分类管理</h3><div class="tbl-wrap"><table><thead><tr><th>ID</th><th>标题</th><th>分类</th><th>排序(小在前)</th><th>操作</th></tr></thead><tbody>';
  for (var i = 0; i < list.length; i++) {
    var c = list[i];
    h += '<tr><td><small>' + esc(c.id) + '</small></td><td><input id="ct-' + i + '" value="' + esc(c.title) + '" style="width:180px;" /></td><td><input id="cc-' + i + '" value="' + esc(c.category) + '" style="width:120px;" /></td><td><input id="cs-' + i + '" type="number" value="' + c.sort_order + '" style="width:70px;" /></td><td style="white-space:nowrap;"><button class="sm" onclick="saveChart(' + i + ')">保存</button> <button class="sm red" onclick="delChart(' + i + ')">删</button></td></tr>';
  }
  document.getElementById("main").innerHTML = h + '</tbody></table></div></div>';
}
function saveChart(i) { var c = dashData.charts[i]; req("/api/admin/chart/update", { method: "POST", body: JSON.stringify({ id: c.id, title: document.getElementById("ct-" + i).value, category: document.getElementById("cc-" + i).value, sort_order: Number(document.getElementById("cs-" + i).value) }) }).then(function(){ toast("榜单已更新"); loadAll(); }); }
function delChart(i) { var c = dashData.charts[i]; if (confirm("删除榜单 " + c.title + "？")) req("/api/admin/chart/delete", { method: "POST", body: JSON.stringify({ id: c.id }) }).then(function(){ toast("榜单已删除"); loadAll(); }); }
function closeModal() { document.getElementById("modalBg").classList.remove("open"); }
loadAll();
</script>
</body>
</html>`;
