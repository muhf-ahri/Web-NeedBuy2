// src/pages/admin/data/ordersData.ts

export interface Order {
  id: string;
  orderNumber: string;
  buyer: {
    name: string;
    email: string;
  };
  store: string;
  items: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Processing' | 'Completed' | 'Cancelled' | 'Pending';
  createdAt: string;
}

export const DUMMY_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '#ORD-7234',
    buyer: { name: 'Alex Mercer', email: 'alex@example.com' },
    store: 'TechHaven Electronics',
    items: 3,
    totalAmount: 4500000,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    createdAt: '2024-05-10T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: '#ORD-7233',
    buyer: { name: 'Sarah Connor', email: 'sarah.c@example.com' },
    store: 'StyleBoutique',
    items: 1,
    totalAmount: 850000,
    paymentStatus: 'Paid',
    orderStatus: 'Completed',
    createdAt: '2024-05-09T14:20:00Z',
  },
  {
    id: '3',
    orderNumber: '#ORD-7232',
    buyer: { name: 'John Smith', email: 'john.s@company.com' },
    store: 'Home Essentials',
    items: 5,
    totalAmount: 2100000,
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    createdAt: '2024-05-08T09:15:00Z',
  },
  {
    id: '4',
    orderNumber: '#ORD-7231',
    buyer: { name: 'Elena Rodriguez', email: 'elena.r@email.com' },
    store: 'Gadget World',
    items: 2,
    totalAmount: 12000000,
    paymentStatus: 'Failed',
    orderStatus: 'Cancelled',
    createdAt: '2024-05-07T16:45:00Z',
  },
  // tambah lebih banyak agar pagination terlihat
  {
    id: '5',
    orderNumber: '#ORD-7230',
    buyer: { name: 'Budi Santoso', email: 'budi@mail.com' },
    store: 'Elektronik Jaya',
    items: 4,
    totalAmount: 3200000,
    paymentStatus: 'Paid',
    orderStatus: 'Completed',
    createdAt: '2024-05-06T11:00:00Z',
  },
  {
    id: '6',
    orderNumber: '#ORD-7229',
    buyer: { name: 'Siti Aminah', email: 'siti@mail.com' },
    store: 'Fashion Hub',
    items: 2,
    totalAmount: 1500000,
    paymentStatus: 'Pending',
    orderStatus: 'Processing',
    createdAt: '2024-05-05T08:30:00Z',
  },
  {
    id: '7',
    orderNumber: '#ORD-7228',
    buyer: { name: 'Ahmad Reza', email: 'reza@mail.com' },
    store: 'Gamer Paradise',
    items: 1,
    totalAmount: 2500000,
    paymentStatus: 'Paid',
    orderStatus: 'Completed',
    createdAt: '2024-05-04T13:10:00Z',
  },
  {
    id: '8',
    orderNumber: '#ORD-7227',
    buyer: { name: 'Dewi Lestari', email: 'dewi@mail.com' },
    store: 'Organic Foods',
    items: 6,
    totalAmount: 4300000,
    paymentStatus: 'Failed',
    orderStatus: 'Cancelled',
    createdAt: '2024-05-03T17:20:00Z',
  },
  {
    id: '9',
    orderNumber: '#ORD-7226',
    buyer: { name: 'Hendra Wijaya', email: 'hendra@mail.com' },
    store: 'Auto Parts Store',
    items: 3,
    totalAmount: 1700000,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    createdAt: '2024-05-02T09:45:00Z',
  },
  {
    id: '10',
    orderNumber: '#ORD-7225',
    buyer: { name: 'Rina Kartika', email: 'rina@mail.com' },
    store: 'Beauty Cosmetics',
    items: 2,
    totalAmount: 890000,
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    createdAt: '2024-05-01T12:00:00Z',
  },
  {
    id: '11',
    orderNumber: '#ORD-7224',
    buyer: { name: 'Fajar Nugroho', email: 'fajar@mail.com' },
    store: 'Sport Store',
    items: 4,
    totalAmount: 5600000,
    paymentStatus: 'Paid',
    orderStatus: 'Completed',
    createdAt: '2024-04-30T10:15:00Z',
  },
  {
    id: '12',
    orderNumber: '#ORD-7223',
    buyer: { name: 'Maya Sari', email: 'maya@mail.com' },
    store: 'Book Haven',
    items: 1,
    totalAmount: 125000,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    createdAt: '2024-04-29T14:30:00Z',
  },
];