// Tiles a folder of images into labeled contact sheets for visual review.
// node scripts/contact-sheet.mjs <inDir> <outPrefix> [perSheet] [tile]
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const [inDir, outPrefix, per = 12, tile = 360] = process.argv.slice(2);
const files = (await readdir(inDir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const cols = 4, T = +tile, H = T + 26;
for (let s = 0; s * per < files.length; s++) {
  const chunk = files.slice(s * per, s * per + +per);
  const rows = Math.ceil(chunk.length / cols);
  const comps = [];
  for (const [i, f] of chunk.entries()) {
    const x = (i % cols) * T, y = Math.floor(i / cols) * H;
    const img = await sharp(resolve(inDir, f)).resize(T - 8, T - 8, { fit: 'contain', background: '#222' }).toBuffer();
    comps.push({ input: img, left: x + 4, top: y + 4 });
    const label = Buffer.from(`<svg width="${T}" height="22"><text x="4" y="16" font-size="13" font-family="Helvetica" fill="#fff">${f.replace(/&/g, '&amp;')}</text></svg>`);
    comps.push({ input: label, left: x, top: y + T + 2 });
  }
  const out = `${outPrefix}-${s + 1}.jpg`;
  await sharp({ create: { width: cols * T, height: rows * H, channels: 3, background: '#000' } }).composite(comps).jpeg({ quality: 80 }).toFile(out);
  console.log(out);
}
