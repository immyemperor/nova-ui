import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';

@Component({
  tag: 'ui-marquee',
  styleUrl: 'ui-marquee.css',
  shadow: true,
})
export class UiMarquee {
  @Element() host!: HTMLElement;

  @Prop() speed = 40;
  @Prop() direction: 'left' | 'right' = 'left';
  @Prop({ reflect: true, mutable: true }) paused = false;
  @Prop() pauseOnHover = true;

  @State() duration = 20;

  private sourceSlot?: HTMLSlotElement;
  private duplicate?: HTMLDivElement;
  private resizeObserver?: ResizeObserver;

  componentDidLoad() {
    this.cloneContent();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.measure());
      this.resizeObserver.observe(this.host);
      if (this.duplicate) this.resizeObserver.observe(this.duplicate);
    }
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }

  @Watch('speed')
  measure() {
    const width = this.duplicate?.getBoundingClientRect().width ?? 0;
    this.duration = width > 0 ? width / Math.max(1, this.speed) : 20;
  }

  private cloneContent = () => {
    if (!this.duplicate) return;
    const elements = this.sourceSlot?.assignedElements({ flatten: true }) ?? [];
    this.duplicate.replaceChildren(...elements.map((element) => {
      const clone = element.cloneNode(true) as HTMLElement;
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach((child) => child.removeAttribute('id'));
      return clone;
    }));
    this.duplicate.setAttribute('aria-hidden', 'true');
    this.duplicate.setAttribute('inert', '');
    this.measure();
  };

  render() {
    return (
      <Host>
        <div class={{ viewport: true, hoverable: this.pauseOnHover }}>
          <div class={{ track: true, reverse: this.direction === 'right' }} style={{ '--marquee-duration': `${this.duration}s` }}>
            <div class="segment"><slot ref={(el) => (this.sourceSlot = el)} onSlotchange={this.cloneContent} /></div>
            <div class="segment duplicate" ref={(el) => (this.duplicate = el)} />
          </div>
        </div>
      </Host>
    );
  }
}