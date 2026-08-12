// src/components/RequireSeller.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Penjaga route `/seller/*`.
 *
 * Ini kenyamanan navigasi, BUKAN kontrol akses — otorisasi yang sebenarnya ada
 * di backend (`requireRole("SELLER","ADMIN")` di tiap endpoint dashboard).
 * Tanpa itu, cukup mengubah `user.role` di localStorage sudah membuka halaman.
 *
 * `isLoading` ditunggu dulu: AuthProvider membaca user dari localStorage di
 * effect, jadi render pertama selalu "belum login" dan tanpa penjagaan ini
 * seller yang me-refresh dashboard akan dilempar ke /login.
 */
const RequireSeller: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#737686] font-sans">
        Bentar ya…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireSeller;
