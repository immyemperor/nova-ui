import { Component, Host, Prop, State, h } from '@stencil/core';
import { getIcon, materialName, onIconLibraryChange, usesMaterial } from './icons';
import type { IconLibrary } from './icons';

/**
 * An icon from the Nova set (inline SVG) or the Material Symbols set (font ligature).
 * Nova names are drawn as SVG; in material mode, the Material ligature name is written as text.
 */
@Component({
  tag: 'ui-icon',
  styleUrl: 'ui-icon.css',
  shadow: true,
})
export class UiIcon {
  /** Icon name, e.g. "check". */
  @Prop() name!: string;
  /** Width and height, e.g. "1.5rem". Defaults to 1em. */
  @Prop() size?: string;
  /** Accessible name. Leave unset for a decorative icon. */
  @Prop() label?: string;
  /** Fill the shape (solid star, filled Material icon). */
  @Prop() filled = false;
  /** Icon set for this icon. Leave unset to use the page setting (setIconLibrary). */
  @Prop() library?: IconLibrary;

  /** Bumped when the page's icon library changes, so this icon redraws. */
  @State() revision = 0;
  private off?: () => void;

  componentWillLoad() {
    this.off = onIconLibraryChange(() => (this.revision += 1));
  }

  disconnectedCallback() {
    this.off?.();
  }

  render() {
    const style = this.size ? { width: this.size, height: this.size, fontSize: this.size } : undefined;
    const access = this.label ? { role: 'img', 'aria-label': this.label } : { 'aria-hidden': 'true' };

    if (usesMaterial(this.name, this.library)) {
      // Material: the ligature name is text inside the font. Nothing else goes in this span.
      return (
        <Host style={style} {...access}>
          <span class={{ ms: true, filled: this.filled }} aria-hidden="true">{materialName(this.name)}</span>
        </Host>
      );
    }

    /** Put the registered SVG shapes inside the <svg> element. Done here, not with innerHTML in JSX. */

    // Nova: the registered SVG markup, drawn as an SVG element (never as text).
    const markup = getIcon(this.name);
    // Nova: the registered SVG shapes, drawn as an SVG element (never as text).
    const svg = `<svg class="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">${ markup ?? ''}</svg>`;
    return (
      <Host style={style} {...access}>
        <span class="shape" innerHTML={svg} />
      </Host>
    );
  }
}