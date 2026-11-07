import { AttachInternals, Component, Event, EventEmitter, Host, Prop, Watch, h } from '@stencil/core';

@Component({
  tag: 'ui-checkbox',
  styleUrl: 'ui-checkbox.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class UiCheckbox {
  @AttachInternals() internals!: ElementInternals;
  private initialChecked = false;

  @Prop({ mutable: true, reflect: true }) checked = false;
  /** Shows a dash (mixed state). Cleared as soon as the user toggles. */
  @Prop({ mutable: true, reflect: true }) indeterminate = false;
  /** Value submitted with the form when checked. */
  @Prop() value = 'on';
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;

  @Event() uiChange!: EventEmitter<boolean>;

  @Watch('checked')
  @Watch('required')
  syncForm() {
    this.internals?.setFormValue(this.checked ? this.value : null);
    if (this.required && !this.checked) this.internals?.setValidity({ valueMissing: true }, 'Check this box to continue.');
    else this.internals?.setValidity({});
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
    this.indeterminate = false;
    this.uiChange.emit(this.checked);
  };

  render() {
    return (
      <Host>
        <label class="root">
          <input
            class="native"
            type="checkbox"
            name={this.name}
            checked={this.checked}
            indeterminate={this.indeterminate}
            disabled={this.disabled}
            required={this.required}
            aria-checked={this.indeterminate ? 'mixed' : undefined}
            onChange={this.onChange}
          />
          <span class="box" aria-hidden="true">
            {this.indeterminate ? <ui-icon name="minus" size="0.9em" /> : this.checked ? <ui-icon name="check" size="0.9em" /> : null}
          </span>
          <span class="text">
            <slot />
          </span>
        </label>
      </Host>
    );
  }
}
