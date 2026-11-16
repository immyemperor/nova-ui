import { Component, Element, Host, Prop, State, h } from '@stencil/core';

/**
 * A reading-progress bar fixed to the top of the page. Driven by scroll position in JavaScript,
 * so it works in every browser. Pass `target` to measure a scrolling element instead of the page.
 */
@Component({
  tag: 'ui-scroll-progress',
  styleUrl: 'ui-scroll-progress.css',
  shadow: true,
})
export class UiScrollProgress {
  @Element() host!: HTMLElement;
  @Prop() target?: string;
  @Prop({ reflect: true }) position: 'top' | 'bottom' = 'top';
  @Prop() label = 'Reading progress';
  @State() progress = 0;

  private source: Element | Window = window;
  private onScroll = () => {
    const el = this.source === window ? document.documentElement : (this.source as HTMLElement);
    const max = el.scrollHeight - (this.source === window ? window.innerHeight : el.clientHeight);
    const y = this.source === window ? window.scrollY : el.scrollTop;
    this.progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
  };

  componentDidLoad() {
    if (this.target) this.source = document.querySelector(this.target) ?? window;
    this.source.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }

  disconnectedCallback() {
    this.source.removeEventListener('scroll', this.onScroll);
  }

  render() {
    return (
      <Host>
        <div class="track" role="progressbar" aria-label={this.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(this.progress * 100)}>
          <div class="bar" style={{ transform: `scaleX(${this.progress})` }} />
        </div>
      </Host>
    );
  }
}
