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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('landlord_id')->constrained('users')->onDelete('cascade'); // Propriétaire
            $table->foreignId('tenant_id')->nullable()->constrained('users')->onDelete('set null'); // Locataire (pour location)
            $table->foreignId('buyer_id')->nullable()->constrained('users')->onDelete('set null'); // Acheteur (pour vente)
            $table->enum('type', ['location', 'sale_land', 'sale_property'])->default('location');
            $table->enum('status', ['draft', 'sent', 'under_review', 'amended', 'signed', 'cancelled', 'retracted'])->default('draft');
            $table->json('template_data'); // Données du contrat (parties, bien, conditions, etc.)
            $table->string('pdf_path')->nullable(); // Chemin vers PDF généré
            $table->string('signed_pdf_path')->nullable(); // PDF final signé
            $table->timestamp('sent_at')->nullable(); // Date envoi au locataire/acheteur
            $table->timestamp('signed_at')->nullable(); // Date signature complète (2 parties)
            $table->timestamp('retraction_deadline')->nullable(); // Délai rétractation (48h après signature)
            $table->boolean('retraction_used')->default(false); // Rétractation utilisée
            $table->integer('version')->default(1); // Version actuelle
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['property_id', 'status']);
            $table->index(['landlord_id', 'status']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};

