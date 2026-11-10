import { Component, Element, Host, Prop, h } from '@stencil/core';
import { getIcon } from './icons';

/**
 * Renders an icon from the registry. Decorative by default; pass `label` to expose it
 * to assistive tech.
 */
@Component({
  tag: 'ui-icon',
  styleUrl: 'ui-icon.css',
  shadow: true,
})
export class UiIcon {
  @Element() host!: HTMLElement;
  /** Icon name, e.g. "check". Register more with registerIcons(). */
  @Prop() name!: string;
  /** CSS size. Defaults to 1em so the icon scales with text. */
  @Prop() size?: string;
  /** Accessible label. When omitted the icon is hidden from screen readers. */
  @Prop() label?: string;
  /** Fill the shape with the current colour (e.g. a solid star). */
  @Prop() filled = false;

  componentDidRender() {
    const group = this.host.shadowRoot?.querySelector('g');
    if (group) group.innerHTML = getIcon(this.name) ?? '';
  }

  render() {
    const style = this.size ? { width: this.size, height: this.size } : undefined;
    return (
      <Host style={style} role={this.label ? 'img' : undefined} aria-label={this.label} aria-hidden={this.label ? undefined : 'true'}>
        <svg
          viewBox="0 0 24 24"
          fill={this.filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <g />
        </svg>
      </Host>
    );
  }
}
