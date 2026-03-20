import { useCallback, useEffect, useRef, useState } from 'react';

import { useAudio }      from './hooks/useAudio';
import { useMonsters }   from './hooks/useMonsters';
import { useFullscreen } from './hooks/useFullscreen';
import { useCornerHold } from './hooks/useCornerHold';

import { BloodDrips }   from './components/BloodDrips/BloodDrips';
import { CursorTrail }  from './components/CursorTrail/CursorTrail';
import { Fireflies }    from './components/Fireflies/Fireflies';
import { HUD }          from './components/HUD/HUD';
import { MonsterSpawn } from './components/MonsterSpawn/MonsterSpawn';
import { ParentPanel }  from './components/ParentPanel/ParentPanel';

import { Analytics } from '@vercel/analytics/react';
import { initAnalytics, trackKey, trackTap, trackMonster } from './analytics';

import styles from './App.module.css';

// Keys that should NOT be intercepted (browser / OS shortcuts we must leave alone)
const PASS_THROUGH_KEYS = new Set([
  'Escape', 'Tab',
  'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
]);

/** Minimum ms between keyboard-triggered spawns (prevents key-held flooding). */
const KEY_THROTTLE_MS = 90;

export default function App() {
  const [soundEnabled,  setSoundEnabled]  = useState(true);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [showPanel,     setShowPanel]     = useState(false);
  const [lightning,     setLightning]     = useState(false);

  const containerRef      = useRef<HTMLDivElement>(null);
  const lastKeyTimeRef    = useRef(0);   // throttle key-held repeats

  // ── Hooks ────────────────────────────────────────────────────────────────
  const { getCtx }                     = useAudio(soundEnabled);
  const { monsters, count, summon, clearAll } = useMonsters({ soundEnabled, motionEnabled, getCtx });
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(containerRef);
  const { startHold, endHold }         = useCornerHold(() => setShowPanel(true));

  // Keep latest showPanel value accessible inside stable keyboard handler
  const showPanelRef = useRef(showPanel);
  showPanelRef.current = showPanel;

  // ── Init analytics once on mount ─────────────────────────────────────────
  useEffect(() => { initAnalytics(); }, []);

  // ── Core summon ──────────────────────────────────────────────────────────
  const handleSummon = useCallback(
    (x: number, y: number, label: string) => {
      summon(x, y, label);
      trackMonster();
      // 18% chance of a lightning flash per summon
      if (Math.random() < 0.18) {
        setLightning(true);
        setTimeout(() => setLightning(false), 250);
      }
    },
    [summon],
  );

  // ── Keyboard handler ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showPanelRef.current)         return;
      if (PASS_THROUGH_KEYS.has(e.key)) return;
      e.preventDefault();

      // Throttle key-held repeats — still allows fast typing, stops flooding
      const now = Date.now();
      if (now - lastKeyTimeRef.current < KEY_THROTTLE_MS) return;
      lastKeyTimeRef.current = now;

      const label =
        e.key === ' '       ? 'SPACE'
        : e.key.length === 1 ? e.key.toUpperCase()
        : e.key;

      trackKey(e.key);

      const x = 80 + Math.random() * (window.innerWidth  - 160);
      const y = 100 + Math.random() * (window.innerHeight - 220);
      handleSummon(x, y, label);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSummon]);

  // ── Pointer (click / touch) handler ─────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (showPanelRef.current) return;
      const { clientX, clientY } =
        'touches' in e ? e.touches[0] : e;
      trackTap();
      handleSummon(clientX, clientY, '👁');
    },
    [handleSummon],
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={styles.app}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
    >
      {/* Ambient atmosphere */}
      <Fireflies />
      <BloodDrips />
      <div className={styles.fogA} aria-hidden="true" />
      <div className={styles.fogB} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* Lightning flash */}
      {lightning && <div className={styles.lightning} aria-hidden="true" />}

      {/* HUD: title + counter + intro hint */}
      <HUD count={count} />

      {/* Live monsters */}
      {monsters.map((m) => (
        <MonsterSpawn key={m.id} spawned={m} motionEnabled={motionEnabled} />
      ))}

      {/* Settings panel */}
      {showPanel && (
        <ParentPanel
          soundEnabled={soundEnabled}
          motionEnabled={motionEnabled}
          isFullscreen={isFullscreen}
          onToggleSound={() => setSoundEnabled((v) => !v)}
          onToggleMotion={() => setMotionEnabled((v) => !v)}
          onToggleFullscreen={toggleFullscreen}
          onClear={clearAll}
          onClose={() => setShowPanel(false)}
        />
      )}

      {/* ── Corner-hold trigger (top-left, 1.8 s hold) ─────────────── */}
      {!showPanel && (
        <div
          className={styles.cornerHold}
          onMouseDown={(e) => { e.stopPropagation(); startHold(); }}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={(e) => { e.stopPropagation(); startHold(); }}
          onTouchEnd={endHold}
          role="button"
          tabIndex={0}
          aria-label="Open settings — hold for 2 seconds"
          onKeyDown={(e) => { if (e.key === 'Enter') setShowPanel(true); }}
        >
          <span className={styles.cornerIcon} aria-hidden="true">☰</span>
        </div>
      )}

      {/* ── Fullscreen toggle ───────────────────────────────────────── */}
      <button
        className={styles.fullscreenBtn}
        onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? '⊡ EXIT' : '⛶ FULLSCREEN'}
      </button>

      {/* Bottom hint */}
      <p className={styles.hint} aria-hidden="true">
        HOLD TOP-LEFT CORNER FOR SETTINGS
      </p>

      {/* Cursor trail — rendered last so it sits above everything */}
      <CursorTrail />

      {/* Vercel Analytics — invisible, auto-activates on Vercel deployments */}
      <Analytics />
    </div>
  );
}
