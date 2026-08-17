import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  setAuthTokens,
  clearAuth,
  getAccessToken,
  getStoredUser,
  type User,
  type LoginPayload,
  type RegisterPayload,
} from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<User>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser && getAccessToken()) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const onExpired = () => {
      clearAuth();
      setUser(null);
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    if (!getAccessToken()) return null;
    try {
      const response = await getCurrentUser();
      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch {}
    return null;
  }, []);

  const login = async (data: LoginPayload): Promise<User> => {
    const response = await apiLogin(data);
    setAuthTokens(response.data.data);
    setUser(response.data.data.user);
    return response.data.data.user;
  };

  const register = async (data: RegisterPayload) => {
    const response = await apiRegister(data);
    if (response.data.success) {
      setAuthTokens(response.data.data);
      setUser(response.data.data.user);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
    } finally {
      clearAuth();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
