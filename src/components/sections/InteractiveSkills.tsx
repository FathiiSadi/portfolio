"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import './InteractiveSkills.css';

const skills = [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "#61DAFB" },
    { name: "Vue", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", color: "#42B883" },
    { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg", color: "#FF2D20" },
    { name: "Three", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg", color: "#000000" },
    { name: "Node", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", color: "#68A063" },
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
    { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", color: "#E34F26" },
    { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", color: "#264DE4" },
    { name: "Dart", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg", color: "#00B4AB" },
    { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", color: "#027DFD" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", color: "#FFFFFF" }
];

function SkillBubble({ skill, index }: { skill: any; index: number }) {
    // Generate a random delay for the floating animation
    const floatDelay = useRef(Math.random() * -5);

    return (
        <motion.div
            className="bubble-wrapper"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay: index * 0.05,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{
                scale: 1.25,
                x: [0, -5, 5, -3, 3, 0], // Shake/Wobble effect
                transition: {
                    scale: { duration: 0.2 },
                    x: { duration: 0.4, ease: "easeInOut" }
                }
            }}
        >
            <div
                className="bubble-main floating"
                style={{
                    animationDelay: `${floatDelay.current}s`,
                    borderColor: `${skill.color}50`
                }}
            >
                <div style={{ width: '60%', height: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src={skill.icon}
                        alt={skill.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        draggable={false}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default function SkillsSection() {
    return (
        <section className="interactive-skills section">
            {/* Background gradient */}
            <div className="interactive-overlay" />

            {/* Background particles */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: "absolute",
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() * 4 + 2,
                            height: Math.random() * 4 + 2,
                            borderRadius: "50%",
                            backgroundColor: "#3B82F6",
                            boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
                        }}
                    />
                ))}
            </div>

            <div className="skills-content-wrapper">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="skills-header"
                >
                    <h2 className="skills-main-title">
                        <span className="">
                            SKILLS
                        </span>
                    </h2>
                </motion.div>

                {/* Skills Grid */}
                <div className="bubbles-container">
                    {skills.map((skill, index) => (
                        <SkillBubble key={skill.name} skill={skill} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
