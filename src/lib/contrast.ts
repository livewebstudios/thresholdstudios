// WCAG 2.2 contrast math, shared by /dev/ and scripts/contrast-check.mjs.
export const palette = {
  ink: '#0E0C0A', charcoal: '#1A1714', graphite: '#262220', walnut: '#4A2E1E', brass: '#C9A45C',
  'brass-bright': '#E6C47A', amber: '#F0A830', cream: '#F2EBDD', parchment: '#CBBFA8', steel: '#8E8A84',
  red: '#B8321F', 'red-dark': '#8C2516', well: '#050403', engrave: '#17120A',
} as const;

// Opaque result of laying color `top` at `alpha` over `bottom` (for translucent fills and filters).
export function mix(top: string, alpha: number, bottom: string): string {
  const h = (x: string, i: number) => parseInt(x.slice(i, i + 2), 16);
  return '#' + [1, 3, 5].map((i) => Math.round(h(top, i) * alpha + h(bottom, i) * (1 - alpha)).toString(16).padStart(2, '0')).join('');
}
const brighten = (hex: string, k: number) => '#' + [1, 3, 5].map((i) => Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k)).toString(16).padStart(2, '0')).join('');

// Composite surfaces the site really paints, built from the palette (no new hues).
export const surfaces = {
  'brass-face-bottom': mix('#C9A45C', 0.7, '#A8863F'),
  'brass-hover': brighten('#C9A45C', 1.08),
  'ghost-hover': mix('#4A2E1E', 0.4, '#0E0C0A'),
  'hero-ghost-hover': mix('#4A2E1E', 0.55, '#0E0C0A'),
  'owner-row': mix('#0E0C0A', 0.45, '#1A1714'),
  'menu-btn': mix('#0E0C0A', 0.4, '#0E0C0A'),
  'face-hi': '#FBF0D4',
  'face-lo': '#D9BF8A',
} as const;

export type Swatch = keyof typeof palette | keyof typeof surfaces;
export const color = (k: Swatch): string => (k in palette ? palette[k as keyof typeof palette] : surfaces[k as keyof typeof surfaces]);

// Every text/background pair the site actually uses, and the minimum each must meet.
export const pairs: { fg: Swatch; bg: Swatch; min: number; use: string }[] = [
  { fg: 'cream', bg: 'ink', min: 4.5, use: 'Headlines and body' },
  { fg: 'parchment', bg: 'ink', min: 4.5, use: 'Secondary text, captions' },
  { fg: 'brass', bg: 'ink', min: 4.5, use: 'Links, ghost buttons' },
  { fg: 'brass-bright', bg: 'ink', min: 4.5, use: 'Hover states, H1 line two' },
  { fg: 'amber', bg: 'ink', min: 4.5, use: 'Focus rings' },
  { fg: 'steel', bg: 'ink', min: 4.5, use: 'Distance note' },
  { fg: 'cream', bg: 'charcoal', min: 4.5, use: 'Panel text, footer' },
  { fg: 'parchment', bg: 'charcoal', min: 4.5, use: 'Card copy, footer' },
  { fg: 'brass', bg: 'charcoal', min: 4.5, use: 'Panel links, footer heads' },
  { fg: 'steel', bg: 'charcoal', min: 4.5, use: 'Service group tag' },
  { fg: 'cream', bg: 'graphite', min: 4.5, use: 'Client wall, solid nav' },
  { fg: 'parchment', bg: 'graphite', min: 4.5, use: 'Readout strip, wall names' },
  { fg: 'brass', bg: 'graphite', min: 4.5, use: 'Nav current page' },
  { fg: 'engrave', bg: 'brass', min: 4.5, use: 'Nameplates, primary buttons' },
  { fg: 'engrave', bg: 'brass-bright', min: 4.5, use: 'Nameplate top edge' },
  { fg: 'amber', bg: 'well', min: 4.5, use: 'Dimension and distance readouts' },
  { fg: 'parchment', bg: 'well', min: 4.5, use: 'Readout labels' },
  // Hover, active and focus states
  { fg: 'brass-bright', bg: 'charcoal', min: 4.5, use: 'Footer and card hover' },
  { fg: 'brass-bright', bg: 'graphite', min: 4.5, use: 'Nav hover on solid bar, map panel' },
  { fg: 'brass-bright', bg: 'ghost-hover', min: 4.5, use: 'Ghost button hover' },
  { fg: 'brass-bright', bg: 'hero-ghost-hover', min: 4.5, use: 'Hero ghost button hover' },
  { fg: 'engrave', bg: 'brass-face-bottom', min: 4.5, use: 'Primary button / nameplate, bottom of gradient' },
  { fg: 'engrave', bg: 'brass-hover', min: 4.5, use: 'Primary button hover (brightness 1.08)' },
  { fg: 'cream', bg: 'owner-row', min: 4.5, use: 'Owner list rows' },
  { fg: 'amber', bg: 'charcoal', min: 3, use: 'Focus ring on panels (non-text, 3:1)' },
  { fg: 'amber', bg: 'graphite', min: 3, use: 'Focus ring on graphite bands (non-text, 3:1)' },
  { fg: 'amber', bg: 'ink', min: 3, use: 'Focus ring on page (non-text, 3:1)' },
  { fg: 'brass', bg: 'charcoal', min: 3, use: 'Toggle pressed border, ghost border (non-text, 3:1)' },
  // Instruments and map
  { fg: 'charcoal', bg: 'face-lo', min: 4.5, use: 'VU scale numbers, darkest face edge' },
  { fg: 'red-dark', bg: 'face-lo', min: 4.5, use: 'VU +3 numbers, darkest face edge' },
  { fg: 'red-dark', bg: 'face-hi', min: 4.5, use: 'VU + sign, face center' },
  { fg: 'parchment', bg: 'graphite', min: 4.5, use: 'Map street labels' },
  { fg: 'steel', bg: 'graphite', min: 3, use: 'Map river label (decorative, large letterspacing)' },
  { fg: 'brass', bg: 'graphite', min: 4.5, use: 'Map Theater District label' },
];

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export function ratio(fg: string, bg: string): number {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return Math.round(((a + 0.05) / (b + 0.05)) * 100) / 100;
}
