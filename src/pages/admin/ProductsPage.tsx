// src/pages/admin/ProductsPage.tsx
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import FilterBar from '../../components/ui/filter/FilterBar';
import Pagination from '../../components/ui/Pagination';
import { formatRupiah } from '../../utils/currency';

type ProductStatus = 'Approved' | 'Pending' | 'Rejected' | 'Reported' | 'Investigating';
type Severity = 'Low' | 'Medium' | 'High';
type SortField = 'name' | 'seller' | 'category' | 'price' | 'stock' | 'status' | 'createdAt';

interface Product {
  id: string;
  name: string;
  sku: string;
  seller: string;
  sellerId: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt?: string;
  reportReason?: string;
  reportCount?: number;
  severity?: Severity;
}

// Dummy data All Products
const dummyAllProducts: Product[] = [
  { id: '1', name: 'Sony WH-1000XM5 Wireless...', sku: 'EL-SNY-WH5-BLK', seller: 'Tech Haven', sellerId: 's1', category: 'Electronics', price: 3480000, stock: 42, status: 'Approved', createdAt: '2024-01-15' },
  { id: '2', name: 'Minimalist Leather Crossbody Bag', sku: 'FA-BG-LTH-TAN', seller: 'Urban Style Co.', sellerId: 's2', category: 'Fashion', price: 899900, stock: 15, status: 'Approved', createdAt: '2024-02-20' },
  { id: '3', name: 'Vanguard Smart Watch Series 8', sku: 'EL-VG-SW8-MTL', seller: 'Tech Haven', sellerId: 's1', category: 'Electronics', price: 2990000, stock: 8, status: 'Approved', createdAt: '2024-03-10' },
  { id: '4', name: 'Oversized Cotton Graphic Tee', sku: 'FA-TS-OSZ-WHT', seller: 'Urban Style Co.', sellerId: 's2', category: 'Fashion', price: 345000, stock: 120, status: 'Pending', createdAt: '2024-04-01' },
  { id: '5', name: 'Universal Fast Charger 65W', sku: 'EL-CH-65W-BLK', seller: 'Global Gadgets', sellerId: 's3', category: 'Electronics', price: 129900, stock: 500, status: 'Rejected', createdAt: '2024-04-05' },
  { id: '6', name: 'Artisan Ceramic Mug Set', sku: 'HM-MUG-ART-WHT', seller: 'Earth & Fire Goods', sellerId: 's4', category: 'Home & Living', price: 450000, stock: 30, status: 'Approved', createdAt: '2024-04-10' },
  { id: '7', name: 'SonicBlast ANC Headphones', sku: 'EL-SB-ANC-BLK', seller: 'Audio World', sellerId: 's5', category: 'Electronics', price: 2495000, stock: 12, status: 'Pending', createdAt: '2024-04-12' },
  { id: '8', name: 'Urban Commuter Backpack', sku: 'BG-URB-COM-BLK', seller: 'Urban Style Co.', sellerId: 's2', category: 'Fashion', price: 890000, stock: 25, status: 'Approved', createdAt: '2024-01-20' },
];

// Dummy data Pending
const dummyPendingProducts: Product[] = [
  { id: 'p1', name: 'Wireless Mechanical Keyboard Pro', sku: 'EL-MK-WL-PRO', seller: 'Tech Haven', sellerId: 's1', category: 'Electronics > Accessories', price: 4500000, stock: 10, status: 'Pending', createdAt: 'Oct 23, 2023' },
  { id: 'p2', name: 'Artisan Ceramic Mug Set', sku: 'HM-MUG-ART-WHT', seller: 'Earth & Fire Goods', sellerId: 's4', category: 'Home > Kitchenware', price: 450000, stock: 30, status: 'Pending', createdAt: 'Oct 23, 2023' },
  { id: 'p3', name: 'SonicBlast ANC Headphones', sku: 'EL-SB-ANC-BLK', seller: 'Audio World', sellerId: 's5', category: 'Electronics > Audio', price: 2495000, stock: 12, status: 'Pending', createdAt: 'Oct 22, 2023' },
  { id: 'p4', name: 'Urban Commuter Backpack', sku: 'BG-URB-COM-BLK', seller: 'Urban Style Co.', sellerId: 's2', category: 'Apparel > Bags', price: 890000, stock: 25, status: 'Pending', createdAt: 'Oct 21, 2023' },
];

// Dummy data Reported
const dummyReportedProducts: Product[] = [
  { id: 'r1', name: 'Luxury Timepieces Direct', sku: 'PRD-9824', seller: 'Timepieces Direct', sellerId: 's6', category: 'Watches', price: 0, stock: 0, status: 'Investigating', reportReason: 'Counterfeit Item', reportCount: 12, severity: 'High', createdAt: 'Oct 20, 2023' },
  { id: 'r2', name: 'Graphic Tee - Slogan', sku: 'PRD-1198', seller: 'Urban Threads', sellerId: 's7', category: 'Fashion', price: 0, stock: 0, status: 'Reported', reportReason: 'Inappropriate Content', reportCount: 2, severity: 'Low', createdAt: 'Oct 19, 2023' },
  { id: 'r3', name: 'Counterfeit Smartwatch X1', sku: 'PRD-2112', seller: 'Global Gadgets', sellerId: 's3', category: 'Electronics', price: 0, stock: 0, status: 'Investigating', reportReason: 'Counterfeit Item', reportCount: 8, severity: 'Medium', createdAt: 'Oct 18, 2023' },
];

const statusColor: Record<ProductStatus, string> = {
  Approved: 'bg-[#d7f5dc] text-[#156b32]',
  Pending: 'bg-[#fff4e0] text-[#b45309]',
  Rejected: 'bg-[#ffe0e0] text-[#a33131]',
  Reported: 'bg-[#ffdad6] text-[#93000a]',
  Investigating: 'bg-[#cfe8ff] text-[#0057b8]',
};

const severityColor: Record<Severity, string> = {
  Low: 'bg-[#f2f4f6] text-[#737686]',
  Medium: 'bg-[#fff4e0] text-[#b45309]',
  High: 'bg-[#ffe0e0] text-[#a33131]',
};

type TabType = 'all' | 'pending' | 'reported';

// Helper untuk mendapatkan opsi filter unik
const getUniqueOptions = (data: Product[], key: keyof Product) => {
  const values = new Set(data.map((item) => String(item[key])));
  return ['All', ...Array.from(values)];
};

const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sellerFilter, setSellerFilter] = useState('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const pageSize = 10;

  // Data berdasarkan tab
  const rawData = useMemo(() => {
    switch (activeTab) {
      case 'all': return dummyAllProducts;
      case 'pending': return dummyPendingProducts;
      case 'reported': return dummyReportedProducts;
      default: return dummyAllProducts;
    }
  }, [activeTab]);

  // Opsi filter
  const categoryOptions = useMemo(() => {
    const opts = getUniqueOptions(rawData, 'category');
    return opts.map((val) => ({ label: val, value: val }));
  }, [rawData]);

  const sellerOptions = useMemo(() => {
    const opts = getUniqueOptions(rawData, 'seller');
    return opts.map((val) => ({ label: val, value: val }));
  }, [rawData]);

  // Filter & sort data
  const filteredData = useMemo(() => {
    let data = [...rawData];

    if (categoryFilter !== 'All') {
      data = data.filter((p) => p.category === categoryFilter);
    }

    if (sellerFilter !== 'All') {
      data = data.filter((p) => p.seller === sellerFilter);
    }

    data.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortField) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'seller':
          valA = a.seller.toLowerCase();
          valB = b.seller.toLowerCase();
          break;
        case 'category':
          valA = a.category.toLowerCase();
          valB = b.category.toLowerCase();
          break;
        case 'price':
          valA = a.price;
          valB = b.price;
          break;
        case 'stock':
          valA = a.stock;
          valB = b.stock;
          break;
        case 'status':
          valA = a.status;
          valB = b.status;
          break;
        case 'createdAt':
          valA = a.createdAt || '';
          valB = b.createdAt || '';
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [rawData, categoryFilter, sellerFilter, sortField, sortOrder]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const toggleSelectProduct = (id: string) => {
    const newSet = new Set(selectedProducts);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedProducts(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === paginatedData.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedData.map((p) => p.id)));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <div className="flex flex-col items-center opacity-30 group-hover:opacity-70 transition-opacity">
          <Icon name="chevronUp" size={10} className="text-[#737686] -mb-0.5" />
          <Icon name="chevronDown" size={10} className="text-[#737686] -mt-0.5" />
        </div>
      );
    }
    const isAsc = sortOrder === 'asc';
    return (
      <div className="flex flex-col items-center">
        <Icon
          name="chevronUp"
          size={10}
          className={`${isAsc ? 'text-[#004ac6]' : 'text-[#c3c6d7]'} -mb-0.5 transition-colors`}
        />
        <Icon
          name="chevronDown"
          size={10}
          className={`${!isAsc ? 'text-[#004ac6]' : 'text-[#c3c6d7]'} -mt-0.5 transition-colors`}
        />
      </div>
    );
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setCategoryFilter('All');
    setSellerFilter('All');
    setSelectedProducts(new Set());
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Products</h1>
          <p className="text-[15px] text-[#737686]">
            Manage and monitor all marketplace products
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#e0e3e5]">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-[#004ac6] text-[#004ac6]'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => handleTabChange('pending')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'pending'
                ? 'border-[#004ac6] text-[#004ac6]'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            Pending Approval
          </button>
          <button
            onClick={() => handleTabChange('reported')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'reported'
                ? 'border-[#004ac6] text-[#004ac6]'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            Reported Products
          </button>
        </div>

        {/* Filter bar */}
        <FilterBar
            filters={[
                {
                key: 'category',
                options: categoryOptions,
                value: categoryFilter,
                onChange: setCategoryFilter,
                },
                {
                key: 'seller',
                options: sellerOptions,
                value: sellerFilter,
                onChange: setSellerFilter,
                },
            ]}
            visibleFilters={2}
            onMoreFilters={() => {}}
        />

        {/* Table */}
        <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-[11px] font-semibold uppercase text-[#737686]">
                  <th className="pb-2 pr-2 text-center w-10">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && selectedProducts.size === paginatedData.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-[#004ac6] cursor-pointer"
                    />
                  </th>

                  {activeTab === 'all' && (
                    <>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Product</span>
                          {renderSortIcon('name')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('seller')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Seller / Store</span>
                          {renderSortIcon('seller')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Category</span>
                          {renderSortIcon('category')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Price</span>
                          {renderSortIcon('price')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('stock')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Stock</span>
                          {renderSortIcon('stock')}
                        </div>
                      </th>
                      <th
                        className="pb-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Status</span>
                          {renderSortIcon('status')}
                        </div>
                      </th>
                    </>
                  )}

                  {activeTab === 'pending' && (
                    <>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Product</span>
                          {renderSortIcon('name')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('seller')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Seller / Store</span>
                          {renderSortIcon('seller')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Category</span>
                          {renderSortIcon('category')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Submitted Date</span>
                          {renderSortIcon('createdAt')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Price</span>
                          {renderSortIcon('price')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Status</span>
                          {renderSortIcon('status')}
                        </div>
                      </th>
                      <th className="pb-2 text-center">Actions</th>
                    </>
                  )}

                  {activeTab === 'reported' && (
                    <>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Product</span>
                          {renderSortIcon('name')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('seller')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Seller / Store</span>
                          {renderSortIcon('seller')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Category / ID</span>
                          {renderSortIcon('category')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Reason</span>
                          {renderSortIcon('status')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('stock')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Reports</span>
                          {renderSortIcon('stock')}
                        </div>
                      </th>
                      <th
                        className="pb-2 pr-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Severity</span>
                          {renderSortIcon('price')}
                        </div>
                      </th>
                      <th
                        className="pb-2 text-center group cursor-pointer select-none hover:text-[#004ac6] transition-colors"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Status</span>
                          {renderSortIcon('status')}
                        </div>
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-[#737686]">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((product) => (
                    <tr key={product.id} className="text-[13px] hover:bg-[#f8f9fb] transition-colors">
                      <td className="py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                          className="w-4 h-4 accent-[#004ac6] cursor-pointer"
                        />
                      </td>

                      {activeTab === 'all' && (
                        <>
                          <td className="py-2.5 text-center font-medium text-[#191c1e]">
                            <div>{product.name}</div>
                            <div className="text-[11px] text-[#737686] font-normal">{product.sku}</div>
                          </td>
                          <td className="py-2.5 text-center">{product.seller}</td>
                          <td className="py-2.5 text-center text-[#434655]">{product.category}</td>
                          <td className="py-2.5 text-center font-semibold text-[#004ac6]">
                            {formatRupiah(product.price)}
                          </td>
                          <td className="py-2.5 text-center">{product.stock}</td>
                          <td className="py-2.5 text-center">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[product.status]}`}>
                              {product.status}
                            </span>
                          </td>
                        </>
                      )}

                      {activeTab === 'pending' && (
                        <>
                          <td className="py-2.5 text-center font-medium text-[#191c1e]">{product.name}</td>
                          <td className="py-2.5 text-center">
                            <div>{product.seller}</div>
                            <div className="text-[11px] text-[#737686]">ID: #{product.sellerId}</div>
                          </td>
                          <td className="py-2.5 text-center text-[#434655]">{product.category}</td>
                          <td className="py-2.5 text-center text-[#737686]">{product.createdAt}</td>
                          <td className="py-2.5 text-center font-semibold text-[#004ac6]">
                            {formatRupiah(product.price)}
                          </td>
                          <td className="py-2.5 text-center">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[product.status]}`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button className="p-1.5 rounded-lg text-[#156b32] hover:bg-[#d7f5dc] transition-colors" title="Approve">
                                <Icon name="check" size={16} />
                              </button>
                              <button className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffe0e0] transition-colors" title="Reject">
                                <Icon name="close" size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}

                      {activeTab === 'reported' && (
                        <>
                          <td className="py-2.5 text-center font-medium text-[#191c1e]">
                            <div>{product.name}</div>
                            <div className="text-[11px] text-[#737686] font-normal">ID: {product.sku}</div>
                          </td>
                          <td className="py-2.5 text-center">{product.seller}</td>
                          <td className="py-2.5 text-center text-[#434655]">{product.category}</td>
                          <td className="py-2.5 text-center text-[#ba1a1a]">{product.reportReason}</td>
                          <td className="py-2.5 text-center font-semibold">{product.reportCount}</td>
                          <td className="py-2.5 text-center">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityColor[product.severity as Severity]}`}>
                              {product.severity}
                            </span>
                          </td>
                          <td className="py-2.5 text-center">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[product.status]}`}>
                              {product.status}
                            </span>
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

        {/* Bulk action */}
        {selectedProducts.size > 0 && (
          <div className="flex items-center justify-between rounded-2xl border border-[#e0e3e5] bg-[#f2f4f6] p-3">
            <span className="text-[13px] text-[#434655]">
              {selectedProducts.size} product(s) selected
            </span>
            <button className="rounded-full bg-[#ba1a1a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#9a1515]">
              Delete Selected
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;