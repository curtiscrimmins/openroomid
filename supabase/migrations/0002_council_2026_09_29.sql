-- Working group resolutions of 29 September 2026.
-- Identity-only guard in 0001 still applies: every column here is
-- identity or record provenance, not a room attribute.

-- Resolution 1: where a unit's designator came from.
alter table units
  add column if not exists designator_source text not null default 'door'
  check (designator_source in ('door', 'assigned'));

-- Resolution 3: claims belong to the operator; records belong to the room.
alter table properties
  add column if not exists claim_status text not null default 'unclaimed'
  check (claim_status in ('claimed', 'unclaimed')),
  add column if not exists last_confirmed date;

-- Resolution 4: owner-occupied residences publish locality only.
-- The public table never holds a residence's street address; the
-- registrar keeps it in a table the public cannot read.
alter table properties
  add column if not exists is_residence boolean not null default false;

do $$ begin
  alter table properties
    add constraint residence_address_private
    check (not is_residence or address is null);
exception when duplicate_object then null;
end $$;

create table if not exists residence_addresses (
  property_code text primary key references properties (property_code),
  address       text not null,
  created_at    timestamptz not null default now()
);

alter table residence_addresses enable row level security;
-- No anon policy: registrar-only, written and read with the service role.
