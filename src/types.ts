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

/**
 * The rungs of the growth ladder. "empty" is the unplanted plot you start
 * with; the four real flower milestones (seed → sprout → budding → bloom)
 * follow it. This means growing one flower needs 4 waterings (4 water drops).
 */
export type GrowthStage = "empty" | "seed" | "sprout" | "budding" | "bloom";

/** The full growth ladder in order. Single source of truth for transitions. */
export const GROWTH_STAGES: GrowthStage[] = [
  "empty",
  "seed",
  "sprout",
  "budding",
  "bloom",
];

/** The three flower species the child grows, one at a time. */
export type FlowerId = "sunflower" | "rose" | "tulip";

/** All flower ids in the order they are grown. */
export const FLOWER_IDS: FlowerId[] = ["sunflower", "rose", "tulip"];

/** Describes one growth stage so the view can label and explain it. */
export interface StageInfo {
  /** Which stage this entry describes. */
  stage: GrowthStage;
  /** Short, child-friendly label (for example, "Sprout"). */
  label: string;
  /** One sentence a 6-10 year old can read to learn what is happening. */
  description: string;
}

/** Static facts about one flower species. */
export interface FlowerInfo {
  /** Which species this describes. */
  id: FlowerId;
  /** Pet name shown in the garden (for example, "Sunny"). */
  name: string;
  /** Common name of the species (for example, "Sunflower"). */
  species: string;
  /** Emoji used as a lightweight icon for the flower. */
  emoji: string;
  /** A few real, fun facts about this flower for the child to discover. */
  funFacts: string[];
  /** The four milestones (seed → bloom) with flower-specific descriptions. */
  stages: StageInfo[];
}

/** The current state of the actively grown plant. */
export interface PlantState {
  /** Stable identifier for this plant. */
  id: string;
  /** The plant's display (pet) name. */
  name: string;
  /** Emoji icon for the plant. */
  emoji: string;
  /** Which species is being grown. */
  flowerId: FlowerId;
  /** Which growth stage the plant is in right now. */
  stage: GrowthStage;
}

/** Saved progress for a single flower. */
export interface FlowerProgress {
  /** Which species this progress belongs to. */
  flowerId: FlowerId;
  /** The flower's current growth stage. */
  stage: GrowthStage;
  /** Whether the "water" care action is done for the current stage. */
  hasWater: boolean;
  /** Whether the "sunlight" care action is done for the current stage. */
  hasSun: boolean;
}

/** One flower's status for the "journey" display in the garden. */
export interface FlowerStatus {
  id: FlowerId;
  name: string;
  emoji: string;
  /** "done" = bloomed, "current" = being grown, "locked" = not started yet. */
  status: "done" | "current" | "locked";
}

/**
 * Everything about a player's progress that is saved to localStorage and
 * restored after a page refresh.
 */
export interface GameProgress {
  /** Index (0-2) of the flower currently being grown. */
  activeFlowerIndex: number;
  /** Progress for each of the three flowers. */
  flowers: FlowerProgress[];
  /** Unspent water drops earned by answering quiz questions. */
  waterDrops: number;
  /** Stars earned across all flowers (one per growth transition, max 12). */
  stars: number;
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
  /** The actively grown plant to display. */
  plant: PlantState;
  /** The four milestones (seed → bloom) for the progress display. */
  stages: StageInfo[];
  /** Status of all three flowers for the journey indicator. */
  flowerProgress: FlowerStatus[];
  /** Unspent water drops the player can spend on watering. */
  waterDrops: number;
  /** Stars earned so far (one per growth transition). */
  stars: number;
  /** The most stars possible (3 flowers × 4 transitions = 12). */
  starMax: number;
  /** True when the "water" action is already done this stage. */
  hasWater: boolean;
  /** True when the "sunlight" action is already done this stage. */
  hasSun: boolean;
  /** True when both care actions are done and the plant can grow. */
  canGrow: boolean;
  /** True once the active flower has reached its final stage (bloom). */
  isFullyGrown: boolean;
  /** True when the active flower bloomed AND another flower is waiting. */
  canPlantNext: boolean;
  /** Name of the next flower to plant, or null when none is waiting. */
  nextFlowerName: string | null;
  /** Emoji of the next flower to plant, or null when none is waiting. */
  nextFlowerEmoji: string | null;
  /** An encouraging message to show the player, or null for none. */
  achievementMessage: string | null;
  /** Callback when the player taps "Water". */
  onWater: () => void;
  /** Callback when the player taps "Sunlight". */
  onSunlight: () => void;
  /** Callback when the player taps "Grow" (only valid when canGrow). */
  onAdvanceStage: () => void;
  /** Callback when the player plants the next flower (only when canPlantNext). */
  onNextFlower: () => void;
  /** Callback when the player chooses to restart the garden. */
  onRestart: () => void;
}

/** One multiple-choice quiz question. */
export interface QuizQuestion {
  /** Stable id used to track which questions already gave a reward. */
  id: string;
  /** Which quiz stage this belongs to (1-3; each stage has 4 questions). */
  stage: 1 | 2 | 3;
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
