// src/pages/admin/PromotionsPage.tsx
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import VoucherTable from './components/TableVoucher';
import FlashSaleTable from './components/TableFlashSale';
import { DUMMY_VOUCHERS, DUMMY_FLASH_SALE, type Voucher, type FlashSaleProduct } from './data/promotionsData';

type TabType = 'vouchers' | 'flash';

const PAGE_SIZE = 10;

const PromotionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('vouchers');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVouchers = useMemo(() => {
    if (statusFilter === 'all') return DUMMY_VOUCHERS;
    return DUMMY_VOUCHERS.filter((v) => v.status === statusFilter);
  }, [statusFilter]);

  const filteredFlash = useMemo(() => {
    if (statusFilter === 'all') return DUMMY_FLASH_SALE;
    return DUMMY_FLASH_SALE.filter((v) => v.status === statusFilter);
  }, [statusFilter]);

  const currentData = activeTab === 'vouchers' ? filteredVouchers : filteredFlash;
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = currentData.slice(startIndex, startIndex + PAGE_SIZE);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Ditahan', value: 'paused' },
    { label: 'Kadaluwarsa', value: 'expired' },
  ];

  const flashStatusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Berlangsung', value: 'ongoing' },
    { label: 'Akan Datang', value: 'upcoming' },
    { label: 'Selesai', value: 'ended' },
  ];

  const getEmptyMessage = () => {
    if (activeTab === 'vouchers') return 'Belum ada voucher.';
    return 'Belum ada produk flash sale.';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Promotions</h1>
          <p className="text-[15px] text-[#737686]">
            Kelola kampanye diskon dan penawaran spesial.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#e0e3e5]">
          <button
            onClick={() => handleTabChange('vouchers')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'vouchers'
                ? 'border-[#004ac6] text-[#004ac6]'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            Vouchers
          </button>
          <button
            onClick={() => handleTabChange('flash')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'flash'
                ? 'border-[#004ac6] text-[#004ac6]'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            Flash Sale
          </button>
        </div>

        {/* Filter + Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterBar
            filters={[
              {
                key: 'status',
                options: activeTab === 'vouchers' ? statusOptions : flashStatusOptions,
                value: statusFilter,
                onChange: (val) => {
                  setStatusFilter(val);
                  setPage(1);
                },
              },
            ]}
            onMoreFilters={() => {}}
            moreFiltersLabel="More Filters"
            visibleFilters={1}
          />

          <Button
            variant="primary"
            onClick={() => {}}
            className="flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <Icon name="plus" size={16} />
            {activeTab === 'vouchers' ? 'Tambah Voucher' : 'Tambah Flash Sale'}
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
                  {activeTab === 'vouchers' ? (
                    <>
                      <th className="pb-2 pr-2 text-left">Kode / Judul</th>
                      <th className="pb-2 pr-2 text-left">Tipe</th>
                      <th className="pb-2 pr-2 text-left">Nilai</th>
                      <th className="pb-2 pr-2 text-left">Penggunaan</th>
                      <th className="pb-2 pr-2 text-left">Berlaku</th>
                      <th className="pb-2 pr-2 text-left">Status</th>
                      <th className="pb-2 text-left">Aksi</th>
                    </>
                  ) : (
                    <>
                      <th className="pb-2 pr-2 text-left">Produk</th>
                      <th className="pb-2 pr-2 text-left">Seller</th>
                      <th className="pb-2 pr-2 text-left">Diskon</th>
                      <th className="pb-2 pr-2 text-left">Harga Asli</th>
                      <th className="pb-2 pr-2 text-left">Harga Sale</th>
                      <th className="pb-2 pr-2 text-left">Jadwal</th>
                      <th className="pb-2 pr-2 text-left">Status</th>
                      <th className="pb-2 text-left">Aksi</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {activeTab === 'vouchers' ? (
                  <VoucherTable
                    vouchers={paginatedData as Voucher[]}
                    isLoading={false}
                    emptyMessage={getEmptyMessage()}
                  />
                ) : (
                  <FlashSaleTable
                    products={paginatedData as FlashSaleProduct[]}
                    isLoading={false}
                    emptyMessage={getEmptyMessage()}
                  />
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 border-t border-[#e0e3e5] pt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                showTotal
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PromotionsPage;