/**
 * Every user-facing string in the components, with English defaults.
 * Override any of them with setMessages({ ... }) before your app renders, e.g. for another language.
 * Values may contain {placeholders}, filled by t(key, { name: value }).
 */
export const DEFAULT_MESSAGES = {
  'close': 'Close',
  'dismiss': 'Dismiss',
  'dismissNotification': 'Dismiss notification',
  'clear': 'Clear',
  'clearSelection': 'Clear selection',
  'remove': 'Remove {item}',
  'selectAllOnPage': 'Select all rows on this page',
  'selectRow': 'Select row {n}',
  'noResults': 'No results found',
  'noMatches': 'No matches',
  'noRows': 'No rows',
  'showingRange': 'Showing {from}\u2013{to} of {total}',
  'rowsPerPage': 'Rows per page',
  'search': 'Search',
  'searchTable': 'Search table',
  'tablePagination': 'Table pagination',
  'loading': 'Loading',
  'notifications': 'Notifications',
  'previousPage': 'Previous page',
  'nextPage': 'Next page',
  'pageN': 'Page {n}',
  'goToPage': 'Go to slide {n}',
  'previousSlide': 'Previous slide',
  'nextSlide': 'Next slide',
  'pauseAutoplay': 'Pause autoplay',
  'startAutoplay': 'Start autoplay',
  'carousel': 'Carousel',
  'chooseSlide': 'Choose slide',
  'themeNow': 'Theme: {current}. Switch to {next}.',
  'themeLight': 'Light',
  'themeDark': 'Dark',
  'themeSystem': 'System',
  'characterOf': 'Character {i} of {total}',
  'enterFullCode': 'Enter the full code.',
  'addOneEntry': 'Add at least one entry.',
  'addUpTo': 'You can add up to {max}.',
  'alreadyAdded': '"{tag}" is already added.',
  'notValid': '"{tag}" isn\u2019t valid.',
  'enterValidEmail': 'Enter a valid email.',
  'chooseDate': 'Choose a date.',
  'openCalendar': 'Open calendar',
  'closeCalendar': 'Close calendar',
  'clearDate': 'Clear date',
  'chooseDateTitle': 'Choose date',
  'previousMonth': 'Previous month',
  'nextMonth': 'Next month',
  'month': 'Month',
  'year': 'Year',
  'colourPicker': 'Colour picker',
  'saturationBrightness': 'Saturation and brightness',
  'hue': 'Hue',
  'hexColour': 'Hex colour',
  'pickFromScreen': 'Pick colour from screen',
  'presetColours': 'Preset colours',
  'selectOption': 'Select an option.',
  'chooseRange': 'Choose a range.',
  'selectFirst': 'Select an option.',
  'sortAscending': 'ascending',
  'sortDescending': 'descending',
  'breadcrumb': 'Breadcrumb',
  'showFullPath': 'Show full path',
  'mainNav': 'Main',
  'sections': 'Sections',
  'tabs': 'Tabs',
  'applicationMenu': 'Application menu',
  'formatting': 'Formatting',
  'richTextEditor': 'Rich text editor',
  'uploading': 'Uploading {name}',
  'textStyle': 'Text style',
  'textColour': 'Text colour',
  'highlightColour': 'Highlight colour',
  'removeHighlight': 'Remove highlight',
  'resetColour': 'Reset colour',
  'linkAddress': 'Link address',
  'apply': 'Apply',
  'removeLink': 'Remove link',
  'addImage': 'Add image',
  'image': 'Image',
  'uploadTab': 'Upload',
  'fromAddress': 'From address',
  'dropImageHere': 'Drop an image here, or',
  'chooseFile': 'Choose file',
  'imageAddress': 'Image address',
  'altText': 'Description (alt text)',
  'insertImage': 'Insert image',
  'attachFile': 'Attach file',
  'insertTable': 'Insert table',
  'tableOptions': 'Table options',
  'table': 'Table',
  'skipToContent': 'Skip to content',
  'rateThis': 'Rate this',
  'confirm': 'Confirm',
  'cancel': 'Cancel',
  'ok': 'OK',
  'dataTable': 'Data table',
  'exportCsv': 'Export CSV',
  'period': 'Period',
  'category': 'Category',
  'item': 'Item',
} as const;

export type MessageKey = keyof typeof DEFAULT_MESSAGES;
export type Messages = Partial<Record<MessageKey, string>>;

let active: Messages = {};

/** Override strings globally. Call once at startup; later calls merge. */
export function setMessages(overrides: Messages): void {
  active = { ...active, ...overrides };
}

/** Clear all overrides (useful in tests). */
export function resetMessages(): void {
  active = {};
}

/** Look up a message and fill in {placeholders}. Missing keys fall back to English. */
export function t(key: MessageKey, vars?: Record<string, string | number>): string {
  let text: string = active[key] ?? DEFAULT_MESSAGES[key];
  if (vars) for (const [k, v] of Object.entries(vars)) text = text.split(`{${k}}`).join(String(v));
  return text;
}
