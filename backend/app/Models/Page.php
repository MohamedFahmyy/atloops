<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title_en',
        'title_ar',
        'is_published',
        'published_at',
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
        ];
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class, 'page_id')->orderBy('sort_order');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(PageRevision::class, 'page_id')->latest();
    }
}
