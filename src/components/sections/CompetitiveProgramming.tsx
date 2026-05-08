import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fetchCodeforcesStats, type CodeforcesStats } from '../../utils/codeforces';
import './CompetitiveProgramming.css';

const AnimatedNumber = ({ value, isInView, delay }: { value: number | string; isInView: boolean; delay?: number }) => {
    const [display, setDisplay] = useState(0);
    const num = typeof value === 'string' ? parseFloat(value) : value;

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 1800;
        const totalFrames = duration / 16;
        const increment = num / totalFrames;
        let timer: ReturnType<typeof setInterval>;

        const startAnim = () => {
            timer = setInterval(() => {
                start += increment;
                if (start >= num) {
                    setDisplay(num);
                    clearInterval(timer);
                } else {
                    setDisplay(Math.floor(start));
                }
            }, 16);
        };

        const t = setTimeout(startAnim, (delay || 0) * 1000);
        return () => {
            clearTimeout(t);
            if (timer) clearInterval(timer);
        };
    }, [num, isInView, delay]);

    return <span>{display}</span>;
};

const CompetitiveProgramming: React.FC = () => {
    const [data, setData] = useState<CodeforcesStats | null>(null);
    const [loading, setLoading] = useState(true);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const d = await fetchCodeforcesStats();
            setData(d);
            setLoading(false);
        };
        if (isInView && !data) load();
    }, [isInView, data]);

    return (
        <div ref={ref} className="cp">
            <div className="shell">
                <header className="chapter">
                    <span className="chapter__index">05 / Sport</span>
                    <span className="chapter__title">Algorithms in the wild</span>
                    <span className="chapter__rule" />
                </header>

                <div className="cp__head">
                    <h2 className="cp__title">
                        I take problems —<br />
                        <em>seriously.</em>
                    </h2>
                    <p className="cp__sub">
                        Outside of work, I solve problems on Codeforces. Sport for the
                        brain. Numbers below are pulled live from the
                        <a className="cp__link" href={`https://codeforces.com/profile/${data?.handle ?? 'fathi_sadi'}`}
                            target="_blank" rel="noopener noreferrer"> public API</a>.
                    </p>
                </div>

                <div className="cp__panel">
                    <div className="cp__panel-head">
                        <div className="cp__dots">
                            <i /><i /><i />
                        </div>
                        <span className="cp__panel-title">~ /codeforces — Fathi.Terminal</span>
                        {data && (
                            <a
                                href={`https://codeforces.com/profile/${data.handle}`}
                                target="_blank" rel="noopener noreferrer"
                                className="cp__handle"
                                data-magnetic
                            >
                                @{data.handle} ↗
                            </a>
                        )}
                    </div>

                    {loading ? (
                        <div className="cp__loading">
                            <span className="cp__loading-bar" />
                            <span>Fetching stats…</span>
                        </div>
                    ) : data ? (
                        <div className="cp__grid">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="cp__cell cp__cell--big"
                            >
                                <span className="cp__cell-label">— Current Rating</span>
                                <span className="cp__cell-num">
                                    <AnimatedNumber value={data.rating} isInView={isInView} delay={0.4} />
                                </span>
                                <span className="cp__cell-sub">{data.rank}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="cp__cell"
                            >
                                <span className="cp__cell-label">— Peak</span>
                                <span className="cp__cell-num cp__cell-num--small">
                                    <AnimatedNumber value={data.maxRating} isInView={isInView} delay={0.5} />
                                </span>
                                <span className="cp__cell-sub">{data.maxRank}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="cp__cell"
                            >
                                <span className="cp__cell-label">— Solved</span>
                                <span className="cp__cell-num cp__cell-num--small">
                                    <AnimatedNumber value={data.problemsSolved} isInView={isInView} delay={0.6} />
                                </span>
                                <span className="cp__cell-sub">problems</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                                transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="cp__cell"
                            >
                                <span className="cp__cell-label">— Contests</span>
                                <span className="cp__cell-num cp__cell-num--small">
                                    <AnimatedNumber value={31} isInView={isInView} delay={0.7} />
                                </span>
                                <span className="cp__cell-sub">rounds</span>
                            </motion.div>

                            <motion.pre
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                                className="cp__cell cp__cell--terminal"
                            >
                                <span className="cp__line"><i className="cp__prompt">$</i> whoami</span>
                                <span className="cp__line cp__line--out">  fathi · software engineer</span>
                                <span className="cp__line"><i className="cp__prompt">$</i> cat goal.txt</span>
                                <span className="cp__line cp__line--out">  outlast frameworks. think in systems.</span>
                                <span className="cp__line cp__line--out">  decompose ruthlessly.</span>
                                <span className="cp__line"><i className="cp__prompt">$</i> _ <i className="cp__caret" /></span>
                            </motion.pre>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="cp__bg" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: '100%' }}
                        animate={{ x: '-100%' }}
                        transition={{ duration: 28 + i * 3, repeat: Infinity, ease: 'linear' }}
                        className="cp__bg-line"
                        style={{ top: `${(i / 12) * 100}%` }}
                    >
                        {`function solve() { int n, m; cin >> n >> m; vector<int> dp(n + 1); for (int i = 0; i < n; i++) { ... } return answer; }`}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CompetitiveProgramming;
