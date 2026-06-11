import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './LoadingScreen.css';

interface Props {
  onLoadComplete: () => void;
}

/** Title sequence: counter runs, the name tracks in, then the gate
    splits open onto the hero entity. Click anywhere to skip. */
const LoadingScreen: React.FC<Props> = ({ onLoadComplete }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = rootRef.current;
    if (!root) return;

    if (reduced) {
      const t = setTimeout(onLoadComplete, 250);
      return () => clearTimeout(t);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (!doneRef.current) {
            doneRef.current = true;
            onLoadComplete();
          }
        },
      });

      tl.from('.loader__corner', { opacity: 0, duration: 0.5, stagger: 0.08 });
      tl.from('.loader__eyebrow', { opacity: 0, y: 8, duration: 0.5 }, '-=0.3');

      // the name tracks in, letter by letter
      tl.from('.loader__name .ch', {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.045,
        ease: 'expo.out',
      }, '-=0.2');

      tl.from('.loader__sub', { opacity: 0, y: 8, duration: 0.5 }, '-=0.5');

      // counter + progress line
      const counter = { v: 0 };
      tl.to(counter, {
        v: 100,
        duration: 1.9,
        ease: 'power2.inOut',
        onUpdate() {
          if (counterRef.current) {
            counterRef.current.textContent = String(Math.floor(counter.v)).padStart(3, '0');
          }
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${counter.v / 100})`;
          }
        },
      }, '-=0.6');

      // the gate opens
      tl.to('.loader__inner', { opacity: 0, duration: 0.35, ease: 'power2.in' }, '+=0.15');
      tl.to('.loader__gate--top', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '<+0.1');
      tl.to('.loader__gate--bot', { yPercent: 100, duration: 0.9, ease: 'power4.inOut' }, '<');
    }, root);

    const skip = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      gsap.to(root, { opacity: 0, duration: 0.4, onComplete: onLoadComplete });
    };
    root.addEventListener('click', skip);

    return () => {
      root.removeEventListener('click', skip);
      ctx.revert();
    };
  }, [onLoadComplete]);

  const splitName = (text: string) =>
    text.split('').map((c, i) => (
      <span key={i} className="ch">{c}</span>
    ));

  return (
    <div ref={rootRef} className="loader" role="status" aria-label="Loading">
      <div className="loader__gate loader__gate--top" />
      <div className="loader__gate loader__gate--bot" />

      <div className="loader__inner">
        <span className="loader__corner loader__corner--tl">DEEP SIGNAL</span>
        <span className="loader__corner loader__corner--tr">35.93° E</span>
        <span className="loader__corner loader__corner--bl">31.95° N</span>
        <span className="loader__corner loader__corner--br">
          <span ref={counterRef} className="loader__counter">000</span>
          <span className="loader__percent">%</span>
        </span>

        <div className="loader__center">
          <span className="loader__eyebrow">A transmission from Amman</span>
          <h1 className="loader__name" aria-label="Fathi Al-Sadi">
            <span className="loader__line">{splitName('FATHI')}</span>
            <span className="loader__line loader__line--em">{splitName('AL-SADI')}</span>
          </h1>
          <span className="loader__sub">portfolio · in six chapters</span>
          <div className="loader__bar">
            <div ref={barRef} className="loader__bar-fill" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
