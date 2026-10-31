// Image pipeline (handoff 2.3, 7.1, 7.3). Re-runnable: drop new Higgsfield PNGs in ../images/raw/
// with the same NN- prefix, then run `npm run assets` from build/.
// Output: src/assets/photos/*.jpg (max 1600px, 2200px for the two hero stills, q82 mozjpeg, metadata stripped),
// public/images/ (logo, favicons, badge) and scripts/assets-manifest.json.
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile, copyFile, stat } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { LIVE } from './fetch-live.mjs';

const BUILD = resolve(import.meta.dirname, '..');
const IMG = resolve(BUILD, '..', 'images');
const OUT = resolve(BUILD, 'src', 'assets', 'photos');
const PUB = resolve(BUILD, 'public', 'images');
const U = 'https://thresholdstudios.com/wp-content/uploads/';

// Live-site photos sorted after viewing every one. `crop` is [left, top, width, height] as fractions.
const ROOMS = {
  'board-hero-slider.jpg': {},
  'board.jpg': {},
  'booth-mic-facing-piano.jpg': {},
  'control-room-a.jpg': {},
  'control-room-trident-outboard.jpg': {},
  'control-room-wide.jpg': {},
  'filming-camera-control-room.jpg': {},
  'img-4316.jpg': { rename: 'control-room-console-wide.jpg' },
  'keys.jpg': {},
  'live-room-hells-kitchen.jpg': {},
  'piano-filming.jpg': {},
  'piano-rear-perspective.jpg': {},
  'studio-create.jpg': { rename: 'baldwin-by-lamplight.jpg' },
  'vocal-booth-1.jpg': {},
  'vocal-booth-2.jpg': { rename: 'vocal-booth-window.jpg' },
};
const PEOPLE = ['grand-piano-live-room.jpg', 'band-live-room.jpg', 'filming-location.jpg', 'group-class.jpg', 'img-0699.jpg', 'img-4730.jpg',
  'img-8977.jpg', 'off-site-recording.jpg', 'photoshoot-location.jpg', 'singer-gift.jpg', 'studio-services.jpg'];
// Skipped: live-room-a/b/filming (smaller copies of live-room-hells-kitchen), vocal-booth-3 (duplicate of 2),
// control-room-full (logo baked into the frame).

const HIGGSFIELD = {
  '01': { name: 'hero-trident-console-still.jpg', max: 2200 },
  '02': { name: 'console-fader-detail.jpg' },
  '03': { name: 'vocal-booth-u87.jpg' },
  '04': { name: 'baldwin-grand-keys.jpg' },
  '05': { name: 'live-room-cinematic-wide.jpg', max: 2200 },
  '06': { name: 'vintage-amp-wall.jpg' },
  '07': { name: 'producer-hands-console.jpg' },
  '08': { name: 'control-room-window-view.jpg' },
  '09': { name: 'road-case-mobile-rig.jpg' },
  '10': { name: 'hallway-to-studio.jpg' },
};

const manifest = [];
const kb = (n) => `${Math.round(n / 1024)}KB`;

async function processPhoto(src, dest, { max = 1600, crop } = {}, meta = {}) {
  let img = sharp(src).rotate();
  if (crop) {
    const { width, height } = await sharp(src).metadata();
    img = img.extract({ left: Math.round(crop[0] * width), top: Math.round(crop[1] * height),
      width: Math.round(crop[2] * width), height: Math.round(crop[3] * height) });
  }
  const buf = await img.resize({ width: max, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  await writeFile(dest, buf);
  const m = await sharp(buf).metadata();
  const before = (await stat(src)).size;
  manifest.push({ ...meta, local: dest.replace(BUILD + '/', ''), width: m.width, height: m.height, bytes: buf.length,
    sha256: createHash('sha256').update(buf).digest('hex') });
  console.log(`${basename(dest).padEnd(38)} ${m.width}x${m.height}  ${kb(before)} -> ${kb(buf.length)}`);
}

await mkdir(OUT, { recursive: true });
await mkdir(PUB, { recursive: true });
await mkdir(resolve(IMG, 'live', 'rooms'), { recursive: true });
await mkdir(resolve(IMG, 'live', 'people'), { recursive: true });
await mkdir(resolve(IMG, 'higgsfield'), { recursive: true });

console.log('--- live rooms');
for (const [file, opt] of Object.entries(ROOMS)) {
  const name = opt.rename ?? file;
  const roomCopy = resolve(IMG, 'live', 'rooms', name);
  await processPhoto(resolve(IMG, 'live', 'raw', file), roomCopy, opt, { source: U + LIVE[file], people: false });
  await copyFile(roomCopy, resolve(OUT, name));
}
for (const file of PEOPLE) {
  await copyFile(resolve(IMG, 'live', 'raw', file), resolve(IMG, 'live', 'people', file));
  manifest.push({ source: U + LIVE[file], local: `../images/live/people/${file}`, people: true, used: false });
}

console.log('--- higgsfield');
const raw = await readdir(resolve(IMG, 'raw')).catch(() => []);
for (const [n, opt] of Object.entries(HIGGSFIELD)) {
  const file = raw.find((f) => f.startsWith(n + '-') && /\.(png|jpe?g|webp)$/i.test(f));
  if (!file) { console.log(`missing ${n} ${opt.name}`); continue; }
  const dest = resolve(IMG, 'higgsfield', opt.name);
  await processPhoto(resolve(IMG, 'raw', file), dest, opt, { source: `higgsfield ${file}`, people: false });
  await copyFile(dest, resolve(OUT, opt.name));
}

console.log('--- logo, favicons, badge');
// The live badge is white with black type. For the dark site it becomes cream: luminance drives alpha,
// so the white plate turns cream and the black areas let the page show through. Same mark, recolored.
const logoSrc = resolve(IMG, 'logo', 'Front-logo-270.png');
const { data, info } = await sharp(logoSrc).ensureAlpha().resize(540, 540, { kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true });
const cream = [242, 235, 221];
for (let i = 0; i < data.length; i += 4) {
  const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
  data[i] = cream[0]; data[i + 1] = cream[1]; data[i + 2] = cream[2];
  data[i + 3] = Math.round(data[i + 3] * Math.min(1, Math.max(0, (lum - 0.08) / 0.84)));
}
// Recolor at 540, then ship at 272 (2x the 136px footer logo) as a palette PNG: it is one color plus alpha,
// and at 80px on phones it is the LCP element, so bytes matter.
await sharp(await sharp(data, { raw: info }).png().toBuffer()).resize(272, 272, { kernel: 'lanczos3' }).png({ palette: true, colours: 64, compressionLevel: 9, effort: 10 }).toFile(resolve(PUB, 'logoRGB.png'));
console.log('logoRGB.png 272x272 (cream on transparent, palette)');

const fav = resolve(IMG, 'logo', 'logo-1.png');
const favDir = resolve(BUILD, 'public');
// Large icons: the full badge, trimmed edge to edge (the source has a 12px side margin).
const badge = await sharp(fav).trim({ threshold: 10 }).toBuffer();
for (const [size, name] of [[180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) {
  await sharp(badge).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(resolve(favDir, name));
}
// Tab icons (Jon, 26_10_31: "larger in the tab"): at 16px the ring lettering is mush, so the tab shows the
// badge's center emblem (black disc, skyline, NYC) full bleed. Disc measured at center (108, 97), radius 47.
const disc = (size) => sharp(fav).extract({ left: 59, top: 48, width: 98, height: 98 }).resize(size, size, { kernel: 'lanczos3' })
  .composite([{ input: Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`), blend: 'dest-in' }]).png();
await (await disc(32)).toFile(resolve(favDir, 'favicon-32.png'));
const fav64 = (await (await disc(64)).toBuffer()).toString('base64');
await writeFile(resolve(favDir, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><image width="64" height="64" xlink:href="data:image/png;base64,${fav64}"/></svg>\n`);
console.log('favicons 32, 180, 192, 512, svg');

await copyFile(resolve(IMG, 'logo', 'verifiedsecured.png'), resolve(PUB, 'verifiedsecured.png'));
console.log('verifiedsecured.png 150x37 (native)');

await writeFile(resolve(BUILD, 'scripts', 'assets-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const used = manifest.filter((m) => m.bytes);
console.log(`--- ${used.length} photos, ${kb(used.reduce((a, m) => a + m.bytes, 0))} total; ${PEOPLE.length} people photos set aside`);
