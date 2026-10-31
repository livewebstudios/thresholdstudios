// Small UI behaviors that are not motion: stub-link toast, marquee speed, hero motion pause.

/* ---------- Stub links: individual service pages are part of the full build ---------- */
const toast = document.querySelector<HTMLElement>('[data-toast]');
let toastTimer = 0;
export function showToast(text: string) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('is-on');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-on'), 2000);
}
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-stub]');
  if (!a) return;
  e.preventDefault();
  showToast(a.dataset.stub || 'Individual service pages are part of the full build.');
});

/* ---------- Readout marquee: 18px per second ---------- */
for (const r of Array.from(document.querySelectorAll<HTMLElement>('[data-readout]'))) {
  const list = r.querySelector<HTMLElement>('.readout__list');
  if (list) r.style.setProperty('--readout-dur', `${Math.round(list.scrollWidth / 18)}s`);
}


/* ---------- Motion hold: the hero pause button stops the video, marquee and LEDs (WCAG 2.2.2) ---------- */
const hold = document.querySelector<HTMLButtonElement>('[data-motion-toggle]');
if (hold) {
  const root = document.documentElement;
  const set = (on: boolean) => {
    if (on) root.dataset.motion = 'paused'; else delete root.dataset.motion;
    hold.setAttribute('aria-pressed', String(on));
    const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
    if (video) { if (on) video.pause(); else if (video.classList.contains('is-ready')) void video.play().catch(() => {}); }
    try { if (on) sessionStorage.setItem('th-motion', 'paused'); else sessionStorage.removeItem('th-motion'); } catch { /* private mode */ }
  };
  hold.setAttribute('aria-pressed', String(root.dataset.motion === 'paused'));
  hold.addEventListener('click', () => set(hold.getAttribute('aria-pressed') !== 'true'));
}
