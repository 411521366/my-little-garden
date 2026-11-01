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
`src/types.ts`. Think of it as a agreement between the logic side and the
visual side.

```ts
export interface GardenViewProps {
  plant: PlantState;        // the plant to show (id, name, stage)
  stages: StageInfo[];      // the four stages with labels + descriptions
  onAdvanceStage: () => void; // callback when the player taps "grow"
}
```

- **OpenCode** promises to always pass these props, correctly typed.
- **Antigravity** promises to only read from these props and to call
  `onAdvanceStage` for interactions — never reaching into game logic.

If Antigravity needs new data (for example, a `waterLevel`), a change is
requested in `types.ts` and agreed by both agents before either edits it.

## Current status of the shared files

| File              | Status in Version 1                                  |
| ----------------- | ---------------------------------------------------- |
| `GardenView.tsx`  | Placeholder written by OpenCode; Antigravity takes over in Version 3 |
| `garden.css`      | Basic styles written by OpenCode; Antigravity takes over in Version 3 |
| `types.ts`        | Owned by OpenCode; Antigravity reads `GardenViewProps` |

In Version 1, OpenCode wrote a **simple placeholder** garden view so the app
runs and can be demoed. It uses emoji as stand-ins for real plant art.

## What Antigravity receives in Version 1

A working `GardenView` that:

- Receives `plant`, `stages`, and `onAdvanceStage` as props
- Shows the plant's current stage with a large placeholder emoji
- Shows all four growth stages in a progress strip, highlighting the current
  one
- Has a "Grow to the next stage" button wired to `onAdvanceStage`
- Is styled by `garden.css`

## What Antigravity should do in Version 3

1. Replace the emoji in `STAGE_ART` with real illustrations (SVG or images
   under `src/assets/`).
2. Rewrite `garden.css` with richer colors, layout, and friendly animations
   for each stage transition.
3. Keep using only `GardenViewProps` — do not import game logic.
4. Keep the component beginner-friendly and readable.
5. If new props are needed (like `waterLevel` or `sunLevel`), request the
   `types.ts` change through OpenCode first.

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
