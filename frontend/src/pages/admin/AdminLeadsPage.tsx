import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Lead } from '../../types';
import { 
  Users, Search, Download, Filter, MessageSquare, 
  Clock, ShieldCheck, ChevronRight, Phone, Mail, 
  Building2, CheckCircle2, ArrowRight, User, Archive 
} from 'lucide-react';

export const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetLeads({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
      });
      setLeads(res.data || []);
      if (res.data && res.data.length > 0 && !selectedLead) {
        setSelectedLead(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      await api.adminUpdateLeadStatus(leadId, newStatus);
      // Refresh current lead and list
      const updated = await api.adminGetLead(leadId);
      setSelectedLead(updated);
      loadLeads();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleArchive = async (leadId: number) => {
    if (!confirm('Are you sure you want to archive this lead?')) return;
    try {
      await api.adminArchiveLead(leadId);
      setSelectedLead(null);
      loadLeads();
    } catch (err: any) {
      alert(err.message || 'Error archiving lead');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;
    setSubmittingNote(true);

    try {
      await api.adminAddLeadNote(selectedLead.id, newNote);
      setNewNote('');
      const updated = await api.adminGetLead(selectedLead.id);
      setSelectedLead(updated);
    } catch (err: any) {
      alert(err.message || 'Error adding note');
    } finally {
      setSubmittingNote(false);
    }
  };

  const pipelineStages = [
    { key: 'all', label: 'All Inquiries' },
    { key: 'new', label: 'New' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'qualified', label: 'Qualified' },
    { key: 'proposal_sent', label: 'Proposal Sent' },
    { key: 'negotiation', label: 'Negotiation' },
    { key: 'won', label: 'Won' },
    { key: 'lost', label: 'Lost' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Enterprise CRM & Leads Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track inquiries, update sales stages, add internal notes, and export records
          </p>
        </div>

        {/* CSV Export Button */}
        <a
          href={api.adminExportLeadsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export All Leads (CSV)</span>
        </a>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {pipelineStages.map((stage) => (
            <button
              key={stage.key}
              onClick={() => setStatusFilter(stage.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === stage.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadLeads()}
            placeholder="Search by name, company, phone..."
            className="w-full ps-9 pe-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

      </div>

      {/* CRM Main Grid: Left List + Right Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Leads Table/List */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Inquiries ({leads.length})</span>
            <span className="text-[11px] text-slate-400">Click to inspect</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[680px]">
            {leads.map((ld) => {
              const isSelected = selectedLead?.id === ld.id;
              return (
                <div
                  key={ld.id}
                  onClick={() => setSelectedLead(ld)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70 border-s-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-xs text-slate-900">{ld.name}</h4>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ld.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      ld.status === 'won' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ld.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {ld.company ? `${ld.company} • ` : ''}{ld.service_of_interest || 'Inquiry'}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>{ld.phone}</span>
                    <span>{new Date(ld.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}

            {leads.length === 0 && (
              <div className="p-12 text-center text-xs text-slate-400">
                No inquiries matching criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Lead Detail View */}
        <div className="lg:col-span-2">
          {selectedLead ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
              
              {/* Lead Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">{selectedLead.name}</h2>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      ID #{selectedLead.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedLead.company || 'Private Client'} • Source: {selectedLead.source_page || '/contact-us'}
                  </p>
                </div>

                {/* Status Switcher Dropdown & Archive */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Stage:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal_sent">Proposal Sent</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Won / Closed</option>
                    <option value="lost">Lost</option>
                  </select>

                  <button
                    onClick={() => handleArchive(selectedLead.id)}
                    className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center gap-1.5"
                    title="Archive Lead"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>
                </div>
              </div>

              {/* Lead Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Phone Number</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-bold text-slate-800 hover:text-blue-600" dir="ltr">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Email Address</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-bold text-slate-800 hover:text-blue-600 truncate block">
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Target Service</span>
                  <span className="font-bold text-slate-800 block truncate">
                    {selectedLead.service_of_interest || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Estimated Budget</span>
                  <span className="font-bold text-slate-800 block">
                    {selectedLead.estimated_budget || 'Standard'}
                  </span>
                </div>
              </div>

              {/* Customer Message */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Submitted Inquiry Message
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  {selectedLead.message}
                </div>
              </div>

              {/* Internal Notes Thread */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Internal Collaborative Notes</span>
                </h4>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {(selectedLead.notes || []).map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{n.user?.name || 'Advisor'}</span>
                        <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700">{n.note}</p>
                    </div>
                  ))}

                  {(!selectedLead.notes || selectedLead.notes.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No internal notes added yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note or next action step..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingNote}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
                  >
                    {submittingNote ? 'Adding...' : 'Post Note'}
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 text-xs">
              Select an inquiry from the left to view complete details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
