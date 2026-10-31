// HOW TO ADD JAMES'S NEW PHOTOS (Jon):
// 1. Drop the JPG into build/src/assets/photos/ (or run `npm run assets` to resize from images/).
// 2. Add a line below: { key: 'file-name-without-extension', caption: 'LIVE ROOM · DRUMS' }.
// 3. Add its alt text (8 to 16 words, what is in the frame) to photoAlt in src/data/photos.ts. Done: new tile.

export interface GalleryItem { key: string; caption: string }

export const gallery: GalleryItem[] = [
  { key: 'live-room-cinematic-wide', caption: 'LIVE ROOM · 20 × 25 FT' },
  { key: 'board-hero-slider', caption: 'TRIDENT 80B · REBUILT 2016' },
  { key: 'booth-mic-facing-piano', caption: 'VOCAL BOOTH · FACING THE BALDWIN' },
  { key: 'control-room-console-wide', caption: 'CONTROL ROOM · 15 × 20 FT' },
  { key: 'baldwin-grand-keys', caption: "BALDWIN 7' GRAND" },
  { key: 'live-room-hells-kitchen', caption: 'LIVE ROOM · PANORAMA' },
  { key: 'vintage-amp-wall', caption: 'THE AMP WALL' },
  { key: 'board', caption: 'CONTROL ROOM · MIX POSITION' },
  { key: 'piano-rear-perspective', caption: 'LIVE ROOM · REAR VIEW' },
  { key: 'vocal-booth-u87', caption: 'VOCAL BOOTH · 6 × 7 FT' },
  { key: 'control-room-window-view', caption: 'THROUGH THE GLASS' },
  { key: 'control-room-trident-outboard', caption: 'CONSOLE & OUTBOARD' },
  { key: 'console-fader-detail', caption: 'FADERS · DETAIL' },
  { key: 'keys', caption: 'CONTROL ROOM · KEYS CORNER' },
  { key: 'piano-filming', caption: 'DRESSED FOR A SHOOT' },
  { key: 'control-room-wide', caption: 'CONTROL ROOM · WIDE' },
  { key: 'filming-camera-control-room', caption: 'CAMERA ON THE CONSOLE' },
  { key: 'vocal-booth-1', caption: 'INSIDE THE BOOTH' },
  { key: 'producer-hands-console', caption: 'HANDS ON THE DESK' },
  { key: 'vocal-booth-window', caption: 'BOOTH WINDOW' },
  { key: 'baldwin-by-lamplight', caption: 'THE BALDWIN · LAMPLIGHT' },
];
