import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '../../types';
import ProjectDialog from '../ui/ProjectDialog';
import './Projects.css';

import qalamLogo from '../../assets/images/projects/qalam-logo.jpeg';
import qalamBg from '../../assets/images/projects/qalam-background.png';
import fruitsLogo from '../../assets/images/projects/fruits-shops-logo.png';
import fruitsBg from '../../assets/images/projects/fruits-shop-background.png';
import atharLogo from '../../assets/images/projects/athar-logo.png';
import atharBg from '../../assets/images/projects/athar-background.png';
import amalLogo from '../../assets/images/projects/amal.png';
import amalBg from '../../assets/images/projects/amal-background.png';

gsap.registerPlugin(ScrollTrigger);

const projectsData: Project[] = [
    {
        id: 'qalam',
        title: 'Qalam',
        description: 'An intelligent academic scheduling system that automates instructor and course section assignments using rule-based logic and institutional constraints.',
        detailedDescription: 'Qalam is a comprehensive scheduling system built to automate the assignment of university course sections to instructors fairly and efficiently. The system applies structured academic rules including instructor availability, section limits, course capacities, and priority ordering. Using deterministic scheduling logic instead of random assignment, it generates repeatable and explainable timetables while preventing conflicts. An admin panel built with Filament enables full control over rules, instructors, courses, and sections. The architecture emphasizes modular backend design, validation layers, and scalable frontend workflows.',
        logo: qalamLogo,
        technologies: ['Laravel', 'PHP', 'MySQL', 'FilamentPHP', 'Vite', 'Bootstrap 5', 'Scheduling Algorithms'],
        category: 'Academic Systems · Scheduling · Web Application',
        links: {},
        images: [qalamBg],
        backgroundImage: qalamBg,
        videoUrl: 'https://drive.google.com/file/d/1B2pfat2WSClWp6WAu8YBUPci4rJJTt-r/view?usp=sharing',
    },
    {
        id: 'amal',
        title: 'Amal',
        description: 'A Retrieval-Augmented Generation (RAG) powered AI historian focused on Palestinian history and cultural preservation.',
        detailedDescription: 'Amal is an AI-powered digital historian built using a Retrieval-Augmented Generation (RAG) architecture. Instead of relying solely on general model knowledge, it retrieves relevant passages from a curated historical source document and generates grounded responses. The system integrates vector embeddings, semantic similarity search, and large language model orchestration to ensure accurate, context-aware answers. It features an interactive chat interface, topic management system using SQLite, and a culturally themed UI. The architecture separates embedding, retrieval, and generation layers for transparency and extensibility.',
        logo: amalLogo,
        technologies: ['Python', 'Streamlit', 'LangChain', 'Google Gemini API', 'FAISS', 'HuggingFace Embeddings', 'SQLite', 'RAG Architecture'],
        category: 'Artificial Intelligence · RAG Systems · Educational Technology',
        links: {},
        images: [amalBg],
        backgroundImage: amalBg,
        videoUrl: 'https://drive.google.com/file/d/16kV6_1w0VrZxXE-47TX371KJ0dilsHYN/view?usp=sharing',
    },
    {
        id: 'frutia',
        title: 'FRUTIA',
        description: 'A full-stack e-commerce platform for selling fresh produce online with secure payments and performance optimization.',
        detailedDescription: 'FRUTIA is a full-featured e-commerce web application designed for online fruit sales. The system includes product browsing, category management, cart functionality, secure checkout, and order confirmation via email. Security features include CAPTCHA protection and cookie-based session handling. Performance optimizations such as caching were implemented to enhance responsiveness. Payments are integrated using Checkout.com sandbox APIs for secure transaction simulation. The project follows MVC architecture using Yii2 to maintain clean separation between logic and presentation.',
        logo: fruitsLogo,
        technologies: ['Yii2', 'PHP', 'MySQL', 'Bootstrap 5', 'Checkout.com API', 'Caching', 'Cookies', 'CAPTCHA'],
        category: 'E-Commerce · Web Security · Payment Integration',
        links: {},
        images: [fruitsBg],
        backgroundImage: fruitsBg,
    },
    {
        id: 'athar',
        title: 'Athar',
        description: 'A custom-built blogging platform developed from scratch in PHP to deeply understand backend fundamentals.',
        detailedDescription: 'Athar is a blogging platform built using core PHP without relying on frameworks. Core backend features such as routing, pagination, authentication, and email handling were implemented manually to gain low-level understanding of web architecture. The system integrates cron jobs and queue processing for background tasks such as scheduled emails. Mailtrap was used for safe email testing during development. The project demonstrates strong backend fundamentals, structured code organization, and system-level thinking.',
        logo: atharLogo,
        technologies: ['PHP (Vanilla)', 'MySQL', 'Bootstrap 5', 'Cron Jobs', 'Queue System', 'Mailtrap', 'Custom Routing', 'Pagination'],
        category: 'Content Platform · Backend Engineering',
        links: {},
        images: [atharBg],
        backgroundImage: atharBg,
    },
];

// Anti-grid placement: each project lives at a different alignment.
const layout = [
    { col: '1 / span 7', justify: 'flex-start' as const, year: '2025' },
    { col: '6 / span 7', justify: 'flex-end' as const, year: '2025' },
    { col: '2 / span 6', justify: 'flex-start' as const, year: '2024' },
    { col: '7 / span 5', justify: 'flex-end' as const, year: '2023' },
];

const Projects: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<Project | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>('.proj').forEach((card, i) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 60,
                    duration: 1.0,
                    delay: (i % 2) * 0.05,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                    },
                });

                const img = card.querySelector('.proj__media img');
                if (img) {
                    gsap.fromTo(img,
                        { yPercent: -10, scale: 1.15 },
                        {
                            yPercent: 10,
                            scale: 1.15,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: true,
                            },
                        });
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleOpen = (p: Project) => {
        setSelected(p);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setTimeout(() => setSelected(null), 300);
    };

    return (
        <div ref={sectionRef} className="projects-section">
            <div className="shell">
                <header className="chapter">
                    <span className="chapter__index">04 / Selected work</span>
                    <span className="chapter__title">Recent obsessions</span>
                    <span className="chapter__rule" />
                </header>

                <div className="projects-head">
                    <h2 className="projects-title">
                        <span>Selected</span>
                        <em className="projects-title__em">work</em>
                        <span className="projects-title__small">— vol. 01</span>
                    </h2>
                    <p className="projects-sub">
                        Four shipped systems. Each one solved a real problem under real
                        constraints. Click any title to open the case study.
                    </p>
                </div>

                <div className="projects-grid">
                    {projectsData.map((p, i) => (
                        <article
                            key={p.id}
                            className={`proj proj--${i % 2 === 0 ? 'l' : 'r'}`}
                            style={{
                                gridColumn: layout[i % layout.length].col,
                                justifySelf: layout[i % layout.length].justify === 'flex-end' ? 'end' : 'start',
                            }}
                        >
                            <div className="proj__meta">
                                <span className="proj__index">— 0{i + 1}</span>
                                <span className="proj__year">{layout[i % layout.length].year}</span>
                            </div>

                            <button
                                className="proj__media"
                                onClick={() => handleOpen(p)}
                                data-cursor="view"
                                data-cursor-label="Open case"
                                aria-label={`Open ${p.title}`}
                            >
                                <img
                                    src={p.backgroundImage || p.logo || ''}
                                    alt={p.title}
                                    loading="lazy"
                                />
                                <span className="proj__media-frame" />
                                <span className="proj__media-tag">{p.title}</span>
                            </button>

                            <div className="proj__body">
                                <h3 className="proj__title">{p.title}</h3>
                                <p className="proj__desc">{p.description}</p>
                                <div className="proj__tags">
                                    {p.technologies.slice(0, 5).map((t) => (
                                        <span key={t}>{t}</span>
                                    ))}
                                </div>
                                <button
                                    className="proj__open"
                                    onClick={() => handleOpen(p)}
                                    data-magnetic
                                    data-magnetic-strength="0.3"
                                >
                                    <span>Read case study</span>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 11L11 3M11 3H4.5M11 3V9.5"
                                            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="projects-end">
                    <span>That's a sample.</span>
                    <a href="#contact" className="projects-end__link" data-magnetic>
                        Talk to me about the rest →
                    </a>
                </div>
            </div>

            <ProjectDialog project={selected} isOpen={open} onClose={handleClose} />
        </div>
    );
};

export default Projects;
