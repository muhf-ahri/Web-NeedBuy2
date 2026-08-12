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
    if (!form.username) newErrors.username = 'Username-nya diisi dulu ya';
    if (!form.email) newErrors.email = 'Email-nya diisi dulu ya';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Format email-nya kayaknya salah';
    if (!form.password) newErrors.password = 'Password-nya jangan kosong ya';
    else if (form.password.length < 8) newErrors.password = 'Minimal 8 karakter ya';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Password-nya beda, cek lagi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Username - full width */}
      <Input
        label="Username"
        name="username"
        placeholder="@ username kamu"
        value={form.username}
        onChange={handleChange}
        error={errors.username}
        className="text-sm py-2"
      />

      {/* Email. Pilihan role dihapus: semua akun mulai sebagai pembeli, dan
          toko didaftarkan dari halaman profil karena butuh nama perusahaan,
          alamat, dan logo — data yang tidak muat diminta di sini. */}
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="jane@company.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        className="text-sm py-2"
      />

      {/* Password dan Confirm Password dalam satu baris (2 kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col">
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="**********"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            className="text-sm py-2"
          />
          <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter ya.</p>
        </div>
        <div>
          <Input
            label="Ulangi Password"
            name="confirmPassword"
            type="password"
            placeholder="**********"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            className="text-sm py-2"
          />
        </div>
      </div>

      {error && <div className="text-red-600 text-xs">{error}</div>}
      
      <Button type="submit" fullWidth variant="primary" disabled={isLoading} className="text-sm py-2.5">
        {isLoading ? 'Lagi dibikin...' : 'Bikin Akun'}
      </Button>
    </form>
  );
};

export default RegisterForm;