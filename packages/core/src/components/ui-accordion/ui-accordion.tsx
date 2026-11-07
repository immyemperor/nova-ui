import { Component, Element, Host, Listen, Prop, h } from '@stencil/core';

interface ItemEl extends HTMLElement {
  open: boolean;
  disabled: boolean;
  focusHeader: () => Promise<void>;
}

/** Group of <ui-accordion-item>. By default only one is open at a time. */
@Component({
  tag: 'ui-accordion',
  styleUrl: 'ui-accordion.css',
  shadow: true,
})
export class UiAccordion {
  @Element() host!: HTMLElement;

  /** Allow several items open at once. */
  @Prop() multiple = false;
  @Prop({ reflect: true }) variant: 'bordered' | 'flush' = 'bordered';

  private items(): ItemEl[] {
    return Array.from(this.host.querySelectorAll(':scope > ui-accordion-item')) as ItemEl[];
  }

  @Listen('uiToggle')
  onToggle(ev: CustomEvent<boolean>) {
    if (this.multiple || !ev.detail) return;
    this.items().forEach((i) => {
      if (i !== ev.target) i.open = false;
    });
  }

  @Listen('keydown')
  onKeyDown(ev: KeyboardEvent) {
    // Only when focus is on a header button, not on content inside a panel.
    const origin = ev.composedPath()[0] as HTMLElement | undefined;
    if (!origin?.classList?.contains('trigger')) return;
    const items = this.items().filter((i) => !i.disabled);
    const i = items.indexOf((ev.target as HTMLElement).closest('ui-accordion-item') as ItemEl);
    if (i < 0) return;
    let next: ItemEl | undefined;
    if (ev.key === 'ArrowDown') next = items[(i + 1) % items.length];
    else if (ev.key === 'ArrowUp') next = items[(i - 1 + items.length) % items.length];
    else if (ev.key === 'Home') next = items[0];
    else if (ev.key === 'End') next = items[items.length - 1];
    else return;
    ev.preventDefault();
    next.focusHeader();
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
