import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';

/* A pseudo rating history — climbs, dips, climbs harder. The tallest bar burns ember. */
const BARS = [0.5, 0.8, 0.65, 1.0, 0.9, 1.25, 1.05, 1.5, 1.3, 1.75, 1.55, 2.05, 1.85, 2.4];
const PEAK = BARS.indexOf(Math.max(...BARS));

/** The ARENA — a contest floor in the void (around z -93). */
const Arena: React.FC = () => {
  const barRefs = useRef<(THREE.Mesh | null)[]>([]);

  const barMats = useMemo(
    () =>
      BARS.map((_, i) =>
        new THREE.MeshBasicMaterial({
          color: i === PEAK ? '#ff6b35' : '#0a6e80',
          transparent: true,
          opacity: i === PEAK ? 0.95 : 0.55,
          toneMapped: false,
        }),
      ),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    barRefs.current.forEach((bar, i) => {
      if (!bar) return;
      const pulse = 1 + Math.sin(t * 1.1 + i * 0.6) * 0.04;
      bar.scale.y = pulse;
    });
  });

  return (
    <group position={[0, 0, -93]}>
      <Grid
        position={[0, -2.3, 0]}
        args={[70, 70]}
        cellSize={1.1}
        cellThickness={0.5}
        cellColor="#0a2a33"
        sectionSize={5.5}
        sectionThickness={1}
        sectionColor="#0e5666"
        fadeDistance={42}
        fadeStrength={2.5}
        infiniteGrid={false}
      />
      {BARS.map((h, i) => {
        const x = (i - (BARS.length - 1) / 2) * 0.95;
        return (
          <mesh
            key={i}
            ref={(el) => { barRefs.current[i] = el; }}
            position={[x, -2.3 + h / 2, -3]}
            material={barMats[i]}
          >
            <boxGeometry args={[0.34, h, 0.34]} />
          </mesh>
        );
      })}
      {/* faint dome of the arena */}
      <mesh position={[0, -2, -3]}>
        <sphereGeometry args={[10, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#06303b" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
};

export default Arena;
