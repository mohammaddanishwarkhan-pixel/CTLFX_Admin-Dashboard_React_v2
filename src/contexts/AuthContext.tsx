import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, verifyToken } from '@/api/auth';
import { LoginCredentials } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: number; email: string; name: string; role: string } | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: number; email: string; name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      const storedUser = localStorage.getItem('admin_user');

      if (token) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials);

    // auth.ts now returns {token, user} directly (already extracted from response.data)
    const token = response?.token;
    const user = response?.user;

    if (!token || !user) {
      throw new Error('Invalid response format from server');
    }

    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
