import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import DecryptedText from '../ui/DecryptedText';
import './Skills.css';

import image1 from '../../assets/images/explaining.jpeg';
import image2 from '../../assets/images/focusing.png';
import image3 from '../../assets/images/jcpc.png';
import image4 from '../../assets/images/writing-code.jpeg';

const services = [
    {
        id: '01',
        title: 'Full-Stack Execution',
        description: 'Delivering clean, production-ready features from backend to frontend.',
        image: image1
    },
    {
        id: '02',
        title: 'High Performance',
        description: 'Improving speed, efficiency, and stability across applications.',
        image: image2
    },
    {
        id: '03',
        title: 'Scalable Backend Architecture',
        description: 'Building structured APIs and systems designed to grow with your product.',
        image: image3
    },
    {
        id: '04',
        title: 'Structured Problem Solving',
        description: 'Breaking down complex challenges into maintainable, long-term solutions.',
        image: image4
    }
];

const Skills: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);
    const [activeService, setActiveService] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    useEffect(() => {
        if (revealRef.current) {
            // Apply X and Y with offset for X
            // Center the image vertically (substract half height)
            // Offset X by some distance (e.g., 100px) plus half width to start from edge
            gsap.to(revealRef.current, {
                x: mousePos.x + 50, // Offset X
                y: mousePos.y - 250, // Center Y (relative to container height 500)
                duration: 0.8,
                ease: 'power3.out'
            });
        }
    }, [mousePos]);

    return (
        <section ref={sectionRef} className="skills-section">
            <div className="container skills-container">
                <div className="skills-header">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <DecryptedText
                            text="How I Can"
                            animateOn="view"
                            speed={100}
                            revealDirection="start"
                        />
                        <br />
                        <span className="highlight-text">
                            <DecryptedText
                                text="Help Your Brand"
                                animateOn="view"
                                speed={100}
                                delay={500}
                                revealDirection="start"
                            />
                        </span>
                    </motion.h2>
                </div>

                <div className="services-list">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className="service-item"
                            onMouseEnter={() => setActiveService(index)}
                            onMouseLeave={() => setActiveService(null)}
                        >
                            <div className="service-link">
                                <span className="service-number">{service.id}</span>
                                <h3 className="service-title">{service.title}</h3>
                                <div className="service-description">
                                    <p>{service.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Image Reveal Mechanism */}
            <div
                ref={revealRef}
                className={`reveal-image-container ${activeService !== null ? 'active' : ''}`}
            >
                <AnimatePresence mode="wait">
                    {activeService !== null && (
                        <motion.img
                            key={activeService}
                            src={services[activeService].image}
                            alt={services[activeService].title}
                            className="reveal-image"
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Skills;

