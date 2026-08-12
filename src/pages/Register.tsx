import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import Divider from '../components/ui/Divider';
import SocialLogin from '../components/forms/SocialLogin';
import HeroPanel from '../components/HeroPanel';
import { register, setAuthTokens } from '../api/auth';

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
      setError(err.message || 'Registrasi gagal');
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
            <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-xs mt-1">
              Enter your details to get started with NeedBuy.
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <RegisterForm onSubmit={handleRegister} isLoading={loading} error={error || ''} />

          <Divider text="OR CONTINUE WITH" />

          <SocialLogin />

          <p className="mt-4 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
