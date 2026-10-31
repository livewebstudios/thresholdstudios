// Single source of truth for Threshold's facts. Every page and schema block reads from here.

export const site = {
  name: 'Threshold Recording Studios NYC',
  shortName: 'Threshold',
  url: 'https://thresholdstudios-demo.netlify.app',
  liveUrl: 'https://thresholdstudios.com',
  owner: 'James Walsh',
  ownerTitle: 'Proprietor and Executive Producer',
  founded: 1997,
  years: 28,
  phone: '212.244.1871',
  phoneHref: 'tel:+12122441871',
  phoneE164: '+1-212-244-1871',
  email: 'thresholdstudiosnyc@gmail.com',
  address: {
    street: '517 West 45th Street',
    streetShort: '517 W 45th St',
    between: 'between 10th and 11th Avenues',
    neighborhood: "Hell's Kitchen",
    district: 'Midtown West',
    city: 'New York',
    region: 'NY',
    zip: '10036',
    country: 'US',
  },
  // Nominatim (OpenStreetMap) geocode of 517 West 45th Street, looked up 2026-10-30.
  geo: { lat: 40.7621189, lon: -73.9949988 },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Threshold+Recording+Studios+517+West+45th+Street+New+York+NY+10036',
  hours: 'By appointment only. No walk-ins.',
  social: {
    instagram: 'https://www.instagram.com/thresholdstudiosnyc/',
    facebook: 'https://www.facebook.com/thresholdrecordingstudiosnyc/',
    twitter: 'https://twitter.com/ThresholdNYC',
  },
  stats: [
    { value: '28', label: 'YEARS' },
    { value: '9,000+', label: 'ARTISTS, ACTORS AND CLIENTS' },
    { value: '1,000+', label: 'SONGS AND BANDS PRODUCED' },
  ],
  policies: {
    minimum: 'Three-hour minimum',
    deposit: 'Fifty percent deposit',
    cancel: "Forty-eight hours' notice to cancel",
    appointment: 'By appointment only',
    line: "Three-hour minimum. Fifty percent deposit. Forty-eight hours' notice to cancel. Owner on the phone.",
    mono: '3-HOUR MINIMUM · 50% DEPOSIT · 48-HOUR CANCELLATION · BY APPOINTMENT ONLY',
  },
  tagline: 'Legendary Sound. Legendary Space.',
  taglineSub: "Hell's Kitchen, Manhattan. Since 1997.",
  taglineAlternates: [
    'Legendary sound lives here.',
    'Twenty-eight years of legendary sound.',
    'The room is legendary. So is the address.',
  ],
  utilityLine: "517 WEST 45TH STREET · HELL'S KITCHEN · BY APPOINTMENT",
} as const;

export const rooms = [
  {
    key: 'live',
    name: 'Live Room',
    plate: 'LIVE ROOM · 20 × 25 FT',
    dims: '20 × 25 FT',
    feet: [20, 25],
  },
  {
    key: 'control',
    name: 'Control Room',
    plate: 'CONTROL ROOM · 15 × 20 FT',
    dims: '15 × 20 FT',
    feet: [15, 20],
  },
  {
    key: 'booth',
    name: 'Vocal Booth',
    plate: 'VOCAL BOOTH · 6 × 7 FT',
    dims: '6 × 7 FT',
    feet: [6, 7],
  },
] as const;

export const nav = [
  { label: 'HOME', href: '/' },
  { label: 'SERVICES', href: '/services/' },
  { label: 'THE SPACE', href: '/the-space/' },
] as const;

export const readout = [
  'TRIDENT 80B', 'STUDER A827', 'ATR 102', 'PRO TOOLS HD', 'NEVE 1073', 'API 512', 'UREI 1176',
  'LEXICON 480L', 'NEUMANN U87', 'ROYER 121', "BALDWIN 7' GRAND", '1968 VOX AC30', "'57 FENDER TWEED",
] as const;
