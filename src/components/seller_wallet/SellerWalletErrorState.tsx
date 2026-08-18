import React from 'react';

import IllustratedCard from '../shared/IllustratedCard';
import waduhImg from '../../assets/Waduh.png';

interface SellerWalletErrorStateProps {
  onRetry: () => void;
}

const SellerWalletErrorState: React.FC<SellerWalletErrorStateProps> = ({
  onRetry,
}) => (
  <IllustratedCard
    image={waduhImg}
    imageAlt="Koneksi bermasalah"
    pillLabel="Saldo"
    pillColor="red"
    eyebrow="Ups, ada masalah"
    title="Saldo nggak bisa dimuat"
    subtitle="Tidak dapat terhubung ke server saat memuat data saldo dan riwayat transaksi. Saldo dan transaksi kamu aman, silakan coba beberapa saat lagi."
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
    bottomTagline="Silakan coba muat ulang beberapa saat lagi"
  />
);

export default SellerWalletErrorState;