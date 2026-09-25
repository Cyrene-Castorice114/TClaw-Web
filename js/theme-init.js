/* theme-init.js —— 首屏初始主题（必须放在 CSS 前） */

(function () {
  'use strict';

  const COOKIE_KEY = 'tclaw_theme';
  const DARK  = 'dark';
  const LIGHT = 'light';

  function getCookie(name) {
    try {
      const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }

  /* 1. 优先读 cookie */
  let theme = getCookie(COOKIE_KEY);

  /* 2. 没 cookie → 按时间判断 */
  if (theme !== DARK && theme !== LIGHT) {
    const h = new Date().getHours();
    theme = (h >= 6 && h < 18) ? LIGHT : DARK;
  }

  /* 3. 写入 <html data-theme> */
  document.documentElement.setAttribute('data-theme', theme);

  /* 4. 同步 theme-color */
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === LIGHT ? '#f5f5f7' : '#06070c');
})();