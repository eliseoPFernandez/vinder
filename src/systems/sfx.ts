import Phaser from 'phaser';

// Placeholder sounds synthesized with the Web Audio API: no audio files to
// download or license. They can be swapped for recorded sounds at polish time.

const MASTER_VOLUME = 0.25;

function audioContext(scene: Phaser.Scene): AudioContext | null {
  const sound = scene.sound;
  if (!(sound instanceof Phaser.Sound.WebAudioSoundManager) || sound.mute) return null;
  return sound.context;
}

interface ToneOptions {
  from: number; // start frequency (Hz)
  to?: number; // end frequency (Hz); glides if different
  start: number; // seconds from now
  duration: number;
  type?: OscillatorType;
  volume?: number;
  lowpass?: number; // cutoff (Hz) to soften harsh waveforms
  vibrato?: number; // depth (Hz) of a 6 Hz wobble
}

function tone(ctx: AudioContext, o: ToneOptions): void {
  const t0 = ctx.currentTime + o.start;
  const t1 = t0 + o.duration;

  const osc = ctx.createOscillator();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(o.from, t0);
  if (o.to !== undefined) osc.frequency.exponentialRampToValueAtTime(o.to, t1);

  const gain = ctx.createGain();
  const volume = (o.volume ?? 1) * MASTER_VOLUME;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.setValueAtTime(volume, Math.max(t0 + 0.02, t1 - 0.06));
  gain.gain.exponentialRampToValueAtTime(0.0001, t1);

  let out: AudioNode = osc;
  if (o.lowpass) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = o.lowpass;
    out.connect(filter);
    out = filter;
  }
  out.connect(gain).connect(ctx.destination);

  if (o.vibrato) {
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = 6;
    depth.gain.value = o.vibrato;
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t0);
    lfo.stop(t1);
  }

  osc.start(t0);
  osc.stop(t1 + 0.05);
}

/** Two quick swallowing "glug" sounds. */
export function playGulp(scene: Phaser.Scene): void {
  const ctx = audioContext(scene);
  if (!ctx) return;
  tone(ctx, { from: 420, to: 140, start: 0, duration: 0.1, volume: 0.9 });
  tone(ctx, { from: 380, to: 120, start: 0.13, duration: 0.11, volume: 0.9 });
}

/** A short happy rising arpeggio. */
export function playCheer(scene: Phaser.Scene): void {
  const ctx = audioContext(scene);
  if (!ctx) return;
  [523, 659, 784, 1047].forEach((freq, i) =>
    tone(ctx, { from: freq, start: i * 0.07, duration: 0.14, type: 'triangle', volume: 0.6 }),
  );
}

/** The classic "sad trombone": wah, wah, wah, waaaah. */
export function playDeath(scene: Phaser.Scene): void {
  const ctx = audioContext(scene);
  if (!ctx) return;
  const notes = [
    { freq: 196, duration: 0.32 },
    { freq: 185, duration: 0.32 },
    { freq: 175, duration: 0.32 },
    { freq: 165, duration: 1.0 },
  ];
  let start = 0;
  for (const [i, note] of notes.entries()) {
    const last = i === notes.length - 1;
    tone(ctx, {
      from: note.freq,
      to: last ? note.freq * 0.94 : undefined,
      start,
      duration: note.duration,
      type: 'sawtooth',
      lowpass: 900,
      vibrato: last ? 5 : 0,
      volume: 0.8,
    });
    start += note.duration + 0.04;
  }
}

/** A grumpy low "hmpf". */
export function playGrumble(scene: Phaser.Scene): void {
  const ctx = audioContext(scene);
  if (!ctx) return;
  tone(ctx, { from: 150, to: 110, start: 0, duration: 0.25, type: 'square', lowpass: 500, volume: 0.6 });
}

/** Vibrates the phone where supported (Android browsers; iPhones ignore it). */
export function vibrate(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Not supported: silently skip.
  }
}
