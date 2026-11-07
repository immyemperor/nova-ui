import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';

@Component({
  tag: 'ui-carousel',
  styleUrl: 'ui-carousel.css',
  shadow: true,
})
export class UiCarousel {
  @Element() host!: HTMLElement;

  @Prop({ mutable: true }) index = 0;
  @Prop() loop = true;
  @Prop() autoplay = false;
  @Prop() interval = 5000;
  @Prop() label = 'Carousel';
  @Prop() indicators = true;

  @State() count = 0;
  @Event() uiChange!: EventEmitter<number>;

  private slotEl?: HTMLSlotElement;
  private timer?: ReturnType<typeof setInterval>;

  componentDidLoad() {
    this.syncSlides();
    this.syncTimer();
  }

  disconnectedCallback() {
    this.clearTimer();
  }

  @Watch('autoplay')
  @Watch('interval')
  syncTimer() {
    this.clearTimer();
    if (this.autoplay && this.interval > 0) this.timer = setInterval(() => this.go(this.index + 1), this.interval);
  }

  private clearTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  private syncSlides = () => {
    const slides = this.slotEl?.assignedElements({ flatten: true }) ?? [];
    this.count = slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.toggleAttribute('hidden', slideIndex !== this.index);
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${slideIndex + 1} of ${slides.length}`);
    });
    if (this.index >= slides.length && slides.length) this.go(slides.length - 1);
  };

  private go(nextIndex: number) {
    if (!this.count) return;
    let next = nextIndex;
    if (this.loop) next = (next + this.count) % this.count;
    else next = Math.max(0, Math.min(this.count - 1, next));
    if (next === this.index) return;
    this.index = next;
    this.syncSlides();
    this.uiChange.emit(next);
  }

  @Listen('keydown')
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') this.go(this.index + 1);
    else if (event.key === 'ArrowLeft') this.go(this.index - 1);
    else return;
    event.preventDefault();
  }

  render() {
    return (
      <Host>
        <section class="frame" aria-roledescription="carousel" aria-label={this.label}>
          <div class="slides"><slot ref={(el) => (this.slotEl = el)} onSlotchange={this.syncSlides} /></div>
          {this.count > 1 && <div class="controls">
            <button type="button" class="arrow" aria-label="Previous slide" onClick={() => this.go(this.index - 1)}><ui-icon name="chevron-left" /></button>
            {this.indicators && <div class="indicators" role="group" aria-label="Choose slide">
              {Array.from({ length: this.count }, (_, i) => <button type="button" class={{ dot: true, active: i === this.index }} aria-label={`Go to slide ${i + 1}`} aria-current={i === this.index ? 'true' : undefined} onClick={() => this.go(i)} key={i} />)}
            </div>}
            <button type="button" class="arrow" aria-label="Next slide" onClick={() => this.go(this.index + 1)}><ui-icon name="chevron-right" /></button>
          </div>}
        </section>
      </Host>
    );
  }
}