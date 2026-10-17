import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Product, ProductCategory } from '../../types';
import { PayPalCheckoutModal } from '../../components/checkout/PayPalCheckoutModal';
import { 
  Search, ArrowRight, Check, Sparkles, Filter, 
  ExternalLink, Layers, Laptop, Smartphone, Monitor, CreditCard 
} from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);

  useEffect(() => {
    Promise.all([
      api.getProducts(),
      api.getProductCategories(),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category?.slug === activeCategory;
    const matchesSearch = 
      !searchQuery ||
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_ar.includes(searchQuery) ||
      p.short_desc_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_desc_ar.includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
            {locale === 'ar' ? 'كتالوج الأنظمة والبرمجيات' : 'Enterprise Software Solutions'}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
            {locale === 'ar' ? 'أنظمة مؤسسية معتمدة وجاهزة للتشغيل الفوري' : 'Ready to Launch. Built to Scale.'}
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {locale === 'ar'
              ? 'حلول برمجية متكاملة للشركات، المصانع، المحلات، والأكاديميات تم اختبارها وتطويرها وفق أعلى المعايير القياسية.'
              : 'Configurable business software with verified compliance and enterprise-level reliability.'}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'ar' ? 'بحث في الأنظمة والحلول...' : 'Search software solutions...'}
              className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {locale === 'ar' ? 'الكل' : 'All'}
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCategory(c.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === c.slug
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {locale === 'ar' ? c.name_ar : c.name_en}
              </button>
            ))}
          </div>

        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <div
              key={p.slug}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div className="p-7">
                
                {/* Badges & Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {p.badge || 'Enterprise'}
                  </span>

                  <div className="flex items-baseline gap-1.5">
                    {p.price && (
                      <span className="text-base font-extrabold text-blue-600">
                        ${p.price}
                      </span>
                    )}
                    {p.original_price && (
                      <span className="text-xs text-slate-400 line-through">
                        ${p.original_price}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {locale === 'ar' ? p.name_ar : p.name_en}
                </h3>

                <p className="mt-1 text-xs font-semibold text-blue-600">
                  {locale === 'ar' ? p.tagline_ar : p.tagline_en}
                </p>

                <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {locale === 'ar' ? p.short_desc_ar : p.short_desc_en}
                </p>

                {/* Features Highlights */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  {((locale === 'ar' ? p.features_ar : p.features_en) || []).slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Supported Platforms */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {(p.supported_platforms || ['Web', 'Cloud']).map((plat, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {plat}
                    </span>
                  ))}
                </div>

              </div>

              <div className="p-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/products/${p.slug}`}
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  {t('cta.learn_more')}
                </Link>

                {p.price ? (
                  <button
                    type="button"
                    onClick={() => setCheckoutProduct(p)}
                    className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{locale === 'ar' ? 'شراء أونلاين' : 'Buy Now'}</span>
                  </button>
                ) : (
                  <Link
                    to="/request-quote"
                    className="flex-1 text-center bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs py-2.5 rounded-xl border border-slate-200 transition-colors"
                  >
                    {t('cta.quote')}
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <p className="text-sm text-slate-500 mb-4">No software matching your search criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* PayPal & Credit/Debit Card Checkout Modal */}
      {checkoutProduct && (
        <PayPalCheckoutModal
          product={checkoutProduct}
          isOpen={!!checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
        />
      )}

    </div>
  );
};
