# HANDOFF.md — Collaboration with Antigravity

This document explains how work moves between the two AI agents building
**My Little Garden: Learn, Grow & Explore!**

- **OpenCode** — lead developer. Owns logic, setup, and documentation.
- **Antigravity** — visual designer. Owns garden artwork and styling.

## Why we hand off

Building a kids' game needs two different skill sets:

1. **Logic** — growth rules, state, quizzes, and saving (OpenCode)
2. **Visuals** — illustrations, animations, and layout (Antigravity)

Splitting the work this way lets both agents move fast without overwriting
each other's code.

## The handoff point: `GardenViewProps`

The two agents meet at **one shared interface**: `GardenViewProps` in
`src/types.ts`. Think of it as a contract between the logic side and the
visual side.

```ts
export interface GardenViewProps {
  plant: PlantState;            // the plant to show (id, name, stage)
  stages: StageInfo[];          // the four stages with labels + descriptions
  waterDrops: number;           // unspent water drops
  stars: number;                // stars earned (one per growth, max 3)
  hasWater: boolean;            // is the "water" care action done this stage?
  hasSun: boolean;              // is the "sunlight" care action done this stage?
  canGrow: boolean;             // both care actions done -> plant can grow
  isFullyGrown: boolean;        // true once the plant reaches "bloom"
  achievementMessage: string | null; // an encouraging message, or null
  onWater: () => void;          // player tapped "Water"
  onSunlight: () => void;       // player tapped "Sunlight"
  onAdvanceStage: () => void;   // player tapped "Grow" (only valid when canGrow)
  onRestart: () => void;        // player chose to restart the garden
}
```

- **OpenCode** promises to always pass these props, correctly typed.
- **Antigravity** promises to only read from these props and to call the
  callbacks for interactions — never reaching into game logic.

If Antigravity needs new data, a change is requested in `types.ts` and agreed
by both agents before either edits it.

## Current status of the shared files

| File              | Status after Version 2                               |
| ----------------- | ---------------------------------------------------- |
| `GardenView.tsx`  | Placeholder written by OpenCode; Antigravity takes over in Version 3 |
| `garden.css`      | Basic styles written by OpenCode; Antigravity takes over in Version 3 |
| `types.ts`        | Owned by OpenCode; Antigravity reads `GardenViewProps` |
| `QuizPanel.tsx`   | OpenCode's feature — **do not restyle or edit in V3** |

As of Version 2, `GardenView` shows the plant, rewards (drops/stars), the two
care buttons, the grow button, the four-stage progress strip, and a restart
button — all driven by `GardenViewProps`. It uses emoji as stand-ins for real
plant art.

> **Note:** The quiz lives in `QuizPanel.tsx` (OpenCode's). Antigravity
> should leave the quiz logic and `quizData.ts` alone. Antigravity MAY restyle
> `quiz.css` later only if both agents agree, but the quiz stays OpenCode's
> feature.

## What Antigravity receives in Version 2

A working `GardenView` that:

- Reads every value from `GardenViewProps` (no game logic imports)
- Shows the current stage with a large placeholder emoji and description
- Shows a rewards bar: `💧 waterDrops` and `⭐ stars/3`
- Shows Water and Sunlight buttons that display a completed state
  (`is-done` class) when `hasWater` / `hasSun` are true, and are disabled
- Enables the Grow button only when `canGrow` is true; disabled otherwise
- Shows an encouraging `achievementMessage` when it is not null
- Shows all four growth stages, highlighting the current one
- Shows a restart button wired to `onRestart`

## What Antigravity should do in Version 3 — exact instructions

1. **Replace placeholder art.** In `GardenView.tsx`, swap the `STAGE_ART`
   emoji map for real illustrations. Put image/SVG assets under `src/assets/`
   and import them. Keep a one-to-one mapping for all four stages:
   `seed`, `sprout`, `budding` (Young Plant), `bloom` (Blooming Sunflower).
2. **Animate stage growth.** Add friendly CSS transitions/animations in
   `garden.css` so the plant appears to grow on each transition (for example,
   a gentle scale/sway when `plant.stage` changes).
3. **Style the care buttons.** Make `hasWater` / `hasSun` completed states
   obvious and delightful (for example, a water splash and a glowing sun).
   Keep them disabled when done, and respect `canGrow` for the grow button.
4. **Style rewards and achievements.** Give the `💧`/`⭐` counters and the
   `achievementMessage` banner a cheerful, readable look.
5. **Keep the boundary.** Read only from `GardenViewProps`. Do **not** import
   `App`, `storage`, `quizData`, or any game logic. Call the provided
   callbacks for interactions.
6. **Keep it beginner-friendly.** Use clear class names and comments; this is
   a midterm project that must stay readable.
7. **Need a new prop?** Ask OpenCode to add it to `types.ts` first — do not
   change the contract unilaterally.

## Ground rules for both agents

- Edit **only** the files you own (see `AGENTS.md`).
- Never rewrite or amend existing Git history.
- Never commit secrets or personal data.
- Keep the code simple and well commented for the midterm review.
- Record meaningful changes in `docs/AI_LOG.md`.

## How to reach agreement on shared changes

1. OpenCode owns `types.ts`, so it makes the edit.
2. Antigravity is told which props changed and how.
3. Both agents confirm the app still builds (`npm run build`) before moving on.
