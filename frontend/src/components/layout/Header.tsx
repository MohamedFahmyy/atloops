import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Menu, X, ChevronDown, Phone, ArrowRight, ShieldCheck, 
  Layers, ShoppingCart, UserCheck, Globe, Cloud, Code2, 
  Sparkles, ExternalLink 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { locale, dir, toggleLocale, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setSolutionsDropdown(false);
  }, [location.pathname]);

  const quickServices = [
    { slug: 'custom-software-development', icon: Code2, titleEn: 'Custom Software Development', titleAr: 'تطوير البرمجيات المخصصة', descEn: 'Bespoke systems built for your exact operational logic', descAr: 'أنظمة مفصلة على دورات عمل شركتك' },
    { slug: 'erp-systems', icon: Layers, titleEn: 'Enterprise ERP Systems', titleAr: 'أنظمة تخطيط الموارد ERP', descEn: 'Accounting, supply chain & Egyptian E-Invoicing', descAr: 'ربط الحسابات والمخازن مع الفاتورة الإلكترونية' },
    { slug: 'pos-systems', icon: ShoppingCart, titleEn: 'Cloud POS & Retail Systems', titleAr: 'أنظمة نقاط البيع POS', descEn: 'Offline-ready counters for supermarkets & shops', descAr: 'كاشير ومبيعات سريعة تدعم العمل بدون إنترنت' },
    { slug: 'crm-workflow-automation', icon: UserCheck, titleEn: 'CRM & Workflow Automation', titleAr: 'إدارة علاقات العملاء CRM', descEn: 'Convert leads & automate sales follow-ups', descAr: 'متابعة العملاء وأتمتة مسارات فريق المبيعات' },
    { slug: 'web-development', icon: Globe, titleEn: 'Web Applications & Portals', titleAr: 'المواقع والمنصات التفاعلية', descEn: 'High-speed, SEO-dominated enterprise portals', descAr: 'بوابات رقمية فائقة السرعة ومتوافقة مع محركات البحث' },
    { slug: 'cloud-infrastructure', icon: Cloud, titleEn: 'Cloud Infrastructure & Managed IT', titleAr: 'البنية التحتية السحابية والدعم', descEn: 'Hardened servers, 24/7 uptime & daily backups', descAr: 'سيرفرات آمنة مع نسخ احتياطي ومراقبة 24/7' },
  ];

  const quickSolutions = [
    { slug: 'atloops-erp-core', nameEn: 'AT Loops ERP Core', nameAr: 'نظام ات لوبس ERP', badge: 'Enterprise', price: '$1,499' },
    { slug: 'smart-inventory-pos', nameEn: 'Smart Inventory & POS', nameAr: 'نظام سمارت للمبيعات', badge: 'Best Seller', price: '$599' },
    { slug: 'osoul-academy-lms', nameEn: 'Academy LMS Pro', nameAr: 'منصة أكاديميا LMS', badge: 'Verified', price: '$899' },
    { slug: 'souq-marketplace-engine', nameEn: 'Souq Multi-Vendor App', nameAr: 'منصة سوق متعددة التجار', badge: 'Popular', price: '$1,299' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100' : 'bg-white border-b border-slate-100'}`}>
      {/* Top Bar for Phone, Verified Trust & Language Toggle */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'تكنولوجيا بدون متاهات — شريكك التقني المعتمد' : 'Technology Without Mazes — Certified Enterprise Partner'}</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <a href="tel:+201211170979" className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors" dir="ltr">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+20 121 117 0979</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/contact-us" className="hover:text-white transition-colors hidden sm:inline-block">
              {locale === 'ar' ? 'طلب استشارة' : 'Free Consultation'}
            </Link>
            <span className="text-slate-600">|</span>
            <button
              onClick={toggleLocale}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{locale === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
            </button>
            <Link to="/admin" className="text-slate-400 hover:text-blue-300 text-[11px] underline">
              {t('nav.admin')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo.png" alt="AT Loops" className="h-11 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>AT LOOPS</span>
                <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  {locale === 'ar' ? 'ات لوبس' : 'Enterprise'}
                </span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wider">
                {t('brand.tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
            <Link to="/" className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors">
              {t('nav.home')}
            </Link>

            {/* Services Dropdown Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button 
                onClick={() => setServicesDropdown(!servicesDropdown)}
                className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <span>{t('nav.services')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdown ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {servicesDropdown && (
                <div className="absolute top-full -left-20 w-[680px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{locale === 'ar' ? 'الخدمات التقنية المتكاملة' : 'Enterprise Technology Services'}</h4>
                      <p className="text-xs text-slate-500">{locale === 'ar' ? 'حلول مصممة خصيصاً لتطوير أعمالك وكفاءة إدارتك' : 'Engineered to accelerate operational efficiency'}</p>
                    </div>
                    <Link to="/services" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                      <span>{t('cta.view_all_services')}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {quickServices.map((srv) => {
                      const IconComponent = srv.icon;
                      return (
                        <Link
                          key={srv.slug}
                          to={`/services/${srv.slug}`}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-blue-100/70 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                              {locale === 'ar' ? srv.titleAr : srv.titleEn}
                            </h5>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {locale === 'ar' ? srv.descAr : srv.descEn}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Software Solutions Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setSolutionsDropdown(true)}
              onMouseLeave={() => setSolutionsDropdown(false)}
            >
              <button 
                onClick={() => setSolutionsDropdown(!solutionsDropdown)}
                className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <span>{t('nav.solutions')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${solutionsDropdown ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </button>

              {solutionsDropdown && (
                <div className="absolute top-full -left-10 w-[580px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{locale === 'ar' ? 'الحلول البرمجية الجاهزة' : 'Deployable Software Platforms'}</h4>
                      <p className="text-xs text-slate-500">{locale === 'ar' ? 'أنظمة معتمدة وجاهزة للتشغيل الفوري في شركتك' : 'Battle-tested software ready for fast deployment'}</p>
                    </div>
                    <Link to="/solutions" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                      <span>{locale === 'ar' ? 'عرض الكتالوج' : 'Browse Catalog'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {quickSolutions.map((sol) => (
                      <Link
                        key={sol.slug}
                        to={`/solutions/${sol.slug}`}
                        className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            {sol.badge}
                          </span>
                          <span className="text-xs font-extrabold text-blue-600">
                            {sol.price}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs group-hover:text-blue-600">
                          {locale === 'ar' ? sol.nameAr : sol.nameEn}
                        </h5>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/portfolio" className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors">
              {t('nav.portfolio')}
            </Link>

            <Link to="/industries" className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors">
              {t('nav.industries')}
            </Link>

            <Link to="/about" className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors">
              {t('nav.about')}
            </Link>

            <Link to="/blog" className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors">
              {t('nav.blog')}
            </Link>

            <Link to="/contact" className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors">
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{t('cta.quote')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid gap-1">
            <Link to="/" className="px-3 py-2 rounded-lg font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600">
              {t('nav.home')}
            </Link>
            <Link to="/services" className="px-3 py-2 rounded-lg font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600">
              {t('nav.services')}
            </Link>
            <Link to="/solutions" className="px-3 py-2 rounded-lg font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600">
              {t('nav.solutions')}
            </Link>
            <Link to="/portfolio" className="px-3 py-2 rounded-lg font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600">
              {t('nav.portfolio')}
            </Link>
            <Link to="/industries" className="px-3 py-2 rounded-lg font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600">
              {t('nav.industries')}
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-lg font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600">
              {t('nav.about')}
            </Link>
            <Link to="/blog" className="px-3 py-2 rounded-lg font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600">
              {t('nav.blog')}
            </Link>
            <Link to="/contact" className="px-3 py-2 rounded-lg font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600">
              {t('nav.contact')}
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/quote"
              className="w-full text-center bg-blue-600 text-white font-bold text-sm py-3 rounded-xl shadow-md"
            >
              {t('cta.quote')}
            </Link>
            <Link
              to="/consultation"
              className="w-full text-center border border-slate-200 text-slate-800 font-bold text-sm py-3 rounded-xl hover:bg-slate-50"
            >
              {t('cta.consultation')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
