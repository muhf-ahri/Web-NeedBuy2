import React from 'react';

import IllustratedCard from '../shared/IllustratedCard';
import ayoImg from '../../assets/Ayo.png';
import waduhImg from '../../assets/Waduh.png';

interface PlansEmptyStateProps {
  variant: 'empty' | 'error';
  onCreate?: () => void;
  onRetry?: () => void;
  errorMessage?: string;
}

const PlansEmptyState: React.FC<PlansEmptyStateProps> = ({
  variant,
  onCreate,
  onRetry,
  errorMessage,
}) => {
  if (variant === 'error') {
    return (
      <IllustratedCard
        image={waduhImg}
        imageAlt="Koneksi bermasalah"
        pillLabel="Rencana Belanja"
        pillColor="red"
        eyebrow="Ups, ada masalah"
        title="Rencana belanja nggak bisa dimuat"
        subtitle={
          errorMessage ??
          'Nggak bisa nyambung ke server, jadi daftar kategorimu gagal diambil. Tenang — datamu aman, cuma koneksinya yang bermasalah.'
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
        bottomTagline="Jangan panik — coba lagi sebentar lagi"
      />
    );
  }

  return (
    <IllustratedCard
      image={ayoImg}
      imageAlt="Ayo bikin rencana belanja"
      pillLabel="Rencana Belanja"
      pillColor="blue"
      eyebrow="Belum ada rencana"
      title="Mulai rencana belanja pertamamu"
      subtitle='Kelompokkan belanjaanmu per kategori — mis. "Kamar" isi kipas & lampu — terus checkout sekaligus tanpa centang satu-satu.'
      primaryAction={
        onCreate
          ? { label: 'Buat Kategori Pertama', icon: 'plus', onClick: onCreate }
          : undefined
      }
      bottomTagline="Kelompokkan belanjaan, checkout sekaligus"
    />
  );
};

export default PlansEmptyState;