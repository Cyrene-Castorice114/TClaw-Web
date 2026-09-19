/* =========================================================
   theme.js
   ---------------------------------------------------------
   主题切换（深色 / 浅色）
   · 自动读取 localStorage
   · 首次访问跟随系统偏好
   · 切换按钮动态插入到左上角
   ========================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'tclaw_theme';
  const THEME_DARK  = 'dark';
  const THEME_LIGHT = 'light';

  /* ---------- 读取初始主题 ---------- */
  function getInitialTheme() {
    /* 1. localStorage */
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === THEME_DARK || saved === THEME_LIGHT) return saved;
    } catch (e) {}

    /* 2. 跟随系统偏好 */
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return THEME_LIGHT;
    }

    /* 3. 默认深色 */
    return THEME_DARK;
  }

  /* ---------- 应用主题 ---------- */
  function applyTheme(theme) {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);

    /* 同步浏览器 UI 颜色 */
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === THEME_LIGHT ? '#f5f5f7' : '#06070c');
    }

    /* 更新按钮图标 */
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-label',
        theme === THEME_DARK ? '切换到浅色模式' : '切换到深色模式');
      btn.classList.toggle('is-light', theme === THEME_LIGHT);
    }
  }

  /* ---------- 保存 ---------- */
  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  /* ---------- 立即应用（在 DOM ready 前） ---------- */
  applyTheme(getInitialTheme());

  /* ---------- 创建切换按钮 ---------- */
  function createToggleButton() {
    if (document.getElementById('themeToggle')) return;

    const btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', '切换主题');

    /* 双图标：太阳/月亮，CSS 控制显隐 */
    btn.innerHTML = `
      <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/>
        <path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/>
        <path d="m19.07 4.93-1.41 1.41"/>
      </svg>
      <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;

    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || THEME_DARK;
      const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
      applyTheme(next);
      saveTheme(next);
    });
  }

  /* ---------- 跟随系统变化（当用户没手动切过） ---------- */
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      /* 用户没手动存过 → 跟随系统 */
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
        }
      } catch (err) {}
    });
  }

  /* ---------- DOM ready 后创建按钮 ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createToggleButton);
  } else {
    createToggleButton();
  }

  /* ---------- 暴露接口 ---------- */
  window.ThemeFX = {
    set(theme) {
      if (theme !== THEME_DARK && theme !== THEME_LIGHT) return;
      applyTheme(theme);
      saveTheme(theme);
    },
    get current() {
      return document.documentElement.getAttribute('data-theme');
    },
    toggle() {
      const current = document.documentElement.getAttribute('data-theme') || THEME_DARK;
      const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
      applyTheme(next);
      saveTheme(next);
    },
  };

  console.log('[theme] 已加载 ✅');
})();