import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { projectsData } from '../../data/projects';

const SLOTS = [
  { x: -3.1, z: -52, ry: 0.5 },
  { x: 3.1, z: -60, ry: -0.5 },
  { x: -3.1, z: -68, ry: 0.5 },
  { x: 3.1, z: -76, ry: -0.5 },
];

const W = 3.6;
const H = 2.25;

/** Four monoliths lining the WORK corridor — each carries a project's image
    and wakes up (color, edge glow, light pillar) as the camera reaches it. */
const ProjectMonoliths: React.FC = () => {
  const urls = useMemo(() => projectsData.map((p) => p.backgroundImage || p.logo || ''), []);
  const textures = useTexture(urls, (loaded) => {
    (Array.isArray(loaded) ? loaded : [loaded]).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
    });
  });

  const imgMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const edgeMats = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const pillarMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const groups = useRef<(THREE.Group | null)[]>([]);

  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(W * 1.04, H * 1.06)), []);

  useFrame((state) => {
    const camZ = state.camera.position.z;
    const t = state.clock.elapsedTime;
    SLOTS.forEach((slot, i) => {
      // wake factor: 0 far away → 1 when the camera is beside the slab
      const dist = Math.abs(camZ - (slot.z + 4));
      const wake = THREE.MathUtils.smoothstep(1 - Math.min(dist / 14, 1), 0.25, 1);

      const img = imgMats.current[i];
      if (img) {
        const v = 0.22 + wake * 0.78;
        img.color.setScalar(v);
      }
      const edge = edgeMats.current[i];
      if (edge) edge.opacity = 0.12 + wake * 0.75;
      const pillar = pillarMats.current[i];
      if (pillar) pillar.opacity = (0.04 + wake * 0.16) * (0.85 + Math.sin(t * 1.4 + i) * 0.15);

      const g = groups.current[i];
      if (g) g.position.y = Math.sin(t * 0.32 + i * 1.7) * 0.12;
    });
  });

  return (
    <>
      {SLOTS.map((slot, i) => {
        const tex = Array.isArray(textures) ? textures[i] : textures;
        return (
          <group
            key={projectsData[i].id}
            ref={(el) => { groups.current[i] = el; }}
            position={[slot.x, 0, slot.z]}
            rotation={[0, slot.ry, 0]}
          >
            <mesh>
              <planeGeometry args={[W, H]} />
              <meshBasicMaterial
                ref={(el) => { imgMats.current[i] = el; }}
                map={tex}
                toneMapped={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            <lineSegments geometry={edges}>
              <lineBasicMaterial
                ref={(el) => { edgeMats.current[i] = el; }}
                color="#00e5ff"
                transparent
                opacity={0.2}
                depthWrite={false}
              />
            </lineSegments>
            {/* vertical light pillar behind the slab */}
            <mesh position={[0, 0, -0.35]}>
              <planeGeometry args={[0.05, 9]} />
              <meshBasicMaterial
                ref={(el) => { pillarMats.current[i] = el; }}
                color="#19f0ff"
                transparent
                opacity={0.08}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
};

export default ProjectMonoliths;
