import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DecryptedText from '../ui/DecryptedText';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

const designPrinciples = [
    {
        id: '01',
        title: 'Built for conversion',
        description: 'High-performance websites engineered from the ground up. Every animation, every interaction has a reason to exist.',
        points: ['Fast-loading websites', 'Real-time analytics integration', 'Performance optimization']
    },
    {
        id: '02',
        title: 'Designed to be understood',
        description: "Users shouldn't have to think. Clear flows, obvious CTAs, seamless experience across all devices.",
        points: ['Strategic UX/UI', 'User testing ready', 'Fully responsive']
    },
    {
        id: '03',
        title: 'Scalable Foundation',
        description: 'Code that grows with your business. Modular architecture and strict typing ensure long-term maintainability.',
        points: ['Clean Code Architecture', 'Type-safe development', 'CI/CD pipelines']
    },
    {
        id: '04',
        title: 'Future Proof',
        description: 'Leveraging the latest stable technologies to ensure your product stays relevant and secure.',
        points: ['Modern tech stack', 'Security best practices', 'Accessibility (WCAG) compliance']
    }
];

const highlightWords = ['Design', 'Develop', 'Scale', 'Elevate'];

const Skills: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    // Initial Scroll Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray('.design-item');
            items.forEach((item: any) => {
                gsap.fromTo(item,
                    { opacity: 0.3, x: -20 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 80%',
                            end: 'top 50%',
                            toggleActions: 'play none none reverse',
                            scroller: listRef.current
                        }
                    }
                );
            });

            gsap.fromTo('.skills-sticky-content h2',
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%'
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Timer to update the current word index
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % highlightWords.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={sectionRef} className="skills-section">
            <div className="container skills-container">

                {/* LEFT: Scrollable Design Principles */}
                <div className="skills-scroll-panel" ref={listRef}>
                    <div className="skills-list">
                        {designPrinciples.map((item) => (
                            <div key={item.id} className="design-item">
                                <span className="item-number">{item.id}</span>
                                <h3 className="item-title">{item.title}</h3>
                                <p className="item-description">{item.description}</p>
                                <ul className="item-points">
                                    {item.points.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Sticky Title / Brand Message */}
                <div className="skills-sticky-panel">
                    <div className="skills-sticky-content">
                        <h2>
                            I'll Help <span className="highlight inline-block min-w-[300px]">
                                <DecryptedText
                                    text={highlightWords[currentWordIndex]}
                                    speed={50}
                                    maxIterations={20}
                                    revealDirection="start"
                                    animateOn="view"
                                    className="highlight-text"
                                    encryptedClassName="highlight-encrypted"
                                />
                            </span><br />
                            Your Brand
                        </h2>
                        <div className="skills-decoration"></div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Skills;
