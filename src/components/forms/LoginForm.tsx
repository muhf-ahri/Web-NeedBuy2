import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email-nya diisi dulu ya';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Format email-nya kayaknya salah';
    if (!password) newErrors.password = 'Password-nya jangan kosong ya';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Email"
        type="email"
        placeholder="jane@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        className="text-sm py-2"
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        className="text-sm py-2"
      />
      <div className="flex justify-end -mt-1">
        <Link to="/forgot-password" className="text-xs font-medium text-[#004ac6] hover:underline">
          Lupa password?
        </Link>
      </div>
      {error && <div className="text-red-600 text-xs">{error}</div>}
      <Button type="submit" fullWidth variant="primary" disabled={isLoading} className="text-sm py-2.5">
        {isLoading ? 'Bentar ya...' : 'Masuk'}
      </Button>
    </form>
  );
};

export default LoginForm;