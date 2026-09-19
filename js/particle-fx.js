/* =========================================================
   particle-fx.js
   ---------------------------------------------------------
   点击按钮/链接/卡片时，从点击点迸射粒子
   粒子形状：圆形 / 圆角三角形 / 圆角正方形
   ========================================================= */
(function () {
  'use strict';

  /* =========================================================
     1. 创建 canvas
     ========================================================= */
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  /* =========================================================
     2. 尺寸 & DPR
     ========================================================= */
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  /* =========================================================
     3. 配置
     ========================================================= */
  const CONFIG = {
    countDesktop: 18,
    countMobile:  12,

    speedMin: 3,
    speedMax: 9,

    sizeMin: 5,
    sizeMax: 11,

    lifeMin: 0.012,
    lifeMax: 0.026,

    gravity: 0.12,
    drag:    0.985,

    rotSpeedMin: -0.22,
    rotSpeedMax:  0.22,

    roundness: 0.28,

    glowDesktop: true,
    glowBlur:    10,

    mobileBreakpoint: 900,
  };

  const COLORS = [
    '#a78bfa',
    '#c4b5fd',
    '#f472b6',
    '#f0abfc',
    '#60a5fa',
    '#38bdf8',
    '#34d399',
    '#fbbf24',
  ];

  const SHAPES = ['circle', 'triangle', 'square'];

  /* =========================================================
     4. 工具
     ========================================================= */
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = arr => arr[(Math.random() * arr.length) | 0];
  const isMobile = () => window.innerWidth < CONFIG.mobileBreakpoint;

  /* =========================================================
     5. 粒子池
     ========================================================= */
  const particles = [];
  let rafId = null;

  /* =========================================================
     6. 生成
     ========================================================= */
  function spawn(x, y) {
    const count = isMobile() ? CONFIG.countMobile : CONFIG.countDesktop;

    for (let i = 0; i < count; i++) {
      const baseAngle = (Math.PI * 2 * i) / count;
      const angle     = baseAngle + rand(-0.4, 0.4);
      const speed = rand(CONFIG.speedMin, CONFIG.speedMax);
      const size  = rand(CONFIG.sizeMin, CONFIG.sizeMax);

      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        size,
        shape: pick(SHAPES),
        color: pick(COLORS),

        rot:  rand(0, Math.PI * 2),
        vrot: rand(CONFIG.rotSpeedMin, CONFIG.rotSpeedMax),

        life: 1,
        decay: rand(CONFIG.lifeMin, CONFIG.lifeMax),
      });
    }

    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  /* =========================================================
     7. 主循环
     ========================================================= */
  function tick() {
    ctx.clearRect(0, 0, W, H);

    const glow = !isMobile() && CONFIG.glowDesktop;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += CONFIG.gravity;
      p.vx *= CONFIG.drag;
      p.vy *= CONFIG.drag;
      p.rot += p.vrot;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;

      if (glow) {
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = CONFIG.glowBlur * p.life;
      }

      drawShape(p.shape, p.size);
      ctx.restore();
    }

    if (particles.length > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
      ctx.clearRect(0, 0, W, H);
    }
  }

  /* =========================================================
     8. 绘制形状
     ========================================================= */
  function drawShape(shape, size) {
    switch (shape) {
      case 'circle':   drawCircle(size);   break;
      case 'square':   drawSquare(size);   break;
      case 'triangle': drawTriangle(size); break;
    }
  }

  function drawCircle(size) {
    const r = size / 2;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  function drawSquare(size) {
    const h = size / 2;
    const r = Math.min(size * CONFIG.roundness, h);

    ctx.beginPath();
    ctx.moveTo(-h + r, -h);
    ctx.lineTo( h - r, -h);
    ctx.quadraticCurveTo( h, -h,  h, -h + r);
    ctx.lineTo( h,  h - r);
    ctx.quadraticCurveTo( h,  h,  h - r,  h);
    ctx.lineTo(-h + r,  h);
    ctx.quadraticCurveTo(-h,  h, -h,  h - r);
    ctx.lineTo(-h, -h + r);
    ctx.quadraticCurveTo(-h, -h, -h + r, -h);
    ctx.closePath();
    ctx.fill();
  }

  function drawTriangle(size) {
    const r = size / 2;
    const pts = [
      { x: 0,          y: -r       },
      { x:  r * 0.866, y:  r * 0.5 },
      { x: -r * 0.866, y:  r * 0.5 },
    ];
    roundedPolygon(pts, size * CONFIG.roundness);
    ctx.fill();
  }

  function roundedPolygon(points, radius) {
    const len = points.length;
    ctx.beginPath();

    for (let i = 0; i < len; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % len];
      const p3 = points[(i + 2) % len];

      const v1x = p2.x - p1.x;
      const v1y = p2.y - p1.y;
      const v2x = p3.x - p2.x;
      const v2y = p3.y - p2.y;

      const len1 = Math.hypot(v1x, v1y) || 1;
      const len2 = Math.hypot(v2x, v2y) || 1;

      const rr = Math.min(radius, len1 / 2, len2 / 2);

      const p2a = {
        x: p2.x - (v1x / len1) * rr,
        y: p2.y - (v1y / len1) * rr,
      };
      const p2b = {
        x: p2.x + (v2x / len2) * rr,
        y: p2.y + (v2y / len2) * rr,
      };

      if (i === 0) ctx.moveTo(p2a.x, p2a.y);
      else         ctx.lineTo(p2a.x, p2a.y);

      ctx.quadraticCurveTo(p2.x, p2.y, p2b.x, p2b.y);
    }

    ctx.closePath();
  }

  /* =========================================================
     9. 触发选择器
     ========================================================= */
  const TRIGGER_SELECTOR = [
    'button',
    'a',
    '.card',
    '.section-card',
    '.friend-card',
    '.project-btn',
    '.project-dropdown',
    '.contact-btn',
    '.github-fab',
    '.tag',
    '.readme-action',
    '.readme-close',
    '.leave-btn',
  ].join(',');

  document.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.isPrimary === false) return;

    const target = e.target.closest(TRIGGER_SELECTOR);
    if (!target) return;

    spawn(e.clientX, e.clientY);
  }, { passive: true });

  /* =========================================================
     10. 调试接口
     ========================================================= */
  window.ParticleFX = {
    spawn,
    get count() { return particles.length; },
    get canvas() { return canvas; },
  };

  console.log('[particle-fx] 已加载 ✅');
})();