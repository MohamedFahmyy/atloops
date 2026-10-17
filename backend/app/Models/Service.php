<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'icon',
        'category',
        'title_en',
        'title_ar',
        'short_desc_en',
        'short_desc_ar',
        'description_en',
        'description_ar',
        'benefits_en',
        'benefits_ar',
        'capabilities_en',
        'capabilities_ar',
        'process_steps_en',
        'process_steps_ar',
        'faqs',
        'meta_title_en',
        'meta_title_ar',
        'meta_description_en',
        'meta_description_ar',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'benefits_en' => 'array',
            'benefits_ar' => 'array',
            'capabilities_en' => 'array',
            'capabilities_ar' => 'array',
            'process_steps_en' => 'array',
            'process_steps_ar' => 'array',
            'faqs' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
