import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('atloops_admin_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('atloops_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      api.getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('atloops_admin_user', JSON.stringify(userData));
        })
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem('atloops_admin_token');
          localStorage.removeItem('atloops_admin_user');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('atloops_admin_token', res.token);
    localStorage.setItem('atloops_admin_user', JSON.stringify(res.user));
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('atloops_admin_token');
    localStorage.removeItem('atloops_admin_user');
  };

  const refreshMe = async () => {
    if (token) {
      const u = await api.getMe();
      setUser(u);
      localStorage.setItem('atloops_admin_user', JSON.stringify(u));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
