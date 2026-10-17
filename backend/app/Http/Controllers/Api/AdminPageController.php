<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\PageRevision;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminPageController extends Controller
{
    public function index(): JsonResponse
    {
        $pages = Page::withCount('sections')->latest()->get();
        return response()->json(['status' => 'success', 'data' => $pages]);
    }

    public function show(int $id): JsonResponse
    {
        $page = Page::with(['sections' => function ($q) {
            $q->orderBy('sort_order');
        }, 'revisions.user:id,name'])->findOrFail($id);

        return response()->json(['status' => 'success', 'data' => $page]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'title_en' => 'required|string|max:200',
            'title_ar' => 'required|string|max:200',
            'slug' => 'required|string|max:200|unique:pages,slug,'.$page->id,
            'is_published' => 'boolean',
            'meta_title_en' => 'nullable|string|max:255',
            'meta_title_ar' => 'nullable|string|max:255',
            'meta_description_en' => 'nullable|string|max:500',
            'meta_description_ar' => 'nullable|string|max:500',
        ]);

        $page->update($validated);

        return response()->json(['status' => 'success', 'data' => $page]);
    }

    public function saveSections(Request $request, int $id): JsonResponse
    {
        $page = Page::with('sections')->findOrFail($id);

        $request->validate([
            'sections' => 'required|array',
            'sections.*.block_type' => 'required|string',
            'sections.*.content_en' => 'required|array',
            'sections.*.content_ar' => 'required|array',
            'sections.*.settings' => 'nullable|array',
            'sections.*.is_active' => 'nullable|boolean',
            'revision_note' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($page, $request) {
            // 1. Snapshot previous state as revision
            $oldSections = $page->sections()->orderBy('sort_order')->get()->toArray();
            PageRevision::create([
                'page_id' => $page->id,
                'user_id' => $request->user()->id,
                'revision_title' => $request->revision_note ?: 'Autosave before section update',
                'snapshot' => $oldSections,
            ]);

            // 2. Clear previous sections and re-insert in exact order
            $page->sections()->delete();

            foreach ($request->sections as $index => $sec) {
                PageSection::create([
                    'page_id' => $page->id,
                    'block_type' => $sec['block_type'],
                    'sort_order' => $index + 1,
                    'content_en' => $sec['content_en'],
                    'content_ar' => $sec['content_ar'],
                    'settings' => $sec['settings'] ?? [],
                    'is_active' => $sec['is_active'] ?? true,
                ]);
            }

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'page.builder_saved',
                'entity_type' => 'Page',
                'entity_id' => $page->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'details' => ['block_count' => count($request->sections)],
            ]);
        });

        $updated = Page::with(['sections' => function ($q) {
            $q->orderBy('sort_order');
        }])->find($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Page blocks saved and published to website successfully',
            'data' => $updated,
        ]);
    }

    public function restoreRevision(Request $request, int $id, int $revisionId): JsonResponse
    {
        $page = Page::findOrFail($id);
        $revision = PageRevision::where('page_id', $page->id)->findOrFail($revisionId);

        DB::transaction(function () use ($page, $revision, $request) {
            $page->sections()->delete();

            foreach ($revision->snapshot as $index => $sec) {
                PageSection::create([
                    'page_id' => $page->id,
                    'block_type' => $sec['block_type'],
                    'sort_order' => $index + 1,
                    'content_en' => $sec['content_en'],
                    'content_ar' => $sec['content_ar'],
                    'settings' => $sec['settings'] ?? [],
                    'is_active' => $sec['is_active'] ?? true,
                ]);
            }

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'page.revision_restored',
                'entity_type' => 'Page',
                'entity_id' => $page->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'details' => ['revision_id' => $revision->id],
            ]);
        });

        $updated = Page::with('sections')->find($id);

        return response()->json([
            'status' => 'success',
            'message' => "Revision #{$revisionId} restored successfully",
            'data' => $updated,
        ]);
    }
}
