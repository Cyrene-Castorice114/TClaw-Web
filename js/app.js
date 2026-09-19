/* =========================================================
   app.js —— 主入口
   ========================================================= */

/* ---------- 预加载 ---------- */
preloadAllIcons(iconQueue);

/* ---------- 主流程 ---------- */
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
      new Promise(r => setTimeout(r, 1500)),
    ]);
  }

  LoadState.phase = 'done';
  setProgress(100);
  renderLoadingDetail();

  setTimeout(hideLoading, 300);
})();

/* ---------- 硬超时兜底：6s 一定进入 ---------- */
setTimeout(() => {
  const el = document.getElementById('loadingScreen');
  if (!el || el.classList.contains('hidden')) return;
  console.warn('[loading] 硬超时，强制进入');
  hideLoading();
}, 6000);