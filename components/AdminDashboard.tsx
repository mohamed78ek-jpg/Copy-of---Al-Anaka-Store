
import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2, LogOut, Package, ShieldCheck, ChevronDown, Megaphone, ShoppingBag, Phone, MapPin, Mail, User, FileText, X, Download, List, PlusCircle, Image as ImageIcon, Upload, MonitorPlay, Banknote } from 'lucide-react';
import { Product, Language, Order, PromoConfig, PopupConfig } from '../types';
import { APP_CURRENCY } from '../constants';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (id: number) => void;
  language: Language;
  bannerText: string;
  onUpdateBannerText: (text: string) => void;
  promoConfig: PromoConfig;
  onUpdatePromoConfig: (config: PromoConfig) => void;
  popupConfig: PopupConfig;
  onUpdatePopupConfig: (config: PopupConfig) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  orders,
  onAddProduct, 
  onRemoveProduct,
  language,
  bannerText,
  onUpdateBannerText,
  promoConfig,
  onUpdatePromoConfig,
  popupConfig,
  onUpdatePopupConfig
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Updated tabs state
  const [activeTab, setActiveTab] = useState<'orders' | 'add_product' | 'product_list' | 'settings'>('orders');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Form State
  const [newProduct, setNewProduct] = useState<Partial<Product> & { sizesString: string }>({
    name: '',
    price: 0,
    discountPrice: 0,
    category: '',
    image: '',
    description: '',
    sizesString: ''
  });

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  // Predefined Categories
  const CATEGORIES = ['رجال', 'أطفال', 'أحذية', 'اكسسوارات'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Mohamed' && password === 'Mohamed2003') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError(t('بيانات الدخول غير صحيحة', 'Invalid credentials'));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.category && newProduct.image) {
      
      const sizesArray = newProduct.sizesString 
        ? newProduct.sizesString.split(',').map(s => s.trim()).filter(s => s !== '') 
        : undefined;

      onAddProduct({
        id: Date.now(),
        name: newProduct.name,
        price: Number(newProduct.price),
        discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : undefined,
        category: newProduct.category,
        image: newProduct.image,
        description: newProduct.description || '',
        sizes: sizesArray
      });
      setNewProduct({ name: '', price: 0, discountPrice: 0, category: '', image: '', description: '', sizesString: '' });
      alert(t('تم إضافة المنتج بنجاح', 'Product added successfully'));
    }
  };

  const handlePromoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdatePromoConfig({ ...promoConfig, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePopupImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdatePopupConfig({ ...popupConfig, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // Helper to generate QR data string safely
  const getQRData = (order: Order) => {
    const qrString = `Order: ${order.id}\n` +
      `Date: ${new Date(order.date).toLocaleDateString()}\n` +
      `Customer: ${order.customerName}\n` +
      `Total: ${order.totalAmount.toFixed(2)} ${APP_CURRENCY}`;
    return encodeURIComponent(qrString);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('تسجيل دخول المسؤول', 'Admin Login')}</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('اسم المستخدم', 'Username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                dir="ltr"
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('كلمة المرور', 'Password')}</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[34px] right-3 text-gray-400 hover:text-gray-600"
                style={{ right: language === 'ar' ? 'auto' : '0.75rem', left: language === 'ar' ? '0.75rem' : 'auto' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
            >
              {t('دخول', 'Login')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 print:hidden">
        <h1 className="text-3xl font-bold text-gray-900">{t('لوحة تحكم الإدارة', 'Admin Dashboard')}</h1>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>{t('تسجيل خروج', 'Logout')}</span>
        </button>
      </div>

      {/* Navigation Tabs - Reorganized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-8 print:hidden">
        <button
          onClick={() => setActiveTab('orders')}
          className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'orders' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <ShoppingBag size={20} />
          {t('الطلبات', 'Orders')}
          {orders.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">{orders.length}</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('add_product')}
          className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'add_product' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <PlusCircle size={20} />
          {t('إضافة منتج', 'Add Product')}
        </button>

        <button
          onClick={() => setActiveTab('product_list')}
          className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'product_list' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <List size={20} />
          {t('قائمة المنتجات', 'Products List')}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'settings' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Megaphone size={20} />
          {t('إعلانات', 'Ads')}
        </button>
      </div>

      {/* Content Areas */}
      
      {/* 1. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag size={24} className="text-emerald-600" />
              {t('الطلبات الواردة', 'Incoming Orders')}
            </h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center">
              <ShoppingBag size={64} className="mb-4 text-gray-200" />
              <p className="text-lg">{t('لا توجد طلبات جديدة حتى الآن', 'No new orders yet')}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                         <span className="text-emerald-600">#{order.id}</span>
                         <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                           {new Date(order.date).toLocaleDateString()}
                         </span>
                      </h3>
                      <div className="flex flex-col gap-1 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <span dir="ltr" className="text-right">{order.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span>{order.email}</span>
                        </div>
                         <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{order.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 items-end">
                      <div className="text-left bg-emerald-50 p-4 rounded-xl border border-emerald-100 min-w-[150px]">
                        <div className="text-sm text-gray-500 mb-1">{t('إجمالي الطلب', 'Total Amount')}</div>
                        <div className="text-2xl font-bold text-emerald-600">{order.totalAmount.toFixed(2)} {APP_CURRENCY}</div>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold bg-white border border-emerald-200 hover:border-emerald-300 px-4 py-2 rounded-lg transition-colors w-full justify-center"
                      >
                        <FileText size={18} />
                        {t('عرض الفاتورة', 'View Invoice')}
                      </button>
                    </div>
                  </div>

                  {/* Simplified Products Display for Dashboard */}
                  <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                     <div className="flex items-center gap-2 text-gray-600">
                        <Package size={16} />
                        <span className="font-medium text-sm">
                          {t('عدد المنتجات:', 'Items Count:')} {order.items.reduce((a, b) => a + b.quantity, 0)}
                        </span>
                     </div>
                     <span className="text-xs text-gray-400">
                       {t('انقر على "عرض الفاتورة" للتفاصيل الكاملة', 'Click "View Invoice" for full details')}
                     </span>
                  </div>

                  {order.receiptFile && (
                    <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                      <Download size={12} />
                      {t('يوجد مرفق مع الطلب', 'Attachment available')}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. ADD PRODUCT TAB */}
      {activeTab === 'add_product' && (
        <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Plus size={24} className="text-emerald-600" />
              {t('إضافة منتج جديد', 'Add New Product')}
            </h2>
            
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('اسم المنتج', 'Product Name')}</label>
                <input
                  required
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('السعر الأصلي', 'Price')}</label>
                  <input
                    required
                    type="number"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('سعر الخصم (اختياري)', 'Discount Price (Optional)')}</label>
                  <input
                    type="number"
                    value={newProduct.discountPrice || ''}
                    onChange={(e) => setNewProduct({...newProduct, discountPrice: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('التصنيف', 'Category')}</label>
                  <div className="relative">
                    <select
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none appearance-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    >
                      <option value="">{t('اختر التصنيف', 'Select Category')}</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className={`absolute top-4 text-gray-400 pointer-events-none ${language === 'ar' ? 'left-4' : 'right-4'}`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('المقاسات (مفصولة بفاصلة)', 'Sizes (comma separated)')}</label>
                  <input
                    type="text"
                    value={newProduct.sizesString}
                    onChange={(e) => setNewProduct({...newProduct, sizesString: e.target.value})}
                    placeholder="S, M, L, XL"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('رابط الصورة', 'Image URL')}</label>
                <input
                  required
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('الوصف', 'Description')}</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none resize-none focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/30 text-lg"
              >
                {t('إضافة المنتج', 'Add Product')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. PRODUCT LIST TAB */}
      {activeTab === 'product_list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package size={24} className="text-emerald-600" />
              {t('قائمة المنتجات الحالية', 'Current Products List')}
            </h2>
            <span className="text-sm font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
              {products.length} {t('منتج', 'Products')}
            </span>
          </div>
          
          <div className="divide-y divide-gray-100">
            {products.map(product => (
              <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">{product.category}</span>
                    <span className="text-gray-300">|</span>
                    {product.discountPrice ? (
                      <>
                        <span className="line-through text-gray-400 text-sm">{product.price}</span> 
                        <span className="text-emerald-600 font-bold">{product.discountPrice} {APP_CURRENCY}</span>
                      </>
                    ) : (
                        <span className="font-bold text-gray-700">{product.price} {APP_CURRENCY}</span>
                    )}
                  </div>
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <span className="font-bold">{t('المقاسات:', 'Sizes:')}</span> 
                      {product.sizes.map(s => <span key={s} className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{s}</span>)}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => onRemoveProduct(product.id)}
                  className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                  title={t('حذف', 'Delete')}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="p-16 text-center text-gray-500">
                <Package size={64} className="mb-4 mx-auto text-gray-200" />
                {t('لا توجد منتجات حالياً', 'No products available')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. ADS TAB (Formerly Settings) */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Megaphone size={24} className="text-emerald-600" />
                {t('إعلانات الموقع', 'Site Ads')}
              </h2>

              <div className="space-y-8">
                {/* Banner Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Megaphone size={16} />
                    {t('شريط البنر العلوي', 'Top Banner')}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('نص الشريط المتحرك', 'Scrolling Text')}</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={bannerText}
                        onChange={(e) => onUpdateBannerText(e.target.value)}
                        placeholder={t('أدخل نص البنر هنا...', 'Enter banner text here...')}
                        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 outline-none transition-all"
                      />
                      <button 
                        onClick={() => onUpdateBannerText('')}
                        disabled={!bannerText}
                        className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200 transition-colors font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t('حذف الإعلان', 'Delete Ad')}
                      >
                        <Trash2 size={20} />
                        <span className="hidden sm:inline">{t('حذف', 'Delete')}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Popup Ad Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MonitorPlay size={16} />
                    {t('إعلان منبثق (Popup)', 'Popup Advertisement')}
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    
                    <div className="flex items-center gap-3 mb-4">
                      <input 
                        type="checkbox"
                        checked={popupConfig.isActive}
                        onChange={(e) => onUpdatePopupConfig({...popupConfig, isActive: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        id="popupActive"
                      />
                      <label htmlFor="popupActive" className="font-bold text-gray-900">{t('تفعيل الإعلان المنبثق', 'Activate Popup Ad')}</label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">{t('رابط الصورة (URL)', 'Image URL')}</label>
                           <input
                            type="text"
                            value={popupConfig.image.startsWith('data:') ? '' : popupConfig.image}
                            onChange={(e) => onUpdatePopupConfig({...popupConfig, image: e.target.value})}
                            placeholder="https://..."
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 outline-none text-sm"
                            dir="ltr"
                          />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">{t('أو رفع صورة من الجهاز', 'Or Upload Image')}</label>
                           <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePopupImageUpload}
                              className="w-full px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                            <Upload className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                           </div>
                        </div>
                      </div>

                      {/* Preview */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('معاينة', 'Preview')}</label>
                        <div className="w-48 aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden border border-gray-300 mx-auto md:mx-0">
                          {popupConfig.image ? (
                            <img src={popupConfig.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Promo Card Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <ImageIcon size={16} />
                    {t('بطاقة ترويجية في المنتجات (3:4)', 'Product Grid Promo Card (3:4)')}
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    
                    <div className="flex items-center gap-3 mb-4">
                      <input 
                        type="checkbox"
                        checked={promoConfig.isActive}
                        onChange={(e) => onUpdatePromoConfig({...promoConfig, isActive: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        id="promoActive"
                      />
                      <label htmlFor="promoActive" className="font-bold text-gray-900">{t('تفعيل البطاقة', 'Activate Card')}</label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">{t('رابط الصورة (URL)', 'Image URL')}</label>
                           <input
                            type="text"
                            value={promoConfig.image.startsWith('data:') ? '' : promoConfig.image}
                            onChange={(e) => onUpdatePromoConfig({...promoConfig, image: e.target.value})}
                            placeholder="https://..."
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 outline-none text-sm"
                            dir="ltr"
                          />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">{t('أو رفع صورة من الجهاز', 'Or Upload Image')}</label>
                           <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePromoImageUpload}
                              className="w-full px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                            <Upload className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                           </div>
                        </div>
                      </div>

                      {/* Preview */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('معاينة', 'Preview')}</label>
                        <div className="w-32 aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden border border-gray-300 mx-auto md:mx-0">
                          {promoConfig.image ? (
                            <img src={promoConfig.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
        </div>
      )}

      {/* Invoice Modal - Professional Design */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
          <div className="bg-white shadow-2xl w-full max-w-4xl mx-4 my-8 rounded-none print:shadow-none print:w-full print:max-w-none print:m-0 print:absolute print:inset-0 flex flex-col max-h-[90vh] print:max-h-none">
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto print:overflow-visible p-6 md:p-12 print:p-8">
                
                {/* Invoice Top Border */}
                <div className="h-2 bg-emerald-600 w-full mb-8 print:mb-6"></div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl print:text-black print:bg-transparent print:border print:border-black">
                                {language === 'ar' ? 'أ' : 'A'}
                             </div>
                             <h1 className="text-3xl font-black text-gray-900 tracking-tight">{language === 'ar' ? 'متجر الأناقة' : 'Al-Anaka Store'}</h1>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                            {language === 'ar' ? 'أزياء عصرية تجمع بين الفخامة والراحة.' : 'Modern fashion combining luxury and comfort.'}<br/>
                            Riyadh, Saudi Arabia<br/>
                            contact@alanaka.com | +966 50 000 0000
                        </p>
                    </div>
                    <div className="text-right w-full md:w-auto">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-200 uppercase tracking-widest mb-2 print:text-gray-400">{t('فاتورة', 'INVOICE')}</h2>
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="flex justify-between gap-8 text-gray-600">
                                <span className="font-bold text-gray-900">{t('رقم الفاتورة:', 'Invoice No:')}</span>
                                <span className="font-mono">#{selectedInvoiceOrder.id}</span>
                            </div>
                            <div className="flex justify-between gap-8 text-gray-600">
                                <span className="font-bold text-gray-900">{t('التاريخ:', 'Date:')}</span>
                                <span>{new Date(selectedInvoiceOrder.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between gap-8 text-gray-600">
                                <span className="font-bold text-gray-900">{t('الحالة:', 'Status:')}</span>
                                <span className="text-emerald-600 font-bold uppercase">{selectedInvoiceOrder.status === 'pending' ? t('مدفوع', 'PAID') : selectedInvoiceOrder.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bill To Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 pb-8 border-b border-gray-100 gap-6">
                    <div className="w-full md:w-1/2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t('فاتورة إلى', 'Bill To')}</h3>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedInvoiceOrder.customerName}</h4>
                        <div className="text-gray-500 text-sm space-y-1">
                            <p className="flex items-center gap-2"><MapPin size={14} /> {selectedInvoiceOrder.address}</p>
                            <p className="flex items-center gap-2" dir="ltr"><Phone size={14} /> {selectedInvoiceOrder.phoneNumber}</p>
                            <p className="flex items-center gap-2"><Mail size={14} /> {selectedInvoiceOrder.email}</p>
                        </div>
                    </div>
                    <div className="w-auto self-end md:self-auto">
                        <div className="w-32 h-32 bg-white p-1 border border-gray-200 rounded-lg">
                             <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${getQRData(selectedInvoiceOrder)}`}
                                alt="QR Code" 
                                className="w-full h-full mix-blend-multiply"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full mb-8 md:mb-12 min-w-[500px] md:min-w-0">
                        <thead>
                            <tr className="border-b-2 border-gray-900 text-sm">
                                <th className="pb-4 text-start font-bold text-gray-900 uppercase tracking-wider w-1/2">{t('الوصف', 'Description')}</th>
                                <th className="pb-4 text-center font-bold text-gray-900 uppercase tracking-wider">{t('الكمية', 'Qty')}</th>
                                <th className="pb-4 text-end font-bold text-gray-900 uppercase tracking-wider">{t('السعر', 'Price')}</th>
                                <th className="pb-4 text-end font-bold text-gray-900 uppercase tracking-wider">{t('الإجمالي', 'Total')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {selectedInvoiceOrder.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-100 last:border-0">
                                    <td className="py-2 md:py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-gray-900">{item.name}</div>
                                            {item.selectedSize && (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs border border-gray-200">{item.selectedSize}</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">{item.category}</div>
                                    </td>
                                    <td className="py-2 md:py-4 text-center">{item.quantity}</td>
                                    <td className="py-2 md:py-4 text-end">{item.price.toFixed(2)}</td>
                                    <td className="py-2 md:py-4 text-end font-medium text-gray-900">{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8 md:mb-12 break-inside-avoid">
                    <div className="w-full max-w-xs space-y-3">
                         <div className="flex justify-between text-gray-500 text-sm">
                            <span>{t('المجموع الفرعي', 'Subtotal')}</span>
                            <span>{(selectedInvoiceOrder.totalAmount / 1.15).toFixed(2)} {APP_CURRENCY}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-sm">
                            <span>{t('الضريبة (15%)', 'VAT (15%)')}</span>
                            <span>{(selectedInvoiceOrder.totalAmount - (selectedInvoiceOrder.totalAmount / 1.15)).toFixed(2)} {APP_CURRENCY}</span>
                        </div>
                        <div className="flex justify-between items-center border-t-2 border-gray-900 pt-3 mt-4">
                            <span className="font-bold text-gray-900 text-lg">{t('الإجمالي الكلي', 'Grand Total')}</span>
                            <span className="font-black text-2xl text-emerald-600">{selectedInvoiceOrder.totalAmount.toFixed(2)} <span className="text-sm font-normal text-gray-500">{APP_CURRENCY}</span></span>
                        </div>
                    </div>
                </div>

                {/* Signatures & Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mt-12 md:mt-16 break-inside-avoid gap-8">
                   <div className="text-center">
                     <div className="mb-2 border-b border-gray-300 pb-2 w-48 mx-auto"></div>
                     <span className="text-xs font-bold text-gray-400 uppercase">{t('توقيع العميل', 'Customer Signature')}</span>
                   </div>
                   
                   {/* Store Stamp / Signature */}
                   <div className="text-center relative">
                     <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 border-4 border-emerald-600/30 rounded-full flex items-center justify-center opacity-50 rotate-[-15deg] pointer-events-none">
                        <span className="text-emerald-800 font-black text-xs uppercase tracking-widest">{t('معتمد', 'APPROVED')}</span>
                     </div>
                     <div className="mb-2 border-b border-gray-300 pb-2 w-48 mx-auto relative z-10"></div>
                     <span className="text-xs font-bold text-gray-400 uppercase">{t('ختم المتجر / التوقيع', 'Store Stamp / Signature')}</span>
                   </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-12 break-inside-avoid">
                    <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">{t('وسائل الدفع المقبولة', 'Accepted Payment Methods')}</h4>
                    <div className="flex flex-wrap gap-3">
                         <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-bold text-blue-900 italic">VISA</div>
                         <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-bold text-red-600">Mastercard</div>
                         <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-bold text-blue-500">mada</div>
                         <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-bold text-black"> Pay</div>
                         <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-bold text-emerald-700 flex gap-1">
                            <Banknote size={14} />
                            {t('نقد', 'Cash')}
                         </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="border-t border-gray-200 pt-8 mt-8 text-gray-500 text-sm break-inside-avoid">
                    <h4 className="font-bold text-gray-900 mb-2">{t('ملاحظات', 'Notes')}</h4>
                    <p>{t('شكراً لتسوقكم معنا! نأمل أن تستمتعوا بمشترياتكم.', 'Thank you for shopping with us! We hope you enjoy your purchase.')}</p>
                    <p className="mt-2 text-xs text-gray-400">{t('تطبق الشروط والأحكام. الاسترجاع خلال 14 يوماً من تاريخ الشراء في حالته الأصلية.', 'Terms & Conditions apply. Returns within 14 days of purchase in original condition.')}</p>
                </div>
            </div>

            {/* Actions Bar (Hidden in Print) */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center print:hidden flex-shrink-0">
                <button 
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                <X size={18} />
                {t('إغلاق', 'Close')}
                </button>
                <button 
                onClick={handlePrintInvoice}
                className="px-8 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 font-bold shadow-lg"
                >
                <Download size={18} />
                {t('تحميل الفاتورة (PDF)', 'Download Invoice (PDF)')}
                </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
