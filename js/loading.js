/* =========================================================
   loading.js —— 加载页控制
   ========================================================= */

const LoadState = {
  phase:     'init',
  total:     0,
  done:      0,
  current:   [],
  lastDone:  [],
  startTime: Date.now(),
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
        const names = s.current.slice(0, 4).map(n => escapeHtml(n)).join('、');
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
      line1 = '加载完成';
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
  if (!LoadState.current.includes(name)) LoadState.current.push(name);
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