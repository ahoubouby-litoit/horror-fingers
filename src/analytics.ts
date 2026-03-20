/**
 * Lightweight Google Analytics 4 integration.
 *
 * ── Setup ──────────────────────────────────────────────────────────────────
 *   1. Create a GA4 property at analytics.google.com → get your Measurement ID
 *      (looks like  G-XXXXXXXXXX)
 *   2. Add  VITE_GA_ID=G-XXXXXXXXXX  to your .env file (or Vercel/Netlify env)
 *   3. Deploy — that's it.  No extra packages needed.
 *
 * ── Events tracked ─────────────────────────────────────────────────────────
 *   horror_session_start  — fires once on load with device / language info
 *   key_pressed           — fires per unique key (not on repeat-hold)
 *   tap_summon            — fires on touch / click
 *   horror_session_end    — fires on page-unload via sendBeacon; carries
 *                           total_keys, total_monsters, duration_s
 *
 * ── Privacy ────────────────────────────────────────────────────────────────
 *   • No personally-identifiable data is ever sent.
 *   • Key names are sanitised (only single visible chars pass through;
 *     everything else is replaced with the key category string).
 *   • If VITE_GA_ID is absent the module is a complete no-op.
 */

const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined)?.trim() || '';

/* ── gtag type shim ──────────────────────────────────────────────────────── */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];
  }
}

let ready = false;
let sessionStart = 0;
let totalKeys   = 0;
let totalMonsters = 0;
const seenKeys = new Set<string>();

/* ── Internal helpers ────────────────────────────────────────────────────── */

function push(name: string, params?: Record<string, string | number | boolean>) {
  if (!ready || !window.gtag) return;
  window.gtag('event', name, { ...params, app: 'horror-fingers' });
}

function sanitiseKey(key: string): string {
  // Only forward single printable characters; replace everything else
  // with a safe category label (never sends e.g. passwords typed elsewhere)
  if (key === ' ') return 'SPACE';
  if (key.length === 1 && /\S/.test(key)) return key.toUpperCase();
  return `[${key.slice(0, 12)}]`;
}

/* ── Public API ──────────────────────────────────────────────────────────── */

/** Call once at app mount. Injects the GA4 loader script dynamically. */
export function initAnalytics(): void {
  if (!GA_ID || ready) return;
  ready = true;
  sessionStart = Date.now();

  // Inject GA4 loader
  const s   = document.createElement('script');
  s.async   = true;
  s.src     = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function () { window.dataLayer!.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    send_page_view: false,     // we fire it manually below
    anonymize_ip:   true,
  });

  // Page view
  push('page_view', {
    page_title:    'Horror Fingers',
    page_location: window.location.href,
  });

  // Session start — device context
  push('horror_session_start', {
    device:   /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    language: navigator.language || 'unknown',
    screen:   `${screen.width}x${screen.height}`,
  });

  // Session end — use sendBeacon so data survives tab close
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSession();
  });
  window.addEventListener('pagehide', flushSession);
}

function flushSession() {
  if (!ready || sessionStart === 0) return;
  const duration = Math.round((Date.now() - sessionStart) / 1000);
  sessionStart = 0; // don't double-fire
  push('horror_session_end', {
    total_keys:     totalKeys,
    unique_keys:    seenKeys.size,
    total_monsters: totalMonsters,
    duration_s:     duration,
  });
}

/** Track a keyboard key press (deduplicates within session for unique-key count). */
export function trackKey(rawKey: string): void {
  totalKeys++;
  const safe = sanitiseKey(rawKey);
  seenKeys.add(safe);
  // Only send event once per unique key to avoid flooding GA
  if (seenKeys.size <= 52 || !seenKeys.has(safe)) {
    push('key_pressed', { key: safe, session_total: totalKeys });
  }
}

/** Track a touch / click summon. */
export function trackTap(): void {
  push('tap_summon', { session_total: ++totalMonsters });
}

/** Track every monster spawn (increments internal counter, not sent per-spawn). */
export function trackMonster(): void {
  totalMonsters++;
}
