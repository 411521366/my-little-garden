# 🌻 My Little Garden: Learn, Grow & Explore!

An educational, colorful web game that helps children aged **6–10** learn how
plants grow by nurturing a virtual garden. Players plant a seed, water it,
give it sunlight, answer fun quizzes, and watch their plant sprout, bud, and
bloom — all while picking up real facts about nature.

## Who is this for?

- **Children ages 6–10** who are curious about plants and nature.
- **Parents and teachers** who want a safe, ad-free, playful way to introduce
  basic botany and responsibility.
- The language is simple, the visuals are bright and friendly, and every
  action teaches a small science idea.

## What the full game will include

- 🌱 A virtual garden where plants grow through four stages:
  **Seed → Sprout → Budding → Bloom**
- 💧 Watering and ☀️ sunlight mechanics that teach real plant needs
- 🎓 Short, friendly quizzes that reward learning with garden progress
- ✨ Cheerful animations and sounds
- 💾 Progress saving so kids can return to their garden later

## Current status: Version 1 (Initial Prototype)

Version 1 is a working foundation, **not** the finished game. It currently has:

- A React + TypeScript + Vite project setup
- A welcome screen
- A basic virtual garden showing a sunflower named "Sunny"
- A simple visual of the four planned growth stages
- A placeholder garden view that Antigravity will restyle in Version 3

Watering, sunlight, quizzes, animations, and saving are **not** implemented
yet — they arrive in Version 2 and beyond.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer) and npm

### Install and run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

Then open the URL that Vite prints (usually `http://localhost:5173`).

## Project structure

```
my-little-garden/
├── src/
│   ├── App.tsx          # Game logic and screens (OpenCode)
│   ├── types.ts         # Shared TypeScript contract (OpenCode)
│   ├── GardenView.tsx   # Visual garden view (Antigravity, from v3)
│   ├── garden.css       # Garden styles (Antigravity, from v3)
│   ├── index.css        # Global theme (OpenCode)
│   └── main.tsx         # React entry point
├── docs/
│   └── AI_LOG.md        # Record of how AI was used
├── AGENTS.md            # Architecture and file ownership rules
├── HANDOFF.md           # Handoff notes for the Antigravity collaboration
└── README.md            # This file
```

## How this project is built

This is a **midterm collaboration** between two AI coding agents:

- **OpenCode** owns the app logic, types, configuration, and documentation.
- **Antigravity** owns the garden visuals (`GardenView.tsx`, `garden.css`,
  and image assets) starting in Version 3.

The two agents stay in sync through a shared TypeScript contract in
`src/types.ts`. See `AGENTS.md` and `HANDOFF.md` for the rules.

## Documentation

- [`AGENTS.md`](./AGENTS.md) — architecture and file ownership
- [`HANDOFF.md`](./HANDOFF.md) — collaboration handoff for Antigravity
- [`docs/AI_LOG.md`](./docs/AI_LOG.md) — how AI was used in each version
