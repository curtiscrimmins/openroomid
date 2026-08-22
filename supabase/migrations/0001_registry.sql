-- Open Room ID registry schema.
--
-- SCHEMA GUARD, read before adding columns.
-- This registry stores identity and nothing else. It deliberately has no
-- columns for score, condition, noise, rate, price, review count,
-- verified-stay count, or any room attribute. Identity is the free,
-- neutral layer of the standard; attributes and confirmation are a
-- separate commercial product. If a proposed column is something a
-- competitor to that product would want to read, it does not belong in
-- this schema. Stop and take it elsewhere.

create table if not exists properties (
  property_code text primary key,
  name          text not null,
  address       text,
  city          text,
  region        text,
  country       text,
  status        text not null default 'active'
                check (status in ('active', 'retired', 'superseded')),
  assigned_at   date not null,
  superseded_by text references properties (property_code),
  is_demo       boolean not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists units (
  room_id         text primary key,
  property_code   text not null references properties (property_code),
  room_designator text not null,
  unit_suffix     text not null,
  display_name    text,
  floor_level     text,
  status          text not null default 'active'
                  check (status in ('active', 'retired', 'superseded')),
  assigned_at     date not null,
  superseded_by   text references units (room_id),
  is_demo         boolean not null default false,
  created_at      timestamptz not null default now()
);

-- Lookups are case-insensitive; canonical casing is preserved in room_id.
create unique index if not exists units_lookup_key
  on units (upper(room_id));
create index if not exists units_by_property
  on units (property_code);

-- Intake for /registry. Not part of the registry itself: rows here are
-- requests, reviewed by the registrar before any identifier is assigned.
create table if not exists registration_requests (
  id            uuid primary key default gen_random_uuid(),
  property_name text not null,
  address       text,
  contact_email text not null,
  website       text,
  room_count    integer,
  message       text,
  created_at    timestamptz not null default now()
);

-- The registry is public and read-only to the world. Writes go through
-- the service role only, which bypasses row level security.
alter table properties enable row level security;
alter table units enable row level security;
alter table registration_requests enable row level security;

create policy "public read" on properties
  for select using (true);
create policy "public read" on units
  for select using (true);
-- registration_requests has no anon policy: not publicly readable,
-- inserts happen server-side with the service role.
