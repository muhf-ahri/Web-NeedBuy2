import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Icon, { type IconName } from '../ui/Icon';
import SearchSuggestions from '../ui/SearchSuggestions';
import NotificationBell from '../ui/NotificationBell';

import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

import { dashboardPathFor, hasDashboard } from '../../utils/roleHome';

interface NavbarProps {
  avatarUrl?: string;
  showSearch?: boolean;
}

const NAV_LINKS = [
  { to: '/categories', label: 'Kategori' },
  { to: '/plans', label: 'Rencana Belanja' },
  { to: '/needs', label: 'Kebutuhan' },
  { to: '/orders', label: 'Pesanan' },
];

const QUICK_ACTIONS: Array<{
  to: string;
  label: string;
  icon: IconName;
}> = [
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

  const showDashboard = hasDashboard(user?.role);
  const isAdmin = user?.role === 'ADMIN';

  const location = useLocation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const blueMode = scrolled;

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  /* Track scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Focus input saat search dibuka */
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  /* Klik di luar navbar → tutup search */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
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

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  /* ── Form search (dipakai di overlay desktop & panel mobile) ── */
  const searchForm = (
    <form
      onSubmit={handleSearchSubmit}
      className="
        flex w-full items-center rounded-full border border-[#E8ECF4]
        bg-white/95 px-3 shadow-[0_4px_14px_rgba(32,36,45,0.08)]
        backdrop-blur-xl
      "
    >
      <Icon name="search" size={15} className="shrink-0 text-[#737A87]" />

      <input
        ref={searchInputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearchKeyDown}
        placeholder="Cari produk..."
        className="
          min-w-0 flex-1 bg-transparent px-2 py-2 text-[12px]
          text-[#20242D] outline-none placeholder:text-[#A0A6B1]
      "
      />

      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="text-[#A0A6B1] transition-colors hover:text-[#538CDB]"
          aria-label="Hapus kata kunci"
        >
          <Icon name="close" size={13} />
        </button>
      )}
    </form>
  );

  return (
    <header className="sticky top-0 z-50 group">
      {/* ── NAVBAR MENTOK: full-width, tanpa rounded, tanpa margin atas ── */}
      <nav
        ref={navRef}
        className={`
          w-full border-b backdrop-blur-xl transition-all duration-500
          ease-out
          ${
            scrolled
              ? 'border-[#467BC7]/50 bg-[#538CDB]/95 text-white shadow-[0_8px_24px_rgba(83,140,219,0.25)]'
              : 'border-white/60 bg-white/25 shadow-[0_4px_16px_rgba(32,36,45,0.04)] group-hover:border-[#467BC7]/50 group-hover:bg-[#538CDB]/95 group-hover:text-white group-hover:shadow-[0_8px_24px_rgba(83,140,219,0.25)]'
          }
        `}
      >
        {/* ── MAIN BAR ── */}
        <div className="relative flex h-[60px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* LOGO */}
          <Link
            to="/"
            className="group/logo flex shrink-0 items-center gap-2.5"
            aria-label="NeedBuy"
          >

            <span
              className={`
                hidden text-[17px] font-bold tracking-tight
                transition-colors duration-300 sm:block
                ${
                  blueMode
                    ? 'text-white'
                    : 'text-[#20242D] group-hover:text-white group-hover/logo:text-white'
                }
              `}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              NeedBuy
            </span>
          </Link>

          {/* ── AREA TENGAH: nav links + search overlay (desktop) ── */}
          <div className="relative hidden h-full flex-1 md:block">
            {/* Nav links — fade out saat search terbuka */}
            <div
              className={`
                flex h-full items-center justify-center gap-1
                transition-all duration-300
                ${searchOpen ? 'pointer-events-none opacity-0' : 'opacity-100'}
              `}
            >
              {NAV_LINKS.map(({ to, label }) => {
                const active = isActive(to);

                return (
                  <Link
                    key={to}
                    to={to}
                    className={`
                      group/link relative rounded-lg px-3 py-2 text-[13px]
                      font-medium transition-colors duration-300
                      ${
                        active
                          ? blueMode
                            ? 'text-white'
                            : 'text-[#538CDB] group-hover:text-white'
                          : blueMode
                            ? 'text-white/80 hover:text-white'
                            : 'text-[#737A87] hover:text-[#538CDB] group-hover:text-white/80 group-hover:hover:text-white'
                      }
                    `}
                  >
                    <span
                      className={`
                        absolute inset-0 rounded-lg transition-all
                        duration-300
                        ${
                          active
                            ? blueMode
                              ? 'bg-white/15'
                              : 'bg-[#F5F5FF] group-hover:bg-white/15'
                            : blueMode
                              ? 'bg-white/10 opacity-0 group-hover/link:opacity-100'
                              : 'bg-[#F5F5FF] opacity-0 group-hover/link:opacity-100 group-hover:bg-white/10'
                        }
                      `}
                    />

                    <span className="relative z-10">{label}</span>

                    <span
                      className={`
                        absolute bottom-0.5 left-3 right-3 h-[2px]
                        origin-left rounded-full transition-all duration-200
                        ${
                          active
                            ? 'scale-x-100 opacity-100'
                            : 'scale-x-0 opacity-0 group-hover/link:scale-x-100 group-hover/link:opacity-100'
                        }
                        ${blueMode ? 'bg-white' : 'bg-[#538CDB] group-hover:bg-white'}
                      `}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Search overlay — mengambil alih area tengah,
                TIDAK menimpa nav links (karena nav links fade out) */}
            {showSearch && (
              <div
                className={`
                  absolute inset-x-6 top-1/2 -translate-y-1/2
                  transition-all duration-300 lg:inset-x-16
                  ${
                    searchOpen
                      ? 'visible opacity-100'
                      : 'pointer-events-none invisible opacity-0'
                  }
                `}
              >
                <div className="relative">
                  {searchForm}

                  {searchOpen && (
                    <SearchSuggestions
                      term={searchQuery}
                      onPick={closeSearch}
                      className="left-0 right-auto w-full"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT ACTIONS ── */}
          <div className="ml-auto flex items-center gap-1">
            {/* Search toggle */}
            {showSearch && (
              <button
                onClick={() => {
                  setSearchOpen((prev) => !prev);
                  if (searchOpen) setSearchQuery('');
                }}
                className={`
                  flex h-9 w-9 items-center justify-center rounded-full
                  transition-all duration-300
                  ${
                    searchOpen
                      ? blueMode
                        ? 'bg-white text-[#538CDB] shadow-[0_4px_12px_rgba(255,255,255,0.25)]'
                        : 'bg-[#538CDB] text-white shadow-[0_4px_12px_rgba(83,140,219,0.25)]'
                      : blueMode
                        ? 'text-white/90 hover:bg-white/15 hover:text-white'
                        : 'text-[#737A87] hover:bg-[#F5F5FF] hover:text-[#538CDB] group-hover:text-white/90 group-hover:hover:bg-white/15 group-hover:hover:text-white'
                  }
                `}
                aria-label={searchOpen ? 'Tutup pencarian' : 'Buka pencarian'}
              >
                <Icon name={searchOpen ? 'close' : 'search'} size={17} />
              </button>
            )}

            {/* DASHBOARD */}
            {showDashboard && (
              <Link
                to={dashboardPathFor(user?.role)}
                className={`
                  ml-1 inline-flex shrink-0 items-center gap-1.5
                  rounded-full px-3 py-2 text-[12px] font-semibold
                  transition-all duration-300 active:scale-[0.98]
                  ${
                    blueMode
                      ? 'bg-white text-[#538CDB] shadow-[0_6px_16px_rgba(255,255,255,0.20)] hover:bg-white/90'
                      : 'bg-[#538CDB] text-white shadow-[0_6px_16px_rgba(83,140,219,0.20)] hover:bg-[#467BC7]'
                  }
                `}
                aria-label={isAdmin ? 'Dashboard Admin' : 'Dashboard Toko'}
              >
                <Icon
                  name="dashboard"
                  size={15}
                  className={blueMode ? 'text-[#538CDB]' : 'text-white'}
                />
                <span className="hidden lg:inline">
                  {isAdmin ? 'Dashboard Admin' : 'Dashboard Toko'}
                </span>
              </Link>
            )}

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className={`
                hidden h-9 w-9 items-center justify-center rounded-full
                transition-colors duration-300 md:inline-flex
                ${
                  blueMode
                    ? 'text-white/90 hover:bg-white/15 hover:text-white'
                    : 'text-[#737A87] hover:bg-[#F5F5FF] hover:text-[#538CDB] group-hover:text-white/90 group-hover:hover:bg-white/15 group-hover:hover:text-white'
                }
              `}
              aria-label="Wishlist"
            >
              <Icon name="heart" size={17} />
            </Link>

            {/* NOTIFICATION */}
            <div
              className={`
                flex h-9 w-9 items-center justify-center rounded-full
                transition-colors duration-300
                ${
                  blueMode
                    ? 'text-white/90 hover:bg-white/15 hover:text-white'
                    : 'text-[#737A87] hover:bg-[#F5F5FF] hover:text-[#538CDB] group-hover:text-white/90 group-hover:hover:bg-white/15 group-hover:hover:text-white'
                }
              `}
            >
              <NotificationBell />
            </div>

            {/* CART */}
            <Link
              to="/cart"
              className={`
                relative flex h-9 w-9 items-center justify-center
                rounded-full transition-colors duration-300
                ${
                  blueMode
                    ? 'text-white/90 hover:bg-white/15 hover:text-white'
                    : 'text-[#737A87] hover:bg-[#F5F5FF] hover:text-[#538CDB] group-hover:text-white/90 group-hover:hover:bg-white/15 group-hover:hover:text-white'
                }
              `}
              aria-label={cartCount > 0 ? `Keranjang, ${cartCount} item` : 'Keranjang'}
            >
              <Icon name="cart" size={17} />
              {cartCount > 0 && (
                <span
                  className="
                    absolute right-0 top-0 flex h-4 min-w-4 items-center
                    justify-center rounded-full bg-[#FF4646] px-1 text-[8px]
                    font-bold leading-none text-white ring-2 ring-[#538CDB]
                    group-hover:ring-white
                  "
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* PROFILE */}
            <Link
              to="/profile"
              className={`
                ml-1 flex h-9 w-9 shrink-0 items-center justify-center
                overflow-hidden rounded-full border transition-all
                duration-300
                ${
                  blueMode
                    ? 'border-white/40 bg-white/15 hover:bg-white/25'
                    : 'border-[#DCE5F5] bg-[#F5F5FF] hover:border-[#538CDB] group-hover:border-white/40 group-hover:bg-white/15'
                }
              `}
              aria-label="Profil"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <Icon
                  name="user"
                  size={15}
                  className={blueMode ? 'text-white' : 'text-[#737A87] group-hover:text-white'}
                />
              )}
            </Link>
          </div>

          {/* ── MOBILE SEARCH PANEL — overlay di bawah bar,
              tidak mendorong quick actions ── */}
          {showSearch && (
            <div
              className={`
                absolute inset-x-0 top-full z-10 border-b border-[#E8ECF4]
                bg-white/95 px-4 pb-3 pt-2 backdrop-blur-xl
                transition-all duration-300 md:hidden
                ${searchOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'}
              `}
            >
              <div className="relative">
                {searchForm}

                {searchOpen && (
                  <SearchSuggestions
                    term={searchQuery}
                    onPick={closeSearch}
                    className="left-0 right-auto w-full"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── MOBILE QUICK ACTIONS ── */}
        <div
          className={`
            border-t transition-all duration-500 ease-out md:hidden
            ${
              blueMode
                ? 'border-white/15 bg-[#467BC7]/95'
                : 'border-[#E8ECF4] bg-[#FDFCFF] group-hover:border-white/15 group-hover:bg-[#467BC7]/95'
            }
          `}
        >
          <ul
            className="
              flex gap-3 overflow-x-auto px-4 py-2.5
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            "
          >
            {QUICK_ACTIONS.map(({ to, label, icon }) => {
              const active = isActive(to);

              return (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={active ? 'page' : undefined}
                    className="
                      group/action flex w-14 shrink-0 flex-col items-center
                      gap-1 focus-visible:outline-none
                    "
                  >
                    <span
                      className={`
                        flex h-9 w-9 items-center justify-center
                        rounded-xl transition-all duration-300
                        ${
                          active
                            ? blueMode
                              ? 'bg-white text-[#538CDB] shadow-[0_4px_10px_rgba(255,255,255,0.20)]'
                              : 'bg-gradient-to-br from-[#5B93E0] to-[#3A66AC] text-white shadow-[0_4px_10px_rgba(83,140,219,0.22)]'
                            : blueMode
                              ? 'bg-white/10 text-white/90 ring-1 ring-white/20 group-hover/action:bg-white/20'
                              : 'bg-white text-[#737A87] ring-1 ring-[#E8ECF4] group-hover/action:bg-[#F5F5FF] group-hover/action:text-[#538CDB] group-hover:bg-white/10 group-hover:text-white/90 group-hover:ring-white/20'
                        }
                      `}
                    >
                      <Icon name={icon} size={17} />
                    </span>

                    <span
                      className={`
                        whitespace-nowrap text-[9px] font-medium
                        leading-none transition-colors duration-300
                        ${
                          active
                            ? blueMode
                              ? 'text-white'
                              : 'text-[#538CDB]'
                            : blueMode
                              ? 'text-white/80'
                              : 'text-[#737A87] group-hover:text-white/80'
                        }
                      `}
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
    </header>
  );
};

export default Navbar;