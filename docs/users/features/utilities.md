# Utilities

Helpers exported from `@omni/core` for logic your app shares with the components.

| Area | Functions | Use |
| --- | --- | --- |
| Dialogs | `confirm`, `prompt` | Promise-based dialogs ([Overlays](overlays.md)) |
| Notifications | `toast`, `toast.success`, `.error`, `.warning`, `.info`, `.dismiss` | Toast messages |
| HTML | `sanitizeHTML`, `isSafeLink`, `isSafeImage` | Safe display ([Safe HTML](safe-html.md)) |
| Files | `validateFiles`, `acceptsType`, `formatBytes` | Upload rules ([File upload](file-upload.md)) |
| Export | `toCSV`, `escapeCell`, `safeFilename` | CSV with formula-injection guard |
| Dates | `parseISO`, `toISO`, `addDays`, `addMonths`, `monthGrid`, `clampISO` | Calendar maths ([Dates](dates.md)) |
| Times | `parseTime`, `toMinutes`, `durationMinutes`, `timeSlots`, `inTimeRange` | Time maths |
| Ranges | `normaliseRange`, `pickDay`, `inRange`, `rangeLength`, `presetRanges` | Date ranges |
| Colour | `hexToHsv`, `hsvToHex`, `contrastRatio`, `luminance`, `readableOn`, `mix` | Colour maths |
| Theme | `generateTheme`, `themeToCSS`, `setThemeMode`, `getThemeMode`, `onThemeChange` | Palettes and modes |
| Charts | `linearScale`, `niceTicks`, `extent`, `compact`, `bars`, `donutSlices` | Chart maths |
| Lists | `moveItem`, `keyboardMove`, `dropIndex`, `moveCard` | Reordering |
| Calendar | `eventsOnDay`, `layoutTimed`, `weekDays` | Scheduler maths |
| Virtualising | `virtualRange`, `scrollToRow` | Large lists |
| Motion | `animateIn`, `staggerIn`, `playExit`, `withViewTransition`, `prefersReducedMotion` | Animations |
| Presence | `nextPhase`, `isMounted` | Exit animation state |
| Messages | `setMessages`, `resetMessages`, `t`, `DEFAULT_MESSAGES` | Translation ([i18n](i18n.md)) |

Full signatures are in the [component and API reference](../../../packages/core/dist-docs/API.md) and in the TypeScript types shipped with each package.
