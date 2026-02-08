import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './Navbar.css';

gsap.registerPlugin(ScrollToPlugin);

const Navbar: React.FC = () => {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Update active section based on scroll position
                    const sections = ['hero', 'about', 'skills', 'projects', 'competitive'];
                    for (const section of sections) {
                        const element = document.getElementById(section);
                        if (element) {
                            const rect = element.getBoundingClientRect();
                            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                                setActiveSection(section);
                                break;
                            }
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: { y: element, offsetY: 0 },
                ease: 'power3.inOut',
            });
        }
    };

    const navItems = [
        { id: 'hero', label: 'Home', icon: '○' },
        { id: 'about', label: 'About', icon: '●' },
        { id: 'skills', label: 'Skills', icon: '●' },
        { id: 'projects', label: 'Projects', icon: '●' },
        { id: 'competitive', label: 'Competitive', icon: '●' },
    ];

    return (
        <nav className="navbar-vertical">
            <div className="nav-items">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => scrollToSection(item.id)}
                    >
                        <div className="nav-dot"></div>
                        <span className="nav-tooltip">{item.label}</span>
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
