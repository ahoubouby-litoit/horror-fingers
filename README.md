# ☠ Horror Fingers

> A premium Halloween keyboard-smash toy. Press any key, click, or tap the screen to summon spooky monsters with procedurally generated horror sounds.

Inspired by [TinyFingers.net](https://tinyfingers.net) — rebuilt from scratch as a professional React + TypeScript + Vite application.

---

## ✨ Features

- **12 hand-crafted SVG monsters** — Ghost, Jack-o-Lantern, Skull, Bat, Spider, Vampire, Zombie, Witch, Frankenstein, Werewolf, Mummy, Demon
- **Procedural horror sounds** via Web Audio API — no audio files needed
- **Atmospheric effects** — animated fog layers, firefly particles, blood drips, random lightning flashes
- **Fullscreen mode** — one click to go fullscreen
- **Settings panel** — hold the top-left corner for 2 s to open; toggle sound, motion, fullscreen, or clear monsters
- **Touch + keyboard + mouse** — works on phones, tablets and desktops
- **Zero dependencies** beyond React — no audio libraries, no CSS frameworks

---

## 🗂 Project Structure

```
horror-fingers/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── monsters/        # 12 SVG monster components + barrel export
│   │   ├── BloodDrips/      # Animated blood drip effect
│   │   ├── Fireflies/       # Ambient firefly particles
│   │   ├── HUD/             # Title, live counter, intro hint
│   │   ├── MonsterSpawn/    # Individual spawned monster (animation wrapper)
│   │   └── ParentPanel/     # Settings overlay
│   ├── data/
│   │   └── monsters.ts      # Monster registry (id, name, color, sound, Component)
│   ├── hooks/
│   │   ├── useAudio.ts      # AudioContext lifecycle management
│   │   ├── useCornerHold.ts # Hold-to-activate interaction
│   │   ├── useFullscreen.ts # Fullscreen API wrapper
│   │   └── useMonsters.ts   # Monster state & summon logic
│   ├── utils/
│   │   └── audio.ts         # Procedural sound engine (Web Audio API)
│   ├── App.module.css
│   ├── App.tsx
│   ├── index.css            # Global reset + CSS keyframe animations
│   ├── main.tsx
│   ├── types.ts             # Shared TypeScript interfaces
│   └── vite-env.d.ts
├── .eslintrc.cjs
├── .gitignore
├── index.html               # CSP meta tag, X-Frame-Options
├── netlify.toml             # Netlify build + security headers
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json              # Vercel routes + security headers
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot-reloading)
npm run dev
# → http://localhost:5173
```

### Production Build

```bash
npm run build       # type-check + Vite bundle → ./dist
npm run preview     # preview the production build locally
```

---

## ☁️ Deployment

### Vercel (recommended — one command)

```bash
npm install -g vercel
vercel --prod
```

`vercel.json` already configures security headers and SPA routing.

### Netlify

```bash
npm run build
# Drag the ./dist folder into app.netlify.com/drop
# or connect your GitHub repo — netlify.toml handles everything
```

### GitHub Pages

```bash
# In vite.config.ts add:  base: '/horror-fingers/'
npm run build
npx gh-pages -d dist
```

---

## 🔒 Security Highlights

| Measure | Where |
|---|---|
| Content Security Policy | `index.html` meta + `vercel.json` / `netlify.toml` headers |
| `X-Frame-Options: DENY` | All response headers |
| `X-Content-Type-Options: nosniff` | All response headers |
| `Referrer-Policy: no-referrer` | All response headers |
| `Permissions-Policy` (camera / mic / geo off) | All response headers |
| No `dangerouslySetInnerHTML` | Code review / ESLint |
| No `eval` / `Function()` | ESLint `no-eval`, `no-implied-eval` |
| Strict TypeScript (`strict: true`) | `tsconfig.json` |
| AudioContext created lazily | Respects browser autoplay policy |
| Event listeners cleaned up | `useEffect` returns |

---

## 🎮 How to Use

| Action | Effect |
|---|---|
| Press any key | Summon a random monster + play horror sound |
| Click anywhere | Summon at cursor position |
| Touch anywhere | Summon at touch point |
| Hold top-left corner (1.8 s) | Open Crypt Settings panel |
| Fullscreen button | Toggle browser fullscreen |

---

## 🛠 Tech Stack

- **React 18** — UI
- **TypeScript 5** — type safety
- **Vite 5** — build tool
- **CSS Modules** — scoped styles, no runtime CSS-in-JS
- **Web Audio API** — zero-dependency sound synthesis
- **Pure SVG** — all monsters drawn in code, no image files

---

## 📜 License

MIT — free to use, modify, and deploy.
