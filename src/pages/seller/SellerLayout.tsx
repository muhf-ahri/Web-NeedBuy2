// src/pages/seller/SellerLayout.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import NotificationBell from '../../components/ui/NotificationBell';
import ProfileDropdown from '../../components/ui/ProfileDropdown';
import type { SidebarItem } from '../../components/ui/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

interface SellerLayoutProps {
  children: React.ReactNode;
}

const navItems: SidebarItem[] = [
  { to: '/seller/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/seller/products', label: 'My Products', icon: 'product' },
  { to: '/seller/orders', label: 'Orders', icon: 'orders' },
  { to: '/seller/chats', label: 'Customer Chats', icon: 'chat' },
  { to: '/seller/analytics', label: 'Shop Analytics', icon: 'analytics' },
  { to: '/seller/settings', label: 'Settings', icon: 'settings' },
];

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f9fb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header Seller */}
      <header className="bg-white border-b border-[#e0e3e5] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/seller/dashboard" className="text-xl font-bold text-[#004ac6] tracking-tight">
            NeedBuy
          </Link>

          {/* Right side: Notification + Profile */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ProfileDropdown sellerName={user?.name ?? 'Seller'} />
            <Link
              to="/"
              className="hidden sm:inline-flex text-sm text-[#004ac6] hover:underline transition-colors"
            >
              View Store
            </Link>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto px-5 sm:px-10 py-6 gap-8">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <Sidebar items={navItems} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;