import type { GardenViewProps, GrowthStage } from "./types";

/**
 * GardenView.tsx — Started by OpenCode, owned by Antigravity from Version 3.
 *
 * This is still a PLACEHOLDER view. It is deliberately simple so the app runs
 * in Version 2, and Antigravity will replace the artwork and styles in
 * Version 3.
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
  waterDrops,
  stars,
  hasWater,
  hasSun,
  canGrow,
  isFullyGrown,
  achievementMessage,
  onWater,
  onSunlight,
  onAdvanceStage,
  onRestart,
}: GardenViewProps) {
  // Find the label and description for the plant's current stage.
  const currentStage =
    stages.find((stageInfo) => stageInfo.stage === plant.stage) ?? stages[0];

  return (
    <section className="garden" aria-label="Virtual garden">
      <div className="garden__header">
        <h2 className="garden__title">{plant.name}'s Garden</h2>

        {/* Rewards: water drops and stars. */}
        <div className="garden__rewards" aria-label="Rewards">
          <span className="garden__reward" title="Water drops">
            💧 {waterDrops}
          </span>
          <span className="garden__reward" title="Stars earned">
            ⭐ {stars}/{stages.length - 1}
          </span>
        </div>
      </div>

      {/* The plant's current look and stage description. */}
      <div className="garden__plot">
        <span className="garden__art" aria-hidden="true">
          {STAGE_ART[plant.stage]}
        </span>
        <p className="garden__stage-name">{currentStage.label}</p>
        <p className="garden__stage-desc">{currentStage.description}</p>
      </div>

      {/* Encouraging achievement message, when there is one. */}
      {achievementMessage && (
        <p className="garden__achievement" role="status">
          {achievementMessage}
        </p>
      )}

      {/* Care actions. Completed actions are clearly marked and disabled. */}
      <div className="garden__care">
        <button
          type="button"
          className={`button garden__care-btn${hasWater ? " is-done" : ""}`}
          onClick={onWater}
          disabled={hasWater || waterDrops === 0 || isFullyGrown}
        >
          {hasWater ? "💧 Watered ✓" : "💧 Water"}
        </button>
        <button
          type="button"
          className={`button garden__care-btn${hasSun ? " is-done" : ""}`}
          onClick={onSunlight}
          disabled={hasSun || isFullyGrown}
        >
          {hasSun ? "☀️ Sunny ✓" : "☀️ Sunlight"}
        </button>
      </div>

      {/* Grow is only allowed once both care actions are done. */}
      <button
        type="button"
        className="button button--primary garden__grow"
        onClick={onAdvanceStage}
        disabled={!canGrow}
      >
        {isFullyGrown
          ? "🌻 Fully grown!"
          : canGrow
            ? "Grow to the next stage →"
            : "Care for your plant to grow"}
      </button>

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

      {/* Restart option. */}
      <button
        type="button"
        className="button button--ghost garden__restart"
        onClick={onRestart}
      >
        🔄 Start a new seed
      </button>

      <p className="garden__note">
        Placeholder view — Antigravity styles this in Version 3.
      </p>
    </section>
  );
}
