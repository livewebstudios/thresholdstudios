// One motion system (handoff 5). Slow and physical: lights warm up, faders glide, nothing bounces.
// Everything decorative lives under gsap.matchMedia() with a reduced-motion branch.
// The head adds `js-motion` before first paint when motion is allowed, so reveal targets start hidden.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power2.out' });

const root = document.documentElement;
const q = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(sel) as NodeListOf<T>);

/* ---------- Nav: solid after 80px, hides on scroll down, returns on scroll up (always on) ---------- */
const masthead = document.querySelector<HTMLElement>('[data-masthead]');
if (masthead) {
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    masthead.classList.toggle('is-solid', y > 80);
    const menuOpen = root.classList.contains('menu-open');
    const focusInside = masthead.contains(document.activeElement);
    if (!menuOpen && !focusInside && y > lastY + 4 && y > 240) masthead.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 240) masthead.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  masthead.addEventListener('focusin', () => masthead.classList.remove('is-hidden'));
  update();
}

const mm = gsap.matchMedia();

mm.add(
  {
    motion: '(prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)',
    wide: '(min-width: 768px)',
  },
  (ctx) => {
    const { motion, wide } = ctx.conditions as { motion: boolean; reduce: boolean; wide: boolean };

    if (!motion) {
      root.classList.remove('js-motion');
      return;
    }
    root.classList.add('js-motion');

    /* ---------- Hero power-on (once) ---------- */
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (hero) {
      const tl = gsap.timeline({ delay: 0.1 });
      const media = hero.querySelector('[data-hero-media]');
      if (media) tl.fromTo(media, { filter: 'brightness(0.2)' }, { filter: 'brightness(1)', duration: 0.9, ease: 'power1.out', clearProps: 'filter' }, 0);
      const led = hero.querySelectorAll('[data-led]');
      if (led.length) tl.fromTo(led, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.inOut', clearProps: 'opacity' }, 0.15);
    }

    /* ---------- Reveals: fade up 16px, 600ms, stagger 60ms, once ---------- */
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, overwrite: true }),
    });

    /* ---------- Hairlines draw left to right ---------- */
    q('[data-draw]').forEach((el) => {
      gsap.to(el, { scaleX: 1, duration: 0.6, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
    });

    /* ---------- Parallax (transform only, 768px and up) ---------- */
    if (wide) {
      const heroMedia = document.querySelector('[data-hero-parallax]');
      if (heroMedia && hero) {
        gsap.to(heroMedia, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      }
      q('[data-parallax]').forEach((el) => {
        gsap.fromTo(el, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: el.closest('.pf') ?? el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }

    /* ---------- Nav fader: cap rises with page progress ---------- */
    const cap = document.querySelector<HTMLElement>('[data-fader-cap]');
    if (cap) {
      const setY = gsap.quickTo(cap, 'y', { duration: 0.3, ease: 'power2.out' });
      gsap.set(cap, { y: 39 });
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => setY(39 * (1 - self.progress)) });
    }

    return () => root.classList.remove('js-motion');
  },
);

/* ---------- Hero video: desktop only, never under reduced motion or Save-Data ---------- */
const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
if (video) {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const ok = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches && !saveData;
  if (ok) {
    for (const s of Array.from(video.querySelectorAll<HTMLSourceElement>('source[data-src]'))) s.src = s.dataset.src!;
    video.load();
    video.addEventListener('canplay', () => {
      video.classList.add('is-ready');
      if (root.dataset.motion !== 'paused') void video.play().catch(() => {});
    }, { once: true });
  } else {
    video.remove();
  }
}

window.addEventListener('load', () => ScrollTrigger.refresh());
// Islands that change layout after load (the service filter) announce it, so triggers re-measure and newly shown blocks reveal.
window.addEventListener('th:relayout', () => ScrollTrigger.refresh());
