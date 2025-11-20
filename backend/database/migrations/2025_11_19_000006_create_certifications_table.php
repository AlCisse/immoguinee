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
        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('level', ['bronze', 'silver', 'gold', 'diamond'])->default('bronze');
            $table->integer('points')->default(0);
            $table->integer('transactions_count')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->boolean('phone_verified')->default(false);
            $table->boolean('email_verified')->default(false);
            $table->boolean('identity_verified')->default(false);
            $table->boolean('title_verified')->default(false);
            $table->integer('response_time_minutes')->nullable(); // Temps moyen réponse
            $table->integer('disputes_count')->default(0);
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            $table->unique('user_id');
            $table->index('level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certifications');
    }
};

