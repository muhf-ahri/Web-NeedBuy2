import React from 'react';

import IllustratedCard from '../shared/IllustratedCard';
import ayoImg from '../../assets/Ayo.png';
import waduhImg from '../../assets/Waduh.png';

interface ProductsEmptyStateProps {
  variant: 'empty' | 'no-match' | 'error';
  query?: string;
  onAddNew?: () => void;
  onClearSearch?: () => void;
  onRetry?: () => void;
  errorMessage?: string;
}

const ProductsEmptyState: React.FC<ProductsEmptyStateProps> = ({
  variant,
  query,
  onAddNew,
  onClearSearch,
  onRetry,
  errorMessage,
}) => {
  if (variant === 'error') {
    return (
      <IllustratedCard
        image={waduhImg}
        imageAlt="Koneksi bermasalah"
        pillLabel="Produk"
        pillColor="red"
        eyebrow="Ups, ada masalah"
        title="Gagal memuat produk"
        subtitle={
          errorMessage ??
          'Tidak bisa memuat daftar produk kamu. Tenang, datamu aman, cuma koneksinya aja yang lagi bermasalah.'
        }
        tips={[
          'Pastikan koneksi internetmu stabil',
          'Cek server backend sudah menyala',
          'Tekan "Coba Lagi" setelah semuanya siap',
        ]}
        primaryAction={
          onRetry
            ? { label: 'Coba Lagi', icon: 'arrowRight', onClick: onRetry }
            : undefined
        }
        secondaryAction={{
          label: 'Muat Ulang Halaman',
          icon: 'arrowRight',
          onClick: () => window.location.reload(),
        }}
        bottomTagline="Jangan panik, coba lagi sebentar lagi"
      />
    );
  }

  if (variant === 'no-match') {
    return (
      <IllustratedCard
        image={ayoImg}
        imageAlt="Pencarian kosong"
        pillLabel="Produk"
        pillColor="blue"
        eyebrow="Tidak ada hasil"
        title={query ? `Tidak ada produk "${query}"` : 'Tidak ada produk yang cocok'}
        subtitle="Coba kata kunci lain atau kosongkan pencarian untuk melihat semua produk."
        primaryAction={
          onClearSearch
            ? {
                label: 'Kosongkan Pencarian',
                icon: 'close',
                onClick: onClearSearch,
              }
            : undefined
        }
        secondaryAction={
          onAddNew
            ? { label: 'Tambah Produk', icon: 'plus', onClick: onAddNew }
            : undefined
        }
        bottomTagline="Coba kata kunci lain, hasilnya pasti muncul"
      />
    );
  }

  return (
    <IllustratedCard
      image={ayoImg}
      imageAlt="Katalog kosong"
      pillLabel="Produk"
      pillColor="blue"
      eyebrow="Belum ada produk"
      title="Mulai jual produkmu"
      subtitle="Klik tombol di bawah untuk menambah produk pertamamu di toko."
      primaryAction={
        onAddNew
          ? {
              label: 'Tambah Produk Pertama',
              icon: 'plus',
              onClick: onAddNew,
            }
          : undefined
      }
      bottomTagline="Katalogmu menunggu produk pertama"
    />
  );
};

export default ProductsEmptyState;