import { useEffect, useRef, useState } from 'react';
import './Navbar.css';

const NAV = [
    { id: 'hero', label: 'Index' },
    { id: 'about', label: 'Profile' },
    { id: 'skills', label: 'Practice' },
    { id: 'projects', label: 'Work' },
    { id: 'competitive', label: 'Sport' },
    { id: 'contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
    const [active, setActive] = useState('hero');
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const timeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 80);
            for (const n of NAV) {
                const el = document.getElementById(n.id);
                if (!el) continue;
                const r = el.getBoundingClientRect();
                if (r.top <= window.innerHeight * 0.4 && r.bottom >= window.innerHeight * 0.4) {
                    setActive(n.id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const tick = () => {
            if (!timeRef.current) return;
            const d = new Date();
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            timeRef.current.textContent = `${hh}:${mm}:${ss}`;
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const goTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setOpen(false);
    };

    return (
        <>
            <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
                <div className="nav__row">
                    <button className="nav__brand magnetic" data-magnetic data-magnetic-strength="0.2" onClick={() => goTo('hero')}>
                        <span className="nav__brand-mark">F</span>
                        <span className="nav__brand-text">
                            Fathi <em>Al-Sadi</em>
                        </span>
                    </button>

                    <nav className="nav__links" aria-label="Sections">
                        {NAV.map((n, i) => (
                            <button
                                key={n.id}
                                onClick={() => goTo(n.id)}
                                className={`nav__link ${active === n.id ? 'nav__link--active' : ''}`}
                                data-magnetic
                                data-magnetic-strength="0.2"
                            >
                                <span className="nav__link-num">{String(i + 1).padStart(2, '0')}</span>
                                <span className="nav__link-text">{n.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="nav__meta">
                        <span className="nav__status">
                            <i className="nav__status-dot" />
                            Available
                        </span>
                        <span className="nav__time">
                            <span className="nav__time-tz">AMM</span>
                            <span ref={timeRef}>00:00:00</span>
                        </span>
                    </div>

                    <button
                        className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
                        onClick={() => setOpen(o => !o)}
                        aria-label="Menu"
                        aria-expanded={open}
                    >
                        <span /><span />
                    </button>
                </div>
            </header>

            <div className={`nav-sheet ${open ? 'nav-sheet--open' : ''}`} role="dialog">
                <div className="nav-sheet__inner">
                    <span className="nav-sheet__eyebrow">— Index</span>
                    <ul className="nav-sheet__list">
                        {NAV.map((n, i) => (
                            <li key={n.id}>
                                <button onClick={() => goTo(n.id)} className="nav-sheet__item">
                                    <span className="nav-sheet__num">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="nav-sheet__label">{n.label}</span>
                                    <span className="nav-sheet__arrow">↗</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;
