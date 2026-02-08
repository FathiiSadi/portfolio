import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Briefcase, GraduationCap, Heart, Terminal } from 'lucide-react';
import './About.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const About: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [currentAct, setCurrentAct] = useState(0);

    const acts = [
        {
            id: 'act-1',
            title: "The Foundation",
            icon: <GraduationCap className="act-icon" size={32} />,
            description: "My journey began with a curiosity for how systems communicate. At An-Najah National University, I didn't just study computer engineering—I learned to build the future.",
            sidebar: [
                { label: "Education", value: "B.Sc. in Computer Engineering", sub: "An-Najah National University" },
                { label: "Focus", value: "System Architecture", sub: "Building reliable foundations" }
            ],
            watermark: "Foundation"
        },
        {
            id: 'act-2',
            title: "The Execution",
            icon: <Briefcase className="act-icon" size={32} />,
            description: "Translating complex requirements into high-performance reality. From leading backend optimizations at TBI to crafting interactive experiences at Tech Innovators.",
            sidebar: [
                { label: "Recent Role", value: "Software Engineer", sub: "Technical Bureau for Information" },
                { label: "Impact", value: "Scalable PHP Architectures", sub: "Driving efficiency at scale" }
            ],
            watermark: "Execution"
        },
        {
            id: 'act-3',
            title: "The Connection",
            icon: <Heart className="act-icon" size={32} />,
            description: "I believe technology is at its best when it's shared. Mentoring the next generation of engineers and organizing tech hubs is where I find my 'Why'.",
            sidebar: [
                { label: "Community", value: "Technical Mentor", sub: "Local Coding Bootcamps" },
                { label: "Leadership", value: "Hub Organizer", sub: "Fostering collaboration" }
            ],
            watermark: "Connection"
        },
        {
            id: 'act-4',
            title: "The Mindset",
            icon: <Terminal className="act-icon" size={32} />,
            description: "I don't just solve problems—I anticipate them. My philosophy is rooted in technical precision balanced with user-centered thinking.",
            tags: ["Algorithm Design", "System Optimization", "Deep Focus", "Code Integrity", "Strategic Planning"],
            watermark: "Mindset"
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
                    end: `+=${scenes.length * 100}%`,
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

                // Scene basic appearance
                tl.to(scene, {
                    opacity: 1,
                    visibility: 'visible',
                    duration: 0.5
                }, startTime);

                // Morphing reveal for content
                const content = scene.querySelector('.scene-content');
                if (content) {
                    tl.fromTo(content,
                        { y: 60, opacity: 0, filter: 'blur(10px)' },
                        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' },
                        startTime + 0.15
                    );
                }

                // Title character-by-character reveals
                const title = scene.querySelector('.act-title');
                if (title) {
                    const split = new SplitText(title, { type: 'chars' });
                    tl.from(split.chars, {
                        opacity: 0,
                        x: 10,
                        stagger: 0.015,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, startTime + 0.4);
                }

                // Scene exit morph (except the absolute last one)
                if (i < scenes.length - 1) {
                    tl.to(scene, {
                        opacity: 0,
                        y: -40,
                        filter: 'blur(10px)',
                        visibility: 'hidden',
                        duration: 0.5
                    }, endTime - 0.2);
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
