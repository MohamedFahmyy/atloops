import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { PortfolioProject } from '../../types';
import { ArrowRight, CheckCircle2, ExternalLink, Sparkles, Filter } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPortfolio()
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const industries = [
    { key: 'all', nameEn: 'All Industries', nameAr: 'جميع القطاعات' },
    { key: 'E-Commerce & Retail', nameEn: 'E-Commerce & Retail', nameAr: 'التجارة الإلكترونية والتجزئة' },
    { key: 'Construction & Contracting', nameEn: 'Contracting & Construction', nameAr: 'المقاولات والتشييد' },
    { key: 'Manufacturing & FMCG', nameEn: 'Manufacturing & Foods', nameAr: 'التصنيع والصناعات الغذائية' },
    { key: 'EdTech & Online Learning', nameEn: 'EdTech & Education', nameAr: 'التعليم والأكاديميات' },
  ];

  const filtered = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.industry_en === activeFilter);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'سابقة أعمالنا المعتمدة' : 'Verified Enterprise Deployments'}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
            {locale === 'ar' ? 'مشاريع حقيقية قمنا بتنفيذها بنجاح لشركائنا' : 'Case Studies & Digital Transformations'}
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {locale === 'ar'
              ? 'نفخر بثقة كبرى الشركات والمصانع والمؤسسات التعليمية في مصر والدول العربية في حلول ات لوبس التقنية.'
              : 'Proven software architectures deployed across manufacturing, e-commerce, contracting, and educational institutions.'}
          </p>
        </div>

        {/* Industry Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {industries.map((ind) => (
            <button
              key={ind.key}
              onClick={() => setActiveFilter(ind.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === ind.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {locale === 'ar' ? ind.nameAr : ind.nameEn}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((proj) => (
            <div
              key={proj.slug}
              className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    {locale === 'ar' ? proj.industry_ar : proj.industry_en}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {locale === 'ar' ? proj.client_name_ar : proj.client_name_en}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {locale === 'ar' ? proj.title_ar : proj.title_en}
                </h3>

                <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {locale === 'ar' ? proj.short_desc_ar : proj.short_desc_en}
                </p>

                {/* Results Preview */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  {((locale === 'ar' ? proj.results_ar : proj.results_en) || []).slice(0, 2).map((r, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {(proj.tech_stack || []).map((t, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/portfolio/${proj.slug}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5"
                >
                  <span>{t('cta.view_case_study')}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                </Link>

                <span className="text-[11px] text-slate-400 font-medium">
                  Active in Production
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
