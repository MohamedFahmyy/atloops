<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Product;
use App\Models\PortfolioProject;
use App\Models\Testimonial;
use App\Models\Faq;
use App\Models\GlobalSetting;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminContentController extends Controller
{
    // --- SERVICES ---
    public function getServices(): JsonResponse
    {
        return response()->json(['status' => 'success', 'data' => Service::orderBy('sort_order')->get()]);
    }

    public function storeService(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:services,slug',
            'title_en' => 'required|string',
            'title_ar' => 'required|string',
            'short_desc_en' => 'required|string',
            'short_desc_ar' => 'required|string',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'icon' => 'nullable|string',
            'category' => 'nullable|string',
            'benefits_en' => 'nullable|array',
            'benefits_ar' => 'nullable|array',
            'capabilities_en' => 'nullable|array',
            'capabilities_ar' => 'nullable|array',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $service = Service::create($validated);
        return response()->json(['status' => 'success', 'data' => $service], 201);
    }

    public function updateService(Request $request, int $id): JsonResponse
    {
        $service = Service::findOrFail($id);
        $validated = $request->validate([
            'slug' => 'required|string|unique:services,slug,'.$service->id,
            'title_en' => 'required|string',
            'title_ar' => 'required|string',
            'short_desc_en' => 'required|string',
            'short_desc_ar' => 'required|string',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'icon' => 'nullable|string',
            'category' => 'nullable|string',
            'benefits_en' => 'nullable|array',
            'benefits_ar' => 'nullable|array',
            'capabilities_en' => 'nullable|array',
            'capabilities_ar' => 'nullable|array',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $service->update($validated);
        return response()->json(['status' => 'success', 'data' => $service]);
    }

    public function deleteService(int $id): JsonResponse
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return response()->json(['status' => 'success', 'message' => 'Service deleted']);
    }

    // --- PRODUCTS ---
    public function getProducts(): JsonResponse
    {
        return response()->json(['status' => 'success', 'data' => Product::with('category')->orderBy('sort_order')->get()]);
    }

    public function storeProduct(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:product_categories,id',
            'slug' => 'required|string|unique:products,slug',
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'tagline_en' => 'nullable|string',
            'tagline_ar' => 'nullable|string',
            'short_desc_en' => 'required|string',
            'short_desc_ar' => 'required|string',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'features_en' => 'nullable|array',
            'features_ar' => 'nullable|array',
            'badge' => 'nullable|string',
            'price' => 'nullable|numeric',
            'original_price' => 'nullable|numeric',
            'pricing_model' => 'nullable|string',
            'supported_platforms' => 'nullable|array',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $product = Product::create($validated);
        return response()->json(['status' => 'success', 'data' => $product], 201);
    }

    public function updateProduct(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'category_id' => 'nullable|exists:product_categories,id',
            'slug' => 'required|string|unique:products,slug,'.$product->id,
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'tagline_en' => 'nullable|string',
            'tagline_ar' => 'nullable|string',
            'short_desc_en' => 'required|string',
            'short_desc_ar' => 'required|string',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'features_en' => 'nullable|array',
            'features_ar' => 'nullable|array',
            'badge' => 'nullable|string',
            'price' => 'nullable|numeric',
            'original_price' => 'nullable|numeric',
            'pricing_model' => 'nullable|string',
            'supported_platforms' => 'nullable|array',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $product->update($validated);
        return response()->json(['status' => 'success', 'data' => $product]);
    }

    public function deleteProduct(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['status' => 'success', 'message' => 'Product deleted']);
    }

    // --- PORTFOLIO ---
    public function getPortfolio(): JsonResponse
    {
        return response()->json(['status' => 'success', 'data' => PortfolioProject::orderBy('sort_order')->get()]);
    }

    public function storePortfolio(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:portfolio_projects,slug',
            'title_en' => 'required|string',
            'title_ar' => 'required|string',
            'client_name_en' => 'nullable|string',
            'client_name_ar' => 'nullable|string',
            'industry_en' => 'required|string',
            'industry_ar' => 'required|string',
            'short_desc_en' => 'required|string',
            'short_desc_ar' => 'required|string',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'challenge_en' => 'nullable|string',
            'challenge_ar' => 'nullable|string',
            'solution_en' => 'nullable|string',
            'solution_ar' => 'nullable|string',
            'results_en' => 'nullable|array',
            'results_ar' => 'nullable|array',
            'tech_stack' => 'nullable|array',
            'live_url' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $project = PortfolioProject::create($validated);
        return response()->json(['status' => 'success', 'data' => $project], 201);
    }

    public function updatePortfolio(Request $request, int $id): JsonResponse
    {
        $project = PortfolioProject::findOrFail($id);
        $validated = $request->validate([
            'slug' => 'required|string|unique:portfolio_projects,slug,'.$project->id,
            'title_en' => 'required|string',
            'title_ar' => 'required|string',
            'client_name_en' => 'nullable|string',
            'client_name_ar' => 'nullable|string',
            'industry_en' => 'required|string',
            'industry_ar' => 'required|string',
            'short_desc_en' => 'required|string',
            'short_desc_ar' => 'required|string',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'challenge_en' => 'nullable|string',
            'challenge_ar' => 'nullable|string',
            'solution_en' => 'nullable|string',
            'solution_ar' => 'nullable|string',
            'results_en' => 'nullable|array',
            'results_ar' => 'nullable|array',
            'tech_stack' => 'nullable|array',
            'live_url' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $project->update($validated);
        return response()->json(['status' => 'success', 'data' => $project]);
    }

    public function deletePortfolio(int $id): JsonResponse
    {
        $project = PortfolioProject::findOrFail($id);
        $project->delete();
        return response()->json(['status' => 'success', 'message' => 'Project deleted']);
    }

    // --- TESTIMONIALS & FAQS ---
    public function getTestimonials(): JsonResponse
    {
        return response()->json(['status' => 'success', 'data' => Testimonial::orderBy('sort_order')->get()]);
    }

    public function storeTestimonial(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_name_en' => 'required|string',
            'client_name_ar' => 'required|string',
            'client_role_en' => 'required|string',
            'client_role_ar' => 'required|string',
            'company_en' => 'required|string',
            'company_ar' => 'required|string',
            'content_en' => 'required|string',
            'content_ar' => 'required|string',
            'rating' => 'integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $t = Testimonial::create($validated);
        return response()->json(['status' => 'success', 'data' => $t], 201);
    }

    public function updateTestimonial(Request $request, int $id): JsonResponse
    {
        $t = Testimonial::findOrFail($id);
        $validated = $request->validate([
            'client_name_en' => 'required|string',
            'client_name_ar' => 'required|string',
            'client_role_en' => 'required|string',
            'client_role_ar' => 'required|string',
            'company_en' => 'required|string',
            'company_ar' => 'required|string',
            'content_en' => 'required|string',
            'content_ar' => 'required|string',
            'rating' => 'integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);
        $t->update($validated);
        return response()->json(['status' => 'success', 'data' => $t]);
    }

    public function deleteTestimonial(int $id): JsonResponse
    {
        Testimonial::findOrFail($id)->delete();
        return response()->json(['status' => 'success', 'message' => 'Testimonial deleted']);
    }

    public function getFaqs(): JsonResponse
    {
        return response()->json(['status' => 'success', 'data' => Faq::orderBy('sort_order')->get()]);
    }

    public function storeFaq(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'question_en' => 'required|string',
            'question_ar' => 'required|string',
            'answer_en' => 'required|string',
            'answer_ar' => 'required|string',
            'is_active' => 'boolean',
        ]);
        $faq = Faq::create($validated);
        return response()->json(['status' => 'success', 'data' => $faq], 201);
    }

    public function updateFaq(Request $request, int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);
        $validated = $request->validate([
            'category' => 'required|string',
            'question_en' => 'required|string',
            'question_ar' => 'required|string',
            'answer_en' => 'required|string',
            'answer_ar' => 'required|string',
            'is_active' => 'boolean',
        ]);
        $faq->update($validated);
        return response()->json(['status' => 'success', 'data' => $faq]);
    }

    public function deleteFaq(int $id): JsonResponse
    {
        Faq::findOrFail($id)->delete();
        return response()->json(['status' => 'success', 'message' => 'FAQ deleted']);
    }

    // --- GLOBAL SETTINGS ---
    public function updateSettings(Request $request): JsonResponse
    {
        $settings = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($settings['settings'] as $key => $val) {
            GlobalSetting::updateOrCreate(['key' => $key], ['value' => (string)$val]);
        }

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'settings.updated',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['status' => 'success', 'message' => 'Settings updated successfully']);
    }
}
