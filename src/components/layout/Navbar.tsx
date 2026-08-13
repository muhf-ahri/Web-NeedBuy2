// src/components/layout/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon, { type IconName } from '../ui/Icon';
import SearchSuggestions from '../ui/SearchSuggestions';
import NotificationBell from '../ui/NotificationBell';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  avatarUrl?: string;
  showSearch?: boolean; // default true
}

const NAV_LINKS = [
  { to: '/categories', label: 'Kategori' },
  { to: '/plans', label: 'Rencana Belanja' },
  { to: '/needs', label: 'Kebutuhan' },
  { to: '/orders', label: 'Pesanan' },
];

const QUICK_ACTIONS: Array<{ to: string; label: string; icon: IconName }> = [
  { to: '/orders', label: 'Pesanan', icon: 'orders' },
  { to: '/coupons', label: 'Kupon', icon: 'coupon' },
  { to: '/messages', label: 'Pesan', icon: 'chat' },
  { to: '/categories', label: 'Kategori', icon: 'grid' },
  { to: '/plans', label: 'Rencana', icon: 'plan' },
  { to: '/needs', label: 'Kebutuhan', icon: 'spark' },
  { to: '/wishlist', label: 'Wishlist', icon: 'heart' },
];

const Navbar: React.FC<NavbarProps> = ({ avatarUrl, showSearch = true }) => {
  const { cartCount } = useCart();
  const { user } = useAuth();
  const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    if (searchOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white border-b border-[#e0e3e5] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-10 h-16">

        {/* ── Logo ── */}
        <Link
          to="/"
          className={`text-xl font-bold tracking-tight shrink-0 transition-colors duration-200 ${
            location.pathname === '/' ? 'text-[#004ac6]' : 'text-[#101319] hover:text-[#004ac6]'
          }`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          NeedBuy
        </Link>

        {/* ── Desktop Navigation Links ── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`
                  relative px-3 py-1.5 text-sm font-medium rounded-lg
                  transition-colors duration-200 group
                  ${active ? 'text-[#004ac6]' : 'text-[#434655] hover:text-[#004ac6]'}
                `}
              >
                <span
                  className={`
                    absolute inset-0 rounded-lg transition-all duration-200
                    ${active ? 'opacity-0' : 'bg-[#f2f4f6] opacity-0 group-hover:opacity-100'}
                  `}
                />
                <span className="relative">{label}</span>
                <span
                  className={`
                    absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#004ac6]
                    transition-all duration-250 origin-left
                    ${active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'}
                  `}
                />
              </Link>
            );
          })}
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-1">
          {/* Search — hanya tampil jika showSearch true */}
          {showSearch && (
            <div ref={searchContainerRef} className="relative flex items-center">
              <div
                className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
                  searchOpen
                    ? 'w-40 sm:w-64 bg-[#f2f4f6] rounded-full border border-[#c3c6d7] focus-within:border-[#004ac6] focus-within:ring-2 focus-within:ring-[#004ac6]/20'
                    : 'w-0 border-transparent'
                }`}
              >
                <form onSubmit={handleSearchSubmit} className="flex items-center w-full px-3">
                  <Icon name="search" size={16} className="text-[#737686] shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Mau cari apa hari ini?"
                    className="flex-1 bg-transparent outline-none text-sm text-[#101319] placeholder-[#737686] px-2 py-1.5 min-w-0"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-[#737686] hover:text-[#101319] transition-colors"
                      aria-label="Hapus kata kunci"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  )}
                </form>
              </div>

              <button
                onClick={() => {
                  setSearchOpen((prev) => !prev);
                  if (searchOpen) setSearchQuery('');
                }}
                className={`p-2 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6] ${
                  searchOpen
                    ? 'text-[#004ac6] bg-[#dbe1ff]'
                    : 'text-[#434655] hover:text-[#004ac6] hover:bg-[#f2f4f6]'
                }`}
                aria-label={searchOpen ? 'Tutup pencarian' : 'Buka pencarian'}
              >
                <Icon name={searchOpen ? 'close' : 'search'} size={18} />
              </button>

              {searchOpen && (
                <SearchSuggestions
                  term={searchQuery}
                  onPick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="left-auto w-[280px] sm:w-[360px]"
                />
              )}
            </div>
          )}

          {/* Dashboard Toko */}
          {isSeller && (
            <Link
              to="/seller/dashboard"
              className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full bg-[#004ac6] text-white text-[13px] font-semibold hover:bg-[#003a9e] transition-colors duration-200 shrink-0"
              aria-label="Dashboard Toko"
            >
              <Icon name="dashboard" size={16} className="text-white" />
              <span className="hidden md:inline">Dashboard Toko</span>
            </Link>
          )}

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hidden md:inline-flex relative p-2 rounded-full text-[#434655] hover:text-[#004ac6] hover:bg-[#f2f4f6] transition-colors duration-200"
            aria-label="Wishlist"
          >
            <Icon name="heart" size={18} />
          </Link>

          {/* Notification */}
          <NotificationBell />

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full text-[#434655] hover:text-[#004ac6] hover:bg-[#f2f4f6] transition-colors duration-200"
            aria-label={cartCount > 0 ? `Keranjang, ${cartCount} item` : 'Keranjang'}
          >
            <Icon name="cart" size={18} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#004ac6] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Avatar / Profile */}
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full overflow-hidden bg-[#eceef0] border border-[#c3c6d7] hover:border-[#004ac6] transition-colors duration-200 shrink-0 flex items-center justify-center"
            aria-label="Profil"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Icon name="user" size={16} className="text-[#737686]" />
            )}
          </Link>
        </div>
      </div>

      {/* ── Quick actions (mobile) ── */}
      <div className="md:hidden border-t border-[#e0e3e5] bg-white">
        <ul className="flex gap-4 overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {QUICK_ACTIONS.map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  className="flex flex-col items-center gap-1.5 w-14 shrink-0 group focus-visible:outline-none"
                >
                  <span
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[#004ac6] ${
                      active
                        ? 'bg-[#004ac6] text-white'
                        : 'bg-[#f2f4f6] text-[#434655] group-hover:bg-[#dbe1ff] group-hover:text-[#004ac6]'
                    }`}
                  >
                    <Icon name={icon} size={20} />
                  </span>
                  <span
                    className={`text-[11px] leading-none font-medium ${
                      active ? 'text-[#004ac6]' : 'text-[#434655]'
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;