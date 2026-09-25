/* app.js —— 主入口 */

(function () {
  'use strict';

  if (typeof preloadAllIcons === 'function') {
    preloadAllIcons(iconQueue);
  }

  LoadState.phase = 'init';
  renderLoadingDetail();

  (async function loadAll() {

    await new Promise(r => setTimeout(r, 250));

    /* 切到任务列表模式 */
    LoadState.phase = 'tasks';

    /* 注册背景图任务 */
    registerTask('__bg__', '加载背景图');

    /* 注册图标任务 */
    iconQueue.forEach((item, i) => {
      registerTask('icon_' + i, '加载图标 · ' + item.site.name);
    });

    /* 全部并行 */
    const tasks = [];

    tasks.push((async () => {
      await Promise.race([
        window.__bgReady,
        new Promise(r => setTimeout(r, 3000)),
      ]);
      LoadState.bgResult = window.__bgFallback ? 'fail' : 'success';
      completeTask('__bg__');
    })());

    iconQueue.forEach((item, i) => {
      tasks.push(
        loadIcon(item.site, item.img, item.initialEl, {
          noFaviconIm: item.noFaviconIm,
        }).then(() => completeTask('icon_' + i))
      );
    });

    await Promise.all(tasks);

    /* 全部完成 → 只显示"加载完成" */
    LoadState.phase = 'complete';
    renderLoadingDetail();

    setTimeout(hideLoading, 800);

  })();

  setTimeout(() => {
    const el = document.getElementById('loadingScreen');
    if (!el || el.classList.contains('hidden')) return;
    hideLoading();
  }, 12000);
})();