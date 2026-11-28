export const PLAYER_HTML = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="referrer" content="no-referrer" />
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<title>Music Hub · 极速播放器</title>
<script>
(function(){try{var t=localStorage.getItem("mh_theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();
</script>
<style>
  :root, html[data-theme="dark"]{
    --bg:#070a11;
    --bg-elev:#0c111e;
    --topbar:rgba(10,14,24,.92);
    --dock:rgba(10,14,24,.95);
    --stage-bg:#090d18;
    --stage-mask:rgba(9,13,24,.58);
    --panel:rgba(255,255,255,.045);
    --hover:rgba(255,255,255,.09);
    --line:rgba(255,255,255,.09);
    --input-bg:rgba(255,255,255,.07);
    --modal-bg:#111726;
    --text:#f8fafc;
    --muted:#94a3b8;
    --acc:#38bdf8;
    --acc-soft:rgba(56,189,248,.16);
    --acc-text:#06121f;
    --pill-act-bg:#ffffff;
    --pill-act-txt:#070a11;
    --fab-bg:#ffffff;
    --fab-txt:#070a11;
    --ok:#34d399;
    --warn:#fbbf24;
    --pink:#f43f5e;
    --lrc-dim:rgba(255,255,255,.42);
    --lrc-hover:rgba(255,255,255,.82);
    --lrc-cur:#ffffff;
    --thumb-bg:#161e2e;
    --scroll-thumb:rgba(255,255,255,.16);
  }
  html[data-theme="light"]{
    --bg:#f3f6fb;
    --bg-elev:#ffffff;
    --topbar:rgba(255,255,255,.92);
    --dock:rgba(255,255,255,.95);
    --stage-bg:#eef2f8;
    --stage-mask:rgba(244,247,252,.78);
    --panel:rgba(255,255,255,.88);
    --hover:rgba(15,23,42,.055);
    --line:rgba(15,23,42,.09);
    --input-bg:rgba(15,23,42,.05);
    --modal-bg:#ffffff;
    --text:#0f172a;
    --muted:#64748b;
    --acc:#0284c7;
    --acc-soft:rgba(2,132,199,.13);
    --acc-text:#ffffff;
    --pill-act-bg:#0f172a;
    --pill-act-txt:#ffffff;
    --fab-bg:#0f172a;
    --fab-txt:#ffffff;
    --ok:#059669;
    --warn:#d97706;
    --pink:#e11d48;
    --lrc-dim:rgba(15,23,42,.42);
    --lrc-hover:rgba(15,23,42,.78);
    --lrc-cur:#0f172a;
    --thumb-bg:#e2e8f0;
    --scroll-thumb:rgba(15,23,42,.18);
  }

  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  html,body{height:100%;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;overflow:hidden;transition:background .2s,color .2s;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-thumb{background:var(--scroll-thumb);border-radius:3px;}

  .app-shell{display:flex;flex-direction:column;height:100vh;height:100dvh;overflow:hidden;}
  .topbar{min-height:calc(58px + env(safe-area-inset-top));flex-shrink:0;background:var(--topbar);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--line);padding:env(safe-area-inset-top) 14px 0;display:flex;align-items:center;gap:8px;z-index:20;}
  .brand{font-size:17px;font-weight:800;display:flex;align-items:center;gap:8px;cursor:pointer;white-space:nowrap;}
  .dot{width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#818cf8);box-shadow:0 0 10px rgba(56,189,248,.6);}
  .nav-pills{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;}
  .nav-pills::-webkit-scrollbar{display:none;}
  .npill{padding:6px 10px;border-radius:999px;font-size:13px;font-weight:500;color:var(--muted);background:none;border:none;cursor:pointer;white-space:nowrap;transition:.15s;}
  .npill:hover{color:var(--text);background:var(--hover);}
  .npill.active{background:var(--acc-soft);color:var(--acc);font-weight:600;}

  .search-wrap{flex:1;max-width:260px;margin-left:auto;display:flex;gap:6px;min-width:120px;}
  .search-wrap input, .inline-input{width:100%;background:var(--input-bg);border:1px solid var(--line);color:var(--text);padding:7px 12px;border-radius:999px;font-size:13px;outline:none;}
  .search-wrap input:focus, .inline-input:focus{border-color:var(--acc);}
  .btn{background:var(--acc);color:var(--acc-text);border:none;padding:7px 13px;border-radius:999px;font-weight:600;font-size:12px;cursor:pointer;white-space:nowrap;transition:opacity .15s;}
  .btn:hover{opacity:.9;}
  .btn.ghost{background:var(--input-bg);color:var(--text);border:1px solid var(--line);}
  .btn.danger{background:#ef4444;color:#fff;}
  .btn.sm{padding:5px 10px;font-size:11.5px;}

  .workspace{flex:1;min-height:0;display:grid;grid-template-columns:1.28fr .95fr;overflow:hidden;}
  .left-pane{min-height:0;height:100%;overflow-y:auto;padding:16px 20px 28px;border-right:1px solid var(--line);}
  .right-stage{position:relative;min-height:0;height:100%;overflow:hidden;display:flex;flex-direction:column;padding:20px 24px;background:var(--stage-bg);}
  .stage-blur{position:absolute;inset:-50px;background-size:cover;background-position:center;filter:blur(65px) saturate(1.35);transform:scale(1.1);z-index:0;opacity:.75;transition:background-image .4s;}
  .stage-mask{position:absolute;inset:0;background:var(--stage-mask);z-index:0;}
  .stage-inner{position:relative;z-index:1;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;}

  .sec-head{display:flex;justify-content:space-between;align-items:center;margin:4px 0 12px;gap:8px;flex-wrap:wrap;}
  .sec-title{font-size:17px;font-weight:700;}
  .pills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
  .pill{padding:5px 12px;border-radius:999px;font-size:12px;background:var(--panel);color:var(--muted);border:1px solid var(--line);cursor:pointer;white-space:nowrap;transition:.15s;}
  .pill:hover{color:var(--text);}
  .pill.active{background:var(--pill-act-bg);color:var(--pill-act-txt);border-color:var(--pill-act-bg);font-weight:600;}

  .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:12px;margin-bottom:20px;}
  .card{background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:hidden;cursor:pointer;transition:.16s;}
  .card:hover{background:var(--hover);transform:translateY(-2px);}
  .card img{width:100%;aspect-ratio:1/1;object-fit:cover;background:var(--thumb-bg);display:block;}
  .card-cov-ph{width:100%;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:#fff;}
  .card-body{padding:9px 10px;}
  .card-t{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .card-s{font-size:11px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

  .radio-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;margin-bottom:20px;}
  .radio-card{border-radius:16px;padding:16px;color:#fff;cursor:pointer;position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.15);transition:transform .16s,box-shadow .16s;display:flex;flex-direction:column;justify-content:space-between;min-height:112px;}
  .radio-card:hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(0,0,0,.25);}
  .radio-card.active{outline:2.5px solid #fff;box-shadow:0 0 0 4px rgba(56,189,248,.35);}
  .radio-ico{font-size:24px;margin-bottom:6px;}
  .radio-t{font-size:15px;font-weight:800;}
  .radio-d{font-size:11.5px;opacity:.88;margin-top:4px;line-height:1.35;}

  .ar-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(94px,1fr));gap:10px;margin-bottom:20px;}
  .ar-card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:10px 6px;text-align:center;cursor:pointer;transition:.15s;}
  .ar-card:hover{background:var(--hover);transform:translateY(-2px);}
  .ar-ava{width:48px;height:48px;border-radius:50%;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;overflow:hidden;}
  .ar-ava img{width:100%;height:100%;object-fit:cover;display:block;}

  .list-head{display:flex;align-items:center;gap:14px;padding:14px;border-radius:16px;background:var(--panel);border:1px solid var(--line);margin-bottom:12px;flex-wrap:wrap;}
  .list-cov{width:76px;height:76px;border-radius:12px;object-fit:cover;background:var(--thumb-bg);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:var(--acc);}

  .s-row{display:grid;grid-template-columns:28px 40px 1fr 44px 112px;align-items:center;gap:10px;padding:7px 10px;border-radius:10px;cursor:pointer;transition:background .12s;}
  .s-row:hover{background:var(--hover);}
  .s-row.active{background:var(--acc-soft);}
  .s-num{font-size:12px;color:var(--muted);text-align:center;}
  .s-row.active .s-num{color:var(--acc);font-weight:700;}
  .s-cov{width:38px;height:38px;border-radius:7px;object-fit:cover;background:var(--thumb-bg);}
  .s-main{min-width:0;}
  .s-t{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .s-row.active .s-t{color:var(--acc);}
  .s-a{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
  .s-d{font-size:11px;color:var(--muted);text-align:right;}
  .s-acts{display:flex;align-items:center;justify-content:flex-end;gap:1px;}

  .ico-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px;padding:4px 5px;border-radius:6px;line-height:1;}
  .ico-btn:hover{color:var(--text);background:var(--hover);}
  .ico-btn.loved{color:var(--pink);}

  .stage-top-card{display:flex;align-items:center;gap:14px;margin-bottom:12px;flex-shrink:0;}
  .stage-cov{width:98px;height:98px;border-radius:16px;object-fit:cover;background:var(--thumb-bg);box-shadow:0 12px 30px rgba(0,0,0,.28);flex-shrink:0;}
  .stage-meta{min-width:0;flex:1;}
  .stage-title{font-size:19px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .stage-artist{font-size:13px;color:var(--muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .src-bar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;padding:8px 10px;background:var(--panel);border:1px solid var(--line);border-radius:12px;flex-shrink:0;align-items:center;}
  .src-item{font-size:11px;padding:4px 9px;border-radius:999px;border:1px solid var(--line);background:var(--input-bg);color:var(--muted);cursor:pointer;}
  .src-item:hover{color:var(--text);}
  .src-item.ok{color:var(--ok);border-color:rgba(52,211,153,.38);}
  .src-item.cur{background:var(--acc);color:var(--acc-text);border-color:var(--acc);font-weight:700;}
  .src-item.warn{color:var(--warn);border-color:rgba(251,191,36,.38);}

  .lrc-scroll{position:relative;flex:1;min-height:0;overflow-y:auto;padding:12vh 4px;-webkit-mask-image:linear-gradient(transparent,black 12%,black 88%,transparent);mask-image:linear-gradient(transparent,black 12%,black 88%,transparent);}
  .lrc-row{padding:8px 10px;font-size:15px;font-weight:600;color:var(--lrc-dim);cursor:pointer;border-radius:8px;transition:.2s;line-height:1.48;}
  .lrc-row:hover{color:var(--lrc-hover);}
  .lrc-row.cur{color:var(--lrc-cur);font-size:19px;font-weight:700;}
  .lrc-row small{display:block;font-size:12px;font-weight:400;margin-top:2px;opacity:.78;}

  .stage-ctrls{display:none;flex-direction:column;gap:8px;padding:10px 12px;margin-top:8px;background:var(--panel);border:1px solid var(--line);border-radius:14px;flex-shrink:0;}
  .stage-ctrls-row{display:flex;align-items:center;justify-content:space-around;gap:10px;}

  .dock{position:relative;min-height:76px;flex-shrink:0;background:var(--dock);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid var(--line);padding:8px 18px calc(8px + env(safe-area-inset-bottom));display:grid;grid-template-columns:1fr 1.6fr 1fr;align-items:center;gap:14px;z-index:30;}
  .dock-mini-bar{position:absolute;top:0;left:0;right:0;height:2px;background:rgba(128,128,128,.16);overflow:hidden;display:none;}
  .dock-mini-fill{height:100%;width:0%;background:var(--acc);transition:width .2s linear;}
  .dock-l{display:flex;align-items:center;gap:10px;min-width:0;cursor:pointer;}
  .dock-cov{width:44px;height:44px;border-radius:9px;object-fit:cover;background:var(--thumb-bg);flex-shrink:0;}
  .dock-m{display:flex;flex-direction:column;align-items:center;gap:4px;}
  .ctrls{display:flex;align-items:center;gap:14px;}
  .play-fab{width:34px;height:34px;border-radius:50%;background:var(--fab-bg);color:var(--fab-txt);border:none;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .prog{width:100%;max-width:460px;display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted);}
  .prog input{flex:1;height:4px;accent-color:var(--acc);cursor:pointer;}
  .dock-r{display:flex;align-items:center;justify-content:flex-end;gap:6px;}
  .vol{width:76px;height:4px;accent-color:var(--acc);cursor:pointer;}

  .auth-wrap{max-width:360px;margin:12vh auto;background:var(--panel);border:1px solid var(--line);padding:24px;border-radius:16px;text-align:center;}
  .auth-wrap input{width:100%;background:var(--input-bg);border:1px solid var(--line);color:var(--text);padding:10px;border-radius:10px;margin:12px 0;outline:none;}

  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.58);backdrop-filter:blur(4px);z-index:80;display:none;align-items:center;justify-content:center;padding:16px;}
  .modal-bg.open{display:flex;}
  .modal{background:var(--modal-bg);color:var(--text);border:1px solid var(--line);border-radius:18px;padding:20px;width:100%;max-width:480px;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.35);}
  .modal h3{font-size:16px;margin-bottom:12px;}
  .modal input, .modal textarea{width:100%;background:var(--input-bg);border:1px solid var(--line);color:var(--text);padding:9px 11px;border-radius:10px;font-size:13px;outline:none;margin-bottom:10px;font-family:inherit;}
  .modal textarea{resize:vertical;line-height:1.5;font-family:monospace;font-size:12px;}
  .modal-row{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:8px;}
  .pick-item{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--panel);margin-bottom:8px;cursor:pointer;}
  .pick-item:hover{background:var(--hover);border-color:var(--acc);}

  /* 可隐藏实时调试浮窗 */
  .dbg-panel{position:fixed;right:16px;bottom:88px;width:min(620px,calc(100vw - 24px));height:min(540px,70vh);background:var(--modal-bg);border:1px solid var(--line);border-radius:16px;box-shadow:0 20px 54px rgba(0,0,0,.45);z-index:75;display:none;flex-direction:column;overflow:hidden;}
  .dbg-panel.open{display:flex;}
  .dbg-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;border-bottom:1px solid var(--line);background:var(--panel);flex-wrap:wrap;}
  .dbg-tabs{display:flex;gap:6px;padding:8px 14px;border-bottom:1px solid var(--line);align-items:center;flex-wrap:wrap;}
  .dbg-tab{padding:4px 10px;border-radius:999px;font-size:12px;background:var(--input-bg);color:var(--muted);border:1px solid var(--line);cursor:pointer;}
  .dbg-tab.active{background:var(--acc);color:var(--acc-text);border-color:var(--acc);font-weight:700;}
  .dbg-body{flex:1;min-height:0;overflow-y:auto;padding:10px 14px;font-size:12px;line-height:1.5;}
  .dbg-summary{padding:8px 10px;border-radius:10px;background:var(--panel);border:1px solid var(--line);margin-bottom:8px;font-size:11.5px;color:var(--muted);word-break:break-all;}
  .dbg-item{padding:7px 10px;border-radius:9px;border:1px solid var(--line);margin-bottom:6px;background:var(--panel);word-break:break-all;}
  .dbg-item.ok{border-color:rgba(52,211,153,.35);}
  .dbg-item.err{border-color:rgba(244,63,94,.42);}
  .dbg-item.warn{border-color:rgba(251,191,36,.42);}
  .dbg-tag{display:inline-block;padding:1px 6px;border-radius:5px;font-size:10.5px;font-weight:700;margin-right:6px;background:var(--input-bg);color:var(--text);}
  .dbg-item.ok .dbg-tag{background:rgba(52,211,153,.18);color:var(--ok);}
  .dbg-item.err .dbg-tag{background:rgba(244,63,94,.18);color:var(--pink);}
  .dbg-item.warn .dbg-tag{background:rgba(251,191,36,.18);color:var(--warn);}
  .dbg-path{font-family:monospace;font-size:11px;color:var(--muted);margin-top:3px;white-space:pre-wrap;}

  .toast{position:fixed;top:calc(68px + env(safe-area-inset-top));left:50%;transform:translateX(-50%) translateY(-10px);background:var(--modal-bg);color:var(--text);border:1px solid var(--line);padding:9px 16px;border-radius:999px;font-size:12.5px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.25);z-index:100;opacity:0;pointer-events:none;transition:.2s;max-width:90vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

  .m-only{display:none;}
  @media(max-width:860px){
    .workspace{grid-template-columns:1fr;}
    .left-pane{padding:12px 12px 24px;}
    .left-pane.hide-m{display:none;}
    .right-stage{display:none;padding:14px 14px 12px;}
    .right-stage.show-m{display:flex;}
    .stage-ctrls{display:flex;}
    .m-only{display:inline-flex;}
    .dock{grid-template-columns:1fr auto;padding:8px 12px calc(10px + env(safe-area-inset-bottom));min-height:calc(66px + env(safe-area-inset-bottom));}
    .dock-mini-bar{display:block;}
    .dock-m,.vol,.hide-m{display:none !important;}
    .topbar{height:auto;flex-wrap:wrap;padding:calc(10px + env(safe-area-inset-top)) 12px 8px;gap:8px;}
    .brand{order:1;margin-right:auto;}
    #dbgBtn{order:2;}
    #themeBtn{order:3;}
    #adminNavBtn{order:4;}
    .search-wrap{order:5;flex:1 1 100%;max-width:none;margin-left:0;}
    .nav-pills{order:6;width:100%;padding-top:2px;}
    .s-row{grid-template-columns:24px 36px 1fr 100px;}
    .s-d{display:none;}
    .dbg-panel{right:8px;left:8px;width:auto;bottom:calc(74px + env(safe-area-inset-bottom));height:64vh;}
  }
</style>
</head>
<body>
<div class="app-shell">
  <header class="topbar">
    <div class="brand" onclick="nav('discover')"><span class="dot"></span>Music Hub</div>
    <div class="nav-pills">
      <button class="npill active" id="n-discover" onclick="nav('discover')">发现</button>
      <button class="npill" id="n-radio" onclick="nav('radio')">电台</button>
      <button class="npill" id="n-albums" onclick="nav('albums')">专辑</button>
      <button class="npill" id="n-artists" onclick="nav('artists')">歌手</button>
      <button class="npill" id="n-queue" onclick="nav('queue')">队列</button>
      <button class="npill" id="n-fav" onclick="nav('fav')">喜欢</button>
      <button class="npill" id="n-sheets" onclick="nav('sheets')">歌单</button>
      <button class="npill m-only" onclick="toggleMobileStage(true)">歌词/源</button>
    </div>
    <div class="search-wrap">
      <input id="qInput" placeholder="搜歌名 / 歌手 / 专辑..." />
      <button class="btn" onclick="doSearch(1)">搜索</button>
    </div>
    <button class="btn ghost sm" id="dbgBtn" style="display:none;" onclick="toggleDebugWin()" title="音源与订阅调试 (Alt+D)">🐛 调试</button>
    <button class="btn ghost sm hide-m" id="dlDirBtn" onclick="openDlSettings()" title="设置默认下载目录">📁</button>
    <button class="btn ghost sm" id="themeBtn" onclick="toggleTheme()" title="切换深浅主题">☀️</button>
    <button class="btn ghost sm hide-m" id="timerBtn" onclick="openTimer()">定时</button>
    <button class="btn ghost sm" id="adminNavBtn" onclick="location.href='/admin'">后台</button>
  </header>

  <div class="workspace">
    <section class="left-pane" id="leftPane"></section>
    <aside class="right-stage" id="rightStage">
      <div class="stage-blur" id="stageBlur"></div>
      <div class="stage-mask"></div>
      <div class="stage-inner">
        <div class="stage-top-card">
          <img id="sCov" class="stage-cov" referrerpolicy="no-referrer" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23161e2e' width='100' height='100'/%3E%3C/svg%3E" />
          <div class="stage-meta">
            <div class="stage-title" id="sTitle">Music Hub 极速单页</div>
            <div class="stage-artist" id="sArtist">点击左侧歌曲，本地网络直连多源秒播</div>
            <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
              <button class="src-item" onclick="toggleCurFav()" id="sFavBtn">&#9825; 收藏</button>
              <button class="src-item" onclick="addCurToSheet()">+ 歌单</button>
              <button class="src-item" onclick="downloadCur()">⬇ 下载</button>
              <button class="src-item" id="sDislikeBtn" style="display:none;" onclick="dislikeCur()">👎 不喜欢</button>
              <button class="src-item m-only" onclick="toggleMobileStage(false)">返回列表</button>
            </div>
          </div>
        </div>
        <div class="src-bar" id="srcBar"><span style="font-size:11px;color:var(--muted);">可用音源将在此处实时显示，可随时点击切换</span></div>
        <div class="lrc-scroll" id="lrcBox"><div class="lrc-row">点击歌曲后，歌词将在此处同步滚动</div></div>
        <div class="stage-ctrls">
          <div class="prog" style="max-width:none;"><span id="mCurT">0:00</span><input type="range" id="mSeek" min="0" max="100" value="0" oninput="seekPct(this.value)" /><span id="mDurT">0:00</span></div>
          <div class="stage-ctrls-row">
            <button class="ico-btn" id="modeBtnM" onclick="toggleMode()">顺序</button>
            <button class="ico-btn" style="font-size:18px;" onclick="prevSong()">&#9198;</button>
            <button class="play-fab" style="width:40px;height:40px;font-size:15px;" id="playFabS" onclick="togglePlay()">&#9654;</button>
            <button class="ico-btn" style="font-size:18px;" onclick="nextSong()">&#9197;</button>
            <button class="ico-btn" onclick="openTimer()" title="定时关闭">⏰</button>
          </div>
        </div>
      </div>
    </aside>
  </div>

  <footer class="dock">
    <div class="dock-mini-bar"><div class="dock-mini-fill" id="dockMiniFill"></div></div>
    <div class="dock-l" onclick="toggleMobileStage(true)">
      <img id="dCov" class="dock-cov" referrerpolicy="no-referrer" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23161e2e' width='100' height='100'/%3E%3C/svg%3E" />
      <div class="s-main"><div class="s-t" id="dTitle">未播放</div><div class="s-a" id="dArtist">点击选歌</div></div>
    </div>
    <div class="dock-m">
      <div class="ctrls">
        <button class="ico-btn" id="modeBtn" onclick="toggleMode()" title="切换循环模式">顺序</button>
        <button class="ico-btn" onclick="prevSong()" title="上一首">&#9198;</button>
        <button class="play-fab" id="playFab" onclick="togglePlay()" title="播放/暂停">&#9654;</button>
        <button class="ico-btn" onclick="nextSong()" title="下一首">&#9197;</button>
      </div>
      <div class="prog"><span id="curT">0:00</span><input type="range" id="seek" min="0" max="100" value="0" oninput="seekPct(this.value)" /><span id="durT">0:00</span></div>
    </div>
    <div class="dock-r">
      <button class="ico-btn hide-m" id="muteBtn" onclick="toggleMute()" title="静音(M)">🔊</button>
      <input class="vol" id="volRange" type="range" min="0" max="1" step="0.02" value="0.9" oninput="setVolume(this.value)" />
      <button class="ico-btn m-only" onclick="prevSong()" title="上一首">&#9198;</button>
      <button class="play-fab m-only" id="playFabM" onclick="togglePlay()">&#9654;</button>
      <button class="ico-btn m-only" onclick="nextSong()" title="下一首">&#9197;</button>
    </div>
  </footer>
</div>

<div class="dbg-panel" id="dbgPanel">
  <div class="dbg-head">
    <b style="font-size:13px;">🐛 实时音源 & 订阅调试台</b>
    <div style="display:flex;gap:6px;flex-wrap:wrap;">
      <button class="btn ghost sm" onclick="copyDebugLogs()">复制报告</button>
      <button class="btn ghost sm" onclick="clearDebugLogs()">清空</button>
      <button class="btn ghost sm" onclick="hideDebugEntry()" title="从顶部栏隐藏（Alt+D 可随时呼出）">隐藏入口</button>
      <button class="btn ghost sm" onclick="toggleDebugWin(false)">关闭</button>
    </div>
  </div>
  <div class="dbg-tabs">
    <button class="dbg-tab active" id="dbgTabPlay" onclick="switchDebugTab('play')">播放源链路</button>
    <button class="dbg-tab" id="dbgTabApi" onclick="switchDebugTab('api')">接口与订阅源</button>
    <button class="btn sm" style="margin-left:auto;" onclick="runSubSelfCheck()">体检云端/订阅源</button>
  </div>
  <div class="dbg-body" id="dbgBody"></div>
</div>

<div class="modal-bg" id="modalBg" onclick="if(event.target===this)closeModal()"><div class="modal" id="modalBody"></div></div>
<div class="toast" id="toast"></div>
<audio id="audio" preload="auto"></audio>

<script>
var TOKEN = new URLSearchParams(location.search).get("token") || localStorage.getItem("mh_token") || "";
if (new URLSearchParams(location.search).get("token")) localStorage.setItem("mh_token", TOKEN);

var urlDbgFlag = new URLSearchParams(location.search).get("debug") === "1";
var serverDebugEnabled = false, dbgWinOpen = false, dbgCurTab = "play";
var dbgPlayHeader = "", dbgPlayLogs = [], dbgApiLogs = [];

var chartsCache = [], artistsCache = [], albumsCache = [], searchedArtists = [], radioStations = [], recSheets = [];
var artistCat = "全部", chartCat = "全部", albumQuery = "华语经典", artistSearchKw = "";
var viewSongs = [], playQueue = [], curIdx = -1, curSong = null, lrcRows = [], timerId = null, stopAfterCurrent = false;
var playMode = localStorage.getItem("mh_mode") || "loop";
var candidates = [], curCandIdx = -1, playSeq = 0, autoWaitMeta = false, cloudDone = false, cloudStarted = false;
var curTabName = "discover", backTarget = "discover", lastSharedData = null;
var cloudSkips = [], cloudRetries = 0, allCloudSeq = 0;
var userLrcScrollUntil = 0, toastTimer = null, radioMode = "", radioFetching = false, recLoading = false;
var pageState = { type: "", query: "", page: 1, hasMore: false, artistAlbums: [], artistSongs: [], artistTab: "songs", artistName: "", artistTag: "" };

var audio = document.getElementById("audio");
var savedVol = Number(localStorage.getItem("mh_vol"));
if (isNaN(savedVol) || savedVol < 0 || savedVol > 1) savedVol = 0.9;
audio.volume = savedVol;
document.getElementById("volRange").value = savedVol;
function syncModeBtns() {
  var txt = playMode === "one" ? "单曲" : playMode === "shuffle" ? "随机" : "顺序";
  var b1 = document.getElementById("modeBtn"), b2 = document.getElementById("modeBtnM");
  if (b1) b1.textContent = txt;
  if (b2) b2.textContent = txt;
}
syncModeBtns();

var favs = JSON.parse(localStorage.getItem("mh_favs") || "[]");
var mySheets = JSON.parse(localStorage.getItem("mh_playlists_v1") || "[]");
var playHistory = JSON.parse(localStorage.getItem("mh_history_v1") || "[]");
var dislikes = JSON.parse(localStorage.getItem("mh_dislikes_v1") || "[]");

var DEFAULT_COV = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23161e2e' width='100' height='100'/%3E%3C/svg%3E";
var GRADS = ["linear-gradient(135deg,#0284c7,#6366f1)","linear-gradient(135deg,#db2777,#f43f5e)","linear-gradient(135deg,#059669,#10b981)","linear-gradient(135deg,#d97706,#f59e0b)","linear-gradient(135deg,#7c3aed,#a855f7)"];
var AR_CATS = ["全部", "经典怀旧", "华语男", "华语女", "乐队组合", "日韩", "ACG", "欧美"];
var ALB_CATS = ["华语经典", "粤语经典", "周杰伦", "张学友", "陈奕迅", "日本动漫", "欧美流行"];
var DEFAULT_RADIOS = [
  { id: "personal", title: "私人漫游 FM", desc: "根据你的红心喜欢与歌单实时推荐相似歌曲", icon: "✨", grad: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
  { id: "quiet", title: "深夜安静 · 纯音乐", desc: "钢琴、轻音乐、助眠氛围声景", icon: "🌙", grad: "linear-gradient(135deg,#1e293b,#475569)" },
  { id: "lofi", title: "专注学习 · Lo-Fi", desc: "低保真节拍与轻爵士，看书工作伴侣", icon: "☕", grad: "linear-gradient(135deg,#0f766e,#10b981)" },
  { id: "rain", title: "雨夜治愈 · 慢情歌", desc: "民谣与温柔叙事人声", icon: "🌧️", grad: "linear-gradient(135deg,#4f46e5,#7c3aed)" },
  { id: "classic", title: "时光随身听 · 怀旧", desc: "80/90年代华语与粤语时代金曲", icon: "📻", grad: "linear-gradient(135deg,#b45309,#f59e0b)" },
  { id: "cantonese", title: "港乐深夜档 · 粤语", desc: "陈奕迅、张学友、张国荣、Beyond", icon: "🌃", grad: "linear-gradient(135deg,#be185d,#f43f5e)" },
  { id: "acg", title: "二次元 · 游戏原声", desc: "ACG 主题曲与塞壬唱片官方无损库", icon: "🎧", grad: "linear-gradient(135deg,#2563eb,#06b6d4)" },
  { id: "drive", title: "公路驾驶 · 燃曲电音", desc: "摇滚、节奏电音，提神醒脑", icon: "🚗", grad: "linear-gradient(135deg,#dc2626,#f97316)" }
];
var JUNK_W = ["dj版", "dj舞曲", "伴奏", "喊麦", "铃声", "广场舞", "卡拉ok", "消音版", "片段", "高潮版", "0.8x", "1.2x", "翻唱", "cover", "吉他版", "钢琴版", "弹唱", "翻奏"];
var HARD_ARTIST_W = ["周杰伦", "jay chou", "林俊杰", "陈奕迅", "邓紫棋", "薛之谦", "陶喆", "王力宏"];
var HARD_TRACK_W = ["七里香", "一路向北", "晴天", "稻香", "夜曲", "以父之名", "青花瓷", "江南", "修炼爱情", "十年", "富士山下", "k歌之王"];

// -------- 调试窗口引擎 --------
function isDebugActive() { return Boolean(serverDebugEnabled || urlDbgFlag || dbgWinOpen); }
function syncDbgBtn() {
  var btn = document.getElementById("dbgBtn"); if (!btn) return;
  var hiddenLocally = sessionStorage.getItem("mh_dbg_hidden") === "1";
  btn.style.display = ((serverDebugEnabled && !hiddenLocally) || urlDbgFlag || dbgWinOpen) ? "inline-flex" : "none";
}
function sanitizeDbgText(str) {
  return String(str || "").replace(/([?&](?:token|stoken|atoken)=)[^&\s]+/gi, "$1***");
}
function dbgTime() {
  var d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");
}
function dbgLogPlay(level, tag, msg, detail) {
  dbgPlayLogs.push({ t: dbgTime(), level: level || "info", tag: tag, msg: sanitizeDbgText(msg), detail: sanitizeDbgText(detail || "") });
  if (dbgPlayLogs.length > 150) dbgPlayLogs.shift();
  if (dbgWinOpen && dbgCurTab === "play") renderDebugBody();
}
function dbgLogApi(level, tag, msg, detail) {
  dbgApiLogs.unshift({ t: dbgTime(), level: level || "info", tag: tag, msg: sanitizeDbgText(msg), detail: sanitizeDbgText(detail || "") });
  if (dbgApiLogs.length > 80) dbgApiLogs.pop();
  if (dbgWinOpen && dbgCurTab === "api") renderDebugBody();
}
function toggleDebugWin(forceState) {
  dbgWinOpen = (typeof forceState === "boolean") ? forceState : !dbgWinOpen;
  if (dbgWinOpen) sessionStorage.removeItem("mh_dbg_hidden");
  document.getElementById("dbgPanel").classList.toggle("open", dbgWinOpen);
  syncDbgBtn();
  if (dbgWinOpen) renderDebugBody();
}
function hideDebugEntry() {
  sessionStorage.setItem("mh_dbg_hidden", "1");
  toggleDebugWin(false);
  toast("已隐藏顶部调试入口（按 Alt+D 可随时重新打开）");
}
function switchDebugTab(tab) {
  dbgCurTab = tab;
  document.getElementById("dbgTabPlay").classList.toggle("active", tab === "play");
  document.getElementById("dbgTabApi").classList.toggle("active", tab === "api");
  renderDebugBody();
}
function clearDebugLogs() {
  if (dbgCurTab === "play") dbgPlayLogs = [];
  else dbgApiLogs = [];
  renderDebugBody();
}
function renderDebugBody() {
  var box = document.getElementById("dbgBody"); if (!box) return;
  if (dbgCurTab === "play") {
    var h = dbgPlayHeader ? ('<div class="dbg-summary">' + esc(dbgPlayHeader) + '</div>') : '';
    if (!dbgPlayLogs.length) { box.innerHTML = h + '<div style="padding:20px;text-align:center;color:var(--muted);">点击播放一首歌，此处将实时显示本地直连与云端各源请求路径和报错原因</div>'; return; }
    for (var i = 0; i < dbgPlayLogs.length; i++) {
      var r = dbgPlayLogs[i], cls = r.level === "ok" ? "ok" : (r.level === "err" ? "err" : (r.level === "warn" ? "warn" : ""));
      h += '<div class="dbg-item ' + cls + '"><div><span class="dbg-tag">' + esc(r.tag) + '</span><b>' + esc(r.msg) + '</b> <small style="color:var(--muted);">' + r.t + '</small></div>' + (r.detail ? '<div class="dbg-path">' + esc(r.detail) + '</div>' : '') + '</div>';
    }
    box.innerHTML = h;
    box.scrollTop = box.scrollHeight;
  } else {
    if (!dbgApiLogs.length) { box.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted);">打开歌手/搜索页面或点击右上角「体检云端/订阅源」，日志将显示在这里</div>'; return; }
    var ah = "";
    for (var j = 0; j < dbgApiLogs.length; j++) {
      var a = dbgApiLogs[j], acls = a.level === "ok" ? "ok" : (a.level === "err" ? "err" : (a.level === "warn" ? "warn" : ""));
      ah += '<div class="dbg-item ' + acls + '"><div><span class="dbg-tag">' + esc(a.tag) + '</span><b>' + esc(a.msg) + '</b> <small style="color:var(--muted);">' + a.t + '</small></div>' + (a.detail ? '<div class="dbg-path">' + esc(a.detail) + '</div>' : '') + '</div>';
    }
    box.innerHTML = ah;
  }
}
function copyDebugLogs() {
  var list = dbgCurTab === "play" ? dbgPlayLogs : dbgApiLogs;
  var txt = (dbgCurTab === "play" && dbgPlayHeader ? dbgPlayHeader + "\\n\\n" : "") + list.map(function(x) {
    return "[" + x.t + "][" + x.tag + "][" + x.level + "] " + x.msg + (x.detail ? "\\n  " + x.detail : "");
  }).join("\\n");
  if (!txt.trim()) return toast("当前调试面板为空");
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function() { toast("已复制脱敏调试报告"); }).catch(function() { toast("复制失败"); });
}
async function runSubSelfCheck() {
  switchDebugTab("api");
  dbgLogApi("info", "体检", "开始体检云端音源与 MusicFree 订阅源...", "");
  var t0 = Date.now();
  try {
    var d = await api("/api/diag");
    var lines = (d.report || []).map(function(r) {
      return (r.ok ? "✓ " : "✗ ") + r.name + " (" + r.ms + "ms) -> " + (r.ok ? r.source : r.error) + (r.trace ? " [" + r.trace.join(", ") + "]" : "");
    }).join("\\n");
    var okCnt = (d.report || []).filter(function(r) { return r.ok; }).length;
    dbgLogApi(okCnt ? "ok" : "err", "/api/diag", "云端音源体检完成：" + okCnt + "/" + (d.report || []).length + " 连通 (" + (Date.now() - t0) + "ms)", lines);
  } catch (e) {
    dbgLogApi("err", "/api/diag", "请求失败: " + (e.message || e), "");
  }
  try {
    var mfUrl = "/musicfree.json" + (TOKEN ? "?token=" + encodeURIComponent(TOKEN) : "");
    var mf = await fetch(mfUrl).then(function(r) { return r.json(); });
    var plugs = mf.plugins || [];
    var pLines = [];
    for (var i = 0; i < plugs.length; i++) {
      var p = plugs[i], pt = Date.now();
      if (p.url.indexOf(location.origin) === 0) {
        try {
          var pr = await fetch(p.url);
          pLines.push((pr.ok ? "✓ " : "✗ ") + p.name + " v" + p.version + " -> HTTP " + pr.status + " (" + (Date.now() - pt) + "ms) " + sanitizeDbgText(p.url));
        } catch (err) {
          pLines.push("✗ " + p.name + " -> " + (err.message || err));
        }
      } else {
        pLines.push("- [外部插件] " + p.name + " v" + p.version + " -> " + p.url);
      }
    }
    dbgLogApi("ok", "订阅源", "musicfree.json 共下发 " + plugs.length + " 个插件", pLines.join("\\n"));
  } catch (e2) {
    dbgLogApi("err", "订阅源", "musicfree.json 检查失败: " + (e2.message || e2), "");
  }
}

function isStrictSongLocal(s) {
  var a = String(s && s.artist || "").toLowerCase(), t = String(s && s.title || "").toLowerCase();
  return HARD_ARTIST_W.some(function(x){ return a.indexOf(x.toLowerCase()) >= 0; }) || HARD_TRACK_W.some(function(x){ return t.indexOf(x.toLowerCase()) >= 0; });
}
function badVariantLocal(name, artist, album) {
  return /(纯音乐|纯钢琴|instrumental|钢琴曲|钢琴演奏|演奏版|器乐版|背景音乐|轻音乐|伴奏版|卡拉.?ok|翻唱|cover|吉他版|弹唱|翻奏|dj版)/i.test([name, artist, album].join(" "));
}
function artistMatchesLocal(candidate, expected) {
  var c = normStrLocal(Array.isArray(candidate) ? candidate.join(" ") : candidate), e = normStrLocal(String(expected || "").split(/[/,、]|\\s+&\\s+/)[0]);
  if (!e) return true;
  if (!c) return false;
  if (c.indexOf(e) >= 0 || e.indexOf(c) >= 0) return true;
  var groups = [["周杰伦","jay chou","周董"],["林俊杰","jj lin","jj"],["陈奕迅","eason chan"],["邓紫棋","g.e.m.","gem"],["薛之谦","joker xue"],["陶喆","david tao"],["王力宏","wang leehom","leehom wang"],["张国荣","leslie cheung"],["张学友","jacky cheung"],["王菲","faye wong"]];
  return groups.some(function(g){ return g.some(function(a){return e.indexOf(normStrLocal(a))>=0;}) && g.some(function(a){return c.indexOf(normStrLocal(a))>=0;}); });
}
var SOFT_W = ["live", "现场", "演唱会", "翻唱", "cover", "吉他版", "钢琴版", "纯享", "加速", "降调"];

function esc(s) { return String(s || "").replace(/[&<>"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function fmt(s) { var m = Math.floor(s / 60), r = Math.floor(s % 60); return m + ":" + (r < 10 ? "0" : "") + r; }
function thumb(u, sz) {
  if (!u) return DEFAULT_COV;
  if (u.indexOf("http://") === 0 && u.indexOf("music.126.net") >= 0) u = "https://" + u.slice(7);
  if (u.indexOf("music.126.net") >= 0 && u.indexOf("?") < 0) return u + "?param=" + (sz || 220) + "y" + (sz || 220);
  return u;
}
var TRAD_SIMP_S = "啞哑謙谦傑杰倫伦陳陈張张劉刘楊杨趙赵黃黄吳吴鄭郑孫孙馬马羅罗葉叶蘇苏蔣蒋韓韩馮冯鄧邓蕭萧謝谢許许盧卢韋韦莊庄嚴严鍾钟麥麦歐欧陽阳溫温藍蓝齊齐學学榮荣麗丽龍龙遙遥輝辉闊阔問问戀恋蘭兰煉炼單单愛爱說说聽听後后來来這这為为們们無无樂乐夢梦風风飛飞開开關关門门長长時时見见還还過过對对錯错點点線线書书寫写語语話话詞词調调聲声響响誰谁麼么裡里邊边頭头臉脸淚泪傷伤獨独演員员國国華华東东萬万億亿雙双與与給给讓让願愿會会該该經经總总結结終终離离別别記记憶忆懷怀變变動动靜静歡欢難难實实虛虚輕轻遠远舊旧歲岁晝昼顏颜紅红綠绿銀银鐵铁銅铜鋼钢網网雲云電电";
function toSimpLocal(s) {
  var m = {}, i;
  for (i = 0; i + 1 < TRAD_SIMP_S.length; i += 2) m[TRAD_SIMP_S.charAt(i)] = TRAD_SIMP_S.charAt(i + 1);
  var out = "", str = String(s || "");
  for (i = 0; i < str.length; i++) { var c = str.charAt(i); out += m[c] || c; }
  return out;
}
function normStrLocal(s) {
  return toSimpLocal(s).toLowerCase().split("(")[0].split("（")[0].split("[")[0].split("【")[0].replace(/\\s+/g, " ").trim();
}
function scoreMatchLocal(cName, cArtist, oTitle, oArtist, cDur, oDur, cAlbum, strict) {
  var raw = String(cName || "").toLowerCase(), ro = String(oTitle || "").toLowerCase();
  if (!raw || badVariantLocal(cName, cArtist, cAlbum)) return -999;
  for (var i = 0; i < JUNK_W.length; i++) if (raw.indexOf(JUNK_W[i]) >= 0 && ro.indexOf(JUNK_W[i]) < 0) return -999;
  var d = Number(cDur || 0), od = Number(oDur || 0);
  if (od >= 90 && d > 0 && (d <= 65 || d < od * 0.72)) return -999;
  if (strict && oArtist && !artistMatchesLocal(cArtist, oArtist)) return -999;
  var sc = 0, t = normStrLocal(cName), ot = normStrLocal(oTitle);
  sc += (t === ot) ? 55 : ((t.indexOf(ot) >= 0 || ot.indexOf(t) >= 0) ? 20 : -45);
  var oa = normStrLocal(String(oArtist || "").split(/[/,、]|\\s+&\\s+/)[0]), ca = normStrLocal(Array.isArray(cArtist) ? cArtist.join(" ") : cArtist);
  if (oa && oa !== "未知歌手") {
    if (ca && (ca.indexOf(oa) >= 0 || oa.indexOf(ca) >= 0)) sc += 65;
    else if (ca) sc -= 160;
    else sc -= 18;
  }
  for (var j = 0; j < SOFT_W.length; j++) if (raw.indexOf(SOFT_W[j]) >= 0 && ro.indexOf(SOFT_W[j]) < 0) sc -= 45;
  if (od > 30 && d > 0) {
    var diff = Math.abs(d - od);
    sc += (diff <= 5) ? 45 : (diff <= 15 ? 20 : (diff > 35 ? -40 : 0));
  }
  return sc;
}
function toast(msg, keepMs) {
  var el = document.getElementById("toast");
  el.textContent = msg; el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { el.classList.remove("show"); }, keepMs || 2600);
}
function openModal(html) { document.getElementById("modalBody").innerHTML = html; document.getElementById("modalBg").classList.add("open"); }
function closeModal() { document.getElementById("modalBg").classList.remove("open"); }

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
// -------- 下载管理器 --------
var hasFsApi = typeof window.showDirectoryPicker === "function";
var cachedDirHandle = null;
function openFsDb() {
  return new Promise(function(resolve, reject) {
    if (!window.indexedDB) return reject(new Error("no_idb"));
    var req = indexedDB.open("mh_fs_db", 1);
    req.onupgradeneeded = function() { req.result.createObjectStore("handles"); };
    req.onsuccess = function() { resolve(req.result); };
    req.onerror = function() { reject(req.error); };
  });
}
function getSavedDirHandle() {
  return openFsDb().then(function(db) {
    return new Promise(function(resolve) {
      var tx = db.transaction("handles", "readonly").objectStore("handles").get("dl_dir");
      tx.onsuccess = function() { resolve(tx.result || null); };
      tx.onerror = function() { resolve(null); };
    });
  }).catch(function() { return null; });
}
function saveDirHandle(h) {
  return openFsDb().then(function(db) {
    return new Promise(function(resolve) {
      var tx = db.transaction("handles", "readwrite");
      tx.objectStore("handles").put(h, "dl_dir");
      tx.oncomplete = function() { resolve(); };
      tx.onerror = function() { resolve(); };
    });
  }).catch(function(){});
}
function clearDirHandle() {
  cachedDirHandle = null; updateDlBtnLabel();
  return openFsDb().then(function(db) { db.transaction("handles", "readwrite").objectStore("handles").delete("dl_dir"); }).catch(function(){});
}
function updateDlBtnLabel() {
  var btn = document.getElementById("dlDirBtn"); if (!btn) return;
  if (cachedDirHandle && cachedDirHandle.name) { btn.textContent = "📁 " + cachedDirHandle.name.slice(0, 8); btn.title = "默认保存目录：" + cachedDirHandle.name; }
  else { btn.textContent = "📁"; btn.title = "设置默认下载文件夹"; }
}
if (hasFsApi) getSavedDirHandle().then(function(h) { cachedDirHandle = h; updateDlBtnLabel(); });

async function pickDownloadDir() {
  if (!hasFsApi) { toast("当前浏览器不支持固定文件夹，将走浏览器默认下载位置"); return null; }
  try {
    var h = await window.showDirectoryPicker({ mode: "readwrite" });
    cachedDirHandle = h; await saveDirHandle(h); updateDlBtnLabel();
    toast("已设置默认保存目录：" + h.name); return h;
  } catch (e) {
    if (e && e.name === "AbortError") toast("已取消选择保存目录"); else toast("无法访问目录：" + (e.message || e));
    return null;
  }
}
function openDlSettings() {
  var curName = (cachedDirHandle && cachedDirHandle.name) ? cachedDirHandle.name : "尚未设置（首次下载时自动询问）";
  openModal('<h3>下载保存位置设置</h3><p style="font-size:13px;color:var(--muted);margin-bottom:10px;">桌面版 Chrome / Edge 支持记住你选定的文件夹，后续点击下载会自动存入该位置。</p><div style="padding:10px 12px;border-radius:10px;background:var(--panel);border:1px solid var(--line);font-size:13px;margin-bottom:14px;">当前默认目录：<b>' + esc(curName) + '</b></div><div class="modal-row"><button class="btn danger" onclick="clearDirHandle();closeModal();toast(\\'已清除记忆目录\\')">清除记忆</button><button class="btn ghost" onclick="closeModal()">关闭</button><button class="btn" onclick="pickDownloadDir().then(function(h){if(h)closeModal();})">选择 / 更改文件夹</button></div>');
}
function cleanFileName(s) { return String(s || "music").replace(/[\\\\/:*?"<>|]/g, "_").replace(/\\s+/g, " ").trim().slice(0, 100); }
function extFromCt(ct) {
  var c = String(ct || "").toLowerCase();
  if (c.indexOf("flac") >= 0) return ".flac";
  if (c.indexOf("mp4") >= 0 || c.indexOf("aac") >= 0 || c.indexOf("m4a") >= 0) return ".m4a";
  if (c.indexOf("wav") >= 0) return ".wav";
  if (c.indexOf("ogg") >= 0 || c.indexOf("opus") >= 0) return ".ogg";
  return ".mp3";
}
function triggerBrowserDownload(url, fname) {
  var a = document.createElement("a"); a.href = url; a.download = fname || ""; a.style.display = "none";
  document.body.appendChild(a); a.click(); setTimeout(function() { document.body.removeChild(a); }, 1000);
}
async function resolveSongDownloadUrl(s) {
  if (curSong && curSong.norm_key === s.norm_key && curCandIdx >= 0 && candidates[curCandIdx] && !candidates[curCandIdx].isTrial) return candidates[curCandIdx].url;
  var qUrl = "/api/play?id=" + (s.id || 0) + "&q=high&ext_source=" + encodeURIComponent(s.ext_source || "") + "&ext_id=" + encodeURIComponent(s.ext_id || "") + "&title=" + encodeURIComponent(s.title || "") + "&artist=" + encodeURIComponent(s.artist || "") + "&album=" + encodeURIComponent(s.album || "") + "&cover=" + encodeURIComponent(s.cover || "") + "&duration=" + (s.duration || 0);
  var res = await api(qUrl);
  if (res.songId) s.id = res.songId;
  if (res.error || !res.url) throw new Error(res.error || "未找到可用完整音源");
  return res.needProxy ? res.proxyUrl : res.url;
}
async function downloadSong(s) {
  if (!s) return;
  var baseName = cleanFileName(s.title + " - " + s.artist), dirHandle = null;
  if (hasFsApi) {
    try {
      dirHandle = cachedDirHandle || await getSavedDirHandle();
      if (!dirHandle) { dirHandle = await window.showDirectoryPicker({ mode: "readwrite" }); cachedDirHandle = dirHandle; await saveDirHandle(dirHandle); updateDlBtnLabel(); }
      else {
        var perm = await dirHandle.queryPermission({ mode: "readwrite" });
        if (perm !== "granted") { perm = await dirHandle.requestPermission({ mode: "readwrite" }); if (perm !== "granted") { toast("目录写入权限未授予"); return; } }
      }
    } catch (e) { if (e && e.name === "AbortError") { toast("已取消下载"); return; } dirHandle = null; }
  }
  toast("正在解析下载地址：" + s.title, 5000);
  var audioUrl = "";
  try { audioUrl = await resolveSongDownloadUrl(s); } catch (err) { toast("下载失败：" + (err.message || "未获取到地址")); return; }
  var alreadyProxied = audioUrl.indexOf("/api/stream") === 0;
  var proxyDlUrl = alreadyProxied
    ? (audioUrl + (audioUrl.indexOf("dl=1") < 0 ? "&dl=1&fn=" + encodeURIComponent(baseName) : ""))
    : ("/api/stream?u=" + encodeURIComponent(audioUrl) + "&dl=1&fn=" + encodeURIComponent(baseName) + "&token=" + encodeURIComponent(TOKEN));
  if (!dirHandle) {
    triggerBrowserDownload(proxyDlUrl, baseName);
    toast("已交给浏览器下载：" + baseName); return;
  }
  try {
    toast("正在下载：" + baseName, 15000);
    var resp;
    if (alreadyProxied) {
      resp = await fetch(proxyDlUrl);
    } else {
      try { resp = await fetch(audioUrl); if (!resp.ok) throw new Error("direct_fail"); } catch (_) { resp = await fetch(proxyDlUrl); }
    }
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    var ext = extFromCt(resp.headers.get("content-type") || ""), finalName = baseName + ext, total = Number(resp.headers.get("content-length") || 0);
    var fileHandle = await dirHandle.getFileHandle(finalName, { create: true }), writable = await fileHandle.createWritable();
    if (resp.body && resp.body.getReader) {
      var reader = resp.body.getReader(), loaded = 0, lastToastAt = 0;
      while (true) {
        var chunk = await reader.read(); if (chunk.done) break;
        await writable.write(chunk.value); loaded += chunk.value.byteLength;
        var nowMs = Date.now();
        if (total > 0 && nowMs - lastToastAt > 300) {
          lastToastAt = nowMs;
          toast("下载中 " + Math.min(100, Math.round((loaded / total) * 100)) + "%：" + baseName, 10000);
        }
      }
      await writable.close();
    } else { await writable.write(await resp.blob()); await writable.close(); }
    toast("已保存到「" + dirHandle.name + "」：" + finalName, 3600);
  } catch (err) { toast("写入失败，转为浏览器下载"); triggerBrowserDownload(proxyDlUrl, baseName); }
}
function downloadViewIdx(i) { if (viewSongs[i]) downloadSong(viewSongs[i]); }
function downloadCur() { if (curSong) downloadSong(curSong); else toast("请先选择一首歌曲"); }

// -------- 网络请求与鉴权 --------
function api(path, opts) {
  opts = opts || {};
  var sep = path.indexOf("?") >= 0 ? "&" : "?";
  return fetch(path + sep + "token=" + encodeURIComponent(TOKEN), opts).then(function(r) {
    if (r.status === 401) { showAuth(); throw new Error("401"); }
    return r.json();
  });
}
function showAuth() {
  document.getElementById("leftPane").innerHTML = '<div class="auth-wrap"><h3>输入访问密钥</h3><input id="tkIn" type="password" placeholder="ACCESS_TOKEN" /><button class="btn" style="width:100%;" onclick="saveToken()">进入</button></div>';
  var tkIn = document.getElementById("tkIn"); if (tkIn) tkIn.addEventListener("keydown", function(e) { if (e.key === "Enter") saveToken(); });
}
function saveToken() {
  TOKEN = document.getElementById("tkIn").value.trim();
  localStorage.setItem("mh_token", TOKEN);
  localStorage.removeItem("mh_home_v3");
  chartsCache = []; artistsCache = []; radioStations = [];
  nav("discover");
}
function toggleMobileStage(show) { document.getElementById("leftPane").classList.toggle("hide-m", show); document.getElementById("rightStage").classList.toggle("show-m", show); }
function setNav(id) {
  curTabName = id; toggleMobileStage(false);
  ["discover", "radio", "albums", "artists", "queue", "fav", "sheets"].forEach(function(k) { var el = document.getElementById("n-" + k); if (el) el.classList.toggle("active", k === id); });
}

// -------- 个性化口味 & 猜你喜欢 --------
function buildTasteProfile() {
  var artistCount = {}, catCount = {}, ids = [], seenId = {};
  var allPool = favs.concat(playHistory);
  for (var p = 0; p < mySheets.length; p++) allPool = allPool.concat((mySheets[p].songs || []).slice(0, 20));
  for (var i = 0; i < allPool.length; i++) {
    var s = allPool[i]; if (!s) continue;
    var ar = String(s.artist || "").split(/[/,、]|\\s+&\\s+/)[0].trim();
    if (ar && ar !== "未知歌手") artistCount[ar] = (artistCount[ar] || 0) + 1;
    if (s.category && s.category !== "点播收藏" && s.category !== "网易精选") catCount[s.category] = (catCount[s.category] || 0) + 1;
    if (s.ext_source === "netease" && s.ext_id && !seenId[s.ext_id]) { seenId[s.ext_id] = 1; ids.push(s.ext_id); }
  }
  return {
    artists: Object.keys(artistCount).sort(function(a, b) { return artistCount[b] - artistCount[a]; }).slice(0, 8),
    cats: Object.keys(catCount).sort(function(a, b) { return catCount[b] - catCount[a]; }).slice(0, 3),
    ids: ids.slice(0, 12),
  };
}
function loadRecommendedSheetsIfNeeded() {
  if (recSheets.length || recLoading) return;
  var sess = sessionStorage.getItem("mh_rec_sheets_v1");
  if (sess) { try { var parsed = JSON.parse(sess); if (Array.isArray(parsed) && parsed.length) { recSheets = parsed; if (curTabName === "discover") renderDiscover(); return; } } catch {} }
  recLoading = true;
  var prof = buildTasteProfile();
  api("/api/radio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "personal", artists: prof.artists, cats: prof.cats, ids: prof.ids, exclude: dislikes, needSheets: true }) })
    .then(function(d) {
      recLoading = false;
      if (d && Array.isArray(d.sheets) && d.sheets.length) { recSheets = d.sheets; sessionStorage.setItem("mh_rec_sheets_v1", JSON.stringify(recSheets)); if (curTabName === "discover") renderDiscover(); }
    }).catch(function() { recLoading = false; });
}

// -------- 导航主入口 --------
function nav(tab) {
  setNav(tab);
  if (tab === "queue") { backTarget = "discover"; renderQueueView(); return; }
  if (tab === "fav") { backTarget = "discover"; renderSongList("我喜欢的音乐", "本地红心收藏 · " + favs.length + " 首", "", favs, false); return; }
  if (tab === "sheets") { renderSheetsHub(); return; }
  if (tab === "albums") { loadAlbumsPage(albumQuery); return; }
  if (tab === "radio") { renderRadioPage(); return; }
  if (chartsCache.length) { if (tab === "artists") renderArtists(); else renderDiscover(); return; }

  var cachedRaw = localStorage.getItem("mh_home_v3");
  if (cachedRaw) {
    try {
      var cached = JSON.parse(cachedRaw);
      if (cached && cached.charts && cached.charts.length) {
        chartsCache = cached.charts; artistsCache = cached.artists || []; radioStations = cached.radioStations || DEFAULT_RADIOS;
        serverDebugEnabled = Boolean(cached.playerDebug); syncDbgBtn();
        if (tab === "artists") renderArtists(); else renderDiscover();
      }
    } catch {}
  } else { document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">正在加载...</div>'; }

  api("/api/home").then(function(d) {
    chartsCache = d.charts || []; artistsCache = d.artists || []; radioStations = d.radioStations || DEFAULT_RADIOS;
    serverDebugEnabled = Boolean(d.playerDebug); syncDbgBtn();
    localStorage.setItem("mh_home_v3", JSON.stringify(d));
    if (curTabName === "artists") renderArtists(); else if (curTabName === "radio") renderRadioPage(); else if (curTabName === "discover") renderDiscover();
  }).catch(function(){});
}

function renderDiscover() {
  loadRecommendedSheetsIfNeeded();
  var stations = radioStations.length ? radioStations : DEFAULT_RADIOS;
  var h = '<div class="sec-head"><div class="sec-title">🎧 专属电台 · 一键开播</div><button class="btn ghost sm" onclick="nav(\\'radio\\')">全部电台</button></div><div class="radio-grid" style="margin-bottom:18px;">';
  for (var r = 0; r < Math.min(4, stations.length); r++) {
    var st = stations[r];
    h += '<div class="radio-card' + (radioMode === st.id ? " active" : "") + '" style="background:' + st.grad + '" onclick="startRadio(\\'' + st.id + '\\')"><div><div class="radio-ico">' + st.icon + '</div><div class="radio-t">' + esc(st.title) + '</div></div><div class="radio-d">' + esc(st.desc) + '</div></div>';
  }
  h += '</div>';
  if (recSheets.length) {
    h += '<div class="sec-head"><div class="sec-title">✨ 根据你的喜欢推荐歌单</div><button class="btn ghost sm" onclick="sessionStorage.removeItem(\\'mh_rec_sheets_v1\\');recSheets=[];loadRecommendedSheetsIfNeeded()">换一批</button></div><div class="cards-grid">';
    for (var rs = 0; rs < Math.min(8, recSheets.length); rs++) {
      var sh = recSheets[rs];
      h += '<div class="card" onclick="openRecSheet(' + rs + ')"><img loading="lazy" referrerpolicy="no-referrer" src="' + esc(thumb(sh.cover, 240)) + '" /><div class="card-body"><div class="card-t">' + esc(sh.title) + '</div><div class="card-s">' + esc(sh.artist || "为你推荐") + '</div></div></div>';
    }
    h += '</div>';
  }
  h += '<div class="sec-head"><div class="sec-title">热门歌手</div><button class="btn ghost sm" onclick="nav(\\'artists\\')">全部歌手</button></div><div class="ar-grid">';
  for (var a = 0; a < Math.min(12, artistsCache.length); a++) {
    var ar = artistsCache[a];
    h += '<div class="ar-card" onclick="openPresetArtist(' + a + ')"><div class="ar-ava" style="background:' + GRADS[a % GRADS.length] + '">' + esc(ar.name.slice(0, 1)) + '</div><div class="card-t">' + esc(ar.name) + '</div><div class="card-s">' + esc(ar.tag) + '</div></div>';
  }
  h += '</div>';
  var cCats = ["全部"];
  for (var j = 0; j < chartsCache.length; j++) { var cat = chartsCache[j].category || "其他"; if (cCats.indexOf(cat) < 0) cCats.push(cat); }
  window._cCats = cCats;
  h += '<div class="sec-head"><div class="sec-title">榜单与经典分类</div></div><div class="pills">';
  for (var k = 0; k < cCats.length; k++) h += '<button class="pill' + (chartCat === cCats[k] ? " active" : "") + '" onclick="chartCat=window._cCats[' + k + '];renderDiscover()">' + esc(cCats[k]) + '</button>';
  h += '</div><div class="cards-grid">';
  for (var i = 0; i < chartsCache.length; i++) {
    var c = chartsCache[i]; if (chartCat !== "全部" && c.category !== chartCat) continue;
    h += '<div class="card" onclick="openChartIdx(' + i + ')"><img loading="lazy" referrerpolicy="no-referrer" src="' + esc(thumb(c.cover, 240)) + '" /><div class="card-body"><div class="card-t">' + esc(c.title) + '</div><div class="card-s">' + esc(c.category) + '</div></div></div>';
  }
  document.getElementById("leftPane").innerHTML = h + '</div>';
}

// -------- 电台与无限续播 --------
function renderRadioPage() {
  var stations = radioStations.length ? radioStations : DEFAULT_RADIOS, prof = buildTasteProfile();
  var tasteHint = prof.artists.length ? ("已提取你的偏好歌手：" + prof.artists.slice(0, 4).join("、")) : "多点几首红心或播歌，私人漫游会越来越懂你";
  var h = '<div class="sec-head"><div><div class="sec-title">📻 随心电台 & 安静空间</div><div style="font-size:12px;color:var(--muted);margin-top:3px;">' + esc(tasteHint) + ' · 无限自动续播</div></div></div><div class="radio-grid">';
  for (var i = 0; i < stations.length; i++) {
    var st = stations[i];
    h += '<div class="radio-card' + (radioMode === st.id ? " active" : "") + '" style="background:' + st.grad + '" onclick="startRadio(\\'' + st.id + '\\')"><div><div class="radio-ico">' + st.icon + '</div><div class="radio-t">' + esc(st.title) + '</div></div><div class="radio-d">' + esc(st.desc) + '</div></div>';
  }
  h += '</div>';
  if (radioMode && playQueue.length) {
    var activeSt = stations.find(function(x) { return x.id === radioMode; }) || stations[0];
    viewSongs = playQueue;
    h += '<div class="sec-head"><div class="sec-title">正在收听：' + esc(activeSt.title) + '</div><button class="btn ghost sm" onclick="startRadio(\\'' + radioMode + '\\')">换一批新歌</button></div>' + buildSongsRowsHtml(playQueue, false, "");
  }
  document.getElementById("leftPane").innerHTML = h;
}
function fetchRadioBatch(mode, isRefill) {
  if (radioFetching) return; radioFetching = true;
  var prof = buildTasteProfile(), ex = dislikes.concat(playHistory.slice(0, 25).map(function(x) { return x.norm_key; }));
  if (isRefill) ex = ex.concat(playQueue.map(function(x) { return x.norm_key; }));
  api("/api/radio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: mode, artists: prof.artists, ids: prof.ids, cats: prof.cats, exclude: ex.slice(0, 120), needSheets: false }) })
    .then(function(d) {
      radioFetching = false; var songs = d.songs || [];
      if (!songs.length) { if (!isRefill) toast("电台暂无新曲目"); return; }
      if (!isRefill) { playQueue = songs; viewSongs = songs; playQueueIdx(0); if (curTabName === "radio") renderRadioPage(); toast("已开启「" + ((d.station && d.station.title) || mode) + "」"); }
      else {
        var seen = {}; playQueue.forEach(function(s) { seen[s.norm_key] = 1; });
        var added = 0; songs.forEach(function(s) { if (!seen[s.norm_key]) { seen[s.norm_key] = 1; playQueue.push(s); added++; } });
        if (added && curTabName === "radio") renderRadioPage();
      }
    }).catch(function() { radioFetching = false; });
}
function startRadio(mode) { radioMode = mode; updateDislikeBtn(); toast("正在调频电台...", 3000); fetchRadioBatch(mode, false); }
function dislikeCur() {
  if (!curSong) return;
  var nk = curSong.norm_key;
  if (dislikes.indexOf(nk) < 0) { dislikes.unshift(nk); if (dislikes.length > 300) dislikes = dislikes.slice(0, 300); localStorage.setItem("mh_dislikes_v1", JSON.stringify(dislikes)); }
  toast("已跳过，电台将减少此类推荐");
  if (curIdx >= 0 && curIdx < playQueue.length) { playQueue.splice(curIdx, 1); if (playQueue.length) playQueueIdx(Math.min(curIdx, playQueue.length - 1)); if (curTabName === "radio") renderRadioPage(); }
}
function updateDislikeBtn() { var el = document.getElementById("sDislikeBtn"); if (el) el.style.display = radioMode ? "inline-block" : "none"; }
function openRecSheet(idx) {
  var sh = recSheets[idx]; if (!sh) return;
  curTabName = "detail"; backTarget = "discover";
  document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">加载推荐歌单《' + esc(sh.title) + '》...</div>';
  api("/api/sheet?id=" + encodeURIComponent(sh.id)).then(function(d) {
    var info = d.sheet || sh;
    renderSongList(info.title, (info.artist || "为你推荐") + " · " + (d.songs || []).length + " 首", info.cover || sh.cover, d.songs || [], false, true);
  }).catch(function(){});
}

// -------- 歌手 & 专辑 --------
function renderArtists() {
  var h = '<div class="sec-head"><div class="sec-title">歌手广场</div><div style="display:flex;gap:6px;align-items:center;"><input id="arSearchIn" class="inline-input" style="width:185px;" placeholder="在线搜任意歌手..." value="' + esc(artistSearchKw) + '" /><button class="btn sm" onclick="searchOnlineArtists()">搜歌手</button>' + (searchedArtists.length ? '<button class="btn ghost sm" onclick="artistSearchKw=\\'\\';searchedArtists=[];renderArtists()">重置</button>' : '') + '</div></div>';
  if (searchedArtists.length) {
    h += '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">“' + esc(artistSearchKw) + '” 在线匹配结果</div><div class="ar-grid">';
    for (var s = 0; s < searchedArtists.length; s++) {
      var sa = searchedArtists[s];
      h += '<div class="ar-card" onclick="openSearchedArtist(' + s + ')"><div class="ar-ava" style="background:' + GRADS[s % GRADS.length] + '">' + (sa.avatar ? '<img loading="lazy" referrerpolicy="no-referrer" src="' + esc(thumb(sa.avatar, 120)) + '" />' : esc(sa.name.slice(0, 1))) + '</div><div class="card-t">' + esc(sa.name) + '</div><div class="card-s">' + (sa.worksNum ? sa.worksNum + '首' : '歌手') + '</div></div>';
    }
    h += '</div>';
  }
  h += '<div class="pills">';
  for (var k = 0; k < AR_CATS.length; k++) h += '<button class="pill' + (artistCat === AR_CATS[k] ? " active" : "") + '" onclick="artistCat=AR_CATS[' + k + '];renderArtists()">' + esc(AR_CATS[k]) + '</button>';
  h += '</div><div class="ar-grid">';
  for (var i = 0; i < artistsCache.length; i++) {
    var ar = artistsCache[i]; if (artistCat !== "全部" && ar.cat !== artistCat) continue;
    h += '<div class="ar-card" onclick="openPresetArtist(' + i + ')"><div class="ar-ava" style="background:' + GRADS[i % GRADS.length] + '">' + esc(ar.name.slice(0, 1)) + '</div><div class="card-t">' + esc(ar.name) + '</div><div class="card-s">' + esc(ar.tag) + '</div></div>';
  }
  document.getElementById("leftPane").innerHTML = h + '</div>';
  var inp = document.getElementById("arSearchIn"); if (inp) inp.addEventListener("keydown", function(e) { if (e.key === "Enter") searchOnlineArtists(); });
}
function searchOnlineArtists() {
  var q = (document.getElementById("arSearchIn")?.value || "").trim();
  if (!q) { searchedArtists = []; artistSearchKw = ""; renderArtists(); return; }
  artistSearchKw = q;
  api("/api/artists?q=" + encodeURIComponent(q)).then(function(d) { searchedArtists = d.artists || []; if (!searchedArtists.length) toast("未找到相关歌手"); renderArtists(); }).catch(function(){});
}
function loadAlbumsPage(q) {
  albumQuery = q; document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">加载专辑墙...</div>';
  api("/api/albums?q=" + encodeURIComponent(q)).then(function(d) { albumsCache = d.albums || []; renderAlbumsWall(); }).catch(function(){});
}
function renderAlbumsWall() {
  var h = '<div class="sec-head"><div class="sec-title">精选专辑</div></div><div class="pills">';
  for (var k = 0; k < ALB_CATS.length; k++) h += '<button class="pill' + (albumQuery === ALB_CATS[k] ? " active" : "") + '" onclick="loadAlbumsPage(ALB_CATS[' + k + '])">' + esc(ALB_CATS[k]) + '</button>';
  h += '</div><div class="cards-grid">';
  for (var i = 0; i < albumsCache.length; i++) {
    var al = albumsCache[i];
    h += '<div class="card" onclick="openAlbumObj(' + i + ',0)"><img loading="lazy" referrerpolicy="no-referrer" src="' + esc(thumb(al.cover, 240)) + '" /><div class="card-body"><div class="card-t">' + esc(al.title) + '</div><div class="card-s">' + esc(al.artist) + (al.publishTime ? " · " + esc(al.publishTime.slice(0,4)) : "") + '</div></div></div>';
  }
  document.getElementById("leftPane").innerHTML = h + '</div>';
}
function openPresetArtist(i) { var ar = artistsCache[i]; if (ar) openArtistDetail(ar.name, "", ar.tag); }
function openSearchedArtist(i) { var ar = searchedArtists[i]; if (ar) openArtistDetail(ar.name, ar.id, ar.worksNum ? ar.worksNum + "首作品" : "在线歌手"); }
function openArtistDetail(name, aid, tag) {
  curTabName = "detail"; backTarget = "artists";
  pageState = { type: "artist", query: name, artistId: aid || "", artistOffset: 0, page: 1, hasMore: false, loadingMore: false, artistExhausted: false, artistAlbums: [], artistSongs: [], artistTab: "songs", artistName: name, artistTag: tag || "" };
  var requestState = pageState, t0 = Date.now();
  document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">检索 ' + esc(name) + ' 单曲与专辑...</div>';
  var ep = "/api/artist?name=" + encodeURIComponent(name) + "&id=" + encodeURIComponent(aid || "") + "&page=1" + (isDebugActive() ? "&debug=1" : "");
  api(ep).then(function(d) {
    if (pageState !== requestState) return;
    pageState.artistId = String(d.artistId || aid || "");
    pageState.artistOffset = Math.max(0, Number(d.nextOffset || 0));
    pageState.hasMore = Boolean(d.hasMore); pageState.artistExhausted = !pageState.hasMore; pageState.artistAlbums = d.albums || []; pageState.artistSongs = d.songs || []; viewSongs = pageState.artistSongs;
    if (isDebugActive()) dbgLogApi((d.songs || []).length ? "ok" : "warn", "/api/artist p1", name + " -> 歌曲 " + (d.songs || []).length + " / 专辑 " + (d.albums || []).length + " / hasMore=" + Boolean(d.hasMore) + " (" + (Date.now() - t0) + "ms)", (d._debug || []).join(" | "));
    renderArtistDetail();
  }).catch(function(e){ if (pageState === requestState) { toast("歌手数据加载失败，请重试"); if (isDebugActive()) dbgLogApi("err", "/api/artist p1", name + " 请求失败", e && e.message); } });
}
function renderArtistDetail() {
  viewSongs = pageState.artistSongs || [];
  var cov = thumb((viewSongs[0] && viewSongs[0].cover) || (pageState.artistAlbums[0] && pageState.artistAlbums[0].cover) || "", 240);
  var h = '<div class="list-head">' + (cov !== DEFAULT_COV ? '<img class="list-cov" referrerpolicy="no-referrer" src="' + esc(cov) + '" />' : '<div class="list-cov">' + esc(pageState.artistName.slice(0, 1)) + '</div>') +
    '<div style="flex:1;min-width:160px;"><div style="font-size:20px;font-weight:800;">' + esc(pageState.artistName) + '</div>' +
    '<div style="font-size:12px;color:var(--muted);margin:4px 0 10px;">' + esc(pageState.artistTag) + ' · 单曲 ' + viewSongs.length + ' · 专辑 ' + pageState.artistAlbums.length + '</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn" onclick="radioMode=\\'\\';playAll()">&#9654; 播放全部</button>' +
    '<button class="pill' + (pageState.artistTab === "songs" ? " active" : "") + '" onclick="pageState.artistTab=\\'songs\\';renderArtistDetail()">热门单曲</button>' +
    '<button class="pill' + (pageState.artistTab === "albums" ? " active" : "") + '" onclick="pageState.artistTab=\\'albums\\';renderArtistDetail()">专辑 (' + pageState.artistAlbums.length + ')</button>' +
    '<button class="btn ghost" onclick="nav(\\'artists\\')">返回歌手</button></div></div></div>';
  if (pageState.artistTab === "albums") {
    h += '<div class="cards-grid">';
    for (var i = 0; i < pageState.artistAlbums.length; i++) {
      var al = pageState.artistAlbums[i];
      h += '<div class="card" onclick="openAlbumObj(' + i + ',1)"><img loading="lazy" referrerpolicy="no-referrer" src="' + esc(thumb(al.cover, 240)) + '" /><div class="card-body"><div class="card-t">' + esc(al.title) + '</div><div class="card-s">' + esc(al.publishTime || "") + ' · ' + (al.size || 0) + '首</div></div></div>';
    }
    document.getElementById("leftPane").innerHTML = h + '</div>'; return;
  }
  document.getElementById("leftPane").innerHTML = h + buildSongsRowsHtml(viewSongs, Boolean(pageState.hasMore), "");
}
function openAlbumObj(i, fromArtist) {
  var al = fromArtist ? pageState.artistAlbums[i] : albumsCache[i]; if (!al) return;
  curTabName = "detail"; backTarget = fromArtist ? "artist" : "albums";
  document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">加载专辑《' + esc(al.title) + '》...</div>';
  api("/api/album?id=" + encodeURIComponent(al.id)).then(function(d) { var info = d.album || al; renderSongList(info.title, (info.artist || al.artist) + " · 专辑曲目 " + (d.songs || []).length + " 首", info.cover || al.cover, d.songs || [], false); }).catch(function(){});
}
function goBack() {
  if (backTarget === "artist" && pageState.artistName) { renderArtistDetail(); return; }
  if (backTarget === "albums" && albumsCache.length) { setNav("albums"); renderAlbumsWall(); return; }
  if (backTarget === "artists") { nav("artists"); return; }
  if (backTarget === "sheets") { nav("sheets"); return; }
  nav("discover");
}
function openChartIdx(i) {
  var c = chartsCache[i]; if (!c) return;
  curTabName = "detail"; backTarget = "discover"; pageState = { type: "chart", query: c.id, page: 1, hasMore: false };
  document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">加载榜单...</div>';
  api("/api/chart?id=" + encodeURIComponent(c.id)).then(function(d) { var ch = d.chart || c; renderSongList(ch.title, ch.description || "精选榜单", ch.cover || "", d.songs || [], false, true); }).catch(function(){});
}
function doSearch(page) {
  var q = document.getElementById("qInput").value.trim(); if (!q) return nav("discover");
  setNav("discover"); curTabName = "detail"; backTarget = "discover";
  if (page === 1) { pageState = { type: "search", query: q, page: 1, hasMore: false }; viewSongs = []; document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">全网搜索中...</div>'; }
  var t0 = Date.now();
  api("/api/search?q=" + encodeURIComponent(q) + "&page=" + page + (isDebugActive() ? "&debug=1" : "")).then(function(d) {
    pageState.page = page; pageState.hasMore = Boolean(d.hasMore);
    var list = d.songs || []; viewSongs = page === 1 ? list : viewSongs.concat(list);
    if (isDebugActive()) dbgLogApi(list.length ? "ok" : "warn", "/api/search p" + page, q + " -> " + list.length + " 首 (" + (Date.now() - t0) + "ms)", (d._debug || []).join(" | "));
    renderSongList("搜索：" + q, "已加载 " + viewSongs.length + " 首", (viewSongs[0] && viewSongs[0].cover) || "", viewSongs, pageState.hasMore);
  }).catch(function(e){ if (isDebugActive()) dbgLogApi("err", "/api/search p" + page, q + " 请求失败", e && e.message); });
}
function loadMore() {
  if (!pageState || !pageState.hasMore) return;
  if (pageState.type === "search") { doSearch((pageState.page || 1) + 1); return; }
  if (pageState.type === "artist") {
    if (pageState.loadingMore) return;
    var stateRef = pageState, t0 = Date.now();
    var nextP = (stateRef.page || 1) + 1;
    var offset = Math.max(0, Number(stateRef.artistOffset || 0));
    stateRef.loadingMore = true;
    renderArtistDetail();
    var endpoint = "/api/artist?name=" + encodeURIComponent(stateRef.query) +
      "&id=" + encodeURIComponent(stateRef.artistId || "") +
      "&page=" + nextP + "&offset=" + offset + (isDebugActive() ? "&debug=1" : "");
    api(endpoint).then(function(d) {
      if (pageState !== stateRef) return;
      var seen = {};
      stateRef.artistSongs.forEach(function(song) { seen[song.norm_key || makeNormKeyLocal(song.title, song.artist)] = 1; });
      var batch = d.songs || [], added = 0;
      batch.forEach(function(song) {
        var key = song.norm_key || makeNormKeyLocal(song.title, song.artist);
        if (!seen[key]) { seen[key] = 1; stateRef.artistSongs.push(song); added++; }
      });
      stateRef.page = nextP;
      stateRef.artistId = String(d.artistId || stateRef.artistId || "");
      stateRef.artistOffset = Math.max(offset, Number(d.nextOffset || (offset + batch.length)));
      stateRef.hasMore = Boolean(d.hasMore && batch.length);
      stateRef.artistExhausted = !stateRef.hasMore;
      if (isDebugActive()) dbgLogApi(added ? "ok" : "warn", "/api/artist p" + nextP, stateRef.query + " -> 返回 " + batch.length + " 首，新增 " + added + " 首 (" + (Date.now() - t0) + "ms)", (d._debug || []).join(" | "));
      if (!batch.length || !added) {
        stateRef.artistExhausted = true;
        stateRef.hasMore = false;
        toast(batch.length ? "没有发现新的歌曲" : "没有更多歌曲了");
      }
    }).catch(function(e) {
      if (pageState === stateRef) { toast("加载失败，请稍后重试"); if (isDebugActive()) dbgLogApi("err", "/api/artist p" + nextP, stateRef.query + " 请求失败", e && e.message); }
    }).finally(function() {
      if (pageState === stateRef) {
        stateRef.loadingMore = false;
        renderArtistDetail();
      }
    });
  }
}

// -------- 自建歌单 + 导入 + 跨软件分享 --------
function saveSheets() { localStorage.setItem("mh_playlists_v1", JSON.stringify(mySheets)); }
function makeNormKeyLocal(title, artist) {
  var raw = String(title || "").toLowerCase().trim(), variant = "";
  var m = raw.match(/[\\(（\\[【]([^\\)）\\]】]+)[\\)）\\]】]/g);
  if (m) {
    for (var i = 0; i < m.length; i++) {
      if (/(live|现场|演唱会|remix|dj|伴奏|纯音乐|钢琴|吉他|弹唱|翻唱|cover|加速|降调|清唱|night version)/i.test(m[i])) {
        variant += " " + m[i].replace(/[\\(\\)\\[\\]（）【】]/g, "").trim();
      }
    }
  }
  var base = normStrLocal(raw) || raw.replace(/[\\(\\)\\[\\]（）【】]/g, "").replace(/\\s+/g, " ").trim();
  var tKey = (base + (variant ? " " + variant.trim() : "")).replace(/\\s+/g, " ").trim();
  var aKey = normStrLocal(String(artist || "").split(/[/,、]|\\s+&\\s+/)[0]);
  return tKey + "|" + aKey;
}
function renderSheetsHub() {
  var h = '<div class="sec-head"><div class="sec-title">我的自建歌单 (' + mySheets.length + ')</div><div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn" onclick="openCreateSheetModal()">+ 新建歌单</button><button class="btn ghost" onclick="openImportSheetModal()">📥 导入外部歌单</button></div></div>';
  if (!mySheets.length) {
    h += '<div style="padding:48px 18px;text-align:center;color:var(--muted);background:var(--panel);border:1px solid var(--line);border-radius:16px;"><div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;">还没有自建歌单</div><div style="font-size:12.5px;margin-bottom:14px;">支持手动新建，或直接导入网易云 / QQ音乐 / 汽水音乐 / 酷狗 / 酷我 / 纯文本歌单</div><button class="btn" onclick="openCreateSheetModal()">立即新建</button></div>';
    document.getElementById("leftPane").innerHTML = h; return;
  }
  h += '<div class="cards-grid">';
  for (var i = 0; i < mySheets.length; i++) {
    var sh = mySheets[i], cov = (sh.songs[0] && sh.songs[0].cover) ? thumb(sh.songs[0].cover, 240) : "";
    h += '<div class="card" onclick="openMySheet(' + i + ')">' + (cov ? '<img loading="lazy" referrerpolicy="no-referrer" src="' + esc(cov) + '" />' : '<div class="card-cov-ph" style="background:' + GRADS[i % GRADS.length] + '">' + esc(sh.name.slice(0, 1)) + '</div>') + '<div class="card-body"><div class="card-t">' + esc(sh.name) + '</div><div class="card-s">' + sh.songs.length + ' 首歌曲</div></div></div>';
  }
  document.getElementById("leftPane").innerHTML = h + '</div>';
}
function openCreateSheetModal(pendingSong) {
  window._pendingAddSong = pendingSong || null;
  openModal('<h3>新建歌单</h3><input id="newSheetName" placeholder="输入歌单名称（如：深夜循环）" /><input id="newSheetDesc" placeholder="简介（选填）" /><div class="modal-row"><button class="btn ghost" onclick="closeModal()">取消</button><button class="btn" onclick="confirmCreateSheet()">创建</button></div>');
  setTimeout(function() { var el = document.getElementById("newSheetName"); if (el) el.focus(); }, 50);
}
function confirmCreateSheet() {
  var name = (document.getElementById("newSheetName")?.value || "").trim(); if (!name) return toast("请输入歌单名称");
  var sh = { id: "pl_" + Date.now(), name: name, desc: (document.getElementById("newSheetDesc")?.value || "").trim(), createdAt: Date.now(), songs: [] };
  if (window._pendingAddSong) { sh.songs.push(window._pendingAddSong); window._pendingAddSong = null; }
  mySheets.unshift(sh); saveSheets(); closeModal(); toast("歌单《" + name + "》已创建");
  if (curTabName === "sheets") renderSheetsHub();
}
function openMySheet(idx) {
  var sh = mySheets[idx]; if (!sh) return;
  curTabName = "detail"; backTarget = "sheets"; viewSongs = sh.songs || [];
  var cov = (viewSongs[0] && viewSongs[0].cover) ? thumb(viewSongs[0].cover, 240) : DEFAULT_COV;
  var h = '<div class="list-head">' + (cov !== DEFAULT_COV ? '<img class="list-cov" referrerpolicy="no-referrer" src="' + esc(cov) + '" />' : '<div class="list-cov">' + esc(sh.name.slice(0, 1)) + '</div>') + '<div style="flex:1;min-width:160px;"><div style="font-size:19px;font-weight:800;">' + esc(sh.name) + '</div><div style="font-size:12px;color:var(--muted);margin:4px 0 10px;">' + esc(sh.desc || "自建歌单") + ' · ' + viewSongs.length + ' 首</div><div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn" onclick="radioMode=\\'\\';playAll()">&#9654; 播放全部</button><button class="btn ghost" onclick="openShareModal(' + idx + ')">📤 分享到其他软件</button><button class="btn ghost" onclick="renameSheet(' + idx + ')">改名</button><button class="btn danger" onclick="deleteSheet(' + idx + ')">删除</button><button class="btn ghost" onclick="nav(\\'sheets\\')">返回歌单</button></div></div></div>';
  document.getElementById("leftPane").innerHTML = h + buildSongsRowsHtml(viewSongs, false, "sheet:" + idx);
}
function renameSheet(idx) {
  var sh = mySheets[idx]; if (!sh) return;
  openModal('<h3>重命名歌单</h3><input id="rnInput" value="' + esc(sh.name) + '" /><div class="modal-row"><button class="btn ghost" onclick="closeModal()">取消</button><button class="btn" onclick="var v=document.getElementById(\\'rnInput\\').value.trim();if(v){mySheets[' + idx + '].name=v;saveSheets();closeModal();openMySheet(' + idx + ');}">保存</button></div>');
}
function deleteSheet(idx) {
  var sh = mySheets[idx]; if (!sh) return;
  openModal('<h3>删除歌单</h3><p style="font-size:13px;color:var(--muted);margin-bottom:14px;">确认删除《' + esc(sh.name) + '》吗？此操作不可撤销。</p><div class="modal-row"><button class="btn ghost" onclick="closeModal()">取消</button><button class="btn danger" onclick="mySheets.splice(' + idx + ',1);saveSheets();closeModal();nav(\\'sheets\\');toast(\\'已删除\\')">确认删除</button></div>');
}
function removeFromSheet(sheetIdx, songIdx) { var sh = mySheets[sheetIdx]; if (!sh) return; sh.songs.splice(songIdx, 1); saveSheets(); openMySheet(sheetIdx); toast("已从歌单移除"); }
function saveCurrentListAsSheet(name) { if (!viewSongs.length) return toast("当前列表为空"); mySheets.unshift({ id: "pl_" + Date.now(), name: name || "收藏歌单", desc: "一键收藏歌单", createdAt: Date.now(), songs: viewSongs.slice() }); saveSheets(); toast("已收藏为自建歌单《" + (name || "收藏歌单") + "》"); }
function openPickSheetModal(song) {
  if (!song) return;
  window._pickTargetSong = song;
  var h = '<h3>添加到歌单：' + esc(song.title) + '</h3>';
  if (!mySheets.length) h += '<p style="font-size:13px;color:var(--muted);margin-bottom:12px;">暂无自建歌单，请先新建一个。</p>';
  for (var i = 0; i < mySheets.length; i++) h += '<div class="pick-item" onclick="addSongToSheet(' + i + ')"><span><b>' + esc(mySheets[i].name) + '</b></span><small style="color:var(--muted);">' + mySheets[i].songs.length + ' 首</small></div>';
  h += '<div class="modal-row"><button class="btn ghost" onclick="closeModal()">关闭</button><button class="btn" onclick="openCreateSheetModal(window._pickTargetSong)">+ 新建并加入</button></div>';
  openModal(h);
}
function addSongToSheet(sheetIdx) {
  var sh = mySheets[sheetIdx], s = window._pickTargetSong; if (!sh || !s) return;
  var nk = s.norm_key || makeNormKeyLocal(s.title, s.artist);
  if (sh.songs.some(function(x) { return (x.norm_key || makeNormKeyLocal(x.title, x.artist)) === nk; })) { closeModal(); return toast("歌曲已在《" + sh.name + "》中"); }
  sh.songs.unshift({ id: s.id || 0, norm_key: nk, title: s.title, artist: s.artist, album: s.album || "", cover: s.cover || "", duration: s.duration || 0, ext_source: s.ext_source || "", ext_id: s.ext_id || "" });
  saveSheets(); closeModal(); toast("已加入《" + sh.name + "》");
}
function addViewToSheet(i) { if (viewSongs[i]) openPickSheetModal(viewSongs[i]); }
function addCurToSheet() { if (curSong) openPickSheetModal(curSong); else toast("请先选择一首歌曲"); }

function openImportSheetModal() {
  openModal('<h3>导入外部歌单</h3><p style="font-size:12px;color:var(--muted);margin-bottom:8px;">方式 1：粘贴 网易云 / QQ音乐 / 汽水音乐 / 酷狗 / 酷我 / 分享链接</p><input id="impLinkIn" placeholder="粘贴任意平台公开歌单链接或分享文案..." /><p style="font-size:12px;color:var(--muted);margin:6px 0;">方式 2：或直接粘贴文本歌单（每行一首：歌名 - 歌手）</p><textarea id="impTextIn" rows="5" placeholder="晴天 - 周杰伦&#10;一路上有你 - 张学友&#10;十年 - 陈奕迅"></textarea><input id="impNameIn" placeholder="导入后的歌单名（链接导入留空用原名）" /><div class="modal-row"><button class="btn ghost" onclick="closeModal()">取消</button><button class="btn" onclick="confirmImportSheet()">开始导入</button></div>');
}
function confirmImportSheet() {
  var link = (document.getElementById("impLinkIn")?.value || "").trim(), text = (document.getElementById("impTextIn")?.value || "").trim(), customName = (document.getElementById("impNameIn")?.value || "").trim();
  if (link) {
    toast("正在解析歌单（大歌单约需数秒）...", 8000);
    api("/api/import-sheet", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: link }) }).then(function(d) {
      if (d.error || !d.songs || !d.songs.length) return toast(d.error || "导入失败或歌单为空");
      mySheets.unshift({ id: "pl_" + Date.now(), name: customName || d.title || "导入歌单", desc: d.description || "外部链接导入", createdAt: Date.now(), songs: d.songs });
      saveSheets(); closeModal(); renderSheetsHub(); toast("成功导入 " + d.songs.length + " 首歌曲！");
    }).catch(function() { toast("导入请求失败"); }); return;
  }
  if (text) {
    var songs = [];
    text.split(/\\r?\\n/).forEach(function(line) {
      var l = line.trim(); if (!l) return;
      var parts = l.split(/\\s+[-—–]\\s+|\\t/), title = (parts[0] || "").trim(), artist = (parts[1] || "未知歌手").trim();
      if (title) songs.push({ id: 0, norm_key: makeNormKeyLocal(title, artist), title: title, artist: artist, album: "", cover: "", duration: 0 });
    });
    if (!songs.length) return toast("未识别到有效歌曲行");
    mySheets.unshift({ id: "pl_" + Date.now(), name: customName || "文本导入歌单", desc: "纯文本清单导入", createdAt: Date.now(), songs: songs });
    saveSheets(); closeModal(); renderSheetsHub(); toast("已导入 " + songs.length + " 首歌曲"); return;
  }
  toast("请输入歌单链接或歌曲文本");
}
function openShareModal(idx) {
  var sh = mySheets[idx]; if (!sh || !sh.songs.length) return toast("空歌单无法分享");
  var txtList = sh.songs.map(function(s) { return s.title + " - " + s.artist; }).join("\\n"), jsonText = JSON.stringify({ name: sh.name, songs: sh.songs }, null, 2);
  window._shareTxt = txtList; window._shareJson = jsonText; window._shareIdx = idx;
  openModal('<h3>分享歌单《' + esc(sh.name) + '》</h3><p style="font-size:12px;color:var(--muted);margin-bottom:8px;"><b>1. 生成云端链接</b>（可发给好友网页听歌，也可粘贴到 <b>MusicFree 导入歌单</b>）</p><div style="display:flex;gap:8px;margin-bottom:12px;"><input id="cloudShareOut" readonly placeholder="点击右侧按钮生成链接..." style="margin:0;flex:1;" /><button class="btn" onclick="genCloudShare()">生成并复制</button></div><p style="font-size:12px;color:var(--muted);margin-bottom:6px;"><b>2. 导出文本清单</b>（兼容网易云“一键导入外部歌单”、QQ音乐、洛雪等）</p><textarea rows="5" readonly>' + esc(txtList) + '</textarea><div class="modal-row"><button class="btn ghost" onclick="copyVar(window._shareTxt, \\'文本清单已复制\\')">复制文本清单</button><button class="btn ghost" onclick="copyVar(window._shareJson, \\'JSON 已复制\\')">复制 JSON</button><button class="btn" onclick="closeModal()">完成</button></div>');
}
function genCloudShare() {
  var sh = mySheets[window._shareIdx]; if (!sh) return;
  api("/api/share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: sh.name, description: sh.desc || "", songs: sh.songs }) }).then(function(d) {
    if (!d.ok) return toast(d.error || "生成失败");
    var inp = document.getElementById("cloudShareOut"); if (inp) inp.value = d.shareUrl;
    copyVar(d.shareUrl, "云端分享链接已复制（可直接贴进 MusicFree 导入）");
  }).catch(function() { toast("生成失败"); });
}
function copyVar(str, okMsg) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(str).then(function() { toast(okMsg); }).catch(function() { toast("请手动全选复制"); }); else toast("请手动全选复制"); }
function loadSharedPlaylist(shareId) {
  setNav("sheets"); document.getElementById("leftPane").innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);">正在加载分享歌单...</div>';
  api("/api/share?id=" + encodeURIComponent(shareId)).then(function(d) {
    if (!d.songs) return toast(d.error || "分享歌单不存在");
    lastSharedData = d; viewSongs = d.songs;
    var cov = (viewSongs[0] && viewSongs[0].cover) ? thumb(viewSongs[0].cover, 240) : DEFAULT_COV;
    var h = '<div class="list-head">' + (cov !== DEFAULT_COV ? '<img class="list-cov" referrerpolicy="no-referrer" src="' + esc(cov) + '" />' : '<div class="list-cov">' + esc(d.title.slice(0, 1)) + '</div>') + '<div style="flex:1;min-width:160px;"><div style="font-size:19px;font-weight:800;">' + esc(d.title) + '</div><div style="font-size:12px;color:var(--muted);margin:4px 0 10px;">' + esc(d.description || "好友分享歌单") + ' · ' + viewSongs.length + ' 首</div><div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn" onclick="radioMode=\\'\\';playAll()">&#9654; 播放全部</button><button class="btn ghost" onclick="saveSharedToMine()">📥 保存到我的歌单</button><button class="btn ghost" onclick="nav(\\'discover\\')">首页</button></div></div></div>';
    document.getElementById("leftPane").innerHTML = h + buildSongsRowsHtml(viewSongs, false, "");
  }).catch(function(){});
}
function saveSharedToMine() { if (!lastSharedData) return; mySheets.unshift({ id: "pl_" + Date.now(), name: lastSharedData.title || "收藏分享歌单", desc: "来自好友分享", createdAt: Date.now(), songs: lastSharedData.songs || [] }); saveSheets(); toast("已保存到我的歌单！"); }

// -------- 队列与通用列表渲染 --------
function renderQueueView() {
  viewSongs = playQueue;
  var h = '<div class="list-head"><div class="list-cov">♫</div><div style="flex:1;min-width:160px;"><div style="font-size:19px;font-weight:800;">当前播放队列' + (radioMode ? ' (电台漫游中)' : '') + '</div><div style="font-size:12px;color:var(--muted);margin:4px 0 10px;">共 ' + playQueue.length + ' 首</div><div style="display:flex;gap:8px;"><button class="btn ghost" onclick="playQueue=[];curIdx=-1;curSong=null;audio.pause();audio.removeAttribute(\\'src\\');audio.load();setPlayIcon(false);radioMode=\\'\\';updateDislikeBtn();renderQueueView();toast(\\'队列已清空\\')">清空队列</button><button class="btn ghost" onclick="nav(\\'discover\\')">返回发现</button></div></div></div>';
  document.getElementById("leftPane").innerHTML = h + buildSongsRowsHtml(viewSongs, false, "queue");
}
function removeFromQueue(idx) {
  if (idx < 0 || idx >= playQueue.length) return;
  var removingCur = idx === curIdx;
  playQueue.splice(idx, 1);
  if (idx < curIdx) curIdx--;
  else if (removingCur) {
    if (playQueue.length) { playQueueIdx(Math.min(idx, playQueue.length - 1)); }
    else {
      curIdx = -1; curSong = null;
      audio.pause(); audio.removeAttribute("src"); audio.load(); setPlayIcon(false);
      document.getElementById("dTitle").textContent = "未播放";
      document.getElementById("dArtist").textContent = "队列为空";
    }
  }
  renderQueueView();
}
function renderSongList(title, sub, cover, songs, hasMore, allowCollect) {
  viewSongs = songs || []; window._curListTitle = title;
  var cov = thumb(cover, 240);
  var backLabel = backTarget === "artist" ? ("← 返回 " + pageState.artistName) : backTarget === "albums" ? "← 返回专辑" : backTarget === "artists" ? "← 返回歌手" : backTarget === "sheets" ? "← 返回歌单" : "返回发现";
  var collectBtn = allowCollect ? '<button class="btn ghost" onclick="saveCurrentListAsSheet(window._curListTitle)">📥 存为歌单</button>' : '';
  var h = '<div class="list-head">' + (cov !== DEFAULT_COV ? '<img class="list-cov" referrerpolicy="no-referrer" src="' + esc(cov) + '" />' : '<div class="list-cov">' + esc(title.slice(0, 1)) + '</div>') + '<div style="flex:1;min-width:160px;"><div style="font-size:19px;font-weight:800;">' + esc(title) + '</div><div style="font-size:12px;color:var(--muted);margin:4px 0 10px;">' + esc(sub) + '</div><div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn" onclick="radioMode=\\'\\';playAll()">&#9654; 播放全部</button>' + collectBtn + '<button class="btn ghost" onclick="goBack()">' + esc(backLabel) + '</button></div></div></div>';
  document.getElementById("leftPane").innerHTML = h + buildSongsRowsHtml(viewSongs, hasMore, "");
}
function buildSongsRowsHtml(songs, hasMore, ctxMode) {
  if (!songs.length) return '<div style="padding:36px;text-align:center;color:var(--muted);">暂无歌曲</div>';
  var h = "";
  for (var i = 0; i < songs.length; i++) {
    var s = songs[i], isCur = curSong && curSong.norm_key === s.norm_key, loved = isFav(s);
    var extraBtn = (ctxMode && ctxMode.indexOf("sheet:") === 0) ? '<button class="ico-btn" title="从歌单移除" onclick="removeFromSheet(' + Number(ctxMode.split(":")[1]) + ',' + i + ')">✕</button>' : (ctxMode === "queue" ? '<button class="ico-btn" title="移出队列" onclick="removeFromQueue(' + i + ')">✕</button>' : '<button class="ico-btn" title="加到歌单" onclick="addViewToSheet(' + i + ')">📁</button>');
    h += '<div class="s-row' + (isCur ? " active" : "") + '" data-nk="' + esc(s.norm_key) + '" onclick="playViewIdx(' + i + ')"><div class="s-num">' + (isCur ? "&#9654;" : (i + 1)) + '</div><img class="s-cov" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=DEFAULT_COV;" src="' + esc(thumb(s.cover, 100)) + '" /><div class="s-main"><div class="s-t">' + esc(s.title) + '</div><div class="s-a">' + esc(s.artist) + (s.album ? " · " + esc(s.album) : "") + '</div></div><div class="s-d">' + (s.duration ? fmt(s.duration) : "--:--") + '</div><div class="s-acts" onclick="event.stopPropagation()"><button class="ico-btn' + (loved ? " loved" : "") + '" title="红心收藏" onclick="toggleViewFav(' + i + ',this)">' + (loved ? "&#9829;" : "&#9825;") + '</button>' + extraBtn + '<button class="ico-btn" title="下载到本地" onclick="downloadViewIdx(' + i + ')">⬇</button><button class="ico-btn" title="下一首播放" onclick="addNext(' + i + ')">+</button></div></div>';
  }
  if (hasMore) {
    var isArtistLoading = pageState && pageState.type === "artist" && pageState.loadingMore;
    h += '<div style="text-align:center;padding:16px;"><button class="btn ghost" ' + (isArtistLoading ? 'disabled style="opacity:.65;cursor:wait;"' : '') + ' onclick="loadMore()">' + (isArtistLoading ? '正在加载…' : '加载更多歌曲 &darr;') + '</button></div>';
  }
  return h;
}
function syncActiveRowHighlight() {
  var rows = document.querySelectorAll("#leftPane .s-row");
  for (var i = 0; i < rows.length; i++) {
    var nk = rows[i].getAttribute("data-nk"), isCur = curSong && nk === curSong.norm_key;
    rows[i].classList.toggle("active", Boolean(isCur));
    var numEl = rows[i].querySelector(".s-num");
    if (numEl) numEl.innerHTML = isCur ? "&#9654;" : String(i + 1);
  }
}
function playAll() { if (viewSongs.length) { playQueue = viewSongs.slice(); playQueueIdx(0); } }
function playViewIdx(i) { if (curTabName !== "radio") radioMode = ""; updateDislikeBtn(); playQueue = viewSongs.slice(); playQueueIdx(i); }
function addNext(i) { var s = viewSongs[i]; if (!s) return; if (!playQueue.length) { playQueue = [s]; playQueueIdx(0); return; } playQueue.splice(curIdx + 1, 0, s); toast("已添加到下一首播放"); }

// -------- 播放与多源竞速 + 调试追踪 --------
function renderSrcBar() {
  var bar = document.getElementById("srcBar");
  if (!candidates.length) { bar.innerHTML = '<span style="font-size:11px;color:var(--muted);">正在并发探测全网正式音源...</span>'; return; }
  bar.innerHTML = candidates.map(function(c, i) {
    var cls = i === curCandIdx ? "src-item cur" : (c.isTrial ? "src-item warn" : "src-item ok");
    return '<button class="' + cls + '" onclick="pickCandidate(' + i + ',true)">' + esc(c.label) + '</button>';
  }).join("");
}
function addCandidate(seq, cand) {
  if (seq !== playSeq || !cand || !cand.url) return;
  if (!cand.rawUrl) cand.rawUrl = cand.url;
  if (location.protocol === "https:" && cand.url.indexOf("http://") === 0) {
    cand.url = "/api/stream?u=" + encodeURIComponent(cand.rawUrl) + "&src=" + encodeURIComponent(cand.rawSrc || cand.label || "") + "&token=" + encodeURIComponent(TOKEN);
    cand.proxied = true;
    if (isDebugActive()) dbgLogPlay("warn", "HTTPS代理", cand.label + " 返回 http:// 链，已自动转走 /api/stream", cand.rawUrl);
  }
  for (var i = 0; i < candidates.length; i++) { if (candidates[i].url === cand.url || candidates[i].rawUrl === cand.rawUrl) return; }
  candidates.push(cand);
  var idx = candidates.length - 1, curCand = candidates[curCandIdx];
  if (curCandIdx < 0 || (curCand && curCand.isTrial && !cand.isTrial)) pickCandidate(idx, false);
  else renderSrcBar();
}
function pickCandidate(i, manual) {
  var c = candidates[i]; if (!c) return;
  curCandIdx = i; renderSrcBar();
  autoWaitMeta = !manual;
  if (isDebugActive()) dbgLogPlay("info", manual ? "手动切源" : "加载候选", c.label + (c.proxied ? " (经代理)" : " (直连)"), c.rawUrl || c.url);
  audio.src = c.url;
  if (manual) {
    audio.play().catch(function(){}); setPlayIcon(true);
    document.getElementById("dArtist").textContent = (curSong ? curSong.artist : "") + " · " + c.label;
  } else {
    document.getElementById("dArtist").textContent = (curSong ? curSong.artist : "") + " · 校验完整版: " + c.label;
  }
}

function fetchDirectGD(s, plat, label, seq) {
  var cleanArtist = (s.artist || "").split(/[/,、]|\\s+&\\s+/)[0].trim();
  var kw = (normStrLocal(s.title) + " " + cleanArtist).trim();
  var base = "https://music-api.gdstudio.xyz/api.php?use_xbridge3=true&types=";
  var reqTimeout = 4500;
  var t0 = Date.now(), searchUrl = base + "search&source=" + plat + "&name=" + encodeURIComponent(kw) + "&count=6&pages=1";
  function directFetch(url) {
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = controller ? setTimeout(function(){ controller.abort(); }, reqTimeout) : null;
    return fetch(url, controller ? { signal: controller.signal } : {}).finally(function(){ if (timer) clearTimeout(timer); });
  }
  var strictIdentity = isStrictSongLocal(s);
  var p = (plat === "netease" && s.ext_source === "netease" && s.ext_id)
    ? Promise.resolve(s.ext_id)
    : directFetch(searchUrl)
        .then(function(r) { if (!r.ok) throw new Error("搜索 HTTP " + r.status); if (!(r.headers.get("content-type") || "").toLowerCase().includes("json")) throw new Error("搜索非JSON响应"); return r.json(); })
        .then(function(arr) {
          if (!Array.isArray(arr) || !arr.length) throw new Error("搜索无结果");
          var best = null, bsc = -100;
          for (var i = 0; i < arr.length; i++) {
            var sc = scoreMatchLocal(arr[i].name, arr[i].artist, s.title, s.artist, Number(arr[i].duration || 0), s.duration, arr[i].album || "", strictIdentity);
            if (sc > bsc) { bsc = sc; best = arr[i]; }
          }
          if (!best || bsc < (strictIdentity ? 80 : 20) || !best.id) throw new Error("候选评分淘汰(最高=" + bsc + ")");
          return String(best.id);
        });

  p.then(function(pid) {
    if (!pid || seq !== playSeq) return;
    var uUrl = base + "url&source=" + plat + "&id=" + encodeURIComponent(pid) + "&br=320";
    return directFetch(uUrl)
      .then(function(r) { if (!r.ok) throw new Error("取链 HTTP " + r.status); if (!(r.headers.get("content-type") || "").toLowerCase().includes("json")) throw new Error("取链非JSON响应"); return r.json(); })
      .then(function(d) {
        if (seq !== playSeq) return;
        if (!d || !d.url) throw new Error("返回空 URL");
        if (d.size && s.duration >= 90 && Number(d.size) < Math.max(320, s.duration * 2.8)) throw new Error("体积过小(" + d.size + "KB)");
        if (isDebugActive()) dbgLogPlay("ok", "直连:" + label, "命中 " + (d.br || "?") + "k (" + (Date.now() - t0) + "ms)", uUrl + "\\n-> " + d.url);
        addCandidate(seq, { label: label + (d.br ? "(" + d.br + "k)" : ""), url: d.url, rawSrc: plat, isTrial: false });
      });
  }).catch(function(err) {
    if (seq === playSeq && isDebugActive()) {
      var msg = (err && err.name === "AbortError") ? ("超时(" + reqTimeout + "ms)") : ((err && err.message) || String(err));
      dbgLogPlay("err", "直连:" + label, "失败: " + msg + " (" + (Date.now() - t0) + "ms)", searchUrl);
    }
  });
}

function fetchDirectVKeys(s, seq) {
  var cleanArtist = (s.artist || "").split(/[/,、]|\\s+&\\s+/)[0].trim();
  var kw = (normStrLocal(s.title) + " " + cleanArtist).trim();
  var timeoutMs = isStrictSongLocal(s) ? 6800 : 4200;
  ["https://api.vkeys.cn/v2/music", "https://luoyue-api-cf.vincentzyu233.cn/v2/music"].forEach(function(base, idx) {
    var tag = idx === 0 ? "QQ(直连)" : "落月(直连)", t0 = Date.now();
    var reqUrl = base + "/tencent?word=" + encodeURIComponent(kw) + "&n=1&quality=3";
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = controller ? setTimeout(function(){ controller.abort(); }, timeoutMs) : null;
    fetch(reqUrl, controller ? { signal: controller.signal } : {})
      .finally(function(){ if (timer) clearTimeout(timer); })
      .then(function(r) { if (!r.ok) throw new Error("HTTP " + r.status); if (!(r.headers.get("content-type") || "").toLowerCase().includes("json")) throw new Error("非JSON响应"); return r.json(); })
      .then(function(res) {
        if (seq !== playSeq) return;
        var d = res && res.data;
        if (!d || !d.url || d.ekey) throw new Error(d && d.ekey ? "含ekey加密" : "无播放URL");
        var sc = scoreMatchLocal(d.song || s.title, d.singer || s.artist, s.title, s.artist, 0, s.duration);
        if (sc < 15) throw new Error("候选不匹配(score=" + sc + ")");
        if (isDebugActive()) dbgLogPlay("ok", "直连:" + tag, "命中 (" + (Date.now() - t0) + "ms)", reqUrl + "\\n-> " + d.url);
        addCandidate(seq, { label: tag, url: d.url, rawSrc: "qq", isTrial: false });
      }).catch(function(err) {
        if (seq === playSeq && isDebugActive()) {
          var msg = (err && err.name === "AbortError") ? ("超时(" + timeoutMs + "ms)") : ((err && err.message) || String(err));
          dbgLogPlay("err", "直连:" + tag, "失败: " + msg + " (" + (Date.now() - t0) + "ms)", reqUrl);
        }
      });
  });
}

function recordHistory(s) {
  if (!s || !s.norm_key) return;
  playHistory = playHistory.filter(function(x) { return x.norm_key !== s.norm_key; });
  playHistory.unshift({ id: s.id || 0, norm_key: s.norm_key, title: s.title, artist: s.artist, category: s.category || "", ext_source: s.ext_source || "", ext_id: s.ext_id || "" });
  if (playHistory.length > 40) playHistory = playHistory.slice(0, 40);
  localStorage.setItem("mh_history_v1", JSON.stringify(playHistory));
}

function fetchCloudPlay(s, seq, immediate, reason) {
  if (!immediate) {
    var waitMs = isStrictSongLocal(s) ? 2400 : 1500;
    setTimeout(function() {
      if (seq !== playSeq || cloudStarted) return;
      if (candidates.some(function(c) { return !c.isTrial; })) return;
      fetchCloudPlay(s, seq, true, "等待 " + waitMs + "ms 本地无有效完整源");
    }, waitMs);
    return;
  }
  if (cloudStarted) return;
  cloudStarted = true;
  var t0 = Date.now(), dbgOn = isDebugActive();
  var qUrl = "/api/play?id=" + (s.id || 0) + "&q=high&ext_source=" + encodeURIComponent(s.ext_source || "") + "&ext_id=" + encodeURIComponent(s.ext_id || "") + "&title=" + encodeURIComponent(s.title || "") + "&artist=" + encodeURIComponent(s.artist || "") + "&album=" + encodeURIComponent(s.album || "") + "&cover=" + encodeURIComponent(s.cover || "") + "&duration=" + (s.duration || 0);
  if (cloudSkips.length) qUrl += "&skip=" + encodeURIComponent(cloudSkips.join(",")) + "&force=1";
  if (dbgOn) { qUrl += "&debug=1"; dbgLogPlay("info", "云端兜底", (reason || "触发 /api/play 请求"), qUrl); }
  api(qUrl).then(function(res) {
    if (seq !== playSeq) return;
    cloudDone = true;
    if (res.songId) s.id = res.songId;
    if (dbgOn && Array.isArray(res.debugSources)) {
      res.debugSources.forEach(function(ds) {
        var lv = ds.status === "hit" ? "ok" : (ds.status === "disabled" ? "warn" : "err");
        var detail = (ds.route ? ("path: " + ds.route + "\\n") : "") + ((ds.trace || []).join("\\n"));
        dbgLogPlay(lv, "云端:" + ds.source, ds.status + " (" + (ds.ms || 0) + "ms)" + (ds.detail ? " · " + ds.detail : "") + (ds.error ? " · " + ds.error : ""), detail);
      });
    } else if (dbgOn && res.trace) {
      dbgLogPlay(res.error ? "err" : "ok", "云端Trace", "T" + (res.tier || "?") + " (" + (Date.now() - t0) + "ms)", res.trace.join(" | "));
    }
    if (!res.error && res.url) {
      addCandidate(seq, { label: "云端(" + (res.source || "ok") + ")", url: res.needProxy ? res.proxyUrl : res.url, rawUrl: res.url, rawSrc: res.source || "", isTrial: false, cloudSource: res.source || "" });
    } else if (!candidates.length) {
      document.getElementById("srcBar").innerHTML = '<span style="font-size:11px;color:var(--warn);">暂未匹配到完整源 (' + esc((res.trace || []).join(" | ")) + ')</span>';
      document.getElementById("dArtist").textContent = s.artist + " · 暂无可用完整源";
      setPlayIcon(false);
    } else if (candidates.every(function(x) { return x.isTrial; }) && candidates[0]) {
      pickCandidate(0, true);
      toast("该曲暂无完整版，已播放可用短版/试听");
    }
    fetchAllCloudSources(s, seq);
  }).catch(function(err) {
    cloudDone = true;
    if (seq === playSeq && dbgOn) dbgLogPlay("err", "云端兜底", "请求异常 (" + (Date.now() - t0) + "ms)", (err && err.message) || String(err));
    fetchAllCloudSources(s, seq);
  });
}

function fetchAllCloudSources(s, seq) {
  if (!s || seq !== playSeq || allCloudSeq === seq) return;
  allCloudSeq = seq;
  var dbgOn = isDebugActive();
  var qUrl = "/api/play?id=" + (s.id || 0) + "&q=high&all=1&ext_source=" + encodeURIComponent(s.ext_source || "") + "&ext_id=" + encodeURIComponent(s.ext_id || "") + "&title=" + encodeURIComponent(s.title || "") + "&artist=" + encodeURIComponent(s.artist || "") + "&album=" + encodeURIComponent(s.album || "") + "&cover=" + encodeURIComponent(s.cover || "") + "&duration=" + (s.duration || 0) + (dbgOn ? "&debug=1" : "");
  api(qUrl).then(function(res) {
    if (seq !== playSeq || !res) return;
    if (res.songId) s.id = res.songId;
    if (dbgOn && Array.isArray(res.debugSources)) {
      res.debugSources.forEach(function(ds) {
        var lv = ds.status === "hit" ? "ok" : (ds.status === "disabled" ? "warn" : "err");
        dbgLogPlay(lv, "全源:" + ds.source, ds.status + " (" + (ds.ms || 0) + "ms)" + (ds.detail ? " · " + ds.detail : "") + (ds.error ? " · " + ds.error : ""), (ds.trace || []).join("\\n"));
      });
    }
    var list = res.sources || [];
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      addCandidate(seq, {
        label: "云端(" + it.source + ")",
        url: it.needProxy ? it.proxyUrl : it.url,
        rawUrl: it.url,
        rawSrc: it.source,
        isTrial: false,
        cloudSource: it.source
      });
    }
  }).catch(function(){});
}

function playQueueIdx(idx) {
  if (idx < 0 || idx >= playQueue.length) return;
  curIdx = idx; var s = playQueue[idx]; curSong = s;
  playSeq++; var seq = playSeq; candidates = []; curCandIdx = -1; autoWaitMeta = false; cloudDone = false; cloudStarted = false; allCloudSeq = 0;
  audio.pause(); audio.removeAttribute("src"); audio.load(); setPlayIcon(false);

  dbgPlayLogs = [];
  dbgPlayHeader = "歌曲: " + s.title + " - " + s.artist + " | id=" + (s.id || 0) + " | norm_key=" + (s.norm_key || "") + " | ext=" + (s.ext_source || "-") + ":" + (s.ext_id || "-") + " | 预期时长=" + (s.duration || 0) + "s";
  if (isDebugActive()) dbgLogPlay("info", "开始点播", s.title + " - " + s.artist, "");

  recordHistory(s); updateDislikeBtn();
  if (radioMode && idx >= playQueue.length - 2) fetchRadioBatch(radioMode, true);

  document.getElementById("dTitle").textContent = s.title;
  document.getElementById("dArtist").textContent = s.artist + " · 本地多源匹配中...";
  document.getElementById("sTitle").textContent = s.title;
  document.getElementById("sArtist").textContent = s.artist;
  var bigCov = thumb(s.cover, 400);
  document.getElementById("sCov").src = bigCov;
  document.getElementById("dCov").src = thumb(s.cover, 120);
  document.getElementById("stageBlur").style.backgroundImage = s.cover ? ('url("' + bigCov.replace(/"/g, '\\\\"') + '")') : "none";
  updateFavBtn(); renderSrcBar(); syncActiveRowHighlight();

  fetchDirectVKeys(s, seq);
  fetchDirectGD(s, "joox", "JOOX(直连)", seq);
  fetchDirectGD(s, "netease", "网易(直连)", seq);

  cloudSkips = []; cloudRetries = 0;
  fetchCloudPlay(s, seq, false, "");

  api("/api/song?id=" + (s.id || 0) + "&ext_source=" + encodeURIComponent(s.ext_source || "") + "&ext_id=" + encodeURIComponent(s.ext_id || "") + "&title=" + encodeURIComponent(s.title || "") + "&artist=" + encodeURIComponent(s.artist || "")).then(function(d) {
    if (seq === playSeq) parseLrc((d.song && d.song.lyric_lrc) || "", (d.song && d.song.lyric_trans) || "");
  }).catch(function(){});
  updateMediaSession(s);
}

audio.addEventListener("error", function() {
  if (!audio.getAttribute("src")) return;
  var badC = candidates[curCandIdx];
  var errNames = { 1: "ABORTED(中断)", 2: "NETWORK(网络错误)", 3: "DECODE(解码失败)", 4: "SRC_NOT_SUPPORTED(格式/CORS/403)" };
  var codeTxt = audio.error ? (errNames[audio.error.code] || ("ERR_" + audio.error.code)) : "UNKNOWN";
  if (isDebugActive() && badC) dbgLogPlay("err", "Audio报错", badC.label + " 加载失败: " + codeTxt, badC.rawUrl || badC.url);
  if (curCandIdx >= 0 && curCandIdx + 1 < candidates.length) {
    pickCandidate(curCandIdx + 1, false);
    return;
  }
  if (curSong && !cloudStarted && !cloudDone) {
    fetchCloudPlay(curSong, playSeq, true, "本地候选播放报错(" + codeTxt + ")");
    return;
  }
  if (cloudDone) {
    autoWaitMeta = false; setPlayIcon(false);
    if (curSong) document.getElementById("dArtist").textContent = curSong.artist + " · 播放失败（可打开调试或换源）";
  }
});

audio.addEventListener("loadedmetadata", function() {
  var c = candidates[curCandIdx];
  var isShort = curSong && curSong.duration >= 90 && audio.duration > 0 && (audio.duration <= 65 || audio.duration < curSong.duration * 0.72);
  if (isDebugActive() && c) {
    dbgLogPlay(isShort ? "warn" : "ok", "Audio校验", c.label + " 实测时长=" + Math.round(audio.duration || 0) + "s / 预期=" + (curSong ? curSong.duration : 0) + "s -> " + (isShort ? "判定试听/短版拦截" : "通过"), "");
  }
  if (autoWaitMeta && isShort && c) {
    c.isTrial = true;
    var tag = audio.duration <= 65 ? "[试听]" : "[短版]";
    if (c.label.indexOf("[试听]") < 0 && c.label.indexOf("[短版]") < 0) c.label += tag;
    renderSrcBar();
    for (var i = 0; i < candidates.length; i++) { if (!candidates[i].isTrial) { pickCandidate(i, false); return; } }
    if (!cloudStarted) { fetchCloudPlay(curSong, playSeq, true, "本地候选均为试听/短版"); return; }
    if (c.cloudSource && cloudRetries < 2) {
      var srcTag = c.cloudSource.split(":")[0].replace("meting_injahow", "meting");
      if (cloudSkips.indexOf(srcTag) < 0) cloudSkips.push(srcTag);
      cloudRetries++; cloudDone = false; cloudStarted = false;
      document.getElementById("dArtist").textContent = curSong.artist + " · 跳过短版，自动匹配完整源...";
      fetchCloudPlay(curSong, playSeq, true, "云端返回短版，跳过 " + srcTag + " 重试");
      return;
    }
    if (cloudDone) {
      autoWaitMeta = false; audio.play().catch(function(){}); setPlayIcon(true);
      toast("全网仅匹配到短版/试听片段");
    }
    return;
  }
  if (autoWaitMeta && c) {
    autoWaitMeta = false; audio.play().catch(function(){}); setPlayIcon(true);
    document.getElementById("dArtist").textContent = (curSong ? curSong.artist : "") + " · " + c.label;
  }
});
audio.addEventListener("waiting", function() { if (curSong) document.getElementById("dArtist").textContent = curSong.artist + " · 缓冲中..."; });
audio.addEventListener("playing", function() { var c = candidates[curCandIdx]; if (curSong && c) document.getElementById("dArtist").textContent = curSong.artist + " · " + c.label; if (curSong) fetchAllCloudSources(curSong, playSeq); });

function setPlayIcon(p) {
  var i = p ? "&#10074;&#10074;" : "&#9654;";
  ["playFab", "playFabM", "playFabS"].forEach(function(id) { var el = document.getElementById(id); if (el) el.innerHTML = i; });
}
function togglePlay() { if (!audio.src) return; if (audio.paused) { audio.play(); setPlayIcon(true); } else { audio.pause(); setPlayIcon(false); } }
function toggleMode() {
  playMode = playMode === "loop" ? "one" : playMode === "one" ? "shuffle" : "loop";
  localStorage.setItem("mh_mode", playMode); syncModeBtns();
  toast("播放模式：" + document.getElementById("modeBtn").textContent);
}
function prevSong() { if (playQueue.length) playQueueIdx(curIdx > 0 ? curIdx - 1 : playQueue.length - 1); }
function nextSong() {
  if (!playQueue.length) return;
  if (playMode === "one") { audio.currentTime = 0; audio.play(); return; }
  if (playMode === "shuffle" && playQueue.length > 1) { var nxt = curIdx; while (nxt === curIdx) nxt = Math.floor(Math.random() * playQueue.length); playQueueIdx(nxt); return; }
  playQueueIdx((curIdx + 1) % playQueue.length);
}
function seekPct(v) { if (audio.duration) audio.currentTime = (v / 100) * audio.duration; }
function setVolume(v) { audio.volume = Number(v); audio.muted = false; localStorage.setItem("mh_vol", String(audio.volume)); document.getElementById("muteBtn").textContent = audio.volume === 0 ? "🔇" : "🔊"; }
function toggleMute() { audio.muted = !audio.muted; document.getElementById("muteBtn").textContent = audio.muted ? "🔇" : "🔊"; }

audio.addEventListener("ended", function() { if (stopAfterCurrent) { stopAfterCurrent = false; setPlayIcon(false); toast("本首播完，已定时停止"); return; } nextSong(); });
audio.addEventListener("timeupdate", function() {
  var c = audio.currentTime || 0, d = audio.duration || 0, ct = fmt(c), dt = fmt(d), pct = d > 0 ? ((c / d) * 100) : 0;
  document.getElementById("curT").textContent = ct; document.getElementById("durT").textContent = dt;
  document.getElementById("mCurT").textContent = ct; document.getElementById("mDurT").textContent = dt;
  document.getElementById("seek").value = pct; document.getElementById("mSeek").value = pct;
  var mf = document.getElementById("dockMiniFill"); if (mf) mf.style.width = pct.toFixed(2) + "%";
  highlightLrc(c);
});

function updateMediaSession(s) {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({ title: s.title, artist: s.artist, album: s.album || "Music Hub", artwork: s.cover ? [{ src: thumb(s.cover, 400), sizes: "400x400", type: "image/jpeg" }] : [] });
    navigator.mediaSession.setActionHandler("play", togglePlay); navigator.mediaSession.setActionHandler("pause", togglePlay);
    navigator.mediaSession.setActionHandler("previoustrack", prevSong); navigator.mediaSession.setActionHandler("nexttrack", nextSong);
  } catch {}
}

function isFav(s) { return s && favs.some(function(f) { return f.norm_key === s.norm_key; }); }
function saveFav(s) {
  if (isFav(s)) { favs = favs.filter(function(f) { return f.norm_key !== s.norm_key; }); toast("已取消喜欢"); }
  else { favs.unshift(s); sessionStorage.removeItem("mh_rec_sheets_v1"); toast("已加入喜欢"); }
  localStorage.setItem("mh_favs", JSON.stringify(favs)); updateFavBtn();
}
function toggleViewFav(i, btn) { var s = viewSongs[i]; if (!s) return; saveFav(s); var l = isFav(s); btn.classList.toggle("loved", l); btn.innerHTML = l ? "&#9829;" : "&#9825;"; }
function toggleCurFav() { if (curSong) saveFav(curSong); }
function updateFavBtn() { var l = isFav(curSong), el = document.getElementById("sFavBtn"); if (el) el.innerHTML = l ? "&#9829; 已收藏" : "&#9825; 收藏"; }

var lrcEl = document.getElementById("lrcBox");
["wheel", "touchstart"].forEach(function(ev) { lrcEl.addEventListener(ev, function() { userLrcScrollUntil = Date.now() + 3500; }, { passive: true }); });
function parseLrc(raw, transRaw) {
  lrcRows = []; var transMap = {};
  (transRaw || "").split(/\\r?\\n/).forEach(function(line) { var m = line.match(/\\[(\\d+):(\\d+(?:\\.\\d+)?)\\](.*)/); if (m) transMap[Math.round((Number(m[1]) * 60 + Number(m[2])) * 10)] = m[3].trim(); });
  (raw || "").split(/\\r?\\n/).forEach(function(line) { var m = line.match(/\\[(\\d+):(\\d+(?:\\.\\d+)?)\\](.*)/); if (m) { var t = Number(m[1]) * 60 + Number(m[2]), txt = m[3].trim(); if (txt) lrcRows.push({ t: t, txt: txt, tr: transMap[Math.round(t * 10)] || "" }); } });
  lrcEl.scrollTop = 0;
  if (!lrcRows.length) { lrcEl.innerHTML = '<div class="lrc-row">暂无同步歌词</div>'; return; }
  lrcEl.innerHTML = lrcRows.map(function(r, i) { return '<div class="lrc-row" id="lr' + i + '" onclick="seekLrc(' + i + ')">' + esc(r.txt) + (r.tr ? '<small>' + esc(r.tr) + '</small>' : '') + '</div>'; }).join("");
}
function seekLrc(i) { if (lrcRows[i] && audio.duration) { audio.currentTime = lrcRows[i].t; userLrcScrollUntil = 0; if (audio.paused) togglePlay(); } }
function highlightLrc(sec) {
  if (!lrcRows.length) return;
  var active = -1;
  for (var i = 0; i < lrcRows.length; i++) { if (sec >= lrcRows[i].t) active = i; else break; }
  var lines = lrcEl.querySelectorAll(".lrc-row");
  for (var j = 0; j < lines.length; j++) {
    if (j === active) {
      if (!lines[j].classList.contains("cur")) {
        lines[j].classList.add("cur");
        if (Date.now() > userLrcScrollUntil) {
          var targetTop = lines[j].offsetTop - lrcEl.clientHeight / 2 + lines[j].offsetHeight / 2;
          lrcEl.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        }
      }
    } else lines[j].classList.remove("cur");
  }
}

function openTimer() {
  openModal('<h3>睡眠定时关闭</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;"><button class="btn ghost" onclick="setSleepMin(15)">15 分钟后</button><button class="btn ghost" onclick="setSleepMin(30)">30 分钟后</button><button class="btn ghost" onclick="setSleepMin(60)">60 分钟后</button><button class="btn ghost" onclick="stopAfterCurrent=true;clearTimeout(timerId);closeModal();toast(\\'将在本首播放结束后停止\\')">播完当前单曲</button></div><div class="modal-row"><button class="btn danger" onclick="clearTimeout(timerId);stopAfterCurrent=false;closeModal();toast(\\'已取消定时\\')">取消定时</button><button class="btn" onclick="closeModal()">关闭</button></div>');
}
function setSleepMin(mins) {
  clearTimeout(timerId); stopAfterCurrent = false;
  timerId = setTimeout(function() { audio.pause(); setPlayIcon(false); toast("定时时间到，已暂停播放"); }, mins * 60000);
  closeModal(); toast("已设置 " + mins + " 分钟后停止播放");
}

document.getElementById("qInput").addEventListener("keydown", function(e) { if (e.key === "Enter") doSearch(1); });
document.addEventListener("keydown", function(e) {
  if (e.altKey && (e.key === "d" || e.key === "D")) { e.preventDefault(); toggleDebugWin(); return; }
  var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
  if (tag === "input" || tag === "textarea") return;
  if (e.code === "Space") { e.preventDefault(); togglePlay(); }
  else if (e.key === "ArrowLeft" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); prevSong(); }
  else if (e.key === "ArrowRight" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); nextSong(); }
  else if (e.key === "ArrowLeft" && audio.duration) { audio.currentTime = Math.max(0, audio.currentTime - 5); }
  else if (e.key === "ArrowRight" && audio.duration) { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); }
  else if (e.key === "m" || e.key === "M") { toggleMute(); }
});

["sCov", "dCov"].forEach(function(id) { var img = document.getElementById(id); if (img) img.onerror = function() { this.onerror = null; this.src = DEFAULT_COV; }; });

syncDbgBtn();
if (urlDbgFlag) toggleDebugWin(true);
var initShare = new URLSearchParams(location.search).get("share");
if (initShare) loadSharedPlaylist(initShare);
else nav("discover");
</script>
</body>
</html>`;
