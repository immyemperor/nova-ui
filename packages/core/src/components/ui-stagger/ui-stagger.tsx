import { Component, Element, Host, Prop, h } from '@stencil/core';
import { AnimationName, prefersReducedMotion, staggerIn } from '../../utils/animation';

/** Animates its direct children in one after another. */
@Component({
  tag: 'ui-stagger',
  styleUrl: 'ui-stagger.css',
  shadow: true,
})
export class UiStagger {
  @Element() host!: HTMLElement;

  @Prop() animation: AnimationName = 'slide-up';
  /** Delay between children, in ms. */
  @Prop() step = 60;
  /** ms per child */
  @Prop() duration = 450;
  /** "load" plays immediately; "visible" waits until scrolled into view. */
  @Prop() trigger: 'load' | 'visible' = 'load';

  private io?: IntersectionObserver;

  componentWillLoad() {
    if (!prefersReducedMotion()) this.host.setAttribute('data-pending', '');
  }

  componentDidLoad() {
    if (!this.host.hasAttribute('data-pending')) return;
    if (this.trigger === 'visible' && typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this.io?.disconnect();
            this.play();
          }
        },
        { threshold: 0.15 },
      );
      this.io.observe(this.host);
    } else {
      this.play();
    }
  }

  disconnectedCallback() {
    this.io?.disconnect();
  }

  private play() {
    const kids = Array.from(this.host.children);
    // Animations start in a hidden state ("backwards" fill), so un-hiding is safe.
    const done = staggerIn(kids, this.animation, { step: this.step, duration: this.duration });
    this.host.removeAttribute('data-pending');
    return done;
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
