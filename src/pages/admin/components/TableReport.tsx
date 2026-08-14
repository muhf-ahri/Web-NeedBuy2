// src/pages/admin/components/ReportTable.tsx
import React from 'react';
import Icon from '../../../components/ui/Icon';
import type { Report, ReportPriority, ReportStatus } from '../data/reportsData';

interface ReportTableProps {
  reports: Report[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const priorityColor: Record<ReportPriority, string> = {
  High: 'bg-[#ffe0e0] text-[#a33131]',
  Medium: 'bg-[#fff4e0] text-[#b45309]',
  Low: 'bg-[#f2f4f6] text-[#737686]',
};

const statusColor: Record<ReportStatus, string> = {
  Open: 'bg-[#ffe0e0] text-[#a33131]',
  Investigating: 'bg-[#cfe8ff] text-[#0057b8]',
  Resolved: 'bg-[#d7f5dc] text-[#156b32]',
};

const priorityLabel: Record<ReportPriority, string> = {
  High: 'Tinggi',
  Medium: 'Sedang',
  Low: 'Rendah',
};

const statusLabel: Record<ReportStatus, string> = {
  Open: 'Terbuka',
  Investigating: 'Diselidiki',
  Resolved: 'Selesai',
};

const categoryLabel: Record<Report['category'], string> = {
  Product: 'Produk',
  Seller: 'Penjual',
  Review: 'Ulasan',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const TableReport: React.FC<ReportTableProps> = ({
  reports,
  isLoading = false,
  emptyMessage = 'Tidak ada laporan.',
}) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={7} className="py-10 text-center text-[#737686]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#004ac6] border-t-transparent" />
          <span className="ml-2">Memuat…</span>
        </td>
      </tr>
    );
  }

  if (reports.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="py-10 text-center text-[#737686]">
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return (
    <>
      {reports.map((report) => (
        <tr key={report.id} className="text-[13px] transition-colors hover:bg-[#f8f9fb]">
          <td className="py-2.5 pr-2 font-medium text-[#004ac6]">
            {report.reportId}
          </td>
          <td className="py-2.5 pr-2">
            <span className="rounded-full bg-[#f2f4f6] px-2 py-0.5 text-[11px] font-semibold text-[#434655]">
              {categoryLabel[report.category]}
            </span>
          </td>
          <td className="py-2.5 pr-2 text-[#737686]">{report.reporter}</td>
          <td className="py-2.5 pr-2 text-[#191c1e]">{report.entity}</td>
          <td className="py-2.5 pr-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityColor[report.priority]}`}
            >
              {priorityLabel[report.priority]}
            </span>
          </td>
          <td className="py-2.5 pr-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[report.status]}`}
            >
              {statusLabel[report.status]}
            </span>
          </td>
          <td className="py-2.5 pr-2 text-[#737686]">{formatDate(report.createdAt)}</td>
          <td className="py-2.5">
            <button
              className="rounded-lg p-1.5 text-[#737686] transition-colors hover:bg-[#f2f4f6] hover:text-[#004ac6]"
              aria-label="Detail laporan"
            >
              <Icon name="eye" size={16} />
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableReport;