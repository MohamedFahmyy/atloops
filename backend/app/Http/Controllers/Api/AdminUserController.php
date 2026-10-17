<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (!$request->user()->hasPermission('users.manage')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to view users.'], 403);
        }

        $users = User::select('id', 'name', 'email', 'role', 'phone', 'is_active', 'created_at')->latest()->get();
        return response()->json(['status' => 'success', 'data' => $users]);
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->hasPermission('users.manage')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to create users.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:superadmin,admin,content_manager,marketing_manager,sales_rep,support_agent,analyst',
            'phone' => 'nullable|string|max:30',
        ]);

        // Privilege escalation guard: Only Super Admins can create Super Admins
        if ($validated['role'] === 'superadmin' && !$request->user()->isSuperAdmin()) {
            return response()->json(['status' => 'error', 'message' => 'Privilege escalation rejected: Only Super Admins can create Super Admin accounts.'], 403);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
            'is_active' => true,
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'user.created',
            'entity_type' => 'User',
            'entity_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'details' => ['created_email' => $user->email, 'role' => $user->role],
        ]);

        return response()->json(['status' => 'success', 'data' => $user], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->hasPermission('users.manage')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to modify users.'], 403);
        }

        $user = User::findOrFail($id);

        // Protection: Non-superadmins cannot edit Super Admin accounts
        if ($user->isSuperAdmin() && !$request->user()->isSuperAdmin()) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: Only Super Admins can modify Super Admin accounts.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:superadmin,admin,content_manager,marketing_manager,sales_rep,support_agent,analyst',
            'phone' => 'nullable|string|max:30',
            'is_active' => 'boolean',
        ]);

        // Privilege escalation guard: Non-superadmins cannot elevate someone to superadmin
        if ($validated['role'] === 'superadmin' && !$request->user()->isSuperAdmin()) {
            return response()->json(['status' => 'error', 'message' => 'Privilege escalation rejected: Only Super Admins can grant the Super Admin role.'], 403);
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];
        $user->phone = $validated['phone'] ?? $user->phone;
        $user->is_active = $validated['is_active'] ?? $user->is_active;

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'user.updated',
            'entity_type' => 'User',
            'entity_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['status' => 'success', 'data' => $user]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->hasPermission('users.manage')) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: You lack permission to delete users.'], 403);
        }

        $user = User::findOrFail($id);

        if ($request->user()->id === $user->id) {
            return response()->json(['status' => 'error', 'message' => 'You cannot delete your own account'], 403);
        }

        if ($user->isSuperAdmin() && !$request->user()->isSuperAdmin()) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: Only Super Admins can delete Super Admin accounts.'], 403);
        }

        if ($user->role === 'superadmin' && User::where('role', 'superadmin')->count() <= 1) {
            return response()->json(['status' => 'error', 'message' => 'Cannot delete the last remaining Super Admin'], 403);
        }

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'user.deleted',
            'entity_type' => 'User',
            'entity_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'details' => ['deleted_email' => $user->email],
        ]);

        $user->delete();

        return response()->json(['status' => 'success', 'message' => 'User deleted successfully']);
    }
}
