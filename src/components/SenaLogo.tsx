import React from 'react';

interface SenaLogoProps {
  className?: string;
  size?: number | string;
  color?: string; // Official SENA Green '#39A900' from branding guidelines
}

export const SenaLogo: React.FC<SenaLogoProps> = ({
  className = '',
  size = 32,
  color = '#39A900',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill={color}
      className={`shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Oficial del SENA"
      role="img"
    >
      {/* Head */}
      <circle cx="50" cy="11.5" r="10.8" />

      {/* SENA Typography - Exact geometric vector styled lettering */}
      {/* S */}
      <path d="M 5 26.5 C 5 24 8 23 15 23 C 22 23 25 24 25 26.5 L 25 29.5 L 19 29.5 L 19 28 C 19 27.2 17.5 26.8 15 26.8 C 12.5 26.8 11.2 27.2 11.2 28 C 11.2 29 13.5 29.5 18 30.5 C 23.5 31.7 25.5 33.5 25.5 36.5 C 25.5 40 22 41.5 15 41.5 C 8 41.5 4.5 40 4.5 36.5 L 4.5 33.5 L 10.7 33.5 L 10.7 35.5 C 10.7 36.8 12.2 37.3 15 37.3 C 17.8 37.3 19.3 36.8 19.3 35.8 C 19.3 34.8 17.8 34.2 13 33 C 7.5 31.8 5 30 5 26.5 Z" />

      {/* E */}
      <path d="M 28.5 23.2 L 46.5 23.2 L 46.5 27.2 L 34.7 27.2 L 34.7 29.8 L 45 29.8 L 45 33.8 L 34.7 33.8 L 34.7 37.2 L 47 37.2 L 47 41.2 L 28.5 41.2 Z" />

      {/* N */}
      <path d="M 50 23.2 L 56.5 23.2 L 65.5 34.2 L 65.5 23.2 L 71.5 23.2 L 71.5 41.2 L 65 41.2 L 56 30.2 L 56 41.2 L 50 41.2 Z" />

      {/* A */}
      <path d="M 74 41.2 L 83.5 23.2 L 91 23.2 L 100 41.2 L 93.5 41.2 L 91.5 37 L 82.5 37 L 80.5 41.2 Z M 84.2 33.2 L 89.8 33.2 L 87 27.5 Z" />

      {/* Stylized Body, Outstretched Arms & Forward Walking Legs */}
      <path d="M 0 45 L 43 45 L 50 37 L 57 45 L 100 45 L 100 53 L 73 53 L 87 93 L 73 93 L 61 58 L 57 68 L 68 97 L 54 97 L 50 86 L 46 97 L 32 97 L 43 68 L 39 58 L 27 93 L 13 93 L 27 53 L 0 53 Z" />
    </svg>
  );
};
