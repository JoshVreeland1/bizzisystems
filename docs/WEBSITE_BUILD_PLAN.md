# Bizzi website — build plan and Claude handoff
Updated: 2026-11-14. Review only: draft PR #1, branch `feat/municipal-homepage-v07`.

## Governing brief
The Nov 14 Swiss correction supersedes the initial generic SaaS direction. Classic Swiss International Typographic Style: visible 1.5px #111111 rules, zero radii, #F4F2EC paper and white surfaces, #0047FF Signal Blue for actions/selection, restrained #FF4F00 status marks. Helvetica Neue / Helvetica / Arial system stack; mono annotations and tabular numbers. Full-width mathematical grid, desktop 60/40 hero, readable oversized heading, crosshairs and CAD coordinates. No bento, gradients, generic slogan fragments, invented device photography, or public engineering scorecards. Hard-offset CTA expands on hover through translation and shadow without changing layout; reduced motion disables transitions.

## Public product truth
- PS Sensor: stall/bay occupancy validation, as confirmed by owner. Do not transfer that validation to Lane Counter.
- Lane Counter: camera-free, battery/cellular architecture for one controlled one-way entry/exit lane. v0.7 is an approved CAD baseline, not proof of validated sensing, sealing, battery life or production readiness.
- Turnkey service: planned sensors, connectivity, operator data across lots/garages. Driver availability map is a future offering. No invented live counts, integrations, accuracy figures or launch dates.
- Engineering source: `bizzi-pilot-platform/lane-counter/docs/SOURCE_OF_TRUTH.md`. Internal gate metrics remain out of public UI.
- Goal: explain the offering, request a deployment call, request waitlist updates. No checkout.

## Isolation and rollback
- Never merge or push to main, change production, or change favicon files/metadata/icon references.
- Website work stays in PR #1. CAD export work stays in pilot PR #9 (`assets/web-lane-counter-v07`). No pilot runtime/auth/firmware/database/CAD-source edits.
- Existing `/login` redirects to established pilot login; homepage uses footer entry for invited operators.
- Rollback this revision by reverting its commit; earlier draft baseline is `6b5d3625e11778a618644be9451c716ee07d9296`. Closing the unmerged drafts leaves production unchanged.

## Implemented in this revision
- Swiss nav, 60/40 hero, neutral informational band (no fake live telemetry), platform rows, hardware explorer, markets, restrained validation and contact section.
- Original logo retained; actual v0.7 SVG used for hero; system typography removes remote font fetches.
- On-demand Three.js viewer: exact four-part GLB copied byte-for-byte from pilot PR #9 at `d56a59ad06794f41e851acfb484c7b88eee23627`. Selection highlights a part; exploded offsets are presentation-only. Original vertices and assembly positions restored when reassembled. Static fallback, loading and retry states; no continuous rendering loop.
- Shared InquiryForm replaces legacy reset-on-mailto contact and broken `/api/waitlist` submission. Owner confirmed `josh@bizzisystems.com`; no booking/waitlist service exists. Forms validate fields, open an email draft, retain entries, and explicitly state nothing is stored or booked. Visitor must send the draft. No test message is sent.
- Custom 404 preserved; responsive skeleton updated. Existing team/investors/legal routes still need a separate content/design audit before launch.

## Verification and acceptance
- Run `npm ci`, `npx tsc --noEmit`, `npm run build`.
- Browser suite: install Playwright as documented in CI, then `node scripts/website-smoke.cjs`. Screenshots under ignored `artifacts/website-smoke/`. Includes 320/375/768/1440 overflow, 60/40 grid, component memo, actual WebGL loading, explode/reassemble, reduced motion, email request behavior, keyboard skip link, 404 and portal redirect.
- CAD: pilot `python3 scripts/verify_lane_v07_web.py` checks all four meshes against approved STL vertices in both directions at 0.1µm tolerance. GLB 913,740 bytes; SHA256 `b0f2b37207031c3e79e4ccbfdbe2dca3f2f2a67e6dfcc1dad6db58d13468b617`.
- Local production build, TypeScript and browser suite passed; evidence and screenshot inventory are in `docs/WEBSITE_REVIEW.md`.
- Visual review by owner remains required. Automated checks do not certify full WCAG conformance or hardware performance.

## Remaining milestones
1. Owner visual acceptance of homepage and CAD viewer. Keep both PRs drafts.
2. Replace email request flow with real booking and persisted waitlist once provider/backend is chosen. Never show false success. Add consent and failure/retry behavior with persistence.
3. City visualization and visitor personalization, separately approved after homepage acceptance. Any illustrative map must be labeled and use grounded facilities, without fake availability.
4. Audit legacy secondary pages, full accessibility, performance, security/dependency review and preview acceptance before release. No production deployment authorized here.

## Claude takeover
Read this plan, WEBSITE_CHANGELOG.md, both draft PR diffs, CAD README/provenance and engineering source of truth. Confirm current head before editing. Preserve exact visual tokens and fact distinctions. Components: CivicHome owns selection/view state; HardwareViewer accepts typed `selected` and `exploded`; InquiryForm accepts `kind`. Keep bounded modules, update both docs and PR chronology per milestone, run the meaningful checks above, and record limits honestly.
