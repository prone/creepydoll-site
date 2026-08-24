# Creepy Doll — marketing site

The public site for [Creepy Doll](https://github.com/prone/creepydoll), the
8-bit platformer about a porcelain doll who only ever wanted a friend.

**Live site:** https://prone.github.io/creepydoll-site/

## What's here

- `index.html`, `style.css`, `site.js` — the one-page marketing site. The hero
  doll is drawn live from the game's own pixel strings and cycles through her
  four decay stages.
- `assets/screens/` — real screenshots captured from the game headlessly
  (levels and all four boss fights).
- `play/` — a vendored snapshot of the game itself (`game.js` + `index.html`),
  so "Play in your browser" works from the same static host.

## How to update and deploy

Deploys are automatic: **anything pushed to `main` goes live on GitHub Pages**
within a minute or two. The whole process is:

```sh
# 1. edit files, then
git add -A && git commit -m "..." && git push
```

### Refreshing the playable game snapshot

When the game repo changes, copy the two files over and push:

```sh
cp ../creepydoll/game.js ../creepydoll/index.html play/
git add play && git commit -m "Sync game snapshot" && git push
```

### Refreshing the screenshots

The capture script drives the real game in headless Chromium (uses the game
repo's Playwright install). From the game repo:

```sh
node ../creepydoll-site/scripts/capture-shots.mjs   # writes into assets/screens/
```

Then commit and push the new PNGs.
