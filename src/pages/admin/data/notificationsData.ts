// src/pages/admin/data/notificationsData.ts
export type NotificationCategory = 'System' | 'Orders' | 'Payments' | 'Reports';
export type NotificationStatus = 'read' | 'unread';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  status: NotificationStatus;
  createdAt: string;
  actionLabel?: string;
  actionLink?: string;
}

export const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'High CPU Usage Detected',
    message:
      'Database Server-04 is reporting sustained CPU usage above 95% for the last 15 minutes. Recommend investigating active queries.',
    category: 'System',
    status: 'unread',
    createdAt: '2024-10-24T08:30:00',
    actionLabel: 'View Dashboard',
    actionLink: '/admin/dashboard',
  },
  {
    id: '2',
    title: 'Large Payout Successful',
    message:
      'Payout #PY-88921 to Vendor "TechSupply Inc." for $142,500.00 has been processed successfully via Stripe.',
    category: 'Payments',
    status: 'unread',
    createdAt: '2024-10-24T07:15:00',
    actionLabel: 'View Transaction',
    actionLink: '/admin/payments',
  },
  {
    id: '3',
    title: 'Order Volume Spike',
    message:
      'Order volume in the "Electronics" category has increased by 400% in the last hour. Flash sale campaign appears to be driving traffic.',
    category: 'Orders',
    status: 'unread',
    createdAt: '2024-10-24T06:45:00',
    actionLabel: 'View Details',
    actionLink: '/admin/orders',
  },
  {
    id: '4',
    title: 'New Admin Access Request',
    message:
      "User 'sarah.jenkins@nexus.com' is requesting 'Support Tier 2' access privileges.",
    category: 'System',
    status: 'unread',
    createdAt: '2024-10-24T05:20:00',
    actionLabel: 'Review Request',
    actionLink: '/admin/users',
  },
  {
    id: '5',
    title: 'Weekly Sales Report Ready',
    message:
      'Weekly sales report for Oct 14-20 is now available. Total revenue increased by 12.5%.',
    category: 'Reports',
    status: 'read',
    createdAt: '2024-10-23T23:00:00',
    actionLabel: 'View Report',
    actionLink: '/admin/analytics',
  },
  {
    id: '6',
    title: 'Payment Gateway Update',
    message:
      'Midtrans payment gateway has been updated to version 2.1.0. New features include QRIS support.',
    category: 'System',
    status: 'read',
    createdAt: '2024-10-23T20:30:00',
  },
  {
    id: '7',
    title: 'New Order #ORD-7235',
    message:
      'New order #ORD-7235 has been placed by Alex Mercer. Total amount: Rp 4,500,000.',
    category: 'Orders',
    status: 'read',
    createdAt: '2024-10-23T18:45:00',
    actionLabel: 'View Order',
    actionLink: '/admin/orders',
  },
  {
    id: '8',
    title: 'Withdrawal Request #WD-8924',
    message:
      'Vendor "Fashion Hub" has requested withdrawal of $3,200.00. Please review and process.',
    category: 'Payments',
    status: 'read',
    createdAt: '2024-10-23T15:10:00',
    actionLabel: 'Review Request',
    actionLink: '/admin/withdrawals',
  },
  {
    id: '9',
    title: 'Report Resolved: Counterfeit Product',
    message:
      'The report #RPT-8942 (Fake Rolex Watch) has been resolved. Product has been removed from marketplace.',
    category: 'Reports',
    status: 'read',
    createdAt: '2024-10-23T12:00:00',
  },
  {
    id: '10',
    title: 'System Maintenance Scheduled',
    message:
      'Scheduled maintenance for Oct 25, 02:00 AM - 04:00 AM WIB. Expected downtime: 15 minutes.',
    category: 'System',
    status: 'read',
    createdAt: '2024-10-22T10:00:00',
  },
  {
    id: '11',
    title: 'Flash Sale Campaign Launched',
    message:
      'Flash sale campaign "Tech Fest" has been launched. 50 products are now on sale.',
    category: 'Orders',
    status: 'read',
    createdAt: '2024-10-22T09:00:00',
  },
  {
    id: '12',
    title: 'Payment Reconciliation Complete',
    message:
      'Monthly payment reconciliation for September 2024 is complete. All transactions verified.',
    category: 'Payments',
    status: 'read',
    createdAt: '2024-10-21T16:30:00',
  },
];