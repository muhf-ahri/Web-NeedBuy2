// src/components/admin/CategoryForm.tsx
import React, { useState } from 'react';
import Icon from '../../../components/ui/Icon';
import Button from '../../../components/ui/Button';

export interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
  parentId?: string | null;
}

interface CategoryFormProps {
  editing?: CategoryFormData & { id?: string };
  categories?: { id: string; name: string }[];
  onClose: () => void;
  onSave: (data: CategoryFormData) => Promise<void> | void;
  title?: string;
  isChild?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  editing,
  categories = [],
  onClose,
  onSave,
  title = 'Tambah Kategori',
  isChild = false,
}) => {
  const [form, setForm] = useState<CategoryFormData>({
    name: editing?.name || '',
    description: editing?.description || '',
    isActive: editing?.isActive !== undefined ? editing.isActive : true,
    parentId: editing?.parentId !== undefined ? editing.parentId : (isChild ? '' : null),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }
    if (isChild && !form.parentId) {
      setError('Pilih kategori induk terlebih dahulu.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan kategori.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0e3e5] px-5 py-4">
          <h2 className="text-[16px] font-bold text-[#191c1e]">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#737686] transition-colors hover:bg-[#f2f4f6] hover:text-[#191c1e]"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-[#ffcdd2] bg-[#fff5f5] p-3 text-[13px] text-[#a33131]">
              {error}
            </div>
          )}

          {/* Nama Kategori */}
          <div>
            <label className="block text-[12px] font-semibold text-[#434655] mb-1">
              Nama Kategori <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={isChild ? 'Contoh: Smartphone' : 'Contoh: Elektronik'}
              className="w-full rounded-xl border border-[#c3c6d7] px-3 py-2 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
              autoFocus
            />
          </div>

          {/* Kategori Induk (hanya untuk child) */}
          {isChild && (
            <div>
              <label className="block text-[12px] font-semibold text-[#434655] mb-1">
                Kategori Induk <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                value={form.parentId || ''}
                onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
                className="w-full rounded-xl border border-[#c3c6d7] px-3 py-2 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
              >
                <option value="">Pilih kategori induk</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Deskripsi */}
          <div>
            <label className="block text-[12px] font-semibold text-[#434655] mb-1">
              Deskripsi (opsional)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi singkat tentang kategori ini"
              rows={3}
              className="w-full resize-none rounded-xl border border-[#c3c6d7] px-3 py-2 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
            />
          </div>

          {/* Status Aktif */}
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#434655]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 accent-[#004ac6]"
            />
            Aktif (kategori akan muncul di halaman pembeli)
          </label>

          {/* Tombol */}
          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Menyimpan…' : 'Simpan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;