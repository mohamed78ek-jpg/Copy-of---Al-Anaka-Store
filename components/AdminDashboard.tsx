import React, { useState } from 'react';
import { Plus, Trash2, LogOut, Package, ShieldCheck, ChevronDown, Megaphone, ShoppingBag, Phone, MapPin, Mail, User, FileText, X, List, PlusCircle, Image as ImageIcon, MonitorPlay, Settings, Edit, Printer, Upload } from 'lucide-react';
import { Product, Language, Order, PopupConfig, SiteConfig, OrderStatus } from '../types';
import { APP_CURRENCY } from '../constants';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (id: number) => void;
  language: Language;
  bannerText: string;
  onUpdateBannerText: (text: string) => void;
  popupConfig: PopupConfig;
  onUpdatePopupConfig: (config: PopupConfig) => void;
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  orders,
  onAddProduct, 
  onRemoveProduct,
  language,
  bannerText,
  onUpdateBannerText,
  popupConfig,
  onUpdatePopupConfig,
  siteConfig,
  onUpdateSiteConfig,
  onUpdateOrderStatus
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Login input
  const [adminPassword, setAdminPassword] = useState('Mohamed2003'); // Actual password state
  const [newPasswordInput, setNewPasswordInput] = useState(''); // For changing password
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'orders' | 'add_product' | 'product_list' | 'banner' | 'popup' | 'settings'>('orders');
  
  // State for Order Management Modal
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Order | null>(null);

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

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return t('قيد الانتظار', 'Pending');
      case 'processing': return t('جاري التجهيز', 'Processing');
      case 'shipped': return t('تم الشحن', 'Shipped');
      case 'delivered': return t('تم التوصيل', 'Delivered');
      case 'cancelled': return t('ملغي', 'Cancelled');
      default: return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Mohamed' && password === adminPassword) {
      setIsAuthenticated(true);
      setError('');
      setPassword(''); // Clear password field after login
    } else {
      setError(t('بيانات الدخول غير صحيحة', 'Invalid credentials'));
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length < 4) {
      alert(t('كلمة المرور يجب أن تكون 4 أحرف على الأقل', 'Password must be at least 4 characters'));
      return;
    }
    setAdminPassword(newPasswordInput);
    setNewPasswordInput('');
    alert(t('تم تغيير كلمة المرور بنجاح', 'Password changed successfully'));
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

  // Handler for Product Image Upload
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrintOrder = (order: Order) => {
    // Generate QR Code URL using a public API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`Order #${order.id} - ${order.customerName} - ${order.totalAmount} ${APP_CURRENCY}`)}`;

    const printContent = `
      <!DOCTYPE html>
      <html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <title>Invoice #${order.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Tajawal', sans-serif;
            background: #fff;
            color: #333;
            margin: 0;
            padding: 40px;
            font-size: 14px;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #eee;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand-section h1 {
            margin: 0;
            color: #10b981;
            font-size: 32px;
            font-weight: 800;
          }
          .brand-section p {
            margin: 5px 0 0;
            color: #666;
            font-size: 14px;
          }
          .invoice-info {
            text-align: ${language === 'ar' ? 'left' : 'right'};
          }
          .invoice-info h2 {
            margin: 0;
            font-size: 24px;
            color: #333;
            text-transform: uppercase;
          }
          .invoice-info p {
            margin: 5px 0 0;
            color: #666;
          }
          
          .details-grid {
            display: flex;
            gap: 40px;
            margin-bottom: 40px;
          }
          .details-column {
            flex: 1;
          }
          .details-title {
            font-weight: bold;
            font-size: 16px;
            color: #10b981;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .info-row {
            display: flex;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            width: 100px;
            color: #555;
          }
          .info-value {
            flex: 1;
            color: #333;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background-color: #f8fafc;
            color: #1f2937;
            font-weight: bold;
            padding: 12px;
            text-align: ${language === 'ar' ? 'right' : 'left'};
            border-bottom: 2px solid #e5e7eb;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: middle;
          }
          .product-img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid #eee;
          }
          .total-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          .total-box {
            width: 300px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            color: #555;
          }
          .grand-total {
            border-top: 2px solid #10b981;
            padding-top: 10px;
            margin-top: 10px;
            font-weight: bold;
            font-size: 18px;
            color: #10b981;
          }
          
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 40px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          .qr-code img {
            width: 100px;
            height: 100px;
          }
          .thank-you {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .contact-info {
            font-size: 12px;
            color: #888;
            margin-bottom: 15px;
          }
          
          /* Payment Methods */
          .payment-methods {
            display: flex;
            gap: 8px;
            margin-top: 15px;
            flex-wrap: wrap;
          }
          .payment-badge {
            border: 1px solid #e5e7eb;
            padding: 6px 12px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 11px;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          @media print {
            body { padding: 0; }
            .invoice-container { box-shadow: none; border: none; padding: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="header">
            <div class="brand-section">
              <h1>${language === 'ar' ? 'بازار لوك' : 'Bazzr lok'}</h1>
              <p>${language === 'ar' ? 'متجر الملابس العصري' : 'Modern Fashion Store'}</p>
            </div>
            <div class="invoice-info">
              <h2>${language === 'ar' ? 'فاتورة' : 'INVOICE'}</h2>
              <p>#${order.id}</p>
              <p>${new Date(order.date).toLocaleString()}</p>
            </div>
          </div>

          <!-- Info Grid -->
          <div class="details-grid">
            <div class="details-column">
              <div class="details-title">${language === 'ar' ? 'بيانات العميل' : 'Bill To'}</div>
              <div class="info-row">
                <span class="info-label">${language === 'ar' ? 'الاسم:' : 'Name:'}</span>
                <span class="info-value">${order.customerName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">${language === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
                <span class="info-value" dir="ltr">${order.phoneNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">${language === 'ar' ? 'البريد:' : 'Email:'}</span>
                <span class="info-value">${order.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">${language === 'ar' ? 'العنوان:' : 'Address:'}</span>
                <span class="info-value">${order.address}</span>
              </div>
            </div>
            
            <div class="details-column">
               <div class="details-title">${language === 'ar' ? 'تفاصيل الطلب' : 'Order Info'}</div>
               <div class="info-row">
                <span class="info-label">${language === 'ar' ? 'الحالة:' : 'Status:'}</span>
                <span class="info-value">${getStatusLabel(order.status)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">${language === 'ar' ? 'طريقة الدفع:' : 'Payment:'}</span>
                <span class="info-value">${language === 'ar' ? 'عند الاستلام' : 'Cash on Delivery'}</span>
              </div>
            </div>
          </div>

          <!-- Products Table -->
          <table>
            <thead>
              <tr>
                <th>${language === 'ar' ? 'المنتج' : 'Item'}</th>
                <th>${language === 'ar' ? 'التفاصيل' : 'Details'}</th>
                <th style="text-align: center;">${language === 'ar' ? 'الكمية' : 'Qty'}</th>
                <th style="text-align: right;">${language === 'ar' ? 'السعر' : 'Price'}</th>
                <th style="text-align: right;">${language === 'ar' ? 'الإجمالي' : 'Total'}</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td width="60">
                    <img src="${item.image}" alt="Product" class="product-img">
                  </td>
                  <td>
                    <div style="font-weight: bold;">${item.name}</div>
                    <div style="font-size: 12px; color: #666;">
                      ${item.category} ${item.selectedSize ? `| ${language === 'ar' ? 'المقاس' : 'Size'}: ${item.selectedSize}` : ''}
                    </div>
                  </td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">${item.price.toFixed(2)}</td>
                  <td style="text-align: right; font-weight: bold;">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Totals -->
          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span>${language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>${(order.totalAmount / 1.15).toFixed(2)} ${APP_CURRENCY}</span>
              </div>
              <div class="total-row">
                <span>${language === 'ar' ? 'الضريبة (15%)' : 'Tax (15%)'}</span>
                <span>${(order.totalAmount - (order.totalAmount / 1.15)).toFixed(2)} ${APP_CURRENCY}</span>
              </div>
              <div class="total-row grand-total">
                <span>${language === 'ar' ? 'الإجمالي النهائي' : 'Grand Total'}</span>
                <span>${order.totalAmount.toFixed(2)} ${APP_CURRENCY}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div>
              <div class="thank-you">${language === 'ar' ? 'شكراً لتسوقك معنا!' : 'Thank you for your business!'}</div>
              <div class="contact-info">
                Bazzr lok Inc. | mohamedrbani9@gmail.com<br>
                ${language === 'ar' ? 'تم إنشاء الفاتورة إلكترونياً' : 'System Generated Invoice'}
              </div>

              <!-- Payment Methods -->
              <div class="payment-methods">
                <div class="payment-badge" style="color: #1a1f71; font-style: italic;">VISA</div>
                <div class="payment-badge" style="color: #eb001b;">Mastercard</div>
                <div class="payment-badge" style="color: #005eb8;">mada</div>
                <div class="payment-badge" style="color: #000;"> Pay</div>
                <div class="payment-badge" style="background-color: #ecfdf5; color: #047857; border-color: #d1fae5;">
                  ${language === 'ar' ? 'عند الاستلام' : 'Cash on Delivery'}
                </div>
              </div>
            </div>
            
            <div class="qr-code">
              <img src="${qrCodeUrl}" alt="QR Code">
              <div style="font-size: 10px; text-align: center; margin-top: 5px;">Scan to Verify</div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '', 'width=900,height=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('كلمة المرور', 'Password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                dir="ltr"
              />
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{t('لوحة تحكم الإدارة', 'Admin Dashboard')}</h1>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>{t('تسجيل خروج', 'Logout')}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'orders' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <ShoppingBag size={20} />
          <span className="hidden md:inline">{t('الطلبات', 'Orders')}</span>
          <span className="md:hidden">{t('طلبات', 'Orders')}</span>
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
          <span className="hidden md:inline">{t('إضافة منتج', 'Add Product')}</span>
          <span className="md:hidden">{t('إضافة', 'Add')}</span>
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
          <span className="hidden md:inline">{t('قائمة المنتجات', 'Products List')}</span>
          <span className="md:hidden">{t('المنتجات', 'Products')}</span>
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'banner' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Megaphone size={20} />
          <span className="hidden md:inline">{t('الشريط العلوي', 'Banner')}</span>
          <span className="md:hidden">{t('شريط', 'Banner')}</span>
        </button>

        <button
          onClick={() => setActiveTab('popup')}
          className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'popup' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <MonitorPlay size={20} />
          <span className="hidden md:inline">{t('إعلان منبثق', 'Popup')}</span>
          <span className="md:hidden">{t('إعلان', 'Popup')}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'settings' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Settings size={20} />
          <span className="hidden md:inline">{t('الإعدادات', 'Settings')}</span>
          <span className="md:hidden">{t('إعدادات', 'Settings')}</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
        
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShoppingBag className="text-emerald-600" />
              {t('الطلبات المستلمة', 'Received Orders')}
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t('لا توجد طلبات حتى الآن', 'No orders yet')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-500 transition-colors relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg text-gray-900">#{order.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-bold text-xl text-emerald-600">{order.totalAmount.toFixed(2)} {APP_CURRENCY}</div>
                        
                        <button 
                          onClick={() => setSelectedOrderForEdit(order)}
                          className="flex items-center gap-1 text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                        >
                          <Edit size={14} />
                          {t('إدارة الطلب', 'Manage Order')}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User size={16} />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} />
                          <span dir="ltr">{order.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          <span>{order.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} />
                          <span>{order.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-bold text-sm mb-2 text-gray-700">{t('المنتجات:', 'Products:')}</h4>
                      <ul className="space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm text-gray-600">
                            <span>{item.name} {item.selectedSize && `(${item.selectedSize})`} x{item.quantity}</span>
                            <span>{(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD PRODUCT TAB */}
        {activeTab === 'add_product' && (
          <form onSubmit={handleAddSubmit} className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PlusCircle className="text-emerald-600" />
              {t('إضافة منتج جديد', 'Add New Product')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('اسم المنتج', 'Product Name')}</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('التصنيف', 'Category')}</label>
                <div className="relative">
                  <select
                    required
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none bg-white"
                  >
                    <option value="">{t('اختر تصنيف', 'Select Category')}</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('السعر', 'Price')}</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newProduct.price || ''}
                  onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('السعر بعد الخصم (اختياري)', 'Discount Price (Optional)')}</label>
                <input
                  type="number"
                  min="0"
                  value={newProduct.discountPrice || ''}
                  onChange={e => setNewProduct({...newProduct, discountPrice: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('صورة المنتج', 'Product Image')}</label>
              
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer relative bg-white mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <span className="text-sm text-gray-500 font-medium">
                  {t('اضغط لتحميل صورة من الجهاز', 'Click to upload image from device')}
                </span>
              </div>

              {/* URL Input (Fallback) */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  placeholder={t('أو ضع رابط الصورة هنا...', 'Or paste image URL here...')}
                />
                {newProduct.image && (
                  <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('وصف المنتج', 'Description')}</label>
              <textarea
                required
                rows={3}
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none bg-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('المقاسات (مفصولة بفاصلة)', 'Sizes (comma separated)')}</label>
              <input
                type="text"
                value={newProduct.sizesString}
                onChange={e => setNewProduct({...newProduct, sizesString: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                placeholder="S, M, L, XL or 40, 41, 42"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg"
            >
              {t('إضافة المنتج', 'Add Product')}
            </button>
          </form>
        )}

        {/* PRODUCT LIST TAB */}
        {activeTab === 'product_list' && (
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <List className="text-emerald-600" />
              {t('قائمة المنتجات', 'Products List')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="p-3 rounded-r-lg">ID</th>
                    <th className="p-3">{t('الصورة', 'Image')}</th>
                    <th className="p-3">{t('الاسم', 'Name')}</th>
                    <th className="p-3">{t('السعر', 'Price')}</th>
                    <th className="p-3">{t('التصنيف', 'Category')}</th>
                    <th className="p-3 rounded-l-lg text-center">{t('إجراءات', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono">{product.id}</td>
                      <td className="p-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover border border-gray-200" />
                      </td>
                      <td className="p-3 font-bold">{product.name}</td>
                      <td className="p-3 text-emerald-600 font-bold">{product.price} {APP_CURRENCY}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{product.category}</span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm(t('هل أنت متأكد من حذف هذا المنتج نهائياً؟', 'Are you sure you want to delete this product permanently?'))) {
                              onRemoveProduct(product.id);
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('حذف', 'Delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BANNER TAB */}
        {activeTab === 'banner' && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Megaphone className="text-emerald-600" />
              {t('إعدادات الشريط العلوي', 'Banner Settings')}
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 mb-3">{t('نص الشريط المتحرك', 'Marquee Text')}</label>
              <textarea
                rows={3}
                value={bannerText}
                onChange={(e) => onUpdateBannerText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              ></textarea>
              <p className="text-xs text-gray-500 mt-2">
                {t('هذا النص سيظهر في الشريط المتحرك أعلى الصفحة الرئيسية.', 'This text will appear in the scrolling banner at the top of the home page.')}
              </p>
            </div>
          </div>
        )}

        {/* POPUP TAB */}
        {activeTab === 'popup' && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MonitorPlay className="text-emerald-600" />
              {t('إعدادات الإعلان المنبثق', 'Popup Settings')}
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">{t('تفعيل الإعلان', 'Activate Popup')}</span>
                <button
                  onClick={() => onUpdatePopupConfig({ ...popupConfig, isActive: !popupConfig.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    popupConfig.isActive ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      popupConfig.isActive ? 'translate-x-1' : 'translate-x-6'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">{t('صورة الإعلان', 'Popup Image')}</label>
                
                {popupConfig.image && (
                   <div className="mb-4 relative w-full aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                     <img src={popupConfig.image} alt="Ad Preview" className="w-full h-full object-cover" />
                     <button 
                       onClick={() => onUpdatePopupConfig({ ...popupConfig, image: '' })}
                       className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600"
                     >
                       <X size={16} />
                     </button>
                   </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer relative bg-white">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePopupImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
                  <span className="text-sm text-gray-500 font-medium">
                    {t('اضغط لرفع صورة', 'Click to upload image')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="text-emerald-600" />
              {t('الإعدادات العامة', 'General Settings')}
            </h2>

            {/* Site Settings */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800">{t('إعدادات الموقع', 'Site Settings')}</h3>
              
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${siteConfig.enableTrackOrder ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                    <Package size={20} />
                  </div>
                  <span className="font-bold text-gray-700">{t('تفعيل تتبع الطلبات', 'Enable Order Tracking')}</span>
                </div>
                
                <button
                  onClick={() => onUpdateSiteConfig({ ...siteConfig, enableTrackOrder: !siteConfig.enableTrackOrder })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    siteConfig.enableTrackOrder ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                  dir="ltr"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      siteConfig.enableTrackOrder ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800">{t('تغيير كلمة المرور', 'Change Password')}</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('كلمة المرور الجديدة', 'New Password')}</label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    placeholder="****"
                    dir="ltr"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                >
                  {t('حفظ كلمة المرور', 'Save Password')}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Order Status Modal */}
      {selectedOrderForEdit && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedOrderForEdit(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-10 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{t('حالة الطلب', 'Order Status')}</h3>
                <p className="text-xs text-gray-400">#{selectedOrderForEdit.id}</p>
              </div>
              <button onClick={() => setSelectedOrderForEdit(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-2">
              {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onUpdateOrderStatus(selectedOrderForEdit.id, status);
                    setSelectedOrderForEdit(prev => prev ? { ...prev, status } : null);
                  }}
                  className={`w-full flex items-center justify-between p-4 mb-1 rounded-xl transition-all ${
                    selectedOrderForEdit.status === status 
                      ? 'bg-gray-100 font-bold border-2 border-emerald-500 text-emerald-800' 
                      : 'hover:bg-gray-50 border-2 border-transparent text-gray-600'
                  }`}
                >
                  <span>{getStatusLabel(status)}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOrderForEdit.status === status ? 'border-emerald-500' : 'border-gray-300'
                  }`}>
                    {selectedOrderForEdit.status === status && (
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
               <button 
                 onClick={() => handlePrintOrder(selectedOrderForEdit)}
                 className="w-full bg-gray-900 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
               >
                 <Printer size={18} />
                 <span>{t('طباعة / حفظ', 'Print / Save')}</span>
               </button>
               <div className="text-center mt-3 text-xs text-gray-400 flex items-center justify-center gap-1">
                 <Package size={12} />
                 <span>{t('عدد المنتجات:', 'Items Count:')} {selectedOrderForEdit.items.length}</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};