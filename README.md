# TClaw-WebUI

A Multi-functional Personal Website Template

![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Introduction

A personal homepage built with vanilla HTML / CSS / JavaScript, featuring a Liquid Glass aesthetic. Split-pane layout on desktop with dynamic backgrounds, link cards, open-source projects, friend links, README viewer, dark/light theme, click effects, and cache optimization.

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 🪟 Liquid Glass UI | Frosted glass + gradient borders + top highlight |
| 🌗 Dark/Light Theme | Auto-switch based on time, manual setting saved in cookie |
| 🖼️ Dynamic Background | Fetched from loliapi – landscape for PC, portrait for mobile |
| 💾 Image Cache | Blob stored via Cache API, refreshed every hour, instant load |
| 🔗 Icon Fallback | Site favicon → favicon.im as backup |
| 📂 Multiple Sections | Open-source projects / skills / friends / timeline / lists |
| 📄 README Viewer | Multi-source auto-switching + Markdown rendering |
| 🖼️ Background Viewer | Modal display + one-click save |
| ⚠️ External Link Warning | Confirmation dialog when clicking external links |
| ✨ Click Text Effect | Random text appears wherever you click |
| 🎆 Particle Burst | Particles burst on button/card clicks |
| 🏷️ Tab Title Effect | Title changes when tab is switched |
| 🐙 Floating Button Group | View background / DreamCloud / GitHub (bottom-right) |
| 📱 Responsive Layout | Two columns on desktop, single column on mobile |
| ⚡ Performance Optimization | Automatically disables blur & animations on mobile |

---

## 🗂 Project Structure

```text
personal-homepage/
├── index.html                  # Main page
├── 404.html                    # 404 page
├── robots.txt                  # Search engine rules
├── sitemap.xml                 # Sitemap
├── bump-version.py             # One-click version bump (for GitHub Pages)
│
├── css/
│   ├── style.css               # Main styles
│   ├── theme.css               # Theme variables
│   ├── section.css             # Sections + README modal
│   ├── loading.css             # Loading screen
│   ├── bg-image.css            # Background image
│   ├── bg-viewer.css           # Background viewer
│   ├── leave-warning.css       # External link warning
│   ├── click-fx.css            # Click text effect
│   ├── particle-fx.css         # Particle effect
│   ├── skeleton.css            # Skeleton screen
│   └── ui-polish.css           # UI polish layer
│
├── js/
│   ├── vendor/
│   │   └── marked.min.js       # Markdown rendering (local)
│   │
│   ├── config.js               # ★ Personal configuration (main file to edit)
│   ├── utils.js                # Utility functions + SVG icons
│   ├── theme-init.js           # Initial theme (prevents flash)
│   ├── theme.js                # Theme toggle button
│   ├── loading.js              # Loading screen control
│   ├── icons.js                # Icon candidate chain
│   ├── render.js               # Card + section rendering
│   ├── readme.js               # README modal
│   ├── app.js                  # Main flow
│   ├── bg-image.js             # Background image loading
│   ├── bg-viewer.js            # View/download background image
│   ├── leave-warning.js        # External link confirmation
│   ├── click-fx.js             # Click text effect
│   ├── title-fx.js             # Tab title effect
│   └── particle-fx.js          # Particle effect
│
└── assets/
    ├── avatar/
    │   └── avatar.jpg          # Avatar
    ├── icons/                  # Custom icons
    ├── background/             # Local fallback backgrounds
    ├── font/
    │   └── font.ttf            # Local font
    └── favicon.png             # Site icon (512×512)
```

---

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Cyrene-Castorice114/TClaw-Web.git
   cd TClaw-Web
   ```

2. **Preview locally**

   ```bash
   # Python 3
   python -m http.server 8080

   # or Node.js
   npx serve .
   ```

   Open http://localhost:8080 in your browser.

   > ⚠️ Do not double-click `index.html` directly – some features require an HTTP server.

3. **Deploy**

   Recommended free platforms with HTTPS support:

   - Vercel
   - Netlify
   - Cloudflare Pages
   - GitHub Pages

---

## ⚙️ Configuration

All personal content is centralized in `js/config.js` – you only need to edit this one file.

### Profile

```js
const PROFILE = {
  avatar: 'assets/avatar/avatar.jpg',
  name:   'Your Name',
  role:   'Title / Tagline',
  bio:    'A short bio (line breaks supported)',
  email:  'you@example.com',
};
```

### Panel

```js
const PANEL = {
  title:    'Links where you can find me',
  subtitle: 'Nice to meet you~',
};
```

### Sites

```js
const SITES = [
  {
    name:  'GitHub',
    url:   'https://github.com/yourname',
    desc:  'My open-source code',
    color: 'ffffff',        // Brand color (hover glow)
    // icon: 'github.png',  // Optional: custom icon
  },
];
```

### Section Types

Six types are supported:

| type | Description | items format |
| --- | --- | --- |
| cards | Card grid | `{ name, desc, url, icon?, color? }` |
| projects | Open-source projects | `{ name, desc, tags?, color?, sources[], readme? }` |
| friends | Friend links | `{ name, desc, url, color?, icon? }` |
| tags | Tag pills | `['JavaScript', 'Vue', ...]` |
| timeline | Timeline | `{ date, text }` |
| list | Text list | `{ name, url }` |

### Project Example

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

### Icon Usage

The `icon` field supports five forms:

| Form | Result |
| --- | --- |
| `'github.png'` | `assets/icons/github.png` |
| `'assets/custom/xxx.png'` | Relative path |
| `'https://example.com/icon.png'` | Full URL |
| `'data:image/svg+xml,...'` | Inline SVG |
| omitted | Auto-fetch favicon |

---

## 🎨 Theming

### Main Colors

Edit the variables at the top of `css/style.css`:

```css
:root {
  --pad: 32px;        /* Page padding */
  --gap: 24px;        /* Column gap */
  --r-lg: 32px;       /* Large radius */
  --r-md: 22px;       /* Medium radius */
}
```

### Dark / Light

Edit the two sets of variables in `css/theme.css`:

```css
html[data-theme="dark"] {
  /* ... */
}

html[data-theme="light"] {
  /* ... */
}
```

### Aurora Colors

Edit the three blobs in `css/style.css`:

```css
/* Purple */
.b1 { background: #5b21b6; }
/* Cyan */
.b2 { background: #0e7490; }
/* Pink */
.b3 { background: #be185d; }
```

### Background API

Edit `js/bg-image.js`:

```js
const CONFIG = {
  api:       'https://www.loliapi.com/acg/pc',  // Desktop
  mobileApi: 'https://www.loliapi.com/acg/pe',  // Mobile
  ttl:       60 * 60 * 1000,                    // 1-hour cache
  fallbacks: [                                   // Local fallbacks
    'assets/background/1.jpg',
    'assets/background/2.jpg',
  ],
};
```

### Particles

Edit the `CONFIG` block at the top of `js/particle-fx.js`:

```js
const CONFIG = {
  countDesktop: 14,     // Particles on desktop
  countMobile:  9,      // Particles on mobile
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

## 💾 Cache Strategy

**Core principle:** HTML is never cached; CSS/JS/fonts/images are cached long-term, with `?v=` used to bust the cache.

| File | Cache | Cache busting |
| --- | --- | --- |
| `.html` | no-cache | Validated on every request |
| `.css` / `.js` | 1 year | `?v=xxx` |
| Fonts | 1 year | Rarely change |
| Images | 1 year | Rarely change |

### Server Configuration (pick one)

**Nginx** (add inside `server { }`):

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

**Vercel** (`vercel.json`):

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

**Netlify** (`_headers`):

```
/*.html
  Cache-Control: no-cache, no-store, must-revalidate

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable
```

**GitHub Pages:** response headers cannot be customized, so after each change run:

```bash
python bump-version.py
```

This automatically replaces every `?v=` in `index.html` with the new version number.

---

## 📄 README Viewer

Click the **Docs** button on a project to open the Markdown reader.

Features:

- Auto-derives GitHub mirrors (jsDelivr / ghproxy / gitmirror, etc.)
- Tries multiple sources in sequence until one succeeds
- Supports GFM (tables, task lists, code blocks)
- Falls back to plain text automatically if marked fails to load
- Modal expands outward from the button, with a frosted-glass overlay

---

## 🎁 Easter Eggs

| Effect | Trigger |
| --- | --- |
| ✨ Click text | Click anywhere on screen |
| 🎆 Particle burst | Click a button / card / link |
| 🏷️ Tab title | Switch tabs |
| 🎨 Random background | Refresh the page (cached for 1 hour) |
| 📖 README viewer | Click **Docs** on a project card |
| ⚠️ External link warning | Click an off-site link |
| 🖼️ View/download background | The **View Background** button (bottom-right) |

---

## ⚡ Performance

**Automatic mobile degradation:**

- Disables `backdrop-filter` – uses a semi-transparent dark background instead
- Disables the aurora animation – reduces GPU load
- Disables the Ken Burns zoom – background stays static
- Disables particle glow – no `shadowBlur`
- Concurrent icon loading – 6 on mobile, 10 on desktop
- Fewer floating words – at most 6 on mobile, 120ms interval
- Fewer particles – 9 on mobile, 14 on desktop
- `min-width: 0` – prevents flex children from blowing out the layout

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

1. The `beforeunload` prompt is disabled on mobile – mobile browsers do not allow intercepting tab closure by spec.
2. When favicon.im fails to fetch an icon it returns a placeholder "F" – mitigated by candidate-chain ordering.
3. The loliapi free API is occasionally flaky – mitigated by timeouts + retries + local fallbacks.
4. Saving background blobs is limited by CORS – when the blob cannot be fetched, saving is disabled and only right-click save works.

---

## 🛠 Tech Stack

- HTML5 / CSS3 / JavaScript (ES6+) – no framework, pure vanilla
- [marked](https://github.com/markedjs/marked) – Markdown rendering (vendored)
- Canvas 2D – particle rendering
- Cache API – background image blob cache
- Fetch API – native browser API

---

## 🧩 Maintenance

- **Add a link:** edit the `SITES` array in `js/config.js`.
- **Add a section:** edit the `SECTIONS` array in `js/config.js`.
- **Change the theme color:** edit the `:root` variables in `css/style.css`.
- **Change the font:** drop the `.ttf` into `assets/font/`, then update the `src` of `@font-face` at the top of `css/style.css`.

### Update after Deploy

| Platform | Action |
| --- | --- |
| Nginx | Overwrite files → takes effect immediately |
| Vercel / Netlify | `git push` |
| GitHub Pages | `python bump-version.py` → `git push` |

---

## 📜 License

MIT License © 2026 TClaw

---

## 💖 Credits

- Background API: [loliapi](https://www.loliapi.com/)
- Icon services: favicon.im, DuckDuckGo
- Markdown rendering: [marked](https://github.com/markedjs/marked)
- Inspiration: Apple Liquid Glass, astrbot.app

---

<div align="center">

If this project helps you, please give it a ⭐ ~

Made with 💜 by TClaw

</div>

