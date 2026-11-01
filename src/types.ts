/**
 * types.ts — Owned by OpenCode.
 *
 * This file is the shared contract between the game logic (App.tsx) and the
 * visual garden (GardenView.tsx). OpenCode writes the logic that produces
 * these values, and Antigravity's GardenView only reads from them.
 *
 * Keeping the boundary in one file makes it easy for two agents to work on
 * the project without stepping on each other's code.
 */

/** The four planned growth stages a plant moves through. */
export type GrowthStage = "seed" | "sprout" | "budding" | "bloom";

/** Describes one growth stage so the view can label and explain it. */
export interface StageInfo {
  /** Which stage this entry describes. */
  stage: GrowthStage;
  /** Short, child-friendly label (for example, "Sprout"). */
  label: string;
  /** One sentence a 6-10 year old can read to learn what is happening. */
  description: string;
}

/** The current state of a plant, produced by game logic. */
export interface PlantState {
  /** Stable identifier for this plant (used later for saving progress). */
  id: string;
  /** The plant's display name. */
  name: string;
  /** Which growth stage the plant is in right now. */
  stage: GrowthStage;
}

/**
 * The props passed from game logic (App.tsx) to the garden view
 * (GardenView.tsx).
 *
 * This interface is the single source of truth for what the visual layer is
 * allowed to use. Antigravity must render using only these props and must
 * not reach into game logic directly.
 */
export interface GardenViewProps {
  /** The plant to display. */
  plant: PlantState;
  /** All four growth stages, in order, for the progress display. */
  stages: StageInfo[];
  /** Callback the view invokes when the player asks to grow (Version 1 preview). */
  onAdvanceStage: () => void;
}
