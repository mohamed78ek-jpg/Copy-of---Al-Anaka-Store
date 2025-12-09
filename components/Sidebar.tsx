import React from 'react';
import { Home, X, Globe, ChevronRight, ChevronLeft, Lock, Package, AlertTriangle } from 'lucide-react';
import { ViewState, Language } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeView: (view: ViewState) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
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
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          
          {/* Home Link */}
          <button
            onClick={() => {
              onChangeView(ViewState.HOME);
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all group text-gray-700 hover:text-emerald-600"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
              <Home size={20} />
            </div>
            <span className="font-medium text-lg">
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </span>
            {isRTL ? <ChevronLeft className="mr-auto text-gray-300" size={16} /> : <ChevronRight className="ml-auto text-gray-300" size={16} />}
          </button>

          {/* Track Order Link */}
          <button
            onClick={() => {
              onChangeView(ViewState.TRACK_ORDER);
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all group text-gray-700 hover:text-emerald-600"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
              <Package size={20} />
            </div>
            <span className="font-medium text-lg">
              {language === 'ar' ? 'تتبع طلباتي' : 'Track Order'}
            </span>
            {isRTL ? <ChevronLeft className="mr-auto text-gray-300" size={16} /> : <ChevronRight className="ml-auto text-gray-300" size={16} />}
          </button>

          {/* Report Problem Link */}
          <button
            onClick={() => {
              onChangeView(ViewState.REPORT_PROBLEM);
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all group text-gray-700 hover:text-red-600"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
              <AlertTriangle size={20} />
            </div>
            <span className="font-medium text-lg">
              {language === 'ar' ? 'إبلاغ عن مشكلة' : 'Report Problem'}
            </span>
            {isRTL ? <ChevronLeft className="mr-auto text-gray-300" size={16} /> : <ChevronRight className="ml-auto text-gray-300" size={16} />}
          </button>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Language Section */}
          <div className="px-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe size={14} />
              {language === 'ar' ? 'اللغة' : 'Language'}
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onLanguageChange('ar')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  language === 'ar' 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-100 hover:border-emerald-200 text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1">🇸🇦</span>
                <span className="font-bold text-sm">العربية</span>
              </button>

              <button
                onClick={() => onLanguageChange('en')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  language === 'en' 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-100 hover:border-emerald-200 text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1">🇺🇸</span>
                <span className="font-bold text-sm">English</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => {
              onChangeView(ViewState.ADMIN);
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-emerald-600 mb-4"
          >
            <Lock size={18} />
            <span className="font-medium">
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </span>
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