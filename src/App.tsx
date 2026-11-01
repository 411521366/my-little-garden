import { useState } from "react";
import GardenView from "./GardenView";
import type { GrowthStage, PlantState, StageInfo } from "./types";
import "./garden.css";

/**
 * App.tsx — Owned by OpenCode.
 *
 * This file holds the game logic for Version 1: which screen we are on and
 * the current state of the plant. It computes the props and hands them to
 * GardenView, which only handles how things look.
 */

/** The order a sunflower grows through its four stages. */
const STAGE_ORDER: GrowthStage[] = ["seed", "sprout", "budding", "bloom"];

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
    label: "Budding",
    description: "A leafy stem grows tall and a bud begins to form.",
  },
  {
    stage: "bloom",
    label: "Bloom",
    description: "A bright yellow sunflower opens wide and says hello!",
  },
];

/** The plant every player starts with. */
const INITIAL_PLANT: PlantState = {
  id: "sunflower-1",
  name: "Sunny",
  stage: "seed",
};

/** Which app screen is showing. */
type Screen = "welcome" | "garden";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [plant, setPlant] = useState<PlantState>(INITIAL_PLANT);

  /**
   * Move the plant to its next growth stage (wrapping back to "seed" after
   * "bloom"). This is a simple preview control so we can see all four stages
   * in Version 1. Real watering and sunlight rules arrive in Version 2.
   */
  function advanceStage() {
    setPlant((current) => {
      const currentIndex = STAGE_ORDER.indexOf(current.stage);
      const nextIndex = (currentIndex + 1) % STAGE_ORDER.length;
      return { ...current, stage: STAGE_ORDER[nextIndex] };
    });
  }

  if (screen === "welcome") {
    return (
      <main className="screen screen--welcome">
        <h1 className="welcome__title">🌻 My Little Garden</h1>
        <p className="welcome__tagline">Learn, Grow &amp; Explore!</p>
        <p className="welcome__intro">
          Plant a seed, care for it, and watch it grow into a beautiful
          sunflower. Along the way, you will learn how real plants live!
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
        onAdvanceStage={advanceStage}
      />
    </main>
  );
}
