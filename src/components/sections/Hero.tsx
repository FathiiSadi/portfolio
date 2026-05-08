import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import './Hero.css';

/* ──────────────────────────────────────────────────────────────────────────
   Software-engineering themed 3D scene.
   A central wireframe core + orbital satellite nodes connected by edges
   (a "system architecture" graph), plus floating code-symbol glyphs.
   Tracks the mouse for a parallax tilt.
   ────────────────────────────────────────────────────────────────────────── */

const ACID = '#D7FF3A';
const PLASMA = '#6BD3FF';

type MouseRef = React.MutableRefObject<{ x: number; y: number; hover: number }>;

/* Fibonacci-sphere distribution for evenly placed satellite nodes. */
function fibonacciSphere(n: number, radius: number) {
    const out: THREE.Vector3[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = phi * i;
        out.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius));
    }
    return out;
}

const Core: React.FC = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const lineRef = useRef<THREE.LineSegments>(null);

    useFrame((_, dt) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += dt * 0.18;
            meshRef.current.rotation.x += dt * 0.06;
            const s = 1 + Math.sin(performance.now() * 0.0014) * 0.04;
            meshRef.current.scale.setScalar(s);
        }
        if (lineRef.current && meshRef.current) {
            lineRef.current.rotation.copy(meshRef.current.rotation);
            lineRef.current.scale.copy(meshRef.current.scale);
        }
    });

    return (
        <group>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[0.85, 1]} />
                <meshBasicMaterial color="#0B0B10" />
            </mesh>
            <lineSegments ref={lineRef}>
                <wireframeGeometry args={[new THREE.IcosahedronGeometry(0.86, 1)]} />
                <lineBasicMaterial color={ACID} transparent opacity={0.7} />
            </lineSegments>
            {/* Inner spinning octahedron suggests a "kernel" inside the core. */}
            <InnerKernel />
        </group>
    );
};

const InnerKernel: React.FC = () => {
    const ref = useRef<THREE.LineSegments>(null);
    useFrame((_, dt) => {
        if (ref.current) {
            ref.current.rotation.x -= dt * 0.5;
            ref.current.rotation.z += dt * 0.35;
        }
    });
    return (
        <lineSegments ref={ref}>
            <wireframeGeometry args={[new THREE.OctahedronGeometry(0.42, 0)]} />
            <lineBasicMaterial color={PLASMA} transparent opacity={0.55} />
        </lineSegments>
    );
};

const SatelliteNode: React.FC<{ position: THREE.Vector3; index: number }> = ({ position, index }) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((_, dt) => {
        if (groupRef.current) {
            groupRef.current.rotation.x += dt * (0.4 + (index % 3) * 0.15);
            groupRef.current.rotation.y += dt * (0.3 + (index % 4) * 0.1);
        }
    });
    const isAcid = index % 3 === 0;
    return (
        <group position={position}>
            <group ref={groupRef}>
                <mesh>
                    <boxGeometry args={[0.16, 0.16, 0.16]} />
                    <meshBasicMaterial color="#0B0B10" />
                </mesh>
                <lineSegments>
                    <wireframeGeometry args={[new THREE.BoxGeometry(0.17, 0.17, 0.17)]} />
                    <lineBasicMaterial
                        color={isAcid ? ACID : '#E8E8EE'}
                        transparent
                        opacity={isAcid ? 0.9 : 0.45}
                    />
                </lineSegments>
            </group>
            {/* Halo glow point */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[new Float32Array([0, 0, 0]), 3]}
                        count={1}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.18}
                    color={isAcid ? ACID : PLASMA}
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
};

/* Lines from the core out to every satellite + a few node-to-node edges. */
const Connections: React.FC<{ nodes: THREE.Vector3[] }> = ({ nodes }) => {
    const geom = useMemo(() => {
        const positions: number[] = [];
        // Hub-spoke: core (origin) to each node
        nodes.forEach(n => {
            positions.push(0, 0, 0, n.x, n.y, n.z);
        });
        // A few node-to-node edges (deterministic, sparse)
        const pairs: Array<[number, number]> = [];
        for (let i = 0; i < nodes.length; i++) {
            const j = (i + 3) % nodes.length;
            const k = (i + 5) % nodes.length;
            if (i < j) pairs.push([i, j]);
            if (i < k) pairs.push([i, k]);
        }
        pairs.forEach(([a, b]) => {
            const na = nodes[a];
            const nb = nodes[b];
            positions.push(na.x, na.y, na.z, nb.x, nb.y, nb.z);
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        return g;
    }, [nodes]);

    return (
        <lineSegments geometry={geom}>
            <lineBasicMaterial color={ACID} transparent opacity={0.18} />
        </lineSegments>
    );
};

/* Build a CanvasTexture with a code symbol drawn on it. Avoids async font
   loading (drei <Text> would suspend the canvas and blank the scene). */
function makeGlyphTexture(char: string, color: string): THREE.CanvasTexture {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = color;
        // Auto-fit: shorter strings get a bigger font
        const fontPx = char.length === 1 ? 200 : char.length === 2 ? 140 : 110;
        ctx.font = `600 ${fontPx}px ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.fillText(char, size / 2, size / 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
}

/* Sprite-based glyph — always faces the camera, renders instantly, no async. */
const Glyph: React.FC<{
    texture: THREE.CanvasTexture;
    position: [number, number, number];
    scale: number;
    bobSpeed: number;
}> = ({ texture, position, scale, bobSpeed }) => {
    const ref = useRef<THREE.Sprite>(null);
    const start = useMemo(() => Math.random() * Math.PI * 2, []);
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.position.y = position[1] + Math.sin(t * bobSpeed + start) * 0.14;
        ref.current.position.x = position[0] + Math.cos(t * bobSpeed * 0.7 + start) * 0.06;
    });
    return (
        <sprite ref={ref} position={position} scale={[scale, scale, scale]}>
            <spriteMaterial
                map={texture}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </sprite>
    );
};

const Glyphs: React.FC = () => {
    const items = useMemo(() => {
        const defs = [
            { char: '{', pos: [-2.4, 1.0, -0.2], color: ACID, scale: 0.7, bob: 0.6 },
            { char: '}', pos: [2.4, -0.9, 0.4], color: ACID, scale: 0.7, bob: 0.55 },
            { char: '</>', pos: [0.0, 1.8, -0.6], color: '#FFFFFF', scale: 0.7, bob: 0.5 },
            { char: ';', pos: [-1.7, -1.4, 0.8], color: PLASMA, scale: 0.55, bob: 0.7 },
            { char: '()', pos: [1.9, 1.3, -0.8], color: '#C8C8D2', scale: 0.55, bob: 0.45 },
            { char: '=>', pos: [-2.1, 0.1, 1.0], color: ACID, scale: 0.55, bob: 0.6 },
            { char: '01', pos: [2.1, 0.2, 1.1], color: '#C8C8D2', scale: 0.5, bob: 0.65 },
            { char: '#', pos: [0.6, -1.9, -0.4], color: PLASMA, scale: 0.55, bob: 0.55 },
        ];
        return defs.map(d => ({
            ...d,
            texture: makeGlyphTexture(d.char, d.color),
        }));
    }, []);

    useEffect(() => () => {
        items.forEach(it => it.texture.dispose());
    }, [items]);

    return (
        <>
            {items.map((it, i) => (
                <Glyph
                    key={i}
                    texture={it.texture}
                    position={it.pos as [number, number, number]}
                    scale={it.scale}
                    bobSpeed={it.bob}
                />
            ))}
        </>
    );
};

/* Subtle starfield of small particles in a spherical shell. */
const ParticleField: React.FC = () => {
    const ref = useRef<THREE.Points>(null);
    const { positions, count } = useMemo(() => {
        const N = 320;
        const arr = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            const r = 2.6 + Math.random() * 2.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            arr[i * 3 + 2] = r * Math.cos(phi);
        }
        return { positions: arr, count: N };
    }, []);

    useFrame((_, dt) => {
        if (ref.current) {
            ref.current.rotation.y += dt * 0.03;
            ref.current.rotation.x += dt * 0.012;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
            </bufferGeometry>
            <pointsMaterial
                size={0.012}
                color={ACID}
                transparent
                opacity={0.5}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

/* The whole scene rotates softly with the mouse for parallax. */
const Scene: React.FC<{ mouseRef: MouseRef }> = ({ mouseRef }) => {
    const groupRef = useRef<THREE.Group>(null);
    const nodes = useMemo(() => fibonacciSphere(10, 1.8), []);

    useFrame((_, dt) => {
        if (!groupRef.current) return;
        const targetX = mouseRef.current.y * 0.35;
        const targetY = mouseRef.current.x * 0.55;
        groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
        groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
        // Constant slow orbital drift
        groupRef.current.rotation.y += dt * 0.05;
    });

    return (
        <group ref={groupRef}>
            <Core />
            <Connections nodes={nodes} />
            {nodes.map((n, i) => (
                <SatelliteNode key={i} position={n} index={i} />
            ))}
            <Glyphs />
            <ParticleField />
            <ambientLight intensity={0.6} />
            <pointLight position={[3, 4, 5]} intensity={0.8} color={ACID} />
            <pointLight position={[-4, -3, 2]} intensity={0.4} color={PLASMA} />
        </group>
    );
};

const Hero: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const eyebrowRef = useRef<HTMLDivElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const sideRef = useRef<HTMLDivElement>(null);

    const mouse = useRef({ x: 0, y: 0, hover: 0 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
        };
        const onEnter = () => (mouse.current.hover = 1);
        const onLeave = () => (mouse.current.hover = 0);

        window.addEventListener('mousemove', onMove);
        sectionRef.current?.addEventListener('mouseenter', onEnter);
        sectionRef.current?.addEventListener('mouseleave', onLeave);
        return () => {
            window.removeEventListener('mousemove', onMove);
            sectionRef.current?.removeEventListener('mouseenter', onEnter);
            sectionRef.current?.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    useEffect(() => {
        if (!titleRef.current) return;
        const lines = titleRef.current.querySelectorAll('.hero-line__inner');
        const tl = gsap.timeline({ delay: 0.1 });
        gsap.set(lines, { yPercent: 110 });
        tl.from(eyebrowRef.current, { opacity: 0, y: 12, duration: 0.7, ease: 'power3.out' });
        tl.to(lines, {
            yPercent: 0,
            duration: 1.05,
            stagger: 0.1,
            ease: 'expo.out',
        }, '-=0.4');
        tl.from(subRef.current, { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, '-=0.6');
        tl.from(ctaRef.current?.children || [], {
            opacity: 0, y: 12, duration: 0.5, stagger: 0.06, ease: 'power3.out',
        }, '-=0.5');
        tl.from(sideRef.current?.children || [], {
            opacity: 0, x: 24, duration: 0.6, stagger: 0.06, ease: 'power3.out',
        }, '-=0.4');
    }, []);

    return (
        <div ref={sectionRef} className="hero">
            <div className="hero__canvas" aria-hidden="true">
                <Canvas
                    camera={{ position: [0, 0, 5.4], fov: 38 }}
                    dpr={[1, 1.6]}
                    gl={{ antialias: true, alpha: true }}
                >
                    <Scene mouseRef={mouse} />
                </Canvas>
                <div className="hero__canvas-glow" />
            </div>

            <div className="hero__rails">
                <span /><span /><span /><span /><span />
            </div>

            <div className="hero__shell shell">
                <div ref={eyebrowRef} className="hero__eyebrow">
                    <span className="hero__eyebrow-dot" />
                    <span>Fathi Al-Sadi · 2026 — Software engineering</span>
                    <span className="hero__eyebrow-loc">Amman, Jordan 31°57'N · 35°56'E</span>
                </div>

                <h1 ref={titleRef} className="hero__title">
                    <span className="hero-line">
                        <span className="hero-line__inner">Engineering <em className="hero__em">in&nbsp;quiet</em></span>
                    </span>
                    <span className="hero-line">
                        <span className="hero-line__inner">systems that <span className="hero__acid">outlast</span></span>
                    </span>
                    <span className="hero-line">
                        <span className="hero-line__inner"><em className="hero__em">the</em> trends.</span>
                    </span>
                </h1>

                <div className="hero__lower">
                    <p ref={subRef} className="hero__sub">
                        I'm <strong>Fathi Al-Sadi</strong> — a software engineer building
                        production-grade backends, full-stack applications and the
                        glue that holds them together. Currently shipping for healthcare
                        out of <em>Amman</em>.
                    </p>

                    <div ref={ctaRef} className="hero__cta">
                        <a
                            href="#projects"
                            className="btn-pill"
                            data-magnetic
                            data-magnetic-strength="0.3"
                            data-cursor-label="See work"
                        >
                            <span className="btn-pill__dot" />
                            See selected work
                        </a>
                        <a
                            href="#contact"
                            className="hero__ghost"
                            data-magnetic
                            data-magnetic-strength="0.3"
                        >
                            <span>Start a project</span>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.4"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div ref={sideRef} className="hero__sidecard">
                    <div className="hero__sidecard-row">
                        <span className="hero__sidecard-key">Now</span>
                        <span className="hero__sidecard-val">Engineer · Altibbi</span>
                    </div>
                    <div className="hero__sidecard-row">
                        <span className="hero__sidecard-key">Stack</span>
                        <span className="hero__sidecard-val">Laravel · Vue · Postgres</span>
                    </div>
                    <div className="hero__sidecard-row">
                        <span className="hero__sidecard-key">Sport</span>
                        <span className="hero__sidecard-val">Codeforces · 31 contests</span>
                    </div>
                </div>

                <a href="#about" className="hero__scroll" aria-label="Scroll to next section">
                    <span className="hero__scroll-text">scroll</span>
                    <span className="hero__scroll-line" />
                </a>
            </div>
        </div>
    );
};

export default Hero;
