# Portfolio Performance Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve real-world first-load performance by reducing render delay, shrinking initial JS work, and deferring non-critical visual/analytics features while preserving the current design.

**Architecture:** Keep TanStack Start routing/SSR intact, but move expensive UI work off the critical path. Render primary hero content immediately, defer decorative/runtime-heavy features (WebGL, some GSAP behavior, analytics), and tighten image + runtime loading behavior based on device capability and user preference.

**Tech Stack:** TanStack Start, React 19, Vite, GSAP, @react-three/fiber/three, PostHog, Vitest, Biome.

---

### Task 1: Add Performance Guard Utilities (single source of truth)

**Files:**
- Create: `src/lib/performance.ts`
- Test: `src/lib/performance.test.ts`

**Step 1: Write failing tests for capability detection helpers**

```ts
import { describe, expect, it } from "vitest";
import {
  shouldUseEnhancedEffects,
  shouldEnableWebGLBackground,
} from "./performance";

describe("performance guards", () => {
  it("disables enhanced effects for reduced motion", () => {
    expect(
      shouldUseEnhancedEffects({ prefersReducedMotion: true, isMobile: false }),
    ).toBe(false);
  });

  it("disables webgl on mobile", () => {
    expect(
      shouldEnableWebGLBackground({ isMobile: true, prefersReducedMotion: false }),
    ).toBe(false);
  });

  it("enables webgl on desktop with motion allowed", () => {
    expect(
      shouldEnableWebGLBackground({ isMobile: false, prefersReducedMotion: false }),
    ).toBe(true);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `bun test src/lib/performance.test.ts`
Expected: FAIL (module/functions missing)

**Step 3: Implement minimal helpers**

```ts
export type PerfSignals = {
  isMobile: boolean;
  prefersReducedMotion: boolean;
};

export function shouldUseEnhancedEffects(signals: PerfSignals) {
  return !signals.prefersReducedMotion;
}

export function shouldEnableWebGLBackground(signals: PerfSignals) {
  return !signals.isMobile && !signals.prefersReducedMotion;
}
```

**Step 4: Re-run tests**

Run: `bun test src/lib/performance.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/performance.ts src/lib/performance.test.ts
git commit -m "feat: add performance capability guards"
```

---

### Task 2: Remove Loader as Critical Rendering Gate

**Files:**
- Modify: `src/routes/index.tsx`
- Modify: `src/components/portfolio/Loader.tsx`
- Test: `src/routes/index.test.tsx`

**Step 1: Write failing route test proving hero renders immediately**

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortfolioPage } from "./index";

describe("PortfolioPage", () => {
  it("renders hero content without waiting for loader completion", () => {
    render(<PortfolioPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails with current loader gating**

Run: `bun test src/routes/index.test.tsx`
Expected: FAIL

**Step 3: Implement minimal rendering change**
- Keep loader visual but do not block hero/main tree render.
- Convert loader to optional overlay with max duration cap and instant skip for reduced motion/return visits.
- Ensure no state branch hides `<main>`.

**Step 4: Re-run test**

Run: `bun test src/routes/index.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/routes/index.tsx src/components/portfolio/Loader.tsx src/routes/index.test.tsx
git commit -m "perf: render hero immediately and make loader non-blocking"
```

---

### Task 3: Defer WebGL Background to Idle + Eligible Devices

**Files:**
- Modify: `src/routes/index.tsx`
- Modify: `src/components/portfolio/WebGLBackground.tsx`
- Test: `src/routes/index.test.tsx`

**Step 1: Write failing test for deferred WebGL mount**

```ts
it("does not mount webgl background before idle signal", () => {
  // render page and assert no #webgl-bg initially
});
```

**Step 2: Run test to verify failure**

Run: `bun test src/routes/index.test.tsx`
Expected: FAIL

**Step 3: Implement minimal deferral**
- Add `shouldRenderWebGL` state default `false`.
- Flip to `true` via `requestIdleCallback` (fallback setTimeout).
- Gate by `shouldEnableWebGLBackground(...)` from `src/lib/performance.ts`.
- Keep existing lazy import for `WebGLBackground`.

**Step 4: Re-run tests**

Run: `bun test src/routes/index.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/routes/index.tsx src/components/portfolio/WebGLBackground.tsx src/routes/index.test.tsx
git commit -m "perf: defer webgl background to idle and capable devices"
```

---

### Task 4: Prevent Devtools from Entering Root Critical Path

**Files:**
- Modify: `src/routes/__root.tsx`
- Create: `src/integrations/tanstack-query/devtools.lazy.tsx`

**Step 1: Write failing assertion for no eager devtools imports in root**

```ts
// lightweight string-level check test or route render timing test
```

**Step 2: Run test to verify fail**

Run: `bun test`
Expected: FAIL

**Step 3: Implement minimal change**
- Remove top-level imports of `@tanstack/react-devtools`, router devtools panel, and query devtools plugin.
- Use dynamic import inside `if (import.meta.env.DEV)` code path.
- Keep behavior identical in dev, absent in prod bundles.

**Step 4: Re-run tests**

Run: `bun test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/routes/__root.tsx src/integrations/tanstack-query/devtools.lazy.tsx
git commit -m "perf: lazy-load tanstack devtools in dev only"
```

---

### Task 5: Harden PostHog Initialization and Remove Noisy Failures

**Files:**
- Modify: `src/integrations/posthog/provider.tsx`
- Modify: `src/env.ts`
- Test: `src/integrations/posthog/provider.test.tsx`

**Step 1: Write failing test for invalid key guard**

```ts
it("skips posthog init when key is missing or placeholder", () => {
  // expect init import path not called for "phc_xxx"
});
```

**Step 2: Run test and verify failure**

Run: `bun test src/integrations/posthog/provider.test.tsx`
Expected: FAIL

**Step 3: Implement minimal guard**
- Centralize env access in `src/env.ts`.
- Skip init for blank/placeholder/dev keys.
- Keep idle loading path for valid prod key.

**Step 4: Re-run tests**

Run: `bun test src/integrations/posthog/provider.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/integrations/posthog/provider.tsx src/env.ts src/integrations/posthog/provider.test.tsx
git commit -m "perf: guard posthog init against invalid keys"
```

---

### Task 6: Tighten Hero/Project Media Loading Policy

**Files:**
- Modify: `src/components/portfolio/HeroVariantB.tsx`
- Modify: `src/data/projects.ts` (if needed for media metadata)
- Test: `src/components/portfolio/HeroVariantB.test.tsx`

**Step 1: Write failing tests for image attributes**

```ts
it("uses responsive sizes and modern format params for hero media", () => {
  // assert src contains auto=format and fit constraints
});

it("limits fetchPriority high to the first visible hero media only", () => {
  // assert one high-priority image in hero
});
```

**Step 2: Run tests and verify failure**

Run: `bun test src/components/portfolio/HeroVariantB.test.tsx`
Expected: FAIL

**Step 3: Implement minimal image optimization**
- Use explicit URL builder helper for Unsplash params (`auto=format,compress`, `q`, width caps).
- Lower mobile target widths.
- Keep `loading="lazy"` for modal/gallery media.

**Step 4: Re-run tests**

Run: `bun test src/components/portfolio/HeroVariantB.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/portfolio/HeroVariantB.tsx src/data/projects.ts src/components/portfolio/HeroVariantB.test.tsx
git commit -m "perf: optimize hero and project media request strategy"
```

---

### Task 7: Reduce ScrollTrigger/GSAP Reflow Pressure

**Files:**
- Modify: `src/components/portfolio/HeroVariantB.tsx`
- Modify: `src/lib/gsap-setup.ts`

**Step 1: Write failing test for trigger lifecycle cleanup**

```ts
it("cleans up ScrollTrigger instances when project modal closes", () => {
  // mount, open, close, assert kill/cleanup called
});
```

**Step 2: Run test and verify failure**

Run: `bun test`
Expected: FAIL

**Step 3: Implement minimal changes**
- Scope all ScrollTrigger creation to modal-open lifecycle.
- Kill/revert in cleanup and on close.
- Avoid repeated global selector work where possible.

**Step 4: Re-run tests**

Run: `bun test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/portfolio/HeroVariantB.tsx src/lib/gsap-setup.ts
git commit -m "perf: scope and clean up gsap scroll triggers"
```

---

### Task 8: Verify via Dev/Prod-Like Profiling Checklist

**Files:**
- Create: `docs/performance-checklist.md`

**Step 1: Add repeatable measurement checklist**
- Chrome trace on dev (`bun dev`) for regressions.
- Preview/server trace for prod-like behavior when needed.
- Define target budgets for LCP/TBT/JS requests.

**Step 2: Add exact command snippets**

```bash
bun dev
bun test
bun lint
```

**Step 3: Define acceptance criteria**
- Hero text visible < 1s on local desktop without waiting for loader.
- LCP render delay reduced materially vs baseline.
- No 401/404 PostHog noise on local without valid key.
- WebGL absent on mobile/reduced-motion.

**Step 4: Commit**

```bash
git add docs/performance-checklist.md
git commit -m "docs: add repeatable performance verification checklist"
```

---

## Final Integration Pass

1. Run full tests: `bun test`
2. Run static checks: `bun check`
3. Run local profile pass in Chrome DevTools and compare against baseline numbers.
4. Ship in small PR(s):
   - PR A: loader + webgl deferral
   - PR B: devtools + posthog hardening
   - PR C: media + gsap refinements
