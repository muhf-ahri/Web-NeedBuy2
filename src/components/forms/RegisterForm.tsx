import React, { useState } from 'react';

import Input from '../ui/Input';
import Button from '../ui/Button';

import { type RegisterPayload } from '../../api/auth';

interface RegisterFormProps {
  onSubmit: (data: RegisterPayload) => void;
  isLoading?: boolean;
  error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [form, setForm] = useState<RegisterPayload>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<RegisterPayload>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<RegisterPayload> = {};

    if (!form.username.trim()) newErrors.username = 'Username wajib diisi';

    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!form.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Ulangi password kamu';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak sama';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      
      <Input
        label="Username"
        name="username"
        placeholder="username kamu"
        value={form.username}
        onChange={handleChange}
        error={errors.username}
        className="
          rounded-xl border-[#E8ECF4] bg-white py-2.5 text-sm
          transition focus:border-[#538CDB] focus:ring-2 focus:ring-[#538CDB]/15
        "
      />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="nama@email.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        className="
          rounded-xl border-[#E8ECF4] bg-white py-2.5 text-sm
          transition focus:border-[#538CDB] focus:ring-2 focus:ring-[#538CDB]/15
        "
      />

      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            className="
              rounded-xl border-[#E8ECF4] bg-white py-2.5 text-sm
              transition focus:border-[#538CDB] focus:ring-2 focus:ring-[#538CDB]/15
            "
          />
          <p className="mt-1.5 text-[10px] text-[#737A87]">Minimal 8 karakter</p>
        </div>

        <Input
          label="Ulangi Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          className="
            rounded-xl border-[#E8ECF4] bg-white py-2.5 text-sm
            transition focus:border-[#538CDB] focus:ring-2 focus:ring-[#538CDB]/15
          "
        />
      </div>

      {error && (
        <div className="rounded-xl bg-[#FFF0F0] px-3 py-2 text-xs text-[#C73535]">
          {error}
        </div>
      )}

      <Button
        type="submit"
        fullWidth
        variant="primary"
        disabled={isLoading}
        className="
          rounded-full bg-[#538CDB] py-2.5 text-sm font-semibold text-white
          shadow-[0_6px_16px_rgba(83,140,219,0.20)] transition
          hover:bg-[#467BC7] hover:shadow-[0_8px_20px_rgba(83,140,219,0.25)]
          focus:ring-4 focus:ring-[#538CDB]/15 active:scale-[0.98]
        "
      >
        {isLoading ? 'Membuat akun...' : 'Buat akun'}
      </Button>
    </form>
  );
};

export default RegisterForm;