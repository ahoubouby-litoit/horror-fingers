import { useEffect, useRef } from 'react';

// ─── Particle types ──────────────────────────────────────────────────────────
type PType = 'firefly' | 'mist' | 'ember';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Rendered radius */
  size: number;
  /** Base hue (HSL) */
  hue: number;
  /** Base saturation */
  sat: number;
  /** 0→2π life phase — drives opacity through sin() for smooth fade */
  phase: number;
  /** How fast phase increments each frame */
  phaseSpeed: number;
  /** Peak opacity for this particle */
  peakAlpha: number;
  type: PType;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

// Horror palette: deep reds, purples, dark crimsons, ember oranges
const HUES: [number, number, PType][] = [
  [0,   15,  'firefly'],
  [270, 300, 'firefly'],
  [340, 360, 'firefly'],
  [20,  35,  'ember'  ],
  [290, 310, 'mist'   ],
  [0,   10,  'mist'   ],
];

function makeParticle(W: number, H: number): Particle {
  const [hMin, hMax, type] = HUES[Math.floor(Math.random() * HUES.length)];
  const hue = rand(hMin, hMax);

  const size =
    type === 'mist'  ? rand(35, 90) :
    type === 'ember' ? rand(1,  2.5) :
                       rand(1.5, 4);

  const peakAlpha =
    type === 'mist'  ? rand(0.025, 0.07) :
    type === 'ember' ? rand(0.6,   0.95) :
                       rand(0.45,  0.85);

  const vy =
    type === 'ember' ? rand(-0.9, -0.25) :
    type === 'mist'  ? rand(-0.12, 0.12) :
                       rand(-0.25, 0.25);

  return {
    x: rand(0, W), y: rand(0, H),
    vx: rand(-0.3, 0.3), vy,
    size, hue,
    sat: type === 'mist' ? rand(60, 80) : rand(85, 100),
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: rand(0.005, 0.022),
    peakAlpha, type,
  };
}

// 55 particles is the sweet spot: rich atmosphere without GPU pressure
const NUM = 55;

/**
 * Full-screen canvas particle background.
 * Mixes three layers: drifting mist blobs, glowing firefly dots, rising embers.
 * Runs at 60 fps via requestAnimationFrame — no CSS animations.
 */
export const Fireflies = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0;
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = Array.from({ length: NUM }, () => makeParticle(W, H));
    let animId = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vx += (Math.random() - 0.5) * 0.025;
        p.vy += (Math.random() - 0.5) * 0.025;
        p.vx  = Math.max(-0.7, Math.min(0.7, p.vx));
        p.vy  = Math.max(-1.0, Math.min(0.4, p.vy));
        p.phase += p.phaseSpeed;

        if (p.x < -120) p.x = W + 60;
        if (p.x > W + 120) p.x = -60;
        if (p.y < -120) p.y = H + 60;
        if (p.y > H + 120) p.y = -60;

        const alpha = p.peakAlpha * Math.max(0, Math.sin(p.phase));
        if (alpha < 0.002) continue;

        ctx.save();
        ctx.globalAlpha = alpha;

        if (p.type === 'mist') {
          // Mist: radial gradient only — NO shadowBlur (gradient is already soft)
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0,   `hsl(${p.hue},${p.sat}%,35%)`);
          grad.addColorStop(0.5, `hsl(${p.hue},${p.sat}%,20%)`);
          grad.addColorStop(1,   'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === 'firefly') {
          // Firefly: small bright core + cheap soft halo ring (no shadowBlur)
          ctx.fillStyle = `hsl(${p.hue},${p.sat}%,80%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
          ctx.fill();
          // Soft halo via a second semi-transparent circle
          ctx.globalAlpha = alpha * 0.18;
          ctx.fillStyle   = `hsl(${p.hue},${p.sat}%,65%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // Ember: tiny bright dot + short velocity streak (no shadowBlur)
          ctx.fillStyle = `hsl(${p.hue},100%,82%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha * 0.22;
          ctx.strokeStyle = `hsl(${p.hue},100%,70%)`;
          ctx.lineWidth   = p.size * 0.55;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 7, p.y + p.vy * 7);
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.85 }}
      aria-hidden="true"
    />
  );
};
