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

## Planned: Version 3 (not yet started)

Antigravity will take ownership of `GardenView.tsx` and `garden.css`, replace
the placeholder emoji with real artwork and animations, and refine the overall
visual design.
