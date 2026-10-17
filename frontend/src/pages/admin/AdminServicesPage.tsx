import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Service } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Search, Layers } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.adminGetServices();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingService({
      slug: '',
      icon: 'Code2',
      category: 'software',
      title_en: '',
      title_ar: '',
      short_desc_en: '',
      short_desc_ar: '',
      description_en: '',
      description_ar: '',
      benefits_en: ['High Scalability', 'Enterprise SLA'],
      benefits_ar: ['توسع غير محدود', 'عقود صيانة معتمدة'],
      is_featured: false,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService({ ...s });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.adminDeleteService(id);
      loadServices();
    } catch (err: any) {
      alert(err.message || 'Error deleting service');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      await api.adminSaveService(editingService, editingService.id);
      setModalOpen(false);
      setEditingService(null);
      loadServices();
    } catch (err: any) {
      alert(err.message || 'Error saving service');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Services Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and organize public service offerings ({services.length} items)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 text-start">Service Name (EN & AR)</th>
                <th className="p-4 text-start">Category</th>
                <th className="p-4 text-start">Slug</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">
                    <div>{s.title_en}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{s.title_ar}</div>
                  </td>
                  <td className="p-4 capitalize">{s.category}</td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">{s.slug}</td>
                  <td className="p-4 text-center">
                    {s.is_featured ? (
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">Yes</span>
                    ) : (
                      <span className="text-[10px] text-slate-400">No</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {s.is_active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                        <XCircle className="w-3.5 h-3.5 text-slate-400" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              {editingService.id ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title_en || ''}
                    onChange={(e) => setEditingService({ ...editingService, title_en: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title (Arabic) *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title_ar || ''}
                    onChange={(e) => setEditingService({ ...editingService, title_ar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingService.slug || ''}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingService.category || 'software'}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="software">Software</option>
                    <option value="enterprise">Enterprise ERP</option>
                    <option value="retail">Retail POS</option>
                    <option value="web">Web & Portals</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="hardware">Security CCTV</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description (English) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.short_desc_en || ''}
                  onChange={(e) => setEditingService({ ...editingService, short_desc_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description (Arabic) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.short_desc_ar || ''}
                  onChange={(e) => setEditingService({ ...editingService, short_desc_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Description (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description_en || ''}
                  onChange={(e) => setEditingService({ ...editingService, description_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Description (Arabic) *</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description_ar || ''}
                  onChange={(e) => setEditingService({ ...editingService, description_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  dir="rtl"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.is_featured ?? false}
                    onChange={(e) => setEditingService({ ...editingService, is_featured: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.is_active ?? true}
                    onChange={(e) => setEditingService({ ...editingService, is_active: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Active & Published</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
