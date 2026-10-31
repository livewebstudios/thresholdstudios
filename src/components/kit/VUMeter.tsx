// VU meter face (handoff 3.4). Pure SVG, rendered statically by Astro or inside the VUMeters island.
// The scale is laid out like a real VU meter: needle position is linear in voltage, not in dB.
import type { Ref } from 'react';

export const PIVOT = { x: 110, y: 132 };
const SWEEP = 50; // degrees either side of vertical
const RADIUS = 92;

export function dbToAngle(db: number): number {
  const v = (d: number) => Math.pow(10, d / 20);
  const pos = (v(db) - v(-20)) / (v(3) - v(-20));
  return -SWEEP + Math.max(-0.04, Math.min(1.04, pos)) * SWEEP * 2;
}

const polar = (angle: number, r: number) => {
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: PIVOT.x + r * Math.cos(a), y: PIVOT.y + r * Math.sin(a) };
};

const arc = (from: number, to: number, r: number) => {
  const a = polar(from, r), b = polar(to, r);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
};

const MAJOR = [-20, -10, -7, -5, -3, 0, 3];
const MINOR = [-2, -1, 1, 2];

interface Props {
  id: string;
  db?: number;
  label?: string;
  needleRef?: Ref<SVGGElement>;
  className?: string;
}

export default function VUMeter({ id, db = -5, label = 'VU', needleRef, className = '' }: Props) {
  const tip = polar(0, RADIUS + 6);
  return (
    <svg className={`vu ${className}`} viewBox="0 0 220 150" role="img" aria-label="VU meter" focusable="false">
      <defs>
        <radialGradient id={`${id}-face`} cx="50%" cy="70%" r="80%">
          <stop offset="0" className="vu-s-face-hi" />
          <stop offset="0.6" className="vu-s-face" />
          <stop offset="1" className="vu-s-face-lo" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="85%" r="70%">
          <stop offset="0" className="vu-s-glow" />
          <stop offset="1" className="vu-s-glow vu-s-clear" />
        </radialGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="vu-s-glass-a" />
          <stop offset="0.45" className="vu-s-glass-b" />
          <stop offset="0.46" className="vu-s-glass-b vu-s-clear" />
        </linearGradient>
        <linearGradient id={`${id}-bezel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="vu-s-bezel-a" />
          <stop offset="1" className="vu-s-bezel-b" />
        </linearGradient>
        <clipPath id={`${id}-win`}>
          <rect x="12" y="12" width="196" height="118" rx="3" />
        </clipPath>
      </defs>
      <rect x="1" y="1" width="218" height="148" rx="6" fill={`url(#${id}-bezel)`} className="vu__bezel" />
      <rect x="11" y="11" width="198" height="120" rx="4" className="vu__well" />
      <g clipPath={`url(#${id}-win)`}>
        <rect x="12" y="12" width="196" height="118" fill={`url(#${id}-face)`} />
        <rect x="12" y="12" width="196" height="118" fill={`url(#${id}-glow)`} />
        <path d={arc(-SWEEP, SWEEP, RADIUS - 8)} className="vu__arc" />
        <path d={arc(dbToAngle(0), dbToAngle(3), RADIUS - 5)} className="vu__redzone" />
        {MAJOR.map((d) => {
          const ang = dbToAngle(d), a = polar(ang, RADIUS - 8), b = polar(ang, RADIUS + 1), t = polar(ang, RADIUS + 10);
          return (
            <g key={d}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={d > 0 ? 'vu__tick vu__tick--major vu--hot' : 'vu__tick vu__tick--major'} />
              <text x={t.x} y={t.y} className={d > 0 ? 'vu__num vu--hot-text' : 'vu__num'} textAnchor="middle" dominantBaseline="middle">
                {d > 0 ? `+${d}` : d === 0 ? '0' : Math.abs(d)}
              </text>
            </g>
          );
        })}
        {MINOR.map((d) => {
          const ang = dbToAngle(d), a = polar(ang, RADIUS - 8), b = polar(ang, RADIUS - 2);
          return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={d > 0 ? 'vu__tick vu--hot' : 'vu__tick'} />;
        })}
        <text x="34" y="44" className="vu__sign">−</text>
        <text x="186" y="44" className="vu__sign vu--hot-text" textAnchor="end">+</text>
        <text x={PIVOT.x} y="100" className="vu__label" textAnchor="middle">{label}</text>
        <g ref={needleRef} className="vu__needle" transform={`rotate(${dbToAngle(db).toFixed(2)} ${PIVOT.x} ${PIVOT.y})`}>
          <line x1={PIVOT.x + 1.2} y1={PIVOT.y} x2={tip.x + 1.2} y2={tip.y + 3} className="vu__needle-shadow" />
          <line x1={PIVOT.x} y1={PIVOT.y} x2={tip.x} y2={tip.y} className="vu__needle-line" />
        </g>
        <rect x="12" y="112" width="196" height="20" className="vu__lip" />
        <circle cx={PIVOT.x} cy={PIVOT.y} r="9" className="vu__pivot" />
        <circle cx={PIVOT.x - 2} cy={PIVOT.y - 2} r="3" className="vu__pivot-hi" />
        <rect x="12" y="12" width="196" height="118" fill={`url(#${id}-glass)`} />
      </g>
      <rect x="11.5" y="11.5" width="197" height="119" rx="4" className="vu__rim" />
    </svg>
  );
}
