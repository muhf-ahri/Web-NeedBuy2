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

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Masukkan alamat email yang valid.';
    }

    if (!password) {
      newErrors.password = 'Password wajib diisi.';
    }

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
    <form onSubmit={handleSubmit} className="space-y-4">

      <Input
        label="Email"
        type="email"
        placeholder="nama@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        className="
          rounded-xl
          border-[#E8ECF4]
          bg-white
          py-2.5
          text-sm
          text-[#20242D]
          placeholder:text-[#A2A8B3]
          focus:border-[#538CDB]
          focus:ring-4
          focus:ring-[#538CDB]/10
        "
      />

      <div>

        <Input
          label="Password"
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          className="
            rounded-xl
            border-[#E8ECF4]
            bg-white
            py-2.5
            text-sm
            text-[#20242D]
            placeholder:text-[#A2A8B3]
            focus:border-[#538CDB]
            focus:ring-4
            focus:ring-[#538CDB]/10
          "
        />

        <div className="mt-1.5 flex justify-end">

          <Link
            to="/forgot-password"
            className="
              text-[11px]
              font-medium
              text-[#538CDB]
              transition-colors
              hover:text-[#467BC7]
            "
          >
            Lupa password?
          </Link>

        </div>

      </div>

      {error && (
        <div className="rounded-xl bg-[#FFF0F0] px-3 py-2.5 text-xs text-[#C73535]">
          {error}
        </div>
      )}

      <Button
        type="submit"
        fullWidth
        disabled={isLoading}
        className="
          h-11
          rounded-full
          bg-[#538CDB]
          px-6
          text-sm
          font-semibold
          text-white
          shadow-[0_7px_18px_rgba(83,140,219,0.18)]
          transition-all
          duration-200
          hover:bg-[#467BC7]
          hover:shadow-[0_9px_22px_rgba(83,140,219,0.22)]
          focus:ring-4
          focus:ring-[#538CDB]/15
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isLoading ? 'Memproses...' : 'Masuk ke akun'}
      </Button>

    </form>
  );
};

export default LoginForm;