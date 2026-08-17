import React from 'react';

import IllustratedCard from '../shared/IllustratedCard';
import waduhImg from '../../assets/Waduh.png';
import ordersImg from '../../assets/Crousel3.png';
import ayoImg from '../../assets/Ayo.png';

interface OrdersEmptyStateProps {
  variant: 'empty' | 'no-match' | 'error';
  query?: string;
  onClearFilters?: () => void;
  onRetry?: () => void;
  errorMessage?: string;
}

const OrdersEmptyState: React.FC<OrdersEmptyStateProps> = ({
  variant,
  query,
  onClearFilters,
  onRetry,
  errorMessage,
}) => {
  if (variant === 'error') {
    return (
      <IllustratedCard
        image={waduhImg}
        imageAlt="Koneksi bermasalah"
        pillLabel="Pesanan"
        pillColor="red"
        eyebrow="Ups, ada masalah"
        title="Gagal memuat order"
        subtitle={errorMessage ?? 'Tidak bisa memuat daftar order kamu. Datamu aman, cuma koneksinya yang bermasalah.'}
        tips={[
          'Pastikan koneksi internetmu stabil',
          'Cek server backend sudah menyala',
          'Tekan "Coba Lagi" setelah semuanya siap',
        ]}
        primaryAction={onRetry ? { label: 'Coba Lagi', icon: 'arrowRight', onClick: onRetry } : undefined}
        secondaryAction={{ label: 'Muat Ulang Halaman', icon: 'arrowRight', onClick: () => window.location.reload() }}
        bottomTagline="Jangan panik, coba lagi sebentar lagi"
      />
    );
  }

  if (variant === 'no-match') {
    return (
      <IllustratedCard
        image={ayoImg}
        imageAlt="Tidak ada hasil"
        pillLabel="Pesanan"
        pillColor="blue"
        eyebrow="Tidak ada hasil"
        title={query ? `Tidak ada order "${query}"` : 'Tidak ada order yang cocok'}
        subtitle="Coba kata kunci lain atau kosongkan filter status."
        primaryAction={onClearFilters ? { label: 'Kosongkan Filter', icon: 'close', onClick: onClearFilters } : undefined}
        bottomTagline="Longgarkan filter, ordernya bakal muncul"
      />
    );
  }

  return (
    <IllustratedCard
      image={ordersImg}
      imageAlt="Belum ada order"
      pillLabel="Pesanan"
      pillColor="blue"
      eyebrow="Belum ada order"
      title="Order masuk akan muncul di sini"
      subtitle="Sabar ya: begitu ada pembeli yang checkout, ordernya langsung muncul di daftar ini."
      bottomTagline="Pantau paketmu dari checkout sampai tiba"
    />
  );
};

export default OrdersEmptyState;