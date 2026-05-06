import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './LoadingScreen.css';

interface LoadingScreenProps {
    onLoadComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadComplete }) => {
    const root = useRef<HTMLDivElement>(null);
    const counter = useRef<HTMLDivElement>(null);
    const monogram = useRef<HTMLDivElement>(null);
    const cover = useRef<HTMLDivElement>(null);
    const meta = useRef<HTMLDivElement>(null);
    const word = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Stagger the entrance
        const tl = gsap.timeline();
        tl.from(meta.current, { opacity: 0, y: -10, duration: 0.7, ease: 'power3.out' })
            .from(word.current?.querySelectorAll('.lw') || [], {
                yPercent: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.05,
                ease: 'expo.out',
            }, 0.05)
            .from(monogram.current, { opacity: 0, scale: 0.9, duration: 0.9, ease: 'expo.out' }, 0.2);

        // Drive the progress counter from 0 → 100 over ~2.4s, then hold a
        // beat at 100 so the full mark (monogram + name + counter) is
        // readable before the wipe-out begins.
        const obj = { v: 0 };
        gsap.to(obj, {
            v: 100,
            duration: 2.4,
            ease: 'power2.inOut',
            onUpdate: () => setProgress(Math.floor(obj.v)),
            onComplete: () => {
                gsap.delayedCall(0.6, runWipeOut);
            },
        });

        function runWipeOut() {
            // Wipe out: bone-colored panel slides up over the loader,
            // then both fade away to reveal the page.
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
                .to([counter.current, monogram.current, meta.current], {
                    opacity: 0,
                    y: -16,
                    duration: 0.5,
                    stagger: 0.04,
                    ease: 'power3.in',
                })
                .to(word.current?.querySelectorAll('.lw') || [], {
                    yPercent: -100,
                    duration: 0.7,
                    stagger: 0.04,
                    ease: 'expo.in',
                }, 0.05)
                .to(cover.current, {
                    yPercent: -100,
                    duration: 1,
                    ease: 'expo.inOut',
                }, 0.25);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={root} className="loader" aria-hidden="true">
            <div ref={cover} className="loader__cover" />

            <div ref={meta} className="loader__meta">
                <span className="loader__meta-l">F.AS / 2026 — PORTFOLIO</span>
                <span className="loader__meta-r">v / 04 — REV.A</span>
            </div>

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

            <div className="loader__word-wrap">
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

            <div ref={counter} className="loader__counter">
                <span className="loader__counter-num">{String(progress).padStart(3, '0')}</span>
                <span className="loader__counter-pct">/ 100</span>
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
