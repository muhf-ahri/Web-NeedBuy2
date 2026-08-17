import React from 'react';

import IllustratedCard from '../shared/IllustratedCard';
import waduhImg from '../../assets/Waduh.png';

interface NeedsErrorStateProps {
  onRetry: () => void;
  errorMessage?: string;
}

const NeedsErrorState: React.FC<NeedsErrorStateProps> = ({
  onRetry,
  errorMessage,
}) => (
  <IllustratedCard
    image={waduhImg}
    imageAlt="Koneksi bermasalah"
    pillLabel="Kebutuhan"
    pillColor="red"
    eyebrow="Ups, ada masalah"
    title="Kebutuhan nggak bisa dimuat"
    subtitle={
      errorMessage ??
      'Nggak bisa nyambung ke server, jadi daftar kebutuhanmu gagal diambil. Tenang — datamu aman, cuma koneksinya yang bermasalah.'
    }
    tips={[
      'Pastikan koneksi internetmu stabil',
      'Cek server backend sudah menyala',
      'Tekan "Coba Lagi" setelah semuanya siap',
    ]}
    primaryAction={{ label: 'Coba Lagi', icon: 'arrowRight', onClick: onRetry }}
    secondaryAction={{
      label: 'Muat Ulang Halaman',
      icon: 'arrowRight',
      onClick: () => window.location.reload(),
    }}
    bottomTagline="Jangan panik — coba lagi sebentar lagi"
  />
);

export default NeedsErrorState;