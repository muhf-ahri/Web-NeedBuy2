// src/components/ui/ProfileDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileDropdownProps {
  avatarUrl?: string;
  sellerName?: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  avatarUrl,
  sellerName = 'Seller',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

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
    { to: '/seller/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/seller/profile', label: 'Profile', icon: 'user' },
    { to: '/seller/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar / Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#f2f4f6] transition-colors focus:outline-none"
        aria-label="Profile menu"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#dbe1ff] border border-[#c3c6d7] flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <Icon name="user" size={16} className="text-[#004ac6]" />
          )}
        </div>
        <span className="text-[13px] font-medium text-[#191c1e] hidden sm:inline">
          {sellerName}
        </span>
        <Icon name="chevronDown" size={14} className="text-[#737686] hidden sm:block" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e0e3e5] overflow-hidden z-50 animate-slideDown">
          <div className="px-4 py-3 border-b border-[#e0e3e5]">
            <p className="text-[13px] font-bold text-[#191c1e]">{sellerName}</p>
            <p className="text-[11px] text-[#737686]">Seller Account</p>
          </div>

          <ul className="py-1">
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#434655] hover:bg-[#f2f4f6] hover:text-[#004ac6] transition-colors"
                >
                  <Icon name={item.icon as any} size={16} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-[#e0e3e5] py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-[13px] text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
            >
              <Icon name="logout" size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;