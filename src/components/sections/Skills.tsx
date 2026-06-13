import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from 'framer-motion';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

/* ── the arsenal ──────────────────────────────────────────────────── */

interface SkillRow {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}

interface Group {
  id: string;
  dir: string;
  file: string;
  lang: string;
  skills: SkillRow[];
  code: string;
}

const GROUPS: Group[] = [
  {
    id: 'backend',
    dir: 'backend/',
    file: 'scheduler.php',
    lang: 'php',
    skills: [
      { name: 'Laravel', level: 5 },
      { name: 'PHP', level: 5 },
      { name: 'MySQL · Postgres', level: 4 },
      { name: 'Redis · Queues', level: 4 },
      { name: 'System design', level: 4 },
    ],
    code: `<?php
// Qalam — deterministic section assignment
final class AssignSections implements ShouldQueue
{
    public function handle(RuleEngine $rules): void
    {
        $sections = Section::query()
            ->with('course', 'candidates')
            ->orderByPriority()
            ->get();

        foreach ($sections as $section) {
            $rules->validate($section);
            $section->assign(
                $rules->bestInstructorFor($section)
            );
        }
    }
}`,
  },
  {
    id: 'frontend',
    dir: 'frontend/',
    file: 'camera-rig.tsx',
    lang: 'tsx',
    skills: [
      { name: 'React', level: 5 },
      { name: 'TypeScript', level: 4 },
      { name: 'Three.js · GLSL', level: 4 },
      { name: 'GSAP · motion', level: 4 },
      { name: 'Vue', level: 4 },
    ],
    code: `// this site — scroll drives the dolly
useFrame((state, delta) => {
  const p = scrollState.progress;
  const [k0, k1] = bracket(keyframes, p);

  target.lerpVectors(k0.pos, k1.pos, ease(p));

  // cinematic lag — trail the mark
  const lag = 1 - Math.exp(-5.2 * delta);
  camera.position.lerp(target, lag);
  camera.lookAt(focus);
});`,
  },
  {
    id: 'ai',
    dir: 'ai-systems/',
    file: 'rag_pipeline.py',
    lang: 'python',
    skills: [
      { name: 'RAG architecture', level: 4 },
      { name: 'LangChain', level: 4 },
      { name: 'FAISS · embeddings', level: 4 },
      { name: 'Semantic search', level: 4 },
      { name: 'LLM orchestration', level: 4 },
    ],
    code: `# Amal — grounded answers, not vibes
def answer(question: str) -> str:
    docs = index.similarity_search(
        embed(question), k=6
    )
    context = rerank(docs)[:3]

    return llm.generate(
        PROMPT.format(
            context=context,
            question=question,
        )
    )`,
  },
];

/* ── featherweight syntax highlighting ───────────────────────────── */

const TOKEN_RE =
  /(\/\/.*|#.*)|('[^']*'?|"[^"]*"?)|(\$\w+)|(\b\d+(?:\.\d+)?\b)|(\b(?:final|class|implements|public|function|void|foreach|as|return|const|new|def|str|for|while|import|from|interface|extends|private|use|with|get|query)\b)/g;

const CLASSES = ['tok-comment', 'tok-string', 'tok-var', 'tok-num', 'tok-kw'];

function highlight(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of line.matchAll(TOKEN_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(line.slice(last, idx));
    const cls = CLASSES[m.slice(1).findIndex((g) => g !== undefined)] ?? '';
    out.push(<span key={key++} className={cls}>{m[0]}</span>);
    last = idx + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/* ── tickers (kept from v1 — the full-bleed garnish) ─────────────── */

const ROW_A = [
  'Laravel', 'Vue', 'React', 'TypeScript', 'Node', 'PHP',
  'Postgres', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Linux',
];

const ROW_B = [
  'RAG', 'LangChain', 'FAISS', 'Embeddings', 'Architecture',
  'Performance', 'APIs', 'Domain-driven', 'Profiling', 'Caching',
  'Queues', 'Systems',
];

const CYCLE_MS = 4200;
const MANUAL_HOLD_MS = 16000;

const Skills: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackARef = useRef<HTMLDivElement>(null);
  const trackBRef = useRef<HTMLDivElement>(null);
  const arsenalRef = useRef<HTMLDivElement>(null);
  const inView = useInView(arsenalRef, { amount: 0.25 });

  const [active, setActive] = useState(0);
  const [chars, setChars] = useState(0);
  const [manual, setManual] = useState(false);
  const manualUntil = useRef(0);
  const manualTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const group = GROUPS[active];
  const done = chars >= group.code.length;

  /* typewriter — restart when the group changes (adjust-during-render pattern) */
  const [prevActive, setPrevActive] = useState(active);
  if (prevActive !== active) {
    setPrevActive(active);
    setChars(0);
  }

  useEffect(() => {
    if (!inView || done) return;
    const t = setTimeout(() => setChars((c) => Math.min(c + 3, group.code.length)), 18);
    return () => clearTimeout(t);
  }, [inView, chars, done, group.code.length]);

  /* auto-cycle once typing settles */
  useEffect(() => {
    if (!inView || !done) return;
    const t = setTimeout(() => {
      if (Date.now() > manualUntil.current) {
        setActive((a) => (a + 1) % GROUPS.length);
      }
    }, CYCLE_MS);
    return () => clearTimeout(t);
  }, [inView, done, active]);

  const select = useCallback((i: number) => {
    manualUntil.current = Date.now() + MANUAL_HOLD_MS;
    setManual(true);
    if (manualTimer.current) clearTimeout(manualTimer.current);
    manualTimer.current = setTimeout(() => setManual(false), MANUAL_HOLD_MS);
    setActive(i);
  }, []);

  useEffect(() => () => {
    if (manualTimer.current) clearTimeout(manualTimer.current);
  }, []);

  /* entrance + tickers */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.arsenal', {
        y: 56,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.arsenal', start: 'top 82%' },
      });
      gsap.to(trackARef.current, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
      gsap.set(trackBRef.current, { xPercent: -50 });
      gsap.to(trackBRef.current, { xPercent: 0, duration: 42, ease: 'none', repeat: -1 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* typed text → lines, with caret on the last one */
  const typed = group.code.slice(0, chars);
  const lines = useMemo(() => typed.split('\n'), [typed]);
  const lastLine = lines[lines.length - 1] ?? '';

  const renderRow = (items: string[]) => (
    <>
      {[0, 1].map((dup) => (
        <div key={dup} className="ticker__group" aria-hidden={dup === 1 ? 'true' : undefined}>
          {items.map((item, i) => (
            <span key={`${dup}-${i}`} className="ticker__item">
              <span className="ticker__text">{item}</span>
              <span className="ticker__star" aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      ))}
    </>
  );

  return (
    <div ref={rootRef} className="skills">
      <div className="skills__scrim" aria-hidden="true" />
      <div className="shell">
        <header className="chapter">
          <span className="chapter__index">CH.03</span>
          <span className="chapter__title">Arsenal · Tools of the trade</span>
          <span className="chapter__rule" />
        </header>

        <div className="skills__head">
          <h2 className="display-xl">Weapons of <em>choice.</em></h2>
          <p className="skills__sub">
            Three arsenals, one habit: read the system before touching it.
            Watch the editor — it cycles through real code from real projects.
          </p>
        </div>

        {/* ── the stack explorer ── */}
        <div ref={arsenalRef} className="arsenal">
          <div className="arsenal__bar">
            <div className="arsenal__dots"><i /><i /><i /></div>
            <span className="arsenal__bar-title">~/fathi/stack — explorer</span>
            <span className={`arsenal__mode ${done ? 'is-idle' : 'is-typing'}`}>
              {manual ? '⏸ manual' : done ? '● cycling' : '● typing'}
            </span>
          </div>

          <div className="arsenal__body">
            <aside className="arsenal__tree" aria-label="Stack groups">
              {GROUPS.map((g, i) => (
                <div key={g.id} className={`arsenal__group ${i === active ? 'is-open' : ''}`}>
                  <button
                    className="arsenal__dir"
                    onClick={() => select(i)}
                    aria-expanded={i === active}
                  >
                    <span className="arsenal__dir-arrow">{i === active ? '▾' : '▸'}</span>
                    {g.dir}
                  </button>
                  <ul className="arsenal__files">
                    {g.skills.map((s) => (
                      <li key={s.name} className="arsenal__skill">
                        <span className="arsenal__skill-name">{s.name}</span>
                        <span className="arsenal__meter" aria-label={`${s.level} of 5`}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <i key={n} className={n <= s.level ? 'on' : ''} />
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>

            <div className="arsenal__editor">
              <div className="arsenal__tab">
                <span className="arsenal__tab-dot" />
                {group.file}
              </div>
              <pre className="arsenal__code" aria-label={`${group.file} code sample`}>
                {lines.map((line, i) => (
                  <div key={i} className="arsenal__line">
                    <span className="arsenal__ln">{String(i + 1).padStart(2, ' ')}</span>
                    <code>
                      {highlight(line)}
                      {i === lines.length - 1 && !done && <span className="arsenal__caret" />}
                    </code>
                  </div>
                ))}
                {done && (
                  <div className="arsenal__line">
                    <span className="arsenal__ln">{String(lines.length + 1).padStart(2, ' ')}</span>
                    <code><span className="arsenal__caret" /></code>
                  </div>
                )}
              </pre>
              <div className="arsenal__status">
                <span className="arsenal__status-mode">-- INSERT --</span>
                <span>{group.file}</span>
                <span className="arsenal__status-right">
                  {group.lang} · utf-8 · ln {lines.length}, col {lastLine.length + 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ticker ticker--a">
        <div ref={trackARef} className="ticker__track">{renderRow(ROW_A)}</div>
      </div>
      <div className="ticker ticker--b">
        <div ref={trackBRef} className="ticker__track">{renderRow(ROW_B)}</div>
      </div>
    </div>
  );
};

export default Skills;
