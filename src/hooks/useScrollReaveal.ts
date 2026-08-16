import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseScrollRevealOptions {
  /** Ambang batas seberapa banyak elemen harus terlihat (0–1) */
  threshold?: number;
  /** Jarak dari viewport sebelum dianggap terlihat (px) */
  rootMargin?: string;
  /** Hanya animasi sekali (default true) */
  once?: boolean;
}

/**
 * Hook untuk mendeteksi apakah elemen sudah masuk viewport.
 * Dipakai untuk memicu animasi saat user scroll ke suatu section.
 */
export const useScrollReveal = <T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
): { ref: RefObject<T | null>; isVisible: boolean } => {
  const { threshold = 0.12, rootMargin = '0px 0px -60px 0px', once = true } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Matikan animasi kalau user minta prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
};