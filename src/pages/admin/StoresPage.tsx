// src/pages/admin/StoresPage.tsx
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import Pagination from '../../components/ui/Pagination';
import { formatRupiah } from '../../utils/currency';

type StoreStatus = 'Active' | 'Inactive' | 'Suspended';

interface Store {
  id: string;
  storeName: string;
  domain: string;
  products: number;
  orders: number;
  revenue: number;
  rating: number;
  status: StoreStatus;
  createdAt: string;
}

const dummyStores: Store[] = [
  { id: '1', storeName: 'TechHaven Electronics', domain: 'techhaven.com', products: 1245, orders: 8592, revenue: 245900, rating: 4.8, status: 'Active', createdAt: 'Oct 12, 2023' },
  { id: '2', storeName: 'Green Valley Organics', domain: 'greenvalley.net', products: 342, orders: 1204, revenue: 34250, rating: 4.5, status: 'Inactive', createdAt: 'Jan 05, 2024' },
  { id: '3', storeName: 'Apex Sports Gear', domain: 'apexsports.com', products: 89, orders: 432, revenue: 12400, rating: 2.8, status: 'Suspended', createdAt: 'Feb 20, 2024' },
  { id: '4', storeName: 'Lumina Home', domain: 'luminahome.co', products: 512, orders: 3210, revenue: 89500, rating: 4.9, status: 'Active', createdAt: 'Mar 15, 2023' },
  { id: '5', storeName: 'Gadget World', domain: 'gadgetworld.com', products: 230, orders: 1100, revenue: 45000, rating: 4.2, status: 'Active', createdAt: 'Jan 10, 2024' },
  { id: '6', storeName: 'Fashionista Boutique', domain: 'fashionista.id', products: 78, orders: 560, revenue: 28900, rating: 4.0, status: 'Inactive', createdAt: 'Dec 01, 2023' },
];

const statusColor: Record<StoreStatus, string> = {
  Active: 'bg-[#d7f5dc] text-[#156b32]',
  Inactive: 'bg-[#f2f4f6] text-[#737686]',
  Suspended: 'bg-[#ffe0e0] text-[#a33131]',
};

const StoresPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());
  const pageSize = 10;

  // Filtering bisa ditambahkan nanti, untuk sekarang hanya data statis
  const filteredData = dummyStores;
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const toggleSelectStore = (id: string) => {
    const newSet = new Set(selectedStores);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedStores(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedStores.size === paginatedData.length) {
      setSelectedStores(new Set());
    } else {
      setSelectedStores(new Set(paginatedData.map(s => s.id)));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Stores</h1>
          <p className="text-[15px] text-[#737686]">Manage and monitor marketplace stores, their ratings, and performance.</p>
        </div>

        {/* Filter bar (tanpa search) */}
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-3 py-2 rounded-full border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition bg-white">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
          <select className="px-3 py-2 rounded-full border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition bg-white">
            <option>All Ratings</option>
            <option>★ 4.5 & above</option>
            <option>★ 4.0 & above</option>
            <option>★ 3.0 & above</option>
          </select>
          <button className="px-4 py-2 rounded-full border border-[#c3c6d7] text-sm text-[#434655] hover:border-[#004ac6] hover:text-[#004ac6] transition-colors">
            More Filters
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
                  <th className="pb-2 pr-2 text-center w-10">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && selectedStores.size === paginatedData.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-[#004ac6] cursor-pointer"
                    />
                  </th>
                  <th className="pb-2 pr-2 text-center">Store</th>
                  <th className="pb-2 pr-2 text-center">Products</th>
                  <th className="pb-2 pr-2 text-center">Orders</th>
                  <th className="pb-2 pr-2 text-center">Revenue</th>
                  <th className="pb-2 pr-2 text-center">Rating</th>
                  <th className="pb-2 pr-2 text-center">Status</th>
                  <th className="pb-2 pr-2 text-center">Created Date</th>
                  <th className="pb-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-[#737686]">No stores found.</td>
                  </tr>
                ) : (
                  paginatedData.map((store) => (
                    <tr key={store.id} className="text-[13px] hover:bg-[#f8f9fb] transition-colors">
                      <td className="py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedStores.has(store.id)}
                          onChange={() => toggleSelectStore(store.id)}
                          className="w-4 h-4 accent-[#004ac6] cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 text-center font-medium text-[#191c1e]">{store.storeName}</td>
                      <td className="py-2.5 text-center">{store.products.toLocaleString()}</td>
                      <td className="py-2.5 text-center">{store.orders.toLocaleString()}</td>
                      <td className="py-2.5 text-center font-semibold text-[#004ac6]">
                        {formatRupiah(store.revenue * 1000)} {/* dummy, agar terlihat nominal */}
                      </td>
                      <td className="py-2.5 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <Icon name="star" size={14} className="text-[#f59e0b]" />
                          {store.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[store.status]}`}>
                          {store.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-center text-[#737686]">{store.createdAt}</td>
                      <td className="py-2.5 text-center">
                        <button className="text-[#004ac6] hover:underline">
                          <Icon name="eye" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 pt-4 border-t border-[#e0e3e5]">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                showTotal={true}
              />
            </div>
          )}
        </div>

        {/* Bulk action (misal delete) — sementara hanya tampilan */}
        {selectedStores.size > 0 && (
          <div className="flex justify-between items-center p-3 rounded-2xl bg-[#f2f4f6] border border-[#e0e3e5]">
            <span className="text-[13px] text-[#434655]">{selectedStores.size} store(s) selected</span>
            <button className="px-4 py-2 rounded-full bg-[#ba1a1a] text-white text-sm font-semibold hover:bg-[#9a1515] transition-colors">
              Delete Selected
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default StoresPage;