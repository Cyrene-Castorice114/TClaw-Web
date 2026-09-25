/* particle-fx.js —— 从元素方框边缘迸射粒子 */

(function () {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

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

  const CONFIG = {
    countDesktop: 14,
    countMobile:  9,
    speedMin: 3.5,
    speedMax: 9,
    sizeMin: 4,
    sizeMax: 9,
    lifeMin: 0.012,
    lifeMax: 0.026,
    gravity: 0.16,
    drag:    0.985,
    rotSpeedMin: -0.22,
    rotSpeedMax:  0.22,
    roundness: 0.28,
    glowDesktop: true,
    glowBlur:    10,
    mobileBreakpoint: 900,
    moveThreshold: 10,
    timeThreshold: 700,
    edgeOffset: 2,
  };

  const COLORS = [
    '#a78bfa', '#c4b5fd',
    '#f472b6', '#f0abfc',
    '#60a5fa', '#38bdf8',
    '#34d399', '#fbbf24',
  ];

  const SHAPES = ['circle', 'triangle', 'square', 'diamond', 'star', 'pentagon'];

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = arr => arr[(Math.random() * arr.length) | 0];
  const isMobile = () => window.innerWidth < CONFIG.mobileBreakpoint;

  const particles = [];
  let rafId = null;

  function spawnOnRect(rect) {
    const total = isMobile() ? CONFIG.countMobile : CONFIG.countDesktop;
    const { left, top, right, bottom, width, height } = rect;
    if (width <= 0 || height <= 0) return;

    const perimeter = 2 * (width + height);
    const topBottomCount = Math.max(3, Math.round(total * (2 * width) / perimeter));
    const leftRightCount = Math.max(3, Math.round(total * (2 * height) / perimeter));

    const topCount = Math.ceil(topBottomCount / 2);
    for (let i = 0; i < topCount; i++) {
      spawnParticle(left + Math.random() * width, top - CONFIG.edgeOffset, -Math.PI / 2);
    }

    const bottomCount = Math.floor(topBottomCount / 2);
    for (let i = 0; i < bottomCount; i++) {
      spawnParticle(left + Math.random() * width, bottom + CONFIG.edgeOffset, Math.PI / 2);
    }

    const leftCount = Math.ceil(leftRightCount / 2);
    for (let i = 0; i < leftCount; i++) {
      spawnParticle(left - CONFIG.edgeOffset, top + Math.random() * height, Math.PI);
    }

    const rightCount = Math.floor(leftRightCount / 2);
    for (let i = 0; i < rightCount; i++) {
      spawnParticle(right + CONFIG.edgeOffset, top + Math.random() * height, 0);
    }

    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function spawnParticle(x, y, baseAngle) {
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

  function drawShape(shape, size) {
    switch (shape) {
      case 'circle':   drawCircle(size);   break;
      case 'square':   drawSquare(size);   break;
      case 'triangle': drawTriangle(size); break;
      case 'diamond':  drawDiamond(size);  break;
      case 'star':     drawStar(size);     break;
      case 'pentagon': drawPentagon(size); break;
    }
  }

  function drawCircle(size) {
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
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

  function drawDiamond(size) {
    const r = size / 2;
    const pts = [
      { x: 0,  y: -r },
      { x:  r * 0.75, y: 0 },
      { x: 0,  y:  r },
      { x: -r * 0.75, y: 0 },
    ];
    roundedPolygon(pts, size * CONFIG.roundness * 0.9);
    ctx.fill();
  }

  function drawStar(size) {
    const r = size / 2;
    const inner = r * 0.45;
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const rad = (i % 2 === 0) ? r : inner;
      const ang = -Math.PI / 2 + (Math.PI / 5) * i;
      pts.push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad });
    }
    roundedPolygon(pts, size * 0.14);
    ctx.fill();
  }

  function drawPentagon(size) {
    const r = size / 2;
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const ang = -Math.PI / 2 + (Math.PI * 2 / 5) * i;
      pts.push({ x: Math.cos(ang) * r, y: Math.sin(ang) * r });
    }
    roundedPolygon(pts, size * CONFIG.roundness * 0.8);
    ctx.fill();
  }

  function roundedPolygon(points, radius) {
    const len = points.length;
    ctx.beginPath();

    for (let i = 0; i < len; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % len];
      const p3 = points[(i + 2) % len];

      const v1x = p2.x - p1.x, v1y = p2.y - p1.y;
      const v2x = p3.x - p2.x, v2y = p3.y - p2.y;

      const len1 = Math.hypot(v1x, v1y) || 1;
      const len2 = Math.hypot(v2x, v2y) || 1;

      const rr = Math.min(radius, len1 / 2, len2 / 2);

      const p2a = { x: p2.x - (v1x / len1) * rr, y: p2.y - (v1y / len1) * rr };
      const p2b = { x: p2.x + (v2x / len2) * rr, y: p2.y + (v2y / len2) * rr };

      if (i === 0) ctx.moveTo(p2a.x, p2a.y);
      else         ctx.lineTo(p2a.x, p2a.y);

      ctx.quadraticCurveTo(p2.x, p2.y, p2b.x, p2b.y);
    }

    ctx.closePath();
  }

  /* 触发选择器（去掉 .tag） */
  const TRIGGER_SELECTOR = [
    'button', 'a',
    '.card', '.section-card', '.friend-card',
    '.project-btn', '.project-dropdown',
    '.contact-btn', '.github-fab',
    '.readme-action', '.readme-close',
  ].join(',');

  let pointerStart = null;

  document.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.isPrimary === false) return;

    const target = e.target.closest(TRIGGER_SELECTOR);
    if (!target) return;

    pointerStart = {
      x: e.clientX, y: e.clientY,
      time: performance.now(),
      id: e.pointerId,
      target,
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

    if (dist > CONFIG.moveThreshold) return;
    if (dt > CONFIG.timeThreshold) return;

    if (target && target.isConnected) {
      spawnOnRect(target.getBoundingClientRect());
    }
  }, { passive: true });

  document.addEventListener('pointercancel', () => {
    pointerStart = null;
  }, { passive: true });

  window.ParticleFX = {
    spawnOnRect,
    get count() { return particles.length; },
    get canvas() { return canvas; },
  };
})();