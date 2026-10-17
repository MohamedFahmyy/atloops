<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'country',
        'service_of_interest',
        'estimated_budget',
        'message',
        'source_page',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'assigned_to',
        'priority',
        'status',
        'is_archived',
        'archived_at',
    ];

    protected $casts = [
        'is_archived' => 'boolean',
        'archived_at' => 'datetime',
    ];

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(LeadNote::class, 'lead_id')->latest();
    }

    public function activities(): HasMany
    {
        return $this->hasMany(LeadActivity::class, 'lead_id')->latest();
    }
}
