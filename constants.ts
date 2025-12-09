import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "تيشيرت قطن كلاسيك أبيض",
    price: 120,
    category: "رجال",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "تيشيرت قطني ناعم وعالي الجودة مناسب للاستخدام اليومي، قصة مريحة وعصرية.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "فستان صيفي مزهر",
    price: 299,
    discountPrice: 249,
    category: "نساء",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "فستان أنيق بتصميم عصري وألوان زاهية، مثالي للأجواء الصيفية والمناسبات.",
    sizes: ["S", "M", "L"]
  },
  {
    id: 3,
    name: "حذاء رياضي مريح",
    price: 450,
    category: "أحذية",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "حذاء رياضي بتصميم انسيابي يوفر راحة قصوى للقدمين أثناء المشي والجري.",
    sizes: ["40", "41", "42", "43", "44"]
  },
  {
    id: 4,
    name: "جاكيت جينز عصري",
    price: 320,
    category: "رجال",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "جاكيت جينز كلاسيكي يناسب جميع الإطلالات، خامة متينة وعملية.",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 5,
    name: "حقيبة جلدية فاخرة",
    price: 550,
    discountPrice: 480,
    category: "اكسسوارات",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "حقيبة يد جلدية بتصميم راقي، مساحة واسعة وتفاصيل دقيقة.",
    sizes: []
  },
  {
    id: 6,
    name: "طقم ملابس أطفال",
    price: 180,
    category: "أطفال",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "طقم مريح وأنيق للأطفال، خامات ناعمة وآمنة على البشرة.",
    sizes: ["2-3Y", "4-5Y", "6-7Y"]
  }
];

export const APP_CURRENCY = "د.م";