import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Icon, { type IconName } from '../ui/Icon';
import SearchSuggestions from '../ui/SearchSuggestions';
import NotificationBell from '../ui/NotificationBell';

import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

import {
  dashboardPathFor,
  hasDashboard,
} from '../../utils/roleHome';

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

const Navbar: React.FC<NavbarProps> = ({
  avatarUrl,
  showSearch = true,
}) => {
  const { cartCount } = useCart();
  const { user } = useAuth();

  const showDashboard = hasDashboard(user?.role);
  const isAdmin = user?.role === 'ADMIN';

  const location = useLocation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(
          e.target as Node
        )
      ) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    if (searchOpen) {
      document.addEventListener(
        'mousedown',
        handleClickOutside
      );
    }

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, [searchOpen]);

  const handleSearchSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(
        `/search?q=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );

      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E8ECF4] bg-white/95 backdrop-blur-md">

      {/* =====================================================
          DESKTOP / MAIN NAVBAR
      ====================================================== */}

      <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* =================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2"
          aria-label="NeedBuy"
        >
          {/* N Logo */}
          <span
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-sm
              font-bold
              shadow-[0_4px_12px_rgba(83,140,219,0.15)]
              transition-all
              duration-200
              group-hover:-translate-y-0.5
              ${
                location.pathname === '/'
                  ? 'bg-[#538CDB] text-white'
                  : 'bg-[#F5F5FF] text-[#538CDB]'
              }
            `}
          >
            N
          </span>

          {/* Brand */}
          <span
            className={`
              hidden
              text-[17px]
              font-bold
              tracking-tight
              transition-colors
              sm:block
              ${
                location.pathname === '/'
                  ? 'text-[#538CDB]'
                  : 'text-[#20242D] group-hover:text-[#538CDB]'
              }
            `}
            style={{
              fontFamily:
                "'Plus Jakarta Sans', sans-serif",
            }}
          >
            NeedBuy
          </span>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <div className="hidden items-center gap-0.5 md:flex">

          {NAV_LINKS.map(({ to, label }) => {
            const active = isActive(to);

            return (
              <Link
                key={to}
                to={to}
                className={`
                  group
                  relative
                  rounded-lg
                  px-3
                  py-2
                  text-[13px]
                  font-medium
                  transition-colors
                  duration-200
                  ${
                    active
                      ? 'text-[#538CDB]'
                      : 'text-[#737A87] hover:text-[#538CDB]'
                  }
                `}
              >
                {/* Hover background */}
                <span
                  className={`
                    absolute
                    inset-0
                    -z-0
                    rounded-lg
                    bg-[#F5F5FF]
                    transition-opacity
                    duration-200
                    ${
                      active
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }
                  `}
                />

                <span className="relative z-10">
                  {label}
                </span>

                {/* Active indicator */}
                <span
                  className={`
                    absolute
                    bottom-0.5
                    left-3
                    right-3
                    h-[2px]
                    origin-left
                    rounded-full
                    bg-[#538CDB]
                    transition-all
                    duration-200
                    ${
                      active
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                    }
                  `}
                />
              </Link>
            );
          })}

        </div>

        {/* =================================================
            RIGHT ACTIONS
        ================================================== */}

        <div className="flex items-center gap-1">

          {/* =================================================
              SEARCH
          ================================================== */}

          {showSearch && (
            <div
              ref={searchContainerRef}
              className="relative flex items-center"
            >

              <div
                className={`
                  flex
                  items-center
                  overflow-hidden
                  transition-all
                  duration-300
                  ease-in-out
                  ${
                    searchOpen
                      ? 'w-40 rounded-full border border-[#DCE5F5] bg-[#F5F5FF] focus-within:border-[#538CDB] focus-within:ring-2 focus-within:ring-[#538CDB]/10 sm:w-64'
                      : 'w-0 border-transparent'
                  }
                `}
              >

                <form
                  onSubmit={handleSearchSubmit}
                  className="flex w-full items-center px-3"
                >

                  <Icon
                    name="search"
                    size={15}
                    className="shrink-0 text-[#737A87]"
                  />

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Cari produk..."
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-2
                      py-1.5
                      text-[12px]
                      text-[#20242D]
                      outline-none
                      placeholder:text-[#A0A6B1]
                    "
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearchQuery('')
                      }
                      className="
                        text-[#A0A6B1]
                        transition-colors
                        hover:text-[#538CDB]
                      "
                      aria-label="Hapus kata kunci"
                    >
                      <Icon
                        name="close"
                        size={13}
                      />
                    </button>
                  )}

                </form>

              </div>

              {/* Search button */}

              <button
                onClick={() => {
                  setSearchOpen((prev) => !prev);

                  if (searchOpen) {
                    setSearchQuery('');
                  }
                }}
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  duration-200
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-[#538CDB]
                  ${
                    searchOpen
                      ? 'bg-[#538CDB] text-white'
                      : 'text-[#737A87] hover:bg-[#F5F5FF] hover:text-[#538CDB]'
                  }
                `}
                aria-label={
                  searchOpen
                    ? 'Tutup pencarian'
                    : 'Buka pencarian'
                }
              >
                <Icon
                  name={
                    searchOpen
                      ? 'close'
                      : 'search'
                  }
                  size={17}
                />
              </button>

              {/* Suggestions */}

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

          {/* =================================================
              DASHBOARD
          ================================================== */}

          {showDashboard && (
            <Link
              to={dashboardPathFor(user?.role)}
              className="
                ml-1
                inline-flex
                shrink-0
                items-center
                gap-1.5
                rounded-full
                bg-[#538CDB]
                px-3
                py-2
                text-[12px]
                font-semibold
                text-white
                shadow-[0_4px_12px_rgba(83,140,219,0.15)]
                transition-all
                duration-200
                hover:bg-[#467BC7]
                hover:shadow-[0_6px_16px_rgba(83,140,219,0.20)]
                active:scale-[0.98]
              "
              aria-label={
                isAdmin
                  ? 'Dashboard Admin'
                  : 'Dashboard Toko'
              }
            >
              <Icon
                name="dashboard"
                size={15}
                className="text-white"
              />

              <span className="hidden lg:inline">
                {isAdmin
                  ? 'Dashboard Admin'
                  : 'Dashboard Toko'}
              </span>
            </Link>
          )}

          {/* =================================================
              WISHLIST
          ================================================== */}

          <Link
            to="/wishlist"
            className="
              hidden
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[#737A87]
              transition-colors
              duration-200
              hover:bg-[#F5F5FF]
              hover:text-[#538CDB]
              md:inline-flex
            "
            aria-label="Wishlist"
          >
            <Icon
              name="heart"
              size={17}
            />
          </Link>

          {/* =================================================
              NOTIFICATION
          ================================================== */}

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[#737A87]
              transition-colors
              hover:bg-[#F5F5FF]
              hover:text-[#538CDB]
            "
          >
            <NotificationBell />
          </div>

          {/* =================================================
              CART
          ================================================== */}

          <Link
            to="/cart"
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[#737A87]
              transition-colors
              duration-200
              hover:bg-[#F5F5FF]
              hover:text-[#538CDB]
            "
            aria-label={
              cartCount > 0
                ? `Keranjang, ${cartCount} item`
                : 'Keranjang'
            }
          >
            <Icon
              name="cart"
              size={17}
            />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-4
                  min-w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FF4646]
                  px-1
                  text-[8px]
                  font-bold
                  leading-none
                  text-white
                  ring-2
                  ring-white
                "
              >
                {cartCount > 9
                  ? '9+'
                  : cartCount}
              </span>
            )}
          </Link>

          {/* =================================================
              PROFILE
          ================================================== */}

          <Link
            to="/profile"
            className="
              ml-1
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-[#DCE5F5]
              bg-[#F5F5FF]
              transition-all
              duration-200
              hover:border-[#538CDB]
              hover:ring-2
              hover:ring-[#538CDB]/10
            "
            aria-label="Profil"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Icon
                name="user"
                size={15}
                className="text-[#737A87]"
              />
            )}
          </Link>

        </div>

      </div>

      {/* =====================================================
          MOBILE QUICK ACTIONS
      ====================================================== */}

      <div className="border-t border-[#E8ECF4] bg-[#FDFCFF] md:hidden">

        <ul
          className="
            flex
            gap-3
            overflow-x-auto
            px-5
            py-2.5
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          {QUICK_ACTIONS.map(
            ({ to, label, icon }) => {
              const active = isActive(to);

              return (
                <li key={to}>

                  <Link
                    to={to}
                    aria-current={
                      active
                        ? 'page'
                        : undefined
                    }
                    className="
                      group
                      flex
                      w-14
                      shrink-0
                      flex-col
                      items-center
                      gap-1
                      focus-visible:outline-none
                    "
                  >

                    {/* Icon container */}

                    <span
                      className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        transition-all
                        duration-200
                        ${
                          active
                            ? 'bg-[#538CDB] text-white shadow-[0_4px_10px_rgba(83,140,219,0.18)]'
                            : 'bg-white text-[#737A87] ring-1 ring-[#E8ECF4] group-hover:bg-[#F5F5FF] group-hover:text-[#538CDB]'
                        }
                      `}
                    >
                      <Icon
                        name={icon}
                        size={17}
                      />
                    </span>

                    {/* Label */}

                    <span
                      className={`
                        whitespace-nowrap
                        text-[9px]
                        font-medium
                        leading-none
                        ${
                          active
                            ? 'text-[#538CDB]'
                            : 'text-[#737A87]'
                        }
                      `}
                    >
                      {label}
                    </span>

                  </Link>

                </li>
              );
            }
          )}

        </ul>

      </div>

    </nav>
  );
};

export default Navbar;