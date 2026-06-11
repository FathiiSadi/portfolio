import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction, ChromaticAberrationEffect } from 'postprocessing';
import * as THREE from 'three';
import { scrollState } from '../scroll/scrollState';

/** The film grade: bloom for every emissive source, grain, vignette,
    and a whisper of chromatic aberration that swells with scroll speed.
    The CA effect is built by hand and mounted as a <primitive> — the
    wrapped component JSON-stringifies its props (incl. ref in React 19),
    which chokes on circular scene-graph references. */
const PostFX: React.FC<{ mobile: boolean }> = ({ mobile }) => {
  const ca = useMemo(
    () =>
      new ChromaticAberrationEffect({
        offset: new THREE.Vector2(0.0009, 0.0005),
        radialModulation: false,
        modulationOffset: 0,
      }),
    [],
  );

  useFrame(() => {
    const v = Math.min(Math.abs(scrollState.velocity) / 60, 1);
    const amount = 0.0009 + v * 0.0035;
    ca.offset.set(amount, amount * 0.6);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.16}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.72}
      />
      {!mobile ? <primitive object={ca} /> : <></>}
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.55} />
      <Vignette eskil={false} offset={0.16} darkness={0.86} />
    </EffectComposer>
  );
};

export default PostFX;
