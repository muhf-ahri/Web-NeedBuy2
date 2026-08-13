// src/pages/admin/components/AdminSidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon, { type IconName } from '../../../components/ui/Icon';

type MenuItem = {
  label: string;
  icon: IconName;
  to: string;
};

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'dashboard', to: '/admin/dashboard' },
  { label: 'Users', icon: 'users', to: '/admin/users' },
  { label: 'Stores', icon: 'store', to: '/admin/stores' },
  { label: 'Products', icon: 'product', to: '/admin/products' },
  { label: 'Categories', icon: 'categories', to: '/admin/categories' },
  { label: 'Orders', icon: 'orders', to: '/admin/orders' },
  { label: 'Payment', icon: 'payments', to: '/admin/payments' },
  { label: 'Withdrawals', icon: 'withdrawals', to: '/admin/withdrawals' },
  { label: 'Promotions', icon: 'vouchers', to: '/admin/promotions' },
  { label: 'Reviews', icon: 'reviews', to: '/admin/reviews' },
  { label: 'Reports', icon: 'reports', to: '/admin/reports' },
  { label: 'Analytics', icon: 'analytics', to: '/admin/analytics' },
  { label: 'Notification', icon: 'bell', to: '/admin/notifications' },
  { label: 'Settings', icon: 'settings', to: '/admin/settings' },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (to: string) => {
    if (location.pathname === to) return true;
    // Untuk nested path (misal /admin/users/buyer), tetap aktifkan menu Users
    if (to !== '/admin/dashboard' && location.pathname.startsWith(to)) return true;
    return false;
  };

  return (
    <nav
      className="bg-white rounded-2xl border border-[#e0e3e5] p-3 sticky top-24 w-56 animate-slideDown"
    >
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.to);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 ease-out
                  hover:translate-x-0.5
                  ${active
                    ? 'bg-[#dbe1ff] text-[#004ac6] shadow-sm scale-[1.02]'
                    : 'text-[#434655] hover:bg-[#f2f4f6] hover:text-[#004ac6]'
                  }
                `}
              >
                <span
                  className={`
                    transition-transform duration-200
                    ${active ? 'scale-110' : 'group-hover:scale-110'}
                  `}
                >
                  <Icon name={item.icon} size={18} className="shrink-0" />
                </span>
                <span className="flex-1">{item.label}</span>
                {active && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[#004ac6] animate-pulse" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminSidebar;