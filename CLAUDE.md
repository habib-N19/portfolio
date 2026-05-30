# habib-portfolio — project notes for Claude

## Naming

- **RTEC = Rangpur Textile Engineering College.** Not Rajshahi Technical College.
  Anywhere you see "Rajshahi Technical College" in this repo it is wrong and should
  read "Rangpur Textile Engineering College." Affected at least:
  - `src/data/projects.ts` (RTEC project entry)
  - `docs/remotion-briefs/rtec.md`
  - `remotion/src/Rtec/scenes/TitleScene.tsx` (and the rendered `public/project-videos/rtec.mp4`)

## Stack

- TanStack Start (React 19, Vite) + Tailwind. Bun for everything.
- Remotion compositions live in `remotion/`; render scripts in `remotion/package.json`.
- Project case-study videos render to `public/project-videos/<slug>.mp4` and are
  attached via `heroMedia` on entries in `src/data/projects.ts`.

## Conventions

- `heroMedia` is consumed in three places: the hero preview card and hero modal
  in `src/components/portfolio/HeroVariantB.tsx`, and the work-section modal in
  `src/components/portfolio/WorkProjectModal.tsx`. Keep all three in sync when
  adding new media types.
- `react-grab` is loaded in DEV only from `src/routes/__root.tsx` for quick
  element-pointing while iterating.
