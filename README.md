# TClaw-WebUI

> 一个液态玻璃风格的个人主页 · A Liquid Glass Personal Homepage

![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)


[English](https://github.com/Cyrene-Castorice114/TClaw-Web/blob/en/README.md)
---

## 📖 简介 · Introduction

**中文**  
一个基于原生 HTML / CSS / JavaScript 的个人主页，主打**液态玻璃（Liquid Glass）**视觉风格，左右分栏布局，集成背景图、链接卡片、开源项目展示、友情链接、README 阅读器、点击文字特效、标签页标题特效等功能。

**English**  
A personal homepage built with vanilla HTML / CSS / JavaScript, featuring a **Liquid Glass** aesthetic. Split-pane layout on desktop, with background images, link cards, open-source project showcase, friend links, a README viewer, click text effects, and tab title effects.

---

## ✨ 功能特性 · Features

| 功能 Feature | 说明 Description |
| --- | --- |
| 🪟 **液态玻璃 UI** | 磨砂玻璃 + 渐变描边 + 顶部高光 · Frosted glass with gradient border and top highlight |
| 📱 **响应式布局** | 桌面双栏 / 移动单栏 · Desktop split-pane / mobile single column |
| 🖼️ **动态背景图** | 从 loliapi 随机拉取，PC 用横图、手机用竖图 · Random from loliapi |
| 🔗 **自动图标** | 网站自身 favicon → favicon.im 兜底 · Site favicon → favicon.im fallback |
| 📂 **多栏目支持** | 开源项目 / 技能栈 / 友情链接 / 时间线 / 列表 · Multiple section types |
| 📄 **README 阅读器** | 多源自动切换 + Markdown 渲染 · Multi-source + Markdown rendering |
| ✨ **点击飘字** | 屏幕任意处点击随机显示文案 · Random text on click |
| 🏷️ **标签页特效** | 切换标签时标题变化 · Title changes on tab switch |
| ⚡ **性能优化** | 手机端关闭模糊特效，控制图标加载并发 · Mobile optimizations |

---

## 🗂 项目结构 · Project Structure
```
personal-homepage/
├── index.html              # 主页面 Main page
├── css/
│   ├── style.css           # 主样式（含玻璃效果）
│   ├── section.css         # 栏目样式
│   ├── bg-image.css        # 背景图样式
│   ├── click-fx.css        # 点击特效
│   └── loading.css         # 加载页
├── js/
│   ├── config.js           # ★ 个人配置（主要编辑）
│   ├── main.js             # 渲染逻辑
│   ├── bg-image.js         # 背景图加载
│   ├── click-fx.js         # 点击特效
│   └── title-fx.js         # 标题特效
└── assets/
├── avatar/
│   └── avatar.jpg      # 头像
├── icons/              # 自定义图标
└── favicon.png         # 网站图标（建议 512×512）

```

---

## 🚀 快速开始 · Quick Start

### 1. 克隆 / 下载项目 · Clone / Download

```bash
git clone https://github.com/yourname/personal-homepage.git
cd personal-homepage
```

### 2. 本地预览 · Local Preview

不要直接双击 index.html（部分功能需要 HTTP 服务）。
Don't open index.html directly (some features require an HTTP server).

```bash
# Python 3
python -m http.server 8080

# 或 Node.js
npx serve .
```

然后浏览器打开 http://localhost:8080。

### 3. 部署 · Deploy

推荐以下平台（都免费，支持 HTTPS）：

 - Vercel
 - Netlify
 - Cloudflare Pages
 - GitHub Pages

---

## ⚙️ 配置说明 · Configuration

所有个人内容都集中在 js/config.js，只需要编辑这一个文件。

### 个人信息 · Profile

```js
const PROFILE = {
  avatar: 'assets/avatar/avatar.jpg',  // 头像路径
  name:   '你的名字',                   // 显示名
  role:   '职位 / 标签',                // 副标题
  bio:    '个人简介',                   // 简介（支持换行）
  email:  'you@example.com',          // 邮箱
};
```

### 面板标题 · Panel Title

```js
const PANEL = {
  title:    '能找到我的链接',   // 主标题
  subtitle: '很高兴见到你~',    // 副标题
};
```

### 网站卡片 · Site Cards

```js
const SITES = [
  {
    name:  'GitHub',
    url:   'https://github.com/yourname',
    desc:  '我的开源代码',
    color: 'ffffff',        // 品牌色（hover 光晕）
    // icon: 'github.png',  // 可选：自定义图标
  },
  // ...更多
];
```

### 额外栏目 · Sections

支持 5 种栏目类型：

type 说明 items 格式
cards 卡片网格 { name, desc, url, icon?, color? }
projects 开源项目 { name, desc, tags?, color?, sources[], readme? }
friends 友情链接 { name, desc, url, color?, icon? }
tags 标签胶囊 ['JavaScript', 'Vue', ...]
list 文字列表 { name, url }

开源项目示例：

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

### 图标写法 · Icon Formats

icon 字段支持四种写法：

写法 结果
'github.png' assets/icons/github.png
'assets/custom/xxx.png' 相对路径
'https://example.com/icon.png' 完整 URL
'data:image/svg+xml,...' 内联 SVG
不写 自动抓取 favicon

---

## 🎨 主题定制 · Theming

### 主要颜色 · Main Colors

编辑 css/style.css 顶部的 CSS 变量：

```css
:root {
  --pad: 32px;        /* 页面内边距 */
  --gap: 24px;        /* 栏间距 */
  --r-lg: 32px;       /* 大圆角 */
  --r-md: 22px;       /* 中圆角 */
}
```

### 背景色 · Background Color

```css
body { background: #06070c; }
```

```html
<meta name="theme-color" content="#06070c">
```

### 极光颜色 · Aurora Colors

在 css/style.css 里改三个 blob：

```css
.b1 { background: #5b21b6; }  /* 紫色 */
.b2 { background: #0e7490; }  /* 青色 */
.b3 { background: #be185d; }  /* 粉色 */
```

### 背景图 API · Background Image API

编辑 js/bg-image.js：

```js
const CONFIG = {
  api:       'https://www.loliapi.com/acg/pc',  // 电脑端
  mobileApi: 'https://www.loliapi.com/acg/pe',  // 手机端
  // ...
};
```

### 粒子效果 · Particle Effect

编辑 js/particle-fx.js 顶部的 CONFIG：

```js
const CONFIG = {
  countDesktop: 18,     // 桌面端粒子数
  countMobile:  12,     // 手机端粒子数
  speedMin: 3,          // 最小速度
  speedMax: 9,          // 最大速度
  sizeMin: 5,           // 最小尺寸
  sizeMax: 11,          // 最大尺寸
  gravity: 0.12,        // 重力
  roundness: 0.28,      // 圆角比例
  glowDesktop: true,    // 桌面端发光
};
```

---

## 📄 README 阅读器 · README Viewer

点击项目的 「文档」 按钮会弹出 Markdown 阅读器。

 - 自动推导 GitHub 镜像（jsDelivr / ghproxy / gitmirror 等）
 - 多源依次尝试，直到成功
 - 支持 GFM（表格、任务列表、代码块）
 - 若 marked 加载失败，自动降级为纯文本

---

## 🎁 彩蛋与特效 · Easter Eggs

| 特效 | 触发 |
| --- | --- |
| ✨ 点击飘字 | 屏幕上任意位置点击 |
| 🏷️ 标签页标题 | 切换标签 |
| 🎨 背景图随机 | 每次刷新页面 |
| 📖 README 阅读器 | 点击项目卡片上的「文档」 |
| 🎆 粒子迸射 | 点击按钮 / 卡片 / 链接 |
| 🐙 GitHub 悬浮按钮 | 鼠标悬停右下角按钮 |

---

## ⚡ 性能优化 · Performance

针对手机端做的优化：

 - 关闭 backdrop-filter —— 改用半透明深色背景
 - 关闭极光动画 —— 减少 GPU 负载
 - 关闭 Ken Burns 缩放 —— 背景图静态显示
 - 图标并发/串行加载 —— 手机端并发 6，桌面端并发 10
 - 飘字数量减少 —— 手机端最多 6 条，间隔 120ms
 - min-width: 0 —— 防止 flex 子项撑开导致布局偏移
 - 粒子数量减少 —— 手机端 12 个，桌面端 18 个
 - 粒子关闭发光 —— 手机端不加 shadowBlur

---

## 🌐 浏览器支持 · Browser Support

| 浏览器 | 支持 |
| --- | --- |
| Chrome / Edge (桌面) | ✅ 完整 |
| Firefox (桌面) | ✅ 完整 |
| Safari (macOS) | ✅ 完整 |
| Chrome / Edge (手机) | ✅ 完整 |
| Safari (iOS) | ✅ 完整 |
| 旧版 IE | ❌ 不支持 |

---

## ⚠️ 已知限制 · Known Limitations

1. beforeunload 弹窗在移动端被禁用
      手机 Edge / Chrome / Safari 不会显示「确认离开」弹窗，这是浏览器规范限制。
2. favicon.im 抓不到时会返回「F」占位图
      已通过候选链排序缓解（网站自身 favicon 优先）。
3. loliapi 免费 API 偶尔抽风
      已通过超时 + 重试 + 硬兜底保证页面可用。

---

## 🛠 技术栈 · Tech Stack

 - HTML5 / CSS3 / JavaScript (ES6+) —— 无框架，纯原生
 - marked —— Markdown 渲染
 - Fetch API —— 原生浏览器 API
 - HTML5 / CSS3 / JavaScript (ES6+) —— 无框架，纯原生
 - Canvas 2D —— 粒子特效渲染

---

## 📜 开源协议 · License

MIT License © 2026 TClaw

---

## 💖 致谢 · Credits

 - 背景图 API：loliapi
 - 图标服务：favicon.im、DuckDuckGo
 - Markdown 渲染：marked

---

<div align="center">

如果这个项目对你有帮助，给个 ⭐ 吧～
If this project helps you, please give it a ⭐ ~

Made with 💜 by TClaw

</div>
