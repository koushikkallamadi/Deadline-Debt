import { createContext, useContext, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(authService.getToken());

  // Hydrate user from localStorage on page load (persists across refresh)
  const [user, setUser] = useState(() => {
    const stored = authService.getUser();
    const tok = authService.getToken();
    if (tok && stored) return stored;          // full user from localStorage
    if (tok) return { token: tok };            // fallback: token only
    return null;
  });

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUser(data.user ?? { token: data.token });
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    setToken(data.token);
    setUser(data.user ?? { token: data.token });
    return data;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}