// Gallery lightbox (handoff 4). Wraps the server-rendered grid; every tile is a plain link to the large image,
// so with JS off a click simply opens the photo. Hydrated: a modal <dialog> with arrows, Esc and a focus trap.
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { trapTab } from './trapFocus';

interface Item { href: string; alt: string; caption: string }

export default function Lightbox({ children }: { children?: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const links = Array.from(wrap.current?.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]') ?? []);
    setItems(links.map((a) => ({ href: a.href, alt: a.querySelector('img')?.alt ?? '', caption: a.dataset.caption ?? '' })));
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-lightbox]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      lastTrigger.current = a;
      setIndex(links.indexOf(a));
    };
    wrap.current?.addEventListener('click', onClick);
    return () => wrap.current?.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index >= 0 && !d.open) { d.showModal(); document.documentElement.classList.add('menu-open'); }
    if (index < 0 && d.open) d.close();
  }, [index]);

  const step = useCallback((dir: number) => setIndex((i) => (i + dir + items.length) % items.length), [items.length]);

  const onKey = (e: React.KeyboardEvent) => {
    trapTab(e, dialog.current);
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  const onClose = () => {
    setIndex(-1);
    document.documentElement.classList.remove('menu-open');
    lastTrigger.current?.focus();
  };

  const item = index >= 0 ? items[index] : null;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div ref={wrap} className="lightbox-scope">
      {children}
      <dialog ref={dialog} className="lightbox" aria-label="Photo viewer" onClose={onClose} onKeyDown={onKey}>
        {item && (
          <figure className="lightbox__fig">
            <img src={item.href} alt={item.alt} className="lightbox__img" />
            <figcaption className="lightbox__bar">
              <span className="nameplate">{item.caption}</span>
              <span className="mono lightbox__count" aria-live="polite">{pad(index + 1)} / {pad(items.length)}</span>
            </figcaption>
          </figure>
        )}
        <div className="lightbox__controls">
          <button type="button" className="mono lightbox__btn" onClick={() => step(-1)} aria-label="Previous photo">← PREV</button>
          <button type="button" className="mono lightbox__btn" onClick={() => step(1)} aria-label="Next photo">NEXT →</button>
          <button type="button" className="mono lightbox__btn lightbox__close" onClick={() => setIndex(-1)}>CLOSE</button>
        </div>
      </dialog>
    </div>
  );
}
