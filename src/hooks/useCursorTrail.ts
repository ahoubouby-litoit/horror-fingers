import { useEffect, useRef, useState } from 'react';

export interface TrailDrop {
  id: string;
  x: number;
  y: number;
  /** Teardrop width in px */
  size: number;
  /** CSS colour string */
  color: string;
  /** CSS rotation string, e.g. "12deg" */
  rotation: string;
  /** Horizontal drift (passed as --vx CSS var) */
  vx: number;
  /** Whether this is a "splat" (click) vs a normal drip */
  isSplat: boolean;
}

interface SplatDot {
  id: string;
  x: number;
  y: number;
  sx: number; /** --sx CSS var: horizontal spread */
  sy: number; /** --sy CSS var: vertical spread */
  size: number;
  color: string;
}

export interface CursorState {
  drops: TrailDrop[];
  splats: SplatDot[];
  /** Current cursor position for the custom cursor icon */
  pos: { x: number; y: number };
}

const COLORS = ['#cc0000', '#aa0000', '#ee1100', '#880000', '#bb1100'];
const MIN_DIST = 22; // pixels between trail drops
const DROP_LIFETIME  = 900;  // ms
const SPLAT_LIFETIME = 750;  // ms

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function useCursorTrail() {
  const [state, setState] = useState<CursorState>({
    drops: [], splats: [], pos: { x: -300, y: -300 },
  });

  const lastPosRef = useRef({ x: 0, y: 0 });
  // Used on touch devices to suppress the custom cursor icon
  const isTouchRef = useRef(false);

  useEffect(() => {
    // ── Mouse move → trail drops ──────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      setState((prev) => ({ ...prev, pos: { x, y } }));

      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST) return;
      lastPosRef.current = { x, y };

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const drop: TrailDrop = {
        id,
        x: x + (Math.random() - 0.5) * 10,
        y: y + Math.random() * 6,
        size: 5 + Math.random() * 7,
        color: pickColor(),
        rotation: `${(Math.random() - 0.5) * 28}deg`,
        vx: (Math.random() - 0.5) * 12,
        isSplat: false,
      };

      setState((prev) => ({
        ...prev,
        drops: [...prev.drops.slice(-35), drop],
      }));

      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          drops: prev.drops.filter((d) => d.id !== id),
        }));
      }, DROP_LIFETIME);
    };

    // ── Click → blood splatter burst ──────────────────────────────────────
    const onClick = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      const count = 6 + Math.floor(Math.random() * 5);
      const color = pickColor();

      const dots: SplatDot[] = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const dist  = 12 + Math.random() * 22;
        const id    = `splat-${Date.now()}-${i}`;
        return {
          id,
          x: cx,
          y: cy,
          sx: Math.cos(angle) * dist,
          sy: Math.sin(angle) * dist,
          size: 4 + Math.random() * 7,
          color,
        };
      });

      setState((prev) => ({
        ...prev,
        splats: [...prev.splats.slice(-40), ...dots],
      }));

      setTimeout(() => {
        const ids = new Set(dots.map((d) => d.id));
        setState((prev) => ({
          ...prev,
          splats: prev.splats.filter((d) => !ids.has(d.id)),
        }));
      }, SPLAT_LIFETIME);
    };

    // ── Touch: hide cursor icon, still emit drops ─────────────────────────
    const onTouch = () => { isTouchRef.current = true; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('click',     onClick);
    window.addEventListener('touchstart', onTouch, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click',     onClick);
      window.removeEventListener('touchstart', onTouch);
    };
  }, []);

  return { state, isTouch: isTouchRef };
}
