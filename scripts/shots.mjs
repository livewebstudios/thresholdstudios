// Quick full-page screenshots for visual review. node scripts/shots.mjs [outDir] [widths] [paths]
import { launch } from './browser.mjs';
const [out = '../qa/screens', widthsArg = '1440,375', pathsArg = '/,/services/,/the-space/,/404-test/,/dev/'] = process.argv.slice(2);
const widths = widthsArg.split(',').map(Number);
const paths = pathsArg.split(',');
const browser = await launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 812 : 900 }, deviceScaleFactor: 1, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  for (const p of paths) {
    await page.goto('' + (process.env.BASE || 'http://localhost:4322') + '' + p, { waitUntil: 'networkidle' });
    // Scroll through so every reveal fires, then back to top.
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(60); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = (p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home') + `-${w}`;
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
    console.log(`${name}  overflow:${overflow}px`);
  }
  if (errors.length) console.log(`console errors @${w}:`, [...new Set(errors)].slice(0, 10));
  await ctx.close();
}
await browser.close();
