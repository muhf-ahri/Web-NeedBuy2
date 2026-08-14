// src/pages/admin/data/analyticsData.ts
export interface AnalyticsStats {
  totalRevenue: number;
  revenueChange: string;
  totalOrders: number;
  ordersChange: string;
  conversionRate: number;
  conversionChange: string;
  activeUsers: number;
  usersChange: string;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export interface TopCategory {
  name: string;
  revenue: number;
  percentage: number;
}

export interface TopStore {
  name: string;
  sales: number;
  growth: number;
}

export interface OrderStatusData {
  label: string;
  value: number;
  color: string;
}

export const DUMMY_STATS: AnalyticsStats = {
  totalRevenue: 124563000, // Rp 124.563.000
  revenueChange: '+15.8%',
  totalOrders: 3492,
  ordersChange: '-2.4%',
  conversionRate: 4.8,
  conversionChange: '+1.2%',
  activeUsers: 12845,
  usersChange: '+8.5%',
};

export const DUMMY_REVENUE_DATA: RevenuePoint[] = [
  { month: 'Jan', revenue: 45000000 },
  { month: 'Feb', revenue: 52000000 },
  { month: 'Mar', revenue: 48000000 },
  { month: 'Apr', revenue: 61000000 },
  { month: 'Mei', revenue: 78000000 },
  { month: 'Jun', revenue: 72000000 },
  { month: 'Jul', revenue: 89000000 },
  { month: 'Agu', revenue: 95000000 },
  { month: 'Sep', revenue: 85000000 },
  { month: 'Okt', revenue: 102000000 },
  { month: 'Nov', revenue: 115000000 },
  { month: 'Des', revenue: 124563000 },
];

export const DUMMY_TOP_CATEGORIES: TopCategory[] = [
  { name: 'Elektronik', revenue: 45200000, percentage: 36 },
  { name: 'Fashion & Apparel', revenue: 32150000, percentage: 26 },
  { name: 'Home & Garden', revenue: 18400000, percentage: 15 },
  { name: 'Sports & Outdoors', revenue: 12800000, percentage: 10 },
  { name: 'Kecantikan', revenue: 8200000, percentage: 7 },
  { name: 'Makanan', revenue: 6200000, percentage: 5 },
];

export const DUMMY_TOP_STORES: TopStore[] = [
  { name: 'TechNova Electronics', sales: 24500000, growth: 12 },
  { name: 'Urban Threads', sales: 18200000, growth: 8 },
  { name: 'Home Essentials', sales: 14300000, growth: 5 },
  { name: 'Gadget World', sales: 9800000, growth: 15 },
  { name: 'Fashion Hub', sales: 7600000, growth: 3 },
];

export const DUMMY_ORDER_STATUS: OrderStatusData[] = [
  { label: 'Selesai', value: 65, color: '#156b32' },
  { label: 'Diproses', value: 25, color: '#0057b8' },
  { label: 'Dibatalkan', value: 10, color: '#a33131' },
];