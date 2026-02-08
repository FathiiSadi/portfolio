import React, { useEffect, useRef } from 'react';

const EnergyRibbons: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        window.addEventListener('resize', resize);
        resize();

        // Color Palette
        const palette = [
            { color: 'rgba(132, 151, 157, 0.15)', width: 1.5 }, // Blue-Gray
            { color: 'rgba(71, 85, 105, 0.12)', width: 2 },    // Cool Slate-Blue
            { color: 'rgba(91, 114, 128, 0.18)', width: 1 },    // Desaturated Steel-Blue
            { color: 'rgba(59, 130, 246, 0.25)', width: 0.6 },  // Primary Blue (Sharp Pop)
        ];

        interface Ribbon {
            baseY: number;
            amplitude: number;
            freq: number;
            speed: number;
            offset: number;
            hue: number;
            points: number;
            color: string;
            lineWidth: number;
            verticalShift: number;
        }

        const ribbons: Ribbon[] = [];
        const ribbonCount = 18; // Increased for richer weave

        for (let i = 0; i < ribbonCount; i++) {
            const p = palette[i % palette.length];
            const isAccent = p.color.includes('59, 130, 246'); // Check if it's the primary blue accent

            ribbons.push({
                baseY: height * (0.2 + Math.random() * 0.6),
                amplitude: (isAccent ? 40 : 80) + Math.random() * 100,
                freq: (isAccent ? 0.001 : 0.0004) + Math.random() * 0.0008,
                speed: (isAccent ? 0.8 : 0.3) + Math.random() * 0.5,
                offset: Math.random() * 2000,
                hue: Math.random() * 360,
                points: isAccent ? 12 : 8,
                color: p.color,
                lineWidth: p.width,
                verticalShift: (Math.random() - 0.5) * 150
            });
        }

        const draw = () => {
            time += 0.008;
            ctx.clearRect(0, 0, width, height);

            // Background highlight (very subtle)
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
            gradient.addColorStop(0, 'rgba(248, 250, 252, 0)');
            gradient.addColorStop(1, 'rgba(241, 245, 249, 0.5)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            ribbons.forEach((r, idx) => {
                ctx.beginPath();

                // Add subtle glow to the primary blue accent lines
                const isAccent = r.color.includes('59, 130, 246');
                if (isAccent) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.strokeStyle = r.color;
                ctx.lineWidth = r.lineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                const step = (width + 200) / (r.points - 1);
                const startX = -100;

                for (let i = 0; i < r.points; i++) {
                    const x = startX + i * step;

                    // Layered wave layers for organic complexity
                    const w1 = Math.sin(x * r.freq + time * r.speed + r.offset) * r.amplitude;
                    const w2 = Math.sin(x * r.freq * 2.3 + time * r.speed * 1.5 + r.offset) * (r.amplitude * 0.3);
                    const w3 = Math.cos(time * 0.8 + idx) * 30; // Float

                    const y = r.baseY + w1 + w2 + w3 + r.verticalShift;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        const prevX = startX + (i - 1) * step;
                        const pw1 = Math.sin(prevX * r.freq + time * r.speed + r.offset) * r.amplitude;
                        const pw2 = Math.sin(prevX * r.freq * 2.3 + time * r.speed * 1.5 + r.offset) * (r.amplitude * 0.3);
                        const pw3 = Math.cos(time * 0.8 + idx) * 30;
                        const prevY = r.baseY + pw1 + pw2 + pw3 + r.verticalShift;

                        const xc = (prevX + x) / 2;
                        const yc = (prevY + y) / 2;
                        ctx.quadraticCurveTo(prevX, prevY, xc, yc);
                    }
                }

                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="energy-ribbons-canvas"
            className="energy-ribbons-canvas"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0.8
            }}
        />
    );
};

export default EnergyRibbons;
