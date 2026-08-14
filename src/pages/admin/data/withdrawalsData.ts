// src/pages/admin/data/withdrawalsData.ts
export type WithdrawalStatus = 'pending' | 'approved' | 'processed' | 'rejected';

export interface Withdrawal {
  id: string;
  withdrawalId: string;
  seller: string;
  sellerId: string;
  storeName: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  routingNumber: string;
  requestedDate: string;
  status: WithdrawalStatus;
}

export const DUMMY_WITHDRAWALS: Withdrawal[] = [
  {
    id: '1',
    withdrawalId: '#WD-8923',
    seller: 'Tech Central',
    sellerId: 'S-001',
    storeName: 'Tech Central',
    amount: 4250000,
    bankName: 'Bank Central Asia',
    bankAccount: '****4921',
    routingNumber: '******89',
    requestedDate: '2024-10-24',
    status: 'pending',
  },
  {
    id: '2',
    withdrawalId: '#WD-8922',
    seller: 'Lumina Studio',
    sellerId: 'S-002',
    storeName: 'Lumina Studio',
    amount: 1120500,
    bankName: 'Bank Mandiri',
    bankAccount: '****8820',
    routingNumber: '******33',
    requestedDate: '2024-10-23',
    status: 'approved',
  },
  {
    id: '3',
    withdrawalId: '#WD-8921',
    seller: 'Global Wares',
    sellerId: 'S-003',
    storeName: 'Global Wares',
    amount: 8500000,
    bankName: 'Bank Rakyat Indonesia',
    bankAccount: '****1192',
    routingNumber: '******45',
    requestedDate: '2024-10-22',
    status: 'pending',
  },
  {
    id: '4',
    withdrawalId: '#WD-8920',
    seller: 'Fashion Hub',
    sellerId: 'S-004',
    storeName: 'Fashion Hub',
    amount: 3200000,
    bankName: 'Bank Negara Indonesia',
    bankAccount: '****7733',
    routingNumber: '******12',
    requestedDate: '2024-10-21',
    status: 'processed',
  },
  {
    id: '5',
    withdrawalId: '#WD-8919',
    seller: 'Gadget World',
    sellerId: 'S-005',
    storeName: 'Gadget World',
    amount: 5600000,
    bankName: 'Bank Danamon',
    bankAccount: '****5544',
    routingNumber: '******78',
    requestedDate: '2024-10-20',
    status: 'rejected',
  },
  {
    id: '6',
    withdrawalId: '#WD-8918',
    seller: 'Home Living',
    sellerId: 'S-006',
    storeName: 'Home Living',
    amount: 2150000,
    bankName: 'Bank Permata',
    bankAccount: '****3321',
    routingNumber: '******56',
    requestedDate: '2024-10-19',
    status: 'pending',
  },
  {
    id: '7',
    withdrawalId: '#WD-8917',
    seller: 'Electro Store',
    sellerId: 'S-007',
    storeName: 'Electro Store',
    amount: 7800000,
    bankName: 'Bank OCBC NISP',
    bankAccount: '****9988',
    routingNumber: '******23',
    requestedDate: '2024-10-18',
    status: 'approved',
  },
];

export const statusLabel: Record<WithdrawalStatus, string> = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  processed: 'Diproses',
  rejected: 'Ditolak',
};

export const statusColor: Record<WithdrawalStatus, string> = {
  pending: 'bg-[#fff4e0] text-[#b45309]',
  approved: 'bg-[#d7f5dc] text-[#156b32]',
  processed: 'bg-[#cfe8ff] text-[#0057b8]',
  rejected: 'bg-[#ffe0e0] text-[#a33131]',
};