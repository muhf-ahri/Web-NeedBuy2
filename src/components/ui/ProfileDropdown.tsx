import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardPathFor } from '../../utils/roleHome';

interface ProfileDropdownProps {
  avatarUrl?: string;
  sellerName?: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  avatarUrl: avatarUrlProp,
  sellerName = 'Seller',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { to: dashboardPathFor(user?.role), label: 'Dashboard', icon: 'dashboard' },
    { to: '/profile', label: 'Profil', icon: 'user' },
    {
      to: isAdmin ? '/admin/settings' : '/seller/settings',
      label: 'Setelan',
      icon: 'settings',
    },
  ];

  const avatarUrl = avatarUrlProp ?? user?.avatarUrl ?? undefined;
  const initials = (sellerName || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>

      <button
        type="button"
        onClick={() => setIsOpen((s) => !s)}
        className="
          group flex items-center gap-2 rounded-full p-1 transition-all
          duration-200 hover:bg-[#F5F7FB] focus:outline-none
          focus-visible:ring-2 focus-visible:ring-[#538cbd]/30
        "
        aria-label="Menu profil"
        aria-expanded={isOpen}
      >

        <span
          className={`
            relative flex h-9 w-9 items-center justify-center overflow-hidden
            rounded-full bg-gradient-to-br from-[#538cbd] to-[#284a67]
            ring-2 transition-all duration-200
            ${isOpen ? 'ring-[#538cbd]' : 'ring-white group-hover:ring-[#538cbd]/50'}
          `}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[11px] font-extrabold text-white">
              {initials}
            </span>
          )}
          <span className="pointer-events-none absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#FFD500] ring-2 ring-white" />
        </span>

        <span className="hidden text-[13px] font-semibold text-[#101319] sm:inline">
          {sellerName}
        </span>
        <Icon
          name="chevronDown"
          size={14}
          className={`
            hidden shrink-0 text-[#737686] transition-transform duration-200
            sm:block ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl
            border border-white/80 bg-white/98
            shadow-[0_18px_50px_rgba(32,36,45,0.15)] backdrop-blur-md
            profile-dropdown-enter
          "
        >
          <div
            className="
              relative overflow-hidden border-b border-[#e0e3e5] px-4 py-3.5
            "
          >
            <span
              className="
                pointer-events-none absolute -right-6 -top-6 h-16 w-16
                rounded-full bg-[#538cbd]/5
              "
            />
            <span
              className="
                pointer-events-none absolute -right-2 bottom-2 h-1.5 w-1.5
                rounded-full bg-[#FFD500]
              "
            />

            <div className="relative flex items-center gap-3">
              <span
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  overflow-hidden rounded-full bg-gradient-to-br
                  from-[#538cbd] to-[#284a67] ring-2 ring-white
                "
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[13px] font-extrabold text-white">
                    {initials}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-[#101319]">
                  {sellerName}
                </p>
                <span
                  className={`
                    mt-0.5 inline-flex items-center gap-1 rounded-full px-2
                    py-0.5 text-[9px] font-bold uppercase tracking-wider
                    ${
                      isAdmin
                        ? 'bg-[#FFF0F0] text-[#ba1a1a]'
                        : 'bg-[#f5f7fb] text-[#4077a6]'
                    }
                  `}
                >
                  <span
                    className={`
                      h-1 w-1 rounded-full
                      ${isAdmin ? 'bg-[#ba1a1a]' : 'bg-[#4077a6]'}
                    `}
                  />
                  {isAdmin ? 'Admin' : 'Penjual'}
                </span>
              </div>
            </div>
          </div>

          <ul className="p-1.5">
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="
                    group flex items-center gap-3 rounded-xl px-2.5 py-2
                    text-[13px] font-medium text-[#434655] transition-all
                    duration-200 hover:bg-[#F5F7FB] hover:text-[#4077a6]
                  "
                >
                  <span
                    className="
                      flex h-7 w-7 shrink-0 items-center justify-center
                      rounded-lg bg-[#F5F7FB] text-[#737686] transition-all
                      duration-200 group-hover:bg-[#538cbd]/10
                      group-hover:text-[#4077a6]
                    "
                  >
                    <Icon name={item.icon as any} size={14} />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <Icon
                    name="chevronRight"
                    size={13}
                    className="
                      -translate-x-1 text-[#A2A8B3] opacity-0
                      transition-all duration-200 group-hover:translate-x-0
                      group-hover:opacity-100 group-hover:text-[#4077a6]
                    "
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-[#e0e3e5] p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="
                group flex w-full items-center gap-3 rounded-xl px-2.5 py-2
                text-[13px] font-semibold text-[#ba1a1a] transition-all
                duration-200 hover:bg-[#FFF0F0]
              "
            >
              <span
                className="
                  flex h-7 w-7 shrink-0 items-center justify-center
                  rounded-lg bg-[#FFF0F0] text-[#ba1a1a] transition-colors
                  group-hover:bg-[#ba1a1a] group-hover:text-white
                "
              >
                <Icon name="logout" size={14} />
              </span>
              Keluar
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes profile-dropdown-enter {
          0% {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .profile-dropdown-enter {
          animation: profile-dropdown-enter 0.2s cubic-bezier(0.22, 0.9, 0.35, 1) both;
          transform-origin: top right;
        }
      `}</style>
    </div>
  );
};

export default ProfileDropdown;