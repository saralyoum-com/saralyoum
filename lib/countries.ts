export interface Country {
  code: string;
  slug: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  city: string;
  currency: string;
  currencyAr: string;
  currencyEn: string;
  currencySymbol: string;
  currencyFallback: number;
  keywords: string[];
}

export const COUNTRIES: Country[] = [
  { code:"sa", slug:"سعر-الذهب-السعودية",  flag:"🇸🇦", nameAr:"السعودية",  nameEn:"Saudi Arabia", city:"الرياض",   currency:"SAR", currencyAr:"ريال سعودي",    currencyEn:"Saudi Riyal",       currencySymbol:"ر.س",  currencyFallback:3.75,   keywords:["سعر الذهب في السعودية","سعر الذهب اليوم بالريال","عيار 21 بالريال"] },
  { code:"ae", slug:"سعر-الذهب-الامارات",  flag:"🇦🇪", nameAr:"الإمارات",  nameEn:"UAE",          city:"دبي",      currency:"AED", currencyAr:"درهم إماراتي",  currencyEn:"UAE Dirham",        currencySymbol:"د.إ",  currencyFallback:3.6725, keywords:["سعر الذهب في الامارات","سعر الذهب اليوم بالدرهم","عيار 21 دبي"] },
  { code:"kw", slug:"سعر-الذهب-الكويت",   flag:"🇰🇼", nameAr:"الكويت",    nameEn:"Kuwait",       city:"الكويت",   currency:"KWD", currencyAr:"دينار كويتي",   currencyEn:"Kuwaiti Dinar",     currencySymbol:"د.ك",  currencyFallback:0.3075, keywords:["سعر الذهب في الكويت","سعر الذهب بالدينار الكويتي"] },
  { code:"qa", slug:"سعر-الذهب-قطر",      flag:"🇶🇦", nameAr:"قطر",       nameEn:"Qatar",        city:"الدوحة",   currency:"QAR", currencyAr:"ريال قطري",     currencyEn:"Qatari Riyal",      currencySymbol:"ر.ق",  currencyFallback:3.64,   keywords:["سعر الذهب في قطر","سعر الذهب بالريال القطري"] },
  { code:"bh", slug:"سعر-الذهب-البحرين",  flag:"🇧🇭", nameAr:"البحرين",   nameEn:"Bahrain",      city:"المنامة",  currency:"BHD", currencyAr:"دينار بحريني",  currencyEn:"Bahraini Dinar",    currencySymbol:"د.ب",  currencyFallback:0.377,  keywords:["سعر الذهب في البحرين","سعر الذهب بالدينار البحريني"] },
  { code:"om", slug:"سعر-الذهب-عمان",     flag:"🇴🇲", nameAr:"عُمان",     nameEn:"Oman",         city:"مسقط",     currency:"OMR", currencyAr:"ريال عُماني",   currencyEn:"Omani Rial",        currencySymbol:"ر.ع",  currencyFallback:0.385,  keywords:["سعر الذهب في عمان","سعر الذهب بالريال العماني"] },
  { code:"eg", slug:"سعر-الذهب-مصر",      flag:"🇪🇬", nameAr:"مصر",       nameEn:"Egypt",        city:"القاهرة",  currency:"EGP", currencyAr:"جنيه مصري",     currencyEn:"Egyptian Pound",    currencySymbol:"ج.م",  currencyFallback:54.41,  keywords:["سعر الذهب في مصر","سعر الذهب بالجنيه المصري"] },
  { code:"jo", slug:"سعر-الذهب-الاردن",   flag:"🇯🇴", nameAr:"الأردن",    nameEn:"Jordan",       city:"عمّان",    currency:"JOD", currencyAr:"دينار أردني",   currencyEn:"Jordanian Dinar",   currencySymbol:"د.أ",  currencyFallback:0.709,  keywords:["سعر الذهب في الأردن","سعر الذهب بالدينار الأردني"] },
  { code:"ma", slug:"سعر-الذهب-المغرب",   flag:"🇲🇦", nameAr:"المغرب",    nameEn:"Morocco",      city:"الرباط",   currency:"MAD", currencyAr:"درهم مغربي",    currencyEn:"Moroccan Dirham",   currencySymbol:"د.م",  currencyFallback:10.05,  keywords:["سعر الذهب في المغرب","سعر الذهب بالدرهم المغربي"] },
  { code:"iq", slug:"سعر-الذهب-العراق",   flag:"🇮🇶", nameAr:"العراق",    nameEn:"Iraq",         city:"بغداد",    currency:"IQD", currencyAr:"دينار عراقي",   currencyEn:"Iraqi Dinar",       currencySymbol:"ع.د",  currencyFallback:1310,   keywords:["سعر الذهب في العراق","سعر الذهب بالدينار العراقي"] },
  { code:"ly", slug:"سعر-الذهب-ليبيا",    flag:"🇱🇾", nameAr:"ليبيا",     nameEn:"Libya",        city:"طرابلس",   currency:"LYD", currencyAr:"دينار ليبي",    currencyEn:"Libyan Dinar",      currencySymbol:"د.ل",  currencyFallback:4.85,   keywords:["سعر الذهب في ليبيا","سعر الذهب بالدينار الليبي"] },
  { code:"tn", slug:"سعر-الذهب-تونس",     flag:"🇹🇳", nameAr:"تونس",      nameEn:"Tunisia",      city:"تونس",     currency:"TND", currencyAr:"دينار تونسي",   currencyEn:"Tunisian Dinar",    currencySymbol:"د.ت",  currencyFallback:3.12,   keywords:["سعر الذهب في تونس","سعر الذهب بالدينار التونسي"] },
  { code:"dz", slug:"سعر-الذهب-الجزائر",  flag:"🇩🇿", nameAr:"الجزائر",   nameEn:"Algeria",      city:"الجزائر",  currency:"DZD", currencyAr:"دينار جزائري",  currencyEn:"Algerian Dinar",    currencySymbol:"د.ج",  currencyFallback:134.5,  keywords:["سعر الذهب في الجزائر","سعر الذهب بالدينار الجزائري"] },
  { code:"ye", slug:"سعر-الذهب-اليمن",    flag:"🇾🇪", nameAr:"اليمن",     nameEn:"Yemen",        city:"صنعاء",    currency:"YER", currencyAr:"ريال يمني",     currencyEn:"Yemeni Rial",       currencySymbol:"ر.ي",  currencyFallback:250,    keywords:["سعر الذهب في اليمن","سعر الذهب بالريال اليمني"] },
  { code:"sd", slug:"سعر-الذهب-السودان",  flag:"🇸🇩", nameAr:"السودان",   nameEn:"Sudan",        city:"الخرطوم",  currency:"SDG", currencyAr:"جنيه سوداني",   currencyEn:"Sudanese Pound",    currencySymbol:"ج.س",  currencyFallback:601,    keywords:["سعر الذهب في السودان","سعر الذهب بالجنيه السوداني"] },
  { code:"lb", slug:"سعر-الذهب-لبنان",    flag:"🇱🇧", nameAr:"لبنان",     nameEn:"Lebanon",      city:"بيروت",    currency:"LBP", currencyAr:"ليرة لبنانية",  currencyEn:"Lebanese Pound",    currencySymbol:"ل.ل",  currencyFallback:89500,  keywords:["سعر الذهب في لبنان","سعر الذهب بالليرة اللبنانية"] },
];

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
