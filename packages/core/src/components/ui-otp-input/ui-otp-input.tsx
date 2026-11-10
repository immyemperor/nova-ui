import { AttachInternals, Component, Element, Event, EventEmitter, Host, Method, Prop, Watch, h } from '@stencil/core';

let uid = 0;

/** One-time-code entry: separate boxes, auto-advance, paste and SMS autofill support. */
@Component({
  tag: 'ui-otp-input',
  styleUrl: 'ui-otp-input.css',
  shadow: true,
  formAssociated: true,
})
export class UiOtpInput {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  private uid = `ui-otp-${++uid}`;
  private cells: HTMLInputElement[] = [];
  private initialValue = '';

  @Prop({ mutable: true }) value = '';
  @Prop() length = 6;
  @Prop() type: 'numeric' | 'alphanumeric' = 'numeric';
  /** Hide the characters, like a password. */
  @Prop() mask = false;
  @Prop() label?: string;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  /** Fires on every change with the characters entered so far. */
  @Event() uiInput!: EventEmitter<string>;
  /** Fires once, when every box is filled. */
  @Event() uiComplete!: EventEmitter<string>;

  @Method() async focusInput() {
    this.cells[Math.min(this.value.length, this.length - 1)]?.focus();
  }

  @Watch('value')
  @Watch('required')
  @Watch('length')
  syncForm() {
    this.internals?.setFormValue(this.value);
    if (this.required && this.value.length < this.length) {
      this.internals?.setValidity({ valueMissing: true }, 'Enter the full code.', this.cells[0]);
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

  private clean(raw: string): string {
    const re = this.type === 'numeric' ? /[^0-9]/g : /[^a-zA-Z0-9]/g;
    return raw.replace(re, '');
  }

  private commit(next: string, focusIndex?: number) {
    const was = this.value;
    this.value = next.slice(0, this.length);
    if (this.value !== was) {
      this.uiInput.emit(this.value);
      if (this.value.length === this.length) this.uiComplete.emit(this.value);
    }
    if (focusIndex != null) requestAnimationFrame(() => this.cells[Math.max(0, Math.min(focusIndex, this.length - 1))]?.focus());
  }

  /** Typing, SMS autofill and paste all arrive here as one or more characters. */
  private onInput = (e: Event, i: number) => {
    const el = e.target as HTMLInputElement;
    const chars = this.clean(el.value);
    el.value = this.value[i] ?? ''; // re-render decides the real content
    if (!chars) return;
    const before = this.value.slice(0, i).padEnd(i, ' ');
    const next = (before + chars + this.value.slice(i + chars.length)).replace(/ /g, '');
    this.commit(next, i + chars.length);
  };

  private onKeyDown = (e: KeyboardEvent, i: number) => {
    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        if (this.value[i]) this.commit(this.value.slice(0, i) + this.value.slice(i + 1), i);
        else if (i > 0) this.commit(this.value.slice(0, i - 1) + this.value.slice(i), i - 1);
        break;
      case 'Delete':
        e.preventDefault();
        this.commit(this.value.slice(0, i) + this.value.slice(i + 1), i);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.cells[Math.max(0, i - 1)]?.focus();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.cells[Math.min(this.length - 1, i + 1)]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        this.cells[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        this.cells[this.length - 1]?.focus();
        break;
    }
  };

  private onPaste = (e: ClipboardEvent, i: number) => {
    e.preventDefault();
    const chars = this.clean(e.clipboardData?.getData('text') ?? '');
    if (!chars) return;
    this.commit(this.value.slice(0, i) + chars, i + chars.length);
  };

  render() {
    const message = this.error ?? this.hint;
    const msgId = `${this.uid}-msg`;
    return (
      <Host>
        {this.label && (
          <span class="label" id={`${this.uid}-label`}>
            {this.label}
            {this.required && <span class="req" aria-hidden="true"> *</span>}
          </span>
        )}
        <div class="cells" role="group" aria-labelledby={this.label ? `${this.uid}-label` : undefined} aria-describedby={message ? msgId : undefined}>
          {Array.from({ length: this.length }, (_, i) => (
            <input
              key={i}
              class={{ cell: true, invalid: !!this.error, filled: !!this.value[i] }}
              ref={(el) => el && (this.cells[i] = el)}
              type={this.mask ? 'password' : 'text'}
              inputMode={this.type === 'numeric' ? 'numeric' : 'text'}
              autocomplete={i === 0 ? 'one-time-code' : 'off'}
              autocapitalize="off"
              spellcheck={false}
              aria-label={`Character ${i + 1} of ${this.length}`}
              aria-invalid={this.error ? 'true' : undefined}
              disabled={this.disabled}
              value={this.value[i] ?? ''}
              onInput={(e) => this.onInput(e, i)}
              onKeyDown={(e) => this.onKeyDown(e, i)}
              onPaste={(e) => this.onPaste(e, i)}
              onFocus={(e) => (e.target as HTMLInputElement).select()}
            />
          ))}
        </div>
        {message && (
          <p class={{ msg: true, error: !!this.error }} id={msgId} role={this.error ? 'alert' : undefined}>
            {message}
          </p>
        )}
      </Host>
    );
  }
}
