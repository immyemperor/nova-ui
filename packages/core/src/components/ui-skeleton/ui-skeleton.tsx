import { Component, Host, Prop, h } from '@stencil/core';

/** Loading placeholder. Hidden from assistive tech; mark the loading region with aria-busy yourself. */
@Component({
  tag: 'ui-skeleton',
  styleUrl: 'ui-skeleton.css',
  shadow: true,
})
export class UiSkeleton {
  @Prop({ reflect: true }) shape: 'text' | 'rect' | 'circle' = 'text';
  /** CSS width. Defaults to 100%. */
  @Prop() width?: string;
  /** CSS height. Defaults depend on shape. */
  @Prop() height?: string;
  /** Number of text lines (shape="text" only). The last line is shorter. */
  @Prop() lines = 1;
  @Prop({ reflect: true }) animated = true;

  render() {
    if (this.shape === 'text') {
      return (
        <Host aria-hidden="true" style={{ width: this.width }}>
          {Array.from({ length: this.lines }, (_, i) => (
            <span class="bar" style={{ width: this.lines > 1 && i === this.lines - 1 ? '60%' : '100%', height: this.height }} />
          ))}
        </Host>
      );
    }
    const size = this.shape === 'circle' ? this.width ?? this.height ?? '2.5rem' : undefined;
    return (
      <Host aria-hidden="true" style={{ width: size ?? this.width, height: size ?? this.height ?? '6rem' }}>
        <span class="bar fill" />
      </Host>
    );
  }
}
