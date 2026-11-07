import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

/** Side panel (or bottom sheet). Same behaviour as <ui-modal>, anchored to an edge. */
@Component({
  tag: 'ui-drawer',
  styleUrl: 'ui-drawer.css',
  shadow: true,
})
export class UiDrawer {
  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop({ reflect: true }) side: 'left' | 'right' | 'top' | 'bottom' = 'right';
  @Prop() heading?: string;
  @Prop() label?: string;
  @Prop() dismissible = true;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @Event({ bubbles: false }) uiOpen!: EventEmitter<void>;
  @Event({ bubbles: false }) uiClose!: EventEmitter<void>;

  render() {
    return (
      <Host>
        <ui-modal
          placement={this.side}
          size={this.size}
          open={this.open}
          heading={this.heading}
          label={this.label}
          dismissible={this.dismissible}
          onUiOpen={() => this.uiOpen.emit()}
          onUiClose={() => {
            this.open = false;
            this.uiClose.emit();
          }}
        >
          <slot name="header" slot="header" />
          <slot />
          <slot name="footer" slot="footer" />
        </ui-modal>
      </Host>
    );
  }
}
