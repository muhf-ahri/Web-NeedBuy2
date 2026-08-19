import React from 'react';

const HomeBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <main className="relative flex-1 overflow-hidden bg-[#f5f7fb]">
      
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-[#538cbd]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-[#538cbd]/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#538cbd]/5 blur-3xl" />

      <div
        className="
          pointer-events-none
          absolute
          -right-48
          top-[860px]
          h-[560px]
          w-[560px]
          rounded-full
          bg-[#538cbd]/8
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[1400px]
          h-[420px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-[#538cbd]/12
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-[0.14]
          [background-image:linear-gradient(rgba(83,140,219,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(83,140,219,0.10)_1px,transparent_1px)]
          [background-size:56px_56px]
        "
      />

      <div className="relative z-10">{children}</div>
    </main>
  );
};

export default HomeBackground;