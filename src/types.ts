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

/** The four growth stages a plant moves through. */
export type GrowthStage = "seed" | "sprout" | "budding" | "bloom";

/** All growth stages in the order the plant grows. Single source of truth. */
export const GROWTH_STAGES: GrowthStage[] = [
  "seed",
  "sprout",
  "budding",
  "bloom",
];

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
 * Everything about a player's progress that is saved to localStorage and
 * restored after a page refresh.
 */
export interface GameProgress {
  /** The plant's current growth stage. */
  stage: GrowthStage;
  /** Unspent water drops earned by answering quiz questions. */
  waterDrops: number;
  /** Stars earned for each completed growth transition (max 3). */
  stars: number;
  /** Whether the "water" care action is done for the current stage. */
  hasWater: boolean;
  /** Whether the "sunlight" care action is done for the current stage. */
  hasSun: boolean;
  /** Question ids that already gave a water drop (prevents repeat rewards). */
  answeredQuestionIds: string[];
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
  /** Unspent water drops the player can spend on watering. */
  waterDrops: number;
  /** Stars earned so far (one per growth transition). */
  stars: number;
  /** True when the "water" action is already done this stage. */
  hasWater: boolean;
  /** True when the "sunlight" action is already done this stage. */
  hasSun: boolean;
  /** True when both care actions are done and the plant can grow. */
  canGrow: boolean;
  /** True once the plant has reached its final stage (no more growing). */
  isFullyGrown: boolean;
  /** An encouraging message to show the player, or null for none. */
  achievementMessage: string | null;
  /** Callback when the player taps "Water". */
  onWater: () => void;
  /** Callback when the player taps "Sunlight". */
  onSunlight: () => void;
  /** Callback when the player taps "Grow" (only valid when canGrow). */
  onAdvanceStage: () => void;
  /** Callback when the player chooses to restart the garden. */
  onRestart: () => void;
}

/** One multiple-choice quiz question. */
export interface QuizQuestion {
  /** Stable id used to track which questions already gave a reward. */
  id: string;
  /** The question text shown to the child. */
  question: string;
  /** Exactly three answer choices. */
  choices: string[];
  /** Index into `choices` of the correct answer. */
  correctIndex: number;
  /** A short, friendly explanation shown after answering. */
  explanation: string;
}

/**
 * Props passed from game logic (App.tsx) to the quiz panel (QuizPanel.tsx).
 * The quiz is OpenCode's feature, so it has its own small contract.
 */
export interface QuizPanelProps {
  /** The list of questions to show. */
  questions: QuizQuestion[];
  /** Question ids that already gave a water drop. */
  answeredQuestionIds: string[];
  /** Called with a question id when the child answers it correctly. */
  onAnswerCorrect: (questionId: string) => void;
}
