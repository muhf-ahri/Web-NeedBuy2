// src/pages/seller/ProductsPage.tsx
import React, { useState } from 'react';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { formatRupiah } from '../../utils/currency';

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const products = [
    { id: 1, name: 'Mechanical Keyboard', category: 'Electronics', price: 150000, stock: 50, status: 'Active' },
    { id: 2, name: 'Wireless Mouse', category: 'Electronics', price: 45000, stock: 45, status: 'Active' },
    { id: 3, name: 'Laptop Stand', category: 'Electronics', price: 30000, stock: 0, status: 'Out of Stock' },
    { id: 4, name: 'Desk Mat', category: 'Electronics', price: 25000, stock: 25, status: 'Draft' },
    { id: 5, name: 'Wireless Mouse', category: 'Electronics', price: 45000, stock: 45, status: 'Active' },
  ];

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusCounts = {
    active: products.filter(p => p.status === 'Active').length,
    outOfStock: products.filter(p => p.status === 'Out of Stock').length,
    drafts: products.filter(p => p.status === 'Draft').length,
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">My Products</h1>
          <p className="text-[15px] text-[#737686]">Manage your inventory and product listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-4 text-center">
            <p className="text-[11px] font-semibold text-[#737686] uppercase">Active Listings</p>
            <p className="text-[24px] font-bold text-[#191c1e]">{statusCounts.active}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-4 text-center">
            <p className="text-[11px] font-semibold text-[#737686] uppercase">Out of Stock</p>
            <p className="text-[24px] font-bold text-[#ba1a1a]">{statusCounts.outOfStock}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-4 text-center">
            <p className="text-[11px] font-semibold text-[#737686] uppercase">Drafts</p>
            <p className="text-[24px] font-bold text-[#737686]">{statusCounts.drafts}</p>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 rounded-full border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition"
            />
          </div>
          <Button variant="primary" className="px-5 py-2 text-sm">
            <Icon name="plus" size={16} className="mr-1" />
            Add New Product
          </Button>
        </div>

        {/* Product table */}
        <div className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2f4f6] text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Product Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock Level</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e3e5]">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 bg-[#f2f4f6] rounded-lg flex items-center justify-center text-[#737686]">
                        <Icon name="product" size={20} />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#191c1e]">{product.name}</td>
                    <td className="px-4 py-3 text-[#434655]">{product.category}</td>
                    <td className="px-4 py-3 font-semibold text-[#004ac6]">{formatRupiah(product.price)}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        product.status === 'Active' ? 'bg-[#d7f5dc] text-[#156b32]' :
                        product.status === 'Out of Stock' ? 'bg-[#ffe0e0] text-[#a33131]' :
                        'bg-[#f2f4f6] text-[#737686]'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-[#737686] hover:text-[#004ac6] p-1">
                        <Icon name="edit" size={16} />
                      </button>
                      <button className="text-[#737686] hover:text-[#004ac6] p-1 ml-1">
                        <Icon name="eye" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default ProductsPage;