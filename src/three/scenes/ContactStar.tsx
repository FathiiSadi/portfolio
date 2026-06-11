import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { viewProgress } from '../../scroll/scrollState';
import { mulberry32 } from '../utils/rng';

const CENTER_Z = -112;

const vertex = /* glsl */ `
attribute vec3 aHome;
attribute float aRand;
uniform float uTime;
uniform float uConverge;
uniform float uPixelRatio;
varying float vAlpha;
varying float vRand;

void main() {
  // each particle starts on a wide shell and falls into the star
  float c = clamp(uConverge * (1.0 + (aRand - 0.5) * 0.4), 0.0, 1.0);
  c = c * c * (3.0 - 2.0 * c);

  // spiral as they fall — accretion, not a straight collapse
  float angle = c * (2.5 + aRand * 3.0);
  float ca = cos(angle); float sa = sin(angle);
  vec3 p = aHome;
  p.xz = mat2(ca, -sa, sa, ca) * p.xz;
  p = mix(p, p * 0.04, c);

  p += vec3(
    sin(uTime * 0.7 + aRand * 40.0),
    cos(uTime * 0.6 + aRand * 30.0),
    sin(uTime * 0.5 + aRand * 20.0)
  ) * 0.05 * (1.0 - c);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (0.7 + aRand) * uPixelRatio * (16.0 / max(-mv.z, 1.0)) * (1.0 + c * 1.4);
  vAlpha = 0.25 + c * 0.75;
  vRand = aRand;
}
`;

const fragment = /* glsl */ `
varying float vAlpha;
varying float vRand;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;
  float disc = smoothstep(0.5, 0.1, r);
  vec3 cyan  = vec3(0.35, 0.93, 1.0);
  vec3 ember = vec3(1.0, 0.45, 0.25);
  vec3 col = mix(cyan, ember, step(0.97, vRand));
  gl_FragColor = vec4(col, disc * vAlpha);
}
`;

/** TRANSMIT — a star the journey collapses into. Scroll pulls every particle home. */
const ContactStar: React.FC<{ mobile: boolean }> = ({ mobile }) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);

  const count = mobile ? 2400 : 5200;

  const { geometry, uniforms } = useMemo(() => {
    const rand = mulberry32(40961);
    const home = new Float32Array(count * 3);
    const randAttr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = rand() * 2 - 1;
      const phi = rand() * Math.PI * 2;
      const r = 3.5 + Math.pow(rand(), 0.6) * 6.5;
      const sxy = Math.sqrt(1 - u * u);
      home[i * 3] = Math.cos(phi) * sxy * r;
      home[i * 3 + 1] = u * r * 0.6;
      home[i * 3 + 2] = Math.sin(phi) * sxy * r;
      randAttr[i] = rand();
    }
    const geo = new THREE.BufferGeometry();
    // positions unused in the shader, but three needs the attribute for draw count
    geo.setAttribute('position', new THREE.BufferAttribute(home.slice(), 3));
    geo.setAttribute('aHome', new THREE.BufferAttribute(home, 3));
    geo.setAttribute('aRand', new THREE.BufferAttribute(randAttr, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 14);

    return {
      geometry: geo,
      uniforms: {
        uTime: { value: 0 },
        uConverge: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
    };
  }, [count]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      const target = viewProgress('contact');
      matRef.current.uniforms.uConverge.value = THREE.MathUtils.damp(
        matRef.current.uniforms.uConverge.value, target, 5, delta,
      );
      const c = matRef.current.uniforms.uConverge.value;
      if (coreRef.current) {
        coreRef.current.scale.setScalar(0.4 + c * 1.1 + Math.sin(t * 2.2) * 0.05 * c);
      }
      if (ringARef.current) {
        ringARef.current.rotation.z = t * 0.25;
        (ringARef.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + c * 0.5;
      }
      if (ringBRef.current) {
        ringBRef.current.rotation.z = -t * 0.18;
        (ringBRef.current.material as THREE.MeshBasicMaterial).opacity = 0.06 + c * 0.3;
      }
    }
  });

  return (
    <group position={[0, 0, CENTER_Z]}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={matRef}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.32, 28, 28]} />
        <meshBasicMaterial color="#d8fbff" toneMapped={false} />
      </mesh>

      <mesh ref={ringARef} rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.5, 0.012, 8, 80]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringBRef} rotation={[Math.PI / 1.8, -0.3, 0]}>
        <torusGeometry args={[2.2, 0.008, 8, 80]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

export default ContactStar;
