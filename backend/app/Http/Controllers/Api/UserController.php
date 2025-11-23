<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/**
 * Controller pour la gestion des utilisateurs.
 * 
 * Gère le profil utilisateur, la modification des données,
 * et l'administration des comptes (pour admins).
 * 
 * @package App\Http\Controllers\Api
 * @author LaravelMaster
 */
class UserController extends Controller
{
    /**
     * Récupérer le profil de l'utilisateur connecté.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function profile(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        
        $user->load(['properties', 'certification']);

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'bio' => $user->bio,
            'email_verified_at' => $user->email_verified_at?->toIso8601String(),
            'created_at' => $user->created_at->toIso8601String(),
            'properties_count' => $user->properties->count(),
        ];

        // Ajouter le badge de certification
        if ($user->certification) {
            $userData['certification'] = [
                'level' => $user->certification->level,
                'badge' => $user->certification_badge,
                'points' => $user->certification->points,
                'transactions_count' => $user->certification->transactions_count,
                'average_rating' => $user->certification->average_rating,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $userData,
            ],
        ]);
    }

    /**
     * Mettre à jour le profil.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function updateProfile(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'data' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Changer le mot de passe.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function updatePassword(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // Vérifier l'ancien mot de passe
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Le mot de passe actuel est incorrect',
                'errors' => [
                    'current_password' => ['Le mot de passe actuel est incorrect'],
                ],
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Révoquer tous les tokens sauf le token actuel
        $currentToken = $user->currentAccessToken();
        $user->tokens()->where('id', '!=', $currentToken->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe modifié avec succès',
        ]);
    }

    /**
     * Upload avatar.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg', 'max:2048'], // 2MB max
        ]);

        // Supprimer l'ancien avatar
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'Avatar uploadé avec succès',
            'data' => [
                'avatar' => $user->avatar,
                'avatar_url' => Storage::url($user->avatar),
            ],
        ]);
    }

    /**
     * Supprimer avatar.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteAvatar(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Avatar supprimé avec succès',
        ]);
    }

    // ====================================================================
    // ROUTES ADMIN
    // ====================================================================

    /**
     * Liste de tous les utilisateurs (Admin).
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        // Filtre par rôle
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        // Recherche
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('email', 'ILIKE', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = min((int) $request->input('per_page', 20), 100);
        $users = $query->withCount('properties')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $users->items(),
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                ],
            ],
        ]);
    }

    /**
     * Détails d'un utilisateur (Admin).
     * 
     * @param User $user
     * @return JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        $user->load(['properties']);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'stats' => [
                    'properties_count' => $user->properties->count(),
                    'published_properties' => $user->properties->where('status', 'published')->count(),
                    'messages_sent' => $user->sentMessages()->count(),
                    'messages_received' => $user->receivedMessages()->count(),
                ],
            ],
        ]);
    }

    /**
     * Modifier le rôle d'un utilisateur (Admin).
     * 
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(['client', 'agent', 'admin'])],
        ]);

        // Empêcher de modifier son propre rôle
        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas modifier votre propre rôle',
            ], 422);
        }

        $user->update(['role' => $validated['role']]);

        return response()->json([
            'success' => true,
            'message' => 'Rôle mis à jour avec succès',
            'data' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Bloquer un utilisateur (Admin).
     * 
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function block(Request $request, User $user): JsonResponse
    {
        // Empêcher de se bloquer soi-même
        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas vous bloquer vous-même',
            ], 422);
        }

        $user->update(['is_blocked' => true]);

        // Révoquer tous les tokens
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur bloqué avec succès',
            'data' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Débloquer un utilisateur (Admin).
     * 
     * @param User $user
     * @return JsonResponse
     */
    public function unblock(User $user): JsonResponse
    {
        $user->update(['is_blocked' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur débloqué avec succès',
            'data' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Supprimer un utilisateur (Admin).
     * 
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        // Empêcher de se supprimer soi-même
        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas supprimer votre propre compte',
            ], 422);
        }

        // Supprimer l'avatar
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Supprimer les images des propriétés
        foreach ($user->properties as $property) {
            if (!empty($property->images)) {
                foreach ($property->images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès',
        ]);
    }

    /**
     * Statistiques utilisateurs (Admin).
     * 
     * @return JsonResponse
     */
    public function userStats(): JsonResponse
    {
        $stats = [
            'total_users' => User::count(),
            'users_by_role' => User::selectRaw('role, COUNT(*) as count')
                ->groupBy('role')
                ->get(),
            'blocked_users' => User::where('is_blocked', true)->count(),
            'verified_users' => User::whereNotNull('email_verified_at')->count(),
            'users_this_month' => User::whereMonth('created_at', now()->month)->count(),
            'active_agents' => User::where('role', 'agent')
                ->whereHas('properties', function ($q) {
                    $q->where('status', 'published');
                })
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => ['stats' => $stats],
        ]);
    }
}