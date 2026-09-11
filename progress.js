// The four decay stages side by side, from the same pixel strings site.js
// uses for the hero doll (classic scripts share the top-level scope).
'use strict';
for (const c of document.querySelectorAll('canvas.doll')) {
  const g = c.getContext('2d');
  const stage = Number(c.dataset.stage) || 0;
  for (let y = 0; y < ROWS.length; y++)
    for (let x = 0; x < ROWS[y].length; x++) {
      const ch = ROWS[y][x];
      if (ch === '.') continue;
      g.fillStyle = DOLL_PAL[ch] || '#f0f';
      g.fillRect(x, y, 1, 1);
    }
  for (let s = 1; s <= stage; s++)
    for (let y = 0; y < DECAY[s].length; y++)
      for (let x = 0; x < DECAY[s][y].length; x++) {
        const ch = DECAY[s][y][x];
        if (ch === '.') continue;
        g.fillStyle = DECAY_PAL[ch] || '#f0f';
        g.fillRect(x, y, 1, 1);
      }
}
