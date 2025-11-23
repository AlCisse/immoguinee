<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller pour la gestion des favoris.
 * 
 * Permet aux utilisateurs de sauvegarder leurs propriétés
 * préférées pour consultation ultérieure.
 * 
 * @package App\Http\Controllers\Api
 * @author LaravelMaster
 */
class FavoriteController extends Controller
{
    /**
     * Liste des propriétés favorites de l'utilisateur.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $perPage = min((int) $request->input('per_page', 15), 100);

        // Récupérer les favoris avec pagination
        $favorites = \App\Models\Favorite::where('user_id', $user->id)
            ->with(['property.location', 'property.user'])
            ->latest('created_at')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'favorites' => $favorites->items()->map(function ($favorite) {
                    return $favorite->property;
                }),
                'pagination' => [
                    'total' => $favorites->total(),
                    'per_page' => $favorites->perPage(),
                    'current_page' => $favorites->currentPage(),
                    'last_page' => $favorites->lastPage(),
                ],
            ],
        ]);
    }

    /**
     * Ajouter une propriété aux favoris.
     * 
     * @param Request $request
     * @param Property $property
     * @return JsonResponse
     */
    public function add(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Vérifier si déjà en favori
        if (\App\Models\Favorite::where('user_id', $user->id)->where('property_id', $property->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette propriété est déjà dans vos favoris',
            ], 422);
        }

        // Ajouter aux favoris
        \App\Models\Favorite::create([
            'user_id' => $user->id,
            'property_id' => $property->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Propriété ajoutée aux favoris',
            'data' => [
                'property_id' => $property->id,
                'is_favorite' => true,
            ],
        ], 201);
    }

    /**
     * Retirer une propriété des favoris.
     * 
     * @param Request $request
     * @param Property $property
     * @return JsonResponse
     */
    public function remove(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Vérifier si dans les favoris
        $favorite = \App\Models\Favorite::where('user_id', $user->id)->where('property_id', $property->id)->first();
        
        if (!$favorite) {
            return response()->json([
                'success' => false,
                'message' => 'Cette propriété n\'est pas dans vos favoris',
            ], 404);
        }

        // Retirer des favoris
        $favorite->delete();

        return response()->json([
            'success' => true,
            'message' => 'Propriété retirée des favoris',
            'data' => [
                'property_id' => $property->id,
                'is_favorite' => false,
            ],
        ]);
    }

    /**
     * Vérifier si une propriété est en favori.
     * 
     * @param Request $request
     * @param Property $property
     * @return JsonResponse
     */
    public function check(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $isFavorite = \App\Models\Favorite::where('user_id', $user->id)
            ->where('property_id', $property->id)
            ->exists();

        return response()->json([
            'success' => true,
            'data' => [
                'property_id' => $property->id,
                'is_favorite' => $isFavorite,
            ],
        ]);
    }
}