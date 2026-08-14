// src/pages/admin/data/ordersData.ts
export type OrderStatus = 'all' | 'processing' | 'completed' | 'cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

export interface Order {
  id: string;
  orderNumber: string;
  buyer: string;
  buyerEmail: string;
  store: string;
  items: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  status: Exclude<OrderStatus, 'all'>;
}

export const DUMMY_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '#ORD-7234',
    buyer: 'Alex Mercer',
    buyerEmail: 'alex@example.com',
    store: 'TechHaven Electronics',
    items: 3,
    totalAmount: 4500000,
    paymentStatus: 'Paid',
    status: 'processing',
  },
  {
    id: '2',
    orderNumber: '#ORD-7233',
    buyer: 'Sarah Connor',
    buyerEmail: 'sarah.c@example.com',
    store: 'StyleBoutique',
    items: 1,
    totalAmount: 850000,
    paymentStatus: 'Paid',
    status: 'completed',
  },
  {
    id: '3',
    orderNumber: '#ORD-7232',
    buyer: 'John Smith',
    buyerEmail: 'john.s@company.com',
    store: 'Home Essentials',
    items: 5,
    totalAmount: 2100000,
    paymentStatus: 'Pending',
    status: 'processing',
  },
  {
    id: '4',
    orderNumber: '#ORD-7231',
    buyer: 'Elena Rodriguez',
    buyerEmail: 'elena.r@email.com',
    store: 'Gadget World',
    items: 2,
    totalAmount: 12000000,
    paymentStatus: 'Failed',
    status: 'cancelled',
  },
  {
    id: '5',
    orderNumber: '#ORD-7230',
    buyer: 'Budi Santoso',
    buyerEmail: 'budi.s@email.com',
    store: 'Elektronik Jaya',
    items: 4,
    totalAmount: 3200000,
    paymentStatus: 'Paid',
    status: 'completed',
  },
  {
    id: '6',
    orderNumber: '#ORD-7229',
    buyer: 'Siti Aminah',
    buyerEmail: 'siti.a@email.com',
    store: 'Fashion Hub',
    items: 2,
    totalAmount: 1500000,
    paymentStatus: 'Pending',
    status: 'processing',
  },
];