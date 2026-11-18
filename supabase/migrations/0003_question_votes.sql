-- Nonbinding public votes on the working group's open questions.
-- Not part of the registry. A voter is an anonymous random id from a
-- cookie; no IP address, account, or other personal data is stored.

create table if not exists question_votes (
  question_id text not null,
  voter_id    uuid not null,
  option_id   text not null,
  updated_at  timestamptz not null default now(),
  primary key (question_id, voter_id)
);

-- security_invoker: the view runs with the caller's rights, so the anon
-- role cannot read it (no policy); the server reads it with the secret key.
create or replace view question_tallies
  with (security_invoker = true) as
  select question_id, option_id, count(*)::int as votes
  from question_votes
  group by question_id, option_id;

-- Server-side only, with the secret key. No public policies.
alter table question_votes enable row level security;
