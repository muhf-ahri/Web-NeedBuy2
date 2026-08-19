import React from 'react';

import Icon, { type IconName } from '../ui/Icon';

interface Action {
  label: string;
  icon: IconName;
  onClick: () => void;
  variant?: 'primary' | 'outline';
}

export interface IllustratedCardProps {
  image: string;
  imageAlt?: string;

  pillLabel: string;

  pillColor?: 'blue' | 'red';
  eyebrow: string;
  title: string;
  subtitle: string;

  tips?: string[];
  primaryAction?: Action;
  secondaryAction?: Action;

  bottomTagline?: string;
}

const PILL_COLORS = {
  blue: {
    text: 'text-[#004ac6]',
    dot: 'bg-[#FFD500]',
    eyebrow: 'text-[#004ac6]',
    ring: 'bg-[#004ac6]/10',
  },
  red: {
    text: 'text-[#ba1a1a]',
    dot: 'bg-[#ba1a1a]',
    eyebrow: 'text-[#ba1a1a]',
    ring: 'bg-[#ba1a1a]/10',
  },
};

const IllustratedCard: React.FC<IllustratedCardProps> = ({
  image,
  imageAlt = '',
  pillLabel,
  pillColor = 'blue',
  eyebrow,
  title,
  subtitle,
  tips,
  primaryAction,
  secondaryAction,
  bottomTagline,
}) => {
  const colors = PILL_COLORS[pillColor];

  return (
    <figure
      className="
        w-full overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm
      "
    >

      <div className="relative h-44 md:hidden">
        <img
          src={image}
          alt={imageAlt}
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101319]/55 via-transparent to-transparent" />

        <div
          className={`
            absolute left-4 top-4 inline-flex items-center gap-1.5
            rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
            uppercase tracking-[0.18em] ${colors.text} backdrop-blur-sm
          `}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
          {pillLabel}
        </div>

        {bottomTagline && (
          <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] text-white/90">
            <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
            <span className="truncate">{bottomTagline}</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-[1.1fr_0.9fr]">
        <section className="flex items-center bg-white px-6 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-md">
            <p
              className={`
                mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]
                ${colors.eyebrow}
              `}
            >
              {eyebrow}
            </p>

            <h3
              className="
                text-[22px] font-bold leading-tight tracking-tight
                text-[#101319] sm:text-[26px]
              "
            >
              {title}
            </h3>

            <p className="mt-2 max-w-sm text-[13px] leading-5 text-[#737686]">
              {subtitle}
            </p>

            {tips && tips.length > 0 && (
              <div className="mt-5 rounded-2xl bg-[#F5F7FB] px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#737686]">
                  Cek dulu ini
                </p>
                <ul className="mt-3 space-y-2.5">
                  {tips.map((tip, i) => (
                    <li key={tip} className="flex items-center gap-3">
                      <span
                        className="
                          flex h-7 w-7 shrink-0 items-center justify-center
                          rounded-full bg-white text-[10px] font-bold
                          text-[#004ac6] ring-1 ring-[#e0e3e5]
                        "
                      >
                        {i + 1}
                      </span>
                      <span className="text-[12px] font-medium text-[#101319]">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(primaryAction || secondaryAction) && (
              <div className="mt-5 flex flex-wrap gap-2">
                {primaryAction && (
                  <button
                    type="button"
                    onClick={primaryAction.onClick}
                    className="
                      inline-flex h-11 items-center justify-center gap-2
                      rounded-full bg-[#004ac6] px-5 text-sm font-semibold
                      text-white shadow-[0_7px_18px_rgba(83,140,219,0.20)]
                      transition-all duration-200 hover:bg-[#004ac6]
                      hover:shadow-[0_9px_22px_rgba(83,140,219,0.25)]
                      active:scale-[0.99]
                    "
                  >
                    <Icon
                      name={primaryAction.icon}
                      size={15}
                      className="text-white"
                    />
                    {primaryAction.label}
                  </button>
                )}

                {secondaryAction && (
                  <button
                    type="button"
                    onClick={secondaryAction.onClick}
                    className="
                      inline-flex h-11 items-center justify-center gap-2
                      rounded-full border border-[#e0e3e5] bg-white px-5
                      text-sm font-semibold text-[#101319] transition-all
                      duration-200 hover:border-[#004ac6]
                      hover:text-[#004ac6] active:scale-[0.99]
                    "
                  >
                    <Icon name={secondaryAction.icon} size={15} />
                    {secondaryAction.label}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="relative hidden min-h-[420px] overflow-hidden md:block">
          <img
            src={image}
            alt={imageAlt}
            draggable={false}
            className="
              absolute inset-0 h-full w-full select-none object-cover
              transition-transform duration-700 hover:scale-[1.03]
            "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101319]/55 via-transparent to-transparent" />

          <svg
            className="
              pointer-events-none absolute inset-y-0 left-0 h-full w-16
              -scale-x-100 md:w-20
            "
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M100 0 C 40 40, 90 90, 55 140 C 20 190, 70 230, 90 280 C 105 320, 50 360, 100 400 L 130 400 L 130 0 Z"
              fill="white"
            />
          </svg>

          <div
            className={`
              absolute right-6 top-6 z-10 inline-flex items-center gap-1.5
              rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold
              uppercase tracking-[0.18em] ${colors.text} backdrop-blur-sm
            `}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
            {pillLabel}
          </div>

          <div
            className="
              pointer-events-none absolute left-[24%] top-[16%] z-10 h-1.5
              w-1.5 rounded-full bg-[#FFD500]
            "
          />

          {bottomTagline && (
            <div className="absolute bottom-5 right-6 z-10 text-right text-white">
              <p
                className="
                  text-[10px] font-semibold uppercase tracking-[0.18em]
                  text-white/70
                "
              >
                NeedBuy
              </p>
              <p className="mt-0.5 text-[11px] text-white/90">
                {bottomTagline}
              </p>
            </div>
          )}
        </section>
      </div>
    </figure>
  );
};

export default IllustratedCard;