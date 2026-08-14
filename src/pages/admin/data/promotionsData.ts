// src/pages/admin/data/promotionsData.ts

export interface Voucher {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  used: number;
  quota: number | null; // null = unlimited
  validFrom: string;
  validTo: string;
  status: 'active' | 'paused' | 'expired';
  createdAt: string;
}

export interface FlashSaleProduct {
  id: string;
  productName: string;
  seller: string;
  category: string;
  discountPercent: number;
  originalPrice: number;
  salePrice: number;
  startDate: string; // "Oct 24, 10:00 AM"
  endDate: string;
  status: 'ongoing' | 'upcoming' | 'ended';
}

export const DUMMY_VOUCHERS: Voucher[] = [
  {
    id: '1',
    code: 'SUMMER24',
    title: 'Summer Mega Sale',
    discountType: 'percentage',
    value: 20,
    used: 450,
    quota: 1000,
    validFrom: '2024-06-01',
    validTo: '2024-08-31',
    status: 'active',
    createdAt: '2024-05-15',
  },
  {
    id: '2',
    code: 'FREESHIP',
    title: 'Free Shipping Min $50',
    discountType: 'fixed',
    value: 15,
    used: 98,
    quota: null,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'paused',
    createdAt: '2023-12-01',
  },
  {
    id: '3',
    code: 'WELCOME10',
    title: 'Welcome 10% Off',
    discountType: 'percentage',
    value: 10,
    used: 500,
    quota: 500,
    validFrom: '2024-03-01',
    validTo: '2024-03-31',
    status: 'expired',
    createdAt: '2024-02-20',
  },
  {
    id: '4',
    code: 'FLASH15',
    title: 'Flash Sale 15%',
    discountType: 'percentage',
    value: 15,
    used: 120,
    quota: 200,
    validFrom: '2024-10-20',
    validTo: '2024-10-25',
    status: 'active',
    createdAt: '2024-10-18',
  },
  {
    id: '5',
    code: 'LOYALTY',
    title: 'Loyalty Member Discount',
    discountType: 'fixed',
    value: 25,
    used: 45,
    quota: null,
    validFrom: '2024-09-01',
    validTo: '2024-12-31',
    status: 'active',
    createdAt: '2024-08-15',
  },
];

export const DUMMY_FLASH_SALE: FlashSaleProduct[] = [
  {
    id: '1',
    productName: 'Minimalist Smartwatch V2',
    seller: 'TechHaven',
    category: 'Electronics',
    discountPercent: 30,
    originalPrice: 199,
    salePrice: 139.3,
    startDate: 'Oct 24, 10:00 AM',
    endDate: 'Oct 26, 11:59 PM',
    status: 'ongoing',
  },
  {
    id: '2',
    productName: 'Aura Pro Noise Cancelling',
    seller: 'SoundWave Audio',
    category: 'Audio',
    discountPercent: 15,
    originalPrice: 349,
    salePrice: 296.65,
    startDate: 'Oct 28, 00:00 AM',
    endDate: 'Oct 30, 11:59 PM',
    status: 'upcoming',
  },
  {
    id: '3',
    productName: 'Eco-Friendly Thermo Flask',
    seller: 'GreenLife Goods',
    category: 'Home & Lifestyle',
    discountPercent: 50,
    originalPrice: 40,
    salePrice: 20,
    startDate: 'Oct 15, 08:00 AM',
    endDate: 'Oct 16, 08:00 PM',
    status: 'ended',
  },
  {
    id: '4',
    productName: 'Gaming Keyboard RGB',
    seller: 'Gadget World',
    category: 'Electronics',
    discountPercent: 25,
    originalPrice: 120,
    salePrice: 90,
    startDate: 'Oct 22, 12:00 PM',
    endDate: 'Oct 24, 11:59 PM',
    status: 'ongoing',
  },
  {
    id: '5',
    productName: 'Yoga Mat Premium',
    seller: 'FitLife Store',
    category: 'Sports',
    discountPercent: 40,
    originalPrice: 60,
    salePrice: 36,
    startDate: 'Nov 01, 08:00 AM',
    endDate: 'Nov 05, 11:59 PM',
    status: 'upcoming',
  },
];