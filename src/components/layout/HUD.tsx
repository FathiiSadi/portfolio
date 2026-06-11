import { useEffect, useRef, useState } from 'react';
import { scrollState, subscribeChapter, getChapter, SECTION_IDS, CHAPTERS } from '../../scroll/scrollState';

/** Fixed film chrome: chapter readout, six chapter ticks,
    scroll percentage and the right-edge progress rail. */
const HUD: React.FC = () => {
  const [chapter, setChapterState] = useState(getChapter());
  const pctRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeChapter(() => setChapterState(getChapter())), []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = scrollState.progress;
      if (pctRef.current) {
        pctRef.current.textContent = `${String(Math.round(p * 100)).padStart(3, '0')} / 100`;
      }
      if (railRef.current) {
        railRef.current.style.transform = `scaleY(${p})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className="hud" aria-hidden="true">
        <div className="hud__chapter">
          <span className="hud__chapter-code">{chapter.code}</span>
          <span className="hud__chapter-name">{chapter.name}</span>
        </div>

        <div className="hud__mid">
          {SECTION_IDS.map((id) => (
            <span
              key={id}
              className={`hud__tick ${CHAPTERS[id].index === chapter.index ? 'hud__tick--active' : ''}`}
            />
          ))}
        </div>

        <span ref={pctRef} className="hud__progress">000 / 100</span>
      </div>

      <div className="hud__rail" aria-hidden="true">
        <div ref={railRef} className="hud__rail-fill" />
      </div>
    </>
  );
};

export default HUD;
