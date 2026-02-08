import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { Project } from '../../types';
import './ProjectDialog.css';

interface ProjectDialogProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectDialog: React.FC<ProjectDialogProps> = ({ project, isOpen, onClose }) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!dialogRef.current || !contentRef.current) return;

        if (isOpen) {
            // Prevent body and html scroll
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            // Animate Page Entrance
            // Slide up from bottom effectively
            gsap.fromTo(
                contentRef.current,
                { y: '100%', opacity: 1 }, // Start off screen
                { y: '0%', opacity: 1, duration: 0.6, ease: 'power3.out' }
            );

            // Stagger animations for content
            gsap.fromTo(
                '.reveal-text',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
            );

        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    const handleClose = () => {
        if (!contentRef.current) return;

        // Animate Page Exit
        gsap.to(contentRef.current, {
            y: '100%',
            duration: 0.5,
            ease: 'power3.in',
            onComplete: onClose,
        });
    };

    if (!isOpen || !project) return null;

    return (
        <div ref={dialogRef} className="project-dialog">
            <div className="dialog-overlay" onClick={handleClose}></div>

            <div ref={contentRef} className="dialog-content">
                <button className="dialog-close" onClick={handleClose} aria-label="Close details">
                    ✕
                </button>

                {/* Hero Section */}
                <div className="page-hero">
                    {/* Watermark Logo */}
                    {project.logo && (
                        <img
                            src={project.logo}
                            alt=""
                            className="hero-watermark"
                        />
                    )}

                    <div className="hero-content">
                        <div className="reveal-text">
                            <span className="page-category">{project.category}</span>
                            <h1 className="page-title">{project.title}</h1>
                        </div>
                    </div>
                </div>

                {/* Video Section (Optional) */}
                {project.videoUrl && (
                    <div className="video-section reveal-text">
                        <div className="video-container">
                            <iframe
                                src={project.videoUrl}
                                title={project.title}
                                className="project-video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* Content Body */}
                <div className="page-body">
                    <div className="description-section">
                        <p className="description-lead reveal-text">{project.description}</p>
                        <p className="description-full reveal-text">{project.detailedDescription}</p>
                    </div>

                    <div className="meta-grid reveal-text">
                        <div className="meta-item">
                            <h4>Technologies</h4>
                            <div className="tech-list">
                                {project.technologies.map((tech, i) => (
                                    <span key={i} className="tech-pill">{tech}</span>
                                ))}
                            </div>
                        </div>

                        <div className="meta-item">
                            <h4>Links</h4>
                            <div className="action-buttons">
                                {project.links.demo && (
                                    <a href={project.links.demo} target="_blank" rel="noreferrer" className="btn-clean btn-primary">
                                        View Live Site
                                    </a>
                                )}
                                {project.links.github && (
                                    <a href={project.links.github} target="_blank" rel="noreferrer" className="btn-clean btn-outline">
                                        GitHub Repo
                                    </a>
                                )}
                                {project.links.case_study && (
                                    <a href={project.links.case_study} target="_blank" rel="noreferrer" className="btn-clean btn-outline">
                                        Read Case Study
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDialog;
