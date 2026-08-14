// src/pages/VerifyEmailPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import { setSessionTokens, verifyEmail } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { dashboardPathFor } from '../utils/roleHome';

/**
 * Pendaratan tautan verifikasi dari email. Token ditukar sekali, hasilnya
 * berupa sesi baru — user nggak perlu login lagi setelah klik tautannya.
 */
const VerifyEmailPage: React.FC = () => {
  const { token = '' } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  // StrictMode di dev memasang effect dua kali; token sekali pakai cuma boleh
  // ditukar sekali, kalau nggak percobaan kedua pasti gagal.
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
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e0e3e5] bg-white p-8 text-center">
        {error ? (
          <>
            <Icon name="alert" size={36} className="mx-auto text-[#ba1a1a]" />
            <h1 className="mt-4 text-[20px] font-bold text-[#191c1e]">Verifikasi gagal</h1>
            <p className="mt-2 text-[14px] text-[#737686]">{error}</p>
            <p className="mt-1 text-[12px] text-[#737686]">
              Login dulu, nanti ada tombol kirim ulang di halaman profil kamu.
            </p>
            <Link to="/login">
              <Button variant="primary" className="mt-5 w-full py-2.5 text-sm">
                Ke Halaman Masuk
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Icon name="clock" size={36} className="mx-auto animate-spin text-[#004ac6]" />
            <h1 className="mt-4 text-[20px] font-bold text-[#191c1e]">Lagi verifikasi…</h1>
            <p className="mt-2 text-[14px] text-[#737686]">Bentar ya, sedetik lagi juga kelar.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
