<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Dispute;
use App\Models\Mediation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediationController extends Controller
{
    /**
     * Créer un litige
     */
    public function createDispute(Request $request, Contract $contract): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (!$this->isPartyToContract($contract, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $validated = $request->validate([
            'type' => ['required', 'string', 'in:payment,property_condition,contract_breach,other'],
            'reason' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
        ]);

        // Déterminer l'autre partie
        $otherPartyId = match(true) {
            $contract->landlord_id === $user->id => $contract->tenant_id ?? $contract->buyer_id,
            $contract->tenant_id === $user->id => $contract->landlord_id,
            $contract->buyer_id === $user->id => $contract->landlord_id,
            default => null,
        };

        if (!$otherPartyId) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de déterminer l\'autre partie',
            ], 422);
        }

        $dispute = Dispute::create([
            'contract_id' => $contract->id,
            'initiator_id' => $user->id,
            'other_party_id' => $otherPartyId,
            'type' => $validated['type'],
            'reason' => $validated['reason'],
            'description' => $validated['description'],
            'status' => 'open',
        ]);

        // Créer une médiation automatiquement
        Mediation::create([
            'dispute_id' => $dispute->id,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Litige créé, médiation en cours',
            'data' => ['dispute' => $dispute],
        ], 201);
    }

    /**
     * Liste des litiges de l'utilisateur
     */
    public function disputes(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $perPage = min((int) $request->input('per_page', 15), 100);

        $disputes = Dispute::where(function ($query) use ($user) {
            $query->where('initiator_id', $user->id)
                  ->orWhere('other_party_id', $user->id);
        })
        ->with(['contract.property', 'initiator', 'otherParty', 'mediations'])
        ->latest('created_at')
        ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'disputes' => $disputes->items(),
                'pagination' => [
                    'total' => $disputes->total(),
                    'per_page' => $disputes->perPage(),
                    'current_page' => $disputes->currentPage(),
                    'last_page' => $disputes->lastPage(),
                ],
            ],
        ]);
    }

    /**
     * Détails d'un litige
     */
    public function showDispute(Request $request, Dispute $dispute): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if ($dispute->initiator_id !== $user->id && $dispute->other_party_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $dispute->load(['contract.property', 'initiator', 'otherParty', 'mediations.mediator']);

        return response()->json([
            'success' => true,
            'data' => ['dispute' => $dispute],
        ]);
    }

    /**
     * Vérifier si l'utilisateur est partie au contrat
     */
    private function isPartyToContract(Contract $contract, \App\Models\User $user): bool
    {
        return $contract->landlord_id === $user->id
            || $contract->tenant_id === $user->id
            || $contract->buyer_id === $user->id;
    }
}

