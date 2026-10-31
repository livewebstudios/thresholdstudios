// Slices a tall screenshot into viewport-sized pieces for review. node scripts/slice.mjs <png> <outPrefix> [sliceH] [scale]
import sharp from 'sharp';
const [src, prefix, sliceH = 1800, scale = 0.6] = process.argv.slice(2);
const { width, height } = await sharp(src).metadata();
let i = 0;
for (let top = 0; top < height; top += +sliceH) {
  const h = Math.min(+sliceH, height - top);
  await sharp(src).extract({ left: 0, top, width, height: h }).resize(Math.round(width * scale)).jpeg({ quality: 78 }).toFile(`${prefix}-${++i}.jpg`);
}
console.log(`${i} slices, ${width}x${height}`);
