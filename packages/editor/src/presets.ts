import type { EditorPreset, ToolbarItem } from './types';

export const EDITOR_PRESETS: Record<EditorPreset, ToolbarItem[]> = {
  minimal: ['bold', 'italic', '|', 'bulletList', 'orderedList', '|', 'link'],
  standard: [
    'undo', 'redo', '|', 'heading', '|',
    'bold', 'italic', 'underline', 'strike', 'code', '|',
    'bulletList', 'orderedList', 'taskList', '|',
    'blockquote', 'codeBlock', '|',
    'link', 'image', 'table',
  ],
  full: [
    'undo', 'redo', '|', 'heading', '|',
    'bold', 'italic', 'underline', 'strike', 'code', '|',
    'textColor', 'highlight', '|',
    'alignLeft', 'alignCenter', 'alignRight', '|',
    'bulletList', 'orderedList', 'taskList', '|',
    'blockquote', 'codeBlock', 'hr', '|',
    'link', 'image', 'attachment', 'table',
  ],
};
