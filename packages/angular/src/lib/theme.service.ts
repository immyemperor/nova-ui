import { Injectable, OnDestroy, signal } from '@angular/core';
import { getThemeMode, initTheme, onThemeChange, resolveTheme, setThemeMode } from '@kvui/core';
import type { ResolvedTheme, ThemeMode } from '@kvui/core';

/** Signal-based theme state. Inject anywhere: `theme = inject(ThemeService)`. */
@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  readonly mode = signal<ThemeMode>('system');
  readonly resolved = signal<ResolvedTheme>('light');
  private off?: () => void;

  constructor() {
    if (typeof document === 'undefined') return; // SSR
    initTheme();
    this.sync();
    this.off = onThemeChange(() => this.sync());
  }

  set(mode: ThemeMode): void {
    setThemeMode(mode);
  }

  private sync(): void {
    const mode = getThemeMode();
    this.mode.set(mode);
    this.resolved.set(resolveTheme(mode));
  }

  ngOnDestroy(): void {
    this.off?.();
  }
}
