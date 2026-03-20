import { useEffect, useRef } from 'react';
import styles from './HUD.module.css';

interface Props {
  count: number;
}

export const HUD = ({ count }: Props) => {
  const prevRef  = useRef(count);
  const numRef   = useRef<HTMLSpanElement>(null);

  // Trigger the pop animation on every new summon
  useEffect(() => {
    if (count > prevRef.current && numRef.current) {
      numRef.current.classList.remove(styles.pop);
      // Force reflow so the animation restarts
      void numRef.current.offsetWidth;
      numRef.current.classList.add(styles.pop);
    }
    prevRef.current = count;
  }, [count]);

  return (
    <>
      {/* ── Title bar ──────────────────────────────────────────────── */}
      <header className={styles.titleBar} aria-label="Horror Fingers">
        <h1 className={styles.title}>☠ HORROR FINGERS ☠</h1>
        <p className={styles.subtitle}>PRESS ANY KEY · CLICK · TOUCH TO SUMMON</p>
      </header>

      {/* ── Live counter ───────────────────────────────────────────── */}
      <aside className={styles.counter} aria-live="polite" aria-label={`${count} monsters summoned`}>
        <span ref={numRef} className={styles.countNum}>{count}</span>
        <span className={styles.countLabel}>MONSTERS SUMMONED</span>
      </aside>

      {/* ── First-launch hint ──────────────────────────────────────── */}
      {count === 0 && (
        <div className={styles.intro} aria-hidden="true">
          <span className={styles.introIcon}>💀</span>
          <p className={styles.introCopy}>DARE TO PRESS A KEY…</p>
        </div>
      )}
    </>
  );
};
