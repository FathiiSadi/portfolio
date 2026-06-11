import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '../../types';
import { projectsData } from '../../data/projects';
import ProjectDialog from '../ui/ProjectDialog';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.proj').forEach((card) => {
        gsap.from(card.querySelectorAll('.proj__rev'), {
          y: 54,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 78%' },
        });

        const img = card.querySelector('.proj__media img');
        if (img) {
          gsap.fromTo(img,
            { yPercent: -9, scale: 1.16 },
            {
              yPercent: 9,
              scale: 1.16,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            });
        }
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleOpen = (p: Project) => {
    setSelected(p);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelected(null), 300);
  };

  return (
    <div ref={rootRef} className="projects">
      <div className="projects__scrim" aria-hidden="true" />
      <div className="shell">
        <header className="chapter">
          <span className="chapter__index">CH.04</span>
          <span className="chapter__title">Work · Selected systems</span>
          <span className="chapter__rule" />
        </header>

        <div className="projects__head">
          <h2 className="display-xl">
            Four shipped <em>systems.</em>
          </h2>
          <p className="projects__sub">
            Each one solved a real problem under real constraints —
            the monoliths you're flying past carry them.
          </p>
        </div>

        <div className="projects__list">
          {projectsData.map((p, i) => (
            <article key={p.id} className={`proj ${i % 2 === 1 ? 'proj--flip' : ''}`}>
              <div className="proj__meta proj__rev">
                <span className="proj__index">/{String(i + 1).padStart(2, '0')}</span>
                <span className="proj__year">{p.year}</span>
              </div>

              <button
                className="proj__media proj__rev"
                onClick={() => handleOpen(p)}
                data-cursor-label="Open case"
                aria-label={`Open ${p.title} case study`}
              >
                <img src={p.backgroundImage || p.logo || ''} alt={p.title} loading="lazy" />
                <span className="proj__media-frame" aria-hidden="true" />
                <span className="proj__media-scan" aria-hidden="true" />
              </button>

              <div className="proj__body">
                <span className="proj__cat proj__rev">{p.category}</span>
                <h3 className="proj__title proj__rev">{p.title}</h3>
                <p className="proj__desc proj__rev">{p.description}</p>
                <div className="proj__tags proj__rev">
                  {p.technologies.slice(0, 5).map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <button
                  className="proj__open proj__rev"
                  onClick={() => handleOpen(p)}
                  data-magnetic
                >
                  <span>Read case study</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.4"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="projects__end">
          <span>That's a sample.</span>
          <a href="#contact" className="projects__end-link" data-magnetic>
            Talk to me about the rest →
          </a>
        </div>
      </div>

      <ProjectDialog project={selected} isOpen={open} onClose={handleClose} />
    </div>
  );
};

export default Projects;
