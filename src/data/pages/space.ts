// The Space page copy. Sources: live /studio, /gear, /podcast-voice-over-filming-location,
// /audition-tapes-..., /contact. Distances: Nominatim geocodes, straight line (DECISIONS.md).

export const spacePage = {
  seo: {
    title: "The Space: Live Room, Control Room, Booth, Hell's Kitchen | Threshold Recording Studios NYC",
    description: "Tour the live room, the Trident 80B control room and the floated booth at Threshold, a recording studio on West 45th in Hell's Kitchen, NYC, since 1997.",
  },
  hero: {
    eyebrow: 'OPEN BY APPOINTMENT',
    title: 'The room is the reason.',
    sub: 'Twenty by twenty-five feet of tuned live room. A control room built around a rebuilt Trident 80B. A floated booth so quiet you can hear the city not getting in. All of it on West 45th Street.',
    frame: { key: 'live-room-cinematic-wide', caption: 'LIVE ROOM · 20 × 25 FT' },
  },
  roomsTitle: 'Three rooms, built by hand.',
  rooms: [
    {
      key: 'live',
      photo: 'piano-rear-perspective',
      body: "A tuned, inspiring room built around the seven-foot Baldwin and a wall of classic amplifiers. Drums recorded here are commonly regarded as on par with the best studios in the country. The house kit is always available. So is James's own collection of vintage amps and guitars, open on every session. After basics, it turns into a spacious overdub space you can shape around a vocal or a guitar part.",
    },
    {
      key: 'control',
      photo: 'control-room-window-view',
      body: "Built around a Trident 80B, fully rebuilt in the summer of 2016: power supply, caps, switches, pots and faders. It sounded great before. Now it's a monster. Tannoy DMT15 mains, NS-10s and KRKs on Bryston power, with the Studer A827 and ATR 102 tied into Pro Tools HD. A large window gives a direct line of sight to the booth and the live room.",
    },
    {
      key: 'booth',
      photo: 'vocal-booth-u87',
      body: 'Fully floated and built to IAC spec. It is a great place to isolate an amp or an acoustic instrument during tracking. For a lead vocal or a voice-over, it is even better. Add the live room and a sound lock for amps, and that makes three fully isolated recording spaces.',
    },
  ],
  piano: {
    plate: "BALDWIN 7' GRAND",
    title: 'Ask, and James will tell you where it came from.',
    photo: 'baldwin-grand-keys',
    body: [
      'The seven-foot Baldwin acoustic grand at Threshold is really something special. It plays beautifully across most genres, and it carries a long, mind-boggling history of the musicians who have played it and loved it.',
      'It lives in the live room, tuned and ready for whoever sits down next.',
    ],
    quote: "Ask, and I'll tell you where it came from.",
    quoteBy: 'JAMES WALSH',
  },
  gallery: { title: 'Take a look around.', plate: 'MORE OF THE ROOM', placeholder: 'MORE PHOTOS COMING · 2026' },
  filming: {
    title: 'A location, not just a studio.',
    body: "Threshold has been the location for hundreds of films and photoshoots. The best of Broadway shoots here, from Something Rotten! and Kinky Boots to Movin' Out. Darlene Love filmed here for the Oscar-winning 20 Feet From Stardom, and Netflix shot Patriot Act here. The room takes a drop-down white or green screen, or it can be wrapped in white, black, yellow or green fabric.",
    specPlate: 'LOCATION SPEC',
    specs: [
      'Flexible layout',
      'Traditional high-end studio look',
      'Three isolated spaces',
      'Direct line of sight through glass',
      'Source-Connect, phone patch, timecode',
      'Power and load-in details on request',
    ],
  },
  neighborhood: {
    title: 'Between Tenth and Eleventh, on Forty-Fifth.',
    photo: 'hallway-to-studio',
    nearby: [
      { name: 'Port Authority Bus Terminal', detail: '42nd Street and 8th Avenue', dist: '0.4 MI' },
      { name: 'A C E at 42 St / Port Authority', detail: 'Subway, 8th Avenue line', dist: '0.4 MI' },
      { name: 'Times Square / 42 St', detail: '1 2 3 · N Q R W · 7 · S', dist: '0.6 MI' },
      { name: 'Penn Station', detail: 'Amtrak, LIRR, NJ Transit', dist: '0.8 MI' },
      { name: 'Lincoln Tunnel', detail: 'Exits at Dyer Avenue', dist: '0.3 MI' },
      { name: 'Hudson Yards', detail: 'West 33rd and the High Line', dist: '0.5 MI' },
      { name: 'Theater District', detail: 'Shubert Alley and 44th Street', dist: '0.5 MI' },
      { name: 'Intrepid Museum', detail: 'Pier 86, West 46th Street', dist: '0.3 MI' },
      { name: 'Hudson River Park', detail: 'Pier 84, West 44th Street', dist: '0.4 MI' },
    ],
    distNote: 'APPROX. STRAIGHT-LINE DISTANCE FROM 517 W 45TH',
    body: "If you are coming from New Jersey, you come out of the tunnel and you are three blocks away. If you are in a Broadway house, you can walk here on a two-show day. If you are flying in, every hotel in Midtown West is a ten-minute cab. Hell's Kitchen takes care of dinner after the session.",
  },
  gettingHere: {
    title: 'Getting here.',
    columns: [
      { plate: 'BY TRAIN', body: 'Take the A, C or E to 42 St / Port Authority. Walk up to 45th Street and head west past Ninth and Tenth Avenues. About ten minutes.' },
      { plate: 'BY CAR', body: 'Out of the Lincoln Tunnel, you are three blocks away. There are several garages within a block, on 44th and 45th between Tenth and Eleventh.' },
      { plate: 'BY FOOT FROM BROADWAY', body: 'Ten to fifteen minutes from most Theater District houses. Walk west on 44th or 45th and keep going past Tenth Avenue.' },
    ],
  },
  cta: { title: 'Come see it in person.' },
} as const;
