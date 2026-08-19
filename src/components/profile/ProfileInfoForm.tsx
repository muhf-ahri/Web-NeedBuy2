import React from 'react';

import Icon from '../ui/Icon';

interface ProfileInfoFormProps {
  name: string;
  phone: string;
  username: string;
  email: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  name,
  phone,
  username,
  email,
  onNameChange,
  onPhoneChange,
  onSave,
  saving,
}) => {
  const inputCls =
    'w-full rounded-xl border border-[#e0e3e5] bg-[#F5F7FB] px-4 py-2.5 text-[13px] text-[#101319] outline-none placeholder:text-[#A2A8B3] transition-all duration-200 focus:border-[#538cbd] focus:bg-white focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]';

  const disabledCls =
    'w-full rounded-xl border border-[#e0e3e5] bg-[#F5F7FB]/50 px-4 py-2.5 text-[13px] text-[#A2A8B3] cursor-not-allowed';

  return (
    <div
      className="
        overflow-hidden rounded-[24px] border border-white/80 bg-white/95
        p-5 shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm
        sm:p-6
      "
    >
      <div className="mb-5 flex items-center gap-2.5">
        <span
          className="
            flex h-8 w-8 items-center justify-center rounded-lg
            bg-[#538cbd]/10
          "
        >
          <Icon name="user" size={15} className="text-[#4077a6]" />
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-[#101319]">
            Informasi Akun
          </h3>
          <p className="text-[11px] text-[#737686]">
            Data yang tampil di pesanan & chat
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="profile-name"
            className="
              mb-1.5 block text-[10px] font-semibold uppercase
              tracking-[0.14em] text-[#737686]
            "
          >
            Nama
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#737686]">
            Username
          </label>
          <input type="text" value={username} disabled className={disabledCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#737686]">
            Email
          </label>
          <input type="email" value={email} disabled className={disabledCls} />
        </div>
        <div>
          <label
            htmlFor="profile-phone"
            className="
              mb-1.5 block text-[10px] font-semibold uppercase
              tracking-[0.14em] text-[#737686]
            "
          >
            No. HP
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="
          mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#4077a6]
          px-5 text-[13px] font-semibold text-white
          shadow-[0_6px_16px_rgba(83,140,219,0.25)] transition-all
          duration-200 hover:bg-[#4077a6]
          hover:shadow-[0_8px_20px_rgba(83,140,219,0.30)] active:scale-[0.99]
          disabled:cursor-not-allowed disabled:bg-[#A2A8B3]
          disabled:shadow-none
        "
      >
        {saving && <Icon name="clock" size={14} className="animate-spin" />}
        Simpan Perubahan
      </button>
    </div>
  );
};

export default ProfileInfoForm;