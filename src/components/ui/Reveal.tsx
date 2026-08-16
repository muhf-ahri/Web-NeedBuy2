import React, { type CSSProperties, type JSX } from 'react';

import { useScrollReveal } from '../../hooks/useScrollReaveal';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface RevealProps {
  children: React.ReactNode;
  /** Arah awal animasi (default: 'up') */
  direction?: RevealDirection;
  /** Delay sebelum animasi mulai (ms) — buat stagger */
  delay?: number;
  /** Durasi animasi (ms) */
  duration?: number;
  /** Class tambahan */
  className?: string;
  /** Element HTML wrapper (default: 'div') */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Wrapper untuk elemen yang mau di-animate saat masuk viewport.
 * Contoh: <Reveal direction="up" delay={100}><Card /></Reveal>
 */
const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  className = '',
  as: Tag = 'div',
}) => {
  const { ref, isVisible } = useScrollReveal();

  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
    transitionDuration: `${duration}ms`,
  };

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      className={`reveal reveal-${direction} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
};

export default Reveal;