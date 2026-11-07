import { AttachInternals, Component, Element, Event, EventEmitter, Host, Listen, Prop, Watch, h } from '@stencil/core';

interface RadioEl extends HTMLElement {
  value: string;
  checked: boolean;
  disabled: boolean;
}

let uid = 0;

@Component({
  tag: 'ui-radio-group',
  styleUrl: 'ui-radio-group.css',
  shadow: true,
  formAssociated: true,
})
export class UiRadioGroup {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  private labelId = `ui-radio-group-${++uid}`;
  private initialValue?: string;

  @Prop({ mutable: true }) value?: string;
  @Prop() label?: string;
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;
  @Prop({ reflect: true }) orientation: 'vertical' | 'horizontal' = 'vertical';

  @Event() uiChange!: EventEmitter<string>;

  private radios(): RadioEl[] {
    return Array.from(this.host.querySelectorAll('ui-radio')) as RadioEl[];
  }

  @Watch('value')
  @Watch('disabled')
  sync() {
    const radios = this.radios();
    const enabled = radios.filter((r) => !r.disabled && !this.disabled);
    const active = enabled.find((r) => r.value === this.value) ?? enabled[0];
    radios.forEach((r) => {
      r.checked = r.value === this.value;
      r.setAttribute('tabindex', r === active && !this.disabled ? '0' : '-1');
    });
    this.internals?.setFormValue(this.value ?? null);
    if (this.required && this.value == null) this.internals?.setValidity({ valueMissing: true }, 'Select an option.');
    else this.internals?.setValidity({});
  }

  componentWillLoad() {
    this.initialValue = this.value;
  }
  componentDidLoad() {
    this.sync();
  }
  formResetCallback() {
    this.value = this.initialValue;
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private select(radio: RadioEl) {
    if (this.disabled || radio.disabled || radio.value === this.value) return;
    this.value = radio.value;
    this.uiChange.emit(radio.value);
  }

  @Listen('click')
  onClick(ev: MouseEvent) {
    const radio = (ev.target as HTMLElement).closest('ui-radio') as RadioEl | null;
    if (radio) this.select(radio);
  }

  @Listen('keydown')
  onKeyDown(ev: KeyboardEvent) {
    const radio = (ev.target as HTMLElement).closest('ui-radio') as RadioEl | null;
    if (!radio) return;
    if (ev.key === ' ') {
      ev.preventDefault();
      this.select(radio);
      return;
    }
    const forward = ['ArrowDown', 'ArrowRight'].includes(ev.key);
    const back = ['ArrowUp', 'ArrowLeft'].includes(ev.key);
    if (!forward && !back) return;
    ev.preventDefault();
    const enabled = this.radios().filter((r) => !r.disabled);
    if (!enabled.length) return;
    const i = enabled.indexOf(radio);
    const next = enabled[(i + (forward ? 1 : -1) + enabled.length) % enabled.length];
    next.focus();
    this.select(next);
  }

  render() {
    return (
      <Host>
        {this.label && (
          <span class="label" id={this.labelId}>
            {this.label}
            {this.required && <span class="req" aria-hidden="true"> *</span>}
          </span>
        )}
        <div class="group" role="radiogroup" aria-labelledby={this.label ? this.labelId : undefined} aria-required={this.required ? 'true' : undefined}>
          <slot onSlotchange={() => this.sync()} />
        </div>
      </Host>
    );
  }
}
