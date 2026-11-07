import { Component, Host, Method, Prop, State, h } from '@stencil/core';
import type { ToastOptions } from '../../types';
import { prefersReducedMotion } from '../../utils/animation';
import { supportsPopover } from '../../utils/position';

interface Item extends ToastOptions {
  id: string;
  enter?: boolean;
  leaving?: boolean;
}

const ICON: Record<string, string | undefined> = {
  neutral: undefined,
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};

let seq = 0;

/** Stack of notifications. Mount once; trigger with the toast() helper or the show() method. */
@Component({
  tag: 'ui-toaster',
  styleUrl: 'ui-toaster.css',
  shadow: true,
})
export class UiToaster {
  @Prop({ reflect: true }) placement: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' = 'bottom-right';
  /** Most toasts visible at once; the oldest is dropped first. */
  @Prop() max = 5;
  /** Default auto-dismiss time in ms. 0 keeps toasts until dismissed. */
  @Prop() duration = 5000;

  @State() items: Item[] = [];

  private region?: HTMLElement;
  private paused = false;
  private promote = false;
  private timers = new Map<string, { handle?: ReturnType<typeof setTimeout>; remaining: number; startedAt: number }>();

  @Method() async show(options: ToastOptions): Promise<string> {
    const id = options.id ?? `ui-toast-${++seq}`;
    const existing = this.items.find((i) => i.id === id);
    const item: Item = { ...options, id, tone: options.tone ?? 'neutral', enter: !existing };
    const next = existing ? this.items.map((i) => (i.id === id ? item : i)) : [...this.items, item];
    this.items = next.slice(-this.max);
    this.promote = !existing;

    this.clearTimer(id);
    const ms = options.duration ?? this.duration;
    if (ms > 0) this.startTimer(id, ms);
    return id;
  }

  @Method() async dismiss(id: string): Promise<void> {
    const item = this.items.find((i) => i.id === id);
    if (!item || item.leaving) return;
    this.clearTimer(id);
    this.items = this.items.map((i) => (i.id === id ? { ...i, leaving: true } : i));
    setTimeout(() => (this.items = this.items.filter((i) => i.id !== id)), prefersReducedMotion() ? 0 : 160);
  }

  @Method() async clear(): Promise<void> {
    this.items.forEach((i) => this.dismiss(i.id));
  }

  componentDidRender() {
    const el = this.region;
    if (!el || !supportsPopover()) return;
    let isOpen = false;
    try {
      isOpen = el.matches(':popover-open');
    } catch {
      return;
    }
    const anyEl = el as any;
    if (this.items.length === 0) {
      if (isOpen) anyEl.hidePopover();
    } else if (!isOpen) {
      anyEl.showPopover();
    } else if (this.promote) {
      // Re-show so new toasts sit above any modal opened since the last one.
      anyEl.hidePopover();
      anyEl.showPopover();
    }
    this.promote = false;
  }

  disconnectedCallback() {
    this.timers.forEach((t) => t.handle && clearTimeout(t.handle));
    this.timers.clear();
  }

  private startTimer(id: string, ms: number) {
    this.timers.set(id, { remaining: ms, startedAt: 0 });
    if (!this.paused) this.arm(id);
  }

  private arm(id: string) {
    const t = this.timers.get(id);
    if (!t) return;
    t.startedAt = Date.now();
    t.handle = setTimeout(() => this.dismiss(id), t.remaining);
  }

  private clearTimer(id: string) {
    const t = this.timers.get(id);
    if (t?.handle) clearTimeout(t.handle);
    this.timers.delete(id);
  }

  /** Pause countdowns while the pointer or keyboard focus is in the stack. */
  private pauseAll = () => {
    this.paused = true;
    this.timers.forEach((t) => {
      if (!t.handle) return;
      clearTimeout(t.handle);
      t.handle = undefined;
      t.remaining -= Date.now() - t.startedAt;
    });
  };

  private resumeAll = () => {
    this.paused = false;
    this.timers.forEach((_t, id) => this.arm(id));
  };

  private markEntered(id: string) {
    this.items = this.items.map((i) => (i.id === id && i.enter ? { ...i, enter: false } : i));
  }

  render() {
    return (
      <Host>
        <div
          class="region"
          ref={(el) => (this.region = el)}
          role="region"
          aria-label="Notifications"
          onMouseEnter={this.pauseAll}
          onMouseLeave={this.resumeAll}
          onFocusin={this.pauseAll}
          onFocusout={this.resumeAll}
          {...({ popover: 'manual' } as any)}
        >
          <div class="stack">
            {this.items.map((t) => {
              const tone = t.tone ?? 'neutral';
              const icon = ICON[tone];
              return (
                <div
                  key={t.id}
                  class={{ toast: true, [tone]: true, enter: !!t.enter, leave: !!t.leaving }}
                  role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
                  onAnimationEnd={() => this.markEntered(t.id)}
                >
                  {icon && <ui-icon class="icon" name={icon} size="1.25em" />}
                  <div class="content">
                    {t.title && <p class="title">{t.title}</p>}
                    {t.description && <p class="desc">{t.description}</p>}
                  </div>
                  {t.actionLabel && (
                    <ui-button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        t.onAction?.();
                        this.dismiss(t.id);
                      }}
                    >
                      {t.actionLabel}
                    </ui-button>
                  )}
                  {t.dismissible !== false && (
                    <ui-button size="sm" variant="ghost" icon-only label="Dismiss notification" onClick={() => this.dismiss(t.id)}>
                      <ui-icon name="x" />
                    </ui-button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Host>
    );
  }
}
