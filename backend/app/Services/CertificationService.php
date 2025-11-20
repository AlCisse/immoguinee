<?php

namespace App\Services;

use App\Models\Certification;
use App\Models\User;
use App\Models\Review;
use App\Models\Contract;
use Illuminate\Support\Facades\DB;

class CertificationService
{
    /**
     * Créer ou mettre à jour la certification d'un utilisateur
     */
    public function updateCertification(User $user): Certification
    {
        $certification = Certification::firstOrNew(['user_id' => $user->id]);

        // Calculer les métriques
        $transactionsCount = $this->getTransactionsCount($user);
        $averageRating = $this->getAverageRating($user);
        $disputesCount = $this->getDisputesCount($user);
        $responseTime = $this->getAverageResponseTime($user);

        // Mettre à jour les données
        $certification->transactions_count = $transactionsCount;
        $certification->average_rating = $averageRating;
        $certification->disputes_count = $disputesCount;
        $certification->response_time_minutes = $responseTime;
        $certification->phone_verified = !empty($user->phone);
        $certification->email_verified = !empty($user->email_verified_at);
        $certification->identity_verified = false; // À implémenter avec vérification documents
        $certification->title_verified = false; // À implémenter avec vérification documents

        // Calculer le niveau
        $newLevel = $this->calculateLevel($certification);
        $certification->level = $newLevel;

        // Calculer les points
        $certification->points = $this->calculatePoints($certification);

        // Si niveau change, mettre à jour verified_at
        if ($certification->exists && $certification->getOriginal('level') !== $newLevel) {
            $certification->verified_at = now();
        } elseif (!$certification->exists) {
            $certification->verified_at = now();
        }

        $certification->save();

        return $certification;
    }

    /**
     * Calculer le niveau de certification
     */
    private function calculateLevel(Certification $certification): string
    {
        // DIAMANT
        if ($certification->transactions_count >= 20 
            && $certification->average_rating >= 4.5 
            && $certification->disputes_count === 0
            && $certification->response_time_minutes <= 120) {
            return 'diamond';
        }
        
        // OR
        if ($certification->transactions_count >= 5 
            && $certification->average_rating >= 4 
            && $certification->identity_verified) {
            return 'gold';
        }
        
        // ARGENT
        if ($certification->transactions_count >= 1 
            && $certification->average_rating >= 3) {
            return 'silver';
        }
        
        // BRONZE (par défaut)
        return 'bronze';
    }

    /**
     * Calculer les points
     */
    private function calculatePoints(Certification $certification): int
    {
        $points = 0;

        // Points de base
        $points += $certification->transactions_count * 10;
        
        // Points pour la note moyenne
        $points += (int)($certification->average_rating * 20);
        
        // Points pour vérifications
        if ($certification->phone_verified) $points += 5;
        if ($certification->email_verified) $points += 5;
        if ($certification->identity_verified) $points += 20;
        if ($certification->title_verified) $points += 30;
        
        // Pénalités pour litiges
        $points -= $certification->disputes_count * 10;
        
        // Bonus pour réactivité
        if ($certification->response_time_minutes <= 60) $points += 15;
        elseif ($certification->response_time_minutes <= 120) $points += 10;

        return max(0, $points);
    }

    /**
     * Obtenir le nombre de transactions réussies
     */
    private function getTransactionsCount(User $user): int
    {
        return Contract::where(function ($query) use ($user) {
            $query->where('landlord_id', $user->id)
                  ->orWhere('tenant_id', $user->id)
                  ->orWhere('buyer_id', $user->id);
        })
        ->where('status', 'signed')
        ->count();
    }

    /**
     * Obtenir la note moyenne
     */
    private function getAverageRating(User $user): float
    {
        $rating = Review::where('reviewed_user_id', $user->id)
            ->avg('rating');

        return round((float)$rating, 2);
    }

    /**
     * Obtenir le nombre de litiges
     */
    private function getDisputesCount(User $user): int
    {
        return DB::table('disputes')
            ->where(function ($query) use ($user) {
                $query->where('initiator_id', $user->id)
                      ->orWhere('other_party_id', $user->id);
            })
            ->where('status', '!=', 'resolved')
            ->count();
    }

    /**
     * Obtenir le temps de réponse moyen (en minutes)
     */
    private function getAverageResponseTime(User $user): ?int
    {
        // Calculer le temps moyen de réponse aux messages
        $avgTime = DB::table('messages')
            ->where('receiver_id', $user->id)
            ->whereNotNull('read_at')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (read_at - created_at)) / 60) as avg_minutes')
            ->value('avg_minutes');

        return $avgTime ? (int)round($avgTime) : null;
    }

    /**
     * Vérifier si un utilisateur peut être certifié
     */
    public function canBeCertified(User $user): bool
    {
        $certification = $user->certification;
        
        if (!$certification) {
            return false;
        }

        return $certification->level !== 'bronze';
    }

    /**
     * Obtenir le badge de certification formaté
     */
    public function getBadge(User $user): ?array
    {
        return $user->certification_badge;
    }
}

