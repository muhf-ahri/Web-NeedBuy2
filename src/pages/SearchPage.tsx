import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import ProductCard from '../components/ui/ProductCard';

import SearchShell from '../components/search/SearchShell';
import SearchHero from '../components/search/SearchHero';
import SearchToolbar, { SORT_OPTIONS } from '../components/search/SearchToolbar';
import StoreCard from '../components/search/StoreCard';
import OpenedStoreHeader from '../components/search/OpenedStoreHeader';
import SearchEmptyState from '../components/search/SearchEmptyState';
import SearchErrorBanner from '../components/search/SearchErrorBanner';
import Icon from '../components/ui/Icon';

import { getProducts, type GetProductsParams } from '../api/products';
import { getSeller, searchSellers, type Seller } from '../api/sellers';
import type { Product } from '../types';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [input, setInput] = useState(initialQuery);
  const qFromUrl = searchParams.get('q') ?? '';
  const sellerFromUrl = searchParams.get('seller');

  useEffect(() => {
    setQuery(qFromUrl);
    setInput(qFromUrl);
  }, [qFromUrl]);

  const [sort, setSort] = useState<string>('Relevansi');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Seller[]>([]);
  const [openedStore, setOpenedStore] = useState<Seller | null>(null);
  const [storesError, setStoresError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchResults = useCallback(async () => {
    if (sellerFromUrl) {
      setLoading(true);
      setError(null);
      try {
        const params: GetProductsParams = {
          sellerId: sellerFromUrl,
          limit: 50,
          page: 1,
        };
        if (sort !== 'Relevansi') {
          const opt = SORT_OPTIONS.find((o) => o.label === sort);
          if (opt?.value) params.sort = opt.value;
        }
        const [productRes, sellerRes] = await Promise.all([
          getProducts(params),
          getSeller(sellerFromUrl),
        ]);
        setProducts(Array.isArray(productRes.data) ? productRes.data : []);
        setOpenedStore(sellerRes.data?.data ?? null);
        setStores([]);
        setStoresError(null);
      } catch (err: any) {
        setError(err.message ?? 'Gagal muat produk toko, coba lagi ya');
      } finally {
        setLoading(false);
      }
      return;
    }

    setOpenedStore(null);

    if (!query.trim()) {
      setProducts([]);
      setStores([]);
      setStoresError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params: GetProductsParams = {
        q: query.trim(),
        limit: 50,
        page: 1,
      };
      if (sort !== 'Relevansi') {
        const opt = SORT_OPTIONS.find((o) => o.label === sort);
        if (opt?.value) params.sort = opt.value;
      }

      const [productRes, storeRes] = await Promise.allSettled([
        getProducts(params),
        searchSellers(query.trim(), 6),
      ]);

      if (productRes.status === 'fulfilled') {
        setProducts(Array.isArray(productRes.value?.data) ? productRes.value.data : []);
      } else {
        setProducts([]);
        setError(
          productRes.reason?.message ?? 'Gagal muat hasil pencarian, coba lagi ya'
        );
      }

      if (storeRes.status === 'fulfilled') {
        setStores(storeRes.value.items);
        setStoresError(null);
      } else {
        setStores([]);
        setStoresError(
          storeRes.reason?.message ?? 'Gagal muat daftar toko, coba lagi ya'
        );
      }
    } catch (err: any) {
      setError(err.message ?? 'Gagal muat hasil pencarian, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [query, sort, sellerFromUrl]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestOpen(false);
    navigate(`/search?q=${encodeURIComponent(input.trim())}`);
  };

  const handleClear = () => {
    setInput('');
    setQuery('');
    navigate('/search');
  };

  const handleNavigate = (slug: string) => navigate(`/products/${slug}`);

  const summary = openedStore
    ? loading
      ? 'Bentar, muat produk tokonya...'
      : `${products.length} produk di toko ini`
    : query.trim()
      ? loading
        ? 'Nyari...'
        : `${products.length} produk untuk "${query}"`
      : 'Ketik dulu mau cari produk atau toko apa';

  return (
    <SearchShell>
      <SearchHero
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        suggestOpen={suggestOpen}
        setSuggestOpen={setSuggestOpen}
        onClear={handleClear}
      />

      {error && <SearchErrorBanner message={error} variant="error" />}

      {openedStore && (
        <OpenedStoreHeader
          store={openedStore}
          onClose={() => navigate('/search')}
        />
      )}

      {!openedStore && !loading && storesError && (
        <SearchErrorBanner
          message={`Pencarian toko gagal: ${storesError}`}
          variant="warning"
        />
      )}

      {!openedStore && !loading && stores.length > 0 && (
        <section className="mb-7">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="
                flex h-6 w-6 items-center justify-center rounded-lg
                bg-[#538cbd]/10
              "
            >
              <Icon name="store" size={13} className="text-[#4077a6]" />
            </span>
            <p
              className="
                text-[11px] font-bold uppercase tracking-[0.16em]
                text-[#737686]
              "
            >
              Toko ({stores.length})
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => navigate(`/search?seller=${store.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {(query.trim() || openedStore) && (
        <SearchToolbar
          sort={sort}
          onSortChange={setSort}
          summary={summary}
        />
      )}

      {loading ? (
        <div
          className="
            grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4
            xl:grid-cols-5 2xl:grid-cols-6
          "
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="
                animate-pulse overflow-hidden rounded-2xl border
                border-white/80 bg-white/95
              "
            >
              <div className="aspect-[4/3] bg-[#F5F7FB]" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-20 rounded-full bg-[#F5F7FB]" />
                <div className="h-4 rounded-full bg-[#F5F7FB]" />
                <div className="h-3 w-24 rounded-full bg-[#F5F7FB]" />
                <div className="h-6 w-16 rounded-full bg-[#F5F7FB]" />
              </div>
            </div>
          ))}
        </div>
      ) : !query.trim() && !openedStore ? (
        <SearchEmptyState variant="no-query" />
      ) : openedStore && products.length === 0 ? (
        <SearchEmptyState variant="empty-store" />
      ) : products.length === 0 ? (
        <SearchEmptyState
          variant="no-products"
          query={query}
          hasStores={stores.length > 0}
        />
      ) : (
        <div
          className="
            grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4
            xl:grid-cols-5 2xl:grid-cols-6
          "
        >
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      )}
    </SearchShell>
  );
};

export default SearchPage;