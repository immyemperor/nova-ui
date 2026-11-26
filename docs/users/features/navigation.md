# Navigation

## Tabs

```html
<ui-tabs label="Project sections" value="overview">
  <ui-tab value="overview">Overview</ui-tab>
  <ui-tab value="activity">Activity</ui-tab>
  <ui-tab value="billing" disabled>Billing</ui-tab>
  <ui-tab-panel value="overview">…</ui-tab-panel>
  <ui-tab-panel value="activity">…</ui-tab-panel>
</ui-tabs>
```

- `variant="pills"` for a segmented look; `orientation="vertical"` for a side list.
- Arrow keys move between tabs. `activation="manual"` waits for Enter or Space.
- Event: `ui-change` with the tab value.

## Accordion

```html
<ui-accordion>
  <ui-accordion-item heading="What is Kvui?" open>…</ui-accordion-item>
  <ui-accordion-item heading="Does it work with Angular?">…</ui-accordion-item>
</ui-accordion>
```

Only one item is open at a time unless you set `multiple`.

## Breadcrumb

```html
<ui-breadcrumb max-items="3">
  <ui-breadcrumb-item href="/">Home</ui-breadcrumb-item>
  <ui-breadcrumb-item href="/projects">Projects</ui-breadcrumb-item>
  <ui-breadcrumb-item>Kvui</ui-breadcrumb-item>
</ui-breadcrumb>
```

The last item is the current page. Long trails fold into an expandable "…".

## Pagination

```html
<ui-pagination page="4" total="240" page-size="10" label="Results"></ui-pagination>
```

Pass `page-count` directly if you know the number of pages. Event: `ui-change` with the new page.

## Stepper

```html
<ui-stepper current="1" clickable>
  <ui-step heading="Account" description="Your details"></ui-step>
  <ui-step heading="Workspace"></ui-step>
  <ui-step heading="Invite"></ui-step>
</ui-stepper>
```

Set `error` on a step to flag a problem. With `clickable`, users can go back to completed steps.

## Site navigation and menubar

```html
<ui-nav-menu label="Site">
  <ui-nav-item label="Home" href="/" current></ui-nav-item>
  <ui-nav-item label="Products">
    <a href="/analytics">Analytics</a>
    <a href="/reports">Reports</a>
  </ui-nav-item>
</ui-nav-menu>

<ui-menubar label="Application">
  <ui-menubar-menu label="File"><ui-menu-item value="new">New</ui-menu-item></ui-menubar-menu>
  <ui-menubar-menu label="Edit"><ui-menu-item value="undo">Undo</ui-menu-item></ui-menubar-menu>
</ui-menubar>
```

Nav items with children open on click, one at a time. In a menubar, once a menu is open, hovering or pressing Left and Right switches menus.

## Sidebar

```html
<ui-sidebar label="Main" storage-key="sidebar">
  <ui-sidebar-item label="Overview" icon="home" current href="/"></ui-sidebar-item>
  <ui-sidebar-item label="Projects" icon="folder" badge="3" href="/projects"></ui-sidebar-item>
  <ui-sidebar-item label="Reports" icon="bar-chart" group open>
    <ui-sidebar-item label="Weekly" href="/weekly"></ui-sidebar-item>
  </ui-sidebar-item>
</ui-sidebar>
```

- `collapsed` shows icons only; labels become tooltips.
- `storage-key` remembers the collapsed state between visits.
- Pair it with `kvui-shell-sidebar` from [layout](layout-and-css.md) to build an app frame.

## Split panes

```html
<ui-split ratio="0.3" min-a="160" min-b="240" storage-key="split">
  <div slot="a">List</div>
  <div slot="b">Detail</div>
</ui-split>
```

Drag the divider, or focus it and use arrows (Shift for larger steps), Home or End. Double-click resets to 50 percent. `ratio` is the first pane's share, from 0 to 1.

## Collapse

```html
<ui-collapse peek="Shipping, returns and exchanges">
  <span slot="label">Delivery</span>
  Full details here.
</ui-collapse>
```

Animates its height smoothly. Use it for disclosure of secondary content, not for primary navigation.

## Carousel

```html
<ui-carousel label="Highlights" slides-per-view="2" autoplay="5000">
  <div>Slide one</div>
  <div>Slide two</div>
</ui-carousel>
```

- Swipe, use the arrows, or pick a dot. Keyboard users can use the arrow buttons and focus the track.
- `slides-per-view` shows several slides at once. `loop` wraps around. `autoplay` (milliseconds) advances automatically, pauses on hover or focus, and has a pause button. Autoplay is off for users who prefer reduced motion.
- Event: `ui-change` with the index of the first visible slide.
