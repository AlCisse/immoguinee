<?php

declare(strict_types=1);

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\SignatureController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\MediationController;
use App\Http\Controllers\Api\DocumentVerificationController;

/*
|--------------------------------------------------------------------------
| API Routes - Plateforme Immobilière Guinée
|--------------------------------------------------------------------------
|
| Routes API RESTful pour la plateforme immobilière.
| Toutes les routes sont préfixées par /api/v1
| Les routes protégées nécessitent un token Sanctum
|
*/

// ====================================================================
// ROUTES PUBLIQUES (Sans authentification)
// ====================================================================

Route::prefix('v1')->group(function () {
    
    // ----------------------------------------------------------------
    // AUTHENTIFICATION
    // ----------------------------------------------------------------
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register'])
            ->name('auth.register');
        
        Route::post('/login', [AuthController::class, 'login'])
            ->name('auth.login');
        
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
            ->name('auth.forgot-password');
        
        Route::post('/reset-password', [AuthController::class, 'resetPassword'])
            ->name('auth.reset-password');
    });

    // ----------------------------------------------------------------
    // PROPRIÉTÉS (Lecture seule pour invités)
    // ----------------------------------------------------------------
    Route::prefix('properties')->group(function () {
        Route::get('/', [PropertyController::class, 'index'])
            ->name('properties.index');
        
        Route::get('/search', [PropertyController::class, 'search'])
            ->name('properties.search');
        
        Route::get('/featured', [PropertyController::class, 'featured'])
            ->name('properties.featured');
        
        Route::get('/{property}', [PropertyController::class, 'show'])
            ->name('properties.show');
    });

    // ----------------------------------------------------------------
    // LOCALISATIONS (Lecture seule)
    // ----------------------------------------------------------------
    Route::prefix('locations')->group(function () {
        Route::get('/', [LocationController::class, 'index'])
            ->name('locations.index');
        
        Route::get('/cities', [LocationController::class, 'cities'])
            ->name('locations.cities');
        
        Route::get('/districts/{city}', [LocationController::class, 'districts'])
            ->name('locations.districts');
        
        Route::get('/{location}', [LocationController::class, 'show'])
            ->name('locations.show');
    });

    // ----------------------------------------------------------------
    // MESSAGES (Contact vendeur sans auth)
    // ----------------------------------------------------------------
    Route::post('/messages/contact', [MessageController::class, 'sendContact'])
        ->name('messages.contact');
});

// ====================================================================
// ROUTES PROTÉGÉES (Nécessitent authentification Sanctum)
// ====================================================================

Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    
    // ----------------------------------------------------------------
    // AUTHENTIFICATION (Routes protégées)
    // ----------------------------------------------------------------
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])
            ->name('auth.logout');
        
        Route::get('/me', [AuthController::class, 'me'])
            ->name('auth.me');
        
        Route::post('/refresh', [AuthController::class, 'refresh'])
            ->name('auth.refresh');
    });

    // ----------------------------------------------------------------
    // PROFIL UTILISATEUR
    // ----------------------------------------------------------------
    Route::prefix('profile')->group(function () {
        Route::get('/', [UserController::class, 'profile'])
            ->name('user.profile');
        
        Route::put('/', [UserController::class, 'updateProfile'])
            ->name('user.update-profile');
        
        Route::put('/password', [UserController::class, 'updatePassword'])
            ->name('user.update-password');
        
        Route::post('/avatar', [UserController::class, 'uploadAvatar'])
            ->name('user.upload-avatar');
        
        Route::delete('/avatar', [UserController::class, 'deleteAvatar'])
            ->name('user.delete-avatar');
    });

    // ----------------------------------------------------------------
    // PROPRIÉTÉS (Gestion complète pour utilisateurs authentifiés)
    // ----------------------------------------------------------------
    Route::prefix('properties')->group(function () {
        // Mes propriétés
        Route::get('/my-properties', [PropertyController::class, 'myProperties'])
            ->name('properties.my-properties');
        
        // CRUD propriétés (seulement pour agents/admins)
        Route::post('/', [PropertyController::class, 'store'])
            ->name('properties.store');
        
        Route::put('/{property}', [PropertyController::class, 'update'])
            ->name('properties.update');
        
        Route::delete('/{property}', [PropertyController::class, 'destroy'])
            ->name('properties.destroy');
        
        // Upload images
        Route::post('/{property}/images', [PropertyController::class, 'uploadImages'])
            ->name('properties.upload-images');
        
        Route::delete('/{property}/images/{image}', [PropertyController::class, 'deleteImage'])
            ->name('properties.delete-image');
        
        // Statut propriété
        Route::patch('/{property}/publish', [PropertyController::class, 'publish'])
            ->name('properties.publish');
        
        Route::patch('/{property}/unpublish', [PropertyController::class, 'unpublish'])
            ->name('properties.unpublish');
        
        Route::patch('/{property}/sold', [PropertyController::class, 'markAsSold'])
            ->name('properties.sold');
    });

    // ----------------------------------------------------------------
    // FAVORIS
    // ----------------------------------------------------------------
    Route::prefix('favorites')->group(function () {
        Route::get('/', [FavoriteController::class, 'index'])
            ->name('favorites.index');
        
        Route::post('/{property}', [FavoriteController::class, 'add'])
            ->name('favorites.add');
        
        Route::delete('/{property}', [FavoriteController::class, 'remove'])
            ->name('favorites.remove');
        
        Route::get('/check/{property}', [FavoriteController::class, 'check'])
            ->name('favorites.check');
    });

    // ----------------------------------------------------------------
    // MESSAGES (Utilisateurs authentifiés)
    // ----------------------------------------------------------------
    Route::prefix('messages')->group(function () {
        Route::get('/', [MessageController::class, 'index'])
            ->name('messages.index');
        
        Route::get('/{message}', [MessageController::class, 'show'])
            ->name('messages.show');
        
        Route::post('/', [MessageController::class, 'send'])
            ->name('messages.send');
        
        Route::patch('/{message}/read', [MessageController::class, 'markAsRead'])
            ->name('messages.mark-read');
        
        Route::delete('/{message}', [MessageController::class, 'destroy'])
            ->name('messages.destroy');
        
        // Conversations
        Route::get('/conversations', [MessageController::class, 'conversations'])
            ->name('messages.conversations');
        
        Route::get('/conversations/{userId}', [MessageController::class, 'conversation'])
            ->name('messages.conversation');
    });

    // ----------------------------------------------------------------
    // LOCALISATIONS (Gestion - Admin seulement)
    // ----------------------------------------------------------------
    Route::prefix('admin/locations')->middleware(['role:admin'])->group(function () {
        Route::post('/', [LocationController::class, 'store'])
            ->name('admin.locations.store');
        
        Route::put('/{location}', [LocationController::class, 'update'])
            ->name('admin.locations.update');
        
        Route::delete('/{location}', [LocationController::class, 'destroy'])
            ->name('admin.locations.destroy');
    });

    // ----------------------------------------------------------------
    // UTILISATEURS (Admin seulement)
    // ----------------------------------------------------------------
    Route::prefix('admin/users')->middleware(['role:admin'])->group(function () {
        Route::get('/', [UserController::class, 'index'])
            ->name('admin.users.index');
        
        Route::get('/{user}', [UserController::class, 'show'])
            ->name('admin.users.show');
        
        Route::patch('/{user}/role', [UserController::class, 'updateRole'])
            ->name('admin.users.update-role');
        
        Route::patch('/{user}/block', [UserController::class, 'block'])
            ->name('admin.users.block');
        
        Route::patch('/{user}/unblock', [UserController::class, 'unblock'])
            ->name('admin.users.unblock');
        
        Route::delete('/{user}', [UserController::class, 'destroy'])
            ->name('admin.users.destroy');
    });

    // ----------------------------------------------------------------
    // CONTRATS
    // ----------------------------------------------------------------
    Route::prefix('contracts')->group(function () {
        Route::get('/', [ContractController::class, 'index'])
            ->name('contracts.index');
        
        Route::get('/{contract}', [ContractController::class, 'show'])
            ->name('contracts.show');
        
        Route::post('/properties/{property}/location', [ContractController::class, 'generateLocation'])
            ->name('contracts.generate-location');
        
        Route::post('/properties/{property}/sale', [ContractController::class, 'generateSale'])
            ->name('contracts.generate-sale');
        
        Route::post('/{contract}/send', [ContractController::class, 'send'])
            ->name('contracts.send');
        
        Route::post('/{contract}/amendments', [ContractController::class, 'proposeAmendment'])
            ->name('contracts.propose-amendment');
        
        Route::patch('/{contract}/amendments/{amendment}', [ContractController::class, 'respondToAmendment'])
            ->name('contracts.respond-amendment');
        
        Route::post('/{contract}/retract', [ContractController::class, 'retract'])
            ->name('contracts.retract');
    });

    // ----------------------------------------------------------------
    // SIGNATURES ÉLECTRONIQUES
    // ----------------------------------------------------------------
    Route::prefix('signatures')->group(function () {
        Route::post('/contracts/{contract}/request-otp', [SignatureController::class, 'requestOTP'])
            ->name('signatures.request-otp');
        
        Route::post('/contracts/{contract}/sign/{signature}', [SignatureController::class, 'sign'])
            ->name('signatures.sign');
        
        Route::get('/contracts/{contract}/status', [SignatureController::class, 'status'])
            ->name('signatures.status');
    });

    // ----------------------------------------------------------------
    // TRANSACTIONS & PAIEMENTS
    // ----------------------------------------------------------------
    Route::prefix('transactions')->group(function () {
        Route::get('/', [TransactionController::class, 'index'])
            ->name('transactions.index');
        
        Route::get('/pending', [TransactionController::class, 'pending'])
            ->name('transactions.pending');
        
        Route::get('/{transaction}', [TransactionController::class, 'show'])
            ->name('transactions.show');
        
        Route::post('/{transaction}/pay', [TransactionController::class, 'pay'])
            ->name('transactions.pay');
    });

    // ----------------------------------------------------------------
    // MÉDIATION & LITIGES
    // ----------------------------------------------------------------
    Route::prefix('mediation')->group(function () {
        Route::get('/disputes', [MediationController::class, 'disputes'])
            ->name('mediation.disputes');
        
        Route::get('/disputes/{dispute}', [MediationController::class, 'showDispute'])
            ->name('mediation.show-dispute');
        
        Route::post('/contracts/{contract}/dispute', [MediationController::class, 'createDispute'])
            ->name('mediation.create-dispute');
    });

    // ----------------------------------------------------------------
    // VÉRIFICATION DOCUMENTS
    // ----------------------------------------------------------------
    Route::prefix('verifications')->group(function () {
        Route::get('/properties/{property}', [DocumentVerificationController::class, 'index'])
            ->name('verifications.index');
        
        Route::post('/properties/{property}/upload', [DocumentVerificationController::class, 'upload'])
            ->name('verifications.upload');
        
        Route::get('/{verification}', [DocumentVerificationController::class, 'show'])
            ->name('verifications.show');
    });

    // ----------------------------------------------------------------
    // STATISTIQUES (Admin seulement)
    // ----------------------------------------------------------------
    Route::prefix('admin/stats')->middleware(['role:admin'])->group(function () {
        Route::get('/dashboard', [PropertyController::class, 'dashboardStats'])
            ->name('admin.stats.dashboard');
        
        Route::get('/properties', [PropertyController::class, 'propertyStats'])
            ->name('admin.stats.properties');
        
        Route::get('/users', [UserController::class, 'userStats'])
            ->name('admin.stats.users');
    });
});

// ====================================================================
// ROUTE DE SANTÉ (Health Check)
// ====================================================================

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'Immo Guinée API',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
})->name('health');