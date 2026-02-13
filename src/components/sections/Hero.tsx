import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import EnergyRibbons from '../effects/EnergyRibbons';
import './Hero.css';

const Hero: React.FC = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const bracketsRef = useRef<HTMLDivElement>(null);
    const socialRef = useRef<HTMLDivElement>(null);

    // Individual path refs for morphing
    const pathLeftRef = useRef<SVGPathElement>(null);
    const pathRightRef = useRef<SVGPathElement>(null);
    const pathSlashRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        // Initial set for typography
        if (titleRef.current) gsap.set(titleRef.current.children, { y: 100, opacity: 0 });
        if (subtitleRef.current) gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
        if (socialRef.current) gsap.set(socialRef.current.children, { y: -20, opacity: 0 });

        // Initial set for paths
        gsap.set([pathLeftRef.current, pathRightRef.current, pathSlashRef.current], {
            opacity: 0,
            scale: 0.8,
            transformOrigin: 'center'
        });

        // Animation Sequence
        tl.add('start');

        if (titleRef.current) {
            tl.to(titleRef.current.children, {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
            }, 'start');
        }

        // Morphing animation for brackets - Infinite Loop
        if (pathLeftRef.current && pathRightRef.current && pathSlashRef.current) {
            const bracketTl = gsap.timeline({
                repeat: -1,
                repeatDelay: 1,
                defaults: { duration: 1.5, ease: "elastic.out(1, 0.75)" }
            });

            bracketTl
                // Phase 1: Morph Out (Expand)
                .to(pathLeftRef.current, {
                    attr: { d: "M60 40 L30 100 L60 160" },
                    opacity: 1
                }, 0)
                .to(pathRightRef.current, {
                    attr: { d: "M140 40 L170 100 L140 160" },
                    opacity: 1
                }, 0.15)
                .to(pathSlashRef.current, {
                    attr: { d: "M95 180 L125 20" },
                    opacity: 0.6,
                    ease: "power4.out"
                }, 0.4)

                // Phase 2: Morph In (Collapse)
                .to(pathLeftRef.current, {
                    attr: { d: "M100 100 L100 100 L100 100" },
                    opacity: 0,
                    duration: 1,
                    ease: "power3.inOut"
                }, "+=2") // Stay expanded for 2 seconds
                .to(pathRightRef.current, {
                    attr: { d: "M100 100 L100 100 L100 100" },
                    opacity: 0,
                    duration: 1,
                    ease: "power3.inOut"
                }, "<0.1")
                .to(pathSlashRef.current, {
                    attr: { d: "M100 100 L100 100" },
                    opacity: 0,
                    duration: 1,
                    ease: "power3.inOut"
                }, "<0.15");

            // Ambient floating remains active as well
            gsap.to(bracketsRef.current, {
                y: -15,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }

        if (subtitleRef.current) {
            tl.to(subtitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.8,
            }, 'start+=0.8');
        }

        if (socialRef.current) {
            tl.to(socialRef.current.children, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
            }, 'start+=1.2');
        }

    }, []);

    return (
        <section ref={heroRef} className="hero section">
            <EnergyRibbons />
            {/* Social Links - Top Right Absolute */}
            <div ref={socialRef} className="hero-socials">
                <a href="https://www.linkedin.com/in/fathi-sadi/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://github.com/FathiiSadi" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="mailto:fathii.alsadi@gmail.com" aria-label="Email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </a>
            </div>

            <div className="container hero-container">
                <div className="hero-text-wrapper">
                    <h1 ref={titleRef} className="hero-title">
                        <span className="block text-outline-blue">SOFTWARE</span>
                        <span className="block text-filled-blue">DEVELOPMENT</span>
                        <span className="block text-outline-blue">ENGINEER</span>
                    </h1>
                    <p ref={subtitleRef} className="hero-subtitle">
                        I implement high-performance applications  with <br /> clean architecture and strong problem-solving foundations.
                    </p>
                </div>

                <div ref={bracketsRef} className="hero-brackets">
                    <svg width="400" height="400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path ref={pathLeftRef} d="M60 40 L30 100 L60 160" stroke="var(--accent-primary)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                        <path ref={pathRightRef} d="M140 40 L170 100 L140 160" stroke="var(--accent-primary)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                        <path ref={pathSlashRef} d="M95 180 L125 20" stroke="var(--primary-blue)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Hero;
