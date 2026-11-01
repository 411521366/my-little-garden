import { useEffect, useRef, useState } from "react";
import type { FlowerId, GardenViewProps, GrowthStage } from "./types";

// Shared SVG illustrations for the early growth stages (same for all flowers)
import seedArt from "./assets/plant-seed.svg";
import sproutArt from "./assets/plant-sprout.svg";
import buddingArt from "./assets/plant-budding.svg";

// The empty, unplanted plot
import emptyArt from "./assets/plant-empty.svg";

// Flower-specific bloom illustrations
import bloomSunflowerArt from "./assets/plant-bloom.svg";
import bloomRoseArt from "./assets/plant-bloom-rose.svg";
import bloomTulipArt from "./assets/plant-bloom-tulip.svg";

// Reward and action badge icons
import wateringCanIcon from "./assets/watering-can.svg";
import sunBadgeIcon from "./assets/sun-badge.svg";
import waterDropIcon from "./assets/water-drop.svg";
import starBadgeIcon from "./assets/star-badge.svg";

// Interactive sound effects synthesizer
import {
  isSoundEnabled,
  playGrowSound,
  playSunlightSound,
  playWaterSound,
  toggleSound,
} from "./assets/soundEffects";

/**
 * GardenView.tsx — Owned by Antigravity (Taroko), extended in Version 5.
 *
 * A colorful, animated, and kid-friendly visual garden for children ages 6-10.
 * Purely presentational: reads only from GardenViewProps and delegates actions
 * via the agreed callbacks.
 *
 * Version 5 adds a flower journey indicator, an empty (unplanted) plot, a
 * "plant the next flower" action, and flower-specific bloom artwork.
 */

/** Early stages share one illustration across all flower species. */
const SHARED_STAGE_ART: Partial<Record<GrowthStage, string>> = {
  seed: seedArt,
  sprout: sproutArt,
  budding: buddingArt,
};

/** Each flower species blooms into its own illustration. */
const BLOOM_ART: Record<FlowerId, string> = {
  sunflower: bloomSunflowerArt,
  rose: bloomRoseArt,
  tulip: bloomTulipArt,
};

/** Pick the right artwork for a stage of the current flower. */
function stageArtFor(stage: GrowthStage, flowerId: FlowerId): string {
  if (stage === "empty") return emptyArt;
  if (stage === "bloom") return BLOOM_ART[flowerId];
  return SHARED_STAGE_ART[stage] ?? seedArt;
}

export default function GardenView({
  plant,
  stages,
  flowerProgress,
  waterDrops,
  stars,
  starMax,
  hasWater,
  hasSun,
  canGrow,
  isFullyGrown,
  canPlantNext,
  nextFlowerName,
  nextFlowerEmoji,
  achievementMessage,
  onWater,
  onSunlight,
  onAdvanceStage,
  onNextFlower,
}: GardenViewProps) {
  // Current stage details from props. "empty" is not in `stages`, so the
  // index is -1 until the seed is actually planted.
  const currentStageIndex = stages.findIndex(
    (stageInfo) => stageInfo.stage === plant.stage,
  );
  const isPlanted = currentStageIndex >= 0;
  const currentStage = isPlanted ? stages[currentStageIndex] : null;

  // Visual animation and sound states
  const [isWateringActive, setIsWateringActive] = useState(false);
  const [isSunlightActive, setIsSunlightActive] = useState(false);
  const [isGrowingActive, setIsGrowingActive] = useState(false);
  const [starBounce, setStarBounce] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  // Track previous stage to trigger celebratory growth animations & sound
  const prevStageRef = useRef<GrowthStage>(plant.stage);
  const prevStarsRef = useRef<number>(stars);

  useEffect(() => {
    if (prevStageRef.current !== plant.stage) {
      prevStageRef.current = plant.stage;
      setIsGrowingActive(true);
      playGrowSound();
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
    playWaterSound();
    setIsWateringActive(true);
    onWater();
    window.setTimeout(() => {
      setIsWateringActive(false);
    }, 1500);
  }

  function handleSunlightClick() {
    if (hasSun || isFullyGrown) return;
    playSunlightSound();
    setIsSunlightActive(true);
    onSunlight();
    window.setTimeout(() => {
      setIsSunlightActive(false);
    }, 1500);
  }

  function handleGrowClick() {
    if (!canGrow) return;
    playGrowSound();
    setIsGrowingActive(true);
    onAdvanceStage();
  }

  function handlePlantNextClick() {
    if (!canPlantNext) return;
    playGrowSound();
    onNextFlower();
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
      ? "This flower is fully grown!"
      : "Tap to shine warm sunlight on your plant!";

  const growText = isFullyGrown
    ? `${plant.emoji} Fully Grown! 🎉`
    : canGrow
      ? plant.stage === "empty"
        ? "✨ Plant the Seed! Tap to Grow →"
        : "✨ Ready to Grow! Tap to Advance →"
      : "Care for your plant to grow";

  const growLabel = isFullyGrown
    ? "Flower is fully grown"
    : canGrow
      ? plant.stage === "empty"
        ? "Plant the seed. Tap to place it in the soil."
        : "Plant is ready to grow! Tap to advance to next stage"
      : "Care requirements not yet complete";

  return (
    <section className="garden" aria-label="Virtual garden">
      {/* --- Header: Title and Reward Counters --- */}
      <header className="garden__header">
        <div className="garden__title-group">
          <h2 className="garden__title">
            <span className="garden__title-icon" aria-hidden="true">
              {plant.emoji}
            </span>
            <span>{plant.name}&rsquo;s Garden</span>
          </h2>
          <p className="garden__subtitle">
            Take care of {plant.name} and watch it grow!
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
            title={`You have earned ${stars} out of ${starMax} stars`}
          >
            <img
              src={starBadgeIcon}
              className="garden__reward-icon"
              alt=""
              aria-hidden="true"
            />
            <div className="garden__reward-text">
              <span className="garden__reward-count">
                {stars}/{starMax}
              </span>
              <span className="garden__reward-name">Stars</span>
            </div>
          </div>

          {/* Sound effects toggle */}
          <button
            type="button"
            className={`garden__sound-btn${soundOn ? " is-on" : " is-muted"}`}
            onClick={() => setSoundOn(toggleSound())}
            title={
              soundOn
                ? "Sound effects are on. Tap to mute."
                : "Sound effects are muted. Tap to turn on."
            }
            aria-label={soundOn ? "Mute sound effects" : "Turn on sound effects"}
          >
            <span aria-hidden="true">{soundOn ? "🔊" : "🔇"}</span>
            <span className="garden__sound-label">
              {soundOn ? "Sound" : "Muted"}
            </span>
          </button>
        </div>
      </header>

      {/* --- Flower Journey Indicator (all three flowers) --- */}
      <nav className="garden__journey" aria-label="Your flower journey">
        {flowerProgress.map((flower) => (
          <div
            key={flower.id}
            className={`garden__journey-card is-${flower.status}`}
            title={`${flower.name}: ${
              flower.status === "done"
                ? "bloomed"
                : flower.status === "current"
                  ? "growing now"
                  : "not started yet"
            }`}
          >
            <span className="garden__journey-emoji" aria-hidden="true">
              {flower.emoji}
            </span>
            <span className="garden__journey-name">{flower.name}</span>
            <span className="garden__journey-tag">
              {flower.status === "done"
                ? "Bloomed ✓"
                : flower.status === "current"
                  ? "Growing"
                  : "Locked"}
            </span>
          </div>
        ))}
      </nav>

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
            src={stageArtFor(plant.stage, plant.flowerId)}
            alt={
              isPlanted && currentStage
                ? `${plant.name} as a ${currentStage.label}`
                : `An empty plot ready for ${plant.name}'s seed`
            }
            className={`garden__plant-art${
              isGrowingActive ? " is-growing" : ""
            }`}
          />
        </div>

        {/* Stage Name & Kid-Friendly Description Banner */}
        <div className="garden__stage-badge-container">
          <span className="garden__stage-pill">
            {isPlanted && currentStage ? (
              <>
                Stage {currentStageIndex + 1} of {stages.length}:{" "}
                <strong>{currentStage.label}</strong>
              </>
            ) : (
              <>🌱 Empty Plot — plant your seed!</>
            )}
          </span>
          <p className="garden__stage-desc">
            {isPlanted && currentStage
              ? currentStage.description
              : "A patch of soft, empty soil waits for a seed. Give it water and sunlight to plant it!"}
          </p>
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

      {/* --- Grow Action / Plant-Next Button with Visual Checklist --- */}
      <div className="garden__grow-station">
        {canPlantNext ? (
          <button
            type="button"
            className="garden__grow-btn is-ready"
            onClick={handlePlantNextClick}
            aria-label={`Plant the next flower: ${nextFlowerName}`}
          >
            <span className="garden__grow-btn-text">
              🌱 Plant {nextFlowerName} {nextFlowerEmoji} →
            </span>
          </button>
        ) : (
          <button
            type="button"
            className={`garden__grow-btn${canGrow ? " is-ready" : ""}${
              isFullyGrown ? " is-completed" : ""
            }`}
            onClick={handleGrowClick}
            disabled={!canGrow}
            aria-label={growLabel}
          >
            <span className="garden__grow-btn-text">{growText}</span>
          </button>
        )}

        {/* Clear Requirements Checklist (Not relying on color alone) */}
        {!isFullyGrown && (
          <div
            className="garden__requirements"
            aria-label="Growth requirements checklist"
          >
            <div className={`garden__req-item${hasWater ? " is-met" : ""}`}>
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
                    src={stageArtFor(stageInfo.stage, plant.flowerId)}
                    alt=""
                    className="garden__stage-thumb"
                    aria-hidden="true"
                  />
                  {isDone && (
                    <span
                      className="garden__stage-check-badge"
                      title="Completed"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                  {isCurrent && (
                    <span
                      className="garden__stage-current-dot"
                      title="Current Stage"
                      aria-hidden="true"
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
    </section>
  );
}
