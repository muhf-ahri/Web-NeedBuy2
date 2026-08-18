import React from 'react';


interface ProductsHeaderProps {
  onAddNew: () => void;
}

// onAddNew tetap di interface: tombol tambah sekarang ada di ProductsToolbar,
// tapi caller masih mengirim prop ini.
const ProductsHeader: React.FC<ProductsHeaderProps> = () => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538CDB]/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#538CDB]">
            Kelola Produk
          </p>
        </span>
      </div>
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#20242D] sm:text-[28px]">
        Produk Saya
      </h1>
      <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-[#737A87] sm:text-[13px]">
        Atur stok, harga, dan detail produk yang kamu jual di sini.
      </p>
    </div>
  </div>
);

export default ProductsHeader;