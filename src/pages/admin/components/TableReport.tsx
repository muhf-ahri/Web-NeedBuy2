import React from 'react';
import type {
  AdminReport,
  ReportPriority,
  ReportStatus,
  ReportTargetType,
} from '../../../api/admin';

interface ReportTableProps {
  reports: AdminReport[];
  isLoading?: boolean;
  emptyMessage?: string;
  onAdvance: (report: AdminReport) => void;
  pendingId?: string | null;
}

const priorityColor: Record<ReportPriority, string> = {
  HIGH: 'bg-[#fff0f0] text-[#93000a]',
  MEDIUM: 'bg-[#fff7e0] text-[#b45309]',
  LOW: 'bg-[#f2f4f6] text-[#737686]',
};

const statusColor: Record<ReportStatus, string> = {
  OPEN: 'bg-[#fff0f0] text-[#93000a]',
  INVESTIGATING: 'bg-[#e4ebf1] text-[#4077a6]',
  RESOLVED: 'bg-[#e6f4ee] text-[#12805c]',
};

export const priorityLabel: Record<ReportPriority, string> = {
  HIGH: 'Tinggi',
  MEDIUM: 'Sedang',
  LOW: 'Rendah',
};

export const statusLabel: Record<ReportStatus, string> = {
  OPEN: 'Terbuka',
  INVESTIGATING: 'Diselidiki',
  RESOLVED: 'Selesai',
};

export const targetLabel: Record<ReportTargetType, string> = {
  PRODUCT: 'Produk',
  SELLER: 'Penjual',
  REVIEW: 'Ulasan',
};

const nextStatus: Record<ReportStatus, ReportStatus | null> = {
  OPEN: 'INVESTIGATING',
  INVESTIGATING: 'RESOLVED',
  RESOLVED: null,
};

const nextActionLabel: Record<ReportStatus, string> = {
  OPEN: 'Selidiki',
  INVESTIGATING: 'Selesaikan',
  RESOLVED: '',
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
  onAdvance,
  pendingId = null,
}) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={8} className="py-10 text-center text-[#737686]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#538cbd] border-t-transparent" />
          <span className="ml-2">Memuat…</span>
        </td>
      </tr>
    );
  }

  if (reports.length === 0) {
    return (
      <tr>
        <td colSpan={8} className="py-10 text-center text-[#737686]">
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return (
    <>
      {reports.map((report) => (
        <tr key={report.id} className="text-[13px] transition-colors hover:bg-[#f5f7fb]">
          
          <td className="py-2.5 pr-2 font-medium text-[#4077a6]">
            #{report.id.slice(0, 8).toUpperCase()}
          </td>
          <td className="py-2.5 pr-2">
            <span className="rounded-full bg-[#f2f4f6] px-2 py-0.5 text-[11px] font-semibold text-[#434655]">
              {targetLabel[report.targetType]}
            </span>
          </td>
          <td className="py-2.5 pr-2 text-[#737686]">{report.reporter.email}</td>
          <td className="py-2.5 pr-2">
            <div className="text-[#101319]">{report.targetLabel}</div>
            <div className="text-[11px] text-[#737686]">{report.reason}</div>
          </td>
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
            {nextStatus[report.status] ? (
              <button
                onClick={() => onAdvance(report)}
                disabled={pendingId === report.id}
                className="rounded-full bg-[#4077a6] px-3 py-1 text-[12px] font-semibold text-white transition-colors hover:bg-[#284a67] disabled:opacity-50"
              >
                {nextActionLabel[report.status]}
              </button>
            ) : (
              <span className="text-[11px] text-[#737686]">: </span>
            )}
          </td>
        </tr>
      ))}
    </>
  );
};

export { nextStatus };
export default TableReport;
