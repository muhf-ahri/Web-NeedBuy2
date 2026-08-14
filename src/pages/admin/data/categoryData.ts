// src/pages/admin/data/categoriesData.ts
export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  parentId: string | null;
  createdAt: string;
  _count: {
    products: number;
    children: number;
  };
}

export const DUMMY_CATEGORIES: Category[] = [
  // ── Induk (parentId = null) ──
  {
    id: '1',
    name: 'Elektronik',
    description: 'Perangkat elektronik dan gadget',
    isActive: true,
    parentId: null,
    createdAt: '2023-10-24',
    _count: { products: 1245, children: 8 },
  },
  {
    id: '2',
    name: 'Fashion',
    description: 'Pakaian dan aksesoris fashion',
    isActive: true,
    parentId: null,
    createdAt: '2023-10-20',
    _count: { products: 3420, children: 12 },
  },
  {
    id: '3',
    name: 'Home & Living',
    description: 'Perabotan rumah dan dekorasi',
    isActive: true,
    parentId: null,
    createdAt: '2023-09-15',
    _count: { products: 890, children: 5 },
  },
  {
    id: '4',
    name: 'Kesehatan & Kecantikan',
    description: 'Produk kesehatan dan perawatan tubuh',
    isActive: false,
    parentId: null,
    createdAt: '2023-08-02',
    _count: { products: 512, children: 6 },
  },
  {
    id: '5',
    name: 'Makanan & Minuman',
    description: 'Produk makanan dan minuman',
    isActive: true,
    parentId: null,
    createdAt: '2023-07-18',
    _count: { products: 210, children: 3 },
  },
  {
    id: '6',
    name: 'Olahraga',
    description: 'Peralatan olahraga dan aktivitas outdoor',
    isActive: true,
    parentId: null,
    createdAt: '2023-06-10',
    _count: { products: 135, children: 2 },
  },

  // ── Anak (parentId tidak null) ──
  {
    id: '7',
    name: 'Smartphone',
    description: 'Smartphone dan aksesoris',
    isActive: true,
    parentId: '1',
    createdAt: '2023-11-01',
    _count: { products: 450, children: 0 },
  },
  {
    id: '8',
    name: 'Laptop',
    description: 'Laptop dan komputer portable',
    isActive: true,
    parentId: '1',
    createdAt: '2023-11-05',
    _count: { products: 230, children: 0 },
  },
  {
    id: '9',
    name: 'Pakaian Pria',
    description: 'Baju, celana, dan aksesoris pria',
    isActive: true,
    parentId: '2',
    createdAt: '2023-10-28',
    _count: { products: 1200, children: 0 },
  },
  {
    id: '10',
    name: 'Pakaian Wanita',
    description: 'Baju, celana, dan aksesoris wanita',
    isActive: true,
    parentId: '2',
    createdAt: '2023-10-30',
    _count: { products: 1500, children: 0 },
  },
  {
    id: '11',
    name: 'Perabotan',
    description: 'Meja, kursi, lemari dan lainnya',
    isActive: false,
    parentId: '3',
    createdAt: '2023-09-20',
    _count: { products: 320, children: 0 },
  },
  {
    id: '12',
    name: 'Dekorasi',
    description: 'Hiasan dinding, vas bunga, dll',
    isActive: true,
    parentId: '3',
    createdAt: '2023-09-25',
    _count: { products: 180, children: 0 },
  },
  {
    id: '13',
    name: 'Sepatu Pria',
    description: 'Sepatu formal dan kasual pria',
    isActive: true,
    parentId: '2',
    createdAt: '2023-10-15',
    _count: { products: 90, children: 0 },
  },
  {
    id: '14',
    name: 'Jam Tangan',
    description: 'Jam tangan berbagai merek',
    isActive: true,
    parentId: '1',
    createdAt: '2023-11-10',
    _count: { products: 45, children: 0 },
  },
  {
    id: '15',
    name: 'Vitamin & Suplemen',
    description: 'Vitamin dan suplemen kesehatan',
    isActive: false,
    parentId: '4',
    createdAt: '2023-08-15',
    _count: { products: 78, children: 0 },
  },
];