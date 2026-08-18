export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export function dashboardPathFor(role?: Role): string {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'SELLER') return '/seller/dashboard';
  return '/';
}

export const hasDashboard = (role?: Role): boolean => role === 'SELLER' || role === 'ADMIN';
