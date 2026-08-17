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
    subtitle="Nggak bisa nyambung ke server, jadi data saldo dan riwayat transaksimu gagal diambil. Tenang — saldo dan transaksimu aman, cuma koneksinya yang bermasalah."
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

export default SellerWalletErrorState;