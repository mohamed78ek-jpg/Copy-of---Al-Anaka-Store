import React from 'react';
import { Home, X, ChevronRight, ChevronLeft, Lock, Package, AlertTriangle } from 'lucide-react';
import { ViewState, Language } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeView: (view: ViewState) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  siteConfig?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onChangeView,
  language,
  onLanguageChange,
}) => {
  const isRTL = language === 'ar';

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')
        }`}
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <span className="font-bold text-xl text-gray-900 font-tajawal">
            {language === 'ar' ? 'القائمة' : 'Menu'}
          </span>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          {/* Home Link - Emerald */}
          <button
            onClick={() => {
              onChangeView(ViewState.HOME);
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl transition-all group bg-white border border-transparent hover:border-emerald-100 hover:bg-emerald-50"
          >
            <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600 shadow-sm transition-transform group-hover:scale-110">
              <Home size={22} />
            </div>
            <span className="font-bold text-lg text-gray-700 group-hover:text-emerald-700">
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </span>
            {isRTL ? <ChevronLeft className="mr-auto text-emerald-200 group-hover:text-emerald-500 transition-colors" size={18} /> : <ChevronRight className="ml-auto text-emerald-200 group-hover:text-emerald-500 transition-colors" size={18} />}
          </button>

          {/* Track Order Link - Blue */}
          <button
            onClick={() => {
              onChangeView(ViewState.TRACK_ORDER);
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl transition-all group bg-white border border-transparent hover:border-blue-100 hover:bg-blue-50"
          >
            <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600 shadow-sm transition-transform group-hover:scale-110">
              <Package size={22} />
            </div>
            <span className="font-bold text-lg text-gray-700 group-hover:text-blue-700">
              {language === 'ar' ? 'تتبع طلباتي' : 'Track Order'}
            </span>
            {isRTL ? <ChevronLeft className="mr-auto text-blue-200 group-hover:text-blue-500 transition-colors" size={18} /> : <ChevronRight className="ml-auto text-blue-200 group-hover:text-blue-500 transition-colors" size={18} />}
          </button>

          {/* Report Problem Link - Orange */}
          <button
            onClick={() => {
              onChangeView(ViewState.REPORT_PROBLEM);
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl transition-all group bg-white border border-transparent hover:border-orange-100 hover:bg-orange-50"
          >
            <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600 shadow-sm transition-transform group-hover:scale-110">
              <AlertTriangle size={22} />
            </div>
            <span className="font-bold text-lg text-gray-700 group-hover:text-orange-700">
              {language === 'ar' ? 'إبلاغ عن مشكلة' : 'Report Problem'}
            </span>
            {isRTL ? <ChevronLeft className="mr-auto text-orange-200 group-hover:text-orange-500 transition-colors" size={18} /> : <ChevronRight className="ml-auto text-orange-200 group-hover:text-orange-500 transition-colors" size={18} />}
          </button>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Language Section - Compact */}
          <div className="px-2 mt-2">
            <div className="bg-gray-50 p-1.5 rounded-xl flex gap-1">
              <button
                onClick={() => onLanguageChange('ar')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  language === 'ar' 
                    ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              >
                <span className="text-base">🇸🇦</span>
                <span>العربية</span>
              </button>

              <button
                onClick={() => onLanguageChange('en')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  language === 'en' 
                    ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              >
                <span className="text-base">🇺🇸</span>
                <span>English</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          {/* Login - Purple */}
          <button
            onClick={() => {
              onChangeView(ViewState.ADMIN);
              onClose();
            }}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-gray-700 hover:text-purple-700 hover:border-purple-200 hover:bg-purple-50 mb-4 group"
          >
             <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-200 transition-colors">
                 <Lock size={20} />
            </div>
            <span className="font-bold text-lg">
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </span>
             {isRTL ? <ChevronLeft className="mr-auto text-gray-300 group-hover:text-purple-400" size={16} /> : <ChevronRight className="ml-auto text-gray-300 group-hover:text-purple-400" size={16} />}
          </button>
          
          <div className="text-center">
            <p className="text-xs text-gray-400">
              © 2024 {language === 'ar' ? 'بازار لوك' : 'Bazzr lok'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};