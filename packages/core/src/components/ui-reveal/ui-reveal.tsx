import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { AnimationName, animateIn, prefersReducedMotion } from '../../utils/animation';

/**
 * Animates its content in once it scrolls into view.
 * Use it for one deliberate moment, not on every block of a page.
 */
@Component({
  tag: 'ui-reveal',
  styleUrl: 'ui-reveal.css',
  shadow: true,
})
export class UiReveal {
  @Element() host!: HTMLElement;

  @Prop() animation: AnimationName = 'slide-up';
  /** ms */
  @Prop() duration = 500;
  /** ms */
  @Prop() delay = 0;
  /** Fraction of the element that must be visible (0 to 1). */
  @Prop() threshold = 0.15;
  /** Reveal again each time it re-enters the viewport. */
  @Prop() repeat = false;

  /** Fires after the reveal animation completes. */
  @Event() uiReveal!: EventEmitter<void>;

  private io?: IntersectionObserver;

  componentWillLoad() {
    if (!prefersReducedMotion() && typeof IntersectionObserver !== 'undefined') {
      this.host.setAttribute('data-pending', '');
    }
  }

  componentDidLoad() {
    if (!this.host.hasAttribute('data-pending')) return;
    this.io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.host.removeAttribute('data-pending');
            animateIn(this.host, this.animation, { duration: this.duration, delay: this.delay }).then(() =>
              this.uiReveal.emit(),
            );
            if (!this.repeat) this.io?.disconnect();
          } else if (this.repeat) {
            this.host.setAttribute('data-pending', '');
          }
        }
      },
      { threshold: this.threshold },
    );
    this.io.observe(this.host);
  }

  disconnectedCallback() {
    this.io?.disconnect();
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
