import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import RegisterForm from '../components/forms/RegisterForm';
import Divider from '../components/ui/Divider';
import SocialLogin from '../components/forms/SocialLogin';

import { register, setAuthTokens } from '../api/auth';

import loginImg from '../assets/login.jpg';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const res = await register(data);

      if (res.data.success) {
        setAuthTokens(res.data.data);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal membuat akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f7fb]">
      
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_15%_20%,rgba(83,140,219,0.20),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(255,213,0,0.12),transparent_25%),radial-gradient(circle_at_80%_85%,rgba(255,70,70,0.10),transparent_28%),linear-gradient(135deg,#F5F5FF_0%,#FFFFFF_45%,#EEF5FF_100%)]
        "
      />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-[#004ac6]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-[#FFD500]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#ba1a1a]/5 blur-3xl" />
      <div className="pointer-events-none absolute left-[7%] top-[15%] h-2.5 w-2.5 rounded-full bg-[#FFD500]" />
      <div className="pointer-events-none absolute right-[10%] top-[18%] h-4 w-4 rotate-12 rounded-[4px] bg-[#ba1a1a]" />
      <div className="pointer-events-none absolute bottom-[18%] left-[12%] h-3 w-3 rounded-full bg-[#004ac6]" />
      <div className="pointer-events-none absolute bottom-[13%] right-[18%] h-2.5 w-2.5 rounded-full bg-[#FFD500]" />

      <img
        src={loginImg}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="
          pointer-events-none absolute inset-0 z-0 h-full w-full
          select-none object-cover object-center
        "
      />

      <div className="relative z-10 flex min-h-screen items-center justify-start px-4 py-5 sm:px-8 lg:pl-16 lg:pr-8">
        <div className="w-full max-w-2xl">
          <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm">
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              
              <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#004ac6] via-[#004ac6] to-[#003ea8] px-8 py-10 md:flex md:flex-col md:justify-between">
                <svg
                  className="pointer-events-none absolute inset-y-0 right-0 h-full w-16 text-[#f5f7fb] md:w-20"
                  viewBox="0 0 100 400"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M100 0
                       C 40 40, 90 90, 55 140
                       C 20 190, 70 230, 90 280
                       C 105 320, 50 360, 100 400
                       L 100 400 L 100 0 Z"
                    fill="currentColor"
                    className="opacity-0"
                  />
                  <path
                    d="M100 0
                       C 40 40, 90 90, 55 140
                       C 20 190, 70 230, 90 280
                       C 105 320, 50 360, 100 400
                       L 130 400 L 130 0 Z"
                    fill="white"
                  />
                </svg>

                <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border border-white/15" />
                <div className="pointer-events-none absolute bottom-8 left-10 h-24 w-24 rounded-full border border-white/10" />

                <div className="relative z-10">
                  <h2 className="mt-1 text-2xl font-bold text-white">NeedBuy</h2>
                  <p className="mt-4 max-w-[220px] text-[13px] leading-5 text-white/75">
                    Belanja jadi lebih sadar dan terarah, satu keputusan kecil setiap harinya.
                  </p>
                </div>

                <div className="relative z-10 mt-auto flex items-center gap-2 pt-8 text-[10px] text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                  NeedBuy &copy; {new Date().getFullYear()}
                </div>
              </section>

              <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">
                <div className="mx-auto w-full max-w-sm">
                  
                  <div className="mb-6 md:hidden">
                    <p className="text-xs font-semibold text-[#004ac6]">NeedBuy</p>
                  </div>

                  <div className="mb-6">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#004ac6]">
                      Create account
                    </p>
                    <h1 className="text-[24px] font-bold leading-tight tracking-tight text-[#101319] sm:text-[26px]">
                      Mulai perjalananmu.
                    </h1>
                    <p className="mt-2 max-w-xs text-[13px] leading-5 text-[#737686]">
                      Buat akun NeedBuy dan mulai temukan produk yang benar-benar kamu butuhkan.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 rounded-xl border border-[#ba1a1a]/15 bg-[#FFF0F0] px-3.5 py-3">
                      <p className="text-xs leading-5 text-[#ba1a1a]">{error}</p>
                    </div>
                  )}

                  <RegisterForm
                    onSubmit={handleRegister}
                    isLoading={loading}
                    error=""
                  />

                  <Divider text="atau" />
                  <SocialLogin />

                  <p className="mt-5 text-center text-xs text-[#737686]">
                    Sudah punya akun?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-[#004ac6] transition-colors hover:text-[#004ac6]"
                    >
                      Masuk
                    </Link>
                  </p>
                </div>
              </section>
            </div>
          </div>

          <p className="mt-3 text-center text-[10px] text-[#737686]">
            Bergabung dengan NeedBuy untuk pengalaman belanja yang lebih sederhana dan terarah.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;