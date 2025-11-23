<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(
        private PaymentService $paymentService
    ) {}

    /**
     * Liste des transactions de l'utilisateur
     */
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $perPage = min((int) $request->input('per_page', 15), 100);
        $status = $request->input('status');

        $query = Transaction::where('user_id', $user->id);

        if ($status) {
            $query->where('status', $status);
        }

        $transactions = $query->with(['contract.property'])
            ->latest('created_at')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'transactions' => $transactions->items(),
                'pagination' => [
                    'total' => $transactions->total(),
                    'per_page' => $transactions->perPage(),
                    'current_page' => $transactions->currentPage(),
                    'last_page' => $transactions->lastPage(),
                ],
            ],
        ]);
    }

    /**
     * Détails d'une transaction
     */
    public function show(Request $request, Transaction $transaction): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if ($transaction->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $transaction->load(['contract.property', 'user']);

        return response()->json([
            'success' => true,
            'data' => ['transaction' => $transaction],
        ]);
    }

    /**
     * Payer une transaction
     */
    public function pay(Request $request, Transaction $transaction): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if ($transaction->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        if ($transaction->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Cette transaction est déjà payée',
            ], 422);
        }

        $validated = $request->validate([
            'payment_method' => ['required', 'string', 'in:orange_money,mtn_money,bank_transfer,cash'],
            'mobile_money_number' => ['required_if:payment_method,orange_money,mtn_money', 'string'],
            'payment_reference' => ['nullable', 'string'],
        ]);

        // Initier le paiement selon la méthode
        $result = match($validated['payment_method']) {
            'orange_money' => $this->paymentService->initiateOrangeMoneyPayment(
                $user,
                $transaction->amount,
                "Commission contrat #{$transaction->contract_id}"
            ),
            'mtn_money' => $this->paymentService->initiateMTNPayment(
                $user,
                $transaction->amount,
                "Commission contrat #{$transaction->contract_id}"
            ),
            default => ['status' => 'pending'],
        };

        // Mettre à jour la transaction
        $transaction->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_method' => $validated['payment_method'],
            'payment_reference' => $validated['payment_reference'] ?? $result['payment_id'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Paiement initié avec succès',
            'data' => [
                'transaction' => $transaction,
                'payment' => $result,
            ],
        ]);
    }

    /**
     * Transactions en attente de paiement
     */
    public function pending(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $transactions = Transaction::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'due', 'overdue'])
            ->with(['contract.property'])
            ->orderBy('due_date', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ['transactions' => $transactions],
        ]);
    }
}

