import React from 'react';
import { Link } from 'react-router-dom';
import Icon, { type IconName } from '../ui/Icon';

const LEGAL_LINKS: Array<{
  to: string;
  label: string;
  icon: IconName;
}> = [
  {
    to: '/terms',
    label: 'Syarat & Ketentuan',
    icon: 'shield',
  },
  {
    to: '/privacy',
    label: 'Kebijakan Privasi',
    icon: 'lock',
  },
  {
    to: '/shipping',
    label: 'Info Pengiriman',
    icon: 'truck',
  },
  {
    to: '/contact',
    label: 'Hubungi Kami',
    icon: 'mail',
  },
];

const SHOP_LINKS = [
  { to: '/categories', label: 'Kategori' },
  { to: '/coupons', label: 'Kupon' },
  { to: '/orders', label: 'Pesanan' },
  { to: '/messages', label: 'Pesan Penjual' },
];

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-[#E8ECF4] bg-white">
      
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#538CDB]/5" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-[#FFD500]/5" />

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">

        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}

        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">

          {/* =================================================
              BRAND
          ================================================== */}

          <div className="max-w-sm">

            {/* Logo */}
            <Link
              to="/"
              className="group inline-flex items-center gap-2"
            >
              <span
                className="
                  text-lg
                  font-bold
                  tracking-tight
                  text-[#20242D]
                "
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                NeedBuy
              </span>
            </Link>

            {/* Description */}
            <p className="mt-4 max-w-[30ch] text-[13px] leading-5 text-[#737A87]">
              Beli yang kamu butuh, bukan yang cuma kamu lihat.
              Temukan produk yang tepat dengan pengalaman
              belanja yang lebih sederhana.
            </p>

            {/* Small brand accent */}
            <div className="mt-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#538CDB]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF4646]" />
            </div>

          </div>

          {/* =================================================
              BELANJA
          ================================================== */}

          <div>

            <h2 className="
              mb-4
              text-[11px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#20242D]
            ">
              Belanja
            </h2>

            <ul className="space-y-2.5">

              {SHOP_LINKS.map(({ to, label }) => (
                <li key={to}>

                  <Link
                    to={to}
                    className="
                      group
                      inline-flex
                      items-center
                      text-[13px]
                      text-[#737A87]
                      transition-colors
                      hover:text-[#538CDB]
                    "
                  >
                    <span
                      className="
                        mr-2
                        h-1
                        w-1
                        rounded-full
                        bg-[#E8ECF4]
                        transition-colors
                        group-hover:bg-[#538CDB]
                      "
                    />

                    {label}
                  </Link>

                </li>
              ))}

            </ul>

          </div>

          {/* =================================================
              BANTUAN
          ================================================== */}

          <div>

            <h2 className="
              mb-4
              text-[11px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#20242D]
            ">
              Bantuan
            </h2>

            <ul className="space-y-2.5">

              {LEGAL_LINKS.map(({ to, label, icon }) => (
                <li key={to}>

                  <Link
                    to={to}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      text-[13px]
                      text-[#737A87]
                      transition-colors
                      hover:text-[#538CDB]
                    "
                  >

                    <span
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#F5F5FF]
                        transition-colors
                        group-hover:bg-[#538CDB]/10
                      "
                    >
                      <Icon
                        name={icon}
                        size={13}
                        className="
                          text-[#737A87]
                          transition-colors
                          group-hover:text-[#538CDB]
                        "
                      />
                    </span>

                    {label}

                  </Link>

                </li>
              ))}

            </ul>

          </div>

        </div>

        {/* =====================================================
            BOTTOM
        ====================================================== */}

        <div className="
          mt-9
          flex
          flex-col
          gap-3
          border-t
          border-[#E8ECF4]
          pt-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        ">

          <p className="text-[11px] text-[#737A87]">
            © {new Date().getFullYear()} NeedBuy.
            Semua harga udah termasuk PPN.
          </p>

          <div className="flex items-center gap-2">

            <span className="text-[10px] text-[#A0A6B1]">
              Belanja lebih
            </span>

            <span className="
              rounded-full
              bg-[#F5F5FF]
              px-2.5
              py-1
              text-[10px]
              font-semibold
              text-[#538CDB]
            ">
              #NeedBuy
            </span>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;