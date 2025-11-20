<?php

namespace App\Services;

use App\Models\DocumentVerification;
use Illuminate\Support\Facades\Log;

class VerificationService
{
    /**
     * Vérifier un titre foncier
     */
    public function verifyTitleDeed(DocumentVerification $verification): void
    {
        // TODO: Intégration avec CEPAF (Centre d'Enregistrement et de Publicité Foncière)
        // Pour l'instant, simulation

        Log::info('Vérification titre foncier', [
            'verification_id' => $verification->id,
            'document_number' => $verification->document_number,
        ]);

        // Simulation : vérification en cours
        $verification->update([
            'status' => 'under_review',
        ]);

        // TODO: Appel API CEPAF si disponible
        // $result = CEPAFApi::verify($verification->document_number);
        
        // Pour l'instant, on marque comme vérifié après 48h (simulation)
        // En production, ce serait fait par un job ou webhook
    }

    /**
     * Vérifier manuellement un document (Admin)
     */
    public function verifyManually(DocumentVerification $verification, int $verifierId, bool $approved, ?string $notes = null): void
    {
        $verification->update([
            'status' => $approved ? 'verified' : 'rejected',
            'verified_by' => $verifierId,
            'verified_at' => now(),
            'rejection_reason' => $approved ? null : $notes,
            'notes' => $notes,
        ]);
    }
}

