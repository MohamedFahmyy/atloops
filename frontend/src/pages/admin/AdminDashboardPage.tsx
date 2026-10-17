import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Users, Layers, ShoppingBag, FolderGit2, FileEdit, 
  ArrowRight, ShieldCheck, Clock, TrendingUp, AlertCircle 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardMetrics()
      .then((metrics) => setData(metrics))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const counts = data?.counts || {};
  const pipeline = data?.pipeline || {};
  const recentLeads = data?.recent_leads || [];
  const recentLogs = data?.recent_logs || [];

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time database analytics and CRM inquiries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/leads"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            Manage CRM Leads
          </Link>
          <Link
            to="/admin/pages"
            className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
          >
            Visual Page Builder
          </Link>
        </div>
      </div>

      {/* 1. Core Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inquiries</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{counts.leads_total ?? 0}</span>
          <span className="block text-[11px] text-blue-600 font-semibold mt-1">
            {counts.leads_new ?? 0} New Pending
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Services</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{counts.services ?? 0}</span>
          <span className="block text-[11px] text-purple-600 font-semibold mt-1">
            Published Active
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Solutions</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{counts.products ?? 0}</span>
          <span className="block text-[11px] text-emerald-600 font-semibold mt-1">
            Software Catalog
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Portfolio</span>
            <FolderGit2 className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{counts.projects ?? 0}</span>
          <span className="block text-[11px] text-amber-600 font-semibold mt-1">
            Verified Cases
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CMS Pages</span>
            <FileEdit className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{counts.pages ?? 0}</span>
          <span className="block text-[11px] text-sky-600 font-semibold mt-1">
            Builder Pages
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Closed Won</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-600">{counts.leads_won ?? 0}</span>
          <span className="block text-[11px] text-slate-400 font-semibold mt-1">
            Converted Deals
          </span>
        </div>

      </div>

      {/* 2. Pipeline Breakdown Cards */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          CRM Opportunity Pipeline Stages
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {[
            { key: 'new', label: 'New Inquiries', count: pipeline.new ?? 0, color: 'text-blue-600 bg-blue-50' },
            { key: 'contacted', label: 'Contacted', count: pipeline.contacted ?? 0, color: 'text-indigo-600 bg-indigo-50' },
            { key: 'qualified', label: 'Qualified', count: pipeline.qualified ?? 0, color: 'text-purple-600 bg-purple-50' },
            { key: 'proposal_sent', label: 'Proposal Sent', count: pipeline.proposal_sent ?? 0, color: 'text-amber-600 bg-amber-50' },
            { key: 'negotiation', label: 'Negotiation', count: pipeline.negotiation ?? 0, color: 'text-orange-600 bg-orange-50' },
            { key: 'won', label: 'Won / Signed', count: pipeline.won ?? 0, color: 'text-emerald-600 bg-emerald-50' },
            { key: 'lost', label: 'Lost / Closed', count: pipeline.lost ?? 0, color: 'text-slate-600 bg-slate-100' },
          ].map((stage) => (
            <div key={stage.key} className={`p-4 rounded-2xl ${stage.color} border border-transparent`}>
              <span className="block text-2xl font-extrabold">{stage.count}</span>
              <span className="text-[11px] font-bold block mt-1">{stage.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Inquiries & Recent Audit Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Inquiries */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Recent Website Inquiries
            </h3>
            <Link to="/admin/leads" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentLeads.map((ld: any) => (
              <div key={ld.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{ld.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {ld.company ? `${ld.company} • ` : ''}{ld.service_of_interest || 'General'}
                  </p>
                </div>
                <div className="text-end">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ld.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    ld.status === 'won' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ld.status}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">{ld.phone}</span>
                </div>
              </div>
            ))}

            {recentLeads.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">No leads recorded yet.</p>
            )}
          </div>
        </div>

        {/* Audit Log Activity Feed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Administrative Audit Log
          </h3>

          <div className="divide-y divide-slate-100">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-800 block">
                    {log.action}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    By: {log.user?.name || 'System'} ({log.user?.role || 'Admin'})
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {recentLogs.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">No recent audit logs.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
