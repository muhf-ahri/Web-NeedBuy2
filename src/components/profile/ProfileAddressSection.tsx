import React, { useEffect } from 'react';

import Icon from '../ui/Icon';
import type { Address } from '../../api/orders';
import type { AddressFormData } from '../../utils/address';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  required,
  error,
  placeholder,
}) => (
  <div>
    <label
      className="
        mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em]
        text-[#737686]
      "
    >
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className={`
        w-full rounded-xl border px-4 py-2.5 text-[13px] text-[#101319]
        outline-none placeholder:text-[#A2A8B3] transition-all duration-200
        focus:bg-white focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]
        ${
          error
            ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:shadow-[0_4px_16px_rgba(255,70,70,0.10)]'
            : 'border-[#e0e3e5] bg-[#F5F7FB] focus:border-[#004ac6]'
        }
      `}
    />
    {error && <p className="mt-1 text-[11px] text-[#ba1a1a]">{error}</p>}
  </div>
);

interface ProfileAddressSectionProps {
  addresses: Address[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  showModal: boolean;
  onCloseModal: () => void;
  form: AddressFormData;
  onFieldChange: (key: keyof AddressFormData, value: string) => void;
  fieldErrors: Record<string, string>;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileAddressSection: React.FC<ProfileAddressSectionProps> = ({
  addresses,
  onAdd,
  onDelete,
  showModal,
  onCloseModal,
  form,
  onFieldChange,
  fieldErrors,
  saving,
  onSubmit,
}) => {
  useEffect(() => {
    if (!showModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseModal();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [showModal, onCloseModal]);

  return (
    <>
      <div
        className="
          overflow-hidden rounded-[24px] border border-white/80 bg-white/95
          p-5 shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm
          sm:p-6
        "
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="
                flex h-8 w-8 items-center justify-center rounded-lg
                bg-[#004ac6]/10
              "
            >
              <Icon name="pin" size={15} className="text-[#004ac6]" />
            </span>
            <div>
              <h3 className="text-[15px] font-bold text-[#101319]">
                Alamat Saya
              </h3>
              <p className="text-[11px] text-[#737686]">
                {addresses.length} alamat tersimpan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="
              flex h-9 items-center gap-1.5 rounded-full bg-[#004ac6] px-3.5
              text-[11px] font-semibold text-white
              shadow-[0_4px_12px_rgba(83,140,219,0.25)] transition-all
              duration-200 hover:bg-[#004ac6] active:scale-[0.99]
            "
          >
            <Icon name="plus" size={12} />
            Tambah
          </button>
        </div>

        {addresses.length === 0 ? (
          <div
            className="
              rounded-2xl border border-dashed border-[#e0e3e5] bg-[#F5F7FB]/50
              py-10 text-center
            "
          >
            <div
              className="
                mx-auto flex h-12 w-12 items-center justify-center
                rounded-full bg-white
              "
            >
              <Icon name="pin" size={18} className="text-[#A2A8B3]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-[#101319]">
              Belum ada alamat tersimpan
            </p>
            <p className="mt-1 text-[11px] text-[#737686]">
              Tambah alamat biar checkout lebih cepat.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="
                  group rounded-2xl border border-[#e0e3e5] bg-white p-4
                  transition-all duration-200 hover:border-[#004ac6]/40
                  hover:shadow-[0_4px_14px_rgba(83,140,219,0.08)]
                "
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-semibold text-[#101319]">
                        {addr.recipientName}
                      </p>
                      {addr.isDefault && (
                        <span
                          className="
                            inline-flex items-center gap-1 rounded-full
                            bg-[#004ac6]/10 px-2 py-0.5 text-[9px]
                            font-semibold text-[#004ac6]
                          "
                        >
                          <span className="h-1 w-1 rounded-full bg-[#004ac6]" />
                          Utama
                        </span>
                      )}
                      {addr.label && (
                        <span
                          className="
                            rounded-full bg-[#F5F7FB] px-2 py-0.5 text-[9px]
                            font-semibold text-[#737686]
                          "
                        >
                          {addr.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-[#737686]">
                      {addr.phone}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-[#737686]">
                      {addr.fullAddress}, {addr.city}, {addr.province}{' '}
                      {addr.postalCode}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(addr.id)}
                    className="
                      shrink-0 rounded-full border border-transparent p-1.5
                      text-[#A2A8B3] transition-all duration-200
                      hover:border-[#ba1a1a]/40 hover:bg-[#FFF0F0]
                      hover:text-[#ba1a1a]
                    "
                    aria-label="Hapus alamat"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-[#101319]/50 backdrop-blur-sm"
            onClick={onCloseModal}
          />

          <div
            className="
              address-modal-enter relative flex w-full max-w-lg flex-col
              overflow-hidden rounded-[24px] border border-white/80
              bg-white/98 shadow-[0_18px_50px_rgba(32,36,45,0.20)]
              backdrop-blur-sm max-h-[90vh]
            "
          >
            <div className="flex items-center justify-between border-b border-[#e0e3e5] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="
                    flex h-8 w-8 items-center justify-center rounded-lg
                    bg-[#004ac6]/10
                  "
                >
                  <Icon name="pin" size={14} className="text-[#004ac6]" />
                </span>
                <h3 className="text-[15px] font-bold text-[#101319]">
                  Alamat Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseModal}
                className="
                  rounded-full p-1.5 text-[#737686] transition-colors
                  hover:bg-[#F5F7FB] hover:text-[#101319]
                "
                aria-label="Tutup"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form
              onSubmit={onSubmit}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-5"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label="Nama Penerima"
                  value={form.recipientName}
                  onChange={(v) => onFieldChange('recipientName', v)}
                  error={fieldErrors.recipientName}
                  required
                />
                <Field
                  label="No. HP"
                  value={form.phone}
                  onChange={(v) => onFieldChange('phone', v)}
                  error={fieldErrors.phone}
                  required
                />
              </div>

              <Field
                label="Alamat Lengkap"
                value={form.fullAddress}
                onChange={(v) => onFieldChange('fullAddress', v)}
                error={fieldErrors.fullAddress}
                required
                placeholder="Jalan, nomor rumah, RT/RW, kelurahan"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label="Kota"
                  value={form.city}
                  onChange={(v) => onFieldChange('city', v)}
                  error={fieldErrors.city}
                  required
                />
                <Field
                  label="Provinsi"
                  value={form.province}
                  onChange={(v) => onFieldChange('province', v)}
                  error={fieldErrors.province}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label="Kode Pos"
                  value={form.postalCode}
                  onChange={(v) => onFieldChange('postalCode', v)}
                  error={fieldErrors.postalCode}
                  required
                />
                <Field
                  label="Label (mis. Rumah)"
                  value={form.label}
                  onChange={(v) => onFieldChange('label', v)}
                  error={fieldErrors.label}
                  placeholder="Opsional"
                />
              </div>
            </form>

            <div className="border-t border-[#e0e3e5] bg-white/95 px-5 py-4">
              <button
                type="button"
                onClick={(e) => onSubmit(e as any)}
                disabled={saving}
                className="
                  flex h-11 w-full items-center justify-center gap-2
                  rounded-full bg-[#004ac6] px-6 text-[14px] font-semibold
                  text-white shadow-[0_7px_18px_rgba(83,140,219,0.25)]
                  transition-all duration-200 hover:bg-[#004ac6]
                  hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
                  active:scale-[0.99] disabled:cursor-not-allowed
                  disabled:bg-[#A2A8B3] disabled:shadow-none
                "
              >
                {saving && <Icon name="clock" size={14} className="animate-spin" />}
                Simpan Alamat
              </button>
            </div>
          </div>

          <style>{`
            @keyframes address-modal-enter {
              0% { opacity: 0; transform: translateY(8px) scale(0.98); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .address-modal-enter {
              animation: address-modal-enter 0.22s cubic-bezier(0.22, 0.9, 0.35, 1) both;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default ProfileAddressSection;