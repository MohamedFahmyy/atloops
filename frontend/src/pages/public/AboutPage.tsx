import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, CheckCircle2, ArrowRight, Sparkles, 
  MapPin, Users, Award, Code2, Server, HeartHandshake 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { locale, t } = useLanguage();

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'عن ات لوبس' : 'About AT Loops'}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            {locale === 'ar' 
              ? 'دليلك وشريكك التقني الموثوق داخل متاهة التكنولوجيا'
              : 'Navigating The Complexities of Modern Technology for Growing Enterprises'}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {locale === 'ar'
              ? 'انطلقت ات لوبس (At Loops) لتكون شريك النجاح التقني للمؤسسات، المصانع، والشركات في مصر والشرق الأوسط. نحول التحديات المعقدة إلى مسارات عمل رقمية واضحة ومستقرة.'
              : 'At Loops was founded to eliminate technology ambiguity. We partner with business leaders across Egypt and the Gulf to build reliable, scalable digital solutions.'}
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'ar' ? 'قصة ات لوبس وفلسفة العمل' : 'Our Story & Purpose'}
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  {locale === 'ar'
                    ? 'في ظل التطور الرقمي المتسارع، تجد العديد من المؤسسات نفسها غارقة في حلول معقدة أو برمجيات جاهزة لا تلبي متطلباتها الواقعية. نحن في ات لوبس نؤمن بأن التكنولوجيا وجدت لتبسط الحياة وتضاعف الأرباح، لا لتخلق عوائق جديدة.'
                    : 'Too many companies are trapped in disjointed legacy software or off-the-shelf templates that fail to scale. We build systems from first principles, ensuring your operational logic dictates the software—never the reverse.'}
                </p>
                <p>
                  {locale === 'ar'
                    ? 'فريقنا يجمع بين مهندسي البرمجيات المطورين، خبراء البنية التحتية السحابية، ومهندسي الأنظمة الأمنية وشبكات المراقبة، لنقدم لك حلاً شاملاً 360 درجة يبدأ من كابلات الشبكة وحتى أحدث تطبيقات الويب والموبايل.'
                    : 'Our interdisciplinary team combines experienced backend software architects, cloud engineers, and IT specialists to deliver comprehensive end-to-end solutions.'}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <div>
                  <span className="block text-2xl font-extrabold text-blue-600">3+</span>
                  <span className="text-xs text-slate-500">{locale === 'ar' ? 'سنوات من الريادة' : 'Years Track Record'}</span>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <span className="block text-2xl font-extrabold text-blue-600">100+</span>
                  <span className="text-xs text-slate-500">{locale === 'ar' ? 'مشروع مكتمل' : 'Completed Projects'}</span>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <span className="block text-2xl font-extrabold text-blue-600">99.9%</span>
                  <span className="text-xs text-slate-500">{locale === 'ar' ? 'جاهزية السيرفرات' : 'System Availability'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden border border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-slate-100">
                {locale === 'ar' ? 'ركائز الجودة في ات لوبس' : 'Core Operating Principles'}
              </h3>
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <h4 className="font-bold text-blue-300 mb-1">{locale === 'ar' ? 'الشفافية التامة' : 'Absolute Transparency'}</h4>
                  <p className="text-slate-400">{locale === 'ar' ? 'تسليم كود برمجي نظيف ووثائق هندسية كاملة دون أي غموض.' : 'Full source code clarity, structured documentation, and zero vendor lock-in.'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <h4 className="font-bold text-cyan-300 mb-1">{locale === 'ar' ? 'الاستمرارية والدعم الفعلي' : 'Long-Term Reliability'}</h4>
                  <p className="text-slate-400">{locale === 'ar' ? 'علاقاتنا مع العملاء تمتد لسنوات بفضل الدعم الفني السريع والمتابعة اليومية.' : 'Dedicated technical support SLAs with certified response times.'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <h4 className="font-bold text-emerald-300 mb-1">{locale === 'ar' ? 'التوافق القانوني والضريبي' : 'Regulatory Compliance'}</h4>
                  <p className="text-slate-400">{locale === 'ar' ? 'أنظمتنا معتمدة للربط مع الفاتورة والإيصال الإلكتروني المصري.' : 'Compliant with Egyptian Tax Authority e-invoicing standards.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Presence Section */}
        <div className="bg-slate-900 text-white rounded-3xl p-10 border border-slate-800 text-center">
          <MapPin className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold">
            {locale === 'ar' ? 'المقر الإقليمي لشركة ات لوبس' : 'Regional Headquarters'}
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            {locale === 'ar'
              ? '٧٢ شارع جامعة الدول العربية - العجوزة - محافظة الجيزة، جمهورية مصر العربية.'
              : '72 Arab League Street - Agouza - Giza Governorate, Egypt.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact-us"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg"
            >
              {t('nav.contact')}
            </Link>
            <Link
              to="/book-consultation"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl border border-slate-700"
            >
              {t('cta.consultation')}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
