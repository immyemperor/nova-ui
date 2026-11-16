import { AttachInternals, Component, Element, Event, EventEmitter, Host, Method, Prop, State, h } from '@stencil/core';
import { FileProblem, FileRules, formatBytes, validateFiles } from '../../utils/files';
import { t } from '../../i18n';

let uid = 0;

export interface UploadItem { id: number; file: File; status: 'queued' | 'uploading' | 'done' | 'error'; progress: number; url?: string; error?: string }

/**
 * Dropzone + file list. Files are validated (type, size, count, total) and reported with every problem at once.
 * Pass `uploadFn` to upload each file as it is added; without it, you receive files through uiFiles and handle them yourself.
 */
@Component({
  tag: 'ui-file-upload',
  styleUrl: 'ui-file-upload.css',
  shadow: true,
  formAssociated: true,
})
export class UiFileUpload {
  @Element() host!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  private uid = `ui-upload-${++uid}`;
  private input?: HTMLInputElement;
  private seq = 0;

  @Prop() accept = '';
  @Prop() maxSize?: number;
  @Prop() maxFiles?: number;
  @Prop() maxTotalSize?: number;
  @Prop() multiple = true;
  @Prop() label = 'Upload files';
  @Prop() hint?: string;
  @Prop() name?: string;
  @Prop({ reflect: true }) disabled = false;
  /** Upload a single file. Resolve with its URL. Progress: call the second argument with 0..1. */
  @Prop() uploadFn?: (file: File, onProgress: (p: number) => void) => Promise<string>;

  @State() items: UploadItem[] = [];
  @State() dragging = false;
  @State() problems: FileProblem[] = [];

  /** Every file the user picks or drops (after validation). */
  @Event() uiFiles!: EventEmitter<File[]>;
  /** Fires when a file finishes uploading. */
  @Event() uiUploaded!: EventEmitter<{ file: File; url: string }>;
  /** Fires with every rejected file and why. */
  @Event() uiRejected!: EventEmitter<FileProblem[]>;
  @Event() uiRemove!: EventEmitter<File>;

  @Method() async clear() { this.items = []; this.problems = []; this.sync(); }

  private rules(): FileRules {
    return { accept: this.accept, maxSize: this.maxSize, maxFiles: this.maxFiles, maxTotalSize: this.maxTotalSize };
  }

  private sync() {
    const names = this.items.filter((i) => i.status === 'done').map((i) => i.url ?? i.file.name);
    this.internals?.setFormValue(names.join(', ') || null);
  }

  private async add(list: FileList | File[] | null) {
    if (this.disabled || !list) return;
    const incoming = Array.from(list).slice(0, this.multiple ? undefined : 1);
    const current = this.items.length;
    const bytes = this.items.reduce((s, i) => s + i.file.size, 0);
    const { ok, problems } = validateFiles(incoming, this.rules(), current, bytes);
    this.problems = problems;
    if (problems.length) this.uiRejected.emit(problems);
    if (!ok.length) return;
    const fresh: UploadItem[] = ok.map((file) => ({ id: ++this.seq, file, status: this.uploadFn ? 'queued' : 'done', progress: this.uploadFn ? 0 : 1 }));
    this.items = [...this.items, ...fresh];
    this.uiFiles.emit(ok);
    if (this.uploadFn) fresh.forEach((i) => this.upload(i));
    this.sync();
  }

  private async upload(item: UploadItem) {
    this.update(item.id, { status: 'uploading' });
    try {
      const url = await this.uploadFn!(item.file, (p) => this.update(item.id, { progress: p }));
      this.update(item.id, { status: 'done', progress: 1, url });
      this.uiUploaded.emit({ file: item.file, url });
    } catch (err) {
      this.update(item.id, { status: 'error', error: err instanceof Error ? err.message : 'Upload failed.' });
    }
    this.sync();
  }

  private update(id: number, patch: Partial<UploadItem>) {
    this.items = this.items.map((i) => (i.id === id ? { ...i, ...patch } : i));
  }

  private remove(id: number) {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;
    this.items = this.items.filter((i) => i.id !== id);
    this.uiRemove.emit(item.file);
    this.sync();
  }

  render() {
    const hintText = this.hint ?? (this.accept ? `Allowed: ${this.accept}` : '') + (this.maxSize ? `${this.accept ? ' \u00b7 ' : ''}up to ${formatBytes(this.maxSize)} each` : '');
    return (
      <Host>
        <span class="label" id={`${this.uid}-label`}>{this.label}</span>
        <div
          class={{ drop: true, active: this.dragging, disabled: this.disabled }}
          role="group"
          aria-labelledby={`${this.uid}-label`}
          onDragOver={(e) => { e.preventDefault(); if (!this.disabled) this.dragging = true; }}
          onDragLeave={() => (this.dragging = false)}
          onDrop={(e) => { e.preventDefault(); this.dragging = false; this.add(e.dataTransfer?.files ?? null); }}
        >
          <ui-icon name="upload" size="1.5em" />
          <span>Drag files here, or</span>
          <ui-button size="sm" variant="secondary" disabled={this.disabled} onClick={() => this.input?.click()}>{t('chooseFile')}</ui-button>
          {hintText && <span class="hint">{hintText}</span>}
          <input class="native" type="file" hidden ref={(el) => (this.input = el)} accept={this.accept || undefined} multiple={this.multiple}
            disabled={this.disabled} onChange={(e) => { this.add((e.target as HTMLInputElement).files); (e.target as HTMLInputElement).value = ''; }} />
        </div>

        {this.problems.length > 0 && (
          <ul class="problems" role="alert">
            {this.problems.map((p, i) => <li key={i}>{p.message}</li>)}
          </ul>
        )}

        {this.items.length > 0 && (
          <ul class="list" aria-label="Files">
            {this.items.map((i) => (
              <li key={i.id} class={{ item: true, error: i.status === 'error' }}>
                <ui-icon name="paperclip" />
                <div class="meta">
                  <span class="name">{i.file.name}</span>
                  <span class="size">{formatBytes(i.file.size)}{i.status === 'error' ? ` \u00b7 ${i.error}` : ''}</span>
                  {i.status === 'uploading' && <ui-progress value={Math.round(i.progress * 100)} label={t('uploading', { name: i.file.name })} />}
                </div>
                {i.status === 'done' && <ui-icon name="check-circle" class="ok" label="Uploaded" />}
                <ui-button size="sm" variant="ghost" icon-only label={t('remove', { item: i.file.name })} onClick={() => this.remove(i.id)}>
                  <ui-icon name="x" />
                </ui-button>
              </li>
            ))}
          </ul>
        )}
        {this.name && this.items.filter((i) => i.status === 'done' && i.url).map((i) => <input key={i.id} type="hidden" name={this.name} value={i.url} />)}
      </Host>
    );
  }
}
