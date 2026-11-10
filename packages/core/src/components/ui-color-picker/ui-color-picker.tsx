import { AttachInternals, Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { HSV, hexToHsv, hsvToHex, normaliseHex, readableOn } from '../../utils/color';

let uid = 0;

const DEFAULT_SWATCHES = ['#0b7a6c', '#1a7f4b', '#2563b8', '#7c3aed', '#c0362c', '#a35f00', '#14201c', '#6d7b75'];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/**
 * Colour picker: saturation/brightness area, hue slider, hex field, swatches and (where the browser
 * supports it) an eyedropper. Value is a hex string like "#0b7a6c". Use `inline` to skip the popup.
 */
@Component({
  tag: 'ui-color-picker',
  styleUrl: 'ui-color-picker.css',
  shadow: true,
  formAssociated: true,
})
export class UiColorPicker {
  @AttachInternals() internals!: ElementInternals;

  private uid = `ui-color-${++uid}`;
  private area?: HTMLElement;
  private hexInput?: HTMLElement & { value: string };
  private dragging = false;
  private initialValue = '#0b7a6c';

  /** Hex colour, "#rrggbb". */
  @Prop({ mutable: true }) value = '#0b7a6c';
  @Prop() label?: string;
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  /** Show the panel directly instead of behind a button. */
  @Prop({ reflect: true }) inline = false;
  @Prop() swatches: string[] = DEFAULT_SWATCHES;

  @State() hsv: HSV = { h: 0, s: 0, v: 0 };
  @State() open = false;

  /** Fires continuously while dragging or typing. */
  @Event() uiInput!: EventEmitter<string>;
  /** Fires when a colour is committed: release, key press, hex entry or swatch click. */
  @Event() uiChange!: EventEmitter<string>;

  @Watch('value')
  onValue(next: string) {
    this.internals?.setFormValue(next);
    // Only re-derive HSV for outside changes; our own edits already match. This keeps hue stable at grey/black.
    if (hsvToHex(this.hsv) !== next) this.hsv = hexToHsv(next) ?? this.hsv;
  }

  componentWillLoad() {
    this.value = normaliseHex(this.value) ?? '#000000';
    this.initialValue = this.value;
    this.hsv = hexToHsv(this.value) ?? { h: 0, s: 0, v: 0 };
    this.internals?.setFormValue(this.value);
  }

  formResetCallback() {
    this.value = this.initialValue;
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private setHsv(next: HSV, commit: boolean) {
    this.hsv = next;
    const hex = hsvToHex(next);
    if (hex !== this.value) {
      this.value = hex;
      this.uiInput.emit(hex);
    }
    if (commit) this.uiChange.emit(this.value);
  }

  private setHex(input: string, commit = true): boolean {
    const hex = normaliseHex(input);
    if (!hex) return false;
    this.hsv = hexToHsv(hex) ?? this.hsv;
    if (hex !== this.value) {
      this.value = hex;
      this.uiInput.emit(hex);
    }
    if (commit) this.uiChange.emit(this.value);
    return true;
  }

  private fromPointer(e: PointerEvent) {
    const r = this.area?.getBoundingClientRect();
    if (!r || !r.width || !r.height) return;
    const s = clamp((e.clientX - r.left) / r.width, 0, 1) * 100;
    const v = (1 - clamp((e.clientY - r.top) / r.height, 0, 1)) * 100;
    this.setHsv({ h: this.hsv.h, s, v }, false);
  }

  private onAreaDown = (e: PointerEvent) => {
    if (this.disabled) return;
    this.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    (e.currentTarget as HTMLElement).focus();
    this.fromPointer(e);
  };
  private onAreaMove = (e: PointerEvent) => {
    if (this.dragging) this.fromPointer(e);
  };
  private onAreaUp = () => {
    if (!this.dragging) return;
    this.dragging = false;
    this.uiChange.emit(this.value);
  };

  private onAreaKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    const { h: hue, s, v } = this.hsv;
    let next: HSV | undefined;
    if (e.key === 'ArrowLeft') next = { h: hue, s: clamp(s - step, 0, 100), v };
    else if (e.key === 'ArrowRight') next = { h: hue, s: clamp(s + step, 0, 100), v };
    else if (e.key === 'ArrowUp') next = { h: hue, s, v: clamp(v + step, 0, 100) };
    else if (e.key === 'ArrowDown') next = { h: hue, s, v: clamp(v - step, 0, 100) };
    if (!next) return;
    e.preventDefault();
    this.setHsv(next, true);
  };

  private async eyedrop() {
    const Dropper = (window as any).EyeDropper;
    if (!Dropper) return;
    try {
      const result = await new Dropper().open();
      this.setHex(result.sRGBHex);
    } catch {
      /* cancelled */
    }
  }

  private renderPanel() {
    const { h: hue, s, v } = this.hsv;
    const hasEyedropper = typeof window !== 'undefined' && 'EyeDropper' in window;
    return (
      <div class="panel" role={this.inline ? 'group' : undefined} aria-label={this.inline ? this.label ?? 'Colour picker' : undefined}>
        <div
          class="area"
          ref={(el) => (this.area = el)}
          style={{ '--_hue': `hsl(${hue} 100% 50%)` }}
          role="slider"
          tabindex={this.disabled ? -1 : 0}
          aria-label="Saturation and brightness"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(s)}
          aria-valuetext={`Saturation ${Math.round(s)}%, brightness ${Math.round(v)}%`}
          aria-disabled={this.disabled ? 'true' : undefined}
          onPointerDown={this.onAreaDown}
          onPointerMove={this.onAreaMove}
          onPointerUp={this.onAreaUp}
          onPointerCancel={this.onAreaUp}
          onKeyDown={this.onAreaKey}
        >
          <span class="thumb" style={{ left: `${s}%`, top: `${100 - v}%`, background: this.value }} />
        </div>

        <input
          class="hue"
          type="range"
          min="0"
          max="360"
          step="1"
          value={Math.round(hue)}
          aria-label="Hue"
          disabled={this.disabled}
          onInput={(e) => this.setHsv({ ...this.hsv, h: Number((e.target as HTMLInputElement).value) }, false)}
          onChange={() => this.uiChange.emit(this.value)}
        />

        <div class="row">
          <span class="preview" style={{ background: this.value }} aria-hidden="true" />
          <ui-input
            class="hex"
            ref={(el) => (this.hexInput = el as any)}
            label="Hex colour"
            hideLabel
            size="sm"
            maxlength={7}
            value={this.value}
            disabled={this.disabled}
            onUiChange={(e) => {
              e.stopPropagation();
              if (!this.setHex(e.detail) && this.hexInput) this.hexInput.value = this.value; // revert bad input
            }}
          />
          {hasEyedropper && (
            <ui-button variant="ghost" size="sm" icon-only label="Pick colour from screen" disabled={this.disabled} onClick={() => this.eyedrop()}>
              <ui-icon name="search" />
            </ui-button>
          )}
        </div>

        {this.swatches.length > 0 && (
          <div class="swatches" role="group" aria-label="Preset colours">
            {this.swatches.map((c) => {
              const hex = normaliseHex(c) ?? c;
              const on = hex === this.value;
              return (
                <button
                  key={hex}
                  type="button"
                  class={{ swatch: true, on }}
                  style={{ background: hex, color: readableOn(hex) }}
                  aria-label={hex}
                  aria-pressed={on ? 'true' : 'false'}
                  disabled={this.disabled}
                  onClick={() => this.setHex(hex)}
                >
                  {on && <ui-icon name="check" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  render() {
    if (this.inline) {
      return (
        <Host>
          {this.label && <span class="label">{this.label}</span>}
          {this.renderPanel()}
        </Host>
      );
    }
    const labelId = `${this.uid}-label`;
    return (
      <Host>
        {this.label && (
          <span class="label" id={labelId}>
            {this.label}
          </span>
        )}
        <ui-popover open={this.open} trigger="click" placement="bottom-start" panelRole="dialog" label={this.label ?? 'Colour picker'} onUiOpenChange={(e) => (this.open = e.detail)}>
          <button slot="trigger" type="button" class="trigger" disabled={this.disabled} aria-labelledby={this.label ? labelId : undefined}>
            <span class="chip" style={{ background: this.value }} aria-hidden="true" />
            <span class="hex-text">{this.value}</span>
          </button>
          {this.renderPanel()}
        </ui-popover>
      </Host>
    );
  }
}
