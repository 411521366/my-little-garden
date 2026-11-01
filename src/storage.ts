import type { FlowerProgress, GameProgress } from "./types";
import { FLOWER_IDS, GROWTH_STAGES } from "./types";

/**
 * storage.ts — Owned by OpenCode.
 *
 * Saves and restores game progress with localStorage. Every load is validated
 * so corrupted or outdated save data can never crash the game — if anything
 * looks wrong, we simply start fresh.
 *
 * Version 5 stores progress for all three flowers, so the save format changed
 * and the storage key was bumped. Old (single-flower) saves are ignored.
 */

/** The key used to store the save data in the browser. */
const STORAGE_KEY = "my-little-garden:save-v2";

/** Check that unknown data really looks like one flower's progress. */
function isValidFlowerProgress(data: unknown): data is FlowerProgress {
  if (typeof data !== "object" || data === null) return false;
  const f = data as Record<string, unknown>;

  const flowerIdOk =
    typeof f.flowerId === "string" && FLOWER_IDS.includes(f.flowerId as never);
  const stageOk =
    typeof f.stage === "string" && GROWTH_STAGES.includes(f.stage as never);

  return (
    flowerIdOk &&
    stageOk &&
    typeof f.hasWater === "boolean" &&
    typeof f.hasSun === "boolean"
  );
}

/**
 * Check that unknown data really looks like a valid GameProgress.
 * This guards against corrupted or hand-edited save files.
 */
function isValidProgress(data: unknown): data is GameProgress {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;

  const indexOk =
    typeof d.activeFlowerIndex === "number" &&
    Number.isInteger(d.activeFlowerIndex) &&
    d.activeFlowerIndex >= 0 &&
    d.activeFlowerIndex < FLOWER_IDS.length;
  const flowersOk =
    Array.isArray(d.flowers) &&
    d.flowers.length === FLOWER_IDS.length &&
    d.flowers.every(isValidFlowerProgress);
  const waterDropsOk =
    typeof d.waterDrops === "number" &&
    Number.isInteger(d.waterDrops) &&
    d.waterDrops >= 0;
  const starsOk =
    typeof d.stars === "number" && Number.isInteger(d.stars) && d.stars >= 0;
  const answeredOk =
    Array.isArray(d.answeredQuestionIds) &&
    d.answeredQuestionIds.every((id) => typeof id === "string");

  return indexOk && flowersOk && waterDropsOk && starsOk && answeredOk;
}

/**
 * Read the saved progress. Returns null when there is no save, or when the
 * save is corrupted or invalid — the caller then starts a fresh game.
 */
export function loadProgress(): GameProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const data: unknown = JSON.parse(raw);
    if (!isValidProgress(data)) return null;

    return data;
  } catch {
    // JSON.parse threw (corrupted data) or storage is unavailable.
    return null;
  }
}

/** Write the progress to localStorage. Silently ignores storage errors. */
export function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage may be full or blocked. The game still works in memory.
  }
}

/** Remove the saved progress (used when restarting). */
export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors — nothing to clean up.
  }
}
