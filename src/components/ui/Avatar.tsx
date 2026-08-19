import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
}

export const initialsOf = (name?: string | null) =>
  (name || 'U')
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const Avatar: React.FC<AvatarProps> = ({ src, name, className = 'h-11 w-11 text-[12px]' }) => {
  const [broken, setBroken] = useState(false);

  if (src && !broken) {
    return (
      <img
        src={src}
        alt={name || 'Foto profil'}
        onError={() => setBroken(true)}
        className={`shrink-0 rounded-full object-cover ring-2 ring-white ${className}`}
      />
    );
  }

  return (
    <span
      className={`
        flex shrink-0 items-center justify-center rounded-full
        bg-gradient-to-br from-[#004ac6] to-[#003ea8]
        font-extrabold text-white ring-2 ring-white ${className}
      `}
    >
      {initialsOf(name)}
    </span>
  );
};

export default Avatar;
