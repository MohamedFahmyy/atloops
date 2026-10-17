import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { PortfolioProject } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Search, FolderGit2, ExternalLink } from 'lucide-react';

export const AdminPortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.adminGetPortfolio();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject({
      slug: '',
      title_en: '',
      title_ar: '',
      client_name_en: '',
      client_name_ar: '',
      industry_en: 'Enterprise Solutions',
      industry_ar: 'حلول الشركات والمؤسسات',
      short_desc_en: '',
      short_desc_ar: '',
      description_en: '',
      description_ar: '',
      challenge_en: '',
      challenge_ar: '',
      solution_en: '',
      solution_ar: '',
      results_en: ['Enhanced operations by 40%', 'Zero downtime migration'],
      results_ar: ['تحسين كفاءة التشغيل بنسبة 40%', 'انتقال بدون أي توقف عن العمل'],
      tech_stack: ['React', 'Laravel', 'MySQL'],
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      live_url: '',
      is_featured: true,
      is_active: true,
      sort_order: 0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: PortfolioProject) => {
    setEditingProject({ ...p });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this case study / portfolio project?')) return;
    try {
      await api.adminDeletePortfolio(id);
      loadProjects();
    } catch (err: any) {
      alert(err.message || 'Error deleting project');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      await api.adminSavePortfolio(editingProject, editingProject.id);
      setModalOpen(false);
      setEditingProject(null);
      loadProjects();
    } catch (err: any) {
      alert(err.message || 'Error saving portfolio item');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title_en?.toLowerCase().includes(search.toLowerCase()) ||
    p.title_ar?.includes(search) ||
    p.client_name_en?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Portfolio & Case Studies Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage verified client deployments, enterprise case studies, and engineering deliverables.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Case Study
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, client, or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading portfolio projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No portfolio projects found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3.5 px-6">Project & Client</th>
                  <th className="py-3.5 px-6">Industry</th>
                  <th className="py-3.5 px-6">Tech Stack</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80'}
                          alt={project.title_en}
                          className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            {project.title_en}
                            {project.live_url && (
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-medium" dir="rtl">
                            {project.title_ar}
                          </div>
                          <div className="text-xs text-blue-600 font-semibold mt-0.5">
                            Client: {project.client_name_en || 'Confidential Enterprise'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {project.industry_en}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.tech_stack?.map((tech, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {project.is_active ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                            <XCircle className="w-3.5 h-3.5" /> Draft
                          </span>
                        )}
                        {project.is_featured && (
                          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  {editingProject.id ? 'Edit Case Study' : 'Create Case Study'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. aswaq-basra-platform"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Live Project URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.live_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="https://client-portal.com"
                  />
                </div>
              </div>

              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Project Title (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title_en || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title_en: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="Aswaq Basra Multi-Vendor Platform"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Project Title (Arabic)
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={editingProject.title_ar || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title_ar: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-sans"
                    placeholder="منصة أسواق البصرة للتجارة الرقمية"
                  />
                </div>
              </div>

              {/* Client & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Client Name (English)
                  </label>
                  <input
                    type="text"
                    value={editingProject.client_name_en || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client_name_en: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Client Name (Arabic)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingProject.client_name_ar || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client_name_ar: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-sans"
                  />
                </div>
              </div>

              {/* Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Industry (English)
                  </label>
                  <input
                    type="text"
                    value={editingProject.industry_en || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, industry_en: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Industry (Arabic)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingProject.industry_ar || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, industry_ar: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-sans"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Short Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.short_desc_en || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, short_desc_en: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Short Description (Arabic)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={editingProject.short_desc_ar || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, short_desc_ar: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-sans"
                  />
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Challenge & Objectives (English)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.challenge_en || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, challenge_en: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Solution & Architectural Approach (English)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.solution_en || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, solution_en: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Thumbnail & Tech Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.thumbnail || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingProject.tech_stack?.join(', ') || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, tech_stack: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="React, Laravel, MySQL, Redis"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProject.is_featured || false}
                    onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  Featured Case Study
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProject.is_active ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  Active / Published
                </label>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20"
                >
                  Save Project
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
