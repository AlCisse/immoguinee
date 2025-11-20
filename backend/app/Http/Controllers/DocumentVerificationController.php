<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentVerification;
use App\Models\Property;
use App\Services\VerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentVerificationController extends Controller
{
    public function __construct(
        private VerificationService $verificationService
    ) {}

    /**
     * Upload un document pour vérification
     */
    public function upload(Request $request, Property $property): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if ($property->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $validated = $request->validate([
            'document_type' => ['required', 'string', 'in:title_deed,identity,ownership_proof,other'],
            'document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'], // 5MB
            'document_number' => ['nullable', 'string', 'max:100'],
        ]);

        $path = $request->file('document')->store('verifications', 'public');

        $verification = DocumentVerification::create([
            'property_id' => $property->id,
            'user_id' => $user->id,
            'document_type' => $validated['document_type'],
            'document_path' => $path,
            'document_number' => $validated['document_number'] ?? null,
            'status' => 'pending',
        ]);

        // Démarrer la vérification automatique si c'est un titre foncier
        if ($validated['document_type'] === 'title_deed') {
            $this->verificationService->verifyTitleDeed($verification);
        }

        return response()->json([
            'success' => true,
            'message' => 'Document uploadé, vérification en cours',
            'data' => [
                'verification' => $verification,
                'document_url' => Storage::url($path),
            ],
        ], 201);
    }

    /**
     * Liste des vérifications d'une propriété
     */
    public function index(Request $request, Property $property): JsonResponse
    {
        $verifications = DocumentVerification::where('property_id', $property->id)
            ->with(['user', 'verifier'])
            ->latest('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ['verifications' => $verifications],
        ]);
    }

    /**
     * Statut d'une vérification
     */
    public function show(DocumentVerification $verification): JsonResponse
    {
        $verification->load(['property', 'user', 'verifier']);

        return response()->json([
            'success' => true,
            'data' => [
                'verification' => $verification,
                'document_url' => Storage::url($verification->document_path),
            ],
        ]);
    }
}

