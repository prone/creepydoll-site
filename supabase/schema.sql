-- Creepy Doll leaderboard. Apply once to a fresh Supabase project:
--   supabase db push   (from this folder, after `supabase link`)
-- or paste into the SQL editor.
--
-- The game inserts one row per signed, finished, unassisted run using the
-- public anon key. The site reads the `leaderboard` view. Nothing can update
-- or delete through the API. Rows are checked for shape server-side; a
-- determined person with curl can still post a fake score — this board is a
-- gift to honest players, not an anti-cheat system.

create table if not exists public.runs (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text    not null check (name ~ '^[A-Za-z0-9 _.\-]{1,12}$' and name !~ '^\s*$'),
  score       integer not null check (score between 0 and 200000),
  seconds     integer not null check (seconds between 60 and 86400),
  deaths      integer not null check (deaths between 0 and 999),
  minis       integer not null check (minis between 0 and 10),
  parts       integer not null check (parts between 0 and 5),
  untouched   integer not null check (untouched between 0 and 5),
  hearts      integer not null check (hearts between 1 and 200),
  completion  integer not null check (completion between 0 and 100),
  version     text    not null check (char_length(version) <= 16)
);

alter table public.runs enable row level security;

-- anyone (the game, with the anon key) may add a run; nobody may read the
-- raw table, change, or remove one through the API
drop policy if exists "runs: anon insert" on public.runs;
create policy "runs: anon insert" on public.runs
  for insert to anon with check (true);

-- the site reads this: the columns the page shows, nothing more
create or replace view public.leaderboard
  with (security_invoker = false) as
  select id, created_at, name, score, seconds, deaths, minis, parts,
         untouched, hearts, completion
  from public.runs;

grant select on public.leaderboard to anon;
grant insert on public.runs to anon;
revoke update, delete on public.runs from anon;

-- keep the board honest about volume: one project, one table, no runaway growth
create index if not exists runs_score_idx on public.runs (score desc);
