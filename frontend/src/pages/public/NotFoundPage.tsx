import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Compass, ArrowRight, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { locale, t } = useLanguage();

  return (
    <div className="bg-slate-50 min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <span className="text-4xl font-extrabold text-blue-600 tracking-tight">404</span>

        <h1 className="text-xl font-bold text-slate-900 mt-2 mb-3">
          {locale === 'ar' ? 'الصفحة غير موجودة في الدليل' : 'Page Not Found in Tech Guide'}
        </h1>

        <p className="text-xs text-slate-500 leading-relaxed mb-8">
          {locale === 'ar'
            ? 'يبدو أن الرابط المطلوب قد تم نقله أو أنه غير صحيح. لكن في ات لوبس نحن دائماً نوجهك للطريق الصحيح.'
            : 'The resource you are looking for has been relocated or is temporarily unavailable.'}
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{t('nav.home')}</span>
          </Link>

          <Link
            to="/services"
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition-colors"
          >
            <span>{t('cta.view_all_services')}</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
