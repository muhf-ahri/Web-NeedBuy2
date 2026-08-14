// src/pages/admin/data/reportsData.ts
export type ReportCategory = 'Product' | 'Seller' | 'Review';
export type ReportPriority = 'High' | 'Medium' | 'Low';
export type ReportStatus = 'Open' | 'Investigating' | 'Resolved';

export interface Report {
  id: string;
  reportId: string;
  category: ReportCategory;
  reporter: string;
  entity: string;
  priority: ReportPriority;
  status: ReportStatus;
  createdAt: string;
}

export const DUMMY_REPORTS: Report[] = [
  {
    id: '1',
    reportId: '#RPT-8942',
    category: 'Product',
    reporter: 'john.doe@example.com',
    entity: 'Fake Rolex Watch',
    priority: 'High',
    status: 'Open',
    createdAt: '2024-10-24',
  },
  {
    id: '2',
    reportId: '#RPT-8941',
    category: 'Seller',
    reporter: 'sarah.m@example.com',
    entity: 'TechGadgets Store',
    priority: 'Medium',
    status: 'Investigating',
    createdAt: '2024-10-23',
  },
  {
    id: '3',
    reportId: '#RPT-8940',
    category: 'Review',
    reporter: 'system.auto@nexus.com',
    entity: 'Review #9921',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2024-10-22',
  },
  {
    id: '4',
    reportId: '#RPT-8939',
    category: 'Product',
    reporter: 'alex.j@example.com',
    entity: 'Counterfeit Smartwatch',
    priority: 'High',
    status: 'Investigating',
    createdAt: '2024-10-21',
  },
  {
    id: '5',
    reportId: '#RPT-8938',
    category: 'Seller',
    reporter: 'emily.w@example.com',
    entity: 'Fashion Hub Store',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2024-10-20',
  },
  {
    id: '6',
    reportId: '#RPT-8937',
    category: 'Review',
    reporter: 'system.auto@nexus.com',
    entity: 'Review #9918',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2024-10-19',
  },
  {
    id: '7',
    reportId: '#RPT-8936',
    category: 'Product',
    reporter: 'mike.r@example.com',
    entity: 'Fake AirPods Pro',
    priority: 'High',
    status: 'Open',
    createdAt: '2024-10-18',
  },
  {
    id: '8',
    reportId: '#RPT-8935',
    category: 'Seller',
    reporter: 'lisa.c@example.com',
    entity: 'Gadget World Store',
    priority: 'Medium',
    status: 'Investigating',
    createdAt: '2024-10-17',
  },
];