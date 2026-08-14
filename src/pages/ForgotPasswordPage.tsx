// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import { forgotPassword } from '../api/auth';

import loginImg from '../assets/login.png';

const FIELD_CLASS =
  'w-full rounded-xl border border-[#E8ECF4] bg-white px-4 py-2.5 text-sm text-[#20242D] outline-none transition placeholder:text-[#A2A8B3] focus:border-[#538CDB] focus:ring-4 focus:ring-[#538CDB]/10';

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
    <main className="relative min-h-screen overflow-hidden bg-[#F5F5FF]">

      {/* Ambient background, unchanged palette */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_15%_20%,rgba(83,140,219,0.20),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(255,213,0,0.12),transparent_25%),radial-gradient(circle_at_80%_85%,rgba(255,70,70,0.10),transparent_28%),linear-gradient(135deg,#F5F5FF_0%,#FFFFFF_45%,#EEF5FF_100%)]
        "
      />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-[#538CDB]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-[#FFD500]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#FF4646]/5 blur-3xl" />
      <div className="pointer-events-none absolute left-[7%] top-[15%] h-2.5 w-2.5 rounded-full bg-[#FFD500]" />
      <div className="pointer-events-none absolute right-[10%] top-[18%] h-4 w-4 rotate-12 rounded-[4px] bg-[#FF4646]" />
      <div className="pointer-events-none absolute bottom-[18%] left-[12%] h-3 w-3 rounded-full bg-[#538CDB]" />
      <div className="pointer-events-none absolute bottom-[13%] right-[18%] h-2.5 w-2.5 rounded-full bg-[#FFD500]" />

      {/* Background illustration — full screen, sits behind the card, never inside it */}
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
                    <Icon name="check" size={36} className="mx-auto text-[#156b32]" />
                    <h1 className="mt-4 text-[20px] font-bold text-[#191c1e]">Cek email kamu</h1>
                    {/* Sengaja tidak bilang "akun ditemukan" — pesan yang sama muncul
                        buat email yang nggak terdaftar, biar halaman ini nggak bisa
                        dipakai ngecek siapa aja yang punya akun NeedBuy. */}
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
                        className="mt-5 w-full rounded-full bg-[#538CDB] py-2.5 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(83,140,219,0.18)] hover:bg-[#467BC7] hover:shadow-[0_9px_22px_rgba(83,140,219,0.22)] focus:ring-4 focus:ring-[#538CDB]/15 active:scale-[0.99]"
                      >
                        Kembali ke Masuk
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="mb-6">

                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#538CDB]">
                        Reset password
                      </p>

                      <h1 className="text-[24px] font-bold leading-tight tracking-tight text-[#20242D] sm:text-[26px]">
                        Lupa password?
                      </h1>

                      <p className="mt-2 max-w-xs text-[13px] leading-5 text-[#737A87]">
                        Tulis email yang kamu pakai daftar. Kami
                        kirimkan tautan untuk membuat password baru.
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

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>

                      <div>
                        <label
                          htmlFor="fp-email"
                          className="mb-1 block text-[13px] font-medium text-[#737A87]"
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
                        className="w-full rounded-full bg-[#538CDB] py-2.5 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(83,140,219,0.18)] hover:bg-[#467BC7] hover:shadow-[0_9px_22px_rgba(83,140,219,0.22)] focus:ring-4 focus:ring-[#538CDB]/15 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {busy ? 'Ngirim…' : 'Kirim Tautan'}
                      </Button>
                    </form>

                    {/* Back to login */}
                    <p className="mt-5 text-center text-xs text-[#737A87]">
                      Inget passwordnya?{' '}

                      <Link
                        to="/login"
                        className="font-semibold text-[#538CDB] transition-colors hover:text-[#467BC7]"
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