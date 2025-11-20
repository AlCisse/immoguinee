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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['commission_location', 'commission_sale_land', 'commission_sale_property']);
            $table->enum('party_type', ['landlord', 'tenant', 'seller', 'buyer']);
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['pending', 'due', 'paid', 'overdue', 'cancelled'])->default('pending');
            $table->date('due_date')->nullable(); // Date échéance (7 jours après signature)
            $table->timestamp('paid_at')->nullable();
            $table->string('payment_method')->nullable(); // orange_money, mtn_money, bank_transfer, cash
            $table->string('payment_reference')->nullable(); // Référence Mobile Money
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['contract_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

