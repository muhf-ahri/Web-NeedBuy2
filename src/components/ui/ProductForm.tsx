// src/components/ui/ProductForm.tsx
import React, { useState, useRef } from 'react';
import Input from './Input';
import Button from './Button';
import Icon from './Icon';
import type { Category } from '../../types';
import type { InventProduct } from '../../api/invent';
import { createInvent, updateInvent, uploadInventImages } from '../../api/invent';

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
}

interface FormErrors {
  name?: string;
  categoryId?: string;
  price?: string;
  stock?: string;
  images?: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  categoryId: '',
  price: '',
  stock: '0',
  description: '',
  isActive: true,
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ProductForm: React.FC<ProductFormProps> = ({
  editing,
  categories,
  onClose,
  onSaved,
}) => {
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    editing?.images?.map((img) => img.url) ?? []
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const trimmedName = form.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      newErrors.name = 'Nama produk minimal 2 karakter.';
    }
    if (!form.categoryId) {
      newErrors.categoryId = 'Pilih kategori.';
    }
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      newErrors.price = 'Harga harus lebih dari 0.';
    }
    const stock = Number(form.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      newErrors.stock = 'Stok harus bilangan bulat ≥ 0.';
    }
    if (!editing && imageFiles.length === 0) {
      newErrors.images = 'Tambahkan minimal 1 gambar produk.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError(null);
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    const total = imageFiles.length + files.length;
    if (total > MAX_IMAGES) {
      setImageError(`Maksimal ${MAX_IMAGES} gambar.`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE) {
        setImageError(`File "${file.name}" terlalu besar (maks 5MB).`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        setImageError(`File "${file.name}" bukan gambar.`);
        continue;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (newFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: undefined }));
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim() || undefined,
        isActive: form.isActive,
      };

      let productId: string;

      if (editing) {
        await updateInvent(editing.id, payload);
        productId = editing.id;
      } else {
        const res = await createInvent(payload);
        productId = res.data.data.id;
      }

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });
        await uploadInventImages(productId, formData);
      }

      onSaved();
    } catch (err: any) {
      setSubmitError(err?.message ?? 'Gagal menyimpan produk.');
    } finally {
      setSaving(false);
    }
  };

  // Gaya input yang konsisten dengan komponen Input dari UI
  const inputBase =
    'w-full px-3 py-2 bg-gray-100/80 rounded-lg border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm';

  const inputError =
    'border-red-400 focus:ring-red-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">
            {editing ? 'Edit Produk' : 'Tambah Produk Baru'}
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
          {/* Error umum dari server */}
          {submitError && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {submitError}
            </div>
          )}

          {/* Nama Produk */}
          <Input
            label="Nama Produk"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Contoh: Mechanical Keyboard"
            error={errors.name}
            required
          />

          {/* Kategori — konsisten dengan Input */}
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
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>
            )}
          </div>

          {/* Harga & Stok */}
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

          {/* Upload Gambar */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Gambar Produk {!editing && <span className="text-red-500">*</span>}
            </label>

            {/* Preview gambar */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {imagePreviews.map((url, index) => (
                  <div
                    key={index}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group"
                  >
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Hapus gambar"
                    >
                      <Icon name="close" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload area — konsisten dengan border input */}
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
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="product-images"
              />
              <label
                htmlFor="product-images"
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <Icon name="upload" size={28} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {editing ? 'Tambah gambar baru' : 'Klik atau seret untuk upload'}
                </span>
                <span className="text-xs text-gray-400">
                  Maks {MAX_IMAGES} gambar ({MAX_FILE_SIZE / 1024 / 1024}MB per file)
                </span>
              </label>
            </div>

            {(errors.images || imageError) && (
              <p className="mt-1 text-xs text-red-600">{errors.images || imageError}</p>
            )}
            {editing && imageFiles.length === 0 && imagePreviews.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">
                Produk ini belum memiliki gambar. Upload minimal 1 gambar.
              </p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Deskripsi produk (opsional)"
              className="w-full px-3 py-2 bg-gray-100/80 rounded-lg border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm resize-none"
            />
          </div>

          {/* Aktif / Draft — gaya sama dengan RegisterForm */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setField('isActive', e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            Tayangkan produk (jika dimatikan, produk menjadi Draft)
          </label>

          {/* Tombol aksi — konsisten dengan RegisterForm */}
          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="flex-1 text-sm py-2.5"
            >
              {saving ? 'Menyimpan…' : 'Simpan'}
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