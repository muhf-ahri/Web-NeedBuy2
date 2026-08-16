import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router tidak me-reset scroll saat pindah halaman (karena SPA,
 * dokumen HTML-nya sama terus). Komponen ini memaksa scroll kembali
 * ke atas setiap route berubah, biar halaman baru selalu mulai dari atas.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 'instant' biar langsung loncat ke atas, bukan smooth-scroll
    // (kalau 'auto', browser yang punya CSS scroll-behavior: smooth
    //  malah akan animasi dan terasa aneh saat pindah halaman)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
};

export default ScrollToTop;