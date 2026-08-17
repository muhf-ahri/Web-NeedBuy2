import React from 'react';

import IllustratedCard from '../shared/IllustratedCard';
import waduhImg from '../../assets/Waduh.png';

interface SettingsErrorStateProps {
  onRetry: () => void;
}

const SettingsErrorState: React.FC<SettingsErrorStateProps> = ({ onRetry }) => (
  <IllustratedCard
    image={waduhImg}
    imageAlt="Koneksi bermasalah"
    pillLabel="Setelan"
    pillColor="red"
    eyebrow="Ups, ada masalah"
    title="Setelan nggak bisa dimuat"
    subtitle="Nggak bisa nyambung ke server, jadi data toko kamu gagal diambil. Perubahan yang sudah tersimpan tetap aman."
    tips={[
      'Pastikan koneksi internetmu stabil',
      'Cek server backend sudah menyala',
      'Tekan "Coba Lagi" setelah semuanya siap',
    ]}
    primaryAction={{ label: 'Coba Lagi', icon: 'arrowRight', onClick: onRetry }}
    secondaryAction={{ label: 'Muat Ulang Halaman', icon: 'arrowRight', onClick: () => window.location.reload() }}
    bottomTagline="Setelanmu aman — coba lagi sebentar lagi"
  />
);

export default SettingsErrorState;