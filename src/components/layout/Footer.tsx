import './Footer.css';

const CREDITS = [
  { role: 'Written, directed & engineered by', name: 'Fathi Al-Sadi' },
  { role: 'Shot on', name: 'One WebGL canvas · Three.js' },
  { role: 'Score', name: 'GSAP · Lenis · 60fps' },
  { role: 'Typography', name: 'Clash Display · Instrument Serif · Satoshi · JetBrains Mono' },
  { role: 'Filmed in', name: 'Amman, Jordan · GMT+3' },
];

const ELSEWHERE = [
  { label: 'GitHub', href: 'https://github.com/FathiiSadi' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fathi-sadi/' },
  { label: 'Codeforces', href: 'https://codeforces.com/profile/SolveXJO' },
  { label: 'Email', href: 'mailto:fathii.alsadi@gmail.com' },
];

/** End credits. The journey is over; roll the names. */
const Footer: React.FC = () => {
  return (
    <footer className="foot">
      <div className="shell">
        <div className="foot__fin" aria-hidden="true">
          <span className="foot__fin-word">fin.</span>
        </div>

        <div className="foot__credits">
          {CREDITS.map((c) => (
            <div key={c.role} className="foot__credit">
              <span className="foot__credit-role">{c.role}</span>
              <span className="foot__credit-name">{c.name}</span>
            </div>
          ))}
        </div>

        <div className="foot__elsewhere">
          {ELSEWHERE.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="foot__link"
            >
              {l.label} ↗
            </a>
          ))}
        </div>

        <div className="foot__base">
          <span>© {new Date().getFullYear()} Fathi Al-Sadi — built byte by byte.</span>
          <a href="#hero" className="foot__top" data-cursor-label="Rewind">
            ↑ Back to the beginning
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
