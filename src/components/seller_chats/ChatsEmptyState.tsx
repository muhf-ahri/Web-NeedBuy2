import React from 'react';

import IllustratedCard from '../shared/IllustratedCard';
import waduhImg from '../../assets/Waduh.png';
import chatsImg from '../../assets/Mohon.jpg';

interface ChatsEmptyStateProps {
  variant: 'no-chat' | 'error';
  errorMessage?: string;
  onRetry?: () => void;
}

const ChatsEmptyState: React.FC<ChatsEmptyStateProps> = ({
  variant,
  errorMessage,
  onRetry,
}) => {
  if (variant === 'error') {
    return (
      <IllustratedCard
        image={waduhImg}
        imageAlt="Koneksi bermasalah"
        pillLabel="Chat"
        pillColor="red"
        eyebrow="Ups, ada masalah"
        title="Gagal memuat chat"
        subtitle={errorMessage ?? 'Tidak bisa memuat daftar percakapan. Datamu aman, cuma koneksinya yang bermasalah.'}
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

  return (
    <IllustratedCard
      image={chatsImg}
      imageAlt="Inbox kosong"
      pillLabel="Chat"
      pillColor="blue"
      eyebrow="Belum ada percakapan"
      title="Inbox kamu masih sepi"
      subtitle="Pembeli yang chat kamu akan muncul di sini. Sambil nunggu, cek dulu produk-produkmu."
      bottomTagline="Ngobrol asik sama pembeli"
    />
  );
};

export default ChatsEmptyState;