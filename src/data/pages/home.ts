// Home page copy. Sources: live /studio, /about-us, /services, / (see COPY_SOURCES.md).

export const home = {
  seo: {
    title: 'Threshold Recording Studios NYC | Legendary Sound. Legendary Space.',
    description: "A hand-built recording studio in Hell's Kitchen, NYC since 1997. A rebuilt Trident 80B, a Baldwin grand, three isolated rooms and the owner on the phone.",
  },
  hero: {
    eyebrow: 'SESSION IN PROGRESS SINCE 1997',
    lines: ['Legendary Sound.', 'Legendary Space.'],
    motionHold: 'Pause background motion',
    sub: "A hand-built recording studio on West 45th Street in Hell's Kitchen. A rebuilt Trident 80B, a seven-foot Baldwin grand, three isolated rooms, and the owner on the phone when you call.",
    // Circle-icon flanks (Jon, 26_10_30). Three each side on desktop; each links to its service card.
    features: [
      [
        { icon: 'mic', title: 'RECORDING', line: 'Three isolated rooms and a seven-foot Baldwin.', slug: 'recording-mixing-mastering' },
        { icon: 'faders', title: 'MIXING', line: 'A rebuilt Trident 80B, analog and digital.', slug: 'recording-mixing-mastering' },
        { icon: 'wave', title: 'MASTERING', line: 'Final masters, ready for release.', slug: 'recording-mixing-mastering' },
      ],
      [
        { icon: 'headphones', title: 'VOICE OVER & ADR', line: 'Source-Connect, phone patch and timecode.', slug: 'voice-over-adr-podcast' },
        { icon: 'camera', title: 'FILMING', line: 'A traditional studio look for film and TV.', slug: 'filming-location' },
        { icon: 'live', title: 'LIVE RECORDING', line: 'Shows recorded and mixed across the region.', slug: 'off-site-recording' },
      ],
    ],
  },
  room: {
    title: 'The space is the instrument.',
    body: 'The control room is tuned and easy on the eyes. Analog and digital, side by side, built for the way people really work. Out in the live room, the seven-foot Baldwin shares the floor with a wall of classic amps. Every corner is full of outboard gear, new and vintage. All of it is in play on your session.',
    frames: [
      { key: 'booth-mic-facing-piano', caption: 'LIVE ROOM · 20 × 25 FT' },
      { key: 'control-room-console-wide', caption: 'CONTROL ROOM · 15 × 20 FT' },
      { key: 'vocal-booth-u87', caption: 'VOCAL BOOTH · 6 × 7 FT' },
    ],
  },
  owner: {
    plate: 'PROPRIETOR',
    title: 'You call. James answers.',
    body: [
      'Call Threshold and you talk to the owner. James Walsh books the session with you on the phone, then pairs your project with the right engineer or producer for the job.',
      'He oversees it from the first call to the final masters. Every booking gets an engineer or producer in the room and James on the project. That kind of hands-on, owner-operated studio is hard to find anywhere else in New York.',
      "It's like going to your favorite local shop. Twenty-eight years in, the owner still picks up the phone.",
    ],
    list: [
      'Owner on every booking',
      'Engineer and producer on every session',
      'Hand-built, since 1997',
      'Three fully isolated recording spaces',
      'By appointment. No walk-ins.',
    ],
  },
  services: { title: 'Ten ways to use the room.' },
  clients: { title: 'Twenty-eight years of sessions.', plate: 'ON THE STUDIO WALL' },
  address: {
    title: 'Between Tenth and Eleventh.',
    body: "Threshold sits on West 45th Street in Hell's Kitchen, at the west edge of the Theater District and just north of the High Line. Port Authority is a ten-minute walk. Driving in from Jersey? The Lincoln Tunnel lets you out three blocks south. Penn is a short cab. And if you're coming from Broadway, you can walk here between shows.",
  },
  cta: { title: "Let's make something legendary." },
} as const;
