import { AttachInternals, Component, Event, EventEmitter, Host, Method, Prop, Watch, h } from '@stencil/core';

let uid = 0;

@Component({
  tag: 'ui-input',
  styleUrls: ['../../global/field.css', 'ui-input.css'],
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class UiInput {
  @AttachInternals() internals!: ElementInternals;

  private uid = `ui-input-${++uid}`;
  private inputEl?: HTMLInputElement;
  private initialValue = '';

  @Prop({ mutable: true }) value = '';
  @Prop() label?: string;
  /** Helper text shown under the field. */
  @Prop() hint?: string;
  /** Error text. Also marks the field invalid. */
  @Prop() error?: string;
  @Prop() type: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' = 'text';
  @Prop() name?: string;
  @Prop() placeholder?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() readonly = false;
  @Prop() required = false;
  @Prop() autocomplete?: string;
  @Prop() maxlength?: number;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  /** Fires on every keystroke with the current value. */
  @Event() uiInput!: EventEmitter<string>;
  /** Fires when the value is committed (blur or Enter). */
  @Event() uiChange!: EventEmitter<string>;

  @Watch('value')
  @Watch('required')
  syncForm() {
    this.internals?.setFormValue(this.value);
    if (this.required && !this.value) {
      this.internals?.setValidity({ valueMissing: true }, 'Fill in this field.', this.inputEl);
    } else {
      this.internals?.setValidity({});
    }
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

  @Method() async focusInput() {
    this.inputEl?.focus();
  }

  private onInput = (ev: Event) => {
    this.value = (ev.target as HTMLInputElement).value;
    this.uiInput.emit(this.value);
  };
  private onChange = () => this.uiChange.emit(this.value);

  render() {
    const hintId = `${this.uid}-hint`;
    const errId = `${this.uid}-err`;
    const message = this.error ?? this.hint;
    return (
      <Host>
        {this.label && (
          <label class="label" htmlFor={this.uid}>
            {this.label}
            {this.required && <span class="req" aria-hidden="true"> *</span>}
          </label>
        )}
        <div class="control" data-invalid={this.error ? 'true' : 'false'}>
          <slot name="prefix" />
          <input
            id={this.uid}
            class="native"
            ref={(el) => (this.inputEl = el)}
            type={this.type}
            name={this.name}
            value={this.value}
            placeholder={this.placeholder}
            disabled={this.disabled}
            readOnly={this.readonly}
            required={this.required}
            autocomplete={this.autocomplete as any}
            maxLength={this.maxlength}
            aria-invalid={this.error ? 'true' : undefined}
            aria-describedby={message ? (this.error ? errId : hintId) : undefined}
            onInput={this.onInput}
            onChange={this.onChange}
          />
          <slot name="suffix" />
        </div>
        {message && (
          <p class={{ msg: true, error: !!this.error }} id={this.error ? errId : hintId} role={this.error ? 'alert' : undefined}>
            {message}
          </p>
        )}
      </Host>
    );
  }
}
