// Draw the doll herself in the hero, straight from the game's pixel strings —
// cycling through her four decay stages, because that's the whole point of her.
'use strict';

const DOLL_PAL = {
  H: '#6d3326', h: '#57281e', S: '#efe2cf', s: '#d9c8b2', E: '#171717',
  M: '#8c2f39', R: '#d89090', D: '#5b7ea3', d: '#48657f', W: '#e8e4da',
  L: '#e5d8c4', B: '#20242c',
};
const DECAY_PAL = { c: '#3b3b3b', k: '#101010', g: '#4a4238', x: '#7a1f1f', m: '#2a2e26' };

const ROWS = [
  '..HHHHHHHHHH..', '.HHHHHHHHHHHH.', '.HhSSSSSSSShH.', '.HSSSSSSSSSSH.',
  '.HSEESSSSEESH.', '.HSEESSSSEESH.', '.HSSSSSSSSSSH.', '.HRSSMMMMSSRH.',
  '..SSSSMMSSSS..', '...SSSSSSSS...',
  '.SDDDDDDDDDDS.', 'SSDDDDDDDDDDSS', 'SSDDWWWWWWDDSS', '.SDDWWWWWWDDS.',
  '..DDDDDDDDDD..', '.DdDDDDDDDDdD.',
  '...LL...LL....', '...LL...LL....', '...LL...LL....', '..BBB...BBB...',
];
const DECAY = [
  [],
  ['..............', '......c.......', '......c.......', '.......c......',
   '..............', '..............', '..........c...', '..............',
   '..............', '..............', '..............', '....g.........',
   '..............', '.........g....', '...g..........'],
  ['..............', '......c.......', '......c..c....', '.......cc.....',
   '..kk...c......', '..xk..........', '...x..........', '..............',
   '..............', '..............', '..g...........', '....g....gg...',
   '..gg..........', '.........gg...', '...gg....g....', '.g........g...'],
  ['.....c........', '.....cc.......', '......c..c....', '..c....cc..c..',
   '..kk..c..kk...', '..kk......kk..', '...c...c......', '.xx........xx.',
   '..x........x..', '..............', '.mg...........', '..ggg....gg...',
   '..gmg...ggg...', '...gg..gmg....', '..mgg....gg...', '.gg....gg..g..'],
];

const cv = document.getElementById('dollCanvas');
if (cv) {
  const g = cv.getContext('2d');
  let stage = 0;
  function paint() {
    g.clearRect(0, 0, 14, 20);
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
  paint();
  setInterval(() => { stage = (stage + 1) % 4; paint(); }, 2400);
}
