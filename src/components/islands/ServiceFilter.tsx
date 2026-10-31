// Toggle-switch filter for the service cards (handoff 3.4, 6.4).
// Server render: plain anchors to #filter-<group> targets, so CSS :target filters with JS off.
// Hydrated: real buttons with aria-pressed, filtering by a data attribute on the wrapper.
import { useEffect, useState, type ReactNode } from 'react';

interface Props {
  groups: string[];
  label: string;
  children?: ReactNode;
}

export default function ServiceFilter({ groups, label, children }: Props) {
  const all = ['ALL', ...groups];
  const [active, setActive] = useState('ALL');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const fromHash = window.location.hash.replace('#filter-', '').toUpperCase();
    if (all.includes(fromHash)) setActive(fromHash);
  }, []);

  // Filtering moves cards and everything below them, so scroll reveals must re-measure (motion.ts listens).
  useEffect(() => {
    if (ready) window.dispatchEvent(new Event('th:relayout'));
  }, [active, ready]);

  const choose = (g: string) => {
    setActive(g);
    if (window.location.hash.startsWith('#filter-')) history.replaceState(null, '', window.location.pathname);
  };

  const count = (g: string) => (g === 'ALL' ? null : g);

  return (
    <div className="sfilter" data-filter={ready ? active : undefined}>
      <div className="sfilter__bar" role="group" aria-label={label}>
        {all.map((g) =>
          ready ? (
            <button key={g} type="button" className="toggle" aria-pressed={active === g} onClick={() => choose(g)}>
              <span className="toggle__switch" aria-hidden="true"><span className="toggle__lever" /></span>
              <span className="mono">{g}</span>
            </button>
          ) : (
            <a key={g} className="toggle" href={`#filter-${g.toLowerCase()}`} data-group={count(g) ?? undefined}>
              <span className="toggle__switch" aria-hidden="true"><span className="toggle__lever" /></span>
              <span className="mono">{g}</span>
            </a>
          ),
        )}
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">
        {ready ? (active === 'ALL' ? 'Showing all ten services' : `Showing ${active.toLowerCase()} services`) : ''}
      </p>
      {children}
    </div>
  );
}
