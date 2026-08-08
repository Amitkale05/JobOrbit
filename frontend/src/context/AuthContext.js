import React, { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../api/authApi';

/**
 * WHY THIS FILE EXISTS:
 * Central place for "who is logged in right now" so any component can read
 * the current user/role without prop-drilling. Persists the JWT + user info
 * to localStorage so a page refresh doesn't log the user out.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('joborbit_user');
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (authResponse) => {
    localStorage.setItem('joborbit_token', authResponse.token);
    localStorage.setItem('joborbit_user', JSON.stringify(authResponse));
    setUser(authResponse);
  };

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    persist(res.data.data);
    return res.data.data;
  };

  const register = async (payload) => {
    const res = await registerUser(payload);
    persist(res.data.data);
    return res.data.data;
  };

  const logout = () => {
    localStorage.removeItem('joborbit_token');
    localStorage.removeItem('joborbit_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
