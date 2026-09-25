/* title-fx.js —— 标签页标题特效 */

(function () {
  'use strict';

  const TITLE_DEFAULT = document.title || 'TClawの导航页';
  const TITLE_WELCOME = '欢迎回来>▽<!';
  const TITLE_AWAY    = '哇呜>x<...真的要离开吗？';
  const RESTORE_DELAY = 3000;

  let hasLeft = false;
  let restoreTimer = null;

  function handleVisibility() {
    if (document.hidden) {
      document.title = TITLE_AWAY;
      hasLeft = true;

      if (restoreTimer) {
        clearTimeout(restoreTimer);
        restoreTimer = null;
      }
    } else if (hasLeft) {
      document.title = TITLE_WELCOME;

      if (RESTORE_DELAY > 0) {
        if (restoreTimer) clearTimeout(restoreTimer);
        restoreTimer = setTimeout(() => {
          document.title = TITLE_DEFAULT;
          restoreTimer = null;
        }, RESTORE_DELAY);
      }
    }
  }

  document.addEventListener('visibilitychange', handleVisibility);

  window.TitleFX = {
    get current() { return document.title; },
    get hasLeft() { return hasLeft; },
    defaults: { TITLE_DEFAULT, TITLE_WELCOME, TITLE_AWAY, RESTORE_DELAY },
  };

  console.log('[title-fx] 已加载 ✅');
})();