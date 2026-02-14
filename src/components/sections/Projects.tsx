import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '../../types';
import ProjectDialog from '../ui/ProjectDialog';
import './Projects.css';

// Import images to let Vite handle the base path
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
        videoUrl: 'https://drive.google.com/file/d/1B2pfat2WSClWp6WAu8YBUPci4rJJTt-r/view?usp=sharing'
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
        videoUrl: 'https://drive.google.com/file/d/16kV6_1w0VrZxXE-47TX371KJ0dilsHYN/view?usp=sharing'
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
        backgroundImage: fruitsBg
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
        backgroundImage: atharBg
    }
];

const Projects: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (!containerRef.current || !wrapperRef.current) return;

        const container = containerRef.current;
        const totalProjects = projectsData.length;

        const bgs = gsap.utils.toArray('.project-bg-container') as HTMLElement[];
        const titles = gsap.utils.toArray('.project-fancy-title-wrapped') as HTMLElement[];
        const individualCards = gsap.utils.toArray('.project-card-wrapper') as HTMLElement[];
        const cardsTrack = (gsap.utils.toArray('.projects-cards-track') as HTMLElement[])[0];

        const ctx = gsap.context(() => {
            const masterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: `+=${totalProjects * 200}%`, // Slower scroll (user might have changed it to 100%, I'll stick to 200% for smooth feel as requested)
                    pin: true,
                    scrub: 1.5,
                    anticipatePin: 1,
                    snap: {
                        snapTo: 1 / (totalProjects - 1),
                        duration: { min: 0.2, max: 0.5 },
                        delay: 0,
                        ease: "power1.inOut"
                    }
                }
            });

            // Set initial states
            gsap.set(bgs.slice(1), { opacity: 0, scale: 1.1 });
            gsap.set(titles.slice(1), { opacity: 0, scale: 0.8 });

            // Create a sequence that allows "dwell" time at each project
            projectsData.forEach((_, i) => {
                const stepTl = gsap.timeline();

                // 1. Dwell Phase (with Card Drift)
                // Even when "pinned", we move the card slightly to give it life
                stepTl.to(individualCards[i], {
                    x: -50, // Drift left slightly
                    duration: 1.5,
                    ease: "none"
                }, 0);

                if (i < totalProjects - 1) {
                    // 2. Transition Phase
                    const transitionTl = gsap.timeline();

                    // Main track shift
                    transitionTl.to(cardsTrack, {
                        xPercent: -100 * (i + 1),
                        duration: 1,
                        ease: "power2.inOut"
                    }, 0);

                    // Drift for entering card
                    transitionTl.fromTo(individualCards[i + 1],
                        { x: 100 },
                        { x: 50, duration: 0.3, ease: "power2.inOut" },
                        0
                    );

                    // Fade backgrounds
                    transitionTl.to(bgs[i], {
                        opacity: 0,
                        scale: 1.2,
                        duration: 0.6,
                        ease: "power2.inOut"
                    }, 0);
                    transitionTl.to(bgs[i + 1], {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: "power2.inOut"
                    }, 0);

                    // Fade/Move titles
                    transitionTl.to(titles[i], {
                        opacity: 0,
                        scale: 1.2,
                        y: -80,
                        duration: 0.5,
                        ease: "power2.inOut"
                    }, 0);
                    transitionTl.fromTo(titles[i + 1],
                        { opacity: 0, scale: 0.7, y: 80 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" },
                        0.2
                    );

                    stepTl.add(transitionTl);
                } else {
                    // Last project drift
                    stepTl.to(individualCards[i], { x: -50, duration: 0.6 });
                }

                masterTl.add(stepTl);
            });

        }, container);

        return () => ctx.revert();
    }, []);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };

    return (
        <section ref={containerRef} className="projects-section">
            <div ref={wrapperRef} className="projects-pinned-wrapper">

                {/* 1. Background Layer (Fixed) */}
                <div className="projects-bg-stacked">
                    {projectsData.map((project) => (
                        <div
                            key={`bg-${project.id}`}
                            className="project-bg-container"
                            style={{ backgroundImage: `url('${project.backgroundImage || ''}')` }}
                        >
                            <div className="bg-overlay"></div>
                        </div>
                    ))}
                </div>

                {/* 2. Title Layer (Fixed) */}
                <div className="projects-titles-stacked">
                    {projectsData.map((project) => (
                        <div key={`title-${project.id}`} className="project-fancy-title-wrapped">
                            <h2 className="project-fancy-title">{project.title}</h2>
                        </div>
                    ))}
                </div>

                <div className="projects-vignette"></div>

                {/* 3. Card Layer (Sliding) */}
                <div className="projects-cards-container">
                    <div className="projects-cards-track">
                        {projectsData.map((project) => (
                            <div key={`slide-${project.id}`} className="project-slide">
                                <div className="project-card-wrapper" onClick={() => handleProjectClick(project)}>
                                    <div className="project-card-full">
                                        <div className="card-media-full">
                                            <img
                                                src={project.logo || project.backgroundImage || ''}
                                                alt={project.title}
                                                className="full-image"
                                            />
                                            <div className="card-minimal-overlay"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ProjectDialog
                project={selectedProject}
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
            />
        </section>
    );
};

export default Projects;
