import React from 'react';

import Icon from '../ui/Icon';

interface ProfileHeroProps {
  name: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  onPickPhoto: (file: File) => void;
  onRemovePhoto: () => void;
  uploadingPhoto: boolean;
  seller?: {
    id: string;
    storeName: string;
    rating: string;
    status: string;
  } | null;
  stats: {
    orders: number;
    needs: number;
    addresses: number;
  };
  onNavigateOrders: () => void;
  onNavigateWishlist: () => void;
  onLogout: () => void;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({
  name,
  email,
  username,
  avatarUrl,
  onPickPhoto,
  onRemovePhoto,
  uploadingPhoto,
  seller,
  stats,
  onNavigateOrders,
  onNavigateWishlist,
  onLogout,
}) => {
  const initials = (name || username || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">

      <div
        className="
          relative overflow-hidden rounded-[24px] bg-gradient-to-br
          from-[#004ac6] to-[#003ea8] p-5 text-white
          shadow-[0_18px_50px_rgba(83,140,219,0.30)] sm:p-6
        "
      >

        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute bottom-6 right-10 h-14 w-14 rounded-full border border-white/10" />

        <div className="relative">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Profil Saya
          </p>

          <div className="flex items-center gap-3">

            <label
              className="
                group relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden
                rounded-2xl bg-white/15 ring-2 ring-white/25 backdrop-blur-sm
                sm:h-16 sm:w-16
              "
              title="Ganti foto profil"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Foto profil kamu"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="
                    flex h-full w-full items-center justify-center text-[18px]
                    font-extrabold text-white sm:text-[20px]
                  "
                >
                  {initials}
                </span>
              )}

              <span
                className={`
                  absolute inset-0 flex items-center justify-center bg-black/45
                  transition-opacity
                  ${uploadingPhoto ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}
              >
                {uploadingPhoto ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Icon name="upload" size={16} className="text-white" />
                )}
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                disabled={uploadingPhoto}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) onPickPhoto(file);
                }}
              />
            </label>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold leading-tight sm:text-[18px]">
                {name || username}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-white/75 sm:text-[12px]">
                {email}
              </p>
              <button
                type="button"
                onClick={avatarUrl ? onRemovePhoto : undefined}
                disabled={uploadingPhoto || !avatarUrl}
                className="
                  mt-1 text-[10px] font-semibold text-white/70 underline-offset-2
                  transition-colors hover:text-white hover:underline
                  disabled:cursor-default disabled:no-underline
                  disabled:hover:text-white/70
                "
              >
                {avatarUrl ? 'Hapus foto' : 'Belum ada foto, klik kotaknya buat unggah'}
              </button>
            </div>
          </div>

          {seller && (
            <div
              className="
                mt-4 overflow-hidden rounded-2xl bg-white/10 px-4 py-3
                backdrop-blur-sm
              "
            >
              <div className="flex items-center gap-2">
                <span
                  className="
                    flex h-7 w-7 items-center justify-center rounded-lg
                    bg-white/20
                  "
                >
                  <Icon name="shop" size={13} className="text-white" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                    Toko Saya
                  </p>
                  <p className="truncate text-[13px] font-bold">
                    {seller.storeName}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-white/75">
                <span className="inline-flex items-center gap-1">
                  <Icon name="star" size={10} className="text-[#FFD500]" />
                  {Number(seller.rating ?? 0).toFixed(1)}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span
                  className={`
                    inline-flex items-center gap-1
                    ${seller.status === 'ACTIVE' ? 'text-[#e6f4ee]' : 'text-[#FFF7E0]'}
                  `}
                >
                  <span
                    className={`
                      h-1 w-1 rounded-full
                      ${seller.status === 'ACTIVE' ? 'bg-[#12805c]' : 'bg-[#FFD500]'}
                    `}
                  />
                  {seller.status === 'ACTIVE' ? 'Aktif' : 'Disuspend'}
                </span>
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Pesanan', value: stats.orders, icon: 'orders' as const },
              { label: 'Kebutuhan', value: stats.needs, icon: 'layers' as const },
              { label: 'Alamat', value: stats.addresses, icon: 'pin' as const },
            ].map((stat) => (
              <div
                key={stat.label}
                className="
                  rounded-xl bg-white/10 px-3 py-2.5 text-center
                  backdrop-blur-sm
                "
              >
                <Icon name={stat.icon} size={14} className="mx-auto text-white/80" />
                <p className="mt-1 text-[16px] font-extrabold tabular-nums">
                  {stat.value}
                </p>
                <p className="text-[9px] uppercase tracking-wider text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="
          overflow-hidden rounded-[24px] border border-white/80
          bg-white/95 shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm
        "
      >
        {[
          {
            label: 'Pesanan Saya',
            icon: 'orders' as const,
            onClick: onNavigateOrders,
            badge: stats.orders,
          },
          {
            label: 'Wishlist',
            icon: 'heart' as const,
            onClick: onNavigateWishlist,
          },
          {
            label: 'Keluar',
            icon: 'logout' as const,
            onClick: onLogout,
            danger: true,
          },
        ].map((link, i, arr) => (
          <button
            key={link.label}
            type="button"
            onClick={link.onClick}
            className={`
              group flex w-full items-center justify-between px-4 py-3.5
              text-left transition-colors hover:bg-[#F5F7FB]
              ${i < arr.length - 1 ? 'border-b border-[#F5F7FB]' : ''}
            `}
          >
            <span className="flex items-center gap-3">
              <span
                className={`
                  flex h-8 w-8 items-center justify-center rounded-xl
                  ${
                    link.danger
                      ? 'bg-[#FFF0F0] text-[#ba1a1a]'
                      : 'bg-[#004ac6]/10 text-[#004ac6]'
                  }
                `}
              >
                <Icon name={link.icon} size={14} />
              </span>
              <span
                className={`
                  text-[13px] font-semibold
                  ${link.danger ? 'text-[#ba1a1a]' : 'text-[#101319]'}
                `}
              >
                {link.label}
              </span>
            </span>
            <div className="flex items-center gap-2">
              {typeof link.badge === 'number' && link.badge > 0 && (
                <span
                  className="
                    flex h-5 min-w-5 items-center justify-center rounded-full
                    bg-[#004ac6] px-1.5 text-[10px] font-bold text-white
                  "
                >
                  {link.badge}
                </span>
              )}
              <Icon
                name="chevronRight"
                size={14}
                className="
                  text-[#A2A8B3] transition-transform duration-200
                  group-hover:translate-x-0.5 group-hover:text-[#004ac6]
                "
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileHero;