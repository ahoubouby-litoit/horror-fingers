import { memo } from 'react';
import type { SpawnedMonster } from '../../types';
import styles from './MonsterSpawn.module.css';

interface Props {
  spawned: SpawnedMonster;
  motionEnabled: boolean;
}

// React.memo: existing monsters skip re-render when a new one is added.
// Each monster's `spawned` prop is a frozen object that never mutates.
export const MonsterSpawn = memo(function MonsterSpawn({ spawned, motionEnabled }: Props) {
  const { x, y, def, label } = spawned;

  // Apply every animation property as an individual inline CSS longhand.
  // This is 100 % reliable — no CSS Module class lookup, no cascade ambiguity.
  // The keyframe names (spawnGhost, spawnDemon, …) are global (defined in index.css)
  // and can be referenced directly from inline styles.
  return (
    <div
      className={styles.wrap}
      style={{
        left: x - 55,
        top:  y - 80,
        // ── Per-monster spawn movement (outer wrapper) ───────────────────
        animationName:           def.spawnAnim.name,
        animationDuration:       def.spawnAnim.duration,
        animationTimingFunction: def.spawnAnim.easing,
        animationFillMode:       'forwards',
        animationPlayState:      motionEnabled ? 'running' : 'paused',
        // ── Glow colour cascades down to the inner .svg child ────────────
        '--monster-color': def.color,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Inner container — only eyePulse glow, driven by --monster-color */}
      <div className={styles.svg}>
        <def.Component />
      </div>

      <span className={styles.label}>{label}</span>
    </div>
  );
});
