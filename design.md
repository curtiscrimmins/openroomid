# Design: OpenRoomID

The locked design system for openroomid.org. Every page reads this file
before changing. Tokens live in `tokens.css`.

## Genre
Editorial, standards-body register. Public infrastructure, not a product.

## Macrostructure family
- Home: Long Document with a document status rail (two columns at 900px and up).
- Documents (spec, paper, registry, implementation, changelog): Long Document, single column, 44rem measure.
- Resolver records: the same shell, rendered as standalone HTML from `src/lib/resolver-html.ts`.

## Theme
- Paper `oklch(99% 0.002 250)`, panel `oklch(96.6% 0.004 250)`, rule `oklch(88.5% 0.006 250)`
- Muted `oklch(47% 0.012 255)`, ink `oklch(21% 0.012 255)`
- Registry blue `oklch(42% 0.13 262)`: the unit suffix, links, and focus only. Never a background.

## Typography
- Words: Public Sans 400, 500, 600, 700. Headings 600, tracking -0.025em at h1.
- Identifiers and code: IBM Plex Mono 400, 500, 600. Nothing else is set in mono.
- Sentence case everywhere. No uppercase, no tracked labels, no italic headings.

## Structure rules
- Section openings take an ink rule. Rows take a light rule.
- Front matter (status, version, editors, license, feedback) appears at the top of every normative or draft document.
- Radius 3px on fields, buttons, panels. No shadows, gradients, or illustrations.
- The mark is the only symbol. Primary navigation carries documents only.

## Motion
None beyond 120ms color transitions on links and buttons. Reduced motion respected.

## Voice
Plain statements of fact. Buttons name the action. The registry never sells.
