import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { locale } = useLanguage();

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {locale === 'ar' ? 'سياسة الخصوصية وأمان البيانات' : 'Enterprise Privacy Policy'}
              </h1>
              <p className="text-xs text-slate-400">AT Loops Technology Solutions — Last Updated: 2026</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6">
            <section>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {locale === 'ar' ? '١. التزامنا بحماية سرية البيانات' : '1. Data Confidentiality Commitment'}
              </h3>
              <p>
                {locale === 'ar'
                  ? 'تلتزم شركة ات لوبس (At Loops) التزاماً صارماً بحماية سرية وأمان كافة بيانات العملاء، الحسابات، وقواعد البيانات المدارة عبر أنظمتنا البرمجية أو خوادمنا السحابية.'
                  : 'AT Loops is strictly committed to protecting the integrity, confidentiality, and security of all client enterprise data.'}
              </p>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {locale === 'ar' ? '٢. البيانات التي يتم جمعها' : '2. Information We Collect'}
              </h3>
              <p>
                {locale === 'ar'
                  ? 'نقوم بجمع المعلومات الضرورية فقط لتقديم الخدمات، مثل الاسم، بيانات الاتصال، اسم المنشأة، ونطاق المشروع، وذلك للرد على الاستفسارات وتقديم عروض الأسعار والدعم الفني.'
                  : 'We collect only essential information required to deliver services, scope software implementations, and provide ongoing SLAs.'}
              </p>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {locale === 'ar' ? '٣. التشفير وإجراءات الحماية' : '3. Security Standards & Encryption'}
              </h3>
              <p>
                {locale === 'ar'
                  ? 'يتم تشفير كافة الاتصالات عبر شهادات SSL/TLS، واستخدام جدران حماية معتمدة WAF، مع تطبيق بروتوكولات عزل البيانات ومراقبة محاولات الاختراق على مدار الساعة.'
                  : 'All client traffic is protected using high-grade TLS encryption, automated snapshot routines, and strict least-privilege administrative access.'}
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
};
