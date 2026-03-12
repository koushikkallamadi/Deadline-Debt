import React from 'react';
import TaskCard from '../TaskCard';

export default function ActiveDebtView({ tasks, onToggleTopic, onDelete, onEditTopic, onDeleteTopic, onAddTopic, setShowAddModal }) {
    const activeTasks = tasks.filter(task => task.completedTopics.length < task.topics.length);

    const totalActiveDebt = activeTasks.reduce((a, t) => a + (t.debtScore || 0), 0);
    const totalTopicsInActive = activeTasks.reduce((a, t) => a + t.topics.length, 0);
    const completedTopicsInActive = activeTasks.reduce((a, t) => a + t.completedTopics.length, 0);
    const topicsLeft = totalTopicsInActive - completedTopicsInActive;
    const progressPercent = totalTopicsInActive > 0
        ? Math.round((completedTopicsInActive / totalTopicsInActive) * 100)
        : 0;

    const debtColor = totalActiveDebt > 50 ? '#f43f5e' : totalActiveDebt > 20 ? '#f59e0b' : '#10b981';
    const debtGlow = totalActiveDebt > 50
        ? 'rgba(244,63,94,0.35)' : totalActiveDebt > 20
            ? 'rgba(245,158,11,0.35)' : 'rgba(16,185,129,0.35)';

    return (
        <div className="adv-root animate-fade-up">
            <style>{`
                /* ── Root ─── */
                .adv-root { padding: 24px 24px 80px; max-width: 900px; margin: 0 auto; }

                /* ── Header ─── */
                .adv-header {
                    display: flex; align-items: center;
                    justify-content: space-between; flex-wrap: wrap;
                    gap: 12px; margin-bottom: 24px;
                }
                .adv-header h2 {
                    font-size: clamp(22px, 5vw, 32px);
                    font-weight: 900; letter-spacing: -.04em;
                }

                /* ── Stat Grid ─── */
                .adv-stat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 16px; margin-bottom: 32px;
                }
                .adv-stat-card {
                    border-radius: 18px; padding: 20px 20px 16px;
                    display: flex; flex-direction: column;
                    gap: 6px; transition: transform .25s, box-shadow .25s;
                }
                .adv-stat-card:hover { transform: translateY(-3px); }
                .adv-stat-card-label {
                    font-size: 11px; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 1.5px; color: var(--text-muted);
                    display: flex; align-items: center; gap: 6px;
                }
                .adv-stat-card-value {
                    font-size: clamp(28px, 5vw, 40px);
                    font-weight: 900; line-height: 1;
                }

                /* ── Progress card ─── */
                .adv-prog-card {
                    background: rgba(255,255,255,.02);
                    border: 1px dashed rgba(255,255,255,.1);
                    border-radius: 18px; padding: 20px 20px 16px;
                }
                .adv-prog-head {
                    display: flex; justify-content: space-between;
                    align-items: center; margin-bottom: 12px;
                }
                .adv-prog-label {
                    font-size: 11px; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 1.5px; color: var(--text-muted);
                }
                .adv-prog-pct { font-size: 16px; font-weight: 800; color: #fff; }
                .adv-prog-track {
                    height: 10px; background: rgba(0,0,0,.5);
                    border-radius: 999px; overflow: hidden;
                }
                .adv-prog-fill {
                    height: 100%; border-radius: 999px;
                    background: linear-gradient(90deg, #8b5cf6, #38bdf8);
                    box-shadow: 0 0 10px rgba(56,189,248,.4);
                    transition: width .8s ease;
                }

                /* ── Mobile ─── */
                @media (max-width: 480px) {
                    .adv-root { padding: 20px 16px 80px; }
                    .adv-stat-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                    }
                    .adv-stat-card     { padding: 16px 14px 12px; }
                    .adv-prog-card     { padding: 14px 14px 12px; }
                    .adv-stat-card-label { font-size: 10px; }
                }
            `}</style>

            {/* Header */}
            <div className="adv-header">
                <h2>Active Debt</h2>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    + Add Task
                </button>
            </div>

            {/* Stats */}
            {activeTasks.length > 0 && (
                <div className="adv-stat-grid">
                    {/* Debt Score */}
                    <div
                        className="adv-stat-card"
                        style={{
                            background: 'linear-gradient(145deg, rgba(30,20,50,.45), rgba(15,10,25,.85))',
                            border: `1px solid ${debtColor}44`,
                            boxShadow: `0 8px 28px ${debtGlow}`,
                        }}
                    >
                        <div className="adv-stat-card-label"><span>🔥</span> Total Debt Load</div>
                        <div className="adv-stat-card-value" style={{ color: debtColor, textShadow: `0 0 18px ${debtGlow}` }}>
                            {totalActiveDebt}
                        </div>
                    </div>

                    {/* Topics Left */}
                    <div
                        className="adv-stat-card"
                        style={{
                            background: 'linear-gradient(145deg, rgba(20,30,50,.45), rgba(10,15,25,.85))',
                            border: '1px solid rgba(56,189,248,.3)',
                            boxShadow: '0 8px 28px rgba(56,189,248,.15)',
                        }}
                    >
                        <div className="adv-stat-card-label"><span>📚</span> Topics Remaining</div>
                        <div className="adv-stat-card-value" style={{ color: '#38bdf8', textShadow: '0 0 18px rgba(56,189,248,.4)' }}>
                            {topicsLeft}
                            <span style={{ fontSize: '46%', color: 'var(--text-muted)', fontWeight: 600 }}>
                                &nbsp;/ {totalTopicsInActive}
                            </span>
                        </div>
                    </div>

                    {/* Progress – spans full width on mobile */}
                    <div className="adv-prog-card" style={{ gridColumn: 'span 2 / span 2' }}>
                        <div className="adv-prog-head">
                            <span className="adv-prog-label">Active Progress</span>
                            <span className="adv-prog-pct">{progressPercent}%</span>
                        </div>
                        <div className="adv-prog-track">
                            <div className="adv-prog-fill" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Task List */}
            <div className="task-list" style={{ paddingBottom: 60 }}>
                {activeTasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎉</div>
                        <p>All clear! You have no active debts currently.</p>
                    </div>
                ) : (
                    activeTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggleTopic={onToggleTopic}
                            onDelete={onDelete}
                            onEditTopic={onEditTopic}
                            onDeleteTopic={onDeleteTopic}
                            onAddTopic={onAddTopic}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
