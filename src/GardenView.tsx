import { useEffect, useRef, useState } from "react";
import type { GardenViewProps, GrowthStage } from "./types";

// SVG illustrations for the 4 growth stages
import seedArt from "./assets/plant-seed.svg";
import sproutArt from "./assets/plant-sprout.svg";
import buddingArt from "./assets/plant-budding.svg";
import bloomArt from "./assets/plant-bloom.svg";

// Reward and action badge icons
import wateringCanIcon from "./assets/watering-can.svg";
import sunBadgeIcon from "./assets/sun-badge.svg";
import waterDropIcon from "./assets/water-drop.svg";
import starBadgeIcon from "./assets/star-badge.svg";

/**
 * GardenView.tsx — Owned by Antigravity (Taroko) in Version 3.
 *
 * A colorful, animated, and kid-friendly visual garden for children ages 6-10.
 * Purely presentational: reads only from GardenViewProps and delegates actions
 * via the agreed callbacks.
 */

const STAGE_ART: Record<GrowthStage, string> = {
  seed: seedArt,
  sprout: sproutArt,
  budding: buddingArt,
  bloom: bloomArt,
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
  // Current stage details from props
  const currentStageIndex = stages.findIndex(
    (stageInfo) => stageInfo.stage === plant.stage,
  );
  const currentStage = stages[currentStageIndex] ?? stages[0];

  // Visual animation states
  const [isWateringActive, setIsWateringActive] = useState(false);
  const [isSunlightActive, setIsSunlightActive] = useState(false);
  const [isGrowingActive, setIsGrowingActive] = useState(false);
  const [starBounce, setStarBounce] = useState(false);

  // Track previous stage to trigger celebratory growth animations
  const prevStageRef = useRef<GrowthStage>(plant.stage);
  const prevStarsRef = useRef<number>(stars);

  useEffect(() => {
    if (prevStageRef.current !== plant.stage) {
      prevStageRef.current = plant.stage;
      setIsGrowingActive(true);
      const timer = window.setTimeout(() => {
        setIsGrowingActive(false);
      }, 1600);
      return () => window.clearTimeout(timer);
    }
  }, [plant.stage]);

  useEffect(() => {
    if (stars > prevStarsRef.current) {
      prevStarsRef.current = stars;
      setStarBounce(true);
      const timer = window.setTimeout(() => setStarBounce(false), 900);
      return () => window.clearTimeout(timer);
    }
  }, [stars]);

  function handleWaterClick() {
    if (hasWater || waterDrops === 0 || isFullyGrown) return;
    setIsWateringActive(true);
    onWater();
    window.setTimeout(() => {
      setIsWateringActive(false);
    }, 1500);
  }

  function handleSunlightClick() {
    if (hasSun || isFullyGrown) return;
    setIsSunlightActive(true);
    onSunlight();
    window.setTimeout(() => {
      setIsSunlightActive(false);
    }, 1500);
  }

  function handleGrowClick() {
    if (!canGrow) return;
    setIsGrowingActive(true);
    onAdvanceStage();
  }

  // Helpful status messages for accessibility and kids' clarity
  const waterButtonTitle = hasWater
    ? "The soil is already watered and nice and moist!"
    : waterDrops === 0
      ? "You need 1 water drop! Answer a quiz question below to earn drops."
      : "Tap to pour water on your plant!";

  const sunButtonTitle = hasSun
    ? "Your plant is already soaking in bright sunshine!"
    : isFullyGrown
      ? "Your sunflower is fully grown!"
      : "Tap to shine warm sunlight on your plant!";

  return (
    <section className="garden" aria-label="Virtual garden">
      {/* --- Header: Title and Reward Counters --- */}
      <header className="garden__header">
        <div className="garden__title-group">
          <h2 className="garden__title">
            <span className="garden__title-icon" aria-hidden="true">
              🌻
            </span>
            <span>{plant.name}&rsquo;s Garden</span>
          </h2>
          <p className="garden__subtitle">
            Take care of your sunflower and watch it grow!
          </p>
        </div>

        {/* Tactile rewards badges */}
        <div className="garden__rewards" aria-label="Garden rewards">
          <div
            className={`garden__reward-badge garden__reward-badge--water${
              waterDrops > 0 ? " has-drops" : ""
            }`}
            title={`You have ${waterDrops} water drop${
              waterDrops === 1 ? "" : "s"
            }`}
          >
            <img
              src={waterDropIcon}
              className="garden__reward-icon"
              alt=""
              aria-hidden="true"
            />
            <div className="garden__reward-text">
              <span className="garden__reward-count">{waterDrops}</span>
              <span className="garden__reward-name">Drops</span>
            </div>
          </div>

          <div
            className={`garden__reward-badge garden__reward-badge--star${
              starBounce ? " is-bouncing" : ""
            }`}
            title={`You have earned ${stars} out of ${
              stages.length - 1
            } stars`}
          >
            <img
              src={starBadgeIcon}
              className="garden__reward-icon"
              alt=""
              aria-hidden="true"
            />
            <div className="garden__reward-text">
              <span className="garden__reward-count">
                {stars}/{stages.length - 1}
              </span>
              <span className="garden__reward-name">Stars</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Garden Plot (Interactive Scenery & Artwork) --- */}
      <div
        className={`garden__plot${hasSun ? " is-sunny" : ""}${
          hasWater ? " is-watered" : ""
        }${isGrowingActive ? " is-celebrating" : ""}`}
        aria-live="polite"
      >
        {/* Sky & sun atmospheric elements */}
        <div className="garden__sky-effects" aria-hidden="true">
          <div className="garden__sun-ambient">
            <img
              src={sunBadgeIcon}
              className={`garden__ambient-sun-img${
                hasSun || isSunlightActive ? " is-active" : ""
              }`}
              alt=""
            />
          </div>
          <div className="garden__cloud garden__cloud--1" />
          <div className="garden__cloud garden__cloud--2" />
        </div>

        {/* Active Watering Animation Overlay */}
        {isWateringActive && (
          <div
            className="garden__anim-overlay garden__anim-overlay--water"
            aria-hidden="true"
          >
            <img
              src={wateringCanIcon}
              className="garden__anim-can"
              alt=""
            />
            <div className="garden__water-stream">
              <span className="garden__drop-particle d1" />
              <span className="garden__drop-particle d2" />
              <span className="garden__drop-particle d3" />
              <span className="garden__drop-particle d4" />
            </div>
            <div className="garden__water-splash" />
          </div>
        )}

        {/* Active Sunlight Pulse Overlay */}
        {isSunlightActive && (
          <div
            className="garden__anim-overlay garden__anim-overlay--sun"
            aria-hidden="true"
          >
            <div className="garden__sun-pulse" />
            <div className="garden__sparkle s1">✨</div>
            <div className="garden__sparkle s2">☀️</div>
            <div className="garden__sparkle s3">✨</div>
          </div>
        )}

        {/* Growth Celebration Confetti & Sparkles */}
        {isGrowingActive && (
          <div
            className="garden__anim-overlay garden__anim-overlay--growth"
            aria-hidden="true"
          >
            <span className="garden__growth-star gs1">⭐</span>
            <span className="garden__growth-star gs2">✨</span>
            <span className="garden__growth-star gs3">🎉</span>
            <span className="garden__growth-star gs4">⭐</span>
            <span className="garden__growth-star gs5">✨</span>
          </div>
        )}

        {/* Plant Artwork Frame */}
        <div className="garden__plant-stage-frame">
          <img
            src={STAGE_ART[plant.stage]}
            alt={`${plant.name} as a ${currentStage.label}`}
            className={`garden__plant-art${
              isGrowingActive ? " is-growing" : ""
            }`}
          />
        </div>

        {/* Stage Name & Kid-Friendly Description Banner */}
        <div className="garden__stage-badge-container">
          <span className="garden__stage-pill">
            Stage {currentStageIndex + 1} of {stages.length}:{" "}
            <strong>{currentStage.label}</strong>
          </span>
          <p className="garden__stage-desc">{currentStage.description}</p>
        </div>
      </div>

      {/* --- Encouragement / Achievement Message --- */}
      {achievementMessage && (
        <div className="garden__achievement" role="status" aria-live="polite">
          <span className="garden__achievement-icon" aria-hidden="true">
            🌱
          </span>
          <p className="garden__achievement-text">{achievementMessage}</p>
        </div>
      )}

      {/* --- Care Station: Large, Tactile Water & Sunlight Buttons --- */}
      <div className="garden__care-station">
        <h3 className="garden__section-heading">Care for your plant</h3>

        <div className="garden__care-buttons">
          {/* Water Button */}
          <button
            type="button"
            className={`garden__care-card garden__care-card--water${
              hasWater ? " is-done" : ""
            }`}
            onClick={handleWaterClick}
            disabled={hasWater || waterDrops === 0 || isFullyGrown}
            title={waterButtonTitle}
            aria-label={`Water plant. ${
              hasWater
                ? "Already watered"
                : waterDrops === 0
                  ? "No water drops available. Answer a quiz question."
                  : "Requires 1 water drop."
            }`}
          >
            <div className="garden__care-icon-wrap" aria-hidden="true">
              <img
                src={wateringCanIcon}
                className="garden__care-icon"
                alt=""
              />
            </div>
            <div className="garden__care-info">
              <span className="garden__care-name">Water</span>
              <span className="garden__care-badge">
                {hasWater
                  ? "💧 Watered ✓"
                  : waterDrops === 0
                    ? "Need 💧 (Quiz)"
                    : "Pour 1 Drop 💧"}
              </span>
            </div>
          </button>

          {/* Sunlight Button */}
          <button
            type="button"
            className={`garden__care-card garden__care-card--sun${
              hasSun ? " is-done" : ""
            }`}
            onClick={handleSunlightClick}
            disabled={hasSun || isFullyGrown}
            title={sunButtonTitle}
            aria-label={`Sunlight care. ${
              hasSun ? "Sunlight given already." : "Give sunlight to plant."
            }`}
          >
            <div className="garden__care-icon-wrap" aria-hidden="true">
              <img src={sunBadgeIcon} className="garden__care-icon" alt="" />
            </div>
            <div className="garden__care-info">
              <span className="garden__care-name">Sunlight</span>
              <span className="garden__care-badge">
                {hasSun ? "☀️ Sunny ✓" : "Shine Sun ☀️"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* --- Grow Action Button with Visual Checklist --- */}
      <div className="garden__grow-station">
        <button
          type="button"
          className={`garden__grow-btn${canGrow ? " is-ready" : ""}${
            isFullyGrown ? " is-completed" : ""
          }`}
          onClick={handleGrowClick}
          disabled={!canGrow}
          aria-label={
            isFullyGrown
              ? "Sunflower is fully grown"
              : canGrow
                ? "Plant is ready to grow! Tap to advance to next stage"
                : "Care requirements not yet complete"
          }
        >
          <span className="garden__grow-btn-text">
            {isFullyGrown
              ? "🌻 Fully Grown Sunflower! 🎉"
              : canGrow
                ? "✨ Ready to Grow! Tap to Advance →"
                : "Care for your plant to grow"}
          </span>
        </button>

        {/* Clear Requirements Checklist (Not relying on color alone) */}
        {!isFullyGrown && (
          <div
            className="garden__requirements"
            aria-label="Growth requirements checklist"
          >
            <div
              className={`garden__req-item${hasWater ? " is-met" : ""}`}
            >
              <span className="garden__req-status" aria-hidden="true">
                {hasWater ? "✅" : "⭕"}
              </span>
              <span>Water {hasWater ? "(Done!)" : "(Needs 1 drop)"}</span>
            </div>
            <div className={`garden__req-item${hasSun ? " is-met" : ""}`}>
              <span className="garden__req-status" aria-hidden="true">
                {hasSun ? "✅" : "⭕"}
              </span>
              <span>Sunlight {hasSun ? "(Done!)" : "(Needs sunshine)"}</span>
            </div>
          </div>
        )}
      </div>

      {/* --- 4-Stage Progress Stepping Stones --- */}
      <div className="garden__progress-strip">
        <h3 className="garden__section-heading">Growth stages</h3>
        <ol className="garden__stages" aria-label="Plant growth roadmap">
          {stages.map((stageInfo, index) => {
            const isCurrent = stageInfo.stage === plant.stage;
            const isDone = index < currentStageIndex;
            const isFuture = index > currentStageIndex;

            let statusLabel = "Current Stage";
            if (isDone) statusLabel = "Completed";
            if (isFuture) statusLabel = "Coming Next";

            return (
              <li
                key={stageInfo.stage}
                className={`garden__stage${isCurrent ? " is-current" : ""}${
                  isDone ? " is-done" : ""
                }${isFuture ? " is-future" : ""}`}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${stageInfo.label} (${statusLabel})`}
              >
                <div className="garden__stage-thumb-wrap">
                  <img
                    src={STAGE_ART[stageInfo.stage]}
                    alt=""
                    className="garden__stage-thumb"
                    aria-hidden="true"
                  />
                  {isDone && (
                    <span
                      className="garden__stage-check-badge"
                      title="Completed"
                    >
                      ✓
                    </span>
                  )}
                  {isCurrent && (
                    <span
                      className="garden__stage-current-dot"
                      title="Current Stage"
                    >
                      ★
                    </span>
                  )}
                </div>

                <span className="garden__stage-label">{stageInfo.label}</span>
                <span className="garden__stage-tag">
                  {isDone ? "Done" : isCurrent ? "Here!" : `Step ${index + 1}`}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* --- Restart Option --- */}
      <div className="garden__footer-actions">
        <button
          type="button"
          className="button button--ghost garden__restart"
          onClick={onRestart}
          aria-label="Restart garden from a new seed"
        >
          🔄 Start a new seed
        </button>
      </div>
    </section>
  );
}
