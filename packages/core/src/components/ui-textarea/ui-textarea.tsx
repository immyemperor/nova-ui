import { AttachInternals, Component, Event, EventEmitter, Host, Method, Prop, Watch, h } from '@stencil/core';

let uid = 0;

@Component({
  tag: 'ui-textarea',
  styleUrls: ['../../global/field.css', 'ui-textarea.css'],
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class UiTextarea {
  @AttachInternals() internals!: ElementInternals;

  private uid = `ui-textarea-${++uid}`;
  private el?: HTMLTextAreaElement;
  private initialValue = '';

  @Prop({ mutable: true }) value = '';
  @Prop() label?: string;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop() name?: string;
  @Prop() placeholder?: string;
  @Prop() rows = 3;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() readonly = false;
  @Prop() required = false;
  @Prop() maxlength?: number;
  /** Grow with content instead of scrolling. */
  @Prop() autoresize = false;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @Event() uiInput!: EventEmitter<string>;
  @Event() uiChange!: EventEmitter<string>;

  @Watch('value')
  @Watch('required')
  syncForm() {
    this.internals?.setFormValue(this.value);
    if (this.required && !this.value) {
      this.internals?.setValidity({ valueMissing: true }, 'Fill in this field.', this.el);
    } else {
      this.internals?.setValidity({});
    }
    this.resize();
  }

  componentWillLoad() {
    this.initialValue = this.value;
    this.syncForm();
  }
  componentDidLoad() {
    this.resize();
  }

  formResetCallback() {
    this.value = this.initialValue;
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  @Method() async focusInput() {
    this.el?.focus();
  }

  private resize() {
    if (!this.autoresize || !this.el) return;
    this.el.style.height = 'auto';
    this.el.style.height = `${this.el.scrollHeight}px`;
  }

  private onInput = (ev: Event) => {
    this.value = (ev.target as HTMLTextAreaElement).value;
    this.uiInput.emit(this.value);
  };

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
          <textarea
            id={this.uid}
            class="native"
            ref={(el) => (this.el = el)}
            name={this.name}
            rows={this.rows}
            placeholder={this.placeholder}
            disabled={this.disabled}
            readOnly={this.readonly}
            required={this.required}
            maxLength={this.maxlength}
            value={this.value}
            aria-invalid={this.error ? 'true' : undefined}
            aria-describedby={message ? (this.error ? errId : hintId) : undefined}
            onInput={this.onInput}
            onChange={() => this.uiChange.emit(this.value)}
          />
        </div>
        <div class="foot">
          {message ? (
            <p class={{ msg: true, error: !!this.error }} id={this.error ? errId : hintId} role={this.error ? 'alert' : undefined}>
              {message}
            </p>
          ) : (
            <span />
          )}
          {this.maxlength != null && (
            <span class="count" aria-hidden="true">
              {this.value.length}/{this.maxlength}
            </span>
          )}
        </div>
      </Host>
    );
  }
}
