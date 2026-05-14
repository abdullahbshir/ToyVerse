import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('toyverse_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password}) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('toyverse_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/signup`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name, email, password}) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('toyverse_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => { localStorage.removeItem('toyverse_user'); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};