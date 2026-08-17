import React from 'react';

interface FormState {
  storeName: string;
  description: string;
  address: string;
  phone: string;
  businessEmail: string;
  vacationMode: boolean;
  logoUrl: string;
}

interface SettingsFormFieldsProps {
  form: FormState;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const inputCls =
  'w-full rounded-xl border border-[#E8ECF4] bg-[#F5F7FB] px-3.5 py-2.5 text-[13px] text-[#20242D] outline-none placeholder:text-[#A2A8B3] transition-all duration-200 focus:border-[#538CDB] focus:bg-white focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]';

const labelCls =
  'mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#737A87]';

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
    {hint && (
      <p className="mt-1 text-[10px] leading-relaxed text-[#737A87]">{hint}</p>
    )}
  </div>
);

const SettingsFormFields: React.FC<SettingsFormFieldsProps> = ({
  form,
  setField,
}) => (
  <div className="space-y-5">
    {/* Nama toko */}
    <Field label="Nama Toko" hint="Minimal 3 karakter, maks 120 karakter.">
      <input
        type="text"
        value={form.storeName}
        onChange={(e) => setField('storeName', e.target.value)}
        minLength={3}
        maxLength={120}
        placeholder="Contoh: Toko Kebutuhan Rumah"
        className={inputCls}
      />
    </Field>

    {/* Deskripsi */}
    <Field
      label="Deskripsi Toko"
      hint="Ceritakan keunikan tokomu — maks 2000 karakter."
    >
      <textarea
        rows={3}
        value={form.description}
        onChange={(e) => setField('description', e.target.value)}
        maxLength={2000}
        placeholder="Toko keluarga yang menjual kebutuhan rumah tangga..."
        className={`${inputCls} resize-none`}
      />
    </Field>

    {/* Alamat & Telepon */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Alamat Perusahaan">
        <textarea
          rows={2}
          value={form.address}
          onChange={(e) => setField('address', e.target.value)}
          maxLength={500}
          placeholder="Jl. Contoh No. 123, Jakarta"
          className={`${inputCls} resize-none`}
        />
      </Field>

      <Field label="No. Telepon Toko">
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setField('phone', e.target.value)}
          maxLength={20}
          placeholder="08123456789"
          className={inputCls}
        />
      </Field>
    </div>

    {/* Business Email */}
    <Field
      label="Email Bisnis"
      hint="Kontak toko — tidak mengubah email akun login kamu."
    >
      <input
        type="email"
        value={form.businessEmail}
        onChange={(e) => setField('businessEmail', e.target.value)}
        maxLength={255}
        placeholder="toko@bisnis.com"
        className={inputCls}
      />
    </Field>
  </div>
);

export default SettingsFormFields;