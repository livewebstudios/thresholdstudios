// The two hero meters (handoff 3.4, Jon 26_10_30). Both needles rest hard left at -20. Hovering or focusing the
// CTA under a meter ([data-meter-cta="0|1"]) flips that needle to 0; leaving lets it fall back to -20.
// Reduced motion: the needle jumps instead of swinging.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import VUMeter, { dbToAngle, PIVOT } from '../kit/VUMeter';

const ORIGIN = `${PIVOT.x} ${PIVOT.y}`;
const REST = -20;
const HOT = 0;

export default function VUMeters() {
  const left = useRef<SVGGElement>(null);
  const right = useRef<SVGGElement>(null);

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const needles = [left.current, right.current].filter(Boolean) as SVGGElement[];
    needles.forEach((n) => {
      n.removeAttribute('transform');
      gsap.set(n, { svgOrigin: ORIGIN, rotation: dbToAngle(REST) });
    });

    const swing = (n: SVGGElement, db: number, up: boolean) => {
      if (still) gsap.set(n, { rotation: dbToAngle(db) });
      else gsap.to(n, { rotation: dbToAngle(db), duration: up ? 0.45 : 0.8, ease: up ? 'power2.out' : 'power2.inOut', overwrite: true });
    };

    const offs = Array.from(document.querySelectorAll<HTMLElement>('[data-meter-cta]')).map((el) => {
      const n = needles[Number(el.dataset.meterCta)];
      if (!n) return () => {};
      const on = () => swing(n, HOT, true);
      const off = () => { if (!el.matches(':hover') && document.activeElement !== el) swing(n, REST, false); };
      el.addEventListener('pointerenter', on);
      el.addEventListener('focus', on);
      el.addEventListener('pointerleave', off);
      el.addEventListener('blur', off);
      return () => {
        el.removeEventListener('pointerenter', on);
        el.removeEventListener('focus', on);
        el.removeEventListener('pointerleave', off);
        el.removeEventListener('blur', off);
      };
    });

    return () => {
      offs.forEach((off) => off());
      needles.forEach((n) => gsap.killTweensOf(n));
    };
  }, []);

  return (
    <div className="vu-pair">
      <VUMeter id="vu-l" db={REST} label="VU · L" needleRef={left} />
      <VUMeter id="vu-r" db={REST} label="VU · R" needleRef={right} />
    </div>
  );
}
