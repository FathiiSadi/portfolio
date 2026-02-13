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
        description: 'A rule-driven scheduling system built to automate the assignment of course sections to university instructors fairly and efficiently.',
        detailedDescription: 'Qalam is a comprehensive scheduling system built to automate the assignment of course sections to university instructors fairly and efficiently. The system replaces manual coordination with a structured process based on instructor preferences, administrator-defined constraints, and FIFO-style logic to reduce conflicts and bias. The core goal is to turn a complex academic workflow into a predictable, transparent, and scalable system that saves time and ensures fairness across departments.',
        logo: qalamLogo,
        technologies: ['Laravel', 'PHP', 'MySQL', 'React', 'TypeScript', 'Algorithm Design', 'Filament'],
        category: 'Scheduling Logic',
        links: {
            github: '#',
            case_study: '#',
        },
        images: [qalamBg],
        backgroundImage: qalamBg,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0' // Placeholder for testing
    },
    {
        id: 'FRUTIA',
        title: 'FRUTIA',
        description: 'A full e-commerce web application designed for selling fresh produce online.',
        detailedDescription: 'FRUTIA is a full-featured e-commerce web application designed for selling fresh produce online. It focuses on clear product presentation, smooth navigation, and practical business needs such as product management and structured categories. The project demonstrates real-world application development with attention to usability, performance, and clean separation between logic and UI.',
        logo: fruitsLogo,
        technologies: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS'],
        category: 'E-Commerce',
        links: {
            demo: '#',
            github: '#',
        },
        images: [fruitsBg],
        backgroundImage: fruitsBg
    },
    {
        id: 'athar',
        title: 'Athar',
        description: 'A minimalist blogging platform built around clarity, reading flow, and intentional design.',
        detailedDescription: 'Athar is a minimalist blogging platform built around clarity, reading flow, and intentional design. The system prioritizes content over decoration, using subtle animations and clean layouts to support long-form writing. Athar reflects a balance between technical structure and creative expression.',
        logo: atharLogo,
        technologies: ['Next.js', 'React', 'Markdown', 'TypeScript', 'Vercel', 'GSAP'],
        category: 'Content Platform',
        links: {
            demo: '#',
            github: '#',
        },
        images: [atharBg],
        backgroundImage: atharBg
    },
    {
        id: 'amal',
        title: 'Amal',
        description: 'A RAG-powered Digital History Activist AI Agent.',
        detailedDescription: 'Amal (meaning "Hope") is a Digital History Activist AI Agent. It creates a bridge between Gen Z youth and historical knowledge using RAG-powered intelligence.',
        logo: amalLogo,
        technologies: ['RAG', 'AI/ML', 'NLP', 'Python', 'Vector DB', 'React'],
        category: 'AI Agent',
        links: {
            demo: '#',
            github: '#',
        },
        images: [amalBg],
        backgroundImage: amalBg
    },
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
                                            {project.videoUrl && !project.videoUrl.includes('youtube.com') ? (
                                                <video
                                                    src={project.videoUrl}
                                                    muted
                                                    loop
                                                    playsInline
                                                    autoPlay
                                                    className="full-video"
                                                />
                                            ) : (
                                                <img
                                                    src={project.logo || project.backgroundImage || ''}
                                                    alt={project.title}
                                                    className="full-image"
                                                />
                                            )}
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
