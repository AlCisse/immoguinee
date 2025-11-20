<?php

namespace App\Services;

use App\Models\Property;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PropertyService
{
    /**
     * Créer une nouvelle propriété
     */
    public function createProperty(array $data, User $user): Property
    {
        $data['user_id'] = $user->id;
        $data['slug'] = $this->generateUniqueSlug($data['title']);
        $data['status'] = $data['status'] ?? 'draft';

        return Property::create($data);
    }

    /**
     * Mettre à jour une propriété
     */
    public function updateProperty(Property $property, array $data): Property
    {
        if (isset($data['title']) && $data['title'] !== $property->title) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $property->id);
        }

        $property->update($data);

        return $property->fresh();
    }

    /**
     * Supprimer une propriété et ses images
     */
    public function deleteProperty(Property $property): bool
    {
        // Supprimer les images
        if ($property->images) {
            foreach ($property->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        // Supprimer les images de la table property_images
        $property->images()->delete();

        return $property->delete();
    }

    /**
     * Publier une propriété
     */
    public function publishProperty(Property $property): Property
    {
        $property->update(['status' => 'published']);
        return $property->fresh();
    }

    /**
     * Marquer comme vendue
     */
    public function markAsSold(Property $property): Property
    {
        $property->update(['status' => 'sold']);
        return $property->fresh();
    }

    /**
     * Générer un slug unique
     */
    private function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (Property::where('slug', $slug)
            ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
            ->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Recherche avancée
     */
    public function search(array $filters)
    {
        $query = Property::query()->published();

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['transaction_type'])) {
            $query->where('transaction_type', $filters['transaction_type']);
        }

        if (isset($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (isset($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        if (isset($filters['surface_min'])) {
            $query->where('surface', '>=', $filters['surface_min']);
        }

        if (isset($filters['surface_max'])) {
            $query->where('surface', '<=', $filters['surface_max']);
        }

        if (isset($filters['bedrooms'])) {
            $query->where('bedrooms', '>=', $filters['bedrooms']);
        }

        if (isset($filters['bathrooms'])) {
            $query->where('bathrooms', '>=', $filters['bathrooms']);
        }

        if (isset($filters['location_id'])) {
            $query->where('location_id', $filters['location_id']);
        }

        if (isset($filters['query'])) {
            $searchTerm = $filters['query'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'ILIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'ILIKE', "%{$searchTerm}%");
            });
        }

        // Tri
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $allowedSorts = ['created_at', 'price', 'surface', 'title', 'views_count'];
        
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        return $query;
    }
}

