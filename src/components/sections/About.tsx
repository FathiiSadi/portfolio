import { Fragment, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const BEATS = [
  {
    idx: '01', tag: 'Origin',
    title: 'It started at HTU.',
    body: 'What began as curiosity became a foundation. HTU introduced me to software engineering, problem-solving, and the mindset of building things that matter.',
  },
  {
    idx: '02', tag: 'Growth',
    title: 'Then it got real.',
    body: 'Joining Altibbi changed the scale. My work started reaching real users, real systems, and real business impact.',
  },
  {
    idx: '03', tag: 'Ambition',
    title: 'Now: the hard room.',
    body: "Focused on operating at the highest level—solving harder problems, building larger systems, and preparing for the world's most demanding engineering teams.",
  },
];

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const beatsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline reveals char-by-char
      gsap.from('.about__head .ch', {
        yPercent: 115, opacity: 0, duration: 1, stagger: 0.025, ease: 'expo.out',
        scrollTrigger: { trigger: '.about__head', start: 'top 82%' },
      });

      beatsRef.current.forEach((beat, i) => {
        if (!beat) return;
        // Each beat's lines slide up in sequence
        gsap.from(beat.querySelectorAll('.about__rev'), {
          y: 42, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: beat, start: 'top 78%' },
        });
        // Drive the active beat → morphs the sticky visual
        ScrollTrigger.create({
          trigger: beat,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => { if (self.isActive) setActive(i); },
        });
      });

      // CSS `position: sticky` doesn't work inside the transform-based smooth
      // scroll (the content wrapper is fixed + translated, so there's nothing
      // for sticky to stick to). Emulate the pin by translating the panel down
      // at the same rate the page scrolls up, keeping it parked at ~18vh while
      // the three beats pass — so every scene is seen, not just the first.
      if (window.matchMedia('(min-width: 861px)').matches) {
        const col = sectionRef.current?.querySelector<HTMLElement>('.about__visual');
        const panel = sectionRef.current?.querySelector<HTMLElement>('.about__visual-inner');
        if (col && panel) {
          gsap.fromTo(panel,
            { y: 0 },
            {
              y: () => Math.max(0, col.offsetHeight - panel.offsetHeight),
              ease: 'none',
              scrollTrigger: {
                trigger: col,
                start: 'top 18%',
                end: () => '+=' + Math.max(0, col.offsetHeight - panel.offsetHeight),
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
        }
      }

      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Per-word groups keep letters from breaking mid-word while each char stays a `.ch`.
  const split = (t: string) =>
    t.split(' ').map((word, wi, arr) => (
      <Fragment key={wi}>
        <span className="word">
          {word.split('').map((c, i) => (
            <span key={i} className="ch" style={{ display: 'inline-block' }}>{c}</span>
          ))}
        </span>
        {wi < arr.length - 1 ? ' ' : null}
      </Fragment>
    ));

  return (
    <div ref={sectionRef} className="about section">
      <div className="shell">
        <header className="chapter">
          <span className="chapter__index">02</span>
          <span className="chapter__title">About · The story</span>
          <span className="chapter__rule" />
        </header>

        <h2 className="about__head">
          {split('I build systems,')}
          <br />
          <em>{split('not just features.')}</em>
        </h2>

        <div className="about__inner">
          {/* Left — scrolling story beats */}
          <div className="about__beats">
            {BEATS.map((b, i) => (
              <div
                key={b.idx}
                ref={(el) => { beatsRef.current[i] = el; }}
                className={`about__beat ${active === i ? 'is-active' : ''}`}
              >
                <span className="about__beat-tag about__rev">[ {b.idx} · {b.tag} ]</span>
                <h3 className="about__beat-title about__rev">{b.title}</h3>
                <p className="about__beat-body about__rev">{b.body}</p>
              </div>
            ))}
          </div>

          {/* Right — sticky visual that morphs per beat */}
          <div className="about__visual">
            <div className="about__visual-inner">
              <div className="about__progress">
                {BEATS.map((_, i) => (
                  <span key={i} className={`about__progress-dot ${active >= i ? 'is-on' : ''}`} />
                ))}
              </div>

              {/* Scene 0 — Origin: a terminal booting the first system */}
              <div className={`about__scene ${active === 0 ? 'is-active' : ''}`}>
                <div className="about__win">
                  <div className="about__win-head">
                    <span className="about__win-dot" /><span className="about__win-dot" /><span className="about__win-dot about__win-dot--on" />
                    <span className="about__win-name">~/htu — origin</span>
                  </div>
                  <pre className="about__win-body">
                    <span><i>$</i> git init</span>
                    <span className="o">initialized empty repository</span>
                    <span><i>$</i> ./ship --first-real-system</span>
                    <span className="o">build ok · deployed · users online</span>
                    <span><i>$</i> <em className="about__cur" /></span>
                  </pre>
                </div>
              </div>

              {/* Scene 1 — Growth: production metrics */}
              <div className={`about__scene ${active === 1 ? 'is-active' : ''}`}>
                <div className="about__win">
                  <div className="about__win-head">
                    <span className="about__win-dot" /><span className="about__win-dot" /><span className="about__win-dot about__win-dot--on" />
                    <span className="about__win-name">~/altibbi — production</span>
                  </div>
                  <div className="about__metrics">
                    {[
                      { k: 'uptime', v: '99.9%', w: '99%' },
                      { k: 'p95 latency', v: '120ms', w: '72%' },
                      { k: 'bugs shipped', v: 'low', w: '18%' },
                      { k: 'ownership', v: 'high', w: '92%' },
                    ].map((m) => (
                      <div key={m.k} className="about__metric">
                        <div className="about__metric-top">
                          <span>{m.k}</span><em>{m.v}</em>
                        </div>
                        <div className="about__metric-bar"><span style={{ width: m.w }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scene 2 — Ambition: target rings */}
              <div className={`about__scene ${active === 2 ? 'is-active' : ''}`}>
                <div className="about__target">
                  <span className="about__ring about__ring--1" />
                  <span className="about__ring about__ring--2" />
                  <span className="about__ring about__ring--3" />
                  <span className="about__target-core">HARD<br />PROBLEMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
