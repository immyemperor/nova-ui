/** File validation rules for uploads. Pure functions: no DOM, so they are unit-tested directly. */
export interface FileRules {
  /** Comma-separated: "image/*,.pdf,application/zip". Empty allows everything. */
  accept?: string;
  /** Largest single file, bytes. */
  maxSize?: number;
  /** Most files in one selection. */
  maxFiles?: number;
  /** Total bytes across all files. */
  maxTotalSize?: number;
}

export interface FileLike { name: string; type: string; size: number }
export type FileProblem = { file: string; reason: 'type' | 'size' | 'count' | 'total'; message: string };

export function acceptsType(file: FileLike, accept?: string): boolean {
  const rules = (accept ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return rules.some((r) => {
    if (r.startsWith('.')) return name.endsWith(r);
    if (r.endsWith('/*')) return type.startsWith(r.slice(0, -1));
    return type === r;
  });
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(n < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

/**
 * Check a batch of files against the rules. Returns the files that pass and every problem found,
 * so the UI can show all of them at once instead of one at a time.
 */
export function validateFiles<F extends FileLike>(files: F[], rules: FileRules, alreadyCount = 0, alreadyBytes = 0): { ok: F[]; problems: FileProblem[] } {
  const problems: FileProblem[] = [];
  const ok: F[] = [];
  let count = alreadyCount, total = alreadyBytes;
  for (const f of files) {
    if (!acceptsType(f, rules.accept)) {
      problems.push({ file: f.name, reason: 'type', message: `\u201c${f.name}\u201d isn\u2019t an allowed file type.` });
      continue;
    }
    if (rules.maxSize != null && f.size > rules.maxSize) {
      problems.push({ file: f.name, reason: 'size', message: `\u201c${f.name}\u201d is ${formatBytes(f.size)}. The limit is ${formatBytes(rules.maxSize)}.` });
      continue;
    }
    if (rules.maxFiles != null && count + 1 > rules.maxFiles) {
      problems.push({ file: f.name, reason: 'count', message: `You can add up to ${rules.maxFiles} files.` });
      continue;
    }
    if (rules.maxTotalSize != null && total + f.size > rules.maxTotalSize) {
      problems.push({ file: f.name, reason: 'total', message: `\u201c${f.name}\u201d would exceed the ${formatBytes(rules.maxTotalSize)} total.` });
      continue;
    }
    count++; total += f.size; ok.push(f);
  }
  return { ok, problems };
}
