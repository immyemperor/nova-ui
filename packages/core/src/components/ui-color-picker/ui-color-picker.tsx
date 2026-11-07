import { AttachInternals, Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

@Component({
  tag: 'ui-color-picker',
  styleUrls: ['../../global/field.css', 'ui-color-picker.css'],
  shadow: true,
  formAssociated: true,
})
export class UiColorPicker {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  @Prop({ mutable: true }) value = '#0b7a6c';
  @Prop() label = 'Choose color';
  @Prop() name?: string;
  @Prop() required = false;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() showValue = true;

  @State() draft = this.value;

  @Event() uiInput!: EventEmitter<string>;
  @Event() uiChange!: EventEmitter<string>;

  @Watch('value')
  syncForm() {
    if (this.internals) this.internals.setFormValue(this.value || null);
  }

  componentWillLoad() {
    this.value = this.normalize(this.value) ?? '#0b7a6c';
    this.draft = this.value;
    this.syncForm();
  }

  formResetCallback() {
    this.value = '#0b7a6c';
    this.syncForm();
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private normalize(value: string): string | undefined {
    const normalized = value.trim().startsWith('#') ? value.trim() : `#${value.trim()}`;
    if (/^#[\da-f]{3}$/i.test(normalized)) return `#${normalized.slice(1).split('').map((part) => part + part).join('')}`.toLowerCase();
    if (/^#[\da-f]{6}$/i.test(normalized)) return normalized.toLowerCase();
    return undefined;
  }

  private update(value: string, commit: boolean) {
    const normalized = this.normalize(value);
    if (!normalized) return;
    this.value = normalized;
    this.draft = normalized;
    this.syncForm();
    this.uiInput.emit(normalized);
    if (commit) this.uiChange.emit(normalized);
  }

  private onTextInput = (event: Event) => {
    this.draft = (event.target as HTMLInputElement).value;
  };

  private commitText = () => {
    const normalized = this.normalize(this.draft);
    if (normalized) this.update(normalized, true);
    else this.draft = this.value;
  };

  render() {
    return (
      <Host>
        <label class="label">{this.label}{this.required && <span class="req" aria-hidden="true"> *</span>}</label>
        <div class="control">
          <input class="swatch" type="color" aria-label={`${this.label} swatch`} value={this.value} disabled={this.disabled} onInput={(event) => this.update((event.target as HTMLInputElement).value, false)} onChange={(event) => this.update((event.target as HTMLInputElement).value, true)} />
          {this.showValue && <input class="hex" type="text" aria-label={`${this.label} hex value`} value={this.draft} pattern="#?([\da-fA-F]{3}|[\da-fA-F]{6})" spellcheck={false} disabled={this.disabled} onInput={this.onTextInput} onChange={this.commitText} onBlur={this.commitText} />}
        </div>
      </Host>
    );
  }
}