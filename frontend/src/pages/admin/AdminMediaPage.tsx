import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { MediaAsset } from '../../types';
import { Upload, Trash2, Search, Copy, Check, Image as ImageIcon, FileText, HardDrive } from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  const [altEn, setAltEn] = useState('');
  const [altAr, setAltAr] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const res = await api.adminGetMedia(search);
      setMediaList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await api.adminUploadMedia(file, altEn, altAr);
      setAltEn('');
      setAltAr('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadMedia();
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await api.adminDeleteMedia(id);
      loadMedia();
    } catch (err: any) {
      alert(err.message || 'Error deleting media');
    }
  };

  const copyUrl = (id: number, path: string) => {
    const fullUrl = path.startsWith('http') ? path : `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filteredMedia = mediaList.filter(m => 
    m.original_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.alt_text_en?.toLowerCase().includes(search.toLowerCase()) ||
    m.alt_text_ar?.includes(search)
  );

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Media Assets Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload, optimize, and organize enterprise media assets, icons, and document attachments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className={`
            inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 cursor-pointer
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
          `}>
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Asset'}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleUpload}
              className="hidden"
              accept="image/*,application/pdf"
            />
          </label>
        </div>
      </div>

      {/* Upload Details / Metadata fields */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-blue-600" />
          Pre-Upload Metadata (Optional SEO Alt Tags)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Default Alt Text (English)..."
            value={altEn}
            onChange={(e) => setAltEn(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <input
            type="text"
            dir="rtl"
            placeholder="النص البديل الافتراضي (عربي)..."
            value={altAr}
            onChange={(e) => setAltAr(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
          />
        </div>
      </div>

      {/* Search & Statistics */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by file name or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
          Total Assets: <span className="text-slate-900">{filteredMedia.length}</span>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
          Loading media assets...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No media assets found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload images, company logos, case study graphics or client documents to manage them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((asset) => {
            const isImage = asset.mime_type.startsWith('image/');
            const previewUrl = asset.path.startsWith('http') ? asset.path : asset.path;
            
            return (
              <div 
                key={asset.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Thumbnail Area */}
                <div className="relative aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img
                      src={previewUrl}
                      alt={asset.alt_text_en || asset.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-slate-400" />
                  )}

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyUrl(asset.id, asset.path)}
                      className="p-2 bg-white text-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition-colors shadow-md"
                      title="Copy URL"
                    >
                      {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-2 bg-white text-slate-800 rounded-lg hover:bg-red-600 hover:text-white transition-colors shadow-md"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-3 bg-white">
                  <div className="font-semibold text-xs text-slate-900 truncate" title={asset.original_name}>
                    {asset.original_name}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-medium">
                    <span>{formatFileSize(asset.file_size)}</span>
                    <span className="uppercase">{asset.mime_type.split('/')[1]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
