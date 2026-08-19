import React, { useEffect, useState } from 'react';
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

  const isControlled = typeof mobileOpen === 'boolean';

  const [internalOpen, setInternalOpen] = useState(false);
  const drawerOpen = isControlled ? mobileOpen : internalOpen;

  useEffect(() => {
    if (isControlled) {
      onMobileClose?.();
    } else {
      setInternalOpen(false);
    }

  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const closeDrawer = () => {
    if (isControlled) {
      onMobileClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  const buildContent = () => (
    <nav
      className={`
        sidebar-shell
        relative
        overflow-hidden
        rounded-[20px]
        border
        p-2
        backdrop-blur-sm

        transition-all
        duration-500
        ease-out

        ${className}
      `}
    >
      <ul className="relative space-y-0.5">
        {items.map((item) => {
          const active =
            location.pathname === item.to;

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`
                  sidebar-item
                  ${active ? 'sidebar-item-active' : ''}

                  group
                  relative
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5

                  text-[13px]
                  font-semibold

                  transition-all
                  duration-300
                  ease-out
                `}
              >
                <span
                  className="
                    sidebar-item-icon

                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg

                    transition-all
                    duration-300
                  "
                >
                  <Icon
                    name={item.icon}
                    size={16}
                  />
                </span>

                <span
                  className="
                    sidebar-item-label
                    min-w-0
                    flex-1
                    truncate

                    transition-colors
                    duration-300
                  "
                >
                  {item.label}
                </span>

                <Icon
                  name="chevronRight"
                  size={14}
                  className="
                    sidebar-item-chevron

                    shrink-0

                    -translate-x-1
                    opacity-0

                    transition-all
                    duration-300

                    group-hover:translate-x-0
                    group-hover:opacity-100
                  "
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <style>{`

        /* =======================================================
           SIDEBAR STATIS

           Dulu sidebar ini putih, lalu berubah biru saat di-hover ATAU saat
           halaman di-scroll, dan seluruh warna isinya ikut membalik. Warnanya
           jadi tidak bisa ditebak dan terasa berkedip saat menggulir.

           Sekarang biru #538CBD permanen: satu keadaan, tidak ada yang
           membalik, dan pendengar scroll-nya ikut dicabut karena tak berguna.
        ======================================================= */

        .sidebar-shell {
          background: #538CBD;
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 12px 32px rgba(83, 140, 189, 0.30);
        }


        /* ITEM */

        .sidebar-item {
          color: rgba(255, 255, 255, 0.85);
        }

        .sidebar-item:hover {
          color: #ffffff;
        }

        .sidebar-item-active {
          color: #ffffff;
        }


        /* IKON */

        .sidebar-item-icon {
          background: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
        }

        .sidebar-item:hover .sidebar-item-icon {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
          transform: scale(1.05);
        }

        .sidebar-item-active .sidebar-item-icon {
          background: #ffffff;
          color: #4077a6;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.30);
        }


        /* CHEVRON */

        .sidebar-item-chevron {
          color: #ffffff;
        }

        .sidebar-item-active .sidebar-item-chevron {
          transform: translateX(0);
          opacity: 1;
        }


        /* PIL ITEM AKTIF */

        .sidebar-item-active::before {
          content: '';
          position: absolute;
          left: 8px;
          right: 8px;
          top: 0;
          bottom: 0;
          z-index: -1;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.20);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.30);
        }


        /* PENANDA ITEM AKTIF */

        .sidebar-item-active::after {
          content: '';
          position: absolute;
          left: 8px;
          top: 50%;
          width: 2px;
          height: 20px;
          transform: translateY(-50%);
          border-radius: 0 999px 999px 0;
          background: #ffffff;
        }
      `}</style>
    </nav>
  );

  return (
    <>
      {/* =======================================================
          DESKTOP
      ======================================================= */}

      <div className="hidden lg:block">
        {buildContent()}
      </div>


      {/* =======================================================
          MOBILE TRIGGER
      ======================================================= */}

      {!isControlled && (
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setInternalOpen(true)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full

              border
              border-[#e0e3e5]

              bg-white/95

              text-[#101319]

              shadow-sm
              backdrop-blur-sm

              transition-all
              duration-200

              hover:border-[#538cbd]
              hover:text-[#4077a6]

              active:scale-[0.95]
            "
            aria-label="Buka menu"
          >
            <Icon
              name="menu"
              size={16}
            />
          </button>
        </div>
      )}


      {/* =======================================================
          MOBILE DRAWER
      ======================================================= */}

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Backdrop */}

          <div
            className="
              absolute
              inset-0

              bg-[#101319]/40
              backdrop-blur-sm

              sidebar-backdrop-enter
            "
            onClick={closeDrawer}
          />


          {/* Drawer */}

          <aside
            className="
              sidebar-drawer

              absolute
              bottom-0
              left-0
              top-0

              flex
              w-72
              max-w-[85vw]
              flex-col

              bg-[#f5f7fb]

              shadow-[12px_0_40px_rgba(32,36,45,0.15)]

              transition-colors
              duration-500
            "
          >

            {/* Header */}

            <div
              className="
                flex
                items-center
                justify-between

                border-b
                border-[#e0e3e5]

                bg-white

                px-5
                py-4
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-2

                  text-[15px]
                  font-bold
                  text-[#101319]
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

                    bg-[#538cbd]/10
                    text-[#4077a6]
                  "
                >
                  <Icon
                    name="grid"
                    size={13}
                  />
                </span>

                {title}
              </span>

              <button
                type="button"
                onClick={closeDrawer}
                className="
                  rounded-full
                  p-1.5

                  text-[#737686]

                  transition-colors
                  duration-300

                  hover:bg-[#F5F7FB]
                  hover:text-[#101319]
                "
                aria-label="Tutup menu"
              >
                <Icon
                  name="close"
                  size={16}
                />
              </button>
            </div>


            {/* Content */}

            <div
              className="
                flex-1
                overflow-y-auto
                overscroll-contain
                p-4
              "
            >
              {buildContent()}
            </div>
          </aside>
        </div>
      )}


      {/* =======================================================
          MOBILE ANIMATION
      ======================================================= */}

      <style>{`

        @keyframes sidebar-drawer-enter {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(0);
          }
        }

        .sidebar-drawer {
          animation:
            sidebar-drawer-enter
            0.3s
            cubic-bezier(0.22, 0.9, 0.35, 1)
            both;
        }


        @keyframes sidebar-backdrop-enter {
          0% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }

        .sidebar-backdrop-enter {
          animation:
            sidebar-backdrop-enter
            0.25s
            ease
            both;
        }

      `}</style>
    </>
  );
};

export default Sidebar;