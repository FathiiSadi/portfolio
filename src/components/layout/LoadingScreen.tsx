import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './LoadingScreen.css';

interface LoadingScreenProps {
    onLoadComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!textRef.current || !containerRef.current) return;

        // Simple opacity/scale animation for the whole text block
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.6,
                    delay: 0.5,
                    ease: 'power2.inOut',
                    onComplete: onLoadComplete,
                });
            },
        });

        tl.fromTo(textRef.current,
            {
                opacity: 0,
                y: 20,
                filter: 'blur(10px)',
            },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'power3.out',
            }
        );

        return () => {
            // No cleanup needed for simple GSAP animation
        };
    }, [onLoadComplete]);

    return (
        <div ref={containerRef} className="loading-screen-cinematic">
            <div className="loading-content">
                <div ref={textRef} className="cinematic-name">
                    FATHI <br /> AL-SADI
                </div>
                <div className="loading-tagline">Software Engineer</div>
            </div>

            {/* Animated Background Elements */}
            <div className="light-beam beam-1"></div>
            <div className="light-beam beam-2"></div>
            <div className="light-beam beam-3"></div>
        </div>
    );
};

export default LoadingScreen;
