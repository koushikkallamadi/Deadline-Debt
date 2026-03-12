import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePWA } from '../context/PWAContext';

export default function Navbar({ variant = 'landing', onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { isInstallable, installApp } = usePWA();

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {variant === 'dashboard' && (
          <button
            onClick={onToggleSidebar}
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ☰
          </button>
        )}
        <Link to="/" className="navbar-logo">Deadline Debt</Link>
      </div>
      <div className="navbar-actions">
        {isInstallable && (
          <button 
            onClick={installApp} 
            className="btn btn-ghost" 
            style={{ 
              padding: '6px 12px', 
              fontSize: '12px', 
              borderRadius: '99px',
              border: '1px solid var(--accent-main)',
              background: 'rgba(139, 92, 246, 0.1)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}
          >
            <span style={{ fontSize: '14px' }}>📥</span>
            <span style={{ fontWeight: 700 }}>App</span>
          </button>
        )}
        {variant === 'landing' && (
          <>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </>
        )}
        {variant === 'dashboard' && (
          <>
            <span className="navbar-user">{user?.name || 'User'}</span>
            <button onClick={logout} className="btn btn-ghost">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
