# TClaw-WebUI

> A Liquid Glass Personal Homepage

![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Introduction

A personal homepage built with vanilla HTML / CSS / JavaScript, featuring a **Liquid Glass** aesthetic. Split-pane layout on desktop, with background images, link cards, open-source project showcase, friend links, a README viewer, click text effects, and tab title effects.

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 🪟 **Liquid Glass UI** | Frosted glass with gradient border and top highlight |
| 📱 **Responsive Layout** | Desktop split-pane / mobile single column |
| 🖼️ **Dynamic Background** | Random images from loliapi (landscape for PC, portrait for mobile) |
| 🔗 **Auto Icons** | Site's own favicon → favicon.im fallback |
| 📂 **Multiple Section Types** | Open source projects / skills / friend links / timeline / lists |
| 📄 **README Viewer** | Multi-source auto-switching + Markdown rendering |
| ✨ **Click Text Effect** | Random text appears on screen click |
| 🏷️ **Tab Title Effect** | Title changes when switching tabs |
| ⚡ **Performance Optimizations** | Disables blur effects on mobile, controls icon loading concurrency |

---

## 🗂 Project Structure

```
personal-homepage/
├── index.html              # Main page
├── css/
│   ├── style.css           # Main styles (including glass effects)
│   ├── section.css         # Section styles
│   ├── bg-image.css        # Background image styles
│   ├── click-fx.css        # Click effect styles
│   └── loading.css         # Loading page styles
├── js/
│   ├── config.js           # ★ Personal configuration (main file to edit)
│   ├── main.js             # Rendering logic
│   ├── bg-image.js         # Background image loading
│   ├── click-fx.js         # Click effects
│   └── title-fx.js         # Title effects
└── assets/
├── avatar/
│   └── avatar.jpg      # Avatar
├── icons/              # Custom icons
└── favicon.png         # Site icon (recommended 512×512)
```

---

## 🚀 Quick Start

### 1. Clone / Download

```bash
git clone https://github.com/yourname/personal-homepage.git
cd personal-homepage
```

### 2. Local Preview

Do not open `index.html` directly (some features require an HTTP server).

```bash
# Python 3
python -m http.server 8080

# Or Node.js
npx serve .
```

Then open http://localhost:8080 in your browser.

### 3. Deploy

Recommended platforms (all free, support HTTPS):

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

---

## ⚙️ Configuration

All personal content is centralized in `js/config.js` — you only need to edit this one file.

### Profile

```js
const PROFILE = {
  avatar: 'assets/avatar/avatar.jpg',  // Avatar path
  name:   'Your Name',                 // Display name
  role:   'Position / Tag',            // Subtitle
  bio:    'Personal bio',              // Bio (supports line breaks)
  email:  'you@example.com',           // Email
};
```

### Panel Title

```js
const PANEL = {
  title:    'Links to find me',   // Main title
  subtitle: 'Nice to meet you~',  // Subtitle
};
```

### Site Cards

```js
const SITES = [
  {
    name:  'GitHub',
    url:   'https://github.com/yourname',
    desc:  'My open-source code',
    color: 'ffffff',        // Brand color (hover glow)
    // icon: 'github.png',  // Optional: custom icon
  },
  // ...more
];
```

### Extra Sections

Supports 5 section types:

| type | Description | items format |
| --- | --- | --- |
| cards | Card grid | `{ name, desc, url, icon?, color? }` |
| projects | Open-source projects | `{ name, desc, tags?, color?, sources[], readme? }` |
| friends | Friend links | `{ name, desc, url, color?, icon? }` |
| tags | Tag pills | `['JavaScript', 'Vue', ...]` |
| list | Text list | `{ name, url }` |

Open-source project example:

```js
{
  name: 'Capha-Script',
  desc: 'A Bash script toolbox that runs on Linux and Termux',
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

### Icon Formats

The `icon` field supports four formats:

| Format | Result |
| --- | --- |
| `'github.png'` | `assets/icons/github.png` |
| `'assets/custom/xxx.png'` | Relative path |
| `'https://example.com/icon.png'` | Full URL |
| `'data:image/svg+xml,...'` | Inline SVG |
| _(not set)_ | Auto-fetch favicon |

---

## 🎨 Theming

### Main Colors

Edit the CSS variables at the top of `css/style.css`:

```css
:root {
  --pad: 32px;        /* Page padding */
  --gap: 24px;        /* Column gap */
  --r-lg: 32px;       /* Large radius */
  --r-md: 22px;       /* Medium radius */
}
```

### Background Color

```css
body { background: #06070c; }
```

```html
<meta name="theme-color" content="#06070c">
```

### Aurora Colors

Edit the three blobs in `css/style.css`:

```css
.b1 { background: #5b21b6; }  /* Purple */
.b2 { background: #0e7490; }  /* Cyan */
.b3 { background: #be185d; }  /* Pink */
```

### Background Image API

Edit `js/bg-image.js`:

```js
const CONFIG = {
  api:       'https://www.loliapi.com/acg/pc',  // Desktop
  mobileApi: 'https://www.loliapi.com/acg/pe',  // Mobile
  // ...
};
```

### Particle Effect

Edit the `CONFIG` at the top of `js/particle-fx.js`:

```js
const CONFIG = {
  countDesktop: 18,     // Particle count on desktop
  countMobile:  12,     // Particle count on mobile
  speedMin: 3,          // Min speed
  speedMax: 9,          // Max speed
  sizeMin: 5,           // Min size
  sizeMax: 11,          // Max size
  gravity: 0.12,        // Gravity
  roundness: 0.28,      // Roundness ratio
  glowDesktop: true,    // Glow on desktop
};
```

---

## 📄 README Viewer

Click the 「Docs」 button on a project to open the Markdown viewer.

- Automatically resolves GitHub mirrors (jsDelivr / ghproxy / gitmirror, etc.)
- Tries multiple sources in sequence until one succeeds
- Supports GFM (tables, task lists, code blocks)
- Gracefully falls back to plain text if `marked` fails to load

---

## 🎁 Easter Eggs & Effects

| Effect | Trigger |
| --- | --- |
| ✨ Click text | Click anywhere on the screen |
| 🏷️ Tab title | Switch tabs |
| 🎨 Random background | Refresh the page |
| 📖 README viewer | Click 「Docs」 on a project card |
| 🎆 Particle burst | Click a button / card / link |
| 🐙 GitHub hover button | Hover over the button at the bottom right |

---

## ⚡ Performance

Optimizations for mobile:

- Disables `backdrop-filter` — replaced with semi-transparent dark background
- Disables aurora animation — reduces GPU load
- Disables Ken Burns zoom — background image stays static
- Icon loading concurrency (6 on mobile, 10 on desktop)
- Reduces floating text (max 6 on mobile, 120ms interval)
- `min-width: 0` — prevents flex children from overflowing
- Reduces particle count (12 on mobile, 18 on desktop)
- Disables particle glow on mobile (no `shadowBlur`)

---

## 🌐 Browser Support

| Browser | Support |
| --- | --- |
| Chrome / Edge (desktop) | ✅ Full |
| Firefox (desktop) | ✅ Full |
| Safari (macOS) | ✅ Full |
| Chrome / Edge (mobile) | ✅ Full |
| Safari (iOS) | ✅ Full |
| Old IE | ❌ Not supported |

---

## ⚠️ Known Limitations

1. **`beforeunload` prompt is disabled on mobile** — Mobile Edge / Chrome / Safari will not show the "confirm leave" dialog, due to browser specification limits.
2. **favicon.im may return a placeholder "F"** — Mitigated by prioritizing the site's own favicon.
3. **loliapi free API may occasionally fail** — Mitigated with timeout + retry + hard fallback to keep the page usable.

---

## 🛠 Tech Stack

- HTML5 / CSS3 / JavaScript (ES6+) — No framework, pure vanilla
- marked — Markdown rendering
- Fetch API — Native browser API
- Canvas 2D — Particle effect rendering

---

## 📜 License

MIT License © 2026 TClaw

---

## 💖 Credits

- Background image API: loliapi
- Icon services: favicon.im, DuckDuckGo
- Markdown rendering: marked

---

<div align="center">

If this project helps you, please give it a ⭐ ~

Made with 💜 by TClaw

</div>

