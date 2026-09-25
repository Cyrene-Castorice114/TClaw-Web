/* bg-image.js —— 背景图加载 */

(function () {
  'use strict';

  const CONFIG = {
    api:        'https://www.loliapi.com/acg/pc',
    mobileApi:  'https://www.loliapi.com/acg/pe',
    breakpoint: 1024,
    timeout:    15000,
    minPixels:  100,
    minBlobSize: 3000,

    cacheName:  'tclaw-bg-cache-v5',
    cacheEntry: '/bg-current',
    metaKey:    'tclaw_bg_meta_v5',
    ttl:        60 * 60 * 1000,

    fallbacks: [
      'assets/background/1.jpg',
    ],

    debug: true,
  };

  const log  = (...a) => CONFIG.debug && console.log('[bg]', ...a);
  const warn = (...a) => CONFIG.debug && console.warn('[bg]', ...a);

  let resolveBg;
  window.__bgReady = new Promise(r => { resolveBg = r; });
  window.__bgDone  = false;
  window.__bgUrl   = '';
  window.__bgBlob  = null;

  const isMobile = window.innerWidth < CONFIG.breakpoint;

  const imgLayer = document.createElement('div');
  imgLayer.className = 'bg-image' + (isMobile ? '' : ' kenburns');
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
  setTimeout(finish, 20000);

  let currentBlobUrl = null;

  function applyUrl(url) {
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
    }
    window.__bgBlob = null;
    window.__bgUrl  = url;
    imgLayer.style.backgroundImage = `url("${url}")`;
    void imgLayer.offsetWidth;
    imgLayer.classList.add('loaded');
    log('✅ 已应用 (url):', url);
  }

  function applyBlob(blob, originalUrl) {
    if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = URL.createObjectURL(blob);
    window.__bgBlob = blob;
    window.__bgUrl  = originalUrl || '';
    imgLayer.style.backgroundImage = `url("${currentBlobUrl}")`;
    void imgLayer.offsetWidth;
    imgLayer.classList.add('loaded');
    log('✅ 已应用 (blob):', blob.size, 'bytes');
  }

  function readMeta() {
    try {
      const raw = localStorage.getItem(CONFIG.metaKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function writeMeta(data) {
    try { localStorage.setItem(CONFIG.metaKey, JSON.stringify(data)); } catch (e) {}
  }

  async function cacheRead() {
    if (!('caches' in window)) return null;
    try {
      const cache = await caches.open(CONFIG.cacheName);
      const res = await cache.match(CONFIG.cacheEntry);
      if (!res) return null;
      const blob = await res.blob();
      return blob.size >= CONFIG.minBlobSize ? blob : null;
    } catch (e) { return null; }
  }

  async function cacheWrite(blob) {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open(CONFIG.cacheName);
      await cache.put(CONFIG.cacheEntry, new Response(blob));
    } catch (e) {}
  }

  async function cacheClear() {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open(CONFIG.cacheName);
      await cache.delete(CONFIG.cacheEntry);
    } catch (e) {}
  }

  async function fetchBlob(url, timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout || CONFIG.timeout);
    try {
      const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const blob = await res.blob();
      if (blob.size < CONFIG.minBlobSize) throw new Error('blob too small');
      return blob;
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  }

  function loadImg(url, timeout) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      let done = false;

      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        img.onload = img.onerror = null;
        img.src = '';
        reject(new Error('timeout'));
      }, timeout || CONFIG.timeout);

      img.onload = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (img.naturalWidth < CONFIG.minPixels) {
          reject(new Error('too small'));
          return;
        }
        resolve(img);
      };

      img.onerror = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        reject(new Error('load error'));
      };

      img.src = url;
    });
  }

  async function boot() {
    const meta = readMeta();

    if (meta && meta.url && Date.now() - meta.time < CONFIG.ttl) {
      const blob = await cacheRead();
      if (blob) {
        log('命中缓存 blob');
        applyBlob(blob, meta.url);
        finish();
        return;
      }
    }

    await loadNew();
  }

  async function loadNew() {
    const url = isMobile ? CONFIG.mobileApi : CONFIG.api;
    log('拉取新图:', url);

    try {
      const blob = await fetchBlob(url);
      log('fetch 成功:', blob.size, 'bytes');
      applyBlob(blob, url);
      cacheWrite(blob);
      writeMeta({ url, time: Date.now() });
      finish();
      return;
    } catch (e) {
      warn('fetch 失败:', e.message);
    }

    try {
      await loadImg(url);
      log('img 加载成功');
      applyUrl(url);
      writeMeta({ url, time: Date.now() });
      finish();
      return;
    } catch (e) {
      warn('img 加载失败:', e.message);
    }

    await useFallback();
  }

  async function useFallback() {
    const list = CONFIG.fallbacks;
    if (!list.length) { finish(); return; }

    for (const url of list) {
      const ok = await new Promise((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => {
          img.onload = img.onerror = null;
          img.src = '';
          resolve(false);
        }, 6000);

        img.onload = () => {
          clearTimeout(timer);
          resolve(img.naturalWidth > 0);
        };
        img.onerror = () => {
          clearTimeout(timer);
          resolve(false);
        };
        img.src = url;
      });

      if (ok) {
        log('✅ 使用本地兜底:', url);
        applyUrl(url);
        finish();
        return;
      }
      warn('本地图不存在或加载失败:', url);
    }

    warn('所有兜底都失败');
    finish();
  }

  window.BgImage = {
    async getBlob() {
      if (window.__bgBlob) return window.__bgBlob;
      const blob = await cacheRead();
      if (blob) return blob;
      if (window.__bgUrl && !window.__bgUrl.startsWith('blob:')) {
        try { return await fetchBlob(window.__bgUrl); } catch (e) {}
      }
      return null;
    },

    getUrl: () => window.__bgUrl,
    hasBlob: () => !!window.__bgBlob,

    async clearCache() {
      await cacheClear();
      try { localStorage.removeItem(CONFIG.metaKey); } catch (e) {}
      window.__bgBlob = null;
      window.__bgUrl  = '';
    },

    async reload() {
      await window.BgImage.clearCache();
      settled = false;
      window.__bgDone = false;
      loadNew();
    },

    config: CONFIG,
  };

  boot();
})();