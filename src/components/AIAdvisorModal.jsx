import { useState, useRef, useEffect } from 'react';

export default function AIAdvisorModal({ onClose, debtContext }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm your AI Advisor. Based on your current debt profile, how can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerInput = userMsg.toLowerCase();
      let aiReply = "I am a simple AI assistant right now! Try asking me about 'highest debt', 'closest deadline', or 'how many tasks' I have.";

      const activeTasks = debtContext.filter(t => t.completedTopics.length < t.topics.length);
      const tempHighest = [...activeTasks].sort((a, b) => b.debtScore - a.debtScore)[0];

      if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
        aiReply = "Hello there! I'm here to help you manage your debt deadlines. What would you like to know about your tasks or this app?";
      }
      else if (lowerInput.includes('who are you') || lowerInput.includes('what are you')) {
        aiReply = "I am your AI Debt Advisor! I exist to help you prioritize your study tasks, track deadlines, and explain how the DeadlineDebt app works.";
      }
      // FAQ: Debt Score
      else if (lowerInput.includes('score') || (lowerInput.includes('how') && lowerInput.includes('debt'))) {
        aiReply = "Your 'Debt Score' is calculated based on pending topics. Every pending topic adds 3 points. If you are overdue, you get penalized +15 points per day. But if you plan >7 days ahead, you get a -20 point early bird bonus! The final score scales down as you complete topics.";
      }
      // FAQ: Topic Completion / Checking
      else if (lowerInput.includes('topic') && (lowerInput.includes('check') || lowerInput.includes('uncheck') || lowerInput.includes('complete'))) {
        aiReply = "You can check off topics by clicking the checkbox next to them inside the task card. Completing a topic reduces your pending count, which proportionally lowers your total Debt Score!";
      }
      // FAQ: Overdue
      else if (lowerInput.includes('overdue') || lowerInput.includes('late')) {
        aiReply = "A task becomes 'Overdue' the exact millisecond you pass its Due Date. For every full day (24 hours) it is late, the system aggressively heavily punishes your score by adding 15 base debt points.";
      }
      // FAQ: Early Bird / 7 days
      else if (lowerInput.includes('early') || lowerInput.includes('7 days') || lowerInput.includes('bonus')) {
        aiReply = "The Early Bird bonus triggers if you create a task with a Due Date MORE than 7 days in the future. It immediately subtracts 20 points from your total debt, drastically lowering your score as a reward for planning ahead.";
      }
      // FAQ: Study Timer
      else if (lowerInput.includes('timer') || lowerInput.includes('pomodoro') || lowerInput.includes('study')) {
        aiReply = "The Study Timer is located in the sidebar. It uses the Pomodoro technique (25m work / 5m break) but also has a 'Custom' button so you can set an exact countdown using hours, minutes, and seconds.";
      }
      // FAQ: Achievements / Cleared
      else if (lowerInput.includes('achievement') || lowerInput.includes('streak') || lowerInput.includes('badge') || lowerInput.includes('clear')) {
        aiReply = "You clear a task by checking off ALL of its topics. Once cleared, your 'Debt Cleared' achievement counter in the sidebar will go up. Finishing tasks also builds your Current Streak!";
      }
      // FAQ: Settings / Theme
      else if (lowerInput.includes('dark mode') || lowerInput.includes('theme') || lowerInput.includes('color') || lowerInput.includes('setting')) {
        aiReply = "You can interact with Settings through the sidebar menu to adjust app preferences. Currently, the app runs on a premium dark SaaS aesthetic by default.";
      }
      // User Data: Highest Debt
      else if (lowerInput.includes('highest') || lowerInput.includes('worst') || lowerInput.includes('priority')) {
        if (tempHighest) {
          aiReply = `Currently, the highest priority is "${tempHighest.title}" for ${tempHighest.subject}. It has a debt score of ${tempHighest.debtScore}. You should tackle that immediately!`;
        } else {
          aiReply = "You don't have any active debts with a score right now. Great job!";
        }
      }
      // User Data: Deadlines
      else if (lowerInput.includes('deadline') || lowerInput.includes('due') || lowerInput.includes('soon')) {
        const closest = [...activeTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
        if (closest) {
          const daysLeft = Math.ceil((new Date(closest.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
          aiReply = `Your closest deadline is "${closest.title}" for ${closest.subject}. It's due in ${daysLeft} days on ${new Date(closest.dueDate).toLocaleDateString()}.`;
        } else {
          aiReply = "You have no upcoming deadlines right now!";
        }
      }
      // User Data: Stats
      else if (lowerInput.includes('how many') || lowerInput.includes('total') || lowerInput.includes('count')) {
        aiReply = `You currently have ${activeTasks.length} active tasks left to complete out of ${debtContext.length} total tasks.`;
      }
      else if (lowerInput.includes('completed') || lowerInput.includes('done') || lowerInput.includes('finished')) {
        const finishedCount = debtContext.length - activeTasks.length;
        aiReply = `You have fully completed ${finishedCount} tasks so far. Keep up the momentum!`;
      }
      // FAQ: Adding / Deleting
      else if (lowerInput.includes('add') || lowerInput.includes('delete') || lowerInput.includes('remove')) {
        aiReply = "You can Add tasks using the '+ Add Task' button on the dashboard. You can delete an entire task, or just a specific topic within a task, by clicking the trash icon (🗑️) on the task card.";
      }
      else {
        aiReply = "I am a basic AI at the moment. Please ask me specifically about: score calculation, early bird bonus, overdue penalties, checking topics, study timer, achievements, highest priority task, or closest deadline!";
      }

      setMessages(prev => [...prev, { role: 'assistant', text: aiReply }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: 16 }}>
      <div className="modal ai-modal" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 500, height: 600, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated-2)' }}>
          <div>
            <h2 style={{ fontSize: 18 }}>AI Debt Advisor</h2>
            <span style={{ fontSize: 12, color: 'var(--green-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, background: 'var(--green-400)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px var(--green-400)' }}></span>
              Online
            </span>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: '16px', fontSize: 14, lineHeight: 1.5,
                background: msg.role === 'user' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: msg.role === 'assistant' ? '1px solid var(--border-default)' : 'none',
                borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 16
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: 14 }}>
                <span className="typewriter-cursor">●</span>
                <span className="typewriter-cursor" style={{ animationDelay: '0.2s' }}>●</span>
                <span className="typewriter-cursor" style={{ animationDelay: '0.4s' }}>●</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your deadlines..."
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}
            />
            <button className="btn btn-primary btn-glow" onClick={handleSend} disabled={!input.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
