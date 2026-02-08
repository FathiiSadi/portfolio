import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Arrow = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        // Just bounce
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.3;
    });

    return (
        <mesh ref={meshRef} rotation={[Math.PI, 0, 0]} scale={[2.5, 2.5, 2.5]}>
            <coneGeometry args={[1, 1.2, 3]} />
            <meshStandardMaterial
                color="#EF4444"
                roughness={0.7}
                metalness={0.3}
                emissive="#7F1D1D"
                emissiveIntensity={0.5}
            />
        </mesh>
    );
};

interface BouncingDownArrowProps {
    size?: string;
}

const BouncingDownArrow: React.FC<BouncingDownArrowProps> = ({ size = '300px' }) => {
    return (
        <div style={{ width: '100%', height: size, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, 10, 10]} intensity={1} />
                <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={2} color="#FCA5A5" />
                <Arrow />
            </Canvas>
        </div>
    );
};

export default BouncingDownArrow;
