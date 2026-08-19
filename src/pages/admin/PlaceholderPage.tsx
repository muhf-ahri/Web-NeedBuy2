import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import { menuItems } from './components/adminMenu';

const PlaceholderPage: React.FC = () => {
  const { pathname } = useLocation();
  const item = menuItems.find((menu) => pathname.startsWith(menu.to));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#101319]">{item?.label ?? 'Admin'}</h1>
          <p className="text-[15px] text-[#737686]">Halaman ini masih dalam pengembangan.</p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#c3c6d7] bg-white px-6 py-20 text-center">
          <div className="rounded-full bg-[#dbe1ff] p-4 text-[#004ac6]">
            <Icon name={item?.icon ?? 'dashboard'} size={28} />
          </div>
          <h2 className="mt-4 text-[17px] font-bold text-[#101319]">
            {item?.label ?? 'Halaman'} belum tersedia
          </h2>
          <p className="mt-1 max-w-md text-[13px] text-[#737686]">
            Tampilan dan endpointnya masih dikerjakan. Menu ini sengaja dibiarkan aktif supaya
            struktur navigasi admin tidak berubah saat halamannya nanti masuk.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PlaceholderPage;
