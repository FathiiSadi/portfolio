import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ─────────────────────────────────────────────────────────────────────

type ObjectId = 'laptop' | 'notebook' | 'server' | 'sticky' | 'mug' | 'terminal';

interface LabObject {
    id: ObjectId;
    label: string;
    hint: string;
    rotation: number;
    zIndex: number;
}

interface PanelItem {
    label: string;
    value: string;
}

interface PanelContent {
    tag: string;
    title: string;
    body: React.ReactNode;
    items?: PanelItem[];
    chips?: string[];
    accent: string;
}

// ─── Lab Objects Config ────────────────────────────────────────────────────────

const labObjects: LabObject[] = [
    { id: 'laptop', label: 'Laptop', hint: 'Projects', rotation: -2, zIndex: 5 },
    { id: 'notebook', label: 'Notebook', hint: 'Mindset', rotation: 4, zIndex: 4 },
    { id: 'server', label: 'Server Rack', hint: 'Backend Experience', rotation: -1, zIndex: 3 },
    { id: 'sticky', label: 'Sticky Notes', hint: 'Personal Facts', rotation: 3, zIndex: 6 },
    { id: 'mug', label: 'Coffee Mug', hint: 'Daily Stack', rotation: -4, zIndex: 2 },
    { id: 'terminal', label: 'Terminal', hint: 'Philosophy', rotation: 1, zIndex: 7 },
];

// ─── Panel Content Data ────────────────────────────────────────────────────────

const panelContent: Record<ObjectId, PanelContent> = {
    laptop: {
        tag: '// projects',
        title: "What I've shipped",
        accent: 'var(--primary-blue)',
        body: (
            <>
                Full-stack applications built to handle real production loads.
                From healthcare platforms to scalable APIs — each project was a
                lesson in architecture, trade-offs, and delivery under pressure.
            </>
        ),
        items: [
            { label: 'Altibbi Platform', value: 'Healthcare · Laravel + Vue.js' },
            { label: 'Scalable API Layer', value: 'REST Architecture · 99.9% uptime' },
            { label: 'Internal Tooling', value: 'Automation · CI/CD pipelines' },
        ],
        chips: ['Laravel', 'Vue.js', 'REST APIs', 'MySQL', 'Docker'],
    },
    notebook: {
        tag: '// mindset',
        title: 'How I think',
        accent: 'var(--accent-secondary)',
        body: (
            <>
                Before I write a single line, I think in systems. Every feature
                is a trade-off. Every abstraction has a cost. I value clarity
                over cleverness and simplicity over noise — always.
            </>
        ),
        items: [
            { label: 'First Principle', value: 'Decompose complexity ruthlessly' },
            { label: 'Code Standard', value: 'Write for the next engineer' },
            { label: 'Decision Rule', value: 'Choose boring technology' },
        ],
        chips: ['Systems Thinking', 'Clean Code', 'DDD', 'SOLID', 'TDD'],
    },
    server: {
        tag: '// backend',
        title: 'Under the hood',
        accent: 'var(--accent-highlight)',
        body: (
            <>
                Backend architecture is where I live. Designing systems that
                scale horizontally, fail gracefully, and stay maintainable
                three years after launch — that's the craft I pursue.
            </>
        ),
        items: [
            { label: 'Architecture', value: 'Microservices · Monolith-first' },
            { label: 'Performance', value: 'Query optimization · Caching layers' },
            { label: 'Reliability', value: 'Circuit breakers · Graceful degradation' },
        ],
        chips: ['PHP', 'Node.js', 'Redis', 'PostgreSQL', 'RabbitMQ'],
    },
    sticky: {
        tag: '// facts',
        title: 'The human behind the code',
        accent: '#D97706',
        body: (
            <>
                A few things that don't fit in a résumé but make me who I am
                as an engineer and collaborator. The details that matter.
            </>
        ),
        items: [
            { label: 'Location', value: 'Amman, Jordan 🇯🇴' },
            { label: 'Education', value: 'B.Sc. CS · Al Hussein Technical University' },
            { label: 'Timezone', value: 'GMT+3 · Flexible for remote' },
            { label: 'Languages', value: 'Arabic (native) · English (fluent)' },
        ],
        chips: ['Open to remote', 'Team player', 'Continuous learner'],
    },
    mug: {
        tag: '// daily-stack',
        title: 'Fuelled by',
        accent: '#92400E',
        body: (
            <>
                The tools, rituals, and practices that make up a productive
                engineering day. Coffee is optional — but
                strongly, <em>strongly</em> recommended.
            </>
        ),
        items: [
            { label: 'Editor', value: 'VS Code · Vim keybindings' },
            { label: 'Terminal', value: 'iTerm2 · Oh My Zsh' },
            { label: 'Workflow', value: 'Pomodoro · Deep work blocks' },
            { label: 'Learning', value: 'Daily reading · Side projects' },
        ],
        chips: ['Linux', 'Git', 'Postman', 'Figma', 'Notion'],
    },
    terminal: {
        tag: '// philosophy',
        title: 'What drives me',
        accent: '#059669',
        body: (
            <>
                I'm building toward mastery in system design and large-scale
                engineering. The goal isn't to know every framework — it's to
                understand the principles that outlast them all.
            </>
        ),
        items: [
            { label: 'Mission', value: 'Build systems that scale globally' },
            { label: 'Vision', value: 'Senior → Staff → Principal Engineer' },
            { label: 'Focus', value: 'Distributed systems · Performance' },
        ],
        chips: ['System Design', 'Algorithms', 'Architecture', 'Leadership'],
    },
};

// ─── SVG Illustrations ─────────────────────────────────────────────────────────

const LaptopSVG: React.FC = () => (
    <svg viewBox="0 0 220 155" fill="none" xmlns="http://www.w3.org/2000/svg" className="lab-obj-svg">
        {/* Screen */}
        <rect x="22" y="6" width="176" height="112" rx="7" fill="var(--bg-card)" stroke="var(--text-heading)" strokeWidth="2.5" />
        <rect x="30" y="14" width="160" height="97" rx="4" fill="var(--bg-section)" />
        {/* Code lines */}
        <rect x="42" y="25" width="55" height="3.5" rx="1.5" fill="var(--primary-blue)" opacity="0.65" />
        <rect x="42" y="34" width="88" height="2.5" rx="1.2" fill="var(--border-focus)" opacity="0.4" />
        <rect x="42" y="41" width="72" height="2.5" rx="1.2" fill="var(--border-focus)" opacity="0.35" />
        <rect x="42" y="48" width="50" height="2.5" rx="1.2" fill="var(--border-focus)" opacity="0.3" />
        {/* Code block */}
        <rect x="42" y="58" width="110" height="38" rx="4" fill="var(--bg-main)" stroke="var(--border-light)" strokeWidth="1" />
        <rect x="50" y="65" width="28" height="3" rx="1.2" fill="var(--primary-blue)" opacity="0.7" />
        <rect x="50" y="72" width="48" height="2.5" rx="1.2" fill="var(--accent-secondary)" opacity="0.6" />
        <rect x="50" y="79" width="38" height="2.5" rx="1.2" fill="var(--accent-highlight)" opacity="0.55" />
        <rect x="50" y="86" width="55" height="2.5" rx="1.2" fill="var(--border-focus)" opacity="0.3" />
        {/* Cursor */}
        <rect x="50" y="93" width="2" height="9" rx="1" fill="var(--primary-blue)" opacity="0.85">
            <animate attributeName="opacity" values="0.85;0;0.85" dur="1.1s" repeatCount="indefinite" />
        </rect>
        {/* Hinge */}
        <rect x="22" y="116" width="176" height="5" rx="2" fill="var(--text-heading)" opacity="0.12" />
        {/* Base */}
        <rect x="8" y="121" width="204" height="16" rx="4" fill="var(--bg-card)" stroke="var(--text-heading)" strokeWidth="2" />
        {/* Keys row hint */}
        {[20, 36, 52, 68, 84, 100, 116, 132, 148, 164, 180].map((x, i) => (
            <rect key={i} x={x} y="123.5" width="11" height="8" rx="2" fill="var(--bg-section)" stroke="var(--border-light)" strokeWidth="0.7" />
        ))}
        {/* Trackpad */}
        <rect x="84" y="133.5" width="52" height="1.5" rx="0.75" fill="var(--border-light)" />
    </svg>
);

const NotebookSVG: React.FC = () => (
    <svg viewBox="0 0 155 205" fill="none" xmlns="http://www.w3.org/2000/svg" className="lab-obj-svg">
        {/* Shadow */}
        <rect x="22" y="14" width="122" height="178" rx="5" fill="var(--text-heading)" opacity="0.07" />
        {/* Cover */}
        <rect x="18" y="10" width="122" height="178" rx="5" fill="var(--bg-card)" stroke="var(--text-heading)" strokeWidth="2" />
        {/* Spine */}
        <rect x="18" y="10" width="18" height="178" rx="5" fill="var(--accent-secondary)" opacity="0.12" />
        <line x1="36" y1="10" x2="36" y2="188" stroke="var(--text-heading)" strokeWidth="1.5" opacity="0.12" />
        {/* Binding */}
        {[32, 58, 84, 110, 136, 162].map((y) => (
            <circle key={y} cx="27" cy={y} r="4.5" fill="var(--bg-main)" stroke="var(--text-heading)" strokeWidth="1.5" opacity="0.45" />
        ))}
        {/* Ruled lines */}
        {[46, 58, 70, 82, 94, 106, 118, 130, 142, 154, 166].map((y) => (
            <line key={y} x1="46" y1={y} x2="130" y2={y} stroke="var(--border-light)" strokeWidth="1" opacity="0.7" />
        ))}
        {/* Content */}
        <rect x="46" y="30" width="58" height="6" rx="2.5" fill="var(--accent-secondary)" opacity="0.45" />
        <rect x="46" y="46" width="82" height="2.5" rx="1.2" fill="var(--text-muted)" opacity="0.3" />
        <rect x="46" y="58" width="68" height="2.5" rx="1.2" fill="var(--text-muted)" opacity="0.28" />
        <rect x="46" y="70" width="78" height="2.5" rx="1.2" fill="var(--text-muted)" opacity="0.25" />
        <rect x="46" y="82" width="52" height="2.5" rx="1.2" fill="var(--text-muted)" opacity="0.22" />
        <rect x="46" y="94" width="75" height="2.5" rx="1.2" fill="var(--text-muted)" opacity="0.2" />
        {/* Doodle star */}
        <text x="108" y="58" fontSize="15" fill="var(--accent-secondary)" opacity="0.35" fontFamily="serif">★</text>
        {/* Folded page corner */}
        <path d="M118 156 L138 156 L138 176 Z" fill="var(--bg-section)" stroke="var(--border-light)" strokeWidth="0.8" />
        <line x1="118" y1="156" x2="138" y2="176" stroke="var(--border-light)" strokeWidth="0.8" />
        {/* Pen clip hint */}
        <rect x="132" y="10" width="4" height="60" rx="2" fill="var(--accent-primary)" opacity="0.4" />
        <circle cx="134" cy="70" r="4" fill="var(--accent-primary)" opacity="0.35" />
    </svg>
);

const ServerSVG: React.FC = () => (
    <svg viewBox="0 0 155 205" fill="none" xmlns="http://www.w3.org/2000/svg" className="lab-obj-svg">
        {/* Shadow */}
        <rect x="17" y="14" width="124" height="178" rx="5" fill="var(--text-heading)" opacity="0.06" />
        {/* Chassis */}
        <rect x="14" y="10" width="124" height="178" rx="5" fill="var(--bg-section)" stroke="var(--text-heading)" strokeWidth="2" />
        {/* Side rails */}
        <rect x="14" y="10" width="15" height="178" rx="5" fill="var(--text-heading)" opacity="0.06" />
        <rect x="123" y="10" width="15" height="178" rx="5" fill="var(--text-heading)" opacity="0.06" />
        {/* 5 server units */}
        {[0, 1, 2, 3, 4].map((i) => {
            const y = 22 + i * 34;
            const on = i < 3;
            return (
                <g key={i}>
                    <rect x="28" y={y} width="96" height="26" rx="3" fill="var(--bg-card)" stroke="var(--border-light)" strokeWidth="1" />
                    {/* Status LED */}
                    <circle cx="37" cy={y + 13} r="3.5" fill={on ? '#10B981' : 'var(--border-focus)'} opacity={on ? 0.9 : 0.4}>
                        {on && <animate attributeName="opacity" values="0.9;0.35;0.9" dur={`${1.6 + i * 0.35}s`} repeatCount="indefinite" />}
                    </circle>
                    {/* Drive bays */}
                    {[0, 1, 2].map((j) => (
                        <rect key={j} x={46 + j * 19} y={y + 8} width="15" height="10" rx="2" fill="var(--bg-section)" stroke="var(--border-light)" strokeWidth="0.8" />
                    ))}
                    {/* Activity bar */}
                    <rect x="108" y={y + 10} width={on ? 12 : 5} height="6" rx="1.5"
                        fill={on ? 'var(--accent-secondary)' : 'var(--border-light)'} opacity="0.55" />
                </g>
            );
        })}
        {/* Corner screws */}
        {[[19, 16], [133, 16], [19, 183], [133, 183]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="var(--text-heading)" opacity="0.14" />
        ))}
        {/* Cable port row at bottom */}
        {[35, 55, 75, 95, 115].map((x) => (
            <rect key={x} x={x} y="176" width="10" height="6" rx="1.5" fill="var(--text-heading)" opacity="0.12" />
        ))}
    </svg>
);

const StickySVG: React.FC = () => (
    <svg viewBox="0 0 185 165" fill="none" xmlns="http://www.w3.org/2000/svg" className="lab-obj-svg">
        {/* Back note — green tint */}
        <g transform="rotate(7, 92, 82)">
            <rect x="55" y="28" width="115" height="115" rx="2" fill="#D1FAE5" opacity="0.75" />
        </g>
        {/* Mid note — blue tint */}
        <g transform="rotate(-5, 92, 82)">
            <rect x="12" y="22" width="115" height="115" rx="2" fill="#DBEAFE" opacity="0.8" />
        </g>
        {/* Front note — yellow */}
        <rect x="28" y="10" width="125" height="128" rx="2" fill="#FEF3C7" />
        {/* Tape strip */}
        <rect x="58" y="4" width="65" height="12" rx="3" fill="var(--bg-card)" stroke="var(--border-light)" strokeWidth="0.8" opacity="0.75" />
        {/* Heading underline */}
        <rect x="42" y="30" width="65" height="5" rx="2" fill="#D97706" opacity="0.45" />
        {/* Lines */}
        {[44, 54, 64, 74, 84, 96, 108].map((y) => (
            <rect key={y} x="42" y={y} width={y === 64 || y === 84 ? 88 : 72} height="2.5" rx="1.2" fill="#92400E" opacity={y < 70 ? 0.22 : 0.15} />
        ))}
        {/* Smiley in corner */}
        <circle cx="128" cy="108" r="16" fill="none" stroke="#F59E0B" strokeWidth="1.8" opacity="0.45" />
        <circle cx="122" cy="104" r="2" fill="#F59E0B" opacity="0.45" />
        <circle cx="134" cy="104" r="2" fill="#F59E0B" opacity="0.45" />
        <path d="M121 113 Q128 119 135 113" stroke="#F59E0B" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.45" />
        {/* Flag pin */}
        <circle cx="152" cy="14" r="5" fill="#EF4444" opacity="0.6" />
        <line x1="152" y1="14" x2="152" y2="32" stroke="#EF4444" strokeWidth="1.5" opacity="0.4" />
    </svg>
);

const MugSVG: React.FC = () => (
    <svg viewBox="0 0 165 185" fill="none" xmlns="http://www.w3.org/2000/svg" className="lab-obj-svg">
        {/* Steam wisps */}
        {[58, 80, 100].map((x, i) => (
            <path key={i} d={`M${x} 32 Q${x + 9} 20 ${x} 10 Q${x - 8} 1 ${x} -8`}
                stroke="var(--text-muted)" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.22">
                <animate attributeName="opacity" values="0.22;0.05;0.22" dur={`${1.9 + i * 0.4}s`} repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values={`0,0;${i % 2 === 0 ? 3 : -3},-5;0,0`} dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
            </path>
        ))}
        {/* Saucer shadow */}
        <ellipse cx="84" cy="172" rx="58" ry="8" fill="var(--text-heading)" opacity="0.07" />
        {/* Saucer */}
        <ellipse cx="84" cy="166" rx="54" ry="8" fill="var(--bg-card)" stroke="var(--text-heading)" strokeWidth="1.5" />
        {/* Body */}
        <path d="M38 52 L42 154 Q42 165 54 165 L114 165 Q126 165 126 154 L130 52 Z"
            fill="var(--bg-card)" stroke="var(--text-heading)" strokeWidth="2.5" />
        {/* Coffee surface */}
        <ellipse cx="84" cy="54" rx="44" ry="11" fill="var(--bg-section)" />
        <ellipse cx="84" cy="54" rx="39" ry="7.5" fill="#92400E" opacity="0.22" />
        {/* Handle outer */}
        <path d="M126 82 Q158 82 158 108 Q158 134 126 134"
            fill="none" stroke="var(--text-heading)" strokeWidth="11" strokeLinecap="round" />
        {/* Handle inner (hollow) */}
        <path d="M126 82 Q150 82 150 108 Q150 130 126 130"
            fill="none" stroke="var(--bg-card)" strokeWidth="7" strokeLinecap="round" />
        {/* Mug label */}
        <text x="64" y="116" fontSize="12" fill="var(--text-muted)" opacity="0.55" fontFamily="'Courier Prime', monospace">&lt;/&gt;</text>
        <text x="55" y="130" fontSize="7.5" fill="var(--text-muted)" opacity="0.35" fontFamily="'Courier Prime', monospace">debug mode</text>
    </svg>
);

const TerminalSVG: React.FC = () => (
    <svg viewBox="0 0 218 152" fill="none" xmlns="http://www.w3.org/2000/svg" className="lab-obj-svg">
        {/* Outer shadow */}
        <rect x="7" y="13" width="204" height="134" rx="9" fill="var(--text-heading)" opacity="0.08" />
        {/* Window */}
        <rect x="4" y="8" width="204" height="134" rx="9" fill="var(--text-heading)" />
        {/* Titlebar */}
        <rect x="4" y="8" width="204" height="28" rx="9" fill="var(--text-heading)" />
        <rect x="4" y="24" width="204" height="12" fill="var(--text-heading)" />
        {/* Traffic lights */}
        <circle cx="22" cy="22" r="5.5" fill="#FF5F57" />
        <circle cx="39" cy="22" r="5.5" fill="#FEBC2E" />
        <circle cx="56" cy="22" r="5.5" fill="#28C840" />
        {/* Title */}
        <text x="112" y="26" textAnchor="middle" fontSize="8.5" fill="var(--text-muted)" fontFamily="'Courier Prime', monospace" opacity="0.45">
            fathi@engineering-lab ~ zsh
        </text>
        {/* Terminal body — dark */}
        <rect x="4" y="36" width="204" height="106" rx="0" fill="#0F172A" />
        <rect x="4" y="130" width="204" height="12" rx="9" fill="#0F172A" />
        <rect x="4" y="36" width="204" height="106" fill="url(#tg2)" />
        <defs>
            <linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
        </defs>
        {/* Lines */}
        <text x="18" y="54" fontSize="8.5" fill="#10B981" fontFamily="'Courier Prime', monospace" opacity="0.9">$ whoami</text>
        <text x="18" y="67" fontSize="8.5" fill="#94A3B8" fontFamily="'Courier Prime', monospace" opacity="0.8">  fathi — software engineer</text>
        <text x="18" y="82" fontSize="8.5" fill="#10B981" fontFamily="'Courier Prime', monospace" opacity="0.9">$ cat mission.txt</text>
        <text x="18" y="95" fontSize="8.5" fill="#94A3B8" fontFamily="'Courier Prime', monospace" opacity="0.8">  build systems that outlast any single</text>
        <text x="18" y="107" fontSize="8.5" fill="#94A3B8" fontFamily="'Courier Prime', monospace" opacity="0.8">  framework or trend.</text>
        <text x="18" y="122" fontSize="8.5" fill="#10B981" fontFamily="'Courier Prime', monospace" opacity="0.9">$ _</text>
        {/* Cursor */}
        <rect x="30" y="113" width="7" height="11" rx="1" fill="#F8FAFC" opacity="0.75">
            <animate attributeName="opacity" values="0.75;0;0.75" dur="1s" repeatCount="indefinite" />
        </rect>
    </svg>
);

const svgMap: Record<ObjectId, React.FC> = {
    laptop: LaptopSVG,
    notebook: NotebookSVG,
    server: ServerSVG,
    sticky: StickySVG,
    mug: MugSVG,
    terminal: TerminalSVG,
};

// ─── Panel ─────────────────────────────────────────────────────────────────────

const Panel: React.FC<{ id: ObjectId; onClose: () => void }> = ({ id, onClose }) => {
    const ref = useRef<HTMLDivElement>(null);
    const content = panelContent[id];

    useEffect(() => {
        if (!ref.current) return;
        gsap.fromTo(ref.current,
            { opacity: 0, x: 32, scale: 0.96 },
            { opacity: 1, x: 0, scale: 1, duration: 0.45, ease: 'expo.out' }
        );
    }, [id]);

    return (
        <aside className="lab-panel" ref={ref} role="dialog" aria-modal="true">
            <div className="lab-panel__inner">
                <div className="lab-panel__header">
                    <div className="lab-panel__top">
                        <span className="lab-panel__tag" style={{ color: content.accent }}>
                            {content.tag}
                        </span>
                        <button className="lab-panel__close" onClick={onClose} aria-label="Close">×</button>
                    </div>
                    <div className="lab-panel__accent-bar" style={{ background: content.accent }} />
                </div>

                <h2 className="lab-panel__title">{content.title}</h2>
                <p className="lab-panel__body">{content.body}</p>

                {content.items && (
                    <div className="lab-panel__items">
                        {content.items.map((item, i) => (
                            <div key={i} className="lab-panel__item">
                                <span className="lab-panel__item-label">{item.label}</span>
                                <span className="lab-panel__item-value">{item.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {content.chips && (
                    <div className="lab-panel__chips">
                        {content.chips.map((chip, i) => (
                            <span
                                key={i}
                                className="lab-panel__chip"
                                style={{ '--chip-color': content.accent } as React.CSSProperties}
                            >
                                {chip}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};

// ─── Desk Object ───────────────────────────────────────────────────────────────

const DeskObject: React.FC<{
    obj: LabObject;
    isActive: boolean;
    anyActive: boolean;
    onClick: (id: ObjectId) => void;
}> = ({ obj, isActive, anyActive, onClick }) => {
    const SVGComp = svgMap[obj.id];
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        gsap.to(ref.current, {
            scale: isActive ? 1.07 : anyActive ? 0.96 : 1,
            opacity: anyActive && !isActive ? 0.45 : 1,
            duration: 0.4,
            ease: 'back.out(1.6)',
        });
    }, [isActive, anyActive]);

    return (
        <button
            ref={ref}
            className={`lab-object lab-object--${obj.id} ${isActive ? 'lab-object--active' : ''}`}
            style={{
                '--rot': `${obj.rotation}deg`,
                zIndex: isActive ? 20 : obj.zIndex,
            } as React.CSSProperties}
            onClick={() => onClick(obj.id)}
            aria-label={`${obj.label} — ${obj.hint}`}
            aria-pressed={isActive}
            title={`${obj.label} · ${obj.hint}`}
        >
            <div className="lab-object__body">
                <SVGComp />
            </div>
            <div className="lab-object__tooltip">
                <span className="lab-object__tooltip-name">{obj.label}</span>
                <span className="lab-object__tooltip-hint">→ {obj.hint}</span>
            </div>
        </button>
    );
};

// ─── Main ──────────────────────────────────────────────────────────────────────

const About: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const deskRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<ObjectId | null>(null);
    const [interacted, setInteracted] = useState(false);
    const [exploredCount, setExploredCount] = useState(0);
    const explored = useRef<Set<ObjectId>>(new Set());

    // Pin with GSAP ScrollTrigger (desktop only)
    useEffect(() => {
        if (!sectionRef.current) return;
        const isMobile = window.innerWidth <= 640;
        const ctx = gsap.context(() => {
            if (!isMobile) {
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=90%',
                    pin: true,
                    pinSpacing: true,
                });
            }

            // Staggered entrance — opacity/scale only; CSS handles rotation via --rot
            const items = deskRef.current?.querySelectorAll('.lab-object');
            if (items) {
                gsap.fromTo(items,
                    { opacity: 0, y: 40, scale: 0.82 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 0.7,
                        stagger: 0.09,
                        ease: 'back.out(1.5)',
                        delay: 0.2,
                    }
                );
            }
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // Escape to close
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const open = useCallback((id: ObjectId) => {
        if (active === id) { close(); return; }
        setActive(id);
        setInteracted(true);
        if (!explored.current.has(id)) {
            explored.current.add(id);
            setExploredCount(explored.current.size);
        }
    }, [active]);

    const close = useCallback(() => {
        setActive(null);
    }, []);

    return (
        <section ref={sectionRef} className="about" id="about">

            {/* Header bar */}
            <div className="lab-topbar">
                <div className="lab-topbar__left">
                    <span className="lab-topbar__led" />
                    <span className="lab-topbar__label">Engineering Lab</span>
                    <span className="lab-topbar__divider">/</span>
                    <span className="lab-topbar__sub">fathi's Workspace</span>
                </div>
                <div className="lab-topbar__right">
                    {interacted ? (
                        <span className="lab-topbar__progress">
                            {exploredCount} / {labObjects.length} explored
                        </span>
                    ) : (
                        <span className="lab-topbar__hint">
                            <span className="lab-topbar__hint-dot" />
                            Click any object to discover
                        </span>
                    )}
                </div>
            </div>

            {/* Main workspace */}
            <div className="lab-workspace">

                {/* Desk surface */}
                <div className="lab-desk">
                    <div className="lab-desk__surface">
                        <div className="lab-desk__wood-grain" />
                        <div className="lab-desk__edge-shadow" />

                        {/* Objects scattered on desk */}
                        <div ref={deskRef} className="lab-desk__objects">
                            {labObjects.map((obj) => (
                                <DeskObject
                                    key={obj.id}
                                    obj={obj}
                                    isActive={active === obj.id}
                                    anyActive={active !== null}
                                    onClick={open}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detail panel — slides in from right */}
                {active && <Panel id={active} onClose={close} />}
            </div>

            {/* Footer strip */}
            <div className="lab-footer">
                <span className="lab-footer__mono">
                    Software Engineer · Amman, Jordan · Open to Remote · B.Sc. CS
                </span>
                <div className="lab-footer__pips">
                    {labObjects.map((obj) => (
                        <div
                            key={obj.id}
                            className={`lab-footer__pip ${explored.current.has(obj.id) ? 'lab-footer__pip--done' : ''} ${active === obj.id ? 'lab-footer__pip--active' : ''}`}
                            title={obj.label}
                            onClick={() => open(obj.id)}
                        />
                    ))}
                </div>
            </div>

        </section>
    );
};

export default About;