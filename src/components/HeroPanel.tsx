import React from 'react';
import { motion } from 'framer-motion';

const HeroPanel: React.FC = () => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="
        relative
        hidden
        min-h-[500px]
        overflow-hidden
        bg-[#4077a6]
        p-7
        md:flex
        md:flex-col
        md:justify-between
        lg:p-8
      "
    >

      <div className="absolute -right-8 top-14 h-20 w-20 rounded-full bg-[#FFD500]" />

      <div className="absolute -bottom-5 -left-5 h-20 w-20 rotate-12 rounded-xl bg-[#ba1a1a]" />

      <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <svg
        className="absolute bottom-0 right-0 h-72 w-72 text-white/15"
        viewBox="0 0 300 300"
        fill="none"
      >
        <path
          d="M10 280C70 220 100 240 145 175C190 110 220 120 290 40"
          stroke="currentColor"
          strokeWidth="1"
        />

        <path
          d="M30 300C90 240 120 260 165 195C210 130 240 140 310 60"
          stroke="currentColor"
          strokeWidth="1"
        />

        <path
          d="M70 300C125 250 145 270 185 215C225 160 255 165 320 95"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <div className="absolute left-10 top-36 h-2.5 w-2.5 rounded-full bg-[#FFD500]" />

      <div className="absolute bottom-20 right-12 h-2.5 w-2.5 rounded-full bg-white/50" />

      <div className="relative z-10">

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2"
        >

          <div className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-white
            text-sm
            font-bold
            text-[#4077a6]
            shadow-sm
          ">
            N
          </div>

          <div>
            <p className="text-sm font-bold leading-none text-white">
              NeedBuy
            </p>

            <p className="mt-1 text-[8px] text-white/65">
              Belanja lebih bijak
            </p>
          </div>

        </motion.div>

      </div>

      <div className="relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="
            mb-5
            inline-flex
            rounded-full
            bg-white
            px-3
            py-1
            text-[10px]
            font-semibold
            text-[#4077a6]
          "
        >
          Belanja lebih bijak
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            max-w-[350px]
            text-3xl
            font-bold
            leading-[1.08]
            tracking-tight
            text-white
            lg:text-[36px]
          "
        >
          Temukan yang kamu butuhkan.

          <span className="mt-1 block text-[#FFD500]">
            Bukan sekadar yang kamu inginkan.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="
            mt-4
            max-w-[300px]
            text-[12px]
            leading-5
            text-white/80
          "
        >
          Jelajahi berbagai produk dari seller terpercaya
          dan buat keputusan belanja yang lebih sederhana,
          aman, dan terarah.
        </motion.p>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10"
      >

        <div className="mb-4 h-px w-24 bg-[#FFD500]" />

        <p className="max-w-[260px] text-[11px] leading-5 text-white/70">
          Belanja sesuai kebutuhan, temukan produk
          yang tepat, dan nikmati pengalaman yang lebih
          sederhana.
        </p>

        <div className="mt-4 flex items-center gap-4">

          <span className="text-[10px] font-semibold text-white">
            Simple
          </span>

          <span className="h-1 w-1 rounded-full bg-[#FFD500]" />

          <span className="text-[10px] font-semibold text-white">
            Secure
          </span>

          <span className="h-1 w-1 rounded-full bg-[#FFD500]" />

          <span className="text-[10px] font-semibold text-white">
            Trusted
          </span>

        </div>

      </motion.div>

    </motion.aside>
  );
};

export default HeroPanel;