// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import LoginForm from '../components/forms/LoginForm';
import Divider from '../components/ui/Divider';
import SocialLogin from '../components/forms/SocialLogin';
import HeroPanel from '../components/HeroPanel';

import { useAuth } from '../contexts/AuthContext';
import { dashboardPathFor } from '../utils/roleHome';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const user = await login({
        email,
        password,
      });

      navigate(dashboardPathFor(user.role));
    } catch (err: any) {
      setError(
        err.message ||
          'Gagal masuk. Silakan periksa email dan password kamu.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5F5FF]">

      {/* =====================================================
          BACKGROUND GRADIENT
      ====================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_15%_20%,rgba(83,140,219,0.20),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(255,213,0,0.12),transparent_25%),radial-gradient(circle_at_80%_85%,rgba(255,70,70,0.10),transparent_28%),linear-gradient(135deg,#F5F5FF_0%,#FFFFFF_45%,#EEF5FF_100%)]
        "
      />

      {/* Soft blue glow */}
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-[#538CDB]/10 blur-3xl" />

      {/* Soft yellow glow */}
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-[#FFD500]/10 blur-3xl" />

      {/* Soft coral glow */}
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#FF4646]/5 blur-3xl" />

      {/* =====================================================
          SMALL DECORATIONS
      ====================================================== */}

      <div className="pointer-events-none absolute left-[7%] top-[15%] h-2.5 w-2.5 rounded-full bg-[#FFD500]" />

      <div className="pointer-events-none absolute right-[10%] top-[18%] h-4 w-4 rotate-12 rounded-[4px] bg-[#FF4646]" />

      <div className="pointer-events-none absolute bottom-[18%] left-[12%] h-3 w-3 rounded-full bg-[#538CDB]" />

      <div className="pointer-events-none absolute bottom-[13%] right-[18%] h-2.5 w-2.5 rounded-full bg-[#FFD500]" />

      {/* =====================================================
          DECORATIVE CURVE
      ====================================================== */}

      <svg
        className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] text-[#538CDB]/10"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M20 330C90 250 110 280 170 200C230 120 290 130 390 30"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        <path
          d="M50 380C120 300 140 330 200 250C260 170 320 180 420 80"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 lg:px-8">

        <div className="w-full max-w-4xl">

          {/* Page number */}
          <div className="mb-2 flex justify-end">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[10px] font-semibold text-[#538CDB] shadow-sm backdrop-blur-sm">
              01.
            </div>
          </div>

          {/* =================================================
              LOGIN CARD
          ================================================== */}

          <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm">

            <div className="grid md:grid-cols-[0.9fr_1.1fr]">

              {/* Hero */}
              <HeroPanel />

              {/* =================================================
                  FORM
              ================================================== */}

              <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">

                <div className="mx-auto w-full max-w-sm">

                  {/* Mobile heading */}
                  <div className="mb-6 md:hidden">
                    <p className="text-xs font-semibold text-[#538CDB]">
                      NeedBuy
                    </p>
                  </div>

                  {/* Header */}
                  <div className="mb-6">

                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#538CDB]">
                      Welcome back
                    </p>

                    <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#20242D] sm:text-[30px]">
                      Senang melihatmu lagi.
                    </h1>

                    <p className="mt-2 max-w-xs text-[13px] leading-5 text-[#737A87]">
                      Masuk ke akun NeedBuy untuk melanjutkan
                      perjalanan belanjamu.
                    </p>

                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mb-4 rounded-xl border border-[#FF4646]/15 bg-[#FFF0F0] px-3.5 py-3">

                      <p className="text-xs leading-5 text-[#C73535]">
                        {error}
                      </p>

                    </div>
                  )}

                  {/* Login */}
                  <LoginForm
                    onSubmit={handleLogin}
                    isLoading={loading}
                    error=""
                  />

                  {/* Divider */}
                  <Divider text="atau" />

                  {/* Google */}
                  <SocialLogin />

                  {/* Register */}
                  <p className="mt-5 text-center text-xs text-[#737A87]">
                    Belum punya akun?{' '}

                    <Link
                      to="/register"
                      className="font-semibold text-[#538CDB] transition-colors hover:text-[#467BC7]"
                    >
                      Buat akun
                    </Link>
                  </p>

                </div>

              </section>

            </div>

          </div>

          {/* Footer */}
          <p className="mt-3 text-center text-[10px] text-[#737A87]">
            NeedBuy membantu kamu berbelanja dengan lebih sadar dan terarah.
          </p>

        </div>

      </div>

    </main>
  );
};

export default Login;