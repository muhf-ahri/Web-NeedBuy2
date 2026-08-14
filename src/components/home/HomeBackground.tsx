// src/components/home/HomeBackground.tsx
import React from 'react';

const HomeBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <main className="relative flex-1 overflow-hidden bg-[#fffdf2]">
      {/* Base gradient */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-[radial-gradient(circle_at_8%_8%,rgba(84,141,212,0.20),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(255,251,207,0.95),transparent_30%),linear-gradient(135deg,#fffbea_0%,#fffdf5_38%,#eef5ff_72%,#e4efff_100%)]
        "
      />

      {/* Blue ambient area */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-[360px]
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#8bb5e8]/15
          blur-[110px]
        "
      />

      {/* Cream ambient area */}
      <div
        className="
          pointer-events-none
          absolute
          -right-48
          top-[760px]
          h-[560px]
          w-[560px]
          rounded-full
          bg-[#fff4b8]/35
          blur-[120px]
        "
      />

      {/* Soft blue center */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[1100px]
          h-[420px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-[#dceaff]/45
          blur-[100px]
        "
      />

      {/* Very subtle grid */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-[0.18]
          [background-image:linear-gradient(rgba(84,141,212,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(84,141,212,0.08)_1px,transparent_1px)]
          [background-size:56px_56px]
        "
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
};

export default HomeBackground;