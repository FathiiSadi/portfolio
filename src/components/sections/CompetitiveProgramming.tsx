import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, useInView } from 'framer-motion';
import { fetchCodeforcesStats, type CodeforcesStats } from '../../utils/codeforces';
import './CompetitiveProgramming.css';

/* GSAP-powered number counter — smooth, no setInterval jank */
const AnimatedNumber = ({
  value, isInView, delay = 0, suffix = '',
}: {
  value: number; isInView: boolean; delay?: number; suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!isInView || animated.current || !ref.current) return;
    animated.current = true;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2,
      delay,
      ease: 'power3.out',
      onUpdate() {
        if (ref.current)
          ref.current.textContent = Math.floor(obj.val).toLocaleString() + suffix;
      },
      onComplete() {
        if (ref.current)
          ref.current.textContent = value.toLocaleString() + suffix;
      },
    });
  }, [isInView, value, delay, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

/* Typed terminal — character by character */
const TERMINAL_LINES = [
  { prompt: true,  text: 'whoami' },
  { prompt: false, text: '  fathi · software engineer' },
  { prompt: true,  text: 'cat rankings.txt' },
  { prompt: false, text: '  #23 Jordan  ·  #1750 IEEEXtreme' },
  { prompt: true,  text: 'echo $mindset' },
  { prompt: false, text: '  decompose ruthlessly. outlast frameworks.' },
];

const TypedTerminal: React.FC<{ isInView: boolean }> = ({ isInView }) => {
  const [done, setDone]     = useState(false);
  const [lineIdx, setLine]  = useState(0);
  const [charIdx, setChar]  = useState(0);
  const [visible, setVisible] = useState<typeof TERMINAL_LINES>([]);

  useEffect(() => {
    if (!isInView || done) return;
    if (lineIdx >= TERMINAL_LINES.length) { setDone(true); return; }

    const line = TERMINAL_LINES[lineIdx];
    if (charIdx < line.text.length) {
      const delay = line.prompt ? 55 : 18;
      const t = setTimeout(() => setChar(c => c + 1), delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisible(v => [...v, line]);
        setLine(l => l + 1);
        setChar(0);
      }, line.prompt ? 200 : 80);
      return () => clearTimeout(t);
    }
  }, [isInView, lineIdx, charIdx, done]);

  const current = lineIdx < TERMINAL_LINES.length ? TERMINAL_LINES[lineIdx] : null;
  const partial = current ? current.text.slice(0, charIdx) : '';

  return (
    <pre className="cp__terminal">
      {visible.map((l, i) => (
        <div key={i} className={`cp__tline${!l.prompt ? ' cp__tline--out' : ''}`}>
          {l.prompt && <span className="cp__prompt">$</span>}
          {l.text}
        </div>
      ))}
      {!done && current && (
        <div className={`cp__tline${!current.prompt ? ' cp__tline--out' : ''}`}>
          {current.prompt && <span className="cp__prompt">$</span>}
          {partial}
          <span className="cp__caret" />
        </div>
      )}
      {done && (
        <div className="cp__tline">
          <span className="cp__prompt">$</span>
          {' '}<span className="cp__caret" />
        </div>
      )}
    </pre>
  );
};

const CompetitiveProgramming: React.FC = () => {
  const [data, setData]       = useState<CodeforcesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const ref    = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  useEffect(() => {
    if (!isInView) return;
    fetchCodeforcesStats().then(d => { setData(d); setLoading(false); });
  }, [isInView]);

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <section ref={ref} className="cp section">
      {/* Scrolling code bg */}
      <div className="cp__bg" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="cp__bg-line"
            style={{ top: `${(i / 10) * 100}%`, opacity: 0.035 + (i % 3) * 0.01 }}
            animate={{ x: [i % 2 === 0 ? '0%' : '-50%', i % 2 === 0 ? '-50%' : '0%'] }}
            transition={{ duration: 30 + i * 4, repeat: Infinity, ease: 'linear' }}
          >
            {`for(int i=0;i<n;i++){dp[i]=max(dp[i-1]+a[i],a[i]);}  long solve(vector<int>&v){sort(v.begin(),v.end());return v.back();}  `}
          </motion.div>
        ))}
      </div>

      {/* Large bg watermark */}
      <div className="cp__watermark" aria-hidden="true">COMPETE</div>

      <div className="shell">
        <header className="chapter">
          <span className="chapter__index">05</span>
          <span className="chapter__title">Competitive Programming</span>
          <span className="chapter__rule" />
        </header>

        {/* Section title */}
        <motion.h2
          className="cp__title"
          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)', y: 16 }}
          animate={isInView ? { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0 } : {}}
          transition={{ duration: 1, ease }}
        >
          Competing at<br /><em>the edge.</em>
        </motion.h2>

        <motion.p
          className="cp__sub"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        >
          31 Codeforces contests. Top 21 in Jordan. Top 1,750 globally.
          Stats pulled live from the{' '}
          <a className="cp__link"
            href={`https://codeforces.com/profile/${data?.handle ?? 'fathi_sadi'}`}
            target="_blank" rel="noopener noreferrer"
            data-cursor-label="Open CF">
            public API ↗
          </a>
        </motion.p>

        {/* Achievement badges */}
        <motion.div
          className="cp__badges"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease }}
        >
          <div className="cp__badge">
            <span className="cp__badge-icon">🏆</span>
            <div>
              <div className="cp__badge-rank">Top 21</div>
              <div className="cp__badge-label">Jordan · JCPC National</div>
            </div>
          </div>
          <div className="cp__badge">
            <span className="cp__badge-icon">🌍</span>
            <div>
              <div className="cp__badge-rank">Top 1,750</div>
              <div className="cp__badge-label">Global · IEEEXtreme 2024</div>
            </div>
          </div>
        </motion.div>

        {/* Stats panel */}
        <div className="cp__panel">
          <div className="cp__panel-head">
            <div className="cp__dots"><i /><i /><i /></div>
            <span className="cp__panel-title">~/fathi.terminal — codeforces stats</span>
            {data && (
              <a href={`https://codeforces.com/profile/${data.handle}`}
                target="_blank" rel="noopener noreferrer"
                className="cp__handle" data-cursor-label="Profile">
                @{data.handle} ↗
              </a>
            )}
          </div>

          {loading ? (
            <div className="cp__loading">
              <div className="cp__loading-bar" />
              <span>fetching live data…</span>
            </div>
          ) : data ? (
            <div className="cp__grid">
              {/* Big stat — rating */}
              <motion.div
                className="cp__cell cp__cell--big"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1, ease }}
              >
                <span className="cp__cell-label">Current Rating</span>
                <span className="cp__cell-num">
                  <AnimatedNumber value={data.rating} isInView={isInView} delay={0.4} />
                </span>
                <span className="cp__cell-rank">{data.rank}</span>
              </motion.div>

              {/* Peak */}
              <motion.div
                className="cp__cell"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2, ease }}
              >
                <span className="cp__cell-label">Peak Rating</span>
                <span className="cp__cell-num cp__cell-num--sm">
                  <AnimatedNumber value={data.maxRating} isInView={isInView} delay={0.5} />
                </span>
                <span className="cp__cell-rank">{data.maxRank}</span>
              </motion.div>

              {/* Solved */}
              <motion.div
                className="cp__cell"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3, ease }}
              >
                <span className="cp__cell-label">Problems Solved</span>
                <span className="cp__cell-num cp__cell-num--sm">
                  <AnimatedNumber value={data.problemsSolved} isInView={isInView} delay={0.6} />
                </span>
                <span className="cp__cell-rank">problems</span>
              </motion.div>

              {/* Contests */}
              <motion.div
                className="cp__cell"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4, ease }}
              >
                <span className="cp__cell-label">Contests</span>
                <span className="cp__cell-num cp__cell-num--sm">
                  <AnimatedNumber value={31} isInView={isInView} delay={0.7} />
                </span>
                <span className="cp__cell-rank">rounds</span>
              </motion.div>

              {/* Typed terminal */}
              <motion.div
                className="cp__cell cp__cell--terminal"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <TypedTerminal isInView={isInView} />
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default CompetitiveProgramming;
