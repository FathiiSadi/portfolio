// Three.js Utilities for Portfolio
import * as THREE from 'three';

/**
 * Create a basic Three.js scene with camera and renderer
 */
export const createScene = (canvas: HTMLCanvasElement) => {
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  return { scene, camera, renderer };
};

/**
 * Create an animated wireframe sphere
 */
export const createWireframeSphere = (color: string = '#3B82F6') => {
  const geometry = new THREE.SphereGeometry(2, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });
  
  return new THREE.Mesh(geometry, material);
};

/**
 * Create particle system
 */
export const createParticleSystem = (count: number = 1000) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  const color1 = new THREE.Color('#3B82F6');
  const color2 = new THREE.Color('#A78BFA');
  
  for (let i = 0; i < count * 3; i += 3) {
    // Random position in a sphere
    const radius = Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
    
    // Random color between primary and secondary
    const mixColor = color1.clone().lerp(color2, Math.random());
    colors[i] = mixColor.r;
    colors[i + 1] = mixColor.g;
    colors[i + 2] = mixColor.b;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });
  
  return new THREE.Points(geometry, material);
};

/**
 * Create a rotating geometric loader
 */
export const createLoader = () => {
  const group = new THREE.Group();
  
  // Create multiple rotating cubes
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshBasicMaterial({
    color: 0x3B82F6,
    wireframe: true,
  });
  
  for (let i = 0; i < 5; i++) {
    const cube = new THREE.Mesh(geometry, material);
    const angle = (i / 5) * Math.PI * 2;
    cube.position.x = Math.cos(angle) * 2;
    cube.position.y = Math.sin(angle) * 2;
    group.add(cube);
  }
  
  return group;
};

/**
 * Handle window resize
 */
export const handleResize = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

/**
 * Dispose of Three.js resources
 */
export const disposeScene = (scene: THREE.Scene) => {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose());
      } else {
        object.material.dispose();
      }
    }
  });
};
