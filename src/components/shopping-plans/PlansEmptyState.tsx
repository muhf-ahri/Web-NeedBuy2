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
          'Tidak dapat terhubung ke server saat memuat daftar kategori. Data kamu tetap aman, silakan coba beberapa saat lagi.'
        }
        tips={[
          'Pastikan koneksi internet stabil',
          'Pastikan server backend aktif',
          'Tekan "Coba Lagi" setelah koneksi siap',
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
        bottomTagline="Silakan coba muat ulang beberapa saat lagi"
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
      subtitle='Kelompokkan belanjaanmu per kategori, misalnya "Kamar" isi kipas dan lampu, lalu checkout sekaligus dengan mudah.'
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