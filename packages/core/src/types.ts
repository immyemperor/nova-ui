export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface Command {
  id: string;
  label: string;
  /** Section heading shown when the search box is empty. */
  group?: string;
  /** Icon name from the registry. */
  icon?: string;
  /** Display-only shortcut hint, e.g. "Ctrl K". */
  shortcut?: string;
  /** Extra words that should match the search. */
  keywords?: string[];
  disabled?: boolean;
}

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  tone?: ToastTone;
  /** ms before auto-dismiss. 0 keeps it until dismissed. */
  duration?: number;
  dismissible?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

/* ---------- Data components ---------- */
export type TableRow = Record<string, unknown>;

export interface TableColumn {
  /** Property read from each row. */
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  /** Any CSS width, e.g. "8rem" or "20%". */
  width?: string;
  /** Turn the raw value into display text. */
  format?: (value: unknown, row: TableRow) => string;
}

export interface TableSort {
  key: string;
  dir: 'asc' | 'desc';
}

/** Everything a server needs to produce the next page of a table. */
export interface TableQuery {
  page: number;
  pageSize: number;
  sort?: TableSort;
  search: string;
}

export interface TreeNode {
  id: string;
  label: string;
  /** Icon name from the registry. */
  icon?: string;
  disabled?: boolean;
  children?: TreeNode[];
}
