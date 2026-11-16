import { Component, Host, Prop, h } from '@stencil/core';
import { sanitizeHTML } from '../../utils/sanitize';

/**
 * Displays HTML that you don't fully control (comments, CMS content, rich text from users).
 * It is sanitised before insertion: scripts, event handlers, forms and unsafe URLs are removed.
 * Set `allowImages={false}` to strip images too.
 */
@Component({
  tag: 'ui-html',
  styleUrl: 'ui-html.css',
  shadow: true,
})
export class UiHtml {
  /** The HTML to display. Sanitised before it reaches the page. */
  @Prop() html = '';
  /** Keep <img> elements. */
  @Prop() allowImages = true;
  /** Typography defaults for long-form content. */
  @Prop({ reflect: true }) prose = false;

  render() {
    let out = sanitizeHTML(this.html ?? '');
    if (!this.allowImages) out = out.replace(/<img\b[^>]*>/gi, '');
    return (
      <Host>
        <div class="body" innerHTML={out} />
      </Host>
    );
  }
}
