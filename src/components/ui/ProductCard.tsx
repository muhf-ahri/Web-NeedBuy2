import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from './Icon';
import DiscountBadge, { PriceWithDiscount } from './DiscountBadge';
import { addToCart } from '../../api/cart';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../hooks/useWishlist';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onNavigate?: (slug: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { refreshCartCount } = useCart();
  const {
    saved: wishlisted,
    busy: wishlistBusy,
    toggle: toggleWishlist,
  } = useWishlist(product.id);

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80';

  const handleClick = () => {
    if (onNavigate) {
      onNavigate(product.slug);
    } else {
      navigate(`/products/${product.slug}`);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist();
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
      await refreshCartCount();
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      setAdded(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
        group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl
        border border-white/80 bg-white/95 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
        backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5
        hover:shadow-[0_14px_36px_rgba(32,36,45,0.10)]
      "
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F7FB]">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className="
            h-full w-full object-cover transition-transform duration-300
            group-hover:scale-[1.03]
          "
        />

        <DiscountBadge
          discountPercent={product.discountPercent}
          price={product.price}
        />

        <button
          onClick={handleToggleWishlist}
          disabled={wishlistBusy}
          className="
            absolute right-2.5 top-2.5 flex h-8 w-8 items-center
            justify-center rounded-full bg-white/90 shadow-sm
            backdrop-blur-sm transition-all duration-200 hover:bg-white
            hover:shadow-md
          "
          aria-label="Simpan ke wishlist"
        >
          <Icon
            name="heart"
            size={15}
            className={`
              transition-colors duration-200
              ${wishlisted ? 'fill-[#ba1a1a] text-[#ba1a1a]' : 'text-[#737686]'}
            `}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <span
          className="
            block truncate text-[11px] font-semibold uppercase
            tracking-wide text-[#004ac6]
          "
        >
          {product.seller?.storeName ?? 'Toko'}
        </span>

        <h3
          className="
            mt-1 line-clamp-2 flex-1 text-[13px] font-semibold
            leading-snug text-[#101319] transition-colors duration-200
            group-hover:text-[#004ac6]
          "
        >
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1">
        <Icon name="star" size={12} className="shrink-0 text-[#FFD500]" />
        <span className="text-[11px] font-medium text-[#737686]">
            {Number(product.rating ?? 0).toFixed(1)}
        </span>
        <span className="text-[10px] text-[#A2A8B3]">
            ({product.soldCount ?? 0} terjual)
        </span>
        </div>

        <div className="mt-2.5 flex items-end justify-between gap-1">
          <PriceWithDiscount
            price={product.price}
            discountPercent={product.discountPercent}
          />
          <button
            onClick={handleAddToCart}
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-full bg-[#004ac6] text-white shadow-[0_4px_12px_rgba(83,140,219,0.25)]
              transition-all duration-200 hover:bg-[#004ac6]
              hover:shadow-[0_6px_16px_rgba(83,140,219,0.30)]
              active:scale-[0.95]
            "
            aria-label="Tambah ke keranjang"
          >
            {added ? (
              <Icon name="check" size={15} className="text-white" />
            ) : (
              <Icon name="cart" size={15} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;