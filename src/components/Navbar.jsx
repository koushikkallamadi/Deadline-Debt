import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ variant = 'landing', onToggleSidebar }) {
  const { user, logout } = useAuth();

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
        <Link to="/" className="navbar-logo">DEADLINE DEBT</Link>
      </div>
      <div className="navbar-actions">
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
