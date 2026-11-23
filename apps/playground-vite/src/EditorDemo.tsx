import { useState } from 'react';
import { UiEditor } from '@omni/react/editor';
import type { MentionItem, UploadHandler } from '@omni/react/editor';

const people: MentionItem[] = [
  { id: 'ada', label: 'Ada Lovelace', description: 'Engineering' },
  { id: 'grace', label: 'Grace Hopper', description: 'Compilers' },
  { id: 'linus', label: 'Linus Torvalds', description: 'Kernel' },
  { id: 'margaret', label: 'Margaret Hamilton', description: 'Flight software' },
];

/** Stand-in for your real storage: pretend to upload, then hand back a URL. */
const fakeUpload: UploadHandler = async (file) => {
  await new Promise((r) => setTimeout(r, 1200));
  return { url: URL.createObjectURL(file), alt: file.name.replace(/\.[^.]+$/, '') };
};

const starter = `<h2>Release notes</h2><p>Type <strong>/</strong> for commands, or <strong>@</strong> to mention someone.</p><ul data-type="taskList"><li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked><span></span></label><div><p>Ship Phase 5</p></div></li><li data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>Write the docs</p></div></li></ul>`;

export function EditorDemo() {
  const [html, setHtml] = useState(starter);
  const [comment, setComment] = useState('');

  return (
    <section className="nova-stack nova-stack-lg" id="editor">
      <h2 className="nova-h3">Rich text editor</h2>

      <UiEditor
        label="Description"
        hint="Drop or paste images. Ctrl/Cmd+K adds a link."
        preset="full"
        value={html}
        maxLength={4000}
        minHeight="14rem"
        uploadHandler={fakeUpload}
        attachmentAccept=".pdf,.zip,.txt"
        mentionProvider={(q) => people.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()))}
        onUiChange={(e) => setHtml(e.detail)}
        onUiUploadError={(e) => console.warn('Upload failed', e.detail.message)}
      />

      <details>
        <summary className="nova-cursor-pointer">HTML output</summary>
        <pre className="nova-text-xs nova-font-mono nova-break-words" style={{ whiteSpace: 'pre-wrap' }}>{html}</pre>
      </details>

      <UiEditor
        label="Quick comment"
        toolbar={['bold', 'italic', '|', 'bulletList', '|', 'link']}
        slashCommands={false}
        minHeight="5rem"
        placeholder="Add a comment"
        value={comment}
        onUiChange={(e) => setComment(e.detail)}
      />
    </section>
  );
}
