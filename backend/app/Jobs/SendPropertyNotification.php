<?php

namespace App\Jobs;

use App\Models\Property;
use App\Models\SavedSearch;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendPropertyNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Property $property
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(NotificationService $notificationService): void
    {
        try {
            Log::info('Sending property notifications', ['property_id' => $this->property->id]);

            // Trouver les recherches sauvegardées qui correspondent
            $savedSearches = SavedSearch::where('is_active', true)->get();

            foreach ($savedSearches as $savedSearch) {
                if ($this->matchesSearch($savedSearch)) {
                    $notificationService->notifySavedSearchMatch(
                        $savedSearch->user,
                        $this->property->id,
                        $savedSearch->filters
                    );
                }
            }

            Log::info('Property notifications sent successfully', ['property_id' => $this->property->id]);
        } catch (\Exception $e) {
            Log::error('Error sending property notifications', [
                'property_id' => $this->property->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Vérifier si la propriété correspond à la recherche
     */
    private function matchesSearch(SavedSearch $savedSearch): bool
    {
        $filters = $savedSearch->filters;
        $property = $this->property;

        // Vérifier les filtres
        if (isset($filters['type']) && $property->type !== $filters['type']) {
            return false;
        }

        if (isset($filters['transaction_type']) && $property->transaction_type !== $filters['transaction_type']) {
            return false;
        }

        if (isset($filters['price_min']) && $property->price < $filters['price_min']) {
            return false;
        }

        if (isset($filters['price_max']) && $property->price > $filters['price_max']) {
            return false;
        }

        if (isset($filters['location_id']) && $property->location_id !== $filters['location_id']) {
            return false;
        }

        return true;
    }
}

