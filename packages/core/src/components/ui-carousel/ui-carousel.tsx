import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { prefersReducedMotion } from '../../utils/animation';

/**
 * Scroll-snap carousel. Slides are any child elements. Swipe, scroll, use the buttons or the dots.
 * Autoplay pauses on hover and focus, can be paused with a button, and is off for reduced-motion users.
 */
@Component({
  tag: 'ui-carousel',
  styleUrl: 'ui-carousel.css',
  shadow: true,
})
export class UiCarousel {
  @Element() host!: HTMLElement;

  /** Slides visible at once. */
  @Prop() slidesPerView = 1;
  /** Space between slides, in px. */
  @Prop() gap = 16;
  /** Wrap from the last slide back to the first. */
  @Prop() loop = false;
  /** Auto-advance every N ms. 0 turns it off. */
  @Prop() autoplay = 0;
  @Prop() showDots = true;
  @Prop() showArrows = true;
  /** Accessible name. */
  @Prop() label = 'Carousel';

  @State() index = 0;
  @State() count = 0;
  @State() playing = true;
  @State() hovering = false;

  /** Fires with the index of the first visible slide. */
  @Event() uiChange!: EventEmitter<number>;

  private track?: HTMLElement;
  private timer?: ReturnType<typeof setInterval>;
  private raf?: number;

  private slides(): HTMLElement[] {
    return Array.from(this.host.children) as HTMLElement[];
  }

  /** Number of distinct positions to snap to. */
  private positions(): number {
    return Math.max(1, this.count - Math.max(1, Math.floor(this.slidesPerView)) + 1);
  }

  @Watch('autoplay')
  @Watch('playing')
  @Watch('hovering')
  syncAutoplay() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    if (this.autoplay > 0 && this.playing && !this.hovering && !prefersReducedMotion() && this.positions() > 1) {
      this.timer = setInterval(() => this.next(true), this.autoplay);
    }
  }

  private syncSlides = () => {
    const slides = this.slides();
    this.count = slides.length;
    slides.forEach((s, i) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'slide');
      s.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
    });
    this.syncAutoplay();
  };

  componentDidLoad() {
    this.syncSlides();
  }

  disconnectedCallback() {
    if (this.timer) clearInterval(this.timer);
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  private goTo(i: number) {
    const slides = this.slides();
    const track = this.track;
    const target = slides[Math.max(0, Math.min(i, this.positions() - 1))];
    if (!target || !track) return;
    const left = target.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }

  private next(auto = false) {
    const last = this.positions() - 1;
    if (this.index >= last) {
      if (this.loop || auto) this.goTo(0);
    } else {
      this.goTo(this.index + 1);
    }
  }

  private prev() {
    if (this.index <= 0) {
      if (this.loop) this.goTo(this.positions() - 1);
    } else {
      this.goTo(this.index - 1);
    }
  }

  private onScroll = () => {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      const track = this.track;
      const slides = this.slides();
      if (!track || !slides.length) return;
      const t = track.getBoundingClientRect().left;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.getBoundingClientRect().left - t);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      best = Math.min(best, this.positions() - 1);
      if (best !== this.index) {
        this.index = best;
        this.uiChange.emit(best);
      }
    });
  };

  render() {
    const positions = this.positions();
    const perView = Math.max(1, Math.floor(this.slidesPerView));
    const atStart = !this.loop && this.index <= 0;
    const atEnd = !this.loop && this.index >= positions - 1;
    return (
      <Host
        role="region"
        aria-roledescription="carousel"
        aria-label={this.label}
        style={{ '--_per-view': String(perView), '--_gap': `${this.gap}px` }}
        onMouseEnter={() => (this.hovering = true)}
        onMouseLeave={() => (this.hovering = false)}
        onFocusin={() => (this.hovering = true)}
        onFocusout={() => (this.hovering = false)}
      >
        <div class="stage">
          <div
            class="track"
            ref={(el) => (this.track = el)}
            tabindex="0"
            aria-live={this.timer ? 'off' : 'polite'}
            onScroll={this.onScroll}
          >
            <slot onSlotchange={this.syncSlides} />
          </div>
          {this.showArrows && positions > 1 && (
            <div class="arrows">
              <ui-button class="arrow" variant="secondary" icon-only label="Previous slide" disabled={atStart} onClick={() => this.prev()}>
                <ui-icon name="chevron-left" />
              </ui-button>
              <ui-button class="arrow" variant="secondary" icon-only label="Next slide" disabled={atEnd} onClick={() => this.next()}>
                <ui-icon name="chevron-right" />
              </ui-button>
            </div>
          )}
        </div>
        {(this.showDots && positions > 1) || this.autoplay > 0 ? (
          <div class="controls">
            {this.autoplay > 0 && (
              <ui-button variant="ghost" size="sm" icon-only label={this.playing ? 'Pause autoplay' : 'Start autoplay'} onClick={() => (this.playing = !this.playing)}>
                <ui-icon name={this.playing ? 'minus' : 'chevron-right'} />
              </ui-button>
            )}
            {this.showDots && positions > 1 && (
              <div class="dots" role="group" aria-label="Choose slide">
                {Array.from({ length: positions }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    class={{ dot: true, on: i === this.index }}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === this.index ? 'true' : undefined}
                    onClick={() => this.goTo(i)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </Host>
    );
  }
}
