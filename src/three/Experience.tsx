import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../scroll/scrollState';
import CameraRig from './CameraRig';
import PostFX from './PostFX';
import Starfield from './scenes/Starfield';
import HeroEntity from './scenes/HeroEntity';
import AboutShards from './scenes/AboutShards';
import SkillsConstellation from './scenes/SkillsConstellation';
import ProjectMonoliths from './scenes/ProjectMonoliths';
import Arena from './scenes/Arena';
import ContactStar from './scenes/ContactStar';

/** The persistent WebGL world behind the whole site.
    One canvas, one camera, six chapters — scroll is the dolly track. */
const Experience: React.FC = () => {
  const mobile = useMemo(
    () => typeof window !== 'undefined' && (window.innerWidth < 821 || navigator.maxTouchPoints > 1),
    [],
  );
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      scrollState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="webgl" aria-hidden="true">
      <Canvas
        dpr={[1, mobile ? 1.5 : 1.75]}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
        }}
        camera={{ fov: 50, near: 0.1, far: 90, position: [0, 0, 8.6] }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#020208');
          scene.fog = new THREE.FogExp2('#020208', 0.018);
        }}
      >
        <CameraRig reduced={reduced} />
        <Starfield mobile={mobile} />
        <HeroEntity reduced={reduced} mobile={mobile} />
        <AboutShards />
        <SkillsConstellation />
        <Suspense fallback={null}>
          <ProjectMonoliths />
        </Suspense>
        <Arena />
        <ContactStar mobile={mobile} />
        <PostFX mobile={mobile} />
      </Canvas>
    </div>
  );
};

export default Experience;
