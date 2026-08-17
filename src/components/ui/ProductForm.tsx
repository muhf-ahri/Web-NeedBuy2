import React, { useState, useRef, useEffect } from 'react';

import Input from './Input';
import Button from './Button';
import Icon from './Icon';
import type { Category } from '../../types';
import type { InventProduct } from '../../api/invent';
import { createInvent, updateInvent } from '../../api/invent';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  uploadImage,
} from '../../api/uploads';

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

/** Class input konsisten dengan design system NeedBuy */
const inputCls =
  'w-full rounded-xl border border-[#E8ECF4] bg-[#F5F7FB] px-3.5 py-2.5 text-[13px] text-[#20242D] outline-none placeholder:text-[#A2A8B3] transition-all duration-200 focus:border-[#538CDB] focus:bg-white focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';
const inputErrorCls = '!border-[#FF4646] focus:!border-[#FF4646] focus:!shadow-[0_4px_16px_rgba(255,70,70,0.10)]';

/** Wrapper section dengan eyebrow + icon — konsisten antar form */
const Section: React.FC<{
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}> = ({ eyebrow, title, icon, children, rightAction }) => (
  <section>
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {icon}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#538CDB]">
            {eyebrow}
          </p>
          <p className="text-[13px] font-bold text-[#20242D]">{title}</p>
        </div>
      </div>
      {rightAction}
    </div>
    {children}
  </section>
);

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
          discountPercent: String(editing.discountPercent ?? 0),
          bulkMinQty: editing.bulkMinQty === null ? '' : String(editing.bulkMinQty),
          bulkDiscountPercent:
            editing.bulkDiscountPercent === null
              ? ''
              : String(editing.bulkDiscountPercent),
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  /* Lock body scroll + ESC */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (form.name.trim().length < 2)
      newErrors.name = 'Nama produk minimal 2 karakter.';
    if (!form.categoryId) newErrors.categoryId = 'Pilih kategorinya dulu ya.';

    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0)
      newErrors.price = 'Harga harus lebih dari 0.';

    const stock = Number(form.stock);
    if (!Number.isInteger(stock) || stock < 0)
      newErrors.stock = 'Stok harus bilangan bulat ≥ 0.';

    if (imageUrls.length === 0)
      newErrors.images = 'Tambahin minimal 1 gambar produk ya.';

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = '';
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
      const hasBulk =
        form.bulkMinQty.trim() !== '' && form.bulkDiscountPercent.trim() !== '';
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
        images: imageUrls.map((url, index) => ({
          url,
          isPrimary: index === 0,
          sortOrder: index,
        })),
        attributes: specs
          .filter((row) => row.key.trim() && row.value.trim())
          .map((row) => ({
            attrKey: row.key.trim(),
            attrValue: row.value.trim(),
          })),
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#20242D]/50 backdrop-blur-sm product-form-backdrop"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="
          product-form-enter relative flex w-full max-w-2xl flex-col
          overflow-hidden rounded-t-[24px] border border-white/80
          bg-white/98 shadow-[0_18px_50px_rgba(32,36,45,0.25)]
          backdrop-blur-sm max-h-[92vh] sm:rounded-[24px]
        "
      >
        {/* ── Header sticky ── */}
        <div className="relative flex items-center justify-between border-b border-[#E8ECF4] bg-white/95 px-5 py-4 backdrop-blur-sm sm:px-6">
          {/* Dekorasi */}
          <span className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full border border-[#538CDB]/10" />
          <span className="pointer-events-none absolute right-12 top-5 h-1.5 w-1.5 rounded-full bg-[#FFD500]" />

          <div className="relative flex items-center gap-3">
            <span
              className="
                flex h-10 w-10 items-center justify-center rounded-xl
                bg-gradient-to-br from-[#5B93E0] to-[#3A66AC]
                shadow-[0_6px_16px_rgba(83,140,219,0.30)]
              "
            >
              <Icon
                name={editing ? 'edit' : 'plus'}
                size={18}
                className="text-white"
              />
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#538CDB]">
                {editing ? 'Ubah produk' : 'Produk baru'}
              </p>
              <h3 className="text-[16px] font-bold text-[#20242D] sm:text-[18px]">
                {editing ? 'Ubah Produk' : 'Tambah Produk Baru'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              relative rounded-full p-2 text-[#737A87] transition-colors
              hover:bg-[#F5F7FB] hover:text-[#20242D]
            "
            aria-label="Tutup"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* ── Body scrollable ── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6"
        >
          {/* Error banner */}
          {submitError && (
            <div
              className="
                flex items-center gap-3 rounded-2xl border
                border-[#FF4646]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
              "
            >
              <span
                className="
                  flex h-8 w-8 shrink-0 items-center justify-center
                  rounded-full bg-[#FF4646]/15
                "
              >
                <Icon name="alert" size={15} className="text-[#FF4646]" />
              </span>
              <p className="text-[12px] font-medium text-[#C73535]">
                {submitError}
              </p>
            </div>
          )}

          {/* ── Section: Informasi Dasar ── */}
          <Section
            eyebrow="Bagian 1"
            title="Informasi Dasar"
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#538CDB]/10">
                <Icon name="product" size={14} className="text-[#538CDB]" />
              </span>
            }
          >
            <div className="space-y-3">
              <Input
                label="Nama Produk"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Contoh: Keyboard Mekanik"
                error={errors.name}
                required
                className={errors.name ? inputErrorCls : ''}
              />

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#737A87]">
                  Kategori <span className="text-[#FF4646]">*</span>
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setField('categoryId', e.target.value)}
                  className={`${inputCls} cursor-pointer ${errors.categoryId ? inputErrorCls : ''}`}
                >
                  <option value="">— Pilih kategori —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-[11px] text-[#FF4646]">
                    {errors.categoryId}
                  </p>
                )}
              </div>
            </div>
          </Section>

          {/* ── Section: Harga & Stok ── */}
          <Section
            eyebrow="Bagian 2"
            title="Harga & Stok"
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF7E0]">
                <Icon name="card" size={14} className="text-[#B45309]" />
              </span>
            }
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Harga (Rp)"
                type="number"
                min={1}
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                placeholder="150000"
                error={errors.price}
                required
                className={errors.price ? inputErrorCls : ''}
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
                className={errors.stock ? inputErrorCls : ''}
              />
            </div>
          </Section>

          {/* ── Section: Diskon ── */}
          <Section
            eyebrow="Bagian 3"
            title="Diskon & Grosir"
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0FDF4]">
                <Icon name="spark" size={14} className="text-[#166534]" />
              </span>
            }
          >
            <div className="space-y-3 rounded-2xl bg-[#F5F7FB] p-4">
              <Input
                label="Diskon promo (%)"
                type="number"
                min={0}
                max={90}
                value={form.discountPercent}
                onChange={(e) => setField('discountPercent', e.target.value)}
                placeholder="0"
                className={inputCls}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Grosir: minimal beli"
                  type="number"
                  min={2}
                  value={form.bulkMinQty}
                  onChange={(e) => setField('bulkMinQty', e.target.value)}
                  placeholder="3"
                  className={inputCls}
                />
                <Input
                  label="Grosir: potongan (%)"
                  type="number"
                  min={1}
                  max={90}
                  value={form.bulkDiscountPercent}
                  onChange={(e) => setField('bulkDiscountPercent', e.target.value)}
                  placeholder="10"
                  className={inputCls}
                />
              </div>

              {errors.bulk ? (
                <div className="flex items-center gap-2 rounded-lg bg-[#FFF0F0] px-3 py-2">
                  <Icon name="alert" size={12} className="shrink-0 text-[#FF4646]" />
                  <p className="text-[11px] font-medium text-[#C73535]">
                    {errors.bulk}
                  </p>
                </div>
              ) : (
                <p className="flex items-start gap-2 text-[11px] leading-relaxed text-[#737A87]">
                  <Icon name="alert" size={12} className="mt-0.5 shrink-0 text-[#538CDB]" />
                  <span>
                    Kosongkan dua-duanya kalau nggak ada harga grosir. Potongan
                    dihitung server saat pembeli nambah jumlah.
                  </span>
                </p>
              )}
            </div>
          </Section>

          {/* ── Section: Gambar Produk ── */}
          <Section
            eyebrow="Bagian 4"
            title="Gambar Produk"
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF5FF]">
                <Icon name="upload" size={14} className="text-[#538CDB]" />
              </span>
            }
            rightAction={
              imageUrls.length > 0 && (
                <span className="text-[10px] font-semibold text-[#737A87]">
                  {imageUrls.length}/{MAX_IMAGES}
                </span>
              )
            }
          >
            {/* Preview thumbnails */}
            {imageUrls.length > 0 && (
              <div className="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="
                      group relative aspect-square overflow-hidden rounded-xl
                      border border-[#E8ECF4] bg-[#F5F7FB]
                    "
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {index === 0 && (
                      <span
                        className="
                          absolute inset-x-0 bottom-0 bg-gradient-to-t
                          from-[#538CDB] to-[#538CDB]/80 py-0.5 text-center
                          text-[8px] font-bold uppercase tracking-wider
                          text-white
                        "
                      >
                        Utama
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setImageUrls((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="
                        absolute right-1 top-1 flex h-5 w-5 items-center
                        justify-center rounded-full bg-[#20242D]/70 text-white
                        opacity-0 transition-opacity hover:bg-[#FF4646]
                        group-hover:opacity-100
                      "
                      aria-label="Hapus gambar"
                    >
                      <Icon name="close" size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload area */}
            <div
              className={`
                relative overflow-hidden rounded-2xl border-2 border-dashed
                p-5 text-center transition-all duration-200
                ${
                  errors.images || imageError
                    ? 'border-[#FF4646]/50 bg-[#FFF0F0]/40'
                    : 'border-[#D8DEE9] hover:border-[#538CDB]/50 hover:bg-[#EEF5FF]/50'
                }
              `}
            >
              {/* Dekorasi */}
              <span className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full border border-[#538CDB]/10" />

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
                className="relative flex cursor-pointer flex-col items-center gap-2"
              >
                <span
                  className={`
                    flex h-12 w-12 items-center justify-center rounded-2xl
                    transition-colors
                    ${
                      errors.images || imageError
                        ? 'bg-[#FF4646]/15 text-[#FF4646]'
                        : 'bg-[#538CDB]/10 text-[#538CDB]'
                    }
                  `}
                >
                  {uploading ? (
                    <Icon name="clock" size={20} className="animate-spin" />
                  ) : (
                    <Icon name="upload" size={20} />
                  )}
                </span>
                <p className="text-[13px] font-semibold text-[#20242D]">
                  {uploading
                    ? 'Sedang mengunggah…'
                    : imageUrls.length > 0
                      ? 'Tambah gambar lagi'
                      : 'Klik atau seret gambarnya ke sini'}
                </p>
                <p className="text-[11px] text-[#737A87]">
                  Maks {MAX_IMAGES} gambar · 3 MB per berkas · PNG, JPG, WebP, GIF
                </p>
              </label>
            </div>

            {(errors.images || imageError) && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#FF4646]">
                <Icon name="alert" size={11} />
                {errors.images || imageError}
              </p>
            )}
          </Section>

          {/* ── Section: Spesifikasi & Model ── */}
          <Section
            eyebrow="Bagian 5"
            title="Spesifikasi & Model"
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF7E0]">
                <Icon name="grid" size={14} className="text-[#B45309]" />
              </span>
            }
            rightAction={
              <button
                type="button"
                onClick={() => setSpecs((prev) => [...prev, { key: '', value: '' }])}
                className="
                  flex items-center gap-1 rounded-full bg-[#538CDB]/10 px-2.5
                  py-1 text-[11px] font-semibold text-[#538CDB]
                  transition-colors hover:bg-[#538CDB]/15
                "
              >
                <Icon name="plus" size={11} />
                Tambah baris
              </button>
            }
          >
            <p className="mb-3 text-[11px] leading-relaxed text-[#737A87]">
              Isi beberapa baris dengan nama sama (mis. dua baris{' '}
              <code className="rounded bg-[#F5F7FB] px-1.5 py-0.5 font-mono text-[10px] text-[#538CDB]">
                warna
              </code>
              ) supaya pembeli dapat pilihan model di halaman produk.
            </p>

            {specs.length === 0 ? (
              <div
                className="
                  rounded-xl border border-dashed border-[#D8DEE9] bg-[#F5F7FB]/50
                  py-6 text-center
                "
              >
                <p className="text-[12px] font-medium text-[#A2A8B3]">
                  Belum ada spesifikasi
                </p>
                <button
                  type="button"
                  onClick={() => setSpecs([{ key: '', value: '' }])}
                  className="
                    mt-2 text-[11px] font-semibold text-[#538CDB]
                    hover:underline
                  "
                >
                  + Tambah baris pertama
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {specs.map((row, index) => (
                  <div
                    key={index}
                    className="
                      flex items-center gap-2 rounded-xl border border-[#E8ECF4]
                      bg-white p-1.5
                    "
                  >
                    <input
                      value={row.key}
                      onChange={(e) =>
                        setSpecs((prev) =>
                          prev.map((r, i) =>
                            i === index ? { ...r, key: e.target.value } : r
                          )
                        )
                      }
                      placeholder="warna"
                      maxLength={60}
                      className="
                        min-w-0 w-1/3 rounded-lg border-0 bg-[#F5F7FB] px-3
                        py-2 text-[12px] text-[#20242D] outline-none
                        placeholder:text-[#A2A8B3] focus:bg-white
                        focus:ring-1 focus:ring-[#538CDB]
                      "
                    />
                    <input
                      value={row.value}
                      onChange={(e) =>
                        setSpecs((prev) =>
                          prev.map((r, i) =>
                            i === index ? { ...r, value: e.target.value } : r
                          )
                        )
                      }
                      placeholder="Hitam"
                      maxLength={200}
                      className="
                        min-w-0 flex-1 rounded-lg border-0 bg-[#F5F7FB] px-3
                        py-2 text-[12px] text-[#20242D] outline-none
                        placeholder:text-[#A2A8B3] focus:bg-white
                        focus:ring-1 focus:ring-[#538CDB]
                      "
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSpecs((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="
                        flex h-8 w-8 shrink-0 items-center justify-center
                        rounded-lg text-[#A2A8B3] transition-colors
                        hover:bg-[#FFF0F0] hover:text-[#FF4646]
                      "
                      aria-label="Hapus baris spesifikasi"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* ── Section: Deskripsi & Status ── */}
          <Section
            eyebrow="Bagian 6"
            title="Deskripsi & Status"
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0FDF4]">
                <Icon name="edit" size={14} className="text-[#166534]" />
              </span>
            }
          >
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#737A87]">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="Deskripsi produk (opsional)"
                  className={`${inputCls} resize-none`}
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E8ECF4] bg-white p-3 transition-colors hover:border-[#538CDB]/40 hover:bg-[#EEF5FF]/50">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setField('isActive', e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#538CDB]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-[#20242D]">
                    Tayangkan produk
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#737A87]">
                    Kalau dimatikan, produk jadi Draf dan tidak muncul di
                    pencarian.
                  </p>
                </div>
              </label>
            </div>
          </Section>

          {/* Spacer biar konten tidak ketutup footer sticky di mobile */}
          <div className="h-2" />
        </form>

        {/* ── Footer sticky ── */}
        <div className="flex gap-2 border-t border-[#E8ECF4] bg-white/95 p-4 backdrop-blur-sm sm:gap-3 sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving || uploading}
            className="flex-1 py-2.5 text-[13px] sm:flex-none sm:px-6"
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={(e) => handleSubmit(e as any)}
            disabled={saving || uploading}
            className="
              flex flex-1 items-center justify-center gap-2 rounded-full
              bg-[#538CDB] py-2.5 text-[13px] font-semibold text-white
              shadow-[0_6px_16px_rgba(83,140,219,0.25)] transition-all
              hover:bg-[#467BC7] hover:shadow-[0_8px_20px_rgba(83,140,219,0.30)]
              active:scale-[0.99] disabled:cursor-not-allowed
              disabled:bg-[#A2A8B3] disabled:shadow-none
            "
          >
            {saving || uploading ? (
              <>
                <Icon name="clock" size={14} className="animate-spin" />
                {uploading ? 'Mengunggah…' : 'Menyimpan…'}
              </>
            ) : (
              <>
                <Icon
                  name={editing ? 'check' : 'plus'}
                  size={14}
                  className="text-white"
                />
                {editing ? 'Simpan Perubahan' : 'Tambah Produk'}
              </>
            )}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes product-form-backdrop {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .product-form-backdrop {
          animation: product-form-backdrop 0.2s ease both;
        }

        @keyframes product-form-enter {
          0% { opacity: 0; transform: translateY(12px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .product-form-enter {
          animation: product-form-enter 0.28s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
      `}</style>
    </div>
  );
};

export default ProductForm;