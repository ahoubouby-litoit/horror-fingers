import { useCallback, useRef, useState } from 'react';
import { MONSTERS } from '../data/monsters';
import { playHorrorSound } from '../utils/audio';
import type { SpawnedMonster } from '../types';

/** Maximum monsters on-screen at once. Lower = smoother when smashing keys fast. */
const MAX_MONSTERS = 35;
/** Auto-remove delay in ms — must match the CSS animation duration. */
const SPAWN_LIFETIME_MS = 3000;

interface Options {
  soundEnabled: boolean;
  motionEnabled: boolean;
  getCtx: () => AudioContext | null;
}

export function useMonsters({ soundEnabled, motionEnabled, getCtx }: Options) {
  const [monsters, setMonsters] = useState<SpawnedMonster[]>([]);
  const [count, setCount] = useState(0);

  // Keep a ref so the cleanup timeout always reads the latest value
  const motionRef = useRef(motionEnabled);
  motionRef.current = motionEnabled;

  const summon = useCallback(
    (x: number, y: number, label: string) => {
      const def = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      // Play sound (fire-and-forget — errors are caught inside playHorrorSound)
      if (soundEnabled) {
        const ctx = getCtx();
        if (ctx) playHorrorSound(ctx, def.sound);
      }

      const entry: SpawnedMonster = { id, x, y, def, label };

      setMonsters((prev) => [...prev.slice(-MAX_MONSTERS + 1), entry]);
      setCount((c) => c + 1);

      // Auto-remove after animation completes
      if (motionRef.current) {
        setTimeout(() => {
          setMonsters((prev) => prev.filter((m) => m.id !== id));
        }, SPAWN_LIFETIME_MS);
      }
    },
    [soundEnabled, getCtx],
  );

  const clearAll = useCallback(() => {
    setMonsters([]);
  }, []);

  return { monsters, count, summon, clearAll };
}
