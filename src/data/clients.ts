// Client names from the live site, text only. No logos, no photos.
// `size` drives the typographic wall: 3 is largest.

export interface Client { name: string; size: 1 | 2 | 3 }

export const clients: Record<'music' | 'broadway' | 'screen' | 'voices', Client[]> = {
  music: [
    { name: 'Duran Duran', size: 3 }, { name: 'Cyndi Lauper', size: 3 }, { name: 'Rob Thomas', size: 2 },
    { name: 'Jon Anderson', size: 1 }, { name: 'Foreigner', size: 2 }, { name: 'Patty Smyth', size: 1 },
    { name: 'Aaron Neville', size: 2 }, { name: 'The Black Keys', size: 3 }, { name: 'The Strokes', size: 2 },
    { name: 'Slash', size: 3 }, { name: 'Ron Carter', size: 1 }, { name: 'Carlos Santana', size: 2 },
    { name: 'Phil Ramone', size: 1 }, { name: 'Mark Hudson', size: 1 }, { name: 'Hubert Sumlin', size: 1 },
    { name: 'Darlene Love', size: 2 }, { name: 'Jeff Buckley Music', size: 1 },
  ],
  broadway: [
    { name: 'Something Rotten!', size: 2 }, { name: 'Kinky Boots', size: 3 }, { name: 'Waitress', size: 2 },
    { name: "Movin' Out", size: 1 }, { name: 'The Great Comet', size: 1 },
  ],
  screen: [
    { name: 'HBO Westworld', size: 3 }, { name: 'Netflix Patriot Act', size: 2 }, { name: 'Twin Peaks', size: 2 },
    { name: 'SYFY', size: 1 }, { name: 'ABC', size: 1 }, { name: 'NBC', size: 1 }, { name: 'CBS', size: 1 },
    { name: 'Disney', size: 2 }, { name: 'Discovery', size: 1 }, { name: 'OWN', size: 1 }, { name: 'MTV', size: 1 },
    { name: 'Dateline', size: 1 }, { name: 'Food Network', size: 1 }, { name: 'CNN', size: 1 },
    { name: 'MSNBC', size: 1 }, { name: 'The Joyce Theater', size: 2 }, { name: 'School of Rock', size: 2 },
  ],
  voices: [
    { name: 'Ed Harris', size: 2 }, { name: 'Michael Douglas', size: 3 }, { name: 'Jeffrey Wright', size: 2 },
    { name: 'Jim Gaffigan', size: 2 }, { name: 'Deepak Chopra', size: 1 }, { name: 'Denis Leary', size: 2 },
    { name: 'Anne Burrell', size: 1 }, { name: 'Daymond John', size: 1 }, { name: 'Jay O. Sanders', size: 1 },
    { name: 'Dominic Chianese', size: 1 }, { name: 'Reeve Carney', size: 1 },
  ],
};

// Interleaved so the wall never runs one category in a block.
export const clientWall: Client[] = (() => {
  const lists = [clients.music, clients.screen, clients.broadway, clients.voices].map((l) => [...l]);
  const out: Client[] = [];
  while (lists.some((l) => l.length)) for (const l of lists) { const c = l.shift(); if (c) out.push(c); }
  return out;
})();
