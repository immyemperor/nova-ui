import { Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { Editor } from '@tiptap/core';
// Make sure every Kvui element used in the toolbar exists, even if the app never imported it.
import '@kvui/core/components/ui-alert.js';
import '@kvui/core/components/ui-button.js';
import '@kvui/core/components/ui-color-picker.js';
import '@kvui/core/components/ui-dropdown.js';
import '@kvui/core/components/ui-icon.js';
import '@kvui/core/components/ui-input.js';
import '@kvui/core/components/ui-menu-item.js';
import '@kvui/core/components/ui-popover.js';
import '@kvui/core/components/ui-spinner.js';
import '@kvui/core/components/ui-tab.js';
import '@kvui/core/components/ui-tab-panel.js';
import '@kvui/core/components/ui-tabs.js';
import '@kvui/core/components/ui-tooltip.js';
import { registerEditorIcons } from '../../icons';
import { EDITOR_PRESETS } from '../../presets';
import type { MentionItem, ToolbarItem, UploadHandler } from '../../types';
import { buildExtensions } from './extensions';
import type { SlashItem } from './suggestion';
import { acceptsFile, formatBytes, readAsDataURL, safeHref, safeImageSrc } from './uploads';

registerEditorIcons();

let uid = 0;
const MOD = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '\u2318' : 'Ctrl';

interface Btn {
  icon: string;
  label: string;
  keys?: string;
  active?: (e: Editor) => boolean;
  disabled?: (e: Editor) => boolean;
  run: (e: Editor) => void;
}

/** Toolbar buttons that are a single command. The popovers and menus are built in renderItem(). */
const BUTTONS: Record<string, Btn> = {
  undo: { icon: 'undo', label: 'Undo', keys: 'Z', disabled: (e) => !e.can().undo(), run: (e) => e.chain().focus().undo().run() },
  redo: { icon: 'redo', label: 'Redo', keys: 'Shift+Z', disabled: (e) => !e.can().redo(), run: (e) => e.chain().focus().redo().run() },
  bold: { icon: 'bold', label: 'Bold', keys: 'B', active: (e) => e.isActive('bold'), run: (e) => e.chain().focus().toggleBold().run() },
  italic: { icon: 'italic', label: 'Italic', keys: 'I', active: (e) => e.isActive('italic'), run: (e) => e.chain().focus().toggleItalic().run() },
  underline: { icon: 'underline', label: 'Underline', keys: 'U', active: (e) => e.isActive('underline'), run: (e) => e.chain().focus().toggleUnderline().run() },
  strike: { icon: 'strikethrough', label: 'Strikethrough', keys: 'Shift+S', active: (e) => e.isActive('strike'), run: (e) => e.chain().focus().toggleStrike().run() },
  code: { icon: 'code', label: 'Inline code', keys: 'E', active: (e) => e.isActive('code'), run: (e) => e.chain().focus().toggleCode().run() },
  alignLeft: { icon: 'align-left', label: 'Align left', active: (e) => e.isActive({ textAlign: 'left' }), run: (e) => e.chain().focus().setTextAlign('left').run() },
  alignCenter: { icon: 'align-center', label: 'Align centre', active: (e) => e.isActive({ textAlign: 'center' }), run: (e) => e.chain().focus().setTextAlign('center').run() },
  alignRight: { icon: 'align-right', label: 'Align right', active: (e) => e.isActive({ textAlign: 'right' }), run: (e) => e.chain().focus().setTextAlign('right').run() },
  bulletList: { icon: 'list', label: 'Bulleted list', keys: 'Shift+8', active: (e) => e.isActive('bulletList'), run: (e) => e.chain().focus().toggleBulletList().run() },
  orderedList: { icon: 'list-ordered', label: 'Numbered list', keys: 'Shift+7', active: (e) => e.isActive('orderedList'), run: (e) => e.chain().focus().toggleOrderedList().run() },
  taskList: { icon: 'task-list', label: 'Task list', keys: 'Shift+9', active: (e) => e.isActive('taskList'), run: (e) => e.chain().focus().toggleTaskList().run() },
  blockquote: { icon: 'quote', label: 'Quote', keys: 'Shift+B', active: (e) => e.isActive('blockquote'), run: (e) => e.chain().focus().toggleBlockquote().run() },
  codeBlock: { icon: 'code-block', label: 'Code block', keys: 'Alt+C', active: (e) => e.isActive('codeBlock'), run: (e) => e.chain().focus().toggleCodeBlock().run() },
  hr: { icon: 'hr', label: 'Divider', run: (e) => e.chain().focus().setHorizontalRule().run() },
};

const stop = (e: Event) => e.stopPropagation();

/**
 * Rich text editor built on Tiptap, with a configurable toolbar made of Kvui buttons and icons,
 * "/" commands, @mentions, tables, links, image and file uploads. Value is HTML.
 *
 * Renders in light DOM on purpose: ProseMirror (selection, IME, spellcheck, browser extensions)
 * behaves best outside a shadow root, and your page's typography can style the content.
 */
@Component({
  tag: 'ui-editor',
  styleUrl: 'ui-editor.css',
  shadow: false,
})
export class UiEditor {
  @Element() host!: HTMLElement;

  /** HTML content. Empty string when the editor is empty. */
  @Prop({ mutable: true }) value = '';
  @Prop() label?: string;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop() placeholder = 'Write something, or type / for commands';
  /** Submitted with a surrounding <form>. */
  @Prop() name?: string;
  @Prop({ reflect: true }) readonly = false;
  @Prop({ reflect: true }) disabled = false;
  @Prop() required = false;

  /** Ready-made toolbar: "minimal", "standard" or "full". */
  @Prop() preset: 'minimal' | 'standard' | 'full' = 'standard';
  /** Your own toolbar: item ids in order, with "|" for separators. Overrides `preset`. */
  @Prop() toolbar?: ToolbarItem[];
  /** The "/" quick-insert menu. */
  @Prop() slashCommands = true;
  /** Turns on @mentions. Return matches for what the user typed after "@". */
  @Prop() mentionProvider?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  /** Upload a file and resolve with its URL. Without it, images are embedded as data URLs. */
  @Prop() uploadHandler?: UploadHandler;
  /** Allowed image types (the `accept` attribute format). */
  @Prop() accept = 'image/*';
  /** Allowed attachment types. Empty allows any. */
  @Prop() attachmentAccept = '';
  /** Largest file, in bytes. */
  @Prop() maxFileSize = 10 * 1024 * 1024;
  /** Maximum characters. Shows a counter when set. */
  @Prop() maxLength?: number;
  @Prop() minHeight = '10rem';
  @Prop() maxHeight?: string;
  /** Put the cursor in the editor on load. */
  @Prop() focusOnLoad = false;

  @State() tick = 0;
  @State() focused = false;
  @State() uploads: Array<{ id: number; name: string }> = [];
  @State() notice?: string;
  @State() linkOpen = false;
  @State() linkUrl = '';
  @State() imageOpen = false;
  @State() imageUrl = '';
  @State() imageAlt = '';
  @State() colorOpen = false;
  @State() highlightOpen = false;
  @State() dropActive = false;

  /** Fires on every content change with the HTML. */
  @Event() uiChange!: EventEmitter<string>;
  @Event() uiFocus!: EventEmitter<void>;
  @Event() uiBlur!: EventEmitter<void>;
  @Event() uiReady!: EventEmitter<void>;
  @Event() uiUploadStart!: EventEmitter<{ file: File }>;
  @Event() uiUploadComplete!: EventEmitter<{ file: File; url: string }>;
  @Event() uiUploadError!: EventEmitter<{ file: File; message: string }>;

  private uid = `ui-editor-${++uid}`;
  private editor?: Editor;
  private contentEl?: HTMLElement;
  private popupsEl?: HTMLElement;
  private toolbarEl?: HTMLElement;
  private imageInput?: HTMLInputElement;
  private attachInput?: HTMLInputElement;
  private linkInput?: HTMLElement & { focusInput: () => Promise<void> };
  private lastValue = '';
  private initialValue = '';
  private uploadSeq = 0;
  private roving = 0;
  private loaded = false;
  private form: HTMLFormElement | null = null;
  private noticeTimer?: ReturnType<typeof setTimeout>;

  /* ----------------------------- public API ----------------------------- */

  // Named getContent* because Element.getHTML() already exists in browsers and must not be shadowed.
  @Method() async getContentHTML(): Promise<string> {
    return this.editor?.isEmpty ? '' : this.editor?.getHTML() ?? '';
  }
  @Method() async getContentJSON(): Promise<unknown> {
    return this.editor?.getJSON();
  }
  @Method() async getContentText(): Promise<string> {
    return this.editor?.getText() ?? '';
  }
  @Method() async setContent(html: string): Promise<void> {
    this.value = html;
  }
  @Method() async clear(): Promise<void> {
    this.editor?.commands.clearContent(true);
  }
  @Method() async insertContent(html: string): Promise<void> {
    this.editor?.chain().focus().insertContent(html).run();
  }
  @Method() async focusEditor(): Promise<void> {
    this.editor?.commands.focus('end');
  }
  /** The underlying Tiptap Editor, for anything this component doesn't expose. */
  @Method() async getEditor(): Promise<Editor | undefined> {
    return this.editor;
  }

  /* ------------------------------ lifecycle ------------------------------ */

  @Watch('value')
  onValue(next: string) {
    if (!this.editor || next === this.lastValue) return;
    this.lastValue = next;
    this.editor.commands.setContent(next || '', false);
  }

  @Watch('readonly')
  @Watch('disabled')
  onEditable() {
    this.editor?.setEditable(!this.readonly && !this.disabled);
  }

  // These are baked into the editor at creation, so changing them rebuilds it (content is kept).
  @Watch('maxLength')
  @Watch('slashCommands')
  @Watch('placeholder')
  rebuild() {
    if (this.editor) this.createEditor(this.editor.getHTML());
  }

  @Watch('mentionProvider')
  onMentionProvider(next: unknown, prev: unknown) {
    if (!!next !== !!prev) this.rebuild();
  }

  connectedCallback() {
    this.form = this.host.closest('form');
    this.form?.addEventListener('reset', this.onReset);
    if (this.loaded && !this.editor) this.createEditor(this.lastValue);
  }

  componentWillLoad() {
    this.lastValue = this.value;
    this.initialValue = this.value;
  }

  componentDidLoad() {
    this.loaded = true;
    this.createEditor(this.value);
  }

  componentDidRender() {
    // One tab stop for the whole toolbar; arrow keys move within it.
    const buttons = this.toolbarButtons();
    if (this.roving >= buttons.length) this.roving = 0;
    buttons.forEach((b, i) => b.setAttribute('tabindex', i === this.roving ? '0' : '-1'));
  }

  disconnectedCallback() {
    this.form?.removeEventListener('reset', this.onReset);
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    this.editor?.destroy();
    this.editor = undefined;
  }

  private onReset = () => {
    this.value = this.initialValue;
  };

  private items(): ToolbarItem[] {
    return this.toolbar ?? EDITOR_PRESETS[this.preset] ?? EDITOR_PRESETS.standard;
  }

  private createEditor(content: string) {
    if (!this.contentEl) return;
    this.editor?.destroy();
    this.contentEl.textContent = '';

    this.editor = new Editor({
      element: this.contentEl,
      content,
      editable: !this.readonly && !this.disabled,
      autofocus: this.focusOnLoad ? 'end' : false,
      extensions: buildExtensions({
        placeholder: this.placeholder,
        maxLength: this.maxLength,
        slashItems: this.slashCommands && !this.readonly ? () => this.slashItems() : undefined,
        mention: this.mentionProvider ? (q) => this.mentionProvider!(q) : undefined,
        getHost: () => this.popupsEl,
        openLink: () => this.openLink(),
      }),
      editorProps: {
        attributes: {
          class: 'kvui-ed__prose',
          role: 'textbox',
          'aria-multiline': 'true',
          'aria-label': this.label ?? 'Rich text editor',
          ...(this.hint || this.error ? { 'aria-describedby': `${this.uid}-msg` } : {}),
        },
        handlePaste: (_view, event) => {
          const files = Array.from(event.clipboardData?.files ?? []);
          // Pasted rich text (e.g. from Word) wins over the preview image Word attaches.
          if (!files.length || event.clipboardData?.getData('text/html')) return false;
          return this.upload(files);
        },
        handleDrop: (view, event, _slice, moved) => {
          const files = Array.from(event.dataTransfer?.files ?? []);
          if (moved || !files.length) return false;
          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
          const handled = this.upload(files, pos);
          if (handled) event.preventDefault();
          return handled;
        },
      },
      onCreate: () => this.uiReady.emit(),
      onUpdate: ({ editor }) => {
        const html = editor.isEmpty ? '' : editor.getHTML();
        this.lastValue = html;
        this.value = html;
        this.uiChange.emit(html);
      },
      onTransaction: () => {
        this.tick++;
      },
      onFocus: () => {
        this.focused = true;
        this.uiFocus.emit();
      },
      onBlur: () => {
        this.focused = false;
        this.uiBlur.emit();
      },
    });
  }

  /* ------------------------------ slash menu ------------------------------ */

  private slashItems(): SlashItem[] {
    const has = (id: ToolbarItem) => this.items().includes(id);
    const out: SlashItem[] = [{ id: 'text', label: 'Text', description: 'Plain paragraph', icon: 'text', keywords: ['paragraph'], run: (e) => e.chain().focus().setParagraph().run() }];
    if (has('heading')) {
      [1, 2, 3].forEach((level) =>
        out.push({
          id: `h${level}`,
          label: `Heading ${level}`,
          description: level === 1 ? 'Large section heading' : level === 2 ? 'Medium heading' : 'Small heading',
          icon: 'heading',
          keywords: ['title', 'h' + level],
          run: (e) => e.chain().focus().setHeading({ level: level as 1 | 2 | 3 }).run(),
        }),
      );
    }
    if (has('bulletList')) out.push({ id: 'bullets', label: 'Bulleted list', icon: 'list', keywords: ['ul', 'unordered'], run: (e) => e.chain().focus().toggleBulletList().run() });
    if (has('orderedList')) out.push({ id: 'numbers', label: 'Numbered list', icon: 'list-ordered', keywords: ['ol', 'ordered'], run: (e) => e.chain().focus().toggleOrderedList().run() });
    if (has('taskList')) out.push({ id: 'tasks', label: 'Task list', description: 'Checkboxes', icon: 'task-list', keywords: ['todo', 'checklist'], run: (e) => e.chain().focus().toggleTaskList().run() });
    if (has('blockquote')) out.push({ id: 'quote', label: 'Quote', icon: 'quote', keywords: ['blockquote'], run: (e) => e.chain().focus().toggleBlockquote().run() });
    if (has('codeBlock')) out.push({ id: 'code', label: 'Code block', icon: 'code-block', keywords: ['pre', 'snippet'], run: (e) => e.chain().focus().toggleCodeBlock().run() });
    if (has('hr')) out.push({ id: 'divider', label: 'Divider', icon: 'hr', keywords: ['hr', 'rule', 'line'], run: (e) => e.chain().focus().setHorizontalRule().run() });
    if (has('table')) out.push({ id: 'table', label: 'Table', description: '3 x 3 with a header row', icon: 'table', run: (e) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() });
    if (has('image')) out.push({ id: 'image', label: 'Image', description: 'Upload from your device', icon: 'image', keywords: ['photo', 'picture', 'upload'], run: () => this.imageInput?.click() });
    if (has('attachment')) out.push({ id: 'file', label: 'File', description: 'Attach a file', icon: 'paperclip', keywords: ['attachment', 'upload'], run: () => this.attachInput?.click() });
    return out;
  }

  /* -------------------------------- links -------------------------------- */

  private openLink(): boolean {
    if (!this.items().includes('link') || this.readonly || this.disabled) return false;
    this.prepareLink();
    this.linkOpen = true;
    return true;
  }

  private prepareLink() {
    this.linkUrl = (this.editor?.getAttributes('link').href as string | undefined) ?? '';
  }

  private applyLink() {
    const e = this.editor;
    if (!e) return;
    const raw = this.linkUrl.trim();
    if (!raw) {
      e.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const href = safeHref(raw);
      if (!href) {
        this.notify('That link type isn\u2019t allowed. Use http, https, mailto or tel.');
        return;
      }
      if (e.state.selection.empty && !e.isActive('link')) {
        e.chain().focus().insertContent({ type: 'text', text: href, marks: [{ type: 'link', attrs: { href } }] }).run();
      } else {
        e.chain().focus().extendMarkRange('link').setLink({ href }).run();
      }
    }
    this.linkOpen = false;
  }

  private removeLink() {
    this.editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    this.linkOpen = false;
  }

  /* -------------------------------- uploads -------------------------------- */

  private notify(message: string) {
    this.notice = message;
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => (this.notice = undefined), 7000);
  }

  private canUpload(file: File): string | undefined {
    const items = this.items();
    const isImage = file.type.startsWith('image/');
    if (isImage ? !items.includes('image') : !items.includes('attachment')) return `${isImage ? 'Images' : 'Attachments'} can\u2019t be added here.`;
    if (!acceptsFile(file, isImage ? this.accept : this.attachmentAccept)) return `\u201c${file.name}\u201d isn\u2019t an allowed file type.`;
    if (file.size > this.maxFileSize) return `\u201c${file.name}\u201d is ${formatBytes(file.size)}. The limit is ${formatBytes(this.maxFileSize)}.`;
    if (!isImage && !this.uploadHandler) return 'Attachments need an upload handler. Set the uploadHandler property.';
    return undefined;
  }

  /** Returns true if this component took responsibility for the files (so paste/drop is consumed). */
  private upload(files: File[], pos?: number): boolean {
    const items = this.items();
    if (!items.includes('image') && !items.includes('attachment')) return false;
    files.forEach((file) => void this.uploadOne(file, pos));
    return true;
  }

  private async uploadOne(file: File, pos?: number) {
    const problem = this.canUpload(file);
    if (problem) {
      this.uiUploadError.emit({ file, message: problem });
      this.notify(problem);
      return;
    }
    const id = ++this.uploadSeq;
    this.uploads = [...this.uploads, { id, name: file.name }];
    this.uiUploadStart.emit({ file });
    try {
      const result = this.uploadHandler ? await this.uploadHandler(file) : await readAsDataURL(file);
      const url = typeof result === 'string' ? result : result.url;
      const alt = typeof result === 'string' ? file.name : result.alt ?? file.name;
      const isImage = file.type.startsWith('image/');
      const src = isImage ? safeImageSrc(url) : safeHref(url);
      if (!src) throw new Error('The upload returned an unsafe URL.');
      this.insertUploaded(file, src, alt, pos);
      this.uiUploadComplete.emit({ file, url: src });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed.';
      this.uiUploadError.emit({ file, message });
      this.notify(`Couldn\u2019t upload \u201c${file.name}\u201d. ${message}`);
    } finally {
      this.uploads = this.uploads.filter((u) => u.id !== id);
    }
  }

  private insertUploaded(file: File, url: string, alt: string, pos?: number) {
    const e = this.editor;
    if (!e) return;
    const content = file.type.startsWith('image/')
      ? { type: 'image', attrs: { src: url, alt } }
      : { type: 'text', text: file.name, marks: [{ type: 'link', attrs: { href: url } }] };
    try {
      const chain = e.chain().focus();
      (pos != null ? chain.insertContentAt(pos, content) : chain.insertContent(content)).run();
    } catch {
      // The position may be stale if the document changed during a slow upload.
      e.chain().focus().insertContent(content).run();
    }
  }

  private onFilesChosen = (ev: Event, closePanel = false) => {
    const input = ev.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = ''; // allow choosing the same file again
    if (files.length) this.upload(files);
    if (closePanel) this.imageOpen = false;
  };

  private insertImageFromUrl() {
    const src = safeImageSrc(this.imageUrl);
    if (!src) {
      this.notify('Enter a valid image address (https://...).');
      return;
    }
    this.editor?.chain().focus().setImage({ src, alt: this.imageAlt.trim() || undefined }).run();
    this.imageUrl = '';
    this.imageAlt = '';
    this.imageOpen = false;
  }

  /* -------------------------------- toolbar -------------------------------- */

  private toolbarButtons(): HTMLElement[] {
    return Array.from(this.toolbarEl?.querySelectorAll('ui-button.tb') ?? []) as HTMLElement[];
  }

  private onToolbarKey = (ev: KeyboardEvent) => {
    if (!(ev.target as HTMLElement).closest('ui-button.tb')) return; // ignore keys inside open panels
    const buttons = this.toolbarButtons();
    const current = buttons.findIndex((b) => b === (ev.target as HTMLElement).closest('ui-button.tb'));
    let next = -1;
    if (ev.key === 'ArrowRight') next = (current + 1) % buttons.length;
    else if (ev.key === 'ArrowLeft') next = (current - 1 + buttons.length) % buttons.length;
    else if (ev.key === 'Home') next = 0;
    else if (ev.key === 'End') next = buttons.length - 1;
    if (next < 0) return;
    ev.preventDefault();
    this.roving = next;
    buttons.forEach((b, i) => b.setAttribute('tabindex', i === next ? '0' : '-1'));
    buttons[next].focus();
  };

  private setBlock(value: string) {
    const chain = this.editor?.chain().focus();
    if (!chain) return;
    if (value === 'p') chain.setParagraph().run();
    else chain.setHeading({ level: Number(value) as 1 | 2 | 3 }).run();
  }

  private tableAction(action: string) {
    const c: any = this.editor?.chain().focus();
    if (c && typeof c[action] === 'function') c[action]().run();
  }

  private tip(key: string, label: string, child: any) {
    return (
      <ui-tooltip key={key} content={label} placement="bottom" delay={600}>
        {child}
      </ui-tooltip>
    );
  }

  private renderItem(id: ToolbarItem, e: Editor): any {
    const off = this.disabled;
    const simple = BUTTONS[id];
    if (simple) {
      const label = simple.keys ? `${simple.label} (${MOD}+${simple.keys})` : simple.label;
      const active = simple.active?.(e);
      return this.tip(
        id,
        label,
        <ui-button class="tb" variant="ghost" size="sm" icon-only label={label} pressed={active} disabled={off || simple.disabled?.(e)} onClick={() => simple.run(e)}>
          <ui-icon name={simple.icon} />
        </ui-button>,
      );
    }

    switch (id) {
      case 'heading': {
        const level = [1, 2, 3].find((l) => e.isActive('heading', { level: l }));
        return (
          <ui-dropdown key="heading" onUiSelect={(ev: CustomEvent<{ value: string }>) => this.setBlock(ev.detail.value)}>
            <ui-button slot="trigger" class="tb" variant="ghost" size="sm" label="Text style" disabled={off}>
              {level ? `Heading ${level}` : 'Text'}
              <ui-icon slot="end" name="chevron-down" />
            </ui-button>
            <ui-menu-item value="p">Text</ui-menu-item>
            <ui-menu-item value="1">Heading 1</ui-menu-item>
            <ui-menu-item value="2">Heading 2</ui-menu-item>
            <ui-menu-item value="3">Heading 3</ui-menu-item>
          </ui-dropdown>
        );
      }

      case 'textColor':
      case 'highlight': {
        const isText = id === 'textColor';
        const current = (isText ? e.getAttributes('textStyle').color : e.getAttributes('highlight').color) as string | undefined;
        const open = isText ? this.colorOpen : this.highlightOpen;
        const label = isText ? 'Text colour' : 'Highlight colour';
        return this.tip(
          id,
          label,
          <ui-popover open={open} placement="bottom-start" panelRole="dialog" label={label} onUiOpenChange={(ev: CustomEvent<boolean>) => (isText ? (this.colorOpen = ev.detail) : (this.highlightOpen = ev.detail))}>
            <ui-button slot="trigger" class="tb" variant="ghost" size="sm" icon-only label={label} pressed={!!current} disabled={off}>
              <ui-icon name={isText ? 'text-color' : 'highlighter'} style={current ? { color: current } : undefined} />
            </ui-button>
            <div class="kvui-ed__panel" {...({ onUiChange: stop, onUiInput: stop } as any)}>
              <ui-color-picker
                inline
                value={current ?? (isText ? '#14201c' : '#fde68a')}
                swatches={isText ? undefined : ['#fde68a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa', '#e9d5ff', '#e5e7eb', '#fecaca']}
                onUiChange={(ev: CustomEvent<string>) => {
                  ev.stopPropagation();
                  if (isText) e.chain().focus().setColor(ev.detail).run();
                  else e.chain().focus().setHighlight({ color: ev.detail }).run();
                }}
              />
              <ui-button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (isText) e.chain().focus().unsetColor().run();
                  else e.chain().focus().unsetHighlight().run();
                  if (isText) this.colorOpen = false;
                  else this.highlightOpen = false;
                }}
              >
                {isText ? 'Reset colour' : 'Remove highlight'}
              </ui-button>
            </div>
          </ui-popover>,
        );
      }

      case 'link':
        return this.tip(
          'link',
          `Link (${MOD}+K)`,
          <ui-popover
            open={this.linkOpen}
            placement="bottom-start"
            panelRole="dialog"
            label="Link"
            onUiOpenChange={(ev: CustomEvent<boolean>) => {
              this.linkOpen = ev.detail;
              if (ev.detail) this.prepareLink();
            }}
            onUiShow={() => requestAnimationFrame(() => this.linkInput?.focusInput())}
          >
            <ui-button slot="trigger" class="tb" variant="ghost" size="sm" icon-only label={`Link (${MOD}+K)`} pressed={e.isActive('link')} disabled={off}>
              <ui-icon name="link" />
            </ui-button>
            <div
              class="kvui-ed__panel"
              {...({ onUiChange: stop, onUiInput: stop } as any)}
              onKeyDown={(ev: KeyboardEvent) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault();
                  this.applyLink();
                }
              }}
            >
              <ui-input
                ref={(el: any) => (this.linkInput = el)}
                label="Link address"
                placeholder="https://example.com"
                value={this.linkUrl}
                onUiInput={(ev: CustomEvent<string>) => {
                  ev.stopPropagation();
                  this.linkUrl = ev.detail;
                }}
              />
              <div class="kvui-ed__actions">
                <ui-button size="sm" onClick={() => this.applyLink()}>
                  Apply
                </ui-button>
                {e.isActive('link') && (
                  <ui-button size="sm" variant="ghost" onClick={() => this.removeLink()}>
                    Remove link
                  </ui-button>
                )}
              </div>
            </div>
          </ui-popover>,
        );

      case 'image':
        return this.tip(
          'image',
          'Image',
          <ui-popover open={this.imageOpen} placement="bottom-start" panelRole="dialog" label="Add image" onUiOpenChange={(ev: CustomEvent<boolean>) => (this.imageOpen = ev.detail)}>
            <ui-button slot="trigger" class="tb" variant="ghost" size="sm" icon-only label="Image" disabled={off}>
              <ui-icon name="image" />
            </ui-button>
            <div class="kvui-ed__panel kvui-ed__panel--image" {...({ onUiChange: stop, onUiInput: stop } as any)}>
              <ui-tabs value="upload" label="Add image">
                <ui-tab value="upload">Upload</ui-tab>
                <ui-tab value="url">From address</ui-tab>
                <ui-tab-panel value="upload">
                  <div
                    class={{ 'kvui-ed__drop': true, 'is-active': this.dropActive }}
                    onDragOver={(ev: DragEvent) => {
                      ev.preventDefault();
                      this.dropActive = true;
                    }}
                    onDragLeave={() => (this.dropActive = false)}
                    onDrop={(ev: DragEvent) => {
                      ev.preventDefault();
                      this.dropActive = false;
                      const files = Array.from(ev.dataTransfer?.files ?? []);
                      if (files.length) this.upload(files);
                      this.imageOpen = false;
                    }}
                  >
                    <ui-icon name="upload" size="1.5em" />
                    <span>Drop an image here, or</span>
                    <ui-button size="sm" onClick={() => this.imageInput?.click()}>
                      Choose file
                    </ui-button>
                  </div>
                </ui-tab-panel>
                <ui-tab-panel value="url">
                  <div class="kvui-ed__stack">
                    <ui-input label="Image address" placeholder="https://..." value={this.imageUrl} onUiInput={(ev: CustomEvent<string>) => ((this.imageUrl = ev.detail), ev.stopPropagation())} />
                    <ui-input label="Description (alt text)" value={this.imageAlt} onUiInput={(ev: CustomEvent<string>) => ((this.imageAlt = ev.detail), ev.stopPropagation())} />
                    <ui-button size="sm" onClick={() => this.insertImageFromUrl()}>
                      Insert image
                    </ui-button>
                  </div>
                </ui-tab-panel>
              </ui-tabs>
            </div>
          </ui-popover>,
        );

      case 'attachment':
        return this.tip(
          'attachment',
          'Attach file',
          <ui-button class="tb" variant="ghost" size="sm" icon-only label="Attach file" disabled={off} onClick={() => this.attachInput?.click()}>
            <ui-icon name="paperclip" />
          </ui-button>,
        );

      case 'table': {
        const inTable = e.isActive('table');
        return [
          this.tip(
            'table',
            'Insert table',
            <ui-button class="tb" variant="ghost" size="sm" icon-only label="Insert table" disabled={off} onClick={() => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
              <ui-icon name="table" />
            </ui-button>,
          ),
          inTable && (
            <ui-dropdown key="table-menu" onUiSelect={(ev: CustomEvent<{ value: string }>) => this.tableAction(ev.detail.value)}>
              <ui-button slot="trigger" class="tb" variant="ghost" size="sm" label="Table options" disabled={off}>
                Table
                <ui-icon slot="end" name="chevron-down" />
              </ui-button>
              <ui-menu-item value="addRowBefore">Insert row above</ui-menu-item>
              <ui-menu-item value="addRowAfter">Insert row below</ui-menu-item>
              <ui-menu-item value="addColumnBefore">Insert column left</ui-menu-item>
              <ui-menu-item value="addColumnAfter">Insert column right</ui-menu-item>
              <ui-menu-item value="toggleHeaderRow" divider>Toggle header row</ui-menu-item>
              <ui-menu-item value="deleteRow" tone="danger" divider>Delete row</ui-menu-item>
              <ui-menu-item value="deleteColumn" tone="danger">Delete column</ui-menu-item>
              <ui-menu-item value="deleteTable" tone="danger">Delete table</ui-menu-item>
            </ui-dropdown>
          ),
        ];
      }
    }
    return null;
  }

  /* --------------------------------- render --------------------------------- */

  render() {
    const e = this.editor;
    const items = this.items();
    const showToolbar = !this.readonly && items.length > 0;
    const message = this.error ?? this.hint;
    const isEmpty = !e || e.isEmpty;
    const count = (e?.storage as any)?.characterCount?.characters?.() ?? 0;
    // Child components bubble their own uiChange/uiInput events; keep them away from the host's API events.
    const quiet = { onUiChange: stop, onUiInput: stop, onUiSelect: stop, onUiToggle: stop, onUiDismiss: stop } as any;

    return (
      <Host class={{ 'kvui-ed': true, 'is-focused': this.focused, 'is-invalid': !!this.error, 'is-disabled': this.disabled, 'is-readonly': this.readonly }}>
        {this.label && (
          <label class="kvui-ed__label" onClick={() => this.editor?.commands.focus()}>
            {this.label}
            {this.required && <span class="kvui-ed__req" aria-hidden="true"> *</span>}
          </label>
        )}

        <div class="kvui-ed__frame" style={{ '--kvui-ed-min': this.minHeight, '--kvui-ed-max': this.maxHeight ?? 'none' }} {...quiet}>
          {showToolbar && (
            <div class="kvui-ed__toolbar" role="toolbar" aria-label="Formatting" ref={(el) => (this.toolbarEl = el)} onKeyDown={this.onToolbarKey}>
              {e &&
                items.map((id, i) =>
                  id === '|' ? <span key={`sep-${i}`} class="kvui-ed__sep" role="separator" aria-orientation="vertical" /> : this.renderItem(id, e),
                )}
            </div>
          )}

          {this.notice && (
            <ui-alert class="kvui-ed__notice" tone="danger" dismissible onUiDismiss={() => (this.notice = undefined)}>
              {this.notice}
            </ui-alert>
          )}

          <div class="kvui-ed__content" ref={(el) => (this.contentEl = el)} />

          {(this.uploads.length > 0 || this.maxLength != null) && (
            <div class="kvui-ed__status" aria-live="polite">
              <span class="kvui-ed__uploads">
                {this.uploads.map((u) => (
                  <span key={u.id} class="kvui-ed__upload">
                    <ui-spinner size="sm" label={`Uploading ${u.name}`} />
                    {u.name}
                  </span>
                ))}
              </span>
              {this.maxLength != null && (
                <span class="kvui-ed__count" data-over={count >= this.maxLength ? 'true' : 'false'}>
                  {count} / {this.maxLength}
                </span>
              )}
            </div>
          )}
        </div>

        {message && (
          <p class={{ 'kvui-ed__msg': true, 'is-error': !!this.error }} id={`${this.uid}-msg`} role={this.error ? 'alert' : undefined}>
            {message}
          </p>
        )}

        {/* Takes part in a surrounding <form>; `required` uses the browser's own validation bubble. */}
        {this.name && <input type="hidden" name={this.name} value={isEmpty ? '' : this.value} />}
        {this.required && (
          <input
            class="kvui-ed__validity"
            type="text"
            tabindex={-1}
            aria-hidden="true"
            required
            value={isEmpty ? '' : 'x'}
            onInvalid={() => this.editor?.commands.focus()}
          />
        )}

        <input class="kvui-ed__file" type="file" hidden accept={this.accept} multiple ref={(el) => (this.imageInput = el)} onChange={(ev) => this.onFilesChosen(ev, true)} />
        <input class="kvui-ed__file" type="file" hidden accept={this.attachmentAccept || undefined} multiple ref={(el) => (this.attachInput = el)} onChange={(ev) => this.onFilesChosen(ev)} />
        <div class="kvui-ed__popups" ref={(el) => (this.popupsEl = el)} />
      </Host>
    );
  }
}
