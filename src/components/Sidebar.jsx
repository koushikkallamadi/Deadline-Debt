import { useAuth } from '../context/AuthContext';
import { usePWA } from '../context/PWAContext';
import { Link } from 'react-router-dom';

export default function Sidebar({ isOpen = true, onClose, activeTab, setActiveTab, onOpenAI }) {
    const { user, logout } = useAuth();
    const { isInstallable, installApp } = usePWA();

    const navItems = [
        { id: 'dashboard', icon: '📊', label: 'Debt Overview' },
        { id: 'tasks', icon: '✅', label: 'Active Debt' },
        { id: 'achievements', icon: '🏆', label: 'Achievements' },
        { id: 'ai', icon: '🤖', label: 'AI Advisor' },
        { id: 'timer', icon: '⏱️', label: 'Study Timer' },
        { id: 'settings', icon: '⚙️', label: 'Settings' },
    ];

    return (
        <>
            {/* OVERLAY BACKDROP */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(4px)'
                    }}
                />
            )}

            <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="app-sidebar-logo">
                    <div className="app-sidebar-logo-dot"></div>
                    <span className="app-sidebar-logo-text">DEBT</span>
                </div>

                <nav className="app-sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`app-sidebar-btn ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => {
                                if (item.id === 'ai') {
                                    onOpenAI();
                                } else {
                                    setActiveTab(item.id);
                                }
                            }}
                        >
                            <span className="app-sidebar-icon">{item.icon}</span>
                            <span className="app-sidebar-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="app-sidebar-bottom">
                    {isInstallable && (
                        <button 
                            className="app-sidebar-btn" 
                            style={{ 
                                color: 'var(--accent-light)', 
                                border: '1px solid var(--accent-glow)',
                                background: 'rgba(139, 92, 246, 0.05)',
                                marginBottom: '8px'
                            }} 
                            onClick={installApp}
                        >
                            <span className="app-sidebar-icon">📥</span>
                            <span className="app-sidebar-label">Install App</span>
                        </button>
                    )}
                    <button className="app-sidebar-btn logout" onClick={logout}>
                        <span className="app-sidebar-label">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
