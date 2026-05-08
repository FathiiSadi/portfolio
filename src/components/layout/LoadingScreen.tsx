import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './LoadingScreen.css';

interface LoadingScreenProps {
    onLoadComplete: () => void;
}

const STATUS_TICKER = [
    'booting runtime',
    'resolving modules',
    'compiling shaders',
    'streaming assets',
    'linking scene graph',
    'warming cache',
    'ready',
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadComplete }) => {
    const root = useRef<HTMLDivElement>(null);
    const counter = useRef<HTMLDivElement>(null);
    const monogram = useRef<HTMLDivElement>(null);
    const cover = useRef<HTMLDivElement>(null);
    const meta = useRef<HTMLDivElement>(null);
    const word = useRef<HTMLDivElement>(null);
    const role = useRef<HTMLDivElement>(null);
    const status = useRef<HTMLDivElement>(null);
    const bar = useRef<HTMLDivElement>(null);
    const stream = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [statusIdx, setStatusIdx] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const letters = word.current?.querySelectorAll('.lw') || [];

            // Pin natural rest state up front so StrictMode's double-invoke
            // can't snapshot a half-animated state as the "destination".
            gsap.set(letters, { clearProps: 'all' });
            gsap.set([meta.current, monogram.current, role.current, status.current, bar.current, stream.current],
                { clearProps: 'all' });

            // Stagger entrance
            const tl = gsap.timeline();
            tl.from(meta.current, { opacity: 0, y: -10, duration: 0.7, ease: 'power3.out' })
                .from(monogram.current, { opacity: 0, scale: 0.92, duration: 0.9, ease: 'expo.out' }, 0.1)
                .from(letters, {
                    yPercent: 100,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.04,
                    ease: 'expo.out',
                }, 0.25)
                .from(role.current, { opacity: 0, y: 14, duration: 0.7, ease: 'power3.out' }, 0.55)
                .from(status.current, { opacity: 0, y: 8, duration: 0.6, ease: 'power3.out' }, 0.7)
                .from(bar.current, { scaleX: 0, transformOrigin: '0 50%', duration: 0.7, ease: 'power3.out' }, 0.7)
                .from(stream.current, { opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.8);

            // Drive progress 0 → 100
            const obj = { v: 0 };
            gsap.to(obj, {
                v: 100,
                duration: 2.6,
                ease: 'power2.inOut',
                onUpdate: () => {
                    const v = obj.v;
                    setProgress(Math.floor(v));
                    // Map progress to status index (last entry "ready" only at 100)
                    const idx = v >= 100
                        ? STATUS_TICKER.length - 1
                        : Math.min(STATUS_TICKER.length - 2, Math.floor((v / 100) * (STATUS_TICKER.length - 1)));
                    setStatusIdx(idx);
                },
                onComplete: () => {
                    gsap.delayedCall(0.5, runWipeOut);
                },
            });

            function runWipeOut() {
                const out = gsap.timeline({
                    onComplete: () => {
                        gsap.to(root.current, {
                            autoAlpha: 0,
                            duration: 0.2,
                            onComplete: onLoadComplete,
                        });
                    },
                });
                out
                    .to([counter.current, monogram.current, meta.current, role.current, status.current, bar.current, stream.current], {
                        opacity: 0,
                        y: -16,
                        duration: 0.5,
                        stagger: 0.03,
                        ease: 'power3.in',
                    })
                    .to(letters, {
                        yPercent: -100,
                        duration: 0.7,
                        stagger: 0.03,
                        ease: 'expo.in',
                    }, 0.05)
                    .to(cover.current, {
                        yPercent: -100,
                        duration: 1,
                        ease: 'expo.inOut',
                    }, 0.25);
            }
        }, root);

        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={root} className="loader" aria-hidden="true">
            <div ref={cover} className="loader__cover" />

            <div ref={meta} className="loader__meta">
                <span className="loader__meta-l">Fathi Al. / 2026 — PORTFOLIO</span>
                <span className="loader__meta-c">building experience</span>
                <span className="loader__meta-r">v / 04 — REV.A</span>
            </div>

            <div className="loader__center">
                <div ref={monogram} className="loader__mono">
                    <svg viewBox="0 0 120 120" width="100%" height="100%">
                        <circle cx="60" cy="60" r="58" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
                        <circle cx="60" cy="60" r="44" stroke="rgba(215,255,58,0.7)" strokeWidth="1" fill="none"
                            strokeDasharray="276" strokeDashoffset={276 * (1 - progress / 100)}
                            transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 80ms linear' }} />
                        <text x="60" y="68" textAnchor="middle" fontFamily="Instrument Serif, serif"
                            fontSize="48" fontStyle="italic" fill="white">F</text>
                        <text x="80" y="68" textAnchor="middle" fontFamily="Instrument Serif, serif"
                            fontSize="48" fontStyle="italic" fill="#D7FF3A">.</text>
                    </svg>
                </div>

                <div className="loader__name">
                    <div ref={word} className="loader__word">
                        {'fathi'.split('').map((c, i) => (
                            <span key={i} className="lw">{c}</span>
                        ))}
                        <span className="lw lw--dot">·</span>
                        {'al-sadi'.split('').map((c, i) => (
                            <span key={`b${i}`} className="lw">{c}</span>
                        ))}
                    </div>
                </div>

                <div ref={role} className="loader__role">
                    <span className="loader__role-line" />
                    <span>software engineer · amman</span>
                    <span className="loader__role-line" />
                </div>
            </div>

            <div className="loader__bottom">
                <div ref={status} className="loader__status">
                    <span className="loader__status-prompt">$</span>
                    <span className="loader__status-text" key={statusIdx}>
                        {STATUS_TICKER[statusIdx]}
                        <span className="loader__caret" />
                    </span>
                </div>

                <div ref={bar} className="loader__bar">
                    <span
                        className="loader__bar-fill"
                        style={{ transform: `scaleX(${progress / 100})` }}
                    />
                    <span className="loader__bar-ticks">
                        {Array.from({ length: 21 }).map((_, i) => (
                            <span key={i} className="loader__bar-tick" />
                        ))}
                    </span>
                </div>

                <div ref={counter} className="loader__counter-row">
                    <span className="loader__counter">
                        <span className="loader__counter-num">{String(progress).padStart(3, '0')}</span>
                        <span className="loader__counter-pct">/ 100</span>
                    </span>
                    <span ref={stream} className="loader__stream">
                        <span className="loader__stream-key">stack</span>
                        <span className="loader__stream-val">react · three · gsap</span>
                    </span>
                </div>
            </div>

            <div className="loader__rails">
                <span className="loader__rail" />
                <span className="loader__rail" />
                <span className="loader__rail" />
                <span className="loader__rail" />
            </div>
        </div>
    );
};

export default LoadingScreen;
