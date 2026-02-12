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
        id: 'fruitsshop',
        title: 'FruitsShop',
        description: 'A full e-commerce web application designed for selling fresh produce online.',
        detailedDescription: 'FruitsShop is a full-featured e-commerce web application designed for selling fresh produce online. It focuses on clear product presentation, smooth navigation, and practical business needs such as product management and structured categories. The project demonstrates real-world application development with attention to usability, performance, and clean separation between logic and UI.',
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

        const cards = gsap.utils.toArray('.project-card-stacked') as HTMLElement[];
        const bgs = gsap.utils.toArray('.project-bg') as HTMLElement[];

        // Initial States
        gsap.set(cards, { xPercent: 100, opacity: 0 }); // Start right
        gsap.set(bgs, { opacity: 0, scale: 1.2 });

        // Set first project active
        gsap.set(cards[0], { xPercent: 0, opacity: 1 });
        gsap.set(bgs[0], { opacity: 1, scale: 1 });

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: `+=${totalProjects * 100}%`, // Scroll distance
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            // Iterate logic
            projectsData.forEach((_, i) => {
                if (i === projectsData.length - 1) return; // Last one just stays

                // Exit current card
                tl.to(cards[i], {
                    xPercent: -120,
                    opacity: 0,
                    rotation: -5,
                    duration: 1,
                    ease: "power2.inOut"
                }, `slide-${i}`);

                // Exit current BG - Zoom in and fade out
                tl.to(bgs[i], {
                    opacity: 0,
                    scale: 1.5,
                    duration: 1,
                    ease: "power2.inOut"
                }, `slide-${i}`);

                // Enter next card
                tl.fromTo(cards[i + 1],
                    { xPercent: 120, opacity: 0, rotation: 5 },
                    { xPercent: 0, opacity: 1, rotation: 0, duration: 1, ease: "power2.inOut" },
                    `slide-${i}-=0.2` // Overlap slightly
                );

                // Enter next BG - Zoom out from large
                tl.fromTo(bgs[i + 1],
                    { opacity: 0, scale: 1.2 },
                    { opacity: 1, scale: 1, duration: 1, ease: "power2.inOut" },
                    `slide-${i}-=0.2`
                );
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
        <section ref={containerRef} className="projects-section" style={{ height: '100vh' }}>
            <div ref={wrapperRef} className="projects-pinned-wrapper">

                {/* Background Layer */}
                <div className="projects-bg-layer">
                    {projectsData.map((project) => (
                        <div
                            key={`bg-${project.id}`}
                            className="project-bg"
                            style={{
                                backgroundImage: `url('${project.backgroundImage || ''}')`
                            }}
                        />
                    ))}
                </div>

                {/* Card Layer */}
                <div className="projects-card-layer">
                    {projectsData.map((project) => (
                        <div
                            key={`card-${project.id}`}
                            className="project-card-stacked"
                            onClick={() => handleProjectClick(project)}
                        >
                            {/* Card Bkg - Use LOGO or CARD image, distinct from section BG */}
                            <img
                                src={project.logo || ''}
                                alt={project.title}
                                className="card-bg-image"
                                style={{ objectFit: 'cover' }}
                            />

                            <div className="card-overlay"></div>

                            {/* Scanline/Glitch Effect Overlay */}
                            <div className="card-scanline"></div>

                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-category">{project.category}</span>
                                </div>

                                {/* Center (empty now, used for interactions) */}
                                <div className="card-center"></div>

                                <div className="card-bottom">
                                    <h3 className="card-title">{project.title}</h3>

                                    {/* Tech Stack Slider (Reveals on Hover) */}
                                    <div className="card-tech-strip">
                                        <div className="tech-marquee">
                                            {project.technologies.slice(0, 4).join(' • ')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
