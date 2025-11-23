<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Controller pour la gestion des messages.
 * 
 * Gère l'envoi, la réception, et la gestion des conversations
 * entre utilisateurs et propriétaires de biens.
 * 
 * @package App\Http\Controllers\Api
 * @author LaravelMaster
 */
class MessageController extends Controller
{
    /**
     * Liste des messages de l'utilisateur connecté.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $perPage = min((int) $request->input('per_page', 20), 100);

        // Messages reçus ou envoyés
        $messages = Message::query()
            ->where(function ($query) use ($user) {
                $query->where('sender_id', $user->id)
                      ->orWhere('receiver_id', $user->id);
            })
            ->with(['sender', 'receiver', 'property'])
            ->latest('created_at')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'messages' => $messages->items(),
                'pagination' => [
                    'total' => $messages->total(),
                    'per_page' => $messages->perPage(),
                    'current_page' => $messages->currentPage(),
                    'last_page' => $messages->lastPage(),
                ],
            ],
        ]);
    }

    /**
     * Détails d'un message spécifique.
     * 
     * @param Request $request
     * @param Message $message
     * @return JsonResponse
     */
    public function show(Request $request, Message $message): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Vérifier que l'utilisateur est l'expéditeur ou le destinataire
        if ($message->sender_id !== $user->id && $message->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $message->load(['sender', 'receiver', 'property']);

        // Marquer comme lu si l'utilisateur est le destinataire
        if ($message->receiver_id === $user->id && !$message->is_read) {
            $message->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'message' => $message,
            ],
        ]);
    }

    /**
     * Envoyer un message (utilisateur authentifié).
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function send(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'receiver_id' => ['required', 'integer', 'exists:users,id'],
            'property_id' => ['nullable', 'integer', 'exists:properties,id'],
            'subject' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'string', 'max:5000'],
        ]);

        // Empêcher de s'envoyer un message à soi-même
        if ($validated['receiver_id'] === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas vous envoyer un message à vous-même',
            ], 422);
        }

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $validated['receiver_id'],
            'property_id' => $validated['property_id'] ?? null,
            'subject' => $validated['subject'] ?? null,
            'content' => $validated['content'],
            'is_read' => false,
        ]);

        $message->load(['sender', 'receiver', 'property']);

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès',
            'data' => [
                'message' => $message,
            ],
        ], 201);
    }

    /**
     * Envoyer un message de contact (sans authentification).
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function sendContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'property_id' => ['required', 'integer', 'exists:properties,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:5000'],
        ]);

        // Récupérer le propriétaire de la propriété
        $property = \App\Models\Property::findOrFail($validated['property_id']);

        // Créer un message "anonyme" (sender_id = null)
        $message = Message::create([
            'sender_id' => null, // Message de contact anonyme
            'receiver_id' => $property->user_id,
            'property_id' => $validated['property_id'],
            'subject' => $validated['subject'],
            'content' => "Contact de: {$validated['name']} ({$validated['email']})\n"
                    . ($validated['phone'] ? "Téléphone: {$validated['phone']}\n\n" : "\n")
                    . $validated['body'],
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès',
        ], 201);
    }

    /**
     * Marquer un message comme lu.
     * 
     * @param Request $request
     * @param Message $message
     * @return JsonResponse
     */
    public function markAsRead(Request $request, Message $message): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Seul le destinataire peut marquer comme lu
        if ($message->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $message->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message marqué comme lu',
            'data' => [
                'message' => $message,
            ],
        ]);
    }

    /**
     * Supprimer un message.
     * 
     * @param Request $request
     * @param Message $message
     * @return JsonResponse
     */
    public function destroy(Request $request, Message $message): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Seul l'expéditeur ou le destinataire peut supprimer
        if ($message->sender_id !== $user->id && $message->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message supprimé avec succès',
        ]);
    }

    /**
     * Liste des conversations de l'utilisateur.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function conversations(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Récupérer les utilisateurs avec qui l'utilisateur a échangé
        $conversations = Message::query()
            ->select([
                DB::raw('CASE 
                    WHEN sender_id = ' . $user->id . ' THEN receiver_id 
                    ELSE sender_id 
                END as contact_id'),
                DB::raw('MAX(created_at) as last_message_at'),
                DB::raw('COUNT(*) as messages_count'),
                DB::raw('SUM(CASE WHEN receiver_id = ' . $user->id . ' AND is_read = false THEN 1 ELSE 0 END) as unread_count'),
            ])
            ->where(function ($query) use ($user) {
                $query->where('sender_id', $user->id)
                      ->orWhere('receiver_id', $user->id);
            })
            ->groupBy('contact_id')
            ->orderBy('last_message_at', 'desc')
            ->get();

        // Charger les infos des contacts
        $contactIds = $conversations->pluck('contact_id')->toArray();
        $contacts = User::whereIn('id', $contactIds)->get()->keyBy('id');

        $conversationsWithContacts = $conversations->map(function ($conv) use ($contacts) {
            return [
                'contact' => $contacts[$conv->contact_id] ?? null,
                'last_message_at' => $conv->last_message_at,
                'messages_count' => $conv->messages_count,
                'unread_count' => $conv->unread_count,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'conversations' => $conversationsWithContacts,
            ],
        ]);
    }

    /**
     * Conversation avec un utilisateur spécifique.
     * 
     * @param Request $request
     * @param int $userId
     * @return JsonResponse
     */
    public function conversation(Request $request, int $userId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $contact = User::findOrFail($userId);

        $perPage = min((int) $request->input('per_page', 50), 100);

        $messages = Message::query()
            ->where(function ($query) use ($user, $userId) {
                $query->where(function ($q) use ($user, $userId) {
                    $q->where('sender_id', $user->id)
                      ->where('receiver_id', $userId);
                })->orWhere(function ($q) use ($user, $userId) {
                    $q->where('sender_id', $userId)
                      ->where('receiver_id', $user->id);
                });
            })
            ->with(['property'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Marquer les messages reçus comme lus
        Message::query()
            ->where('sender_id', $userId)
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'data' => [
                'contact' => $contact,
                'messages' => $messages->items(),
                'pagination' => [
                    'total' => $messages->total(),
                    'per_page' => $messages->perPage(),
                    'current_page' => $messages->currentPage(),
                    'last_page' => $messages->lastPage(),
                ],
            ],
        ]);
    }
}