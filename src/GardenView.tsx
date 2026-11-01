import type { GardenViewProps, GrowthStage } from "./types";

/**
 * GardenView.tsx — Started by OpenCode, owned by Antigravity from Version 3.
 *
 * This is a PLACEHOLDER view. It is deliberately simple so the app runs in
 * Version 1, and Antigravity will replace the artwork and styles later.
 *
 * The component is purely presentational: it receives everything it needs
 * through GardenViewProps and never touches game logic directly.
 */

/**
 * Temporary emoji stand-ins for each stage. Antigravity will swap these for
 * real illustrations and CSS animations in Version 3.
 */
const STAGE_ART: Record<GrowthStage, string> = {
  seed: "🌰",
  sprout: "🌱",
  budding: "🌿",
  bloom: "🌻",
};

export default function GardenView({
  plant,
  stages,
  onAdvanceStage,
}: GardenViewProps) {
  // Find the label and description for the plant's current stage.
  const currentStage =
    stages.find((stageInfo) => stageInfo.stage === plant.stage) ?? stages[0];

  return (
    <section className="garden" aria-label="Virtual garden">
      <h2 className="garden__title">{plant.name}'s Garden</h2>

      {/* The plant's current look and stage description. */}
      <div className="garden__plot">
        <span className="garden__art" aria-hidden="true">
          {STAGE_ART[plant.stage]}
        </span>
        <p className="garden__stage-name">{currentStage.label}</p>
        <p className="garden__stage-desc">{currentStage.description}</p>
      </div>

      {/* A simple visual of all four planned growth stages. */}
      <ol className="garden__stages" aria-label="Growth stages">
        {stages.map((stageInfo, index) => {
          const isCurrent = stageInfo.stage === plant.stage;
          return (
            <li
              key={stageInfo.stage}
              className={`garden__stage${isCurrent ? " is-current" : ""}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span className="garden__stage-art" aria-hidden="true">
                {STAGE_ART[stageInfo.stage]}
              </span>
              <span className="garden__stage-label">{stageInfo.label}</span>
              <span className="garden__stage-number">{index + 1}</span>
            </li>
          );
        })}
      </ol>

      {/* Version 1 preview control so we can see every stage. */}
      <button
        type="button"
        className="button button--primary"
        onClick={onAdvanceStage}
      >
        Grow to the next stage →
      </button>

      <p className="garden__note">
        Placeholder view — Antigravity styles this in Version 3.
      </p>
    </section>
  );
}
