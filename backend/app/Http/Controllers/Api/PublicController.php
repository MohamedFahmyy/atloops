<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\PortfolioProject;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\Testimonial;
use App\Models\Faq;
use App\Models\GlobalSetting;
use App\Models\Page;
use App\Models\Lead;
use App\Models\LeadActivity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PublicController extends Controller
{
    public function getSettings(): JsonResponse
    {
        $settings = GlobalSetting::all()->pluck('value', 'key');
        return response()->json(['status' => 'success', 'data' => $settings]);
    }

    public function getServices(Request $request): JsonResponse
    {
        $query = Service::where('is_active', true)->orderBy('sort_order');

        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        return response()->json(['status' => 'success', 'data' => $query->get()]);
    }

    public function getServiceBySlug(string $slug): JsonResponse
    {
        $service = Service::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return response()->json(['status' => 'success', 'data' => $service]);
    }

    public function getProducts(Request $request): JsonResponse
    {
        $query = Product::with('category')->where('is_active', true)->orderBy('sort_order');

        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name_en', 'like', "%{$s}%")
                  ->orWhere('name_ar', 'like', "%{$s}%")
                  ->orWhere('short_desc_en', 'like', "%{$s}%")
                  ->orWhere('short_desc_ar', 'like', "%{$s}%");
            });
        }

        return response()->json(['status' => 'success', 'data' => $query->get()]);
    }

    public function getProductCategories(): JsonResponse
    {
        $categories = ProductCategory::withCount(['products' => function ($q) {
            $q->where('is_active', true);
        }])->where('is_active', true)->orderBy('sort_order')->get();

        return response()->json(['status' => 'success', 'data' => $categories]);
    }

    public function getProductBySlug(string $slug): JsonResponse
    {
        $product = Product::with('category')->where('slug', $slug)->where('is_active', true)->firstOrFail();
        return response()->json(['status' => 'success', 'data' => $product]);
    }

    public function getPortfolio(Request $request): JsonResponse
    {
        $query = PortfolioProject::where('is_active', true)->orderBy('sort_order');

        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->has('industry') && $request->industry !== 'all') {
            $query->where('industry_en', $request->industry);
        }

        return response()->json(['status' => 'success', 'data' => $query->get()]);
    }

    public function getPortfolioBySlug(string $slug): JsonResponse
    {
        $project = PortfolioProject::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return response()->json(['status' => 'success', 'data' => $project]);
    }

    public function getBlogPosts(Request $request): JsonResponse
    {
        $query = BlogPost::with('category')->where('is_published', true)->latest('published_at');

        if ($request->has('category') && $request->category !== 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        return response()->json(['status' => 'success', 'data' => $query->paginate(12)]);
    }

    public function getBlogPostBySlug(string $slug): JsonResponse
    {
        $post = BlogPost::with(['category', 'author'])->where('slug', $slug)->where('is_published', true)->firstOrFail();
        $post->increment('view_count');
        return response()->json(['status' => 'success', 'data' => $post]);
    }

    public function getTestimonials(): JsonResponse
    {
        $testimonials = Testimonial::where('is_active', true)->orderBy('sort_order')->get();
        return response()->json(['status' => 'success', 'data' => $testimonials]);
    }

    public function getFaqs(Request $request): JsonResponse
    {
        $query = Faq::where('is_active', true)->orderBy('sort_order');
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        return response()->json(['status' => 'success', 'data' => $query->get()]);
    }

    public function getPageBySlug(string $slug): JsonResponse
    {
        $page = Page::with(['sections' => function ($q) {
            $q->where('is_active', true)->orderBy('sort_order');
        }])->where('slug', $slug)->where('is_published', true)->firstOrFail();

        return response()->json(['status' => 'success', 'data' => $page]);
    }

    public function submitLead(Request $request): JsonResponse
    {
        // Anti-bot honeypot check
        if (!empty($request->input('website_hp'))) {
            return response()->json(['status' => 'success', 'message' => 'Inquiry received']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:150',
            'phone' => 'required|string|max:30',
            'company' => 'nullable|string|max:150',
            'country' => 'nullable|string|max:60',
            'service_of_interest' => 'nullable|string|max:150',
            'estimated_budget' => 'nullable|string|max:60',
            'message' => 'required|string|max:3000',
            'source_page' => 'nullable|string|max:200',
            'utm_source' => 'nullable|string|max:100',
            'utm_medium' => 'nullable|string|max:100',
            'utm_campaign' => 'nullable|string|max:100',
        ]);

        $lead = Lead::create(array_merge($validated, [
            'status' => 'new',
            'priority' => 'medium',
        ]));

        LeadActivity::create([
            'lead_id' => $lead->id,
            'action' => 'lead.created',
            'description' => "New inquiry submitted via public form from {$lead->source_page}",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Thank you! Your inquiry has been safely received by AT Loops engineering advisors.',
            'lead_id' => $lead->id,
        ], 201);
    }

    public function getHealth(): JsonResponse
    {
        $dbConnected = false;
        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();
            $dbConnected = true;
        } catch (\Throwable $e) {
            $dbConnected = false;
        }

        $storageWritable = is_writable(storage_path('app/public'));

        return response()->json([
            'status' => ($dbConnected && $storageWritable) ? 'ok' : 'degraded',
            'timestamp' => now()->toIso8601String(),
            'environment' => config('app.env'),
            'checks' => [
                'database' => $dbConnected ? 'healthy' : 'disconnected',
                'storage' => $storageWritable ? 'healthy' : 'read_only',
                'php_version' => PHP_VERSION,
                'server_time' => now()->toDateTimeString(),
            ],
        ], ($dbConnected && $storageWritable) ? 200 : 503);
    }
}

