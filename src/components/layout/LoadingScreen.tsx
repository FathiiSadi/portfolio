import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './LoadingScreen.css';

const BOOT_LINES = [
  '> initializing runtime...',
  '> loading design system... OK',
  '> mounting 3D engine... OK',
  '> connecting codeforces api...',
  '> portfolio.exe ready',
];

interface Props { onLoadComplete: () => void; }

const LoadingScreen: React.FC<Props> = ({ onLoadComplete }) => {
  const ref      = useRef<HTMLDivElement>(null);
  const [lines, setLines]   = useState<string[]>([]);
  const [pct, setPct]       = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (cancelled) return;
        await new Promise(r => setTimeout(r, 260 + Math.random() * 180));
        setLines(prev => [...prev, BOOT_LINES[i]]);
        setPct(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }
      await new Promise(r => setTimeout(r, 420));
      if (!cancelled && ref.current) {
        gsap.to(ref.current, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.85,
          ease: 'power4.inOut',
          onComplete: onLoadComplete,
        });
      }
    };
    run();
    return () => { cancelled = true; };
  }, [onLoadComplete]);

  return (
    <div ref={ref} className="loader">
      <div className="loader__scanline" />
      <div className="loader__grain" />

      <div className="loader__body">
        <div className="loader__logo">FA</div>
        <div className="loader__terminal">
          {lines.map((l, i) => (
            <div key={i} className="loader__line">
              <span className="loader__line-text">{l}</span>
            </div>
          ))}
          <div className="loader__caret" />
        </div>
        <div className="loader__bar-wrap">
          <div className="loader__bar" style={{ width: `${pct}%` }} />
          <span className="loader__pct">{pct}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
