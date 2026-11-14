# Bizzi website change log

## 2026-11-14 — M0 / setup
- Created dedicated review branch `feat/municipal-homepage-v07` from `main`.
- Verified `bizzisystems` uses Next.js 14 / React 18; current marketing copy predates Lane Counter strategy.
- Verified `bizzi-pilot-platform` provides Supabase authentication and Mapbox dependencies; neither will be changed in homepage PR.
- Updated product copy constraints from Nov 13 Lane Counter Source of Truth. v0.7 pilot CAD is approved but not printed; v0.6 prototype seal failed; Nov 12 performance did not pass target.
- Locked no-favicon-change rule, preview-only/rollback workflow, and Claude handoff path.

## Pending milestones
- M1a design system and homepage
- M1b validated 3D model viewer
- M1c build and responsive tests

## 2026-11-14 — M1a initial implementation (draft, unaccepted)
- Copied exact BizziLogo.png from pilot repository into `public/brand/bizzi-logo.png` (new asset; favicon files untouched).
- Copied authentic v0.7 CAD assembly isometric SVG into `public/hardware/lane-counter-v07-assembly.svg`.
- Replaced marketing homepage and outdated primary copy with municipal Lane Counter positioning and accurate prototype caveats.
- Added scoped reusable design tokens, typography and responsive shell; rebuilt navigation and footer to remove legacy CurbStrip messaging.
- Built `components/civic/CivicHome.tsx` and CSS module: hero, CAD study, operator component selector/memos, concept architecture, validation facts and CTA.
- Added custom 404, skeleton loading state, and a temporary invite-only portal information route (no auth changes).
- Updated canonical URL to non-www and product metadata; did not modify favicon.
- Added GitHub Actions typecheck/build workflow for PR verification.
- **Not yet done:** GLB conversion, actual three-dimensional exploded interaction, portal routing, booking, city preview, personalization, runtime browser review, accessibility audit.
- **Blockers:** local GitHub clone network resolution failed; Vercel team returned 403 requiring authorization. CI workflow is the only current build signal.
