import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import Divider from '../components/ui/Divider';
import SocialLogin from '../components/forms/SocialLogin';
import HeroPanel from '../components/HeroPanel';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Lewat AuthContext, bukan api/auth langsung: context yang menyimpan
      // token SEKALIGUS mengisi state `user`. Kalau hanya token yang ditulis,
      // penjaga route /seller/* masih melihat "belum login" dan memantulkan
      // seller balik ke halaman ini.
      const user = await login({ email, password });

      // Seller (dan admin) langsung mendarat di dashboard toko.
      navigate(user.role === 'SELLER' || user.role === 'ADMIN' ? '/seller/dashboard' : '/');
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Cek email dan password-mu ya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <HeroPanel />

        <div className="w-full md:w-3/5 p-6 sm:p-8">
          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-gray-900">Masuk Dulu Yuk</h1>
            <p className="text-gray-500 text-xs mt-1">
              Isi email dan password kamu buat masuk
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <LoginForm onSubmit={handleLogin} isLoading={loading} error={error || ''} />

          <Divider text="ATAU LANJUT PAKAI" />

          <SocialLogin />

          <p className="mt-4 text-center text-xs text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;