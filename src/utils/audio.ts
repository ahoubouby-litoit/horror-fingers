import type { SoundKind } from '../types';

/**
 * Plays a procedurally generated horror sound using the Web Audio API.
 * All sounds are synthesised — no audio files required.
 * Each call is self-contained and handles its own resource lifecycle.
 */
export function playHorrorSound(ctx: AudioContext, kind: SoundKind): void {
  const T = ctx.currentTime;

  // ── Helpers ─────────────────────────────────────────────────────────────

  function osc(
    type: OscillatorType,
    freqSteps: [number, number][],
    dur: number,
    vol = 0.28,
    postProcess?: (o: OscillatorNode) => AudioNode,
  ): void {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    if (freqSteps.length > 0) {
      o.frequency.value = freqSteps[0][0];
      freqSteps.forEach(([f, t]) => o.frequency.linearRampToValueAtTime(f, T + t));
    }
    g.gain.setValueAtTime(vol, T);
    g.gain.exponentialRampToValueAtTime(0.0001, T + dur);
    const source: AudioNode = postProcess ? postProcess(o) : o;
    source.connect(g);
    g.connect(ctx.destination);
    o.start(T);
    o.stop(T + dur + 0.05);
  }

  function noise(dur: number, vol: number, filterHz: number, filterType: BiquadFilterType = 'lowpass'): void {
    const sz = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    src.buffer = buf;
    f.type = filterType;
    f.frequency.value = filterHz;
    g.gain.setValueAtTime(vol, T);
    g.gain.exponentialRampToValueAtTime(0.0001, T + dur);
    src.connect(f);
    f.connect(g);
    g.connect(ctx.destination);
    src.start(T);
  }

  // ── Sound implementations ────────────────────────────────────────────────

  const sounds: Record<SoundKind, () => void> = {
    ghost: () =>
      osc('sine', [[220, 0], [90, 1.2], [110, 1.8]], 1.8, 0.22, (o) => {
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 600;
        o.connect(f);
        return f;
      }),

    screech: () =>
      osc('sawtooth', [[700, 0], [2200, 0.1], [350, 0.5]], 0.55, 0.12),

    groan: () =>
      osc('square', [[100, 0], [55, 0.8], [80, 1.3]], 1.3, 0.18, (o) => {
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 280;
        f.Q.value = 2;
        o.connect(f);
        return f;
      }),

    cackle: () => {
      for (let i = 0; i < 10; i++) {
        const delay = i * 0.075;
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = 'sawtooth';
        o2.frequency.value = 300 + Math.random() * 200;
        g2.gain.setValueAtTime(0, T + delay);
        g2.gain.linearRampToValueAtTime(0.12, T + delay + 0.025);
        g2.gain.exponentialRampToValueAtTime(0.0001, T + delay + 0.07);
        o2.connect(g2);
        g2.connect(ctx.destination);
        o2.start(T + delay);
        o2.stop(T + delay + 0.09);
      }
    },

    thunder: () => noise(1.6, 0.65, 160),

    bat: () => {
      for (let i = 0; i < 5; i++) {
        const d = i * 0.055;
        const ob = ctx.createOscillator();
        const gb = ctx.createGain();
        ob.type = 'sine';
        ob.frequency.value = 3800 - i * 350;
        gb.gain.setValueAtTime(0.09, T + d);
        gb.gain.exponentialRampToValueAtTime(0.0001, T + d + 0.06);
        ob.connect(gb);
        gb.connect(ctx.destination);
        ob.start(T + d);
        ob.stop(T + d + 0.08);
      }
    },

    drip: () =>
      osc('sine', [[1100, 0], [320, 0.18]], 0.22, 0.25),

    howl: () => {
      const ow = ctx.createOscillator();
      const gw = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      ow.type = 'sine';
      ow.frequency.setValueAtTime(290, T);
      ow.frequency.linearRampToValueAtTime(600, T + 0.6);
      ow.frequency.linearRampToValueAtTime(380, T + 1.3);
      lfo.frequency.value = 6;
      lg.gain.value = 28;
      gw.gain.setValueAtTime(0.3, T);
      gw.gain.exponentialRampToValueAtTime(0.0001, T + 1.5);
      lfo.connect(lg);
      lg.connect(ow.frequency);
      ow.connect(gw);
      gw.connect(ctx.destination);
      ow.start(T);
      ow.stop(T + 1.5);
      lfo.start(T);
      lfo.stop(T + 1.5);
    },

    rattle: () => noise(0.55, 0.38, 1100, 'bandpass'),

    eerie: () => {
      osc('sine', [[220, 0], [185, 0.6], [225, 1.1]], 1.1, 0.18);
      // Slightly delayed harmony
      const offset = 0.18;
      const o3 = ctx.createOscillator();
      const g3 = ctx.createGain();
      o3.type = 'sine';
      o3.frequency.setValueAtTime(330, T + offset);
      o3.frequency.linearRampToValueAtTime(275, T + offset + 0.6);
      g3.gain.setValueAtTime(0.1, T + offset);
      g3.gain.exponentialRampToValueAtTime(0.0001, T + offset + 1.1);
      o3.connect(g3);
      g3.connect(ctx.destination);
      o3.start(T + offset);
      o3.stop(T + offset + 1.15);
    },

    hiss: () => noise(0.8, 0.3, 2200, 'highpass'),

    pipe: () =>
      osc('triangle', [[160, 0], [140, 0.4], [155, 0.8]], 0.9, 0.2),
  };

  try {
    sounds[kind]();
  } catch {
    // Silently ignore audio errors (e.g. AudioContext suspended, browser policy)
  }
}
