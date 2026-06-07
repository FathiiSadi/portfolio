import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import LoadingScreen from './components/layout/LoadingScreen';
import Navbar from './components/layout/Navbar';
import ScrollProgress from './components/layout/ScrollProgress';
import BackToTop from './components/layout/BackToTop';
import Cursor from './components/Cursor';
import Footer from './components/layout/Footer';
import './styles/index.css';

const Hero = lazy(() => import('./components/sections/Hero'));
const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Projects = lazy(() => import('./components/sections/Projects'));
const CompetitiveProgramming = lazy(() => import('./components/sections/CompetitiveProgramming'));
const Contact = lazy(() => import('./components/sections/Contact'));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const smoothRef = useRef<HTMLDivElement>(null);

  const handleLoadComplete = useCallback(() => setIsLoading(false), []);

  // Scroll progress bar (acid line at top of viewport)
  useEffect(() => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
      bar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      bar.remove();
    };
  }, []);

  useEffect(() => {
    const safety = setTimeout(() => setIsLoading(false), 6500);
    if (isLoading) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      clearTimeout(safety);
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  // Lerp smooth scroll, mounted once after the loader leaves
  useEffect(() => {
    if (isLoading) return;
    let handle: { destroy: () => void } | null = null;
    let cancelled = false;
    (async () => {
      const { initSmoothScroll } = await import('./utils/smoothScroll');
      if (cancelled || !smoothRef.current) return;
      handle = initSmoothScroll(smoothRef.current);
    })();
    return () => {
      cancelled = true;
      handle?.destroy();
    };
  }, [isLoading]);

  return (
    <>
      <Cursor />
      <div className="cursor-spotlight" aria-hidden="true" />
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      {!isLoading && (
        <>
          <ScrollProgress />
          <Navbar />
          <BackToTop />
          <div id="smooth-content" ref={smoothRef}>
            <main className="portfolio">
              <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
                <section id="hero"><Hero /></section>
                <section id="about"><About /></section>
                <section id="skills"><Skills /></section>
                <section id="projects"><Projects /></section>
                <section id="competitive"><CompetitiveProgramming /></section>
                <section id="contact"><Contact /></section>
              </Suspense>
              <Footer />
            </main>
          </div>
        </>
      )}
    </>
  );
}

export default App;
