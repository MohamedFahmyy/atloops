<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadNote;
use App\Models\LeadActivity;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminLeadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (!$request->user()->hasPermission('leads.view')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to view CRM leads.'], 403);
        }

        $query = Lead::with('assignedUser:id,name')->latest();

        // Archived filter (default: non-archived)
        if ($request->boolean('archived', false)) {
            $query->where('is_archived', true);
        } else {
            $query->where('is_archived', false);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('company', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%");
            });
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->paginate(20),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->hasPermission('leads.view')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to view this lead.'], 403);
        }

        $lead = Lead::with(['assignedUser:id,name', 'notes.user:id,name', 'activities.user:id,name'])->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $lead]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->hasPermission('leads.manage')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to update lead status.'], 403);
        }

        $request->validate([
            'status' => 'required|in:new,contacted,qualified,proposal_sent,negotiation,won,lost',
        ]);

        $lead = Lead::findOrFail($id);
        $oldStatus = $lead->status;
        $lead->status = $request->status;
        $lead->save();

        LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()->id,
            'action' => 'status_changed',
            'description' => "Status changed from {$oldStatus} to {$lead->status} by {$request->user()->name}",
        ]);

        return response()->json(['status' => 'success', 'data' => $lead]);
    }

    public function assign(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->hasPermission('leads.manage')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to assign leads.'], 403);
        }

        $request->validate([
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $lead = Lead::findOrFail($id);
        $lead->assigned_to = $request->assigned_to;
        $lead->save();

        LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()->id,
            'action' => 'lead_assigned',
            'description' => "Lead assigned to user #{$request->assigned_to} by {$request->user()->name}",
        ]);

        return response()->json(['status' => 'success', 'data' => $lead]);
    }

    public function addNote(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->hasPermission('leads.manage')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to add notes to leads.'], 403);
        }

        $request->validate([
            'note' => 'required|string|max:2000',
        ]);

        $lead = Lead::findOrFail($id);

        $note = LeadNote::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()->id,
            'note' => $request->note,
        ]);

        LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()->id,
            'action' => 'note_added',
            'description' => "Added an internal note: \"{$request->note}\"",
        ]);

        return response()->json(['status' => 'success', 'data' => $note->load('user:id,name')]);
    }

    public function archive(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->hasPermission('leads.manage')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to archive leads.'], 403);
        }

        $lead = Lead::findOrFail($id);
        $lead->is_archived = true;
        $lead->archived_at = now();
        $lead->save();

        LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()->id,
            'action' => 'lead_archived',
            'description' => "Lead archived by {$request->user()->name}",
        ]);

        return response()->json(['status' => 'success', 'message' => 'Lead successfully archived', 'data' => $lead]);
    }

    public function exportCsv(Request $request): StreamedResponse|JsonResponse
    {
        if (!$request->user()->hasPermission('leads.export')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to export leads.'], 403);
        }

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'leads.export_csv',
            'entity_type' => 'Lead',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $leads = Lead::latest()->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="atloops_leads_export_'.date('Y_m_d').'.csv"',
        ];

        $callback = function () use ($leads) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM for Excel Arabic support

            fputcsv($handle, ['ID', 'Name', 'Company', 'Email', 'Phone', 'Country', 'Service', 'Budget', 'Status', 'Priority', 'Source Page', 'Date']);

            foreach ($leads as $l) {
                fputcsv($handle, [
                    $l->id,
                    $l->name,
                    $l->company,
                    $l->email,
                    $l->phone,
                    $l->country,
                    $l->service_of_interest,
                    $l->estimated_budget,
                    $l->status,
                    $l->priority,
                    $l->source_page,
                    $l->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
