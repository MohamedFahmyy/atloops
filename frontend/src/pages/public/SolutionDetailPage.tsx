import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Product } from '../../types';
import { PayPalCheckoutModal } from '../../components/checkout/PayPalCheckoutModal';
import { 
  ChevronRight, ArrowRight, Check, ShieldCheck, 
  ExternalLink, Layers, CheckCircle2, MessageSquare, Phone,
  CreditCard, Lock, Sparkles
} from 'lucide-react';

export const SolutionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { locale, t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getProductBySlug(slug)
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmitting(true);
    try {
      await api.submitLead({
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        service_of_interest: product.name_en,
        source_page: `/products/${product.slug}`,
        message: inquiryMessage || `Inquiry regarding ${product.name_en}`,
      });
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Error submitting inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <Link to="/products" className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl">
          Back to Solutions
        </Link>
      </div>
    );
  }

  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const tagline = locale === 'ar' ? product.tagline_ar : product.tagline_en;
  const shortDesc = locale === 'ar' ? product.short_desc_ar : product.short_desc_en;
  const description = locale === 'ar' ? product.description_ar : product.description_en;
  const features = (locale === 'ar' ? product.features_ar : product.features_en) || [];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-slate-950 text-white py-14 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-4">
            <Link to="/products" className="hover:underline">
              {t('nav.solutions')}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rtl-flip" />
            <span className="text-slate-300">{name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-blue-900 text-blue-300 border border-blue-800 mb-3">
                {product.badge || 'Enterprise Edition'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                {name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-400 font-semibold">
                {tagline}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shrink-0 text-center sm:text-end">
              <span className="text-xs text-slate-400 block mb-1">
                {locale === 'ar' ? 'نموذج الترخيص' : 'Licensing & Deployment'}
              </span>
              <div className="flex items-baseline justify-center sm:justify-end gap-2">
                {product.price ? (
                  <span className="text-3xl font-extrabold text-blue-400">
                    ${product.price}
                  </span>
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {locale === 'ar' ? 'حسب المواصفات' : 'Custom SOW'}
                  </span>
                )}
                {product.original_price && (
                  <span className="text-sm text-slate-500 line-through">
                    ${product.original_price}
                  </span>
                )}
              </div>

              {product.price && (
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs py-3 px-5 rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'شراء فوري بالفيزا / باي بال' : 'Buy Now with Visa / PayPal'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Description */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {locale === 'ar' ? 'عن هذا النظام ومجالات تطبيقه' : 'System Overview & Specifications'}
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                <p>{shortDesc}</p>
                <p>{description}</p>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {locale === 'ar' ? 'الخصائص والمواصفات الفنية' : 'Key Core Capabilities'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-800">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {locale === 'ar' ? 'المنصات المدعومة' : 'Supported Platforms & Architectures'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {(product.supported_platforms || ['Web', 'Cloud', 'Desktop', 'Mobile']).map((plat, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                    {plat}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Inquiry Form */}
          <div className="space-y-6">

            {/* Instant Online Purchase Card */}
            {product.price && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-7 border border-blue-900/60 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'شراء مباشر وترخيص فوري' : 'Instant Verified License'}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {locale === 'ar' ? 'طلب ودفع أونلاين بالفيزا / باي بال' : 'Instant Online Checkout'}
                </h3>
                
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {locale === 'ar'
                    ? 'ادفع بأمان عبر بطاقة فيزا أو ماستركارد أو حساب باي بال، واستلم رخصة النظام فوراً.'
                    : 'Pay securely using Visa, Mastercard, or PayPal to receive your software license immediately.'}
                </p>

                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-300">{locale === 'ar' ? 'سعر النظام:' : 'System Price:'}</span>
                  <span className="text-2xl font-black text-emerald-400">${product.price} <span className="text-xs font-normal text-slate-300">USD</span></span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'شراء ودفع أونلاين الآن' : 'Pay Online with Visa / PayPal'}</span>
                </button>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    {locale === 'ar' ? 'حماية 256-Bit SSL' : '256-Bit SSL Protected'}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-[10px] text-slate-300">
                    <span>VISA</span>
                    <span>•</span>
                    <span>MC</span>
                    <span>•</span>
                    <span>PAYPAL</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xl">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {locale === 'ar' ? 'طلب استشارة مخصصة أو ديمو' : 'Request Pricing or System Demo'}
              </h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                {locale === 'ar'
                  ? 'املأ النموذج وسيقوم مستشارنا بالتواصل معك في غضون ٢٤ ساعة.'
                  : 'Submit your contact info to receive detailed pricing and configuration.'}
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-bold text-emerald-900 text-sm">
                    {locale === 'ar' ? 'تم استلام طلبك بنجاح' : 'Inquiry Received'}
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    {locale === 'ar' ? 'سيتواصل معك فريق ات لوبس قريباً.' : 'Our team will contact you shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {locale === 'ar' ? 'الاسم بالكامل' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="Ahmed Mohamed"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {locale === 'ar' ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="+20 123 456 7890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {locale === 'ar' ? 'ملاحظات أو استفسار محدد' : 'Specific Inquiries or Requirements'}
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder={locale === 'ar' ? 'أود معرفة تفاصيل الربط مع الفروع...' : 'Inquire about branch scaling...'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-colors"
                  >
                    {submitting ? 'Submitting...' : t('cta.send_message')}
                  </button>
                </form>
              )}
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 text-center">
              <Phone className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm">
                {locale === 'ar' ? 'تفضل التواصل هاتفياً؟' : 'Prefer Calling Directly?'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 mb-3">
                {locale === 'ar' ? 'مستشارونا جاهزون للإجابة على كافة التفاصيل.' : 'Speak with AT Loops enterprise consultants.'}
              </p>
              <a
                href="tel:+201211170979"
                className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
                dir="ltr"
              >
                +20 121 117 0979
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* PayPal & Credit Card Checkout Modal */}
      {product && (
        <PayPalCheckoutModal
          product={product}
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

    </div>
  );
};
