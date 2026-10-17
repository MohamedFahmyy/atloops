import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { MapPin, Phone, Mail, Send, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: 'Egypt',
    service_of_interest: 'Custom Software Development',
    message: '',
    website_hp: '', // Honeypot field
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
        source_page: '/contact-us',
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending message. Please try again or call us.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
            {locale === 'ar' ? 'نحن هنا لمساعدتك في كل خطوة تقنية' : 'Start a Conversation With AT Loops Advisors'}
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {locale === 'ar'
              ? 'لا تتردد في التواصل معنا لأي استفسار، طلب عرض أسعار، أو لحجز استشارة تقنية مجانية لدراسة متطلبات مشروعك.'
              : 'Our enterprise solutions architects are available to answer your technical and architectural inquiries.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Details & Headquarters Info */}
          <div className="space-y-6">
            
            <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  {locale === 'ar' ? 'المقر الرئيسي' : 'Headquarters'}
                </span>
                <div className="flex items-start gap-3 mt-3">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed text-slate-300">
                    {t('footer.address')}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  {locale === 'ar' ? 'الاتصال المباشر' : 'Direct Call & WhatsApp'}
                </span>
                <div className="flex items-center gap-3 mt-3" dir="ltr">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <a href="tel:+201112194828" className="text-sm font-bold text-white hover:text-blue-300 transition-colors">
                    +20 111 219 4828
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Official Inquiries'}
                </span>
                <div className="flex items-center gap-3 mt-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                  <a href="mailto:contact@atloops.com" className="text-xs font-bold text-white hover:text-blue-300 transition-colors">
                    contact@atloops.com
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  {locale === 'ar' ? 'ساعات العمل' : 'Working Hours'}
                </span>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-300">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    {locale === 'ar' ? 'الأحد - الخميس: ٩:٠٠ ص - ٦:٠٠ م' : 'Sun - Thu: 9:00 AM - 6:00 PM (EET)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Embedded Map Representation */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                {locale === 'ar' ? 'موقعنا على الخريطة (الجيزة - العجوزة)' : 'Agouza, Giza Location'}
              </span>
              <iframe
                title="AT Loops Location"
                src="https://maps.google.com/maps?q=72%20Arab%20League%20Street,%20Agouza,%20Giza&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="190"
                style={{ border: 0, borderRadius: '1rem' }}
                loading="lazy"
              ></iframe>
            </div>

          </div>

          {/* Interactive Lead Submission Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {locale === 'ar' ? 'أرسل لنا استفسارك أو طلبك' : 'Send Your Inquiries to Our Engineering Advisors'}
            </h2>
            <p className="text-xs text-slate-500 mb-8">
              {locale === 'ar'
                ? 'سيقوم فريق الدعم الفني والمستشارين بمراجعة طلبك والرد خلال أقل من ٢٤ ساعة عمل.'
                : 'All submissions are encrypted and handled confidentially by AT Loops.'}
            </p>

            {success ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-900">
                  {locale === 'ar' ? 'تم استلام رسالتك بنجاح!' : 'Message Safely Received!'}
                </h3>
                <p className="mt-2 text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                  {locale === 'ar'
                    ? 'شكراً لتواصلك مع ات لوبس. سيقوم مستشارنا الفني بالاطلاع على التفاصيل والتواصل معك عبر الهاتف أو البريد الإلكتروني.'
                    : 'Thank you for reaching out to AT Loops. An enterprise advisor will review your specifications and follow up.'}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 text-xs font-bold bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700"
                >
                  {locale === 'ar' ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot field invisible to humans */}
                <input
                  type="text"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {locale === 'ar' ? 'الاسم بالكامل' : 'Your Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ahmed Hassan"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {locale === 'ar' ? 'اسم الشركة أو المصنع' : 'Company or Factory Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Example Industries"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Official Email Address'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {locale === 'ar' ? 'رقم الهاتف / واتساب' : 'Phone Number (With Country Code)'} *
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
                      {locale === 'ar' ? 'الخدمة المطلوبة' : 'Service of Interest'}
                    </label>
                    <select
                      value={formData.service_of_interest}
                      onChange={(e) => setFormData({ ...formData, service_of_interest: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Custom Software Development">Custom Software Development</option>
                      <option value="Enterprise ERP Systems">Enterprise ERP Systems</option>
                      <option value="Cloud POS & Retail Systems">Cloud POS & Retail Systems</option>
                      <option value="CRM & Workflow Automation">CRM & Workflow Automation</option>
                      <option value="Web Applications & Portals">Web Applications & Portals</option>
                      <option value="Cloud Infrastructure & Managed IT">Cloud Infrastructure & Managed IT</option>
                      <option value="Security CCTV & Access Control">Security CCTV & Access Control</option>
                      <option value="Business Email & Domains">Business Email & Domains</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {locale === 'ar' ? 'الدولة' : 'Country'}
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Egypt">Egypt (مصر)</option>
                      <option value="Saudi Arabia">Saudi Arabia (السعودية)</option>
                      <option value="UAE">United Arab Emirates (الإمارات)</option>
                      <option value="Kuwait">Kuwait (الكويت)</option>
                      <option value="Qatar">Qatar (قطر)</option>
                      <option value="Other">Other Region</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {locale === 'ar' ? 'تفاصيل المشروع أو الاستفسار' : 'Project Scope or Specific Questions'} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={locale === 'ar' ? 'اكتب نبذة عن احتياجات شركتك والأنظمة الحالية...' : 'Describe your operational objectives...'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>{locale === 'ar' ? 'حماية تامة وسرية لبيانات العملاء' : 'Confidential NDA Protected'}</span>
                  </span>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    <span>{loading ? 'Sending...' : t('cta.send_message')}</span>
                    <Send className="w-3.5 h-3.5 rtl-flip" />
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
