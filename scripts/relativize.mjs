// PATH RULE (CLAUDE.md): every internal asset and link reference in dist/ becomes a relative path.
// Astro emits root-relative URLs (/_astro/..., /services/), which break when the demo moves hosts.
// Absolute https URLs (canonical, og:*, JSON-LD, sitemap) are left alone: that is the one allowed exception.
// 404.html keeps <base href="/"> because Netlify serves it at any depth.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, dirname, sep } from 'node:path';

const DIST = resolve(import.meta.dirname, '..', 'dist');
const ATTRS = ['href', 'src', 'poster', 'data-src', 'component-url', 'renderer-url', 'before-hydration-url'];
const SETS = ['srcset', 'imagesrcset'];

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = resolve(dir, e.name);
    if (e.isDirectory()) await walk(p, out); else out.push(p);
  }
  return out;
}

const relFrom = (fileDir) => (url) => {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const target = resolve(DIST, '.' + url.split(/[?#]/)[0]);
  const suffix = url.slice(url.split(/[?#]/)[0].length);
  let r = relative(fileDir, target).split(sep).join('/');
  if (url.split(/[?#]/)[0].endsWith('/') && r && !r.endsWith('/')) r += '/';
  if (!r) r = './';
  return r + suffix;
};

let changed = 0, files = 0;
for (const file of await walk(DIST)) {
  const isHtml = file.endsWith('.html');
  const isCss = file.endsWith('.css');
  if (!isHtml && !isCss) continue;
  const is404 = isHtml && relative(DIST, file) === '404.html';
  const fix = is404 ? relFrom(DIST) : relFrom(dirname(file));
  let s = await readFile(file, 'utf8');
  const before = s;
  if (isHtml) {
    s = s.replace('<base href="/">', '<base data-keep="/">');
    for (const a of ATTRS) {
      // Island URLs feed import(), which needs ./ or ../ (a bare "_astro/x.js" is a module specifier and fails).
      const isImport = a.endsWith('-url');
      s = s.replace(new RegExp(`(\\s${a}=)(["'])(/[^"']*)\\2`, 'g'), (m, pre, q, url) => {
        let r = fix(url);
        if (isImport && !r.startsWith('.')) r = './' + r;
        return `${pre}${q}${r}${q}`;
      });
    }
    for (const a of SETS) {
      s = s.replace(new RegExp(`(\\s${a}=)(["'])([^"']*)\\2`, 'g'), (m, pre, q, val) =>
        `${pre}${q}${val.split(',').map((part) => part.trim().replace(/^(\S+)/, (u) => fix(u))).join(', ')}${q}`);
    }
  }
  s = s.replace('<base data-keep="/">', '<base href="/">');
  // url(/...) in stylesheets and inline <style>
  s = s.replace(/url\((["']?)(\/[^)"']+)\1\)/g, (m, q, url) => `url(${q}${fix(url)}${q})`);
  if (s !== before) { changed++; await writeFile(file, s); }
  files++;
}

// Verify: no root-relative internal reference may remain in any HTML or CSS attribute.
let leftovers = 0;
for (const file of await walk(DIST)) {
  if (!file.endsWith('.html') && !file.endsWith('.css')) continue;
  const s = (await readFile(file, 'utf8')).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '').replace('<base href="/">', '');
  const hits = s.match(/(?:\s(?:href|src|srcset|imagesrcset|poster|data-src|component-url|renderer-url)=["']\/(?!\/))|url\(["']?\/(?!\/)/g);
  if (hits) {
    leftovers += hits.length;
    console.log(`  root-relative left in ${relative(DIST, file)}: ${hits.length}`);
  }
}
console.log(`relativize: ${changed}/${files} files rewritten, ${leftovers} root-relative references left`);
if (leftovers) process.exit(1);
