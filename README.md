# 🌻 My Little Garden: Learn, Grow & Explore!

An educational, colorful web game that helps children aged **6–10** learn how
plants grow by nurturing a virtual garden. Players answer fun quizzes to earn
water drops, then water and give sunlight to a sunflower seed, watching it
sprout, grow into a young plant, and finally bloom — all while picking up real
facts about nature.

This is a **midterm project** built as a collaboration between two AI coding
agents (OpenCode and Google Antigravity) under a student's direction.

## 1. Target audience

- **Children ages 6–10** who are curious about plants and nature.
- **Parents and teachers** who want a safe, ad-free, playful way to introduce
  basic botany and responsibility.
- The language is simple, the visuals are bright and friendly, and every
  action teaches a small science idea.

## 2. Educational objectives

By playing, children learn that:

- Plants need **water, sunlight, air, nutrients, and time** to survive.
- A plant grows through clear stages: **Seed → Sprout → Young Plant →
  Blooming Sunflower**.
- Roots drink water from the soil, and leaves use sunlight to make food.
- **Real plants grow slowly** (over weeks and months) — the game just speeds
  nature up so it is fun to watch.
- Answering questions correctly is rewarding (each new correct answer earns a
  water drop that helps the plant grow).

## 3. Main features

- 🎓 **Educational quiz** — 10 age-appropriate multiple-choice questions
  (3 choices each), with friendly feedback and a short explanation. Correct
  answers earn water drops; wrong answers can be retried with no penalty, and
  a question never pays out twice.
- 💧 **Watering & ☀️ sunlight care** — each growth step needs one watering
  (which spends one earned water drop) **and** one sunlight action.
- 🌱 **Four growth stages** with three transitions, each awarding a ⭐ star.
- 🏆 **Rewards** — a water-drop counter, a star counter (n/3), encouraging
  achievement messages, and a final congratulations screen.
- 💾 **Progress saving** — progress is stored in the browser
  (`localStorage`) and restored after a refresh; a "Start a new seed" button
  restarts the game. Corrupted or invalid saves are handled safely.
- 🎨 **Colorful animated UI** — hand-drawn SVG plant art, water/sunlight
  animations, floating clouds, and a growth celebration, with
  reduced-motion support for accessibility.
- 📱 **Responsive layout** — works on laptop and mobile screen sizes.
- 🌿 **"What plants really need"** educational panel with a real-growth-time
  reminder.

## 4. Technology stack

| Layer        | Technology |
| ------------ | ---------- |
| Framework    | React 18 (function components + hooks) |
| Language     | TypeScript (strict mode) |
| Build tool   | Vite 5 |
| Styling      | Plain CSS (BEM-style class names, CSS variables, keyframe animations) |
| Artwork      | Inline SVG illustrations |
| Persistence  | Browser `localStorage` |
| Testing      | Production build (`tsc` + `vite build`), manual browser testing, Lighthouse audit |

No runtime dependencies beyond React and ReactDOM — the project is small and
intentionally easy to read.

## 5. Installation instructions

### Prerequisites

- [Node.js](https://nodejs.org/) version 18 or newer (includes `npm`)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/411521366/my-little-garden.git
cd my-little-garden

# 2. Install dependencies
npm install
```

## 6. How to launch the application

```bash
# Start the development server (hot reload)
npm run dev

# Build for production (type-checks, then bundles to dist/)
npm run build

# Preview the production build locally
npm run preview
```

Then open the URL Vite prints — usually `http://localhost:5173`.

### How to play

1. On the welcome screen, press **Start Gardening**.
2. Answer a quiz question correctly to earn a **water drop 💧**.
3. Press **Water** (spends one drop) and **Sunlight** to meet your plant's
   needs.
4. When both are done, press **Grow** to reach the next stage and earn a ⭐.
5. Repeat until your sunflower blooms — then enjoy the congratulations screen!
6. Your progress saves automatically; refresh to continue later, or press
   **Start a new seed** to begin again.

## 7. Project structure

```
my-little-garden/
├── src/
│   ├── App.tsx            # Game logic, state, and screen routing (OpenCode)
│   ├── types.ts           # Shared TypeScript contract between logic & UI (OpenCode)
│   ├── QuizPanel.tsx      # Quiz component (OpenCode)
│   ├── quizData.ts        # The 10 quiz questions (OpenCode)
│   ├── storage.ts         # localStorage save/load with validation (OpenCode)
│   ├── GardenView.tsx     # Animated visual garden (Antigravity)
│   ├── garden.css         # Garden styles & animations (Antigravity)
│   ├── quiz.css           # Quiz styles (OpenCode)
│   ├── index.css          # Global theme & base styles (OpenCode)
│   ├── main.tsx           # React entry point
│   └── assets/            # SVG plant art & badges (Antigravity)
├── docs/
│   ├── AI_LOG.md          # How AI was used, version by version
│   └── TESTING.md         # Test cases and results
├── AGENTS.md              # Architecture & file-ownership rules
├── HANDOFF.md             # Collaboration handoff notes for Antigravity
└── README.md              # This file
```

## 8. AI-assisted development workflow

The project is split between two AI agents so they can work in parallel without
conflicting:

| Agent          | Role  | Owns |
| -------------- | ----- | ---- |
| **OpenCode**       | Lead developer — architecture, gameplay logic, integration, testing, docs | `App.tsx`, `types.ts`, `QuizPanel.tsx`, `quizData.ts`, `storage.ts`, `quiz.css`, `index.css`, config, documentation |
| **Google Antigravity** | Visual designer — UI/UX, artwork, animations | `GardenView.tsx`, `garden.css`, `src/assets/` |

The **only** connection between game logic and visual presentation is the
`GardenViewProps` interface in `src/types.ts`. `App.tsx` computes state and
passes it as props; `GardenView` reads only from props and calls back through
the agreed callbacks — it never imports game logic. See `AGENTS.md` and
`HANDOFF.md` for the full rules.

Every meaningful change is recorded in [`docs/AI_LOG.md`](./docs/AI_LOG.md),
and the Git history shows each version as a separate, authentic commit.

## 9. Development milestones

| Version | Commit  | Summary |
| ------- | ------- | ------- |
| **v1.0.0** | `2677eef` | Initial prototype: React + TypeScript + Vite setup, welcome screen, basic garden, four-stage visuals, placeholder view. |
| **v2.0.0** | `39e2776` | Educational gameplay: quizzes, water drops, watering, sunlight, real growth rules, stars, rewards, and localStorage saving. |
| **v3.0.0** | `257e88b` | Colorful interactive garden UI by Antigravity: SVG plant art, animations (water/sunlight/growth), responsive layout, richer styling. |
| **v4.0.0** | *(this version)* | Final integration, bug fixing, accessibility improvements, full testing, and documentation. |

## 10. Known limitations

- **Audio/sound effects** are not included (only visuals/animations).
- **Plant variety** is limited to a single sunflower ("Sunny").
- **Accessibility:** the primary action buttons use white text on a bright
  orange background (≈2.35:1 contrast), which is below the WCAG AA 4.5:1
  guideline. This was kept to preserve the friendly visual design; two small
  decorative badge glyphs (✓ / ★) and the disabled grow button are similarly
  low-contrast but are non-essential or inactive. Overall Lighthouse
  accessibility is **90%**, best practices **100%**.
- **Single language** (English) and **no sound/volume controls**.
- Progress is stored per-browser only — there is no account or cloud sync.

## 11. Possible future improvements

- 🔊 Add cheerful sound effects and a mute toggle.
- 🌻 Support multiple plant types (e.g., rose, tree, cactus) with different
  facts and growth times.
- 🌍 Add translations and a language selector.
- ☁️ Optional cloud save / player profiles.
- 🎵 Add a "care too much / neglect" lesson so kids learn balance.
- ♿ Further accessibility polish (raise all color contrast to WCAG AA).
- 📊 A progress dashboard showing quiz scores and facts learned.

## 12. Documentation

- [`AGENTS.md`](./AGENTS.md) — architecture and file-ownership rules
- [`HANDOFF.md`](./HANDOFF.md) — collaboration handoff for Antigravity
- [`docs/AI_LOG.md`](./docs/AI_LOG.md) — how AI was used, version by version
- [`docs/TESTING.md`](./docs/TESTING.md) — test cases and results
