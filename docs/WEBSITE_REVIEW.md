# Swiss homepage review — 2026-11-14
Status: local build and browser verification passed. Owner visual acceptance pending. Draft PR #1 only; no production changes.

## Verified
- `npm run build`: success; 14 routes generated. `npx tsc --noEmit` and `git diff --check`: success.
- `node scripts/website-smoke.cjs`: success against built Next production server using headless Chromium with software graphics.
- Homepage HTTP 200; exactly one H1; revised copy; no rejected slogans/internal performance targets.
- 320×700, 375×812, 768×1024, 1440×900: no horizontal overflow (1px rounding allowance); desktop 60/40 composition; real CAD drawing; independent component memos; no page runtime errors.
- Real GLB loads; selected parts highlight; explode/reassemble controls work; assembly/exploded screenshots captured. The viewer renders on demand and supports arrow keys and drag.
- Reduced-motion preference removes CSS transitions.
- Contact and waitlist at 320px: correctly labeled fields; valid input opens a draft request; status explicitly requires sending; values retained; no overflow. No email sent. No booking or stored signup claimed.
- Skip link is first keyboard stop and moves focus to main. Custom 404 returns 404. Existing login reaches exactly the established pilot login URL; external destination intercepted during test to avoid touching authentication.
- Icon file unchanged; hash `08cbab8286be5d8a1a5d63ed07e066b73ba9a7a1`. No icon metadata edits.
- CAD check in pilot PR #9: four named GLB meshes, original STL positions preserved within 0.1µm export precision, 913,740 bytes, SHA256 `b0f2b37207031c3e79e4ccbfdbe2dca3f2f2a67e6dfcc1dad6db58d13468b617`.
- Token contrast ratios: muted/paper 5.55, secondary/paper 8.72, white/blue 6.28, blue/paper 5.61. Orange is a decorative mark with text context.

## Screenshots
Local and CI output: `artifacts/website-smoke/` (generated; intentionally ignored by Git). CI uploads them as `website-review-screenshots` on each PR check.
- `hero-1440.png`: desktop hero viewport.
- `home-{320,375,768,1440}.png`: full homepage at each breakpoint.
- `hardware-assembled.png`, `hardware-exploded.png`: actual rendered GLB.
- `contact-320.png`, `waitlist-320.png`: email request state and retained values.

## Limits / next work
Owner must judge visual quality. This is a targeted browser and contrast review, not a complete WCAG audit. Legacy team/investors/legal pages need a separate review before launch. Real scheduling and persisted waitlist remain pending provider/backend choice; owner confirmed no current waitlist provider. No city map or personalization implementation is included before homepage acceptance. Full dependency/security and device/screen-reader audits remain release gates.

The SVG’s line weight alone was increased for screen readability; source CAD paths remain intact. Display materials and exploded offsets do not modify the GLB or imply production hardware performance.

## Hosted CI follow-up
The first hosted revision passed typecheck/build and failed at browser installation because `ubuntu-latest` became Ubuntu 26.04, unsupported by Playwright 1.58.2. The review workflow now pins supported Ubuntu 24.04. This changes only test infrastructure; local browser evidence above remains valid.
