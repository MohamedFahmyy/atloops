<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'slug',
        'name_en',
        'name_ar',
        'tagline_en',
        'tagline_ar',
        'short_desc_en',
        'short_desc_ar',
        'description_en',
        'description_ar',
        'features_en',
        'features_ar',
        'badge',
        'price',
        'original_price',
        'pricing_model',
        'demo_url',
        'thumbnail',
        'gallery',
        'supported_platforms',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'features_en' => 'array',
            'features_ar' => 'array',
            'gallery' => 'array',
            'supported_platforms' => 'array',
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }
}
