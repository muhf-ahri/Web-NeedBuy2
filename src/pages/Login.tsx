import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import Divider from '../components/ui/Divider';
import SocialLogin from '../components/forms/SocialLogin';
import HeroPanel from '../components/HeroPanel';
import { login, setAuthTokens } from '../api/auth';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login({ email, password });
      if (res.data.success) {
        setAuthTokens(res.data.data);

        if (res.data.data.user.role === 'SELLER') {
          navigate('/plans');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal');
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
            <h1 className="text-xl font-bold text-gray-900">Sign In</h1>
            <p className="text-gray-500 text-xs mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <LoginForm onSubmit={handleLogin} isLoading={loading} error={error || ''} />

          <Divider text="OR CONTINUE WITH" />

          <SocialLogin />

          <p className="mt-4 text-center text-xs text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;