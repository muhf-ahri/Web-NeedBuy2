// src/pages/admin/data/paymentsData.ts
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
export type PaymentMethod = 'Visa' | 'Mastercard' | 'Bank Transfer' | 'PayPal' | 'QRIS' | 'E-Wallet';

export interface Payment {
  id: string;
  transactionId: string;
  orderId: string;
  buyer: string;
  buyerName: string; // untuk display, bisa sama dengan buyer
  amount: number;
  method: PaymentMethod;
  methodDetails?: string; // misal '•••• 4242'
  status: PaymentStatus;
  date: string;
}

export const DUMMY_PAYMENTS: Payment[] = [
  {
    id: '1',
    transactionId: 'TXN-98273A',
    orderId: 'ORD-5541',
    buyer: 'Sarah Jenkins',
    buyerName: 'Sarah Jenkins',
    amount: 1245000,
    method: 'Visa',
    methodDetails: '•••• 4242',
    status: 'Paid',
    date: '2023-10-24',
  },
  {
    id: '2',
    transactionId: 'TXN-98274B',
    orderId: 'ORD-5542',
    buyer: 'Michael Ross',
    buyerName: 'Michael Ross',
    amount: 349500,
    method: 'Bank Transfer',
    methodDetails: '',
    status: 'Pending',
    date: '2023-10-24',
  },
  {
    id: '3',
    transactionId: 'TXN-98275C',
    orderId: 'ORD-5540',
    buyer: 'Elena Lutor',
    buyerName: 'Elena Lutor',
    amount: 89900,
    method: 'Mastercard',
    methodDetails: '•••• 8812',
    status: 'Failed',
    date: '2023-10-23',
  },
  {
    id: '4',
    transactionId: 'TXN-98271X',
    orderId: 'ORD-5531',
    buyer: 'David Jones',
    buyerName: 'David Jones',
    amount: 450000,
    method: 'PayPal',
    methodDetails: '',
    status: 'Refunded',
    date: '2023-10-22',
  },
  {
    id: '5',
    transactionId: 'TXN-98272Y',
    orderId: 'ORD-5532',
    buyer: 'Maria Garcia',
    buyerName: 'Maria Garcia',
    amount: 275000,
    method: 'QRIS',
    methodDetails: '',
    status: 'Paid',
    date: '2023-10-21',
  },
  {
    id: '6',
    transactionId: 'TXN-98270Z',
    orderId: 'ORD-5530',
    buyer: 'James Lee',
    buyerName: 'James Lee',
    amount: 1200000,
    method: 'E-Wallet',
    methodDetails: 'GoPay',
    status: 'Paid',
    date: '2023-10-20',
  },
];
