import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { setSessionTokens, clearAuth } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { dashboardPathFor } from '../utils/roleHome';
import Icon from '../components/ui/Icon';

const AuthCallbackPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const oauthError = params.get('error');
    if (oauthError) {
      setError(params.get('message') || 'Login Google gagal. Coba lagi ya.');
      return;
    }

    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    if (!accessToken || !refreshToken) {
      setError('Token dari Google nggak lengkap. Coba login lagi ya.');
      return;
    }

    setSessionTokens(accessToken, refreshToken);
    
    window.history.replaceState(null, '', '/auth/callback');

    refreshUser()
      .then((user) => {
        if (!user) {
          clearAuth();
          setError('Gagal ambil data akun kamu. Coba login lagi ya.');
          return;
        }
        navigate(dashboardPathFor(user.role), { replace: true });
      })
      .catch(() => {
        clearAuth();
        setError('Gagal ambil data akun kamu. Coba login lagi ya.');
      });
  }, [params, navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f7fb] font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-8 max-w-sm w-full text-center">
        {error ? (
          <>
            <p className="text-[14px] text-[#93000a] mb-4">{error}</p>
            <Link
              to="/login"
              className="inline-block px-6 py-2.5 rounded-full bg-[#4077a6] hover:bg-[#284a67] text-white text-[14px] font-semibold transition-colors"
            >
              Balik ke login
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Icon name="clock" size={24} className="animate-spin text-[#4077a6]" />
            <p className="text-[14px] text-[#737686]">Bentar ya, lagi nyiapin akun kamu...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
