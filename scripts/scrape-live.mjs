// Scrapes the live thresholdstudios.com copy into ../scrape/ as the demo's copy source.
// Run from build/: node scripts/scrape-live.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const OUT = resolve(ROOT, 'scrape');
const BASE = 'https://thresholdstudios.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const PATHS = [
  '/', '/services', '/studio', '/about-us', '/podcast-voice-over-filming-location',
  '/audition-tapes-social-multi-media-content-production-nyc',
  '/music-production-performance-educational-programs-classes-workshops-intensives',
  '/studio-gift', '/contact', '/credits', '/nice-things-clients-say-about-us', '/faq', '/gear',
];

const decode = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#039;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&rsquo;|&lsquo;/g, "'").replace(/&rdquo;|&ldquo;/g, '"').replace(/&hellip;/g, '...');

function toText(html) {
  let h = html;
  // Drop head, scripts, styles, nav, header, footer and slider markup.
  h = h.replace(/<head[\s\S]*?<\/head>/i, '')
    .replace(/<(script|style|noscript|svg|iframe)[\s\S]*?<\/\1>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<rs-module-wrap[\s\S]*?<\/rs-module-wrap>/gi, '')
    .replace(/<div[^>]*class="[^"]*(ls-wp-container|rev_slider)[^"]*"[\s\S]*?<\/div>/gi, '');
  h = h.replace(/<(h[1-6])[^>]*>/gi, '\n\n## ').replace(/<\/(h[1-6])>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ').replace(/<(br|\/p|\/div|\/li|\/tr)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  return decode(h).split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .filter((l, i, a) => l || (a[i - 1] && a[i - 1].trim())).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

await mkdir(OUT, { recursive: true });
const images = new Set();
let out = '';
for (const p of PATHS) {
  const res = await fetch(BASE + p, { headers: { 'User-Agent': UA } });
  const html = await res.text();
  for (const m of html.matchAll(/https?:\/\/thresholdstudios\.com\/wp-content\/uploads\/[^"'\s)]+?\.(?:jpe?g|png|webp|gif)/gi)) images.add(m[0]);
  out += `\n\n==================== ${p} (${res.status}) ====================\n\n${toText(html)}`;
  console.log(`${res.status} ${p}`);
}
await writeFile(resolve(OUT, 'thresholdstudios_live_content.txt'), out.trim() + '\n');
await writeFile(resolve(OUT, 'image-urls.txt'), [...images].sort().join('\n') + '\n');
console.log(`${images.size} upload image URLs found`);
