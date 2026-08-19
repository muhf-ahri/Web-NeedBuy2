import React from 'react';

import Icon from '../ui/Icon';

interface ProfilePasswordFormProps {
  currentPassword: string;
  newPassword: string;
  onCurrentChange: (v: string) => void;
  onNewChange: (v: string) => void;
  onSubmit: () => void;
  saving: boolean;
}

const ProfilePasswordForm: React.FC<ProfilePasswordFormProps> = ({
  currentPassword,
  newPassword,
  onCurrentChange,
  onNewChange,
  onSubmit,
  saving,
}) => {
  const inputCls =
    'w-full rounded-xl border border-[#e0e3e5] bg-[#F5F7FB] px-4 py-2.5 text-[13px] text-[#101319] outline-none placeholder:text-[#A2A8B3] transition-all duration-200 focus:border-[#004ac6] focus:bg-white focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]';

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
            bg-[#004ac6]/10
          "
        >
          <Icon name="lock" size={15} className="text-[#004ac6]" />
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-[#101319]">
            Ganti Password
          </h3>
          <p className="text-[11px] text-[#737686]">
            Minimal 8 karakter untuk keamanan akun
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="pw-current"
            className="
              mb-1.5 block text-[10px] font-semibold uppercase
              tracking-[0.14em] text-[#737686]
            "
          >
            Password Saat Ini
          </label>
          <input
            id="pw-current"
            type="password"
            value={currentPassword}
            onChange={(e) => onCurrentChange(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor="pw-new"
            className="
              mb-1.5 block text-[10px] font-semibold uppercase
              tracking-[0.14em] text-[#737686]
            "
          >
            Password Baru
          </label>
          <input
            id="pw-new"
            type="password"
            value={newPassword}
            onChange={(e) => onNewChange(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={saving || !currentPassword || !newPassword}
        className="
          mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#101319]
          px-5 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(32,36,45,0.15)]
          transition-all duration-200 hover:bg-[#004ac6]
          hover:shadow-[0_8px_20px_rgba(83,140,219,0.30)] active:scale-[0.99]
          disabled:cursor-not-allowed disabled:bg-[#A2A8B3]
          disabled:shadow-none
        "
      >
        {saving && <Icon name="clock" size={14} className="animate-spin" />}
        Ganti Password
      </button>
    </div>
  );
};

export default ProfilePasswordForm;