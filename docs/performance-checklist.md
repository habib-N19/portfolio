# Performance Verification Checklist

## Baseline and Re-check Workflow

1. Start local app:

```bash
bun dev
```

2. Open Chrome DevTools Performance and record a reload trace at `http://localhost:3000`.
3. Re-run after each performance-focused change.
4. Keep notes for:
   - LCP (focus on render delay)
   - total JS requests before first interactive hero
   - forced reflow hotspots

## Acceptance Targets

- Hero heading renders immediately (no loader gating).
- WebGL background does not load on mobile or reduced-motion.
- Devtools are not eagerly loaded in root critical path.
- Invalid PostHog keys produce no request noise.
- Hero/media images request responsive widths and compressed modern formats.

## Local Validation Commands

```bash
bun test
bun check
```

## Notes

- Development traces are noisier due to HMR and source transforms.
- Focus on relative improvements in render delay and critical-path request depth.
