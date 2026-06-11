import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, stationFrac, fracAt, type SectionId } from '../scroll/scrollState';

interface Pose {
  pos: [number, number, number];
  look: [number, number, number];
}

/* Where the camera parks for each chapter. The journey threads:
   entity (0) → shard field (-13..-27) → constellation (-38) →
   monolith corridor (-52..-76) → arena (-93) → the star (-112). */
const STATIONS: { id: SectionId; localT?: number; pose: Pose }[] = [
  { id: 'hero', pose: { pos: [0, 0, 8.6], look: [1.0, 0, 0] } },
  { id: 'about', pose: { pos: [-2.5, 0.6, -14], look: [-1.0, 0.2, -21] } },
  { id: 'skills', pose: { pos: [2.3, -0.2, -30.5], look: [0.3, 0, -38] } },
  // two stations inside the long WORK section → camera traverses the corridor
  { id: 'projects', localT: 0.12, pose: { pos: [0.4, 0.2, -47.5], look: [-1.4, 0, -53] } },
  { id: 'projects', localT: 0.82, pose: { pos: [-0.4, 0.1, -71], look: [1.6, 0, -77] } },
  { id: 'arena', pose: { pos: [0, 1.7, -85.5], look: [0, -0.4, -94] } },
  { id: 'contact', pose: { pos: [0, 0.3, -103.5], look: [0, 0, -112] } },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

const CameraRig: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const target = useMemo(
    () => ({
      pos: new THREE.Vector3(0, 0, 8.6),
      look: new THREE.Vector3(1, 0, 0),
      lookActual: new THREE.Vector3(1, 0, 0),
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
    }),
    [],
  );
  const frames = useRef<{ t: number; pose: Pose }[]>([]);
  const lastMeasure = useRef(-1);

  useFrame((state, delta) => {
    // (re)build keyframe fractions whenever the page is re-measured
    if (lastMeasure.current !== scrollState.measureId) {
      lastMeasure.current = scrollState.measureId;
      frames.current = STATIONS.map((s) => ({
        t: s.localT !== undefined ? fracAt(s.id, s.localT) : stationFrac(s.id),
        pose: s.pose,
      })).sort((x, y) => x.t - y.t);
    }
    const kf = frames.current;
    if (kf.length < 2) return;

    const p = scrollState.progress;

    // find bracketing keyframes
    let i = 0;
    while (i < kf.length - 2 && p > kf[i + 1].t) i++;
    const k0 = kf[i];
    const k1 = kf[i + 1];
    const span = Math.max(k1.t - k0.t, 0.0001);
    const local = smooth(THREE.MathUtils.clamp((p - k0.t) / span, 0, 1));

    target.a.fromArray(k0.pose.pos);
    target.b.fromArray(k1.pose.pos);
    target.pos.lerpVectors(target.a, target.b, local);

    target.a.fromArray(k0.pose.look);
    target.b.fromArray(k1.pose.look);
    target.look.lerpVectors(target.a, target.b, local);

    // cinematic lag — the camera trails its mark slightly
    const cam = state.camera;
    const lag = 1 - Math.exp(-5.2 * delta);

    // pointer parallax + idle breathing
    const t = state.clock.elapsedTime;
    const motion = reduced ? 0.25 : 1;
    const px = scrollState.pointer.x * 0.34 * motion;
    const py = scrollState.pointer.y * 0.22 * motion;
    const bobY = Math.sin(t * 0.4) * 0.05 * motion;
    const bobX = Math.cos(t * 0.31) * 0.03 * motion;

    cam.position.x += (target.pos.x + px + bobX - cam.position.x) * lag;
    cam.position.y += (target.pos.y + py + bobY - cam.position.y) * lag;
    cam.position.z += (target.pos.z - cam.position.z) * lag;

    target.lookActual.lerp(target.look, lag);
    cam.lookAt(target.lookActual);

    // speed shake — barely-there roll when moving fast
    const v = Math.min(Math.abs(scrollState.velocity) / 80, 1);
    cam.rotation.z += Math.sin(t * 9) * 0.0016 * v * motion;
  });

  return null;
};

export default CameraRig;
