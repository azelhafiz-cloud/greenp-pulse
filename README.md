# 🌿 GreenPulse

> **"Green Tomorrow — Building a Sustainable Future"**  
> A premium, production-grade sustainability web application for tracking personal eco impact, completing green challenges, nurturing an emotionally engaging living plant, and staying connected to real-world planetary atmospheric data.

[![Vercel Deploy](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Major Upgrades & Features

### 1. 🪴 Central Living Plant System (Centerpiece Sanctuary)
- **Sanctuary Stage**: The living plant is the commanding, central visual hero on the dashboard, animated with handcrafted SVG botanical art, organic wind swaying, and ambient root shadows.
- **8 Evolution Stages**:
  1. *Seed of Hope* (0 pts) — Dormant in fertile soil, holding promise.
  2. *First Sprout* (100 pts) — Cotyledons opening toward sunlight.
  3. *Young Sapling* (250 pts) — Firm woody stem and branching leaves.
  4. *Healthy Grove Plant* (500 pts) — Lush multi-tier foliage purifying the air.
  5. *Flourishing Tree* (900 pts) — Mighty trunk and sprawling canopy.
  6. *Ancient Forest Elder* (1,500 pts) — Venerable old-growth forest guardian.
  7. **✦ Solar Bloom Wonder (Special Evolved Form I)** (2,400 pts) — Radiant golden canopy with blooming eco-flowers.
  8. **✧ Celestial Biosphere (Special Evolved Form II)** (3,500 pts) — Mythical world tree with orbiting starlight fireflies and bio-luminescent aura.
- **Visual Leaf Bloom on Action**: Completing any eco-action or challenge visibly sprouts fresh fluttering leaf particles from the plant with live leaf counters.
- **Plant Care & Revival**:
  - Inactive for 2–3 days: Plant appears thirsty with drooping leaves and amber undertones.
  - Inactive for 4+ days: Plant enters a delicate wilt state.
  - **Instant Revival**: Logging any action or tapping the care toolbar (*Water Plant*, *Bask in Sun*, *Botanical Mist*) instantly restores full vibrancy and awards the *Plant Whisperer* badge.
- **Plant Personality**: Responsive dialogue speech bubbles communicating caring, contextual thoughts based on health, time of day, and streak habits.

---

### 2. 🍃 Forest Atmosphere (Time-of-Day Aware)
- **Subtle Visual Atmosphere**: Elegant falling leaves and floating botanical motes drift across the screen with gentle sinusoidal swaying.
- **Time-of-Day Dynamics**:
  - *Morning (05:00–11:59)*: Soft emerald sunbeams and morning dew motes.
  - *Afternoon (12:00–17:59)*: Golden sunlight dappled canopy leaves.
  - *Dusk (18:00–21:59)*: Twilight rose-emerald ambient calm.
  - *Night (22:00–04:59)*: Bioluminescent fireflies softly pulsing and drifting upward.
- **User Control**: Dedicated atmosphere toggle in the navigation bar to enable, pause, or respect reduced-motion settings.

---

### 3. ⚡ Prominent Quick Log Buttons
- Large, tactile one-tap buttons positioned directly below the plant sanctuary:
  - 🚲 **Walked / Cycled** (Zero emissions)
  - 🥗 **Plant-based meal** (-2.7 kg CO₂ eq)
  - ♻️ **No single-use plastic** (Plastic free)
  - 💡 **Saved electricity** (-0.3 kg CO₂)
  - 🚌 **Public transport** (-1.2 kg CO₂)
- Instant point awards, floating `+X pts` particle bursts, and simultaneous plant leaf blooms.

---

### 4. 🌍 Real Climate Data Section ("Climate Pulse")
- **Live Atmospheric CO₂ (ppm)**:
  - Integrated via open environmental syndication (`https://climatemonitor.info/api/public/v1/co2/latest`) and NOAA Mauna Loa Observatory baseline references.
  - Displays current concentration (e.g. **426.85 ppm**) with official daily measurement date and annual trend (`+2.45 ppm/yr`).
  - **Multi-Hour Caching**: Robust Next.js Route Handler caching (4 hours) combined with client-side `localStorage` caching (6 hours) to prevent redundant upstream requests.
- **Planetary Boundary Scale**:
  - Visual horizontal gradient benchmark: *280 ppm (Pre-industrial baseline)* → *350 ppm (Safe Planetary Boundary)* → *426.85 ppm (Today's Concentration)*.
- **Real-Time Global Emissions Rate Ticker**:
  - Smooth live ticker displaying estimated tonnes of CO₂ released globally today and per-second (~1,185 tonnes/sec).
  - Explicit scientific disclosure: Clearly labeled as a mathematical projection based on the latest Global Carbon Project / IEA annual benchmark (~37.4 billion tonnes CO₂/year), rather than raw second-by-second satellite telemetry.

---

### 5. 🏅 Expanded Badge Collection
- **21 Clean Badges** across all sustainability milestones:
  - Habit milestones: *First Step*, *Challenge Accepted*, *3-Day Streak*, *Week Warrior*, *Fortnight Hero*, *Earth Champion (30 days)*.
  - Challenge tiers: *Challenge Chaser*, *Eco Champion*, *Green Legend*.
  - Plant evolutions: *Sapling Nurturer*, *Ancient Guardian*, *Special Evolution*, *Plant Whisperer*.
  - Carbon & planetary impact: *Carbon Cutter*, *Living Tree Equivalent*, *Century Cutter*, *Climate Pulse Watcher*, *Zero Waste Pioneer*, *Quick Green*.
  - Points: *Rising Green (500 pts)*, *Green Guardian (1,000 pts)*.
- **Visual Clarity**: Clear unlocked states with glowing botanical gradients and timestamps, alongside frosted locked states with requirements.
- **Interactive Filtering**: Filter by *All*, *Unlocked*, or *Locked*, with modal inspection on every badge.

---

### 6. 📊 Tangible Human Impact & Motivation
- **Human Impact Equivalents**:
  - 🌳 *Trees planted equivalent* (1 tree = 22 kg CO₂/yr)
  - 🚗 *Car travel avoided* (km avoided based on 0.192 kg CO₂/km petrol vehicle average)
  - 💧 *Fresh clean water conserved* (liters)
  - 🛍️ *Single-use plastic items kept out of oceans & landfills*
  - 💡 *Hours of home LED lighting powered*
  - 📱 *Smartphone recharge cycles spared*
  - 🌿 *Leaves unfolded on your living companion plant*
- **Weekly Summary Modal**:
  - Automatically suggested weekly or viewable on-demand anytime from the Dashboard.
  - Summarizes points earned, challenges overcome, plant progress, and inspiring environmental guidance.

---

## 🔬 Real Climate Data & Scientific Sources

GreenPulse grounds personal habit tracking in verified global environmental data:

1. **Atmospheric Carbon Dioxide (CO₂ ppm)**:
   - **Primary Reference**: [NOAA Global Monitoring Laboratory (GML)](https://gml.noaa.gov/ccgg/trends/) at the Mauna Loa Observatory, Hawaii (The Keeling Curve).
   - **API Syndication**: [Climate Monitor Public API](https://climatemonitor.info/) with edge-cached proxies.
2. **Global Carbon Budget & Fossil Emissions**:
   - **Annual Emissions**: ~37.4 billion metric tonnes (Gt) of CO₂/year from fossil fuels and industry.
   - **Source**: [Global Carbon Project (GCP)](https://www.globalcarbonproject.org/) & [International Energy Agency (IEA)](https://www.iea.org/).
   - **Model Rate**: ~1,185.12 metric tonnes/second.
3. **Planetary Boundaries Framework**:
   - **Safe Atmospheric Threshold (350 ppm)**: [Stockholm Resilience Centre](https://www.stockholmresilience.org/research/planetary-boundaries.html) and Hansen et al.

---

## 🎨 Design System

| Element | Specification |
|---------|---------------|
| **Palette** | Deep Forest Green `#15803d`, Sage `#668558`, Mint `#14b8a6`, Emerald `#059669` |
| **Theme** | Cream `#f6f8f5` (Light), Deep Evergreen `#0d1f13` (Dark) |
| **Typography** | Inter (Google Fonts) with optimal tabular numerals |
| **Icons** | Material Symbols Rounded (Google Fonts) |
| **Atmosphere** | Hardware-accelerated Canvas/Framer Motion particle physics |
| **Charts** | Recharts (AreaChart, BarChart, RadarChart) |
| **Data Storage** | Zero-backend client `localStorage` with offline resilience |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

### Production Build

```bash
npm run build
npm run start
```

---

## 📄 License
MIT License. Built for competition-ready performance and sustainable living.
