import { useEffect, useState } from 'react';
import './ScrollProgress.css';

const ScrollProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress = (window.scrollY / totalHeight) * 100;
            setProgress(currentProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="scroll-progress-container">
            <div
                className="scroll-progress-bar"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ScrollProgress;
