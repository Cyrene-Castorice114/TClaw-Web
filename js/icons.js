/* =========================================================
   icons.js —— 图标候选链 + 加载
   ========================================================= */

const ICON_TIMEOUT = 2500;
window.ICON_DEBUG  = false;

/* ---------- 候选链 ---------- */
function buildIconCandidates(site) {
  const list = [];

  /* mailto: 内联 SVG */
  if (site.url && /^mailto:/i.test(site.url)) {
    const color = '#' + (site.color || 'EA4335').replace('#', '');
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 7 9 6 9-6"/></svg>`;
    list.push('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
    return list;
  }

  if (site.icon) {
    const ic = String(site.icon).trim();
    if (/^(https?:|data:|blob:)/i.test(ic)) list.push(ic);
    else if (ic.includes('/')) list.push(ic);
    else list.push('assets/icons/' + ic);
  }

  let domain = '';
  try {
    if (site.url && /^https?:\/\//i.test(site.url)) domain = new URL(site.url).hostname;
  } catch (e) {}

  if (domain) {
    list.push(`https://${domain}/favicon.ico`);
    list.push(`https://favicon.im/${domain}`);
  }

  return list;
}

/* ---------- 单次加载 ---------- */
function tryLoadOne(url, img, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      if (!img.src.startsWith('data:')) img.removeAttribute('src');
      resolve(false);
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timer);
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onErr);
    }
    function onLoad() { if (settled) return; settled = true; cleanup(); resolve(true); }
    function onErr()  { if (settled) return; settled = true; cleanup(); resolve(false); }

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onErr);
    img.src = url;
  });
}

/* ---------- 主加载 ---------- */
async function loadIcon(site, img, initialEl, options = {}) {
  let candidates = buildIconCandidates(site);

  if (options.noFaviconIm) {
    candidates = candidates.filter(u => !u.includes('favicon.im/'));
  }

  if (!candidates.length) {
    img.remove();
    return;
  }

  img.style.display = 'none';

  for (let i = 0; i < candidates.length; i++) {
    const url = candidates[i];
    const ok = await tryLoadOne(url, img, ICON_TIMEOUT);

    if (ok) {
      img.style.display = '';
      initialEl.classList.add('hidden');
      if (window.ICON_DEBUG) console.log('[icon] ✅', site.name, '->', url);
      return;
    }
  }

  img.remove();
  if (window.ICON_DEBUG) console.warn('[icon] ❌ 全部失败:', site.name);
}

/* ---------- 项目按钮小图标 ---------- */
function createProjectIcon(source) {
  const box = document.createElement('span');
  box.className = 'project-btn-icon';

  const label = (source.label || '').toLowerCase();
  const url   = source.repo || source.download || '';

  if (label.includes('github')) {
    box.innerHTML = SVG_ICONS.github;
    return box;
  }

  let domain = '';
  try { domain = new URL(url).hostname; } catch (e) {}

  if (domain) {
    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';

    const list = [`https://${domain}/favicon.ico`, `https://favicon.im/${domain}`];
    let idx = 0;

    function next() {
      idx++;
      if (idx < list.length) {
        img.removeAttribute('src');
        img.src = list[idx];
      } else {
        img.remove();
        const span = document.createElement('span');
        span.className = 'initial';
        span.textContent = (source.label || '?').charAt(0).toUpperCase();
        box.appendChild(span);
      }
    }

    img.addEventListener('error', next);
    img.src = list[0];
    box.appendChild(img);
    return box;
  }

  const span = document.createElement('span');
  span.className = 'initial';
  span.textContent = (source.label || '?').charAt(0).toUpperCase();
  box.appendChild(span);
  return box;
}

/* ---------- 预加载 ---------- */
function preloadAllIcons(iconQueue) {
  iconQueue.forEach(({ site, noFaviconIm }) => {
    let list = buildIconCandidates(site);
    if (noFaviconIm) list = list.filter(u => !u.includes('favicon.im/'));
    if (!list[0] || list[0].startsWith('data:')) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = list[0];
    setTimeout(() => { if (!img.complete) img.src = ''; }, 4000);
  });
}