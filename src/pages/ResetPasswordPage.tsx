import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import { clearAuth, resetPassword, validateResetToken } from '../api/auth';

const FIELD_CLASS =
  'w-full rounded-xl border border-[#c3c6d7] px-4 py-2.5 text-sm outline-none transition focus:border-[#538cbd] focus:ring-2 focus:ring-[#538cbd]/20';

const ResetPasswordPage: React.FC = () => {
  const { token = '' } = useParams();
  const navigate = useNavigate();

  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    validateResetToken(token)
      .then((res) => {
        if (!cancelled) setValid(res.data.data.valid);
      })
      .catch(() => {
        if (!cancelled) setValid(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    if (password.length < 8) {
      setError('Passwordnya minimal 8 karakter ya.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi passwordnya belum sama.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await resetPassword(token, password, confirmPassword);
      
      clearAuth();
      setDone(true);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal ganti password, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e0e3e5] bg-white p-8">
        {valid === null ? (
          <div className="space-y-3">
            <div className="h-6 w-2/3 animate-pulse rounded bg-[#f2f4f6]" />
            <div className="h-10 animate-pulse rounded bg-[#f2f4f6]" />
            <div className="h-10 animate-pulse rounded bg-[#f2f4f6]" />
          </div>
        ) : done ? (
          <div className="text-center">
            <Icon name="check" size={36} className="mx-auto text-[#12805c]" />
            <h1 className="mt-4 text-[20px] font-bold text-[#101319]">Password udah diganti</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#737686]">
              Semua perangkat yang tadinya masih login udah dikeluarkan. Masuk lagi pakai
              password barumu ya.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/login', { replace: true })}
              className="mt-5 w-full py-2.5 text-sm"
            >
              Masuk Sekarang
            </Button>
          </div>
        ) : !valid ? (
          <div className="text-center">
            <Icon name="alert" size={36} className="mx-auto text-[#ba1a1a]" />
            <h1 className="mt-4 text-[20px] font-bold text-[#101319]">Tautannya udah nggak berlaku</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#737686]">
              Tautan reset cuma bertahan 1 jam dan sekali pakai. Minta yang baru aja ya.
            </p>
            <Link to="/forgot-password">
              <Button variant="primary" className="mt-5 w-full py-2.5 text-sm">
                Minta Tautan Baru
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-[22px] font-bold text-[#101319]">Bikin password baru</h1>
            <p className="mt-1.5 text-[14px] text-[#737686]">
              Minimal 8 karakter. Setelah diganti, semua perangkat bakal dikeluarkan.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg border border-[#ffdad6] bg-[#fff0f0] p-2.5 text-xs text-[#93000a]">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="rp-password" className="mb-1 block text-[13px] font-medium text-[#737686]">
                  Password Baru
                </label>
                <input
                  id="rp-password"
                  type="password"
                  required
                  autoFocus
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label htmlFor="rp-confirm" className="mb-1 block text-[13px] font-medium text-[#737686]">
                  Ulangi Password Baru
                </label>
                <input
                  id="rp-confirm"
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>

              <Button type="submit" variant="primary" disabled={busy} className="w-full py-2.5 text-sm">
                {busy ? 'Nyimpen…' : 'Simpan Password Baru'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
