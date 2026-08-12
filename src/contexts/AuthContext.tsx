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
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
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

  // Token habis / refresh gagal → bersihkan state agar UI kembali ke "belum login".
  useEffect(() => {
    const onExpired = () => {
      clearAuth();
      setUser(null);
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  // Refresh user from API
  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) return;
    try {
      const response = await getCurrentUser();
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch {
      clearAuth();
      setUser(null);
    }
  }, []);

  const login = async (data: LoginPayload) => {
    const response = await apiLogin(data);
    if (response.data.success) {
      setAuthTokens(response.data.data);
      setUser(response.data.data.user);
    }
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
