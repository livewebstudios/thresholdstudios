// Asserts every text/background pair the site uses passes WCAG 2.2 AA. Run: npm run contrast
import { color, pairs, ratio } from '../src/lib/contrast.ts';
let fail = 0;
for (const p of pairs) {
  const r = ratio(color(p.fg), color(p.bg));
  const ok = r >= p.min;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${String(r).padStart(5)}:1  ${p.fg} on ${p.bg}  (${p.use})`);
}
console.log(`contrast: ${pairs.length - fail}/${pairs.length} pairs pass`);
process.exit(fail ? 1 : 0);
