<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Signature;
use App\Services\SignatureService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SignatureController extends Controller
{
    public function __construct(
        private SignatureService $signatureService
    ) {}

    /**
     * Demander OTP pour signature
     */
    public function requestOTP(Request $request, Contract $contract): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (!$this->signatureService->canSign($contract, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas autorisé à signer ce contrat',
            ], 403);
        }

        // Déterminer le type de signature
        $signatureType = match(true) {
            $contract->landlord_id === $user->id => 'landlord',
            $contract->tenant_id === $user->id => 'tenant',
            $contract->buyer_id === $user->id => $contract->type === 'sale_land' ? 'buyer' : 'buyer',
            default => 'landlord',
        };

        $signature = $this->signatureService->sendOTP($contract, $user, $signatureType);

        return response()->json([
            'success' => true,
            'message' => 'Code OTP envoyé par SMS',
            'data' => [
                'signature_id' => $signature->id,
                'expires_at' => $signature->otp_expires_at->toIso8601String(),
            ],
        ]);
    }

    /**
     * Vérifier OTP et signer
     */
    public function sign(Request $request, Contract $contract, Signature $signature): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if ($signature->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        if ($signature->status === 'signed') {
            return response()->json([
                'success' => false,
                'message' => 'Ce contrat est déjà signé',
            ], 422);
        }

        $validated = $request->validate([
            'otp_code' => ['required', 'string', 'size:6'],
        ]);

        try {
            $signature = $this->signatureService->verifyAndSign(
                $signature,
                $validated['otp_code'],
                $request->ip(),
                $request->userAgent()
            );

            $contract->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Contrat signé avec succès',
                'data' => [
                    'signature' => $signature,
                    'contract' => $contract,
                    'is_fully_signed' => $contract->isFullySigned(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Statut des signatures d'un contrat
     */
    public function status(Contract $contract): JsonResponse
    {
        $signatures = $contract->signatures()->with('user')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'contract_id' => $contract->id,
                'is_fully_signed' => $contract->isFullySigned(),
                'signatures' => $signatures,
            ],
        ]);
    }
}

