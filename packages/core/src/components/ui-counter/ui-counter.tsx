import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import { prefersReducedMotion } from '../../utils/animation';

/** Counts up (or down) to a number. Screen readers get the final value, never the in-between frames. */
@Component({
  tag: 'ui-counter',
  styleUrl: 'ui-counter.css',
  shadow: true,
})
export class UiCounter {
  @Element() host!: HTMLElement;

  @Prop() value = 0;
  /** ms */
  @Prop() duration = 1200;
  @Prop() decimals = 0;
  /** Text before the number, e.g. "$". (Not `prefix`: that is a built-in read-only DOM property.) */
  @Prop() prefixText = '';
  /** Text after the number, e.g. "%". */
  @Prop() suffixText = '';
  /** BCP 47 locale for digit grouping, e.g. "en-IN". Defaults to the browser's. */
  @Prop() locale?: string;
  /** "visible" waits until the counter scrolls into view. */
  @Prop() trigger: 'load' | 'visible' = 'visible';

  @State() display = 0;

  private raf?: number;
  private io?: IntersectionObserver;

  componentWillLoad() {
    // Start at the final value so server output and no-JS users see the real number.
    this.display = this.value;
  }

  componentDidLoad() {
    if (prefersReducedMotion()) return;
    if (this.trigger === 'visible' && typeof IntersectionObserver !== 'undefined') {
      this.display = 0;
      this.io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.io?.disconnect();
          this.run(0, this.value);
        }
      });
      this.io.observe(this.host);
    } else {
      this.run(0, this.value);
    }
  }

  @Watch('value')
  onValue(next: number) {
    if (prefersReducedMotion()) this.display = next;
    else this.run(this.display, next);
  }

  disconnectedCallback() {
    this.io?.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  private run(from: number, to: number) {
    if (this.raf) cancelAnimationFrame(this.raf);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / Math.max(1, this.duration));
      const eased = 1 - Math.pow(1 - t, 3);
      this.display = from + (to - from) * eased;
      if (t < 1) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private format(n: number) {
    const opts = { minimumFractionDigits: this.decimals, maximumFractionDigits: this.decimals };
    return `${this.prefixText}${new Intl.NumberFormat(this.locale, opts).format(n)}${this.suffixText}`;
  }

  render() {
    return (
      <Host>
        <span class="num" aria-hidden="true">{this.format(this.display)}</span>
        <span class="sr">{this.format(this.value)}</span>
      </Host>
    );
  }
}
