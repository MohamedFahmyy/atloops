<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_name_en',
        'client_name_ar',
        'client_role_en',
        'client_role_ar',
        'company_en',
        'company_ar',
        'content_en',
        'content_ar',
        'rating',
        'avatar',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'rating' => 'integer',
            'sort_order' => 'integer',
        ];
    }
}
