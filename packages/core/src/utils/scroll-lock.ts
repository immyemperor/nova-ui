/** Ref-counted body scroll lock so stacked modals don't fight each other. */
let count = 0;
let saved = { overflow: '', paddingRight: '' };

export function lockScroll(): void {
  if (typeof document === 'undefined') return;
  if (count++ > 0) return;
  const body = document.body;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
  body.style.overflow = 'hidden';
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`; // avoid layout shift
}

export function unlockScroll(): void {
  if (typeof document === 'undefined' || count === 0) return;
  if (--count > 0) return;
  document.body.style.overflow = saved.overflow;
  document.body.style.paddingRight = saved.paddingRight;
}
