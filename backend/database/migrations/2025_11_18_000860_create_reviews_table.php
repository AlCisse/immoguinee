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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Auteur de l'avis
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('reviewed_user_id')->nullable()->constrained('users')->onDelete('cascade'); // Utilisateur évalué (agent)
            $table->integer('rating')->unsigned(); // 1-5
            $table->text('comment')->nullable();
            $table->enum('type', ['property', 'user'])->default('property');
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
            
            $table->index(['property_id', 'type']);
            $table->index(['reviewed_user_id', 'type']);
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

