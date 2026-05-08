import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const STACK = [
    { k: 'Backend', v: 'Laravel · Node · PHP' },
    { k: 'Frontend', v: 'Vue · React · TS' },
    { k: 'Data', v: 'MySQL · Postgres · MongoDB' },
    { k: 'Infra', v: 'Docker · Cloud · Linux' },
    { k: 'AI', v: 'RAG · LangChain · FAISS' },
];

const FACTS = [
    { k: 'Based', v: 'Amman, Jordan' },
    { k: 'TZ', v: 'GMT+3' },
    { k: 'Edu', v: 'B.Sc. CS · HTU' },
    { k: 'Lang', v: 'AR · EN' },
];

const About: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const tickerRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            // Reveal each cell on scroll
            gsap.utils.toArray<HTMLElement>('.bento-cell').forEach((cell, i) => {
                gsap.from(cell, {
                    opacity: 0,
                    y: 36,
                    duration: 0.9,
                    delay: (i % 3) * 0.05,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cell,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                });
            });

            // Big italic word reveals letter-by-letter
            const chars = sectionRef.current!.querySelectorAll('.about__pull .ch');
            gsap.from(chars, {
                yPercent: 110,
                opacity: 0,
                duration: 1.1,
                stagger: 0.04,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.about__pull',
                    start: 'top 80%',
                },
            });

            // Marquee ticker — infinite linear translate
            if (tickerRef.current) {
                const inner = tickerRef.current.querySelector('.about-ticker__track') as HTMLElement;
                gsap.to(inner, {
                    xPercent: -50,
                    duration: 28,
                    ease: 'none',
                    repeat: -1,
                });
            }
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // Portrait card 3D tilt
    const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
        setTilt({ x, y });
    };
    const resetTilt = () => setTilt({ x: 0, y: 0 });

    const splitChars = (text: string) =>
        text.split('').map((c, i) => (
            <span key={i} className="ch" style={{ display: 'inline-block' }}>
                {c === ' ' ? ' ' : c}
            </span>
        ));

    return (
        <div ref={sectionRef} className="about section">
            <div className="shell">
                <header className="chapter">
                    <span className="chapter__index">02 / Profile</span>
                    <span className="chapter__title">An engineer's blueprint</span>
                    <span className="chapter__rule" />
                </header>

                {/* Big italic pull-quote */}
                <h2 className="about__pull">
                    <span className="about__pull-line">
                        {splitChars('I think in')} <em className="about__pull-em">{splitChars('systems')}</em>
                    </span>
                    <span className="about__pull-line">
                        {splitChars('then I write')} <em className="about__pull-em about__pull-em--acid">{splitChars('the code.')}</em>
                    </span>
                </h2>

                {/* Bento grid */}
                <div className="bento">
                    {/* Identity card / portrait */}
                    <div
                        className="bento-cell bento-cell--identity"
                        onMouseMove={handleTilt}
                        onMouseLeave={resetTilt}
                        style={{ transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
                    >
                        <div className="bento-id">
                            <div className="bento-id__top">
                                <span className="bento-id__tag">— ID / 0001</span>
                                <span className="bento-id__chip">PASSPORT</span>
                            </div>
                            <div className="bento-id__name">
                                Fathi
                                <em>Al-Sadi</em>
                            </div>
                            <div className="bento-id__rows">
                                <div><span>Role</span><strong>Software engineer</strong></div>
                                <div><span>Field</span><strong>Backends · full-stack</strong></div>
                                <div><span>Status</span><strong className="bento-id__avail">Available · Q2</strong></div>
                            </div>
                            <div className="bento-id__sig">
                                <svg viewBox="0 0 200 60" width="120" height="36" fill="none">
                                    <path d="M5 40 C 25 10, 45 50, 65 25 S 105 50, 125 30 S 165 35, 195 18"
                                        stroke="var(--acid)" strokeWidth="1.4" strokeLinecap="round"
                                        strokeDasharray="220" strokeDashoffset="0" />
                                </svg>
                                <span className="bento-id__sig-label">Fathi Al.</span>
                            </div>
                        </div>
                    </div>

                    {/* Manifesto */}
                    <div className="bento-cell bento-cell--manifesto">
                        <span className="eyebrow eyebrow--acid">— Manifesto</span>
                        <p className="bento-manifesto">
                            Before a single line, I think in <em>systems</em>. Every feature is
                            a trade-off. Every abstraction has a cost. I value
                            <em> clarity over cleverness</em>, simplicity over noise,
                            and decisions you can defend three years from now.
                        </p>
                        <div className="bento-manifesto__rules">
                            <span>· Decompose ruthlessly</span>
                            <span>· Boring tech wins</span>
                            <span>· Write for the next engineer</span>
                        </div>
                    </div>

                    {/* Stack */}
                    <div className="bento-cell bento-cell--stack">
                        <span className="eyebrow">— Stack</span>
                        <ul className="bento-stack">
                            {STACK.map((s) => (
                                <li key={s.k}>
                                    <span>{s.k}</span>
                                    <em>{s.v}</em>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Big numeric stat: years experience or solved problems */}
                    <div className="bento-cell bento-cell--stat">
                        <span className="eyebrow">— Range</span>
                        <div className="bento-stat__num">
                            <span>2</span>
                            <span className="bento-stat__unit">+</span>
                        </div>
                        <span className="bento-stat__label">Years of software engineering</span>
                    </div>

                    {/* Code-style philosophy block */}
                    <div className="bento-cell bento-cell--code">
                        <div className="bento-code__head">
                            <span className="bento-code__dot bento-code__dot--r" />
                            <span className="bento-code__dot bento-code__dot--y" />
                            <span className="bento-code__dot bento-code__dot--g" />
                            <span className="bento-code__title">~ /philosophy.ts</span>
                        </div>
                        <pre className="bento-code__body">
                            <code>{`const build = (problem) => {
  const truth = decompose(problem);
  return truth
    .map(simpleFirst)
    .filter(actuallyShip);
};`}</code>
                        </pre>
                    </div>

                    {/* Facts strip */}
                    <div className="bento-cell bento-cell--facts">
                        <span className="eyebrow">— Facts</span>
                        <ul className="bento-facts">
                            {FACTS.map((f) => (
                                <li key={f.k}>
                                    <span>{f.k}</span>
                                    <em>{f.v}</em>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Now playing / current focus */}
                    <div className="bento-cell bento-cell--now">
                        <span className="eyebrow">— Now</span>
                        <div className="bento-now">
                            <div className="bento-now__pill">
                                <span className="bento-now__pulse" />
                                In session
                            </div>
                            <h3 className="bento-now__title">
                                Healthcare platform — <em>Altibbi</em>.
                            </h3>
                            <p>
                                Architecture, performance and the boring parts that
                                make a product feel sturdy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Marquee ticker at the bottom */}
                <div ref={tickerRef} className="about-ticker" aria-hidden="true">
                    <div className="about-ticker__track">
                        {Array.from({ length: 2 }).map((_, j) => (
                            <div key={j} className="about-ticker__group">
                                <span>Systems first</span><span className="about-ticker__dot">●</span>
                                <span>Backends that scale</span><span className="about-ticker__dot">●</span>
                                <span>Boring tech wins</span><span className="about-ticker__dot">●</span>
                                <span>Open to remote</span><span className="about-ticker__dot">●</span>
                                <span>Available · 2026</span><span className="about-ticker__dot">●</span>
                                <span>Amman → ∞</span><span className="about-ticker__dot">●</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
