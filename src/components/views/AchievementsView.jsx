import React, { useState, useEffect } from 'react';
import achievementService from '../../services/achievementService';

const RARITY_COLORS = {
    common: { border: 'rgba(148,163,184,0.3)', glow: 'rgba(148,163,184,0.12)', text: '#94a3b8', label: 'Common' },
    rare: { border: 'rgba(59,130,246,0.5)', glow: 'rgba(59,130,246,0.15)', text: '#60a5fa', label: 'Rare' },
    epic: { border: 'rgba(139,92,246,0.6)', glow: 'rgba(139,92,246,0.18)', text: '#a78bfa', label: 'Epic' },
    legendary: { border: 'rgba(245,158,11,0.7)', glow: 'rgba(245,158,11,0.2)', text: '#fbbf24', label: 'Legendary' },
};
const CATEGORY_ICONS = { tasks: '📋', streak: '🔥', xp: '✨', mastery: '📚', special: '⭐' };

/* ── Stat Card ─────────────────────────────────────────── */
function StatCard({ icon, label, value, color, sublabel }) {
    return (
        <div className="ach-stat-card" style={{ '--card-color': color }}>
            <div className="ach-stat-glow" />
            <div className="ach-stat-icon">{icon}</div>
            <div className="ach-stat-value" style={{ color }}>{value}</div>
            <div className="ach-stat-label">{label}</div>
            {sublabel && <div className="ach-stat-sub">{sublabel}</div>}
        </div>
    );
}

/* ── Level Bar ───────────────────────────────────────────── */
function LevelBar({ level, percentage, xpCurrent, xpNeeded }) {
    return (
        <div className="ach-level-bar">
            <div className="ach-level-bar-top">
                <div>
                    <div className="ach-level-label">Level Progress</div>
                    <div className="ach-level-title">
                        Level <span className="ach-level-num">{level}</span>
                    </div>
                </div>
                <div className="ach-level-xp-block">
                    <span className="ach-level-xp">{xpCurrent}</span>
                    <span className="ach-level-xp-of"> / {xpNeeded} XP</span>
                    <div className="ach-level-next">until Level {level + 1}</div>
                </div>
            </div>
            <div className="ach-progress-track">
                <div className="ach-progress-fill" style={{ width: `${Math.min(100, percentage)}%` }} />
            </div>
            <div className="ach-progress-pct">{percentage}%</div>
        </div>
    );
}

/* ── Achievement Badge Card ──────────────────────────────── */
function AchievementCard({ ach, index }) {
    const rarity = RARITY_COLORS[ach.rarity] || RARITY_COLORS.common;
    const isUnlocked = ach.unlocked;

    return (
        <div
            className={`ach-badge ${isUnlocked ? 'ach-badge--unlocked' : 'ach-badge--locked'}`}
            style={{
                '--rarity-border': rarity.border,
                '--rarity-glow': rarity.glow,
                '--rarity-text': rarity.text,
                animationDelay: `${index * 0.04}s`,
            }}
        >
            {isUnlocked && <div className="ach-badge-glow" />}

            <div className="ach-badge-rarity">{rarity.label}</div>

            <div className="ach-badge-icon" style={{ filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                {isUnlocked ? ach.icon : '🔒'}
            </div>

            <div className="ach-badge-title">{ach.title}</div>
            <div className="ach-badge-desc">{isUnlocked ? ach.description : '???'}</div>

            <div className="ach-badge-xp">✨ +{ach.xpReward} XP</div>

            {isUnlocked && ach.unlockedAt && (
                <div className="ach-badge-date">
                    {new Date(ach.unlockedAt).toLocaleDateString()}
                </div>
            )}
        </div>
    );
}

/* ── Main View ────────────────────────────────────────────── */
export default function AchievementsView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        achievementService.getAchievements()
            .then(d => { setData(d); setLoading(false); })
            .catch(e => { setError(e.response?.data?.msg || 'Failed to load achievements'); setLoading(false); });
    }, []);

    if (loading) return (
        <div className="ach-center-state">
            <div className="ach-spinner" />
            <p>Loading your achievements…</p>
        </div>
    );

    if (error) return (
        <div className="ach-center-state ach-error">
            <div style={{ fontSize: 48 }}>⚠️</div>
            <p>{error}</p>
        </div>
    );

    const { stats, achievements, levelProgress } = data;
    const categories = ['all', 'tasks', 'streak', 'xp', 'mastery', 'special'];
    const filtered = activeFilter === 'all' ? achievements : achievements.filter(a => a.category === activeFilter);
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <div className="ach-root">
            {/* ── Injected CSS ────────────────────────── */}
            <style>{`
                /* ── Root ───────── */
                .ach-root {
                    padding: 28px 24px 80px;
                    max-width: 1100px;
                    margin: 0 auto;
                    animation: achFadeUp .5s ease both;
                }
                @keyframes achFadeUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes achSpin { to { transform:rotate(360deg); } }

                /* ── Loading / Error ── */
                .ach-center-state {
                    display:flex; flex-direction:column; align-items:center;
                    justify-content:center; gap:16px; height:60vh;
                    color:var(--text-muted); font-size:15px;
                }
                .ach-error { color:var(--red-400); }
                .ach-spinner {
                    width:44px; height:44px;
                    border:3px solid rgba(139,92,246,.25);
                    border-top-color:#8b5cf6; border-radius:50%;
                    animation:achSpin .8s linear infinite;
                }

                /* ── Header ─────── */
                .ach-header { margin-bottom:28px; }
                .ach-header-tag {
                    font-size:12px; font-weight:700; letter-spacing:3px;
                    text-transform:uppercase; color:#8b5cf6; margin-bottom:6px;
                }
                .ach-header h2 {
                    font-size:clamp(24px,5vw,38px); font-weight:900;
                    letter-spacing:-.04em; margin-bottom:6px; line-height:1.1;
                }
                .ach-header-gradient {
                    background:linear-gradient(135deg,#8b5cf6,#ec4899);
                    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
                }
                .ach-header-sub { color:var(--text-muted); font-size:14px; }

                /* ── Level Bar ─── */
                .ach-level-bar {
                    background:rgba(255,255,255,.02);
                    border:1px solid rgba(139,92,246,.2);
                    border-radius:20px; padding:24px 24px 16px;
                    margin-bottom:24px;
                }
                .ach-level-bar-top {
                    display:flex; justify-content:space-between;
                    align-items:flex-start; flex-wrap:wrap; gap:12px;
                    margin-bottom:16px;
                }
                .ach-level-label {
                    font-size:12px; font-weight:700; text-transform:uppercase;
                    letter-spacing:2px; color:var(--text-muted);
                }
                .ach-level-title {
                    font-size:clamp(20px,4vw,28px); font-weight:900; margin-top:4px;
                }
                .ach-level-num {
                    background:linear-gradient(135deg,#8b5cf6,#ec4899);
                    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
                }
                .ach-level-xp-block { text-align:right; }
                .ach-level-xp { font-size:clamp(16px,3.5vw,22px); font-weight:800; color:#a78bfa; }
                .ach-level-xp-of { font-size:13px; color:var(--text-muted); }
                .ach-level-next { font-size:12px; color:var(--text-quaternary); margin-top:2px; }
                .ach-progress-track {
                    height:10px; background:rgba(255,255,255,.07);
                    border-radius:999px; overflow:hidden;
                }
                .ach-progress-fill {
                    height:100%; border-radius:999px;
                    background:linear-gradient(90deg,#8b5cf6,#ec4899);
                    box-shadow:0 0 12px rgba(139,92,246,.5);
                    transition:width 1.2s cubic-bezier(.25,1,.5,1);
                }
                .ach-progress-pct {
                    text-align:right; font-size:12px; font-weight:700;
                    color:#a78bfa; margin-top:6px;
                }

                /* ── Stat Grid ───── */
                .ach-stat-grid {
                    display:grid;
                    grid-template-columns:repeat(auto-fill, minmax(130px,1fr));
                    gap:12px; margin-bottom:28px;
                }
                .ach-stat-card {
                    background:rgba(255,255,255,.03);
                    border:1px solid color-mix(in srgb,var(--card-color) 25%, transparent);
                    border-radius:16px; padding:18px 14px;
                    text-align:center; position:relative; overflow:hidden;
                    transition:transform .25s, box-shadow .25s;
                }
                .ach-stat-card:hover {
                    transform:translateY(-3px);
                    box-shadow:0 10px 28px color-mix(in srgb,var(--card-color) 20%, transparent);
                }
                .ach-stat-glow {
                    position:absolute; top:-24px; right:-24px;
                    width:72px; height:72px; background:var(--card-color);
                    filter:blur(28px); opacity:.18; border-radius:50%;
                }
                .ach-stat-icon  { font-size:26px; margin-bottom:6px; }
                .ach-stat-value { font-size:clamp(22px,4vw,32px); font-weight:900; }
                .ach-stat-label {
                    font-size:11px; font-weight:700; color:var(--text-muted);
                    text-transform:uppercase; letter-spacing:1.2px; margin-top:2px;
                }
                .ach-stat-sub   { font-size:11px; color:var(--text-quaternary); margin-top:2px; }

                /* ── Category Filter ─ */
                .ach-filters {
                    display:flex; gap:8px; flex-wrap:wrap; margin-bottom:24px;
                }
                .ach-filter-btn {
                    padding:7px 14px; border-radius:999px; border:1px solid;
                    font-size:12px; font-weight:700; cursor:pointer;
                    transition:all .2s; white-space:nowrap;
                    text-transform:capitalize;
                }
                .ach-filter-btn--active {
                    border-color:#8b5cf6; background:rgba(139,92,246,.18);
                    color:#c4b5fd;
                }
                .ach-filter-btn--inactive {
                    border-color:rgba(255,255,255,.08);
                    background:rgba(255,255,255,.02);
                    color:var(--text-muted);
                }

                /* ── Badge Grid ───── */
                .ach-badge-grid {
                    display:grid;
                    grid-template-columns:repeat(auto-fill, minmax(150px,1fr));
                    gap:12px;
                }
                .ach-badge {
                    border:1px solid var(--rarity-border);
                    border-radius:16px; padding:18px 14px;
                    text-align:center; position:relative; overflow:hidden;
                    transition:transform .25s, box-shadow .25s;
                    animation:achFadeUp .5s ease both;
                }
                .ach-badge--unlocked:hover {
                    transform:translateY(-5px) scale(1.03);
                    box-shadow:0 14px 36px var(--rarity-glow);
                }
                .ach-badge--locked { opacity:.4; cursor:not-allowed; }
                .ach-badge-glow {
                    position:absolute; top:-20px; right:-20px;
                    width:64px; height:64px; background:var(--rarity-text);
                    filter:blur(24px); opacity:.25; border-radius:50%;
                }
                .ach-badge-rarity {
                    position:absolute; top:8px; right:8px;
                    font-size:9px; font-weight:800; text-transform:uppercase;
                    letter-spacing:.8px; color:var(--rarity-text);
                    background:var(--rarity-glow);
                    border:1px solid var(--rarity-border);
                    padding:2px 7px; border-radius:999px;
                }
                .ach-badge-icon   { font-size:38px; margin:6px 0 10px; }
                .ach-badge-title  { font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
                .ach-badge-desc   { font-size:11px; color:var(--text-quaternary); line-height:1.4; margin-bottom:8px; }
                .ach-badge-xp {
                    display:inline-flex; align-items:center; gap:3px;
                    background:rgba(139,92,246,.1);
                    border:1px solid rgba(139,92,246,.2);
                    border-radius:999px; padding:2px 8px;
                    font-size:11px; font-weight:700; color:#a78bfa;
                }
                .ach-badge-date {
                    font-size:9px; color:var(--text-quaternary); margin-top:6px;
                }
                .ach-empty {
                    text-align:center; color:var(--text-muted);
                    padding:60px 0; font-size:15px;
                }

                /* ── Mobile Overrides ─ */
                @media (max-width: 480px) {
                    .ach-root { padding:20px 16px 80px; }
                    .ach-stat-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap:10px;
                    }
                    .ach-badge-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap:10px;
                    }
                    .ach-level-bar { padding:18px 16px 12px; }
                    .ach-filters { gap:6px; }
                    .ach-filter-btn { padding:6px 11px; font-size:11px; }
                }
            `}</style>

            {/* Header */}
            <div className="ach-header">
                <div className="ach-header-tag">GAMIFICATION</div>
                <h2>
                    Your <span className="ach-header-gradient">Achievements</span>
                </h2>
                <p className="ach-header-sub">
                    {unlockedCount} of {achievements.length} unlocked · Keep pushing!
                </p>
            </div>

            {/* Level Bar */}
            <LevelBar
                level={stats.level}
                percentage={levelProgress.percentage}
                xpCurrent={levelProgress.current}
                xpNeeded={levelProgress.needed}
            />

            {/* Stat Cards */}
            <div className="ach-stat-grid">
                <StatCard icon="⚡" label="Total XP" value={stats.xp.toLocaleString()} color="#8b5cf6" />
                <StatCard icon="🔥" label="Streak" value={`${stats.streak}d`} color="#f59e0b" sublabel={`Best: ${stats.longestStreak}d`} />
                <StatCard icon="✅" label="Tasks" value={stats.tasksCompleted} color="#10b981" />
                <StatCard icon="📚" label="Topics" value={stats.topicsCompleted} color="#3b82f6" />
                <StatCard icon="🏆" label="Badges" value={`${unlockedCount}/${achievements.length}`} color="#ec4899" />
            </div>

            {/* Category Filter */}
            <div className="ach-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`ach-filter-btn ${activeFilter === cat ? 'ach-filter-btn--active' : 'ach-filter-btn--inactive'}`}
                        onClick={() => setActiveFilter(cat)}
                    >
                        {cat === 'all' ? '🎯 All' : `${CATEGORY_ICONS[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
                    </button>
                ))}
            </div>

            {/* Badge Grid */}
            <div className="ach-badge-grid">
                {filtered.map((ach, i) => (
                    <AchievementCard key={ach.key} ach={ach} index={i} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="ach-empty">
                    <div style={{ fontSize: 42, marginBottom: 12 }}>🔍</div>
                    No achievements in this category yet.
                </div>
            )}
        </div>
    );
}
