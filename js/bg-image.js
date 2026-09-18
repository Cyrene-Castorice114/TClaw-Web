/* =========================================================
   背景图加载 —— 自动区分电脑端 / 手机端 API
   ---------------------------------------------------------
   · 宽度 ≥ 1024px → /acg/pc（横图）
   · 宽度 < 1024px → /acg/pe（竖图）
   · 手机端不用 kenburns 动画（省 GPU）
   ========================================================= */
(function () {
  'use strict';

  const CONFIG = {
    api:        'https://www.loliapi.com/acg/pc',
    mobileApi:  'https://www.loliapi.com/acg/pe',
    breakpoint: 1024,
    cacheBust:  false,
    timeout:    8000,
    retries:    1,
    minPixels:  200,
    kenBurns:   true,
    debug:      true,
  };

  const log  = (...a) => CONFIG.debug && console.log('[bg]', ...a);
  const warn = (...a) => CONFIG.debug && console.warn('[bg]', ...a);

  let resolveBg;
  window.__bgReady = new Promise(r => { resolveBg = r; });
  window.__bgDone  = false;

  boot();

  function boot() {
    const isMobile = window.innerWidth < CONFIG.breakpoint;

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

    setTimeout(finish, CONFIG.timeout * (CONFIG.retries + 1) + 1500);

    function pickApi() {
      const isM = window.innerWidth < CONFIG.breakpoint;
      const api = isM ? CONFIG.mobileApi : CONFIG.api;
      log(`宽度 ${window.innerWidth}px → ${isM ? '手机端' : '电脑端'} API`);
      return api;
    }

    function buildUrl() {
      const base = pickApi();
      if (!CONFIG.cacheBust) return base;
      const sep = base.includes('?') ? '&' : '?';
      return base + sep + '_t=' + Date.now();
    }

    let attempt = 0;
    function load() {
      attempt++;
      const url = buildUrl();
      log(`第 ${attempt} 次加载:`, url);

      const probe = new Image();
      let done = false;
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        warn(`超时 (${CONFIG.timeout}ms)`);
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
          retry();
          return;
        }

        imgLayer.style.backgroundImage = `url("${url}")`;
        void imgLayer.offsetWidth;
        imgLayer.classList.add('loaded');
        log('🎉 背景已应用');
        finish();
      };

      probe.onerror = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        warn('❌ 加载失败');
        retry();
      };

      probe.src = url;
    }

    function retry() {
      if (attempt >= CONFIG.retries) {
        warn(`已重试 ${CONFIG.retries} 次，放弃`);
        finish();
        return;
      }
      setTimeout(load, 400 * attempt);
    }

    load();

    window.BgImage = {
      reload: () => {
        attempt = 0;
        settled = false;
        window.__bgDone = false;
        load();
      },
      config: CONFIG,
    };
  }
})();