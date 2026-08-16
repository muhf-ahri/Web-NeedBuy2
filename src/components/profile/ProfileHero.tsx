import React from 'react';

import Icon from '../ui/Icon';

interface ProfileHeroProps {
  name: string;
  email: string;
  username: string;
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
  seller,
  stats,
  onNavigateOrders,
  onNavigateWishlist,
  onLogout,
}) => {
  const initials = (name || username || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      {/* ── Summary card — gradient biru brand ── */}
      <div
        className="
          relative overflow-hidden rounded-[24px] bg-gradient-to-br
          from-[#5B93E0] to-[#3A66AC] p-5 text-white
          shadow-[0_18px_50px_rgba(83,140,219,0.30)] sm:p-6
        "
      >
        {/* Dekorasi */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute bottom-6 right-10 h-14 w-14 rounded-full border border-white/10" />

        <div className="relative">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Profil Saya
          </p>

          <div className="flex items-center gap-3">
            <div
              className="
                flex h-14 w-14 shrink-0 items-center justify-center
                rounded-2xl bg-white/15 ring-2 ring-white/25 backdrop-blur-sm
                sm:h-16 sm:w-16
              "
            >
              <span className="text-[18px] font-extrabold text-white sm:text-[20px]">
                {initials}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold leading-tight sm:text-[18px]">
                {name || username}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-white/75 sm:text-[12px]">
                {email}
              </p>
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
                  {Number(seller.rating).toFixed(1)}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span
                  className={`
                    inline-flex items-center gap-1
                    ${seller.status === 'ACTIVE' ? 'text-[#DCFCE7]' : 'text-[#FFF7E0]'}
                  `}
                >
                  <span
                    className={`
                      h-1 w-1 rounded-full
                      ${seller.status === 'ACTIVE' ? 'bg-[#22C55E]' : 'bg-[#FFD500]'}
                    `}
                  />
                  {seller.status === 'ACTIVE' ? 'Aktif' : 'Disuspend'}
                </span>
              </div>
            </div>
          )}

          {/* Stats grid */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Pesanan', value: stats.orders, icon: 'orders' as const },
              { label: 'Kebutuhan', value: stats.needs, icon: 'spark' as const },
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

      {/* ── Quick links ── */}
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
                      ? 'bg-[#FFF0F0] text-[#C73535]'
                      : 'bg-[#538CDB]/10 text-[#538CDB]'
                  }
                `}
              >
                <Icon name={link.icon} size={14} />
              </span>
              <span
                className={`
                  text-[13px] font-semibold
                  ${link.danger ? 'text-[#C73535]' : 'text-[#20242D]'}
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
                    bg-[#538CDB] px-1.5 text-[10px] font-bold text-white
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
                  group-hover:translate-x-0.5 group-hover:text-[#538CDB]
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