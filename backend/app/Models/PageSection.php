<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_id',
        'block_type',
        'sort_order',
        'content_en',
        'content_ar',
        'settings',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'content_en' => 'array',
            'content_ar' => 'array',
            'settings' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'page_id');
    }
}
