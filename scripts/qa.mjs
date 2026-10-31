// Phase 7 verification (handoff 9). Needs the preview server running (npx astro preview).
// node scripts/qa.mjs [--no-shots]   Writes ../qa/screens/*.png and ../qa/report.json. Exit 1 on any failure.
import { launch } from './browser.mjs';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4322';
const OUT = resolve(import.meta.dirname, '..', '..', 'qa');
const SHOTS = !process.argv.includes('--no-shots');
const PAGES = ['/', '/services/', '/the-space/', '/dev/'];
const WIDTHS = [375, 768, 1024, 1440];
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`); };

await mkdir(resolve(OUT, 'screens'), { recursive: true });
const browser = await launch();

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(50); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}

/* ---------- 1. Screens, overflow, console errors at four widths ---------- */
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 812 : 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  for (const p of [...PAGES, '/services/recording-mixing-mastering/']) {
    errors.length = 0;
    const res = await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await scrollThrough(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const is404 = p.includes('recording-mixing');
    const errs = errors.filter((e) => !(is404 && e.includes('404')));
    check(`${p} @${w}: no horizontal scroll`, overflow <= 0, `${overflow}px`);
    check(`${p} @${w}: no console errors`, errs.length === 0, errs.slice(0, 2).join(' | '));
    if (is404) check(`404 @${w}: status 404 and styled`, res.status() === 404 && (await page.evaluate(() => getComputedStyle(document.body).backgroundColor)) === 'rgb(14, 12, 10)');
    if (SHOTS) {
      const name = is404 ? '404' : (p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home');
      await page.screenshot({ path: resolve(OUT, 'screens', `${name}-${w}.png`), fullPage: true });
    }
  }
  await ctx.close();
}

/* ---------- 2. Keyboard: skip link, desktop nav ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  check('skip link is the first tab stop', (await page.evaluate(() => document.activeElement?.textContent?.trim())) === 'SKIP TO CONTENT');
  await page.keyboard.press('Enter');
  check('skip link moves focus to main', (await page.evaluate(() => document.activeElement?.id)) === 'main');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const stops = [];
  for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); stops.push(await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 30))); }
  check('desktop nav reachable by keyboard', ['HOME', 'SERVICES', 'THE SPACE'].every((l) => stops.includes(l)) && stops.some((s) => s?.startsWith('CALL')), stops.join(' > '));
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  check('focus ring visible', outline !== 'none', outline);
  await ctx.close();
}

/* ---------- 3. Mobile menu by keyboard ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/services/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !document.querySelector('astro-island[component-url*="MobileNav"]')?.hasAttribute('ssr'));
  await page.focus('.menu-btn');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  check('mobile menu opens from keyboard', await page.evaluate(() => document.querySelector('dialog.menu')?.open));
  const inside = [];
  for (let i = 0; i < 7; i++) { await page.keyboard.press('Tab'); inside.push(await page.evaluate(() => !!document.activeElement?.closest('dialog.menu'))); }
  check('mobile menu traps focus', inside.every(Boolean));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('mobile menu closes on Esc and returns focus', await page.evaluate(() => !document.querySelector('dialog.menu')?.open && document.activeElement?.classList.contains('menu-btn')));
  await ctx.close();
}

/* ---------- 4. Service filter by keyboard, stub toast ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/services/', { waitUntil: 'networkidle' });
  await page.locator('.sfilter').scrollIntoViewIfNeeded();
  await page.waitForSelector('.sfilter__bar button');
  await page.locator('.sfilter__bar button', { hasText: 'VOICE' }).focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  const vis = await page.evaluate(() => [...document.querySelectorAll('.services-grid .card')].filter((c) => getComputedStyle(c).display !== 'none').map((c) => c.dataset.group));
  check('filter VOICE by keyboard shows only voice services', vis.length === 2 && vis.every((g) => g === 'VOICE'), vis.join(','));
  check('filter sets aria-pressed', (await page.locator('.sfilter__bar button[aria-pressed="true"]').textContent())?.includes('VOICE'));
  await page.locator('.sfilter__bar button', { hasText: 'ALL' }).click();
  const url = page.url();
  await page.locator('a[data-stub]').first().click();
  await page.waitForTimeout(250);
  check('stub link does not navigate', page.url() === url);
  check('stub toast appears', await page.evaluate(() => document.querySelector('[data-toast]')?.classList.contains('is-on') && document.querySelector('[data-toast]')?.textContent?.includes('full build')));
  await page.waitForTimeout(2300);
  check('stub toast clears after 2s', await page.evaluate(() => !document.querySelector('[data-toast]')?.classList.contains('is-on')));
  await ctx.close();
}

/* ---------- 5. Lightbox ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/the-space/', { waitUntil: 'networkidle' });
  await page.locator('.masonry').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector('astro-island[component-url*="Lightbox"]')?.hasAttribute('ssr'));
  const first = page.locator('a[data-lightbox]').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  check('lightbox opens from keyboard', await page.evaluate(() => document.querySelector('dialog.lightbox')?.open));
  const c1 = await page.locator('.lightbox__count').textContent();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(150);
  const c2 = await page.locator('.lightbox__count').textContent();
  check('lightbox arrow keys step', c1 !== c2, `${c1} -> ${c2}`);
  const inside = [];
  for (let i = 0; i < 5; i++) { await page.keyboard.press('Tab'); inside.push(await page.evaluate(() => !!document.activeElement?.closest('dialog.lightbox'))); }
  check('lightbox traps focus', inside.every(Boolean));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('lightbox closes on Esc and returns focus', await page.evaluate(() => !document.querySelector('dialog.lightbox')?.open && !!document.activeElement?.matches('a[data-lightbox]')));
  await ctx.close();
}

/* ---------- 6. axe on every page ---------- */
const axeSummary = {};
for (const p of [...PAGES, '/services/recording-mixing-mastering/']) {
  for (const w of [375, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await scrollThrough(page);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    const bad = r.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    axeSummary[`${p}@${w}`] = r.violations.map((v) => `${v.impact}:${v.id}(${v.nodes.length})`);
    check(`axe ${p} @${w}: zero serious/critical`, bad.length === 0, bad.map((v) => `${v.id}: ${v.nodes[0]?.target}`).join(' | '));
    await ctx.close();
  }
}

/* ---------- 7. Reduced motion ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const a = await page.evaluate(() => [...document.querySelectorAll('.vu__needle')].map((n) => n.getAttribute('transform') + getComputedStyle(n).transform));
  await page.waitForTimeout(2500);
  const b = await page.evaluate(() => [...document.querySelectorAll('.vu__needle')].map((n) => n.getAttribute('transform') + getComputedStyle(n).transform));
  check('reduced motion: meters static', JSON.stringify(a) === JSON.stringify(b));
  // Needles rest hard left at -20 dB (Jon, 26_10_30), which is -50 degrees on this scale.
  const deg = (t) => { const m = t.match(/matrix\(([^)]+)\)/); if (m) { const [c, s] = m[1].split(/[ ,]+/).map(Number); return Math.atan2(s, c) * 180 / Math.PI; } const r = t.match(/rotate\(([-\d.]+)/); return r ? +r[1] : NaN; };
  check('reduced motion: meters rest at -20', a.every((t) => Math.abs(deg(t) + 50) < 0.5), a[0]);
  check('reduced motion: marquee static', await page.evaluate(() => getComputedStyle(document.querySelector('.readout__track')).animationName === 'none'));
  check('reduced motion: no js-motion hiding', await page.evaluate(() => !document.documentElement.classList.contains('js-motion')));
  await scrollThrough(page);
  const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal],[data-hero-line],[data-hero-in]')].filter((e) => +getComputedStyle(e).opacity < 1).length);
  check('reduced motion: all content visible', hidden === 0, `${hidden} hidden`);
  check('reduced motion: no hero video', await page.evaluate(() => !document.querySelector('[data-hero-video]')));
  const par = await page.evaluate(() => [...document.querySelectorAll('[data-parallax]')].filter((e) => getComputedStyle(e).transform !== 'none').length);
  check('reduced motion: no parallax transforms', par === 0, `${par}`);
  await ctx.close();
}

/* ---------- 8. JS off ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'load' });
    const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal],[data-hero-line],[data-hero-in]')].filter((e) => +getComputedStyle(e).opacity < 1).length);
    check(`JS off ${p}: content visible`, hidden === 0, `${hidden} hidden`);
  }
  await page.goto(BASE + '/services/', { waitUntil: 'load' });
  check('JS off: all ten service cards visible', (await page.evaluate(() => [...document.querySelectorAll('.services-grid .card')].filter((c) => getComputedStyle(c).display !== 'none').length)) === 10);
  await page.locator('a.toggle', { hasText: 'LEARN' }).click();
  check('JS off: filter anchors filter via :target', (await page.evaluate(() => [...document.querySelectorAll('.services-grid .card')].filter((c) => getComputedStyle(c).display !== 'none').length)) === 1);
  await page.goto(BASE + '/the-space/', { waitUntil: 'load' });
  const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[data-lightbox]')].map((a) => a.getAttribute('href')));
  check('JS off: gallery tiles are plain image links', hrefs.length > 10 && hrefs.every((h) => /\.(webp|jpg|avif)$/.test(h)), `${hrefs.length} links`);
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const navOk = await page.evaluate(() => [...document.querySelectorAll('.masthead__nav a, .footer__pages a')].every((a) => a.getAttribute('href')));
  check('JS off: nav links have hrefs', navOk);
  await page.locator('.footer__pages a', { hasText: 'SERVICES' }).click();
  check('JS off: footer link navigates', page.url().endsWith('/services/'));
  await ctx.close();
}

/* ---------- 9. Video ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const media = [];
  page.on('request', (r) => r.url().includes('/media/') && media.push(r.url()));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const v = await page.evaluate(() => { const el = document.querySelector('[data-hero-video]'); return el && { src: el.currentSrc, muted: el.muted, loop: el.loop, inline: el.playsInline, paused: el.paused, preload: el.getAttribute('preload') }; });
  check('video: plays muted inline on desktop', v && v.src && v.muted && v.loop && v.inline, JSON.stringify(v));
  const lcp = await page.evaluate(() => new Promise((res) => {
    new PerformanceObserver((l) => { const e = l.getEntries().pop(); res(e ? { t: Math.round(e.startTime), el: e.element?.tagName, url: e.url } : null); }).observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => res(null), 1500);
  }));
  // Chrome treats a full-viewport image as background and leaves it out of LCP, so the hero H1 is the LCP element.
  check('LCP is a hero element under 2.5s on desktop', lcp && lcp.t < 2500 && ['IMG', 'SPAN', 'H1'].includes(lcp.el), JSON.stringify(lcp));
  await ctx.close();
  const mctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const m = await mctx.newPage();
  const mmedia = [];
  m.on('request', (r) => r.url().includes('/media/') && mmedia.push(r.url()));
  await m.goto(BASE + '/', { waitUntil: 'networkidle' });
  await m.waitForTimeout(800);
  check('video: never requested on mobile', mmedia.length === 0 && (await m.evaluate(() => !document.querySelector('[data-hero-video]'))));
  await mctx.close();
}

/* ---------- 10. Head and markup checks ---------- */
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  const titles = new Set(), descs = new Set();
  for (const p of [...PAGES, '/404.html']) {
    await page.goto(BASE + p, { waitUntil: 'load' });
    const d = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content ?? '',
      robots: document.querySelector('meta[name="robots"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogImage: document.querySelector('meta[property="og:image"]')?.content,
      noBanner: !document.querySelector('[data-banner]'),
      imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
      imgsNoSize: [...document.querySelectorAll('img')].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length,
      logo: [...document.querySelectorAll('img')].filter((i) => /images\/logoRGB\.png$/.test(i.getAttribute('src') || '')).length,
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent)['@type']; } catch { return 'PARSE_ERROR'; } }),
      headings: [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => +h.tagName[1]),
    }));
    titles.add(d.title); descs.add(d.desc);
    const skip = d.headings.some((lvl, i) => i > 0 && lvl - d.headings[i - 1] > 1);
    check(`${p}: exactly one h1`, d.h1 === 1);
    check(`${p}: noindex`, d.robots === 'noindex, nofollow');
    check(`${p}: no demo banner (removed at Jon's request)`, d.noBanner);
    check(`${p}: canonical and og:image absolute`, /^https:\/\//.test(d.canonical) && /^https:\/\/.+\.png$/.test(d.ogImage));
    check(`${p}: every img has alt, width and height`, d.imgsNoAlt === 0 && d.imgsNoSize === 0, `${d.imgsNoAlt} no alt, ${d.imgsNoSize} no size`);
    check(`${p}: logo is images/logoRGB.png`, d.logo >= 2, `${d.logo}`);
    check(`${p}: heading levels do not skip`, !skip, d.headings.join(''));
    check(`${p}: JSON-LD parses`, d.ld.length && !d.ld.includes('PARSE_ERROR'), d.ld.join(','));
    if (p !== '/dev/' && p !== '/404.html') check(`${p}: meta description 140 to 154 chars with keywords`, d.desc.length >= 140 && d.desc.length <= 154 && /recording studio/.test(d.desc) && /Hell's Kitchen|NYC/.test(d.desc), `${d.desc.length}`);
    if (p === '/') check('home JSON-LD types', ['RecordingStudio', 'WebPage'].every((t) => d.ld.includes(t)));
    if (p === '/services/') check('services JSON-LD types', ['RecordingStudio', 'WebPage', 'BreadcrumbList', 'Service'].every((t) => d.ld.includes(t)) && d.ld.filter((t) => t === 'Service').length === 10);
    if (p === '/the-space/') check('space JSON-LD types', ['RecordingStudio', 'WebPage', 'BreadcrumbList', 'Place'].every((t) => d.ld.includes(t)));
  }
  check('titles unique', titles.size === PAGES.length + 1);
  check('descriptions unique', descs.size === PAGES.length + 1);
  const footer = await (async () => { await page.goto(BASE + '/', { waitUntil: 'load' }); return page.evaluate(() => { const b = document.querySelector('.footer__lws img'); return { w: b?.getAttribute('width'), css: getComputedStyle(b).width, credit: document.querySelector('.footer__lws')?.textContent?.includes('Built by Live Web Studios'), href: document.querySelector('.footer__lws')?.href }; }); })();
  check('LWS badge 150px wide, credit text, links to LWS', footer.css === '150px' && footer.credit && footer.href.startsWith('https://livewebstudios.com'), JSON.stringify(footer));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
await writeFile(resolve(OUT, 'report.json'), JSON.stringify({ when: new Date().toISOString(), passed: results.length - failed.length, failed: failed.length, results, axe: axeSummary }, null, 2));
console.log(`\nQA: ${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
