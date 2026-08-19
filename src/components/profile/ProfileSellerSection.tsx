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
            bg-[#004ac6]/10
          "
        >
          <Icon name="shop" size={15} className="text-[#004ac6]" />
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-[#101319]">
            {seller ? 'Toko Saya' : 'Buka Toko'}
          </h3>
          <p className="text-[11px] text-[#737686]">
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
              mb-4 overflow-hidden rounded-2xl border border-[#e0e3e5]
              bg-[#F5F7FB] p-4
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-12 w-12 items-center justify-center rounded-xl
                  bg-white ring-1 ring-[#e0e3e5]
                "
              >
                <Icon name="shop" size={18} className="text-[#004ac6]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-[#101319]">
                  {seller.storeName}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#737686]">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="star" size={11} className="text-[#FFD500]" />
                    {Number(seller.rating ?? 0).toFixed(1)}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#e0e3e5]" />
                  <span
                    className={`
                      inline-flex items-center gap-1 font-semibold
                      ${
                        seller.status === 'ACTIVE'
                          ? 'text-[#12805c]'
                          : 'text-[#B45309]'
                      }
                    `}
                  >
                    <span
                      className={`
                        h-1 w-1 rounded-full
                        ${
                          seller.status === 'ACTIVE'
                            ? 'bg-[#12805c]'
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
                flex h-10 items-center gap-1.5 rounded-full bg-[#004ac6]
                px-5 text-[12px] font-semibold text-white
                shadow-[0_6px_16px_rgba(83,140,219,0.25)] transition-all
                duration-200 hover:bg-[#004ac6]
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
                border-[#e0e3e5] bg-white px-5 text-[12px] font-semibold
                text-[#101319] transition-all duration-200
                hover:border-[#004ac6] hover:text-[#004ac6] active:scale-[0.99]
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
              py-3 text-[12px] text-[#737686]
            "
          >
            <Icon name="alert" size={14} className="mt-0.5 shrink-0 text-[#004ac6]" />
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