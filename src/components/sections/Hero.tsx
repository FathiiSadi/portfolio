import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Hero.css';

interface Props {
  started: boolean;
}

const Hero: React.FC<Props> = ({ started }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  // hold everything invisible until the gate opens
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero__eyebrow, .hero__sub, .hero__cta > *, .hero__dossier, .hero__scroll', { opacity: 0 });
      gsap.set('.hero__title .word', { yPercent: 112 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!started || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.45 });
      tl.to('.hero__eyebrow', { opacity: 1, duration: 0.7, ease: 'power3.out' });
      tl.to('.hero__title .word', {
        yPercent: 0,
        duration: 1.15,
        stagger: 0.07,
        ease: 'expo.out',
      }, '-=0.4');
      tl.to('.hero__sub', { opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.7');
      tl.to('.hero__cta > *', { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' }, '-=0.45');
      tl.to('.hero__dossier', { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4');
      tl.to('.hero__scroll', { opacity: 1, duration: 0.6 }, '-=0.3');
    }, rootRef);

    return () => ctx.revert();
  }, [started]);

  const words = (text: string, cls = '') =>
    text.split(' ').map((w, i) => (
      <span key={i} className="hero__mask">
        <span className={`word ${cls}`}>{w}</span>
      </span>
    ));

  return (
    <div ref={rootRef} className="hero">
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__shell shell">
        <div className="hero__left">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            FATHI AL-SADI — FULL-STACK ENGINEER
          </div>

          <h1 className="hero__title">
            <span className="hero__line">{words('Engineer by day.')}</span>
            <span className="hero__line hero__line--two">
              {words('Debugging at')}
              <span className="hero__mask"><span className="word hero__em">3am.</span></span>
            </span>
          </h1>

          <p className="hero__sub">
            Building production systems at <strong>Altibbi</strong>.
            Top 21 Jordan · JCPC&ensp;//&ensp;Top 1,750 global · IEEEXtreme.
          </p>

          <div className="hero__cta">
            <a href="#projects" className="btn-pill" data-magnetic data-cursor-label="Descend">
              <span className="btn-pill__dot" />
              Begin the descent
            </a>
            <a href="#contact" className="hero__ghost" data-cursor-label="Contact">
              Get in touch
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <aside className="hero__dossier" aria-label="Quick facts">
          <div className="hero__dossier-row">
            <span>ROLE</span><span>Engineer · Altibbi</span>
          </div>
          <div className="hero__dossier-row">
            <span>STACK</span><span>Laravel · React · Three.js</span>
          </div>
          <div className="hero__dossier-row">
            <span>ARENA</span><span>31 contests · Codeforces</span>
          </div>
          <div className="hero__dossier-row">
            <span>BASE</span><span>Amman · 31.95°N 35.93°E</span>
          </div>
        </aside>
      </div>

      <a href="#about" className="hero__scroll" aria-label="Scroll to next chapter">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-text">scroll to descend</span>
      </a>
    </div>
  );
};

export default Hero;
