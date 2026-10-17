<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title_en',
        'title_ar',
        'client_name_en',
        'client_name_ar',
        'industry_en',
        'industry_ar',
        'short_desc_en',
        'short_desc_ar',
        'description_en',
        'description_ar',
        'challenge_en',
        'challenge_ar',
        'solution_en',
        'solution_ar',
        'results_en',
        'results_ar',
        'tech_stack',
        'thumbnail',
        'gallery',
        'live_url',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'results_en' => 'array',
            'results_ar' => 'array',
            'tech_stack' => 'array',
            'gallery' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
