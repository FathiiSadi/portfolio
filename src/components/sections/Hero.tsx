import { useEffect, useRef, Suspense, lazy, Component, type ReactNode } from 'react';
import { gsap } from 'gsap';
import './Hero.css';

/* Spline robot — lazy-loaded so it never blocks first paint.
   TODO: replace with your own Spline robot scene that follows the cursor.
   Grab a "robot cursor follower" scene from spline.design/community. */
// NOTE: '@splinetool/react-spline' is the correct entry for Vite/React.
// '@splinetool/react-spline/next' is the Next.js-only build and won't work here.
const Spline = lazy(() => import('@splinetool/react-spline'));
const SPLINE_SCENE = 'https://prod.spline.design/i1stdMJQnB-sCZue/scene.splinecode';

/* CSS glowing orb — shown while Spline loads, or permanently if it fails. */
const Orb = () => (
  <div className="hero__orb" aria-hidden="true">
    <span className="hero__orb-core" />
    <span className="hero__orb-ring" />
    <span className="hero__orb-ring hero__orb-ring--2" />
  </div>
);

/* Error boundary → fall back to the orb if the Spline scene can't load. */
class SplineBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <Orb /> : this.props.children; }
}

const Hero: React.FC = () => {
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLAnchorElement>(null);
  const canvasRef  = useRef<HTMLDivElement>(null);

  // Keep the robot following the cursor (pointer-events stay on the canvas),
  // but stop Spline from consuming wheel/touch to zoom the 3D scene — which
  // otherwise intermittently blocks page scroll over the robot. We stop the
  // event in the capture phase before it reaches Spline's own listener, and
  // never call preventDefault, so the page keeps scrolling normally.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const stop = (e: Event) => e.stopPropagation();
    const opts = { capture: true, passive: true } as AddEventListenerOptions;
    el.addEventListener('wheel', stop, opts);
    el.addEventListener('touchmove', stop, opts);
    return () => {
      el.removeEventListener('wheel', stop, opts);
      el.removeEventListener('touchmove', stop, opts);
    };
  }, []);

  useEffect(() => {
    const words = titleRef.current?.querySelectorAll('.hero__word') ?? [];
    gsap.set(words, { x: -40, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.15 });
    tl.from(eyebrowRef.current, { opacity: 0, y: 10, duration: 0.7, ease: 'power3.out' });
    tl.to(words, {
      x: 0, opacity: 1,
      duration: 1, stagger: 0.08, ease: 'expo.out',
    }, '-=0.35');
    tl.from(subRef.current, { opacity: 0, y: 14, duration: 0.7, ease: 'power3.out' }, '-=0.7');
    tl.from(ctaRef.current?.children ?? [], {
      opacity: 0, y: 12, duration: 0.55, stagger: 0.07, ease: 'power3.out',
    }, '-=0.5');
    tl.from(cardRef.current, { opacity: 0, x: 20, duration: 0.65, ease: 'power3.out' }, '-=0.4');
    tl.from(scrollRef.current, { opacity: 0, y: 10, duration: 0.5, ease: 'power3.out' }, '-=0.3');
  }, []);

  return (
    <section className="hero">
      {/* Spline robot — centered backdrop */}
      <div ref={canvasRef} className="hero__canvas" aria-hidden="true">
        <SplineBoundary>
          <Suspense fallback={<Orb />}>
            <Spline scene={SPLINE_SCENE} className="hero__spline" />
          </Suspense>
        </SplineBoundary>
        <div className="hero__canvas-glow" />
      </div>

      {/* Radiating grid lines */}
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__shell shell">
        <div className="hero__left">
          <div ref={eyebrowRef} className="hero__eyebrow">
            <span className="hero__label">FATHI AL-SADI · FULL-STACK ENGINEER</span>
            <span className="hero__label-caret" />
          </div>

          <h1 ref={titleRef} className="hero__title">
            <span className="hero__line">
              <span className="hero__word">Engineer</span>{' '}
              <span className="hero__word">by</span>{' '}
              <span className="hero__word">day.</span>
            </span>
            <span className="hero__line">
              <span className="hero__word">Debugging</span>{' '}
              <span className="hero__word">at</span>{' '}
              <span className="hero__word hero__word--cyan">3am.</span>
            </span>
          </h1>

          <p ref={subRef} className="hero__sub">
            Building production systems at <strong>Altibbi</strong> · Top 21 Jordan
            JCPC · Top 1,750 IEEEXtreme
          </p>

          <div ref={ctaRef} className="hero__cta">
            <a href="#projects" className="btn-pill" data-magnetic data-cursor-label="Scroll">
              <span className="btn-pill__dot" />
              View My Work ↓
            </a>
            <a href="#contact" className="hero__ghost" data-cursor-label="Contact">
              Get in touch
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8"
                  stroke="currentColor" strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <div ref={cardRef} className="hero__sidecard">
          <div className="hero__sidecard-row">
            <span className="hero__sidecard-key">Role</span>
            <span className="hero__sidecard-val">Engineer · Altibbi</span>
          </div>
          <div className="hero__sidecard-sep" />
          <div className="hero__sidecard-row">
            <span className="hero__sidecard-key">Stack</span>
            <span className="hero__sidecard-val">Laravel · React · Postgres</span>
          </div>
          <div className="hero__sidecard-sep" />
          <div className="hero__sidecard-row">
            <span className="hero__sidecard-key">CF</span>
            <span className="hero__sidecard-val">31 contests · Specialist</span>
          </div>
        </div>
      </div>

      <a ref={scrollRef} href="#about" className="hero__scroll" aria-label="Scroll">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-text">scroll</span>
      </a>
    </section>
  );
};

export default Hero;
