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

  const [scrolled, setScrolled] = useState(false);

  /* =========================================================
     SCROLL DETECTION
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* =========================================================
     CLOSE MOBILE DRAWER WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    if (isControlled) {
      onMobileClose?.();
    } else {
      setInternalOpen(false);
    }

    // Jangan reset scrolled / hover di sini.
    // Hover sepenuhnya ditangani oleh CSS.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /* =========================================================
     BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    document.body.style.overflow = drawerOpen
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  /* =========================================================
     CLOSE DRAWER
  ========================================================= */

  const closeDrawer = () => {
    if (isControlled) {
      onMobileClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  /* =========================================================
     RENDER SIDEBAR CONTENT
  ========================================================= */

  const buildContent = () => (
    <nav
      className={`
        sidebar-shell
        ${scrolled ? 'sidebar-scrolled' : ''}
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
                {/* =================================================
                    ICON
                ================================================= */}

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

                {/* =================================================
                    LABEL
                ================================================= */}

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

                {/* =================================================
                    CHEVRON
                ================================================= */}

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

      {/* =========================================================
          SIDEBAR COLOR STYLES

          Semua hover color sengaja dibuat menggunakan CSS biasa.
          Jadi tidak tergantung variant Tailwind custom.
      ========================================================= */}

      <style>{`

        /* =======================================================
           DEFAULT WHITE
        ======================================================= */

        .sidebar-shell {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(255, 255, 255, 0.8);
          box-shadow:
            0 8px 24px rgba(32, 36, 45, 0.06);
        }


        /* =======================================================
           HOVER → BLUE
           
           Ini inti perbaikannya.
        ======================================================= */

        .sidebar-shell:hover {
          background: rgba(83, 140, 219, 0.95);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow:
            0 12px 32px rgba(83, 140, 219, 0.30);
        }


        /* =======================================================
           SCROLLED → BLUE
        ======================================================= */

        .sidebar-shell.sidebar-scrolled {
          background: rgba(83, 140, 219, 0.95);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow:
            0 12px 32px rgba(83, 140, 219, 0.30);
        }


        /* =======================================================
           ITEM DEFAULT
        ======================================================= */

        .sidebar-item {
          color: #434655;
        }


        /* =======================================================
           ITEM HOVER → WHITE
        ======================================================= */

        .sidebar-shell:hover .sidebar-item {
          color: rgba(255, 255, 255, 0.85);
        }


        .sidebar-shell:hover
        .sidebar-item:hover {
          color: #ffffff;
        }


        /* =======================================================
           SCROLLED → WHITE
        ======================================================= */

        .sidebar-shell.sidebar-scrolled
        .sidebar-item {
          color: rgba(255, 255, 255, 0.85);
        }


        .sidebar-shell.sidebar-scrolled
        .sidebar-item:hover {
          color: #ffffff;
        }


        /* =======================================================
           ACTIVE ITEM - DEFAULT WHITE SIDEBAR
        ======================================================= */

        .sidebar-item-active {
          color: #004ac6;
        }


        /* =======================================================
           ACTIVE ITEM - HOVER
        ======================================================= */

        .sidebar-shell:hover
        .sidebar-item-active {
          color: #ffffff;
        }


        /* =======================================================
           ACTIVE ITEM - SCROLLED
        ======================================================= */

        .sidebar-shell.sidebar-scrolled
        .sidebar-item-active {
          color: #ffffff;
        }


        /* =======================================================
           ICON DEFAULT
        ======================================================= */

        .sidebar-item-icon {
          background: #F5F7FB;
          color: #737686;
        }


        /* =======================================================
           ICON HOVER
        ======================================================= */

        .sidebar-shell:hover
        .sidebar-item-icon {
          background: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
        }


        .sidebar-shell:hover
        .sidebar-item:hover
        .sidebar-item-icon {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
          transform: scale(1.05);
        }


        /* =======================================================
           ICON ACTIVE - WHITE SIDEBAR
        ======================================================= */

        .sidebar-item-active
        .sidebar-item-icon {
          background: #004ac6;
          color: #ffffff;

          transform: scale(1.05);

          box-shadow:
            0 4px 12px
            rgba(83, 140, 219, 0.30);
        }


        /* =======================================================
           ICON ACTIVE - HOVER
        ======================================================= */

        .sidebar-shell:hover
        .sidebar-item-active
        .sidebar-item-icon {
          background: #ffffff;
          color: #004ac6;

          box-shadow:
            0 4px 12px
            rgba(255, 255, 255, 0.30);
        }


        /* =======================================================
           ICON ACTIVE - SCROLLED
        ======================================================= */

        .sidebar-shell.sidebar-scrolled
        .sidebar-item-active
        .sidebar-item-icon {
          background: #ffffff;
          color: #004ac6;

          box-shadow:
            0 4px 12px
            rgba(255, 255, 255, 0.30);
        }


        /* =======================================================
           CHEVRON
        ======================================================= */

        .sidebar-item-chevron {
          color: #004ac6;
        }


        .sidebar-shell:hover
        .sidebar-item-chevron {
          color: #ffffff;
        }


        .sidebar-shell.sidebar-scrolled
        .sidebar-item-chevron {
          color: #ffffff;
        }


        /* =======================================================
           ACTIVE CHEVRON
        ======================================================= */

        .sidebar-item-active
        .sidebar-item-chevron {
          transform: translateX(0);
          opacity: 1;
        }


        /* =======================================================
           ACTIVE PILL
        ======================================================= */

        .sidebar-item-active::before {
          content: '';

          position: absolute;

          left: 8px;
          right: 8px;
          top: 0;
          bottom: 0;

          z-index: -1;

          border-radius: 12px;

          background:
            linear-gradient(
              to right,
              rgba(83, 140, 219, 0.15),
              rgba(83, 140, 219, 0.10)
            );

          box-shadow:
            inset 0 0 0 1px
            rgba(83, 140, 219, 0.20);
        }


        /* =======================================================
           ACTIVE PILL - HOVER
        ======================================================= */

        .sidebar-shell:hover
        .sidebar-item-active::before {
          background: rgba(255, 255, 255, 0.20);

          box-shadow:
            inset 0 0 0 1px
            rgba(255, 255, 255, 0.30);
        }


        /* =======================================================
           ACTIVE PILL - SCROLLED
        ======================================================= */

        .sidebar-shell.sidebar-scrolled
        .sidebar-item-active::before {
          background: rgba(255, 255, 255, 0.20);

          box-shadow:
            inset 0 0 0 1px
            rgba(255, 255, 255, 0.30);
        }


        /* =======================================================
           ACTIVE INDICATOR
        ======================================================= */

        .sidebar-item-active::after {
          content: '';

          position: absolute;

          left: 8px;
          top: 50%;

          width: 2px;
          height: 20px;

          transform:
            translateY(-50%);

          border-radius: 0 999px 999px 0;

          background: #004ac6;

          transition:
            background-color 0.5s ease;
        }


        .sidebar-shell:hover
        .sidebar-item-active::after,

        .sidebar-shell.sidebar-scrolled
        .sidebar-item-active::after {
          background: #ffffff;
        }


        /* =======================================================
           ANIMATION
        ======================================================= */

        @keyframes sidebar-enter {
          0% {
            opacity: 0;
            transform: translateX(-8px);
          }

          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-sidebar-enter {
          animation:
            sidebar-enter
            0.4s
            cubic-bezier(0.22, 0.9, 0.35, 1)
            both;
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

              hover:border-[#004ac6]
              hover:text-[#004ac6]

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

                    bg-[#004ac6]/10
                    text-[#004ac6]
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