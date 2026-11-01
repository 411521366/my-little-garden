import type { GameProgress } from "./types";
import { GROWTH_STAGES } from "./types";

/**
 * storage.ts — Owned by OpenCode.
 *
 * Saves and restores game progress with localStorage. Every load is validated
 * so corrupted or outdated save data can never crash the game — if anything
 * looks wrong, we simply start fresh.
 */

/** The key used to store the save data in the browser. */
const STORAGE_KEY = "my-little-garden:save-v1";

/**
 * Check that unknown data really looks like a valid GameProgress.
 * This guards against corrupted or hand-edited save files.
 */
function isValidProgress(data: unknown): data is GameProgress {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;

  const stageOk =
    typeof d.stage === "string" && GROWTH_STAGES.includes(d.stage as never);
  const waterDropsOk =
    typeof d.waterDrops === "number" &&
    Number.isInteger(d.waterDrops) &&
    d.waterDrops >= 0;
  const starsOk =
    typeof d.stars === "number" && Number.isInteger(d.stars) && d.stars >= 0;
  const hasWaterOk = typeof d.hasWater === "boolean";
  const hasSunOk = typeof d.hasSun === "boolean";
  const answeredOk =
    Array.isArray(d.answeredQuestionIds) &&
    d.answeredQuestionIds.every((id) => typeof id === "string");

  return (
    stageOk &&
    waterDropsOk &&
    starsOk &&
    hasWaterOk &&
    hasSunOk &&
    answeredOk
  );
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
