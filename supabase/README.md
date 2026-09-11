# The board (Supabase)

Live project: **creepydoll** in prone's Org, ref `sisgndxlargcuhuiutul`,
https://supabase.com/dashboard/project/sisgndxlargcuhuiutul (created
2026-09-10 by the CLI). The database password is in `.dbpassword` here,
gitignored — back it up.

`schema.sql` is the whole backend: one `runs` table the game inserts into with
the public anon key, and a `leaderboard` view the site reads. Row Level
Security allows anonymous inserts only; reads go through the view.

Setting it up on a new project:

```sh
supabase link --project-ref <ref>
psql "$(supabase db url 2>/dev/null || echo '<connection string>')" -f schema.sql
# or paste schema.sql into the Supabase SQL editor
```

Then put the project URL and anon key in two places:

- `scores.js` — `BOARD = { url, key }`
- the game's `game.js` — `BOARD = { url, key }` (and re-sync `play/` here and
  `www/` in creepydoll-mobile)

The anon key is public by design; RLS is what keeps the table safe.
