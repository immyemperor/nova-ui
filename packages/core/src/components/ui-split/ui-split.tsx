import { Component, Element, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { clampSplit, dividerKey, ratioFromDrag } from '../../utils/layout-math';

/** Two panes with a draggable, keyboard-operable divider. Each pane keeps a minimum size. */
@Component({
  tag: 'ui-split',
  styleUrl: 'ui-split.css',
  shadow: true,
})
export class UiSplit {
  @Element() host!: HTMLElement;

  @Prop({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  /** Size of the first pane as a fraction (0..1). */
  @Prop({ mutable: true }) ratio = 0.5;
  @Prop() minA = 120;
  @Prop() minB = 120;
  /** Accessible name for the divider, e.g. "Resize file list". */
  @Prop() label = 'Resize panes';
  /** Remember the ratio under this key. */
  @Prop() storageKey?: string;

  @State() dragging = false;
  private total = 0;
  private startRatio = 0;
  private startPos = 0;

  @Event() uiResize!: EventEmitter<number>;

  componentWillLoad() {
    if (this.storageKey) {
      try {
        const saved = Number(localStorage.getItem(this.storageKey));
        if (saved > 0 && saved < 1) this.ratio = saved;
      } catch { /* storage unavailable */ }
    }
  }

  private measure() {
    const r = this.host.getBoundingClientRect();
    this.total = this.orientation === 'horizontal' ? r.width : r.height;
  }

  private setRatio(next: number, commit: boolean) {
    this.ratio = clampSplit(next, this.total, this.minA, this.minB);
    if (commit) {
      this.uiResize.emit(this.ratio);
      if (this.storageKey) { try { localStorage.setItem(this.storageKey, String(this.ratio)); } catch { /* ignore */ } }
    }
  }

  private onPointerDown = (e: PointerEvent) => {
    this.measure();
    this.dragging = true;
    this.startRatio = this.ratio;
    this.startPos = this.orientation === 'horizontal' ? e.clientX : e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    const pos = this.orientation === 'horizontal' ? e.clientX : e.clientY;
    this.setRatio(ratioFromDrag(this.startRatio, pos - this.startPos, this.total, this.minA, this.minB), false);
  };

  private onPointerUp = () => {
    if (!this.dragging) return;
    this.dragging = false;
    this.setRatio(this.ratio, true);
  };

  private onKey = (e: KeyboardEvent) => {
    this.measure();
    const next = dividerKey(e.key, this.ratio, 16, this.total, this.minA, this.minB, e.shiftKey);
    if (next === undefined) return;
    e.preventDefault();
    this.setRatio(next, true);
  };

  render() {
    const horiz = this.orientation === 'horizontal';
    const pct = `${(this.ratio * 100).toFixed(2)}%`;
    return (
      <Host style={{ '--_a': pct }}>
        <div class="pane a"><slot name="a" /></div>
        <div
          class={{ divider: true, dragging: this.dragging }}
          role="separator"
          tabindex={0}
          aria-orientation={horiz ? 'vertical' : 'horizontal'}
          aria-label={this.label}
          aria-valuenow={Math.round(this.ratio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${Math.round(this.ratio * 100)}% of the first pane`}
          onPointerDown={this.onPointerDown}
          onPointerMove={this.onPointerMove}
          onPointerUp={this.onPointerUp}
          onPointerCancel={this.onPointerUp}
          onKeyDown={this.onKey}
          onDblClick={() => this.setRatio(0.5, true)}
        >
          <span class="grip" aria-hidden="true" />
        </div>
        <div class="pane b"><slot name="b" /></div>
      </Host>
    );
  }
}
