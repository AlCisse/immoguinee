<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Controller pour la gestion des localisations.
 * 
 * Gère les villes, quartiers et zones géographiques
 * pour les propriétés immobilières.
 * 
 * @package App\Http\Controllers\Api
 * @author LaravelMaster
 */
class LocationController extends Controller
{
    /**
     * Liste de toutes les localisations.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Location::query();

        // Filtre par type (city, district, zone)
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        // Filtre par ville parente
        if ($request->filled('parent_id')) {
            $query->where('parent_id', (int) $request->input('parent_id'));
        }

        // Recherche textuelle
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'ILIKE', "%{$search}%");
        }

        $locations = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'locations' => $locations,
            ],
        ]);
    }

    /**
     * Liste des villes principales.
     * 
     * @return JsonResponse
     */
    public function cities(): JsonResponse
    {
        $cities = Location::query()
            ->where('type', 'city')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'cities' => $cities,
            ],
        ]);
    }

    /**
     * Liste des quartiers d'une ville.
     * 
     * @param string $city
     * @return JsonResponse
     */
    public function districts(string $city): JsonResponse
    {
        // Trouver la ville par ID ou slug
        $cityLocation = Location::query()
            ->where(function ($query) use ($city) {
                $query->where('id', is_numeric($city) ? (int) $city : 0)
                      ->orWhere('slug', $city);
            })
            ->where('type', 'city')
            ->first();

        if (!$cityLocation) {
            return response()->json([
                'success' => false,
                'message' => 'Ville non trouvée',
            ], 404);
        }

        $districts = Location::query()
            ->where('parent_id', $cityLocation->id)
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'city' => $cityLocation,
                'districts' => $districts,
            ],
        ]);
    }

    /**
     * Détails d'une localisation.
     * 
     * @param Location $location
     * @return JsonResponse
     */
    public function show(Location $location): JsonResponse
    {
        $location->load('parent', 'children');

        // Compter les propriétés dans cette localisation
        $propertiesCount = $location->properties()->where('status', 'published')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'location' => $location,
                'properties_count' => $propertiesCount,
            ],
        ]);
    }

    /**
     * Créer une nouvelle localisation (Admin).
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::in(['city', 'district', 'zone'])],
            'parent_id' => ['nullable', 'integer', 'exists:locations,id'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        // Vérifier la cohérence parent/type
        if ($validated['parent_id']) {
            $parent = Location::find($validated['parent_id']);
            
            if ($validated['type'] === 'city' && $parent->type !== 'country') {
                return response()->json([
                    'success' => false,
                    'message' => 'Une ville doit avoir un pays comme parent',
                ], 422);
            }

            if ($validated['type'] === 'district' && $parent->type !== 'city') {
                return response()->json([
                    'success' => false,
                    'message' => 'Un quartier doit avoir une ville comme parent',
                ], 422);
            }
        }

        $location = Location::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'type' => $validated['type'],
            'parent_id' => $validated['parent_id'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
        ]);

        $location->load('parent');

        return response()->json([
            'success' => true,
            'message' => 'Localisation créée avec succès',
            'data' => [
                'location' => $location,
            ],
        ], 201);
    }

    /**
     * Modifier une localisation (Admin).
     * 
     * @param Request $request
     * @param Location $location
     * @return JsonResponse
     */
    public function update(Request $request, Location $location): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', Rule::in(['city', 'district', 'zone'])],
            'parent_id' => ['nullable', 'integer', 'exists:locations,id'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Empêcher qu'une location soit son propre parent
        if (isset($validated['parent_id']) && $validated['parent_id'] === $location->id) {
            return response()->json([
                'success' => false,
                'message' => 'Une localisation ne peut pas être son propre parent',
            ], 422);
        }

        $location->update($validated);
        $location->load('parent', 'children');

        return response()->json([
            'success' => true,
            'message' => 'Localisation mise à jour avec succès',
            'data' => [
                'location' => $location,
            ],
        ]);
    }

    /**
     * Supprimer une localisation (Admin).
     * 
     * @param Location $location
     * @return JsonResponse
     */
    public function destroy(Location $location): JsonResponse
    {
        // Vérifier s'il y a des propriétés associées
        $propertiesCount = $location->properties()->count();
        
        if ($propertiesCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Impossible de supprimer cette localisation car {$propertiesCount} propriété(s) y sont associées",
            ], 422);
        }

        // Vérifier s'il y a des enfants
        $childrenCount = $location->children()->count();
        
        if ($childrenCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Impossible de supprimer cette localisation car elle contient {$childrenCount} sous-localisation(s)",
            ], 422);
        }

        $location->delete();

        return response()->json([
            'success' => true,
            'message' => 'Localisation supprimée avec succès',
        ]);
    }
}