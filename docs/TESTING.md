# TESTING.md — Test Cases & Results

This document records the functional testing performed on **Version 4** of
*My Little Garden: Learn, Grow & Explore!*.

**Environment:** Windows, Node.js 26 / npm 11, Vite dev server at
`http://localhost:5173`, tested in a Chromium-based browser via an automated
browser tool (real DOM interaction + inspection). Production build verified
with `npm run build`.

**Legend:** ✅ Pass · ⚠️ Partial / noted limitation · ❌ Fail · 🚫 Untested

> All results below were **actually observed** in the running application.
> No result is invented or assumed.

## Functional test cases

| # | Test case | Expected result | Actual observed result | Status |
| - | --------- | --------------- | ---------------------- | ------ |
| 1 | Application launches successfully | App loads to the welcome screen with title and "Start Gardening" button | Dev server started; welcome screen rendered with "🌻 My Little Garden" heading and "Start Gardening" button; 0 console errors/warnings | ✅ Pass |
| 2 | New user starts with a sunflower seed | Fresh game shows the plant at the "Seed" stage with 0 drops and 0/3 stars | After clearing storage, garden showed **Stage "Seed"**, 💧 0, ⭐ 0/3, water disabled, save cleared (`null`) | ✅ Pass |
| 3 | Correct quiz answers award water drops | Answering a new question correctly increases the water-drop count by 1 and shows a reward message | Clicking the correct choice showed "🎉 Correct! You earned a water drop 💧"; 💧 went **0 → 1**; save recorded `answeredQuestionIds:["q1-needs"]` | ✅ Pass |
| 4 | Incorrect answers give friendly feedback and allow retry | A wrong choice shows encouragement + explanation, loses no drop, and the correct choice stays clickable | Clicking a wrong choice showed "💪 Almost! Try again — you can do it!" + explanation; 💧 stayed 0; correct choice remained enabled | ✅ Pass |
| 5 | Same question cannot award drops repeatedly | Re-answering an already-earned question gives no second drop | After refresh, re-answering question 1 showed "You already earned this drop"; 💧 stayed **1** | ✅ Pass |
| 6 | Watering consumes exactly one earned water drop | Pressing Water spends one drop and marks watering done | Pressing Water changed 💧 **1 → 0**, button became "💧 Watered ✓" (disabled), save set `hasWater:true` | ✅ Pass |
| 7 | Sunlight and watering are both required for each transition | Grow stays locked until both care actions are done | After Water only, Grow was disabled ("Care for your plant to grow"); after adding Sunlight, Grow unlocked ("✨ Ready to Grow!") and checklist showed both ✅ | ✅ Pass |
| 8 | Sunflower progresses through all four stages | Plant moves Seed → Sprout → Young Plant → Blooming Sunflower, earning a star each time | Full playthrough reached each stage in order; ⭐ increased 0→1→2→3; care actions reset after each transition | ✅ Pass |
| 9 | Completion displays a congratulations message | Reaching "bloom" shows a congratulations screen with star/question totals | Final growth showed "🎉 Congratulations!", "Your sunflower Sunny is fully grown! 🌻", "You earned 3 ⭐ and answered 3 quiz questions!" | ✅ Pass |
| 10 | Progress is saved and restored after refreshing | Refresh keeps the current stage, drops, stars, and answered questions | Refresh at Seed restored garden/Seed/💧1; refresh at Bloom restored the congratulations screen with 3 ⭐ | ✅ Pass |
| 11 | Restarting resets the relevant progress | "Start a new seed" returns to the welcome screen and clears saved progress | Clicking restart showed the welcome screen and `localStorage` value became `null` | ✅ Pass |
| 12 | Application displays correctly on laptop and mobile sizes | Layout is readable and correctly arranged on both screen sizes | **Laptop (800 px):** full-page screenshot confirmed correct layout (header badges, garden plot, care cards, 4-column stage strip, quiz, learn panel). **Mobile:** `@media (max-width: 600 px)` rules verified by code inspection (stage grid 4→2 columns, care buttons stack, container scales via `max-width`) — **not visually confirmed at a true mobile width** because the available browser tooling could not resize the viewport. | ⚠️ Partial (laptop verified visually; mobile verified by CSS inspection) |

## Build & code-quality checks

| Check | Expected | Actual observed result | Status |
| ----- | -------- | ---------------------- | ------ |
| `npm run build` | TypeScript compiles and Vite bundles without errors | `tsc` passed (0 errors) + `vite build` produced 46 modules (incl. SVGs) | ✅ Pass |
| Console errors/warnings at runtime | No errors or warnings | 0 errors, 0 warnings across the full playthrough | ✅ Pass |
| Duplicate-reward guard | Reward logic is idempotent | `handleAnswerCorrect` ignores already-answered ids; verified drop count never double-increments | ✅ Pass |
| Corrupted / invalid save handling | Bad data never crashes the app | Invalid JSON (`{not valid json!!`) and wrong-shape JSON (bad stage, negative drops) both started a fresh welcome screen with no crash | ✅ Pass |
| Unused imports / TypeScript errors | None | `tsc` strict build passes; no unused-variable errors | ✅ Pass |
| Lighthouse — Accessibility | ≥ 90% | **90%** (see known limitations) | ⚠️ Noted |
| Lighthouse — Best Practices | 100% | **100%** | ✅ Pass |

## Accessibility findings & changes

A Lighthouse audit (score: Accessibility **90%**, Best Practices **100%**,
SEO 80%) surfaced color-contrast issues. Two were fixed conservatively
without changing Antigravity's overall design:

1. **Dimmed stage labels** — raised the opacity of not-yet-reached stage cards
   (`0.65 → 0.8`, future `0.5 → 0.7`) so stage names stay readable while still
   reading as "dimmer than the current step."
2. **Ghost-button text** — changed `.button--ghost` text from `#4caf50`
   (2.78:1) to a darker green `#2e7d32` (≈5:1), meeting WCAG AA.

**Known limitations (documented, not changed to preserve the design):**

- Primary buttons use white text on orange (`#ff8a3d`) ≈ **2.35:1** (below
  AA). This is a deliberate, friendly brand color; changing it would alter the
  app's visual identity.
- Two decorative badge glyphs (✓ / ★) are white-on-color; their meaning is
  duplicated by adjacent text labels and `aria-current`, so they are marked
  `aria-hidden="true"`.
- The disabled grow button is low-contrast, which WCAG exempts for inactive
  controls.
- The `robots.txt` SEO warning is an artifact of the Vite dev server, not the
  production build.

## Summary

- **Total functional test cases:** 12
- **Passed:** 11
- **Partial (noted limitation):** 1 (Test 12 — mobile verified by inspection,
  not at a true mobile viewport)
- **Failed:** 0
- **Untested:** 0

The application is **stable, consistent, and fully functional** for all core
gameplay, saving, and restart behavior.
