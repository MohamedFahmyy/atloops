import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Service } from '../../types';
import { 
  ArrowRight, CheckCircle2, ShieldCheck, HelpCircle, 
  ChevronRight, Code2, Server, ArrowLeft, Phone 
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { locale, t } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getServiceBySlug(slug)
      .then((data) => setService(data))
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

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Service Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested service page does not exist or has been relocated.</p>
        <Link to="/services" className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl">
          Back to Services
        </Link>
      </div>
    );
  }

  const title = locale === 'ar' ? service.title_ar : service.title_en;
  const shortDesc = locale === 'ar' ? service.short_desc_ar : service.short_desc_en;
  const description = locale === 'ar' ? service.description_ar : service.description_en;
  const benefits = (locale === 'ar' ? service.benefits_ar : service.benefits_en) || [];
  const capabilities = (locale === 'ar' ? service.capabilities_ar : service.capabilities_en) || [];
  const processSteps = (locale === 'ar' ? service.process_steps_ar : service.process_steps_en) || [
    'Requirements Discovery & SOW Specification',
    'Architecture Modeling & Database Design',
    'Agile Development & Milestone Reviews',
    'Deployment, Testing & 24/7 SLA Handover'
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Hero Header */}
      <div className="bg-slate-950 text-white py-16 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-4">
            <Link to="/services" className="hover:underline">
              {t('nav.services')}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rtl-flip" />
            <span className="text-slate-300">{title}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl">
            {title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {shortDesc}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/request-quote"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              <span>{t('cta.quote')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
            </Link>

            <Link
              to="/book-consultation"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-6 py-3.5 rounded-xl transition-colors"
            >
              {t('cta.consultation')}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {locale === 'ar' ? 'نظرة عامة على الخدمة' : 'Service Overview'}
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                <p>{description}</p>
              </div>
            </div>

            {/* Strategic Benefits */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {locale === 'ar' ? 'المزايا الاستراتيجية لشركتك' : 'Strategic Business Benefits'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-800">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Capabilities */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {locale === 'ar' ? 'القدرات الهندسية والمعايير التقنية' : 'Engineering Capabilities & Standards'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capabilities.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <Server className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-800">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation Methodology Process */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {locale === 'ar' ? 'منهجية ومراحل التنفيذ' : 'Execution Lifecycle & Process'}
              </h2>
              <div className="space-y-4">
                {processSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{step}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar CTA & Direct Inquiries */}
          <div className="space-y-6">
            
            <div className="bg-slate-900 text-white rounded-3xl p-7 border border-slate-800 shadow-xl">
              <h3 className="text-base font-bold text-white mb-2">
                {locale === 'ar' ? 'اطلب عرض أسعار مفصل' : 'Request a Tailored SOW'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {locale === 'ar'
                  ? 'يقوم مستشارو ات لوبس بدراسة متطلباتك بدقة وتقديم خطة زمنية وميزانية واضحة.'
                  : 'Receive a transparent milestone schedule and architectural estimate from our senior engineers.'}
              </p>

              <Link
                to="/request-quote"
                className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md"
              >
                {t('cta.quote')}
              </Link>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Confidentiality Guaranteed</span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-sm">
                {locale === 'ar' ? 'تحدث مباشرة مع مستشارنا' : 'Speak Directly With An Advisor'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                {locale === 'ar' ? 'فريق الدعم الفني متاح للرد على أي استفسارات.' : 'Available Sunday - Thursday, 9 AM - 6 PM'}
              </p>
              <a
                href="tel:+201211170979"
                className="inline-block bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
                dir="ltr"
              >
                +20 121 117 0979
              </a>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
