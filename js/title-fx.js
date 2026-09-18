/* =========================================================
   title-fx.js
   ---------------------------------------------------------
   1. 切到其它标签 → 标题改为「哇呜>x<...真的要离开吗？」
   2. 切回来       → 标题改为「欢迎回来>▽<!」，3 秒后恢复
   3. 关闭标签时   → 标题改为「确认离开吗？」+ 浏览器原生确认框
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 可调参数 ---------- */

  /* 标题文案 */
  const TITLE_DEFAULT = document.title;         // 原始标题
  const TITLE_WELCOME = '欢迎回来* >▽< *!';          // 切回来
  const TITLE_AWAY    = '哇呜>x<...真的要离开吗？'; // 切走
  const TITLE_CONFIRM = '确认离开吗？';           // 关闭标签时

  /* 切回来后多少毫秒恢复默认标题（0 = 不恢复） */
  const RESTORE_DELAY = 3000;

  /* 关闭标签时的文案（浏览器不显示，仅作为 returnValue） */
  const AWAY_MESSAGE = '哇呜...>x<...真...真的想要让TClaw一个人待在这里喵？';

  /* 是否启用关闭标签挽留 */
  const ENABLE_BEFOREUNLOAD = true;

  /* ---------- 状态 ---------- */
  let hasLeft = false;
  let restoreTimer = null;

  /* =========================================================
     1. 标签切换
     ========================================================= */
  function handleVisibility() {
    if (document.hidden) {
      /* 切到其它标签 / 最小化 */
      document.title = TITLE_AWAY;
      hasLeft = true;

      /* 取消正在等待的恢复定时器 */
      if (restoreTimer) {
        clearTimeout(restoreTimer);
        restoreTimer = null;
      }
    } else if (hasLeft) {
      /* 切回来 */
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

  /* =========================================================
     2. 关闭标签挽留
     ---------------------------------------------------------
     浏览器会显示它自己的默认文案（无法自定义），
     但我们可以把标题改成「确认离开吗？」。
     ========================================================= */
  if (ENABLE_BEFOREUNLOAD) {
    window.addEventListener('beforeunload', (e) => {
      /* 把标签页标题改成「确认离开吗？」 */
      document.title = TITLE_CONFIRM;

      /* 触发浏览器原生确认框 */
      e.preventDefault();
      e.returnValue = AWAY_MESSAGE;
      return AWAY_MESSAGE;
    });

    /* 用户留在页面（点「取消」）时，恢复标题 */
    window.addEventListener('focus', () => {
      /* 稍微延迟，等浏览器处理完 beforeunload */
      setTimeout(() => {
        if (document.title === TITLE_CONFIRM) {
          document.title = hasLeft ? TITLE_WELCOME : TITLE_DEFAULT;
        }
      }, 50);
    });
  }

  /* ---------- 暴露接口，方便调试 ---------- */
  window.TitleFX = {
    setDefault(t) { /* 手动改默认标题 */
      window.__titleDefault = t;
    },
    get state() {
      return {
        hasLeft,
        currentTitle: document.title,
        TITLE_DEFAULT,
        TITLE_WELCOME,
        TITLE_AWAY,
        TITLE_CONFIRM,
      };
    },
  };
})();