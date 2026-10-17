import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Service } from '../../types';
import { Code2, ArrowRight, Check, Layers, Shield, Phone } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices()
      .then((data) => setServices(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { key: 'all', nameEn: 'All Services', nameAr: 'جميع الخدمات' },
    { key: 'software', nameEn: 'Software & Code', nameAr: 'البرمجيات والتطوير' },
    { key: 'enterprise', nameEn: 'ERP & Business', nameAr: 'الأنظمة الإدارية ERP' },
    { key: 'retail', nameEn: 'Retail & POS', nameAr: 'نقاط البيع والمبيعات' },
    { key: 'web', nameEn: 'Web & Portals', nameAr: 'المواقع والمنصات' },
    { key: 'infrastructure', nameEn: 'Cloud & Servers', nameAr: 'السيرفرات والشبكات' },
    { key: 'hardware', nameEn: 'Security & Access', nameAr: 'الأنظمة الأمنية والحضور' },
  ];

  const filtered = activeTab === 'all' ? services : services.filter(s => s.category === activeTab);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'دليل الخدمات الشامل' : 'Comprehensive Service Catalog'}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
            {locale === 'ar' ? 'حلول تقنية متكاملة مصممة لنمو أعمالك ومؤسستك' : 'Enterprise Engineering & Managed IT Services'}
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {locale === 'ar'
              ? 'نغطي دورة التحول الرقمي بالكامل: من تحليل العمليات وتطوير البرمجيات المخصصة إلى البنية التحتية للخوادم والأنظمة الأمنية الميدانية.'
              : 'End-to-end technology solutions tailored around your exact operational workflows and scale requirements.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === cat.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {locale === 'ar' ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((srv) => (
            <div
              key={srv.slug}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group"
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

                {/* Benefits */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                  {((locale === 'ar' ? srv.benefits_ar : srv.benefits_en) || []).slice(0, 3).map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="line-clamp-1">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/services/${srv.slug}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <span>{t('cta.learn_more')}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                </Link>

                <Link
                  to="/request-quote"
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                >
                  {t('cta.quote')}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">
              {locale === 'ar' ? 'هل تحتاج إلى استشارة فنية مخصصة لشركتك؟' : 'Need a Bespoke Solution Not Listed Above?'}
            </h3>
            <p className="mt-1 text-xs text-slate-400 max-w-xl">
              {locale === 'ar'
                ? 'فريق المهندسين في ات لوبس مستعد لدراسة متطلباتك وبناء نظام رقمي مفصل بالكامل.'
                : 'Our solutions architects will analyze your workflow and propose an exact technical architecture.'}
            </p>
          </div>

          <Link
            to="/contact-us"
            className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg"
          >
            {t('cta.consultation')}
          </Link>
        </div>

      </div>
    </div>
  );
};
