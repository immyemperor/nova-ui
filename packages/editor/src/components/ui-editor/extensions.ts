import { Extension } from '@tiptap/core';
import type { AnyExtension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import Suggestion from '@tiptap/suggestion';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import type { MentionItem } from '../../types';
import { SlashItem, createSuggestionRender, filterSlashItems } from './suggestion';

export interface ExtensionOptions {
  placeholder: string;
  maxLength?: number;
  /** Enable the "/" menu. Items are read each time it opens, so toolbar changes apply without a rebuild. */
  slashItems?: () => SlashItem[];
  mention?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  getHost: () => HTMLElement | undefined;
  /** Return true if the link popover opened (so Ctrl/Cmd+K is consumed). */
  openLink: () => boolean;
}

export function buildExtensions(o: ExtensionOptions): AnyExtension[] {
  const extensions: AnyExtension[] = [
    StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
    }),
    Image.configure({ allowBase64: true }),
    Placeholder.configure({ placeholder: o.placeholder }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    CharacterCount.configure({ limit: o.maxLength }),
    // Ctrl/Cmd+K opens the link popover.
    Extension.create({
      name: 'novaLinkShortcut',
      addKeyboardShortcuts() {
        return {
          'Mod-k': () => o.openLink(),
        };
      },
    }),
  ];

  if (o.slashItems) {
    const getItems = o.slashItems;
    extensions.push(
      Extension.create({
        name: 'novaSlash',
        addProseMirrorPlugins() {
          return [
            Suggestion({
              editor: this.editor,
              pluginKey: new PluginKey('novaSlash'),
              char: '/',
              allowSpaces: false,
              items: ({ query }: { query: string }) => filterSlashItems(getItems(), query),
              command: ({ editor, range, props }: any) => {
                editor.chain().focus().deleteRange(range).run();
                (props as SlashItem).run(editor);
              },
              render: createSuggestionRender<SlashItem>(o.getHost, (i) => ({ key: i.id, label: i.label, description: i.description, icon: i.icon }), 'No commands'),
            } as any),
          ];
        },
      }),
    );
  }

  if (o.mention) {
    const provider = o.mention;
    extensions.push(
      Mention.configure({
        HTMLAttributes: { class: 'nova-ed-mention' },
        renderLabel: ({ node }: any) => `@${node.attrs.label ?? node.attrs.id}`,
        suggestion: {
          char: '@',
          items: async ({ query }: { query: string }) => (await provider(query)).slice(0, 8),
          command: ({ editor, range, props }: any) => {
            editor
              .chain()
              .focus()
              .insertContentAt(range, [
                { type: 'mention', attrs: { id: props.id, label: props.label } },
                { type: 'text', text: ' ' },
              ])
              .run();
          },
          render: createSuggestionRender<MentionItem>(o.getHost, (i) => ({ key: i.id, label: i.label, description: i.description }), 'No matches'),
        } as any,
      }),
    );
  }

  return extensions;
}
