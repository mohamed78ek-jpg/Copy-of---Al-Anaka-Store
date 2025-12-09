import React, { useState } from 'react';
import { Product } from '../types';
import { APP_CURRENCY } from '../constants';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Select first size by default if available
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );

  // Determine prices
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;
  const originalPrice = hasDiscount ? product.price : null;

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize);
  };

  return (
    <div className="group relative flex flex-col bg-white border border-black rounded-[2rem] p-2 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      
      {/* Image Container - Aspect Square */}
      <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-2 bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-in-out"
          loading="lazy"
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
             خصم {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center text-center px-1 pb-2">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-2 font-tajawal">
          {product.name}
        </h3>

        {/* Size Selection - Direct Display */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mb-2 w-full">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  min-w-[24px] h-[24px] px-1 flex items-center justify-center text-[9px] font-bold rounded-md border transition-all duration-200
                  ${selectedSize === size 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm transform scale-105' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'}
                `}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        
        <div className="mt-auto mb-3 flex flex-col items-center justify-center gap-0">
          {originalPrice && (
            <span className="text-gray-400 line-through text-[10px] font-bold font-sans opacity-60">
              {APP_CURRENCY} {originalPrice}.00
            </span>
          )}
          <span className={`text-lg font-black font-sans tracking-tight ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
            {APP_CURRENCY} {currentPrice}.00
          </span>
        </div>

        {/* Action Area */}
        <div className="w-full h-[36px]">
            <button
              onClick={handleAddToCart}
              className="w-full h-full bg-[#22c55e] hover:bg-emerald-600 text-white text-xs font-bold rounded-full transition-colors shadow-sm active:scale-95 font-tajawal flex items-center justify-center"
            >
              أضف إلى السلة
            </button>
        </div>
      </div>
    </div>
  );
};