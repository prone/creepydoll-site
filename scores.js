// The board: reads finished runs from the Supabase leaderboard view with plain
// fetch (no client library — the site has no dependencies either) and ranks
// them four ways client-side. Everything shown comes from the `leaderboard`
// view, which exposes only what this page needs.
'use strict';

const BOARD = { url: 'https://sisgndxlargcuhuiutul.supabase.co',
                key: 'sb_publishable_lH5Yq5RmM5x872qwSKgLng_l5EwO4zP' };   // public anon key; RLS guards the table
const ROWS_SHOWN = 100;

const note = document.getElementById('boardNote');
const tbody = document.querySelector('#boardTable tbody');
const tabs = document.querySelectorAll('.tab');

// skill first: a higher score wins, then fewer deaths, then a faster clock
const SORTS = {
  score: (a, b) => b.score - a.score || a.deaths - b.deaths || a.seconds - b.seconds,
  fast:  (a, b) => a.seconds - b.seconds || a.deaths - b.deaths || b.score - a.score,
  clean: (a, b) => a.deaths - b.deaths || b.score - a.score || a.seconds - b.seconds,
  whole: (a, b) => b.completion - a.completion || b.parts - a.parts || b.score - a.score,
};
let runs = [], sort = 'score';

function clock(s) {
  const m = Math.floor(s / 60), r = s % 60;
  return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
}
function ago(iso) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 3600) return Math.max(1, Math.round(d / 60)) + 'm ago';
  if (d < 86400) return Math.round(d / 3600) + 'h ago';
  return Math.round(d / 86400) + 'd ago';
}
function accolades(r) {
  const a = [];
  if (r.minis >= 10) a.push(['🎪', 'carnival royalty: all ten games won']);
  if (r.parts >= 5) a.push(['🤍', 'whole again: every lost part found']);
  if (r.untouched > 0) a.push(['✨×' + r.untouched, r.untouched + ' level' + (r.untouched > 1 ? 's' : '') + ' untouched']);
  if (r.deaths === 0) a.push(['🕯', 'deathless']);
  if (r.hearts >= 10) a.push(['💗', 'overfull: ' + r.hearts + ' hearts at the end']);
  if (r.creep >= 4) a.push(['🖤', 'at her worst: she finished melted']);
  a.push(['🏆' + r.completion + '%', 'completion ' + r.completion + '%']);
  return a;
}
function td(text, cls) {
  const c = document.createElement('td');
  c.textContent = text;
  if (cls) c.className = cls;
  return c;
}
function render() {
  const list = runs.slice().sort(SORTS[sort]).slice(0, ROWS_SHOWN);
  tbody.textContent = '';
  list.forEach((r, i) => {
    const tr = document.createElement('tr');
    if (i < 3) tr.className = 'top' + (i + 1);
    tr.appendChild(td(i + 1, 'rank'));
    tr.appendChild(td(r.name, 'name'));
    tr.appendChild(td(r.score.toLocaleString(), 'num'));
    tr.appendChild(td(clock(r.seconds), 'num'));
    tr.appendChild(td(r.deaths, 'num'));
    const acc = document.createElement('td');
    acc.className = 'acc';
    for (const [icon, title] of accolades(r)) {
      const s = document.createElement('span');
      s.textContent = icon; s.title = title;
      acc.appendChild(s);
    }
    tr.appendChild(acc);
    tr.appendChild(td(ago(r.created_at), 'when'));
    tbody.appendChild(tr);
  });
  note.textContent = list.length
    ? list.length + ' finished run' + (list.length === 1 ? '' : 's') + ' on the board.'
    : 'nobody has finished the night yet. the board is waiting.';
}

for (const t of tabs) t.addEventListener('click', () => {
  sort = t.dataset.sort;
  for (const o of tabs) {
    o.classList.toggle('here', o === t);
    o.setAttribute('aria-selected', o === t ? 'true' : 'false');
  }
  render();
});

async function load() {
  if (!BOARD.url) {
    note.textContent = 'the board is not open yet. soon.';
    return;
  }
  try {
    const r = await fetch(BOARD.url + '/rest/v1/leaderboard?select=*&order=score.desc&limit=500', {
      headers: { apikey: BOARD.key, Authorization: 'Bearer ' + BOARD.key },
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const rows = await r.json();
    // stored rows are untrusted: keep only well-shaped ones
    runs = rows.filter(x => typeof x.name === 'string' && Number.isFinite(x.score))
               .map(x => ({
                 name: x.name.slice(0, 12), score: x.score | 0,
                 seconds: Math.max(0, x.seconds | 0), deaths: Math.max(0, x.deaths | 0),
                 minis: x.minis | 0, parts: x.parts | 0, untouched: x.untouched | 0,
                 hearts: x.hearts | 0, completion: Math.max(0, Math.min(100, x.completion | 0)),
                 creep: Math.max(0, Math.min(4, x.creep | 0)),
                 created_at: x.created_at || new Date().toISOString(),
               }));
    render();
  } catch (e) {
    note.textContent = "the board didn't answer. try again in a moment.";
  }
}
load();
