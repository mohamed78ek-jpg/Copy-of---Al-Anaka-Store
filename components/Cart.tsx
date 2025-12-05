
import React, { useState } from 'react';
import { Trash2, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { CartItem, Language, Order } from '../types';
import { APP_CURRENCY } from '../constants';

interface CartProps {
  items: CartItem[];
  onRemove: (cartId: string) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onBack: () => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  language: Language;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  onRemove, 
  onUpdateQuantity, 
  onBack,
  onPlaceOrder,
  language
}) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + tax;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder({
      customerName: formData.name,
      phoneNumber: formData.phone,
      email: formData.email,
      address: formData.address,
      items: items,
      totalAmount: total,
    });
    setIsCheckoutModalOpen(false);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('سلة التسوق فارغة', 'Cart is empty')}</h2>
        <p className="text-gray-500 mb-8 max-w-sm">{t('يبدو أنك لم تقم بإضافة أي منتجات للسلة بعد. تصفح منتجاتنا المميزة الآن!', 'Looks like you haven\'t added any items yet. Browse our collection now!')}</p>
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/30"
        >
          {t('تصفح المنتجات', 'Browse Products')}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-emerald-600 mb-8 transition-colors group">
          <ArrowRight size={20} className={`transform group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'ml-2 rotate-180' : 'mr-2'}`} />
          <span>{t('متابعة التسوق', 'Continue Shopping')}</span>
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('سلة التسوق', 'Shopping Cart')}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div key={item.cartId} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:border-emerald-100">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      {item.selectedSize && (
                        <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                          {item.selectedSize}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => onRemove(item.cartId)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button 
                        onClick={() => onUpdateQuantity(item.cartId, -1)}
                        className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.cartId, 1)}
                        className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="font-bold text-emerald-600">
                      {item.price * item.quantity} {APP_CURRENCY}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('ملخص الطلب', 'Order Summary')}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('المجموع الفرعي', 'Subtotal')}</span>
                  <span>{subtotal.toFixed(2)} {APP_CURRENCY}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('الضريبة (15%)', 'VAT (15%)')}</span>
                  <span>{tax.toFixed(2)} {APP_CURRENCY}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900">
                  <span>{t('الإجمالي', 'Total')}</span>
                  <span>{total.toFixed(2)} {APP_CURRENCY}</span>
                </div>
              </div>

              <button 
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {t('إتمام الشراء', 'Checkout')}
              </button>
              <p className="text-xs text-gray-400 text-center mt-4">{t('جميع العمليات آمنة ومشفرة', 'Secure encrypted transaction')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0">
              <h3 className="text-xl font-bold text-gray-900">{t('إتمام الطلب', 'Complete Order')}</h3>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('الاسم الكامل', 'Full Name')}</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('رقم الهاتف', 'Phone Number')}</label>
                <input 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('البريد الإلكتروني', 'Email')}</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('عنوان التوصيل', 'Delivery Address')}</label>
                <textarea 
                  required 
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none bg-white"
                ></textarea>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center font-bold text-lg mb-4">
                  <span>{t('إجمالي الدفع:', 'Total Payment:')}</span>
                  <span className="text-emerald-600">{total.toFixed(2)} {APP_CURRENCY}</span>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  {t('تأكيد الطلب', 'Confirm Order')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
