import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package, ShieldCheck, ChevronDown, Megaphone, ShoppingBag, Phone, User, X, List, PlusCircle, Image as ImageIcon, MonitorPlay, Settings, Edit, Printer, Upload, MessageSquare, DollarSign, LayoutGrid, ArrowUpRight, Server, RefreshCw, Database, CloudLightning, Link } from 'lucide-react';
import { Product, Language, Order, PopupConfig, SiteConfig, OrderStatus, Report } from '../types';
import { APP_CURRENCY } from '../constants';
import { mockServer } from '../services/mockServer';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  reports: Report[];
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (id: number) => void;
  onRemoveReport: (id: number) => void;
  language: Language;
  bannerText: string;
  onUpdateBannerText: (text: string) => void;
  popupConfig: PopupConfig;
  onUpdatePopupConfig: (config: PopupConfig) => void;
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  orders,
  reports,
  onAddProduct, 
  onRemoveProduct,
  onRemoveReport,
  language,
  bannerText,
  onUpdateBannerText,
  popupConfig,
  onUpdatePopupConfig,
  siteConfig,
  onUpdateSiteConfig,
  onUpdateOrderStatus,
  onResetData
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Login input
  const [adminPassword, setAdminPassword] = useState('Mohamed2003'); // Actual password state
  const [currentPasswordInput, setCurrentPasswordInput] = useState(''); // Verification input for change
  const [newPasswordInput, setNewPasswordInput] = useState(''); // For changing password
  const [error, setError] = useState('');
  
  // Database Connection State
  const [dbUrl, setDbUrl] = useState('');
  const [dbKey, setDbKey] = useState('');
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'add_product' | 'product_list' | 'banner' | 'popup' | 'settings' | 'reports'>('stats');
  
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

  // Check connection status on load
  useEffect(() => {
    setIsCloudConnected(mockServer.isConnectedToCloud());
  }, []);

  // Statistics Calculation
  const stats = {
    totalRevenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((acc, curr) => acc + curr.totalAmount, 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalProducts: products.length
  };

  // Predefined Categories - Added 'نساء'
  const CATEGORIES = ['رجال', 'نساء', 'أطفال', 'أحذية', 'اكسسوارات'];

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
    
    if (currentPasswordInput !== adminPassword) {
      alert(t('كلمة المرور الحالية غير صحيحة', 'Current password is incorrect'));
      return;
    }

    if (newPasswordInput.length < 4) {
      alert(t('كلمة المرور يجب أن تكون 4 أحرف على الأقل', 'Password must be at least 4 characters'));
      return;
    }
    
    setAdminPassword(newPasswordInput);
    setNewPasswordInput('');
    setCurrentPasswordInput('');
    alert(t('تم تغيير كلمة المرور بنجاح', 'Password changed successfully'));
  };

  const handleConnectDB = (e: React.FormEvent) => {
    e.preventDefault();
    if(dbUrl && dbKey) {
        mockServer.saveConnection(dbUrl, dbKey);
        // Page reloads in service
    }
  };

  const handleDisconnectDB = () => {
    if(window.confirm(t('هل أنت متأكد من قطع الاتصال؟ سيتم العودة للتخزين المحلي.', 'Are you sure? This will revert to local storage.'))) {
        mockServer.disconnectExternalDB();
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

  // Header Component for Admin Dashboard
  const AdminHeader = () => (
    <div className="bg-black text-white p-4 flex justify-between items-center rounded-2xl mb-6 shadow-lg">
      <div className="flex items-center gap-3">
        <button onClick={() => setIsAuthenticated(false)}>
           <X size={24} className="text-gray-400 hover:text-white transition-colors" />
        </button>
        <div>
          <h1 className="text-xl font-bold">{t('لوحة التحكم', 'Control Panel')}</h1>
          <p className="text-xs text-gray-400">{t('إدارة المتجر', 'Store Management')}</p>
        </div>
      </div>
      <div className="bg-white/10 p-2 rounded-lg">
        <LayoutGrid size={24} />
      </div>
    </div>
  );

  // Quick Navigation Pills
  const QuickNav = () => (
    <div className="flex justify-center gap-2 mb-8 bg-white p-2 rounded-full shadow-sm border border-gray-100 w-fit mx-auto">
      <button 
        onClick={() => setActiveTab('stats')}
        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
          activeTab === 'stats' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <LayoutGrid size={16} />
          {t('الرئيسية', 'Home')}
        </div>
      </button>

      <button 
        onClick={() => setActiveTab('add_product')}
        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
          activeTab === 'add_product' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <Plus size={16} />
          {t('إضافة منتج', 'Add Product')}
        </div>
      </button>

      <button 
        onClick={() => setActiveTab('orders')}
        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
          activeTab === 'orders' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} />
          {t('الطلبات', 'Orders')}
        </div>
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      
      <AdminHeader />
      <QuickNav />

      {/* Main Dashboard Content (Home) */}
      {activeTab === 'stats' && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Welcome Section - Fixed RTL Order */}
          <div className="flex justify-between items-end mb-8 px-2">
            
            {/* Welcome Text (Start in RTL) */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                👋 {t('مرحباً، محمد', 'Hello, Mohamed')}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{t('نظرة عامة على المتجر', 'Store Overview')}</p>
            </div>

            {/* Logout Button (End in RTL) */}
            <div>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="text-red-500 text-sm font-bold border border-red-200 bg-red-50 px-3 py-1 rounded-lg mb-2 hover:bg-red-100 transition-colors"
              >
                {t('تسجيل خروج', 'Logout')}
              </button>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            
            {/* Orders Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <ShoppingBag size={20} />
                </div>
                <h3 className="text-gray-500 font-bold text-sm">{t('عدد الطلبات', 'Number of Orders')}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-4xl font-black text-gray-900 mb-1">{stats.totalOrders}</span>
                <span className="text-blue-600 text-xs font-bold">{t('طلبات جديدة', 'New Orders')}</span>
              </div>
            </div>

            {/* Sales Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <DollarSign size={20} />
                </div>
                <h3 className="text-gray-500 font-bold text-sm">{t('إجمالي المبيعات', 'Total Sales')}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-4xl font-black text-gray-900 mb-1" dir="ltr">{stats.totalRevenue} <span className="text-lg text-gray-400">{APP_CURRENCY}</span></span>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <ArrowUpRight size={14} />
                  <span>{t('12% هذا الأسبوع+', '+12% this week')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Store Activity Section - UPDATED TO SHOW SERVER STATUS */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">{t('حالة النظام', 'System Status')}</h3>
            
            <div className="space-y-6">
              <div className={`flex items-center justify-between p-3 rounded-xl border ${isCloudConnected ? 'bg-purple-50 border-purple-100' : 'bg-green-50 border-green-100'}`}>
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCloudConnected ? 'bg-purple-200 text-purple-700' : 'bg-green-200 text-green-700'}`}>
                      <Server size={18} />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-800 text-sm">
                        {isCloudConnected ? t('متصل بقاعدة بيانات خارجية', 'Connected to External DB') : t('السيرفر المحلي متصل', 'Local Server Online')}
                      </h4>
                      <p className={`${isCloudConnected ? 'text-purple-600' : 'text-green-600'} text-xs`}>
                        {isCloudConnected ? t('Supabase Cloud Sync', 'Supabase Cloud Sync') : t('تخزين محلي (المتصفح)', 'Local Browser Storage')}
                      </p>
                   </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isCloudConnected ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{t('تم تحديث المخزون منذ 2 ساعة', 'Inventory updated 2 hours ago')}</span>
                <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{t('عدد الزوار اليوم: 124', 'Visitors today: 124')}</span>
                 <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Quick Actions / More Sections (Hidden in Home view to match screenshot cleanliness, but accessible via pills) */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
             <button onClick={() => setActiveTab('product_list')} className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-500 hover:text-emerald-600 font-bold text-sm flex flex-col items-center gap-2 hover:shadow-md transition-all">
                <List size={20} />
                {t('المنتجات', 'Products')}
             </button>
             <button onClick={() => setActiveTab('reports')} className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-500 hover:text-emerald-600 font-bold text-sm flex flex-col items-center gap-2 hover:shadow-md transition-all">
                <MessageSquare size={20} />
                {t('الرسائل', 'Messages')}
             </button>
             <button onClick={() => setActiveTab('settings')} className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-500 hover:text-emerald-600 font-bold text-sm flex flex-col items-center gap-2 hover:shadow-md transition-all">
                <Settings size={20} />
                {t('الإعدادات', 'Settings')}
             </button>
              <button onClick={() => setActiveTab('banner')} className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-500 hover:text-emerald-600 font-bold text-sm flex flex-col items-center gap-2 hover:shadow-md transition-all">
                <Megaphone size={20} />
                {t('الإعلانات', 'Ads')}
             </button>
          </div>

        </div>
      )}

      {/* Content for other tabs */}
      <div className="max-w-4xl mx-auto">
        
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShoppingBag className="text-emerald-600" />
              {t('الطلبات المستلمة', 'Received Orders')}
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-3xl border border-gray-100">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t('لا توجد طلبات حتى الآن', 'No orders yet')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-3xl p-5 hover:border-emerald-500 transition-colors shadow-sm">
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
                          className="flex items-center gap-1 text-sm bg-black text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm font-bold"
                        >
                          <Edit size={14} />
                          {t('إدارة الطلب', 'Manage')}
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
                    </div>

                    {/* NEW: Ordered Products List */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <h4 className="text-xs font-bold text-gray-500 mb-3">{t('المنتجات المطلوبة', 'Ordered Items')}</h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                              <div className="text-xs text-gray-500 flex items-center flex-wrap gap-2 mt-0.5">
                                <span className="font-medium text-emerald-600">{item.price} {APP_CURRENCY}</span>
                                <span>× {item.quantity}</span>
                                {item.selectedSize && (
                                  <span className="bg-white px-1.5 py-0.5 rounded text-[10px] border border-gray-200">
                                    {item.selectedSize}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD PRODUCT TAB */}
        {activeTab === 'add_product' && (
          <form onSubmit={handleAddSubmit} className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <PlusCircle className="text-emerald-600" />
              {t('إضافة منتج جديد', 'Add New Product')}
            </h2>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('اسم المنتج', 'Product Name')}</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('التصنيف', 'Category')}</label>
                  <div className="relative">
                    <select
                      required
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none bg-gray-50"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('السعر بعد الخصم', 'Discount Price')}</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.discountPrice || ''}
                    onChange={e => setNewProduct({...newProduct, discountPrice: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('وصف المنتج', 'Product Description')}</label>
                <textarea
                  rows={4}
                  value={newProduct.description || ''}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
                  placeholder={t('أضف وصفاً تفصيلياً للمنتج...', 'Add detailed product description...')}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('صورة المنتج', 'Product Image')}</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
                    placeholder="URL..."
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 hover:border-emerald-500 cursor-pointer relative w-12 h-12 flex items-center justify-center">
                    <input type="file" accept="image/*" onChange={handleProductImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('المقاسات', 'Sizes')}</label>
                <input
                  type="text"
                  value={newProduct.sizesString}
                  onChange={e => setNewProduct({...newProduct, sizesString: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
                  placeholder="S, M, L..."
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg"
              >
                {t('إضافة المنتج', 'Add Product')}
              </button>
            </div>
          </form>
        )}

        {/* PRODUCT LIST TAB */}
        {activeTab === 'product_list' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <List className="text-emerald-600" />
              {t('قائمة المنتجات', 'Products List')}
            </h2>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-700 font-bold">
                  <tr>
                    <th className="p-4">{t('الصورة', 'Image')}</th>
                    <th className="p-4">{t('الاسم', 'Name')}</th>
                    <th className="p-4">{t('السعر', 'Price')}</th>
                    <th className="p-4 text-center">{t('إجراءات', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                      </td>
                      <td className="p-4 font-bold">{product.name}</td>
                      <td className="p-4 text-emerald-600 font-bold">{product.price}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm(t('هل أنت متأكد؟', 'Are you sure?'))) {
                              onRemoveProduct(product.id);
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Megaphone className="text-emerald-600" />
              {t('الشريط العلوي', 'Banner')}
            </h2>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-3">{t('نص الشريط المتحرك', 'Marquee Text')}</label>
              <textarea
                rows={3}
                value={bannerText}
                onChange={(e) => onUpdateBannerText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
              ></textarea>
            </div>
          </div>
        )}

        {/* POPUP TAB */}
        {activeTab === 'popup' && (
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MonitorPlay className="text-emerald-600" />
              {t('الإعلان المنبثق', 'Popup')}
            </h2>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
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
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 bg-gray-50 relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePopupImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
                  <span className="text-sm text-gray-500 font-medium">
                    {t('اضغط لرفع صورة', 'Click to upload')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings className="text-emerald-600" />
              {t('الإعدادات العامة', 'General Settings')}
            </h2>

            {/* Admin Password Change */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-gray-800">{t('تغيير كلمة المرور', 'Change Password')}</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('كلمة المرور الحالية', 'Current Password')}</label>
                  <input
                    type="password"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
                    placeholder="****"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('كلمة المرور الجديدة', 'New Password')}</label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
                    placeholder="****"
                    dir="ltr"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  {t('حفظ', 'Save')}
                </button>
              </form>
            </div>

            {/* External Database Connection */}
            <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                    <Database size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-purple-900">{t('قاعدة بيانات خارجية', 'External Database')}</h3>
               </div>
               
               <p className="text-sm text-purple-700/80 mb-6 leading-relaxed">
                 {t(
                   'قم بربط المتجر بقاعدة بيانات Supabase لحفظ البيانات سحابياً ومشاركتها بين الأجهزة. إذا لم تكن متصلاً، سيتم استخدام التخزين المحلي.',
                   'Connect store to Supabase DB to sync data across devices. If disconnected, local storage is used.'
                 )}
               </p>

               {!isCloudConnected ? (
                 <form onSubmit={handleConnectDB} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-purple-800 mb-2">Supabase URL</label>
                      <input
                        type="text"
                        value={dbUrl}
                        onChange={(e) => setDbUrl(e.target.value)}
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                        placeholder="https://xyz.supabase.co"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-purple-800 mb-2">Supabase Anon Key</label>
                      <input
                        type="password"
                        value={dbKey}
                        onChange={(e) => setDbKey(e.target.value)}
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                        dir="ltr"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                      <Link size={18} />
                      {t('ربط قاعدة البيانات', 'Connect Database')}
                    </button>
                 </form>
               ) : (
                 <div className="bg-white/50 p-4 rounded-xl border border-purple-200 text-center">
                    <CloudLightning className="mx-auto text-purple-600 mb-2" size={32} />
                    <p className="font-bold text-purple-900 mb-4">{t('متصل بنجاح بالسحابة', 'Connected to Cloud Successfully')}</p>
                    <button
                      onClick={handleDisconnectDB}
                      className="text-red-500 text-sm font-bold underline hover:text-red-700"
                    >
                      {t('قطع الاتصال والعودة للمحلي', 'Disconnect & Revert to Local')}
                    </button>
                 </div>
               )}
            </div>

            {/* Reset Data Section */}
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">
                    <RefreshCw size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-red-900">{t('إعادة ضبط المصنع', 'Factory Reset')}</h3>
               </div>
               <p className="text-sm text-red-700/80 mb-6 leading-relaxed">
                 {t(
                   'تحذير: هذا الإجراء سيقوم بمسح جميع البيانات (المنتجات، الطلبات، الإعدادات) المخزنة على هذا الجهاز والعودة إلى الحالة الأصلية. استخدمه فقط في حالة وجود مشاكل.',
                   'Warning: This action will erase all data (products, orders, settings) stored on this device and revert to the original state. Use only if experiencing issues.'
                 )}
               </p>
               <button
                 onClick={onResetData}
                 className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2"
               >
                 <Trash2 size={18} />
                 {t('حذف البيانات واستعادة الموقع', 'Reset Data & Restore Site')}
               </button>
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-10 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-black text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{t('حالة الطلب', 'Order Status')}</h3>
                <p className="text-xs text-gray-400">#{selectedOrderForEdit.id}</p>
              </div>
              <button onClick={() => setSelectedOrderForEdit(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-3">
              {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onUpdateOrderStatus(selectedOrderForEdit.id, status);
                    setSelectedOrderForEdit(prev => prev ? { ...prev, status } : null);
                  }}
                  className={`w-full flex items-center justify-between p-4 mb-2 rounded-2xl transition-all ${
                    selectedOrderForEdit.status === status 
                      ? 'bg-gray-100 font-bold border-2 border-emerald-500 text-emerald-800' 
                      : 'hover:bg-gray-50 border-2 border-transparent text-gray-600'
                  }`}
                >
                  <span>{getStatusLabel(status)}</span>
                  {selectedOrderForEdit.status === status && (
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
               <button 
                 onClick={() => handlePrintOrder(selectedOrderForEdit)}
                 className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
               >
                 <Printer size={18} />
                 <span>{t('طباعة / حفظ', 'Print / Save')}</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};