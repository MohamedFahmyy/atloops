import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Product } from '../../types';
import { 
  X, ShieldCheck, CheckCircle2, AlertCircle, CreditCard, 
  Lock, ArrowRight, Loader2, DollarSign, Sparkles 
} from 'lucide-react';

interface PayPalCheckoutModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const PayPalCheckoutModal: React.FC<PayPalCheckoutModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  // Customer Details Form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Checkout State
  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'success'>('details');
  const [sdkLoading, setSdkLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // PayPal Configuration from Backend
  const [paypalConfig, setPaypalConfig] = useState<{ client_id: string; currency: string; is_configured: boolean } | null>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const buttonsRenderedRef = useRef(false);

  // Load PayPal Configuration when Modal opens
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('details');
      setErrorMessage(null);
      setCompletedOrder(null);
      buttonsRenderedRef.current = false;
      return;
    }

    api.getPayPalConfig()
      .then((config) => setPaypalConfig(config))
      .catch((err) => console.error('Failed to load PayPal config:', err));
  }, [isOpen]);

  // Proceed from Step 1 (Details) to Step 2 (PayPal & Card Payment)
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال الاسم والبريد الإلكتروني.' : 'Please enter your name and email address.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep('payment');
  };

  // Dynamically load PayPal SDK and render Smart Buttons
  useEffect(() => {
    if (currentStep !== 'payment' || !isOpen || buttonsRenderedRef.current) return;

    const clientId = paypalConfig?.client_id || 'test';
    const currency = paypalConfig?.currency || 'USD';

    setSdkLoading(true);

    const scriptId = 'paypal-sdk-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const renderButtons = () => {
      const paypal = (window as any).paypal;
      if (!paypal || !paypal.Buttons || !paypalContainerRef.current) {
        setSdkLoading(false);
        return;
      }

      // Clear previous container content
      paypalContainerRef.current.innerHTML = '';

      paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
          height: 48,
        },
        createOrder: async () => {
          setErrorMessage(null);
          try {
            const res = await api.createPayPalOrder({
              product_id: product.id,
              customer_name: customerName,
              customer_email: customerEmail,
              customer_phone: customerPhone,
              amount: product.price || 0,
              notes: customerNotes,
            });

            // Save order ID to link with capture step
            (window as any).__atloops_current_order_id = res.order_id;
            return res.paypal_order_id;
          } catch (err: any) {
            setErrorMessage(err.message || (isAr ? 'فشل إنشاء الطلب' : 'Failed to create order'));
            throw err;
          }
        },
        onApprove: async (data: any) => {
          setProcessing(true);
          try {
            const orderId = (window as any).__atloops_current_order_id;
            const captureRes = await api.capturePayPalOrder({
              order_id: orderId,
              paypal_order_id: data.orderID,
            });

            setCompletedOrder(captureRes);
            setCurrentStep('success');
          } catch (err: any) {
            setErrorMessage(err.message || (isAr ? 'فشل إتمام عملية الدفع' : 'Payment capture failed'));
          } finally {
            setProcessing(false);
          }
        },
        onError: (err: any) => {
          console.error('PayPal Button Error:', err);
          setErrorMessage(
            isAr 
              ? 'حدث خطأ أثناء الاتصال ببوابة الدفع. تأكد من صحة بيانات البطاقة.' 
              : 'Payment error encountered. Please check your card information.'
          );
        },
      }).render(paypalContainerRef.current).then(() => {
        buttonsRenderedRef.current = true;
        setSdkLoading(false);
      }).catch((err: any) => {
        console.error('PayPal Render Error:', err);
        setSdkLoading(false);
      });
    };

    if (script && (window as any).paypal) {
      renderButtons();
    } else {
      if (script) script.remove();
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&components=buttons,funding-eligibility`;
      script.async = true;
      script.onload = () => renderButtons();
      script.onerror = () => {
        setSdkLoading(false);
        setErrorMessage(isAr ? 'تعذر تحميل بوابة باي بال. تحقق من اتصال الإنترنت.' : 'Could not load PayPal SDK. Please check your connection.');
      };
      document.body.appendChild(script);
    }
  }, [currentStep, isOpen, paypalConfig]);

  if (!isOpen) return null;

  const productName = isAr ? product.name_ar : product.name_en;
  const priceDisplay = product.price ? `$${Number(product.price).toLocaleString()}` : '$0.00';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 ltr:right-5 rtl:left-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>{isAr ? 'بوابة الدفع الآمنة (256-Bit SSL)' : 'Secure 256-Bit SSL Encrypted Checkout'}</span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            {isAr ? 'إتمام الشراء والدفع أونلاين' : 'Checkout & Instant Payment'}
          </h3>

          {/* Product Summary Tag */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider block">
                {product.badge || (isAr ? 'حل برمجي معتمد' : 'Verified Software')}
              </span>
              <h4 className="text-sm font-bold text-white truncate">{productName}</h4>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-300 block">{isAr ? 'المبلغ الإجمالي' : 'Total Price'}</span>
              <span className="text-xl font-black text-emerald-400">{priceDisplay} <span className="text-xs font-normal text-slate-300">USD</span></span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* STEP 1: CUSTOMER DETAILS */}
          {currentStep === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="text-xs text-slate-500 mb-2">
                {isAr 
                  ? 'الرجاء إدخال بياناتك للتسجيل وإصدار رخصة النظام وإيصال الدفع الإلكتروني:' 
                  : 'Please enter your information to issue the software license and invoice receipt:'}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isAr ? 'الاسم بالكامل' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isAr ? 'مثال: أحمد محمد' : 'e.g. John Doe'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isAr ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+20 123 456 7890"
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isAr ? 'ملاحظات أو متطلبات إضافية' : 'Additional Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder={isAr ? 'أي ملاحظات خاصة بربط النظام أو السيرفر...' : 'Any customization or setup notes...'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>{isAr ? 'المتابعة لخيارات الدفع (فيزا / باي بال)' : 'Proceed to Payment (Visa / PayPal)'}</span>
                <ArrowRight className="w-4 h-4 rtl-flip" />
              </button>

              <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'ضمان استرداد الأموال ودعم فني متكامل' : 'Money-Back Guarantee & 24/7 Dedicated Support'}</span>
              </div>
            </form>
          )}

          {/* STEP 2: PAYPAL SMART BUTTONS (PAYPAL & CREDIT/DEBIT CARDS) */}
          {currentStep === 'payment' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="text-xs font-bold text-slate-900">
                  {isAr ? 'اختر طريقة الدفع المفضلة لديك:' : 'Choose your payment method:'}
                </div>
                <button
                  onClick={() => setCurrentStep('details')}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  {isAr ? 'تعديل البيانات' : 'Edit details'}
                </button>
              </div>

              {/* Supported Cards Visual Header */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-[11px]">
                  {isAr ? 'نقبل جميع البطاقات وحسابات باي بال:' : 'Accepted Cards & Methods:'}
                </span>
                <div className="flex items-center gap-2 text-slate-700 font-bold text-[11px]">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Visa</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Mastercard</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">PayPal</span>
                </div>
              </div>

              {/* Loading Spinner */}
              {sdkLoading && (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <span className="text-xs font-semibold">
                    {isAr ? 'جاري تجهيز بوابة الدفع الآمنة...' : 'Connecting to secure PayPal payment gateway...'}
                  </span>
                </div>
              )}

              {/* Processing Overlay */}
              {processing && (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-blue-700">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  <span className="text-sm font-bold">
                    {isAr ? 'جاري تأكيد عملية الدفع وتوثيق العملية...' : 'Authorizing payment and issuing license...'}
                  </span>
                </div>
              )}

              {/* Official PayPal Buttons Container */}
              <div 
                ref={paypalContainerRef} 
                id="paypal-button-container"
                className={`min-h-[140px] transition-opacity duration-300 ${sdkLoading || processing ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
              />

              <div className="text-[11px] text-center text-slate-400 leading-relaxed pt-2">
                {isAr
                  ? 'اضغط على زر (Debit or Credit Card) للدفع المباشر ببطاقتك البنكية، أو زر (PayPal) للدفع بحسابك.'
                  : 'Click "Debit or Credit Card" to pay directly with Visa/Mastercard, or "PayPal" to pay with your account.'}
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS STATE & RECEIPT */}
          {currentStep === 'success' && (
            <div className="text-center py-6 space-y-5 animate-scaleUp">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900">
                  {isAr ? 'تمت عملية الدفع بنجاح!' : 'Payment Completed Successfully!'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {isAr
                    ? 'شكراً لثقتكم بشركة ات لوبس. تم تسجيل طلبك وإصدار الإيصال بنجاح.'
                    : 'Thank you for choosing AT Loops. Your order has been placed and confirmed.'}
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2.5 text-left rtl:text-right">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">{isAr ? 'رقم الطلب:' : 'Order Number:'}</span>
                  <span className="font-mono font-bold text-slate-900">{completedOrder?.order_number || 'ATL-SUCCESS'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">{isAr ? 'المنتج:' : 'Product:'}</span>
                  <span className="font-bold text-slate-900">{productName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">{isAr ? 'المبلغ المدفوع:' : 'Amount Paid:'}</span>
                  <span className="font-bold text-emerald-600">{priceDisplay} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isAr ? 'حالة المعاملة:' : 'Status:'}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    {isAr ? 'مدفوع ومكتمل' : 'PAID & VERIFIED'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/201112194828?text=${encodeURIComponent(`مرحباً ات لوبس، قمت بالدفع للطلب رقم ${completedOrder?.order_number || ''} لمنتج ${productName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <span>{isAr ? 'تأكيد التسليم عبر الواتساب' : 'Contact Support on WhatsApp'}</span>
                </a>
                <button
                  onClick={onClose}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs py-3 px-6 rounded-xl transition-colors"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
