import { Component, input, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/** Read-only source with copy and wrap controls. */
@Component({
  selector: 'app-code-block',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="pg-code">
      <div class="pg-code__bar">
        <span class="pg-code__title">{{ title() }}</span>
        <span class="pg-code__actions">
          <button type="button" class="kvui-btn kvui-btn-ghost kvui-btn-sm" [attr.aria-pressed]="wrap()" (click)="wrap.set(!wrap())">
            {{ wrap() ? 'No wrap' : 'Wrap lines' }}
          </button>
          <button type="button" class="kvui-btn kvui-btn-sm" (click)="copy()">{{ copied() ? 'Copied' : 'Copy code' }}</button>
        </span>
      </div>
      <pre class="pg-code__pre" [class.pg-code__pre--wrap]="wrap()" tabindex="0" [attr.aria-label]="'Source of ' + title()"><code>{{ code() }}</code></pre>
    </div>
  `,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly title = input.required<string>();
  readonly wrap = signal(false);
  readonly copied = signal(false);

  async copy(): Promise<void> {
    const text = this.code();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
}
