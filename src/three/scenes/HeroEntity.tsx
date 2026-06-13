import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, exitProgress } from '../../scroll/scrollState';
import { simplex3, curl3 } from '../shaders/noise';
import { mulberry32 } from '../utils/rng';

const RADIUS = 2.15;

const vertex = /* glsl */ `
${simplex3}
${curl3}

attribute vec3 aScatter;
attribute float aRand;
attribute float aSize;

uniform float uTime;
uniform float uIntro;
uniform float uDisperse;
uniform vec3 uPointer;
uniform float uPixelRatio;
uniform float uMotion;

varying float vGlow;
varying float vRand;

void main() {
  // Per-particle stagger so the form never moves as one rigid blob
  float t = uTime * 0.18;

  // intro: scattered → sphere · disperse: sphere → scattered (scroll out)
  float gather = uIntro * (1.0 - uDisperse);
  float m = 1.0 - gather; // 0 = perfect form, 1 = fully scattered
  m = clamp(m + (aRand - 0.5) * 0.25 * (1.0 - abs(m * 2.0 - 1.0)), 0.0, 1.0);

  vec3 base = mix(position, aScatter, m * m * (3.0 - 2.0 * m));

  // Living surface — curl field breathes through the form
  vec3 flow = curl(base * 0.55 + vec3(0.0, t, t * 0.7));
  float amp = (0.18 + 0.55 * m) * uMotion;
  base += flow * amp;

  // Slow breathing
  base *= 1.0 + sin(uTime * 0.5 + aRand * 6.2831) * 0.012 * uMotion;

  // Cursor repulsion — particles part around the pointer
  vec3 away = base - uPointer;
  float d = length(away);
  float push = smoothstep(1.9, 0.0, d);
  base += normalize(away + 0.0001) * push * 0.85 * (1.0 - m);

  vec4 mv = modelViewMatrix * vec4(base, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = aSize * (1.0 + push * 1.6);
  gl_PointSize = size * uPixelRatio * (14.0 / -mv.z) * (1.0 - m * 0.45);

  vGlow = push;
  vRand = aRand;
}
`;

const fragment = /* glsl */ `
uniform float uOpacity;

varying float vGlow;
varying float vRand;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;
  float disc = smoothstep(0.5, 0.05, r);

  // teal/orange grade: the rare ember spark against the cyan body
  vec3 cyan  = vec3(0.0, 0.898, 1.0);
  vec3 deep  = vec3(0.02, 0.38, 0.48);
  vec3 ember = vec3(1.0, 0.42, 0.21);

  vec3 col = mix(deep, cyan, smoothstep(0.25, 0.95, vRand));
  col = mix(col, ember, step(0.984, vRand) * 0.9);
  col += vGlow * 0.6;

  gl_FragColor = vec4(col, disc * uOpacity);
}
`;

interface Props {
  reduced: boolean;
  mobile: boolean;
}

const HeroEntity: React.FC<Props> = ({ reduced, mobile }) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const count = mobile ? 9000 : 26000;

  const { geometry, uniforms } = useMemo(() => {
    const rand = mulberry32(20251);
    const sphere = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const randAttr = new Float32Array(count);
    const size = new Float32Array(count);

    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere with slight radial breathing room
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const rad = RADIUS * (0.92 + rand() * 0.1);
      sphere[i * 3] = Math.cos(theta) * r * rad;
      sphere[i * 3 + 1] = y * rad;
      sphere[i * 3 + 2] = Math.sin(theta) * r * rad;

      // scatter shell — where particles live before the intro / after dispersal
      const sr = 7 + rand() * 11;
      const u = rand() * 2 - 1;
      const phi = rand() * Math.PI * 2;
      const sxy = Math.sqrt(1 - u * u);
      scatter[i * 3] = Math.cos(phi) * sxy * sr;
      scatter[i * 3 + 1] = u * sr * 0.7;
      scatter[i * 3 + 2] = Math.sin(phi) * sxy * sr - 4;

      randAttr[i] = rand();
      size[i] = 0.6 + rand() * 1.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(sphere, 3));
    geo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
    geo.setAttribute('aRand', new THREE.BufferAttribute(randAttr, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 40);

    const uni = {
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uDisperse: { value: 0 },
      uPointer: { value: new THREE.Vector3(99, 99, 99) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uOpacity: { value: 1 },
      uMotion: { value: 1 },
    };
    return { geometry: geo, uniforms: uni };
  }, [count]);

  const rayRef = useRef({
    origin: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    hit: new THREE.Vector3(),
  });

  useFrame((state, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const ray = rayRef.current;

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uMotion.value = reduced ? 0.35 : 1;

    // intro converge once the loader hands over
    const introTarget = scrollState.started ? 1 : 0;
    mat.uniforms.uIntro.value = THREE.MathUtils.damp(
      mat.uniforms.uIntro.value, introTarget, 1.2, delta,
    );

    // scrolling out of the hero scatters the form into the journey
    const d = exitProgress('hero');
    mat.uniforms.uDisperse.value = THREE.MathUtils.damp(
      mat.uniforms.uDisperse.value, d * d * (3 - 2 * d), 6, delta,
    );

    // pointer NDC → world point on the entity's z-plane (group is at z=0)
    const px = scrollState.pointer.x;
    const py = scrollState.pointer.y;
    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    ray.dir.set(px, py, 0.5).unproject(camera).sub(ray.origin).normalize();
    const t = (0 - ray.origin.z) / (ray.dir.z || 0.0001);
    if (t > 0) {
      ray.hit.copy(ray.origin).addScaledVector(ray.dir, t);
      // into entity-local space (group offset on x)
      ray.hit.x -= groupRef.current?.position.x ?? 0;
      mat.uniforms.uPointer.value.lerp(ray.hit, 1 - Math.exp(-8 * delta));
    }

    // inner core pulses faintly; wireframe ghost turns
    if (coreRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.06;
      coreRef.current.scale.setScalar(s * (1 - mat.uniforms.uDisperse.value));
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05 * (reduced ? 0.3 : 1);
    }
  });

  return (
    // narrow screens: pull the entity toward center and shrink it so the
    // form reads behind the stacked hero text instead of cropping offscreen
    <group ref={groupRef} position={[mobile ? 1.0 : 1.45, 0, 0]} scale={mobile ? 0.82 : 1}>
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

      {/* ghost cage + hot core — bloom turns these into the heart of the entity */}
      <mesh>
        <icosahedronGeometry args={[RADIUS * 0.62, 1]} />
        <meshBasicMaterial color="#0e3742" wireframe transparent opacity={0.34} />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshBasicMaterial color="#bffaff" toneMapped={false} />
      </mesh>
    </group>
  );
};

export default HeroEntity;
