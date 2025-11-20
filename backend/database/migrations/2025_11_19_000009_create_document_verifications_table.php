<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Propriétaire
            $table->enum('document_type', ['title_deed', 'identity', 'ownership_proof', 'other']);
            $table->string('document_path');
            $table->string('document_number')->nullable(); // Numéro titre foncier, CIN, etc.
            $table->enum('status', ['pending', 'under_review', 'verified', 'rejected', 'expired'])->default('pending');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('notes')->nullable();
            $table->json('verification_data')->nullable(); // Données vérification CEPAF, etc.
            $table->timestamps();
            
            $table->index(['property_id', 'status']);
            $table->index('document_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_verifications');
    }
};

