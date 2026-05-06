import { lazy, Suspense } from 'react';
import './Footer.css';

const BouncingDownArrow = lazy(() => import('../effects/BouncingDownArrow'));

const Footer: React.FC = () => {
    return (
        <footer className="foot">
            <div className="shell">
                <div className="foot__top">
                    <div className="foot__col">
                        <span className="eyebrow eyebrow--acid">— Index</span>
                        <ul>
                            <li><a href="#hero">Home</a></li>
                            <li><a href="#about">Profile</a></li>
                            <li><a href="#skills">Practice</a></li>
                            <li><a href="#projects">Work</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="foot__col">
                        <span className="eyebrow">— Elsewhere</span>
                        <ul>
                            <li><a href="https://github.com/FathiiSadi" target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
                            <li><a href="https://www.linkedin.com/in/fathi-sadi/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
                            <li><a href="https://codeforces.com/profile/fathi_sadi" target="_blank" rel="noopener noreferrer">Codeforces ↗</a></li>
                            <li><a href="mailto:fathii.alsadi@gmail.com">Email ↗</a></li>
                        </ul>
                    </div>
                    <div className="foot__col">
                        <span className="eyebrow">— Set</span>
                        <ul>
                            <li>Type: Instrument Serif · Geist · JetBrains Mono</li>
                            <li>Built: Vite · React · Three.js · GSAP</li>
                            <li>Location: AMM, GMT+3</li>
                            <li>© {new Date().getFullYear()} F.AS</li>
                        </ul>
                    </div>
                </div>

                <div className="foot-mark">
                    <div className="foot-arrow">
                        <Suspense fallback={<div style={{ height: '100%' }} />}>
                            <BouncingDownArrow size="100%" />
                        </Suspense>
                    </div>
                    <div className="foot-word" aria-hidden="true">
                        <div className="foot-word__row">
                            <span className="foot-word__line">Fathi</span>
                        </div>
                        <div className="foot-word__row">
                            <span className="foot-word__line foot-word__line--em">Al-Sadi.</span>
                        </div>
                    </div>
                </div>

                <div className="foot__base">
                    <span>Made in Amman — built byte by byte.</span>
                    <span className="foot__base-mid">— Last revised <em>{new Date().toLocaleDateString('en-CA')}</em> —</span>
                    <a href="#hero" data-magnetic>Back to top ↑</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
