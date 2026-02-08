
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, TrendingUp, Code, Activity } from "lucide-react";
import { fetchCodeforcesStats, type CodeforcesStats } from "../../utils/codeforces";
import "./CompetitiveProgramming.css";

const AnimatedNumber = ({ value, isInView, delay }: { value: number | string; isInView: boolean; delay?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    useEffect(() => {
        if (!isInView) return;

        let start = 0;
        const end = numericValue;
        const duration = 2000;
        // avoid division by zero or negative
        const totalFrames = duration / 16;
        const increment = end / totalFrames;
        let timer: ReturnType<typeof setInterval>;

        const startAnimation = () => {
            timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setDisplayValue(end);
                    clearInterval(timer);
                } else {
                    setDisplayValue(Math.floor(start));
                }
            }, 16);
        };

        // delay is in seconds, convert to ms
        const timeout = setTimeout(startAnimation, (delay || 0) * 1000);

        return () => {
            clearTimeout(timeout);
            if (timer) clearInterval(timer);
        };
    }, [value, isInView, numericValue, delay]);

    return <span>{displayValue}</span>;
};

export default function CompetitiveProgramming() {
    const [cfData, setCfData] = useState<CodeforcesStats | null>(null);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

    useEffect(() => {
        const loadData = async () => {
            // Fetch data when component comes into view, but only once to avoid spamming API
            // User logic implies fetching when in view. Since we have a fallback, it's cheap to just run it.
            // My utility handles errors.
            setLoading(true);
            const data = await fetchCodeforcesStats();
            setCfData(data);
            setLoading(false);
        };

        if (isInView && !cfData) {
            loadData();
        }
    }, [isInView, cfData]);

    return (
        <section
            ref={sectionRef}
            className="cp-section"
            id="competitive-programming"
        >
            <div className="cp-container">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="cp-title"
                >
                    Competitive Programming
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="cp-subtitle"
                >
                </motion.p>

                {/* Terminal-style Container */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="cp-terminal-wrapper"
                >
                    {/* Terminal Header */}
                    <div className="cp-terminal-header">
                        <div className="dot dot-red" />
                        <div className="dot dot-yellow" />
                        <div className="dot dot-green" />
                        <span className="terminal-filename">
                            Fathi.Terminal
                        </span>
                    </div>

                    {/* Terminal Body */}
                    <div className="cp-terminal-body">
                        {loading && (
                            <div className="cp-loading">
                                <Activity className="cp-loading-icon" />
                                <p>Loading competitive programming stats...</p>
                            </div>
                        )}

                        {!loading && cfData && (
                            <div className="space-y-8">
                                {/* Stats Grid */}
                                <div className="cp-stats-grid">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={
                                            isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                                        }
                                        transition={{ duration: 0.6, delay: 0.6 }}
                                        className="cp-stat-card card-blue"
                                    >
                                        <div className="stat-header">
                                            <Trophy className="stat-icon text-blue" />
                                            <span className="text-slate">Current Rating</span>
                                        </div>
                                        <div className="stat-value text-blue">
                                            <AnimatedNumber value={cfData.rating} delay={0.6} isInView={isInView} />
                                        </div>
                                        <div className="stat-sub text-purple">
                                            {cfData.rank}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={
                                            isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                                        }
                                        transition={{ duration: 0.6, delay: 0.7 }}
                                        className="cp-stat-card card-purple"
                                    >
                                        <div className="stat-header">
                                            <TrendingUp className="stat-icon text-purple" />
                                            <span className="text-slate">Max Rating</span>
                                        </div>
                                        <div className="stat-value text-purple">
                                            <AnimatedNumber value={cfData.maxRating} delay={0.7} isInView={isInView} />
                                        </div>
                                        <div className="stat-sub text-blue">
                                            {cfData.maxRank}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={
                                            isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                                        }
                                        transition={{ duration: 0.6, delay: 0.8 }}
                                        className="cp-stat-card card-slate"
                                    >
                                        <div className="stat-header">
                                            <Code className="stat-icon text-slate" />
                                            <span className="text-slate">Problems Solved</span>
                                        </div>
                                        <div className="stat-value text-white">
                                            <AnimatedNumber
                                                value={cfData.problemsSolved}
                                                delay={0.8}
                                                isInView={isInView}
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={
                                            isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                                        }
                                        transition={{ duration: 0.6, delay: 0.9 }}
                                        className="cp-stat-card card-slate"
                                    >
                                        <div className="stat-header">
                                            <Activity className="stat-icon text-slate" />
                                            <span className="text-slate">Contests</span>
                                        </div>
                                        <div className="stat-value text-white">
                                            <AnimatedNumber
                                                value={31}
                                                delay={0.9}
                                                isInView={isInView}
                                            />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Handle Display */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={
                                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                                    }
                                    transition={{ duration: 0.6, delay: 1 }}
                                    className="cp-handle-display"
                                >
                                    <p className="cp-handle-label">
                                        Codeforces Handle
                                    </p>
                                    <a
                                        href={`https://codeforces.com/profile/${cfData.handle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cp-handle-link"
                                    >
                                        @{cfData.handle}
                                    </a>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Code Background Pattern */}
                <div className="cp-bg-pattern">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: "100%" }}
                            animate={{ x: "-100%" }}
                            transition={{
                                duration: 20 + i * 2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="code-line"
                        >
                            {`function solve() { int n, m; cin >> n >> m; vector<int> dp(n + 1); for (int i = 0; i < n; i++) { ... } return answer; }`}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
