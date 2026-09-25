# QA — 25 September 2026

## Build

- ESLint passed.
- Next.js production build and TypeScript validation passed.
- Static export generated in `out/`.

## Browser verification

Chromium browser checks passed at 1440×960, 390×844 and 320×740. Small-screen tests simulate touch devices; physical iOS/Android testing has not been performed.

- Initial page has no automatic music playback.
- Opening reveals the story and starts music following the user's click.
- Both supplied songs load, play and pause; changing the track updates the source and title.
- Music panel closes with Escape; playback controls are outside the reading area.
- All five letter chapters can be navigated and the complete-letter view works.
- Complete letter was compared against `../data.txt`, ignoring whitespace only: original Malay-English wording preserved.
- All five photos and their corresponding captions display; carousel wraps and swipe advances on touch screens.
- Four promise flowers reveal their messages in any order.
- Both final response branches show the requested message.
- No horizontal document overflow at the tested viewport sizes.
- Vertical scrolling remains available after all interactions.
- No uncaught browser errors or failed HTTP responses during the checked flows.
- Reduced-motion preference disables animations.

Screenshots were visually reviewed for opening, letter, gallery, promises and final response. Responses are local only; no delivery, email notification or analytics endpoint exists.

## Delivery

Project is prepared locally. No GitHub push or public deployment has been performed. QR code creation is handled by the owner.
