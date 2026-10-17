<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'author_id',
        'slug',
        'title_en',
        'title_ar',
        'excerpt_en',
        'excerpt_ar',
        'content_en',
        'content_ar',
        'thumbnail',
        'reading_time',
        'is_published',
        'published_at',
        'view_count',
        'meta_title_en',
        'meta_title_ar',
        'meta_description_en',
        'meta_description_ar',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'reading_time' => 'integer',
            'view_count' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
