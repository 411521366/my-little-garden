import { useEffect, useState } from "react";
import GardenView from "./GardenView";
import QuizPanel from "./QuizPanel";
import { QUIZ_QUESTIONS } from "./quizData";
import { clearProgress, loadProgress, saveProgress } from "./storage";
import type {
  GameProgress,
  GrowthStage,
  PlantState,
  StageInfo,
} from "./types";
import { GROWTH_STAGES } from "./types";
import "./garden.css";

/**
 * App.tsx — Owned by OpenCode.
 *
 * This file holds ALL of the game logic for Version 2: which screen we are
 * on, the plant's state, quiz rewards, watering, sunlight, growth, and
 * saving. It computes the props and hands them to presentational components
 * (GardenView and QuizPanel), which only handle how things look.
 */

/** Child-friendly details for each growth stage. */
const STAGES: StageInfo[] = [
  {
    stage: "seed",
    label: "Seed",
    description: "A tiny sunflower seed is tucked into the warm soil.",
  },
  {
    stage: "sprout",
    label: "Sprout",
    description: "A little green shoot pops up and reaches for the light.",
  },
  {
    stage: "budding",
    label: "Young Plant",
    description: "A leafy young plant grows taller every day.",
  },
  {
    stage: "bloom",
    label: "Blooming Sunflower",
    description: "A bright yellow sunflower opens wide and says hello!",
  },
];

/** The plant every player starts with. */
const INITIAL_PLANT: PlantState = {
  id: "sunflower-1",
  name: "Sunny",
  stage: "seed",
};

/** The starting progress for a brand-new game. */
const INITIAL_GAME: GameProgress = {
  stage: INITIAL_PLANT.stage,
  waterDrops: 0,
  stars: 0,
  hasWater: false,
  hasSun: false,
  answeredQuestionIds: [],
};

/** Encouraging message shown when a growth transition completes. */
const GROWTH_MESSAGES: Record<GrowthStage, string> = {
  seed: "",
  sprout: "🌱 Your seed grew into a sprout!",
  budding: "🌿 Wow — a young plant is growing tall!",
  bloom: "🌻 Amazing! Your sunflower is blooming!",
};

/** What plants need to survive — used in the "Learn" section. */
const PLANT_NEEDS = [
  { emoji: "💧", label: "Water", fact: "Roots drink water from the soil." },
  { emoji: "☀️", label: "Sunlight", fact: "Leaves use sunlight to make food." },
  {
    emoji: "🌬️",
    label: "Air",
    fact: "Plants breathe in carbon dioxide from the air.",
  },
  {
    emoji: "🪱",
    label: "Nutrients",
    fact: "Soil gives plants tiny nutrients, like vitamins.",
  },
  { emoji: "⏳", label: "Time", fact: "Growing takes time in real life!" },
];

/** Reminder that real plants grow much slower than our simulation. */
const GROWTH_TIME_NOTE =
  "In real life, a sunflower takes weeks or months to grow. Our game speeds " +
  "things up so you can watch it happen — real gardens need patience!";

/** Which app screen is showing. */
type Screen = "welcome" | "garden" | "congrats";

/** Return the stage after the given one (stays at "bloom" when already there). */
function nextStageOf(stage: GrowthStage): GrowthStage {
  const index = GROWTH_STAGES.indexOf(stage);
  const nextIndex = Math.min(index + 1, GROWTH_STAGES.length - 1);
  return GROWTH_STAGES[nextIndex];
}

/** True when the player has actually made some progress worth saving. */
function isMeaningfulProgress(progress: GameProgress): boolean {
  return (
    progress.stage !== INITIAL_GAME.stage ||
    progress.waterDrops > 0 ||
    progress.stars > 0 ||
    progress.hasWater ||
    progress.hasSun ||
    progress.answeredQuestionIds.length > 0
  );
}

export default function App() {
  // Load saved progress once on startup. Corrupted/missing saves start fresh.
  const [game, setGame] = useState<GameProgress>(
    () => loadProgress() ?? INITIAL_GAME,
  );
  const [screen, setScreen] = useState<Screen>(() => {
    const saved = loadProgress();
    if (!saved) return "welcome";
    return saved.stage === "bloom" ? "congrats" : "garden";
  });
  const [achievementMessage, setAchievementMessage] = useState<string | null>(
    null,
  );

  // Save progress whenever it changes; clear the save on a fresh start.
  useEffect(() => {
    if (isMeaningfulProgress(game)) {
      saveProgress(game);
    } else {
      clearProgress();
    }
  }, [game]);

  // A helper to update just part of the game progress.
  function updateGame(patch: Partial<GameProgress>) {
    setGame((current) => ({ ...current, ...patch }));
  }

  // --- Quiz reward: one water drop per new question, never twice. ---
  function handleAnswerCorrect(questionId: string) {
    setGame((current) => {
      if (current.answeredQuestionIds.includes(questionId)) return current;
      return {
        ...current,
        waterDrops: current.waterDrops + 1,
        answeredQuestionIds: [...current.answeredQuestionIds, questionId],
      };
    });
  }

  // --- Watering consumes one earned water drop. ---
  function handleWater() {
    if (game.waterDrops > 0 && !game.hasWater && game.stage !== "bloom") {
      updateGame({ waterDrops: game.waterDrops - 1, hasWater: true });
      setAchievementMessage("💦 Splish, splash! The soil is nice and wet.");
    }
  }

  // --- Sunlight marks the light care action as done. ---
  function handleSunlight() {
    if (!game.hasSun && game.stage !== "bloom") {
      updateGame({ hasSun: true });
      setAchievementMessage("☀️ The sun is shining on your plant!");
    }
  }

  // --- Growth: needs both care actions, awards a star, and resets care. ---
  function handleAdvanceStage() {
    if (!game.hasWater || !game.hasSun || game.stage === "bloom") return;

    const nextStage = nextStageOf(game.stage);
    updateGame({
      stage: nextStage,
      stars: game.stars + 1,
      hasWater: false,
      hasSun: false,
    });
    setAchievementMessage(GROWTH_MESSAGES[nextStage]);

    if (nextStage === "bloom") {
      setScreen("congrats");
    }
  }

  // --- Restart: back to a brand-new seed. ---
  function handleRestart() {
    setGame(INITIAL_GAME);
    setAchievementMessage(null);
    clearProgress();
    setScreen("welcome");
  }

  const plant: PlantState = { ...INITIAL_PLANT, stage: game.stage };
  const isFullyGrown = game.stage === "bloom";
  const canGrow = game.hasWater && game.hasSun && !isFullyGrown;

  if (screen === "welcome") {
    return (
      <main className="screen screen--welcome">
        <h1 className="welcome__title">🌻 My Little Garden</h1>
        <p className="welcome__tagline">Learn, Grow &amp; Explore!</p>
        <p className="welcome__intro">
          Answer fun plant quizzes to earn water drops, then water and shine
          sunlight on your seed to help it grow into a beautiful sunflower.
        </p>
        <button
          type="button"
          className="button button--primary"
          onClick={() => setScreen("garden")}
        >
          Start Gardening
        </button>
        <p className="welcome__note">Made for curious kids ages 6-10.</p>
      </main>
    );
  }

  if (screen === "congrats") {
    return (
      <main className="screen screen--congrats">
        <h1 className="congrats__title">🎉 Congratulations!</h1>
        <p className="congrats__lead">
          Your sunflower {plant.name} is fully grown! 🌻
        </p>
        <p className="congrats__stars">
          You earned {game.stars} ⭐ and answered{" "}
          {game.answeredQuestionIds.length} quiz question
          {game.answeredQuestionIds.length === 1 ? "" : "s"}!
        </p>
        <p className="congrats__note">{GROWTH_TIME_NOTE}</p>
        <div className="congrats__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() => setScreen("garden")}
          >
            See my garden
          </button>
          <button
            type="button"
            className="button button--ghost"
            onClick={handleRestart}
          >
            🔄 Start a new seed
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="screen screen--garden">
      <button
        type="button"
        className="button button--ghost"
        onClick={() => setScreen("welcome")}
      >
        ← Back to welcome
      </button>

      <GardenView
        plant={plant}
        stages={STAGES}
        waterDrops={game.waterDrops}
        stars={game.stars}
        hasWater={game.hasWater}
        hasSun={game.hasSun}
        canGrow={canGrow}
        isFullyGrown={isFullyGrown}
        achievementMessage={achievementMessage}
        onWater={handleWater}
        onSunlight={handleSunlight}
        onAdvanceStage={handleAdvanceStage}
        onRestart={handleRestart}
      />

      <QuizPanel
        questions={QUIZ_QUESTIONS}
        answeredQuestionIds={game.answeredQuestionIds}
        onAnswerCorrect={handleAnswerCorrect}
      />

      {/* Educational section: what plants really need, and real growth time. */}
      <section className="learn" aria-label="What plants need">
        <h3 className="learn__title">🌿 What plants really need</h3>
        <ul className="learn__list">
          {PLANT_NEEDS.map((need) => (
            <li key={need.label} className="learn__item">
              <span className="learn__emoji" aria-hidden="true">
                {need.emoji}
              </span>
              <span>
                <strong>{need.label}</strong> — {need.fact}
              </span>
            </li>
          ))}
        </ul>
        <p className="learn__note">{GROWTH_TIME_NOTE}</p>
      </section>
    </main>
  );
}
