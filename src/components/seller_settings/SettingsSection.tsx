import React from 'react';

import type { IconName } from '../ui/Icon';
import Icon from '../ui/Icon';

interface SettingsSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  icon: IconName;
  iconBg: string;
  iconText: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  eyebrow,
  title,
  description,
  icon,
  iconBg,
  iconText,
  children,
}) => (
  <section
    className="
      relative overflow-hidden rounded-[20px] border border-white/80
      bg-white/95 p-5 shadow-[0_6px_18px_rgba(32,36,45,0.05)]
      backdrop-blur-sm sm:p-6
    "
  >
    {/* Dekorasi */}
    <span
      className="
        pointer-events-none absolute -right-10 -top-10 h-24 w-24
        rounded-full border border-[#538CDB]/10
      "
    />
    <span
      className="
        pointer-events-none absolute right-4 top-4 h-1.5 w-1.5
        rounded-full bg-[#FFD500]
      "
    />

    {/* Header section */}
    <div className="relative mb-4 flex items-center gap-2.5">
      <span
        className={`
          flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}
          ${iconText}
        `}
      >
        <Icon name={icon} size={15} />
      </span>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#538CDB]">
          {eyebrow}
        </p>
        <h3 className="text-[13px] font-bold text-[#20242D] sm:text-[14px]">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-[11px] text-[#737A87]">{description}</p>
        )}
      </div>
    </div>

    {children}
  </section>
);

export default SettingsSection;