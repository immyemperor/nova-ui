import { AttachInternals, Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';

let uid = 0;

/**
 * Free-form tags: type and press Enter or comma, or paste a list. Backspace removes the last tag.
 * Pass `validate` to reject entries (emails, ids...); rejected text stays in the box and uiReject fires.
 */
@Component({
  tag: 'ui-tag-input',
  styleUrls: ['../../global/field.css', 'ui-tag-input.css'],
  shadow: true,
  formAssociated: true,
})
export class UiTagInput {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  private uid = `ui-tag-input-${++uid}`;
  private inputEl?: HTMLInputElement;
  private initialValue: string[] = [];

  @Prop({ mutable: true }) value: string[] = [];
  @Prop() label?: string;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop() placeholder?: string;
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;
  /** Maximum number of tags. */
  @Prop() max?: number;
  @Prop() allowDuplicates = false;
  /** Return false (or an error string) to reject a tag. */
  @Prop() validate?: (tag: string) => boolean | string;
  /** Characters that end a tag, besides Enter. */
  @Prop() separators = [','];
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @State() draft = '';
  @State() rejected?: string;

  @Event() uiChange!: EventEmitter<string[]>;
  /** Fires when a tag is refused, with the reason. */
  @Event() uiReject!: EventEmitter<{ tag: string; reason: string }>;

  @Method() async focusInput() {
    this.inputEl?.focus();
  }

  @Watch('value')
  @Watch('required')
  syncForm() {
    if (!this.internals) return;
    const fd = new FormData();
    if (this.name) this.value.forEach((v) => fd.append(this.name as string, v));
    this.internals.setFormValue(fd);
    if (this.required && this.value.length === 0) this.internals.setValidity({ valueMissing: true }, 'Add at least one entry.', this.inputEl);
    else this.internals.setValidity({});
  }

  componentWillLoad() {
    this.initialValue = [...this.value];
    this.syncForm();
  }

  formResetCallback() {
    this.value = [...this.initialValue];
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private reject(tag: string, reason: string) {
    this.rejected = reason;
    this.uiReject.emit({ tag, reason });
  }

  /** Try to add one tag. Returns true when it was accepted. */
  private add(raw: string): boolean {
    const tag = raw.trim();
    if (!tag) return true;
    if (this.max != null && this.value.length >= this.max) {
      this.reject(tag, `You can add up to ${this.max}.`);
      return false;
    }
    if (!this.allowDuplicates && this.value.some((v) => v.toLowerCase() === tag.toLowerCase())) {
      this.reject(tag, `"${tag}" is already added.`);
      return false;
    }
    if (this.validate) {
      const verdict = this.validate(tag);
      if (verdict !== true && verdict !== undefined) {
        this.reject(tag, typeof verdict === 'string' ? verdict : `"${tag}" isn't valid.`);
        return false;
      }
    }
    this.rejected = undefined;
    this.value = [...this.value, tag];
    this.uiChange.emit(this.value);
    return true;
  }

  private remove(index: number) {
    this.value = this.value.filter((_, i) => i !== index);
    this.uiChange.emit(this.value);
    this.inputEl?.focus();
  }

  private commitDraft() {
    if (this.add(this.draft)) this.draft = '';
  }

  private onInput = (e: Event) => {
    const text = (e.target as HTMLInputElement).value;
    this.rejected = undefined;
    const sep = this.separators.find((s) => s && text.includes(s));
    if (sep) {
      // Typing or pasting a separator ends one or more tags.
      const parts = text.split(sep);
      const tail = parts.pop() ?? '';
      let leftover = '';
      for (const part of parts) if (!this.add(part)) leftover += (leftover ? sep : '') + part;
      this.draft = leftover ? leftover + (tail ? sep + tail : '') : tail;
      if (leftover) (e.target as HTMLInputElement).value = this.draft;
    } else {
      this.draft = text;
    }
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (this.draft.trim()) {
        e.preventDefault(); // don't submit the form while building the list
        this.commitDraft();
      }
    } else if (e.key === 'Backspace' && !this.draft && this.value.length) {
      this.remove(this.value.length - 1);
    }
  };

  private onBlur = () => {
    if (this.draft.trim()) this.commitDraft();
  };

  render() {
    const message = this.rejected ?? this.error ?? this.hint;
    const isError = !!(this.rejected || this.error);
    const msgId = `${this.uid}-msg`;
    return (
      <Host>
        {this.label && (
          <label class="label" htmlFor={this.uid}>
            {this.label}
            {this.required && <span class="req" aria-hidden="true"> *</span>}
          </label>
        )}
        <div class="control" data-invalid={isError ? 'true' : 'false'} onClick={() => this.inputEl?.focus()}>
          <ul class="tags" aria-label={this.label ? `${this.label} entries` : 'Entries'}>
            {this.value.map((tag, i) => (
              <li class="chip" key={`${tag}-${i}`}>
                <span class="chip-text">{tag}</span>
                {!this.disabled && (
                  <button type="button" class="chip-x" tabindex={-1} aria-label={`Remove ${tag}`} onClick={(e) => (e.stopPropagation(), this.remove(i))}>
                    <ui-icon name="x" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <input
            id={this.uid}
            class="native"
            ref={(el) => (this.inputEl = el)}
            value={this.draft}
            placeholder={this.value.length ? '' : this.placeholder}
            disabled={this.disabled}
            autocomplete="off"
            aria-invalid={isError ? 'true' : undefined}
            aria-describedby={message ? msgId : undefined}
            onInput={this.onInput}
            onKeyDown={this.onKeyDown}
            onBlur={this.onBlur}
          />
        </div>
        {message && (
          <p class={{ msg: true, error: isError }} id={msgId} role={isError ? 'alert' : undefined}>
            {message}
          </p>
        )}
      </Host>
    );
  }
}
