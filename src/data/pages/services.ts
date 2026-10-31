// Services page copy. Sources: live /services (intro, cards, booking policy), /studio and /gear.

export const servicesPage = {
  seo: {
    title: 'Studio Services | Threshold Recording Studios NYC',
    description: "Recording, mixing, voice over, ADR, podcasts, filming and lessons at a recording studio in Hell's Kitchen, NYC. James Walsh quotes every booking himself.",
  },
  hero: {
    title: 'Services.',
    sub: 'Hourly, full-day and per-project rates. James quotes every booking personally and staffs it with the right engineer or producer for the job.',
    frame: { key: 'control-room-console-wide', caption: 'CONTROL ROOM · TRIDENT 80B' },
  },
  filterLabel: 'Filter services by type',
  cardsTitle: 'The ten services',
  gear: {
    plate: 'THE GEAR',
    title: "What's in the racks.",
    note: 'Complete equipment list available on request.',
  },
  booking: {
    title: 'How booking works.',
    steps: [
      { title: 'Call James', body: 'You talk to the owner, not a form. Tell him what you are making.' },
      { title: 'He quotes and staffs it', body: 'Hourly, block or per-song rates, and the right engineer or producer for the job.' },
      { title: 'Fifty percent holds your date', body: "The deposit confirms the session. Give forty-eight hours' notice and it moves to your next one." },
      { title: 'Masters delivered when the balance clears', body: 'Pay the balance on the last day of the session, and everything is yours.' },
    ],
  },
  toast: 'Individual service pages are part of the full build.',
} as const;
