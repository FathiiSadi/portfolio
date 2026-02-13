import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, Heart, Terminal } from 'lucide-react';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [currentAct, setCurrentAct] = useState(0);

    const acts = [
        {
            id: 'act-1',
            title: "The Foundation",
            icon: <GraduationCap className="act-icon" size={32} />,
            description: "My journey began with a curiosity about how systems communicate and scale. At Al Hussein Technical University, I didn’t just study computer science...I trained myself to think in algorithms, architecture, and real-world execution.",
            sidebar: [
                { label: "Education", value: "Bachelor of Computer Science", sub: "Al Hussein Technical University" },
                { label: "Focus", value: "System Architecture", sub: "Building real world projects" }
            ],
            watermark: "Foundation"
        },
        {
            id: 'act-2',
            title: "The Builder",
            icon: <Briefcase className="act-icon" size={32} />,
            description: "Translating complex requirements into high-performance systems became my focus. From building scalable backend services to delivering full-stack applications, I learned that clean architecture is what turns code into longevity.",
            sidebar: [
                { label: "Recent Role", value: "Software Engineer", sub: "Altibbi" },
                {
                    label: "Impact", value: "Backend Architecture & Scalable APIs", sub: "Full-stack implementation with Laravel & Vue.js"
                }
            ],
            watermark: "Builder"
        },
        {
            id: 'act-3',
            title: "The Mindset",
            icon: <Heart className="act-icon" size={32} />,
            description: "For me, engineering is structured thinking. Before writing code, I think in trade-offs, constraints, and long-term maintainability. I value clarity over cleverness, simplicity over noise, and systems that survive real-world pressure.",
            sidebar: [
                { label: "Approach", value: "Problem Decomposition", sub: "Transforming complexity into clear architecture" },
                {
                    label: "Engineering Values", value: "Maintainability • Performance • Scalability", sub: "Code that lasts beyond version one"
                }
            ],
            watermark: "Impact"
        },
        {
            id: 'act-4',
            title: "The Direction",
            icon: <Terminal className="act-icon" size={32} />,
            description: "Now, I’m focused on mastering system design, performance, and large-scale engineering. The goal is simple: build products that scale globally and stand the test of time.",
            tags: ["Algorithm Design", "System Design", "Performance Optimization", "Strategic Planning"],
            watermark: "Direction"
        }
    ];

    useEffect(() => {
        if (!sectionRef.current) return;

        const scenes = gsap.utils.toArray<HTMLElement>('.about-scene');
        const watermarkStrip = sectionRef.current.querySelector('.bg-watermark-strip');

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: `+=${scenes.length * 100}%`, // Increased scroll distance for more reading time
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        const index = Math.min(
                            Math.floor(self.progress * scenes.length),
                            scenes.length - 1
                        );
                        setCurrentAct(index);
                    }
                }
            });

            // 1. Continuous Background Watermark Strip Scroll
            if (watermarkStrip) {
                tl.to(watermarkStrip, {
                    y: () => -(watermarkStrip.scrollHeight - window.innerHeight),
                    ease: "none"
                }, 0);
            }

            // 2. Foreground Scene Content Morphing
            scenes.forEach((scene, i) => {
                const startTime = i;
                const endTime = i + 1;

                // Scene basic appearance - Start faster
                tl.to(scene, {
                    opacity: 1,
                    visibility: 'visible',
                    duration: 0.3 // Faster entrance
                }, startTime);

                // Morphing reveal for content
                const content = scene.querySelector('.scene-content');
                if (content) {
                    tl.fromTo(content,
                        { y: 60, opacity: 0, filter: 'blur(10px)' },
                        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' },
                        startTime + 0.1
                    );
                }

                // Title animation
                const title = scene.querySelector('.act-title');
                if (title) {
                    tl.fromTo(title,
                        { opacity: 0, x: 20 },
                        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
                        startTime + 0.3
                    );
                }

                // Scene exit morph - Delayed exit for more reading time
                if (i < scenes.length - 1) {
                    tl.to(scene, {
                        opacity: 0,
                        y: -40,
                        filter: 'blur(10px)',
                        visibility: 'hidden',
                        duration: 0.3
                    }, endTime - 0.1); // Exit much later in the window
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="about">
            {/* Layer 1: Continuous Background Watermark Strip */}
            <div className="about-parallax-layer">
                <div className="bg-watermark-strip">
                    {acts.map((act, i) => (
                        <div key={`slot-${i}`} className="bg-watermark-slot">
                            <div className="bg-text-watermark">{act.watermark}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div ref={viewportRef} className="about-viewport">
                {acts.map((act, index) => (
                    <div
                        key={act.id}
                        className={`about-scene ${currentAct === index ? 'active' : ''}`}
                    >
                        <div className="scene-content">
                            <div className="act-header">
                                <span className="act-number">Act 0{index + 1}</span>
                                {act.icon}
                            </div>
                            <h2 className="act-title">{act.title}</h2>
                            <p className="act-description">{act.description}</p>

                            {act.sidebar && (
                                <div className="narrative-grid">
                                    {act.sidebar.map((item, i) => (
                                        <div key={i} className="narrative-item">
                                            <span className="narrative-label">{item.label}</span>
                                            <div className="narrative-value">{item.value}</div>
                                            <div className="narrative-sub">{item.sub}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {act.tags && (
                                <div className="thought-tags">
                                    {act.tags.map((tag, i) => (
                                        <span key={i} className="thought-tag">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="story-progress">
                    {acts.map((_, i) => (
                        <div
                            key={i}
                            className={`progress-dot ${currentAct === i ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
