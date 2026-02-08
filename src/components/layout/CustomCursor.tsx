import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './CustomCursor.css';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = dotRef.current;

        if (!cursor || !dot) return;

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
            gsap.to(dot, {
                x: e.clientX,
                y: e.clientY,
                duration: 0,
            });
        };

        const onMouseEnter = () => setIsHovered(true);
        const onMouseLeave = () => setIsHovered(false);

        document.addEventListener('mousemove', onMouseMove);

        // Add listeners to clickable elements
        const clickables = document.querySelectorAll('a, button, .project-card-stacked, .bubble-wrapper, .view-btn-circle');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        // Dynamic check for new elements (optional, but good for SPA)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                const newClickables = document.querySelectorAll('a, button, .project-card-stacked, .bubble-wrapper, .view-btn-circle');
                newClickables.forEach(el => {
                    el.removeEventListener('mouseenter', onMouseEnter); // prevent dupes
                    el.removeEventListener('mouseleave', onMouseLeave);
                    el.addEventListener('mouseenter', onMouseEnter);
                    el.addEventListener('mouseleave', onMouseLeave);
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            clickables.forEach(el => {
                el.removeEventListener('mouseenter', onMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <div ref={cursorRef} className={`custom-cursor ${isHovered ? 'hovered' : ''}`} />
            <div ref={dotRef} className="custom-cursor-dot" />
        </>
    );
};

export default CustomCursor;
