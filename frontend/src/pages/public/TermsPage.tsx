import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { locale } = useLanguage();

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {locale === 'ar' ? 'الشروط والأحكام والتعاقدات' : 'Terms & Conditions of Service'}
              </h1>
              <p className="text-xs text-slate-400">AT Loops Technology Solutions — Effective: 2026</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6">
            <section>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {locale === 'ar' ? '١. نطاق العمل والتسليم (SOW)' : '1. Scope of Work (SOW)'}
              </h3>
              <p>
                {locale === 'ar'
                  ? 'يخضع كل مشروع برمجي لوثيقة نطاق عمل محددة (SOW) معتمدة من الطرفين توضح مراحل التسليم، الميزات المعتمدة، والجدول الزمني.'
                  : 'All engineering engagements are governed by a bilaterally signed Scope of Work detailing milestones and deliverables.'}
              </p>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {locale === 'ar' ? '٢. حقوق الملكية الفكرية' : '2. Intellectual Property Rights'}
              </h3>
              <p>
                {locale === 'ar'
                  ? 'يحصل العميل على ملكية كاملة ومطلقة للكود البرمجي المخصص المطور لصالحه فور سداد مستحقات المشروع، ولا يتم مشاركة أي كود خاص مع أطراف أخرى.'
                  : 'Clients retain full ownership of bespoke custom codebase developed for their organization upon contractual completion.'}
              </p>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {locale === 'ar' ? '٣. اتفاقيات مستوى الخدمة والدعم الفني (SLA)' : '3. Service Level Agreements (SLAs)'}
              </h3>
              <p>
                {locale === 'ar'
                  ? 'تلتزم ات لوبس بنسب الجاهزية والاستقرار المحددة في عقود الصيانة، مع توفير خطوط استجابة للطوارئ ومعالجة الأعطال دون تأخير.'
                  : 'AT Loops guarantees certified response windows under active support contracts to maintain high system availability.'}
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
};
