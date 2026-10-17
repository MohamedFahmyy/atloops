import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Faq } from '../../types';
import { ChevronRight, HelpCircle, Phone, ArrowRight } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFaqs()
      .then((data) => setFaqs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'الأسئلة الشائعة' : 'Support & Knowledge Base'}
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            {locale === 'ar' ? 'كل ما تود معرفته عن خدمات وأنظمة ات لوبس' : 'Frequently Asked Questions & Advisory'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            {locale === 'ar'
              ? 'إجابات واضحة ومباشرة حول التعاقدات البرمجية، الدعم الفني، التوافق الضريبي، وحماية البيانات.'
              : 'Clear answers on project delivery, licensing, SLAs, and technical specifications.'}
          </p>
        </div>

        {/* Faqs List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-start p-6 font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{locale === 'ar' ? faq.question_ar : faq.question_en}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90 text-blue-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {locale === 'ar' ? faq.answer_ar : faq.answer_en}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-14 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
          <HelpCircle className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">
            {locale === 'ar' ? 'هل لديك سؤال غير موجود هنا؟' : 'Still Have Questions?'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-6 max-w-md mx-auto">
            {locale === 'ar'
              ? 'فريق المهندسين في ات لوبس مستعد للإجابة على أي تساؤل خاص بحالة شركتك.'
              : 'Our technical support team is available to assist you.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/contact-us"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
            >
              {t('nav.contact')}
            </Link>
            <a
              href="tel:+201211170979"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl border border-slate-200"
              dir="ltr"
            >
              +20 121 117 0979
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
