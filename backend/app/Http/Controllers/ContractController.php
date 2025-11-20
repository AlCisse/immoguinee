<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Property;
use App\Models\User;
use App\Services\ContractService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    public function __construct(
        private ContractService $contractService
    ) {}

    /**
     * Générer un contrat de location
     */
    public function generateLocation(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Vérifier que l'utilisateur est propriétaire
        if ($property->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $validated = $request->validate([
            'tenant_id' => ['required', 'integer', 'exists:users,id'],
            'rent_amount' => ['required', 'numeric', 'min:0'],
            'deposit' => ['nullable', 'numeric', 'min:0'],
            'start_date' => ['required', 'date'],
            'duration_months' => ['required', 'integer', 'min:1', 'max:120'],
            'charges_included' => ['nullable', 'boolean'],
            'payment_day' => ['nullable', 'integer', 'min:1', 'max:31'],
            'renewal_type' => ['nullable', 'string', 'in:tacite,expresse'],
            'notice_period_months' => ['nullable', 'integer', 'min:1'],
            'landlord_address' => ['nullable', 'string'],
            'tenant_address' => ['nullable', 'string'],
            'additional_terms' => ['nullable', 'array'],
        ]);

        $tenant = User::findOrFail($validated['tenant_id']);

        $contract = $this->contractService->generateLocationContract(
            $property,
            $user,
            $tenant,
            $validated
        );

        $contract->load(['property', 'landlord', 'tenant']);

        return response()->json([
            'success' => true,
            'message' => 'Contrat généré avec succès',
            'data' => [
                'contract' => $contract,
                'pdf_url' => Storage::url($contract->pdf_path),
            ],
        ], 201);
    }

    /**
     * Générer un contrat de vente
     */
    public function generateSale(Request $request, Property $property): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($property->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $validated = $request->validate([
            'buyer_id' => ['required', 'integer', 'exists:users,id'],
            'sale_price' => ['required', 'numeric', 'min:0'],
            'deposit' => ['nullable', 'numeric', 'min:0'],
            'payment_terms' => ['nullable', 'string'],
            'title_deed_number' => ['nullable', 'string'],
        ]);

        $buyer = User::findOrFail($validated['buyer_id']);
        $contractType = $property->type === 'land' ? 'sale_land' : 'sale_property';

        $contract = match($contractType) {
            'sale_land' => $this->contractService->generateSaleLandContract($property, $user, $buyer, $validated),
            'sale_property' => $this->contractService->generateSalePropertyContract($property, $user, $buyer, $validated),
        };

        $contract->load(['property', 'landlord', 'buyer']);

        return response()->json([
            'success' => true,
            'message' => 'Contrat généré avec succès',
            'data' => [
                'contract' => $contract,
                'pdf_url' => Storage::url($contract->pdf_path),
            ],
        ], 201);
    }

    /**
     * Envoyer le contrat
     */
    public function send(Request $request, Contract $contract): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($contract->landlord_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $contract = $this->contractService->sendContract($contract);
        $contract->load(['property', 'landlord', 'tenant', 'buyer']);

        return response()->json([
            'success' => true,
            'message' => 'Contrat envoyé avec succès',
            'data' => ['contract' => $contract],
        ]);
    }

    /**
     * Détails d'un contrat
     */
    public function show(Request $request, Contract $contract): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Vérifier que l'utilisateur est partie au contrat
        if (!$this->isPartyToContract($contract, $user) && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $contract->load(['property', 'landlord', 'tenant', 'buyer', 'signatures', 'versions', 'amendments']);

        return response()->json([
            'success' => true,
            'data' => [
                'contract' => $contract,
                'pdf_url' => $contract->pdf_path ? Storage::url($contract->pdf_path) : null,
                'signed_pdf_url' => $contract->signed_pdf_path ? Storage::url($contract->signed_pdf_path) : null,
            ],
        ]);
    }

    /**
     * Liste des contrats de l'utilisateur
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $perPage = min((int) $request->input('per_page', 15), 100);
        $status = $request->input('status');
        $type = $request->input('type');

        $query = Contract::where(function ($q) use ($user) {
            $q->where('landlord_id', $user->id)
              ->orWhere('tenant_id', $user->id)
              ->orWhere('buyer_id', $user->id);
        });

        if ($status) {
            $query->where('status', $status);
        }

        if ($type) {
            $query->where('type', $type);
        }

        $contracts = $query->with(['property', 'landlord', 'tenant', 'buyer'])
            ->latest('created_at')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'contracts' => $contracts->items(),
                'pagination' => [
                    'total' => $contracts->total(),
                    'per_page' => $contracts->perPage(),
                    'current_page' => $contracts->currentPage(),
                    'last_page' => $contracts->lastPage(),
                ],
            ],
        ]);
    }

    /**
     * Proposer des amendements
     */
    public function proposeAmendment(Request $request, Contract $contract): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (!$this->isPartyToContract($contract, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $validated = $request->validate([
            'changes' => ['required', 'array'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        \App\Models\ContractAmendment::create([
            'contract_id' => $contract->id,
            'proposed_by' => $user->id,
            'changes' => $validated['changes'],
            'reason' => $validated['reason'] ?? null,
            'status' => 'pending',
        ]);

        $contract->update(['status' => 'under_review']);

        return response()->json([
            'success' => true,
            'message' => 'Amendement proposé avec succès',
        ], 201);
    }

    /**
     * Accepter/Refuser un amendement
     */
    public function respondToAmendment(Request $request, Contract $contract, int $amendmentId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($contract->landlord_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Seul le propriétaire peut répondre',
            ], 403);
        }

        $amendment = \App\Models\ContractAmendment::where('contract_id', $contract->id)
            ->findOrFail($amendmentId);

        $validated = $request->validate([
            'action' => ['required', 'string', 'in:accept,reject'],
        ]);

        if ($validated['action'] === 'accept') {
            // Créer nouvelle version avec changements
            $this->contractService->createVersion($contract, $amendment->changes);
            $amendment->update([
                'status' => 'accepted',
                'responded_by' => $user->id,
                'responded_at' => now(),
            ]);
        } else {
            $amendment->update([
                'status' => 'rejected',
                'responded_by' => $user->id,
                'responded_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Amendement ' . $validated['action'] === 'accept' ? 'accepté' : 'refusé',
        ]);
    }

    /**
     * Rétracter un contrat signé
     */
    public function retract(Request $request, Contract $contract): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (!$this->isPartyToContract($contract, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        if (!$contract->canRetract()) {
            return response()->json([
                'success' => false,
                'message' => 'Le délai de rétractation est expiré',
            ], 422);
        }

        $contract->update([
            'status' => 'retracted',
            'retraction_used' => true,
        ]);

        // Annuler les transactions
        $contract->transactions()->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Contrat rétracté avec succès',
        ]);
    }

    /**
     * Vérifier si l'utilisateur est partie au contrat
     */
    private function isPartyToContract(Contract $contract, User $user): bool
    {
        return $contract->landlord_id === $user->id
            || $contract->tenant_id === $user->id
            || $contract->buyer_id === $user->id;
    }
}

