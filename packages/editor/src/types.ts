export type ToolbarItem =
  | '|'
  | 'undo'
  | 'redo'
  | 'heading'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'textColor'
  | 'highlight'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'hr'
  | 'link'
  | 'image'
  | 'attachment'
  | 'table';

export type EditorPreset = 'minimal' | 'standard' | 'full';

export interface MentionItem {
  id: string;
  label: string;
  description?: string;
}

/** A URL, or a URL plus alt text. */
export type UploadResult = string | { url: string; alt?: string };

/** Send the file to your storage and resolve with its public URL. */
export type UploadHandler = (file: File) => Promise<UploadResult>;
