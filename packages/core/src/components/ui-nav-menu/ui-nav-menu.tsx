import { Component, Element, Host, Listen, Prop, h } from '@stencil/core';

interface NavItemEl extends HTMLElement {
  open: boolean;
  focusTrigger: () => Promise<void>;
}

/**
 * Site navigation bar. Children are <ui-nav-item>: a plain link (href) or a disclosure
 * button that opens a panel of links. Left/Right/Home/End move between top-level items.
 */
@Component({
  tag: 'ui-nav-menu',
  styleUrl: 'ui-nav-menu.css',
  shadow: true,
})
export class UiNavMenu {
  @Element() host!: HTMLElement;

  @Prop() label = 'Main';

  private items(): NavItemEl[] {
    return Array.from(this.host.querySelectorAll(':scope > ui-nav-item')) as NavItemEl[];
  }

  @Listen('uiToggle')
  onToggle(ev: CustomEvent<boolean>) {
    if (!ev.detail) return;
    this.items().forEach((i) => {
      if (i !== ev.target) i.open = false;
    });
  }

  @Listen('keydown')
  onKeyDown(ev: KeyboardEvent) {
    // Only for the top-level triggers and links, not links inside an open panel.
    const origin = ev.composedPath()[0] as HTMLElement | undefined;
    if (!origin?.classList?.contains('link')) return;
    const items = this.items();
    const i = items.indexOf((ev.target as HTMLElement).closest('ui-nav-item') as NavItemEl);
    if (i < 0) return;
    let next: NavItemEl | undefined;
    if (ev.key === 'ArrowRight') next = items[(i + 1) % items.length];
    else if (ev.key === 'ArrowLeft') next = items[(i - 1 + items.length) % items.length];
    else if (ev.key === 'Home') next = items[0];
    else if (ev.key === 'End') next = items[items.length - 1];
    else return;
    ev.preventDefault();
    next.focusTrigger();
  }

  render() {
    return (
      <Host>
        <nav aria-label={this.label}>
          <div class="list" role="list">
            <slot />
          </div>
        </nav>
      </Host>
    );
  }
}
