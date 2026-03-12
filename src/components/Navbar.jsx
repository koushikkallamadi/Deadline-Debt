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
        <Link to="/" className="navbar-logo">Debt Tracker</Link>
      </div>
      <div className="navbar-actions">
        {isInstallable && (
          <button 
            onClick={installApp} 
            className="btn btn-primary btn-glow"
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            📥 Download App
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
