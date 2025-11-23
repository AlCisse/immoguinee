<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

/**
 * Controller pour la gestion des propriétés immobilières.
 * 
 * Gère le CRUD des propriétés, la recherche, les filtres,
 * l'upload d'images et les changements de statut.
 * 
 * @package App\Http\Controllers\Api
 * @author LaravelMaster
 */
class PropertyController extends Controller
{
    /**
     * Liste paginée de toutes les propriétés publiées.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $perPage = min((int) $perPage, 100); // Max 100 items par page

        $properties = Property::query()
            ->where('status', 'published')
            ->with(['location', 'user.certification'])
            ->latest('created_at')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'properties' => $properties->items(),
                'pagination' => [
                    'total' => $properties->total(),
                    'per_page' => $properties->perPage(),
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                    'from' => $properties->firstItem(),
                    'to' => $properties->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * Recherche avancée de propriétés avec filtres.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $query = Property::query()
            ->where('status', 'published')
            ->with(['location', 'user.certification']);

        // Filtre par type
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        // Filtre par transaction (vente/location)
        if ($request->filled('transaction_type')) {
            $query->where('transaction_type', $request->input('transaction_type'));
        }

        // Filtre par prix min/max
        if ($request->filled('price_min')) {
            $query->where('price', '>=', (float) $request->input('price_min'));
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', (float) $request->input('price_max'));
        }

        // Filtre par surface min/max
        if ($request->filled('surface_min')) {
            $query->where('surface', '>=', (float) $request->input('surface_min'));
        }
        if ($request->filled('surface_max')) {
            $query->where('surface', '<=', (float) $request->input('surface_max'));
        }

        // Filtre par nombre de chambres
        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', '>=', (int) $request->input('bedrooms'));
        }

        // Filtre par nombre de salles de bain
        if ($request->filled('bathrooms')) {
            $query->where('bathrooms', '>=', (int) $request->input('bathrooms'));
        }

        // Filtre par localisation
        if ($request->filled('location_id')) {
            $query->where('location_id', (int) $request->input('location_id'));
        }

        // Recherche textuelle
        if ($request->filled('query')) {
            $searchTerm = $request->input('query');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'ILIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'ILIKE', "%{$searchTerm}%");
            });
        }

        // Tri
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        $allowedSorts = ['created_at', 'price', 'surface', 'title'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        $perPage = min((int) $request->input('per_page', 15), 100);
        $properties = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'properties' => $properties->items(),
                'pagination' => [
                    'total' => $properties->total(),
                    'per_page' => $properties->perPage(),
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                ],
                'filters_applied' => $request->only([
                    'type', 'transaction_type', 'price_min', 'price_max',
                    'surface_min', 'surface_max', 'bedrooms', 'bathrooms',
                    'location_id', 'query', 'sort_by', 'sort_order',
                ]),
            ],
        ]);
    }

    /**
     * Propriétés en vedette (featured).
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = min((int) $request->input('limit', 6), 20);

        $properties = Property::query()
            ->where('status', 'published')
            ->where('is_featured', true)
            ->with(['location', 'user.certification'])
            ->latest('created_at')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'properties' => $properties,
            ],
        ]);
    }

    /**
     * Détails d'une propriété spécifique.
     * 
     * @param Property $property
     * @return JsonResponse
     */
    public function show(Property $property): JsonResponse
    {
        $property->load(['location', 'user.certification']);

        // Incrémenter le compteur de vues
        $property->increment('views_count');

        // Formater la réponse avec le badge de certification
        $propertyData = $property->toArray();
        if ($property->user && $property->user->certification) {
            $propertyData['user']['certification_badge'] = $property->user->certification_badge;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'property' => $propertyData,
            ],
        ]);
    }

    /**
     * Mes propriétés (utilisateur connecté).
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function myProperties(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $perPage = min((int) $request->input('per_page', 15), 100);

        $properties = Property::query()
            ->where('user_id', $user->id)
            ->with(['location'])
            ->latest('created_at')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'properties' => $properties->items(),
                'pagination' => [
                    'total' => $properties->total(),
                    'per_page' => $properties->perPage(),
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                ],
            ],
        ]);
    }

    /**
     * Créer une nouvelle propriété.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Vérifier que l'utilisateur est agent ou admin
        if (!in_array($user->role, ['agent', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les agents et administrateurs peuvent créer des propriétés',
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', 'string', Rule::in(['apartment', 'house', 'villa', 'land', 'office', 'shop'])],
            'transaction_type' => ['required', 'string', Rule::in(['sale', 'rent'])],
            'price' => ['required', 'numeric', 'min:0'],
            'surface' => ['required', 'numeric', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'location_id' => ['required', 'integer', 'exists:locations,id'],
            'address' => ['nullable', 'string', 'max:500'],
            'features' => ['nullable', 'array'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $property = Property::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'description' => $validated['description'],
            'type' => $validated['type'],
            'transaction_type' => $validated['transaction_type'],
            'price' => $validated['price'],
            'surface' => $validated['surface'],
            'bedrooms' => $validated['bedrooms'] ?? null,
            'bathrooms' => $validated['bathrooms'] ?? null,
            'location_id' => $validated['location_id'],
            'address' => $validated['address'] ?? null,
            'features' => $validated['features'] ?? [],
            'is_featured' => $validated['is_featured'] ?? false,
            'status' => 'draft',
        ]);

        $property->load(['location', 'user.certification']);

        return response()->json([
            'success' => true,
            'message' => 'Propriété créée avec succès',
            'data' => [
                'property' => $property,
            ],
        ], 201);
    }

    /**
     * Modifier une propriété existante.
     * 
     * @param Request $request
     * @param Property $property
     * @return JsonResponse
     */
    public function update(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Vérifier que l'utilisateur est propriétaire ou admin
        if ($property->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas autorisé à modifier cette propriété',
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'type' => ['sometimes', 'string', Rule::in(['apartment', 'house', 'villa', 'land', 'office', 'shop'])],
            'transaction_type' => ['sometimes', 'string', Rule::in(['sale', 'rent'])],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'surface' => ['sometimes', 'numeric', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'location_id' => ['sometimes', 'integer', 'exists:locations,id'],
            'address' => ['nullable', 'string', 'max:500'],
            'features' => ['nullable', 'array'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $property->update($validated);
        $property->load(['location', 'user.certification']);

        return response()->json([
            'success' => true,
            'message' => 'Propriété mise à jour avec succès',
            'data' => [
                'property' => $property,
            ],
        ]);
    }

    /**
     * Supprimer une propriété.
     * 
     * @param Request $request
     * @param Property $property
     * @return JsonResponse
     */
    public function destroy(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Vérifier que l'utilisateur est propriétaire ou admin
        if ($property->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas autorisé à supprimer cette propriété',
            ], 403);
        }

        // Supprimer les images associées
        if (!empty($property->images)) {
            foreach ($property->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $property->delete();

        return response()->json([
            'success' => true,
            'message' => 'Propriété supprimée avec succès',
        ]);
    }

    /**
     * Upload images pour une propriété.
     * 
     * @param Request $request
     * @param Property $property
     * @return JsonResponse
     */
    public function uploadImages(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($property->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $request->validate([
            'images' => ['required', 'array', 'max:10'],
            'images.*' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'], // 5MB max
        ]);

        $uploadedImages = [];
        $existingImages = $property->images ?? [];

        foreach ($request->file('images') as $image) {
            $path = $image->store('properties', 'public');
            $uploadedImages[] = $path;
        }

        $property->update([
            'images' => array_merge($existingImages, $uploadedImages),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Images uploadées avec succès',
            'data' => [
                'images' => $property->images,
            ],
        ]);
    }

    /**
     * Supprimer une image d'une propriété.
     * 
     * @param Request $request
     * @param Property $property
     * @param string $image
     * @return JsonResponse
     */
    public function deleteImage(Request $request, Property $property, string $image): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($property->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $images = $property->images ?? [];
        $imageToDelete = urldecode($image);

        if (!in_array($imageToDelete, $images)) {
            return response()->json([
                'success' => false,
                'message' => 'Image non trouvée',
            ], 404);
        }

        Storage::disk('public')->delete($imageToDelete);

        $updatedImages = array_values(array_filter($images, fn($img) => $img !== $imageToDelete));

        $property->update(['images' => $updatedImages]);

        return response()->json([
            'success' => true,
            'message' => 'Image supprimée avec succès',
            'data' => [
                'images' => $property->images,
            ],
        ]);
    }

    /**
     * Publier une propriété.
     * 
     * @param Request $request
     * @param Property $property
     * @return JsonResponse
     */
    public function publish(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($property->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $property->update(['status' => 'published']);

        return response()->json([
            'success' => true,
            'message' => 'Propriété publiée avec succès',
            'data' => ['property' => $property],
        ]);
    }

    /**
     * Dépublier une propriété.
     * 
     * @param Request $request
     * @param Property $property
     * @return JsonResponse
     */
    public function unpublish(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($property->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $property->update(['status' => 'draft']);

        return response()->json([
            'success' => true,
            'message' => 'Propriété dépubliée avec succès',
            'data' => ['property' => $property],
        ]);
    }

    /**
     * Marquer une propriété comme vendue.
     * 
     * @param Request $request
     * @param Property $property
     * @return JsonResponse
     */
    public function markAsSold(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($property->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $property->update(['status' => 'sold']);

        return response()->json([
            'success' => true,
            'message' => 'Propriété marquée comme vendue',
            'data' => ['property' => $property],
        ]);
    }

    /**
     * Statistiques dashboard (Admin).
     * 
     * @return JsonResponse
     */
    public function dashboardStats(): JsonResponse
    {
        $stats = [
            'total_properties' => Property::count(),
            'published_properties' => Property::where('status', 'published')->count(),
            'draft_properties' => Property::where('status', 'draft')->count(),
            'sold_properties' => Property::where('status', 'sold')->count(),
            'total_views' => Property::sum('views_count'),
            'properties_this_month' => Property::whereMonth('created_at', now()->month)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => ['stats' => $stats],
        ]);
    }

    /**
     * Statistiques propriétés (Admin).
     * 
     * @return JsonResponse
     */
    public function propertyStats(): JsonResponse
    {
        $stats = [
            'by_type' => Property::selectRaw('type, COUNT(*) as count')
                ->groupBy('type')
                ->get(),
            'by_transaction' => Property::selectRaw('transaction_type, COUNT(*) as count')
                ->groupBy('transaction_type')
                ->get(),
            'by_status' => Property::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get(),
            'average_price' => Property::avg('price'),
            'most_viewed' => Property::orderBy('views_count', 'desc')->limit(10)->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => ['stats' => $stats],
        ]);
    }
}