import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon, { type IconName } from './Icon';

export interface SidebarItem {
  to: string;
  label: string;
  icon: IconName;
}

interface SidebarProps {
  items: SidebarItem[];
  className?: string;

  title?: string;

  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  className = '',
  title = 'Menu',
  mobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();
  const listRef = useRef<HTMLUListElement>(null);

  const isControlled = typeof mobileOpen === 'boolean';
  const [internalOpen, setInternalOpen] = useState(false);
  const drawerOpen = isControlled ? mobileOpen : internalOpen;

  const closeDrawer = () => {
    if (isControlled) onMobileClose?.();
    else setInternalOpen(false);
  };

  const [pill, setPill] = useState<{ top: number; height: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isControlled) onMobileClose?.();
    else setInternalOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const activeLink = list.querySelector<HTMLAnchorElement>(
      `[data-item="${location.pathname}"]`
    );

    if (activeLink) {
      const listRect = list.getBoundingClientRect();
      const itemRect = activeLink.getBoundingClientRect();
      setPill({
        top: itemRect.top - listRect.top + list.scrollTop,
        height: itemRect.height,
      });
    } else {
      setPill(null);
    }

    if (!mounted) {
      const t = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(t);
    }
  }, [location.pathname, items, mounted, drawerOpen]);

  const sidebarContent = (
    <nav
      className={`
        relative overflow-hidden rounded-[20px] border border-white/80
        bg-white/95 p-2 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
        backdrop-blur-sm animate-sidebar-enter
        ${className}
      `}
    >
      <ul ref={listRef} className="relative space-y-0.5">
        {pill && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute left-2 right-2 rounded-xl
              bg-gradient-to-r from-[#538CDB]/15 to-[#538CDB]/10
              ring-1 ring-[#538CDB]/20
            "
            style={{
              top: pill.top,
              height: pill.height,
              transition: mounted
                ? 'top 0.45s cubic-bezier(0.22, 0.9, 0.35, 1), height 0.35s ease'
                : 'none',
            }}
          >
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[#538CDB]" />
            <span className="absolute -left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#FFD500]" />
          </span>
        )}

        {items.map((item) => {
          const active = location.pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                data-item={item.to}
                className={`
                  group relative flex items-center gap-3 rounded-xl px-3
                  py-2.5 text-[13px] font-semibold transition-all
                  duration-300 ease-out
                  ${active ? 'text-[#538CDB]' : 'text-[#434655] hover:text-[#538CDB]'}
                `}
              >
                <span
                  className={`
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-lg transition-all duration-300
                    ${
                      active
                        ? 'bg-[#538CDB] text-white scale-105 shadow-[0_4px_12px_rgba(83,140,219,0.30)]'
                        : 'bg-[#F5F7FB] text-[#737A87] group-hover:bg-[#538CDB]/10 group-hover:text-[#538CDB] group-hover:scale-105'
                    }
                  `}
                >
                  <Icon name={item.icon} size={16} />
                </span>

                <span className="min-w-0 flex-1 truncate">{item.label}</span>

                <Icon
                  name="chevronRight"
                  size={14}
                  className={`
                    shrink-0 transition-all duration-300
                    ${
                      active
                        ? 'translate-x-0 opacity-100 text-[#538CDB]'
                        : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[#538CDB]'
                    }
                  `}
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <style>{`
        @keyframes sidebar-enter {
          0% { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-sidebar-enter {
          animation: sidebar-enter 0.4s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
      `}</style>
    </nav>
  );

  return (
    <>
      <div className="hidden lg:block">{sidebarContent}</div>

      {!isControlled && (
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setInternalOpen(true)}
            className="
              flex h-9 w-9 items-center justify-center rounded-full border
              border-[#E8ECF4] bg-white/95 text-[#20242D] shadow-sm
              backdrop-blur-sm transition-all duration-200
              hover:border-[#538CDB] hover:text-[#538CDB] active:scale-[0.95]
            "
            aria-label="Buka menu"
          >
            <Icon name="menu" size={16} />
          </button>
        </div>
      )}

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[#20242D]/40 backdrop-blur-sm sidebar-backdrop-enter"
            onClick={closeDrawer}
          />

          <aside
            className="
              sidebar-drawer-enter absolute bottom-0 left-0 top-0 flex w-72
              max-w-[85vw] flex-col bg-[#F5F5FF]
              shadow-[12px_0_40px_rgba(32,36,45,0.15)]
            "
          >
            <div className="flex items-center justify-between border-b border-[#E8ECF4] px-5 py-4">
              <span className="flex items-center gap-2 text-[15px] font-bold text-[#20242D]">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#538CDB]/10">
                  <Icon name="grid" size={13} className="text-[#538CDB]" />
                </span>
                {title}
              </span>
              <button
                type="button"
                onClick={closeDrawer}
                className="
                  rounded-full p-1.5 text-[#737A87] transition-colors
                  hover:bg-white hover:text-[#20242D]
                "
                aria-label="Tutup menu"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              {sidebarContent}
            </div>
          </aside>
        </div>
      )}

      <style>{`
        @keyframes sidebar-drawer-enter {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .sidebar-drawer-enter {
          animation: sidebar-drawer-enter 0.3s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
        @keyframes sidebar-backdrop-enter {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .sidebar-backdrop-enter {
          animation: sidebar-backdrop-enter 0.25s ease both;
        }
      `}</style>
    </>
  );
};

export default Sidebar;