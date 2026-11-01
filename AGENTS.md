# AGENTS.md — Architecture & File Ownership

This project is built by **two AI coding agents** working on the same
repository. This document defines who owns what so both agents can work in
parallel without conflicting.

## The two agents

| Agent       | Role                                             |
| ----------- | ------------------------------------------------ |
| **OpenCode**    | Lead developer. Owns game logic and project setup. |
| **Antigravity** | Visual designer. Owns garden artwork and styling.   |

## File ownership

### OpenCode owns

- `src/App.tsx` — game logic, state, and screen routing
- `src/types.ts` — the shared TypeScript contract
- `src/QuizPanel.tsx` — the quiz component
- `src/quizData.ts` — the quiz questions
- `src/flowerData.ts` — the three flower species (names, emoji, fun facts, per-flower stages) *(added in Version 5)*
- `src/storage.ts` — localStorage save/load logic
- `src/main.tsx` — React entry point
- `src/index.css` — global theme and base styles
- `src/quiz.css` — quiz styles
- `vite.config.ts`, `tsconfig.json`, `package.json`, `index.html`
- All core logic (growth rules, watering, sunlight, quizzes)
- Quiz data and configuration
- All documentation (`README.md`, `AGENTS.md`, `HANDOFF.md`, `docs/AI_LOG.md`)
- `.gitignore` and Git history

### Antigravity owns

- `src/GardenView.tsx` — the visual garden component
- `src/garden.css` — garden-specific styles and animations
- Visual assets (images, SVGs, sprites, sounds) under `src/assets/`

> **Ownership starts in Version 3.** In Versions 1 and 2, OpenCode creates
> placeholder versions of `GardenView.tsx` and `garden.css` so the app runs.
> Antigravity takes full ownership of these files in Version 3.

## The contract: `src/types.ts`

The **only** allowed connection between game logic and visual presentation is
the `GardenViewProps` interface in `src/types.ts`.

```
App.tsx (OpenCode)  --provides-->  GardenViewProps  -->  GardenView.tsx (Antigravity)
```

Rules:

1. `App.tsx` computes game state and passes it to `GardenView` as props that
   match `GardenViewProps`.
2. `GardenView` reads **only** from its props. It never imports game logic,
   never mutates the plant, and never calls into `App` internals.
3. When a player interacts with the view (for example, a button), `GardenView`
   calls a callback provided through props (`onAdvanceStage`).
4. Neither agent changes `types.ts` without agreeing first. If new data is
   needed, the change is proposed to both agents so the contract stays shared.

This keeps the logic layer and the presentation layer cleanly separated, which
makes the code easy to test and easy to hand between agents.

## Growth stages

The plant moves through four planned stages, defined once in `types.ts`:

```
seed → sprout → budding → bloom
```

Game logic decides which stage the plant is in. The view only displays it.

## Version plan

- **Version 1 (done)** — project setup, welcome screen, basic garden, four
  stage visuals, placeholder view.
- **Version 2 (done)** — watering, sunlight, real growth rules, quizzes,
  rewards, and progress saving.
- **Version 3 (done)** — Antigravity restyles the garden with real SVG
  artwork and animations.
- **Version 4 (done)** — final integration, bug fixing, accessibility
  polish, testing, and documentation (OpenCode).
- **Version 5 (done)** — three flowers grown one at a time, randomized quiz
  answers, 12 questions in 3 stages, per-flower fun facts, and a 12-drop
  economy (OpenCode, preserving Antigravity's garden design).

## Conventions

- Keep code **beginner-friendly**: clear names, short functions, and helpful
  comments.
- Use TypeScript types for anything shared between files.
- One agent edits only the files it owns unless both agree otherwise.
- Never commit secrets, API keys, or personal data.
