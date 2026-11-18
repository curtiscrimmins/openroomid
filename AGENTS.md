# AGENTS.md

Standing rules for any coding agent in this repo. Current task: `docs/codex-brief-v0.3.md`.

## What this is

OpenRoomID: an open standard and free public registry giving each hotel accommodation unit a permanent public identifier (`roomID`, format `PPPPPPPP-ROOM-U`). The registrar is the OpenRoomID Project. Roomza, Inc. is the founding sponsor only. The working group is Curtis Crimmins, with Claude as drafter; its resolutions are in `DECISIONS.md`.

## Hard rules

- **The registry holds identity, never intelligence.** No scores, condition, noise, rates, availability, counts, guest data or room attributes, ever, in any table, endpoint, dump or schema. The migration file carries a schema guard comment saying so. Keep it.
- **The spec is law.** `src/app/spec/1.0/page.tsx` is normative. The paper is rationale and never restates grammar or lifecycle tables. Spec changes are proposals until Curtis approves them in writing.
- **`src/lib/roomid.ts` is the single source** for identifier syntax. Do not reimplement parsing anywhere else.
- **Nobody deletes a registry record.** Lifecycle moves are `active`, `retired` or `superseded`, and history is append-only (R3).
- **Residences publish locality only** (R4), including in dumps.
- **Databases:** migrations are new numbered files in `supabase/migrations/`. Curtis runs them in the Supabase SQL editor; agents never run them and never touch the database directly. Never use Roomza's database or keys.
- **Never deploy.** Never run `vercel` or `vercel deploy`, and never change Vercel env vars or DNS. Curtis deploys.
- **Never push to main.** Work on a branch, open a PR on `curtiscrimmins/openroomid`, and Curtis merges.
- **Do not rename a live vote option id** in `src/data/open-questions.ts`.
- **Never `next build` while `next dev` is running** on the same `.next`. Stop dev, build, then `rm -rf .next` before restarting dev.

## Writing

- American English. No em dashes anywhere: code comments, copy, docs or commit messages.
- Sentence case everywhere. No uppercase, no tracked labels (per `design.md`).
- Plain, measured register, like iana.org. No marketing tone.
- Design system: `design.md` and `tokens.css`. Do not introduce new fonts, colors or radius.

## Every PR

- `npm test`, `npm run typecheck` and `npm run build` pass.
- A `DECISIONS.md` entry for each judgment call, numbered after the last one.
- A changelog entry (`src/app/changelog/page.tsx`) when public behavior changes.
- If the work changes a shape Roomza integrates against (resolver JSON, `/resolve`, snapshot, schema, submission format), say so at the top of the PR description.
