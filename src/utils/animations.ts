// GSAP Animation Utilities for Portfolio
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Animate text by splitting into words/characters
 */
export const animateText = (
    element: HTMLElement,
    options: {
        delay?: number;
        duration?: number;
        stagger?: number;
        from?: 'left' | 'right' | 'bottom';
    } = {}
) => {
    const { delay = 0, duration = 0.8, stagger = 0.03, from = 'bottom' } = options;

    const fromProps: gsap.TweenVars = {
        opacity: 0,
        ...(from === 'left' && { x: -50 }),
        ...(from === 'right' && { x: 50 }),
        ...(from === 'bottom' && { y: 50 }),
    };

    gsap.from(element.children, {
        ...fromProps,
        duration,
        stagger,
        delay,
        ease: 'power3.out',
    });
};

/**
 * Fade in animation with scroll trigger
 */
export const fadeInOnScroll = (
    element: HTMLElement | string,
    options: {
        start?: string;
        end?: string;
        scrub?: boolean;
        markers?: boolean;
    } = {}
) => {
    const { start = 'top 80%', end = 'top 20%', scrub = false, markers = false } = options;

    gsap.from(element, {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: element,
            start,
            end,
            scrub,
            markers,
            toggleActions: 'play none none reverse',
        },
    });
};

/**
 * Slide in from side with scroll trigger
 */
export const slideInOnScroll = (
    element: HTMLElement | string,
    direction: 'left' | 'right' = 'left',
    options: {
        start?: string;
        distance?: number;
    } = {}
) => {
    const { start = 'top 80%', distance = 100 } = options;

    gsap.from(element, {
        x: direction === 'left' ? -distance : distance,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: element,
            start,
            toggleActions: 'play none none reverse',
        },
    });
};

/**
 * Stagger animation for multiple elements
 */
export const staggerFadeIn = (
    elements: HTMLElement[] | NodeListOf<Element> | string,
    options: {
        delay?: number;
        stagger?: number;
        start?: string;
    } = {}
) => {
    const { delay = 0, stagger = 0.1, start = 'top 80%' } = options;

    gsap.from(elements, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: typeof elements === 'string' ? elements : elements[0],
            start,
            toggleActions: 'play none none reverse',
        },
    });
};

/**
 * Horizontal scroll section
 */
export const createHorizontalScroll = (
    container: HTMLElement,
    items: HTMLElement | string,
    options: {
        speed?: number;
        start?: string;
        end?: string;
    } = {}
) => {
    const { speed = 1, start = 'top top' } = options;

    const itemsElement = typeof items === 'string' ? document.querySelector(items) as HTMLElement : items;

    if (!itemsElement) return;

    const scrollWidth = itemsElement.scrollWidth - container.offsetWidth;

    gsap.to(itemsElement, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
            trigger: container,
            start,
            end: `+=${scrollWidth * speed}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
        },
    });
};

/**
 * Parallax effect
 */
export const parallaxEffect = (
    element: HTMLElement | string,
    speed: number = 0.5
) => {
    gsap.to(element, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        },
    });
};

/**
 * Scale on scroll
 */
export const scaleOnScroll = (
    element: HTMLElement | string,
    options: {
        from?: number;
        to?: number;
        start?: string;
    } = {}
) => {
    const { from = 0.8, to = 1, start = 'top 80%' } = options;

    gsap.fromTo(
        element,
        { scale: from, opacity: 0 },
        {
            scale: to,
            opacity: 1,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: element,
                start,
                toggleActions: 'play none none reverse',
            },
        }
    );
};

/**
 * Counter animation
 */
export const animateCounter = (
    element: HTMLElement,
    endValue: number,
    options: {
        duration?: number;
        start?: string;
    } = {}
) => {
    const { duration = 2, start = 'top 70%' } = options;

    const obj = { value: 0 };

    gsap.to(obj, {
        value: endValue,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: element,
            start,
            toggleActions: 'play none none none',
        },
        onUpdate: () => {
            element.textContent = Math.round(obj.value).toString();
        },
    });
};

/**
 * Reveal text with gradient
 */
export const gradientTextReveal = (element: HTMLElement | string) => {
    gsap.from(element, {
        backgroundPosition: '200% center',
        duration: 2,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        },
    });
};

/**
 * Cleanup all ScrollTriggers
 */
export const cleanupScrollTriggers = () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};
