/* =========================================================
   点击屏幕 → 随机飘出一句话
   ---------------------------------------------------------
   · 手机上滑屏不会触发（只响应 tap / 点击）
   · 手机端性能优化：同时存在更少、间隔更长
   ========================================================= */
(function () {
  'use strict';

  const TEXTS = [
    'あなたが好きです',
    'I love you',
    '2026 What you want comes true',
    '2026心想事成',
    '2026成功したい',
  ];

  const isTouchDevice =
    window.matchMedia('(pointer: coarse)').matches ||
    ('ontouchstart' in window) ||
    navigator.maxTouchPoints > 0;

  const isMobile = window.innerWidth < 900;

  const OPTIONS = {
    maxAlive:   isMobile ? 6 : 18,
    minGap:     isMobile ? 120 : 55,
    duration:   [1400, 2000],
    rise:       [70, 120],
    rotate:     [-5, 5],
    spread:     28,
    mobileSpread: 0,
    touchYOffset: -28,
    edgePad:    14,
    hues:       [265, 220, 195, 330, 300, 45],
    ignoreInteractive: false,
    moveThreshold: 12,
    timeThreshold: 900,
  };

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = arr => arr[(Math.random() * arr.length) | 0];

  function clamp(v, min, max) {
    if (min > max) return (min + max) / 2;
    return Math.min(Math.max(v, min), max);
  }

  const layer = document.createElement('div');
  layer.className = 'fx-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  let alive    = 0;
  let lastTime = 0;

  function spawn(x, y) {
    if (alive >= OPTIONS.maxAlive) return;

    const now = performance.now();
    if (now - lastTime < OPTIONS.minGap) return;
    lastTime = now;

    const text = pick(TEXTS);

    const el = document.createElement('div');
    el.className = 'fx';
    el.textContent = text;
    el.style.setProperty('--hue', pick(OPTIONS.hues));
    layer.appendChild(el);

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const halfW = w / 2;
    const halfH = h / 2;
    const pad = OPTIONS.edgePad;

    const spread = isTouchDevice ? OPTIONS.mobileSpread : OPTIONS.spread;
    const yOffset = isTouchDevice ? OPTIONS.touchYOffset : 0;

    let cx, cy;

    if (w + pad * 2 > window.innerWidth) {
      cx = window.innerWidth / 2;
    } else {
      cx = clamp(
        x + rand(-spread, spread),
        halfW + pad,
        window.innerWidth - halfW - pad
      );
    }

    if (h + pad * 2 > window.innerHeight) {
      cy = window.innerHeight / 2;
    } else {
      cy = clamp(
        y + yOffset + rand(-spread, spread),
        halfH + pad,
        window.innerHeight - halfH - pad
      );
    }

    const dur  = rand(OPTIONS.duration[0], OPTIONS.duration[1]);
    const rise = rand(OPTIONS.rise[0], OPTIONS.rise[1]);
    const rot  = rand(OPTIONS.rotate[0], OPTIONS.rotate[1]);

    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    el.style.setProperty('--dur',  dur.toFixed(0) + 'ms');
    el.style.setProperty('--rise', rise.toFixed(0) + 'px');
    el.style.setProperty('--rot',  rot.toFixed(2) + 'deg');

    alive++;
    requestAnimationFrame(() => el.classList.add('play'));

    setTimeout(() => {
      el.remove();
      alive--;
    }, dur + 150);
  }

  let pointerStart = null;

  document.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.isPrimary === false) return;

    if (OPTIONS.ignoreInteractive &&
        e.target.closest('a, button, input, textarea, select')) {
      return;
    }

    pointerStart = {
      x:    e.clientX,
      y:    e.clientY,
      time: performance.now(),
      id:   e.pointerId,
    };
  }, { passive: true });

  document.addEventListener('pointerup', (e) => {
    if (!pointerStart) return;
    if (e.pointerId !== pointerStart.id) return;

    const dx = e.clientX - pointerStart.x;
    const dy = e.clientY - pointerStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt   = performance.now() - pointerStart.time;

    pointerStart = null;

    if (dist > OPTIONS.moveThreshold) return;
    if (dt > OPTIONS.timeThreshold) return;

    spawn(e.clientX, e.clientY);
  }, { passive: true });

  document.addEventListener('pointercancel', () => {
    pointerStart = null;
  }, { passive: true });

  window.ClickFX = {
    spawn,
    texts: TEXTS,
    options: OPTIONS,
    get isTouchDevice() { return isTouchDevice; },
  };
})();