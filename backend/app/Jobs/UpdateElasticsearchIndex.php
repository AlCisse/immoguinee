<?php

namespace App\Jobs;

use App\Models\Property;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UpdateElasticsearchIndex implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Property $property,
        public string $action = 'index' // 'index', 'update', 'delete'
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info('Updating Elasticsearch index', [
                'property_id' => $this->property->id,
                'action' => $this->action,
            ]);

            // TODO: Implémenter l'intégration Elasticsearch
            // Pour l'instant, on log juste l'action

            switch ($this->action) {
                case 'index':
                case 'update':
                    // Indexer ou mettre à jour la propriété
                    $this->indexProperty();
                    break;

                case 'delete':
                    // Supprimer de l'index
                    $this->deleteFromIndex();
                    break;
            }

            Log::info('Elasticsearch index updated successfully', [
                'property_id' => $this->property->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating Elasticsearch index', [
                'property_id' => $this->property->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Indexer la propriété
     */
    private function indexProperty(): void
    {
        // TODO: Implémenter l'indexation Elasticsearch
        // Exemple avec Laravel Scout si configuré
        // $this->property->searchable();
    }

    /**
     * Supprimer de l'index
     */
    private function deleteFromIndex(): void
    {
        // TODO: Implémenter la suppression de l'index
        // $this->property->unsearchable();
    }
}

