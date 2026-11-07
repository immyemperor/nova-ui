import { Component, Host, Prop, State, Watch, h } from '@stencil/core';

@Component({
  tag: 'ui-avatar',
  styleUrl: 'ui-avatar.css',
  shadow: true,
})
export class UiAvatar {
  @Prop() src?: string;
  /** Used for the alt text and for initials when there's no image. */
  @Prop() name = '';
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Prop({ reflect: true }) shape: 'circle' | 'square' = 'circle';

  @State() failed = false;

  @Watch('src')
  resetFailure() {
    this.failed = false;
  }

  private initials() {
    const parts = this.name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '';
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  render() {
    const showImage = !!this.src && !this.failed;
    return (
      <Host role="img" aria-label={this.name || undefined}>
        {showImage ? (
          <img src={this.src} alt="" onError={() => (this.failed = true)} />
        ) : this.initials() ? (
          <span class="initials" aria-hidden="true">{this.initials()}</span>
        ) : (
          <slot />
        )}
      </Host>
    );
  }
}
