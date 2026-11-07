import { AttachInternals, Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

let tagInputId = 0;

@Component({
  tag: 'ui-tag-input',
  styleUrls: ['../../global/field.css', 'ui-tag-input.css'],
  shadow: true,
  formAssociated: true,
})
export class UiTagInput {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  @Prop({ mutable: true }) value: string[] = [];
  @Prop() options: string[] = [];
  @Prop() label = 'Tags';
  @Prop() placeholder = 'Add a tag';
  @Prop() name?: string;
  @Prop() maxTags = 0;
  @Prop() allowDuplicates = false;
  @Prop() required = false;
  @Prop({ mutable: true, reflect: true }) disabled = false;

  @State() query = '';
  @State() active = -1;

  @Event() uiInput!: EventEmitter<string>;
  @Event() uiChange!: EventEmitter<string[]>;

  private readonly uid = `ui-tag-input-${++tagInputId}`;
  private input?: HTMLInputElement;
  private initialValue: string[] = [];

  @Watch('value')
  @Watch('required')
  syncForm() {
    if (!this.internals) return;
    const data = new FormData();
    if (this.name) this.value.forEach((tag) => data.append(this.name as string, tag));
    this.internals.setFormValue(data);
    if (this.required && this.value.length === 0) this.internals.setValidity({ valueMissing: true }, 'Add at least one tag.', this.input);
    else this.internals.setValidity({});
  }

  componentWillLoad() {
    this.initialValue = [...this.value];
    this.syncForm();
  }

  formResetCallback() {
    this.value = [...this.initialValue];
    this.syncForm();
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private suggestions(): string[] {
    const query = this.query.trim().toLocaleLowerCase();
    return this.options.filter((option) => (!query || option.toLocaleLowerCase().includes(query)) && (this.allowDuplicates || !this.value.includes(option))).slice(0, 8);
  }

  private add(raw: string) {
    const tag = raw.trim();
    if (!tag || (this.maxTags > 0 && this.value.length >= this.maxTags) || (!this.allowDuplicates && this.value.includes(tag))) return;
    const next = [...this.value, tag];
    this.value = next;
    this.query = '';
    this.active = -1;
    this.syncForm();
    this.uiChange.emit(next);
  }

  private remove(tag: string) {
    const next = this.value.filter((item) => item !== tag);
    this.value = next;
    this.syncForm();
    this.uiChange.emit(next);
    this.input?.focus();
  }

  private onInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    const delimiter = value.indexOf(',');
    if (delimiter >= 0) {
      value.slice(0, delimiter).split(',').forEach((tag) => this.add(tag));
      this.query = value.slice(delimiter + 1).trimStart();
      this.uiInput.emit(this.query);
      return;
    }
    this.query = value;
    this.active = -1;
    this.uiInput.emit(value);
  };

  private onKeyDown = (event: KeyboardEvent) => {
    const options = this.suggestions();
    if (event.key === 'ArrowDown' && options.length) {
      event.preventDefault();
      this.active = (this.active + 1) % options.length;
    } else if (event.key === 'ArrowUp' && options.length) {
      event.preventDefault();
      this.active = (this.active - 1 + options.length) % options.length;
    } else if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.add(options[this.active] ?? this.query);
    } else if (event.key === 'Backspace' && !this.query && this.value.length) this.remove(this.value[this.value.length - 1]);
    else if (event.key === 'Escape') this.active = -1;
  };

  render() {
    const options = this.suggestions();
    const listId = `${this.uid}-list`;
    return (
      <Host>
        <label class="label" htmlFor={`${this.uid}-input`}>{this.label}{this.required && <span class="req" aria-hidden="true"> *</span>}</label>
        <div class="control" data-disabled={String(this.disabled)}>
          {this.value.map((tag, index) => <span class="chip" key={`${tag}-${index}`}>
            {tag}
            <button type="button" class="remove" aria-label={`Remove ${tag}`} disabled={this.disabled} onClick={() => this.remove(tag)}>×</button>
          </span>)}
          <input id={`${this.uid}-input`} class="native" ref={(el) => (this.input = el)} role="combobox" aria-label={this.label} aria-expanded={String(options.length > 0 && !!this.query)} aria-controls={listId} aria-activedescendant={this.active >= 0 ? `${this.uid}-option-${this.active}` : undefined} aria-autocomplete="list" value={this.query} placeholder={this.value.length ? '' : this.placeholder} disabled={this.disabled || (this.maxTags > 0 && this.value.length >= this.maxTags)} onInput={this.onInput} onKeyDown={this.onKeyDown} />
        </div>
        {this.query && options.length > 0 && <ul id={listId} class="suggestions" role="listbox" aria-label="Suggestions">
          {options.map((option, index) => <li id={`${this.uid}-option-${index}`} role="option" aria-selected={String(index === this.active)} class={{ option: true, active: index === this.active }} key={option} onMouseDown={(event) => event.preventDefault()} onClick={() => this.add(option)}>{option}</li>)}
        </ul>}
      </Host>
    );
  }
}