<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AdminContentController;
use App\Http\Controllers\Api\AdminPageController;
use App\Http\Controllers\Api\AdminLeadController;
use App\Http\Controllers\Api\AdminMediaController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\PaymentController;

Route::prefix('v1')->group(function () {

    // --- HEALTH CHECK ENDPOINT ---
    Route::get('/health', [PublicController::class, 'getHealth']);

    // --- PUBLIC CONTENT ENDPOINTS ---
    Route::get('/settings', [PublicController::class, 'getSettings']);
    Route::get('/services', [PublicController::class, 'getServices']);
    Route::get('/services/{slug}', [PublicController::class, 'getServiceBySlug']);
    Route::get('/products', [PublicController::class, 'getProducts']);
    Route::get('/product-categories', [PublicController::class, 'getProductCategories']);
    Route::get('/products/{slug}', [PublicController::class, 'getProductBySlug']);
    Route::get('/portfolio', [PublicController::class, 'getPortfolio']);
    Route::get('/portfolio/{slug}', [PublicController::class, 'getPortfolioBySlug']);
    Route::get('/blog', [PublicController::class, 'getBlogPosts']);
    Route::get('/blog/{slug}', [PublicController::class, 'getBlogPostBySlug']);
    Route::get('/testimonials', [PublicController::class, 'getTestimonials']);
    Route::get('/faqs', [PublicController::class, 'getFaqs']);
    Route::get('/pages/{slug}', [PublicController::class, 'getPageBySlug']);

    // --- ONLINE CHECKOUT & PAYMENTS (PayPal & Credit/Debit Cards) ---
    Route::get('/payments/paypal/config', [PaymentController::class, 'getPayPalConfig']);
    Route::post('/payments/paypal/create-order', [PaymentController::class, 'createPayPalOrder'])->middleware('throttle:20,1');
    Route::post('/payments/paypal/capture-order', [PaymentController::class, 'capturePayPalOrder'])->middleware('throttle:20,1');

    // Lead Submissions with Rate Limiting & Anti-Spam
    Route::post('/leads', [PublicController::class, 'submitLead'])->middleware('throttle:15,1');

    // Authentication Endpoints with Strict Brute-Force Rate Limiting
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    // --- PROTECTED ADMIN API (Sanctum Authentication + Server-Side Permission Checks) ---
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Dashboard Metrics (Available to all authorized staff)
        Route::get('/admin/dashboard/metrics', [DashboardController::class, 'getMetrics']);

        // Services Management (RBAC: content.view, content.edit, content.delete)
        Route::get('/admin/services', [AdminContentController::class, 'getServices'])->middleware('permission:content.view');
        Route::post('/admin/services', [AdminContentController::class, 'storeService'])->middleware('permission:content.edit');
        Route::put('/admin/services/{id}', [AdminContentController::class, 'updateService'])->middleware('permission:content.edit');
        Route::delete('/admin/services/{id}', [AdminContentController::class, 'deleteService'])->middleware('permission:content.delete');

        // Products & Software Solutions (RBAC: content.view, content.edit, content.delete)
        Route::get('/admin/products', [AdminContentController::class, 'getProducts'])->middleware('permission:content.view');
        Route::post('/admin/products', [AdminContentController::class, 'storeProduct'])->middleware('permission:content.edit');
        Route::put('/admin/products/{id}', [AdminContentController::class, 'updateProduct'])->middleware('permission:content.edit');
        Route::delete('/admin/products/{id}', [AdminContentController::class, 'deleteProduct'])->middleware('permission:content.delete');

        // Portfolio & Case Studies (RBAC: content.view, content.edit, content.delete)
        Route::get('/admin/portfolio', [AdminContentController::class, 'getPortfolio'])->middleware('permission:content.view');
        Route::post('/admin/portfolio', [AdminContentController::class, 'storePortfolio'])->middleware('permission:content.edit');
        Route::put('/admin/portfolio/{id}', [AdminContentController::class, 'updatePortfolio'])->middleware('permission:content.edit');
        Route::delete('/admin/portfolio/{id}', [AdminContentController::class, 'deletePortfolio'])->middleware('permission:content.delete');

        // Testimonials & FAQs (RBAC: content.view, content.edit, content.delete)
        Route::get('/admin/testimonials', [AdminContentController::class, 'getTestimonials'])->middleware('permission:content.view');
        Route::post('/admin/testimonials', [AdminContentController::class, 'storeTestimonial'])->middleware('permission:content.edit');
        Route::put('/admin/testimonials/{id}', [AdminContentController::class, 'updateTestimonial'])->middleware('permission:content.edit');
        Route::delete('/admin/testimonials/{id}', [AdminContentController::class, 'deleteTestimonial'])->middleware('permission:content.delete');

        Route::get('/admin/faqs', [AdminContentController::class, 'getFaqs'])->middleware('permission:content.view');
        Route::post('/admin/faqs', [AdminContentController::class, 'storeFaq'])->middleware('permission:content.edit');
        Route::put('/admin/faqs/{id}', [AdminContentController::class, 'updateFaq'])->middleware('permission:content.edit');
        Route::delete('/admin/faqs/{id}', [AdminContentController::class, 'deleteFaq'])->middleware('permission:content.delete');

        // Pages & Visual Page Builder (RBAC: content.view, content.edit, content.publish)
        Route::get('/admin/pages', [AdminPageController::class, 'index'])->middleware('permission:content.view');
        Route::get('/admin/pages/{id}', [AdminPageController::class, 'show'])->middleware('permission:content.view');
        Route::put('/admin/pages/{id}', [AdminPageController::class, 'update'])->middleware('permission:content.edit');
        Route::post('/admin/pages/{id}/sections', [AdminPageController::class, 'saveSections'])->middleware('permission:content.publish');
        Route::post('/admin/pages/{id}/revisions/{revId}/restore', [AdminPageController::class, 'restoreRevision'])->middleware('permission:content.publish');

        // CRM Leads Pipeline (RBAC: leads.view, leads.manage, leads.export)
        Route::get('/admin/leads', [AdminLeadController::class, 'index'])->middleware('permission:leads.view');
        Route::get('/admin/leads/export', [AdminLeadController::class, 'exportCsv'])->middleware('permission:leads.export');
        Route::get('/admin/leads/{id}', [AdminLeadController::class, 'show'])->middleware('permission:leads.view');
        Route::put('/admin/leads/{id}/status', [AdminLeadController::class, 'updateStatus'])->middleware('permission:leads.manage');
        Route::put('/admin/leads/{id}/assign', [AdminLeadController::class, 'assign'])->middleware('permission:leads.manage');
        Route::put('/admin/leads/{id}/archive', [AdminLeadController::class, 'archive'])->middleware('permission:leads.manage');
        Route::post('/admin/leads/{id}/notes', [AdminLeadController::class, 'addNote'])->middleware('permission:leads.manage');

        // Media Library (RBAC: media.manage)
        Route::get('/admin/media', [AdminMediaController::class, 'index'])->middleware('permission:media.manage');
        Route::post('/admin/media/upload', [AdminMediaController::class, 'upload'])->middleware('permission:media.manage');
        Route::delete('/admin/media/{id}', [AdminMediaController::class, 'destroy'])->middleware('permission:media.manage');

        // Global Enterprise Settings (RBAC: settings.manage)
        Route::put('/admin/settings', [AdminContentController::class, 'updateSettings'])->middleware('permission:settings.manage');

        // Users & RBAC Administration (RBAC: users.manage)
        Route::get('/admin/users', [AdminUserController::class, 'index'])->middleware('permission:users.manage');
        Route::post('/admin/users', [AdminUserController::class, 'store'])->middleware('permission:users.manage');
        Route::put('/admin/users/{id}', [AdminUserController::class, 'update'])->middleware('permission:users.manage');
        Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy'])->middleware('permission:users.manage');
    });
});
