<?php

namespace App\Http\Middleware;

use App\Models\Property;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPropertyOwner
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Les admins peuvent tout faire
        if ($user->isAdmin()) {
            return $next($request);
        }

        // Récupérer la propriété depuis la route
        $propertyId = $request->route('property') ?? $request->route('id');
        
        if ($propertyId instanceof Property) {
            $property = $propertyId;
        } else {
            $property = Property::findOrFail($propertyId);
        }

        // Vérifier que l'utilisateur est propriétaire
        if ($property->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas autorisé à effectuer cette action sur cette propriété',
            ], 403);
        }

        return $next($request);
    }
}

