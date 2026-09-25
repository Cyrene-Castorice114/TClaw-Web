/* leave-warning.js —— 离开本站确认提示 */

(function () {
  'use strict';

  const SITE_HOST = 'tclaw.mengniang.ink';

  /* ---------- 等粒子消失 ---------- */
  function waitParticlesEmpty() {
    return new Promise((resolve) => {
      if (!window.ParticleFX || window.ParticleFX.count === 0) {
        resolve();
        return;
      }

      const id = setInterval(() => {
        if (!window.ParticleFX || window.ParticleFX.count === 0) {
          clearInterval(id);
          resolve();
        }
      }, 40);

      setTimeout(() => {
        clearInterval(id);
        resolve();
      }, 3000);
    });
  }

  /* ---------- 弹窗 DOM ---------- */
  function createModal() {
    let modal = document.getElementById('leaveWarning');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.className = 'leave-warning';
    modal.id = 'leaveWarning';
    modal.innerHTML = `
      <div class="leave-panel">
        <div class="leave-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <h2 class="leave-title">即将离开本站</h2>
        <p class="leave-sub">呜哇...>x< 真...真的要离开这里嘛？外面这么危险...不如多待一会喵...</p>

        <div class="leave-url">
          <span class="leave-url-label">目标网站</span>
          <span class="leave-url-value" id="leaveUrlValue">—</span>
        </div>

        <div class="leave-actions">
          <button class="leave-btn leave-btn-back" type="button" id="leaveBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span>返回上级</span>
          </button>
          <button class="leave-btn leave-btn-go" type="button" id="leaveGo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
            <span>立即跳转</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#leaveBack').addEventListener('click', close);

    modal.querySelector('#leaveGo').addEventListener('click', async (e) => {
      const target = modal.dataset.url;
      const blank  = modal.dataset.blank === '1';
      if (!target) return;

      const btn = e.currentTarget;

      /* 在按钮上迸射粒子 */
      if (window.ParticleFX && window.ParticleFX.spawnOnRect) {
        window.ParticleFX.spawnOnRect(btn.getBoundingClientRect());
      }

      /* 等粒子全部消失 */
      await waitParticlesEmpty();

      close();

      if (blank) window.open(target, '_blank', 'noopener,noreferrer');
      else window.location.href = target;
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    return modal;
  }

  let lastFocused = null;

  function open(url, blank) {
    const modal = createModal();

    let host = url;
    try { host = new URL(url).hostname; } catch (e) {}

    modal.querySelector('#leaveUrlValue').textContent = host;
    modal.dataset.url   = url;
    modal.dataset.blank = blank ? '1' : '0';

    lastFocused = document.activeElement;
    modal.classList.add('open');

    setTimeout(() => {
      const btn = modal.querySelector('#leaveBack');
      if (btn) btn.focus();
    }, 50);
  }

  function close() {
    const modal = document.getElementById('leaveWarning');
    if (!modal) return;
    modal.classList.remove('open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  /* ---------- 是否外部链接 ---------- */
  function isExternal(href) {
    if (!href) return false;
    if (href.startsWith('#') || href.startsWith('javascript:')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;

    try {
      const url = new URL(href, location.href);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
      return url.hostname !== SITE_HOST;
    } catch (e) {
      return false;
    }
  }

  /* ---------- 拦截点击 ---------- */
  document.addEventListener('click', (e) => {
    if (e.button !== undefined && e.button !== 0) return;

    const link = e.target.closest('a[href]');
    if (!link) return;

    if (link.hasAttribute('download')) return;
    if (link.hasAttribute('data-no-warning')) return;

    const href = link.getAttribute('href');
    if (!isExternal(href)) return;

    e.preventDefault();
    e.stopPropagation();

    const blank = link.getAttribute('target') === '_blank';
    const abs = new URL(href, location.href).href;

    open(abs, blank);
  }, true);

  window.LeaveWarning = {
    open,
    close,
    get isOpen() {
      const m = document.getElementById('leaveWarning');
      return m && m.classList.contains('open');
    },
  };
})();