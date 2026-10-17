<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Service;
use App\Models\Product;
use App\Models\PortfolioProject;
use App\Models\BlogPost;
use App\Models\Lead;
use App\Models\AuditLog;
use App\Models\MediaAsset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getMetrics(): JsonResponse
    {
        $totalPages = Page::count();
        $totalServices = Service::count();
        $totalProducts = Product::count();
        $totalProjects = PortfolioProject::count();
        $totalBlogPosts = BlogPost::count();
        $totalMedia = MediaAsset::count();

        // Real Lead Metrics
        $totalLeads = Lead::count();
        $newLeads = Lead::where('status', 'new')->count();
        $qualifiedLeads = Lead::where('status', 'qualified')->count();
        $wonLeads = Lead::where('status', 'won')->count();
        $lostLeads = Lead::where('status', 'lost')->count();

        // Leads Pipeline Grouped By Status
        $pipelineStages = Lead::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        // Recent Inquiries
        $recentLeads = Lead::with('assignedUser:id,name')->latest()->take(6)->get();

        // Recent System Activity
        $recentAuditLogs = AuditLog::with('user:id,name,role')->latest()->take(6)->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'counts' => [
                    'pages' => $totalPages,
                    'services' => $totalServices,
                    'products' => $totalProducts,
                    'projects' => $totalProjects,
                    'blog_posts' => $totalBlogPosts,
                    'media' => $totalMedia,
                    'leads_total' => $totalLeads,
                    'leads_new' => $newLeads,
                    'leads_won' => $wonLeads,
                ],
                'pipeline' => [
                    'new' => $pipelineStages['new'] ?? 0,
                    'contacted' => $pipelineStages['contacted'] ?? 0,
                    'qualified' => $pipelineStages['qualified'] ?? 0,
                    'proposal_sent' => $pipelineStages['proposal_sent'] ?? 0,
                    'negotiation' => $pipelineStages['negotiation'] ?? 0,
                    'won' => $pipelineStages['won'] ?? 0,
                    'lost' => $pipelineStages['lost'] ?? 0,
                ],
                'recent_leads' => $recentLeads,
                'recent_logs' => $recentAuditLogs,
            ]
        ]);
    }
}
