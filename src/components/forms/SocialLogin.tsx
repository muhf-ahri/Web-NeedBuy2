import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import Button from '../ui/Button';
import { socialLogin, setAuthTokens } from '../../api/auth';

type Provider = 'GOOGLE' | 'APPLE';

const base64Url = (value: unknown) =>
  btoa(JSON.stringify(value))
    .replace(/=+$/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

function buildMockIdToken(provider: Provider, email: string, name: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url({ alg: 'HS256', typ: 'JWT' });
  const payload = base64Url({
    iss: `mock-${provider.toLowerCase()}`,
    aud: 'needbuy-dev',
    sub: `${provider.toLowerCase()}_${email}`,
    email,
    email_verified: true,
    name,
    iat: now,
    exp: now + 3600,
  });
  return `${header}.${payload}.mock-signature`;
}

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const SocialLogin: React.FC = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = (p: Provider) => {
    setProvider(p);
    setEmail('');
    setName('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;
    setLoading(true);
    setError(null);
    try {
      const trimmedEmail = email.trim();
      const idToken = buildMockIdToken(
        provider,
        trimmedEmail,
        name.trim() || trimmedEmail.split('@')[0]
      );
      const res = await socialLogin({ provider, idToken });
      if (res.data.success) {
        setAuthTokens(res.data.data);
        if (res.data.data.user.role === 'SELLER') {
          navigate('/plans');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || `Gagal login dengan ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button variant="google" fullWidth className="text-xs py-2" onClick={() => openModal('GOOGLE')}>
          <GoogleIcon />
          Google
        </Button>
        <Button variant="apple" fullWidth className="text-xs py-2" onClick={() => openModal('APPLE')}>
          <AppleIcon />
          Apple
        </Button>
      </div>

      {provider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
              <h3 className="text-[15px] font-bold text-[#191c1e]">
                Lanjutkan dengan {provider === 'GOOGLE' ? 'Google' : 'Apple'}
              </h3>
              <button
                onClick={() => setProvider(null)}
                className="text-[#737686] hover:text-[#191c1e] transition-colors"
              >
                <Icon name="close" size={20} className="" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <p className="text-[12px] text-[#737686]">
                Mode simulasi (dev): isi email yang akan dipakai untuk masuk.
              </p>
              <div>
                <label className="block text-xs font-medium text-[#737686] mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@gmail.com"
                  className="w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737686] mb-1">Nama (opsional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm transition"
                />
              </div>
              {error && <p className="text-[12px] text-[#93000a]">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors disabled:opacity-50"
              >
                {loading && <Icon name="clock" size={16} className="animate-spin" />}
                {loading
                  ? 'Memproses...'
                  : `Masuk dengan ${provider === 'GOOGLE' ? 'Google' : 'Apple'}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialLogin;
