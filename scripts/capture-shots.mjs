// Capture marketing screenshots from the real game.
// Run from anywhere; paths resolve relative to this script.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const GAMEDIR = path.resolve(SITE, '..', 'creepydoll');
const require = createRequire(path.join(GAMEDIR, 'test', 'e2e.js'));
const { chromium } = require('playwright');

const GAME = 'file://' + path.join(GAMEDIR, 'index.html');
const OUT = path.join(SITE, 'assets', 'screens');

const SHOTS = [
  { name: 'title', setup: `` },
  { name: 'road', setup: `
      window.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'}));
      window.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter'}));
      await fr(5); player.invuln = 999999;
      player.x = 560; player.y = 100; player.vy = 0; player.maxX = 900;
      await fr(30);` },
  { name: 'house', setup: `
      level = 2; resetGame(); state = 'play'; player.invuln = 999999;
      player.x = 460; player.y = 100; player.maxX = 460; await fr(30);` },
  { name: 'woods', setup: `
      level = 3; resetGame(); state = 'play'; player.invuln = 999999;
      player.x = 620; player.y = 100; player.maxX = 620; await fr(30);` },
  { name: 'snow', setup: `
      level = 4; resetGame(); state = 'play'; player.invuln = 999999;
      player.x = 1700; player.y = 40; player.maxX = 1700; await fr(40);` },
  { name: 'tomb', setup: `
      level = 5; resetGame(); state = 'play'; player.invuln = 999999;
      player.x = 900; player.y = 100; player.maxX = 900; await fr(30);` },
  { name: 'boss-dracula', setup: `
      level = 2; resetGame(); state = 'play'; startBoss(); player.invuln = 999999;
      boss.shootCd = 20; await fr(45);` },
  { name: 'boss-werewolf', setup: `
      level = 3; resetGame(); state = 'play'; startBoss(); player.invuln = 999999;
      player.x = 90; await fr(35);` },
  { name: 'boss-yeti', setup: `
      level = 4; resetGame(); state = 'play'; startBoss(); player.invuln = 999999;
      player.x = 80; await fr(35);` },
  { name: 'boss-aztec', setup: `
      level = 5; resetGame(); state = 'play'; startBoss(); player.invuln = 999999;
      boss.shootCd = 25; player.x = 90; await fr(45);` },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 620 } });
for (const shot of SHOTS) {
  await page.goto(GAME);
  await page.evaluate(async () => {
    for (let i = 0; i < 8; i++) await new Promise(r => requestAnimationFrame(r));
  });
  await page.evaluate(`(async () => {
    const fr = async n => { for (let i = 0; i < n; i++) await new Promise(r => requestAnimationFrame(r)); };
    ${shot.setup}
  })()`);
  const canvas = page.locator('#game');
  await canvas.screenshot({ path: `${OUT}/${shot.name}.png` });
  console.log('captured', shot.name);
}
await browser.close();
