# TClaw-WebUI

> A Liquid Glass Personal Homepage

![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)



[中文 →](https://github.com/Cyrene-Castorice114/TClaw-Web/raw/main/README.md)
---

## 📖 Introduction

A personal homepage built with vanilla HTML / CSS / JavaScript, featuring a **Liquid Glass** aesthetic. It uses a split-pane layout on desktop, and integrates a dynamic background, link cards, open-source project showcase, friend links, a README viewer, click text effects, and tab title effects.

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 🪟 **Liquid Glass UI** | Frosted glass with gradient border and top highlight |
| 📱 **Responsive Layout** | Desktop split-pane / mobile single column |
| 🖼️ **Dynamic Background** | Random images from loliapi, landscape on PC, portrait on mobile |
| 🔗 **Auto Icons** | Site favicon → favicon.im fallback |
| 📂 **Multi-sections** | Projects / tags / friends / timeline / list |
| 📄 **README Viewer** | Multi-source auto-switch + Markdown rendering |
| ✨ **Click Text Effects** | Random text pops up when clicking anywhere |
| 🏷️ **Tab Title Effects** | Title changes on tab switch |
| ⚡ **Performance** | Mobile disables blur effects, controlled icon concurrency |

---

## 🗂 Project Structure

```

personal-homepage/
├── index.html              # Main page
├── css/
│   ├── style.css           # Main styles (glass effect)
│   ├── section.css         # Section styles
│   ├── bg-image.css        # Background image styles
│   ├── click-fx.css        # Click effect
│   └── loading.css         # Loading screen
├── js/
│   ├── config.js           # ★ Personal config (main file to edit)
│   ├── main.js             # Rendering logic
│   ├── bg-image.js         # Background loader
│   ├── click-fx.js         # Click effect
│   └── title-fx.js         # Title effect
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

2. Local Preview

Don't open index.html directly (some features require an HTTP server).

```bash
# Python 3
python -m http.server 8080

# Or Node.js
npx serve .
```

Then open http://localhost:8080 in your browser.

3. Deploy

Recommended platforms (all free, HTTPS supported):

· Vercel
· Netlify
· Cloudflare Pages
· GitHub Pages

---

⚙️ Configuration

All personal content lives in js/config.js — you only need to edit this file.

Profile

```js
const PROFILE = {
  avatar: 'assets/avatar/avatar.jpg',  // Avatar path
  name:   'Your Name',                 // Display name
  role:   'Job / Tagline',             // Subtitle
  bio:    'Short bio',                 // Bio (supports line breaks)
  email:  'you@example.com',           // Email
};
```

Panel Title

```js
const PANEL = {
  title:    'Find me here',       // Main title
  subtitle: 'Nice to meet you~',  // Subtitle
};
```

Site Cards

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

Sections

5 section types are supported:

type Description items format
cards Card grid { name, desc, url, icon?, color? }
projects Open-source repos { name, desc, tags?, color?, sources[], readme? }
friends Friend links { name, desc, url, color?, icon? }
tags Tag pills ['JavaScript', 'Vue', ...]
list Text list { name, url }

Example of a project item:

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

Icon Formats

The icon field supports 4 formats:

Format Result
'github.png' assets/icons/github.png
'assets/custom/xxx.png' Relative path
'https://example.com/icon.png' Full URL
'data:image/svg+xml,...' Inline SVG
Omitted Auto-fetch favicon

---

🎨 Theming

Main Colors

Edit the CSS variables at the top of css/style.css:

```css
:root {
  --pad: 32px;        /* Page padding */
  --gap: 24px;        /* Column gap */
  --r-lg: 32px;       /* Large radius */
  --r-md: 22px;       /* Medium radius */
}
```

Background Color

```css
body { background: #06070c; }
```

```html
<meta name="theme-color" content="#06070c">
```

Aurora Colors

Change the 3 blob elements in css/style.css:

```css
.b1 { background: #5b21b6; }  /* Purple */
.b2 { background: #0e7490; }  /* Cyan   */
.b3 { background: #be185d; }  /* Pink   */
```

Background Image API

Edit js/bg-image.js:

```js
const CONFIG = {
  api:       'https://www.loliapi.com/acg/pc',  // Desktop
  mobileApi: 'https://www.loliapi.com/acg/pe',  // Mobile
  // ...
};
```

---

📄 README Viewer

Click the "Docs" button on a project card to open the Markdown viewer.

· Auto-derives GitHub mirrors (jsDelivr / ghproxy / gitmirror, etc.)
· Tries sources in order until success
· Supports GFM (tables, task lists, code blocks)
· Falls back to plain text if marked fails to load

---

🎁 Easter Eggs

Effect Trigger
✨ Click text Click anywhere on the screen
🏷️ Tab title Switch tab
🎨 Random background Refresh the page
📖 README viewer Click "Docs" on a project card

---

⚡ Performance

Mobile optimizations:

· Disabled backdrop-filter — replaced with dark semi-transparent background
· Disabled aurora animations — reduces GPU load
· Disabled Ken Burns zoom — static background
· Icon concurrency — 6 on mobile, 10 on desktop
· Fewer click texts — max 6 on mobile with 120ms interval
· min-width: 0 — prevents flex items from overflowing

---

🌐 Browser Support

Browser Support
Chrome / Edge (Desktop) ✅ Full
Firefox (Desktop) ✅ Full
Safari (macOS) ✅ Full
Chrome / Edge (Mobile) ✅ Full
Safari (iOS) ✅ Full
Legacy IE ❌ Not supported

---

⚠️ Known Limitations

1. beforeunload popups are disabled on mobile
      Mobile Edge / Chrome / Safari won't show "Confirm leaving" dialogs — this is a browser spec limitation.
2. favicon.im returns an "F" placeholder when not found
      Mitigated by candidate chain ordering (site's own favicon is tried first).
3. loliapi free API occasionally fails
      Handled with timeout + retry + hard fallback to keep the page usable.

---

🛠 Tech Stack

· HTML5 / CSS3 / JavaScript (ES6+) — no framework, vanilla only
· marked — Markdown rendering
· Fetch API — native browser API

---

📜 License

MIT License © 2026 TClaw

---

💖 Credits

· Background image API: loliapi
· Icon service: favicon.im, DuckDuckGo
· Markdown rendering: marked
· Inspiration: Apple Liquid Glass, astrbot.app

---

<div align="center">

If this project helps you, please give it a ⭐ ~

Made with 💜 by TClaw

</div>
```