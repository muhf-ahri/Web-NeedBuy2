import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import Button from './Button';
import Divider from './Divider';

const NotFoundCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        overflow-hidden rounded-[24px] border border-white/80 bg-white/95
        shadow-[0_18px_50px_rgba(32,36,45,0.10)] backdrop-blur-sm
      "
    >
      
      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        
        <section
          className="
            relative hidden overflow-hidden bg-gradient-to-br from-[#538CDB]
            via-[#4A7ECB] to-[#3A66AC] px-8 py-10 md:flex md:flex-col
            md:justify-between
          "
        >
          
          <svg
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-16 text-[#F5F5FF] md:w-20"
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M100 0
                 C 40 40, 90 90, 55 140
                 C 20 190, 70 230, 90 280
                 C 105 320, 50 360, 100 400
                 L 100 400 L 100 0 Z"
              fill="currentColor"
              className="opacity-0"
            />
            <path
              d="M100 0
                 C 40 40, 90 90, 55 140
                 C 20 190, 70 230, 90 280
                 C 105 320, 50 360, 100 400
                 L 130 400 L 130 0 Z"
              fill="white"
            />
          </svg>

          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border border-white/15" />
          <div className="pointer-events-none absolute bottom-8 left-10 h-24 w-24 rounded-full border border-white/10" />

          <div className="relative z-10">
            <h2 className="mt-1 text-2xl font-bold text-white">NeedBuy</h2>
            <p className="mt-4 max-w-[220px] text-[13px] leading-5 text-white/75">
              Belanja jadi lebih sadar dan terarah, satu keputusan kecil setiap harinya.
            </p>
          </div>

          <div className="relative z-10 mt-auto flex items-center gap-2 pt-8 text-[10px] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
            NeedBuy &copy; {new Date().getFullYear()}
          </div>
        </section>

        <section className="flex items-center bg-white px-6 py-7 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-sm">
            
            <div className="mb-6 md:hidden">
              <p className="text-xs font-semibold text-[#538CDB]">NeedBuy</p>
            </div>

            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF4646]">
              Halaman Hilang
            </p>

            <h1
              className="
                text-[24px] font-bold leading-tight tracking-tight
                text-[#20242D] sm:text-[26px]
              "
            >
              WADUH, HALAMANNYA NGGAK KETEMU!
            </h1>

            <p className="mt-2 text-[13px] leading-5 text-[#737A87]">
              Mungkin alamatnya berubah, atau halamannya udah dipindah ke tempat lain.
            </p>

            <div className="mt-5 rounded-xl px-4 py-5 text-center">
              <div
                className="
                  flex items-center justify-center gap-0.5 text-6xl font-black
                  tracking-tight text-[#20242D] sm:text-7xl
                "
              >
                <span>4</span>
                <span className="relative text-[#538CDB]">
                  0
                  <span className="absolute -bottom-1 left-0 right-0 h-1.5 rounded-full bg-[#538CDB]/50 blur-[2px]" />
                </span>
                <span>4</span>
              </div>
              <div className="mt-1 text-3xl"></div>
              <p className="mt-2 text-[11px] text-[#737A87]">
                Tenang, yuk balik ke beranda dulu.
              </p>
            </div>

            <div className="mt-5">
              <Button
                fullWidth
                onClick={() => navigate('/')}
                className="
                  h-11 rounded-full bg-[#538CDB] px-6 text-sm font-semibold
                  text-white shadow-[0_7px_18px_rgba(83,140,219,0.18)]
                  transition-all duration-200 hover:bg-[#467BC7]
                  hover:shadow-[0_9px_22px_rgba(83,140,219,0.22)]
                  focus:ring-4 focus:ring-[#538CDB]/15 active:scale-[0.99]
                "
              >
                <Icon name="arrowLeft" size={16} className="mr-1.5" />
                Kembali ke Beranda
              </Button>
            </div>

            <Divider text="atau" />

            <button
            type="button"
            onClick={() => navigate(-1)}
            className="
                flex h-11 w-full items-center justify-center gap-2
                rounded-full border border-[#D8DEE9] bg-white
                text-sm font-semibold text-[#2F5AA0]
                shadow-sm transition-all duration-200
                hover:border-[#538CDB] hover:bg-[#F5F7FB] hover:text-[#1E4080]
                active:scale-[0.99]
            "
            >
            Balik ke Halaman Sebelumnya
            </button>

            <p className="mt-5 text-center text-xs text-[#737A87]">
              Cek lagi alamat URL-nya biar nggak nyasar lagi.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotFoundCard;