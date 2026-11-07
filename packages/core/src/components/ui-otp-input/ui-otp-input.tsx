import { AttachInternals, Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

@Component({
  tag: 'ui-otp-input',
  styleUrls: ['../../global/field.css', 'ui-otp-input.css'],
  shadow: true,
  formAssociated: true,
})
export class UiOtpInput {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  @Prop({ mutable: true }) value = '';
  @Prop() length = 6;
  @Prop() label = 'Verification code';
  @Prop() name?: string;
  @Prop() type: 'numeric' | 'alphanumeric' = 'numeric';
  @Prop() mask = false;
  @Prop() required = false;
  @Prop({ mutable: true, reflect: true }) disabled = false;

  @State() initialValue = '';

  @Event() uiInput!: EventEmitter<string>;
  @Event() uiChange!: EventEmitter<string>;
  @Event() uiComplete!: EventEmitter<string>;

  private inputs: HTMLInputElement[] = [];

  @Watch('value')
  @Watch('required')
  syncForm() {
    if (!this.internals) return;
    const complete = this.value.length === this.length;
    this.internals.setFormValue(this.value || null);
    if (this.required && !complete) this.internals.setValidity({ valueMissing: true }, `Enter all ${this.length} characters.`, this.inputs[0]);
    else this.internals.setValidity({});
  }

  componentWillLoad() {
    this.initialValue = this.value;
    this.syncForm();
  }

  formResetCallback() {
    this.value = this.initialValue;
    this.syncForm();
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private sanitize(value: string): string {
    return (this.type === 'numeric' ? value.replace(/\D/g, '') : value.replace(/[^\da-z]/gi, '')).slice(0, Math.max(1, this.length));
  }

  private setValue(value: string, startIndex: number) {
    const clean = this.sanitize(value).slice(0, Math.max(0, this.length - startIndex));
    const next = (this.value.slice(0, startIndex) + clean + this.value.slice(startIndex + Math.max(1, clean.length))).slice(0, this.length);
    this.value = next;
    this.syncForm();
    this.uiInput.emit(next);
    this.uiChange.emit(next);
    if (next.length === this.length) this.uiComplete.emit(next);
    const focusIndex = Math.min(startIndex + clean.length, this.length - 1);
    requestAnimationFrame(() => this.inputs[focusIndex]?.focus());
  }

  private onInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const chars = this.sanitize(input.value);
    if (!chars) {
      const next = this.value.slice(0, index) + this.value.slice(index + 1);
      this.value = next;
      this.syncForm();
      this.uiInput.emit(next);
      this.uiChange.emit(next);
      return;
    }
    this.setValue(chars, index);
  }

  private onPaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const index = Number(target.dataset.index ?? 0);
    this.setValue(event.clipboardData?.getData('text') ?? '', index);
  };

  private onKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.value[index] && index > 0) {
      event.preventDefault();
      const next = this.value.slice(0, index - 1) + this.value.slice(index);
      this.value = next;
      this.syncForm();
      this.uiInput.emit(next);
      this.uiChange.emit(next);
      this.inputs[index - 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.inputs[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < this.length - 1) {
      event.preventDefault();
      this.inputs[index + 1]?.focus();
    }
  }

  render() {
    const count = Math.max(1, Math.min(12, Math.floor(this.length)));
    return (
      <Host>
        <label class="label">{this.label}{this.required && <span class="req" aria-hidden="true"> *</span>}</label>
        <div class="cells" role="group" aria-label={this.label}>
          {Array.from({ length: count }, (_, index) => <input
            class="cell"
            type={this.mask ? 'password' : 'text'}
            inputMode={this.type === 'numeric' ? 'numeric' : 'text'}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`${this.label}, character ${index + 1} of ${count}`}
            data-index={index}
            maxLength={index === 0 ? count : 1}
            value={this.value[index] ?? ''}
            disabled={this.disabled}
            ref={(el) => { if (el) this.inputs[index] = el; }}
            onInput={(event) => this.onInput(index, event)}
            onPaste={this.onPaste}
            onKeyDown={(event) => this.onKeyDown(index, event)}
            key={index}
          />)}
        </div>
      </Host>
    );
  }
}