<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Créer une notification
     */
    public function createNotification(User $user, string $type, string $title, string $message, array $data = []): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    /**
     * Notifier un nouveau match de recherche sauvegardée
     */
    public function notifySavedSearchMatch(User $user, int $propertyId, array $searchFilters): void
    {
        $this->createNotification(
            $user,
            'saved_search_match',
            'Nouvelle propriété correspondant à votre recherche',
            'Une nouvelle propriété correspond à vos critères de recherche.',
            [
                'property_id' => $propertyId,
                'filters' => $searchFilters,
            ]
        );
    }

    /**
     * Notifier un nouveau message
     */
    public function notifyNewMessage(User $user, int $messageId): void
    {
        $this->createNotification(
            $user,
            'new_message',
            'Nouveau message',
            'Vous avez reçu un nouveau message.',
            ['message_id' => $messageId]
        );
    }

    /**
     * Notifier une nouvelle propriété favorite
     */
    public function notifyFavoriteProperty(User $user, int $propertyId): void
    {
        $this->createNotification(
            $user,
            'favorite_property',
            'Propriété ajoutée aux favoris',
            'Une propriété a été ajoutée à vos favoris.',
            ['property_id' => $propertyId]
        );
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Obtenir les notifications non lues
     */
    public function getUnreadNotifications(User $user, int $limit = 10)
    {
        return Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->latest()
            ->limit($limit)
            ->get();
    }
}

