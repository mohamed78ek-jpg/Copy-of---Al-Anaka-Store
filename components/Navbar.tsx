
import React from 'react';
import { ShoppingBag, Menu, Search } from 'lucide-react';
import { ViewState, Language } from '../types';

interface NavbarProps {
  cartCount: number;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onOpenSidebar: () => void;
  language: Language;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  currentView, 
  onChangeView,
  onOpenSidebar,
  language,
  searchQuery,
  onSearchChange
}) => {
  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => onChangeView(ViewState.HOME)}>
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold ms-2 group-hover:scale-110 transition-transform">
              {language === 'ar' ? 'أ' : 'A'}
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">
              {language === 'ar' ? 'الأناقة' : 'Al-Anaka'}
            </span>
          </div>

          {/* Search Bar (Center) */}
          <div className="w-[200px]">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                className="w-full py-2 px-10 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-gray-700 placeholder-gray-400 text-sm"
              />
              <Search 
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} 
                size={16} 
              />
            </div>
          </div>

          {/* Icons (Cart, Menu) */}
          <div className="flex items-center space-x-2 space-x-reverse flex-shrink-0">
            
            <button 
              className="relative p-2 text-gray-500 hover:text-emerald-600 transition-colors"
              onClick={() => onChangeView(ViewState.CART)}
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              onClick={onOpenSidebar}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
