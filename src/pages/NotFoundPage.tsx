import React from 'react';
import NotFoundCard from '../components/ui/NotFoundCard';
import notFoundBg from '../assets/404 Not Found.jpg';

const NotFoundPage: React.FC = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f7fb]">
      
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_15%_20%,rgba(83,140,219,0.20),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(255,213,0,0.12),transparent_25%),radial-gradient(circle_at_80%_85%,rgba(255,70,70,0.10),transparent_28%),linear-gradient(135deg,#F5F5FF_0%,#FFFFFF_45%,#EEF5FF_100%)]
        "
      />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-[#538cbd]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-[#FFD500]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#ba1a1a]/5 blur-3xl" />
      <div className="pointer-events-none absolute left-[7%] top-[15%] h-2.5 w-2.5 rounded-full bg-[#FFD500]" />
      <div className="pointer-events-none absolute right-[10%] top-[18%] h-4 w-4 rotate-12 rounded-[4px] bg-[#ba1a1a]" />
      <div className="pointer-events-none absolute bottom-[18%] left-[12%] h-3 w-3 rounded-full bg-[#4077a6]" />
      <div className="pointer-events-none absolute bottom-[13%] right-[18%] h-2.5 w-2.5 rounded-full bg-[#FFD500]" />

      <img
        src={notFoundBg}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          h-full
          w-full
          select-none
          object-cover
          object-center
        "
      />

      <div
        className="
          relative z-10 flex min-h-screen items-center justify-start
          px-4 py-5 sm:px-8 lg:pl-16 lg:pr-8
        "
      >
        <div className="w-full max-w-2xl">
          <NotFoundCard />

          <p className="mt-3 text-center text-[10px] text-[#737686]">
            NeedBuy membantu kamu berbelanja dengan lebih sadar dan terarah.
          </p>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;