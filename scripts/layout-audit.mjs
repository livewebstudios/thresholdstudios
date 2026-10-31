// /layout audit: overflow, clipping, tap targets, image sizing (CLS) and sticky-nav overlap
// at 320 / 375 / 768 / 1024 / 1440. Needs the preview server. node scripts/layout-audit.mjs
import { launch } from './browser.mjs';

const BASE = process.env.BASE || 'http://localhost:4322';
const PAGES = ['/', '/services/', '/the-space/', '/dev/', '/services/recording-mixing-mastering/'];
const WIDTHS = [320, 375, 768, 1024, 1440];
let fails = 0;
const out = (ok, msg) => { if (!ok) fails++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); };
const flag = (msg) => console.log(`FLAG  ${msg}`);

const browser = await launch();
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 740 : 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const scrollX = document.documentElement.scrollWidth - vw;
      // Elements poking past the viewport, unless an ancestor clips or scrolls them on purpose.
      const clipped = [...document.querySelectorAll('body *')].filter((el) => {
        const b = el.getBoundingClientRect();
        if (!b.width || b.right <= vw + 0.5 && b.left >= -0.5) return false;
        for (let a = el.parentElement; a; a = a.parentElement) {
          const cs = getComputedStyle(a);
          if (/(hidden|auto|scroll|clip)/.test(cs.overflowX) && a !== document.body && a !== document.documentElement) return false;
        }
        return getComputedStyle(el).position !== 'fixed' && getComputedStyle(el).visibility !== 'hidden';
      }).map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`).slice(0, 5);
      // Tap targets: stand-alone links and buttons (inline links inside running text are exempt, WCAG 2.5.8).
      const small = [];
      for (const el of document.querySelectorAll('a[href], button, [role="button"], summary')) {
        const b = el.getBoundingClientRect();
        if (!b.width || getComputedStyle(el).visibility === 'hidden' || el.closest('dialog:not([open])') || el.classList.contains('skip-link')) continue;
        const inline = el.tagName === 'A' && el.closest('p, address, li.wall__name') && getComputedStyle(el).display === 'inline';
        if (inline) continue;
        const min = Math.min(b.width, b.height);
        if (min < 44) small.push({ t: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 28), w: Math.round(b.width), h: Math.round(b.height) });
      }
      const imgs = [...document.querySelectorAll('img')].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length;
      return { scrollX, clipped, small, imgs };
    });
    const tag = `${p} @${w}`;
    out(r.scrollX <= 0, `${tag}: no horizontal scroll (${r.scrollX}px)`);
    out(r.clipped.length === 0, `${tag}: nothing clipped past the viewport ${r.clipped.join(', ')}`);
    out(r.imgs === 0, `${tag}: every img has width and height`);
    const under24 = r.small.filter((s) => Math.min(s.w, s.h) < 24);
    out(under24.length === 0, `${tag}: no tap target under 24px ${under24.map((s) => `"${s.t}" ${s.w}x${s.h}`).join(', ')}`);
    const under44 = r.small.filter((s) => Math.min(s.w, s.h) >= 24);
    if (under44.length) flag(`${tag}: ${under44.length} target(s) 24 to 43px: ${[...new Set(under44.map((s) => `"${s.t}" ${s.w}x${s.h}`))].slice(0, 6).join(', ')}`);
  }

  // Sticky nav must never cover an anchor target or the start of main content.
  for (const [p, hash] of [['/services/', '#svc-education'], ['/services/', '#svc-off-site-recording'], ['/the-space/', '#gallery-title']]) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.evaluate((h) => { location.hash = h; }, hash);
    await page.waitForTimeout(300);
    // Scroll up a touch to make the nav reappear (worst case), then measure.
    await page.evaluate(() => window.scrollBy(0, -10));
    await page.waitForTimeout(400);
    const o = await page.evaluate((h) => {
      const t = document.querySelector(h); const nav = document.querySelector('[data-masthead]');
      const nb = nav.getBoundingClientRect(); const hidden = nav.classList.contains('is-hidden');
      return { navBottom: hidden ? 0 : nb.bottom, top: t.getBoundingClientRect().top };
    }, hash);
    out(o.top >= o.navBottom - 1, `${p}${hash} @${w}: target (${Math.round(o.top)}px) clears the sticky nav (${Math.round(o.navBottom)}px)`);
  }
  // First heading on each page sits below the fixed header on load.
  for (const p of PAGES.slice(0, 4)) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const o = await page.evaluate(() => ({ nav: document.querySelector('[data-masthead]').getBoundingClientRect().bottom, first: document.querySelector('main h1, main .crumbs, main .eyebrow').getBoundingClientRect().top }));
    out(o.first >= o.nav, `${p} @${w}: first content (${Math.round(o.first)}px) starts below the header (${Math.round(o.nav)}px)`);
  }
  await ctx.close();
}
await browser.close();
console.log(fails ? `layout: ${fails} failure(s)` : 'layout: all checks pass');
process.exit(fails ? 1 : 0);
