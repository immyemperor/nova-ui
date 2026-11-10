/** Does `file` match an `accept` string like "image/*,.pdf"? An empty string accepts everything. */
export function acceptsFile(file: File, accept: string): boolean {
  const rules = accept.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) => (rule.startsWith('.') ? name.endsWith(rule) : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule));
}

export function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(n < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

/** Only allow link targets that can't run script. */
export function safeHref(input: string): string | undefined {
  const url = input.trim();
  if (!url) return undefined;
  if (/^(https?:|mailto:|tel:)/i.test(url) || url.startsWith('/') || url.startsWith('#')) return url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return undefined; // javascript:, data:, vbscript: ...
  return `https://${url}`;
}

/** Image sources: http(s), site-relative, blob: (object URLs) and data:image only. */
export function safeImageSrc(input: string): string | undefined {
  const url = input.trim();
  if (!url) return undefined;
  if (/^(https?:|blob:|data:image\/)/i.test(url) || url.startsWith('/')) return url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return undefined;
  return `https://${url}`;
}
