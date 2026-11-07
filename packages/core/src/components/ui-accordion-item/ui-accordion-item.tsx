import { Component, Event, EventEmitter, Host, Method, Prop, h } from '@stencil/core';

let uid = 0;

@Component({
  tag: 'ui-accordion-item',
  styleUrl: 'ui-accordion-item.css',
  shadow: true,
})
export class UiAccordionItem {
  private uid = `ui-accordion-${++uid}`;
  private button?: HTMLButtonElement;

  @Prop() heading?: string;
  @Prop() value?: string;
  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop({ reflect: true }) disabled = false;
  /** aria-level of the heading, so it fits your page outline. */
  @Prop() level = 3;

  /** Fires with the new open state. Bubbles, so you can listen on <ui-accordion>. */
  @Event() uiToggle!: EventEmitter<boolean>;

  @Method() async focusHeader() {
    this.button?.focus();
  }

  private toggle = () => {
    if (this.disabled) return;
    this.open = !this.open;
    this.uiToggle.emit(this.open);
  };

  render() {
    return (
      <Host>
        <div role="heading" aria-level={this.level} class="heading">
          <button
            type="button"
            class="trigger"
            id={`${this.uid}-btn`}
            ref={(el) => (this.button = el)}
            aria-expanded={this.open ? 'true' : 'false'}
            aria-controls={`${this.uid}-panel`}
            disabled={this.disabled}
            onClick={this.toggle}
          >
            <span class="title">
              {this.heading}
              <slot name="heading" />
            </span>
            <ui-icon class="chevron" name="chevron-down" />
          </button>
        </div>
        <div class="panel" id={`${this.uid}-panel`} role="region" aria-labelledby={`${this.uid}-btn`}>
          <div class="inner">
            <div class="content">
              <slot />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
