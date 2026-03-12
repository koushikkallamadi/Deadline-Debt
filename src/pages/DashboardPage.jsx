import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import StatChip from '../components/StatChip';
import AddTaskModal from '../components/AddTaskModal';
import AIAdvisorModal from '../components/AIAdvisorModal';
import { calcDebt } from '../utils/calcDebt';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

// Views
import ActiveDebtView from '../components/views/ActiveDebtView';
import AchievementsView from '../components/views/AchievementsView';
import StudyTimerView from '../components/views/StudyTimerView';
import SettingsView from '../components/views/SettingsView';

import { useTasks } from '../context/TaskContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    tasks, mappedTasks, fetchTasks, loading, error,
    handleAddTask, handleToggleTopic, handleDelete,
    handleEditTopic, handleDeleteTopic, handleAddTopic
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const [filter, setFilter] = useState('ALL');
  const [sort, setSort] = useState('debt');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const filteredTasks = useMemo(() => {
    let list = filter === 'ALL' ? mappedTasks : mappedTasks.filter(t => t.subject === filter);
    if (sort === 'debt') list.sort((a, b) => b.debtScore - a.debtScore);
    if (sort === 'due') {
      list.sort((a, b) => {
        if (a.debtScore === 0) return 1;
        if (b.debtScore === 0) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }
    return list;
  }, [mappedTasks, filter, sort]);

  const totalDebt = mappedTasks.reduce((sum, t) => sum + t.debtScore, 0);
  const overdueTasks = mappedTasks.filter(t => new Date(t.dueDate) < new Date() && t.debtScore > 0).length;
  const clearedTasks = mappedTasks.filter(t => t.topics.length > 0 && t.completedTopics.length === t.topics.length).length;

  const subjectStats = mappedTasks.reduce((acc, task) => {
    if (!acc[task.subject]) acc[task.subject] = { sum: 0 };
    acc[task.subject].sum += task.debtScore;
    return acc;
  }, {});

  const subjectList = Object.entries(subjectStats)
    .map(([name, data]) => ({ name, score: data.sum }))
    .sort((a, b) => b.score - a.score);

  const dynamicSubjects = useMemo(() => {
    const subs = Array.from(new Set(tasks.map(t => t.subject)));
    return ['ALL', ...subs].slice(0, 7);
  }, [tasks]);

  const topTasks = [...mappedTasks].sort((a, b) => b.debtScore - a.debtScore);
  const priorityTask = topTasks.find(t => t.debtScore > 0);
  const nextTopic = priorityTask?.topics.find(t => !priorityTask.completedTopics.includes(t));

  const debtColor = totalDebt === 0 ? '#10b981' : totalDebt < 70 ? '#fbbf24' : '#fb7185';
  const debtBg = totalDebt === 0 ? 'rgba(16,185,129,0.2)' : totalDebt < 70 ? 'rgba(245,158,11,0.2)' : 'rgba(244,63,94,0.2)';
  const debtStatus = totalDebt === 0 ? 'ALL CLEAR' : totalDebt < 30 ? 'LOW' : totalDebt < 70 ? 'MODERATE' : 'HIGH DEBT';

  return (
    <div className="app-container">
      {/* Sidebar scoped CSS */}
      <style>{`
        /* ─── Mobile-first Dashboard Layout ────────────── */

        /* Overlay for sidebar on mobile */
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,.6);
          z-index: 999;
          backdrop-filter: blur(2px);
        }
        .sidebar-overlay.active { display: block; }

        /* ── Debt Score Card ── */
        .db-score-card {
          background: rgba(139,92,246,.08);
          border: 1px solid rgba(139,92,246,.35);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          margin: 0 auto 40px;
          max-width: 460px;
          width: 100%;
        }
        .db-score-label {
          font-size: 16px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 2px; color: #c4b5fd; margin-bottom: 8px;
        }
        .db-score-number {
          font-size: 80px; font-weight: 900; line-height: 1; margin-bottom: 16px;
        }
        .db-score-badge {
          display: inline-block;
          padding: 6px 16px; border-radius: 999px;
          font-size: 13px; font-weight: 800; letter-spacing: 1.5px;
          border: 1px solid;
        }

        /* Mobile: score card goes full width with compact sizing */
        @media (max-width: 1024px) {
          .db-score-card {
            max-width: 100%;
            padding: 28px 24px;
            border-radius: 20px;
            margin: 0 0 16px 0;
          }
          .db-score-number { font-size: clamp(52px, 14vw, 72px); }
          .db-score-label  { font-size: 12px; letter-spacing: 2px; }
        }

        /* ── Stat Chips Row ── */
        .db-stat-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px; margin-bottom: 24px;
        }
        .db-stat-item {
          background: rgba(255,255,255,.02);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 14px; padding: 14px 10px;
          text-align: center;
        }
        .db-stat-val  { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
        .db-stat-lbl  { font-size: 10px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.2px; }

        /* ── Priority Banner ── */
        .db-priority-banner {
          background: linear-gradient(135deg, rgba(139,92,246,.15), rgba(236,72,153,.1));
          border: 1px solid rgba(139,92,246,.3);
          border-radius: 16px; padding: 18px 20px;
          margin-bottom: 24px; position: relative; overflow: hidden;
        }
        .db-priority-banner::before {
          content: ''; position: absolute; top:0; left:0; right:0; height:3px;
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
        }
        .db-priority-tag {
          font-size: 10px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 2px; color: #c4b5fd; margin-bottom: 6px;
          display: flex; align-items: center; gap: 5px;
        }
        .db-priority-title {
          font-size: 16px; font-weight: 700; color: #fff;
          margin-bottom: 6px; line-height: 1.3;
        }
        .db-priority-next {
          font-size: 12px; color: var(--text-muted);
        }
        .db-priority-next strong {
          color: #a78bfa; font-weight: 700;
        }

        /* ── Filter Bar ── */
        .db-filter-bar {
          display: flex; flex-direction: column; gap: 12px;
          margin-bottom: 20px;
        }
        .db-filter-bar .subject-chips { flex-wrap: wrap; }
        .db-filter-bar .custom-select { width: 100%; }

        /* ── Panel header ── */
        .db-panel-header {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          margin-bottom: 20px;
        }
        .db-panel-header h2 {
          font-size: clamp(20px, 4vw, 28px); font-weight: 800;
          letter-spacing: -.03em;
        }

        /* ── Subject Breakdown (shown inline on mobile) ── */
        .db-subject-sec { margin-bottom: 24px; }
        .db-subject-sec h3 {
          font-size: 13px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 2px; color: var(--text-muted); margin-bottom: 12px;
        }
        .db-subject-row {
          display: flex; justify-content: space-between;
          padding: 10px 0; font-size: 14px;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        .db-subject-row:last-child { border-bottom: none; }

        /* ── Desktop: Side panels ── */
        @media (min-width: 1025px) {
          .db-mobile-only { display: none !important; }
          .db-desktop-layout {
            display: flex; gap: 24px;
            padding: 24px 32px;
            max-width: 1600px; margin: 0 auto;
          }
          .db-left-col {
            width: 220px; flex-shrink: 0;
            background: var(--bg-elevated);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-xl);
            backdrop-filter: blur(20px);
            padding: 20px 16px;
            display: flex; flex-direction: column;
            overflow-y: auto; scrollbar-width: none;
          }
          .db-middle-col {
            flex: 1;
            background: rgba(10,10,26,.5);
            border: 1px solid rgba(139,92,246,.15);
            border-radius: var(--radius-xl);
            padding: 24px;
            overflow-y: auto; scrollbar-width: none;
          }
          .db-right-col {
            width: 240px; flex-shrink: 0;
            background: var(--bg-elevated);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-xl);
            padding: 16px 12px;
            display: flex; flex-direction: column; gap: 12px;
            overflow-y: auto; scrollbar-width: none;
          }
          .db-left-col::-webkit-scrollbar,
          .db-middle-col::-webkit-scrollbar,
          .db-right-col::-webkit-scrollbar { display: none; }
          .db-mobile-layout { display: none !important; }
        }

        /* ── Mobile: Single column ── */
        @media (max-width: 1024px) {
          .db-desktop-layout { display: none !important; }
          .db-mobile-layout {
            padding: 16px 16px 100px;
            display: flex; flex-direction: column; gap: 0;
          }
          .db-score-number { font-size: clamp(52px, 14vw, 72px); }
        }
      `}</style>

      {/* Sidebar + overlay */}
      {sidebarOpen && <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)} />}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAI={() => setShowAIModal(true)}
      />

      <div className="main-content-wrapper" style={{ flex: 1, overflowX: 'hidden' }}>
        <div className="dashboard-page">
          <Navbar variant="dashboard" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* ─── NON-DASHBOARD VIEWS ─── */}
          {activeTab === 'tasks' && (
            <div className="animate-fade-up">
              <ActiveDebtView
                tasks={filteredTasks}
                onToggleTopic={handleToggleTopic}
                onDelete={handleDelete}
                onEditTopic={handleEditTopic}
                onDeleteTopic={handleDeleteTopic}
                onAddTopic={handleAddTopic}
                setShowAddModal={setShowAddModal}
              />
            </div>
          )}
          {activeTab === 'achievements' && (
            <div className="animate-fade-up"><AchievementsView tasks={mappedTasks} /></div>
          )}
          {activeTab === 'timer' && (
            <div className="animate-fade-up"><StudyTimerView /></div>
          )}
          {activeTab === 'settings' && (
            <div className="animate-fade-up"><SettingsView /></div>
          )}

          {/* ─── DASHBOARD ─── */}
          {activeTab === 'dashboard' && (
            <>
              {/* ═══ DESKTOP LAYOUT (3 columns) ═══ */}
              <div className="db-desktop-layout animate-fade-up">
                {/* Left */}
                <aside className="db-left-col">
                  <div className="stat-chips">
                    <StatChip label="Tasks" value={tasks.length} />
                    <StatChip label="Overdue" value={overdueTasks} color="var(--red-400)" />
                    <StatChip label="Cleared" value={clearedTasks} color="var(--green-400)" />
                  </div>
                  <div style={{ marginTop: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>
                      Subject Breakdown
                    </h3>
                    <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
                      {subjectList.length === 0
                        ? <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No data</p>
                        : subjectList.map(s => (
                          <div key={s.name} className="db-subject-row">
                            <span>{s.name}</span>
                            <strong style={{ color: s.score > 50 ? 'var(--red-400)' : 'inherit' }}>{s.score}</strong>
                          </div>
                        ))}
                    </div>
                  </div>
                </aside>

                {/* Middle */}
                <main className="db-middle-col">
                  {/* Debt Score */}
                  <div className="db-score-card">
                    <div className="db-score-label">Total Outstanding Debt</div>
                    <div className="db-score-number" style={{
                      color: totalDebt > 50 ? '#f43f5e' : '#10b981',
                      textShadow: `0 0 20px ${totalDebt > 50 ? 'rgba(244,63,94,.4)' : 'rgba(16,185,129,.4)'}`
                    }}>{totalDebt}</div>
                    <span className="db-score-badge" style={{ background: debtBg, color: debtColor, borderColor: debtColor }}>{debtStatus}</span>
                  </div>

                  {/* Panel header */}
                  <div className="db-panel-header">
                    <h2>Active Debt</h2>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Task</button>
                  </div>

                  {/* Filters */}
                  <div className="db-filter-bar">
                    <div className="subject-chips">
                      {dynamicSubjects.map(sub => (
                        <button key={sub} className={`chip ${filter === sub ? 'chip-active' : ''}`} onClick={() => setFilter(sub)}>{sub}</button>
                      ))}
                    </div>
                    <select value={sort} onChange={e => setSort(e.target.value)} className="custom-select">
                      <option value="debt">Highest Debt First</option>
                      <option value="due">Due Soonest</option>
                    </select>
                  </div>

                  {/* Task List */}
                  <div className="task-list" style={{ paddingBottom: 60 }}>
                    {filteredTasks.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <p>No tasks yet. Add your first task to start tracking.</p>
                      </div>
                    ) : (
                      filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task}
                          onToggleTopic={handleToggleTopic} onDelete={handleDelete}
                          onEditTopic={handleEditTopic} onDeleteTopic={handleDeleteTopic}
                          onAddTopic={handleAddTopic}
                        />
                      ))
                    )}
                  </div>
                </main>

                {/* Right */}
                <aside className="db-right-col">
                  {priorityTask ? (
                    <div className="priority-card-highlighted">
                      <h4 className="priority-card-header">Priority Action</h4>
                      <p className="priority-card-subtitle">Finish this to lower your debt.</p>
                      <h3 className="priority-task-title">{priorityTask.title}</h3>
                      <div style={{ fontSize: 11, color: '#c4b5fd', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>🕒</span>
                        <span>Due {new Date(priorityTask.dueDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} today</span>
                      </div>
                      {nextTopic && (
                        <div className="priority-next-topic">
                          <span>Next topic:</span>
                          <strong>{nextTopic}</strong>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="priority-card-empty">
                      <h4>No Priority Action</h4>
                      <p>All clear! You have no tasks left.</p>
                    </div>
                  )}
                </aside>
              </div>

              {/* ═══ MOBILE LAYOUT (single column) ═══ */}
              <div className="db-mobile-layout animate-fade-up">

                {/* 1. Debt Score Card */}
                <div className="db-score-card" style={{ marginBottom: 16 }}>
                  <div className="db-score-label">Total Outstanding Debt</div>
                  <div className="db-score-number" style={{
                    color: totalDebt > 50 ? '#f43f5e' : '#10b981',
                    textShadow: `0 0 20px ${totalDebt > 50 ? 'rgba(244,63,94,.4)' : 'rgba(16,185,129,.4)'}`
                  }}>{totalDebt}</div>
                  <span className="db-score-badge" style={{ background: debtBg, color: debtColor, borderColor: debtColor }}>{debtStatus}</span>
                </div>

                {/* 2. Quick Stats Row */}
                <div className="db-stat-row" style={{ marginBottom: 16 }}>
                  <div className="db-stat-item">
                    <div className="db-stat-val">{tasks.length}</div>
                    <div className="db-stat-lbl">Tasks</div>
                  </div>
                  <div className="db-stat-item">
                    <div className="db-stat-val" style={{ color: 'var(--red-400)' }}>{overdueTasks}</div>
                    <div className="db-stat-lbl">Overdue</div>
                  </div>
                  <div className="db-stat-item">
                    <div className="db-stat-val" style={{ color: 'var(--green-400)' }}>{clearedTasks}</div>
                    <div className="db-stat-lbl">Cleared</div>
                  </div>
                </div>

                {/* 3. Priority Banner (if exists) */}
                {priorityTask && (
                  <div className="db-priority-banner" style={{ marginBottom: 16 }}>
                    <div className="db-priority-tag">⚡ Priority Action</div>
                    <div className="db-priority-title">{priorityTask.title}</div>
                    {nextTopic && (
                      <div className="db-priority-next">
                        Next: <strong>{nextTopic}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Task List Header */}
                <div className="db-panel-header" style={{ marginBottom: 16 }}>
                  <h2>Active Debt</h2>
                  <button className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => setShowAddModal(true)}>
                    + Add Task
                  </button>
                </div>

                {/* 5. Filters */}
                <div style={{ marginBottom: 16 }}>
                  <div className="subject-chips" style={{ marginBottom: 10 }}>
                    {dynamicSubjects.map(sub => (
                      <button key={sub} className={`chip ${filter === sub ? 'chip-active' : ''}`} onClick={() => setFilter(sub)}>{sub}</button>
                    ))}
                  </div>
                  <select value={sort} onChange={e => setSort(e.target.value)} className="custom-select" style={{ width: '100%' }}>
                    <option value="debt">Highest Debt First</option>
                    <option value="due">Due Soonest</option>
                  </select>
                </div>

                {/* 6. Task Cards */}
                <div className="task-list" style={{ marginBottom: 24 }}>
                  {filteredTasks.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">📭</div>
                      <p>No tasks yet. Add your first task to start tracking.</p>
                    </div>
                  ) : (
                    filteredTasks.map(task => (
                      <TaskCard key={task.id} task={task}
                        onToggleTopic={handleToggleTopic} onDelete={handleDelete}
                        onEditTopic={handleEditTopic} onDeleteTopic={handleDeleteTopic}
                        onAddTopic={handleAddTopic}
                      />
                    ))
                  )}
                </div>

                {/* 7. Subject Breakdown (collapsed at bottom) */}
                {subjectList.length > 0 && (
                  <div className="db-subject-sec" style={{
                    background: 'rgba(255,255,255,.02)',
                    border: '1px solid rgba(255,255,255,.06)',
                    borderRadius: 16, padding: 16
                  }}>
                    <h3>Subject Breakdown</h3>
                    {subjectList.map(s => (
                      <div key={s.name} className="db-subject-row">
                        <span>{s.name}</span>
                        <strong style={{ color: s.score > 50 ? 'var(--red-400)' : 'inherit' }}>{s.score}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Floating AI Button */}
          <button className="btn btn-primary btn-glow ai-advisor-btn" onClick={() => setShowAIModal(true)}>
            <span className="ai-btn-icon">🤖</span>
            <span className="ai-btn-label">Ask AI Advisor</span>
          </button>
        </div>
      </div>

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} onAdd={handleAddTask} />}
      {showAIModal && <AIAdvisorModal onClose={() => setShowAIModal(false)} debtContext={mappedTasks} />}
    </div>
  );
}
