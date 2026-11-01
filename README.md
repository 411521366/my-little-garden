# 🌻 My Little Garden: Learn, Grow & Explore! (v5.0.0 — Final Version)

An educational, colorful web game that helps children aged **6–10** learn how plants grow by nurturing a virtual garden. Players answer fun quizzes to earn water drops, then water and shine sunlight on their plants to grow three distinct flower species — **Sunny the Sunflower 🌻**, **Rosie the Rose 🌹**, and **Tilly the Tulip 🌷** — through all growth stages from empty soil to vibrant bloom, complete with fun botanical facts and interactive sound effects.

This project was built through a human-directed collaboration between two AI coding agents: **OpenCode** (Lead Developer) and **Google Antigravity** (Visual Designer & Sound Synthesizer).

---

## 1. Target Audience

- **Children ages 6–10** who are curious about plants, flowers, and nature.
- **Parents and educators** looking for a safe, ad-free, playful tool to introduce basic botany, patience, and environmental care.
- Features simple readable text, kid-friendly pastel artwork, tactile large buttons, and cheerful audio cues.

---

## 2. Educational Objectives

By playing through the complete garden journey, children learn that:

- Plants require **water, sunlight, air, nutrients, and time** to survive.
- Each plant moves through structured growth rungs: **Empty Plot → Seed → Sprout → Young Plant → Blooming Flower**.
- Roots drink water and minerals from the soil; green leaves harness sunlight to make food (photosynthesis).
- Flowers have unique adaptations:
  - **Sunflowers** track the sun across the sky (heliotropism) and produce healthy seeds.
  - **Roses** have sweet scents, petals loved by pollinators, and stems with prickles for protection.
  - **Tulips** sprout from underground bulbs and were once famously treasured in history.
- **Real plants grow gradually** over weeks and months — the game speeds nature up to make botany interactive and memorable.
- Curious learning is rewarded: answering science quizzes awards water drops needed to care for every flower.

---

## 3. Main Features

- 🌻 **Three Flower Species to Grow** — Players nurture three flowers one at a time:
  1. **Sunny the Sunflower 🌻** (with a cheerful smile & honeybee companion)
  2. **Rosie the Rose 🌹** (with rich layered petals & ladybug friend)
  3. **Tilly the Tulip 🌷** (with cup-shaped petals & fluttering butterfly)
- 🎓 **Expanded 12-Question Quiz across 3 Stages** —
  - *Stage 1: Plant Basics* (4 questions)
  - *Stage 2: Growing* (4 questions)
  - *Stage 3: Flowers & Seeds* (4 questions)
  - **Fisher–Yates Randomization:** Answer choices are shuffled per question so the correct choice isn't always in the same position.
  - Frustration-free: children can retry incorrect choices without penalties, and questions never double-pay.
- 💧 **Balanced 12-Drop Economy** —
  - 4 care actions per flower $\times$ 3 flowers = **exactly 12 water drops** needed.
  - Earning all 12 drops through the quiz allows players to complete the entire garden and earn **12 ⭐ stars**.
- 🔊 **Interactive Sound Effects (Web Audio API)** —
  - Real-time procedural audio synthesis (zero external sound files, works 100% offline with 0ms latency):
    - 💧 **Watering:** Bubbly rising drops and gentle splash ripple.
    - ☀️ **Sunlight:** Warm golden celestial shimmer chime.
    - 🌱 **Growth:** Triumphant ascending harp/chime arpeggio.
    - 🎉 **Quiz Correct:** Bright, joyful two-tone victory bell ding.
    - 💪 **Quiz Retry:** Soft, encouraging marimba tap.
    - 🎛️ **Accessible Sound Toggle:** `🔊 Sound` / `🔇 Muted` button in the header with saved preferences.
- 🌿 **Space-Saving Side-by-Side Educational Cards** —
  - Responsive 2-column grid placed below the quiz:
    - *Flower Fun Facts* (dynamically updates to share botany facts for the active flower).
    - *What Plants Really Need* (covers water, sun, air, soil nutrients, time, and growth notes).
  - Automatically stacks vertically on smaller mobile displays.
- 🗺️ **3-Flower Journey Indicator & 4-Stage Stepping Stones** —
  - Visual status cards showing which flower is *Bloomed*, *Growing*, or *Locked*.
  - Illustrated roadmap with miniature vector thumbnails and status badges.
- 💾 **Progress Persistence (v2 Save Schema)** —
  - Saves flower progress, current stage, star count, and water drops to browser `localStorage` (`my-little-garden:save-v2`).
  - Restores gracefully on refresh; includes a gentle "Start a new garden" restart option.
- 🎨 **Pastel Vector Artwork & Keyframe Animations** —
  - 100% bespoke SVG illustrations.
  - Gentle breeze swaying, tilting watering can, rotating ambient sun, and celebratory growth confetti bursts.
  - Full `@media (prefers-reduced-motion: reduce)` support for motion-sensitive users.

---

## 4. Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Framework** | React 18 | Declarative UI, state management, and lifecycle hooks |
| **Language** | TypeScript (Strict Mode) | Type-safe shared contracts and component props |
| **Build Tool** | Vite 5 | Fast development server and optimized production bundling |
| **Styling** | Plain CSS & CSS Variables | BEM naming, pastel color tokens, and keyframe animations |
| **Audio** | Web Audio API | Procedural, zero-dependency real-time audio synthesis |
| **Artwork** | Custom Vector SVGs | Responsive, resolution-independent illustrations |
| **Storage** | Browser `localStorage` | Client-side progress persistence with runtime validation |
| **Quality** | ESLint & TypeCheck | Full `tsc` strict type-checking and zero-error builds |

---

## 5. Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) version 18 or newer (includes `npm`)

### Setup Steps
```bash
# 1. Clone the repository
git clone https://github.com/411521366/my-little-garden.git
cd my-little-garden

# 2. Install dependencies
npm install
```

---

## 6. How to Launch the Application

```bash
# Start the development server with hot module reloading
npm run dev

# Build for production (TypeScript check + Vite production bundle)
npm run build

# Preview the production build locally
npm run preview
```

Open your browser at the URL shown in the terminal (typically `http://localhost:5173`).

### Gameplay Walkthrough
1. Press **Start Gardening** on the welcome screen.
2. Check your active flower on the journey tracker (starting with Sunny 🌻).
3. Scroll to the **Plant Quiz** and answer questions to collect **water drops 💧**.
4. Tap **Water** and **Sunlight** to care for the plant.
5. Tap **Plant the Seed** or **Ready to Grow!** to advance through the growth stages.
6. When a flower blooms, tap **Plant Next Flower →** to start Rosie the Rose 🌹, then Tilly the Tulip 🌷.
7. Complete all 3 flowers to unlock the grand 12-star victory celebration!

---

## 7. Project Structure

```
my-little-garden/
├── src/
│   ├── App.tsx                     # Main game state, screen router, flower flow (OpenCode)
│   ├── types.ts                    # Shared TypeScript contract between logic & UI (OpenCode)
│   ├── flowerData.ts               # Data for the 3 flower species and fun facts (OpenCode)
│   ├── quizData.ts                 # 12 quiz questions across 3 learning stages (OpenCode)
│   ├── QuizPanel.tsx               # Interactive quiz component with answer shuffling (OpenCode)
│   ├── storage.ts                  # localStorage v2 schema with validation & reset (OpenCode)
│   ├── GardenView.tsx              # Interactive visual garden & care station (Antigravity)
│   ├── garden.css                  # Garden styling, animations, responsive grid (Antigravity)
│   ├── quiz.css                    # Quiz component styling (OpenCode)
│   ├── index.css                   # Global theme, layout, and button styles (OpenCode)
│   ├── main.tsx                    # React application entry point
│   └── assets/                     # Visual & audio assets (Antigravity)
│       ├── soundEffects.ts         # Web Audio API real-time sound synthesizer
│       ├── plant-empty.svg         # Empty soil bed with seed hole
│       ├── plant-seed.svg          # Seed tucked in warm soil
│       ├── plant-sprout.svg        # Sprout with twin leaves & dewdrop
│       ├── plant-budding.svg       # Young leafy stalk with bud
│       ├── plant-bloom.svg         # Blooming Sunflower with honeybee
│       ├── plant-bloom-rose.svg    # Blooming Rose with ladybug
│       ├── plant-bloom-tulip.svg   # Blooming Tulip with butterfly
│       ├── watering-can.svg        # Watering can icon
│       ├── sun-badge.svg           # Smiling sun icon
│       ├── water-drop.svg          # Glossy water drop icon
│       └── star-badge.svg          # Golden achievement star icon
├── docs/
│   ├── AI_LOG.md                   # Detailed record of AI agent contributions by version
│   └── TESTING.md                  # Comprehensive test matrix and QA results
├── AGENTS.md                       # Architectural roles and file-ownership agreement
├── HANDOFF.md                      # Interface contract documentation for GardenViewProps
└── README.md                       # Project documentation (this file)
```

---

## 8. AI-Assisted Development Collaboration

The project was constructed by two specialized AI agents collaborating on a shared codebase under human direction:

| Agent | Primary Role | Owned Files |
| --- | --- | --- |
| **OpenCode** | Lead Developer | `App.tsx`, `types.ts`, `flowerData.ts`, `quizData.ts`, `QuizPanel.tsx`, `storage.ts`, `quiz.css`, `index.css`, configuration, and project documentation |
| **Google Antigravity** | Visual Designer & Sound Engineer | `GardenView.tsx`, `garden.css`, `src/assets/*` (SVGs & `soundEffects.ts`) |

The two layers interact strictly through the typed contract `GardenViewProps` in `src/types.ts`. The visual view only consumes props and fires event callbacks, maintaining a clean architectural separation of concerns.

---

## 9. Development Milestones

| Version | Commit | Highlights |
| --- | --- | --- |
| **v1.0.0** | `2677eef` | Initial prototype: React + TypeScript + Vite, welcome screen, basic garden plot, placeholder emoji art. |
| **v2.0.0** | `39e2776` | Educational gameplay: initial quiz, watering, sunlight, growth mechanics, stars, and localStorage progress saving. |
| **v3.0.0** | `257e88b` | Visual overhaul by Antigravity: custom sunflower vector illustrations, water splash and sun animations, pastel color scheme, accessible focus states. |
| **v4.0.0** | `ce38ef7` | QA integration: Lighthouse accessibility audit (90%), contrast enhancements for young readers, full testing suite, and documentation rewrite. |
| **v5.0.0** | `b16988e` | **Final Version:** 3 flower species (Sunflower, Rose, Tulip), 12-drop economy, 12 quiz questions across 3 stages, Fisher–Yates choice shuffling, Web Audio API sound synthesizer, space-saving side-by-side cards, and polished mobile layout. |

---

## 10. Accessibility & Inclusion

- **Clear Typography & Contrast:** Uses readable font sizes with high-contrast text conforming to WCAG AA guidelines.
- **Color-Independent Feedback:** Every action uses redundant visual indicators (checkmarks `✓`, icons `💧`/`☀️`, lock badges, and text status) so players never rely on color alone.
- **Keyboard Navigation:** All interactive elements feature prominent, high-contrast focus rings (`outline: 3.5px solid var(--pastel-orange)`).
- **Reduced-Motion Support:** Honored via `@media (prefers-reduced-motion: reduce)`, disabling continuous swaying, spinning sun, and particle animations.
- **Audio Accessibility:** All sound effects are accompanied by visual animations and text feedback; a prominent toggle button allows instant muting.

---

## 11. Known Limitations & Future Roadmap

- **Language:** English-only in this release (internationalization with a language selector would be a great future addition).
- **Storage Scope:** Saves are stored in the local browser (`localStorage`) without cross-device cloud sync.
- **Future Ideas:**
  - Additional plant species (e.g., vegetables or fruit trees).
  - Interactive mini-games (e.g., catching falling raindrops or gentle weed pulling).
  - Printable coloring sheets or completion certificates for kids.

---

## 12. Documentation Links

- [`AGENTS.md`](./AGENTS.md) — Architectural boundaries and agent file ownership
- [`HANDOFF.md`](./HANDOFF.md) — Collaboration interface notes
- [`docs/AI_LOG.md`](./docs/AI_LOG.md) — Detailed AI workflow log from v1 through v5
- [`docs/TESTING.md`](./docs/TESTING.md) — Test cases, QA verification, and test results
