import type { FC } from 'react';

// ─── Sound kinds ─────────────────────────────────────────────────────────────
export type SoundKind =
  | 'ghost'
  | 'screech'
  | 'groan'
  | 'cackle'
  | 'thunder'
  | 'bat'
  | 'drip'
  | 'howl'
  | 'rattle'
  | 'eerie'
  | 'hiss'
  | 'pipe';

// ─── Per-monster spawn animation descriptor ───────────────────────────────────
export interface SpawnAnim {
  /** Global keyframe name defined in index.css, e.g. 'spawnGhost' */
  name: string;
  /** Full CSS duration string, e.g. '3s' */
  duration: string;
  /** CSS timing function, e.g. 'ease-out' or 'cubic-bezier(...)' */
  easing: string;
}

// ─── Monster definition (static data) ────────────────────────────────────────
export interface MonsterDef {
  /** Unique slug — used as React key and CSS identifier */
  id: string;
  /** Human-readable display name */
  name: string;
  /** CSS colour used for glow / drop-shadow */
  color: string;
  /** Which sound plays on spawn */
  sound: SoundKind;
  /** The SVG React component to render */
  Component: FC;
  /** Spawn animation applied directly as inline CSS properties */
  spawnAnim: SpawnAnim;
}

// ─── A live monster on screen ─────────────────────────────────────────────────
export interface SpawnedMonster {
  /** Unique instance id (Date.now + random) */
  id: string;
  /** Viewport X position */
  x: number;
  /** Viewport Y position */
  y: number;
  /** The monster definition */
  def: MonsterDef;
  /** Key / label shown below the monster */
  label: string;
}
