// src/pages/admin/components/adminMenu.ts
import type { IconName } from '../../../components/ui/Icon';

export type MenuItem = {
  label: string;
  icon: IconName;
  to: string;
};

/**
 * Daftar menu sekaligus sumber judul halaman placeholder — App.tsx memakai
* `/admin/*` yang menjatuhkan semua route belum-jadi ke satu PlaceholderPage,
 * dan halaman itu mencari labelnya di sini. Satu daftar, bukan dua yang harus
 * dijaga tetap sinkron.
 *
 * Berkas terpisah dari AdminSidebar supaya fast refresh tetap jalan: file yang
 * mengekspor komponen sekaligus konstanta bikin Vite me-reload penuh.
 */
export const menuItems: MenuItem[] = [
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
