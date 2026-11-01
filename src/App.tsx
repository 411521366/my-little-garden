import { useEffect, useState } from "react";
import GardenView from "./GardenView";
import QuizPanel from "./QuizPanel";
import { QUIZ_QUESTIONS } from "./quizData";
import { FLOWERS } from "./flowerData";
import { clearProgress, loadProgress, saveProgress } from "./storage";
import type {
  FlowerProgress,
  FlowerStatus,
  GameProgress,
  GrowthStage,
  PlantState,
} from "./types";
import { GROWTH_STAGES } from "./types";
import "./garden.css";

/**
 * App.tsx — Owned by OpenCode.
 *
 * This file holds ALL of the game logic: which screen we are on, the three
 * flowers' states, quiz rewards, watering, sunlight, growth, the flower
 * journey, and saving. It computes the props and hands them to presentational
 * components (GardenView and QuizPanel), which only handle how things look.
 *
 * Version 5: the child grows three flowers one at a time (sunflower → rose →
 * tulip). Each flower starts as an empty plot, and every growth rung costs
 * one watering (1 water drop). Four rungs per flower × three flowers = the 12
 * water drops earned by answering all 12 quiz questions.
 */

/** Which app screen is showing. */
type Screen = "welcome" | "garden" | "congrats";

/** Encouraging message shown when a growth transition completes. */
const GROWTH_MESSAGES: Record<GrowthStage, string> = {
  empty: "",
  seed: "🌱 You planted a seed in the soil!",
  sprout: "🌿 A little sprout pops up!",
  budding: "🍃 A young plant is growing tall!",
  bloom: "",
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
  "In real life, flowers take weeks or months to grow. Our game speeds " +
  "things up so you can watch it happen — real gardens need patience!";

/** A brand-new flower: unplanted, no care given. */
function freshFlowerProgress(): FlowerProgress[] {
  return FLOWERS.map((flower) => ({
    flowerId: flower.id,
    stage: "empty" as GrowthStage,
    hasWater: false,
    hasSun: false,
  }));
}

/** The starting progress for a brand-new game. */
const INITIAL_GAME: GameProgress = {
  activeFlowerIndex: 0,
  flowers: freshFlowerProgress(),
  waterDrops: 0,
  stars: 0,
  answeredQuestionIds: [],
};

/** The most stars possible: one per growth transition for all flowers. */
const STAR_MAX = FLOWERS.length * (GROWTH_STAGES.length - 1);

/** Return the stage after the given one (stays at "bloom" when already there). */
function nextStageOf(stage: GrowthStage): GrowthStage {
  const index = GROWTH_STAGES.indexOf(stage);
  const nextIndex = Math.min(index + 1, GROWTH_STAGES.length - 1);
  return GROWTH_STAGES[nextIndex];
}

/** True when the player has actually made some progress worth saving. */
function isMeaningfulProgress(progress: GameProgress): boolean {
  if (progress.activeFlowerIndex > 0) return true;
  if (progress.waterDrops > 0 || progress.stars > 0) return true;
  if (progress.answeredQuestionIds.length > 0) return true;
  return progress.flowers.some(
    (flower) => flower.stage !== "empty" || flower.hasWater || flower.hasSun,
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
    const lastFlower = saved.flowers[saved.flowers.length - 1];
    return lastFlower && lastFlower.stage === "bloom" ? "congrats" : "garden";
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

  // --- Derived values for the actively grown flower ---
  const activeIndex = game.activeFlowerIndex;
  const currentFlower = FLOWERS[activeIndex];
  const activeFlower = game.flowers[activeIndex];
  const isFullyGrown = activeFlower.stage === "bloom";
  const canGrow = activeFlower.hasWater && activeFlower.hasSun && !isFullyGrown;
  const isLastFlower = activeIndex >= FLOWERS.length - 1;
  const canPlantNext = isFullyGrown && !isLastFlower;
  const nextFlower = !isLastFlower ? FLOWERS[activeIndex + 1] : null;

  const plant: PlantState = {
    id: `${currentFlower.id}-${activeIndex}`,
    name: currentFlower.name,
    emoji: currentFlower.emoji,
    flowerId: currentFlower.id,
    stage: activeFlower.stage,
  };

  // Status of all three flowers for the journey indicator.
  const flowerProgress: FlowerStatus[] = FLOWERS.map((flower, i) => {
    const flowerState = game.flowers[i];
    let status: FlowerStatus["status"];
    if (flowerState.stage === "bloom") status = "done";
    else if (i === activeIndex) status = "current";
    else if (i === activeIndex + 1 && isFullyGrown) status = "current";
    else status = "locked";
    return { id: flower.id, name: flower.name, emoji: flower.emoji, status };
  });

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

  // Update just the active flower's care/stage fields.
  function updateActiveFlower(patch: Partial<FlowerProgress>) {
    setGame((current) => ({
      ...current,
      flowers: current.flowers.map((flower, i) =>
        i === current.activeFlowerIndex ? { ...flower, ...patch } : flower,
      ),
    }));
  }

  // --- Watering consumes one earned water drop. ---
  function handleWater() {
    if (
      game.waterDrops > 0 &&
      !activeFlower.hasWater &&
      activeFlower.stage !== "bloom"
    ) {
      setGame((current) => ({
        ...current,
        waterDrops: current.waterDrops - 1,
        flowers: current.flowers.map((flower, i) =>
          i === current.activeFlowerIndex ? { ...flower, hasWater: true } : flower,
        ),
      }));
      setAchievementMessage("💦 Splish, splash! The soil is nice and wet.");
    }
  }

  // --- Sunlight marks the light care action as done. ---
  function handleSunlight() {
    if (!activeFlower.hasSun && activeFlower.stage !== "bloom") {
      updateActiveFlower({ hasSun: true });
      setAchievementMessage("☀️ The sun is shining on your plant!");
    }
  }

  // --- Growth: needs both care actions, awards a star, and resets care. ---
  function handleAdvanceStage() {
    if (!activeFlower.hasWater || !activeFlower.hasSun || isFullyGrown) return;

    const nextStage = nextStageOf(activeFlower.stage);
    const reachedBloom = nextStage === "bloom";

    setGame((current) => ({
      ...current,
      stars: current.stars + 1,
      flowers: current.flowers.map((flower, i) =>
        i === current.activeFlowerIndex
          ? { ...flower, stage: nextStage, hasWater: false, hasSun: false }
          : flower,
      ),
    }));

    if (reachedBloom) {
      if (isLastFlower) {
        setAchievementMessage("🎉 All three flowers are in full bloom!");
        setScreen("congrats");
      } else {
        setAchievementMessage(
          `🌸 ${currentFlower.name} is in full bloom! Ready for the next flower.`,
        );
      }
    } else {
      setAchievementMessage(GROWTH_MESSAGES[nextStage]);
    }
  }

  // --- Move on to the next flower (resets to an empty plot for it). ---
  function handleNextFlower() {
    if (!canPlantNext || !nextFlower) return;
    setGame((current) => ({
      ...current,
      activeFlowerIndex: current.activeFlowerIndex + 1,
    }));
    setAchievementMessage(
      `🌱 Now grow your ${nextFlower.name} ${nextFlower.emoji}! Answer quizzes to earn water drops.`,
    );
  }

  // --- Restart: back to an empty garden with all three flowers unplanted. ---
  function handleRestart() {
    setGame(INITIAL_GAME);
    setAchievementMessage(null);
    clearProgress();
    setScreen("welcome");
  }

  if (screen === "welcome") {
    return (
      <main className="screen screen--welcome">
        <h1 className="welcome__title">🌻 My Little Garden</h1>
        <p className="welcome__tagline">Learn, Grow &amp; Explore!</p>
        <p className="welcome__intro">
          Answer fun plant quizzes to earn water drops, then water and shine
          sunlight to grow three beautiful flowers — a sunflower, a rose, and a
          tulip — one at a time.
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
          You grew all three flowers — 🌻 Sunny, 🌹 Rosie, and 🌷 Tilly!
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
            🔄 Start a new garden
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
        stages={currentFlower.stages}
        flowerProgress={flowerProgress}
        waterDrops={game.waterDrops}
        stars={game.stars}
        starMax={STAR_MAX}
        hasWater={activeFlower.hasWater}
        hasSun={activeFlower.hasSun}
        canGrow={canGrow}
        isFullyGrown={isFullyGrown}
        canPlantNext={canPlantNext}
        nextFlowerName={nextFlower?.name ?? null}
        nextFlowerEmoji={nextFlower?.emoji ?? null}
        achievementMessage={achievementMessage}
        onWater={handleWater}
        onSunlight={handleSunlight}
        onAdvanceStage={handleAdvanceStage}
        onNextFlower={handleNextFlower}
        onRestart={handleRestart}
      />

      {/* Plant quiz placed right below growth stages */}
      <QuizPanel
        questions={QUIZ_QUESTIONS}
        answeredQuestionIds={game.answeredQuestionIds}
        onAnswerCorrect={handleAnswerCorrect}
      />

      {/* Side-by-side educational cards: Flower fun facts & What plants need */}
      <div className="garden__info-columns">
        {/* Fun facts about the flower currently being grown */}
        <section
          className="funfacts"
          aria-label={`Fun facts about the ${currentFlower.species}`}
        >
          <h3 className="funfacts__title">
            {currentFlower.emoji} Meet {currentFlower.name} the {currentFlower.species}
          </h3>
          <ul className="funfacts__list">
            {currentFlower.funFacts.map((fact) => (
              <li key={fact} className="funfacts__item">
                {fact}
              </li>
            ))}
          </ul>
        </section>

        {/* Educational section: what plants really need */}
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
      </div>

      {/* Start a new garden button at the very end */}
      <div className="garden__footer-actions">
        <button
          type="button"
          className="button button--ghost garden__restart"
          onClick={handleRestart}
          aria-label="Restart garden from a new seed"
        >
          🔄 Start a new garden
        </button>
      </div>
    </main>
  );
}
