import { AttachInternals, Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { displayTime, inTimeRange, timeSlots } from '../../utils/time';

let uid = 0;

/**
 * Time of day as "HH:mm". Type it (with or without a colon), or pick a slot from the list.
 * Accepts 24-hour input; `step` sets the slot spacing in minutes for the list.
 */
@Component({
  tag: 'ui-time-picker',
  styleUrls: ['../../global/field.css', 'ui-time-picker.css'],
  shadow: true,
  formAssociated: true,
})
export class UiTimePicker {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  private uid = `ui-time-${++uid}`;
  private initial = '';
  private inputEl?: HTMLInputElement;

  @Prop({ mutable: true }) value = '';
  @Prop() min?: string;
  @Prop() max?: string;
  /** Minutes between suggested slots. */
  @Prop() step = 30;
  @Prop() label?: string;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;
  @Prop() locale?: string;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @State() open = false;
  @State() text = '';
  @State() invalid?: string;

  @Event() uiChange!: EventEmitter<string>;

  @Watch('value')
  @Watch('required')
  syncForm() {
    this.internals?.setFormValue(this.value || null);
    if (this.required && !this.value) this.internals?.setValidity({ valueMissing: true }, 'Enter a time.', this.inputEl);
    else this.internals?.setValidity({});
  }

  componentWillLoad() { this.initial = this.value; this.syncForm(); }
  formResetCallback() { this.value = this.initial; }
  formDisabledCallback(d: boolean) { this.disabled = d; }

  @Method() async focusInput() { this.inputEl?.focus(); }

  /** Accepts "930", "9:30", "09:30", "9.30"; returns "HH:mm" or undefined. */
  private normalise(raw: string): string | undefined {
    const s = raw.trim().replace('.', ':');
    let m = /^(\d{1,2}):(\d{2})$/.exec(s) ?? /^(\d{1,2})(\d{2})$/.exec(s);
    if (!m) return undefined;
    const h = Number(m[1]), mins = Number(m[2]);
    if (h > 23 || mins > 59) return undefined;
    return `${String(h).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  private commit(raw: string) {
    if (!raw.trim()) { this.invalid = undefined; this.set(''); return; }
    const t = this.normalise(raw);
    if (!t) { this.invalid = 'Enter a time such as 14:30.'; return; }
    if (!inTimeRange(t, this.min, this.max)) { this.invalid = `Choose a time between ${this.min ?? '00:00'} and ${this.max ?? '23:59'}.`; return; }
    this.invalid = undefined;
    this.set(t);
  }

  private set(v: string) {
    if (v === this.value) { this.text = v ? displayTime(v, this.locale) : ''; return; }
    this.value = v;
    this.text = v ? displayTime(v, this.locale) : '';
    this.uiChange.emit(v);
  }

  render() {
    const slots = timeSlots(this.min ?? '00:00', this.max ?? '23:59', this.step).filter((s) => inTimeRange(s, this.min, this.max));
    const shown = this.open || document.activeElement === this.inputEl ? this.text || this.value : this.value ? displayTime(this.value, this.locale) : '';
    const message = this.invalid ?? this.error ?? this.hint;
    const isErr = !!(this.invalid || this.error);
    const msgId = `${this.uid}-msg`;
    return (
      <Host>
        {this.label && <label class="label" htmlFor={this.uid}>{this.label}{this.required && <span class="req" aria-hidden="true"> *</span>}</label>}
        <ui-popover open={this.open} trigger="manual" placement="bottom-start" matchWidth panelRole="listbox" label={this.label ?? 'Times'}
          onUiOpenChange={(e: CustomEvent<boolean>) => (this.open = e.detail)}>
          <div slot="trigger" class="control" data-invalid={isErr ? 'true' : 'false'}>
            <input id={this.uid} class="native" ref={(el) => (this.inputEl = el)} value={shown}
              placeholder="HH:mm" disabled={this.disabled} autocomplete="off" inputMode="numeric"
              aria-invalid={isErr ? 'true' : undefined} aria-describedby={message ? msgId : undefined}
              onFocus={() => { this.text = this.value; this.open = true; }}
              onInput={(e) => { this.text = (e.target as HTMLInputElement).value; this.invalid = undefined; }}
              onBlur={() => { this.commit(this.text); this.open = false; }}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter') { e.preventDefault(); this.commit(this.text); this.open = false; }
                if (e.key === 'Escape') this.open = false;
                if (e.key === 'ArrowDown') { e.preventDefault(); this.open = true; }
              }} />
            <ui-icon name="chevron-down" />
          </div>
          <ul class="list" role="presentation">
            {slots.map((s) => (
              <li key={s}>
                <button type="button" class={{ slot: true, on: s === this.value }} role="option" aria-selected={s === this.value ? 'true' : 'false'}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { this.invalid = undefined; this.set(s); this.open = false; this.inputEl?.focus(); }}>
                  {displayTime(s, this.locale)}
                </button>
              </li>
            ))}
          </ul>
        </ui-popover>
        {message && <p class={{ msg: true, error: isErr }} id={msgId} role={isErr ? 'alert' : undefined}>{message}</p>}
        {this.name && <input type="hidden" name={this.name} value={this.value} />}
      </Host>
    );
  }
}
