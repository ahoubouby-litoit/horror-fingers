import { useCallback, useEffect, useRef } from 'react';

/**
 * Manages a single shared AudioContext.
 * The context is created lazily on the first call to getCtx()
 * (Web Audio requires a user gesture before creating a context).
 */
export function useAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  /** Returns the shared AudioContext, or null when sound is disabled / unavailable. */
  const getCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;

    // Lazy creation
    if (!ctxRef.current) {
      const AudioCtxCtor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxCtor) return null;
      ctxRef.current = new AudioCtxCtor();
    }

    // Resume if the browser suspended it (autoplay policy)
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume();
    }

    return ctxRef.current;
  }, [enabled]);

  // Cleanup: close the context when the component tree unmounts
  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
    };
  }, []);

  return { getCtx };
}
