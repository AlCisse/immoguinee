<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class VerifyN8NSignature
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $signature = $request->header('X-N8N-Signature');
        $secret = config('services.n8n.secret');

        if (!$secret) {
            Log::warning('N8N secret not configured');
            return response()->json(['error' => 'Service not configured'], 500);
        }

        // Calculer le hash attendu
        $payload = $request->getContent();
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        // Vérifier la signature
        if (!hash_equals($expectedSignature, $signature)) {
            Log::warning('Invalid N8N signature', [
                'received' => $signature,
                'expected' => $expectedSignature,
            ]);

            return response()->json(['error' => 'Invalid signature'], 401);
        }

        return $next($request);
    }
}

