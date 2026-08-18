import React from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../ui/Icon';
import SellerRegisterForm from '../forms/SellerRegisterForm';

interface ProfileSellerSectionProps {
  seller?: {
    id: string;
    storeName: string;
    rating: string;
    status: string;
  } | null;
  onRegistered: () => void;
}

const ProfileSellerSection: React.FC<ProfileSellerSectionProps> = ({
  seller,
  onRegistered,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        overflow-hidden rounded-[24px] border border-white/80 bg-white/95
        p-5 shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm
        sm:p-6
      "
    >
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className="
            flex h-8 w-8 items-center justify-center rounded-lg
            bg-[#538CDB]/10
          "
        >
          <Icon name="shop" size={15} className="text-[#538CDB]" />
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-[#20242D]">
            {seller ? 'Toko Saya' : 'Buka Toko'}
          </h3>
          <p className="text-[11px] text-[#737A87]">
            {seller
              ? 'Kelola toko & produk jualanmu'
              : 'Mulai berjualan di NeedBuy'}
          </p>
        </div>
      </div>

      {seller ? (
        <>
          
          <div
            className="
              mb-4 overflow-hidden rounded-2xl border border-[#E8ECF4]
              bg-[#F5F7FB] p-4
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-12 w-12 items-center justify-center rounded-xl
                  bg-white ring-1 ring-[#E8ECF4]
                "
              >
                <Icon name="shop" size={18} className="text-[#538CDB]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-[#20242D]">
                  {seller.storeName}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#737A87]">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="star" size={11} className="text-[#FFD500]" />
                    {Number(seller.rating ?? 0).toFixed(1)}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#D8DEE9]" />
                  <span
                    className={`
                      inline-flex items-center gap-1 font-semibold
                      ${
                        seller.status === 'ACTIVE'
                          ? 'text-[#166534]'
                          : 'text-[#B45309]'
                      }
                    `}
                  >
                    <span
                      className={`
                        h-1 w-1 rounded-full
                        ${
                          seller.status === 'ACTIVE'
                            ? 'bg-[#22C55E]'
                            : 'bg-[#FFD500]'
                        }
                      `}
                    />
                    {seller.status === 'ACTIVE' ? 'Toko aktif' : 'Disuspend'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard')}
              className="
                flex h-10 items-center gap-1.5 rounded-full bg-[#538CDB]
                px-5 text-[12px] font-semibold text-white
                shadow-[0_6px_16px_rgba(83,140,219,0.25)] transition-all
                duration-200 hover:bg-[#467BC7]
                hover:shadow-[0_8px_20px_rgba(83,140,219,0.30)]
                active:scale-[0.99]
              "
            >
              <Icon name="grid" size={13} />
              Dashboard Toko
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/settings')}
              className="
                flex h-10 items-center gap-1.5 rounded-full border
                border-[#E8ECF4] bg-white px-5 text-[12px] font-semibold
                text-[#20242D] transition-all duration-200
                hover:border-[#538CDB] hover:text-[#538CDB] active:scale-[0.99]
              "
            >
              <Icon name="edit" size={13} />
              Setelan Toko
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className="
              mb-4 flex items-start gap-2 rounded-2xl bg-[#F5F7FB] px-4
              py-3 text-[12px] text-[#737A87]
            "
          >
            <Icon name="alert" size={14} className="mt-0.5 shrink-0 text-[#538CDB]" />
            <p className="leading-relaxed">
              Lengkapi data perusahaan untuk mulai berjualan. Akun kamu
              tetap bisa dipakai membeli seperti biasa.
            </p>
          </div>
          <SellerRegisterForm onRegistered={onRegistered} />
        </>
      )}
    </div>
  );
};

export default ProfileSellerSection;