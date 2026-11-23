# Nova UI component reference

Generated from 72 component sources. Regenerate with `node scripts/generate-docs.mjs`.

## `<ui-accordion>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `multiple` | `boolean` | `false` | Allow several items open at once. |
| `variant` | `'bordered' | 'flush'` | `'bordered'` |  |

**Slots:** default

## `<ui-accordion-item>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` |  |  |
| `value` | `string` |  |  |
| `open` | `boolean` | `false` |  |
| `disabled` | `boolean` | `false` |  |
| `level` | `number` | `3` | aria-level of the heading, so it fits your page outline. |

**Events**

- `uiToggle` (detail: `boolean`). Fires with the new open state. Bubbles, so you can listen on <ui-accordion>.

**Methods**

- `focusHeader()`. 

**Slots:** `heading`, default

## `<ui-alert>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'info' | 'success' | 'warning' | 'danger'` | `'info'` |  |
| `heading` | `string` |  | Short summary line. Put details in the default slot. |
| `dismissible` | `boolean` | `false` |  |
| `open` | `boolean` | `true` | Set to false to hide. Dismissing sets this for you. |

**Events**

- `uiDismiss` (detail: `void`). Fires when the user dismisses the alert.

**Slots:** default

## `<ui-avatar>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` |  |  |
| `name` | `string` | `''` | Used for the alt text and for initials when there's no image. |
| `size` | `'sm' | 'md' | 'lg' | 'xl'` | `'md'` |  |
| `shape` | `'circle' | 'square'` | `'circle'` |  |

**Slots:** default

## `<ui-badge>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'` | `'neutral'` |  |
| `variant` | `'soft' | 'solid' | 'outline'` | `'soft'` |  |
| `dot` | `boolean` | `false` | Leading status dot. |

**Slots:** default

## `<ui-breadcrumb>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `max-items` | `number` |  | Collapse the middle of long trails into an expandable "...". Minimum 2. |
| `label` | `string` | `'Breadcrumb'` |  |

**Slots:** default

## `<ui-breadcrumb-item>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` |  | Omit for items that aren't links. |
| `current` | `boolean` | `false` | Mark the current page explicitly. The last item is treated as current automatically. |
| `last` | `boolean` | `false` | Managed by <ui-breadcrumb>. |
| `collapsed` | `boolean` | `false` |  |
| `ellipsis` | `boolean` | `false` |  |

**Events**

- `uiExpand` (detail: `void`). 

**Slots:** default

## `<ui-button>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' | 'secondary' | 'ghost' | 'danger'` | `'primary'` |  |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |
| `disabled` | `boolean` | `false` |  |
| `loading` | `boolean` | `false` | Shows a spinner and blocks clicks while work is in flight. |
| `icon-only` | `boolean` | `false` | Square button for a single icon. Provide `label` for screen readers. |
| `type` | `'button' | 'submit' | 'reset'` | `'button'` |  |
| `pressed` | `boolean` |  | Toggle state for toolbar-style buttons. Leave unset for a normal button. |
| `label` | `string` |  | Accessible name; required when iconOnly is set. |
| `href` | `string` |  | Render as a link when set. |
| `target` | `string` |  |  |

**Slots:** `start`, default, `end`

## `<ui-calendar>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | Selected date, "YYYY-MM-DD". |
| `min` | `string` |  | Earliest selectable date, "YYYY-MM-DD". |
| `max` | `string` |  |  |
| `locale` | `string` |  | BCP 47 locale for month and weekday names. Defaults to the browser's. |
| `first-day-of-week` | `number` | `0` | 0 = Sunday, 1 = Monday. |

**Events**

- `uiChange` (detail: `string`). 

**Methods**

- `focusDay()`. Move keyboard focus onto the active day.

## `<ui-card>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'outlined' | 'raised' | 'flat'` | `'outlined'` |  |
| `interactive` | `boolean` | `false` | Adds hover and focus states. Wrap the card in a link or button for the actual action. |

**Slots:** `header`, default, `footer`

## `<ui-carousel>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `slides-per-view` | `number` | `1` | Slides visible at once. |
| `gap` | `number` | `16` | Space between slides, in px. |
| `loop` | `boolean` | `false` | Wrap from the last slide back to the first. |
| `autoplay` | `number` | `0` | Auto-advance every N ms. 0 turns it off. |
| `show-dots` | `boolean` | `true` |  |
| `show-arrows` | `boolean` | `true` |  |
| `label` | `string` | `'Carousel'` | Accessible name. |

**Events**

- `uiChange` (detail: `number`). Fires with the index of the first visible slide.

**Slots:** default

## `<ui-chart>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'line' | 'area' | 'bar' | 'donut'` | `'line'` | Chart type. |
| `series` | `ChartSeries[]` | `[]` | One or more series. Donut charts use the first series only. |
| `labels` | `string[]` | `[]` | Category labels for the x-axis (or slice names for a donut). |
| `label` | `string` | `'Chart'` | Accessible title. Also read out as the summary. |
| `height` | `number` | `240` |  |
| `axes` | `boolean` | `true` | Show y-axis gridlines and values. |
| `show-table` | `boolean` | `false` | Show the data table below the chart. Always in the DOM for screen readers; this toggles it visible. |
| `compact` | `boolean` | `true` | Format axis numbers in compact form (1.2k). |

## `<ui-checkbox>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` |  |
| `indeterminate` | `boolean` | `false` | Shows a dash (mixed state). Cleared as soon as the user toggles. |
| `value` | `string` | `'on'` | Value submitted with the form when checked. |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `label` | `string` |  | Accessible name when there is no visible label text. |

**Events**

- `uiChange` (detail: `boolean`). 

**Slots:** default

## `<ui-collapse>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` |  |
| `peek` | `string` |  | Visible even when closed (a preview line). |

**Events**

- `uiToggle` (detail: `boolean`). 

**Slots:** `label`, default

## `<ui-color-picker>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `'#0b7a6c'` | Hex colour, "#rrggbb". |
| `label` | `string` |  |  |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `inline` | `boolean` | `false` | Show the panel directly instead of behind a button. |
| `swatches` | `string[]` | `DEFAULT_SWATCHES` |  |

**Events**

- `uiInput` (detail: `string`). Fires continuously while dragging or typing.
- `uiChange` (detail: `string`). Fires when a colour is committed: release, key press, hex entry or swatch click.

## `<ui-command-palette>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` |  |
| `commands` | `Command[]` | `[]` |  |
| `placeholder` | `string` | `'Type a command or search'` |  |
| `hotkey` | `string` | `'mod+k'` | Global shortcut, e.g. "mod+k" (Cmd on Mac, Ctrl elsewhere). Set to "" to disable. |
| `empty-text` | `string` | `'No results found'` |  |
| `label` | `string` | `'Command palette'` |  |

**Events**

- `uiSelect` (detail: `Command`). Fires with the chosen command. The palette closes itself.
- `uiOpenChange` (detail: `boolean`). 

## `<ui-context-menu>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` |  |

**Events**

- `uiSelect` (detail: `{ value: string; label: string }`). 

**Slots:** default, `menu`

## `<ui-counter>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` |  |
| `duration` | `number` | `1200` | ms |
| `decimals` | `number` | `0` |  |
| `prefix-text` | `string` | `''` | Text before the number, e.g. "$". (Not `prefix`: that is a built-in read-only DOM property.) |
| `suffix-text` | `string` | `''` | Text after the number, e.g. "%". |
| `locale` | `string` |  | BCP 47 locale for digit grouping, e.g. "en-IN". Defaults to the browser's. |
| `trigger` | `'load' | 'visible'` | `'visible'` | "visible" waits until the counter scrolls into view. |

## `<ui-date-picker>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` |  |
| `min` | `string` |  |  |
| `max` | `string` |  |  |
| `label` | `string` |  |  |
| `hint` | `string` |  |  |
| `error` | `string` |  |  |
| `placeholder` | `string` | `'YYYY-MM-DD'` |  |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `clearable` | `boolean` | `false` |  |
| `locale` | `string` |  |  |
| `first-day-of-week` | `number` | `0` |  |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |

**Events**

- `uiChange` (detail: `string`). Fires with "YYYY-MM-DD", or "" when cleared.

**Methods**

- `focusInput()`. 

## `<ui-date-range-picker>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `DateRange` | `{}` |  |
| `min` | `string` |  |  |
| `max` | `string` |  |  |
| `label` | `string` |  |  |
| `hint` | `string` |  |  |
| `error` | `string` |  |  |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `locale` | `string` |  |  |
| `first-day-of-week` | `number` | `0` |  |
| `presets` | `boolean` | `false` | Show quick presets (last 7 days, last 30 days, this month, this year). |
| `today` | `string` |  | Pass a fixed "today" for tests and for server-rendered pages. |

**Events**

- `uiChange` (detail: `DateRange`). 

**Methods**

- `clear()`. 

## `<ui-dialog-host>`



**Methods**

- `openDialog(req: DialogRequest)`. Called by confirm()/prompt(). Queues requests so two dialogs never overlap.

## `<ui-drawer>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` |  |
| `side` | `'left' | 'right' | 'top' | 'bottom'` | `'right'` |  |
| `heading` | `string` |  |  |
| `label` | `string` |  |  |
| `dismissible` | `boolean` | `true` |  |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |

**Events**

- `uiOpen` (detail: `void`). 
- `uiClose` (detail: `void`). 

**Slots:** `header`, default, `footer`

## `<ui-dropdown>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` |  |
| `placement` | `Placement` | `'bottom-start'` |  |

**Events**

- `uiSelect` (detail: `{ value: string; label: string }`). Fires when an item is chosen.
- `uiOpenChange` (detail: `boolean`). 

**Slots:** `trigger`, default

## `<ui-editor>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | HTML content. Empty string when the editor is empty. |
| `label` | `string` |  |  |
| `hint` | `string` |  |  |
| `error` | `string` |  |  |
| `placeholder` | `string` | `'Write something, or type / for commands'` |  |
| `name` | `string` |  | Submitted with a surrounding <form>. |
| `readonly` | `boolean` | `false` |  |
| `disabled` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `preset` | `'minimal' | 'standard' | 'full'` | `'standard'` | Ready-made toolbar: "minimal", "standard" or "full". |
| `toolbar` | `ToolbarItem[]` |  | Your own toolbar: item ids in order, with "\|" for separators. Overrides `preset`. |
| `slash-commands` | `boolean` | `true` | The "/" quick-insert menu. |
| `mention-provider` | `(query: string)` | `> MentionItem[] | Promise<MentionItem[]>` | Turns on @mentions. Return matches for what the user typed after "@". |
| `upload-handler` | `UploadHandler` |  | Upload a file and resolve with its URL. Without it, images are embedded as data URLs. |
| `accept` | `string` | `'image/*'` | Allowed image types (the `accept` attribute format). |
| `attachment-accept` | `string` | `''` | Allowed attachment types. Empty allows any. |
| `max-file-size` | `any` | `10 * 1024 * 1024` | Largest file, in bytes. |
| `max-length` | `number` |  | Maximum characters. Shows a counter when set. |
| `min-height` | `string` | `'10rem'` |  |
| `max-height` | `string` |  |  |
| `focus-on-load` | `boolean` | `false` | Put the cursor in the editor on load. |

**Events**

- `uiChange` (detail: `string`). Fires on every content change with the HTML.
- `uiFocus` (detail: `void`). 
- `uiBlur` (detail: `void`). 
- `uiReady` (detail: `void`). 
- `uiUploadStart` (detail: `{ file: File }`). 
- `uiUploadComplete` (detail: `{ file: File; url: string }`). 
- `uiUploadError` (detail: `{ file: File; message: string }`). 

**Methods**

- `getContentHTML()`. 
- `getContentJSON()`. 
- `getContentText()`. 
- `setContent(html: string)`. 
- `clear()`. 
- `insertContent(html: string)`. 
- `focusEditor()`. 
- `getEditor()`. The underlying Tiptap Editor, for anything this component doesn't expose.

## `<ui-field>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  |  |
| `hint` | `string` |  |  |
| `error` | `string` |  |  |
| `required` | `boolean` | `false` |  |
| `inline` | `boolean` | `false` | Lay the label beside the control (useful in dense settings screens). |

**Slots:** default

## `<ui-file-upload>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `accept` | `string` | `''` |  |
| `max-size` | `number` |  |  |
| `max-files` | `number` |  |  |
| `max-total-size` | `number` |  |  |
| `multiple` | `boolean` | `true` |  |
| `label` | `string` | `'Upload files'` |  |
| `hint` | `string` |  |  |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `upload-fn` | `(file: File, onProgress: (p: number)` | `> void) => Promise<string>` | Upload a single file. Resolve with its URL. Progress: call the second argument with 0..1. |

**Events**

- `uiFiles` (detail: `File[]`). Every file the user picks or drops (after validation).
- `uiUploaded` (detail: `{ file: File; url: string }`). Fires when a file finishes uploading.
- `uiRejected` (detail: `FileProblem[]`). Fires with every rejected file and why.
- `uiRemove` (detail: `File`). 

**Methods**

- `clear()`. 

## `<ui-html>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `html` | `string` | `''` | The HTML to display. Sanitised before it reaches the page. |
| `allow-images` | `boolean` | `true` | Keep <img> elements. |
| `prose` | `boolean` | `false` | Typography defaults for long-form content. |

## `<ui-icon>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` |  | Icon name, e.g. "check". |
| `size` | `string` |  | Width and height, e.g. "1.5rem". Defaults to 1em. |
| `label` | `string` |  | Accessible name. Leave unset for a decorative icon. |
| `filled` | `boolean` | `false` | Fill the shape (solid star, filled Material icon). |
| `library` | `IconLibrary` |  | Icon set for this icon. Leave unset to use the page setting (setIconLibrary). |

## `<ui-input>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` |  |
| `label` | `string` |  |  |
| `hide-label` | `boolean` | `false` | Keep the label for screen readers but don't show it. |
| `hint` | `string` |  | Helper text shown under the field. |
| `error` | `string` |  | Error text. Also marks the field invalid. |
| `type` | `'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'` | `'text'` |  |
| `name` | `string` |  |  |
| `placeholder` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `readonly` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `autocomplete` | `string` |  |  |
| `maxlength` | `number` |  |  |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |

**Events**

- `uiInput` (detail: `string`). Fires on every keystroke with the current value.
- `uiChange` (detail: `string`). Fires when the value is committed (blur or Enter).

**Methods**

- `focusInput()`. 

**Slots:** `prefix`, `suffix`

## `<ui-kanban>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `KanbanColumn[]` | `[]` |  |
| `cards` | `KanbanCard[]` | `[]` | Cards, keyed by id. |
| `layout` | `Record<string, string[]>` | `{}` | Which column each card is in: column id to ordered card ids. |
| `label` | `string` | `'Board'` |  |

**Events**

- `uiMove` (detail: `{ cardId: string; to: string; index: number; layout: Record<string, string[]> }`). Fires after any move with the new layout.

## `<ui-marquee>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `speed` | `number` | `50` | Pixels per second. |
| `direction` | `'left' | 'right'` | `'left'` |  |
| `pause-on-hover` | `boolean` | `true` |  |
| `gap` | `number` | `32` | Space between repeated items, px. |

**Slots:** default

## `<ui-menu-item>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | Returned in the parent's uiSelect event. Defaults to the item's text. |
| `disabled` | `boolean` | `false` |  |
| `tone` | `'default' | 'danger'` | `'default'` |  |
| `divider` | `boolean` | `false` | Draw a separator line above this item. |
| `shortcut` | `string` |  | Display-only shortcut hint, e.g. "Ctrl S". |

**Slots:** `icon`, default

## `<ui-menubar>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Application menu'` |  |

**Slots:** default

## `<ui-menubar-menu>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | Text of the top-level button, e.g. "File". |
| `open` | `boolean` | `false` |  |
| `disabled` | `boolean` | `false` |  |
| `roving` | `boolean` | `false` | Managed by <ui-menubar>: only one trigger is in the tab order. |

**Events**

- `uiSelect` (detail: `{ value: string; label: string }`). Fires when a menu item is chosen.
- `uiNavigate` (detail: `number`). Asks the menubar to move to the previous (-1) or next (1) menu.

**Methods**

- `focusTrigger()`. 
- `openMenu(focusFirst = true)`. 

**Slots:** default

## `<ui-modal>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` |  |
| `heading` | `string` |  | Title shown in the header and used as the dialog's accessible name. |
| `label` | `string` |  | Accessible name when there is no visible heading. |
| `dismissible` | `boolean` | `true` | Allow closing with Escape, the backdrop and the close button. |
| `size` | `'sm' | 'md' | 'lg' | 'full'` | `'md'` |  |
| `placement` | `'center' | 'left' | 'right' | 'top' | 'bottom' | 'palette'` | `'center'` | "center" is a dialog. The edge values make it a drawer; "palette" is top-aligned for search. |
| `hide-header` | `boolean` | `false` |  |

**Events**

- `uiOpen` (detail: `void`). Fires after the dialog is shown.
- `uiClose` (detail: `void`). Fires after the dialog has closed, however it was closed.

**Slots:** `header`, default, `footer`

## `<ui-nav-item>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | Text of the link or button. |
| `href` | `string` |  | Makes this a plain link. Leave out to make it a button that opens the panel. |
| `current` | `boolean` | `false` |  |
| `open` | `boolean` | `false` |  |

**Events**

- `uiToggle` (detail: `boolean`). Fires when the panel opens or closes. Bubbles so <ui-nav-menu> can close siblings.

**Methods**

- `focusTrigger()`. 

**Slots:** `label`, default

## `<ui-nav-menu>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Main'` |  |

**Slots:** default

## `<ui-otp-input>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` |  |
| `length` | `number` | `6` |  |
| `type` | `'numeric' | 'alphanumeric'` | `'numeric'` |  |
| `mask` | `boolean` | `false` | Hide the characters, like a password. |
| `label` | `string` |  |  |
| `hint` | `string` |  |  |
| `error` | `string` |  |  |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |

**Events**

- `uiInput` (detail: `string`). Fires on every change with the characters entered so far.
- `uiComplete` (detail: `string`). Fires once, when every box is filled.

**Methods**

- `focusInput()`. 

## `<ui-pagination>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | `1` | Current page, 1-based. |
| `page-count` | `number` |  | Total pages. Or pass `total` items and a `pageSize`. |
| `total` | `number` |  |  |
| `page-size` | `number` | `10` |  |
| `siblings` | `number` | `1` | Pages shown on each side of the current page. |
| `boundaries` | `number` | `1` | Pages always shown at each end. |
| `label` | `string` | `'Pagination'` |  |
| `size` | `'sm' | 'md'` | `'md'` |  |

**Events**

- `uiChange` (detail: `number`). 

## `<ui-popover>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` |  |
| `placement` | `Placement` | `'bottom-start'` |  |
| `offset` | `number` | `8` | Gap between trigger and panel, px. |
| `trigger` | `'click' | 'manual'` | `'click'` | "click" toggles on trigger click. "manual" leaves control to you. |
| `match-width` | `boolean` | `false` | Make the panel at least as wide as the trigger. |
| `panel-role` | `'dialog' | 'menu' | 'listbox' | 'none'` | `'dialog'` | Semantics of the panel; also sets aria-haspopup on the trigger. |
| `close-on-outside` | `boolean` | `true` | Close on outside press and Escape. |
| `label` | `string` |  | Accessible name when panelRole is "dialog". |

**Events**

- `uiOpenChange` (detail: `boolean`). Fires when the user (not your code) changes the open state.
- `uiShow` (detail: `void`). Fires after the panel is shown and positioned.
- `uiHide` (detail: `void`). 

**Methods**

- `show()`. 
- `hide()`. 
- `toggle()`. 
- `showAt(x: number, y: number)`. Open at viewport coordinates, e.g. for a context menu.

**Slots:** `trigger`, default

## `<ui-progress>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` |  | Current value. Leave unset for an indeterminate bar. |
| `max` | `number` | `100` |  |
| `label` | `string` |  |  |
| `show-value` | `boolean` | `false` |  |
| `tone` | `'accent' | 'success' | 'warning' | 'danger'` | `'accent'` |  |

## `<ui-radio>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  |  |
| `checked` | `boolean` | `false` | Managed by the parent group. |
| `disabled` | `boolean` | `false` |  |

**Slots:** default

## `<ui-radio-group>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  |  |
| `label` | `string` |  |  |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `orientation` | `'vertical' | 'horizontal'` | `'vertical'` |  |

**Events**

- `uiChange` (detail: `string`). 

**Slots:** default

## `<ui-rating>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` |  |
| `max` | `number` | `5` |  |
| `readonly` | `boolean` | `false` |  |
| `label` | `string` | `'Rating'` | Accessible name for the group, e.g. "Rate this article". |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |

**Events**

- `uiChange` (detail: `number`). 

## `<ui-reveal>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `animation` | `AnimationName` | `'slide-up'` |  |
| `duration` | `number` | `500` | ms |
| `delay` | `number` | `0` | ms |
| `threshold` | `number` | `0.15` | Fraction of the element that must be visible (0 to 1). |
| `repeat` | `boolean` | `false` | Reveal again each time it re-enters the viewport. |

**Events**

- `uiReveal` (detail: `void`). Fires after the reveal animation completes.

**Slots:** default

## `<ui-scheduler>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `events` | `CalEvent[]` | `[]` |  |
| `view` | `'month' | 'week'` | `'month'` |  |
| `date` | `string` | `''` | Date shown, "YYYY-MM-DD". Defaults to today. |
| `first-day-of-week` | `number` | `1` |  |
| `locale` | `string` |  |  |
| `day-start` | `number` | `7` | First and last hour shown in week view. |
| `day-end` | `number` | `20` |  |
| `label` | `string` | `'Schedule'` |  |

**Events**

- `uiEventClick` (detail: `CalEvent`). 
- `uiDateChange` (detail: `string`). 
- `uiViewChange` (detail: `'month' | 'week'`). 

## `<ui-scroll-progress>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `target` | `string` |  |  |
| `position` | `'top' | 'bottom'` | `'top'` |  |
| `label` | `string` | `'Reading progress'` |  |

## `<ui-select>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string | string[]` | `''` | A string, or an array of strings when `multiple`. |
| `options` | `SelectOption[]` | `[]` |  |
| `multiple` | `boolean` | `false` |  |
| `searchable` | `boolean` | `true` | Let people type to filter. When false it behaves like a plain select. |
| `clearable` | `boolean` | `false` |  |
| `filter` | `boolean` | `true` | Filter options in the browser. Turn off when you filter on the server. |
| `label` | `string` |  |  |
| `hint` | `string` |  |  |
| `error` | `string` |  |  |
| `placeholder` | `string` |  |  |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `empty-text` | `string` | `'No matches'` |  |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |

**Events**

- `uiChange` (detail: `string | string[]`). Fires when the selection changes.
- `uiSearch` (detail: `string`). Fires as the user types. Use it to fetch options when `filter` is off.

**Methods**

- `focusInput()`. 

## `<ui-sidebar>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsed` | `boolean` | `false` | Show icons only, with labels as tooltips. |
| `label` | `string` | `'Main'` | Accessible name of the navigation landmark. |
| `storage-key` | `string` |  | Collapsed state is remembered under this key in localStorage (leave empty to disable). |

**Events**

- `uiCollapse` (detail: `boolean`). 

**Slots:** default, `footer`

## `<ui-sidebar-item>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  |  |
| `href` | `string` |  |  |
| `icon` | `string` |  | Icon name from the registry, shown in both expanded and collapsed states. |
| `badge` | `string` |  | Badge text, e.g. an unread count. |
| `current` | `boolean` | `false` |  |
| `group` | `boolean` | `false` | Makes this item a group that shows its children when open. |
| `open` | `boolean` | `false` |  |
| `tooltip` | `string` |  | Shown as a native tooltip when the sidebar is collapsed. |

**Events**

- `uiSelect` (detail: `{ label: string; href?: string }`). 

**Slots:** default

## `<ui-skeleton>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `shape` | `'text' | 'rect' | 'circle'` | `'text'` |  |
| `width` | `string` |  | CSS width. Defaults to 100%. |
| `height` | `string` |  | CSS height. Defaults depend on shape. |
| `lines` | `number` | `1` | Number of text lines (shape="text" only). The last line is shorter. |
| `animated` | `boolean` | `true` |  |

## `<ui-slider>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` |  |
| `min` | `number` | `0` |  |
| `max` | `number` | `100` |  |
| `step` | `number` | `1` |  |
| `label` | `string` |  |  |
| `name` | `string` |  |  |
| `show-value` | `boolean` | `false` | Show the current value next to the label. |
| `disabled` | `boolean` | `false` |  |

**Events**

- `uiInput` (detail: `number`). Fires continuously while dragging.
- `uiChange` (detail: `number`). Fires when the user releases the thumb or uses the keyboard.

## `<ui-sortable>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `SortItem[]` | `[]` |  |
| `label` | `string` | `'Reorderable list'` |  |

**Events**

- `uiReorder` (detail: `SortItem[]`). Fires with the new order after every change.

## `<ui-sparkline>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `values` | `number[]` | `[]` | Values, left to right. |
| `width` | `number` | `120` |  |
| `height` | `number` | `32` |  |
| `area` | `boolean` | `false` | Fill the area under the line. |
| `label` | `string` | `'Trend'` | Accessible summary, e.g. "Revenue, up 12% over 7 days". |

## `<ui-spinner>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |
| `label` | `string` | `'Loading'` | Announced to screen readers. Describe what is loading, e.g. "Loading results". |

## `<ui-split>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' | 'vertical'` | `'horizontal'` |  |
| `ratio` | `number` | `0.5` | Size of the first pane as a fraction (0..1). |
| `min-a` | `number` | `120` |  |
| `min-b` | `number` | `120` |  |
| `label` | `string` | `'Resize panes'` | Accessible name for the divider, e.g. "Resize file list". |
| `storage-key` | `string` |  | Remember the ratio under this key. |

**Events**

- `uiResize` (detail: `number`). 

**Slots:** `a`, `b`

## `<ui-stagger>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `animation` | `AnimationName` | `'slide-up'` |  |
| `step` | `number` | `60` | Delay between children, in ms. |
| `duration` | `number` | `450` | ms per child |
| `trigger` | `'load' | 'visible'` | `'load'` | "load" plays immediately; "visible" waits until scrolled into view. |

**Slots:** default

## `<ui-step>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` |  |  |
| `description` | `string` |  |  |
| `error` | `boolean` | `false` | Flag this step as having a problem. |
| `index` | `number` | `0` | Managed by <ui-stepper>. |
| `last` | `boolean` | `false` |  |
| `status` | `'complete' | 'current' | 'upcoming' | 'error'` | `'upcoming'` |  |
| `clickable` | `boolean` | `false` |  |
| `orientation` | `'horizontal' | 'vertical'` | `'horizontal'` |  |

**Slots:** default

## `<ui-stepper>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `current` | `number` | `0` | Index of the active step, 0-based. |
| `orientation` | `'horizontal' | 'vertical'` | `'horizontal'` |  |
| `clickable` | `boolean` | `false` | Let people jump back to completed steps. |
| `label` | `string` |  |  |

**Events**

- `uiChange` (detail: `number`). Fires when a completed step is clicked.

**Slots:** default

## `<ui-switch>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` |  |
| `value` | `string` | `'on'` |  |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `reverse` | `boolean` | `false` | Put the label before the track. |

**Events**

- `uiChange` (detail: `boolean`). 

**Slots:** default

## `<ui-tab>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `selected` | `boolean` | `false` | Managed by the parent. |

**Slots:** default

## `<ui-tab-panel>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | Matches the value of its <ui-tab>. |
| `selected` | `boolean` | `false` | Managed by the parent. |

**Slots:** default

## `<ui-table>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumn[]` | `[]` |  |
| `rows` | `TableRow[]` | `[]` |  |
| `row-key` | `string` | `'id'` | Property that uniquely identifies a row (used for selection and custom cell slots). |
| `caption` | `string` |  | Accessible title for the table. |
| `sort` | `TableSort` |  |  |
| `page` | `number` | `1` |  |
| `page-size` | `number` | `10` |  |
| `page-size-options` | `number[]` | `[10, 25, 50, 100]` |  |
| `paginate` | `boolean` | `true` | Turn pagination off to show every row. |
| `manual` | `boolean` | `false` | Server mode: `rows` is just the current page and `total` is the full count. |
| `total` | `number` |  |  |
| `searchable` | `boolean` | `false` |  |
| `resizable` | `boolean` | `false` | Drag the edge of a column header to change its width. |
| `virtual` | `boolean` | `false` | Render only the rows on screen. Needs `maxHeight` (the scroll area) and a fixed `rowHeight`. For large datasets. |
| `row-height` | `number` | `44` | Row height in px for virtual mode. |
| `expandable` | `boolean` | `false` | Add a column of toggles that reveal a detail row (slot named "expand:<rowKey>"). |
| `exportable` | `boolean` | `false` | Show an "Export CSV" button. Exports every row that matches the current search and sort. |
| `export-filename` | `string` | `'table-export'` |  |
| `search-placeholder` | `string` | `'Search'` |  |
| `selectable` | `boolean` | `false` |  |
| `selected` | `string[]` | `[]` | Selected row keys. Survives page changes. |
| `loading` | `boolean` | `false` |  |
| `empty-text` | `string` | `'No results found'` |  |
| `row-clickable` | `boolean` | `false` | Make rows focusable and fire uiRowClick on click or Enter. |
| `striped` | `boolean` | `false` |  |
| `density` | `'comfortable' | 'compact'` | `'comfortable'` |  |
| `max-height` | `string` |  | Scroll the body inside this height (any CSS length). The header stays pinned. |

**Events**

- `uiQueryChange` (detail: `TableQuery`). Fires whenever page, page size, sort or search changes. In manual mode, fetch from this.
- `uiSelectionChange` (detail: `string[]`). 
- `uiRowClick` (detail: `TableRow`). 

**Methods**

- `exportCSV()`. Download the rows as currently filtered and sorted. Every row, not just the visible page.

**Slots:** `bulk-actions`, `toolbar`, `empty`, default

## `<ui-tabs>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  |  |
| `orientation` | `'horizontal' | 'vertical'` | `'horizontal'` |  |
| `activation` | `'auto' | 'manual'` | `'auto'` | "auto" selects a tab as it receives focus; "manual" waits for Enter or Space. |
| `variant` | `'underline' | 'pills'` | `'underline'` |  |
| `label` | `string` |  | Accessible name for the tab list. |

**Events**

- `uiChange` (detail: `string`). 

**Slots:** `tab`, default

## `<ui-tag-input>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | `[]` |  |
| `label` | `string` |  |  |
| `hint` | `string` |  |  |
| `error` | `string` |  |  |
| `placeholder` | `string` |  |  |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `max` | `number` |  | Maximum number of tags. |
| `allow-duplicates` | `boolean` | `false` |  |
| `validate` | `(tag: string)` | `> boolean | string` | Return false (or an error string) to reject a tag. |
| `separators` | `any` | `[',']` | Characters that end a tag, besides Enter. |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |

**Events**

- `uiChange` (detail: `string[]`). 
- `uiReject` (detail: `{ tag: string; reason: string }`). Fires when a tag is refused, with the reason.

**Methods**

- `focusInput()`. 

## `<ui-textarea>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` |  |
| `label` | `string` |  |  |
| `hint` | `string` |  |  |
| `error` | `string` |  |  |
| `name` | `string` |  |  |
| `placeholder` | `string` |  |  |
| `rows` | `number` | `3` |  |
| `disabled` | `boolean` | `false` |  |
| `readonly` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `maxlength` | `number` |  |  |
| `autoresize` | `boolean` | `false` | Grow with content instead of scrolling. |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |

**Events**

- `uiInput` (detail: `string`). 
- `uiChange` (detail: `string`). 

**Methods**

- `focusInput()`. 

## `<ui-theme-toggle>`



## `<ui-time-picker>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` |  |
| `min` | `string` |  |  |
| `max` | `string` |  |  |
| `step` | `number` | `30` | Minutes between suggested slots. |
| `label` | `string` |  |  |
| `hint` | `string` |  |  |
| `error` | `string` |  |  |
| `name` | `string` |  |  |
| `disabled` | `boolean` | `false` |  |
| `required` | `boolean` | `false` |  |
| `locale` | `string` |  |  |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` |  |

**Events**

- `uiChange` (detail: `string`). 

**Methods**

- `focusInput()`. 

## `<ui-toaster>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `placement` | `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'` | `'bottom-right'` |  |
| `max` | `number` | `5` | Most toasts visible at once; the oldest is dropped first. |
| `duration` | `number` | `5000` | Default auto-dismiss time in ms. 0 keeps toasts until dismissed. |

**Methods**

- `show(options: ToastOptions)`. 
- `dismiss(id: string)`. 
- `clear()`. 

## `<ui-tooltip>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `''` |  |
| `placement` | `Placement` | `'top'` |  |
| `delay` | `number` | `300` | ms before showing on hover. |
| `disabled` | `boolean` | `false` |  |

**Slots:** default

## `<ui-tree>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` | `TreeNode[]` | `[]` |  |
| `selected` | `string` |  | Id of the selected node. |
| `expanded` | `string[]` | `[]` | Ids of the expanded nodes. |
| `label` | `string` | `'Tree'` |  |

**Events**

- `uiSelect` (detail: `{ id: string; node: TreeNode }`). 
- `uiToggle` (detail: `{ id: string; expanded: boolean }`). 

## `<ui-virtual-list>`



| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `count` | `number` | `0` | Number of rows in the full list. |
| `row-height` | `number` | `40` |  |
| `height` | `number` | `360` |  |
| `overscan` | `number` | `5` | Extra rows rendered above and below the viewport. |
| `label` | `string` | `'List'` |  |
| `render-row` | `(index: number)` | `> any` | Returns the element for row `index`. |

