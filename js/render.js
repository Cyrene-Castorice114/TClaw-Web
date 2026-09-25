/* =========================================================
   render.js —— 卡片 + 栏目渲染
   ========================================================= */

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

/* ---------- 主卡片网格 ---------- */
const grid  = document.getElementById('grid');
const badge = document.getElementById('count');
const iconQueue = [];

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

/* ---------- 栏目渲染入口 ---------- */
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

    if (iconQueueRef) iconQueueRef.push({ site: item, img, initialEl });
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

    const downloads = item.noDownload ? [] : (item.sources || []).filter(s => s.download);
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

      /* ★ 把按钮元素传给 openReadme，用于计算扩散方向 */
      btn.addEventListener('click', (e) => {
        openReadme(item.name, item.readme, e.currentTarget);
      });
      actions.appendChild(btn);
    }

    card.appendChild(actions);
    gridEl.appendChild(card);
  });

  container.appendChild(gridEl);
}

/* ---------- friends ---------- */
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
    action.innerHTML = '<span class="action-text">立即前往</span>' + SVG_ICONS.arrowRight;
    a.appendChild(action);

    wrap.appendChild(a);

    if (iconQueueRef) {
      iconQueueRef.push({ site: item, img, initialEl, noFaviconIm: true });
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