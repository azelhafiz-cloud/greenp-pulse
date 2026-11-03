# 🌿 GreenPulse

> **"Green Tomorrow — Building a Sustainable Future"**  
> A premium, production-ready sustainability web app for tracking personal eco impact, completing green challenges, and growing a living plant that reflects your environmental journey.

[![Vercel Deploy](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

### 🌱 Living Plant System
- A **living tree** that grows through 6 distinct stages: Seed → Sprout → Young Plant → Healthy Plant → Flourishing Tree → Ancient Forest
- Plant health reflects your engagement: **Thriving** (green glow), **Healthy**, **Needs Water** (2–3 days inactive), or **Wilting** (4+ days — drooping animation)
- Every green action immediately updates your plant with a pulse animation

### ⚡ Quick Log Buttons
- One-tap dashboard actions: **Walked / Cycled**, **Plant-based meal**, **No single-use plastic**, **Saved electricity**, **Public transport**
- Instant points, floating `+X pts` burst animation, and plant pulse on every tap

### 🏆 Daily & Weekly Green Challenges
- 12 practical challenges across 5 categories (Transport, Food, Energy, Waste, Nature)
- **Points system** with confetti celebration and streak tracking
- Category filter and difficulty indicators
- Preview of pending challenges directly on the dashboard

### 🏅 Badge Collection
- **15 badges** across milestones: streaks, challenge completions, plant growth, points earned, CO₂ saved
- Earned vs. locked states with full-color gradient icons and lock overlays
- Toast notifications when badges are unlocked (auto-dismiss in 3.5s)
- Progress bar showing `X / 15 earned`

### 📊 Impact Summary
- CO₂ saved converted into **4 human equivalents**: trees planted, car km avoided, phones charged, LED hours powered
- Weekly CO₂ area chart and points bar chart
- Category coverage radar chart
- Human-readable impact story that grows with your data

### 📅 Weekly Summary Modal
- Auto-shown once per week (after 7 days) — challenges done, points earned, plant level
- Rotating motivational message
- Botanical decorations and animated spring entrance

### 📚 Greenery Knowledge Cards
- 12 premium educational cards on sustainability
- Categories: **Clean Energy, Conservation, Daily Habits, Nature Facts**
- Expandable cards with key facts and beautiful gradient headers

### 🌟 Onboarding
- Beautiful 3-step welcome flow with botanical animations
- Introduces the mission and the growing plant concept

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary palette | Deep forest green `#15803d`, sage `#668558`, mint `#14b8a6` |
| Backgrounds | Cream `#f6f8f5` (light), Dark forest `#0d1f13` (dark) |
| Typography | Inter (Google Fonts) |
| Icons | Material Symbols Rounded (Google) |
| Animations | Framer Motion — smooth, restrained |
| Charts | Recharts (AreaChart, BarChart, RadarChart) |
| Dark mode | Full dark mode with nature-inspired dark tones |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3 with custom design tokens
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Material Symbols Rounded (Google)
- **Fonts**: Inter (Google Fonts)
- **Storage**: `localStorage` (no backend needed)
- **Deployment**: Vercel (zero-config)

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/greenpulse.git
cd greenpulse

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

---

## ☁️ Deploying to Vercel

### Option A: One-click (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to a GitHub repository
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click **Deploy** — Vercel auto-detects Next.js, no config needed!

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with metadata + fonts
│   ├── page.tsx                # Main app page (tab routing + overlays)
│   └── globals.css             # Global styles + CSS variables
├── components/
│   ├── NavBar.tsx              # Responsive top + bottom navigation (6 tabs)
│   ├── Onboarding.tsx          # 3-step welcome flow
│   ├── PlantVisual.tsx         # Animated SVG plant/tree (6 levels + health states)
│   ├── LeafPattern.tsx         # Botanical SVG overlay
│   ├── BadgeNotification.tsx   # Badge unlock toast notifications
│   ├── WeeklySummaryModal.tsx  # Weekly progress overlay modal
│   └── views/
│       ├── Dashboard.tsx       # Home: plant hero + quick log + stats + chart
│       ├── EcoTracker.tsx      # Full activity logging with CO₂ calculation
│       ├── Challenges.tsx      # Green challenges with confetti celebration
│       ├── Learn.tsx           # Knowledge cards
│       ├── Impact.tsx          # Impact summary + 4 equivalents + charts
│       └── Badges.tsx          # Badge collection (15 badges, earned/locked)
├── context/
│   └── AppContext.tsx          # Global state (React Context + localStorage)
├── data/
│   └── index.ts                # Emission factors, challenges, cards, badges, actions
├── lib/
│   └── storage.ts              # localStorage utilities, plant health, impact calcs
└── types/
    └── index.ts                # TypeScript interfaces
```

---

## 🌍 Competition Context

Built for the theme **"Green Tomorrow — Building a Sustainable Future"**, GreenPulse demonstrates how technology can empower individuals to understand and reduce their carbon footprint through beautiful, accessible design and meaningful data. The living plant at the heart of the experience creates an emotional connection that motivates consistent green behaviour.

---

## 📄 License

MIT License — feel free to fork and build upon this for educational or personal use.

---

*Made with 💚 for a greener future.*
