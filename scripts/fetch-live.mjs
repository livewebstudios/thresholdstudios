// Downloads James's photos from the live site into ../images/live/raw/ (handoff 7.3).
// Run from build/: node scripts/fetch-live.mjs
import { mkdir, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const RAW = resolve(import.meta.dirname, '..', '..', 'images', 'live', 'raw');
const LOGO = resolve(import.meta.dirname, '..', '..', 'images', 'logo');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const U = 'https://thresholdstudios.com/wp-content/uploads/';

export const LIVE = {
  'board-hero-slider.jpg': '2017/10/board2.jpg',
  'live-room-hells-kitchen.jpg': '2017/10/Threshold-Recording-Studios-Manhattan-New-York-Cit.jpg',
  'control-room-a.jpg': '2017/09/thresholdrecordingstudiosnyccontrolroomfrommarch2016.jpg',
  'live-room-a.jpg': '2016/10/ThresholdRecordingStudiosManhattanNewYorkCity.jpg',
  'live-room-b.jpg': '2017/09/ThresholdRecordingStudiosManhattanNewYorkCity.jpg',
  'grand-piano-live-room.jpg': '2016/03/Grand-Piano-filming-Photoshoot-Location-Threshold-Recording-Studios-NYC.jpg',
  'vocal-booth-1.jpg': '2017/09/Vocal-Booth.jpg',
  'vocal-booth-2.jpg': '2017/09/VocalBooth2.jpg',
  'vocal-booth-3.jpg': '2017/05/Vocal-Booth-Threshold-Recording-Studios-NYC.jpg',
  'board.jpg': '2017/09/board.jpg',
  'control-room-wide.jpg': '2017/09/wideshot1.jpg',
  'control-room-full.png': '2017/09/full-room.png',
  'control-room-trident-outboard.jpg': '2017/09/ThresholdRecordingStudiosControlRoomTrident80BconsoleandOutboard.jpg',
  'live-room-filming.jpg': '2017/09/Threshold-Recording-Studios-in-NYC-Live-room.jpg',
  'piano-filming.jpg': '2017/05/Piano-Filming-Threshold-Recording-Studios-NYC.jpg',
  'filming-location.jpg': '2017/05/Filming-Location-Threshold-Recording-Studios-NYC.jpg',
  'filming-camera-control-room.jpg': '2017/05/Filming-Shot-with-Camera-Control-Room-Threshold-Recording-Studios-NYC.jpg',
  'photoshoot-location.jpg': '2017/11/PhotoShoot-Filming-Location-Threshold-Recording-Studios-NYC.jpg',
  'keys.jpg': '2017/09/keys.jpg',
  'booth-mic-facing-piano.jpg': '2017/11/Threshold-Recording-Studios-NYC-Vocal-Booth-Mic-Facing-Piano.jpg',
  'piano-rear-perspective.jpg': '2017/11/Piano-in-Live-room-rear-perspactive-Threshold-Recording-Studios-NYC.jpg',
  'img-4316.jpg': '2017/09/IMG_4316.jpg',
  'img-0684.jpg': '2011/11/IMG_0684.jpg',
  'img-0699.jpg': '2017/01/IMG_0699.jpg',
  'img-4730.jpg': '2017/06/IMG_4730.jpg',
  'img-8977.jpg': '2018/05/IMG_8977.jpg',
  'studio-create.jpg': '2016/02/threshold-recording-studios-nyc.jpg',
  'studio-services.jpg': '2014/03/studio-services.jpg',
  'group-class.jpg': '2014/03/Group-Class-Threshold-Recording-Studios-NYC.jpg',
  'singer-gift.jpg': '2014/03/Singer-Gift-Packages-Threshold-Recording-Studios-NYC.jpg',
  'off-site-recording.jpg': '2014/03/Off-Site-Recording-Threshold-Recording-Studios-NYC.jpg',
  'band-live-room.jpg': '2014/03/Band-Threshold-Recording-Studios-NYC-1.jpg',
};
const LOGOS = {
  'Front-logo-270.png': U + '2017/10/Front-logo-270.png',
  'thresholdrecordingstudiosnyclogoforwebsite.png': U + '2017/09/thresholdrecordingstudiosnyclogoforwebsite.png',
  'logo-1.png': U + '2017/10/logo-1.png',
  'logo_black.png': 'https://thresholdstudios.com/wp-content/themes/bridge/img/logo_black.png',
  'verifiedsecured.png': 'https://livewebstudios.com/images/verifiedsecured.png',
};

async function get(url, dest) {
  try { await access(dest); return 'skip'; } catch {}
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return `FAIL ${res.status}`;
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return 'ok';
}

if (import.meta.url === `file://${process.argv[1]}`) {
await mkdir(RAW, { recursive: true });
await mkdir(LOGO, { recursive: true });
for (const [name, path] of Object.entries(LIVE)) console.log((await get(U + path, resolve(RAW, name))).padEnd(9), name);
for (const [name, url] of Object.entries(LOGOS)) console.log((await get(url, resolve(LOGO, name))).padEnd(9), name);
}
