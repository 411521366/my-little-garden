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

## Planned: Version 2 (not yet started)

OpenCode will add watering, sunlight, real growth rules, and progress saving.

## Planned: Version 3 (not yet started)

Antigravity will take ownership of `GardenView.tsx` and `garden.css`, replace
the placeholder emoji with real artwork and animations, and quizzes will be
added.
