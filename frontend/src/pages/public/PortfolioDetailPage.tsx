import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { PortfolioProject } from '../../types';
import { 
  ChevronRight, ArrowRight, CheckCircle2, ShieldCheck, 
  ExternalLink, Layers, ArrowLeft, Phone, Building2 
} from 'lucide-react';

export const PortfolioDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { locale, t } = useLanguage();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getPortfolioBySlug(slug)
      .then((data) => setProject(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Case Study Not Found</h2>
        <Link to="/portfolio" className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const title = locale === 'ar' ? project.title_ar : project.title_en;
  const clientName = locale === 'ar' ? project.client_name_ar : project.client_name_en;
  const industry = locale === 'ar' ? project.industry_ar : project.industry_en;
  const shortDesc = locale === 'ar' ? project.short_desc_ar : project.short_desc_en;
  const description = locale === 'ar' ? project.description_ar : project.description_en;
  const challenge = locale === 'ar' ? project.challenge_ar : project.challenge_en;
  const solution = locale === 'ar' ? project.solution_ar : project.solution_en;
  const results = (locale === 'ar' ? project.results_ar : project.results_en) || [];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-slate-950 text-white py-14 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-4">
            <Link to="/portfolio" className="hover:underline">
              {t('nav.portfolio')}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rtl-flip" />
            <span className="text-slate-300">{title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-900 text-blue-300 border border-blue-800">
                  {industry}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Client: {clientName}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl">
                {title}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                {shortDesc}
              </p>
            </div>

            <div className="shrink-0">
              <Link
                to="/request-quote"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <span>{locale === 'ar' ? 'طلب تنفيذ مماثل' : 'Request Similar Project'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {locale === 'ar' ? 'نطاق وتفاصيل المشروع' : 'Project Scope & Narrative'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Challenge & Solution Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                  {locale === 'ar' ? 'التحدي التشغيلي' : 'The Challenge'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">
                  {locale === 'ar' ? 'العقبات التقنية قبل تدخلنا' : 'Pre-Engagement Obstacles'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {challenge}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {locale === 'ar' ? 'الحل الهندسي من ات لوبس' : 'The AT Loops Solution'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">
                  {locale === 'ar' ? 'كيف صممنا ونفذنا المنظومة' : 'Architectural Implementation'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {solution}
                </p>
              </div>
            </div>

            {/* Verified Outcomes */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {locale === 'ar' ? 'النتائج القياسية المحققة' : 'Verified Business Outcomes'}
              </h2>
              <div className="space-y-3">
                {results.map((res, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">{res}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                {locale === 'ar' ? 'التقنيات المستخدمة' : 'Technology Stack'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(project.tech_stack || []).map((t, idx) => (
                  <span key={idx} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-7 border border-slate-800 text-center">
              <Building2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm">
                {locale === 'ar' ? 'هل تريد نظاماً برمجياً مماثلاً؟' : 'Ready to Build Your System?'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 mb-5 leading-relaxed">
                {locale === 'ar'
                  ? 'مهندسونا مستعدون لدراسة تفاصيل مشروعك وتقديم عرض أسعار ومقايسة متكاملة.'
                  : 'Speak with our enterprise engineers to scope your next milestone.'}
              </p>
              <Link
                to="/request-quote"
                className="w-full block bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl transition-colors shadow-md"
              >
                {t('cta.quote')}
              </Link>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
