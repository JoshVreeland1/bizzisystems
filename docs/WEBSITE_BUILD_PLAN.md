# Bizzi website redesign — execution plan and takeover contract
Updated: 2026-11-14
Owner: ChatGPT (implementation); Claude (approved takeover builder)
Status: IN PROGRESS — draft PR only; do not merge without owner review.

## Product truth
Primary: Bizzi Lane Counter; separate from secondary PS Sensor. One unit per controlled one-way entrance/exit lane. Proposed cellular → Blues Notehub → Bizzi backend/operator interface. No local LoRaWAN gateway.
As of the Nov 13 engineering Source of Truth in `bizzi-pilot-platform/lane-counter/docs/SOURCE_OF_TRUTH.md`: Prototype A v0.6 exists, but v0.6 seal failed, prototype runs LiPo, and first scored Nov 12 session was 2/12 correct with 10 missed and 3 extra. No proven ≥98% accuracy, 45-second head replacement, 6-month battery, or Modii integration. Do not state targets as facts.
Approved v0.7 CAD is in `bizzi-pilot-platform/lane-counter/cad/v0.7/`: v0.6 with divider relief, moved tap ring and battery connector; external cover/sled/bracket unchanged. Use v0.7 for any renders. The planned pilot redesign after v0.7 is not yet engineered.

## Governance / rollback
- Only work on `feat/municipal-homepage-v07`; never commit to `main`.
- Open/maintain one draft PR for homepage, tracking each commit in this file and PR description.
- Do not edit favicon files, metadata, or icon references.
- Do not modify `bizzi-pilot-platform` repository or auth paths in this PR.
- Any deployment must be preview-only until explicit review and approval.
- Rollback: close PR and delete the feature branch; production `main` is unchanged. If merged later, revert the merge commit via a new PR.
- Components should be isolated with explicit types and public props for Claude takeover; no app-wide dependencies for a local hero feature.

## Locked visual / UX requirements
White/light neutral canvas with surface layers; Bizzi cobalt is a restrained accent, never giant filled panels. Deep navy primary text, slate secondary. Tokens only. One sans, mono only for engineering labels/numerals. 8-point rhythm, 4–8px radii, 1px borders, no card shadows. Buttons: cobalt primary, understated secondary; no black border. WCAG AA contrast. Minimum 44px touch targets on mobile. No horizontal scrolling at 320px+, no content clipping. No gradients, glows, bento rows, oversized badges or decorative motion.
Respect latest user rule: NO parallax, bounce, auto scroll transitions or scroll hijack. Manual exploded hardware interaction may move in <=240ms, and obey reduced motion.
Hero shall display v0.7 engineering-based depiction, not generic mockup. Status labels accurately distinguish prototype from proposed capabilities.
Logo: use supplied `BizziLogo.png` asset; do not alter favicon. If binary upload cannot be completed in connector environment, use a documented temporary vector in preview only, and replace with user asset before launch.

## Roadmap / pass gates
- [x] M0 — inspect GitHub projects and Nov 13 source of truth; branch isolation.
- [x] M1a foundation (not yet accepted) — implement design tokens, accessible Nav and CTAs, landing page hero, actual v0.7 CAD-derived visual, and custom 404. Preserve existing secondary routes and favicon.
- [ ] M1b — model conversion from v0.7 STEP to optimized GLB meshes with part IDs; manual explode/reassemble, keyboard selection, operator memos, media fallback. Do not claim completed 3D interaction until asset and functionality are verified.
- [ ] M1c — test Next production build, 320/375/768/1440 widths, no horizontal overflow, controls, accessibility, 404, keyboard, reduced motion. Fix defects before preview acceptance.
- [ ] M2 — city-level *illustrative* preview (location input, grounded facilities, no fake real-time occupancy or lane layouts), no email gate.
- [ ] M3 — meeting booking flow with verified provider and backend persistence; no false success; privacy disclosures.
- [ ] M4 — consent-aware deterministic visitor preferences and personalization. User can clear preferences.
- [ ] M5 — link existing invite-only portal login. Audit Supabase auth and permissions; do not modify authorization without separate PR and tests.
- [ ] M6 — SEO, security, A11y, performance review, deployment and rollback rehearsal.

## Current implementation notes (Nov 14)
- Homepage implementation committed: tokens, navigation, responsive hero, CAD v0.7 assembly drawing, operator component memos, candid validation, 404 and loading skeletons.
- Current hardware image is the **authentic v0.7 CAD SVG**; it is not yet an interactive GLB/3D viewer. Do not describe M1b as complete.
- Current login route is a truthful temporary information page; portal URL/auth routing is not yet integrated.
- Current contact page still uses legacy mailto behavior; proper scheduling/lead backend is M3.
- Vercel access requires authorization; local clone failed because the container DNS could not resolve github.com. GitHub Actions CI added; do not claim responsive or build acceptance until checks run.
- Main site has older secondary pages (investors/waitlist/contact) not yet reworked. These need copy/content audit before launch.

## Claude takeover protocol
Read this file, `docs/WEBSITE_CHANGELOG.md`, full draft PR diff, v0.7 README and `SOURCE_OF_TRUTH.md` before editing. Confirm base SHA, run build and viewport tests, inspect designs before adding dependencies. Work on the same feature branch with small semantic commits (or branch from it for reviewed changes). Update both change log and PR description for every milestone, note any unvalidated assumptions and incomplete tests. Never overwrite the build plan or alter pilot repo outside separately approved PRs.
