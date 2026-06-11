import { Fragment, useEffect, useRef } from 'react';
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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about__head .ch', {
        yPercent: 115,
        duration: 1,
        stagger: 0.022,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.about__head', start: 'top 80%' },
      });

      gsap.utils.toArray<HTMLElement>('.about__beat').forEach((beat) => {
        gsap.from(beat.querySelectorAll('.about__rev'), {
          y: 46,
          opacity: 0,
          duration: 1,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: beat, start: 'top 74%' },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const split = (t: string) =>
    t.split(' ').map((word, wi, arr) => (
      <Fragment key={wi}>
        <span className="word">
          {word.split('').map((c, i) => (
            <span key={i} className="ch">{c}</span>
          ))}
        </span>
        {wi < arr.length - 1 ? ' ' : null}
      </Fragment>
    ));

  return (
    <div ref={rootRef} className="about">
      <div className="about__scrim" aria-hidden="true" />
      <div className="shell">
        <header className="chapter">
          <span className="chapter__index">CH.02</span>
          <span className="chapter__title">Origin · The story</span>
          <span className="chapter__rule" />
        </header>

        <h2 className="about__head display-xl">
          {split('I build systems,')}
          <br />
          <em>{split('not just features.')}</em>
        </h2>

        <div className="about__beats">
          {BEATS.map((b) => (
            <article key={b.idx} className="about__beat">
              <span className="about__beat-idx about__rev">{b.idx}</span>
              <div className="about__beat-content">
                <span className="about__beat-tag about__rev">— {b.tag}</span>
                <h3 className="about__beat-title about__rev">{b.title}</h3>
                <p className="about__beat-body about__rev">{b.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
