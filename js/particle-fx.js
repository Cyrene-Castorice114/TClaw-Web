/* =========================================================
   particle-fx.js
   ---------------------------------------------------------
   点击按钮/链接/卡片时，从其方框边缘迸射粒子
   粒子沿方框四条边分布，垂直向外飞散
   粒子形状：圆形 / 圆角三角形 / 圆角正方形
   滑屏不触发
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
    /* 粒子数量 */
    countDesktop: 24,      // 桌面端总粒子数
    countMobile:  16,      // 手机端总粒子数

    /* 飞散速度 (px/frame) */
    speedMin: 4,
    speedMax: 10,

    /* 尺寸 (px) */
    sizeMin: 5,
    sizeMax: 10,

    /* 生命衰减 (每帧) */
    lifeMin: 0.012,
    lifeMax: 0.026,

    /* 物理 */
    gravity: 0.16,        // 重力
    drag:    0.985,       // 阻力

    /* 旋转 */
    rotSpeedMin: -0.22,
    rotSpeedMax:  0.22,

    /* 圆角比例 */
    roundness: 0.28,

    /* 发光 */
    glowDesktop: true,
    glowBlur:    10,

    /* 移动端 */
    mobileBreakpoint: 900,

    /* 触摸判定 */
    moveThreshold: 10,
    timeThreshold: 700,

    /* 外扩半径：粒子出生点相对边框的偏移 (px) */
    edgeOffset: 2,
  };

  const COLORS = [
    '#a78bfa',  // 紫
    '#c4b5fd',  // 浅紫
    '#f472b6',  // 粉
    '#f0abfc',  // 淡粉
    '#60a5fa',  // 蓝
    '#38bdf8',  // 天蓝
    '#34d399',  // 绿
    '#fbbf24',  // 琥珀
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
     6. 从方框边缘生成粒子
     ---------------------------------------------------------
     参数 rect：element.getBoundingClientRect()
     粒子沿四条边分布，垂直向外飞散
     ========================================================= */
  function spawnOnRect(rect) {
    const total = isMobile() ? CONFIG.countMobile : CONFIG.countDesktop;

    const left   = rect.left;
    const top    = rect.top;
    const right  = rect.right;
    const bottom = rect.bottom;
    const width  = rect.width;
    const height = rect.height;

    if (width <= 0 || height <= 0) return;

    /* 按周长比例分配粒子 */
    const perimeter = 2 * (width + height);
    const topBottomShare = (2 * width) / perimeter;   // 上下边占总长比例
    const leftRightShare = (2 * height) / perimeter;  // 左右边占总长比例

    const topBottomCount = Math.max(4, Math.round(total * topBottomShare));
    const leftRightCount = Math.max(4, Math.round(total * leftRightShare));

    /* ---- 上边：粒子朝上 ---- */
    const topCount = Math.ceil(topBottomCount / 2);
    for (let i = 0; i < topCount; i++) {
      const x = left + Math.random() * width;
      const y = top - CONFIG.edgeOffset;
      spawnParticle(x, y, -Math.PI / 2);
    }

    /* ---- 下边：粒子朝下 ---- */
    const bottomCount = Math.floor(topBottomCount / 2);
    for (let i = 0; i < bottomCount; i++) {
      const x = left + Math.random() * width;
      const y = bottom + CONFIG.edgeOffset;
      spawnParticle(x, y, Math.PI / 2);
    }

    /* ---- 左边：粒子朝左 ---- */
    const leftCount = Math.ceil(leftRightCount / 2);
    for (let i = 0; i < leftCount; i++) {
      const x = left - CONFIG.edgeOffset;
      const y = top + Math.random() * height;
      spawnParticle(x, y, Math.PI);
    }

    /* ---- 右边：粒子朝右 ---- */
    const rightCount = Math.floor(leftRightCount / 2);
    for (let i = 0; i < rightCount; i++) {
      const x = right + CONFIG.edgeOffset;
      const y = top + Math.random() * height;
      spawnParticle(x, y, 0);
    }

    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  /* 生成单个粒子：baseAngle 是主方向 */
  function spawnParticle(x, y, baseAngle) {
    /* 方向带 ±35° 随机偏角，看起来更自然 */
    const angle = baseAngle + rand(-0.6, 0.6);

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

  /* =========================================================
     10. 点击 / 滑动判定
     ---------------------------------------------------------
     记录 pointerdown 的目标元素、位置、时间
     pointerup 时比对：
       · 位移 < moveThreshold → 是点击
       · 时间 < timeThreshold → 不是长按
     满足后从目标元素方框边缘迸射粒子
     ========================================================= */
  let pointerStart = null;

  document.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.isPrimary === false) return;

    const target = e.target.closest(TRIGGER_SELECTOR);
    if (!target) return;

    pointerStart = {
      x:      e.clientX,
      y:      e.clientY,
      time:   performance.now(),
      id:     e.pointerId,
      target: target,        // 保存目标元素
    };
  }, { passive: true });

  document.addEventListener('pointerup', (e) => {
    if (!pointerStart) return;
    if (e.pointerId !== pointerStart.id) return;

    const dx = e.clientX - pointerStart.x;
    const dy = e.clientY - pointerStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt   = performance.now() - pointerStart.time;
    const target = pointerStart.target;

    pointerStart = null;

    /* 滑动 → 不触发 */
    if (dist > CONFIG.moveThreshold) return;

    /* 长按 → 不触发 */
    if (dt > CONFIG.timeThreshold) return;

    /* 从目标元素方框边缘迸射 */
    if (target && target.isConnected) {
      const rect = target.getBoundingClientRect();
      spawnOnRect(rect);
    }
  }, { passive: true });

  /* 手势被中断 → 清空状态 */
  document.addEventListener('pointercancel', () => {
    pointerStart = null;
  }, { passive: true });

  /* =========================================================
     11. 调试接口
     ========================================================= */
  window.ParticleFX = {
    spawnOnRect,
    get count() { return particles.length; },
    get canvas() { return canvas; },
  };

  console.log('[particle-fx] 已加载 ✅');
})();