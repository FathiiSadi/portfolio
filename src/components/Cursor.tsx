import { useEffect, useRef } from 'react';

const Cursor: React.FC = () => {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pos      = useRef({ x: -200, y: -200 });
  const ring     = useRef({ x: -200, y: -200 });
  const rafId    = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Spotlight via CSS custom props — zero JS repaint cost
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
      if (labelRef.current) {
        labelRef.current.style.left = `${e.clientX}px`;
        labelRef.current.style.top  = `${e.clientY}px`;
      }
    };

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top  = `${ring.current.y}px`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const enterHover = (e: Event) => {
      const label = (e.currentTarget as HTMLElement).dataset.cursorLabel;
      if (label && labelRef.current) {
        labelRef.current.textContent = label;
        labelRef.current.classList.add('cursor-label--visible');
      }
      ringRef.current?.classList.add('cursor-ring--hover');
    };
    const leaveHover = () => {
      labelRef.current?.classList.remove('cursor-label--visible');
      ringRef.current?.classList.remove('cursor-ring--hover');
    };

    let attached: HTMLElement[] = [];
    const attach = () => {
      attached = Array.from(
        document.querySelectorAll<HTMLElement>('a, button, [data-magnetic], [data-cursor-label]')
      );
      attached.forEach(el => {
        el.addEventListener('mouseenter', enterHover);
        el.addEventListener('mouseleave', leaveHover);
      });
    };

    window.addEventListener('mousemove', move);
    // Attach after a tick so all elements are mounted
    const t = setTimeout(attach, 500);

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(rafId.current);
      clearTimeout(t);
      attached.forEach(el => {
        el.removeEventListener('mouseenter', enterHover);
        el.removeEventListener('mouseleave', leaveHover);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef}   className="cursor-dot"   aria-hidden="true" />
      <div ref={ringRef}  className="cursor-ring"  aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  );
};

export default Cursor;
