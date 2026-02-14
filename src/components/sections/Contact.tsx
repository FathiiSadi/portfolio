import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForm, ValidationError } from '@formspree/react';
import EnergyRibbons from '../effects/EnergyRibbons';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    const [state, handleFormspreeSubmit] = useForm("mykdwkpw");
    const [localErrors, setLocalErrors] = React.useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // ... (keep current GSAP animations)
            // Title Animation (Massive Typography)
            const chars = titleRef.current?.querySelectorAll('.char');
            if (chars) {
                gsap.fromTo(chars,
                    {
                        y: 200,
                        rotateX: -90,
                        opacity: 0
                    },
                    {
                        y: 0,
                        rotateX: 0,
                        opacity: 1,
                        duration: 1.2,
                        stagger: 0.03,
                        ease: 'power4.out',
                        scrollTrigger: {
                            trigger: titleRef.current,
                            start: 'top 90%',
                        }
                    }
                );
            }

            // Form animations
            gsap.fromTo('.form-group',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.contact-form-side', // Adjusted trigger
                        start: 'top 85%',
                    }
                }
            );

            // Magnetic effect for social links and button
            const magneticElements = sectionRef.current?.querySelectorAll('.magnetic-target');
            magneticElements?.forEach((el: Element) => {
                const target = el as HTMLElement;
                const handleMouseMove = (e: MouseEvent) => {
                    const rect = target.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    gsap.to(target, {
                        x: x * 0.4,
                        y: y * 0.4,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                };

                const handleMouseLeave = () => {
                    gsap.to(target, {
                        x: 0,
                        y: 0,
                        duration: 0.7,
                        ease: 'elastic.out(1, 0.3)'
                    });
                };

                target.addEventListener('mousemove', handleMouseMove);
                target.addEventListener('mouseleave', handleMouseLeave);
            });
        }, sectionRef);

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, [state.succeeded]); // Re-run animations if form resets

    const validateForm = (data: FormData) => {
        const errors: { [key: string]: string } = {};
        const name = data.get('name') as string;
        const email = data.get('email') as string;
        const message = data.get('message') as string;

        if (!name || name.trim().length === 0) {
            errors.name = 'Please enter your name.';
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email address.';
        }
        if (!message || message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters long.';
        }

        return errors;
    };

    const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            setLocalErrors(errors);
            return;
        }

        setLocalErrors({});
        handleFormspreeSubmit(e);
    };

    const splitTitle = (text: string) => {
        return text.split('').map((char, i) => (
            <span key={i} className="char" style={{ display: 'inline-block' }}>
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    };

    return (
        <section ref={sectionRef} id="contact" className="contact section">
            <EnergyRibbons />

            <div className="container">
                <div ref={titleRef} className="massive-title-wrapper">
                    <h2 className="massive-title">
                        <div className="title-row">{splitTitle("LET'S WORK")}</div>
                        <div className="title-row">{splitTitle("TOGETHER")}</div>
                    </h2>
                </div>

                <div className="contact-main-grid">
                    <div className="contact-visual-side">
                        <div className="contact-stats">
                            <p className="contact-tag">AVAILABLE FOR FREELANCE</p>
                            <p className="contact-location">BASED IN AMMAN, JORDAN</p>
                        </div>

                        <div ref={linksRef} className="modern-social-list">
                            {[
                                { label: 'Email', href: 'mailto:fathii.alsadi@gmail.com', icon: '✉' },
                                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fathi-sadi/', icon: 'in' },
                                { label: 'GitHub', href: 'https://github.com/FathiiSadi', icon: 'git' }
                            ].map((link, idx) => (
                                <a key={idx} href={link.href} className="modern-social-item magnetic-target" target="_blank" rel="noopener noreferrer">
                                    <span className="item-icon">{link.icon}</span>
                                    <span className="item-label">{link.label}</span>
                                    <span className="item-arrow">↗</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="contact-form-side">
                        {state.succeeded ? (
                            <div className="form-success-message">
                                <h3 className="success-header">Message Sent!</h3>
                                <p>Thanks for reaching out. I'll get back to you soon.</p>
                                <button onClick={() => window.location.reload()} className="reload-btn">SEND ANOTHER</button>
                            </div>
                        ) : (
                            <form ref={formRef} className="modern-contact-form" onSubmit={handleCustomSubmit}>
                                <div className="form-group">
                                    <span className="group-number">01</span>
                                    <label htmlFor="name">What's your name?</label>
                                    <input type="text" id="name" name="name" required placeholder="Fathi Al-Sadi *" />
                                    {localErrors.name && <span className="form-error">{localErrors.name}</span>}
                                    <ValidationError prefix="Name" field="name" errors={state.errors} className="form-error" />
                                    <div className="line-highlight"></div>
                                </div>

                                <div className="form-group">
                                    <span className="group-number">02</span>
                                    <label htmlFor="email">What's your email?</label>
                                    <input type="email" id="email" name="email" required placeholder="fathisadi49@gmail.com *" />
                                    {localErrors.email && <span className="form-error">{localErrors.email}</span>}
                                    <ValidationError prefix="Email" field="email" errors={state.errors} className="form-error" />
                                    <div className="line-highlight"></div>
                                </div>

                                <div className="form-group">
                                    <span className="group-number">03</span>
                                    <label htmlFor="message">Your message</label>
                                    <textarea id="message" name="message" required placeholder="Hello Fathi, I'd like to talk about..." rows={4}></textarea>
                                    {localErrors.message && <span className="form-error">{localErrors.message}</span>}
                                    <ValidationError prefix="Message" field="message" errors={state.errors} className="form-error" />
                                    <div className="line-highlight"></div>
                                </div>

                                <div className="form-submit-wrapper">
                                    <button type="submit" disabled={state.submitting} className="modern-submit-btn magnetic-target">
                                        <div className="btn-circle">
                                            <span className="btn-text">{state.submitting ? 'SENDING...' : 'SEND'}</span>
                                            <span className="btn-icon">→</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
