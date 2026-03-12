import { useState, useRef } from 'react';

export default function AddTaskModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [topics, setTopics] = useState([{ id: Date.now(), text: '' }]);
  const [loading, setLoading] = useState(false);
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const handleAddTopic = () => {
    setTopics([...topics, { id: Date.now(), text: '' }]);
  };

  const handleUpdateTopic = (id, newText) => {
    setTopics(topics.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const handleRemoveTopic = (id) => {
    if (topics.length > 1) {
      setTopics(topics.filter(t => t.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty topics
    const cleanTopics = topics.map(t => t.text.trim()).filter(t => t);

    if (!title || !subject || !dueDate || !dueTime || cleanTopics.length === 0) return;

    setLoading(true);

    // Merge date and time
    const combinedDateTime = new Date(`${dueDate}T${dueTime}`).toISOString();

    await onAdd({
      title,
      subject,
      dueDate: combinedDateTime,
      topics: cleanTopics,
      completedTopics: []
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: 16 }}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 450, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 24, fontSize: 20 }}>Add New Task</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Implement B-Tree"
              required
            />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. DSA, OS, Maths..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Due Date</label>
              <div className="date-input-wrapper">
                <input
                  ref={dateRef}
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <button
                  type="button"
                  className="date-icon-btn"
                  onClick={() => dateRef.current?.showPicker?.()}
                  aria-label="Open calendar"
                >
                  📅
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Due Time</label>
              <div className="date-input-wrapper">
                <input
                  ref={timeRef}
                  type="time"
                  value={dueTime}
                  onChange={e => setDueTime(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="date-icon-btn"
                  onClick={() => timeRef.current?.showPicker?.()}
                  aria-label="Open time picker"
                >
                  🕒
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Topics</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topics.map((t, idx) => (
                <div key={t.id} style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={t.text}
                    onChange={e => handleUpdateTopic(t.id, e.target.value)}
                    placeholder={`Topic ${idx + 1}`}
                    required
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(t.id)}
                    className="btn btn-ghost"
                    style={{ padding: '0 12px' }}
                    disabled={topics.length === 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddTopic}
              className="btn btn-ghost"
              style={{ padding: '8px 16px', marginTop: 4, width: 'max-content', fontSize: 13 }}
            >
              + Add Topic
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button type="button" className="btn btn-ghost btn-full" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-full btn-glow" disabled={loading}>
              {loading ? 'Saving...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
