// The ten services. Copy is tightened from the live Services, VO/Filming, Audition and Education pages.
// `thumb` keys map to src/data/photos.ts. Slugs are the real future URLs for the full build.

export type ServiceGroup = 'MUSIC' | 'VOICE' | 'LOCATION' | 'LEARN';

export interface Service {
  num: string;
  slug: string;
  name: string;
  group: ServiceGroup;
  line: string;
  copy: string;
  thumb: string;
  alt: string;
}

export const groups: ServiceGroup[] = ['MUSIC', 'VOICE', 'LOCATION', 'LEARN'];

export const services: Service[] = [
  {
    num: '01',
    slug: 'recording-mixing-mastering',
    name: 'Recording, Mixing & Mastering',
    group: 'MUSIC',
    line: 'Hourly, daily and full production packages.',
    copy: 'Hourly, daily and full production packages for independent artists and established names, every style and every age. Every booking gets an engineer or producer on the session, plus James on the project from the first call to the final masters.',
    thumb: 'console-fader-detail',
    alt: 'Worn faders and rotary EQ knobs on a vintage British console under warm light',
  },
  {
    num: '02',
    slug: 'voice-over-adr-podcast',
    name: 'Voice Over, ADR & Podcasts',
    group: 'VOICE',
    line: 'A whisper-quiet booth with Source-Connect built in.',
    copy: 'A hand-built, whisper-quiet booth with Source-Connect, phone patch and timecode sync for ADR. HBO Westworld looped here. The Joyce Theater and SYFY record their podcasts here. James will tell you we\'re usually about half the price of a Manhattan post house.',
    thumb: 'vocal-booth-u87',
    alt: 'Large-diaphragm condenser microphone with pop filter inside a wood-slatted vocal booth',
  },
  {
    num: '03',
    slug: 'filming-location',
    name: 'Filming & Photoshoot Location',
    group: 'LOCATION',
    line: 'A traditional studio look with a flexible layout.',
    copy: 'A traditional, high-end studio look with a flexible layout for film, TV, broadcast and social. Something Rotten!, Kinky Boots, Netflix Patriot Act and the Oscar-winning 20 Feet From Stardom have all shot here.',
    thumb: 'live-room-cinematic-wide',
    alt: 'Wide view of a hardwood live room with a grand piano, drum kit and amplifiers',
  },
  {
    num: '04',
    slug: 'music-production',
    name: 'Original Music Production',
    group: 'MUSIC',
    line: 'Your song, written and arranged with you.',
    copy: 'Songwriting and arrangement for singers and bands, plus commercial jingles and film scores. The production staff are multi-instrumentalists. The amp collection is right there in the room.',
    thumb: 'vintage-amp-wall',
    alt: 'Vintage tweed and British guitar amplifiers with a sunburst hollow-body guitar on a stand',
  },
  {
    num: '05',
    slug: 'audition-tapes',
    name: 'Audition Tapes & Social Video',
    group: 'VOICE',
    line: 'College audition tapes and video, ready to upload.',
    copy: 'The right audition tape is a critical part of a college or music school application. Threshold has made them since 1997, audio and video ready to upload. Cover-song clips and livestreams for social, too.',
    thumb: 'baldwin-grand-keys',
    alt: 'Open seven-foot grand piano with a condenser microphone suspended over the strings',
  },
  {
    num: '06',
    slug: 'education',
    name: 'Workshops, Lessons & Intensives',
    group: 'LEARN',
    line: 'Learn in a working studio, not a classroom.',
    copy: 'Hands-on mentoring in songwriting and production, taught in context in a working studio. One-on-one lessons or group intensives for schools and academies, led by the producers and engineers who work here every day.',
    thumb: 'producer-hands-console',
    alt: 'An engineer’s hands resting on console faders with amber meters glowing behind',
  },
  {
    num: '07',
    slug: 'corporate-projects',
    name: 'Corporate, Private & Project Management',
    group: 'LOCATION',
    line: 'Event audio and team band weekends.',
    copy: 'Event video that needs real audio. A team-building band weekend in the studio. An event space in Manhattan. Threshold has managed hundreds of projects for names in entertainment, fashion, finance and tech, with consulting on retainer.',
    thumb: 'hero-trident-console-still',
    alt: 'Vintage Trident console with glowing VU meters and outboard racks in a dim control room',
  },
  {
    num: '08',
    slug: 'gift-sessions',
    name: 'Gift Sessions & Karaoke',
    group: 'MUSIC',
    line: 'The gift of music is a priceless memory.',
    copy: 'The gift of music is a priceless memory. James builds the package around your budget and the person getting it: a karaoke night for you and up to four friends, or a full day writing an original song.',
    thumb: 'vocal-booth-u87',
    alt: 'Vocal booth microphone ready for a session with headphones hanging on the wall',
  },
  {
    num: '09',
    slug: 'writing-room',
    name: 'The Writing Room',
    group: 'MUSIC',
    line: 'Studio A, the Baldwin and the vintage amps.',
    copy: 'There is no better place to find the chorus than Studio A. The seven-foot Baldwin is right there. So are the vintage guitar and bass amps. It is a room built for working out the song.',
    thumb: 'control-room-window-view',
    alt: 'View from the mix position through control room glass to a grand piano in the live room',
  },
  {
    num: '10',
    slug: 'off-site-recording',
    name: 'Off-Site Live Recording',
    group: 'MUSIC',
    line: 'Live shows recorded and mixed across the region.',
    copy: 'Live show and event recording and mixing, hourly or by package, across all five boroughs, Long Island, New Jersey and Connecticut. The same ears, packed into road cases.',
    thumb: 'road-case-mobile-rig',
    alt: 'Open road case with a rack of preamps and a laptop at the edge of a theater stage',
  },
];
