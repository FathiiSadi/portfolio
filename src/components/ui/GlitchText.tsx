import React from 'react';
import './GlitchText.css';

interface GlitchTextProps {
    text: string;
    className?: string;
    tag?: React.ElementType;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "", tag: Tag = 'span' }) => {
    return React.createElement(
        Tag,
        { className: `glitch-wrapper glitch-hover ${className}` },
        <span className="glitch-text" data-text={text}>
            {text}
        </span>
    );
};

export default GlitchText;
