import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '../utils/rng';

interface ShardConfig {
  pos: [number, number, number];
  rot: [number, number, number];
  w: number;
  h: number;
  speed: number;
  phase: number;
}

/** Floating glass panels drifting past during the ORIGIN chapter (z -13 → -27). */
const AboutShards: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  const shards = useMemo<ShardConfig[]>(() => {
    const rand = mulberry32(7331);
    const out: ShardConfig[] = [];
    for (let i = 0; i < 14; i++) {
      const z = -13 - i * 1.05 - rand();
      const side = i % 2 === 0 ? 1 : -1;
      out.push({
        pos: [
          -1.6 + side * (1.4 + rand() * 2.6),
          (rand() - 0.4) * 3.4,
          z,
        ],
        rot: [
          (rand() - 0.5) * 0.5,
          (rand() - 0.5) * 0.9,
          (rand() - 0.5) * 0.35,
        ],
        w: 0.7 + rand() * 1.3,
        h: 0.9 + rand() * 1.7,
        speed: 0.25 + rand() * 0.4,
        phase: rand() * Math.PI * 2,
      });
    }
    return out;
  }, []);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      const s = shards[i];
      if (!s) return;
      child.position.y = s.pos[1] + Math.sin(t * s.speed + s.phase) * 0.22;
      child.rotation.y = s.rot[1] + Math.sin(t * s.speed * 0.6 + s.phase) * 0.08;
      child.rotation.z = s.rot[2] + Math.cos(t * s.speed * 0.5 + s.phase) * 0.05;
    });
  });

  return (
    <group ref={groupRef}>
      {shards.map((s, i) => (
        <group key={i} position={s.pos} rotation={s.rot}>
          <mesh>
            <planeGeometry args={[s.w, s.h]} />
            <meshBasicMaterial
              color="#071119"
              transparent
              opacity={0.42}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(s.w, s.h)]} />
            <lineBasicMaterial
              color={i % 5 === 0 ? '#ff6b35' : '#00d5ec'}
              transparent
              opacity={i % 5 === 0 ? 0.35 : 0.4}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  );
};

export default AboutShards;
