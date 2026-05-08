import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './Skills.css';

import image1 from '../../assets/images/explaining.jpeg';
import image2 from '../../assets/images/focusing.png';
import image3 from '../../assets/images/jcpc.png';
import image4 from '../../assets/images/writing-code.jpeg';

interface Service {
    id: string;
    label: string;
    title: string;
    description: string;
    image: string;
    tools: string[];
}

const services: Service[] = [
    {
        id: '01',
        label: 'Practice / 01',
        title: 'Full-stack execution',
        description: 'Production features end-to-end. Backend logic, data, frontend, deploy.',
        image: image1,
        tools: ['Laravel', 'Vue', 'TypeScript'],
    },
    {
        id: '02',
        label: 'Practice / 02',
        title: 'Performance & scale',
        description: 'Profiling, query plans, caching, queues. Speed is a feature.',
        image: image2,
        tools: ['Redis', 'Postgres', 'Profiling'],
    },
    {
        id: '03',
        label: 'Practice / 03',
        title: 'Backend architecture',
        description: 'Clean APIs, boring tech, sturdy contracts. Things that age well.',
        image: image3,
        tools: ['REST', 'Domain-driven', 'Docker'],
    },
    {
        id: '04',
        label: 'Practice / 04',
        title: 'Structured problem-solving',
        description: 'Decompose, model, ship. Algorithms when they earn their keep.',
        image: image4,
        tools: ['DSA', 'Systems', 'Trade-offs'],
    },
];

const Skills: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const previewImgRef = useRef<HTMLImageElement>(null);
    const [active, setActive] = useState<number | null>(null);

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!previewRef.current) return;
        gsap.to(previewRef.current, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.7,
            ease: 'expo.out',
        });
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [onMouseMove]);

    useEffect(() => {
        if (!previewImgRef.current) return;
        gsap.fromTo(
            previewImgRef.current,
            { scale: 1.18, opacity: 0 },
            { scale: 1, opacity: active !== null ? 1 : 0, duration: 0.6, ease: 'expo.out' },
        );
    }, [active]);

    return (
        <div ref={sectionRef} className="skills section">
            <div className="shell">
                <header className="chapter">
                    <span className="chapter__index">03 / Practice</span>
                    <span className="chapter__title">How I help</span>
                    <span className="chapter__rule" />
                </header>

                <div className="skills__head">
                    <h2 className="skills__title">
                        Four <em>practices</em><br />
                        one operator.
                    </h2>
                    <p className="skills__sub">
                        I'm a one-person engineering studio. Each line below is a real
                        practice I've shipped, profiled and maintained — not a label for
                        a CV. Hover for the receipts.
                    </p>
                </div>

                <ul className="skills__list">
                    {services.map((s, i) => (
                        <li
                            key={s.id}
                            className={`skill-row ${active === i ? 'skill-row--active' : ''}`}
                            onMouseEnter={() => setActive(i)}
                            onMouseLeave={() => setActive(null)}
                            data-cursor="view"
                            data-cursor-label="Peek"
                        >
                            <span className="skill-row__num">— {s.label}</span>
                            <span className="skill-row__title">{s.title}</span>
                            <span className="skill-row__sub">{s.description}</span>
                            <span className="skill-row__tools">
                                {s.tools.map((t) => (
                                    <span key={t}>{t}</span>
                                ))}
                            </span>
                            <span className="skill-row__hover" aria-hidden="true">
                                <em>{s.title}</em>
                                <em className="skill-row__hover--ghost">{s.title}</em>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div ref={previewRef} className="skills__preview" aria-hidden="true">
                <img
                    ref={previewImgRef}
                    src={active !== null ? services[active].image : services[0].image}
                    alt=""
                />
                <span className="skills__preview-frame" />
            </div>
        </div>
    );
};

export default Skills;
