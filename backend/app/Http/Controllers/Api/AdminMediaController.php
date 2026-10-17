<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminMediaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MediaAsset::with('uploader:id,name')->latest();

        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where('original_name', 'like', "%{$s}%")
                  ->orWhere('alt_text_en', 'like', "%{$s}%")
                  ->orWhere('alt_text_ar', 'like', "%{$s}%");
        }

        return response()->json(['status' => 'success', 'data' => $query->paginate(24)]);
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,webp,svg,gif|max:5120', // Max 5MB
            'alt_text_en' => 'nullable|string|max:255',
            'alt_text_ar' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $mime = $file->getMimeType();
        $size = $file->getSize();

        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('uploads/media', $filename, 'public');

        // Extract image dimensions if applicable
        $width = null;
        $height = null;
        if (str_starts_with($mime, 'image/') && $mime !== 'image/svg+xml') {
            [$width, $height] = @getimagesize($file->getRealPath());
        }

        $media = MediaAsset::create([
            'filename' => $filename,
            'original_name' => $originalName,
            'mime_type' => $mime,
            'file_size' => $size,
            'width' => $width,
            'height' => $height,
            'path' => Storage::url($path),
            'alt_text_en' => $request->alt_text_en ?: pathinfo($originalName, PATHINFO_FILENAME),
            'alt_text_ar' => $request->alt_text_ar ?: pathinfo($originalName, PATHINFO_FILENAME),
            'uploader_id' => $request->user()->id,
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'media.uploaded',
            'entity_type' => 'MediaAsset',
            'entity_id' => $media->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'details' => ['original_name' => $originalName, 'size' => $size],
        ]);

        return response()->json(['status' => 'success', 'data' => $media], 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $media = MediaAsset::findOrFail($id);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'media.deleted',
            'entity_type' => 'MediaAsset',
            'entity_id' => $media->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'details' => ['filename' => $media->filename],
        ]);

        if (Storage::disk('public')->exists('uploads/media/' . $media->filename)) {
            Storage::disk('public')->delete('uploads/media/' . $media->filename);
        }

        $media->delete();

        return response()->json(['status' => 'success', 'message' => 'Media asset removed']);
    }
}
