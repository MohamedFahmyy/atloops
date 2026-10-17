import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Service, Product, PortfolioProject, Testimonial, Faq } from '../../types';
import { 
  ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, 
  Layers, ShoppingCart, UserCheck, Globe, Cloud, Code2, 
  Star, MessageSquare, Sparkles, Building2, Server, Award,
  Check, Play, HelpCircle
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { locale, dir, t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getServices({ featured: true }),
      api.getProducts({ featured: true }),
      api.getPortfolio({ featured: true }),
      api.getTestimonials(),
      api.getFaqs(),
    ])
      .then(([srvs, prods, ports, testis, faqList]) => {
        setServices(srvs);
        setProducts(prods);
        setProjects(ports);
        setTestimonials(testis);
        setFaqs(faqList);
      })
      .catch((err) => console.error('Error loading homepage data', err))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { num: '100+', numAr: '+١٠٠', labelEn: 'Enterprise Deployments', labelAr: 'أنظمة ومشاريع منفذة' },
    { num: '99.9%', numAr: '٩٩.٩٪', labelEn: 'System Uptime SLA', labelAr: 'جاهزية واستقرار الخوادم' },
    { num: '3+ Yrs', numAr: '+٣ سنوات', labelEn: 'Average Client Retention', labelAr: 'متوسط استمرارية شراكة العملاء' },
    { num: '24/7', numAr: '٢٤/٧', labelEn: 'Dedicated Technical Support', labelAr: 'دعم فني واستجابة مباشرة' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-24 pb-28">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-700/60 rounded-full px-4 py-1.5 text-xs font-bold text-blue-300 mb-8 backdrop-blur-md shadow-lg shadow-blue-950/40">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{locale === 'ar' ? 'ات لوبس.. تكنولوجيا بدون متاهات' : 'AT Loops: Technology Without Mazes'}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            {locale === 'ar' ? (
              <>
                شريكك التقني المتكامل في <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">تطوير البرمجيات</span> والتحول الرقمي
              </>
            ) : (
              <>
                Empowering Enterprise Growth With <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Bespoke Software</span> & Cloud Infrastructure
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {locale === 'ar'
              ? 'نُدير لك التكنولوجيا لتتفرغ لنمو أعمالك. تصميم وبرمجة أنظمة ERP، نقاط البيع POS، المنصات الإلكترونية، والبنية التحتية المتكاملة للشركات والمصانع.'
              : 'We architect mission-critical ERPs, high-throughput retail POS, custom platforms, and 24/7 cloud support designed specifically around your operational DNA.'}
          </p>

          {/* Primary CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/request-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <span>{t('cta.quote')}</span>
              <ArrowRight className="w-4 h-4 rtl-flip" />
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all"
            >
              <span>{t('cta.explore_solutions')}</span>
            </Link>
          </div>

          {/* Verified Badges */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{locale === 'ar' ? 'فواتير إلكترونية معتمدة' : 'ETA E-Invoicing Compliant'}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>{locale === 'ar' ? 'ملكية الكود البرمجي كاملة' : '100% Code Ownership'}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>{locale === 'ar' ? 'عقود دعم فني SLA' : 'Guaranteed 99.9% Uptime'}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{locale === 'ar' ? 'مقر رسمي بالجيزة' : 'Regional HQ in Giza'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS COUNTER STRIP */}
      <section className="bg-slate-900 border-y border-slate-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((st, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight">
                  {locale === 'ar' ? st.numAr : st.num}
                </span>
                <span className="mt-1 text-xs text-slate-400 font-medium">
                  {locale === 'ar' ? st.labelAr : st.labelEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION: "نحن دليلك داخل متاهة التكنولوجيا" */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                {locale === 'ar' ? 'فلسفة العمل' : 'Our Engineering Philosophy'}
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {locale === 'ar' 
                  ? 'نحن دليلك داخل متاهة التكنولوجيا.. نحول التعقيد إلى حلول مبسطة'
                  : 'Your Trusted Guide Inside The Tech Maze — Simplifying Complexity'}
              </h2>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {locale === 'ar'
                  ? 'في عالم مليء بالتحديات التقنية السريعة، قد تبدو التكنولوجيا للبعض كمتاهة معقدة. من هنا انطلقت ات لوبس (At Loops). نحن لسنا مجرد شركة برمجيات تبيع قوالب، بل نحن شريكك التقني داخل هذه المتاهة. نتواجد حيث تتعقد الأمور لنقدم لك الحلول التقنية المبتكرة والدعم الفني الشامل.'
                  : 'Technology without guidance can easily feel like a labyrinth. At Loops was founded on a simple promise: to eliminate ambiguity and serve as your technology guide. We step in precisely where systems become complex, engineering high-leverage digital solutions that empower your business to operate without friction.'}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {locale === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {locale === 'ar'
                        ? 'أن نكون الشريك التقني الأول للشركات والمصانع، والوجهة الموثوقة التي تحول التحديات التكنولوجية المعقدة إلى حلول رقمية بسيطة وفعالة.'
                        : 'To be the premier enterprise technology partner, transforming operational hurdles into sustainable, elegant digital systems.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {locale === 'ar' ? 'رسالتنا' : 'Our Mission'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {locale === 'ar'
                        ? 'تمكين المؤسسات من مختلف الأحجام من تحقيق التحول الرقمي الكامل من خلال توفير برمجيات مخصصة ودعم فني متكامل يضمن استمرارية الأعمال بأعلى كفاءة.'
                        : 'Enabling organizations to achieve seamless digital transformation with bespoke software architectures and round-the-clock infrastructure stability.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800"
                >
                  <span>{locale === 'ar' ? 'تعرف على قصة ات لوبس وفريق العمل' : 'Learn more about AT Loops'}</span>
                  <ArrowRight className="w-4 h-4 rtl-flip" />
                </Link>
              </div>
            </div>

            {/* Visual Box */}
            <div className="relative">
              <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full"></div>
                
                <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center justify-between">
                  <span>{locale === 'ar' ? 'مزايا العمل مع ات لوبس' : 'The AT Loops Advantage'}</span>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full font-semibold">
                    {locale === 'ar' ? 'معايير مؤسسية' : 'Enterprise Level'}
                  </span>
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-blue-300">
                        {locale === 'ar' ? 'استشارات وتحليل متطلبات دقيق' : 'Deep Requirements Analysis'}
                      </span>
                      <span className="text-xs text-slate-400">Step 1</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {locale === 'ar' ? 'دراسة دورة عمل المصنع أو الشركة وتقديم مقترح هندسي متكامل SOW قبل كتابة سطر كود واحد.' : 'We study your actual business processes to deliver a watertight technical specification.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-cyan-300">
                        {locale === 'ar' ? 'تطوير بأحدث التقنيات السحابية' : 'Cloud Native Architecture'}
                      </span>
                      <span className="text-xs text-slate-400">Step 2</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {locale === 'ar' ? 'بناء أنظمة سريعة وقواعد بيانات موزعة تتحمل ضغط العمل وملايين العمليات اليومية.' : 'High-concurrency backends resilient to peak operational loads.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-emerald-300">
                        {locale === 'ar' ? 'دعم فني وصيانة مستمرة SLA' : '24/7 Managed IT Support'}
                      </span>
                      <span className="text-xs text-slate-400">Step 3</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {locale === 'ar' ? 'متابعة دورية، نسخ احتياطي يومي، وتواجد هندسي لضمان استمرارية عملك بدون توقف.' : 'Daily automated snapshots, hardware maintenance, and emergency response.'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                  <Link
                    to="/book-consultation"
                    className="inline-block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-lg"
                  >
                    {t('cta.consultation')}
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SOFTWARE SOLUTIONS CATALOG PREVIEW */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
                {locale === 'ar' ? 'الكتالوج البرمجي' : 'Software Solutions'}
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
                {locale === 'ar' ? 'حلول برمجية جاهزة للتطبيق والتشغيل الفوري' : 'Proven Software Platforms Ready for Deployment'}
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl">
                {locale === 'ar' 
                  ? 'اختر من بين أنظمتنا المعتمدة لقطاعات التجارة، المصانع، التعليم، والخدمات مع إمكانية التخصيص الكامل.'
                  : 'Pre-engineered, tested software suites ready to integrate into your enterprise.'}
              </p>
            </div>

            <Link
              to="/products"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>{locale === 'ar' ? 'عرض جميع المنتجات (٤ حلول)' : 'View All 4 Solutions'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div
                key={prod.slug}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {prod.badge || 'Enterprise'}
                    </span>
                    <span className="text-xs font-extrabold text-blue-600">
                      {prod.price ? `$${prod.price}` : 'Quote'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {locale === 'ar' ? prod.name_ar : prod.name_en}
                  </h3>
                  
                  <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {locale === 'ar' ? prod.short_desc_ar : prod.short_desc_en}
                  </p>

                  {/* Features List */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                    {((locale === 'ar' ? prod.features_ar : prod.features_en) || []).slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3">
                  <Link
                    to={`/products/${prod.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-700 font-bold text-xs py-2.5 rounded-xl border border-slate-200 group-hover:border-transparent transition-all"
                  >
                    <span>{t('cta.learn_more')}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. SERVICES OVERVIEW GRID (18 Specialized Services) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              {locale === 'ar' ? 'خدماتنا المتخصصة' : 'Our Comprehensive Services'}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {locale === 'ar' ? 'حلول تقنية شاملة تغطي كافة متطلبات التحول الرقمي' : 'End-to-End Capabilities from Hardware to Bespoke Code'}
            </h2>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              {locale === 'ar'
                ? 'لا نكتفي بالبرمجة فقط، بل نتولى تجهيز السيرفرات، توريد أجهزة البنية التحتية، وتأمين المنشآت بكاميرات المراقبة وأجهزة البصمة.'
                : 'From custom ERP and web design to cloud hardening, surveillance systems, and managed IT support.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <Link
                key={srv.slug}
                to={`/services/${srv.slug}`}
                className="p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xl bg-white transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                    <Code2 className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {locale === 'ar' ? srv.title_ar : srv.title_en}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {locale === 'ar' ? srv.short_desc_ar : srv.short_desc_en}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    {((locale === 'ar' ? srv.benefits_ar : srv.benefits_en) || []).slice(0, 2).map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>{t('cta.learn_more')}</span>
                  <ArrowRight className="w-4 h-4 rtl-flip transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all"
            >
              <span>{t('cta.view_all_services')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. VERIFIED PORTFOLIO HIGHLIGHTS */}
      <section className="py-20 bg-slate-950 text-white border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800 px-3 py-1 rounded-md">
                {locale === 'ar' ? 'سابقة أعمالنا' : 'Verified Client Case Studies'}
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
                {locale === 'ar' ? 'مشاريع حقيقية ونجاحات مستمرة مع شركائنا' : 'Real Systems Engineered for Leading Enterprises'}
              </h2>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                {locale === 'ar'
                  ? 'فخورون بالمشاريع التي ساهمنا في نجاحها في مصر والدول العربية عبر مختلف القطاعات الصناعية والخدمية.'
                  : 'Explore how AT Loops architects resilient platforms for manufacturing, retail, contracting, and education.'}
              </p>
            </div>

            <Link
              to="/portfolio"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              <span>{locale === 'ar' ? 'عرض جميع المشاريع' : 'Browse All Case Studies'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <div
                key={proj.slug}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 p-7 hover:border-blue-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-900">
                      {locale === 'ar' ? proj.industry_ar : proj.industry_en}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {locale === 'ar' ? proj.client_name_ar : proj.client_name_en}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {locale === 'ar' ? proj.title_ar : proj.title_en}
                  </h3>

                  <p className="mt-3 text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {locale === 'ar' ? proj.short_desc_ar : proj.short_desc_en}
                  </p>

                  {/* Verified Outcome Points */}
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    {((locale === 'ar' ? proj.results_ar : proj.results_en) || []).slice(0, 2).map((res, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {(proj.tech_stack || []).map((t, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    to={`/portfolio/${proj.slug}`}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                  >
                    <span>{t('cta.view_case_study')}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                  </Link>

                  <span className="text-[11px] text-slate-500 font-medium">
                    Verified Deployment
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. VERIFIED TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              {locale === 'ar' ? 'آراء العملاء' : 'Client Testimonials'}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {locale === 'ar' ? 'ماذا يقول عملاؤنا عن العمل مع ات لوبس؟' : 'Trusted by Forward-Thinking Enterprise Leaders'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {locale === 'ar' ? 'شهادات موثقة من شركاء العمل الذين وثقوا في ات لوبس لأكثر من ثلاث سنوات.' : 'Real feedback from executives managing operations powered by AT Loops.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testi, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{locale === 'ar' ? testi.content_ar : testi.content_en}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {locale === 'ar' ? testi.client_name_ar : testi.client_name_en}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {locale === 'ar' ? testi.client_role_ar : testi.client_role_en} — {locale === 'ar' ? testi.company_ar : testi.company_en}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100/60 px-2.5 py-1 rounded-full">
                    {locale === 'ar' ? 'شراكة ٣+ سنوات' : '3+ Years Partner'}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
              {locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {locale === 'ar' ? 'إجابات واضحة لاستفساراتكم التقنية' : 'Everything You Need to Know Before Starting'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-start p-5 font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span>{locale === 'ar' ? faq.question_ar : faq.question_en}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90 text-blue-600' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {locale === 'ar' ? faq.answer_ar : faq.answer_en}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. LEAD GENERATION CTA BANNER */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {locale === 'ar'
              ? 'جاهز لبدء رحلة التحول الرقمي وتطوير أعمالك؟'
              : 'Ready to Transform Your Enterprise Systems?'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {locale === 'ar'
              ? 'تواصل مع مستشاري ات لوبس اليوم لدراسة متطلبات شركتك وتحديد الحل البرمجي الأمثل بدون تعقيدات أو تكاليف غير مبررة.'
              : 'Consult with AT Loops enterprise architects today to review your workflow and build an actionable roadmap.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/request-quote"
              className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {t('cta.quote')}
            </Link>

            <Link
              to="/book-consultation"
              className="w-full sm:w-auto bg-blue-900/60 hover:bg-blue-900 text-white border border-blue-400/40 font-bold text-sm px-8 py-4 rounded-xl transition-colors"
            >
              {t('cta.consultation')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
