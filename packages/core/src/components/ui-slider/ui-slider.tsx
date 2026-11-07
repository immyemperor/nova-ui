import { AttachInternals, Component, Event, EventEmitter, Host, Prop, Watch, h } from '@stencil/core';

let uid = 0;

@Component({
  tag: 'ui-slider',
  styleUrl: 'ui-slider.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class UiSlider {
  @AttachInternals() internals!: ElementInternals;
  private uid = `ui-slider-${++uid}`;
  private initialValue = 0;

  @Prop({ mutable: true }) value = 0;
  @Prop() min = 0;
  @Prop() max = 100;
  @Prop() step = 1;
  @Prop() label?: string;
  @Prop() name?: string;
  /** Show the current value next to the label. */
  @Prop() showValue = false;
  @Prop({ mutable: true, reflect: true }) disabled = false;

  /** Fires continuously while dragging. */
  @Event() uiInput!: EventEmitter<number>;
  /** Fires when the user releases the thumb or uses the keyboard. */
  @Event() uiChange!: EventEmitter<number>;

  @Watch('value')
  syncForm() {
    this.internals?.setFormValue(String(this.value));
  }

  componentWillLoad() {
    this.initialValue = this.value;
    this.syncForm();
  }
  formResetCallback() {
    this.value = this.initialValue;
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private get percent() {
    const range = this.max - this.min;
    return range > 0 ? ((this.value - this.min) / range) * 100 : 0;
  }

  private onInput = (ev: Event) => {
    this.value = Number((ev.target as HTMLInputElement).value);
    this.uiInput.emit(this.value);
  };

  render() {
    return (
      <Host>
        {(this.label || this.showValue) && (
          <div class="head">
            {this.label && (
              <label class="label" htmlFor={this.uid}>
                {this.label}
              </label>
            )}
            {this.showValue && <output class="value" htmlFor={this.uid}>{this.value}</output>}
          </div>
        )}
        <input
          id={this.uid}
          class="range"
          type="range"
          name={this.name}
          min={this.min}
          max={this.max}
          step={this.step}
          value={this.value}
          disabled={this.disabled}
          style={{ '--_pct': `${this.percent}%` }}
          onInput={this.onInput}
          onChange={() => this.uiChange.emit(this.value)}
        />
      </Host>
    );
  }
}
