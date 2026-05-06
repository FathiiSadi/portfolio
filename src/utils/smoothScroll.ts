/**
 * Lerp-based smooth scroll. Native scrolling stays the source of truth; we
 * smooth the visual transform on a wrapper. Cheap, dependency-free, plays
 * nicely with GSAP ScrollTrigger.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface SmoothScrollHandle {
    destroy: () => void;
    scrollTo: (target: number | string | HTMLElement) => void;
}

export function initSmoothScroll(content: HTMLElement, lerp = 0.085): SmoothScrollHandle {
    let current = window.scrollY;
    let target = window.scrollY;
    let raf = 0;
    let isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;

    // Reduced-motion users get native scroll
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduce) {
        return { destroy: () => { }, scrollTo: () => { } };
    }

    document.body.style.height = '';
    content.style.position = 'fixed';
    content.style.top = '0';
    content.style.left = '0';
    content.style.width = '100%';
    content.style.willChange = 'transform';

    const setBodyHeight = () => {
        document.body.style.height = `${content.scrollHeight}px`;
    };
    setBodyHeight();
    const ro = new ResizeObserver(setBodyHeight);
    ro.observe(content);

    const onScroll = () => {
        target = window.scrollY;
    };

    const tick = () => {
        current += (target - current) * lerp;
        if (Math.abs(target - current) < 0.05) current = target;
        content.style.transform = `translate3d(0, ${-current}px, 0)`;
        ScrollTrigger.update();
        raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    tick();

    // Anchor links should respect the smooth scroll
    const onAnchorClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const el = document.querySelector(id) as HTMLElement | null;
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, behavior: 'smooth' });
    };
    document.addEventListener('click', onAnchorClick);

    // Tell GSAP ScrollTrigger that scroll is now driven by the wrapper
    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            if (value !== undefined) window.scrollTo(0, value);
            return window.scrollY;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: 'transform',
    });
    ScrollTrigger.defaults({ scroller: document.body });
    ScrollTrigger.refresh();

    return {
        destroy() {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('click', onAnchorClick);
            ro.disconnect();
            content.style.position = '';
            content.style.top = '';
            content.style.left = '';
            content.style.width = '';
            content.style.transform = '';
            document.body.style.height = '';
        },
        scrollTo(t) {
            let y = 0;
            if (typeof t === 'number') y = t;
            else if (typeof t === 'string') {
                const el = document.querySelector(t) as HTMLElement | null;
                if (!el) return;
                y = el.getBoundingClientRect().top + window.scrollY;
            } else {
                y = t.getBoundingClientRect().top + window.scrollY;
            }
            window.scrollTo({ top: y, behavior: 'smooth' });
        },
    };
}
