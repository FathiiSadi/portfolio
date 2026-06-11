import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '../utils/rng';

const starVertex = /* glsl */ `
attribute float aSize;
attribute float aPhase;
uniform float uTime;
uniform float uPixelRatio;
varying float vAlpha;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;

  float dist = -mv.z;
  float twinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aPhase * 1.8) + aPhase * 40.0);
  gl_PointSize = aSize * uPixelRatio * twinkle * (26.0 / max(dist, 1.0));
  gl_PointSize = clamp(gl_PointSize, 0.6, 7.0);

  // fade with depth so the void swallows distant stars
  vAlpha = twinkle * smoothstep(70.0, 14.0, dist) * 0.9;
}
`;

const starFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;
  float disc = smoothstep(0.5, 0.08, r);
  gl_FragColor = vec4(uColor, disc * vAlpha);
}
`;

/** Stars + slow dust filling a long tube around the camera path (z 12 → -130). */
const Starfield: React.FC<{ mobile: boolean }> = ({ mobile }) => {
  const starMat = useRef<THREE.ShaderMaterial>(null);
  const dustMat = useRef<THREE.ShaderMaterial>(null);
  const dustRef = useRef<THREE.Points>(null);

  const starCount = mobile ? 1200 : 2800;
  const dustCount = mobile ? 120 : 320;

  const stars = useMemo(() => makeTube(starCount, 5.5, 46), [starCount]);
  const dust = useMemo(() => makeTube(dustCount, 3.5, 26, 3.2), [dustCount]);

  const starUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Color('#cfeefb') },
    }),
    [],
  );
  const dustUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Color('#0f4b5c') },
    }),
    [],
  );

  useFrame((state) => {
    if (starMat.current) starMat.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (dustMat.current) dustMat.current.uniforms.uTime.value = state.clock.elapsedTime * 0.4;
    if (dustRef.current) dustRef.current.rotation.z = state.clock.elapsedTime * 0.008;
  });

  return (
    <>
      <points geometry={stars} frustumCulled={false}>
        <shaderMaterial
          ref={starMat}
          vertexShader={starVertex}
          fragmentShader={starFragment}
          uniforms={starUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points ref={dustRef} geometry={dust} frustumCulled={false}>
        <shaderMaterial
          ref={dustMat}
          vertexShader={starVertex}
          fragmentShader={starFragment}
          uniforms={dustUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};

function makeTube(count: number, innerR: number, outerR: number, sizeScale = 1): THREE.BufferGeometry {
  const rand = mulberry32(count * 7919 + Math.floor(innerR * 97));
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2;
    const r = innerR + Math.pow(rand(), 0.7) * (outerR - innerR);
    pos[i * 3] = Math.cos(angle) * r;
    pos[i * 3 + 1] = Math.sin(angle) * r * 0.75;
    pos[i * 3 + 2] = 14 - rand() * 146;
    size[i] = (0.5 + rand() * 1.6) * sizeScale;
    phase[i] = rand();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -55), 120);
  return geo;
}

export default Starfield;
