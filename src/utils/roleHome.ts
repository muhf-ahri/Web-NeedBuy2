// src/utils/roleHome.ts
export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

/**
 * Ke mana sebuah role mendarat setelah login, dan ke mana tombol "Dashboard"
 * menunjuk.
 *
 * Ada di satu tempat karena sebelumnya tersebar: Login, Navbar, dan
 * ProfileDropdown masing-masing menulis `role === 'SELLER' || role === 'ADMIN'`
 * lalu mengarah ke /seller/dashboard — jadi admin selalu terlempar ke panel
 * penjual. Menambah role baru sekarang cuma menyentuh berkas ini.
 */
export function dashboardPathFor(role?: Role): string {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'SELLER') return '/seller/dashboard';
  return '/';
}

/** Role yang punya panel sendiri — dipakai untuk memunculkan tombol Dashboard. */
export const hasDashboard = (role?: Role): boolean => role === 'SELLER' || role === 'ADMIN';
