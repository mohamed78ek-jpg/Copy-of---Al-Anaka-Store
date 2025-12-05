import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "قميص كتان كلاسيكي",
    price: 240,
    discountPrice: 180,
    category: "رجال",
    image: "https://picsum.photos/400/500?random=1",
    description: "قميص مصنوع من الكتان الطبيعي، مثالي للأجواء الصيفية، يتميز بتصميم مريح وعصري.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 4,
    name: "بنطال تشينو بيج",
    price: 150,
    category: "رجال",
    image: "https://picsum.photos/400/500?random=4",
    description: "بنطال قماش مريح وعملي، مناسب للعمل والمناسبات غير الرسمية.",
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: 5,
    name: "طقم رياضي للأطفال",
    price: 120,
    category: "أطفال",
    image: "https://picsum.photos/400/500?random=5",
    description: "طقم رياضي قطني مريح للأطفال، متوفر بألوان زاهية وجذابة.",
    sizes: ["4-5Y", "6-7Y", "8-9Y"]
  },
  {
    id: 6,
    name: "حذاء رياضي مريح",
    price: 399,
    discountPrice: 299,
    category: "أحذية",
    image: "https://picsum.photos/400/500?random=6",
    description: "حذاء رياضي بتصميم انسيابي يوفر راحة قصوى للقدمين أثناء المشي لفترات طويلة.",
    sizes: ["40", "41", "42", "43", "44", "45"]
  },
  {
    id: 7,
    name: "وشاح شتوي صوف",
    price: 85,
    category: "اكسسوارات",
    image: "https://picsum.photos/400/500?random=7",
    description: "وشاح ناعم ودافئ لفصل الشتاء، يضفي لمسة أناقة على معطفك."
  },
  {
    id: 8,
    name: "نظارة شمسية كلاسيكية",
    price: 190,
    category: "اكسسوارات",
    image: "https://picsum.photos/400/500?random=8",
    description: "نظارة شمسية بإطار معدني ذهبي وعدسات واقية من الأشعة فوق البنفسجية."
  }
];

export const APP_CURRENCY = "د.م";