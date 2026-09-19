/* =========================================================
   readme.js —— README 弹窗
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
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        cache: 'no-cache',
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) throw new Error('HTTP ' + res.status);

      const text = await res.text();
      if (!text.trim()) throw new Error('内容为空');

      srcEl.href = url;

      if (window.marked && typeof window.marked.parse === 'function') {
        try {
          bodyEl.innerHTML = window.marked.parse(text, { gfm: true, breaks: true });
        } catch (e) {
          bodyEl.innerHTML = '<pre class="readme-raw">' + escapeHtml(text) + '</pre>';
        }
      } else {
        bodyEl.innerHTML = '<pre class="readme-raw">' + escapeHtml(text) + '</pre>';
      }
      return;

    } catch (e) {
      lastError = e;
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
      '</div>' +
    '</div>';
}

/* 点击空白处关闭所有下拉菜单 */
document.addEventListener('click', () => {
  document.querySelectorAll('.project-dropdown.open').forEach(d => d.classList.remove('open'));
});