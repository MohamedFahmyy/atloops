import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Video, Phone, Users, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const BookConsultationPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    meeting_type: 'Google Meet',
    preferred_date: '',
    message: '',
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
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        service_of_interest: 'Digital Transformation Consultation',
        source_page: '/book-consultation',
        message: `[Consultation Channel: ${formData.meeting_type}, Preferred Date: ${formData.preferred_date}] ${formData.message}`,
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error booking consultation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'جلسة استشارية مجانية' : 'Complimentary Enterprise Architecture Session'}
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            {locale === 'ar' ? 'احجز استشارة تقنية ٣٠ دقيقة مع كبير مهندسينا' : 'Book a 30-Minute Digital Advisory Call'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            {locale === 'ar'
              ? 'ناقش التحديات التشغيلية لمؤسستك واحصل على توجيه هندسي موضوعي لحلول ERP، السيرفرات، والأتمتة.'
              : 'Direct discussion with an AT Loops software architect to evaluate your tech stack.'}
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-lg">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {locale === 'ar' ? 'تم تأكيد طلب موعد الاستشارة' : 'Consultation Session Requested'}
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
              {locale === 'ar'
                ? 'سيتواصل معك منسق الاستشارات لتأكيد رابط الاجتماع أو ترتيب الزيارة في المقر.'
                : 'Our calendar advisor will reach out to confirm your slot.'}
            </p>
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
                  placeholder="Eng. Ahmed Hassan"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {locale === 'ar' ? 'الشركة أو المصنع' : 'Organization'}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Enterprise Group"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="a.hassan@enterprise.com"
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
                  placeholder="+20 121 117 0979"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Meeting Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {locale === 'ar' ? 'قناة الاجتماع المفضلة' : 'Preferred Meeting Channel'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'Google Meet', label: 'Google Meet' },
                  { id: 'Zoom', label: 'Zoom Video' },
                  { id: 'Phone Call', label: 'Phone Call' },
                  { id: 'In-Person (HQ Giza)', label: locale === 'ar' ? 'مقرنا (الجيزة)' : 'In-Person (HQ)' },
                ].map((channel) => (
                  <button
                    type="button"
                    key={channel.id}
                    onClick={() => setFormData({ ...formData, meeting_type: channel.id })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      formData.meeting_type === channel.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {channel.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {locale === 'ar' ? 'الموضوعات أو الأنظمة التي تود مناقشتها' : 'Topics You Would Like to Cover'}
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={locale === 'ar' ? 'مثال: دراسة التحول من نظام قديم إلى ERP حديث، وتأمين السيرفرات...' : 'E.g., Reviewing cloud migration feasibility...'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>30 Min Complimentary Call</span>
              </span>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Submitting...' : t('cta.consultation')}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
