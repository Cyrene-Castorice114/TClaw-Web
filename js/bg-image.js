/* =========================================================
   bg-image.js
   ---------------------------------------------------------
   · 自动区分电脑端 / 手机端 API
   · localStorage 缓存（6 小时换一次）
   · API 失败 → 本地兜底图
   · 请求结束主动释放，不挂住浏览器
   ========================================================= */
(function () {
  'use strict';

  const CONFIG = {
    api:        'https://www.loliapi.com/acg/pc',
    mobileApi:  'https://www.loliapi.com/acg/pe',
    breakpoint: 1024,
    timeout:    8000,
    retries:    1,
    minPixels:  200,
    kenBurns:   true,
    debug:      true,

    /* 缓存 */
    cacheKey:   'tclaw_bg_cache_v1',
    cacheTTL:   6 * 60 * 60 * 1000,   // 6 小时

    /* 本地兜底（如果 API 全挂） */
    fallbacks: [
      'assets/bg/fallback-1.jpg',
      'assets/bg/fallback-2.jpg',
      'assets/bg/fallback-3.jpg',
    ],
  };

  const log  = (...a) => CONFIG.debug && console.log('[bg]', ...a);
  const warn = (...a) => CONFIG.debug && console.warn('[bg]', ...a);

  let resolveBg;
  window.__bgReady = new Promise(r => { resolveBg = r; });
  window.__bgDone  = false;

  boot();

  function boot() {
    const isMobile = window.innerWidth < CONFIG.breakpoint;

    /* ---- DOM ---- */
    const imgLayer = document.createElement('div');
    const useKenBurns = CONFIG.kenBurns && !isMobile;
    imgLayer.className = 'bg-image' + (useKenBurns ? ' kenburns' : '');
    const mask = document.createElement('div');
    mask.className = 'bg-mask';
    document.body.prepend(mask);
    document.body.prepend(imgLayer);
    document.body.classList.add('has-bg');

    let settled = false;
    function finish() {
      if (settled) return;
      settled = true;
      window.__bgDone = true;
      resolveBg();
    }

    /* ---- 应用背景 ---- */
    function apply(url) {
      imgLayer.style.backgroundImage = `url("${url}")`;
      void imgLayer.offsetWidth;
      imgLayer.classList.add('loaded');
      log('🎉 背景已应用:', url);
    }

    /* ---- 1. 检查缓存 ---- */
    try {
      const raw = localStorage.getItem(CONFIG.cacheKey);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && cached.url && Date.now() - cached.time < CONFIG.cacheTTL) {
          log('命中缓存:', cached.url);

          /* 缓存图预加载后应用 */
          const img = new Image();
          img.onload = () => { apply(cached.url); finish(); };
          img.onerror = () => {
            warn('缓存图失效，重新拉取');
            localStorage.removeItem(CONFIG.cacheKey);
            load();
          };
          img.src = cached.url;
          return;
        }
      }
    } catch (e) { /* ignore */ }

    /* ---- 2. 从 API 加载 ---- */
    function pickApi() {
      const isM = window.innerWidth < CONFIG.breakpoint;
      return isM ? CONFIG.mobileApi : CONFIG.api;
    }

    let attempt = 0;
    function load() {
      attempt++;
      const url = pickApi();
      log(`第 ${attempt} 次加载:`, url);

      const probe = new Image();
      let done = false;

      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        warn(`超时 (${CONFIG.timeout}ms)`);
        probe.src = '';
        retry();
      }, CONFIG.timeout);

      probe.onload = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);

        const w = probe.naturalWidth;
        log(`✅ ${w}×${probe.naturalHeight}`);

        if (w && w < CONFIG.minPixels) {
          warn(`图片太小 (${w}px)，丢弃重试`);
          probe.src = '';
          retry();
          return;
        }

        apply(url);

        /* 存缓存 */
        try {
          localStorage.setItem(CONFIG.cacheKey, JSON.stringify({
            url, time: Date.now(),
          }));
        } catch (e) { /* ignore */ }

        probe.src = '';
        finish();
      };

      probe.onerror = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        warn('❌ 加载失败');
        probe.src = '';
        retry();
      };

      probe.src = url;
    }

    function retry() {
      if (attempt >= CONFIG.retries) {
        warn(`已重试 ${CONFIG.retries} 次，使用本地兜底`);
        useFallback();
        return;
      }
      setTimeout(load, 400 * attempt);
    }

    /* ---- 3. 本地兜底 ---- */
    function useFallback() {
      const list = CONFIG.fallbacks;
      if (!list.length) { finish(); return; }

      const url = list[(Math.random() * list.length) | 0];
      log('使用本地兜底:', url);

      const img = new Image();
      img.onload = () => { apply(url); finish(); };
      img.onerror = () => { warn('本地兜底也失败了'); finish(); };
      img.src = url;
    }

    /* 硬超时兜底 */
    setTimeout(finish, CONFIG.timeout * (CONFIG.retries + 1) + 1500);

    load();

    window.BgImage = {
      reload: () => {
        try { localStorage.removeItem(CONFIG.cacheKey); } catch (e) {}
        attempt = 0;
        settled = false;
        window.__bgDone = false;
        load();
      },
      clearCache: () => {
        try { localStorage.removeItem(CONFIG.cacheKey); } catch (e) {}
      },
      config: CONFIG,
    };
  }
})();