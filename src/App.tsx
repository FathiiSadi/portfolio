import { useState, useEffect } from 'react';
import LoadingScreen from './components/layout/LoadingScreen';
import Navbar from './components/layout/Navbar';
import ScrollProgress from './components/layout/ScrollProgress';
import BackToTop from './components/layout/BackToTop';
import CustomCursor from './components/layout/CustomCursor';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import InteractiveSkills from './components/sections/InteractiveSkills';
import Projects from './components/sections/Projects';
import CompetitiveProgramming from './components/sections/CompetitiveProgramming';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import './styles/index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true); // Re-enabled with short duration

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Prevent scroll during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
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
            <div id="hero"><Hero /></div>
            <div id="about"><About /></div>
            <div id="skills"><Skills /></div>
            <InteractiveSkills />
            <div id="projects"><Projects /></div>
            <div id="competitive"><CompetitiveProgramming /></div>
            <Contact />
            <Footer />
          </main>
        </>
      )}
    </>
  );
}

export default App;
