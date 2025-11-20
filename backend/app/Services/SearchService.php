<?php

namespace App\Services;

use App\Models\Property;
use Illuminate\Support\Facades\Cache;

class SearchService
{
    /**
     * Recherche intelligente avec cache
     */
    public function intelligentSearch(array $filters, int $perPage = 15)
    {
        $cacheKey = 'search_' . md5(serialize($filters) . $perPage);

        return Cache::remember($cacheKey, 300, function () use ($filters, $perPage) {
            $query = Property::query()->published()->with(['location', 'user']);

            // Appliquer les filtres
            $this->applyFilters($query, $filters);

            return $query->paginate($perPage);
        });
    }

    /**
     * Appliquer les filtres de recherche
     */
    private function applyFilters($query, array $filters): void
    {
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
    }

    /**
     * Suggestions de recherche
     */
    public function getSuggestions(string $term): array
    {
        $suggestions = [];

        // Suggestions de titres
        $properties = Property::published()
            ->where('title', 'ILIKE', "%{$term}%")
            ->limit(5)
            ->pluck('title')
            ->toArray();

        $suggestions = array_merge($suggestions, $properties);

        return array_unique($suggestions);
    }
}

