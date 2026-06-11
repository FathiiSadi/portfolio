import { useCallback, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Experience from './three/Experience';
import { useLenis } from './scroll/useLenis';
import { scrollState, setChapter, SECTION_IDS } from './scroll/scrollState';
import LoadingScreen from './components/layout/LoadingScreen';
import Navbar from './components/layout/Navbar';
import HUD from './components/layout/HUD';
import Cursor from './components/Cursor';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import CompetitiveProgramming from './components/sections/CompetitiveProgramming';
import Contact from './components/sections/Contact';
import './styles/index.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Sections stay mounted under the loader so the world can be measured
  // and the canvas is already alive when the gate opens.
  useLenis(!isLoading);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
    scrollState.started = true;
  }, []);

  // chapter readout follows whichever section owns the viewport center
  useEffect(() => {
    const triggers = SECTION_IDS.map((id) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) setChapter(id);
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <>
      <Experience />
      <Cursor />
      <div className="cursor-spotlight" aria-hidden="true" />

      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}

      <Navbar />
      <HUD />

      <div className="page">
        <main>
          <section id="hero"><Hero started={!isLoading} /></section>
          <section id="about"><About /></section>
          <section id="skills"><Skills /></section>
          <section id="projects"><Projects /></section>
          <section id="arena"><CompetitiveProgramming /></section>
          <section id="contact"><Contact /></section>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
