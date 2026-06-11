import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

const ROW_A = [
  'Laravel', 'Vue', 'React', 'TypeScript', 'Node', 'PHP',
  'Postgres', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Linux',
];

const ROW_B = [
  'RAG', 'LangChain', 'FAISS', 'Embeddings', 'Architecture',
  'Performance', 'APIs', 'Domain-driven', 'Profiling', 'Caching',
  'Queues', 'Systems',
];

const COLUMNS = [
  {
    num: '01', title: 'Backend & systems',
    items: ['Laravel · PHP · Node', 'MySQL · Postgres · Redis', 'Queues · cron · caching', 'Domain-driven design'],
  },
  {
    num: '02', title: 'Frontend & motion',
    items: ['React · Vue · TypeScript', 'Three.js · WebGL · GLSL', 'GSAP · scroll choreography', 'Design systems'],
  },
  {
    num: '03', title: 'AI & retrieval',
    items: ['RAG architecture', 'LangChain · FAISS', 'Embeddings · semantic search', 'LLM orchestration'],
  },
];

const Skills: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackARef = useRef<HTMLDivElement>(null);
  const trackBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(trackARef.current, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
      gsap.set(trackBRef.current, { xPercent: -50 });
      gsap.to(trackBRef.current, { xPercent: 0, duration: 42, ease: 'none', repeat: -1 });

      gsap.from('.skills__col', {
        y: 44,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.skills__cols', start: 'top 80%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const renderRow = (items: string[]) => (
    <>
      {[0, 1].map((dup) => (
        <div key={dup} className="ticker__group" aria-hidden={dup === 1 ? 'true' : undefined}>
          {items.map((item, i) => (
            <span key={`${dup}-${i}`} className="ticker__item">
              <span className="ticker__text">{item}</span>
              <span className="ticker__star" aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      ))}
    </>
  );

  return (
    <div ref={rootRef} className="skills">
      <div className="skills__scrim" aria-hidden="true" />
      <div className="shell">
        <header className="chapter">
          <span className="chapter__index">CH.03</span>
          <span className="chapter__title">Arsenal · Tools of the trade</span>
          <span className="chapter__rule" />
        </header>

        <div className="skills__cols">
          {COLUMNS.map((c) => (
            <div key={c.num} className="skills__col">
              <span className="skills__col-num">{c.num}</span>
              <h3 className="skills__col-title">{c.title}</h3>
              <ul className="skills__col-list">
                {c.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="ticker ticker--a">
        <div ref={trackARef} className="ticker__track">{renderRow(ROW_A)}</div>
      </div>
      <div className="ticker ticker--b">
        <div ref={trackBRef} className="ticker__track">{renderRow(ROW_B)}</div>
      </div>
    </div>
  );
};

export default Skills;
