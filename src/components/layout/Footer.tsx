import { useRef, useEffect } from 'react';
import './Footer.css';

import BouncingDownArrow from '../effects/BouncingDownArrow';

const Footer: React.FC = () => {
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nameElement = footerRef.current?.querySelector('.footer-name');
        if (!nameElement) return;

        const nodes = Array.from(nameElement.childNodes);
        nameElement.innerHTML = '';
        let charIndex = 0;

        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || '';
                const fragment = document.createDocumentFragment();
                text.split('').forEach(char => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.style.setProperty('--char-index', charIndex.toString());
                    span.setAttribute('data-char', char);
                    span.textContent = char;
                    fragment.appendChild(span);
                    charIndex++;
                });
                nameElement.appendChild(fragment);
            } else {
                // Keep <br /> or other elements as they are
                nameElement.appendChild(node.cloneNode(true));
            }
        });
    }, []);

    return (
        <footer ref={footerRef} className="footer-minimal">
            <div className="footer-content">
                <div className="footer-arrow-wrapper">
                    <BouncingDownArrow size="300px" />
                </div>
                <div className="footer-name-hover-wrapper">
                    <h1 className="footer-name">FATHI  <br /> AL-SADI</h1>
                </div>
                <div className="footer-details">
                    <p className="footer-year">© {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
