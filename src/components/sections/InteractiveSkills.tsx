"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import './InteractiveSkills.css';

const skills = [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "#61DAFB" },
    { name: "Vue", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", color: "#42B883" },
    { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg", color: "#FF2D20" },
    { name: "Three.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg", color: "#FFFFFF" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", color: "#68A063" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "#3776AB" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", color: "#3178C6" },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", color: "#06B6D4" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", color: "#47A248" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", color: "#4169E1" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", color: "#2496ED" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", color: "#F05032" },
    { name: "Yii2", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yii/yii-original.svg", color: "#E65100" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "#F7DF1E" },
    { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", color: "#E76F00" },
    { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", color: "#00599C" },
    { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", color: "#777BB4" },
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", color: "#E34F26" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", color: "#264DE4" },
    { name: "Dart", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg", color: "#00B4AB" },
    { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", color: "#027DFD" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", color: "#FFFFFF" }
];

function SkillCard({ skill }: { skill: any }) {
    return (
        <motion.div
            className="skill-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <div className="skill-icon-wrapper">
                <img
                    src={skill.icon}
                    alt={skill.name}
                    className="skill-icon"
                    draggable={false}
                />
            </div>
            <span className="skill-name">{skill.name}</span>
        </motion.div>
    );
}

function MarqueeRow({ items, direction = 1, speed = 20 }: { items: any[]; direction?: 1 | -1; speed?: number }) {
    return (
        <div className="marquee-track">
            <motion.div
                className="marquee-track"
                animate={{
                    x: direction === 1 ? [0, -1000] : [-1000, 0]
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {[...items, ...items, ...items].map((skill, idx) => (
                    <SkillCard key={`${skill.name}-${idx}`} skill={skill} />
                ))}
            </motion.div>
        </div>
    );
}

export default function InteractiveSkills() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for the marquee container
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    // Split skills into 3 rows
    const row1 = useMemo(() => skills.slice(0, 7), []);
    const row2 = useMemo(() => skills.slice(7, 14), []);
    const row3 = useMemo(() => skills.slice(14, 22), []);

    return (
        <section ref={containerRef} className="interactive-skills section">
            <div className="interactive-overlay" />

            <div className="skills-content-wrapper">
                <div className="skills-header">
                    <motion.h2
                        className="skills-main-title"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                    >
                        Mastered <br /> Technologies
                    </motion.h2>
                    <motion.p
                        className="skills-subtitle"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        viewport={{ once: true }}
                    >
                        Building robust digital experiences with a modern stack and proven architectures.
                    </motion.p>
                </div>

                <motion.div style={{ y }} className="marquee-container">
                    <MarqueeRow items={row1} direction={1} speed={25} />
                    <MarqueeRow items={row2} direction={-1} speed={30} />
                    <MarqueeRow items={row3} direction={1} speed={20} />
                </motion.div>
            </div>
        </section>
    );
}
