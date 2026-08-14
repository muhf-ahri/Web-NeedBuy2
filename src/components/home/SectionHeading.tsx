// src/components/home/SectionHeading.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  link?: string;
  linkLabel?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  link,
  linkLabel = 'Lihat semua',
}) => {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#004ac6]" />

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#004ac6]
            "
          >
            {eyebrow}
          </p>
        </div>

        <h2
          className="
            mt-1.5
            text-xl
            font-bold
            tracking-tight
            text-[#191c1e]
            sm:text-2xl
          "
        >
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-[12px] text-[#737686]">
            {description}
          </p>
        )}
      </div>

      {link && (
        <Link
          to={link}
          className="
            shrink-0
            rounded-full
            border border-[#d5e2f5]
            bg-white/70
            px-3.5 py-1.5
            text-[11px]
            font-semibold
            text-[#004ac6]
            backdrop-blur-sm
            transition-all
            hover:border-[#b9cef4]
            hover:bg-white
          "
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;