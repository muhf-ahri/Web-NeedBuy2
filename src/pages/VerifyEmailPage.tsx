import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import { setSessionTokens, verifyEmail } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { dashboardPathFor } from '../utils/roleHome';

const VerifyEmailPage: React.FC = () => {
  const { token = '' } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    verifyEmail(token)
      .then(async (res) => {
        const { accessToken, refreshToken } = res.data.data;
        setSessionTokens(accessToken, refreshToken);
        const user = await refreshUser();
        navigate(user ? dashboardPathFor(user.role) : '/', { replace: true });
      })
      .catch((err: any) => {
        setError(err?.message ?? 'Tautannya udah nggak berlaku. Minta kirim ulang ya.');
      });
  }, [token, navigate, refreshUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e0e3e5] bg-white p-8 text-center">
        {error ? (
          <>
            <Icon name="alert" size={36} className="mx-auto text-[#ba1a1a]" />
            <h1 className="mt-4 text-[20px] font-bold text-[#101319]">Verifikasi gagal</h1>
            <p className="mt-2 text-[14px] text-[#737686]">{error}</p>
            
            <p className="mt-2 text-[12px] leading-relaxed text-[#737686]">
              Kalau kamu sempat minta kirim ulang, yang berlaku adalah tautan dari
              email <span className="font-semibold">paling baru</span>, tautan lama
              otomatis tidak berlaku. Coba buka email terakhir di kotak masuk kamu dulu.
            </p>
            <p className="mt-1 text-[12px] text-[#737686]">
              Masih gagal? Login dulu, nanti ada tombol kirim ulang di halaman profil.
            </p>
            <Link to="/login">
              <Button variant="primary" className="mt-5 w-full py-2.5 text-sm">
                Ke Halaman Masuk
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Icon name="clock" size={36} className="mx-auto animate-spin text-[#4077a6]" />
            <h1 className="mt-4 text-[20px] font-bold text-[#101319]">Lagi verifikasi…</h1>
            <p className="mt-2 text-[14px] text-[#737686]">Bentar ya, sedetik lagi juga kelar.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
