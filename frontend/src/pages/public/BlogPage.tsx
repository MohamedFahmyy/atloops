import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { BlogPost } from '../../types';
import { Clock, ArrowRight, BookOpen, Calendar } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback initial thought leadership articles if none are seeded yet
  const fallbackArticles: BlogPost[] = [
    {
      id: 1,
      slug: 'egyptian-electronic-invoicing-erp-integration',
      title_en: 'How to Seamlessly Integrate ERP with Egyptian E-Invoicing (ETA)',
      title_ar: 'الدليل العملي لربط أنظمة ERP مع منظومة الفاتورة والإيصال الإلكتروني بمصر',
      excerpt_en: 'A step-by-step technical architectural guide on digital signature USB tokens, ETA SDK endpoints, and handling tax reconciliation.',
      excerpt_ar: 'شرح تقني تفصيلي لخطوات ربط برنامجك المحاسبي مع مصلحة الضرائب المصرية، التوقيع الإلكتروني، وتفادي أخطاء الرفض الشائعة.',
      content_en: 'Electronic invoicing in Egypt is no longer optional...',
      content_ar: 'أصبحت منظومة الفاتورة الإلكترونية ركيزة أساسية لأي مؤسسة تجارية أو صناعية في مصر...',
      reading_time: 6,
      view_count: 420,
      published_at: '2026-03-15',
    },
    {
      id: 2,
      slug: 'offline-pos-architecture-retail',
      title_en: 'Architecting Offline-First Retail POS Without Data Conflicts',
      title_ar: 'هندسة أنظمة نقاط البيع POS للعمل بدون إنترنت وحل تضارب المخزون',
      excerpt_en: 'Why offline resilience is essential for supermarkets, and how local SQLite queues sync with central MySQL backends reliably.',
      excerpt_ar: 'كيف تصمم سيستم كاشير يستمر في البيع بدون توقف عند انقطاع الإنترنت مع مزامنة الجرد تلقائياً فور عودة الاتصال.',
      content_en: 'Retail downtime costs thousands per minute...',
      content_ar: 'توقف الكاشير أثناء أوقات الذروة يعني خسارة مباشرة للمبيعات وثقة العملاء...',
      reading_time: 5,
      view_count: 310,
      published_at: '2026-03-22',
    },
    {
      id: 3,
      slug: 'cloud-server-hardening-disaster-recovery',
      title_en: 'Cloud Server Hardening: Protecting Enterprise Systems from Ransomware',
      title_ar: 'تأمين السيرفرات السحابية وخطط الاستعادة السريعة للبيانات في الشركات',
      excerpt_en: 'Essential firewall hardening, automated encrypted off-site backups, and least-privilege database permissions.',
      excerpt_ar: 'أفضل الممارسات لتأمين خوادم لينكس، الجدار الناري، والنسخ الاحتياطي التلقائي المشفر للحماية من فيروسات الفدية.',
      content_en: 'Data security is the foundation of digital continuity...',
      content_ar: 'أمان البيانات واستمرارية عمل السيرفرات هما صمام الأمان لأي مؤسسة رقمية...',
      reading_time: 7,
      view_count: 280,
      published_at: '2026-04-02',
    },
  ];

  useEffect(() => {
    api.getBlogPosts()
      .then((data) => {
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(fallbackArticles);
        }
      })
      .catch(() => setPosts(fallbackArticles))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'المدونة والمقالات التقنية' : 'Engineering Insights & Knowledge'}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
            {locale === 'ar' ? 'مقالات وأدلة هندسية حول التحول الرقمي' : 'Technical Architecture & Digital Transformation'}
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {locale === 'ar'
              ? 'نشارك خبراتنا في تطوير البرمجيات المعقدة، تأمين السيرفرات، والربط الضريبي لمساعدة قيادات الأعمال على اتخاذ قرارات تقنية صائبة.'
              : 'Actionable guidance on software architecture, tax integration, cloud security, and operational scaling.'}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div className="p-7">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{post.reading_time} {locale === 'ar' ? 'دقائق قراءة' : 'min read'}</span>
                  </span>
                  <span>{post.published_at || 'Recent'}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {locale === 'ar' ? post.title_ar : post.title_en}
                </h3>

                <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {locale === 'ar' ? post.excerpt_ar : post.excerpt_en}
                </p>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <span>{locale === 'ar' ? 'قراءة المقال بالكامل' : 'Read Full Article'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                </Link>

                <span className="text-[11px] text-slate-400">
                  {post.view_count} views
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};
