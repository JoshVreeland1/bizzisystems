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

## 2026-11-14 — M1 revision: Swiss direction restored
Supersedes the unaccepted M1a visual guidance above. Previous history is retained; baseline before this revision: `6b5d3625e11778a618644be9451c716ee07d9296`.

- Rebuilt shared navigation/footer and homepage with 1.5px black mathematical grid, square corners, archival off-white/white surfaces, Signal Blue and a single restrained orange status mark. Desktop hero is 60/40; mobile stacks without horizontal clipping.
- Replaced rejected slogan fragments with the requested occupancy heading and short practical explanations of camera-free/wire-free sensing, parking-wide operator data and planned driver guidance. Replaced internal metrics/targets with clear PS Sensor vs Lane Counter vs roadmap context.
- Restored hard-offset CTA hover (translation, expanding offset and arrow movement), active and visible keyboard states, with reduced-motion support. Added a keyboard skip link and focusable main landmark.
- Switched Inter download to native Helvetica Neue/Helvetica/Arial for the neo-grotesk direction and offline/reliable builds. No favicon changes; icon hash remains `08cbab8286be5d8a1a5d63ed07e066b73ba9a7a1`.
- Retained original Bizzi logo. Increased only SVG presentation stroke weight from 0.25 to 0.65 for readable linework; CAD paths/geometry unchanged.
- Copied exact 913,740-byte four-part v0.7 GLB from pilot export commit `d56a59a`. Added on-demand Three.js viewer, keyboard/drag rotation, component highlighting, explode/reassemble and automatic viewport framing. No auto-rotation or continuous render loop. Explicit static fallback, loading and retry behavior; GPU resources and listeners cleaned up on unmount.
- Kept each component memo independent and reserved height; no overlapping text transitions. Updated responsive loading skeleton to match the hero.
- Replaced missing `/api/waitlist` submission and legacy contact reset behavior with a shared labeled, validated email request form. Owner confirmed `josh@bizzisystems.com` and no existing waitlist provider. UI explains that a draft must be sent and nothing is saved/booked; entries remain. No emails sent by implementation or browser tests.
- Updated automated browser checks for revised copy, 60/40 split, four viewport widths, memo selection, actual WebGL rendering, exploded model screenshots, reduced motion, form entry retention, skip-link focus, 404 and existing login redirect. Headless Chromium explicitly uses software graphics for the CAD check.
- Updated build plan and Claude handoff with module interfaces, provenance, rollback and remaining provider/secondary-page work. Coordinated pilot PR #9 with a read-only exact-vertex verifier, workflow verification step and WEBSITE_HANDOFF.md; no pilot runtime, auth, firmware, database or engineering-source changes.

### Verification record
- Production build and TypeScript: passed locally; all 14 routes generated.
- CAD verifier: all four parts match approved STL positions in both directions within 0.1µm export tolerance. SHA256 recorded in build plan.
- Token contrast: muted on paper 5.55:1, secondary on paper 8.72:1, white on blue 6.28:1, blue on paper 5.61:1. Full WCAG audit remains a launch gate.
- Final browser results and screenshot paths: recorded in WEBSITE_REVIEW.md after verification. Owner visual acceptance remains pending; both PRs stay drafts and production is unchanged.
