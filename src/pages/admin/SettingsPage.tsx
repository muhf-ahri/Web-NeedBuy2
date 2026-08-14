// src/pages/admin/SettingsPage.tsx
import React from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import MarketplaceInfo from './components/settings/MarketPlaceInfo';
import Branding from './components/settings/Branding';
import RegionalSettings from './components/settings/RegionalSettings';

const SettingsPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Pengaturan</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola konfigurasi dan preferensi marketplace.
          </p>
        </div>

        {/* Marketplace Information */}
        <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#191c1e]">
            <Icon name="settings" size={18} className="text-[#004ac6]" />
            Informasi Marketplace
          </h2>
          <MarketplaceInfo />
        </div>

        {/* Branding */}
        <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#191c1e]">
            <Icon name="upload" size={18} className="text-[#004ac6]" />
            Branding
          </h2>
          <Branding />
        </div>

        {/* Regional Settings */}
        <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#191c1e]">
            <Icon name="globe" size={18} className="text-[#004ac6]" />
            Regional Settings
          </h2>
          <RegionalSettings />
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;