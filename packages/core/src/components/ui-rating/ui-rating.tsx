import { Component, Element, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'ui-rating',
  styleUrl: 'ui-rating.css',
  shadow: true,
})
export class UiRating {
  @Element() host!: HTMLElement;

  @Prop({ mutable: true }) value = 0;
  @Prop() max = 5;
  @Prop({ reflect: true }) readonly = false;
  /** Accessible name for the group, e.g. "Rate this article". */
  @Prop() label = 'Rating';
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @State() hover = 0;

  @Event() uiChange!: EventEmitter<number>;

  private set(n: number) {
    if (this.readonly || n === this.value) return;
    this.value = n;
    this.uiChange.emit(n);
  }

  private onKeyDown = (ev: KeyboardEvent) => {
    if (this.readonly) return;
    let next = this.value;
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') next = Math.min(this.max, this.value + 1);
    else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') next = Math.max(1, this.value - 1);
    else if (ev.key === 'Home') next = 1;
    else if (ev.key === 'End') next = this.max;
    else return;
    ev.preventDefault();
    this.set(next);
    requestAnimationFrame(() => (this.host.shadowRoot?.querySelector(`[data-n="${next}"]`) as HTMLElement | null)?.focus());
  };

  render() {
    const shown = this.hover || this.value;
    const stars = Array.from({ length: this.max }, (_, i) => i + 1);
    const tabbable = this.value || 1;
    return (
      <Host>
        <div class="stars" role="radiogroup" aria-label={this.label} aria-readonly={this.readonly ? 'true' : undefined} onKeyDown={this.onKeyDown} onMouseLeave={() => (this.hover = 0)}>
          {stars.map((n) => (
            <button
              type="button"
              class={{ star: true, on: n <= shown }}
              data-n={n}
              role="radio"
              aria-checked={n === this.value ? 'true' : 'false'}
              aria-label={`${n} of ${this.max}`}
              tabindex={this.readonly ? -1 : n === tabbable ? 0 : -1}
              disabled={this.readonly}
              onClick={() => this.set(n)}
              onMouseEnter={() => !this.readonly && (this.hover = n)}
            >
              <ui-icon name="star" filled={n <= shown} />
            </button>
          ))}
        </div>
      </Host>
    );
  }
}
