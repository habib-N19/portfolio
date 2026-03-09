---
title: "GSAP SplitText: A Case Study in Patience"
date: "2026-04-20"
description: "Character-level reveals feel magical when timed right and nauseating when timed wrong. Here's where the line is."
tags: ["GSAP", "Animation", "UX"]
image: "/blog/gsap-splittext.jpg"
published: true
---

Character-level text animations are the difference between a portfolio that feels alive and one that feels like a loading screen. The gap between those two outcomes is about 200 milliseconds.

## The Temptation

GSAP's SplitText plugin splits any text element into characters, words, or lines. Each fragment becomes its own `<span>`, independently animatable. The moment you see this working, the temptation is overwhelming: animate *everything*.

Headers slide in character by character. Paragraphs cascade word by word. Navigation links tumble into place with elastic easing. It looks incredible in your browser at 2am. It's unbearable to everyone else.

## The Rule

After building (and scrapping) three versions of this portfolio's animations, I arrived at a rule:

> **Animate text only when the user is waiting, never when they're reading.**

This means:

- **Hero headline on first load:** Yes. The user expects a moment of theatre.
- **Section headers on scroll:** Yes, but words only, not characters. And fast — 0.4s total.
- **Body text:** Never. Body text should be *there* when you arrive. Animating it forces the user to wait for permission to read.

## The Implementation

```typescript
useGSAP(() => {
  const split = new SplitText(headingRef.current, { type: "chars" });
  
  gsap.from(split.chars, {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.02, // 20ms between each character
    ease: "power3.out",
    delay: 0.3,    // Wait for page to settle
  });
  
  return () => split.revert(); // Clean up DOM mutations
}, { scope: containerRef });
```

The critical numbers:

- **`stagger: 0.02`** — 20ms between characters. Fast enough to read as a wave, slow enough to perceive individual letters. Go below 15ms and it looks like a regular fade-in. Go above 40ms and it feels sluggish.
- **`duration: 0.6`** — Each character's individual animation time. Long enough for the `y: 40` movement to be smooth, short enough that the last character finishes within 1.5s of the first.
- **`delay: 0.3`** — Give the page 300ms to finish layout. Animating during layout shift is jarring.

## The Easing Mistake

`elastic` and `bounce` easings are tempting for character reveals. Don't use them. Text that bounces into place suggests playfulness, which is fine for a children's game but wrong for a professional portfolio.

`power3.out` is the correct default. The character accelerates quickly out of its starting position and decelerates into its final position. It feels decisive — like the text *wants* to be there.

## When to Break the Rule

There's one exception: the 404 page. When the user hits a dead end, the rules of editorial restraint no longer apply. That's where you can let the numbers scatter, let the characters bounce, let the animation be genuinely fun. The user is already lost — you might as well entertain them.
