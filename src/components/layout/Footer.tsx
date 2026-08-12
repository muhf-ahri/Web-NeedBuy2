// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon, { type IconName } from '../ui/Icon';

const LEGAL_LINKS: Array<{ to: string; label: string; icon: IconName }> = [
  { to: '/terms', label: 'Syarat & Ketentuan', icon: 'shield' },
  { to: '/privacy', label: 'Kebijakan Privasi', icon: 'lock' },
  { to: '/shipping', label: 'Info Pengiriman', icon: 'truck' },
  { to: '/contact', label: 'Hubungi Kami', icon: 'mail' },
];

const SHOP_LINKS = [
  { to: '/categories', label: 'Kategori' },
  { to: '/coupons', label: 'Kupon' },
  { to: '/orders', label: 'Pesanan' },
  { to: '/messages', label: 'Pesan Penjual' },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f2f4f6] border-t border-[#e0e3e5]">
      <div className="max-w-6xl mx-auto px-5 sm:px-10 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <span
              className="text-lg font-bold text-[#101319] tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              NeedBuy
            </span>
            <p className="text-xs text-[#737686] mt-1 max-w-[24ch]">
              Beli yang kamu butuhkan, bukan yang kamu lihat.
            </p>
          </div>

          {/* Belanja */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#737686] mb-3">
              Belanja
            </h2>
            <ul className="space-y-2">
              {SHOP_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[13px] text-[#434655] hover:text-[#004ac6] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan & legal */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#737686] mb-3">
              Bantuan
            </h2>
            <ul className="space-y-2">
              {LEGAL_LINKS.map(({ to, label, icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-2 text-[13px] text-[#434655] hover:text-[#004ac6] transition-colors"
                  >
                    <Icon name={icon} size={14} className="text-[#737686]" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 pt-6 border-t border-[#e0e3e5] text-xs text-[#737686]">
          © {new Date().getFullYear()} NeedBuy. Semua harga sudah termasuk PPN.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
