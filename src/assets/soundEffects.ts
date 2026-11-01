/**
 * soundEffects.ts — Web Audio API Sound Synthesizer.
 *
 * Owned by Antigravity under src/assets/.
 * Generates original, kid-friendly sound effects in real-time:
 * - Water splash & drops (watering)
 * - Warm sun shimmer & chime (sunlight)
 * - Triumphant ascending chime flourish (plant growth)
 * - Cheerful two-tone victory bell (quiz correct)
 * - Gentle encouraging tap (quiz retry)
 *
 * Uses zero external audio files, works offline, with 0ms latency.
 */

const SOUND_STORAGE_KEY = "my-little-garden:sound-enabled";

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Initialize sound preference from localStorage if available
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY);
    if (saved !== null) {
      soundEnabled = saved === "true";
    }
  } catch {
    soundEnabled = true;
  }
}

/** Check if sound effects are currently enabled. */
export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/** Toggle sound effects on/off. */
export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
    } catch {
      // Ignore storage errors
    }
  }
  if (soundEnabled) {
    // Play a friendly beep when unmuting
    playCorrectSound();
  }
  return soundEnabled;
}

/** Lazily get or resume the AudioContext on user interaction. */
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }

  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * 💧 Water Sound Effect
 * Playful water drops and a soft gentle splash.
 */
export function playWaterSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Function to create a water bubble "bloop"
  const createBubble = (
    start: number,
    startFreq: number,
    endFreq: number,
    dur: number,
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, start);
    osc.frequency.exponentialRampToValueAtTime(endFreq, start + dur);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + dur);
  };

  // 3 bubbly drops in quick cascade
  createBubble(now, 380, 680, 0.09);
  createBubble(now + 0.07, 460, 840, 0.11);
  createBubble(now + 0.16, 540, 980, 0.09);

  // Soft filtered splash sound
  const bufferSize = ctx.sampleRate * 0.18;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1400, now + 0.05);
  filter.frequency.exponentialRampToValueAtTime(600, now + 0.22);
  filter.Q.value = 2.5;

  const splashGain = ctx.createGain();
  splashGain.gain.setValueAtTime(0.001, now + 0.05);
  splashGain.gain.linearRampToValueAtTime(0.12, now + 0.07);
  splashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  whiteNoise.connect(filter);
  filter.connect(splashGain);
  splashGain.connect(ctx.destination);

  whiteNoise.start(now + 0.05);
  whiteNoise.stop(now + 0.24);
}

/**
 * ☀️ Sunlight Sound Effect
 * Warm, radiant, golden chime with sparkling harmonic overtones.
 */
export function playSunlightSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Warm ascending golden chords (E major pentatonic frequencies)
  const freqs = [659.25, 830.61, 987.77, 1318.51, 1661.22];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + i * 0.05);

    gain.gain.setValueAtTime(0.001, now + i * 0.05);
    gain.gain.linearRampToValueAtTime(0.16, now + i * 0.05 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.05);
    osc.stop(now + i * 0.05 + 0.5);
  });
}

/**
 * 🌱 Plant Growth Sound Effect
 * A triumphant, joyful harp-like chime flourish celebrating growth.
 */
export function playGrowSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Ascending celebration notes: C5, E5, G5, A5, C6, E6
  const notes = [523.25, 659.25, 783.99, 880.0, 1046.5, 1318.51];

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = i >= notes.length - 2 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, now + i * 0.07);

    gain.gain.setValueAtTime(0.001, now + i * 0.07);
    gain.gain.linearRampToValueAtTime(0.2, now + i * 0.07 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.42);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.07);
    osc.stop(now + i * 0.07 + 0.45);
  });
}

/**
 * 🎉 Quiz Correct Answer Sound Effect
 * Bright, sparkling victory bell chime (G5 -> C6 ding!).
 */
export function playCorrectSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const playTone = (freq: number, start: number, dur: number, vol: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + dur);
  };

  // Joyful two-tone ding with sparkle overtone
  playTone(783.99, now, 0.22, 0.2); // G5
  playTone(1046.5, now + 0.1, 0.42, 0.25); // C6
  playTone(2093.0, now + 0.12, 0.28, 0.12); // High sparkle C7
}

/**
 * 💪 Quiz Retry Sound Effect
 * Gentle, encouraging marimba tap when an answer needs another try.
 */
export function playRetrySound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const playTap = (freq: number, start: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.16);
  };

  playTap(392.0, now);
  playTap(329.63, now + 0.08);
}
