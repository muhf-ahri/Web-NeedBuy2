import React, { type CSSProperties, type JSX } from 'react';

import { useScrollReveal } from '../../hooks/useScrollReaveal';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface RevealProps {
  children: React.ReactNode;
  
  direction?: RevealDirection;
  
  delay?: number;
  
  duration?: number;
  
  className?: string;
  
  as?: keyof JSX.IntrinsicElements;
}

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