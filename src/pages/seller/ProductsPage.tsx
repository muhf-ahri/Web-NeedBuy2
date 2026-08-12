// src/pages/seller/ProductsPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { formatRupiah } from '../../utils/currency';
import { getCategories } from '../../api/categories';
import {
  createInvent,
  deleteInvent,
  getInventStats,
  listInvent,
  productStatus,
  updateInvent,
  type InventMeta,
  type InventProduct,
  type InventStats,
  type ProductStatus,
} from '../../api/invent';
import type { Category } from '../../types';

const PAGE_SIZE = 10;

const STATUS_CLASS: Record<ProductStatus, string> = {
  Active: 'bg-[#d7f5dc] text-[#156b32]',
  'Out of Stock': 'bg-[#ffe0e0] text-[#a33131]',
  Draft: 'bg-[#f2f4f6] text-[#737686]',
};

interface FormState {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  description: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  name: '',
  categoryId: '',
  price: '',
  stock: '0',
  description: '',
  isActive: true,
};

/** Form tambah/ubah produk. `editing` null = mode tambah. */
const ProductForm: React.FC<{
  editing: InventProduct | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}> = ({ editing, categories, onClose, onSaved }) => {
  const [form, setForm] = useState<FormState>(
    editing
      ? {
          name: editing.name,
          categoryId: editing.categoryId,
          price: String(Number(editing.price)),
          stock: String(editing.stock),
          description: editing.description ?? '',
          isActive: editing.isActive,
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const price = Number(form.price);
    const stock = Number(form.stock);
    // Dicegat di sini supaya user dapat pesan langsung, bukan 400 dari server.
    // Server tetap memvalidasi hal yang sama — ini kenyamanan, bukan pengganti.
    if (!form.name.trim() || form.name.trim().length < 2) return setError('Nama produk minimal 2 karakter.');
    if (!form.categoryId) return setError('Kategori wajib dipilih.');
    if (!Number.isFinite(price) || price <= 0) return setError('Harga harus angka lebih dari 0.');
    if (!Number.isInteger(stock) || stock < 0) return setError('Stok harus bilangan bulat 0 atau lebih.');

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId,
        price,
        stock,
        description: form.description.trim() || undefined,
        isActive: form.isActive,
      };
      if (editing) {
        await updateInvent(editing.id, payload);
      } else {
        await createInvent(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err?.message ?? 'Gagal menyimpan produk');
    } finally {
      setSaving(false);
    }
  };

  const field = 'w-full px-3 py-2 rounded-xl border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e0e3e5]">
          <h2 className="text-[16px] font-bold text-[#191c1e]">
            {editing ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <button onClick={onClose} className="p-1 text-[#737686] hover:text-[#191c1e]" aria-label="Tutup">
            <Icon name="close" size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          {error && (
            <div className="p-2 bg-[#ffe0e0] border border-[#ffbcbc] text-[#a33131] text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-[#434655] mb-1">Nama Produk</label>
            <input className={field} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#434655] mb-1">Kategori</label>
            <select
              className={field}
              value={form.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
            >
              <option value="">— Pilih kategori —</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#434655] mb-1">Harga (Rp)</label>
              <input
                type="number"
                min={1}
                className={field}
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#434655] mb-1">Stok</label>
              <input
                type="number"
                min={0}
                className={field}
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#434655] mb-1">Deskripsi</label>
            <textarea
              rows={3}
              className={field}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 text-[13px] text-[#434655]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
            />
            Tayangkan produk (jika dimatikan, produk jadi Draft)
          </label>

          <div className="flex gap-2 pt-1">
            <Button type="submit" variant="primary" disabled={saving} className="flex-1">
              {saving ? 'Menyimpan…' : 'Simpan'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Konfirmasi hapus. Dibuat modal sendiri, bukan `window.confirm`, karena
 * server bisa menolak dengan alasan yang perlu dibaca utuh (produk yang sudah
 * pernah dipesan) — dialog bawaan browser tidak bisa menampilkan itu.
 */
const DeleteDialog: React.FC<{
  product: InventProduct;
  onClose: () => void;
  onDeleted: () => void;
}> = ({ product, onClose, onDeleted }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteInvent(product.id);
      onDeleted();
    } catch (err: any) {
      setError(err?.message ?? 'Gagal menghapus produk');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="px-5 py-4 border-b border-[#e0e3e5]">
          <h2 className="text-[16px] font-bold text-[#191c1e]">Hapus produk?</h2>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-[13px] text-[#434655]">
            <span className="font-semibold text-[#191c1e]">{product.name}</span> akan dihapus
            permanen dari toko kamu. Tindakan ini tidak bisa dibatalkan.
          </p>

          {error && (
            <div className="p-2 bg-[#ffe0e0] border border-[#ffbcbc] text-[#a33131] text-xs rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={confirm}
              disabled={busy}
              className="flex-1 px-4 py-2 rounded-full bg-[#ba1a1a] text-white text-sm font-medium hover:bg-[#9a1515] disabled:opacity-50 transition"
            >
              {busy ? 'Menghapus…' : 'Ya, hapus'}
            </button>
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              Batal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState<InventProduct[]>([]);
  const [meta, setMeta] = useState<InventMeta | null>(null);
  const [stats, setStats] = useState<InventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventProduct | null>(null);
  const [deleting, setDeleting] = useState<InventProduct | null>(null);

  // Pencarian dikirim ke server (ada kolom SKU & deskripsi yang tidak ikut
  // terkirim ke client), jadi ditahan dulu supaya tiap ketikan tidak jadi
  // satu request.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, statsRes] = await Promise.all([
        listInvent({ q: debouncedSearch || undefined, page, limit: PAGE_SIZE, status: 'ALL' }),
        getInventStats(),
      ]);
      setProducts(list.items);
      setMeta(list.meta);
      setStats(statsRes.data.data);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: InventProduct) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditing(null);
    load();
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">My Products</h1>
          <p className="text-[15px] text-[#737686]">Manage your inventory and product listings</p>
        </div>

        {/* Stats — dihitung server atas seluruh produk, bukan cuma halaman ini */}
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-4 text-center">
            <p className="text-[11px] font-semibold text-[#737686] uppercase">Active Listings</p>
            <p className="text-[24px] font-bold text-[#191c1e]">{stats?.active ?? '—'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-4 text-center">
            <p className="text-[11px] font-semibold text-[#737686] uppercase">Out of Stock</p>
            <p className="text-[24px] font-bold text-[#ba1a1a]">{stats?.outOfStock ?? '—'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-4 text-center">
            <p className="text-[11px] font-semibold text-[#737686] uppercase">Drafts</p>
            <p className="text-[24px] font-bold text-[#737686]">{stats?.drafts ?? '—'}</p>
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
          <Button variant="primary" className="px-5 py-2 text-sm" onClick={openCreate}>
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[#737686]">
                      Memuat produk…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[#ba1a1a]">
                      {error}
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[#737686]">
                      {debouncedSearch
                        ? `Tidak ada produk yang cocok dengan "${debouncedSearch}".`
                        : 'Belum ada produk. Klik "Add New Product" untuk menambah.'}
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const status = productStatus(product);
                    const image = product.images[0]?.url;
                    return (
                      <tr key={product.id} className="hover:bg-[#f8f9fb] transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 bg-[#f2f4f6] rounded-lg overflow-hidden flex items-center justify-center text-[#737686]">
                            {image ? (
                              <img src={image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Icon name="product" size={20} />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-[#191c1e]">{product.name}</td>
                        <td className="px-4 py-3 text-[#434655]">{product.category?.name ?? '—'}</td>
                        <td className="px-4 py-3 font-semibold text-[#004ac6]">
                          {formatRupiah(Number(product.price))}
                        </td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_CLASS[status]}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-[#737686] hover:text-[#004ac6] p-1"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Icon name="edit" size={16} />
                          </button>
                          <Link
                            to={`/products/${product.slug}`}
                            className="inline-block text-[#737686] hover:text-[#004ac6] p-1 ml-1"
                            aria-label={`Lihat ${product.name} di toko`}
                          >
                            <Icon name="eye" size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleting(product)}
                            className="text-[#737686] hover:text-[#ba1a1a] p-1 ml-1"
                            aria-label={`Hapus ${product.name}`}
                          >
                            <Icon name="trash" size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#e0e3e5]">
              <span className="text-[12px] text-[#737686]">
                Halaman {meta.page} dari {meta.totalPages} · {meta.total} produk
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.page <= 1}
                  className="px-3 py-1 rounded-full border border-[#c3c6d7] text-[12px] disabled:opacity-40 hover:border-[#004ac6] transition"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="px-3 py-1 rounded-full border border-[#c3c6d7] text-[12px] disabled:opacity-40 hover:border-[#004ac6] transition"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {formOpen && (
        <ProductForm
          editing={editing}
          categories={categories}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {deleting && (
        <DeleteDialog
          product={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            setDeleting(null);
            // Baris terakhir di halaman terakhir bisa membuat halaman ini
            // kosong; mundur satu supaya tabel tidak tampak habis.
            if (products.length === 1 && page > 1) setPage((p) => p - 1);
            else load();
          }}
        />
      )}
    </SellerLayout>
  );
};

export default ProductsPage;
