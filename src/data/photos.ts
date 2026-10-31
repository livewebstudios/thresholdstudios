// Every processed photo in src/assets/photos/, keyed by filename without extension.
// Alt text is 8 to 16 words and says what is in the frame. People photos are never listed here.
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });

export const photoAlt: Record<string, string> = {
  // Higgsfield (rooms, gear and hands only)
  'hero-trident-console-still': 'Vintage Trident console with glowing VU meters and outboard racks in a dim control room',
  'console-fader-detail': 'Worn faders and rotary EQ knobs on a vintage British console under warm light',
  'vocal-booth-u87': 'Large-diaphragm condenser microphone with pop filter inside a wood-slatted vocal booth',
  'baldwin-grand-keys': 'Open seven-foot grand piano with a condenser microphone suspended over the strings',
  'live-room-cinematic-wide': 'Wide view of a hardwood live room with a grand piano, drum kit and amplifiers',
  'vintage-amp-wall': 'Vintage tweed and British guitar amplifiers with a sunburst hollow-body guitar on a stand',
  'producer-hands-console': 'An engineer’s hands resting on console faders with amber meters glowing behind',
  'control-room-window-view': 'View from the mix position through control room glass to a grand piano in the live room',
  'road-case-mobile-rig': 'Open road case with a rack of preamps and a laptop at the edge of a theater stage',
  'hallway-to-studio': 'Narrow brick hallway with hardwood floor leading to a wooden studio door under a sconce',
  // James's photos from the live site
  'board-hero-slider': 'Low angle along the Trident 80B channel strips toward the control room glass',
  'board': 'Threshold control room with the Trident 80B console, outboard rack and producer chair',
  'booth-mic-facing-piano': 'Neumann microphone in the vocal booth facing the Baldwin grand piano across the live room',
  'control-room-a': 'Threshold control room with the Trident console, studio monitors and the window into the live room',
  'control-room-trident-outboard': 'Trident 80B console beside colorful outboard gear with guitars hanging on the back wall',
  'control-room-wide': 'Wide view of the Threshold control room from the keyboard corner toward the console',
  'filming-camera-control-room': 'Cinema camera on a tripod set up behind the Threshold control room console',
  'control-room-console-wide': 'Threshold control room with the console, guitars on the wall and a leather couch',
  'keys': 'Keyboard corner of the Threshold control room with a couch and warm wood paneling',
  'live-room-hells-kitchen': 'Panorama of the Threshold live room with drums, guitars, keyboards and the vocal booth',
  'piano-filming': 'Grand piano in the live room dressed for filming with cameras and studio lights',
  'piano-rear-perspective': 'Rear view of the Threshold live room with the Baldwin grand piano on a red rug',
  'baldwin-by-lamplight': 'The Baldwin grand piano lit by a small lamp in the Threshold live room',
  'vocal-booth-1': 'Condenser microphone in the floated vocal booth looking out through the glass door',
  'vocal-booth-window': 'Vocal booth window and electric piano in the corner of the Threshold live room',
};

export function photo(key: string): { src: ImageMetadata; alt: string } | null {
  const entry = Object.entries(files).find(([path]) => path.split('/').pop()?.replace(/\.\w+$/, '') === key);
  if (!entry) return null;
  return { src: entry[1].default, alt: photoAlt[key] ?? '' };
}
