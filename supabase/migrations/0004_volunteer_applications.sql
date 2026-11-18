-- Applications for volunteer roles. Personal data: never public.
create table if not exists volunteer_applications (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  role_id     text not null,
  affiliation text not null,
  note        text,
  created_at  timestamptz not null default now()
);

-- No public policies: written and read only with the secret key.
alter table volunteer_applications enable row level security;
