/* =========================================================
   渲染逻辑 —— 并发加载 + 详细进度 + 栏目系统
   + 友情链接（仅网站自身 favicon）+ README 多源切换
   + Markdown 阅读器 + 自定义图标支持
   ========================================================= */

/* ---------- 工具 ---------- */
function hexToRgb(hex) {
  const h = (hex || 'ffffff').replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return '255, 255, 255';
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(', ');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ---------- 并发控制 ---------- */
async function runWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  const workers = Array(Math.min(limit, items.length)).fill(null).map(async () => {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

/* =========================================================
   加载页状态
   ========================================================= */
const LoadState = {
  phase:      'init',
  total:      0,
  done:       0,
  current:    [],
  lastDone:   [],
  bgStatus:   'pending',
  startTime:  Date.now(),
};

function renderLoadingDetail() {
  const el = document.getElementById('loadingDetail');
  if (!el) return;

  const s = LoadState;
  const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;

  let line1 = '';
  let line2 = '';

  switch (s.phase) {
    case 'init':
      line1 = '正在初始化...';
      line2 = '准备加载资源';
      break;

    case 'icons': {
      line1 = `正在加载图标 <b>${s.done}</b><span class="l-dim"> / ${s.total}</span> <span class="l-dim">(${pct}%)</span>`;
      if (s.current.length) {
        const names = s.current
          .slice(0, 4)
          .map(n => escapeHtml(n))
          .join('、');
        const more = s.current.length > 4 ? ' ...' : '';
        line2 = `<span class="l-dim">正在加载图标：</span>${names}${more}`;
      }
      break;
    }

    case 'bg':
      line1 = `图标加载完成 <b>${s.total}</b><span class="l-dim"> / ${s.total}</span>`;
      line2 = `<span class="l-dim">正在等待背景图...</span>`;
      break;

    case 'done':
      line1 = `加载完成`;
      line2 = `<span class="l-dim">共 ${s.total} 个图标 · 耗时 ${((Date.now() - s.startTime) / 1000).toFixed(1)}s</span>`;
      break;
  }

  el.innerHTML =
    `<div class="l-line">${line1}</div>` +
    (line2 ? `<div class="l-line l-sub">${line2}</div>` : '');
}

function setProgress(p) {
  const el = document.getElementById('loadingBarFill');
  if (el) el.style.width = Math.max(0, Math.min(100, p)) + '%';
}

function hideLoading() {
  const el = document.getElementById('loadingScreen');
  if (!el || el.classList.contains('hidden')) return;
  el.classList.add('hidden');
  setTimeout(() => el.remove(), 500);
}

function reportCurrent(name) {
  if (!LoadState.current.includes(name)) {
    LoadState.current.push(name);
  }
  renderLoadingDetail();
}

function reportDone(name) {
  LoadState.current = LoadState.current.filter(n => n !== name);
  LoadState.done++;
  LoadState.lastDone.push(name);
  if (LoadState.lastDone.length > 3) LoadState.lastDone.shift();

  setProgress(15 + (LoadState.done / LoadState.total) * 60);
  renderLoadingDetail();
}

/* =========================================================
   README 多源候选
   ========================================================= */
function buildReadmeCandidates(readme) {
  if (Array.isArray(readme)) return readme.filter(Boolean);
  if (typeof readme !== 'string' || !readme) return [];

  const list = [readme];

  const m = readme.match(
    /^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/i
  );

  if (m) {
    const [, user, repo, branch, file] = m;
    list.push(`https://cdn.jsdelivr.net/gh/${user}/${repo}@${branch}/${file}`);
    list.push(`https://fastly.jsdelivr.net/gh/${user}/${repo}@${branch}/${file}`);
    list.push(`https://ghproxy.net/${readme}`);
    list.push(`https://gh-proxy.com/${readme}`);
    list.push(`https://raw.gitmirror.com/${user}/${repo}/${branch}/${file}`);
  }

  return [...new Set(list)];
}

/* ---------- 内联 SVG 图标库 ---------- */
const SVG_ICONS = {
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
  download:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m6 11 6 6 6-6"/><path d="M5 21h14"/></svg>',
  doc:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/></svg>',
  chevron:
    '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  arrowRight:
    '<svg class="friend-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
};

/* =========================================================
   图标候选链
   ---------------------------------------------------------
   site.icon 支持的写法：
   · 'github.png'                       → assets/icons/github.png
   · 'assets/custom/xxx.png'            → 相对项目根路径
   · 'https://example.com/icon.png'     → 完整 URL
   · 'data:image/svg+xml,...'           → 内联
   ========================================================= */
function buildIconCandidates(site) {
  const list = [];

  /* mailto: 用内联 SVG */
  if (site.url && /^mailto:/i.test(site.url)) {
    const color = '#' + (site.color || 'EA4335').replace('#', '');
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 7 9 6 9-6"/></svg>`;
    list.push('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
    return list;
  }

  /* 1. 自定义图标 */
  if (site.icon) {
    const ic = String(site.icon).trim();
    if (/^(https?:|data:|blob:)/i.test(ic)) {
      list.push(ic);
    } else if (ic.includes('/')) {
      list.push(ic);
    } else {
      list.push('assets/icons/' + ic);
    }
  }

  /* 2. 提取域名 */
  let domain = '';
  try {
    if (site.url && /^https?:\/\//i.test(site.url)) {
      domain = new URL(site.url).hostname;
    }
  } catch (e) { /* ignore */ }

  if (domain) {
    list.push(`https://${domain}/favicon.ico`);
    list.push(`https://favicon.im/${domain}`);
  }

  return list;
}

/* ---------- 个人信息 ---------- */
(function renderProfile() {
  const avatarEl = document.getElementById('avatarImg');
  avatarEl.src = PROFILE.avatar;
  avatarEl.alt = PROFILE.name;

  document.getElementById('profileName').textContent = PROFILE.name;
  document.getElementById('profileRole').textContent = PROFILE.role;
  document.getElementById('profileBio').textContent  = PROFILE.bio;

  document.getElementById('contactBtn').href = 'mailto:' + PROFILE.email;
})();

document.getElementById('panelTitle').textContent    = PANEL.title;
document.getElementById('panelSubtitle').textContent = PANEL.subtitle;

/* ---------- 主卡片 ---------- */
const grid  = document.getElementById('grid');
const badge = document.getElementById('count');

function createCard(site, index) {
  const rgb     = hexToRgb(site.color);
  const initial = site.name.charAt(0);

  const card = document.createElement('a');
  card.className = 'card';
  card.href      = site.url || '#';
  card.target    = '_blank';
  card.rel       = 'noopener noreferrer';
  card.style.setProperty('--brand-rgb', rgb);
  card.style.animationDelay = (index * 35) + 'ms';
  card.setAttribute('aria-label', site.name);

  const iconBox = document.createElement('span');
  iconBox.className = 'card-icon';

  const initialEl = document.createElement('span');
  initialEl.className = 'card-initial';
  initialEl.textContent = initial;
  iconBox.appendChild(initialEl);

  const img = document.createElement('img');
  img.alt = site.name;
  iconBox.appendChild(img);

  card.appendChild(iconBox);

  const nameEl = document.createElement('span');
  nameEl.className = 'card-name';
  nameEl.textContent = site.name;
  card.appendChild(nameEl);

  if (site.desc) {
    const descEl = document.createElement('span');
    descEl.className = 'card-desc';
    descEl.textContent = site.desc;
    card.appendChild(descEl);
  }

  return { el: card, img, initialEl };
}

const iconQueue = [];

SITES.forEach((site, i) => {
  const refs = createCard(site, i);
  grid.appendChild(refs.el);
  iconQueue.push({ site, img: refs.img, initialEl: refs.initialEl });
});

badge.textContent = SITES.length + ' 个链接';

grid.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') return;
  const card = e.target.closest('.card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  card.style.setProperty('--my', (e.clientY - r.top)  + 'px');
});

/* =========================================================
   项目按钮上的圆形图标工厂
   ========================================================= */
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
  try { domain = new URL(url).hostname; } catch (e) { /* ignore */ }

  if (domain) {
    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';

    const list = [
      `https://${domain}/favicon.ico`,
      `https://favicon.im/${domain}`,
    ];
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

/* =========================================================
   栏目渲染入口
   ========================================================= */
function renderSection(section, iconQueueRef) {
  const wrap = document.createElement('section');
  wrap.className = 'section';

  const head = document.createElement('div');
  head.className = 'section-head';

  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = section.title;
  head.appendChild(title);

  if (section.subtitle) {
    const sub = document.createElement('p');
    sub.className = 'section-sub';
    sub.textContent = section.subtitle;
    head.appendChild(sub);
  }

  wrap.appendChild(head);

  const body = document.createElement('div');
  body.className = 'section-body';

  switch (section.type) {
    case 'cards':    renderSectionCards(section, body, iconQueueRef);    break;
    case 'projects': renderSectionProjects(section, body);               break;
    case 'friends':  renderSectionFriends(section, body, iconQueueRef); break;
    case 'tags':     renderSectionTags(section, body);                   break;
    case 'timeline': renderSectionTimeline(section, body);               break;
    case 'list':     renderSectionList(section, body);                   break;
    default:
      console.warn('[section] 未知类型:', section.type);
  }

  wrap.appendChild(body);
  return wrap;
}

/* ---------- cards ---------- */
function renderSectionCards(section, container, iconQueueRef) {
  const gridEl = document.createElement('div');
  gridEl.className = 'section-cards';

  (section.items || []).forEach(item => {
    const rgb = hexToRgb(item.color);

    const a = document.createElement('a');
    a.className = 'section-card';
    a.href   = item.url || '#';
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
    a.style.setProperty('--brand-rgb', rgb);
    a.setAttribute('aria-label', item.name);

    const iconBox = document.createElement('span');
    iconBox.className = 'section-card-icon';

    const initialEl = document.createElement('span');
    initialEl.className = 'section-card-initial';
    initialEl.textContent = item.name.charAt(0);
    iconBox.appendChild(initialEl);

    const img = document.createElement('img');
    img.alt = item.name;
    iconBox.appendChild(img);

    a.appendChild(iconBox);

    const body = document.createElement('div');
    body.className = 'section-card-body';

    const name = document.createElement('div');
    name.className = 'section-card-name';
    name.textContent = item.name;
    body.appendChild(name);

    if (item.desc) {
      const desc = document.createElement('div');
      desc.className = 'section-card-desc';
      desc.textContent = item.desc;
      body.appendChild(desc);
    }

    a.appendChild(body);
    gridEl.appendChild(a);

    if (iconQueueRef) {
      iconQueueRef.push({ site: item, img, initialEl });
    }
  });

  container.appendChild(gridEl);
}

/* ---------- projects ---------- */
function renderSectionProjects(section, container) {
  const gridEl = document.createElement('div');
  gridEl.className = 'projects';

  (section.items || []).forEach(item => {
    const rgb = hexToRgb(item.color);

    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.setProperty('--brand-rgb', rgb);

    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top)  + 'px');
    });

    const header = document.createElement('div');
    header.className = 'project-header';

    const nameEl = document.createElement('h4');
    nameEl.className = 'project-name';
    nameEl.textContent = item.name || '';
    header.appendChild(nameEl);

    if (item.tags && item.tags.length) {
      const tagsWrap = document.createElement('div');
      tagsWrap.className = 'project-tags';
      item.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'project-tag';
        tag.textContent = t;
        tagsWrap.appendChild(tag);
      });
      header.appendChild(tagsWrap);
    }
    card.appendChild(header);

    if (item.desc) {
      const desc = document.createElement('p');
      desc.className = 'project-desc';
      desc.textContent = item.desc;
      card.appendChild(desc);
    }

    const actions = document.createElement('div');
    actions.className = 'project-actions';

    (item.sources || []).forEach(src => {
      if (!src.repo) return;
      const a = document.createElement('a');
      a.className = 'project-btn';
      a.href = src.repo;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.appendChild(createProjectIcon(src));
      const text = document.createElement('span');
      text.textContent = src.label || '仓库';
      a.appendChild(text);
      actions.appendChild(a);
    });

    const downloads = (item.sources || []).filter(s => s.download);
    if (downloads.length) {
      const dd = document.createElement('div');
      dd.className = 'project-dropdown';

      const toggle = document.createElement('button');
      toggle.className = 'project-btn';
      toggle.type = 'button';

      const dlIcon = document.createElement('span');
      dlIcon.className = 'project-btn-icon';
      dlIcon.innerHTML = SVG_ICONS.download;
      toggle.appendChild(dlIcon);

      const labelSpan = document.createElement('span');
      labelSpan.textContent = '下载源';
      toggle.appendChild(labelSpan);

      const chevWrap = document.createElement('span');
      chevWrap.innerHTML = SVG_ICONS.chevron;
      toggle.appendChild(chevWrap.firstChild);

      dd.appendChild(toggle);

      const menu = document.createElement('div');
      menu.className = 'project-dropdown-menu';
      downloads.forEach(s => {
        const a = document.createElement('a');
        a.href = s.download;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.appendChild(createProjectIcon(s));
        const txt = document.createElement('span');
        txt.textContent = '从 ' + (s.label || '下载');
        a.appendChild(txt);
        menu.appendChild(a);
      });
      dd.appendChild(menu);

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.project-dropdown.open').forEach(d => {
          if (d !== dd) d.classList.remove('open');
        });
        dd.classList.toggle('open');
      });

      actions.appendChild(dd);
    }

    if (item.readme) {
      const btn = document.createElement('button');
      btn.className = 'project-btn';
      btn.type = 'button';

      const docIcon = document.createElement('span');
      docIcon.className = 'project-btn-icon';
      docIcon.innerHTML = SVG_ICONS.doc;
      btn.appendChild(docIcon);

      const txt = document.createElement('span');
      txt.textContent = '文档';
      btn.appendChild(txt);

      btn.addEventListener('click', () => openReadme(item.name, item.readme));
      actions.appendChild(btn);
    }

    card.appendChild(actions);
    gridEl.appendChild(card);
  });

  container.appendChild(gridEl);
}

/* ---------- friends（友情链接，长条） ---------- */
function renderSectionFriends(section, container, iconQueueRef) {
  const wrap = document.createElement('div');
  wrap.className = 'friends';

  (section.items || []).forEach(item => {
    const rgb = hexToRgb(item.color);

    const a = document.createElement('a');
    a.className = 'friend-card';
    a.href   = item.url || '#';
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
    a.style.setProperty('--brand-rgb', rgb);
    a.setAttribute('aria-label', item.name);

    const iconBox = document.createElement('span');
    iconBox.className = 'friend-icon';

    const initialEl = document.createElement('span');
    initialEl.className = 'friend-initial';
    initialEl.textContent = item.name.charAt(0);
    iconBox.appendChild(initialEl);

    const img = document.createElement('img');
    img.alt = item.name;
    iconBox.appendChild(img);

    a.appendChild(iconBox);

    const body = document.createElement('div');
    body.className = 'friend-body';

    const name = document.createElement('div');
    name.className = 'friend-name';
    name.textContent = item.name;
    body.appendChild(name);

    if (item.desc) {
      const desc = document.createElement('div');
      desc.className = 'friend-desc';
      desc.textContent = item.desc;
      body.appendChild(desc);
    }

    a.appendChild(body);

    const action = document.createElement('span');
    action.className = 'friend-action';
    action.innerHTML =
      '<span class="action-text">立即前往</span>' +
      SVG_ICONS.arrowRight;
    a.appendChild(action);

    wrap.appendChild(a);

    /* 友情链接标记 noFaviconIm: true → 只用网站自身 favicon（除非有自定义 icon） */
    if (iconQueueRef) {
      iconQueueRef.push({
        site: item,
        img,
        initialEl,
        noFaviconIm: true,
      });
    }
  });

  container.appendChild(wrap);
}

/* ---------- tags ---------- */
function renderSectionTags(section, container) {
  const wrap = document.createElement('div');
  wrap.className = 'tags';

  (section.items || []).forEach(text => {
    const t = document.createElement('span');
    t.className = 'tag';
    t.textContent = text;
    wrap.appendChild(t);
  });

  container.appendChild(wrap);
}

/* ---------- timeline ---------- */
function renderSectionTimeline(section, container) {
  const wrap = document.createElement('div');
  wrap.className = 'timeline';

  (section.items || []).forEach(item => {
    const row = document.createElement('div');
    row.className = 'timeline-item';

    const date = document.createElement('div');
    date.className = 'timeline-date';
    date.textContent = item.date || '';
    row.appendChild(date);

    const text = document.createElement('div');
    text.className = 'timeline-text';
    text.textContent = item.text || '';
    row.appendChild(text);

    wrap.appendChild(row);
  });

  container.appendChild(wrap);
}

/* ---------- list ---------- */
function renderSectionList(section, container) {
  const wrap = document.createElement('div');
  wrap.className = 'section-list';

  (section.items || []).forEach(item => {
    const a = document.createElement('a');
    a.className = 'section-list-item';
    a.href   = item.url || '#';
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
    a.textContent = item.name || '';
    wrap.appendChild(a);
  });

  container.appendChild(wrap);
}

/* ---------- 渲染所有栏目 ---------- */
const sectionsEl = document.getElementById('sections');
if (sectionsEl && typeof SECTIONS !== 'undefined') {
  SECTIONS.forEach(sec => {
    const el = renderSection(sec, iconQueue);
    sectionsEl.appendChild(el);
  });
}

/* =========================================================
   预加载
   ========================================================= */
function preloadAllIcons() {
  iconQueue.forEach(({ site, noFaviconIm }) => {
    let list = buildIconCandidates(site);
    if (noFaviconIm) {
      /* 友情链接：保留自定义 icon，过滤掉 favicon.im */
      list = list.filter(u => !u.includes('favicon.im/'));
    }
    if (!list[0]) return;
    if (list[0].startsWith('data:')) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = list[0];
  });
}
preloadAllIcons();

/* =========================================================
   README 弹窗
   ========================================================= */
function ensureReadmeModal() {
  let modal = document.getElementById('readmeModal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.className = 'readme-modal';
  modal.id = 'readmeModal';
  modal.innerHTML =
    '<div class="readme-panel">' +
      '<div class="readme-header">' +
        '<h3 class="readme-title" id="readmeTitle">README</h3>' +
        '<div class="readme-actions">' +
          '<a class="readme-action" id="readmeSource" href="#" target="_blank" ' +
             'rel="noopener noreferrer" title="在浏览器打开原始文件" aria-label="打开原始文件">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>' +
              '<path d="M15 3h6v6"/>' +
              '<path d="M10 14 21 3"/>' +
            '</svg>' +
          '</a>' +
          '<button class="readme-close" id="readmeClose" type="button" aria-label="关闭">×</button>' +
        '</div>' +
      '</div>' +
      '<div class="readme-body" id="readmeBody"></div>' +
    '</div>';

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeReadme();
  });

  modal.querySelector('#readmeClose').addEventListener('click', closeReadme);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeReadme();
  });

  return modal;
}

function closeReadme() {
  const modal = document.getElementById('readmeModal');
  if (modal) modal.classList.remove('open');
}

async function openReadme(name, readme) {
  const modal   = ensureReadmeModal();
  const titleEl = modal.querySelector('#readmeTitle');
  const bodyEl  = modal.querySelector('#readmeBody');
  const srcEl   = modal.querySelector('#readmeSource');

  const candidates = buildReadmeCandidates(readme);

  titleEl.textContent = (name || '') + ' — README';
  srcEl.href = candidates[0] || '#';

  bodyEl.innerHTML =
    '<div class="readme-loading">' +
      '<div class="readme-spinner"></div>' +
      '<div id="readmeLoadingText">正在拉取 README ...</div>' +
    '</div>';

  modal.classList.add('open');

  const loadingText = modal.querySelector('#readmeLoadingText');

  if (!candidates.length) {
    bodyEl.innerHTML = '<div class="readme-empty">(没有配置 README 地址)</div>';
    return;
  }

  let lastError = null;

  for (let i = 0; i < candidates.length; i++) {
    const url = candidates[i];

    if (loadingText) {
      loadingText.textContent = i === 0
        ? '正在拉取 README ...'
        : `第 ${i + 1}/${candidates.length} 个源尝试中...`;
    }

    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      const text = await res.text();
      if (!text.trim()) throw new Error('内容为空');

      srcEl.href = url;

      if (window.marked && typeof window.marked.parse === 'function') {
        try {
          bodyEl.innerHTML = window.marked.parse(text, {
            gfm: true,
            breaks: true,
          });
        } catch (e) {
          bodyEl.innerHTML = '<pre class="readme-raw">' + escapeHtml(text) + '</pre>';
        }
      } else {
        bodyEl.innerHTML = '<pre class="readme-raw">' + escapeHtml(text) + '</pre>';
      }

      if (window.ICON_DEBUG) {
        console.log(`[readme] ✅ ${name} <- 源 #${i + 1}: ${url}`);
      }
      return;

    } catch (e) {
      lastError = e;
      if (window.ICON_DEBUG) {
        console.warn(`[readme] ❌ ${name} 源 #${i + 1} 失败:`, url, e.message);
      }
    }
  }

  bodyEl.innerHTML =
    '<div class="readme-error">' +
      '<div class="readme-error-icon">⚠</div>' +
      '<div class="readme-error-title">所有源都加载失败</div>' +
      '<div class="readme-error-msg">' +
        escapeHtml(lastError ? lastError.message : '未知错误') +
      '</div>' +
      '<div class="readme-error-hint">' +
        '已尝试 ' + candidates.length + ' 个源：<br>' +
        candidates.map((u, i) => '&nbsp;&nbsp;' + (i + 1) + '. ' + escapeHtml(u)).join('<br>') +
        '<br><br>可能原因：<br>' +
        '· 网络不通 / 被墙<br>' +
        '· 仓库或分支名写错<br>' +
        '· README 文件不存在' +
      '</div>' +
    '</div>';
}

document.addEventListener('click', () => {
  document.querySelectorAll('.project-dropdown.open').forEach(d => d.classList.remove('open'));
});

/* =========================================================
   图标加载
   ---------------------------------------------------------
   options.noFaviconIm = true → 只走网站自身 favicon（不影响自定义 icon）
   ========================================================= */
const ICON_TIMEOUT = 2500;
window.ICON_DEBUG  = false;

function tryLoadOne(url, img, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(false);
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timer);
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onErr);
    }

    function onLoad() {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(true);
    }

    function onErr() {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(false);
    }

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onErr);
    img.src = url;
  });
}

async function loadIcon(site, img, initialEl, options = {}) {
  let candidates = buildIconCandidates(site);

  /* 友情链接：过滤掉 favicon.im（自定义 icon 和网站自身 favicon 保留） */
  if (options.noFaviconIm) {
    candidates = candidates.filter(u => !u.includes('favicon.im/'));
  }

  if (!candidates.length) {
    img.remove();
    if (window.ICON_DEBUG) console.warn('[icon] 无候选，直接首字母:', site.name);
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
  if (window.ICON_DEBUG) console.warn('[icon] ❌ 全部失败，显示首字母:', site.name);
}

/* =========================================================
   主流程 —— 并发 6（手机）/ 10（桌面）
   ========================================================= */
(async function loadAll() {
  LoadState.total = iconQueue.length;
  LoadState.phase = 'icons';

  setProgress(15);
  renderLoadingDetail();

  const isMobile = window.innerWidth < 900;
  const concurrency = isMobile ? 6 : 10;

  const tasks = iconQueue.map(item => async () => {
    reportCurrent(item.site.name);
    await loadIcon(item.site, item.img, item.initialEl, { noFaviconIm: item.noFaviconIm });
    reportDone(item.site.name);
  });

  await runWithConcurrency(tasks, concurrency, fn => fn());

  LoadState.phase = 'bg';
  setProgress(78);
  renderLoadingDetail();

  if (!window.__bgDone) {
    await Promise.race([
      window.__bgReady,
      new Promise(r => setTimeout(r, 2200)),
    ]);
  }

  LoadState.phase = 'done';
  setProgress(100);
  renderLoadingDetail();

  setTimeout(hideLoading, 400);
})();

/* ---------- 硬超时兜底：12s 一定进入 ---------- */
setTimeout(() => {
  const el = document.getElementById('loadingScreen');
  if (!el || el.classList.contains('hidden')) return;
  console.warn('[loading] 硬超时，强制进入');
  hideLoading();
}, 12000);