import React from 'react';

import IllustratedCard from '../shared/IllustratedCard';
import waduhImg from '../../assets/Waduh.png';

interface OrdersErrorStateProps {
  onRetry: () => void;
  errorMessage?: string;
}

const OrdersErrorState: React.FC<OrdersErrorStateProps> = ({
  onRetry,
  errorMessage,
}) => (
  <IllustratedCard
    image={waduhImg}
    imageAlt="Koneksi bermasalah"
    pillLabel="Pesanan"
    pillColor="red"
    eyebrow="Ups, ada masalah"
    title="Pesanan nggak bisa dimuat"
    subtitle={
      errorMessage ??
      'Nggak bisa nyambung ke server, jadi daftar pesananmu gagal diambil. Tenang, pesananmu aman, cuma koneksinya yang bermasalah.'
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
    bottomTagline="Jangan panik, coba lagi sebentar lagi"
  />
);

export default OrdersErrorState;