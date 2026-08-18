import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Sidebar from '../../components/ui/Sidebar';
import NotificationBell from '../../components/ui/NotificationBell';
import ProfileDropdown from '../../components/ui/ProfileDropdown';
import Icon from '../../components/ui/Icon';
import type { SidebarItem } from '../../components/ui/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const navItems: SidebarItem[] = [
  {
    to: '/seller/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    to: '/seller/products',
    label: 'Produk Saya',
    icon: 'product',
  },
  {
    to: '/seller/orders',
    label: 'Order Masuk',
    icon: 'orders',
  },
  {
    to: '/seller/chats',
    label: 'Chat Pembeli',
    icon: 'chat',
  },
  {
    to: '/seller/analytics',
    label: 'Analitik Toko',
    icon: 'analytics',
  },
  {
    to: '/seller/wallet',
    label: 'Saldo & Penarikan',
    icon: 'wallet',
  },
  {
    to: '/seller/settings',
    label: 'Setelan',
    icon: 'settings',
  },
];

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({
  children,
}) => {
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  return (
    <div
      className="
        min-h-screen
        bg-[#F5F5FF]
      "
      style={{
        fontFamily:
          "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-40

          border-b
          border-white/80

          bg-white/95
          backdrop-blur-md
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            max-w-7xl
            items-center
            justify-between

            px-4
            sm:px-6
            lg:px-10
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            {/* Mobile menu button */}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(true);
              }}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full

                text-[#20242D]

                transition-all
                duration-200

                hover:bg-[#F5F7FB]
                hover:text-[#538CDB]

                active:scale-[0.95]

                lg:hidden
              "
              aria-label="Buka menu"
            >
              <Icon
                name="menu"
                size={18}
              />
            </button>

            {/* Logo */}

            <Link
              to="/seller/dashboard"
              className="
                group
                flex
                items-center
                gap-2.5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  leading-none
                "
              >
                <span
                  className="
                    text-[15px]
                    font-extrabold
                    tracking-tight
                    text-[#538CDB]
                  "
                >
                  NeedBuy
                </span>

                <span
                  className="
                    mt-0.5
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[#538CDB]
                  "
                >
                  Seller Center
                </span>
              </div>
            </Link>
          </div>

          {/* =================================================
              RIGHT HEADER
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-2
              sm:gap-3
            "
          >
            {/* Lihat toko */}

            <Link
              to="/"
              className="
                hidden
                h-9
                items-center
                gap-1.5
                rounded-full

                border
                border-[#E8ECF4]

                bg-white
                px-3.5

                text-[12px]
                font-semibold
                text-[#538CDB]

                shadow-sm

                transition-all
                duration-200

                hover:border-[#538CDB]
                hover:bg-[#EEF5FF]
                hover:shadow-[0_4px_12px_rgba(83,140,219,0.12)]

                active:scale-[0.98]

                md:inline-flex
              "
            >
              <Icon
                name="eye"
                size={13}
              />

              Lihat Toko
            </Link>

            <NotificationBell />

            <ProfileDropdown
              sellerName={
                user?.name ??
                user?.username ??
                'Seller'
              }
            />
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT AREA
      ===================================================== */}

      <div
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          gap-4

          px-4
          py-6

          sm:gap-5
          sm:px-6

          lg:flex-row
          lg:gap-8
          lg:px-10
        "
      >
        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside
          className="
            lg:w-60
            lg:shrink-0
          "
        >
          <div
            className="
              lg:sticky
              lg:top-24
            "
          >
            <Sidebar
              items={navItems}
              title="Menu Seller"
              mobileOpen={mobileMenuOpen}
              onMobileClose={() => {
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </aside>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main
          className="
            min-w-0
            flex-1
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;