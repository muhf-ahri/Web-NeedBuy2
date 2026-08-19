import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../ui/Icon';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  link?: string;
  linkLabel?: string;

  variant?: 'default' | 'muted';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  link,
  linkLabel = 'Lihat semua',
  variant = 'default',
}) => {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">

      <div className="min-w-0">

        <div className="flex items-center gap-2">
          <span
            className="
              inline-flex items-center gap-1.5 rounded-full bg-[#538cbd]/10
              px-2.5 py-1
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
            <p
              className="
                text-[9px] font-bold uppercase tracking-[0.20em]
                text-[#4077a6]
              "
            >
              {eyebrow}
            </p>
          </span>
        </div>

        <h2
          className={`
            mt-2 text-[20px] font-extrabold leading-tight tracking-tight
            sm:text-[24px]
            ${
              variant === 'default'
                ? 'text-[#101319]'
                : 'text-[#101319]'
            }
          `}
        >
          {title}
          <span
            className="
              relative inline-block align-baseline
              after:absolute after:-bottom-1 after:left-0
              after:h-[3px] after:w-8 after:rounded-full
              after:bg-[#FFD500]/60 after:blur-[0.5px]
            "
          >
            .
          </span>
        </h2>

        {description && (
          <p className="mt-1.5 max-w-xl text-[12px] leading-relaxed text-[#737686] sm:text-[13px]">
            {description}
          </p>
        )}
      </div>

      {link && (
        <Link
          to={link}
          className="
            group inline-flex shrink-0 items-center gap-1.5 rounded-full
            bg-[#538cbd]/10 px-3.5 py-1.5 text-[11px] font-semibold
            text-[#4077a6] transition-all duration-200
            hover:bg-[#4077a6] hover:text-white hover:shadow-[0_6px_16px_rgba(83,140,219,0.25)]
            active:scale-[0.98]
          "
        >
          {linkLabel}
          <Icon
            name="arrowRight"
            size={12}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;