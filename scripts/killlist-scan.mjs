// Jon's kill-list (handoff 2.2 + CLAUDE.md). Scans src/ (or the paths given) and built HTML in dist/.
// Exit code 1 on any hit. Run: npm run killlist [-- src/data]
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative, extname } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const targets = process.argv.slice(2).length ? process.argv.slice(2) : ['src', 'dist'];
const EXT = new Set(['.astro', '.tsx', '.ts', '.json', '.html', '.css', '.mjs', '.md', '.xml', '.txt']);

const BANNED = [
  ['em dash', /—/], ['en dash', /–/], ['html em/en dash entity', /&[mn]dash;|&#821[12];/i],
  ['learn more', /learn more/i], ['click here', /click here/i], ['submit', /\bsubmit/i], ['read more', /read more/i],
  ["don't hesitate", /don['’]?t hesitate/i], ['circle back', /circle back/i],
  ['free consultation', /schedule a free consultation/i], ["we've got you covered", /got you covered/i],
  ['look no further', /look no further/i], ['fast-paced world', /fast[- ]paced world/i], ['elevate', /\belevat/i],
  ['seamless', /seamless/i], ['unlock', /\bunlock/i], ['game-changer', /game[- ]?changer/i],
  ['state of the art', /state[- ]of[- ]the[- ]art/i], ['world-class', /world[- ]class/i],
  ['20+/25+ years', /\b(20|25)\s*\+/], ['over 20', /over (20|twenty)\b/i],
];

async function walk(p, out = []) {
  const full = resolve(ROOT, p);
  let s; try { s = await stat(full); } catch { return out; }
  if (s.isFile()) { if (EXT.has(extname(full))) out.push(full); return out; }
  for (const e of await readdir(full)) {
    if (['node_modules', '_astro', 'media', 'fonts'].includes(e)) continue;
    await walk(resolve(full, e), out);
  }
  return out;
}

let hits = 0, files = 0;
for (const t of targets) {
  for (const f of await walk(t)) {
    if (f.endsWith('killlist-scan.mjs')) continue;
    files++;
    let text = await readFile(f, 'utf8');
    // Built HTML: drop inline scripts and styles, keep visible text and attributes (alt, meta, aria).
    if (f.endsWith('.html')) text = text.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '');
    text.split('\n').forEach((line, i) => {
      for (const [label, re] of BANNED) {
        if (re.test(line)) { hits++; console.log(`${relative(ROOT, f)}:${i + 1}  [${label}]  ${line.trim().slice(0, 140)}`); }
      }
    });
  }
}
console.log(`kill-list: ${hits} hit(s) across ${files} file(s)`);
process.exit(hits ? 1 : 0);
