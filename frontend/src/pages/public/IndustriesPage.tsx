import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Building2, ShoppingCart, HardHat, HeartPulse, 
  GraduationCap, Truck, ArrowRight, CheckCircle2 
} from 'lucide-react';

export const IndustriesPage: React.FC = () => {
  const { locale, t } = useLanguage();

  const industries = [
    {
      icon: Building2,
      titleEn: 'Manufacturing & Industrial Factories',
      titleAr: 'المصانع والمنشآت الصناعية',
      descEn: 'Connect production lines, raw materials, bill of materials (BOM), and Egyptian E-Invoicing into one unified ERP platform.',
      descAr: 'ربط خطوط الإنتاج، تكاليف خامات التصنيع، جداول التشغيل، ومطابقة الفاتورة الإلكترونية في منصة ERP متكاملة.',
      recommendedEn: 'AT Loops ERP Core Suite',
      recommendedAr: 'نظام ات لوبس ERP المتكامل',
      link: '/products/atloops-erp-core',
      pointsEn: ['Automated BOM costing', 'Real-time raw material depletion', 'Batch & expiry tracking'],
      pointsAr: ['حساب تكاليف الإنتاج والخامات تلقائياً', 'خصم فوري للمواد من المخزن مع كل أمر تصنيع', 'تتبع أرقام التشغيلات وتواريخ الصلاحية'],
    },
    {
      icon: ShoppingCart,
      titleEn: 'Retail, Supermarkets & Fast Casual',
      titleAr: 'التجزئة، السوبرماركت ومحلات الأغذية',
      descEn: 'Keep checkout lines moving with sub-second barcode scans, weight scale integration, and offline-mode cashiers.',
      descAr: 'كاشير فائق السرعة يدعم الباركود والموازين الإلكترونية ويعمل بثبات تام حتى عند انقطاع الإنترنت.',
      recommendedEn: 'Smart Inventory & POS Terminal',
      recommendedAr: 'نظام سمارت لإدارة المبيعات ونقاط البيع',
      link: '/products/smart-inventory-pos',
      pointsEn: ['Offline transaction recovery', 'Barcode scale sync', 'End-of-day blind cash drawer audit'],
      pointsAr: ['عمل أوفلاين مع مزامنة سحابية تلقائية', 'ربط مباشر بموازين الباركود للأغذية', 'جرد أعمى للدرج وإقفال وردية الكاشير'],
    },
    {
      icon: HardHat,
      titleEn: 'Contracting, Engineering & Construction',
      titleAr: 'المقاولات والتشييد والهندسة',
      descEn: 'Track job-site progress milestones, subcontractor billings, equipment hours, and material deliveries from the field.',
      descAr: 'متابعة نسب إنجاز المشاريع، مستخلصات مقاولي الباطن، ساعات عمل المعدات، ومشتريات الموقع لحظياً.',
      recommendedEn: 'Geshta Contracting ERP Solution',
      recommendedAr: 'نظام إدارة المشاريع للمقاولات',
      link: '/portfolio/geshta-contracting-erp',
      pointsEn: ['Field engineer mobile reports', 'Subcontractor invoice approvals', 'Project margin analytics'],
      pointsAr: ['تقارير يومية للمهندسين من الموقع', 'اعتماد دورة المستخلصات إلكترونياً', 'متابعة هوامش ربحية وتكاليف كل مشروع'],
    },
    {
      icon: GraduationCap,
      titleEn: 'Education, Academies & Online Schools',
      titleAr: 'التعليم والأكاديميات والمراكز التدريبية',
      descEn: 'Launch branded academies with DRM anti-recording video security, student quizzes, certificates, and Fawry/Paymob checkout.',
      descAr: 'منصات تعليمية ذكية تحمي الفيديوهات من السرقة وتسجيل الشاشة، مع اختبارات إلكترونية ودفع فوري.',
      recommendedEn: 'Academy LMS Pro Platform',
      recommendedAr: 'منصة أكاديميا للتعليم الإلكتروني',
      link: '/products/osoul-academy-lms',
      pointsEn: ['Anti-screen recording watermarks', 'Automated exam grading', 'Integrated payment gateways'],
      pointsAr: ['علامة مائية متغيرة لمنع تصوير الشاشة', 'تصحيح تلقائي وإظهار النتائج لحظياً', 'دفع إلكتروني عبر فوري وباي موب وكروت بنكية'],
    },
    {
      icon: Truck,
      titleEn: 'Logistics, Marketplaces & Delivery',
      titleAr: 'التجارة الإلكترونية والتوصيل وسلاسل الإمداد',
      descEn: 'Coordinate multiple merchants, automated commission splits, GPS courier dispatch, and real-time customer tracking.',
      descAr: 'منصات تجارية متعددة التجار مع تطبيق لكباتن التوصيل وتتبع حي عبر الخريطة مع بوابات الدفع.',
      recommendedEn: 'Souq Marketplace & Delivery Engine',
      recommendedAr: 'منصة سوق متعددة التجار والتوصيل',
      link: '/products/souq-marketplace-engine',
      pointsEn: ['Live GPS courier tracking', 'Multi-vendor digital wallets', 'Push notification alerts'],
      pointsAr: ['تتبع حي لمندوب التوصيل عبر الخرائط', 'محافظ رقمية وتقسيم أرباح التجار', 'إشعارات حية للعميل بحالة الطلب'],
    },
    {
      icon: HeartPulse,
      titleEn: 'Healthcare & Pharmaceutical Distributors',
      titleAr: 'الرعاية الصحية والمستودعات الدوائية',
      descEn: 'Manage medical supplies, therapeutic categories, pharmacy ordering channels, and cold-chain expiration logs.',
      descAr: 'إدارة سلاسل توريد الأدوية والمستلزمات الطبية، تسجيل الجرعات، وتلقي طلبيات الصيدليات والمستشفيات.',
      recommendedEn: 'Panx Pharma Healthcare Portal',
      recommendedAr: 'بوابة الرعاية الصحية وتوريد الأدوية',
      link: '/portfolio/panx-pharma-ecommerce',
      pointsEn: ['Regulatory compliance labeling', 'Direct pharmacy order portal', 'Batch expiry alerts'],
      pointsAr: ['توافق تام مع معايير هيئة الدواء', 'بوابة B2B مخصصة لطلبات الصيدليات', 'تنبيهات الأصناف قريبة انتهاء الصلاحية'],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'القطاعات التخصصية' : 'Industry Expertise'}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
            {locale === 'ar' ? 'حلول تقنية مفصلة لمتطلبات قطاعك الفريد' : 'Tailored Solutions for Specialized Enterprise Sectors'}
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {locale === 'ar'
              ? 'كل صناعة لها دورتها المستندية وتحدياتها الخاصة. نحن نبني حلولاً تفهم لغة عملك وتلائم متطلباتك اليومية.'
              : 'Generic software fails because every sector has unique constraints. We build systems that speak your industry language.'}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {locale === 'ar' ? ind.titleAr : ind.titleEn}
                  </h3>

                  <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
                    {locale === 'ar' ? ind.descAr : ind.descEn}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                    {((locale === 'ar' ? ind.pointsAr : ind.pointsEn)).map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={ind.link}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <span>{locale === 'ar' ? 'عرض النظام المقترح' : 'View Recommended System'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-slate-900 text-white rounded-3xl p-10 border border-slate-800 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            {locale === 'ar' ? 'هل تعمل في قطاع صناعي أو تجاري آخر؟' : 'Operating in Another Specialized Vertical?'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {locale === 'ar'
              ? 'تواصل معنا وسيقوم مهندسونا بتصميم نظام برمجي مخصص بالكامل ليلبي تفاصيل عملك.'
              : 'Our custom software engineering services can accommodate any custom business workflow.'}
          </p>
          <div className="mt-6">
            <Link
              to="/request-quote"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg"
            >
              {t('cta.quote')}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
