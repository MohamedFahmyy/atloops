import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { BlogPost } from '../../types';
import { ChevronRight, ArrowRight, Clock, Eye, Share2, ArrowLeft } from 'lucide-react';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { locale, t } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getBlogPostBySlug(slug)
      .then((data) => setPost(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
        <Link to="/blog" className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl">
          Back to Blog
        </Link>
      </div>
    );
  }

  const title = locale === 'ar' ? post.title_ar : post.title_en;
  const excerpt = locale === 'ar' ? post.excerpt_ar : post.excerpt_en;
  const content = locale === 'ar' ? post.content_ar : post.content_en;

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-6">
          <Link to="/blog" className="hover:text-blue-600">
            {t('nav.blog')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rtl-flip" />
          <span className="text-slate-800 line-clamp-1">{title}</span>
        </div>

        {/* Article Box */}
        <article className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 pb-4 border-b border-slate-100">
            <span className="flex items-center gap-1.5 font-medium text-blue-600">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time} {locale === 'ar' ? 'دقائق قراءة' : 'min read'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="w-4 h-4" />
              <span>{post.view_count} {locale === 'ar' ? 'مشاهدة' : 'views'}</span>
            </span>
            <span>•</span>
            <span>{post.published_at || 'AT Loops Engineering Team'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
            {title}
          </h1>

          <p className="text-sm font-semibold text-slate-600 bg-slate-50 p-5 rounded-2xl border-s-4 border-blue-600 mb-8 leading-relaxed">
            {excerpt}
          </p>

          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4">
            <p>{content}</p>
          </div>

          {/* Action Box */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                {locale === 'ar' ? 'هل تريد تطبيق هذه المعايير في مؤسستك؟' : 'Ready to Apply These Architectural Standards?'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {locale === 'ar' ? 'تواصل مع مهندسي ات لوبس للاستشارة.' : 'Consult with our engineering team.'}
              </p>
            </div>

            <Link
              to="/request-quote"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-colors"
            >
              {t('cta.consultation')}
            </Link>
          </div>

        </article>

      </div>
    </div>
  );
};
