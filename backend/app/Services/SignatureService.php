<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\Signature;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class SignatureService
{
    /**
     * Générer et envoyer OTP pour signature
     */
    public function sendOTP(Contract $contract, User $user, string $signatureType): Signature
    {
        // Vérifier si signature existe déjà
        $signature = Signature::where('contract_id', $contract->id)
            ->where('user_id', $user->id)
            ->where('signature_type', $signatureType)
            ->first();

        if (!$signature) {
            $signature = Signature::create([
                'contract_id' => $contract->id,
                'user_id' => $user->id,
                'signature_type' => $signatureType,
                'status' => 'pending',
            ]);
        }

        // Générer code OTP (6 chiffres)
        $otpCode = str_pad((string)rand(0, 999999), 6, '0', STR_PAD_LEFT);

        $signature->update([
            'otp_code' => $otpCode,
            'otp_sent_at' => now(),
            'otp_expires_at' => now()->addMinutes(10), // 10 minutes validité
            'status' => 'otp_sent',
        ]);

        // Envoyer SMS
        $this->sendSMS($user->phone, "Votre code de signature est : {$otpCode}. Valable 10 minutes.");

        return $signature;
    }

    /**
     * Vérifier OTP et signer
     */
    public function verifyAndSign(Signature $signature, string $otpCode, string $ipAddress, string $userAgent): Signature
    {
        if (!$signature->isValidOtp($otpCode)) {
            throw new \Exception('Code OTP invalide ou expiré');
        }

        // Générer hash pour preuve
        $hash = $this->generateHash($signature);

        $signature->update([
            'otp_verified' => true,
            'signed_at' => now(),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'hash' => $hash,
            'status' => 'signed',
        ]);

        // Vérifier si toutes les signatures sont complètes
        $contract = $signature->contract;
        if ($contract->isFullySigned()) {
            // Finaliser le contrat
            app(\App\Services\ContractService::class)->finalizeContract($contract);
        }

        return $signature;
    }

    /**
     * Générer hash pour preuve
     */
    private function generateHash(Signature $signature): string
    {
        $data = [
            'contract_id' => $signature->contract_id,
            'user_id' => $signature->user_id,
            'signed_at' => $signature->signed_at->toIso8601String(),
            'signature_type' => $signature->signature_type,
        ];

        return hash('sha256', json_encode($data) . config('app.key'));
    }

    /**
     * Envoyer SMS (à intégrer avec SMS Gateway)
     */
    private function sendSMS(string $phone, string $message): void
    {
        // TODO: Intégration SMS Gateway (Orange/MTN)
        // Pour l'instant, on log juste
        Log::info('SMS à envoyer', [
            'phone' => $phone,
            'message' => $message,
        ]);

        // Exemple avec un service SMS (à configurer)
        // SMSGateway::send($phone, $message);
    }

    /**
     * Vérifier si un utilisateur peut signer
     */
    public function canSign(Contract $contract, User $user): bool
    {
        // Vérifier que l'utilisateur est partie au contrat
        return $contract->landlord_id === $user->id 
            || $contract->tenant_id === $user->id
            || $contract->buyer_id === $user->id;
    }
}

