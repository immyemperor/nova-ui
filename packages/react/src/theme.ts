import { useEffect, useSyncExternalStore } from 'react';
import { getThemeMode, initTheme, onThemeChange, resolveTheme, setThemeMode } from '@omni/core';
import type { ResolvedTheme, ThemeMode } from '@omni/core';

const subscribe = (cb: () => void) => onThemeChange(() => cb());

/** Reactive access to the theme. Server snapshot is "system"/"light" so hydration matches. */
export function useTheme(): { mode: ThemeMode; resolved: ResolvedTheme; setMode: (m: ThemeMode) => void } {
  useEffect(() => {
    initTheme();
  }, []);
  const mode = useSyncExternalStore(subscribe, getThemeMode, () => 'system' as ThemeMode);
  const resolved = useSyncExternalStore(subscribe, () => resolveTheme(getThemeMode()), () => 'light' as ResolvedTheme);
  return { mode, resolved, setMode: setThemeMode };
}
