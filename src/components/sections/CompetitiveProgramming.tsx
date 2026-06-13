import { useState, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, useInView } from 'framer-motion';
import {
  fetchCodeforcesStats,
  fetchRatingHistory,
  type CodeforcesStats,
  type RatingPoint,
} from '../../utils/codeforces';
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

/* ════════ Rating graph — the climb, drawn over the official bands ════════ */

const BANDS = [
  { from: 0, to: 1200, color: '#8b93a7', label: 'newbie' },
  { from: 1200, to: 1400, color: '#6fdc8c', label: 'pupil' },
  { from: 1400, to: 1600, color: '#2ec8c8', label: 'specialist' },
  { from: 1600, to: 1900, color: '#5b7bff', label: 'expert' },
  { from: 1900, to: 2100, color: '#b35bff', label: 'cand. master' },
];

const GW = 640;
const GH = 232;
const PAD = { l: 14, r: 92, t: 16, b: 16 };

const RatingGraph: React.FC<{ inView: boolean }> = ({ inView }) => {
  const [history, setHistory] = useState<RatingPoint[] | null>(null);

  useEffect(() => {
    if (!inView || history) return;
    let cancelled = false;
    fetchRatingHistory().then((h) => { if (!cancelled) setHistory(h); });
    return () => { cancelled = true; };
  }, [inView, history]);

  const geo = useMemo(() => {
    if (!history) return null;
    const ratings = history.map((p) => p.rating);
    const lo = Math.min(...ratings);
    const hi = Math.max(...ratings);
    const minR = Math.floor((lo - 70) / 100) * 100;
    const maxR = Math.ceil((hi + 90) / 100) * 100;

    const x = (i: number) => PAD.l + (i * (GW - PAD.l - PAD.r)) / Math.max(history.length - 1, 1);
    const y = (r: number) => PAD.t + (1 - (r - minR) / (maxR - minR)) * (GH - PAD.t - PAD.b);

    const pts = history.map((p, i) => ({ px: x(i), py: y(p.rating), ...p }));
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ');
    const peak = ratings.indexOf(hi);

    const bands = BANDS
      .filter((b) => b.to > minR && b.from < maxR)
      .map((b) => {
        const top = y(Math.min(b.to, maxR));
        const bot = y(Math.max(b.from, minR));
        return { ...b, top, height: bot - top };
      });

    return { pts, d, peak, bands, minR, maxR };
  }, [history]);

  return (
    <div className="cp-card cp-card--graph">
      <div className="cp-card__head">
        <span className="cp-card__title">rating.svg — the climb</span>
        <span className="cp-card__meta">{history ? `${history.length} rated contests` : 'fetching…'}</span>
      </div>

      {geo ? (
        <svg
          className="cp-graph"
          viewBox={`0 0 ${GW} ${GH}`}
          role="img"
          aria-label="Codeforces rating history graph"
        >
          {/* rating bands */}
          {geo.bands.map((b) => (
            <g key={b.label}>
              <rect x="0" y={b.top} width={GW} height={b.height} fill={b.color} opacity="0.07" />
              <line x1="0" x2={GW} y1={b.top} y2={b.top} stroke={b.color} strokeOpacity="0.16" strokeDasharray="3 5" />
              <text x={GW - 8} y={b.top + 13} textAnchor="end" className="cp-graph__band" fill={b.color}>
                {b.label}
              </text>
            </g>
          ))}

          {/* glow underlay + line */}
          <path d={geo.d} className={`cp-graph__glow ${inView ? 'is-drawn' : ''}`} pathLength={1} />
          <path d={geo.d} className={`cp-graph__path ${inView ? 'is-drawn' : ''}`} pathLength={1} />

          {/* contest dots */}
          {geo.pts.map((p, i) => (
            <circle
              key={i}
              cx={p.px}
              cy={p.py}
              r={i === geo.peak ? 4.5 : 2.4}
              className={`cp-graph__dot ${i === geo.peak ? 'cp-graph__dot--peak' : ''} ${inView ? 'is-on' : ''}`}
              style={{ transitionDelay: `${0.35 + (i / geo.pts.length) * 2.2}s` }}
            >
              <title>{`${p.contest} → ${p.rating}`}</title>
            </circle>
          ))}

          {/* peak flag */}
          <text
            x={geo.pts[geo.peak].px}
            y={geo.pts[geo.peak].py - 12}
            textAnchor="middle"
            className={`cp-graph__peak ${inView ? 'is-on' : ''}`}
          >
            ▲ peak {history![geo.peak].rating}
          </text>
        </svg>
      ) : (
        <div className="cp-card__loading">
          <div className="cp__loading-bar" />
          <span>plotting the climb…</span>
        </div>
      )}

      <div className="cp-card__foot">
        <span>favorite weapons: dp · graphs · greedy · binary search</span>
        <span className="cp-card__foot-right">every dip taught something</span>
      </div>
    </div>
  );
};

/* ════════ Live judge feed — watching verdicts land ════════ */

interface Submission {
  id: string;
  problem: string;
  lang: string;
  verdict: 'AC' | 'WA' | 'TLE';
  detail: string;
  tests: number;
}

const SUBMISSIONS: Submission[] = [
  { id: '291480221', problem: '1980C — Lost Operations', lang: 'C++20', verdict: 'AC', detail: '156 ms', tests: 14 },
  { id: '291480784', problem: '1942B — Bessie and MEX', lang: 'C++20', verdict: 'AC', detail: '92 ms', tests: 9 },
  { id: '291481390', problem: '2009F — Firefly\'s Queries', lang: 'C++20', verdict: 'TLE', detail: 'test 21', tests: 21 },
  { id: '291482011', problem: '2009F — Firefly\'s Queries', lang: 'C++20', verdict: 'AC', detail: '748 ms', tests: 26 },
  { id: '291482677', problem: '1846E — Rudolf and Snowflakes', lang: 'C++20', verdict: 'WA', detail: 'test 11', tests: 11 },
  { id: '291483215', problem: '1846E — Rudolf and Snowflakes', lang: 'C++20', verdict: 'AC', detail: '124 ms', tests: 19 },
  { id: '291483902', problem: '1971G — XOUR', lang: 'C++20', verdict: 'AC', detail: '187 ms', tests: 12 },
  { id: '291484516', problem: '1915F — Greetings', lang: 'C++20', verdict: 'AC', detail: '374 ms', tests: 16 },
  { id: '291485100', problem: '2057C — Trip to the Olympiad', lang: 'C++20', verdict: 'AC', detail: '61 ms', tests: 8 },
];

const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const VERDICT_TEXT = { AC: 'Accepted', WA: 'Wrong answer', TLE: 'Time limit' } as const;

const FeedRow: React.FC<{ sub: Submission }> = ({ sub }) => {
  const [judging, setJudging] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const spin = setInterval(() => setTick((t) => t + 1), 120);
    const settle = setTimeout(() => {
      setJudging(false);
      clearInterval(spin);
    }, 1500);
    return () => {
      clearInterval(spin);
      clearTimeout(settle);
    };
  }, []);

  const test = Math.min(1 + Math.floor(tick / 2), sub.tests);

  return (
    <div className={`cp-feed__row ${judging ? '' : `is-${sub.verdict.toLowerCase()}`}`}>
      <span className="cp-feed__id">#{sub.id}</span>
      <span className="cp-feed__problem">{sub.problem}</span>
      <span className="cp-feed__lang">{sub.lang}</span>
      {judging ? (
        <span className="cp-feed__verdict cp-feed__verdict--judging">
          {SPINNER[tick % SPINNER.length]} test {test}
        </span>
      ) : (
        <span className="cp-feed__verdict">
          {sub.verdict === 'AC' ? '✓' : '✗'} {VERDICT_TEXT[sub.verdict]} · {sub.detail}
        </span>
      )}
    </div>
  );
};

const JudgeFeed: React.FC<{ inView: boolean }> = ({ inView }) => {
  const [items, setItems] = useState<{ key: number; sub: Submission }[]>([]);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const push = () => {
      setItems((prev) => [{ key: i, sub: SUBMISSIONS[i % SUBMISSIONS.length] }, ...prev].slice(0, 6));
      i++;
    };
    const first = setTimeout(push, 400);
    const id = setInterval(push, 2600);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [inView]);

  return (
    <div className="cp-card cp-card--feed">
      <div className="cp-card__head">
        <span className="cp-card__live-dot" />
        <span className="cp-card__title">judge — submission queue</span>
      </div>
      <div className="cp-feed" aria-hidden="true">
        {items.map(({ key, sub }) => (
          <FeedRow key={key} sub={sub} />
        ))}
      </div>
      <div className="cp-card__foot">
        <span>408 problems brought to justice</span>
      </div>
    </div>
  );
};

/* ════════ Typed terminal (kept) ════════ */

const TERMINAL_LINES = [
  { prompt: true, text: 'whoami' },
  { prompt: false, text: '  fathi · software engineer' },
  { prompt: true, text: 'cat rankings.txt' },
  { prompt: false, text: '  #21 Jordan · JCPC  ·  #1750 IEEEXtreme' },
  { prompt: true, text: 'echo $mindset' },
  { prompt: false, text: '  decompose ruthlessly. outlast frameworks.' },
];

const TypedTerminal: React.FC<{ isInView: boolean }> = ({ isInView }) => {
  const [done, setDone] = useState(false);
  const [lineIdx, setLine] = useState(0);
  const [charIdx, setChar] = useState(0);
  const [visible, setVisible] = useState<typeof TERMINAL_LINES>([]);

  useEffect(() => {
    if (!isInView || done) return;
    if (lineIdx >= TERMINAL_LINES.length) {
      const t = setTimeout(() => setDone(true), 0);
      return () => clearTimeout(t);
    }

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

/* ════════ Section ════════ */

const CompetitiveProgramming: React.FC = () => {
  const [data, setData] = useState<CodeforcesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  useEffect(() => {
    if (!isInView) return;
    fetchCodeforcesStats().then(d => { setData(d); setLoading(false); });
  }, [isInView]);

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div ref={ref} className="cp">
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
          <span className="chapter__index">CH.05</span>
          <span className="chapter__title">Arena · Competitive programming</span>
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
            href={`https://codeforces.com/profile/${data?.handle ?? 'SolveXJo'}`}
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

        {/* ── the climb + the judge floor ── */}
        <motion.div
          className="cp__live"
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.45, ease }}
        >
          <RatingGraph inView={isInView} />
          <JudgeFeed inView={isInView} />
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
    </div>
  );
};

export default CompetitiveProgramming;
