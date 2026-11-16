import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

let uid = 0;

/** Animated show/hide of a block. Uses the grid-rows trick, so height animates without measuring. */
@Component({
  tag: 'ui-collapse',
  styleUrl: 'ui-collapse.css',
  shadow: true,
})
export class UiCollapse {
  private uid = `ui-collapse-${++uid}`;
  @Prop({ mutable: true, reflect: true }) open = false;
  /** Visible even when closed (a preview line). */
  @Prop() peek?: string;
  @Event() uiToggle!: EventEmitter<boolean>;

  private toggle = () => {
    this.open = !this.open;
    this.uiToggle.emit(this.open);
  };

  render() {
    return (
      <Host>
        <button type="button" class="head" aria-expanded={this.open ? 'true' : 'false'} aria-controls={`${this.uid}-body`} onClick={this.toggle}>
          <span class="label"><slot name="label" /></span>
          <ui-icon class="chev" name="chevron-down" />
        </button>
        {this.peek && !this.open && <p class="peek">{this.peek}</p>}
        <div class="panel" id={`${this.uid}-body`}>
          <div class="inner"><div class="content"><slot /></div></div>
        </div>
      </Host>
    );
  }
}
