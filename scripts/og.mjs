// 1200x630 Open Graph cards per page (handoff 8): ink ground, brass hairline frame with four screws,
// the page title in Plus Jakarta Sans, the address in IBM Plex Mono. satori renders SVG, sharp rasterizes it.
import satori from 'satori';
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(ROOT, 'public', 'og');
const font = (p) => readFile(resolve(ROOT, 'node_modules', p));
const fonts = [
  { name: 'Plus Jakarta Sans', data: await font('@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-500-normal.woff'), weight: 500, style: 'normal' },
  { name: 'IBM Plex Mono', data: await font('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'IBM Plex Mono', data: await font('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff'), weight: 500, style: 'normal' },
];
const logo = `data:image/png;base64,${(await readFile(resolve(ROOT, 'public', 'images', 'logoRGB.png'))).toString('base64')}`;

const PAGES = [
  { slug: 'home', eyebrow: 'SINCE 1997', title: 'Legendary Sound. Legendary Space.' },
  { slug: 'services', eyebrow: 'STUDIO SERVICES', title: 'Ten ways to use the room.' },
  { slug: 'the-space', eyebrow: 'THE SPACE', title: 'The room is the reason.' },
];

const h = (type, style, children) => ({ type, props: { style, children } });
const screw = (pos) => h('div', { position: 'absolute', width: 12, height: 12, borderRadius: 6, background: '#6c6863', border: '1px solid #3a3532', ...pos }, []);

await mkdir(OUT, { recursive: true });
for (const p of PAGES) {
  const tree = h('div', { width: 1200, height: 630, display: 'flex', background: '#0E0C0A', padding: 32, position: 'relative' }, [
    h('div', {
      width: 1136, height: 566, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative',
      border: '1px solid rgba(201,164,92,0.75)', borderRadius: 8, padding: '56px 64px',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(240,168,48,0.10), rgba(14,12,10,0) 60%)',
    }, [
      screw({ top: 14, left: 14 }), screw({ top: 14, right: 14 }), screw({ bottom: 14, left: 14 }), screw({ bottom: 14, right: 14 }),
      h('div', { display: 'flex', alignItems: 'center', gap: 22 }, [
        { type: 'img', props: { src: logo, width: 92, height: 92 } },
        h('div', { display: 'flex', flexDirection: 'column', gap: 6 }, [
          h('div', { fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 22, letterSpacing: 4, color: '#F2EBDD' }, 'THRESHOLD RECORDING STUDIOS NYC'),
          h('div', { display: 'flex', fontFamily: 'IBM Plex Mono', fontSize: 18, letterSpacing: 3, color: '#17120A', background: '#C9A45C', padding: '4px 10px', borderRadius: 3, alignSelf: 'flex-start' }, p.eyebrow),
        ]),
      ]),
      h('div', { fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 80, lineHeight: 1.04, color: '#F2EBDD', maxWidth: 940, letterSpacing: -1 }, p.title),
      h('div', { display: 'flex', flexDirection: 'column', gap: 18 }, [
        h('div', { display: 'flex', height: 3, width: 64, background: '#C9A45C' }, []),
        h('div', { fontFamily: 'IBM Plex Mono', fontSize: 22, letterSpacing: 4, color: '#CBBFA8' }, "517 WEST 45TH STREET · HELL'S KITCHEN · 212.244.1871"),
      ]),
    ]),
  ]);
  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(resolve(OUT, `${p.slug}.png`));
  console.log(`og/${p.slug}.png`);
}
