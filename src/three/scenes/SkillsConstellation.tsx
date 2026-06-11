import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '../utils/rng';

const CENTER = new THREE.Vector3(0, 0, -38);

/** A slowly rotating constellation — nodes linked into a neural lattice
    floating behind the ARSENAL chapter. */
const SkillsConstellation: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.LineBasicMaterial>(null);

  const { nodesGeo, linksGeo } = useMemo(() => {
    const rand = mulberry32(11311);
    const NODE_COUNT = 34;
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const u = rand() * 2 - 1;
      const phi = rand() * Math.PI * 2;
      const r = 2.2 + Math.pow(rand(), 0.5) * 2.6;
      const sxy = Math.sqrt(1 - u * u);
      nodes.push(new THREE.Vector3(
        Math.cos(phi) * sxy * r * 1.45,
        u * r * 0.85,
        Math.sin(phi) * sxy * r,
      ));
    }

    const nGeo = new THREE.BufferGeometry().setFromPoints(nodes);
    nGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);

    // link every node to its 2 nearest neighbours
    const linkPts: THREE.Vector3[] = [];
    nodes.forEach((a, i) => {
      const sorted = nodes
        .map((b, j) => ({ j, d: a.distanceTo(b) }))
        .filter((e) => e.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2);
      sorted.forEach(({ j }) => {
        if (j > i) {
          linkPts.push(a, nodes[j]);
        }
      });
    });
    const lGeo = new THREE.BufferGeometry().setFromPoints(linkPts);
    lGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);

    return { nodesGeo: nGeo, linksGeo: lGeo };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.045;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
    }
    if (pulseRef.current) {
      pulseRef.current.opacity = 0.16 + Math.sin(state.clock.elapsedTime * 0.8) * 0.07;
    }
  });

  return (
    <group ref={groupRef} position={CENTER}>
      <points geometry={nodesGeo}>
        <pointsMaterial
          color="#7deeff"
          size={0.085}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={linksGeo}>
        <lineBasicMaterial
          ref={pulseRef}
          color="#00d5ec"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      {/* one ember node — the odd one out */}
      <mesh position={[2.6, 1.1, 0.6]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#ff6b35" toneMapped={false} />
      </mesh>
    </group>
  );
};

export default SkillsConstellation;
