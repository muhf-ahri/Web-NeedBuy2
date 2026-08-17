import React from 'react';

import ProductsCardItem from './ProductsCardItem';
import type { InventProduct, ProductStatus } from '../../api/invent';

interface ProductsMobileListProps {
  products: InventProduct[];
  getStatus: (p: InventProduct) => ProductStatus;
  onEdit: (p: InventProduct) => void;
  onDelete: (p: InventProduct) => void;
}

const ProductsMobileList: React.FC<ProductsMobileListProps> = ({
  products,
  getStatus,
  onEdit,
  onDelete,
}) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
    {products.map((product) => (
      <ProductsCardItem
        key={product.id}
        product={product}
        status={getStatus(product)}
        onEdit={() => onEdit(product)}
        onDelete={() => onDelete(product)}
      />
    ))}
  </div>
);

export default ProductsMobileList;