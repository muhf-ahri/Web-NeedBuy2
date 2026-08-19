import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import Icon from '../ui/Icon';
import { useCategories } from '../../hooks/useCategories';
import { getProductsByCategory } from '../../api/products';
import { addToCart } from '../../api/cart';
import { getAccessToken } from '../../api/auth';
import { useCart } from '../../contexts/CartContext';
import { formatRupiah } from '../../utils/currency';
import type { Category, Product } from '../../types';

const PREVIEW_LIMIT = 6;

const previewCache = new Map<string, Product[]>();

const primaryImage = (product: Product) =>
  product.images?.find((image) => image.isPrimary)?.url ?? product.images?.[0]?.url ?? null;

const PreviewCard: React.FC<{
  product: Product;
  onNavigate: () => void;
  onAdd: (product: Product) => void;
  adding: boolean;
}> = ({ product, onNavigate, onAdd, adding }) => {
  const image = primaryImage(product);
  const soldOut = product.stock <= 0;

  return (
    <div className="group/card relative">
      <Link
        to={`/products/${product.slug}`}
        onClick={onNavigate}
        className="
          block rounded-2xl border border-[#e0e3e5] bg-white p-2.5 transition-all
          duration-200 hover:-translate-y-0.5 hover:border-[#004ac6]/40
          hover:shadow-[0_10px_24px_rgba(32,36,45,0.08)]
          focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-[#004ac6]
        "
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F5F7FB]">
          {image ? (
            <img
              src={image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[#A2A8B3]">
              <Icon name="product" size={22} />
            </span>
          )}

          {product.discountPercent > 0 && (
            <span className="absolute left-1.5 top-1.5 rounded-full bg-[#ba1a1a] px-1.5 py-0.5 text-[9px] font-bold text-white">
              -{product.discountPercent}%
            </span>
          )}
          {soldOut && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-[11px] font-bold text-[#737686]">
              Stok habis
            </span>
          )}
        </div>

        <p className="mt-2 line-clamp-2 text-[11.5px] font-semibold leading-snug text-[#101319]">
          {product.name}
        </p>
        <p className="mt-1 text-[12px] font-extrabold text-[#004ac6]">
          {formatRupiah(product.price)}
        </p>
      </Link>

      <button
        type="button"
        onClick={() => onAdd(product)}
        disabled={adding || soldOut}
        aria-label={`Masukkan ${product.name} ke keranjang`}
        className="
          absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center
          rounded-full bg-[#004ac6] text-white opacity-0 shadow-[0_4px_12px_rgba(83,140,219,0.45)]
          transition-all duration-200 hover:bg-[#004ac6]
          group-hover/card:opacity-100 focus-visible:opacity-100
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101319]
          disabled:cursor-not-allowed disabled:bg-[#e0e3e5] disabled:shadow-none
        "
      >
        <Icon name={adding ? 'clock' : 'cart'} size={14} />
      </button>
    </div>
  );
};

interface CategoryMegaMenuProps {
  open: boolean;
  onClose: () => void;
}

const CategoryMegaMenu: React.FC<CategoryMegaMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { refreshCartCount } = useCart();
  const { categories, loading: loadingCategories } = useCategories();

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  // Hanya kategori induk yang jadi baris rail; anaknya tampil sebagai tautan cepat.
  const parents = useMemo(
    () => categories.filter((category) => !category.parentId),
    [categories]
  );

  const active: Category | undefined = useMemo(
    () => parents.find((category) => category.slug === activeSlug),
    [parents, activeSlug]
  );

  useEffect(() => {
    if (open && !activeSlug && parents.length > 0) setActiveSlug(parents[0].slug);
  }, [open, activeSlug, parents]);

  useEffect(() => {
    if (!activeSlug) return;

    const cached = previewCache.get(activeSlug);
    if (cached) {
      setProducts(cached);
      setLoadingProducts(false);
      return;
    }

    let alive = true;
    setLoadingProducts(true);
    getProductsByCategory(activeSlug, { limit: PREVIEW_LIMIT, sort: 'sold' })
      .then(({ data }) => {
        const list = Array.isArray(data) ? data.slice(0, PREVIEW_LIMIT) : [];
        previewCache.set(activeSlug, list);
        if (alive) setProducts(list);
      })
      .catch(() => {
        if (alive) setProducts([]);
      })
      .finally(() => {
        if (alive) setLoadingProducts(false);
      });

    return () => {
      alive = false;
    };
  }, [activeSlug]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const handleAdd = useCallback(
    async (product: Product) => {
      if (!getAccessToken()) {
        onClose();
        navigate('/login');
        return;
      }

      setAddingId(product.id);
      try {
        await addToCart(product.id, 1);
        await refreshCartCount();
        setToast({ text: `${product.name} masuk keranjang`, ok: true });
      } catch (error: any) {
        setToast({
          text:
            error?.response?.data?.error?.message ??
            error?.message ??
            'Gagal masukin ke keranjang, coba lagi ya',
          ok: false,
        });
      } finally {
        setAddingId(null);
      }
    },
    [navigate, onClose, refreshCartCount]
  );

  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="
            absolute left-0 top-full z-50 hidden w-[min(58rem,calc(100vw-3rem))]
            max-w-[calc(100vw-2rem)] pt-3 lg:block
          "
        >
          <div className="overflow-hidden rounded-[24px] border border-[#e0e3e5] bg-white shadow-[0_24px_60px_rgba(32,36,45,0.16)]">
            <div className="grid grid-cols-[13rem_1fr]">
              <div className="border-r border-[#e0e3e5] bg-[#f5f7fb] py-3">
                <p className="px-4 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#737686]">
                  Kategori
                </p>

                {loadingCategories ? (
                  <div className="space-y-1.5 px-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="h-8 animate-pulse rounded-lg bg-white/80" />
                    ))}
                  </div>
                ) : parents.length === 0 ? (
                  <p className="px-4 py-6 text-[12px] leading-relaxed text-[#737686]">
                    Belum ada kategori. Cek lagi nanti ya.
                  </p>
                ) : (
                  <ul className="max-h-[19rem] overflow-y-auto px-2">
                    {parents.map((category) => {
                      const isActive = category.slug === activeSlug;
                      return (
                        <li key={category.id}>
                          <Link
                            to={`/categories/${category.slug}`}
                            onMouseEnter={() => setActiveSlug(category.slug)}
                            onFocus={() => setActiveSlug(category.slug)}
                            onClick={onClose}
                            className={`
                              relative flex items-center justify-between gap-2 rounded-xl px-3 py-2
                              text-[12.5px] transition-colors
                              focus-visible:outline-2 focus-visible:outline-offset-1
                              focus-visible:outline-[#004ac6]
                              ${isActive
                                ? 'bg-white font-bold text-[#101319] shadow-[0_2px_8px_rgba(32,36,45,0.06)]'
                                : 'font-semibold text-[#737686] hover:text-[#101319]'}
                            `}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="megaActiveTick"
                                className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#FFD500]"
                                aria-hidden="true"
                              />
                            )}
                            <span className="truncate">{category.name}</span>
                            <Icon
                              name="chevronRight"
                              size={13}
                              className={isActive ? 'text-[#004ac6]' : 'text-[#e0e3e5]'}
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="min-w-0 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-extrabold text-[#101319]">
                      {active?.name ?? 'Pilih kategori'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#737686]">
                      Paling laris di kategori ini
                    </p>
                  </div>

                  {active && (
                    <Link
                      to={`/categories/${active.slug}`}
                      onClick={onClose}
                      className="
                        shrink-0 rounded-full bg-[#f5f7fb] px-3 py-1.5 text-[11px] font-bold
                        text-[#004ac6] transition-colors hover:bg-[#004ac6] hover:text-white
                        focus-visible:outline-2 focus-visible:outline-offset-2
                        focus-visible:outline-[#004ac6]
                      "
                    >
                      Lihat semua
                    </Link>
                  )}
                </div>

                {active?.children && active.children.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {active.children.slice(0, 6).map((child) => (
                      <Link
                        key={child.id}
                        to={`/categories/${child.slug}`}
                        onClick={onClose}
                        className="
                          rounded-full border border-[#e0e3e5] px-2.5 py-1 text-[11px]
                          font-semibold text-[#737686] transition-colors
                          hover:border-[#004ac6] hover:text-[#004ac6]
                          focus-visible:outline-2 focus-visible:outline-offset-2
                          focus-visible:outline-[#004ac6]
                        "
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}

                {loadingProducts ? (
                  <div className="grid grid-cols-3 gap-2.5">
                    {Array.from({ length: PREVIEW_LIMIT }).map((_, index) => (
                      <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-[#F5F7FB]" />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex h-[13rem] flex-col items-center justify-center rounded-2xl bg-[#F5F7FB] text-center">
                    <Icon name="product" size={26} className="mb-2 text-[#A2A8B3]" />
                    <p className="text-[12px] font-bold text-[#101319]">
                      Belum ada barang di sini
                    </p>
                    <p className="mt-1 text-[11px] text-[#737686]">
                      Coba kategori lain di sebelah kiri.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    key={activeSlug ?? 'empty'}
                    initial={{ opacity: reduceMotion ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    className="grid grid-cols-3 gap-2.5"
                  >
                    {products.map((product) => (
                      <PreviewCard
                        key={product.id}
                        product={product}
                        onNavigate={onClose}
                        onAdd={handleAdd}
                        adding={addingId === product.id}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {toast && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  role="status"
                  className={`
                    overflow-hidden px-4 py-2.5 text-[12px] font-semibold
                    ${toast.ok ? 'bg-[#f5f7fb] text-[#004ac6]' : 'bg-[#FFF0F0] text-[#ba1a1a]'}
                  `}
                >
                  {toast.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryMegaMenu;
