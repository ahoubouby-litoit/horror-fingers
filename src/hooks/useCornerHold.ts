import { useCallback, useRef } from 'react';

/** Duration in ms the user must hold the corner to open the panel. */
const HOLD_DURATION_MS = 1800;

/**
 * Returns handlers for a "hold to activate" interaction pattern.
 * Call `startHold` on pointerdown/touchstart and `endHold` on pointerup/touchend.
 */
export function useCornerHold(onTrigger: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHold = useCallback(() => {
    if (timerRef.current !== null) return; // already counting
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      onTrigger();
    }, HOLD_DURATION_MS);
  }, [onTrigger]);

  const endHold = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { startHold, endHold };
}
