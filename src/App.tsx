import { useState, useEffect, lazy, Suspense } from 'react';
import LoadingScreen from './components/layout/LoadingScreen';
import Navbar from './components/layout/Navbar';
import ScrollProgress from './components/layout/ScrollProgress';
import BackToTop from './components/layout/BackToTop';
import CustomCursor from './components/layout/CustomCursor';
import Footer from './components/layout/Footer';
import './styles/index.css';

// Lazy load section components for better code-splitting
const Hero = lazy(() => import('./components/sections/Hero'));
const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const InteractiveSkills = lazy(() => import('./components/sections/InteractiveSkills'));
const Projects = lazy(() => import('./components/sections/Projects'));
const CompetitiveProgramming = lazy(() => import('./components/sections/CompetitiveProgramming'));
const Contact = lazy(() => import('./components/sections/Contact'));

function App() {
  const [isLoading, setIsLoading] = useState(true); // Re-enabled with short duration

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Safety timeout: ensure loading screen is removed after max 3 seconds
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Prevent scroll during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      clearTimeout(safetyTimeout);
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      {!isLoading && (
        <>
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <BackToTop />
          <main className="portfolio">
            <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
              <div id="hero"><Hero /></div>
              <div id="about"><About /></div>
              <div id="skills"><Skills /></div>
              <InteractiveSkills />
              <div id="projects"><Projects /></div>
              <div id="competitive"><CompetitiveProgramming /></div>
              <div id="contact"><Contact /></div>
            </Suspense>
            <Footer />
          </main>
        </>
      )}
    </>
  );
}

export default App;
