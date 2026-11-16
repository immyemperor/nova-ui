/** Reordering for sortable lists and kanban cards. Pure: returns new arrays, never mutates. */

export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const out = list.slice();
  if (from < 0 || from >= out.length) return out;
  const [item] = out.splice(from, 1);
  const target = clampIndex(to, out.length);
  out.splice(target, 0, item);
  return out;
}

/** Index a dragged item should drop into, given the vertical midpoints of the items (in order) and the pointer position. */
export function dropIndex(midpoints: number[], pointer: number): number {
  let i = 0;
  while (i < midpoints.length && pointer > midpoints[i]) i++;
  return i;
}

/** Keyboard move: one step up or down, clamped at the ends. Returns the new list and index. */
export function keyboardMove<T>(list: readonly T[], index: number, dir: -1 | 1): { list: T[]; index: number } {
  const to = clampIndex(index + dir, list.length);
  if (to === index) return { list: list.slice(), index };
  return { list: moveItem(list, index, to), index: to };
}

/** Move a card between columns. `cols` maps column id to card ids. */
export function moveCard(cols: Record<string, string[]>, cardId: string, toCol: string, toIndex: number): Record<string, string[]> {
  const next: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(cols)) next[k] = v.filter((id) => id !== cardId);
  if (!next[toCol]) next[toCol] = [];
  next[toCol] = [...next[toCol].slice(0, clampIndex(toIndex, next[toCol].length)), cardId, ...next[toCol].slice(clampIndex(toIndex, next[toCol].length))];
  return next;
}

const clampIndex = (i: number, len: number) => Math.max(0, Math.min(len, i));
