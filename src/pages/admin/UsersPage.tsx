// src/pages/admin/UsersPage.tsx
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import Pagination from '../../components/ui/Pagination';
import { formatRupiah } from '../../utils/currency';

type UserRole = 'BUYER' | 'SELLER';
type UserStatus = 'Active' | 'Pending' | 'Suspended';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  storeName?: string;
  productsCount?: number;
  revenue?: number;
}

// Dummy data
const dummyBuyers: User[] = [
  { id: '1', name: 'Eleanor Richards', email: 'eleanor@mail.com', role: 'BUYER', status: 'Active', totalOrders: 24, totalSpent: 1245000, joinedDate: 'Oct 24, 2023' },
  { id: '2', name: 'Robert Klein', email: 'robert@mail.com', role: 'BUYER', status: 'Active', totalOrders: 8, totalSpent: 340500, joinedDate: 'Nov 12, 2023' },
  { id: '3', name: 'Maria Garcia', email: 'maria@mail.com', role: 'BUYER', status: 'Suspended', totalOrders: 0, totalSpent: 0, joinedDate: 'Jan 05, 2024' },
  { id: '4', name: 'James Wilson', email: 'james@mail.com', role: 'BUYER', status: 'Active', totalOrders: 12, totalSpent: 890250, joinedDate: 'Feb 28, 2024' },
  { id: '5', name: 'Sarah Lee', email: 'sarah@mail.com', role: 'BUYER', status: 'Active', totalOrders: 6, totalSpent: 210000, joinedDate: 'Mar 10, 2024' },
];

const dummySellers: User[] = [
  { id: '6', name: 'Sarah Jenkins', email: 'sarah.j@mail.com', role: 'SELLER', status: 'Active', totalOrders: 8432, totalSpent: 0, joinedDate: 'Oct 12, 2023', storeName: 'Tech Haven', productsCount: 1245, revenue: 145200000 },
  { id: '7', name: 'Michael Chen', email: 'michael@mail.com', role: 'SELLER', status: 'Pending', totalOrders: 1024, totalSpent: 0, joinedDate: 'Nov 05, 2023', storeName: 'Urban Styles', productsCount: 342, revenue: 32800000 },
  { id: '8', name: 'Elena Rodriguez', email: 'elena@mail.com', role: 'SELLER', status: 'Suspended', totalOrders: 0, totalSpent: 0, joinedDate: 'Jan 22, 2024', storeName: 'Casa Decor', productsCount: 89, revenue: 0 },
  { id: '9', name: 'David Kim', email: 'david@mail.com', role: 'SELLER', status: 'Active', totalOrders: 320, totalSpent: 0, joinedDate: 'Dec 01, 2023', storeName: 'Gadget World', productsCount: 56, revenue: 12500000 },
];

const statusOptions = ['All Statuses', 'Active', 'Pending', 'Suspended'];
const categoryOptions = ['All Categories', 'Electronics', 'Fashion', 'Food', 'Beauty', 'Home'];

const statusColor: Record<UserStatus, string> = {
  Active: 'bg-[#d7f5dc] text-[#156b32]',
  Pending: 'bg-[#fff4e0] text-[#b45309]',
  Suspended: 'bg-[#ffe0e0] text-[#a33131]',
};

const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter data berdasarkan status
  const getFilteredData = () => {
    const data = activeTab === 'BUYER' ? dummyBuyers : dummySellers;
    let filtered = data;

    if (statusFilter !== 'All Statuses') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    return filtered;
  };

  const filteredData = getFilteredData();
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Marketplace Admin</h1>
          <p className="text-[15px] text-[#737686]">
            {activeTab === 'BUYER'
              ? 'Manage and monitor all registered customers.'
              : 'Manage and verify marketplace sellers and their stores.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#e0e3e5]">
          <button
            onClick={() => {
              setActiveTab('BUYER');
              setCurrentPage(1);
              setStatusFilter('All Statuses');
            }}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'BUYER'
                ? 'border-[#004ac6] text-[#004ac6]'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            Buyers
          </button>
          <button
            onClick={() => {
              setActiveTab('SELLER');
              setCurrentPage(1);
              setStatusFilter('All Statuses');
            }}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'SELLER'
                ? 'border-[#004ac6] text-[#004ac6]'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            Sellers
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-full border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition bg-white"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          {activeTab === 'SELLER' && (
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-full border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition bg-white"
            >
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

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
                  {activeTab === 'BUYER' ? (
                    <>
                      <th className="pb-2 text-center w-[25%]">Name</th>
                      <th className="pb-2 text-center w-[15%]">Total Orders</th>
                      <th className="pb-2 text-center w-[20%]">Total Spent</th>
                      <th className="pb-2 text-center w-[15%]">Status</th>
                      <th className="pb-2 text-center w-[20%]">Joined Date</th>
                      <th className="pb-2 text-center w-[5%]">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="pb-2 text-center w-[15%]">Seller</th>
                      <th className="pb-2 text-center w-[18%]">Store Name</th>
                      <th className="pb-2 text-center w-[10%]">Products</th>
                      <th className="pb-2 text-center w-[10%]">Orders</th>
                      <th className="pb-2 text-center w-[15%]">Revenue</th>
                      <th className="pb-2 text-center w-[12%]">Status</th>
                      <th className="pb-2 text-center w-[15%]">Joined Date</th>
                      <th className="pb-2 text-center w-[5%]">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={activeTab === 'BUYER' ? 6 : 8}
                      className="py-10 text-center text-[#737686]"
                    >
                      No {activeTab === 'BUYER' ? 'buyers' : 'sellers'} found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((user) => (
                    <tr key={user.id} className="text-[13px]">
                      {activeTab === 'BUYER' ? (
                        <>
                          <td className="py-2.5 text-center font-medium text-[#191c1e]">{user.name}</td>
                          <td className="py-2.5 text-center">{user.totalOrders}</td>
                          <td className="py-2.5 text-center font-semibold">{formatRupiah(user.totalSpent)}</td>
                          <td className="py-2.5 text-center">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[user.status]}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-center text-[#737686]">{user.joinedDate}</td>
                          <td className="py-2.5 text-center">
                            <button className="text-[#004ac6] hover:underline">
                              <Icon name="eye" size={16} />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2.5 text-center font-medium text-[#191c1e]">{user.name}</td>
                          <td className="py-2.5 text-center font-medium text-[#004ac6]">{user.storeName || '—'}</td>
                          <td className="py-2.5 text-center">{user.productsCount ?? 0}</td>
                          <td className="py-2.5 text-center">{user.totalOrders}</td>
                          <td className="py-2.5 text-center font-semibold">{user.revenue ? formatRupiah(user.revenue) : 'Rp 0'}</td>
                          <td className="py-2.5 text-center">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[user.status]}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-center text-[#737686]">{user.joinedDate}</td>
                          <td className="py-2.5 text-center">
                            <button className="text-[#004ac6] hover:underline">
                              <Icon name="eye" size={16} />
                            </button>
                          </td>
                        </>
                      )}
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
      </div>
    </AdminLayout>
  );
};

export default UsersPage;