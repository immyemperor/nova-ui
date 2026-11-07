import { AttachInternals, Component, Event, EventEmitter, Host, Prop, Watch, h } from '@stencil/core';

@Component({
  tag: 'ui-switch',
  styleUrl: 'ui-switch.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class UiSwitch {
  @AttachInternals() internals!: ElementInternals;
  private initialChecked = false;

  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop() value = 'on';
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  /** Put the label before the track. */
  @Prop({ reflect: true }) reverse = false;

  @Event() uiChange!: EventEmitter<boolean>;

  @Watch('checked')
  syncForm() {
    this.internals?.setFormValue(this.checked ? this.value : null);
  }

  componentWillLoad() {
    this.initialChecked = this.checked;
    this.syncForm();
  }
  formResetCallback() {
    this.checked = this.initialChecked;
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private onChange = (ev: Event) => {
    this.checked = (ev.target as HTMLInputElement).checked;
    this.uiChange.emit(this.checked);
  };

  render() {
    return (
      <Host>
        <label class="root">
          <input class="native" type="checkbox" role="switch" name={this.name} checked={this.checked} disabled={this.disabled} onChange={this.onChange} />
          <span class="track" aria-hidden="true">
            <span class="thumb" />
          </span>
          <span class="text">
            <slot />
          </span>
        </label>
      </Host>
    );
  }
}
