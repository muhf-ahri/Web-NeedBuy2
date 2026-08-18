import React from 'react';

import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

const NeedsShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="min-h-screen flex flex-col bg-[#F5F5FF]"
    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
  >
    <Navbar />
    <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      {children}
    </main>
    <Footer />
  </div>
);

export default NeedsShell;