import React from 'react';

export default function ClipopLogo({ className = "", size = "normal" }) {
  const heightClass = size === "small" ? "h-20 sm:h-24" : size === "large" ? "h-40 sm:h-52" : "h-32 sm:h-40 md:h-44";

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img
        src="/logomarcasinfondo.png"
        alt="CLIPOP Logo Oficial"
        onError={(e) => {
          const currentSrc = e.target.src;
          if (currentSrc.endsWith('logomarcasinfondo.png')) {
            e.target.src = '/logomarca.jpeg';
          }
        }}
        className={`${heightClass} object-contain filter drop-shadow-md`}
      />
    </div>
  );
}
