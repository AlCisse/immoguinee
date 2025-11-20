<?php

namespace App\Jobs;

use App\Models\Property;
use App\Services\ImageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessPropertyImages implements ShouldQueue
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
    public function handle(ImageService $imageService): void
    {
        try {
            Log::info('Processing property images', ['property_id' => $this->property->id]);

            $imageService->optimizePropertyImages($this->property);

            Log::info('Property images processed successfully', ['property_id' => $this->property->id]);
        } catch (\Exception $e) {
            Log::error('Error processing property images', [
                'property_id' => $this->property->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}

