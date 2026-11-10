import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';

/**
 * Endless horizontal ticker for logos or short text. Content is cloned (hidden from assistive tech)
 * until it fills the width, so the loop has no gap. Stops for reduced-motion users.
 */
@Component({
  tag: 'ui-marquee',
  styleUrl: 'ui-marquee.css',
  shadow: true,
})
export class UiMarquee {
  @Element() host!: HTMLElement;

  /** Pixels per second. */
  @Prop() speed = 50;
  @Prop({ reflect: true }) direction: 'left' | 'right' = 'left';
  @Prop() pauseOnHover = true;
  /** Space between repeated items, px. */
  @Prop() gap = 32;

  private viewport?: HTMLElement;
  private track?: HTMLElement;
  private group?: HTMLElement;
  private clones?: HTMLElement;
  private ro?: ResizeObserver;

  @Watch('speed')
  @Watch('gap')
  @Watch('direction')
  rebuild() {
    const { viewport, track, group, clones } = this;
    if (!viewport || !track || !group || !clones) return;
    while (clones.firstChild) clones.removeChild(clones.firstChild);

    const groupWidth = group.getBoundingClientRect().width;
    const viewWidth = viewport.getBoundingClientRect().width;
    if (groupWidth <= 0 || viewWidth <= 0 || this.speed <= 0) return;

    // Enough copies to cover the viewport, plus one so the loop point is off-screen.
    const copies = Math.ceil(viewWidth / groupWidth);
    const source = Array.from(this.host.children);
    for (let i = 0; i < copies; i++) {
      const copy = document.createElement('div');
      copy.className = 'group';
      copy.setAttribute('aria-hidden', 'true');
      (copy as any).inert = true;
      source.forEach((el) => copy.appendChild(el.cloneNode(true)));
      clones.appendChild(copy);
    }
    track.style.setProperty('--_shift', `${groupWidth}px`);
    track.style.setProperty('--_dur', `${groupWidth / this.speed}s`);
  }

  componentDidLoad() {
    this.rebuild();
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.rebuild());
      if (this.viewport) this.ro.observe(this.viewport);
      if (this.group) this.ro.observe(this.group);
    }
  }

  disconnectedCallback() {
    this.ro?.disconnect();
  }

  render() {
    return (
      <Host style={{ '--_gap': `${this.gap}px` }} data-pause={this.pauseOnHover ? '' : undefined}>
        <div class="viewport" ref={(el) => (this.viewport = el)}>
          <div class="track" ref={(el) => (this.track = el)}>
            <div class="group" ref={(el) => (this.group = el)}>
              <slot onSlotchange={() => this.rebuild()} />
            </div>
            <div class="clones" ref={(el) => (this.clones = el)} />
          </div>
        </div>
      </Host>
    );
  }
}
