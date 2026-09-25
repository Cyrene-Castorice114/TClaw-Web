/* loading.js —— 加载页控制 */

const LoadState = {
  phase:    'init',
  tasks:    [],
  expanded: false,
  bgResult: null,
  startTime: Date.now(),
};

function loadingDots() {
  return '<span class="loading-dots"><span></span><span></span><span></span></span>';
}

function loadingCheck() {
  return (
    '<svg class="loading-check" viewBox="0 0 24 24" fill="none" ' +
         'stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="10"/>' +
      '<path d="m8 12 3 3 5-6"/>' +
    '</svg>'
  );
}

function loadingExclaim() {
  return '<span class="loading-exclaim">!</span>';
}

/* ---------- 任务管理 ---------- */
function registerTask(id, name) {
  LoadState.tasks.push({ id, name, status: 'loading' });
  renderLoadingDetail();
}

function completeTask(id) {
  const t = LoadState.tasks.find(x => x.id === id);
  if (!t || t.status === 'done') return;

  t.status = 'done';

  updateTaskRow(id);
  updateTaskCounter();
}

function toggleTasks() {
  LoadState.expanded = !LoadState.expanded;

  const list   = document.querySelector('.loading-task-list');
  const toggle = document.querySelector('.loading-toggle');

  if (list)   list.classList.toggle('open', LoadState.expanded);
  if (toggle) toggle.classList.toggle('open', LoadState.expanded);
}

/* ---------- 全量渲染 ---------- */
function renderLoadingDetail() {
  const el = document.getElementById('loadingDetail');
  if (!el) return;

  const s = LoadState;
  let html = '';

  if (s.phase === 'init') {
    html = '<div class="loading-status">' + loadingDots() + '<span>正在初始化</span></div>';

  } else if (s.phase === 'tasks') {
    const total = s.tasks.length;
    const done  = s.tasks.filter(t => t.status === 'done').length;

    html += '<div class="loading-head">';
    html += '<div class="loading-head-main">' + loadingDots() +
            `<span>正在加载（<span id="loadingDoneCount">${done}</span>/${total}）</span></div>`;
    html += `<button class="loading-toggle${s.expanded ? ' open' : ''}" type="button" onclick="toggleTasks()" aria-label="展开/折叠任务列表">` +
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
            `stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">` +
            `<path d="m6 9 6 6 6-6"/></svg></button>`;
    html += '</div>';

    html += `<div class="loading-task-list${s.expanded ? ' open' : ''}">`;
    s.tasks.forEach(t => {
      const icon = (t.status === 'done') ? loadingCheck() : loadingDots();
      const cls  = (t.status === 'done') ? 'task-done' : 'task-loading';
      html += `<div class="loading-task ${cls}" data-task-id="${t.id}">${icon}<span>${t.name}</span></div>`;
    });
    html += '</div>';

  } else if (s.phase === 'complete') {
    html = '<div class="loading-status">' + loadingCheck() + '<span>加载完成</span></div>';
  }

  el.style.opacity = 0;
  requestAnimationFrame(() => {
    el.innerHTML = html;
    el.style.opacity = 1;
  });
}

function updateTaskRow(id) {
  const row = document.querySelector(`.loading-task[data-task-id="${id}"]`);
  if (!row) return;
  if (row.classList.contains('task-done')) return;

  row.classList.remove('task-loading');
  row.classList.add('task-done');

  const dots = row.querySelector('.loading-dots');
  if (dots) {
    const tmp = document.createElement('div');
    tmp.innerHTML = loadingCheck();
    dots.replaceWith(tmp.firstChild);
  }
}

function updateTaskCounter() {
  const counter = document.getElementById('loadingDoneCount');
  if (!counter) return;
  const done = LoadState.tasks.filter(t => t.status === 'done').length;
  counter.textContent = done;
}

function hideLoading() {
  const el = document.getElementById('loadingScreen');
  if (!el || el.classList.contains('hidden')) return;
  el.classList.add('hidden');
  setTimeout(() => el.remove(), 500);
}