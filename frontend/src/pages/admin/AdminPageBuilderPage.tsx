import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Page, PageSection } from '../../types';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, 
  RotateCcw, Monitor, Tablet, Smartphone, Check, 
  Sparkles, Layers, Layers2, Copy, AlertCircle 
} from 'lucide-react';

export const AdminPageBuilderPage: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('ar');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const list = await api.adminGetPages();
      setPages(list);
      if (list.length > 0 && !selectedPageId) {
        setSelectedPageId(list[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPageId) {
      api.adminGetPage(selectedPageId)
        .then((p) => {
          setCurrentPage(p);
          setSections(p.sections || []);
        })
        .catch(console.error);
    }
  }, [selectedPageId]);

  const blockTemplates = [
    { type: 'hero', name: 'Hero Banner Section', defaultContentEn: { badge: 'Enterprise Technology', title: 'Empowering Growth with Bespoke Systems', subtitle: 'Transform your enterprise with resilient software architecture.', primary_cta_text: 'Request Quote', primary_cta_link: '/request-quote' }, defaultContentAr: { badge: 'تكنولوجيا بدون متاهات', title: 'نطور برمجيات ذكية تقود نمو أعمالك ومؤسستك', subtitle: 'شريكك التقني المتكامل لتطوير الأنظمة المحاسبية والإدارية والبنية التحتية.', primary_cta_text: 'طلب عرض أسعار', primary_cta_link: '/request-quote' } },
    { type: 'stats_counter', name: 'Key Metrics & Statistics', defaultContentEn: { items: [{ number: '100+', label: 'Deployments' }, { number: '99.9%', label: 'Uptime' }] }, defaultContentAr: { items: [{ number: '+١٠٠', label: 'مشروع معتمد' }, { number: '٩٩.٩٪', label: 'جاهزية السيرفرات' }] } },
    { type: 'services_grid', name: 'Services Grid Block', defaultContentEn: { heading: 'Our Core Capabilities', subheading: 'Explore custom software and infrastructure solutions' }, defaultContentAr: { heading: 'أبرز خدماتنا التقنية', subheading: 'استكشف البرمجيات المخصصة وحلول البنية التحتية' } },
    { type: 'solutions_catalog', name: 'Software Solutions Preview', defaultContentEn: { heading: 'Ready Deployable Solutions', subheading: 'Battle-tested software suites for enterprise' }, defaultContentAr: { heading: 'الحلول البرمجية الجاهزة', subheading: 'أنظمة معتمدة ومجهزة للتشغيل الفوري في شركتك' } },
    { type: 'portfolio_grid', name: 'Portfolio & Case Studies', defaultContentEn: { heading: 'Proven Enterprise Deployments', subheading: 'Real systems engineered for industry leaders' }, defaultContentAr: { heading: 'سابقة أعمالنا المعتمدة', subheading: 'مشاريع حقيقية ونجاحات مستمرة مع شركائنا' } },
    { type: 'cta_banner', name: 'Call to Action Banner', defaultContentEn: { title: 'Ready to Transform Your Systems?', cta_text: 'Request Consultation', cta_link: '/contact-us' }, defaultContentAr: { title: 'جاهز لبدء رحلة التحول الرقمي وتطوير أعمالك؟', cta_text: 'اطلب استشارة مجانية', cta_link: '/contact-us' } },
  ];

  const handleAddBlock = (template: typeof blockTemplates[0]) => {
    const newSection: PageSection = {
      block_type: template.type,
      sort_order: sections.length + 1,
      content_en: { ...template.defaultContentEn },
      content_ar: { ...template.defaultContentAr },
      settings: { bg_theme: 'white', layout: 'standard' },
      is_active: true,
    };
    setSections([...sections, newSection]);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSections(updated);
  };

  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to remove this section?')) {
      setSections(sections.filter((_, i) => i !== index));
    }
  };

  const handleSaveAndPublish = async () => {
    if (!selectedPageId) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      await api.adminSavePageSections(selectedPageId, sections, 'Published via Visual Page Builder');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadPages();
    } catch (err: any) {
      alert(err.message || 'Error saving page blocks');
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreRevision = async (revId: number) => {
    if (!selectedPageId) return;
    if (!confirm('Restore this revision? Current draft will be overwritten.')) return;

    try {
      const res = await api.adminRestoreRevision(selectedPageId, revId);
      setSections(res.data.sections || []);
      alert('Revision restored successfully!');
    } catch (err: any) {
      alert(err.message || 'Error restoring revision');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading Page Builder...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Editing Page</span>
            <select
              value={selectedPageId || ''}
              onChange={(e) => setSelectedPageId(Number(e.target.value))}
              className="font-bold text-base text-slate-900 border-none bg-transparent focus:ring-0 p-0 cursor-pointer"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title_en} ({p.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="w-px h-8 bg-slate-200"></div>

          {/* Language Tab Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('ar')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'ar' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              العربية (AR)
            </button>
            <button
              onClick={() => setActiveTab('en')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Responsive Preview Toggles */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => { setPreviewMode('desktop'); setShowPreviewModal(true); }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900"
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setPreviewMode('tablet'); setShowPreviewModal(true); }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900"
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setPreviewMode('mobile'); setShowPreviewModal(true); }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900"
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleSaveAndPublish}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Published to Site!' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Reusable Block Palette */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
              Add New Sections
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Select an approved block to inject into your page layout:
            </p>

            <div className="space-y-2">
              {blockTemplates.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddBlock(t)}
                  className="w-full text-start p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-between text-xs font-bold text-slate-800 group"
                >
                  <span>{t.name}</span>
                  <Plus className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Revisions History Drawer */}
          {currentPage?.revisions && currentPage.revisions.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                <span>Revisions & Rollback</span>
              </h3>
              <div className="space-y-2">
                {currentPage.revisions.slice(0, 4).map((rev) => (
                  <div key={rev.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 block text-[11px]">{rev.revision_title}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.created_at).toLocaleDateString()} by {rev.user?.name || 'Admin'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="text-[10px] font-bold text-blue-600 hover:underline px-2 py-1 bg-white rounded border border-slate-200"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center / Right Column: Canvas of Reorderable Blocks */}
        <div className="lg:col-span-3 space-y-4">
          {sections.map((section, index) => {
            const currentContent = activeTab === 'ar' ? section.content_ar : section.content_en;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative group hover:border-blue-400 transition-all"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-extrabold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                        {section.block_type.replace('_', ' ')}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Editing: {activeTab === 'ar' ? 'العربية' : 'English'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Section Form Fields Editor */}
                <div className="space-y-3">
                  {Object.keys(currentContent || {}).map((fieldKey) => {
                    const val = currentContent[fieldKey];
                    const isLongText = typeof val === 'string' && val.length > 50;
                    const isArray = Array.isArray(val);

                    if (isArray) return null; // Array sub-items handled cleanly

                    return (
                      <div key={fieldKey}>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          {fieldKey.replace('_', ' ')}
                        </label>
                        {isLongText ? (
                          <textarea
                            rows={3}
                            value={val || ''}
                            onChange={(e) => {
                              const updated = [...sections];
                              if (activeTab === 'ar') {
                                updated[index].content_ar[fieldKey] = e.target.value;
                              } else {
                                updated[index].content_en[fieldKey] = e.target.value;
                              }
                              setSections(updated);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                            dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                          />
                        ) : (
                          <input
                            type="text"
                            value={val || ''}
                            onChange={(e) => {
                              const updated = [...sections];
                              if (activeTab === 'ar') {
                                updated[index].content_ar[fieldKey] = e.target.value;
                              } else {
                                updated[index].content_en[fieldKey] = e.target.value;
                              }
                              setSections(updated);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                            dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {sections.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
              <Layers2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-slate-800">This page has no sections yet</h3>
              <p className="text-xs text-slate-400 mt-1">Select any block from the left palette to begin building.</p>
            </div>
          )}
        </div>

      </div>

      {/* Responsive Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-4 text-white text-xs mb-4">
            <span className="font-bold">Device Preview:</span>
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`px-3 py-1 rounded-lg ${previewMode === 'desktop' ? 'bg-blue-600' : 'bg-slate-800'}`}
            >
              Desktop (100%)
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`px-3 py-1 rounded-lg ${previewMode === 'tablet' ? 'bg-blue-600' : 'bg-slate-800'}`}
            >
              Tablet (768px)
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1 rounded-lg ${previewMode === 'mobile' ? 'bg-blue-600' : 'bg-slate-800'}`}
            >
              Mobile (375px)
            </button>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="text-red-400 font-bold px-2 py-1 rounded hover:bg-red-950/40"
            >
              Close
            </button>
          </div>

          <div
            className="bg-white rounded-3xl overflow-y-auto max-h-[80vh] shadow-2xl transition-all duration-300"
            style={{
              width: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '375px',
              maxWidth: '1200px',
            }}
          >
            <div className="p-8 space-y-12" dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>
              {sections.map((s, idx) => {
                const c = activeTab === 'ar' ? s.content_ar : s.content_en;
                return (
                  <div key={idx} className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-2">
                      {s.block_type}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{c.title || c.heading || 'Section Title'}</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">{c.subtitle || c.subheading || ''}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
