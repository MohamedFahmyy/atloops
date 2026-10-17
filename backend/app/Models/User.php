<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'is_active',
        'custom_permissions',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'custom_permissions' => 'array',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['superadmin', 'admin']);
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        $rolePermissions = match ($this->role) {
            'admin' => ['users.manage', 'content.view', 'content.edit', 'content.publish', 'content.delete', 'media.manage', 'leads.view', 'leads.manage', 'leads.export', 'seo.manage', 'settings.manage', 'audit.view'],
            'content_manager' => ['content.view', 'content.edit', 'content.publish', 'media.manage', 'seo.manage'],
            'marketing_manager' => ['content.view', 'content.edit', 'media.manage', 'leads.view', 'leads.export', 'seo.manage'],
            'sales_rep' => ['leads.view', 'leads.manage', 'leads.export'],
            'support_agent' => ['leads.view'],
            'analyst' => ['content.view', 'leads.view', 'audit.view'],
            default => [],
        };

        if (in_array($permission, $rolePermissions)) {
            return true;
        }

        return is_array($this->custom_permissions) && in_array($permission, $this->custom_permissions);
    }
}
