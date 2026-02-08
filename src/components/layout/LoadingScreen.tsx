import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import './LoadingScreen.css';

gsap.registerPlugin(SplitText);

interface LoadingScreenProps {
    onLoadComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!textRef.current || !containerRef.current) return;

        // Split text into characters for dramatic reveal
        const split = new SplitText(textRef.current, { type: 'chars' });

        // Create timeline for cinematic entrance
        const tl = gsap.timeline({
            onComplete: () => {
                // Wait a bit then fade out
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.6,
                    delay: 0.5,
                    ease: 'power2.inOut',
                    onComplete: onLoadComplete,
                });
            },
        });

        // Animate each character with lighting/glow effect
        tl.fromTo(split.chars,
            {
                opacity: 0,
                scale: 0.3,
                rotationX: -90,
                y: 80,
                filter: 'brightness(0)',
            },
            {
                opacity: 1,
                scale: 1,
                rotationX: 0,
                y: 0,
                filter: 'brightness(1.5)',
                duration: 0.8,
                stagger: {
                    each: 0.05,
                    from: 'center',
                },
                ease: 'back.out(1.4)',
            }
        );

        // Add pulsing glow effect
        tl.to(split.chars,
            {
                textShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)',
                duration: 0.6,
                stagger: {
                    each: 0.03,
                    from: 'center',
                },
                ease: 'sine.inOut',
            },
            '<0.4'
        );

        // Cleanup
        return () => {
            split.revert();
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
