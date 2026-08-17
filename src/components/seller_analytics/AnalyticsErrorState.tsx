import React from 'react';

import IllustratedCard from '../shared/IllustratedCard';
import waduhImg from '../../assets/Waduh.png';

interface AnalyticsErrorStateProps {
  onRetry: () => void;
}

const AnalyticsErrorState: React.FC<AnalyticsErrorStateProps> = ({ onRetry }) => (
  <IllustratedCard
    image={waduhImg}
    imageAlt="Koneksi bermasalah"
    pillLabel="Analitik"
    pillColor="red"
    eyebrow="Ups, ada masalah"
    title="Analitik nggak bisa dimuat"
    subtitle="Nggak bisa nyambung ke server, jadi semua grafik dan insight gagal diambil. Datamu aman, cuma koneksinya yang bermasalah."
    tips={[
      'Pastikan koneksi internetmu stabil',
      'Cek server backend sudah menyala',
      'Tekan "Coba Lagi" setelah semuanya siap',
    ]}
    primaryAction={{ label: 'Coba Lagi', icon: 'arrowRight', onClick: onRetry }}
    secondaryAction={{ label: 'Muat Ulang Halaman', icon: 'arrowRight', onClick: () => window.location.reload() }}
    bottomTagline="Jangan panik — coba lagi sebentar lagi"
  />
);

export default AnalyticsErrorState;