/**
 * Theme manager. Framework-agnostic; the React and Angular packages wrap it.
 * Sets `data-theme="light|dark"` on <html>, persists the user's choice, and follows
 * the OS when the mode is "system".
 */
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
type Listener = (mode: ThemeMode, resolved: ResolvedTheme) => void;

export const THEME_STORAGE_KEY = 'nova-ui-theme';

const listeners = new Set<Listener>();
let initialized = false;

const isBrowser = (): boolean => typeof window !== 'undefined' && typeof document !== 'undefined';

export function getThemeMode(): ThemeMode {
  if (!isBrowser()) return 'system';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    /* storage unavailable (private mode, blocked cookies) */
  }
  return 'system';
}

export function resolveTheme(mode: ThemeMode = getThemeMode()): ResolvedTheme {
  if (mode !== 'system') return mode;
  if (!isBrowser() || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(mode: ThemeMode = getThemeMode()): void {
  if (!isBrowser()) return;
  const resolved = resolveTheme(mode);
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-theme-mode', mode);
  root.style.colorScheme = resolved;
}

function notify(): void {
  const mode = getThemeMode();
  const resolved = resolveTheme(mode);
  listeners.forEach((fn) => fn(mode, resolved));
}

export function setThemeMode(mode: ThemeMode): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  applyTheme(mode);
  notify();
}

export function onThemeChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Call once on the client. Safe to call repeatedly. */
export function initTheme(): void {
  if (!isBrowser() || initialized) return;
  initialized = true;
  applyTheme();

  const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
  mql?.addEventListener?.('change', () => {
    if (getThemeMode() === 'system') {
      applyTheme();
      notify();
    }
  });
  // Keep multiple tabs in sync.
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_STORAGE_KEY) {
      applyTheme();
      notify();
    }
  });
}

/**
 * Inline this in <head> BEFORE first paint to avoid a flash of the wrong theme.
 * Keep in sync with packages/react/src/server.ts.
 */
export const themeInitScript =
  "(function(){try{var m=localStorage.getItem('" +
  THEME_STORAGE_KEY +
  "')||'system';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=d?'dark':'light';var e=document.documentElement;e.setAttribute('data-theme',r);e.setAttribute('data-theme-mode',m);e.style.colorScheme=r}catch(_){}})();";
