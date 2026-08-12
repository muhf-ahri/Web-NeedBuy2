// src/pages/seller/SettingsPage.tsx
import React, { useState } from 'react';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';

const SettingsPage: React.FC = () => {
  const [form, setForm] = useState({
    shopName: 'My Awesome Store',
    description: 'We sell high-quality electronics and accessories.',
    businessEmail: 'shop@example.com',
    vacationMode: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <h1 className="text-[28px] font-bold text-[#191c1e]">Seller Settings</h1>

        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-6 max-w-2xl">
          <form className="space-y-5">
            {/* Shop Name */}
            <div>
              <label className="block text-[13px] font-medium text-[#737686] mb-1">Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] font-medium text-[#737686] mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm transition resize-none"
              />
            </div>

            {/* Upload Logo */}
            <div>
              <label className="block text-[13px] font-medium text-[#737686] mb-1">Upload Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#f2f4f6] rounded-xl flex items-center justify-center text-[#737686] border border-dashed border-[#c3c6d7]">
                  <Icon name="upload" size={24} />
                </div>
                <Button variant="outline" className="text-sm">Choose File</Button>
              </div>
            </div>

            {/* Business Email */}
            <div>
              <label className="block text-[13px] font-medium text-[#737686] mb-1">Business Email</label>
              <input
                type="email"
                name="businessEmail"
                value={form.businessEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm transition"
              />
            </div>

            {/* Vacation Mode */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="vacationMode"
                checked={form.vacationMode}
                onChange={handleChange}
                className="w-4 h-4 accent-[#004ac6]"
              />
              <label className="text-[13px] font-medium text-[#191c1e]">Vacation Mode</label>
            </div>

            <Button variant="primary" className="w-full sm:w-auto px-8 py-2.5 text-sm">
              Update Settings
            </Button>
          </form>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SettingsPage;