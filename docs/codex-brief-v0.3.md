# Codex brief: OpenRoomID v0.3 registry

Owner: Curtis Crimmins. Drafted 2026-11-18. Read `AGENTS.md` first; its rules apply to everything here.

## Why this work, why now

Roomza is starting an initiative to make its room intelligence usable by AI agents. Every room Roomza describes to an agent should carry a public, permanent identifier that anyone can resolve for free. OpenRoomID is that identifier. Roomza will be its first implementer, but OpenRoomID stays independent. The registrar is the OpenRoomID Project. Roomza, Inc. is disclosed only as founding sponsor.

Roomza's side of the integration (mapping its rooms to roomIDs, showing them in its API and MCP) is NOT your job. Claude Code builds that in the separate `roomza-platform` repo. Your job is to make the registry ready to be used at scale by Roomza and by anyone else.

## Read before you start

1. `README.md`, `DECISIONS.md` (all of it; items 1 to 31 plus working-group resolutions R1 to R4), `design.md`.
2. The spec, `src/app/spec/1.0/page.tsx`. It is the law. The paper (`docs/paper/open-room-id-v0.2.md`) is rationale only and must never restate grammar or lifecycle tables.
3. `src/lib/roomid.ts`, the single source for identifier syntax: `PPPPPPPP-ROOM-U`, a Crockford base32 property code, the door designator, and a unit suffix letter. Example `7QM4KX92-1412-B`.
4. `supabase/migrations/0001` to `0004`, `src/lib/registry*.ts` and the resolver at `src/app/[id]/route.ts`.

## Current state (verified 2026-11-18)

- openroomid.org is live, deployed with the Vercel CLI from an uncommitted working tree. 26 files are uncommitted. **Do not start until Curtis has committed the baseline.** If `git status` is not clean, stop and say so.
- Supabase project "OpenRoomID Project" (ref `uexyowzvgbnnvamvbmqn`) holds the El Cortez demo: 1 property and 42 units, including one supersession pair and one retired unit.
- Lifecycle `status` is `active | retired | superseded`. Claims are `claimed | unclaimed` plus `lastConfirmed` (R3).
- Gaps between the spec and the code:
  - Spec section 7 commitment 6 promises public registry dumps, but no dump endpoint exists.
  - Nothing mints property codes. `7QM4KX92` is hardcoded demo data.
  - Nothing bulk-registers a unit list.
  - There is no bulk resolution.
  - There is no published JSON Schema.

## What Roomza's initiative asks of the registry

Each item below is marked BUILD (do it), PROPOSE (write spec text and options for the working group, do not make it normative), or BLOCKED (waits on an open vote).

### 1. Identity that survives renumbering: PROPOSE first, then BUILD what is approved

The initiative asks for "an immutable machine identifier that survives room renumbering, with existing human-readable identifiers kept as resolvable aliases."

The working group already chose semantic identifiers: the door label lives in the ID (R1, which closed spec 5.6). A renumbering today is a supersession, where the old roomID redirects 301 to the new one.

Write a short analysis in `docs/proposals/0001-unit-identity.md`:
- Does a supersession chain already meet the requirement, including multi-hop chains and the resolver following them?
- If not, what would an opaque permanent unit key alongside roomID look like? Cover the grammar, where it appears in the record, and how the resolver and dump expose it.
- Compare the two on agent use, on hotel use, and on what happens to a reissued door number.
- Give your recommendation.

Curtis decides. Implement only after he approves the proposal in writing.

### 2. Verification separate from lifecycle: BUILD

Add a `verification` dimension that is independent of lifecycle `status` and of the claim state. The proposed values are below; finalize them in the proposal and DECISIONS.md:
- `operator_verified`: the claiming operator confirmed this unit.
- `registrar_checked`: the registrar checked it against operator or PMS provenance.
- `submitted`: a third party submitted it and nobody has confirmed it.

Rules:
- A third-party submission must never read as operator verified, in JSON-LD, HTML or the dump.
- Verification changes are append-only history, like lifecycle.
- New migration file only (the next number). Curtis runs migrations in the Supabase SQL editor; you never run them.

### 3. Third-party submissions: BLOCKED on spec 4.3 (pre-registration vote)

Build the intake side only. A registrant such as Roomza can submit a property's unit list, and the submission lands in a non-public submissions table, the same pattern as `registration_requests`. It never creates registry records until the working group resolves 4.3. Include in the submission: submitter identity, provenance tier (PMS export, operator file, or observed), and per-unit evidence notes.

### 4. Composite, subdivided and connecting units: PROPOSE only

These are open issues 4.3 (composed units) and 5.3 (multi-successor supersession for splits). Add them to `docs/proposals/0002-composed-units.md` with spec text options.

The prior working-group lean: composition (this unit consists of those units) is arguably identity and may belong in the registry. Adjacency (this unit connects to that one) is descriptive data and likely stays out. Until resolved, a subdivided unit stays `retired`, not superseded.

### 5. Ownership and brand changes: BUILD (confirm only)

Confirm in tests that a change of operator or brand never changes a roomID, per R2 (names are display data) and R3 (a sale ends the claim automatically, and records are never deleted). Add tests where they are missing. No new behavior expected.

### 6. Public resolution at scale: BUILD

- Bulk resolution: `POST /resolve` with up to 500 roomIDs. It returns per-ID results: canonical form, status, verification, `supersededBy` chain end, and a not-found or invalid reason.
  - Same content rules as the single resolver.
  - Its own rate limit.
  - No authentication. Free, non-discriminatory access is a spec commitment.
- Registry snapshots: the dump promised by commitment 6.
  - A full public snapshot (NDJSON, gzipped) plus a manifest with a SHA-256 hash, record counts, schema version and a generated timestamp.
  - Residences publish locality only (R4).
  - Generated by a script or scheduled job, served from a stable URL with dated history.
- Versioned JSON Schema for the unit record and the property record, published at stable URLs (for example `/schema/1.0/unit.json`), with the resolver's JSON-LD validated against it in tests.

### 7. Minting: BUILD (registrar-side script, run by Curtis)

`scripts/mint.ts`:
- Mints a property code, refusing a second code for an address or parcel already registered (the enforceable invariant).
- Bulk-registers a unit list from CSV or JSON. It uses `assignDesignator` for units without a stable door label (R1) and records provenance.
- Dry run by default, `--apply` to write, with an idempotent re-run.

### 8. Reference implementation: BUILD

Make `src/lib/roomid.ts` usable outside this app: a small dependency-free module with parse, validate, canonicalize, lookupKey and the JSON Schema, plus tests. Prepare it as a package, but do not publish to npm without Curtis's go.

## The contract Roomza will build against

Claude Code will integrate against these, so keep them stable and say so in DECISIONS.md if any shape changes:
- `GET /{roomID}`: the existing resolver (HTML and JSON-LD).
- `POST /resolve`: bulk, as above.
- The snapshot URL plus its manifest.
- `/schema/1.0/*.json`.
- The submission intake: endpoint or documented file format.

Roomza will store only the roomID string and the verification value it last saw. It will never write attributes, scores, prices or availability into the registry, and the registry must never accept them.

## Out of scope

- Anything in `roomza-platform`.
- Roomza's commercial data of any kind.
- DNS, email (registry@openroomid.org MX) and IANA registration of `rid:` (note it as still open).
- Deploying. Curtis deploys.

## Order and review

One branch and one pull request per numbered item, in this order: 1 (proposal only), 6, 2, 7, 8, 5, 3, 4 (proposal only). Each PR must have:
- `npm test`, `npm run typecheck` and `npm run build` clean.
- A DECISIONS.md entry for every judgment call.
- A changelog entry where the public behavior changes.
- Spec text changes marked as proposals unless Curtis has approved them.

Curtis merges. Claude Code may review your PRs at his request.

## Done means

An outside agent can:
- Resolve a single roomID or 500 at once.
- Download and verify the full registry.
- Validate any record against a published schema.
- Tell, for every unit, whether it is active, who claims it, and whether an operator verified it.

All without an account, without a fee, and without seeing any commercial data.
