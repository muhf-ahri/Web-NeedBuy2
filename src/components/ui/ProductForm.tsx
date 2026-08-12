// src/components/ui/ProductForm.tsx
import React, { useState, useRef } from 'react';
import Input from './Input';
import Button from './Button';
import Icon from './Icon';
import type { Category } from '../../types';
import type { InventProduct } from '../../api/invent';
import { createInvent, updateInvent } from '../../api/invent';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadImage } from '../../api/uploads';

interface ProductFormProps {
  editing: InventProduct | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

interface FormState {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  description: string;
  isActive: boolean;
  discountPercent: string;
  bulkMinQty: string;
  bulkDiscountPercent: string;
}

interface FormErrors {
  name?: string;
  categoryId?: string;
  price?: string;
  stock?: string;
  images?: string;
  bulk?: string;
}

/** Satu baris spesifikasi. Beberapa baris dengan `key` sama = pilihan model. */
type SpecRow = { key: string; value: string };

const EMPTY_FORM: FormState = {
  name: '',
  categoryId: '',
  price: '',
  stock: '0',
  description: '',
  isActive: true,
  discountPercent: '0',
  bulkMinQty: '',
  bulkDiscountPercent: '',
};

const MAX_IMAGES = 5;

const ProductForm: React.FC<ProductFormProps> = ({ editing, categories, onClose, onSaved }) => {
  const [form, setForm] = useState<FormState>(
    editing
      ? {
          name: editing.name,
          categoryId: editing.categoryId,
          price: String(Number(editing.price)),
          stock: String(editing.stock),
          description: editing.description ?? '',
          isActive: editing.isActive,
          discountPercent: String(editing.discountPercent ?? 0),
          bulkMinQty: editing.bulkMinQty === null ? '' : String(editing.bulkMinQty),
          bulkDiscountPercent:
            editing.bulkDiscountPercent === null ? '' : String(editing.bulkDiscountPercent),
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Satu daftar untuk gambar lama maupun baru.
   *
   * Berkas diunggah begitu dipilih lewat `POST /uploads/image` dan yang
   * disimpan di sini hanya URL-nya — payload create/update memang berisi URL,
   * bukan multipart. Endpoint multipart yang dulu dipakai form ini tidak pernah
   * ada di server, dan itulah kenapa produk penjual muncul tanpa gambar di
   * halaman pembeli.
   */
  const [imageUrls, setImageUrls] = useState<string[]>(
    editing?.images?.map((image) => image.url) ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [specs, setSpecs] = useState<SpecRow[]>(
    editing?.attributes?.map((attribute) => ({
      key: attribute.attrKey,
      value: attribute.attrValue,
    })) ?? []
  );

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (form.name.trim().length < 2) newErrors.name = 'Nama produk minimal 2 karakter.';
    if (!form.categoryId) newErrors.categoryId = 'Pilih kategorinya dulu ya.';

    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) newErrors.price = 'Harga harus lebih dari 0.';

    const stock = Number(form.stock);
    if (!Number.isInteger(stock) || stock < 0) newErrors.stock = 'Stok harus bilangan bulat ≥ 0.';

    if (imageUrls.length === 0) newErrors.images = 'Tambahin minimal 1 gambar produk ya.';

    // Server menolak penawaran grosir yang cuma setengah terisi — dicegat di
    // sini supaya penjual tahu sebelum menunggu satu round-trip.
    const hasMin = form.bulkMinQty.trim() !== '';
    const hasPct = form.bulkDiscountPercent.trim() !== '';
    if (hasMin !== hasPct) {
      newErrors.bulk = 'Diskon grosir butuh minimal beli DAN persen potongannya.';
    } else if (hasMin && Number(form.bulkMinQty) < 2) {
      newErrors.bulk = 'Minimal beli untuk grosir mulai dari 2.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Berkas diunggah langsung; URL hasilnya baru ikut terkirim saat submit. */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = ''; // reset supaya berkas yang sama bisa dipilih ulang
    if (files.length === 0) return;

    setImageError(null);
    if (imageUrls.length + files.length > MAX_IMAGES) {
      setImageError(`Maksimal ${MAX_IMAGES} gambar.`);
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          setImageError(`"${file.name}" harus PNG, JPG, WebP, atau GIF.`);
          continue;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          setImageError(`"${file.name}" lebih dari 3 MB.`);
          continue;
        }
        const res = await uploadImage(file);
        setImageUrls((prev) => [...prev, res.data.data.url]);
        setErrors((prev) => ({ ...prev, images: undefined }));
      }
    } catch (err: any) {
      setImageError(err?.message ?? 'Gagal unggah gambar, coba lagi ya');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSaving(true);
    try {
      const hasBulk = form.bulkMinQty.trim() !== '' && form.bulkDiscountPercent.trim() !== '';
      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim() || undefined,
        isActive: form.isActive,
        discountPercent: Number(form.discountPercent) || 0,
        bulkMinQty: hasBulk ? Number(form.bulkMinQty) : null,
        bulkDiscountPercent: hasBulk ? Number(form.bulkDiscountPercent) : null,
        // Gambar pertama jadi gambar utama — urutan di daftar inilah urutan
        // yang dilihat pembeli.
        images: imageUrls.map((url, index) => ({
          url,
          isPrimary: index === 0,
          sortOrder: index,
        })),
        attributes: specs
          .filter((row) => row.key.trim() && row.value.trim())
          .map((row) => ({ attrKey: row.key.trim(), attrValue: row.value.trim() })),
      };

      if (editing) {
        await updateInvent(editing.id, payload);
      } else {
        await createInvent(payload);
      }

      onSaved();
    } catch (err: any) {
      setSubmitError(err?.message ?? 'Gagal simpan produk. Coba lagi ya.');
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    'w-full px-3 py-2 bg-gray-100/80 rounded-lg border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm';
  const inputError = 'border-red-400 focus:ring-red-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">
            {editing ? 'Ubah Produk' : 'Tambah Produk Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {submitError && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {submitError}
            </div>
          )}

          <Input
            label="Nama Produk"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Contoh: Keyboard Mekanik"
            error={errors.name}
            required
          />

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setField('categoryId', e.target.value)}
              className={`${inputBase} ${errors.categoryId ? inputError : ''}`}
            >
              <option value="">— Pilih kategori —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Harga (Rp)"
              type="number"
              min={1}
              value={form.price}
              onChange={(e) => setField('price', e.target.value)}
              placeholder="150000"
              error={errors.price}
              required
            />
            <Input
              label="Stok"
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => setField('stock', e.target.value)}
              placeholder="50"
              error={errors.stock}
              required
            />
          </div>

          {/* Diskon: promo biasa + penawaran grosir */}
          <div className="rounded-xl border border-gray-200 p-3 space-y-3">
            <p className="text-xs font-semibold text-gray-700">Diskon</p>
            <Input
              label="Diskon promo (%)"
              type="number"
              min={0}
              max={90}
              value={form.discountPercent}
              onChange={(e) => setField('discountPercent', e.target.value)}
              placeholder="0"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Grosir: minimal beli"
                type="number"
                min={2}
                value={form.bulkMinQty}
                onChange={(e) => setField('bulkMinQty', e.target.value)}
                placeholder="3"
              />
              <Input
                label="Grosir: potongan (%)"
                type="number"
                min={1}
                max={90}
                value={form.bulkDiscountPercent}
                onChange={(e) => setField('bulkDiscountPercent', e.target.value)}
                placeholder="10"
              />
            </div>
            {errors.bulk ? (
              <p className="text-xs text-red-600">{errors.bulk}</p>
            ) : (
              <p className="text-[11px] text-gray-500">
                Kosongkan dua-duanya kalau nggak ada harga grosir. Potongannya dihitung server
                saat pembeli nambah jumlah, jadi yang dibayar memang harga grosirnya.
              </p>
            )}
          </div>

          {/* Gambar — diunggah saat dipilih, yang dikirim ke server URL-nya */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Gambar Produk <span className="text-red-500">*</span>
            </label>

            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {index === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center">
                        Utama
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== index))}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Hapus gambar"
                    >
                      <Icon name="close" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition ${
                errors.images || imageError
                  ? 'border-red-400 bg-red-50/30'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="product-images"
                disabled={uploading}
              />
              <label
                htmlFor="product-images"
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <Icon name="upload" size={28} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {uploading
                    ? 'Ngunggah…'
                    : imageUrls.length > 0
                      ? 'Tambah gambar lagi'
                      : 'Klik atau seret gambarnya ke sini'}
                </span>
                <span className="text-xs text-gray-400">
                  Maks {MAX_IMAGES} gambar, 3 MB per berkas
                </span>
              </label>
            </div>

            {(errors.images || imageError) && (
              <p className="mt-1 text-xs text-red-600">{errors.images || imageError}</p>
            )}
          </div>

          {/* Spesifikasi & model */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-700">Spesifikasi & model</label>
              <button
                type="button"
                onClick={() => setSpecs((prev) => [...prev, { key: '', value: '' }])}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                + Tambah baris
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">
              Isi beberapa baris dengan nama sama (mis. dua baris <code>warna</code>) supaya
              pembeli dapat pilihan model di halaman produk.
            </p>

            {specs.length === 0 ? (
              <p className="text-xs text-gray-400">Belum ada spesifikasi.</p>
            ) : (
              <div className="space-y-2">
                {specs.map((row, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={row.key}
                      onChange={(e) =>
                        setSpecs((prev) =>
                          prev.map((r, i) => (i === index ? { ...r, key: e.target.value } : r))
                        )
                      }
                      placeholder="warna"
                      maxLength={60}
                      className={`${inputBase} w-1/3`}
                    />
                    <input
                      value={row.value}
                      onChange={(e) =>
                        setSpecs((prev) =>
                          prev.map((r, i) => (i === index ? { ...r, value: e.target.value } : r))
                        )
                      }
                      placeholder="Hitam"
                      maxLength={200}
                      className={`${inputBase} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => setSpecs((prev) => prev.filter((_, i) => i !== index))}
                      className="px-2 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Hapus baris spesifikasi"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Deskripsi produk (opsional)"
              className="w-full px-3 py-2 bg-gray-100/80 rounded-lg border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setField('isActive', e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            Tayangkan produk (kalau dimatikan, produk jadi Draf)
          </label>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={saving || uploading}
              className="flex-1 text-sm py-2.5"
            >
              {saving ? 'Nyimpen…' : 'Simpan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="text-sm py-2.5"
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
