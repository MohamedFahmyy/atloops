import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { ShieldCheck, CheckCircle2, ArrowRight, Calculator } from 'lucide-react';

export const RequestQuotePage: React.FC = () => {
  const { locale, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: 'Egypt',
    service_of_interest: 'Enterprise ERP Systems',
    estimated_budget: '$5,000 - $10,000',
    timeline: '1-3 Months',
    message: '',
    website_hp: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await api.submitLead({
        ...formData,
        source_page: '/request-quote',
        message: `[Timeline: ${formData.timeline}] ${formData.message}`,
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting quote request.');
    } finally {
      setLoading(false);
    }
  };

  const budgets = [
    { label: '< $2,500', value: '< $2,500' },
    { label: '$2,500 - $5,000', value: '$2,500 - $5,000' },
    { label: '$5,000 - $10,000', value: '$5,000 - $10,000' },
    { label: '$10,000 - $25,000', value: '$10,000 - $25,000' },
    { label: '> $25,000 (Large Enterprise)', value: '> $25,000' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'طلب مقايسة وعرض أسعار' : 'Request a Project Scope & Quote'}
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            {locale === 'ar' ? 'احصل على دراسة فنية وعرض سعر تفصيلي لمشروعك' : 'Receive a Transparent Architectural SOW'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            {locale === 'ar'
              ? 'حدد نطاق النظام المطلوب، الميزانية التقديرية، والجدول الزمني وسنقوم بإعداد مقايسة دقيقة بدون أي تكاليف خفية.'
              : 'Our engineering directors build customized delivery timelines and itemized milestone breakdowns.'}
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-lg">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {locale === 'ar' ? 'تم استلام طلب المقايسة بنجاح' : 'Quote Request Received'}
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
              {locale === 'ar'
                ? 'شكراً لثقتك في ات لوبس. سيقوم الفريق الهندسي بإعداد دراسة المتطلبات والتواصل معك خلال ٢٤ ساعة.'
                : 'Our solutions team is reviewing your scope and will provide an architectural overview.'}
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="text-xs font-bold bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            >
              {locale === 'ar' ? 'تقديم طلب مشروع آخر' : 'Submit Another Request'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
            
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {locale === 'ar' ? 'الاسم بالكامل' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Mohamed Ali"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {locale === 'ar' ? 'الشركة أو المصنع' : 'Organization Name'}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Ltd."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Official Email'} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="m.ali@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {locale === 'ar' ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+20 123 456 7890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {locale === 'ar' ? 'نوع النظام أو الخدمة' : 'Primary Solution Required'}
                </label>
                <select
                  value={formData.service_of_interest}
                  onChange={(e) => setFormData({ ...formData, service_of_interest: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Enterprise ERP Systems">Enterprise ERP Systems</option>
                  <option value="Custom Software Development">Custom Software Development</option>
                  <option value="Cloud POS & Retail Systems">Cloud POS & Retail Systems</option>
                  <option value="Academy LMS Platform">Academy LMS Platform</option>
                  <option value="E-Commerce & Delivery Marketplace">E-Commerce & Delivery Marketplace</option>
                  <option value="Cloud Infrastructure & Servers">Cloud Infrastructure & Servers</option>
                  <option value="Security CCTV & Biometric Access">Security CCTV & Biometric Access</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {locale === 'ar' ? 'الجدول الزمني المفضل' : 'Target Timeline'}
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Immediate (< 1 Month)">Immediate (&lt; 1 Month)</option>
                  <option value="1-3 Months">1-3 Months</option>
                  <option value="3-6 Months">3-6 Months</option>
                  <option value="Flexible / Planning Phase">Flexible / Planning Phase</option>
                </select>
              </div>
            </div>

            {/* Estimated Budget Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {locale === 'ar' ? 'الميزانية التقديرية المخصصة للمشروع' : 'Estimated Target Investment'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {budgets.map((b) => (
                  <button
                    type="button"
                    key={b.value}
                    onClick={() => setFormData({ ...formData, estimated_budget: b.value })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      formData.estimated_budget === b.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {locale === 'ar' ? 'شرح متطلبات وتفاصيل المشروع' : 'Project Specifications & Functional Requirements'} *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={locale === 'ar' ? 'عدد المستخدمين المتوقع، الفروع، الربط المحاسبي، والميزات الخاصة المطلوبة...' : 'Specify expected user count, branch sync, integrations...'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>NDA & Confidentiality Protected</span>
              </span>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Submitting...' : t('cta.quote')}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
