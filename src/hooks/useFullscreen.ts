import { RefObject, useCallback, useEffect, useState } from 'react';

/**
 * Wraps the Fullscreen API with a React-friendly interface.
 * Falls back gracefully in environments that don't support fullscreen.
 */
export function useFullscreen(ref: RefObject<HTMLElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    // Safari
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  const toggle = useCallback(() => {
    if (!document.fullscreenElement) {
      ref.current?.requestFullscreen().catch((err: Error) => {
        console.warn('Fullscreen request failed:', err.message);
      });
    } else {
      document.exitFullscreen().catch((err: Error) => {
        console.warn('Exit fullscreen failed:', err.message);
      });
    }
  }, [ref]);

  return { isFullscreen, toggle };
}
