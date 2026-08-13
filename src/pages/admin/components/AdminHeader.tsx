// src/pages/admin/components/AdminHeader.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/Icon';
import SearchSuggestions from '../../../components/ui/SearchSuggestions';
import NotificationBell from '../../../components/ui/NotificationBell';
import ProfileDropdown from '../../../components/ui/ProfileDropdown';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-40 border-b border-[#e0e3e5] bg-white">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-10">
        {/* Logo */}
        <Link to="/admin/dashboard" className="text-xl font-bold tracking-tight text-[#004ac6]">
          NeedBuy Admin
        </Link>

        {/* Search + Actions */}
        <div className="flex items-center gap-1">
          {/* Search — dengan animasi expand seperti Navbar */}
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
                  placeholder="Cari di admin..."
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

          {/* Notification */}
          <NotificationBell />

          {/* Profile Dropdown */}
          <ProfileDropdown sellerName="Admin" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;