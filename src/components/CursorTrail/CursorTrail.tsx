import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  /** 1 = alive, 0 = dead */
  life: number;
  /** life units lost per frame */
  decay: number;
  type: 'drop' | 'splat' | 'streak';
  /** HSL hue — blood reds (0–22) */
  hue: number;
}

/**
 * Full-screen canvas overlay that provides:
 *  - A smooth lerped skull cursor icon with pulsing glow
 *  - Physics blood-drop trail (teardrop shape, gravity, air resistance)
 *  - Explosive blood-splatter burst on every click / tap
 *
 * Uses requestAnimationFrame at 60 fps — no React state updates on mousemove.
 */
export const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Raw mouse position
    let mx = -999, my = -999;
    // Smoothed cursor position (lerps toward mouse)
    let cx = -999, cy = -999;
    // Last position where we emitted a trail drop
    let ex = -999, ey = -999;
    let isTouch = false;
    let onPage = false;
    let frame = 0;

    const particles: Particle[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    /** Hard ceiling so rapid input never bloats the particle array. */
    const MAX_PARTICLES = 80;

    const addDrop = (x: number, y: number) => {
      if (particles.length >= MAX_PARTICLES) return;
      particles.push({
        x: x + rand(-6, 6),
        y: y + rand(-2, 4),
        vx: rand(-0.8, 0.8),
        vy: rand(0.4, 2.2),
        size: rand(3.5, 8),
        life: 1,
        decay: rand(0.014, 0.022),
        type: 'drop',
        hue: rand(0, 22),
      });
    };

    const addSplat = (x: number, y: number) => {
      if (particles.length >= MAX_PARTICLES) return;
      const count = 16 + Math.floor(rand(0, 10));
      for (let i = 0; i < count; i++) {
        const angle  = (i / count) * Math.PI * 2 + rand(-0.4, 0.4);
        const speed  = rand(2.5, 9);
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - rand(1, 3),
          size: rand(3, 10),
          life: 1,
          decay: rand(0.018, 0.028),
          type: 'splat',
          hue: rand(0, 18),
        });
      }
      // A few long streaks for drama
      for (let i = 0; i < 5; i++) {
        const angle = rand(0, Math.PI * 2);
        const speed = rand(5, 14);
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: rand(1.5, 3.5),
          life: 1,
          decay: rand(0.012, 0.02),
          type: 'streak',
          hue: rand(0, 15),
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      onPage = true;
      const dx = mx - ex, dy = my - ey;
      if (Math.sqrt(dx * dx + dy * dy) >= 20) {
        addDrop(mx, my);
        ex = mx; ey = my;
      }
    };

    const onClick = (e: MouseEvent) => { addSplat(e.clientX, e.clientY); };
    const onTouchStart = (e: TouchEvent) => {
      isTouch = true;
      if (e.touches[0]) addSplat(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave  = () => { onPage = false; };
    const onEnter  = () => { onPage = true; };

    window.addEventListener('mousemove',   onMove);
    window.addEventListener('click',       onClick);
    window.addEventListener('touchstart',  onTouchStart, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    let prevX: number[] = [];
    let prevY: number[] = [];
    const TRAIL_LEN = 8;

    let animId = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // ── Smooth cursor lerp ─────────────────────────────────────────────────
      const lerpSpeed = 0.20;
      cx += (mx - cx) * lerpSpeed;
      cy += (my - cy) * lerpSpeed;

      // Keep short history for the ghost-trail behind the skull icon
      prevX.push(cx); prevY.push(cy);
      if (prevX.length > TRAIL_LEN) { prevX.shift(); prevY.shift(); }

      // ── Update + draw particles ────────────────────────────────────────────
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.18;   // gravity
        p.vx *= 0.955;  // air resistance x
        p.vy *= 0.975;  // air resistance y
        p.life -= p.decay;

        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const a  = Math.max(0, p.life);
        const r  = Math.round(100 + p.hue * 6);   // 100–232 red channel

        ctx.save();
        ctx.globalAlpha = a * 0.92;
        // Keep shadowBlur small — it's the #1 canvas GPU cost.
        // A tight 4px blur still gives a wet-blood look without the expense.
        ctx.shadowBlur  = 4;
        ctx.shadowColor = `rgba(${r},0,0,${a * 0.5})`;

        if (p.type === 'drop') {
          // Teardrop: taller than wide, tapers downward
          const w = p.size * 0.42 * Math.max(0.25, a);
          const h = p.size * 0.85 * Math.max(0.25, a);
          ctx.fillStyle = `rgba(${r},0,0,1)`;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, w, h, 0, 0, Math.PI * 2);
          ctx.fill();
          // Specular glint
          ctx.globalAlpha = a * 0.35;
          ctx.fillStyle   = 'rgba(255,180,180,1)';
          ctx.beginPath();
          ctx.ellipse(p.x - w * 0.28, p.y - h * 0.25, w * 0.3, h * 0.22, -0.4, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === 'splat') {
          const radius = p.size * 0.55 * Math.max(0.15, a);
          ctx.fillStyle = `rgba(${r},0,0,1)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // streak — thin elongated oval aligned to velocity direction
          ctx.fillStyle = `rgba(${r},0,0,1)`;
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const sx    = speed * 0.55 + 1;
          const angle = Math.atan2(p.vy, p.vx);
          ctx.translate(p.x, p.y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, sx * 2.5, Math.min(sx * 0.55, 2.5), 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // ── Skull cursor icon ──────────────────────────────────────────────────
      if (!isTouch && onPage && mx > -500) {
        // Faint ghost trail behind the skull
        for (let i = 0; i < prevX.length; i++) {
          const t = i / prevX.length;
          ctx.save();
          ctx.globalAlpha = t * 0.12;
          ctx.font = `${Math.round(22 * t)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ff2200';
          ctx.fillText('☠', prevX[i], prevY[i]);
          ctx.restore();
        }

        // Main skull
        const pulse = 0.88 + 0.12 * Math.sin(frame * 0.07);
        const sz = Math.round(26 * pulse);
        ctx.save();
        ctx.font         = `${sz}px serif`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur   = 16 + 8 * Math.sin(frame * 0.07);
        ctx.shadowColor  = '#ff2200';
        // White skull body
        ctx.fillStyle    = '#ffffff';
        ctx.fillText('☠', cx, cy);
        // Red glow overlay
        ctx.globalAlpha  = 0.45;
        ctx.fillStyle    = '#ff2200';
        ctx.fillText('☠', cx, cy);
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove',   onMove);
      window.removeEventListener('click',       onClick);
      window.removeEventListener('touchstart',  onTouchStart);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('resize',      resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 900 }}
      aria-hidden="true"
    />
  );
};
