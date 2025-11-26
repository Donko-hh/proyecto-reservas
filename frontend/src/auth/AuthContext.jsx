import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role');
    const u = localStorage.getItem('username');
    if (t && r) {
      setToken(t);
      setRole(r);
      setUser(u ? { username: u, role: r } : { role: r });
    }
  }, []);

  const login = ({ token, role, username }) => {
    setToken(token);
    setRole(role);
    setUser({ username, role });
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (username) localStorage.setItem('username', username);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
