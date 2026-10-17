import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Service, Product, PortfolioProject } from '../../types';
import { Search, ArrowRight, Layers, ShoppingCart, Code2 } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { locale, t } = useLanguage();

  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      api.getServices(),
      api.getProducts({ search: query }),
      api.getPortfolio(),
    ])
      .then(([srvs, prods, ports]) => {
        const q = query.toLowerCase();
        setServices(srvs.filter(s => 
          s.title_en.toLowerCase().includes(q) || 
          s.title_ar.includes(q) ||
          s.short_desc_en.toLowerCase().includes(q) ||
          s.short_desc_ar.includes(q)
        ));
        setProducts(prods);
        setProjects(ports.filter(p => 
          p.title_en.toLowerCase().includes(q) || 
          p.title_ar.includes(q)
        ));
      })
      .finally(() => setLoading(false));
  }, [query]);

  const totalResults = services.length + products.length + projects.length;

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'نتائج البحث الموحد' : 'Unified Search Directory'}
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {locale === 'ar' ? `نتائج البحث عن: "${query}"` : `Search Results for: "${query}"`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {totalResults} {locale === 'ar' ? 'نتيجة متطابقة' : 'matching records found'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : totalResults === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">
              {locale === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : 'No Direct Matches'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              {locale === 'ar' ? 'جرب البحث بكلمات أخرى مثل: ERP، POS، مستودعات، مواقع...' : 'Try keywords such as ERP, POS, retail, cloud...'}
            </p>
            <Link to="/services" className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl">
              {t('cta.view_all_services')}
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Services Results */}
            {services.length > 0 && (
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 text-blue-600">
                  {locale === 'ar' ? 'الخدمات ذات الصلة' : 'Matching Services'} ({services.length})
                </h2>
                <div className="divide-y divide-slate-100">
                  {services.map((s) => (
                    <div key={s.slug} className="py-3 flex items-center justify-between">
                      <div>
                        <Link to={`/services/${s.slug}`} className="font-bold text-slate-900 hover:text-blue-600 text-xs">
                          {locale === 'ar' ? s.title_ar : s.title_en}
                        </Link>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {locale === 'ar' ? s.short_desc_ar : s.short_desc_en}
                        </p>
                      </div>
                      <Link to={`/services/${s.slug}`} className="text-xs font-bold text-blue-600 hover:underline">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products Results */}
            {products.length > 0 && (
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 text-emerald-600">
                  {locale === 'ar' ? 'الأنظمة والحلول البرمجية' : 'Software Solutions'} ({products.length})
                </h2>
                <div className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <div key={p.slug} className="py-3 flex items-center justify-between">
                      <div>
                        <Link to={`/products/${p.slug}`} className="font-bold text-slate-900 hover:text-blue-600 text-xs">
                          {locale === 'ar' ? p.name_ar : p.name_en}
                        </Link>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {locale === 'ar' ? p.short_desc_ar : p.short_desc_en}
                        </p>
                      </div>
                      <Link to={`/products/${p.slug}`} className="text-xs font-bold text-blue-600 hover:underline">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Results */}
            {projects.length > 0 && (
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 text-purple-600">
                  {locale === 'ar' ? 'سابقة الأعمال والمشاريع' : 'Portfolio Deployments'} ({projects.length})
                </h2>
                <div className="divide-y divide-slate-100">
                  {projects.map((pr) => (
                    <div key={pr.slug} className="py-3 flex items-center justify-between">
                      <div>
                        <Link to={`/portfolio/${pr.slug}`} className="font-bold text-slate-900 hover:text-blue-600 text-xs">
                          {locale === 'ar' ? pr.title_ar : pr.title_en}
                        </Link>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {locale === 'ar' ? pr.short_desc_ar : pr.short_desc_en}
                        </p>
                      </div>
                      <Link to={`/portfolio/${pr.slug}`} className="text-xs font-bold text-blue-600 hover:underline">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
