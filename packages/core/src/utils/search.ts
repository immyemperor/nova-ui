/**
 * Lightweight fuzzy scoring. 0 = no match. Substring matches always outrank scattered
 * (subsequence) matches, and earlier matches outrank later ones.
 */
export function fuzzyScore(query: string, text: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const t = text.toLowerCase();
  const idx = t.indexOf(q);
  if (idx !== -1) return 1000 + (idx === 0 ? 200 : 0) - idx;

  let from = 0;
  let score = 0;
  let streak = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, from);
    if (found === -1) return 0;
    streak = found === from ? streak + 1 : 0;
    score += 1 + streak * 2 - (found - from) * 0.1;
    from = found + 1;
  }
  return Math.max(0.01, score);
}

/** Match "mod+k", "ctrl+shift+p", etc. "mod" is Cmd on macOS and Ctrl elsewhere. */
export function matchHotkey(ev: KeyboardEvent, combo: string): boolean {
  const parts = combo.toLowerCase().split('+').map((p) => p.trim());
  const key = parts[parts.length - 1];
  const wantMod = parts.includes('mod');
  const wantCtrl = parts.includes('ctrl');
  const wantMeta = parts.includes('meta') || parts.includes('cmd');
  const wantAlt = parts.includes('alt');
  const wantShift = parts.includes('shift');
  const modOk = wantMod ? ev.metaKey || ev.ctrlKey : ev.ctrlKey === wantCtrl && ev.metaKey === wantMeta;
  return modOk && ev.altKey === wantAlt && ev.shiftKey === wantShift && ev.key.toLowerCase() === key;
}
