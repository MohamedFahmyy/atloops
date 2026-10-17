import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Phone, Mail, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { locale, t } = useLanguage();

  const services = [
    { slug: 'custom-software-development', titleEn: 'Custom Software Development', titleAr: 'تطوير البرمجيات المخصصة' },
    { slug: 'erp-systems', titleEn: 'Enterprise ERP Systems', titleAr: 'أنظمة تخطيط الموارد ERP' },
    { slug: 'pos-systems', titleEn: 'Cloud POS & Retail Systems', titleAr: 'أنظمة نقاط البيع POS' },
    { slug: 'crm-workflow-automation', titleEn: 'CRM & Workflow Automation', titleAr: 'إدارة علاقات العملاء CRM' },
    { slug: 'web-development', titleEn: 'Web Applications & Portals', titleAr: 'تصميم وتطوير المواقع' },
    { slug: 'cloud-infrastructure', titleEn: 'Cloud Infrastructure & Managed IT', titleAr: 'البنية التحتية السحابية والدعم' },
  ];

  const solutions = [
    { slug: 'atloops-erp-core', nameEn: 'AT Loops ERP Core', nameAr: 'نظام ات لوبس ERP المتكامل' },
    { slug: 'smart-inventory-pos', nameEn: 'Smart Inventory & POS', nameAr: 'نظام سمارت لإدارة المبيعات' },
    { slug: 'osoul-academy-lms', nameEn: 'Academy LMS Platform', nameAr: 'منصة أكاديميا للتعليم الإلكتروني' },
    { slug: 'souq-marketplace-engine', nameEn: 'Souq Delivery & Marketplace', nameAr: 'تطبيقات التجارة والتوصيل' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="AT Loops" className="h-10 w-auto object-contain bg-white/10 p-1 rounded-lg" />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  AT LOOPS
                </span>
                <span className="text-xs text-blue-400 font-semibold">
                  {t('brand.tagline')}
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              {locale === 'ar'
                ? 'شركة ات لوبس للبرمجيات والتحول الرقمي. شريكك التقني المتكامل لتطوير الأنظمة الإدارية والمحاسبية، المنصات الرقمية، والدعم الفني الشامل للشركات والمصانع في مصر والخليج.'
                : 'AT Loops is your trusted enterprise technology partner. We engineer bespoke ERP, POS, web platforms, and secure cloud environments that transform business operations.'}
            </p>

            {/* Quality Commitment Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{locale === 'ar' ? 'معتمد للفاتورة الإلكترونية' : 'ETA E-Invoicing Ready'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-full">
                <Shield className="w-3.5 h-3.5" />
                <span>{locale === 'ar' ? 'عقود دعم فني SLA' : 'Enterprise SLA Guarantee'}</span>
              </span>
            </div>
          </div>

          {/* Key Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t('footer.services')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="hover:text-blue-400 transition-colors">
                    {locale === 'ar' ? s.titleAr : s.titleEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Software Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t('footer.solutions')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {solutions.map((sol) => (
                <li key={sol.slug}>
                  <Link to={`/products/${sol.slug}`} className="hover:text-blue-400 transition-colors">
                    {locale === 'ar' ? sol.nameAr : sol.nameEn}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/products" className="text-blue-400 hover:underline font-bold inline-flex items-center gap-1">
                  <span>{locale === 'ar' ? 'عرض جميع الحلول' : 'View Full Catalog'}</span>
                  <ArrowRight className="w-3 h-3 rtl-flip" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Office */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t('footer.contact_info')}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{t('footer.address')}</span>
              </div>
              <div className="flex items-center gap-2.5" dir="ltr">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+201112194828" className="hover:text-white transition-colors">
                  +20 111 219 4828
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:contact@atloops.com" className="hover:text-white transition-colors">
                  contact@atloops.com
                </a>
              </div>
              <div className="pt-2">
                <Link
                  to="/consultation"
                  className="inline-block bg-slate-900 border border-slate-700 hover:border-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
                >
                  {t('cta.consultation')}
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Rights & Policy Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {t('footer.rights')}</p>

          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">
              {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <Link to="/terms-conditions" className="hover:text-slate-300 transition-colors">
              {locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </Link>
            <Link to="/faqs" className="hover:text-slate-300 transition-colors">
              {locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}
            </Link>
            <Link to="/admin" className="hover:text-blue-400 transition-colors font-semibold">
              {t('nav.admin')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
