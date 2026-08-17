import React from 'react';
import { Link } from 'react-router-dom';

import Sidebar from '../../components/ui/Sidebar';
import NotificationBell from '../../components/ui/NotificationBell';
import ProfileDropdown from '../../components/ui/ProfileDropdown';
import Icon from '../../components/ui/Icon';
import type { SidebarItem } from '../../components/ui/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const navItems: SidebarItem[] = [
  { to: '/seller/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/seller/products', label: 'Produk Saya', icon: 'product' },
  { to: '/seller/orders', label: 'Order Masuk', icon: 'orders' },
  { to: '/seller/chats', label: 'Chat Pembeli', icon: 'chat' },
  { to: '/seller/analytics', label: 'Analitik Toko', icon: 'analytics' },
  // Dompet penjual sama dengan dompet akun — halaman NeedPay yang sudah ada
  // dipakai ulang, bukan bikin halaman saldo kedua yang isinya sama.
  { to: '/seller/wallet', label: 'Saldo & Penarikan', icon: 'wallet' },
  { to: '/seller/settings', label: 'Setelan', icon: 'settings' },
];

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div
      className="min-h-screen bg-[#F5F5FF]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Header Seller — glassmorphism + sticky ── */}
      <header
        className="
          sticky top-0 z-40 border-b border-white/80 bg-white/95
          backdrop-blur-md
        "
      >
        <div
          className="
            mx-auto flex h-16 max-w-7xl items-center justify-between px-4
            sm:px-6 lg:px-10
          "
        >
          {/* Logo + branding */}
          <Link
            to="/seller/dashboard"
            className="group flex items-center gap-2.5"
          >
              {/* Dekorasi titik kuning signature */}
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-extrabold tracking-tight text-[#538CBD]">
                NeedBuy
              </span>
              <span
                className="
                  mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em]
                  text-[#538CDB]
                "
              >
                Seller Center
              </span>
            </div>
          </Link>

          {/* Right side: Lihat Toko + Notification + Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tombol "Lihat Toko" — pill button, hidden di mobile kecil */}
            <Link
              to="/"
              className="
                hidden h-9 items-center gap-1.5 rounded-full border
                border-[#E8ECF4] bg-white px-3.5 text-[12px] font-semibold
                text-[#538CDB] shadow-sm transition-all duration-200
                hover:border-[#538CDB] hover:bg-[#EEF5FF]
                hover:shadow-[0_4px_12px_rgba(83,140,219,0.12)]
                active:scale-[0.98] md:inline-flex
              "
            >
              <Icon name="eye" size={13} />
              Lihat Toko
            </Link>

            <NotificationBell />
            <ProfileDropdown
              sellerName={user?.name ?? user?.username ?? 'Seller'}
            />
          </div>
        </div>
      </header>

      {/* ── Body: sidebar + konten ──
          - Mobile (<lg): flex-col → sidebar (hamburger trigger) di atas konten
          - Desktop (lg+): flex-row → sidebar kiri (static), konten kanan
      */}
      <div
        className="
          mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:gap-5 sm:px-6
          lg:flex-row lg:gap-8 lg:px-10
        "
      >
        {/* Sidebar container */}
        <div className="lg:w-60 lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <Sidebar items={navItems} title="Menu Seller" />
          </div>
        </div>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default SellerLayout;