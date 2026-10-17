import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Product, ProductCategory } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, ShoppingBag } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const [prods, cats] = await Promise.all([
        api.adminGetProducts(),
        api.getProductCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct({
      slug: '',
      name_en: '',
      name_ar: '',
      tagline_en: '',
      tagline_ar: '',
      short_desc_en: '',
      short_desc_ar: '',
      description_en: '',
      description_ar: '',
      features_en: ['Multi-currency', 'Role-based access'],
      features_ar: ['تعدد العملات', 'صلاحيات مستخدمين'],
      badge: 'New',
      price: 999,
      original_price: 1299,
      pricing_model: 'quote',
      supported_platforms: ['Web', 'Cloud', 'Mobile'],
      is_featured: false,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this software product?')) return;
    try {
      await api.adminDeleteProduct(id);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await api.adminSaveProduct(editingProduct, editingProduct.id);
      setModalOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Software Solutions Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage deployable software products, pricing, badges, and features ({products.length} products)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Solution</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 text-start">Software Name (EN & AR)</th>
                <th className="p-4 text-start">Category</th>
                <th className="p-4 text-start">Badge</th>
                <th className="p-4 text-end">Price</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">
                    <div>{p.name_en}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{p.name_ar}</div>
                  </td>
                  <td className="p-4 capitalize">{p.category?.name_en || 'General'}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {p.badge || 'Standard'}
                    </span>
                  </td>
                  <td className="p-4 text-end font-bold text-slate-900">
                    {p.price ? `$${p.price}` : 'Quote'}
                  </td>
                  <td className="p-4 text-center">
                    {p.is_active ? (
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
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              {editingProduct.id ? 'Edit Software Solution' : 'Add New Software Solution'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_en || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name (Arabic) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_ar || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    placeholder="Best Seller, New"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    placeholder="999"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description (English) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProduct.short_desc_en || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_desc_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description (Arabic) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProduct.short_desc_ar || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_desc_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  dir="rtl"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Active & In Catalog</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Save Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
