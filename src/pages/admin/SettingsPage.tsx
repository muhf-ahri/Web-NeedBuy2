import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import MarketplaceInfo from './components/settings/MarketPlaceInfo';
import Branding from './components/settings/Branding';
import RegionalSettings from './components/settings/RegionalSettings';
import { getConfigs, setConfigs, type ConfigKey } from '../../api/admin';

export type SaveConfigs = (entries: Partial<Record<ConfigKey, string>>) => Promise<void>;

export interface SettingsCardProps {
  values: Record<string, string>;
  onSave: SaveConfigs;
}

const SettingsPage: React.FC = () => {
  const [values, setValues] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await getConfigs();
      setValues(res.data.data.configs);
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal muat pengaturan, coba muat ulang halaman ya');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = useCallback<SaveConfigs>(async (entries) => {
    await setConfigs(entries);
    
    setValues((prev) => ({ ...(prev ?? {}), ...(entries as Record<string, string>) }));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div>
          <h1 className="text-[28px] font-bold text-[#101319]">Pengaturan</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola konfigurasi dan preferensi marketplace.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-[#ffdad6] bg-[#fff0f0] p-3 text-[13px] text-[#93000a]">
            {error}
          </div>
        )}

        {!values ? (
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-[#f2f4f6]" />
            ))}
          </div>
        ) : (
          <>
            
            <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
              <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#101319]">
                <Icon name="settings" size={18} className="text-[#4077a6]" />
                Informasi Marketplace
              </h2>
              <MarketplaceInfo values={values} onSave={handleSave} />
            </div>

            <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
              <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#101319]">
                <Icon name="upload" size={18} className="text-[#4077a6]" />
                Branding
              </h2>
              <Branding values={values} onSave={handleSave} />
            </div>

            <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
              <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#101319]">
                <Icon name="globe" size={18} className="text-[#4077a6]" />
                Regional Settings
              </h2>
              <RegionalSettings values={values} onSave={handleSave} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
