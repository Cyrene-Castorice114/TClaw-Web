/* theme.js —— 主题切换按钮 */

(function () {
  'use strict';

  const COOKIE_KEY = 'tclaw_theme';
  const DARK  = 'dark';
  const LIGHT = 'light';

  function setCookie(name, value, days) {
    try {
      const exp = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
    } catch (e) {}
  }

  function getCookie(name) {
    try {
      const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }

  function getCurrent() {
    return document.documentElement.getAttribute('data-theme') || DARK;
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === LIGHT ? '#f5f5f7' : '#06070c');
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === DARK ? '切换到浅色模式' : '切换到深色模式');
      btn.classList.toggle('is-light', theme === LIGHT);
    }
  }

  function setManually(theme) {
    apply(theme);
    setCookie(COOKIE_KEY, theme, 365);
  }

  function createButton() {
    if (document.getElementById('themeToggle')) return;

    const btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', '切换主题');

    btn.innerHTML = `
      <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/><path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/><path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
      </svg>
      <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;

    document.body.appendChild(btn);
    btn.addEventListener('click', () => {
      setManually(getCurrent() === DARK ? LIGHT : DARK);
    });

    /* 同步按钮初始状态 */
    apply(getCurrent());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    createButton();
  }

  window.ThemeFX = {
    set: setManually,
    get current() { return getCurrent(); },
    toggle() { setManually(getCurrent() === DARK ? LIGHT : DARK); },
    clearCookie() {
      setCookie(COOKIE_KEY, '', -1);
    },
    get hasCookie() { return !!getCookie(COOKIE_KEY); },
  };
})();