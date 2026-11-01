# AI_LOG.md — How AI Was Used

This project is a **human + AI collaboration**. This log records what each AI
agent did, version by version, so the work can be reviewed and verified.

**Project:** My Little Garden: Learn, Grow & Explore!
**Team:** Wailan (student/owner) with two AI coding agents — **OpenCode** and
**Antigravity**
**Date of Version 1:** 2026-11-01

---

## Version 1 — Initial Prototype

**Agent:** OpenCode (lead developer)
**Goal:** Set up the project and ship a minimal, working garden prototype.

### What OpenCode did

1. **Environment setup**
   - Discovered Node.js was not installed on the machine (only incomplete
     Adobe-bundled copies existed, with no `npm`).
   - Installed Node.js LTS (v26.13.0) and npm (11.20.0) via
     `winget install OpenJS.NodeJS.LTS`, with the user's approval.

2. **Project scaffolding (React + TypeScript + Vite)**
   - Created `package.json` with React 18, TypeScript, and Vite, and the
     `dev` / `build` / `preview` scripts.
   - Created `tsconfig.json` (strict TypeScript, JSX, bundler resolution).
   - Created `vite.config.ts` using the React plugin.
   - Created `index.html` as the app entry point.
   - Created `.gitignore` excluding `node_modules`, `dist`, environment
     secrets (`.env*`), logs, and editor/OS temporary files.

3. **Application code**
   - `src/main.tsx` — React entry point that mounts `App` into `#root`.
   - `src/types.ts` — the shared TypeScript contract, defining `GrowthStage`,
     `StageInfo`, `PlantState`, and the `GardenViewProps` interface that
     separates game logic from visual presentation.
   - `src/App.tsx` — OpenCode-owned game logic: welcome screen, garden
     screen, plant state, and the four-stage growth list. Passes
     `GardenViewProps` to the garden view.
   - `src/GardenView.tsx` — a **placeholder**, presentational garden view
     (Antigravity owns this from Version 3). It renders the current stage and
     a four-stage progress strip from props only.
   - `src/index.css` — global kid-friendly theme (OpenCode).
   - `src/garden.css` — basic garden styles (Antigravity takes over in
     Version 3).

4. **Documentation**
   - `README.md` — explains the project, its audience (children 6–10), and
     how to run it.
   - `AGENTS.md` — defines architecture and file ownership between OpenCode
     and Antigravity.
   - `HANDOFF.md` — explains the collaboration handoff via `GardenViewProps`.
   - `docs/AI_LOG.md` — this file.

5. **Validation and Git**
   - Ran `npm install` and `npm run build` (TypeScript type-check + Vite
     production build) to confirm everything compiles.
   - Committed Version 1 and tagged it `v1.0.0`.

### What was deliberately left out

To keep Version 1 focused, OpenCode did **not** implement watering,
sunlight, real growth rules, quizzes, animations, or progress saving. These
are planned for Version 2 and Version 3.

### Design decisions

- **Single `types.ts` contract.** The `GardenViewProps` interface is the only
  bridge between logic (OpenCode) and visuals (Antigravity), so the two
  agents can work in parallel without conflicts.
- **Presentational `GardenView`.** The placeholder view reads only from props
  and calls `onAdvanceStage` for interaction — a clean seam for Antigravity.
- **Beginner-friendly code.** Clear names, short functions, and comments
  throughout so the project is easy to explain in the midterm review.

---

## Version 2 — Educational Gameplay

**Agent:** OpenCode (lead developer)
**Goal:** Add quizzes, real growth mechanics, rewards, and progress saving.

### What OpenCode did

1. **Extended the shared contract (`src/types.ts`)**
   - Added `GROWTH_STAGES` as the single source of truth for stage order.
   - Added `GameProgress` (stage, water drops, stars, care flags, answered
     questions) — the shape saved to localStorage.
   - Extended `GardenViewProps` with the new data the view needs:
     `waterDrops`, `stars`, `hasWater`, `hasSun`, `canGrow`, `isFullyGrown`,
     `achievementMessage`, and the `onWater` / `onSunlight` / `onRestart`
     callbacks. Kept `plant`, `stages`, and `onAdvanceStage` unchanged.
   - Added `QuizQuestion` and `QuizPanelProps` for the quiz.

2. **Educational quizzes (`src/quizData.ts`, `src/QuizPanel.tsx`)**
   - Wrote 10 age-appropriate multiple-choice questions (3 choices each)
     covering water, roots, sunlight, air, nutrients, growth time, and bees.
   - Each question has a short, friendly explanation shown after answering.
   - A correct answer to a **new** question earns one water drop; the same
     question never pays out twice (tracked by `answeredQuestionIds`).
   - Incorrect answers show encouragement ("Almost! Try again") with **no**
     penalty, and the child can retry immediately.

3. **Plant growth (`src/App.tsx`)**
   - Four stages: Seed → Sprout → Young Plant → Blooming Sunflower
     (identifiers `seed → sprout → budding → bloom`).
   - Three growth transitions, each requiring **one watering + one
     sunlight** action before "Grow" unlocks.
   - Watering consumes one earned water drop; completed care actions are
     clearly shown ("💧 Watered ✓", "☀️ Sunny ✓") and disabled.
   - Care requirements reset after every transition.

4. **Rewards**
   - Water drops earned from quizzes and spent on watering.
   - One star earned per growth transition (max 3), shown as "⭐ n/3".
   - Encouraging achievement messages on care and growth events.
   - A final congratulations screen when the sunflower blooms.

5. **Progress saving (`src/storage.ts`)**
   - Saves `GameProgress` to localStorage on every change; restores it on
     load so a refresh keeps the child's progress.
   - Corrupted JSON or structurally-invalid data is safely rejected and the
     game starts fresh (never crashes).
   - A "Start a new seed" restart resets state and clears the save.

6. **Educational accuracy**
   - Added a "What plants really need" section (water, sunlight, air,
     nutrients, time) with a short fact for each.
   - Added a note explaining real plants grow over weeks/months while the
     game speeds it up.

7. **Styling** — added `src/quiz.css` and extended `src/garden.css` /
   `src/index.css` for the new controls, rewards, and congrats screen.

### Testing performed (live in the browser + `npm run build`)

| Test | Result |
| ---- | ------ |
| `npm run build` (tsc + Vite) | ✅ Passed, 38 modules |
| Quiz correct answer earns a water drop | ✅ 💧 0→1, "You earned a water drop" |
| Quiz incorrect answer → retry, no punishment | ✅ "Almost! Try again", no drop lost |
| Repeat answer gives no second drop | ✅ "You already earned this drop", 💧 stayed 0 |
| Watering consumes a drop | ✅ 💧 1→0, "💧 Watered ✓", `hasWater:true` |
| Sunlight marks light done | ✅ "☀️ Sunny ✓", Grow unlocked |
| Growth transition | ✅ seed→Sprout, ⭐ 0→1, care reset, message shown |
| Progress saved to localStorage | ✅ Save written on each change |
| Restore after browser refresh | ✅ Returned to garden, Sprout, ⭐1/3 |
| Restart clears progress | ✅ Back to welcome, save cleared |
| Corrupted save (bad JSON) | ✅ Started fresh, no crash |
| Invalid save (wrong shape) | ✅ Rejected, started fresh |
| Congrats screen on full bloom | ✅ "🎉 Congratulations!", 3 ⭐ |

### Design decisions

- **Kept `onAdvanceStage`** in the contract to avoid needless churn; only
  added the props Version 2 genuinely needs.
- **Quiz is OpenCode's** (per `AGENTS.md`), so it lives in its own
  `QuizPanel.tsx` with its own small `QuizPanelProps` contract rather than
  being folded into Antigravity's `GardenView`.
- **Guarded reward logic** (`handleAnswerCorrect` checks
  `answeredQuestionIds`) so double-firing can never pay twice.

---

## Version 3 — Colorful, Interactive User Interface

**Agent:** Antigravity (Taroko — frontend UI/UX developer)
**Goal:** Transform the educational garden game into an attractive, polished, kid-friendly experience (ages 6–10) with custom artwork, delightful animations, and high accessibility.

### What Antigravity did

1. **Created custom sunflower illustration assets (`src/assets/`)**
   - Designed 4 original, child-friendly vector SVG illustrations for every growth stage:
     - `src/assets/plant-seed.svg` — Seed nestled cozily in warm, textured soil with a tiny root hair emerging, resting striped shell, and sleeping expression.
     - `src/assets/plant-sprout.svg` — Fresh lime-green shoot popping through the earth, two welcoming cotyledon leaves with a dewy drop, discarded seed coat, and branching root system.
     - `src/assets/plant-budding.svg` — Tall leafy sunflower stalk with broad serrated leaves, leaf veins, deep root network, and a plump flower bud wrapped in green bracts with golden petals peeking out.
     - `src/assets/plant-bloom.svg` — Radiant blooming sunflower with 32 layered golden petals, rich seed disc, heartwarming smiling kawaii face, and a friendly bumblebee companion.
   - Designed 4 bespoke reward and action icons:
     - `src/assets/watering-can.svg` — Cheerful pastel watering can with sunflower decal and pouring droplets.
     - `src/assets/sun-badge.svg` — Smiling bright sun badge with rotating warm rays.
     - `src/assets/water-drop.svg` — Glossy blue water droplet with highlights.
     - `src/assets/star-badge.svg` — 3D beveled golden achievement star.
   - Added TypeScript module declaration `src/assets/assets.d.ts` for clean asset bundling.

2. **Revamped `src/GardenView.tsx`**
   - Replaced placeholder emoji map with the high-resolution vector artwork.
   - Added interactive animation state management for watering, sunlight, growth, and star bounce.
   - Implemented large, tactile care buttons with distinct icons, completed checkmarks, and explanatory helper badges (`💧 Watered ✓`, `☀️ Sunny ✓`, `Need 💧 (Quiz)`).
   - Added a dual-item requirements checklist (`Water: Done!`, `Sunlight: Done!`) so kids and screen readers never have to rely on color alone to know when the plant can grow.
   - Enhanced the 4-stage visual progress road with illustrated stepping-stone thumbnails, progress checkmarks, and an active stage indicator with gold star badge.
   - Styled the encouragement/achievement banner with icons and smooth slide-in.
   - Preserved 100% of the `GardenViewProps` contract and OpenCode's game logic.

3. **Restyled and animated `src/garden.css`**
   - Introduced a pastel color palette: soft pastel green (`#d8f3dc`, `#74c69d`), sky blue (`#e0f2fe`, `#38bdf8`), warm sunny yellow (`#fef08a`), and cream (`#fffdf5`).
   - Implemented rounded cards (20px–28px border-radius) and chunky tactile 3D buttons (`box-shadow: 0 5px 0`).
   - Added friendly CSS keyframe animations:
     - `gentleBreeze`: natural swaying movement for the plant.
     - `canPour`, `dropFall`, `splashRipple`: watering can tilt, falling water stream, and soil splash effect.
     - `sunFlare`, `sparkleRise`, `sunSpin`: rotating ambient sun and warm golden light particles.
     - `plantGrowPop`: celebratory bouncy scale-up entrance when moving to a new stage.
     - `celebrationBurst`: floating confetti stars on growth transitions.
     - `starPop`: joyful bounce on the star counter badge.
     - `floatCloud`: floating atmospheric clouds in the garden sky.
   - Designed responsive layouts that adapt smoothly from small mobile screens (320px–480px) to laptops and desktops.

4. **Accessibility enhancements**
   - Added high-contrast visible focus indicators (`outline: 3.5px solid var(--pastel-orange); outline-offset: 3px`) for full keyboard navigation.
   - Provided meaningful text labels, `aria-label`, `role="status"`, and `aria-live="polite"` announcements.
   - Implemented clear disabled states that explain why a button is disabled rather than simply dimming it.
   - Implemented `@media (prefers-reduced-motion: reduce)` to disable continuous swaying, particle effects, and bouncy loops for players with motion sensitivity.
   - Followed WCAG 2.1 AA contrast guidelines across text and pastel backgrounds.

5. **Validation and Git**
   - Verified TypeScript compilation and production packaging with `npm run build` (`tsc && vite build`) — passed cleanly.
   - Tested component states across all 4 growth stages, watering, sunlight, growth unlock, and reset.
   - Documented changes in `docs/AI_LOG.md`.
   - Committed changes with message `"v3: add colorful interactive garden UI"` and tagged `v3.0.0`.

### Testing performed

| Test | Result |
| ---- | ------ |
| `npm run build` (tsc + Vite) | ✅ Passed, 46 modules, 0 errors |
| 4 Stage SVG illustrations load | ✅ `plant-seed`, `plant-sprout`, `plant-budding`, `plant-bloom` render crisply |
| Reward badges display | ✅ 💧 Water drops and ⭐ Stars with icons and counts |
| Watering interaction | ✅ Animated watering can, falling drops, splash ripple, and `💧 Watered ✓` state |
| Sunlight interaction | ✅ Animated sun pulse, rising sparkles, and `☀️ Sunny ✓` state |
| Growth transition & celebration | ✅ Bouncy `plantGrowPop`, floating confetti stars, and star counter bounce |
| Growth checklist | ✅ Displays text + icon status for Water and Sunlight without relying on color alone |
| 4-Stage visual stepping stones | ✅ Shows thumbnails, step numbers, and status badges (`Done`, `Here!`, `Step N`) |
| Keyboard navigation & focus | ✅ Clear 3.5px orange focus rings on all buttons |
| Reduced motion support | ✅ Continuous animations disabled under `prefers-reduced-motion: reduce` |
| Responsive layout (mobile & desktop) | ✅ 2x2 grid reflow on <=600px screens, 4-col layout on desktop |
| Contract boundary preservation | ✅ Zero modifications to `types.ts`, `App.tsx`, `QuizPanel.tsx`, `storage.ts` |
