/* bg-viewer.js —— 查看 / 下载背景图 */

(function () {
  'use strict';

  const btn      = document.getElementById('bgViewBtn');
  const modal    = document.getElementById('bgViewerModal');
  const closeBtn = document.getElementById('bgViewerClose');
  const img      = document.getElementById('bgViewerImg');
  const empty    = document.getElementById('bgViewerEmpty');
  const saveBtn  = document.getElementById('bgViewerSave');

  if (!btn || !modal) {
    console.warn('[bg-viewer] DOM 元素缺失，脚本未启动');
    return;
  }

  let currentBlob   = null;
  let currentObjUrl = null;

  function releaseObjUrl() {
    if (currentObjUrl) {
      URL.revokeObjectURL(currentObjUrl);
      currentObjUrl = null;
    }
  }

  function resolveRawUrl() {
    const layer = document.querySelector('.bg-image');
    if (!layer) return '';
    const bg = layer.style.backgroundImage;
    if (!bg || bg === 'none') return '';
    const m = bg.match(/url\(["']?(.+?)["']?\)/);
    return (m && m[1]) ? m[1] : '';
  }

  async function resolveBlob() {
    try {
      if (window.BgImage && typeof window.BgImage.getBlob === 'function') {
        const b = window.BgImage.getBlob();
        const blob = (b instanceof Promise) ? await b : b;
        if (blob && blob.size > 0) return blob;
      }
    } catch (e) { /* ignore */ }

    const url = resolveRawUrl();
    if (!url) return null;

    if (url.startsWith('blob:') || url.startsWith('data:')) {
      try {
        const res = await fetch(url);
        if (res.ok) return await res.blob();
      } catch (e) { /* ignore */ }
      return null;
    }

    if (/^https?:/i.test(url)) {
      try {
        const res = await fetch(url, { mode: 'cors', cache: 'force-cache' });
        if (res.ok) {
          const blob = await res.blob();
          if (blob.size > 1000) return blob;
        }
      } catch (e) { /* ignore */ }
      return null;
    }

    return null;
  }

  function guessExt(blob) {
    if (blob && blob.type) {
      const t = blob.type.toLowerCase();
      if (t.includes('jpeg') || t.includes('jpg')) return 'jpg';
      if (t.includes('png'))  return 'png';
      if (t.includes('webp')) return 'webp';
      if (t.includes('gif'))  return 'gif';
      if (t.includes('avif')) return 'avif';
      if (t.includes('bmp'))  return 'bmp';
      if (t.includes('svg'))  return 'svg';
    }
    return 'jpg';
  }

  async function open() {
    modal.classList.add('open');
    releaseObjUrl();

    img.removeAttribute('src');
    img.style.display = 'none';
    empty.style.display = '';
    empty.textContent = '正在加载图片...';
    saveBtn.disabled = true;

    const blob = await resolveBlob();

    if (blob) {
      currentBlob = blob;
      currentObjUrl = URL.createObjectURL(blob);

      img.src = currentObjUrl;
      img.style.display = '';
      empty.style.display = 'none';
      saveBtn.disabled = false;
    } else {
      currentBlob = null;
      const url = resolveRawUrl();

      if (url) {
        img.src = url;
        img.style.display = '';
        empty.style.display = 'none';
        saveBtn.disabled = true;
      } else {
        img.style.display = 'none';
        empty.style.display = '';
        empty.textContent = '暂未加载背景图';
        saveBtn.disabled = true;
      }
    }
  }

  function close() {
    modal.classList.remove('open');
    releaseObjUrl();
    currentBlob = null;
  }

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });

  saveBtn.addEventListener('click', () => {
    const span = saveBtn.querySelector('span');
    if (!span) return;

    const originalText = span.textContent;

    if (!currentBlob) {
      span.textContent = '无法保存，请右键图片另存为';
      setTimeout(() => { span.textContent = originalText; }, 2200);
      return;
    }

    try {
      const url  = URL.createObjectURL(currentBlob);
      const ext  = guessExt(currentBlob);
      const name = `TClaw-bg-${Date.now()}.${ext}`;

      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 1500);

      span.textContent = '保存成功 ✓';
      saveBtn.disabled = true;
      setTimeout(() => {
        span.textContent = originalText;
        saveBtn.disabled = false;
      }, 1500);

    } catch (e) {
      span.textContent = '保存失败';
      setTimeout(() => { span.textContent = originalText; }, 1500);
    }
  });

  window.BgViewer = {
    open,
    close,
    get blob() { return currentBlob; },
  };

  console.log('[bg-viewer] 已加载 ✅');
})();