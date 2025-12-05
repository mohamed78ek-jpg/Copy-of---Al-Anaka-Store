import React from 'react';

interface PromoCardProps {
  image: string;
}

export const PromoCard: React.FC<PromoCardProps> = ({ image }) => {
  if (!image) return null;

  return (
    <div className="group relative flex flex-col bg-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full w-full aspect-[3/4]">
      <img
        src={image}
        alt="Promo"
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        loading="lazy"
      />
      {/* Optional Overlay gradient for better aesthetics */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
};