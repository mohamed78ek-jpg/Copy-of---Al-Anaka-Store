import React from 'react';
import { X } from 'lucide-react';

interface AdPopupProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
}

export const AdPopup: React.FC<AdPopupProps> = ({ isOpen, onClose, image }) => {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full aspect-[3/4] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors z-10 shadow-sm"
          aria-label="Close Ad"
        >
          <X size={20} />
        </button>
        <img 
          src={image} 
          alt="Advertisement" 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>
  );
};