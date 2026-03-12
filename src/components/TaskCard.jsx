import { useState } from 'react';
import { calcDebt } from '../utils/calcDebt';

export default function TaskCard({ task, onToggleTopic, onDelete, onEditTopic, onDeleteTopic, onAddTopic }) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editText, setEditText] = useState('');
  const [addingTopic, setAddingTopic] = useState(false);
  const [newTopicText, setNewTopicText] = useState('');
  const debt = calcDebt(task);
  const now = Date.now();
  const due = new Date(task.dueDate).getTime();
  const daysOverdue = now > due ? Math.floor((now - due) / 86400000) : 0;
  const completedCount = task.completedTopics.length;
  const totalTopics = task.topics.length;
  const progress = totalTopics ? (completedCount / totalTopics) * 100 : 0;

  const getDebtLevel = (d) => {
    if (d === 0) return { label: 'CLEAR', className: 'debt-clear' };
    if (d < 30) return { label: 'LOW', className: 'debt-low' };
    if (d < 70) return { label: 'MODERATE', className: 'debt-moderate' };
    if (d < 120) return { label: 'HIGH', className: 'debt-high' };
    return { label: 'CRITICAL', className: 'debt-critical' };
  };

  const level = getDebtLevel(debt);

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    const time = d.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
    return { date, time };
  };

  const { date: formattedDate, time: formattedTime } = formatDateTime(task.dueDate);

  const startEdit = (topic) => {
    setEditingTopic(topic);
    setEditText(topic);
  };

  const saveEdit = (oldTopic) => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== oldTopic) {
      onEditTopic(task.id, oldTopic, trimmed);
    }
    setEditingTopic(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingTopic(null);
    setEditText('');
  };

  const handleKeyDown = (e, oldTopic) => {
    if (e.key === 'Enter') saveEdit(oldTopic);
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div className="task-card">
      <div className="task-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="task-card-left">
          <div className="task-card-info">
            <h3 className="task-card-title">{task.title}</h3>
            <div className="task-card-meta">
              <span className="subject-tag">{task.subject}</span>
              <span className="task-date">📅 {formattedDate}</span>
              <span className="task-time" style={{ color: '#a78bfa' }}>🕒 {formattedTime}</span>
              {daysOverdue > 0 && (
                <span className="overdue-text">{daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue</span>
              )}
            </div>
          </div>
        </div>
        <div className="task-card-right">
          <div className="topic-progress-info">
            <span className="topic-count">{completedCount}/{totalTopics} topics done</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button
            className="btn-icon expand-btn"
            aria-label="Expand task"
          >
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="task-card-body">
          <div className="topic-checklist">
            {task.topics.map((topic, i) => {
              const isCompleted = task.completedTopics.includes(topic);
              const isEditing = editingTopic === topic;

              return (
                <div key={i} className="topic-item">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleTopic(task.id, topic)}
                  />
                  {isEditing ? (
                    <div className="topic-edit-row">
                      <input
                        type="text"
                        className="topic-edit-input"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onKeyDown={e => handleKeyDown(e, topic)}
                        autoFocus
                      />
                      <button className="topic-action-btn save" onClick={() => saveEdit(topic)} title="Save">✓</button>
                      <button className="topic-action-btn cancel" onClick={cancelEdit} title="Cancel">✕</button>
                    </div>
                  ) : (
                    <>
                      <span className={isCompleted ? 'topic-done' : ''}>{topic}</span>
                      <div className="topic-actions">
                        <button className="topic-action-btn edit" onClick={() => startEdit(topic)} title="Edit topic">✏️</button>
                        {task.topics.length > 1 && (
                          <button className="topic-action-btn delete" onClick={() => onDeleteTopic(task.id, topic)} title="Delete topic">🗑️</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {addingTopic && (
            <div className="add-topic-row">
              <input
                type="text"
                className="topic-edit-input"
                value={newTopicText}
                onChange={e => setNewTopicText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newTopicText.trim()) {
                    onAddTopic(task.id, newTopicText.trim());
                    setNewTopicText('');
                    setAddingTopic(false);
                  }
                  if (e.key === 'Escape') {
                    setAddingTopic(false);
                    setNewTopicText('');
                  }
                }}
                placeholder="New topic name..."
                autoFocus
              />
              <button
                className="topic-action-btn save"
                onClick={() => {
                  if (newTopicText.trim()) {
                    onAddTopic(task.id, newTopicText.trim());
                    setNewTopicText('');
                    setAddingTopic(false);
                  }
                }}
                title="Add"
              >✓</button>
              <button
                className="topic-action-btn cancel"
                onClick={() => { setAddingTopic(false); setNewTopicText(''); }}
                title="Cancel"
              >✕</button>
            </div>
          )}
          <div className="task-card-actions">
            {!showConfirm ? (
              <button
                className="btn btn-danger-outline"
                onClick={() => setShowConfirm(true)}
              >
                🗑 Delete
              </button>
            ) : (
              <div className="confirm-delete">
                <span>Delete this task?</span>
                <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
                  Yes, delete
                </button>
                <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
              </div>
            )}
            {!addingTopic && (
              <button
                className="btn-add-topic"
                onClick={() => setAddingTopic(true)}
              >
                + Add Topic
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
