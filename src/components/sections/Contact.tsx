import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        // Title animation
        gsap.fromTo(titleRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: 'top 85%',
                }
            }
        );

        // Form animation
        gsap.fromTo(formRef.current,
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: formRef.current,
                    start: 'top 80%',
                }
            }
        );

        // Social links animation
        const links = linksRef.current?.querySelectorAll('.social-link');
        if (links) {
            gsap.fromTo(links,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: linksRef.current,
                        start: 'top 85%',
                    }
                }
            );
        }

        // Magnetic effect for social links
        const socialLinks = sectionRef.current.querySelectorAll('.social-link');
        socialLinks.forEach((link) => {
            const handleMouseMove = (e: MouseEvent) => {
                const rect = (link as HTMLElement).getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(link, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            };

            const handleMouseLeave = () => {
                gsap.to(link, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            };

            (link as HTMLElement).addEventListener('mousemove', handleMouseMove as any);
            (link as HTMLElement).addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        alert('Message sent! (This is a demo)');
    };

    return (
        <section ref={sectionRef} id="contact" className="contact section">
            <div className="container">
                <h2 ref={titleRef} className="section-title">Let's Create Something Great</h2>

                <div className="contact-grid">
                    <div className="contact-info">
                        <p className="contact-description">
                            I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                        </p>

                        <div ref={linksRef} className="social-links">
                            <a href="mailto:fathii.alsadi@gmail.com" className="social-link">
                                <span className="link-icon">✉</span>
                                <span className="link-text">Email</span>
                            </a>
                            <a href="https://www.linkedin.com/in/fathi-sadi/" target="_blank" rel="noopener noreferrer" className="social-link">
                                <span className="link-icon">in</span>
                                <span className="link-text">LinkedIn</span>
                            </a>
                            <a href="https://github.com/FathiiSadi" target="_blank" rel="noopener noreferrer" className="social-link">
                                <span className="link-icon">git</span>
                                <span className="link-text">GitHub</span>
                            </a>
                        </div>
                    </div>

                    <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" id="name" required placeholder=" " />
                            <label htmlFor="name">Your Name</label>
                            <div className="input-highlight"></div>
                        </div>

                        <div className="form-group">
                            <input type="email" id="email" required placeholder=" " />
                            <label htmlFor="email">Email Address</label>
                            <div className="input-highlight"></div>
                        </div>

                        <div className="form-group">
                            <textarea id="message" required placeholder=" " rows={5}></textarea>
                            <label htmlFor="message">Your Message</label>
                            <div className="input-highlight"></div>
                        </div>

                        <button type="submit" className="submit-btn">
                            <span className="btn-text">Send Message</span>
                            <span className="btn-icon">→</span>
                            <div className="btn-bg"></div>
                        </button>
                    </form>
                </div>
            </div>

            <div className="contact-bg-elements">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>
        </section>
    );
};

export default Contact;
