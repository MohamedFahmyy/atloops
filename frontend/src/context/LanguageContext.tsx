import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '../types';

interface LanguageContextType {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    'brand.name': 'AT Loops',
    'brand.tagline': 'Technology Without Mazes',
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.solutions': 'Software Solutions',
    'nav.portfolio': 'Portfolio & Cases',
    'nav.about': 'About Us',
    'nav.industries': 'Industries',
    'nav.blog': 'Insights & Blog',
    'nav.contact': 'Contact Us',
    'nav.admin': 'Admin Portal',
    'cta.consultation': 'Request Consultation',
    'cta.quote': 'Request a Quote',
    'cta.explore_solutions': 'Explore Solutions',
    'cta.view_all_services': 'View All Services',
    'cta.view_case_study': 'View Case Study',
    'cta.learn_more': 'Learn More',
    'cta.send_message': 'Submit Inquiry',
    'cta.whatsapp': 'Chat On WhatsApp',
    'footer.company': 'Company',
    'footer.services': 'Key Services',
    'footer.solutions': 'Software Solutions',
    'footer.contact_info': 'Contact & Location',
    'footer.rights': 'All Rights Reserved. AT Loops Technology Solutions.',
    'footer.address': '72 Arab League Street - Agouza - Giza, Egypt',
    'footer.phone': '+201211170979',
    'footer.email': 'contact@atloops.com',
  },
  ar: {
    'brand.name': 'ات لوبس',
    'brand.tagline': 'تكنولوجيا بدون متاهات',
    'nav.home': 'الرئيسية',
    'nav.services': 'خدماتنا',
    'nav.solutions': 'الحلول والبرمجيات',
    'nav.portfolio': 'سابقة الأعمال',
    'nav.about': 'عن ات لوبس',
    'nav.industries': 'القطاعات',
    'nav.blog': 'المقالات والأخبار',
    'nav.contact': 'تواصل معنا',
    'nav.admin': 'لوحة الإدارة',
    'cta.consultation': 'اطلب استشارة مجانية',
    'cta.quote': 'طلب عرض أسعار',
    'cta.explore_solutions': 'استكشف الحلول البرمجية',
    'cta.view_all_services': 'جميع الخدمات التقنية',
    'cta.view_case_study': 'تفاصيل المشروع',
    'cta.learn_more': 'المزيد من التفاصيل',
    'cta.send_message': 'إرسال طلب الاستشارة',
    'cta.whatsapp': 'تواصل عبر واتساب',
    'footer.company': 'عن الشركة',
    'footer.services': 'أبرز الخدمات',
    'footer.solutions': 'الحلول البرمجية',
    'footer.contact_info': 'معلومات التواصل والمقر',
    'footer.rights': 'جميع الحقوق محفوظة. شركة ات لوبس للحلول البرمجية والتحول الرقمي.',
    'footer.address': '٧٢ شارع جامعة الدول العربية - العجوزة - الجيزة، مصر',
    'footer.phone': '+201211170979',
    'footer.email': 'contact@atloops.com',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('atloops_locale') as Locale;
    return saved === 'ar' || saved === 'en' ? saved : 'ar'; // Default Arabic as primary market
  });

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('atloops_locale', locale);
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const toggleLocale = () => {
    setLocaleState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string, defaultText?: string): string => {
    return translations[locale]?.[key] ?? defaultText ?? key;
  };

  return (
    <LanguageContext.Provider value={{ locale, dir, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
