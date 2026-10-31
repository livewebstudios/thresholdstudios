// Contrast of text sitting on photos and video (hero, nav over hero). Token pairs can't cover this, so it
// measures the real pixels: hide the text, screenshot, take the 95th-percentile luminance inside each text box,
// and compare it with the text's computed color. Desktop runs several hero video frames, mobile the poster.
// Needs the preview server. node scripts/overlay-contrast.mjs
import { launch } from './browser.mjs';
import sharp from 'sharp';

const BASE = process.env.BASE || 'http://localhost:4322';
const TARGETS = [
  { sel: '.hero__line', min: 3, label: 'H1 line (large)' },
  { sel: '.hero__sub', min: 4.5, label: 'hero sub' },
  { sel: '.hero .eyebrow span', min: 4.5, label: 'hero eyebrow' },
  // The CTAs now sit inside the solid meter panel, not over the video; their contrast is in the token pairs.
  { sel: '.feat__title', min: 4.5, label: 'feature title' },
  { sel: '.feat__line', min: 4.5, label: 'feature line' },
  { sel: '.navlink', min: 4.5, label: 'nav link' },
  { sel: '.masthead__word', min: 4.5, label: 'logo wordmark' },
  { sel: '.utility__inner', min: 4.5, label: 'utility line' },
  { sel: '.menu-btn', min: 4.5, label: 'MENU button' },
];
const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const [hi, lo] = [a, b].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

const browser = await launch();
let fails = 0;
async function run(width, frames) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 812 : 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  for (const t of frames) {
    if (t !== null) {
      await page.evaluate(async (tt) => {
        let v = document.querySelector('.hero__video.qa-probe');
        if (!v) {
          // Reduced motion removes the video; rebuild it here so every frame can be measured.
          v = document.createElement('video');
          v.className = 'hero__video is-ready qa-probe'; v.muted = true;
          Object.assign(v.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '62% 50%', zIndex: '1' }); v.src = 'media/hero-console.webm';
          document.querySelector('.hero__mediaInner').append(v);
        }
        v.classList.add('is-ready'); v.style.opacity = '1'; v.pause();
        await new Promise((r) => { if (v.readyState >= 1) r(); else v.addEventListener('loadedmetadata', r, { once: true }); });
        v.currentTime = tt;
        await new Promise((r) => v.addEventListener('seeked', r, { once: true }));
        if (!v.videoWidth) throw new Error('video frame not decoded');
      }, t);
    }
    const boxes = await page.evaluate((targets) => targets.flatMap((tg) => [...document.querySelectorAll(tg.sel)].filter((e) => e.getClientRects().length && e.getBoundingClientRect().width > 0).map((e) => {
      const r = e.getBoundingClientRect(); const c = getComputedStyle(e).color.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
      return { ...tg, x: Math.max(0, r.x), y: Math.max(0, r.y), w: r.width, h: r.height, color: c, text: e.textContent.trim().slice(0, 24) };
    })), TARGETS);
    await page.addStyleTag({ content: '.hero *, .masthead *, .utility * { color: transparent !important; text-shadow: none !important; } .hero__meters, .hero .btn--primary, .masthead .btn, .hero .led, .masthead .led, .fader { visibility: hidden !important; }' });
    const png = await page.screenshot();
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    for (const b of boxes) {
      const ls = [];
      const pad = b.sel.includes('btn') ? 4 : 0; // step inside the button border
      for (let y = Math.floor(b.y + pad); y < Math.min(info.height, b.y + b.h - pad); y += 2)
        for (let x = Math.floor(b.x + pad); x < Math.min(info.width, b.x + b.w - pad); x += 2) {
          const i = (y * info.width + x) * info.channels; ls.push(lum([data[i], data[i + 1], data[i + 2]]));
        }
      ls.sort((p, q) => p - q);
      const bg = ls[Math.floor(ls.length * 0.95)] ?? 0;
      const r = ratio(lum(b.color), bg);
      const ok = r >= b.min;
      if (!ok) fails++;
      console.log(`${ok ? 'PASS' : 'FAIL'}  @${width} ${t === null ? 'poster' : `video ${t}s`}  ${b.label.padEnd(18)} ${r.toFixed(2)}:1 (min ${b.min})  "${b.text}"`);
    }
    await page.evaluate(() => document.querySelectorAll('style').forEach((s) => s.textContent.includes('transparent !important') && s.remove()));
  }
  await ctx.close();
}
await run(1440, [null, 0.5, 2.5, 4.5, 6.5, 7.5]);
await run(375, [null]);
await browser.close();
console.log(fails ? `overlay contrast: ${fails} failure(s)` : 'overlay contrast: all pass');
process.exit(fails ? 1 : 0);
