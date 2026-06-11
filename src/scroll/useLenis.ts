import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState, measureSections } from './scrollState';

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scroll wired into GSAP's ticker + ScrollTrigger.
    Native scroll height stays intact (unlike transform-based smoothing),
    so position: sticky, anchors and accessibility all keep working. */
export function useLenis(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', () => {
      scrollState.progress = lenis.progress;
      scrollState.velocity = lenis.velocity;
      ScrollTrigger.update();
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Smooth-scroll all in-page anchors through Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: reduced ? 0 : 1.6 });
    };
    document.addEventListener('click', onClick);

    const onResize = () => measureSections();
    measureSections();
    window.addEventListener('resize', onResize);
    // Re-measure once everything (fonts, images) has settled
    const t = setTimeout(measureSections, 600);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      clearTimeout(t);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Loader on screen → freeze the page
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (enabled) {
      lenis.start();
      measureSections();
    } else {
      lenis.stop();
    }
  }, [enabled]);
}
