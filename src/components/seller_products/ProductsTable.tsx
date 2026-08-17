import React from 'react';

import Icon from '../ui/Icon';
import ProductsTableRow from './ProductsTableRow';
import type { InventProduct, ProductStatus } from '../../api/invent';

type SortableField = 'name' | 'price' | 'stock' | 'createdAt';
interface SortConfig {
  field: SortableField;
  order: 'asc' | 'desc';
}

interface ProductsTableProps {
  products: InventProduct[];
  sort: SortConfig;
  onSort: (field: SortableField) => void;
  getStatus: (p: InventProduct) => ProductStatus;
  onEdit: (p: InventProduct) => void;
  onDelete: (p: InventProduct) => void;
}

const SortIndicator: React.FC<{ active: boolean; asc: boolean }> = ({
  active,
  asc,
}) => (
  <div className="flex flex-col items-center">
    <Icon
      name="chevronUp"
      size={9}
      className={`
        -mb-0.5 transition-colors
        ${active && asc ? 'text-[#538CDB]' : 'text-[#D8DEE9]'}
      `}
    />
    <Icon
      name="chevronDown"
      size={9}
      className={`
        -mt-0.5 transition-colors
        ${active && !asc ? 'text-[#538CDB]' : 'text-[#D8DEE9]'}
      `}
    />
  </div>
);

const Th: React.FC<{
  sortable?: boolean;
  field?: SortableField;
  active: boolean;
  asc: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ sortable, field, active, asc, onClick, children }) => (
  <th
    className={`
      px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider
      text-[#737A87] transition-colors
      ${sortable ? 'cursor-pointer select-none hover:text-[#538CDB]' : ''}
    `}
    onClick={sortable ? onClick : undefined}
  >
    <div
      className={`
        flex items-center justify-center gap-1.5
        ${sortable ? 'group' : ''}
      `}
    >
      <span>{children}</span>
      {sortable && field && <SortIndicator active={active} asc={asc} />}
    </div>
  </th>
);

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  sort,
  onSort,
  getStatus,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-[#F5F7FB] bg-[#F5F7FB]/50">
          <th className="w-[72px] px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#737A87]">
            Gambar
          </th>
          <Th
            sortable
            field="name"
            active={sort.field === 'name'}
            asc={sort.order === 'asc'}
            onClick={() => onSort('name')}
          >
            Nama Produk
          </Th>
          <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#737A87]">
            Kategori
          </th>
          <Th
            sortable
            field="price"
            active={sort.field === 'price'}
            asc={sort.order === 'asc'}
            onClick={() => onSort('price')}
          >
            Harga
          </Th>
          <Th
            sortable
            field="stock"
            active={sort.field === 'stock'}
            asc={sort.order === 'asc'}
            onClick={() => onSort('stock')}
          >
            Sisa Stok
          </Th>
          <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#737A87]">
            Status
          </th>
          <th className="w-[120px] px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#737A87]">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <ProductsTableRow
            key={product.id}
            product={product}
            status={getStatus(product)}
            onEdit={() => onEdit(product)}
            onDelete={() => onDelete(product)}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductsTable;