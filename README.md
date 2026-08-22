# openroomid.org

Public home of the Open Room ID standard: the specification, the
registry policy, the implementation guide, and the resolver that turns
any roomID into an HTML page or a JSON-LD record.

Open Room ID defines `roomID`, a permanent, publicly resolvable
identifier for a single hotel accommodation unit. Identity is free and
stays free; the registry stores identity only. See `DECISIONS.md` for
judgment calls and open issues.

## Stack

Next.js 15 (App Router), TypeScript, Tailwind v4, Supabase (Postgres,
read-only from the app), Vitest. Deploys to Vercel.

## Local setup

```bash
npm install
npm run dev
```

That is the whole setup. With no environment variables, the app serves
an in-memory copy of the demonstration registry (El Cortez Hotel &
Casino, 41 units), so every route works without a database.

Useful local URLs:

- http://localhost:3000/7QM4KX92 (property record)
- http://localhost:3000/7QM4KX92-1412-B (unit record, the spec's example)
- http://localhost:3000/7QM4KX92-1412-A (superseded, 301s to 1412-B)
- http://localhost:3000/7QM4KX92-1407-A (retired)
- `curl -H "Accept: application/ld+json" localhost:3000/7QM4KX92-1412-B`

## Checks

```bash
npm run test        # Vitest: parser, negotiation, JSON-LD shapes
npm run typecheck   # tsc --noEmit
npm run lint
npm run build
```

## Wiring up Supabase

1. Create a Supabase project (its own project, not shared with anything
   else).
2. Run the migration: paste `supabase/migrations/0001_registry.sql`
   into the SQL editor, or use `supabase db push` if the CLI is linked.
3. Copy `.env.example` to `.env.local` and fill in the project URL, the
   publishable key (`sb_publishable_...`), and the secret key
   (`sb_secret_...`).
4. Seed the demo data: `npm run seed`. Idempotent; re-running upserts.

Once `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are set, registry
reads come from Supabase instead of the in-memory dataset. The secret
key is used only server-side, by the seed script and the /registry
intake form.

Demo rows carry `is_demo = true`. To clear them later:
`delete from units where is_demo; delete from properties where is_demo;`

## Deploy (Vercel)

1. Push this repository to GitHub and import it into Vercel.
2. Set the three environment variables from `.env.example` in the
   Vercel project settings.
3. Point the `openroomid.org` domain at the Vercel project.

No other configuration: no auth, no analytics, no cron. The resolver's
rate limiting is in-memory per instance, which is adequate at v0
traffic; swap in a shared store if that ever matters.

## Layout

```
src/lib/roomid.ts        identifier syntax: the only place regexes live
src/lib/registry*.ts     read-only registry access (Supabase or demo)
src/lib/negotiate.ts     Accept-header content negotiation
src/lib/jsonld.ts        JSON-LD response shapes
src/lib/resolver-html.ts HTML documents for the resolver route
src/app/[id]/route.ts    the resolver
src/app/spec/1.0/        the specification (immutable once Published)
supabase/migrations/     schema, with the identity-only guard comment
scripts/seed.ts          demo seed, from src/data/demo-registry.ts
```
