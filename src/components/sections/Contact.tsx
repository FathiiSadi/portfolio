import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForm, ValidationError } from '@formspree/react';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    const [state, handleFormspreeSubmit] = useForm('mykdwkpw');
    const [localErrors, setLocalErrors] = React.useState<Record<string, string>>({});

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            const chars = titleRef.current?.querySelectorAll('.ch');
            if (chars) {
                gsap.from(chars, {
                    yPercent: 110,
                    opacity: 0,
                    duration: 1.1,
                    stagger: 0.04,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
                });
            }
            gsap.from('.contact-form .field', {
                opacity: 0,
                y: 24,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.contact-form', start: 'top 88%' },
            });
        }, sectionRef);
        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, [state.succeeded]);

    const validate = (data: FormData) => {
        const errs: Record<string, string> = {};
        const name = (data.get('name') as string) || '';
        const email = (data.get('email') as string) || '';
        const message = (data.get('message') as string) || '';
        if (!name.trim()) errs.name = 'Your name, please.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'A valid email helps me reply.';
        if (message.trim().length < 10) errs.message = '10 characters minimum — give me a little to go on.';
        return errs;
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const errs = validate(data);
        if (Object.keys(errs).length) {
            setLocalErrors(errs);
            return;
        }
        setLocalErrors({});
        handleFormspreeSubmit(e);
    };

    // Split into per-word groups so letters never break mid-word (e.g. "use-ful"),
    // while keeping each letter as a `.ch` span for the stagger animation.
    const split = (text: string) =>
        text.split(' ').map((word, wi, arr) => (
            <React.Fragment key={wi}>
                <span className="word">
                    {word.split('').map((c, i) => (
                        <span key={i} className="ch" style={{ display: 'inline-block' }}>{c}</span>
                    ))}
                </span>
                {wi < arr.length - 1 ? ' ' : null}
            </React.Fragment>
        ));

    return (
        <div ref={sectionRef} className="contact">
            <div className="contact__scrim" aria-hidden="true" />
            <div className="shell">
                <header className="chapter">
                    <span className="chapter__index">CH.06</span>
                    <span className="chapter__title">Transmit · Send a signal</span>
                    <span className="chapter__rule" />
                </header>

                <div ref={titleRef} className="contact-title">
                    <span className="contact-title__line">{split('Let\'s')} <em>{split('build')}</em></span>
                    <span className="contact-title__line">{split('something')} <em className="contact-title__em--acid">{split('useful.')}</em></span>
                </div>

                <div className="contact-grid">
                    <aside className="contact-aside">
                        <span className="eyebrow eyebrow--acid">— Direct lines</span>
                        <ul className="contact-lines">
                            {[
                                { label: 'Email', val: 'fathii.alsadi@gmail.com', href: 'mailto:fathii.alsadi@gmail.com' },
                                { label: 'LinkedIn', val: '/in/fathi-sadi', href: 'https://www.linkedin.com/in/fathi-sadi/' },
                                { label: 'GitHub', val: '@FathiiSadi', href: 'https://github.com/FathiiSadi' },
                                { label: 'Codeforces', val: '@fathi_sadi', href: 'https://codeforces.com/profile/solveXJO' },
                            ].map((l, i) => (
                                <li key={i}>
                                    <a href={l.href} target="_blank" rel="noopener noreferrer"
                                        data-magnetic data-magnetic-strength="0.2" className="contact-line">
                                        <span className="contact-line__label">{l.label}</span>
                                        <span className="contact-line__val">{l.val}</span>
                                        <span className="contact-line__arrow">↗</span>
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="contact-meta">
                            <div>
                                <span className="eyebrow">— Based</span>
                                <p>Amman, Jordan · GMT+3</p>
                            </div>
                            <div>
                                <span className="eyebrow eyebrow--acid">— Status</span>
                                <p>Available ·</p>
                            </div>
                        </div>
                    </aside>

                    <div className="contact-form-wrap">
                        {state.succeeded ? (
                            <div className="contact-success">
                                <span className="eyebrow eyebrow--acid">— Sent</span>
                                <h3>Got it. Thanks for reaching out.</h3>
                                <p>I'll come back to you within a day or two.</p>
                                <button onClick={() => window.location.reload()} className="btn-pill" data-magnetic>
                                    <span className="btn-pill__dot" />
                                    Send another
                                </button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={submit}>
                                <div className="field">
                                    <label htmlFor="c-name">
                                        <span className="field__num">01</span>
                                        <span className="field__q">What's your name?</span>
                                    </label>
                                    <input type="text" id="c-name" name="name" placeholder="Your full name *" />
                                    {localErrors.name && <span className="field__err">{localErrors.name}</span>}
                                    <ValidationError prefix="Name" field="name" errors={state.errors} className="field__err" />
                                </div>

                                <div className="field">
                                    <label htmlFor="c-email">
                                        <span className="field__num">02</span>
                                        <span className="field__q">Where can I reach you?</span>
                                    </label>
                                    <input type="email" id="c-email" name="email" placeholder="you@example.com *" />
                                    {localErrors.email && <span className="field__err">{localErrors.email}</span>}
                                    <ValidationError prefix="Email" field="email" errors={state.errors} className="field__err" />
                                </div>

                                <div className="field">
                                    <label htmlFor="c-message">
                                        <span className="field__num">03</span>
                                        <span className="field__q">Tell me everything.</span>
                                    </label>
                                    <textarea id="c-message" name="message" placeholder="Hi Fathi — I'd like to talk about…" rows={5} />
                                    {localErrors.message && <span className="field__err">{localErrors.message}</span>}
                                    <ValidationError prefix="Message" field="message" errors={state.errors} className="field__err" />
                                </div>

                                <button type="submit" disabled={state.submitting} className="contact-submit"
                                    data-magnetic data-magnetic-strength="0.3" data-cursor="view" data-cursor-label="Send">
                                    <span>{state.submitting ? 'Sending…' : 'Send'}</span>
                                    <span className="contact-submit__arrow">↗</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
