import { useEffect, useState } from 'react';
import { subscribeChapter, getChapter, CHAPTERS, SECTION_IDS } from '../../scroll/scrollState';
import './Navbar.css';

const LINKS = [
  { href: '#about', num: '02', label: 'Origin' },
  { href: '#projects', num: '04', label: 'Work' },
  { href: '#arena', num: '05', label: 'Arena' },
  { href: '#contact', num: '06', label: 'Transmit' },
];

const Navbar: React.FC = () => {
  const [chapter, setChapterState] = useState(getChapter());
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeChapter(() => setChapterState(getChapter())), []);

  // close the overlay when a link is chosen
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  return (
    <>
      <header className="nav">
        <a href="#hero" className="nav__brand" aria-label="Back to start">
          <span className="nav__brand-glyph">F</span>
          <span className="nav__brand-sep">/</span>
          <span className="nav__brand-glyph nav__brand-glyph--dim">AS</span>
        </a>

        <div className="nav__chapter" aria-hidden="true">
          <span className="nav__chapter-code">{chapter.code}</span>
          <span className="nav__chapter-name">{chapter.name}</span>
        </div>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">
              <sup>{l.num}</sup> {l.label}
            </a>
          ))}
        </nav>

        <button
          className={`nav__burger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span /><span />
        </button>
      </header>

      <div className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="menu__list" aria-label="Chapters">
          {SECTION_IDS.map((id) => (
            <a key={id} href={`#${id}`} className="menu__item" onClick={close}>
              <span className="menu__item-code">{CHAPTERS[id].code}</span>
              <span className="menu__item-name">{CHAPTERS[id].name}</span>
            </a>
          ))}
        </nav>
        <div className="menu__foot">
          <span>Amman · GMT+3</span>
          <a href="mailto:fathii.alsadi@gmail.com" onClick={close}>fathii.alsadi@gmail.com</a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
