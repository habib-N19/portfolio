---
title: "Building a Custom Cursor With 7 Semantic States"
date: "2026-02-18"
description: "Most custom cursors are decorative. This one communicates — play icons on video, arrows on external links, text carets on selectable content."
tags: ["UI", "Interaction", "CSS"]
image: "/blog/custom-cursor.jpg"
published: true
---

Custom cursors are the most polarizing element in web design. Half the internet thinks they're a usability crime. The other half thinks they're essential for personality. Both are right, depending on the implementation.

The cursor on this portfolio is custom, but it's not decorative — it's *semantic*. It changes shape and behavior based on what it's hovering over, communicating affordance before the click.

## The 7 States

| State | Trigger | Visual | Purpose |
|-------|---------|--------|---------|
| Default | No hover target | Small dot | Stay out of the way |
| Link | `data-cursor="link"` | Expanded circle | "This is clickable" |
| Text | `data-cursor="text"` | Vertical bar | "This is selectable" |
| View | `data-cursor="view"` | "VIEW" label | "Click to see more" |
| Play | `data-cursor="play"` | Play triangle | "Click to play media" |
| Drag | `data-cursor="drag"` | Bi-directional arrows | "Click and drag" |
| Hidden | `data-cursor="none"` | Invisible | "Native cursor needed" |

## The Architecture

The cursor is a single `<div>` positioned with `position: fixed` and tracked via `mousemove`. No, you cannot use CSS `cursor: url(...)` for this — custom cursor images don't support animation, blend modes, or dynamic content.

```typescript
const handleMouseMove = useCallback((e: MouseEvent) => {
  // Use GSAP quickTo for 60fps interpolated movement
  xTo.current?.(e.clientX);
  yTo.current?.(e.clientY);
  
  // Check hover target for cursor state
  const target = (e.target as HTMLElement).closest('[data-cursor]');
  const state = target?.getAttribute('data-cursor') ?? 'default';
  setCursorState(state);
}, []);
```

The key insight: `closest('[data-cursor]')` bubbles up the DOM tree. You don't need to attach event listeners to every interactive element. One global `mousemove` handler checks the nearest ancestor with a `data-cursor` attribute.

## Why GSAP quickTo Instead of Direct Positioning

Setting `left` and `top` directly on every mouse move creates a cursor that's pixel-perfect but *sterile*. It matches the system cursor exactly, which makes the custom cursor feel like a skin, not a design element.

`gsap.quickTo` adds interpolation — the custom cursor *follows* the mouse with a slight physical lag (40ms at `power3` easing). This creates the feeling that the cursor has weight, which paradoxically makes it feel *more* responsive because the user perceives momentum.

## The Accessibility Escape Hatch

Custom cursors must be optional. Users with motor impairments often rely on cursor size and position being predictable. The `data-cursor="none"` state exists specifically for form inputs and text areas where the native cursor behavior is critical.

Additionally, the entire custom cursor system is disabled when:

- `prefers-reduced-motion` is active
- The device has `pointer: coarse` (touch screens)
- The viewport is below 768px (mobile)

```css
@media (pointer: coarse), (prefers-reduced-motion: reduce) {
  .custom-cursor { display: none !important; }
}
```

## The Result

A cursor that communicates more than it decorates. Users don't think "oh, a custom cursor" — they think "I know what clicking here will do." That's the difference between a gimmick and a design system component.
