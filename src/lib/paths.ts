// Relative link from the current page path to a site path (PATH RULE). Used where a URL ends up in
// island props, which the browser renders from JSON and the post-build relativizer cannot see.
// The 404 page renders under <base href="/">, so it resolves from the root.
export function rel(from: string, to: string): string {
  const depth = from.startsWith('/404') ? 0 : from.split('/').filter(Boolean).length;
  const target = to.replace(/^\//, '');
  return ('../'.repeat(depth) + target) || './';
}
