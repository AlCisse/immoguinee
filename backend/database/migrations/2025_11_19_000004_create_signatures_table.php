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
        Schema::create('signatures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('signature_type', ['landlord', 'tenant', 'seller', 'buyer']);
            $table->string('otp_code', 6)->nullable(); // Code OTP envoyé
            $table->timestamp('otp_sent_at')->nullable();
            $table->timestamp('otp_expires_at')->nullable();
            $table->boolean('otp_verified')->default(false);
            $table->timestamp('signed_at')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('hash')->nullable(); // Hash blockchain pour preuve
            $table->text('signature_data')->nullable(); // Données signature (image, etc.)
            $table->enum('status', ['pending', 'otp_sent', 'signed', 'expired'])->default('pending');
            $table->timestamps();
            
            $table->index(['contract_id', 'user_id']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signatures');
    }
};

