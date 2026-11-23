# Motion

Motion explains change; it never carries information on its own. Every animation here respects `prefers-reduced-motion`, and users who prefer less motion see the final state immediately.

## Entrance on scroll

```html
<ui-reveal animation="slide-up" duration="500" delay="0" threshold="0.15">
  <p>Appears when scrolled into view.</p>
</ui-reveal>
```

`animation`: `fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right` or `scale`. `repeat` replays each time it re-enters the view. Event: `ui-reveal`.

## Staggered entrance

```html
<ui-stagger animation="slide-up" step="70" trigger="visible">
  <p>First</p><p>Second</p><p>Third</p>
</ui-stagger>
```

`trigger="load"` plays at once; `visible` waits until scrolled into view.

## Counters

```html
<ui-counter value="12840" locale="en-US" duration="1200"></ui-counter>
<ui-counter value="99.9" decimals="1" suffix-text="%"></ui-counter>
```

Counts up when visible. Screen readers hear the final value only.

## Marquee

```html
<ui-marquee speed="40" pause-on-hover>
  <img src="/logo-a.svg" alt="Acme" /><img src="/logo-b.svg" alt="Globex" />
</ui-marquee>
```

An endless ticker. It stops for reduced-motion users.

## Scroll progress

```html
<ui-scroll-progress label="Reading progress"></ui-scroll-progress>
```

A fixed bar that tracks how far the page has scrolled, or a container with `target`.

## Helpers

```ts
import { animateIn, staggerIn, playExit, withViewTransition } from '@omni/core';

await animateIn(el, 'fade', { duration: 300 });
await playExit(el);                          // animate out before removing
await withViewTransition(() => swapPage());  // cross-fade between states
```

- `withViewTransition` uses the browser's View Transitions API where it exists and updates immediately where it doesn't.
- In React, `usePresence(open, ms)` keeps an element mounted while it exits. See [React](../frameworks/react.md).

## Scroll-linked CSS

With `@omni/css`: `nova-scroll-reveal` ties an element's fade and rise to its position in the viewport, and `nova-scroll-progress` scales an element with page scroll. No JavaScript runs.
