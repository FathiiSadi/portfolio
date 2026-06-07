import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Skills.css';

const ROW_A = [
    'Laravel', 'Vue', 'React', 'TypeScript', 'Node', 'PHP',
    'Postgres', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Linux',
];

const ROW_B = [
    'RAG', 'LangChain', 'FAISS', 'Embeddings', 'Architecture',
    'Performance', 'APIs', 'Domain-driven', 'Profiling', 'Caching',
    'Queues', 'Systems',
];

const Skills: React.FC = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const trackARef = useRef<HTMLDivElement>(null);
    const trackBRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (trackARef.current) {
                gsap.to(trackARef.current, {
                    xPercent: -50,
                    duration: 38,
                    ease: 'none',
                    repeat: -1,
                });
            }
            if (trackBRef.current) {
                gsap.set(trackBRef.current, { xPercent: -50 });
                gsap.to(trackBRef.current, {
                    xPercent: 0,
                    duration: 42,
                    ease: 'none',
                    repeat: -1,
                });
            }
        }, rootRef);
        return () => ctx.revert();
    }, []);

    const renderRow = (items: string[]) => (
        <>
            {[0, 1].map((dup) => (
                <div key={dup} className="ticker__group" aria-hidden={dup === 1 ? 'true' : undefined}>
                    {items.map((item, i) => (
                        <span key={`${dup}-${i}`} className="ticker__item">
                            <span className="ticker__text">{item}</span>
                            <span className="ticker__star" aria-hidden="true">✦</span>
                        </span>
                    ))}
                </div>
            ))}
        </>
    );

    return (
        <div ref={rootRef} className="skills section">
            <div className="shell">
                <header className="chapter">
                    <span className="chapter__index">03 / Skills</span>
                    <span className="chapter__title">Tools of the trade</span>
                    <span className="chapter__rule" />
                </header>
            </div>

            <div className="ticker ticker--a">
                <div ref={trackARef} className="ticker__track">
                    {renderRow(ROW_A)}
                </div>
            </div>

            <div className="ticker ticker--b">
                <div ref={trackBRef} className="ticker__track">
                    {renderRow(ROW_B)}
                </div>
            </div>
        </div>
    );
};

export default Skills;
