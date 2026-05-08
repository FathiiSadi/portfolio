import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './CustomCursor.css';

const HOVER_SELECTOR = 'a, button, [data-magnetic], [data-cursor]';

const CustomCursor: React.FC = () => {
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const [label, setLabel] = useState<string | null>(null);
    const [mode, setMode] = useState<'idle' | 'hover' | 'view' | 'drag'>('idle');

    useEffect(() => {
        if (matchMedia('(hover: none) and (pointer: coarse)').matches) return;

        const ring = ringRef.current!;
        const dot = dotRef.current!;
        const label = labelRef.current!;

        gsap.set([ring, dot, label], { xPercent: -50, yPercent: -50, opacity: 0 });

        const dotQ = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'none' });
        const dotY = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'none' });
        const ringQ = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'expo.out' });
        const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'expo.out' });
        const labQ = gsap.quickTo(label, 'x', { duration: 0.4, ease: 'expo.out' });
        const labY = gsap.quickTo(label, 'y', { duration: 0.4, ease: 'expo.out' });

        let visible = false;
        const onMove = (e: MouseEvent) => {
            if (!visible) {
                visible = true;
                gsap.to([ring, dot, label], { opacity: 1, duration: 0.4 });
            }
            dotQ(e.clientX);
            dotY(e.clientY);
            ringQ(e.clientX);
            ringY(e.clientY);
            labQ(e.clientX);
            labY(e.clientY);
        };

        // Track whether the mouse left to an iframe (cross-origin focus shift)
        // vs. left the window entirely. When entering an iframe, document fires
        // mouseleave but the pointer is still on the page — hiding the cursor
        // makes it look broken. Instead we keep it visible at last position and
        // rely on the iframe's own native cursor.
        const onLeave = (e: MouseEvent) => {
            // If the mouse exited through the top/edges of the viewport,
            // hide normally. If it just moved into a child iframe, keep visible.
            const outOfWindow =
                e.clientY <= 0 ||
                e.clientX <= 0 ||
                e.clientX >= window.innerWidth ||
                e.clientY >= window.innerHeight;
            if (outOfWindow) {
                visible = false;
                gsap.to([ring, dot, label], { opacity: 0, duration: 0.3 });
            }
        };

        // When focus shifts into an iframe (e.g. user clicks Drive player),
        // restore visibility on return.
        const onFocus = () => {
            if (!visible) {
                visible = true;
                gsap.to([ring, dot, label], { opacity: 1, duration: 0.3 });
            }
        };

        // Magnetic targets pull the ring toward their center
        const magnets: Array<{ el: HTMLElement; tween?: gsap.core.Tween }> = [];
        const refresh = () => {
            // Reset previous targets
            magnets.forEach(m => {
                m.el.style.transform = '';
            });
            magnets.length = 0;

            document.querySelectorAll<HTMLElement>(HOVER_SELECTOR).forEach((el) => {
                magnets.push({ el });

                const enter = () => {
                    const cursorMode = el.dataset.cursor;
                    if (cursorMode === 'view') setMode('view');
                    else if (cursorMode === 'drag') setMode('drag');
                    else setMode('hover');
                    setLabel(el.dataset.cursorLabel || null);
                };
                const leave = () => {
                    setMode('idle');
                    setLabel(null);
                    if (el.dataset.magnetic !== undefined) {
                        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
                    }
                };
                const move = (e: MouseEvent) => {
                    if (el.dataset.magnetic === undefined) return;
                    const rect = el.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const strength = parseFloat(el.dataset.magneticStrength || '0.35');
                    gsap.to(el, {
                        x: (e.clientX - cx) * strength,
                        y: (e.clientY - cy) * strength,
                        duration: 0.4,
                        ease: 'power3.out',
                    });
                };

                el.addEventListener('mouseenter', enter);
                el.addEventListener('mouseleave', leave);
                el.addEventListener('mousemove', move);

                (el as unknown as { __cursor?: () => void }).__cursor = () => {
                    el.removeEventListener('mouseenter', enter);
                    el.removeEventListener('mouseleave', leave);
                    el.removeEventListener('mousemove', move);
                };
            });
        };
        refresh();

        const obs = new MutationObserver(() => {
            // De-bounce a tick: rebind only when DOM additions matter
            window.requestAnimationFrame(refresh);
        });
        obs.observe(document.body, { childList: true, subtree: true });

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', onLeave);
        window.addEventListener('focus', onFocus);

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('focus', onFocus);
            obs.disconnect();
            magnets.forEach(m => (m.el as unknown as { __cursor?: () => void }).__cursor?.());
        };
    }, []);

    return (
        <>
            <div ref={ringRef} className={`cur cur--ring cur--${mode}`} />
            <div ref={dotRef} className={`cur cur--dot cur--${mode}`} />
            <div ref={labelRef} className={`cur cur--label ${label ? 'cur--label-on' : ''}`}>
                {label}
            </div>
        </>
    );
};

export default CustomCursor;
