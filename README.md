![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

# TClaw-WebUI

一个多功能的个人网站模板 | A Multi-functional Personal Website Template

---

## 📖 简介 · Introduction

**中文：**基于原生 HTML / CSS / JavaScript 的液态玻璃风格个人主页，左右分栏布局。集成动态背景图、链接卡片、开源项目展示、友情链接、README 阅读器、深色/浅色主题、多种点击特效、缓存优化等功能。

**English：** A personal homepage built with vanilla HTML / CSS / JavaScript, featuring a Liquid Glass aesthetic. Split-pane layout on desktop with dynamic backgrounds, link cards, open-source projects, friend links, README viewer, dark/light theme, click effects, and cache optimization.

---

## ✨ 功能特性 · Features

| 功能 | 说明 |
| --- | --- |
| 🪟 液态玻璃 UI | 磨砂玻璃 + 渐变描边 + 顶部高光 |
| 🌗 深色/浅色主题 | 按时间自动切换，手动设置后写入 Cookie |
| 🖼️ 动态背景图 | 从 loliapi 拉取，PC 横图 / 手机竖图 |
| 💾 图片缓存 | Cache API 存 blob，1 小时换一次，秒开 |
| 🔗 图标自动降级 | 网站自身 favicon → favicon.im 兜底 |
| 📂 多栏目 | 开源项目 / 技能栈 / 友情链接 / 时间线 / 列表 |
| 📄 README 阅读器 | 多源自动切换 + Markdown 渲染 |
| 🖼️ 背景图查看 | 弹窗展示 + 一键保存 |
| ⚠️ 外链安全提示 | 点击站外链接弹确认框 |
| ✨ 点击飘字 | 屏幕任意处点击随机显示文案 |
| 🎆 粒子迸射 | 按钮/卡片点击时四周迸射 |
| 🏷️ 标签页标题特效 | 切换标签页时标题变化 |
| 🐙 右下角悬浮按钮组 | 查看背景图 / DreamCloud / GitHub |
| 📱 响应式布局 | 桌面双栏 / 移动单栏 |
| ⚡ 性能优化 | 手机端自动关闭模糊与动画 |

---

## 🗂 项目结构 · Project Structure

```text
personal-homepage/
├── index.html                  # 主页面
├── 404.html                    # 404 页面
├── robots.txt                  # 搜索引擎规则
├── sitemap.xml                 # 站点地图
├── bump-version.py             # 一键升版本号（GitHub Pages 用）
│
├── css/
│   ├── style.css               # 主样式
│   ├── theme.css               # 主题变量
│   ├── section.css             # 栏目 + README 弹窗
│   ├── loading.css             # 加载页
│   ├── bg-image.css            # 背景图
│   ├── bg-viewer.css           # 查看背景图
│   ├── leave-warning.css       # 外链警告
│   ├── click-fx.css            # 飘字
│   ├── particle-fx.css         # 粒子
│   ├── skeleton.css            # 骨架屏
│   └── ui-polish.css           # 美化层
│
├── js/
│   ├── vendor/
│   │   └── marked.min.js       # Markdown 渲染（本地化）
│   │
│   ├── config.js               # ★ 个人配置（主要编辑）
│   ├── utils.js                # 工具函数 + SVG 图标
│   ├── theme-init.js           # 首屏主题（防闪烁）
│   ├── theme.js                # 主题切换按钮
│   ├── loading.js              # 加载页控制
│   ├── icons.js                # 图标候选链
│   ├── render.js               # 卡片 + 栏目渲染
│   ├── readme.js               # README 弹窗
│   ├── app.js                  # 主流程
│   ├── bg-image.js             # 背景图加载
│   ├── bg-viewer.js            # 查看/下载背景图
│   ├── leave-warning.js        # 外链确认
│   ├── click-fx.js             # 飘字
│   ├── title-fx.js             # 标签页标题
│   └── particle-fx.js          # 粒子
│
└── assets/
    ├── avatar/
    │   └── avatar.jpg          # 头像
    ├── icons/                  # 自定义图标
    ├── background/             # 本地背景兜底图
    ├── font/
    │   └── font.ttf            # 本地字体
    └── favicon.png             # 网站图标（512×512）
```

---

## 🚀 快速开始 · Quick Start

1. **克隆项目**

   ```bash
   git clone https://github.com/Cyrene-Castorice114/TClaw-Web.git
   cd TClaw-Web
   ```

2. **本地预览**

   ```bash
   # Python 3
   python -m http.server 8080

   # 或 Node.js
   npx serve .
   ```

   浏览器打开 http://localhost:8080

   > ⚠️ 不要直接双击 `index.html`，部分功能依赖 HTTP 服务。

3. **部署**

   推荐平台（均免费，支持 HTTPS）：

   - Vercel
   - Netlify
   - Cloudflare Pages
   - GitHub Pages

---

## ⚙️ 配置说明 · Configuration

所有个人内容都集中在 `js/config.js`，只改这一个文件即可。

### 个人信息 · Profile

```js
const PROFILE = {
  avatar: 'assets/avatar/avatar.jpg',
  name:   '你的名字',
  role:   '职位 / 标签',
  bio:    '个人简介（支持换行）',
  email:  'you@example.com',
};
```

### 面板标题 · Panel

```js
const PANEL = {
  title:    '能找到我的链接',
  subtitle: '很高兴见到你~',
};
```

### 网站卡片 · Sites

```js
const SITES = [
  {
    name:  'GitHub',
    url:   'https://github.com/yourname',
    desc:  '我的开源代码',
    color: 'ffffff',        // 品牌色（hover 光晕）
    // icon: 'github.png',  // 可选：自定义图标
  },
];
```

### 额外栏目 · Section Types

支持 6 种类型：

| type | 说明 | items 格式 |
| --- | --- | --- |
| cards | 卡片网格 | `{ name, desc, url, icon?, color? }` |
| projects | 开源项目 | `{ name, desc, tags?, color?, sources[], readme? }` |
| friends | 友情链接 | `{ name, desc, url, color?, icon? }` |
| tags | 标签胶囊 | `['JavaScript', 'Vue', ...]` |
| timeline | 时间线 | `{ date, text }` |
| list | 文字列表 | `{ name, url }` |

### 开源项目示例 · Project Example

```js
{
  name: 'Capha-Script',
  desc: '可在 Linux 和 Termux 上运行的 Bash 脚本工具箱',
  tags: ['Bash', 'Linux', 'Termux'],
  color: 'a78bfa',
  sources: [
    {
      label:    'GitHub',
      repo:     'https://github.com/you/repo',
      download: 'https://github.com/you/repo/archive/refs/heads/main.zip',
    },
  ],
  readme: 'https://raw.githubusercontent.com/you/repo/main/README.md',
}
```

### 图标写法 · Icon Usage

`icon` 字段支持 5 种写法：

| 写法 | 结果 |
| --- | --- |
| `'github.png'` | `assets/icons/github.png` |
| `'assets/custom/xxx.png'` | 相对路径 |
| `'https://example.com/icon.png'` | 完整 URL |
| `'data:image/svg+xml,...'` | 内联 SVG |
| 不写 | 自动抓取 favicon |

---

## 🎨 主题定制 · Theming

### 主要颜色 · Main Colors

编辑 `css/style.css` 顶部变量：

```css
:root {
  --pad: 32px;        /* 页面内边距 */
  --gap: 24px;        /* 栏间距 */
  --r-lg: 32px;       /* 大圆角 */
  --r-md: 22px;       /* 中圆角 */
}
```

### 深色 / 浅色 · Dark / Light

在 `css/theme.css` 修改两套变量：

```css
html[data-theme="dark"] {
  /* ... */
}

html[data-theme="light"] {
  /* ... */
}
```

### 极光颜色 · Aurora

在 `css/style.css` 修改三个 blob：

```css
/* 紫 */
.b1 { background: #5b21b6; }
/* 青 */
.b2 { background: #0e7490; }
/* 粉 */
.b3 { background: #be185d; }
```

### 背景图 API · Background API

编辑 `js/bg-image.js`：

```js
const CONFIG = {
  api:       'https://www.loliapi.com/acg/pc',  // 电脑端
  mobileApi: 'https://www.loliapi.com/acg/pe',  // 手机端
  ttl:       60 * 60 * 1000,                    // 缓存时长 1 小时
  fallbacks: [                                   // 本地兜底
    'assets/background/1.jpg',
    'assets/background/2.jpg',
  ],
};
```

### 粒子效果 · Particles

编辑 `js/particle-fx.js` 顶部 `CONFIG`：

```js
const CONFIG = {
  countDesktop: 14,     // 桌面端粒子数
  countMobile:  9,      // 手机端粒子数
  speedMin: 3.5,
  speedMax: 9,
  sizeMin: 4,
  sizeMax: 9,
  gravity: 0.16,
  roundness: 0.28,
  glowDesktop: true,
};
```

---

## 💾 缓存策略 · Cache Strategy

**核心原则：** HTML 永不缓存，CSS/JS/字体/图片长缓存，靠 `?v=` 破缓存。

| 文件 | 缓存 | 破缓存方式 |
| --- | --- | --- |
| `.html` | no-cache | 每次验证 |
| `.css` / `.js` | 1 年 | `?v=xxx` |
| 字体 | 1 年 | 很少变 |
| 图片 | 1 年 | 很少变 |

### 服务器配置（选一个）

**Nginx**（加到 `server { }` 里）：

```nginx
location ~* \.(html|htm)$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    expires 0;
}
location ~* \.(css|js|woff2?|ttf|otf)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
location ~* \.(png|jpe?g|gif|webp|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

**Vercel**（`vercel.json`）：

```json
{
  "headers": [
    { "source": "/(.*).html", "headers": [
      { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
    ]},
    { "source": "/(.*).(css|js|woff2|woff|ttf|otf)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
    ]}
  ]
}
```

**Netlify**（`_headers`）：

```
/*.html
  Cache-Control: no-cache, no-store, must-revalidate

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable
```

**GitHub Pages：** 改不了服务器响应头，每次改完代码运行：

```bash
python bump-version.py
```

会自动把 `index.html` 里所有 `?v=` 换成新版本号。

---

## 📄 README 阅读器 · README Viewer

点击项目的「文档」按钮弹出 Markdown 阅读器。

功能特性：

- 自动推导 GitHub 镜像（jsDelivr / ghproxy / gitmirror 等）
- 多源依次尝试，直到成功
- 支持 GFM（表格、任务列表、代码块）
- 若 marked 加载失败，自动降级为纯文本
- 弹窗从按钮位置向外扩散，附毛玻璃遮罩

---

## 🎁 彩蛋与特效 · Easter Eggs

| 特效 | 触发方式 |
| --- | --- |
| ✨ 点击飘字 | 屏幕任意位置点击 |
| 🎆 粒子迸射 | 点击按钮 / 卡片 / 链接 |
| 🏷️ 标签页标题 | 切换标签页 |
| 🎨 背景图随机 | 每次刷新页面（1 小时缓存） |
| 📖 README 阅读器 | 点击项目卡片上的「文档」 |
| ⚠️ 外链警告 | 点击站外链接 |
| 🖼️ 查看/下载背景图 | 右下角「查看背景图」按钮 |

---

## ⚡ 性能优化 · Performance

**手机端自动降级：**

- 关闭 `backdrop-filter` —— 改用半透明深色背景
- 关闭极光动画 —— 减少 GPU 负载
- 关闭 Ken Burns 缩放 —— 背景图静态显示
- 关闭粒子发光 —— 不加 `shadowBlur`
- 图标并发加载 —— 手机 6，桌面 10
- 飘字数量减少 —— 手机最多 6 条，间隔 120ms
- 粒子数量减少 —— 手机 9 个，桌面 14 个
- `min-width: 0` —— 防止 flex 子项撑开导致布局偏移

---

## 🌐 浏览器支持 · Browser Support

| 浏览器 | 支持情况 |
| --- | --- |
| Chrome / Edge（桌面） | ✅ 完整 |
| Firefox（桌面） | ✅ 完整 |
| Safari（macOS） | ✅ 完整 |
| Chrome / Edge（手机） | ✅ 完整 |
| Safari（iOS） | ✅ 完整 |
| 旧版 IE | ❌ 不支持 |

---

## ⚠️ 已知限制 · Known Limitations

1. `beforeunload` 弹窗在移动端被禁用 —— 手机浏览器规范限制，无法拦截关闭标签。
2. favicon.im 抓不到时会返回「F」占位图 —— 已通过候选链排序缓解。
3. loliapi 免费 API 偶尔抽风 —— 已通过超时 + 重试 + 本地兜底保证可用。
4. 背景图 blob 保存受 CORS 限制 —— 无法获取 blob 时禁用保存，仅能右键另存。

---

## 🛠 技术栈 · Tech Stack

- HTML5 / CSS3 / JavaScript (ES6+) —— 无框架，纯原生
- [marked](https://github.com/markedjs/marked) —— Markdown 渲染（本地化）
- Canvas 2D —— 粒子特效渲染
- Cache API —— 背景图 blob 缓存
- Fetch API —— 原生浏览器 API

---

## 🧩 常见维护 · Maintenance

- **添加新链接：** 编辑 `js/config.js` 里的 `SITES` 数组。
- **添加新栏目：** 编辑 `js/config.js` 里的 `SECTIONS` 数组。
- **修改主题色：** 编辑 `css/style.css` 的 `:root` 变量。
- **换字体：** 把 `.ttf` 放到 `assets/font/`，再改 `css/style.css` 顶部 `@font-face` 的 `src`。

### 部署后更新 · Update after Deploy

| 平台 | 操作 |
| --- | --- |
| Nginx | 覆盖文件 → 自动生效 |
| Vercel / Netlify | `git push` |
| GitHub Pages | `python bump-version.py` → `git push` |

---

## 📜 开源协议 · License

MIT License © 2026 TClaw

---

## 💖 致谢 · Credits

- 背景图 API：[loliapi](https://www.loliapi.com/)
- 图标服务：favicon.im、DuckDuckGo
- Markdown 渲染：[marked](https://github.com/markedjs/marked)

---

<div align="center">

如果这个项目对你有帮助，给个 ⭐ 吧～  
If this project helps you, please give it a ⭐ ~

Made with 💜 by TClaw

</div>

