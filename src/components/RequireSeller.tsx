import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

  if (user.role !== 'SELLER') {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/'} replace />;
  }

  return <>{children}</>;
};

export default RequireSeller;
