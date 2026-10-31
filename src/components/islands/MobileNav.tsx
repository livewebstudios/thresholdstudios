// Full-screen mobile menu (handoff 6.1). A modal <dialog> gives the focus trap, Esc and inert background.
// Without JS the MENU link jumps to the footer, where the same three links live.
import { useEffect, useRef, useState } from 'react';
import { trapTab } from './trapFocus';

interface Props {
  links: { label: string; href: string; current: boolean }[];
  phone: string;
  phoneHref: string;
}

export default function MobileNav({ links, phone, phoneHref }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.classList.add('menu-open');
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const onClose = () => {
    setOpen(false);
    document.documentElement.classList.remove('menu-open');
    opener.current?.focus();
  };

  return (
    <>
      <a
        ref={opener}
        href="#site-footer"
        className="menu-btn mono"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => { e.preventDefault(); setOpen(true); }}
      >
        <span className="menu-btn__bars" aria-hidden="true"><span /><span /></span>
        MENU
      </a>
      <dialog ref={dialog} className="menu" aria-label="Site menu" onClose={onClose} onKeyDown={(e) => trapTab(e, dialog.current)}>
        <div className="menu__top">
          <span className="mono menu__label">THRESHOLD · MENU</span>
          <button type="button" className="mono menu__close" onClick={() => setOpen(false)}>CLOSE</button>
        </div>
        <nav aria-label="Mobile">
          <ul role="list" className="menu__list">
            {links.map((l, i) => (
              <li key={l.href}>
                <a href={l.href} className="menu__link" aria-current={l.current ? 'page' : undefined}>
                  <span className="mono menu__num">{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu__foot">
          <p className="mono menu__addr">517 WEST 45TH STREET · HELL&apos;S KITCHEN · BY APPOINTMENT</p>
          <a className="btn btn--primary menu__call" href={phoneHref}>CALL {phone}</a>
        </div>
      </dialog>
    </>
  );
}
