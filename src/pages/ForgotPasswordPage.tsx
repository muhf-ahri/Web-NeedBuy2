import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import { forgotPassword } from '../api/auth';

import loginImg from '../assets/login.png';

const FIELD_CLASS =
  'w-full rounded-xl border border-[#e0e3e5] bg-white px-4 py-2.5 text-sm text-[#101319] outline-none transition placeholder:text-[#A2A8B3] focus:border-[#538cbd] focus:ring-4 focus:ring-[#538cbd]/10';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal kirim tautannya, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f7fb]">

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_15%_20%,rgba(83,140,219,0.20),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(255,213,0,0.12),transparent_25%),radial-gradient(circle_at_80%_85%,rgba(255,70,70,0.10),transparent_28%),linear-gradient(135deg,#F5F5FF_0%,#FFFFFF_45%,#EEF5FF_100%)]
        "
      />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-[#538cbd]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-[#FFD500]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#ba1a1a]/5 blur-3xl" />
      <div className="pointer-events-none absolute left-[7%] top-[15%] h-2.5 w-2.5 rounded-full bg-[#FFD500]" />
      <div className="pointer-events-none absolute right-[10%] top-[18%] h-4 w-4 rotate-12 rounded-[4px] bg-[#ba1a1a]" />
      <div className="pointer-events-none absolute bottom-[18%] left-[12%] h-3 w-3 rounded-full bg-[#4077a6]" />
      <div className="pointer-events-none absolute bottom-[13%] right-[18%] h-2.5 w-2.5 rounded-full bg-[#FFD500]" />

      <img
        src={loginImg}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          h-full
          w-full
          select-none
          object-cover
          object-center
        "
      />

      <div className="relative z-10 flex min-h-screen items-center justify-start px-4 py-5 sm:px-8 lg:pl-16 lg:pr-8">

        <div className="w-full max-w-md">

          <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm">

            <section className="flex items-center bg-white px-5 py-6 sm:px-7 lg:px-8">

              <div className="mx-auto w-full max-w-xs">

                {sent ? (
                  <div className="text-center">
                    <Icon name="check" size={36} className="mx-auto text-[#12805c]" />
                    <h1 className="mt-4 text-[20px] font-bold text-[#101319]">Cek email kamu</h1>
                    
                    <p className="mt-2 text-[13px] leading-relaxed text-[#737686]">
                      Kalau <span className="font-semibold text-[#434655]">{email}</span> terdaftar di
                      NeedBuy, tautan buat atur ulang password udah kami kirim ke sana. Tautannya
                      berlaku 1 jam.
                    </p>
                    <p className="mt-2 text-[12px] text-[#737686]">
                      Nggak ada di kotak masuk? Coba cek folder spam atau promosi.
                    </p>
                    <Link to="/login">
                      <Button
                        variant="primary"
                        className="mt-5 w-full rounded-full bg-[#4077a6] py-2.5 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(83,140,219,0.18)] hover:bg-[#4077a6] hover:shadow-[0_9px_22px_rgba(83,140,219,0.22)] focus:ring-4 focus:ring-[#538cbd]/15 active:scale-[0.99]"
                      >
                        Kembali ke Masuk
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    
                    <div className="mb-6">

                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4077a6]">
                        Reset password
                      </p>

                      <h1 className="text-[24px] font-bold leading-tight tracking-tight text-[#101319] sm:text-[26px]">
                        Lupa password?
                      </h1>

                      <p className="mt-2 max-w-xs text-[13px] leading-5 text-[#737686]">
                        Tulis email yang kamu pakai daftar. Kami
                        kirimkan tautan untuk membuat password baru.
                      </p>

                    </div>

                    {error && (
                      <div className="mb-4 rounded-xl border border-[#ba1a1a]/15 bg-[#FFF0F0] px-3.5 py-3">

                        <p className="text-xs leading-5 text-[#ba1a1a]">
                          {error}
                        </p>

                      </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>

                      <div>
                        <label
                          htmlFor="fp-email"
                          className="mb-1 block text-[13px] font-medium text-[#737686]"
                        >
                          Email
                        </label>

                        <input
                          id="fp-email"
                          type="email"
                          required
                          autoFocus
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="kamu@email.com"
                          className={FIELD_CLASS}
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={busy}
                        className="w-full rounded-full bg-[#4077a6] py-2.5 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(83,140,219,0.18)] hover:bg-[#4077a6] hover:shadow-[0_9px_22px_rgba(83,140,219,0.22)] focus:ring-4 focus:ring-[#538cbd]/15 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {busy ? 'Ngirim…' : 'Kirim Tautan'}
                      </Button>
                    </form>

                    <p className="mt-5 text-center text-xs text-[#737686]">
                      Inget passwordnya?{' '}

                      <Link
                        to="/login"
                        className="font-semibold text-[#4077a6] transition-colors hover:text-[#4077a6]"
                      >
                        Masuk
                      </Link>
                    </p>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;