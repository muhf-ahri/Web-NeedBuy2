import React from 'react';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f5f7fb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <AdminHeader />

      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-10">
        <div className="flex gap-8">
          
          <aside className="sticky top-24 hidden w-56 shrink-0 md:block">
            <AdminSidebar />
          </aside>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;