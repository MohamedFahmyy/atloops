import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Settings, Save, CheckCircle2, Building2, Phone, Mail, Globe, Share2, Search, Bell } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.adminUpdateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading enterprise configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Global Enterprise Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure company identity, contact channels, social networks, and SEO defaults.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Settings Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save Settings'}
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Brand & Corporate Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            Corporate Identity & Brand
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Company Name (English)
              </label>
              <input
                type="text"
                value={settings.site_name_en || 'AT LOOPS'}
                onChange={(e) => handleChange('site_name_en', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Company Name (Arabic)
              </label>
              <input
                type="text"
                dir="rtl"
                value={settings.site_name_ar || 'إيه تي لوبس'}
                onChange={(e) => handleChange('site_name_ar', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-sans focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tagline / Slogan (English)
              </label>
              <input
                type="text"
                value={settings.tagline_en || 'Engineering Enterprise Digital Transformation & Modern Cloud Software'}
                onChange={(e) => handleChange('tagline_en', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tagline / Slogan (Arabic)
              </label>
              <input
                type="text"
                dir="rtl"
                value={settings.tagline_ar || 'هندسة التحول الرقمي وحلول البرمجيات المؤسسية السحابية'}
                onChange={(e) => handleChange('tagline_ar', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-sans"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-4 h-4 text-blue-600" />
            Contact Channels & Regional Office
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Primary Phone Number
              </label>
              <input
                type="text"
                value={settings.contact_phone || '+201112194828'}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Direct WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || '+201112194828'}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Official Inquiries Email
              </label>
              <input
                type="email"
                value={settings.contact_email || 'contact@atloops.com'}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Corporate Address (English)
              </label>
              <input
                type="text"
                value={settings.address_en || '72 Arab League Street, Agouza, Giza, Egypt'}
                onChange={(e) => handleChange('address_en', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Corporate Address (Arabic)
              </label>
              <input
                type="text"
                dir="rtl"
                value={settings.address_ar || '72 شارع جامعة الدول العربية، العجوزة، الجيزة، مصر'}
                onChange={(e) => handleChange('address_ar', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-sans"
              />
            </div>
          </div>
        </div>

        {/* Social & Business Channels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Share2 className="w-4 h-4 text-blue-600" />
            Social & Enterprise Networks
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={settings.social_linkedin || 'https://www.linkedin.com/company/atloops'}
                onChange={(e) => handleChange('social_linkedin', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Twitter / X
              </label>
              <input
                type="url"
                value={settings.social_twitter || 'https://x.com/atloops'}
                onChange={(e) => handleChange('social_twitter', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                GitHub
              </label>
              <input
                type="url"
                value={settings.social_github || 'https://github.com/atloops'}
                onChange={(e) => handleChange('social_github', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={settings.social_facebook || 'https://facebook.com/atloops'}
                onChange={(e) => handleChange('social_facebook', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Global SEO Defaults */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Search className="w-4 h-4 text-blue-600" />
            Global SEO Defaults
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Default Meta Title (English)
              </label>
              <input
                type="text"
                value={settings.meta_title_en || 'AT LOOPS — Enterprise Software, Cloud & Digital Transformation'}
                onChange={(e) => handleChange('meta_title_en', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Default Meta Title (Arabic)
              </label>
              <input
                type="text"
                dir="rtl"
                value={settings.meta_title_ar || 'إيه تي لوبس — البرمجيات المؤسسية والحلول السحابية والتحول الرقمي'}
                onChange={(e) => handleChange('meta_title_ar', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Default Meta Description (English)
              </label>
              <textarea
                rows={3}
                value={settings.meta_desc_en || 'AT LOOPS delivers enterprise software engineering, bespoke ERP/CRM systems, cloud solutions, and IT infrastructure across Egypt and the Gulf.'}
                onChange={(e) => handleChange('meta_desc_en', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Default Meta Description (Arabic)
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={settings.meta_desc_ar || 'تقدم إيه تي لوبس هندسة برمجيات المؤسسات، أنظمة ERP و CRM المخصصة، الحلول السحابية والبنية التحتية لتكنولوجيا المعلومات في مصر والخليج العربي.'}
                onChange={(e) => handleChange('meta_desc_ar', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-sans"
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
