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
    role: 'BUYER',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<RegisterPayload>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<RegisterPayload> = {};
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Must be at least 8 characters';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
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
        placeholder="@ username"
        value={form.username}
        onChange={handleChange}
        error={errors.username}
        className="text-sm py-2"
      />

      {/* Email dan Role dalam satu baris (2 kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Input
            label="Work Email"
            name="email"
            type="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            className="text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Role Selection</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-100/80 rounded-lg border border-gray-200 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
          </select>
        </div>
      </div>

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
          <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters.</p>
        </div>
        <div>
          <Input
            label="Confirm Password"
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
        {isLoading ? 'Creating...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegisterForm;